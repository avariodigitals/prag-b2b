import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchDynamicRedirects, LEGACY_REDIRECTS, RETIRED_URLS, type RedirectEntry } from './lib/redirects';
import { APPROVED_CATEGORIES, preferredProductCategory } from './lib/seoTaxonomy';

// --- Compiled redirect matchers (built once, not per request) ---
interface CompiledRedirect {
  entry: RedirectEntry;
  regex: RegExp;
  params: string[];
}

// Split a redirect list into a Map for exact-match sources (O(1) lookup —
// the common case) and a small list of precompiled RegExps for sources that
// contain :param segments. Avoids compiling ~160 regexes on every request.
function splitRedirects(redirects: RedirectEntry[]) {
  const exact = new Map<string, RedirectEntry>();
  const patterns: CompiledRedirect[] = [];
  for (const entry of redirects) {
    const params = (entry.source.match(/:([^/]+)/g) ?? []).map((p) => p.slice(1));
    if (params.length === 0) {
      exact.set(entry.source, entry);
    } else {
      const pattern = entry.source.replace(/:([^/]+)/g, '([^/]+)');
      patterns.push({ entry, regex: new RegExp(`^${pattern}$`), params });
    }
  }
  return { exact, patterns };
}

const LEGACY_COMPILED = splitRedirects(LEGACY_REDIRECTS);

function matchCompiled(pathname: string, compiled: CompiledRedirect): { destination: string; permanent: boolean; source: string } | null {
  const match = pathname.match(compiled.regex);
  if (!match) return null;
  let destination = compiled.entry.destination;
  compiled.params.forEach((param, index) => {
    destination = destination.replace(`:${param}`, match[index + 1]);
  });
  return { destination, permanent: Boolean(compiled.entry.permanent), source: compiled.entry.source };
}

// --- In-memory cache for dynamic redirects (avoids fetching on every request) ---
interface DynamicRedirectCache {
  exact: Map<string, RedirectEntry>;
  patterns: CompiledRedirect[];
}
let cachedDynamicRedirects: DynamicRedirectCache | null = null;
let dynamicRedirectsFetchPromise: Promise<DynamicRedirectCache> | null = null;
let dynamicRedirectsExpiry = 0;
const DYNAMIC_REDIRECTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

function refreshDynamicRedirects(): Promise<DynamicRedirectCache> {
  if (!dynamicRedirectsFetchPromise) {
    dynamicRedirectsFetchPromise = fetchDynamicRedirects()
      .then((redirects) => splitRedirects(redirects))
      .catch(() => splitRedirects([]))
      .finally(() => {
        dynamicRedirectsFetchPromise = null;
      });
    dynamicRedirectsFetchPromise.then((compiled) => {
      cachedDynamicRedirects = compiled;
      dynamicRedirectsExpiry = Date.now() + DYNAMIC_REDIRECTS_TTL_MS;
    });
  }
  return dynamicRedirectsFetchPromise;
}

function getDynamicRedirectsCached(): Promise<DynamicRedirectCache> {
  const now = Date.now();
  if (cachedDynamicRedirects && now < dynamicRedirectsExpiry) {
    return Promise.resolve(cachedDynamicRedirects);
  }
  // Stale-while-revalidate: serve the stale list and refresh in the
  // background so an expired cache never blocks a request on the network.
  if (cachedDynamicRedirects) {
    void refreshDynamicRedirects();
    return Promise.resolve(cachedDynamicRedirects);
  }
  return refreshDynamicRedirects();
}

// --- In-memory cache for /shop/ product lookups ---
interface ShopProductLookup {
  categorySlug: string;
  productSlug: string;
}
const shopProductCache = new Map<string, ShopProductLookup | null>();
const SHOP_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const shopProductCacheExpiry = new Map<string, number>();

/**
 * Resolve a /shop/ product slug against live WooCommerce data.
 * Uses preferredProductCategory() to determine the canonical Step 5 category,
 * NOT the first WC category (which may be non-canonical or excluded).
 *
 * Returns null if the product cannot be confidently resolved (not found,
 * no approved categories, or WC API failure). In that case the caller should
 * NOT redirect — the URL will 404 naturally for later review.
 */
async function lookupShopProduct(productSlug: string): Promise<ShopProductLookup | null> {
  const now = Date.now();
  const cachedExpiry = shopProductCacheExpiry.get(productSlug);
  if (cachedExpiry !== undefined && now < cachedExpiry) {
    return shopProductCache.get(productSlug) ?? null;
  }

  try {
    const wpApi = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
    const auth = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

    const productRes = await fetch(`${wpApi}/wc/v3/products?slug=${productSlug}&status=publish&${auth}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (productRes.ok) {
      const products = await productRes.json();
      if (Array.isArray(products) && products.length > 0) {
        const product = products[0];
        const categories = product.categories;
        if (categories && categories.length > 0) {
          // Use preferredProductCategory for canonical Step 5 category
          const categorySlug = preferredProductCategory(categories, productSlug);
          // If preferredProductCategory returned 'products' (no approved category),
          // do not redirect — the product is excluded from the SEO catalogue.
          if (categorySlug === 'products') {
            shopProductCache.set(productSlug, null);
            shopProductCacheExpiry.set(productSlug, now + 60 * 1000);
            return null;
          }
          const result = { categorySlug, productSlug };
          shopProductCache.set(productSlug, result);
          shopProductCacheExpiry.set(productSlug, now + SHOP_CACHE_TTL_MS);
          return result;
        }
      }
    }
  } catch (error) {
    console.error('Failed to lookup product for shop redirect:', error);
  }

  // Cache negative results too (shorter TTL)
  shopProductCache.set(productSlug, null);
  shopProductCacheExpiry.set(productSlug, now + 60 * 1000); // 1 min for misses
  return null;
}

/**
 * Build a clean redirect URL. Uses a standard URL object to avoid NextURL's
 * internal trailing-slash preservation, which can cause redirect loops.
 */
function redirectResponse(destination: string, origin: string, search: string, status: 301 | 302 | 308): NextResponse {
  const target = destination.startsWith('http')
    ? new URL(destination)
    : new URL(`${destination}${search || ''}`, origin);
  return NextResponse.redirect(target, status);
}

export async function middleware(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const search = req.nextUrl.search;
  // Normalize trailing slashes for legacy URL matching.
  // Legacy WordPress URLs commonly end with "/" but our Next.js routes don't.
  // We strip the trailing slash here so redirect source patterns (which are
  // stored without trailing slashes) match correctly.
  const rawPathname = req.nextUrl.pathname;
  const pathname = rawPathname.length > 1 && rawPathname.endsWith('/')
    ? rawPathname.slice(0, -1)
    : rawPathname;

  // Skip if it's an API route, static file, or Next.js internal route
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ─── 410 Gone for intentionally retired legacy URLs ──────────────────────
  // These URLs have no modern equivalent and should not be redirected to
  // unrelated pages. A 410 Gone signals intentional retirement to search engines.
  if (RETIRED_URLS.has(pathname)) {
    return new NextResponse('Gone', {
      status: 410,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // ─── LEGACY_REDIRECTS (specific entries take priority over everything) ────
  // Check the curated Step 6 manifest BEFORE catch-all logic, /shop/ product
  // lookup, and dynamic admin redirects. This ensures:
  //   - Specific /shop/{slug} entries override the generic WC product lookup.
  //   - Curated redirects override conflicting admin-created dynamic redirects.
  try {
    const exactHit = LEGACY_COMPILED.exact.get(pathname);
    if (exactHit) {
      trackRedirectHit(exactHit.source, req.headers.get('host'), origin);
      return redirectResponse(exactHit.destination, origin, search, exactHit.permanent ? 301 : 302);
    }
    for (const compiled of LEGACY_COMPILED.patterns) {
      const hit = matchCompiled(pathname, compiled);
      if (hit) {
        trackRedirectHit(hit.source, req.headers.get('host'), origin);
        return redirectResponse(hit.destination, origin, search, hit.permanent ? 301 : 302);
      }
    }
  } catch (error) {
    console.error('Middleware legacy redirect error:', error);
  }

  // ─── /product-category/ catch-all (approved taxonomy only) ────────────────
  // Only redirect when the category slug is in the Step 5 approved SEO taxonomy.
  // Unknown/excluded categories are NOT redirected — they 404 for later review.
  if (pathname.startsWith('/product-category/')) {
    const segments = pathname.replace('/product-category/', '').split('/');
    const category = segments[0];
    const subcategory = segments[1];

    if (subcategory) {
      // /product-category/:category/:subcategory
      // If :subcategory is an approved SEO category, redirect to /products/:subcategory
      // (preserves the most specific legitimate destination).
      // Otherwise, if :category is approved, redirect to /products/:category.
      // Otherwise, do not redirect.
      if (APPROVED_CATEGORIES.has(subcategory)) {
        trackRedirectHit('/product-category/:category/:subcategory', req.headers.get('host'), origin);
        return redirectResponse(`/products/${subcategory}`, origin, search, 301);
      }
      if (APPROVED_CATEGORIES.has(category)) {
        trackRedirectHit('/product-category/:category/:subcategory', req.headers.get('host'), origin);
        return redirectResponse(`/products/${category}`, origin, search, 301);
      }
      // Neither category nor subcategory is approved — do not redirect.
      // Fall through to trailing-slash handling / 404.
    } else if (category) {
      // /product-category/:category
      // Only redirect if :category is in the approved SEO taxonomy.
      if (APPROVED_CATEGORIES.has(category)) {
        trackRedirectHit('/product-category/:category', req.headers.get('host'), origin);
        return redirectResponse(`/products/${category}`, origin, search, 301);
      }
      // Category not approved — do not redirect. Fall through to 404.
    }
    // Fall through: /product-category/ with no segments, or unapproved categories
  }

  // ─── /shop/ product lookup (WC API, preferredProductCategory) ─────────────
  // Handles BOTH /shop/:product and /shop/:category/:product.
  // The old :category segment is NOT trusted as the canonical category.
  // The product slug is resolved against live WooCommerce data, and
  // preferredProductCategory() determines the canonical Step 5 category.
  // If the product cannot be confidently resolved, do not redirect — 404.
  if (pathname.startsWith('/shop/')) {
    const afterShop = pathname.replace('/shop/', '');
    if (afterShop) {
      // For /shop/:category/:product, extract the product slug (last segment).
      // For /shop/:product, the entire string is the product slug.
      const segments = afterShop.split('/');
      const productSlug = segments[segments.length - 1];

      if (productSlug) {
        const lookup = await lookupShopProduct(productSlug);
        if (lookup) {
          const destination = `/products/${lookup.categorySlug}/${lookup.productSlug}`;
          trackRedirectHit('/shop/:product', req.headers.get('host'), origin);
          return redirectResponse(destination, origin, search, 301);
        }
      }
    }
    // Product not found or not in approved categories — do not redirect. 404.
  }

  // ─── Dynamic admin redirects (lowest priority) ────────────────────────────
  try {
    const dynamicRedirects = await getDynamicRedirectsCached();

    const exactHit = dynamicRedirects.exact.get(pathname);
    if (exactHit) {
      trackRedirectHit(exactHit.source, req.headers.get('host'), origin);
      return redirectResponse(exactHit.destination, origin, search, exactHit.permanent ? 301 : 302);
    }
    for (const compiled of dynamicRedirects.patterns) {
      const hit = matchCompiled(pathname, compiled);
      if (hit) {
        trackRedirectHit(hit.source, req.headers.get('host'), origin);
        return redirectResponse(hit.destination, origin, search, hit.permanent ? 301 : 302);
      }
    }
  } catch (error) {
    console.error('Middleware dynamic redirect error:', error);
  }

  // ─── Trailing-slash normalisation fallback ────────────────────────────────
  // Since skipTrailingSlashRedirect is enabled in next.config.ts, we handle
  // trailing-slash normalisation here. If the original URL had a trailing slash
  // and no redirect/410 matched, redirect to the non-trailing-slash version.
  // This ensures legacy URLs redirect in one hop while preserving Next.js's
  // default trailing-slash behaviour for all other routes.
  if (rawPathname !== pathname) {
    return redirectResponse(pathname, origin, search, 308);
  }

  return NextResponse.next();
}

// Fire-and-forget redirect hit tracker (uses absolute URL — required in middleware)
function trackRedirectHit(source: string, host: string | null, origin: string) {
  const targetUrl = `${origin}/api/admin/redirect-hit`;
  fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, host: host ?? '' }),
  }).catch(() => {});
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};

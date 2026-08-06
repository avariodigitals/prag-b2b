import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchDynamicRedirects, LEGACY_REDIRECTS, type RedirectEntry } from './lib/redirects';

// --- In-memory cache for dynamic redirects (avoids fetching on every request) ---
let cachedDynamicRedirects: RedirectEntry[] | null = null;
let dynamicRedirectsFetchPromise: Promise<RedirectEntry[]> | null = null;
let dynamicRedirectsExpiry = 0;
const DYNAMIC_REDIRECTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getDynamicRedirectsCached(): Promise<RedirectEntry[]> {
  const now = Date.now();
  if (cachedDynamicRedirects && now < dynamicRedirectsExpiry) {
    return Promise.resolve(cachedDynamicRedirects);
  }
  // Deduplicate concurrent fetches
  if (!dynamicRedirectsFetchPromise) {
    dynamicRedirectsFetchPromise = fetchDynamicRedirects()
      .catch(() => [] as RedirectEntry[])
      .finally(() => {
        dynamicRedirectsFetchPromise = null;
      });
    dynamicRedirectsFetchPromise.then((redirects) => {
      cachedDynamicRedirects = redirects;
      dynamicRedirectsExpiry = Date.now() + DYNAMIC_REDIRECTS_TTL_MS;
    });
  }
  return dynamicRedirectsFetchPromise;
}

// --- In-memory cache for /shop/ product lookups ---
interface ShopProductLookup {
  categorySlug: string;
  productSlug: string;
}
const shopProductCache = new Map<string, ShopProductLookup | null>();
const SHOP_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const shopProductCacheExpiry = new Map<string, number>();

async function lookupShopProduct(productSlug: string): Promise<ShopProductLookup | null> {
  const now = Date.now();
  const cachedExpiry = shopProductCacheExpiry.get(productSlug);
  if (cachedExpiry !== undefined && now < cachedExpiry) {
    return shopProductCache.get(productSlug) ?? null;
  }

  try {
    const wpApi = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
    const auth = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

    const productRes = await fetch(`${wpApi}/wc/v3/products?slug=${productSlug}&${auth}`, {
      next: { revalidate: 300 },
    });

    if (productRes.ok) {
      const products = await productRes.json();
      if (Array.isArray(products) && products.length > 0) {
        const product = products[0];
        const category = product.categories?.[0];
        if (category) {
          const result = { categorySlug: category.slug, productSlug };
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

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Skip if it's an API route, static file, or Next.js internal route
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle /shop/ redirects - need to look up product category
  if (pathname.startsWith('/shop/')) {
    const productSlug = pathname.replace('/shop/', '');
    if (productSlug) {
      const lookup = await lookupShopProduct(productSlug);
      if (lookup) {
        const destination = `/products/${lookup.categorySlug}/${lookup.productSlug}`;
        trackRedirectHit('/shop/:product', req.headers.get('host'), req.nextUrl.origin);
        url.pathname = destination;
        return NextResponse.redirect(url, 301);
      }
    }
  }

  try {
    // Check legacy redirects first (these are also in next.config.ts but
    // we handle them here to track hits accurately)
    for (const redirect of LEGACY_REDIRECTS) {
      const sourcePattern = redirect.source.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${sourcePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'), req.nextUrl.origin);

        // Replace parameters in destination
        let destination = redirect.destination;
        const paramNames = (redirect.source.match(/:([^/]+)/g) || []).map((p) => p.slice(1));
        paramNames.forEach((param, index) => {
          destination = destination.replace(`:${param}`, match[index + 1]);
        });

        url.pathname = destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }
    }

    const dynamicRedirects = await getDynamicRedirectsCached();

    for (const redirect of dynamicRedirects) {
      // Handle exact match
      if (redirect.source === pathname) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'), req.nextUrl.origin);

        url.pathname = redirect.destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }

      // Handle pattern matching (simple :param support)
      const sourcePattern = redirect.source.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${sourcePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'), req.nextUrl.origin);

        // Replace parameters in destination
        let destination = redirect.destination;
        const paramNames = (redirect.source.match(/:([^/]+)/g) || []).map((p) => p.slice(1));
        paramNames.forEach((param, index) => {
          destination = destination.replace(`:${param}`, match[index + 1]);
        });

        url.pathname = destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }
    }
  } catch (error) {
    console.error('Middleware redirect error:', error);
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

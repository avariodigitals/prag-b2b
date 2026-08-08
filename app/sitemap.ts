import type { MetadataRoute } from 'next';
import {
  APPROVED_CATEGORIES,
  HIDDEN_KNOWLEDGE_SLUGS,
  preferredProductCategory,
  hasApprovedCategory,
} from '@/lib/seoTaxonomy';

type WcProductLite = {
  slug: string;
  categories?: Array<{ slug?: string }>;
  date_modified?: string;
};

type WpPostLite = {
  slug: string;
  modified?: string;
};

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY ?? ''}&consumer_secret=${process.env.WC_CONSUMER_SECRET ?? ''}`;
}

async function fetchJson(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: ['b2b-sitemap'] },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function fetchAllProductsForSitemap(): Promise<WcProductLite[]> {
  const base = `${WP_API_URL.replace('/wp-json', '/wp-json/wc/v3')}/products`;
  const first = await fetchJson(`${base}?per_page=100&page=1&status=publish&_fields=slug,categories,date_modified&${authQuery()}`);
  if (!first?.ok) return [];

  const firstData = (await first.json()) as WcProductLite[];
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');

  if (totalPages <= 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((page) =>
      fetchJson(`${base}?per_page=100&page=${page}&status=publish&_fields=slug,categories,date_modified&${authQuery()}`)
    )
  );

  const restData = await Promise.all(
    rest.map(async (res) => (res?.ok ? ((await res.json()) as WcProductLite[]) : []))
  );

  return [...firstData, ...restData.flat()];
}

async function fetchAllKnowledgePostsForSitemap(): Promise<WpPostLite[]> {
  const base = `${WP_API_URL.replace('/wp-json', '/wp-json/wp/v2')}/posts`;
  const first = await fetchJson(`${base}?per_page=100&page=1&status=publish&_fields=slug,modified`);
  if (!first?.ok) return [];

  const firstData = (await first.json()) as WpPostLite[];
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');

  if (totalPages <= 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((page) =>
      fetchJson(`${base}?per_page=100&page=${page}&status=publish&_fields=slug,modified`)
    )
  );

  const restData = await Promise.all(
    rest.map(async (res) => (res?.ok ? ((await res.json()) as WpPostLite[]) : []))
  );

  return [...firstData, ...restData.flat()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    fetchAllProductsForSitemap(),
    fetchAllKnowledgePostsForSitemap(),
  ]);

  // ─── Approved static pages ───────────────────────────────────────────────
  // Only HTTP 200, indexable, canonical public URLs.
  // No priority or changefreq — lastModified only where meaningful.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_BASE}/` },
    { url: `${SITE_BASE}/products` },
    { url: `${SITE_BASE}/solutions` },
    { url: `${SITE_BASE}/solutions/residential` },
    { url: `${SITE_BASE}/solutions/commercial` },
    { url: `${SITE_BASE}/solutions/industrial` },
    { url: `${SITE_BASE}/solutions/backup-power` },
    { url: `${SITE_BASE}/solutions/solar-energy` },
    { url: `${SITE_BASE}/solutions/voltage-stabilization-protection` },
    { url: `${SITE_BASE}/about` },
    { url: `${SITE_BASE}/contact` },
    { url: `${SITE_BASE}/careers` },
    { url: `${SITE_BASE}/distributor` },
    { url: `${SITE_BASE}/find-a-distributor` },
    { url: `${SITE_BASE}/knowledge-center` },
    { url: `${SITE_BASE}/resources` },
    { url: `${SITE_BASE}/technical-support` },
    { url: `${SITE_BASE}/power-calculator` },
    { url: `${SITE_BASE}/free-power-assessment` },
    { url: `${SITE_BASE}/installations` },
    { url: `${SITE_BASE}/faq` },
    { url: `${SITE_BASE}/warranty` },
    { url: `${SITE_BASE}/shipping-policy` },
    { url: `${SITE_BASE}/return-policy` },
    { url: `${SITE_BASE}/privacy` },
    { url: `${SITE_BASE}/terms-of-use` },
  ];

  // ─── Approved product-category pages ─────────────────────────────────────
  // Only the SEO-approved category allowlist. Excluded categories, redirected
  // categories, and hidden categories are omitted.
  const categoryRoutes: MetadataRoute.Sitemap = Array.from(APPROVED_CATEGORIES).map((slug) => ({
    url: `${SITE_BASE}/products/${slug}`,
  }));

  // ─── Approved/indexable product pages ────────────────────────────────────
  // Only products that belong to at least one approved category.
  // Uses the deterministic preferred canonical category path.
  // Deduplicates by preferred path so alternate category paths don't create
  // duplicate sitemap entries.
  const seenProductPaths = new Set<string>();
  const productRoutes: MetadataRoute.Sitemap = [];

  for (const p of products) {
    if (!p.slug) continue;
    if (!hasApprovedCategory(p.categories as Array<{ slug: string }> | undefined)) continue;

    const categorySlug = preferredProductCategory(p.categories as Array<{ slug: string }> | undefined, p.slug);
    if (categorySlug === 'products') continue;

    const productPath = `/products/${categorySlug}/${p.slug}`;
    if (seenProductPaths.has(productPath)) continue;
    seenProductPaths.add(productPath);

    productRoutes.push({
      url: `${SITE_BASE}${productPath}`,
      lastModified: p.date_modified ? new Date(p.date_modified) : undefined,
    });
  }

  // ─── Legitimate Knowledge Center articles ────────────────────────────────
  // Excludes obsolete (404) and redirected (308) entries — e.g. 55977-2
  // "Our Past Projects" → /installations — so the old URL never appears in
  // the sitemap.
  const knowledgeRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => Boolean(p.slug) && !HIDDEN_KNOWLEDGE_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${SITE_BASE}/knowledge-center/${p.slug}`,
      lastModified: p.modified ? new Date(p.modified) : undefined,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...knowledgeRoutes];
}

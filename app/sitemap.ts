import type { MetadataRoute } from 'next';

type WcProductLite = {
  slug: string;
  categories?: Array<{ slug?: string }>;
  date_modified?: string;
};

type WcCategoryLite = {
  slug: string;
  count?: number;
  date_modified?: string;
};

type WpPostLite = {
  slug: string;
  modified?: string;
};

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://prag.global';

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

async function fetchAllCategoriesForSitemap(): Promise<WcCategoryLite[]> {
  const url = `${WP_API_URL.replace('/wp-json', '/wp-json/wc/v3')}/products/categories?per_page=100&hide_empty=true&_fields=slug,count,date_modified&${authQuery()}`;
  const res = await fetchJson(url);
  if (!res?.ok) return [];
  return (await res.json()) as WcCategoryLite[];
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

async function fetchHiddenCategorySlugs(): Promise<Set<string>> {
  try {
    const res = await fetchJson(`${WP_API_URL}/prag-core/v1/settings`);
    if (!res?.ok) return new Set();
    const data = await res.json();
    return new Set(Array.isArray(data.hidden_categories) ? data.hidden_categories : []);
  } catch {
    return new Set();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts, hiddenSlugs] = await Promise.all([
    fetchAllProductsForSitemap(),
    fetchAllCategoriesForSitemap(),
    fetchAllKnowledgePostsForSitemap(),
    fetchHiddenCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_BASE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_BASE}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_BASE}/solutions`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_BASE}/solutions/residential`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/solutions/commercial`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/solutions/industrial`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/solutions/backup-power`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/solutions/solar-energy`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/solutions/voltage-stabilization-protection`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_BASE}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_BASE}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_BASE}/careers`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_BASE}/distributor`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_BASE}/find-a-distributor`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_BASE}/knowledge-center`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_BASE}/resources`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_BASE}/technical-support`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/power-calculator`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/free-power-assessment`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/installations`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/faq`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_BASE}/warranty`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_BASE}/shipping-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_BASE}/return-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_BASE}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_BASE}/terms-of-use`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => Boolean(c.slug) && !hiddenSlugs.has(c.slug))
    .map((c) => ({
      url: `${SITE_BASE}/products/${c.slug}`,
      lastModified: c.date_modified ? new Date(c.date_modified) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => Boolean(p.slug) && !(p.categories?.[0]?.slug && hiddenSlugs.has(p.categories[0].slug)))
    .map((p) => {
      const categorySlug = p.categories?.[0]?.slug;
      const productPath = categorySlug
        ? `/products/${categorySlug}/${p.slug}`
        : `/products/${p.slug}`;
      return {
        url: `${SITE_BASE}${productPath}`,
        lastModified: p.date_modified ? new Date(p.date_modified) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    });

  const knowledgeRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: `${SITE_BASE}/knowledge-center/${p.slug}`,
      lastModified: p.modified ? new Date(p.modified) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...knowledgeRoutes];
}

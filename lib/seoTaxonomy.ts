/**
 * Central SEO product taxonomy for www.prag.global.
 *
 * This is the single source of truth for which WooCommerce product categories
 * are exposed as SEO landing pages on the public Next.js site.
 *
 * WordPress / WooCommerce remains the backend product database. This config
 * only controls what the Next.js frontend exposes, indexes, links to, and
 * places in its sitemap. No WooCommerce categories or products are deleted.
 */

// ─── Approved SEO product-category allowlist ────────────────────────────────
// These are the only product-category slugs that may be indexed, appear in the
// sitemap, appear in navigation, or be used as canonical product URL segments.

export const APPROVED_PARENT_CATEGORIES = [
  'inverters',
  'voltage-stabilizers',
  'batteries',
  'solar',
] as const;

export const APPROVED_SUBCATEGORIES = [
  'hybrid-inverters',
  'heavy-duty-inverters',
  'relay-voltage-stabilizers',
  'servo-voltage-stabilizers',
  'thyristor-stabilizers',
  'advanced-stabilizers',
  'lithium-batteries',
  'solar-panels',
  'solar-charge-controllers',
  'protective-device',
] as const;

export const APPROVED_CATEGORIES: ReadonlySet<string> = new Set([
  ...APPROVED_PARENT_CATEGORIES,
  ...APPROVED_SUBCATEGORIES,
]);

// ─── Excluded categories (noindex, follow; removed from sitemap/nav) ────────
// These must never be treated as SEO landing pages. The underlying WooCommerce
// categories and products are NOT deleted — they are simply hidden from the
// public SEO frontend.

export const EXCLUDED_CATEGORIES: ReadonlySet<string> = new Set([
  'health-fitness',
  'personal-electronics',
  'travel',
  'sales',
]);

// ─── Redirected categories ──────────────────────────────────────────────────
// /products/all-prag-stabilizers → /products/voltage-stabilizers (308)
export const REDIRECTED_CATEGORIES: Record<string, string> = {
  'all-prag-stabilizers': 'voltage-stabilizers',
};

// ─── Categories that must never be selected as a product's canonical category ─
export const NON_CANONICAL_CATEGORIES: ReadonlySet<string> = new Set([
  'sales',
  'travel',
  'health-fitness',
  'personal-electronics',
  'all-prag-stabilizers',
  'more-products',
  'uncategorized',
  'accessories',
  'lithium-ion',
  'pure-sine-wave-inverters',
  'all-batteries',
  'gel-inverter-battery',
  'opzv-batteries',
  'agm-gel-inverter-battery',
  'solar-batteries',
  'eco-series-inverter',
  'tbb',
  'electrical-lights',
  'prag-promo-bundle',
  'prag-solar-complete-bundles',
  'all-bundle-package',
  'all-prag-bundle-inverter-battery-and-solar-inverter-new-version',
  'all-prag-bundle-inverter-and-battery-new-version',
  'bundle-package-prag',
  'prag-inverter-battery-installation',
  'battery-rack',
]);

// ─── Preferred subcategory priority for canonical product URLs ──────────────
// When a product belongs to multiple approved categories, the most specific
// legitimate subcategory is preferred over the broad parent.
//
// ORDER-INDEPENDENCE CONTRACT:
//   `preferredProductCategory()` MUST be deterministic and MUST NOT depend on
//   the order in which WooCommerce returns `product.categories`. Selection is
//   driven exclusively by the fixed arrays below (SUBCATEGORY_PRIORITY, then
//   PARENT_PRIORITY), never by the input array order. The WooCommerce API is
//   free to reorder `categories` without affecting the canonical result.
//
// SIBLING TIE-BREAK STRATEGY (explicit override):
//   When a product legitimately belongs to two equally specific approved
//   sibling subcategories, the FIRST slug in SUBCATEGORY_PRIORITY wins. This
//   is an intentional, documented business decision — not an accident of API
//   ordering. Known sibling pairs and their resolved preference:
//
//     • Hybrid Inverters  vs  Heavy-Duty Inverters   → hybrid-inverters wins
//     • Servo Stabilizers vs  Advanced Stabilizers   → servo-voltage-stabilizers wins
//     • Servo Stabilizers vs  Thyristor Stabilizers  → servo-voltage-stabilizers wins
//     • Thyristor         vs  Relay Stabilizers      → thyristor-stabilizers wins
//     • Thyristor         vs  Advanced Stabilizers   → thyristor-stabilizers wins
//     • Relay             vs  Advanced Stabilizers   → relay-voltage-stabilizers wins
//     • Solar Panels      vs  Solar Charge Controllers → solar-panels wins
//
//   If a sibling pair is found to be genuinely ambiguous in practice (i.e. the
//   product is mis-categorized by the rule above), add an explicit per-slug
//   override in SUBCATEGORY_OVERRIDES rather than reordering the array.
const SUBCATEGORY_PRIORITY: ReadonlyArray<string> = [
  // Inverters — prefer specific subcategory
  'hybrid-inverters',
  'heavy-duty-inverters',
  // Stabilizers — prefer specific subcategory
  'servo-voltage-stabilizers',
  'thyristor-stabilizers',
  'relay-voltage-stabilizers',
  'advanced-stabilizers',
  // Batteries — prefer lithium over broad parent
  'lithium-batteries',
  // Solar — prefer specific subcategory
  'solar-panels',
  'solar-charge-controllers',
  'protective-device',
];

const PARENT_PRIORITY: ReadonlyArray<string> = [
  'inverters',
  'voltage-stabilizers',
  'batteries',
  'solar',
];

// Per-slug overrides for products whose true canonical category is NOT the
// first match in SUBCATEGORY_PRIORITY. Key = product slug, value = the
// approved category slug that must win regardless of priority order. Use this
// only when the general priority rule picks the wrong sibling for a specific
// product. Empty by default — populate as ambiguity audit requires.
const SUBCATEGORY_OVERRIDES: Readonly<Record<string, string>> = {};

/**
 * Determine the preferred (canonical) product-category slug for a product.
 *
 * Selection order (fully deterministic, independent of WooCommerce array order):
 *  0. Explicit per-slug override (SUBCATEGORY_OVERRIDES) — highest authority.
 *  1. Most specific approved subcategory, by SUBCATEGORY_PRIORITY order.
 *  2. Approved parent category, by PARENT_PRIORITY order.
 *  3. Alphabetically-first approved slug (deterministic fallback; never uses
 *     the input array order).
 *
 * Non-canonical / excluded / redirected categories are never in APPROVED_CATEGORIES
 * so they can never be selected. If no approved category is found, returns
 * 'products' (the product is excluded from the SEO catalogue by the caller).
 */
export function preferredProductCategory(
  categories: Array<{ slug: string }> | undefined,
  productSlug?: string
): string {
  if (!categories || categories.length === 0) return 'products';

  // Approved category slugs only (order-independent from here on).
  const approvedSlugs = categories
    .map((c) => c.slug)
    .filter((slug) => APPROVED_CATEGORIES.has(slug));

  if (approvedSlugs.length === 0) return 'products';

  // 0. Explicit per-slug override wins over everything.
  if (productSlug && productSlug in SUBCATEGORY_OVERRIDES) {
    const override = SUBCATEGORY_OVERRIDES[productSlug];
    if (approvedSlugs.includes(override)) return override;
  }

  // 1. Most specific approved subcategory (by fixed priority order, NOT input order)
  for (const preferred of SUBCATEGORY_PRIORITY) {
    if (approvedSlugs.includes(preferred)) return preferred;
  }

  // 2. Approved parent category (by fixed priority order, NOT input order)
  for (const preferred of PARENT_PRIORITY) {
    if (approvedSlugs.includes(preferred)) return preferred;
  }

  // 3. Deterministic fallback: alphabetically-first approved slug.
  //    Never uses the WooCommerce array order.
  return [...approvedSlugs].sort()[0];
}

/**
 * Build the canonical www.prag.global product URL path for a product.
 * Returns a relative path like /products/hybrid-inverters/my-product-slug
 */
export function preferredProductPath(
  slug: string,
  categories: Array<{ slug: string }> | undefined
): string {
  const categorySlug = preferredProductCategory(categories, slug);
  return `/products/${categorySlug}/${slug}`;
}

/**
 * Build the absolute canonical www.prag.global product URL.
 */
export function preferredProductUrl(
  slug: string,
  categories: Array<{ slug: string }> | undefined,
  siteBase?: string
): string {
  const base = siteBase ?? process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
  return `${base}${preferredProductPath(slug, categories)}`;
}

/**
 * Check whether a product belongs to at least one approved SEO category.
 * Products that belong only to excluded / non-core categories are excluded
 * from the main SEO catalogue.
 */
export function hasApprovedCategory(
  categories: Array<{ slug: string }> | undefined
): boolean {
  if (!categories || categories.length === 0) return false;
  return categories.some((c) => APPROVED_CATEGORIES.has(c.slug));
}

/**
 * Check whether a category slug is an excluded (noindex) category.
 */
export function isExcludedCategory(slug: string): boolean {
  return EXCLUDED_CATEGORIES.has(slug);
}

/**
 * Check whether a category slug is a redirected category (e.g. all-prag-stabilizers).
 */
export function isRedirectedCategory(slug: string): boolean {
  return slug in REDIRECTED_CATEGORIES;
}

/**
 * Get the redirect destination for a redirected category, or null.
 */
export function getRedirectDestination(slug: string): string | null {
  return REDIRECTED_CATEGORIES[slug] ?? null;
}

/**
 * Check whether a category slug is an approved SEO category.
 */
export function isApprovedCategory(slug: string): boolean {
  return APPROVED_CATEGORIES.has(slug);
}

// ─── Top-level product-family navigation (for /products page) ───────────────
export const PRODUCT_FAMILY_TABS = [
  { label: 'All Power Products', slug: 'all' },
  { label: 'Inverters', slug: 'inverters' },
  { label: 'Voltage Stabilizers', slug: 'voltage-stabilizers' },
  { label: 'Batteries', slug: 'batteries' },
  { label: 'Solar', slug: 'solar' },
] as const;

// ─── Knowledge Center articles to permanently redirect ──────────────────────
// Obsolete articles that are superseded by a real page. The old URL issues a
// 308 permanent redirect to the destination and is never included in the
// sitemap. No noindex/notFound handling is required for these slugs because
// the route redirects before any content could be served.
export const REDIRECTED_KNOWLEDGE_SLUGS: Readonly<Record<string, string>> = {
  '55977-2': '/installations', // "Our Past Projects" → real installations showcase
};

// ─── Knowledge Center articles to exclude from sitemap/indexing ─────────────
// Obsolete articles that should not be indexed and have no redirect target.
// These return noindex,follow metadata and a 404 (notFound) in the page.
export const EXCLUDED_KNOWLEDGE_SLUGS: ReadonlySet<string> = new Set([]);

/**
 * Combined set of Knowledge Center slugs that must never appear in listings,
 * the sitemap, or be rendered as a normal article. This is the union of
 * excluded (404/noindex) and redirected (308) slugs — callers that filter
 * post lists (homepage section, /knowledge-center grid, sitemap) should use
 * this so redirected old URLs don't surface as clickable cards.
 */
export const HIDDEN_KNOWLEDGE_SLUGS: ReadonlySet<string> = new Set([
  ...EXCLUDED_KNOWLEDGE_SLUGS,
  ...Object.keys(REDIRECTED_KNOWLEDGE_SLUGS),
]);

/**
 * Central SEO metadata architecture for www.prag.global.
 *
 * Single source of truth for approved route SEO configuration, metadata
 * resolution, and structured-data builders. Consumed by Next.js
 * `generateMetadata` / `metadata` exports in each route.
 *
 * Resolution order (per page type):
 *   Static pages:        admin SEO override → approved route config → safe fallback
 *   Product categories:  admin SEO override → approved category config → category fallback
 *   Products:            admin SEO override → safe automatic fallback ({Name} | PRAG)
 *   Knowledge Center:    admin SEO override → Yoast meta (WP API) → article-title/content fallback
 *
 * `primaryKeyword` and `secondaryKeywords` are editorial/admin data only.
 * They are NEVER output as <meta name="keywords">.
 */

import type { Metadata } from 'next';

// ─── Brand constants ────────────────────────────────────────────────────────

export const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
export const BRAND_NAME = 'PRAG';
export const OG_SITE_NAME = 'PRAG';

/** Approved homepage positioning (NOT "Nigeria's #1" — that requires separate approval). */
export const HOMEPAGE_TITLE =
  'PRAG – Inverters, Stabilizers, Batteries & Solar Solutions in Nigeria';
export const HOMEPAGE_DESCRIPTION =
  'Discover PRAG inverters, voltage stabilizers, lithium batteries and solar solutions for homes, businesses and industries across Nigeria.';

// ─── SEO override shape (admin-editable) ────────────────────────────────────

export interface SeoOverride {
  seoTitle?: string;
  seoDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalOverride?: string;
  robotsIndex?: boolean;
  seoNotes?: string;
}

/** Map of route → SEO override, sourced from the admin B2B store. */
export type SeoOverrideMap = Record<string, SeoOverride>;

// ─── Approved route SEO configuration (26 priority pages) ───────────────────
// These are the approved Step 7 workbook values. They serve as the middle
// layer in the resolution order — used when no admin override exists.

export interface RouteSeoConfig {
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  pageType: string;
}

export const ROUTE_SEO_CONFIG: Record<string, RouteSeoConfig> = {
  '/': {
    seoTitle: HOMEPAGE_TITLE,
    seoDescription: HOMEPAGE_DESCRIPTION,
    primaryKeyword: 'PRAG Nigeria',
    secondaryKeywords: [
      'inverter',
      'voltage stabilizer',
      'battery',
      'solar',
      'power solutions Nigeria',
    ],
    pageType: 'homepage',
  },
  '/products': {
    seoTitle: 'Power Products – Inverters, Stabilizers, Batteries & Solar | PRAG',
    seoDescription:
      "Browse PRAG's full range of inverters, voltage stabilizers, batteries, solar panels and charge controllers — engineered for Nigerian power conditions.",
    primaryKeyword: 'PRAG products',
    secondaryKeywords: [
      'inverter',
      'voltage stabilizer',
      'battery',
      'solar panels',
      'solar charge controller',
    ],
    pageType: 'product-hub',
  },
  '/products/inverters': {
    seoTitle: 'Inverters in Nigeria – Hybrid, Heavy-Duty & Backup Inverters | PRAG',
    seoDescription:
      'Buy PRAG inverters in Nigeria — hybrid, heavy-duty and backup inverters that convert battery DC to stable AC for homes, businesses and industry.',
    primaryKeyword: 'inverter Nigeria',
    secondaryKeywords: [
      'buy inverter',
      'hybrid inverter',
      'heavy duty inverter',
      'backup inverter',
      'inverter price Nigeria',
    ],
    pageType: 'category',
  },
  '/products/hybrid-inverters': {
    seoTitle: 'Hybrid Inverters in Nigeria – Solar + Battery in One Unit | PRAG',
    seoDescription:
      'PRAG hybrid inverters combine solar charging and battery backup in a single unit — ideal for Nigerian homes wanting solar with storage.',
    primaryKeyword: 'hybrid inverter',
    secondaryKeywords: [
      'hybrid solar inverter',
      'hybrid inverter Nigeria',
      'best hybrid inverter',
    ],
    pageType: 'category',
  },
  '/products/heavy-duty-inverters': {
    seoTitle: 'Heavy-Duty Inverters in Nigeria – Industrial & Continuous Duty | PRAG',
    seoDescription:
      'PRAG heavy-duty inverters are built for demanding loads and continuous operation — engineered for factories, plants and large facilities in Nigeria.',
    primaryKeyword: 'heavy duty inverter',
    secondaryKeywords: [
      'industrial inverter',
      'continuous duty inverter',
      'high capacity inverter',
    ],
    pageType: 'category',
  },
  '/products/voltage-stabilizers': {
    seoTitle: 'Voltage Stabilizers in Nigeria – Relay, Servo & Thyristor | PRAG',
    seoDescription:
      'Buy PRAG voltage stabilizers in Nigeria — relay, servo and thyristor stabilizers that protect appliances and equipment from voltage fluctuations.',
    primaryKeyword: 'voltage stabilizer',
    secondaryKeywords: [
      'stabilizer Nigeria',
      'voltage regulator',
      'buy stabilizer',
      'voltage protection',
    ],
    pageType: 'category',
  },
  '/products/relay-voltage-stabilizers': {
    seoTitle: 'Relay Voltage Stabilizers in Nigeria – Fast, Affordable Protection | PRAG',
    seoDescription:
      'PRAG relay voltage stabilizers deliver fast, affordable voltage protection for home and office appliances across Nigeria.',
    primaryKeyword: 'relay voltage stabilizer',
    secondaryKeywords: [
      'relay stabilizer',
      'affordable voltage stabilizer',
      'home stabilizer',
    ],
    pageType: 'category',
  },
  '/products/servo-voltage-stabilizers': {
    seoTitle: 'Servo Voltage Stabilizers in Nigeria – Precise Voltage Correction | PRAG',
    seoDescription:
      'PRAG servo voltage stabilizers provide precise voltage correction for sensitive and high-value equipment in Nigeria.',
    primaryKeyword: 'servo voltage stabilizer',
    secondaryKeywords: [
      'servo stabilizer',
      'precision voltage stabilizer',
      'servo voltage regulator',
    ],
    pageType: 'category',
  },
  '/products/thyristor-stabilizers': {
    seoTitle: 'Thyristor Stabilizers in Nigeria – Maintenance-Free, High Precision | PRAG',
    seoDescription:
      'PRAG thyristor stabilizers offer maintenance-free, high-precision voltage stabilization for industrial and commercial use in Nigeria.',
    primaryKeyword: 'thyristor stabilizer',
    secondaryKeywords: [
      'thyristor voltage stabilizer',
      'static stabilizer',
      'maintenance-free stabilizer',
    ],
    pageType: 'category',
  },
  '/products/advanced-stabilizers': {
    seoTitle: 'Advanced Voltage Stabilizers in Nigeria – Cutting-Edge Protection | PRAG',
    seoDescription:
      'PRAG advanced stabilizers use cutting-edge voltage protection technology for demanding Nigerian power conditions.',
    primaryKeyword: 'advanced stabilizer',
    secondaryKeywords: [
      'advanced voltage stabilizer',
      'smart stabilizer',
      'modern voltage protection',
    ],
    pageType: 'category',
  },
  '/products/batteries': {
    seoTitle: 'Batteries in Nigeria – Inverter, Solar & Lithium Batteries | PRAG',
    seoDescription:
      'Buy PRAG batteries in Nigeria — inverter batteries, solar batteries and lithium batteries for reliable energy storage in homes and businesses.',
    primaryKeyword: 'battery Nigeria',
    secondaryKeywords: [
      'inverter battery',
      'solar battery',
      'lithium battery',
      'energy storage',
    ],
    pageType: 'category',
  },
  '/products/lithium-batteries': {
    seoTitle: 'Lithium Batteries in Nigeria – Long-Lasting Energy Storage | PRAG',
    seoDescription:
      'PRAG lithium batteries — lightweight, long-lasting energy storage for inverter and solar systems in Nigeria. Faster charging, longer life than lead-acid.',
    primaryKeyword: 'lithium battery',
    secondaryKeywords: [
      'lithium inverter battery',
      'lithium battery Nigeria',
      'LiFePO4',
      'lithium solar battery',
    ],
    pageType: 'category',
  },
  '/products/solar': {
    seoTitle: 'Solar Products in Nigeria – Panels, Charge Controllers & Solar Equipment | PRAG',
    seoDescription:
      'Browse PRAG solar products — solar panels, charge controllers and solar equipment for residential and commercial solar setups in Nigeria.',
    primaryKeyword: 'solar products',
    secondaryKeywords: [
      'solar equipment',
      'solar panels',
      'solar charge controller',
      'buy solar Nigeria',
    ],
    pageType: 'category',
  },
  '/products/solar-panels': {
    seoTitle: 'Solar Panels in Nigeria – High-Efficiency Panels for Home & Business | PRAG',
    seoDescription:
      'Buy high-efficiency PRAG solar panels in Nigeria — for residential and commercial solar installations. Durable, high-output, built for Nigerian conditions.',
    primaryKeyword: 'solar panels',
    secondaryKeywords: [
      'buy solar panels Nigeria',
      'solar panel price',
      'monocrystalline solar panel',
      'residential solar panel',
    ],
    pageType: 'category',
  },
  '/products/solar-charge-controllers': {
    seoTitle: 'Solar Charge Controllers in Nigeria – MPPT & PWM Controllers | PRAG',
    seoDescription:
      'PRAG solar charge controllers — MPPT and PWM controllers for optimal solar charging and battery protection in Nigeria.',
    primaryKeyword: 'solar charge controller',
    secondaryKeywords: [
      'MPPT charge controller',
      'PWM charge controller',
      'solar regulator',
    ],
    pageType: 'category',
  },
  '/products/protective-device': {
    seoTitle: 'Protective Devices in Nigeria – Surge Protection for Power Systems | PRAG',
    seoDescription:
      'PRAG protective devices — surge protection and safety devices for solar and power systems in Nigeria.',
    primaryKeyword: 'protective device',
    secondaryKeywords: [
      'surge protection',
      'surge protector',
      'power protection device',
    ],
    pageType: 'category',
  },
  '/solutions': {
    seoTitle: 'Power Solutions in Nigeria – Residential, Commercial & Industrial | PRAG',
    seoDescription:
      'PRAG engineers complete power solutions across Nigeria — residential, commercial and industrial systems for backup, solar and voltage stabilization.',
    primaryKeyword: 'power solutions Nigeria',
    secondaryKeywords: [
      'power engineering Nigeria',
      'power systems',
      'backup power',
      'solar solutions',
    ],
    pageType: 'solutions-hub',
  },
  '/solutions/residential': {
    seoTitle: 'Residential Power Solutions in Nigeria – Home Backup, Solar & Stabilizers | PRAG',
    seoDescription:
      'PRAG residential power solutions — home backup power, solar systems and voltage stabilizers that keep Nigerian homes powered and protected.',
    primaryKeyword: 'residential power solutions',
    secondaryKeywords: [
      'home backup power Nigeria',
      'home solar systems',
      'home voltage stabilizer',
    ],
    pageType: 'solution',
  },
  '/solutions/commercial': {
    seoTitle: 'Commercial Power Solutions in Nigeria – Backup, Solar & Stabilization | PRAG',
    seoDescription:
      'PRAG commercial power solutions — backup power, solar and voltage stabilization for offices, retail, hospitals and hospitality across Nigeria.',
    primaryKeyword: 'commercial power solutions',
    secondaryKeywords: [
      'business power solutions',
      'office backup power',
      'commercial solar',
    ],
    pageType: 'solution',
  },
  '/solutions/industrial': {
    seoTitle: 'Industrial Power Solutions in Nigeria – Heavy-Duty Power Engineering | PRAG',
    seoDescription:
      'PRAG industrial power solutions — heavy-duty voltage stabilization, backup and solar systems engineered for factories, plants and large facilities in Nigeria.',
    primaryKeyword: 'industrial power solutions',
    secondaryKeywords: [
      'industrial voltage stabilizer',
      'industrial backup power',
      'heavy duty power systems',
    ],
    pageType: 'solution',
  },
  '/solutions/backup-power': {
    seoTitle: 'Backup Power Solutions in Nigeria – Inverter & Battery Backup | PRAG',
    seoDescription:
      'PRAG backup power solutions — inverter and battery systems that keep Nigerian homes and businesses running through outages. Reduce generator dependence.',
    primaryKeyword: 'backup power solutions',
    secondaryKeywords: [
      'power backup Nigeria',
      'inverter backup',
      'battery backup',
      'generator alternative',
    ],
    pageType: 'solution',
  },
  '/solutions/solar-energy': {
    seoTitle: 'Solar Energy Systems in Nigeria – Solar Installation & Design | PRAG',
    seoDescription:
      'PRAG solar energy systems — design and installation of solar power systems for Nigerian homes and businesses. Lower energy costs, reduce generator dependence.',
    primaryKeyword: 'solar energy systems',
    secondaryKeywords: [
      'solar installation Nigeria',
      'solar power system',
      'solar solution',
      'solar for home',
    ],
    pageType: 'solution',
  },
  '/solutions/voltage-stabilization-protection': {
    seoTitle: 'Voltage Stabilization & Protection in Nigeria – Solve Voltage Fluctuation | PRAG',
    seoDescription:
      'PRAG voltage stabilization and protection solutions — engineering and products that solve voltage fluctuation and protect equipment across Nigerian facilities.',
    primaryKeyword: 'voltage stabilization',
    secondaryKeywords: [
      'voltage protection Nigeria',
      'voltage fluctuation solution',
      'voltage regulation service',
    ],
    pageType: 'solution',
  },
  '/about': {
    seoTitle: 'About PRAG – Nigeria Power Engineering Company Since 2005 | PRAG',
    seoDescription:
      'PRAG is a Nigerian power engineering company founded in 2005, designing and installing inverter, stabilizer, battery and solar systems across 36 states.',
    primaryKeyword: 'PRAG about',
    secondaryKeywords: [
      'PRAG power engineering',
      'about PRAG Nigeria',
      'PRAG history',
    ],
    pageType: 'static',
  },
  '/installations': {
    seoTitle: 'PRAG Installations in Nigeria – Power Systems Projects & Case Studies | PRAG',
    seoDescription:
      'Explore PRAG power installation projects across Nigeria — inverter, stabilizer, battery and solar systems delivered for homes, businesses and industry.',
    primaryKeyword: 'PRAG installations',
    secondaryKeywords: [
      'power installation projects Nigeria',
      'PRAG case studies',
      'installed systems',
    ],
    pageType: 'static',
  },
  '/knowledge-center': {
    seoTitle: 'Knowledge Center – Power Guides & Engineering Insights | PRAG',
    seoDescription:
      "Practical guides, honest comparisons and expert insights from PRAG's engineering team — written for Nigerian power conditions.",
    primaryKeyword: 'PRAG knowledge center',
    secondaryKeywords: [
      'power guide Nigeria',
      'inverter guide',
      'stabilizer guide',
      'solar guide',
    ],
    pageType: 'blog-hub',
  },
};

// ─── Category display data (for H1 and fallback descriptions) ───────────────

export const CATEGORY_DISPLAY: Record<string, { name: string; h1: string }> = {
  inverters: { name: 'Inverters', h1: 'Inverters' },
  'hybrid-inverters': { name: 'Hybrid Inverters', h1: 'Hybrid Inverters' },
  'heavy-duty-inverters': { name: 'Heavy-Duty Inverters', h1: 'Heavy-Duty Inverters' },
  'voltage-stabilizers': { name: 'Voltage Stabilizers', h1: 'Voltage Stabilizers' },
  'relay-voltage-stabilizers': { name: 'Relay Voltage Stabilizers', h1: 'Relay Voltage Stabilizers' },
  'servo-voltage-stabilizers': { name: 'Servo Voltage Stabilizers', h1: 'Servo Voltage Stabilizers' },
  'thyristor-stabilizers': { name: 'Thyristor Stabilizers', h1: 'Thyristor Stabilizers' },
  'advanced-stabilizers': { name: 'Advanced Stabilizers', h1: 'Advanced Stabilizers' },
  batteries: { name: 'Batteries', h1: 'Batteries' },
  'lithium-batteries': { name: 'Lithium Batteries', h1: 'Lithium Batteries' },
  solar: { name: 'Solar Products', h1: 'Solar Products' },
  'solar-panels': { name: 'Solar Panels', h1: 'Solar Panels' },
  'solar-charge-controllers': { name: 'Solar Charge Controllers', h1: 'Solar Charge Controllers' },
  'protective-device': { name: 'Protective Devices', h1: 'Protective Devices' },
};

// ─── Metadata resolution helpers ────────────────────────────────────────────

/**
 * Resolve SEO for a static route (one of the 26 priority pages).
 * Resolution: admin override → approved route config → safe fallback.
 */
export function resolveStaticSeo(
  route: string,
  adminOverride?: SeoOverride | null,
): { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string; primaryKeyword: string; secondaryKeywords: string[] } {
  const config = ROUTE_SEO_CONFIG[route];
  const canonical = adminOverride?.canonicalOverride?.trim() || `${SITE_BASE}${route === '/' ? '/' : route}`;

  const title = adminOverride?.seoTitle?.trim() || config?.seoTitle || `${BRAND_NAME}`;
  const description = adminOverride?.seoDescription?.trim() || config?.seoDescription || '';
  const ogTitle = adminOverride?.ogTitle?.trim() || title;
  const ogDescription = adminOverride?.ogDescription?.trim() || description;
  const primaryKeyword = adminOverride?.primaryKeyword?.trim() || config?.primaryKeyword || '';
  const secondaryKeywords = adminOverride?.secondaryKeywords ?? config?.secondaryKeywords ?? [];

  return { title, description, ogTitle, ogDescription, canonical, primaryKeyword, secondaryKeywords };
}

/**
 * Resolve SEO for a product category page.
 * Resolution: admin override → approved category config → category fallback.
 */
export function resolveCategorySeo(
  categorySlug: string,
  adminOverride?: SeoOverride | null,
): { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string; primaryKeyword: string; secondaryKeywords: string[] } {
  const route = `/products/${categorySlug}`;
  const config = ROUTE_SEO_CONFIG[route];
  const display = CATEGORY_DISPLAY[categorySlug];
  const canonical = adminOverride?.canonicalOverride?.trim() || `${SITE_BASE}/products/${categorySlug}`;

  // Fallback if no approved config exists for this category
  const fallbackTitle = display
    ? `${display.name} in Nigeria | ${BRAND_NAME}`
    : `${BRAND_NAME}`;
  const fallbackDescription = display
    ? `Browse PRAG ${display.name.toLowerCase()} — engineered for Nigerian power conditions.`
    : '';

  const title = adminOverride?.seoTitle?.trim() || config?.seoTitle || fallbackTitle;
  const description = adminOverride?.seoDescription?.trim() || config?.seoDescription || fallbackDescription;
  const ogTitle = adminOverride?.ogTitle?.trim() || title;
  const ogDescription = adminOverride?.ogDescription?.trim() || description;
  const primaryKeyword = adminOverride?.primaryKeyword?.trim() || config?.primaryKeyword || '';
  const secondaryKeywords = adminOverride?.secondaryKeywords ?? config?.secondaryKeywords ?? [];

  return { title, description, ogTitle, ogDescription, canonical, primaryKeyword, secondaryKeywords };
}

/**
 * Resolve SEO for an individual product page.
 * Resolution: admin override → safe automatic fallback ({Product Name} | PRAG).
 *
 * Per Step 8 brief: do NOT manually optimise all products yet.
 */
export function resolveProductSeo(
  productName: string,
  productSlug: string,
  categorySlug: string,
  shortDescription: string,
  description: string,
  imageUrl?: string,
  adminOverride?: SeoOverride | null,
): { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string; ogImage?: string } {
  const canonical = adminOverride?.canonicalOverride?.trim() ||
    `${SITE_BASE}/products/${categorySlug}/${productSlug}`;

  // Safe automatic fallback: {Product Name} | PRAG
  const fallbackTitle = `${productName} | ${BRAND_NAME}`;
  const cleanShort = shortDescription?.replace(/<[^>]+>/g, '').trim() || '';
  const cleanDesc = description?.replace(/<[^>]+>/g, '').trim() || '';
  const fallbackDescription =
    cleanShort.slice(0, 155) ||
    cleanDesc.slice(0, 155) ||
    `${productName} — specs, pricing and availability from PRAG Nigeria.`;

  const title = adminOverride?.seoTitle?.trim() || fallbackTitle;
  const desc = adminOverride?.seoDescription?.trim() || fallbackDescription;
  const ogTitle = adminOverride?.ogTitle?.trim() || title;
  const ogDescription = adminOverride?.ogDescription?.trim() || desc;
  const ogImage = adminOverride?.ogImage?.trim() || imageUrl;

  return { title, description: desc, ogTitle, ogDescription, canonical, ogImage };
}

/**
 * Resolve SEO for a Knowledge Center article.
 * Resolution: admin override → Yoast meta → article-title/content fallback.
 */
export function resolveKcArticleSeo(
  articleTitle: string,
  articleSlug: string,
  articleExcerpt: string,
  imageUrl?: string,
  yoastMeta?: { seo_title?: string; meta_description?: string; focus_keyphrase?: string } | null,
  adminOverride?: SeoOverride | null,
): { title: string; description: string; ogTitle: string; ogDescription: string; canonical: string; ogImage?: string } {
  const canonical = adminOverride?.canonicalOverride?.trim() ||
    `${SITE_BASE}/knowledge-center/${articleSlug}`;

  const cleanExcerpt = articleExcerpt?.replace(/<[^>]+>/g, '').trim() || '';
  const fallbackDescription = cleanExcerpt.slice(0, 160) || '';

  // Yoast is secondary source (only if admin override doesn't exist)
  const yoastTitle = yoastMeta?.seo_title?.trim() || '';
  const yoastDesc = yoastMeta?.meta_description?.trim() || '';

  const title = adminOverride?.seoTitle?.trim() || yoastTitle || articleTitle;
  const description = adminOverride?.seoDescription?.trim() || yoastDesc || fallbackDescription;
  const ogTitle = adminOverride?.ogTitle?.trim() || title;
  const ogDescription = adminOverride?.ogDescription?.trim() || description;
  const ogImage = adminOverride?.ogImage?.trim() || imageUrl;

  return { title, description, ogTitle, ogDescription, canonical, ogImage };
}

// ─── Next.js Metadata builder ───────────────────────────────────────────────

/**
 * Build a Next.js Metadata object from resolved SEO values.
 * Uses `title: { absolute }` to avoid the layout template double-suffixing.
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  robotsIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const robots = opts.robotsIndex === false
    ? { index: false, follow: true }
    : { index: true, follow: true };

  const metadata: Metadata = {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: opts.canonical },
    robots,
    openGraph: {
      title: opts.ogTitle,
      description: opts.ogDescription,
      url: opts.canonical,
      siteName: OG_SITE_NAME,
      type: opts.ogType ?? 'website',
      ...(opts.ogImage ? { images: [{ url: opts.ogImage }] } : {}),
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.ogTitle,
      description: opts.ogDescription,
      ...(opts.ogImage ? { images: [opts.ogImage] } : {}),
    },
  };

  return metadata;
}

// ─── Structured data builders ───────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Build BreadcrumbList JSON-LD from a list of breadcrumb items.
 * All URLs must be canonical www.prag.global URLs.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build Product + Offer JSON-LD from real WooCommerce data.
 * Does NOT invent aggregateRating, review, ratingValue, or reviewCount.
 */
export function buildProductJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  sku?: string;
  price?: string;
  currency?: string;
  availability?: string;
}): Record<string, unknown> {
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
  };

  if (opts.image) product.image = opts.image;
  if (opts.sku) product.sku = opts.sku;

  // Offer only when valid pricing exists
  if (opts.price && opts.price !== '0' && opts.price !== '') {
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      price: opts.price,
      priceCurrency: opts.currency || 'NGN',
      url: opts.url,
    };
    if (opts.availability) {
      const availabilityMap: Record<string, string> = {
        instock: 'https://schema.org/InStock',
        outofstock: 'https://schema.org/OutOfStock',
        onbackorder: 'https://schema.org/BackOrder',
      };
      offer.availability = availabilityMap[opts.availability] || 'https://schema.org/InStock';
    }
    product.offers = offer;
  }

  return product;
}

/**
 * Build Article JSON-LD from real WordPress data.
 * Publisher references the existing Organization @id on the homepage.
 */
export function buildArticleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}): Record<string, unknown> {
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': opts.url,
    },
    publisher: {
      '@id': `${SITE_BASE}/#organization`,
    },
  };

  if (opts.image) article.image = opts.image;
  if (opts.datePublished) article.datePublished = opts.datePublished;
  if (opts.dateModified) article.dateModified = opts.dateModified;

  // Only include author if genuinely available
  if (opts.authorName && opts.authorName.trim()) {
    article.author = {
      '@type': 'Person',
      name: opts.authorName,
    };
  }

  return article;
}

// ─── Yoast meta fetcher for KC articles ─────────────────────────────────────

/**
 * Fetch Yoast SEO meta for a WordPress post via the prag-core REST endpoint.
 * Returns null if the endpoint is unavailable or the post has no Yoast data.
 * This is the secondary source in the KC resolution order.
 */
export async function fetchYoastPostSeo(
  postId: number,
): Promise<{ seo_title: string; meta_description: string; focus_keyphrase: string } | null> {
  if (!postId) return null;
  const wpBase = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '') ?? 'https://central.prag.global';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${wpBase}/wp-json/prag-core/v1/post-seo/${postId}`, {
      next: { revalidate: 300, tags: ['b2b-post-seo'] },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object') return null;
    return {
      seo_title: data.seo_title || '',
      meta_description: data.meta_description || '',
      focus_keyphrase: data.focus_keyphrase || '',
    };
  } catch {
    return null;
  }
}

// ─── Helper to get admin SEO overrides from B2B content ─────────────────────

/**
 * Extract the SEO override for a given route from the admin B2B content.
 * Returns null if no override exists.
 */
export function getAdminSeoOverride(
  seoOverrides: SeoOverrideMap | undefined,
  route: string,
): SeoOverride | null {
  if (!seoOverrides || typeof seoOverrides !== 'object') return null;
  const override = seoOverrides[route];
  if (!override || typeof override !== 'object') return null;
  return override;
}

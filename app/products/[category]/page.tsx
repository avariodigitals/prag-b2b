export const dynamic = 'force-dynamic';

import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { getCategories, getCategoryOrder, getHiddenCategories, getProducts, getSubcategoryOrder, type Product, type Category } from '@/lib/woocommerce';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';
import { CategoryContentSections, CategoryFaqAndCta } from '@/components/CategoryContent';
import JsonLd from '@/components/JsonLd';
import { APPROVED_CATEGORIES, EXCLUDED_CATEGORIES, REDIRECTED_CATEGORIES, isExcludedCategory } from '@/lib/seoTaxonomy';
import { resolveCategorySeo, buildMetadata, buildBreadcrumbJsonLd, getAdminSeoOverride, CATEGORY_DISPLAY, SITE_BASE } from '@/lib/seoMeta';
import { getCategoryContent } from '@/lib/categoryContent';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; sort?: string }>;
}

const KNOWN_IDS: Record<string, number> = {
  'inverters': 314,
  'solar': 320,
  'batteries': 327,
  'all-prag-stabilizers': 321,
  'voltage-stabilizers': 322,
  'thyristor-stabilizers': 349,
  'relay-voltage-stabilizers': 323,
  'servo-voltage-stabilizers': 324,
  'advanced-stabilizers': 338,
  'hybrid-inverters': 319,
  'heavy-duty-inverters': 315,
  'pure-sine-wave-inverters': 316,
  'solar-panels': 326,
  'solar-charge-controllers': 325,
  'protective-device': 340,
  'tubular-batteries': 348,
  'lithium-batteries': 344,
};

const DISPLAY: Record<string, { name: string; description: string }> = {
  'inverters': { name: 'Inverters', description: 'Browse PRAG inverters — hybrid, heavy-duty and backup inverters that convert battery DC to stable AC for homes, businesses and industry.' },
  'voltage-stabilizers': { name: 'Voltage Stabilizers', description: 'Browse PRAG voltage stabilizers — relay, servo and thyristor stabilizers that protect appliances and equipment from voltage fluctuations.' },
  'batteries': { name: 'Batteries', description: 'Browse PRAG batteries — inverter batteries, solar batteries and lithium batteries for reliable energy storage.' },
  'solar': { name: 'Solar Products', description: 'Browse PRAG solar products — solar panels, charge controllers and solar equipment for residential and commercial solar setups.' },
  'hybrid-inverters': { name: 'Hybrid Inverters', description: 'Explore PRAG hybrid inverters — combining solar charging and battery backup in a single unit.' },
  'heavy-duty-inverters': { name: 'Heavy-Duty Inverters', description: 'Explore PRAG heavy-duty inverters — built for demanding loads and continuous operation.' },
  'relay-voltage-stabilizers': { name: 'Relay Voltage Stabilizers', description: 'Explore PRAG relay voltage stabilizers — fast, affordable voltage protection for home and office.' },
  'servo-voltage-stabilizers': { name: 'Servo Voltage Stabilizers', description: 'Explore PRAG servo voltage stabilizers — precise voltage correction for sensitive equipment.' },
  'thyristor-stabilizers': { name: 'Thyristor Stabilizers', description: 'Explore PRAG thyristor stabilizers — maintenance-free, high-precision voltage stabilization.' },
  'advanced-stabilizers': { name: 'Advanced Stabilizers', description: 'Explore PRAG advanced stabilizers — cutting-edge voltage protection technology.' },
  'lithium-batteries': { name: 'Lithium Batteries', description: 'Explore PRAG lithium batteries — lightweight, long-lasting energy storage for inverter and solar systems.' },
  'solar-panels': { name: 'Solar Panels', description: 'Explore PRAG solar panels — high-efficiency panels for residential and commercial solar installations.' },
  'solar-charge-controllers': { name: 'Solar Charge Controllers', description: 'Explore PRAG solar charge controllers — MPPT and PWM controllers for optimal solar charging.' },
  'protective-device': { name: 'Protective Devices', description: 'Explore PRAG protective devices — surge protection for solar and power systems.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  // Redirected categories (all-prag-stabilizers → voltage-stabilizers)
  if (category in REDIRECTED_CATEGORIES) {
    return {};
  }

  // Excluded categories: noindex, follow
  if (isExcludedCategory(category)) {
    const displayName = CATEGORY_DISPLAY[category]?.name ?? category;
    return buildMetadata({
      title: `${displayName} | PRAG`,
      description: '',
      canonical: `${SITE_BASE}/products/${category}`,
      ogTitle: `${displayName} | PRAG`,
      ogDescription: '',
      robotsIndex: false,
    });
  }

  const content = await getB2BPublicContent();
  const override = getAdminSeoOverride(content?.seoOverrides, `/products/${category}`);
  const seo = resolveCategorySeo(category, override);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
  });
}

export async function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  // Redirected categories: permanent 308 redirect to the canonical URL
  if (category in REDIRECTED_CATEGORIES) {
    const dest = REDIRECTED_CATEGORIES[category];
    permanentRedirect(`/products/${dest}`);
  }

  // Check if this category is hidden from the storefront
  const [hiddenArr, allCategories, subcategoryOrder] = await Promise.all([
    getHiddenCategories(),
    getCategories(),
    getSubcategoryOrder(),
  ]);
  const hiddenSet = new Set(hiddenArr);
  if (hiddenSet.has(category)) notFound();
  if (sp.sub && hiddenSet.has(sp.sub)) notFound();

  // Build dynamic subcategory tabs from WooCommerce categories
  const parentCat = allCategories.find((c) => c.slug === category);
  const subOrder = subcategoryOrder[category] ?? [];

  // Helper function to get all descendant categories recursively
  function getAllDescendants(parentId: number): Category[] {
    const directChildren = allCategories.filter((c) => c.parent === parentId);
    const allDescendants = [...directChildren];
    directChildren.forEach((child) => {
      allDescendants.push(...getAllDescendants(child.id));
    });
    return allDescendants;
  }

  const allDescendants = parentCat ? getAllDescendants(parentCat.id) : [];

  // Only approved SEO subcategories appear in the subcategory tabs.
  // Excluded categories (health-fitness, travel, etc.) and non-canonical
  // categories are filtered out.
  const subcategories = allDescendants
    .filter((c) => APPROVED_CATEGORIES.has(c.slug))
    .filter((c) => subOrder.length === 0 || subOrder.includes(c.slug))
    .sort((a, b) => {
      if (subOrder.length > 0) {
        const aIdx = subOrder.indexOf(a.slug);
        const bIdx = subOrder.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
      }
      return a.name.localeCompare(b.name);
    })
    .map((c) => ({ label: c.name, slug: c.slug }));

  const activeSlug = sp.sub ?? category;
  const activeCat = allCategories.find((c) => c.slug === activeSlug);
  const category_id = KNOWN_IDS[activeSlug] ?? activeCat?.id;

  if (!category_id && !parentCat && !DISPLAY[category]) notFound();

  const content = await getB2BPublicContent();
  const page = findB2BPage(content, `/products/${category}`);
  const hero = findVisibleSectionsByType(page, 'hero')[0];

  let products: Product[] = [];
  let total = 0;
  try {
    const result = await getProducts({
      category_id,
      per_page: 16,
      page: 1,
      orderby: 'title',
      order: 'asc',
    });
    products = result.products;
    total = result.total;
  } catch {
    products = [];
    total = 0;
  }

  const name = hero?.summary?.trim() || DISPLAY[category]?.name || category;
  const description = hero?.content?.trim() || DISPLAY[category]?.description || '';

  // Step 9 on-page content. When a structured CategoryContent entry exists for
  // this slug, its H1 and intro override the generic CMS/fallback hero copy so
  // the page leads with the approved intent-specific H1, and rich guidance
  // sections + FAQs + CTA are integrated around the product grid.
  const step9Content = getCategoryContent(category);
  const h1 = step9Content?.h1 ?? name;
  const intro = step9Content?.intro ?? description;

  return (
    <main className="w-full bg-white flex flex-col">
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Home', url: `${SITE_BASE}/` },
        { name: 'Products', url: `${SITE_BASE}/products` },
        { name: DISPLAY[category]?.name ?? category, url: `${SITE_BASE}/products/${category}` },
      ])} />
      {/* Hero */}
      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">{h1}</h1>
        {intro && (
          <p className="breadcrumb-description-lock max-w-[531px]">{intro}</p>
        )}
      </div>

      {/* Step 9 guidance content (quick nav + H2 sections + proof links) */}
      {step9Content && (
        <div className="w-full px-6 md:px-20 pt-10 md:pt-14">
          <div className="max-w-[1280px] mx-auto">
            <CategoryContentSections content={step9Content} />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="w-full px-6 md:px-20 py-10">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[302/275] bg-stone-100 rounded-xl" />
                <div className="h-4 w-3/4 bg-stone-200 rounded mx-auto" />
                <div className="h-3 w-1/2 bg-stone-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        }>
          <CategoryProductsGrid
            products={products}
            total={total}
            categorySlug={category}
            activeSub={sp.sub}
            subcategories={subcategories}
          />
        </Suspense>
      </div>

      {/* Step 9 FAQs + primary CTA (after the grid) */}
      {step9Content && (
        <div className="w-full px-6 md:px-20 pb-16 md:pb-24">
          <div className="max-w-[1280px] mx-auto">
            <CategoryFaqAndCta content={step9Content} />
          </div>
        </div>
      )}
    </main>
  );
}

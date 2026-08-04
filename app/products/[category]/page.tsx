export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { getCategories, getCategoryOrder, getHiddenCategories, getProducts, getSubcategoryOrder, type Product } from '@/lib/woocommerce';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';

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
  'inverters': { name: 'Inverter', description: 'A selection of solar inverters that convert DC power from solar panels into AC power.' },
  'all-prag-stabilizers': { name: 'Voltage Stabilizers', description: 'Explore our range of voltage stabilizers, designed to protect your appliances from power fluctuations.' },
  'batteries': { name: 'Batteries', description: 'Explore our wide range of batteries for solar power, inverters, and other energy storage solutions.' },
  'solar': { name: 'Solar', description: 'Explore our range of solar solutions, designed to maximize energy efficiency and protect against voltage fluctuations.' },
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, `/products/${category}`);
  const hero = findVisibleSectionsByType(page, 'hero')[0];
  const name = hero?.summary?.trim() || DISPLAY[category]?.name || category;
  const description = DISPLAY[category]?.description ?? `Browse ${name} from PRAG. Enterprise-grade power engineering solutions for businesses in Nigeria.`;
  const siteBase = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://prag.global';
  return {
    title: `${name} – PRAG B2B`,
    description,
    alternates: { canonical: `${siteBase}/products/${category}` },
    openGraph: {
      title: `${name} – PRAG B2B`,
      description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

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
  const subcategories = allCategories
    .filter((c) => parentCat && c.parent === parentCat.id && !hiddenSet.has(c.slug))
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
  const category_id = KNOWN_IDS[activeSlug];

  if (!category_id && !DISPLAY[category]) notFound();

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

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">{name}</h1>
        {description && (
          <p className="breadcrumb-description-lock max-w-[531px]">{description}</p>
        )}
      </div>

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
    </main>
  );
}

import type { Metadata } from 'next';
import ProductsView from '@/components/ProductsView';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { getCategories, getCategoryOrder, getHiddenCategories, getProducts, getSubcategoryOrder, searchProducts, type Product } from '@/lib/woocommerce';
import { APPROVED_CATEGORIES, hasApprovedCategory, preferredProductCategory } from '@/lib/seoTaxonomy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Products – PRAG B2B',
  description: 'Browse all PRAG product categories and power technologies.',
  alternates: { canonical: 'https://www.prag.global/products' },
  openGraph: {
    title: 'Products – PRAG B2B',
    description: 'Browse all PRAG product categories and power technologies.',
    url: 'https://www.prag.global/products',
    type: 'website',
  },
};

// SEO-approved top-level product families only.
// Excludes: sales, all-prag-stabilizers (redirected), and non-core categories.
const CATEGORY_SLUGS = ['inverters', 'voltage-stabilizers', 'batteries', 'solar'];

interface Props {
  searchParams: Promise<{ q?: string; cats?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/products');
  const hero = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = hero?.summary?.trim() || 'Products';
  const heroDescription = hero?.content?.trim() || 'Browse all PRAG product categories and power technologies.';
  const query = String(sp.q ?? '').trim();
  const requestedCats = String(sp.cats ?? '')
    .split(',')
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);
  const [categories, hiddenArr, categoryOrder, subcategoryOrder] = await Promise.all([
    getCategories(),
    getHiddenCategories(),
    getCategoryOrder(),
    getSubcategoryOrder(),
  ]);
  const hiddenSet = new Set(hiddenArr);
  const orderMap = new Map(categoryOrder.map((slug, i) => [slug, i]));
  // Only approved SEO categories are visible in the product navigation.
  const visibleCategories = categories.filter((c) => APPROVED_CATEGORIES.has(c.slug));
  const visibleCategorySlugs = CATEGORY_SLUGS.filter((slug) => !hiddenSet.has(slug)).sort((a, b) => {
    const aIdx = orderMap.get(a);
    const bIdx = orderMap.get(b);
    if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
    if (aIdx !== undefined) return -1;
    if (bIdx !== undefined) return 1;
    return 0;
  });
  const uniqueRequestedCats = Array.from(new Set(requestedCats));
  const validRequestedCats = uniqueRequestedCats.filter((slug) => visibleCategories.some((c) => c.slug === slug));
  const activeFilterNames = validRequestedCats
    .map((slug) => visibleCategories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  // "All Power Products" displays only products belonging to at least one
  // SEO-approved product category. Non-core products (health-fitness, travel,
  // personal-electronics, sales-only) are excluded from the listing.
  const filterApproved = (prods: Product[]) => prods.filter((p) => hasApprovedCategory(p.categories as Array<{ slug: string }> | undefined));

  const baseAllProductsPromise = query
    ? Promise.resolve({ products: filterApproved(await searchProducts(query)), total: 0 })
    : validRequestedCats.length > 0
      ? Promise.all(
          validRequestedCats.map(async (slug) => {
            const cat = categories.find((c) => c.slug === slug);
            if (!cat) return [] as Product[];
            try {
              const { products } = await getProducts({ category_id: cat.id, per_page: 100, orderby: 'title', order: 'asc' });
              return products;
            } catch {
              return [] as Product[];
            }
          })
        ).then((groups) => {
          const deduped = new Map<number, Product>();
          groups.flat().forEach((product) => {
            if (!deduped.has(product.id)) deduped.set(product.id, product);
          });
          return { products: Array.from(deduped.values()), total: deduped.size };
        })
      : getProducts({ per_page: 100, orderby: 'title', order: 'asc' })
          .catch(() => ({ products: [] as Product[], total: 0 }))
          .then((result) => ({ products: filterApproved(result.products), total: filterApproved(result.products).length }));

  // Fetch all products + per-category in parallel
  const [{ products: allProducts }, ...categoryResults] = await Promise.all([
    baseAllProductsPromise,
    ...visibleCategorySlugs.map(slug => {
      const cat = visibleCategories.find(c => c.slug === slug);
      return cat
        ? getProducts({ category_id: cat.id, per_page: 50, orderby: 'title', order: 'asc' }).catch(() => ({ products: [] as Product[], total: 0 }))
        : Promise.resolve({ products: [] as Product[], total: 0 });
    }),
  ]);

  const productsByCategory: Record<string, Product[]> = {};
  visibleCategorySlugs.forEach((slug, i) => {
    productsByCategory[slug] = categoryResults[i].products;
  });

  // Also fetch subcategory products
  const subcategories = visibleCategories.filter(
    c => c.parent > 0 && visibleCategorySlugs.some(slug => {
      const parent = visibleCategories.find(p => p.slug === slug);
      return parent?.id === c.parent;
    })
  );

  // Sort subcategories by subcategory_order within each parent
  subcategories.sort((a, b) => {
    if (a.parent !== b.parent) return 0;
    const parentCat = visibleCategories.find(c => c.id === a.parent);
    const parentSlug = parentCat?.slug ?? '';
    const subOrder = subcategoryOrder[parentSlug] ?? [];
    const aIdx = subOrder.indexOf(a.slug);
    const bIdx = subOrder.indexOf(b.slug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const subResults = await Promise.all(
    subcategories.map(sub => getProducts({ category_id: sub.id, per_page: 50, orderby: 'title', order: 'asc' }).catch(() => ({ products: [] as Product[], total: 0 })))
  );
  subcategories.forEach((sub, i) => {
    productsByCategory[sub.slug] = subResults[i].products;
  });

  return (
    <main className="w-full bg-white flex flex-col">
        {/* Hero */}
        <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
          <h1 className="breadcrumb-title-lock">{heroTitle}</h1>
          <p className="breadcrumb-description-lock max-w-[531px]">
            <SentenceText text={heroDescription} />
          </p>
        </div>

        {/* Products */}
        <div className="w-full px-6 md:px-20 py-12">
          {activeFilterNames.length > 0 && (
            <div className="mb-6 flex items-center justify-center">
              <p className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 font-['Onest'] text-center">
                Showing: {activeFilterNames.join(' + ')}
              </p>
            </div>
          )}
          <ProductsView
            allProducts={allProducts}
            productsByCategory={productsByCategory}
            categories={visibleCategories}
            categoryOrder={categoryOrder}
            subcategoryOrder={subcategoryOrder}
          />
        </div>
      </main>
  );
}

import ProductsView from '@/components/ProductsView';
import { SentenceText } from '@/lib/sentenceText';
import { getCategories, getProducts, searchProducts, type Product } from '@/lib/woocommerce';

export const revalidate = 300;

const CATEGORY_SLUGS = ['inverters', 'all-prag-stabilizers', 'batteries', 'solar'];

interface Props {
  searchParams: Promise<{ q?: string; cats?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = String(sp.q ?? '').trim();
  const requestedCats = String(sp.cats ?? '')
    .split(',')
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);
  const categories = await getCategories();
  const uniqueRequestedCats = Array.from(new Set(requestedCats));
  const validRequestedCats = uniqueRequestedCats.filter((slug) => categories.some((c) => c.slug === slug));
  const activeFilterNames = validRequestedCats
    .map((slug) => categories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  const baseAllProductsPromise = query
    ? Promise.resolve({ products: await searchProducts(query), total: 0 })
    : validRequestedCats.length > 0
      ? Promise.all(
          validRequestedCats.map(async (slug) => {
            const cat = categories.find((c) => c.slug === slug);
            if (!cat) return [] as Product[];
            const { products } = await getProducts({ category_id: cat.id, per_page: 100, orderby: 'title', order: 'asc' });
            return products;
          })
        ).then((groups) => {
          const deduped = new Map<number, Product>();
          groups.flat().forEach((product) => {
            if (!deduped.has(product.id)) deduped.set(product.id, product);
          });
          return { products: Array.from(deduped.values()), total: deduped.size };
        })
      : getProducts({ per_page: 100, orderby: 'title', order: 'asc' });

  // Fetch all products + per-category in parallel
  const [{ products: allProducts }, ...categoryResults] = await Promise.all([
    baseAllProductsPromise,
    ...CATEGORY_SLUGS.map(slug => {
      const cat = categories.find(c => c.slug === slug);
      return cat
        ? getProducts({ category_id: cat.id, per_page: 50, orderby: 'title', order: 'asc' })
        : Promise.resolve({ products: [] as Product[], total: 0 });
    }),
  ]);

  const productsByCategory: Record<string, Product[]> = {};
  CATEGORY_SLUGS.forEach((slug, i) => {
    productsByCategory[slug] = categoryResults[i].products;
  });

  // Also fetch subcategory products
  const subcategories = categories.filter(
    c => c.parent > 0 && CATEGORY_SLUGS.some(slug => {
      const parent = categories.find(p => p.slug === slug);
      return parent?.id === c.parent;
    })
  );

  const subResults = await Promise.all(
    subcategories.map(sub => getProducts({ category_id: sub.id, per_page: 50, orderby: 'title', order: 'asc' }))
  );
  subcategories.forEach((sub, i) => {
    productsByCategory[sub.slug] = subResults[i].products;
  });

  return (
    <main className="w-full bg-white flex flex-col">
        {/* Hero */}
        <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
          <h1 className="breadcrumb-title-lock">Our Products</h1>
          <p className="breadcrumb-description-lock max-w-[531px]">
            <SentenceText text="Browse our full range of voltage stabilizers, inverters, batteries, and solar systems — engineered for Nigerian conditions." />
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
            categories={categories}
          />
        </div>
      </main>
  );
}

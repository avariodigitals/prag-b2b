import ProductsView from '@/components/ProductsView';
import { getCategories, getProducts, searchProducts, type Product } from '@/lib/woocommerce';

export const revalidate = 300;

const CATEGORY_SLUGS = ['inverters', 'all-prag-stabilizers', 'batteries', 'solar'];

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = String(sp.q ?? '').trim();
  const categories = await getCategories();

  // Fetch all products + per-category in parallel
  const [{ products: allProducts }, ...categoryResults] = await Promise.all([
    query ? Promise.resolve({ products: await searchProducts(query), total: 0 }) : getProducts({ per_page: 100 }),
    ...CATEGORY_SLUGS.map(slug => {
      const cat = categories.find(c => c.slug === slug);
      return cat
        ? getProducts({ category_id: cat.id, per_page: 50 })
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
    subcategories.map(sub => getProducts({ category_id: sub.id, per_page: 50 }))
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
            Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
          </p>
        </div>

        {/* Products */}
        <div className="w-full px-6 md:px-20 py-12">
          <ProductsView
            allProducts={allProducts}
            productsByCategory={productsByCategory}
            categories={categories}
          />
        </div>
      </main>
  );
}

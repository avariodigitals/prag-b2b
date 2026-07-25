export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, type CustomTab } from '@/lib/woocommerce';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

async function fetchProductWithRetry(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch {
    return getProductBySlug(slug);
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await fetchProductWithRetry(slug);
    return { title: product ? `${product.name}` : 'Product' };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const [product, { products: related }] = await Promise.all([
    fetchProductWithRetry(slug),
    getProducts({ per_page: 4 }),
  ]);

  if (!product) notFound();

  const [reviews, techDocs, customTabs] = await Promise.all([
    getProductReviews(product.id),
    getTechDocuments(product.id),
    getProductCustomTabs(product.id),
  ]);

  const relatedFiltered = related.filter(p => p.slug !== slug).slice(0, 4);

  return (
    <main className="w-full bg-white flex flex-col">
      <ProductDetailView product={product} related={relatedFiltered} reviews={reviews} techDocs={techDocs} customTabs={customTabs} />
    </main>
  );
}

export const revalidate = 3600;

import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, getAllProductSlugs, type CustomTab } from '@/lib/woocommerce';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const allSlugs = await getAllProductSlugs();
  return allSlugs.map(({ slug, category }) => ({
    category,
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name}` : 'Product' };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const [product, { products: related }] = await Promise.all([
    getProductBySlug(slug),
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

import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments } from '@/lib/woocommerce';

interface Props {
  params: Promise<{ category: string; slug: string }>;
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

  const [reviews, techDocs] = await Promise.all([
    getProductReviews(product.id),
    getTechDocuments(product.id),
  ]);

  const relatedFiltered = related.filter(p => p.slug !== slug).slice(0, 4);

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Breadcrumb */}
      <div className="w-full px-6 md:px-20 py-4 bg-stone-50 border-b border-zinc-100 flex items-center gap-1.5 flex-wrap text-sm font-['Space_Grotesk']">
        <Link href="/" className="text-sky-700 hover:underline">Home</Link>
        <span className="text-zinc-400">/</span>
        <Link href="/products" className="text-zinc-500 hover:text-sky-700">Products</Link>
        <span className="text-zinc-400">/</span>
        <Link href={`/products`} className="text-zinc-500 hover:underline capitalize">{category.replace(/-/g, ' ')}</Link>
        <span className="text-zinc-400">/</span>
        <span className="text-zinc-500 truncate max-w-xs">{product.name}</span>
      </div>

      <ProductDetailView product={product} related={relatedFiltered} reviews={reviews} techDocs={techDocs} />
    </main>
  );
}

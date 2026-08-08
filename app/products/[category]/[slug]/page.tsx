export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, searchProducts, type CustomTab, type Product } from '@/lib/woocommerce';

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
    if (!product) return { title: 'Product – PRAG B2B' };

    const description = product.short_description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
      || product.description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
      || `${product.name} — available from PRAG. Enterprise-grade power engineering solutions for businesses.`;
    const imageUrl = product.images?.[0]?.src;
    const siteBase = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
    const categorySlug = product.categories?.[0]?.slug ?? 'products';
    const canonical = `${siteBase}/products/${categorySlug}/${product.slug}`;

    return {
      title: product.name,
      description,
      alternates: { canonical },
      openGraph: {
        title: product.name,
        description,
        url: canonical,
        images: imageUrl ? [{ url: imageUrl, alt: product.images?.[0]?.alt || product.name }] : undefined,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return { title: 'Product – PRAG B2B' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const [product, relatedResult] = await Promise.all([
    fetchProductWithRetry(slug),
    getProducts({ per_page: 4 }).catch(() => ({ products: [] as Product[], total: 0 })),
  ]);
  const related = relatedResult.products;

  if (!product) {
    try {
      const searchQuery = slug.replace(/-/g, ' ');
      const searchResults = await searchProducts(searchQuery);
      const match = searchResults.find((p) =>
        p.slug !== slug && p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        const categorySlug = match.categories?.[0]?.slug ?? 'products';
        redirect(`/products/${categorySlug}/${match.slug}`);
      }
    } catch {
      // Search failed, fall through to notFound
    }
    notFound();
  }

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

export const dynamic = 'force-dynamic';

import { notFound, redirect, permanentRedirect } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, searchProducts, type CustomTab, type Product } from '@/lib/woocommerce';
import { preferredProductCategory, hasApprovedCategory, isExcludedCategory, REDIRECTED_CATEGORIES } from '@/lib/seoTaxonomy';

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

    // Non-core products (belonging only to excluded/non-core categories) are
    // not part of the SEO catalogue. If the route remains accessible, set
    // noindex, follow rather than allowing duplicate indexable content.
    if (!hasApprovedCategory(product.categories as Array<{ slug: string }> | undefined)) {
      const siteBase = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
      return {
        title: `${product.name} – PRAG B2B`,
        alternates: { canonical: `${siteBase}/products/${product.categories?.[0]?.slug ?? 'products'}/${product.slug}` },
        robots: { index: false, follow: true },
      };
    }

    const description = product.short_description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
      || product.description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
      || `${product.name} — available from PRAG. Enterprise-grade power engineering solutions for businesses.`;
    const imageUrl = product.images?.[0]?.src;
    const siteBase = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
    // Use the deterministic preferred SEO category for the canonical URL,
    // not the first WooCommerce category (which may be "sales" or another
    // non-canonical category).
    const categorySlug = preferredProductCategory(product.categories as Array<{ slug: string }> | undefined, product.slug);
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

  // Redirected categories (e.g. all-prag-stabilizers) should never serve a
  // product page — redirect to the canonical category.
  if (category in REDIRECTED_CATEGORIES) {
    permanentRedirect(`/products/${REDIRECTED_CATEGORIES[category]}/${slug}`);
  }

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
        const categorySlug = preferredProductCategory(match.categories as Array<{ slug: string }> | undefined, match.slug);
        redirect(`/products/${categorySlug}/${match.slug}`);
      }
    } catch {
      // Search failed, fall through to notFound
    }
    notFound();
  }

  // Product canonical-path audit: if the product is accessible through a
  // non-preferred category path, permanently redirect to the preferred URL.
  // This prevents duplicate indexable copies of the same product.
  // Non-core products (no approved category) are exempt — they are noindex
  // and not redirected, since there is no preferred canonical path for them.
  const preferredCat = preferredProductCategory(product.categories as Array<{ slug: string }> | undefined, product.slug);
  if (preferredCat !== 'products' && category !== preferredCat) {
    permanentRedirect(`/products/${preferredCat}/${slug}`);
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

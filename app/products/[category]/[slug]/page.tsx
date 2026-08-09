export const dynamic = 'force-dynamic';

import { notFound, redirect, permanentRedirect } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import JsonLd from '@/components/JsonLd';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, searchProducts, type CustomTab, type Product } from '@/lib/woocommerce';
import { preferredProductCategory, hasApprovedCategory, isExcludedCategory, REDIRECTED_CATEGORIES } from '@/lib/seoTaxonomy';
import { resolveProductSeo, buildMetadata, buildProductJsonLd, buildBreadcrumbJsonLd, getAdminSeoOverride, CATEGORY_DISPLAY, SITE_BASE } from '@/lib/seoMeta';
import { getB2BPublicContent } from '@/lib/b2bContent';

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
    if (!product) return { title: { absolute: 'Product | PRAG' } };

    // Non-core products (belonging only to excluded/non-core categories) are
    // not part of the SEO catalogue. If the route remains accessible, set
    // noindex, follow rather than allowing duplicate indexable content.
    if (!hasApprovedCategory(product.categories as Array<{ slug: string }> | undefined)) {
      const categorySlug = product.categories?.[0]?.slug ?? 'products';
      return buildMetadata({
        title: `${product.name} | PRAG`,
        description: '',
        canonical: `${SITE_BASE}/products/${categorySlug}/${product.slug}`,
        ogTitle: `${product.name} | PRAG`,
        ogDescription: '',
        robotsIndex: false,
      });
    }

    const categorySlug = preferredProductCategory(product.categories as Array<{ slug: string }> | undefined, product.slug);
    const imageUrl = product.images?.[0]?.src;
    const content = await getB2BPublicContent();
    const override = getAdminSeoOverride(content?.seoOverrides, `/products/${categorySlug}/${product.slug}`);

    const seo = resolveProductSeo(
      product.name,
      product.slug,
      categorySlug,
      product.short_description,
      product.description,
      imageUrl,
      override,
    );

    return buildMetadata({
      title: seo.title,
      description: seo.description,
      canonical: seo.canonical,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
    });
  } catch {
    return { title: { absolute: 'Product | PRAG' } };
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

  // Build Product + Offer and BreadcrumbList JSON-LD from real WC data.
  // No invented ratings/reviews.
  const categoryName = CATEGORY_DISPLAY[preferredCat]?.name ?? preferredCat;
  const canonicalUrl = `${SITE_BASE}/products/${preferredCat}/${product.slug}`;
  const cleanDescription = product.short_description?.replace(/<[^>]+>/g, '').trim() ||
    product.description?.replace(/<[^>]+>/g, '').trim() ||
    `${product.name} — available from PRAG Nigeria.`;

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: cleanDescription.slice(0, 500),
    url: canonicalUrl,
    image: product.images?.[0]?.src,
    sku: product.sku || undefined,
    price: product.price || undefined,
    currency: 'NGN',
    availability: product.stock_status || undefined,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_BASE}/` },
    { name: 'Products', url: `${SITE_BASE}/products` },
    { name: categoryName, url: `${SITE_BASE}/products/${preferredCat}` },
    { name: product.name, url: canonicalUrl },
  ]);

  return (
    <main className="w-full bg-white flex flex-col">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <ProductDetailView product={product} related={relatedFiltered} reviews={reviews} techDocs={techDocs} customTabs={customTabs} />
    </main>
  );
}

'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getShopProductUrl } from '@/lib/woocommerce';
import type { Product, ProductReview, TechDocument, CustomTab } from '@/lib/woocommerce';
import { preferredProductCategory } from '@/lib/seoTaxonomy';
import B2BProductCard from './B2BProductCard';

function cleanHtml(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
}

function splitReviewContent(reviewHtml: string): { title: string; body: string } {
  const plain = reviewHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return { title: '', body: '' };

  const sentence = plain.match(/^(.{12,110}?[.!?])\s*(.*)$/);
  if (sentence) {
    return {
      title: sentence[1].replace(/[.!?]+$/, '').trim(),
      body: sentence[2].trim(),
    };
  }

  return { title: plain.slice(0, 96).trim(), body: plain };
}

const TABS = ['Description', 'Specifications', 'Technical Resources', 'Reviews'];

interface Props {
  product: Product;
  related: Product[];
  reviews: ProductReview[];
  techDocs: TechDocument[];
  customTabs?: CustomTab[];
}

export default function ProductDetailView({ product, related, reviews, techDocs, customTabs }: Props) {
  const [activeTab, setActiveTab] = useState('Description');
  const [qty, setQty] = useState(1);
  const [reviewItems, setReviewItems] = useState<ProductReview[]>(reviews);
  const [reviewForm, setReviewForm] = useState({ reviewer: '', reviewer_email: '', rating: 5, review: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewNotice, setReviewNotice] = useState('');
  const pageUrl = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.href : ''),
    () => ''
  );

  const images = product.images ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const image = images[activeImage] ?? images[0];
  const buyNowHref = getShopProductUrl(product);
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isOutOfStock = product.stock_status === 'outofstock' || !hasPrice;
  const isRecentlyCreated = (() => {
    if (!product.date_created) return false;
    const created = new Date(product.date_created);
    const threshold = new Date('2026-07-28T00:00:00.000Z');
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return created >= threshold && diffDays <= 30;
  })();

  // Use the preferred SEO category for breadcrumb, not the first WooCommerce
  // category (which may be "Sales!" or another non-canonical category).
  const preferredCatSlug = preferredProductCategory(product.categories as Array<{ slug: string }> | undefined, product.slug);
  const preferredCat = product.categories?.find((c) => c.slug === preferredCatSlug);
  const catName = preferredCat?.name ?? '';
  const catSlug = preferredCatSlug === 'products' ? '' : preferredCatSlug;

  async function handleSubmitReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReviewNotice('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/product/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          reviewer: reviewForm.reviewer,
          reviewer_email: reviewForm.reviewer_email,
          rating: reviewForm.rating,
          review: reviewForm.review,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewNotice(data?.error ?? 'Unable to submit review. Please try again.');
        return;
      }

      const submitted = data?.review as ProductReview | undefined;
      if (submitted && submitted.id) {
        setReviewItems((prev) => [submitted, ...prev]);
        setReviewNotice('Review submitted successfully.');
      } else {
        setReviewNotice('Review submitted successfully. It may appear after moderation.');
      }

      setReviewForm({ reviewer: '', reviewer_email: '', rating: 5, review: '' });
    } catch {
      setReviewNotice('Unable to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="w-full flex flex-col">

      {/* ── Breadcrumb ── */}
      <div className="w-full px-6 md:px-10 lg:px-20 py-4">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap">
          <Link
            href="/products"
            className="text-[#0166a5] font-['Onest'] text-[24px] font-medium leading-none hover:underline"
          >
            Product
          </Link>
          <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="text-[#888888] shrink-0" aria-hidden="true">
            <path d="M1 1L7 9L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {catName && catSlug && (
            <>
              <Link
                href={`/products/${catSlug}`}
                className="text-[#888888] font-['Onest'] text-[16px] font-medium hover:text-[#0166a5] transition-colors"
              >
                {catName}
              </Link>
              <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="text-[#888888] shrink-0" aria-hidden="true">
                <path d="M1 1L7 9L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
          <span className="text-[#888888] font-['Onest'] text-[16px] font-medium line-clamp-1 min-w-0 flex-1">
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Hero: Image + Info ── */}
      <div className="w-full px-6 md:px-10 lg:px-20 pt-6 md:pt-10 pb-10 md:pb-14">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* Product Image + Gallery */}
          <div className="w-full lg:w-[52%] shrink-0 flex flex-col gap-3">
            <div className="relative w-full aspect-[302/275] rounded-[16px] flex items-center justify-center overflow-hidden">
              {image ? (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt || product.name}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 52vw"
                  quality={90}
                  priority
                />
              ) : (
                <div className="w-24 h-24 rounded-full" />
              )}
              <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                {product.on_sale && (
                  <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-600 text-white text-sm md:text-base font-bold font-['Onest'] uppercase flex items-center justify-center leading-none shadow-sm">
                    SALE
                  </span>
                )}
                {isRecentlyCreated && !product.on_sale && (
                  <span className="px-3 py-1.5 rounded-full bg-[#0d7c34] text-white text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-wide shadow-sm">
                    New
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      i === activeImage ? 'border-[#0166a5]' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <Image src={img.src} alt={img.alt || product.name} fill sizes="80px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Title + Price + Description */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-black font-['Onest'] text-[28px] md:text-[40px] font-medium leading-tight">
                  {product.name}
                </h1>
                {product.sku && (
                  <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 font-['Space_Grotesk'] text-[13px] font-medium tracking-wide">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {product.on_sale && product.regular_price && (
                  <span className="text-zinc-400 font-['Onest'] text-[30px] font-light line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
                {hasPrice ? (
                  <span className="text-[#0166a5] font-['Onest'] text-[28px] font-semibold leading-none">
                    {formatPrice(product.price)}
                  </span>
                ) : (
                  <span className="text-[#0166a5] font-['Onest'] text-lg font-medium uppercase tracking-wide">
                    Call for Price
                  </span>
                )}
              </div>

              {product.short_description && (
                <div
                  className="text-[#787878] font-['Onest'] text-[18px] font-normal leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(product.short_description) }}
                />
              )}
            </div>

            {/* Quantity Stepper */}
            <div
              className="flex items-center justify-between w-[158px] h-[50px] rounded-[24px] border border-[rgba(136,136,136,0.4)] px-5"
              role="group"
              aria-label="Quantity"
            >
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="text-[#888888] text-xl font-light leading-none flex items-center justify-center w-5 h-5 hover:text-[#444444] transition-colors"
              >
                <span className="block w-2.5 h-px bg-current" aria-hidden="true" />
              </button>
              <span className="text-[#0166a5] font-['Inter'] text-[16px] font-medium select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                aria-label="Increase quantity"
                className="text-[#0166a5] text-xl font-medium leading-none flex items-center justify-center w-5 h-5 hover:opacity-70 transition-opacity"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <path d="M5.5 1V10M1 5.5H10" stroke="#0166a5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:hidden">
              <a
                href={isOutOfStock ? undefined : buyNowHref}
                target={isOutOfStock ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-disabled={isOutOfStock}
                className={`w-full h-[66px] px-6 rounded-[24px] flex items-center justify-center gap-3 transition-colors font-['Space_Grotesk'] text-[18px] font-medium leading-none whitespace-nowrap ${
                  isOutOfStock
                    ? 'bg-[#0166a5]/50 cursor-not-allowed'
                    : 'bg-[#0166a5] hover:bg-[#015490]'
                } text-white`}
              >
                Buy Now
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M1 5H12M8 1L12 5L8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="https://wa.me/2348032170129"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[66px] px-6 rounded-[24px] border border-[#0166a5] flex items-center justify-center gap-3 text-[#0166a5] hover:bg-[#0166a5]/5 transition-colors font-['Space_Grotesk'] text-[18px] font-medium leading-none whitespace-nowrap"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact sales
              </a>
            </div>
            <div className="hidden sm:flex sm:flex-row gap-4">
              <a
                href={isOutOfStock ? undefined : buyNowHref}
                target={isOutOfStock ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-disabled={isOutOfStock}
                className={`flex-1 h-14 px-6 rounded-[24px] flex items-center justify-center gap-3 transition-colors font-['Space_Grotesk'] text-[16px] font-medium leading-none whitespace-nowrap ${
                  isOutOfStock
                    ? 'bg-[#0166a5]/50 cursor-not-allowed'
                    : 'bg-[#0166a5] hover:bg-[#015490]'
                } text-white`}
              >
                Buy Now
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M1 5H12M8 1L12 5L8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="https://wa.me/2348032170129"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 px-6 rounded-[24px] border border-[#0166a5] flex items-center justify-center gap-3 text-[#0166a5] hover:bg-[#0166a5]/5 transition-colors font-['Space_Grotesk'] text-[16px] font-medium leading-none whitespace-nowrap"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact sales
              </a>
            </div>

            {/* Share to */}
            <div className="flex items-center gap-3 md:gap-5">
              <span className="text-[#888888] font-['Space_Grotesk'] text-[18px] font-medium">Share to</span>
              <div className="flex items-center gap-5 md:gap-5">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="text-[#444444] hover:text-[#0166a5] transition-colors"
                >
                  <svg className="w-8 h-8 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/prag_ng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PRAG on Instagram"
                  className="text-[#444444] hover:text-[#0166a5] transition-colors"
                >
                  <svg className="w-8 h-8 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="text-[#444444] hover:text-[#0166a5] transition-colors"
                >
                  <svg className="w-8 h-8 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" />
                  </svg>
                </a>
                {/* X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="text-[#444444] hover:text-[#0166a5] transition-colors"
                >
                  <svg className="w-8 h-8 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.901 2H22l-6.768 7.737L23.2 22h-6.24l-4.887-7.498L5.51 22H2.4l7.24-8.275L2 2h6.398l4.418 6.83L18.901 2zm-1.095 18h1.717L7.47 3.895H5.628L17.806 20z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${pageUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                  className="text-[#444444] hover:text-[#0166a5] transition-colors"
                >
                  <svg className="w-8 h-8 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.8 11.8 0 0012.04 0C5.62 0 .39 5.23.39 11.65c0 2.06.54 4.08 1.57 5.86L0 24l6.66-1.88a11.6 11.6 0 005.37 1.37h.01c6.42 0 11.65-5.22 11.65-11.64a11.6 11.6 0 00-3.17-8.37zM12.05 21.5h-.01a9.66 9.66 0 01-4.93-1.35l-.35-.21-3.95 1.12 1.06-3.85-.23-.39a9.67 9.67 0 01-1.49-5.16c0-5.34 4.35-9.68 9.7-9.68 2.59 0 5.02 1.01 6.85 2.84a9.61 9.61 0 012.84 6.84c0 5.34-4.35 9.69-9.69 9.69zm5.31-7.27c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.19-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.15-.66-1.6-.9-2.19-.24-.57-.49-.49-.66-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.44 1.05 2.83 1.2 3.02.14.19 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.23 1.33.19 1.83.12.56-.09 1.72-.71 1.96-1.39.24-.68.24-1.26.17-1.39-.07-.12-.26-.19-.56-.34z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="w-full px-6 md:px-10 lg:px-20 pb-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="w-full rounded-[16px] border border-[#c4c7cc] flex flex-col gap-6 p-8">

            {/* Tab Bar */}
            <div className="flex border-b border-[#c4c7cc] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="inline-flex flex-col items-center shrink-0 mr-8 last:mr-0"
                  >
                    <span
                      className={`pb-3 font-['Space_Grotesk'] text-[18px] md:text-[24px] font-medium whitespace-nowrap transition-colors ${
                        isActive ? 'text-[#0166a5]' : 'text-[#888888] hover:text-[#444444]'
                      }`}
                    >
                      {tab}
                    </span>
                    <div
                      className={`h-[2px] w-full rounded-full transition-colors ${
                        isActive ? 'bg-[#0166a5]' : 'bg-[#e4e7ec]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'Description' && (
                <div
                  className="product-prose"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(product.description || product.short_description) }}
                />
              )}

              {activeTab === 'Specifications' && (
                customTabs && customTabs.length > 0 ? (
                  <div className="w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="wp-content text-[16px] font-['Space_Grotesk'] leading-relaxed min-w-[320px]"
                      dangerouslySetInnerHTML={{ __html: cleanHtml(customTabs.map(t => t.content).join('\n')) }} />
                  </div>
                ) : product.attributes && product.attributes.length > 0 ? (
                  <div className="w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full min-w-[320px] font-['Space_Grotesk'] text-[16px]">
                      <tbody>
                        {product.weight && (
                          <tr className="border-b border-[#c4c7cc]">
                            <td className="py-3 pr-6 text-[#888888] font-medium w-40 md:w-56">Weight</td>
                            <td className="py-3 text-[#1a1a1a] break-words">{product.weight} kg</td>
                          </tr>
                        )}
                        {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                          <tr className="border-b border-[#c4c7cc]">
                            <td className="py-3 pr-6 text-[#888888] font-medium w-40 md:w-56">Dimensions</td>
                            <td className="py-3 text-[#1a1a1a] break-words">
                              {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                            </td>
                          </tr>
                        )}
                        {product.attributes.map(attr => (
                          <tr key={attr.id} className="border-b border-[#c4c7cc] last:border-0">
                            <td className="py-3 pr-6 text-[#888888] font-medium w-40 md:w-56">{attr.name}</td>
                            <td className="py-3 text-[#1a1a1a] break-words">{attr.options.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#888888] font-['Space_Grotesk'] text-[18px]">No specifications available.</p>
                )
              )}

              {activeTab === 'Technical Resources' && (
                techDocs.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {techDocs.map(doc => (
                      <div
                        key={doc.id}
                        className="w-full rounded-2xl border border-[#c4c7cc] px-5 py-4 flex items-center justify-between gap-4 bg-white"
                      >
                        <span className="text-[#1a1a1a] font-['Space_Grotesk'] text-[18px] font-medium">{doc.title}</span>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 px-5 rounded-[24px] bg-[#0166a5]/10 text-[#0166a5] font-['Space_Grotesk'] text-sm font-medium inline-flex items-center justify-center hover:bg-[#0166a5]/20 transition-colors shrink-0"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#888888] font-['Space_Grotesk'] text-[18px]">No technical documents available.</p>
                )
              )}

              {activeTab === 'Reviews' && (
                <div className="flex flex-col gap-8">
                  {reviewItems.length > 0 ? (
                    reviewItems.map((review) => {
                      const chunks = splitReviewContent(review.review);
                      return (
                        <div key={review.id} className="flex flex-col gap-2.5 pb-7 border-b border-[#c4c7cc] last:border-0">
                          <span className="text-[#1a1a1a] text-lg md:text-xl font-semibold font-['Onest']">{review.reviewer}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[#888888] text-base font-normal font-['Onest']" suppressHydrationWarning>
                              {new Date(review.date_created).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                          {chunks.title && (
                            <h4 className="text-[#1a1a1a] text-xl md:text-2xl font-semibold font-['Onest']">{chunks.title}</h4>
                          )}
                          <p className="text-[#475367] text-lg font-normal font-['Onest']">{chunks.body || chunks.title}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[#888888] font-['Space_Grotesk'] text-[18px]">No reviews yet.</p>
                  )}

                  <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#c4c7cc]">
                    <h3 className="text-[#1a1a1a] text-lg font-semibold font-['Onest']">Write a Review</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={reviewForm.reviewer}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, reviewer: e.target.value }))}
                        placeholder="Your name"
                        required
                        className="h-11 px-4 rounded-[12px] border border-[#c4c7cc] bg-white font-['Space_Grotesk'] text-sm outline-none focus:border-[#0166a5] transition-colors"
                      />
                      <input
                        type="email"
                        value={reviewForm.reviewer_email}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, reviewer_email: e.target.value }))}
                        placeholder="Your email"
                        required
                        className="h-11 px-4 rounded-[12px] border border-[#c4c7cc] bg-white font-['Space_Grotesk'] text-sm outline-none focus:border-[#0166a5] transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#444444] font-['Space_Grotesk'] text-base">Rating</span>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="h-10 px-3 rounded-[12px] border border-[#c4c7cc] bg-white font-['Space_Grotesk'] text-sm outline-none focus:border-[#0166a5]"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                      </select>
                    </div>

                    <textarea
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, review: e.target.value }))}
                      placeholder="Share your experience with this product"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-[12px] border border-[#c4c7cc] bg-white font-['Space_Grotesk'] text-sm outline-none focus:border-[#0166a5] transition-colors resize-y"
                    />

                    <div className="flex items-center justify-end gap-4">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="h-11 px-6 bg-[#0166a5] text-white font-['Space_Grotesk'] text-sm font-medium rounded-[24px] hover:bg-[#015490] disabled:opacity-60 transition-colors"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>

                    {reviewNotice && (
                      <p className="font-['Space_Grotesk'] text-base text-[#0166a5]">{reviewNotice}</p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="w-full px-6 md:px-10 lg:px-20 pb-14">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
            <h2 className="text-[#444444] font-['Onest'] text-[32px] md:text-[40px] font-medium leading-tight">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {related.map(p => (
                <B2BProductCard key={p.id} product={p} listingMode />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

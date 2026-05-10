import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/woocommerce';
import { formatPrice, getShopProductUrl } from '@/lib/woocommerce';

export default function B2BProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const isOutOfStock = product.stock_status === 'outofstock';
  const hasNewTag = product.tags?.some(t => t.slug === 'new' || t.name.toLowerCase().includes('new'));
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isUnavailable = isOutOfStock || !hasPrice;
  const detailsHref = `/products/${product.categories[0]?.slug ?? 'products'}/${product.slug}`;
  const buyHref = getShopProductUrl(product);

  return (
    <div className="w-full relative flex flex-col gap-2 md:gap-3 group rounded-xl p-1.5 bg-transparent hover:shadow-sm transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-[300px] md:h-[330px] rounded-lg overflow-hidden flex items-center justify-center bg-stone-50">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            width={500}
            height={500}
            sizes="(min-width: 768px) 500px, 100vw"
            className="w-full h-full object-contain p-1 md:p-1 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          />
        ) : (
          <div className="w-40 h-40 bg-zinc-200 rounded-full" />
        )}

        {/* Badges */}
        <div className="absolute top-2 md:top-14 left-2 md:left-3 flex flex-col gap-1 z-10">
          {isOutOfStock && (
            <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Space_Grotesk'] uppercase">
              Out of stock
            </span>
          )}
          {product.on_sale && !isOutOfStock && (
            <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 text-white text-xs md:text-sm font-bold font-['Space_Grotesk'] uppercase tracking-tight flex items-center justify-center leading-none">
              Sale
            </span>
          )}
          {hasNewTag && !isOutOfStock && !product.on_sale && (
            <span className="px-2 py-1 rounded-full bg-lime-700 text-white text-[10px] font-semibold font-['Space_Grotesk'] uppercase">
              New
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-1 pb-2 pt-2 md:pt-3">
        <p className="text-zinc-900 text-base font-semibold font-['Onest'] leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors text-center">
          {product.name}
        </p>
        <div className="flex items-center justify-center gap-2 mt-0">
          {product.on_sale && product.regular_price && (
            <span className="text-zinc-400 text-xs line-through font-['Onest']">
              {formatPrice(product.regular_price)}
            </span>
          )}
          {hasPrice ? (
            <span className="text-zinc-900 text-base md:font-medium font-['Onest']">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-rose-700 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-wide">Out of stock</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-1.5 md:mt-2">
          <Link
            href={detailsHref}
            className="min-w-[108px] px-4 py-2 bg-sky-700 rounded-full text-white text-sm font-medium font-['Space_Grotesk'] text-center hover:bg-sky-800 transition-colors"
          >
            Learn more
          </Link>
          <a
            href={buyHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-w-[78px] px-3 py-2 rounded-full text-sm font-medium font-['Space_Grotesk'] text-center transition-colors border border-sky-700 ${isUnavailable ? 'text-sky-700/50 border-sky-700/40 pointer-events-none' : 'text-sky-700 hover:bg-sky-50'}`}
          >
            Buy &gt;
          </a>
        </div>
      </div>
    </div>
  );
}

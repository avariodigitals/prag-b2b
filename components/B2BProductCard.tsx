import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/woocommerce';
import { formatPrice, getShopProductUrl } from '@/lib/woocommerce';

interface Props {
  product: Product;
  listingMode?: boolean;
}

export default function B2BProductCard({ product, listingMode = false }: Props) {
  const image = product.images?.[0];
  const isOutOfStock = product.stock_status === 'outofstock';
  const hasNewTag = product.tags?.some(t => t.slug === 'new' || t.name.toLowerCase().includes('new'));
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isUnavailable = isOutOfStock || !hasPrice;
  const detailsHref = `/products/${product.categories[0]?.slug ?? 'products'}/${product.slug}`;
  const buyHref = getShopProductUrl(product);

  const splitName = (() => {
    if (!listingMode) return null;
    const idx = product.name.indexOf('(');
    if (idx === -1 || product.name.length < 30) return null;
    return {
      before: product.name.slice(0, idx).trim(),
      after: product.name.slice(idx),
    };
  })();

  return (
    <div className="w-full relative flex flex-col gap-0 group">
      {/* Image container */}
      <div className="relative w-full aspect-[302/275] rounded-lg overflow-hidden flex items-center justify-center">
        <Link href={detailsHref} aria-label={`View details for ${product.name}`} className="block w-full h-full">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={90}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-lg">
              <span className="text-zinc-400 text-sm font-['Space_Grotesk']">No image</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isOutOfStock && (
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wide border border-rose-300">
              Out of stock
            </span>
          )}
          {product.on_sale && !isOutOfStock && (
            <span className="w-12 h-12 rounded-full bg-red-600 text-white text-sm font-bold font-['Onest'] uppercase flex items-center justify-center leading-none">
              SALE
            </span>
          )}
          {hasNewTag && !isOutOfStock && !product.on_sale && (
            <span className="px-3 py-1 rounded-full bg-[#0d7c34] text-white text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wide">
              New !
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 pt-4 pb-2 px-1">
        {/* Name */}
        <Link href={detailsHref} aria-label={`View details for ${product.name}`}>
          <p className="text-[#1a1a1a] text-[18px] font-medium font-['Onest'] leading-snug line-clamp-2 text-center group-hover:text-[#0166a5] transition-colors">
            {splitName ? (
              <>
                <span className="hidden md:inline">{splitName.before}</span>
                <br className="hidden md:block" />
                <span className="hidden md:inline">{splitName.after}</span>
                <span className="md:hidden">{product.name}</span>
              </>
            ) : product.name}
          </p>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          {product.on_sale && product.regular_price && (
            <span className="text-zinc-400 text-sm line-through font-['Onest']">
              {formatPrice(product.regular_price)}
            </span>
          )}
          {hasPrice ? (
            <span className="text-[#1a1a1a] text-[15px] font-light font-['Onest']">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-[#0166a5] text-sm font-medium font-['Onest'] uppercase tracking-wide">
              Call for Price
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center mt-1 justify-center">
          <Link
            href={detailsHref}
            className="px-5 py-2 bg-[#0166a5] rounded-full text-white text-sm font-medium font-['Space_Grotesk'] text-center hover:bg-[#015490] transition-colors whitespace-nowrap"
          >
            Learn more
          </Link>
          {!listingMode && (
            <a
              href={isUnavailable ? undefined : buyHref}
              target={isUnavailable ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-disabled={isUnavailable}
              className={`ml-[14px] text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap transition-colors ${
                isUnavailable
                  ? 'text-[#0166a5]/40 pointer-events-none'
                  : 'text-[#0166a5] hover:text-[#015490]'
              }`}
            >
              Buy &gt;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

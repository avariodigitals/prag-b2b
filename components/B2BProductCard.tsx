import Image from 'next/image';
import type { Product } from '@/lib/woocommerce';
import { formatPrice } from '@/lib/woocommerce';

export default function B2BProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const isOutOfStock = product.stock_status === 'outofstock';
  const hasNewTag = product.tags?.some(t => t.slug === 'new' || t.name.toLowerCase().includes('new'));
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;

  return (
    <div className="flex flex-col gap-3 group">
      {/* Image */}
      <div className="relative w-full aspect-square bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          />
        ) : (
          <div className="w-20 h-20 bg-zinc-200 rounded-full" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Space_Grotesk'] uppercase">
              Out of stock
            </span>
          )}
          {product.on_sale && !isOutOfStock && (
            <span className="px-2 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold font-['Space_Grotesk'] uppercase">
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
      <div className="flex flex-col gap-1.5 text-center">
        <p className="text-zinc-900 text-sm md:text-base font-semibold font-['Onest'] line-clamp-2 group-hover:text-sky-700 transition-colors">
          {product.name}
        </p>
        <div className="flex items-center justify-center gap-2">
          {product.on_sale && product.regular_price && (
            <span className="text-zinc-400 text-xs line-through font-['Onest']">
              {formatPrice(product.regular_price)}
            </span>
          )}
          {hasPrice ? (
            <span className="text-zinc-900 text-sm font-medium font-['Onest']">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-rose-600 text-xs font-semibold font-['Space_Grotesk'] uppercase">Out of stock</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <a
        href={`/products/${product.categories[0]?.slug ?? 'products'}/${product.slug}`}
        className="mx-auto px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium font-['Space_Grotesk'] rounded-full transition-colors"
      >
        Learn more
      </a>
    </div>
  );
}

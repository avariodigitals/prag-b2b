'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/woocommerce';
import type { Product, ProductReview, TechDocument } from '@/lib/woocommerce';
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

const TABS = ['Description', 'Specifications', 'Technical Resources', 'Reviews'];

interface Props {
  product: Product;
  related: Product[];
  reviews: ProductReview[];
  techDocs: TechDocument[];
}

export default function ProductDetailView({ product, related, reviews, techDocs }: Props) {
  const [activeTab, setActiveTab] = useState('Description');
  const [qty, setQty] = useState(1);
  const [reviewItems] = useState<ProductReview[]>(reviews);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => { setPageUrl(window.location.href); }, []);

  const image = product.images?.[0];
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isOutOfStock = product.stock_status === 'outofstock' || !hasPrice;

  return (
    <div className="w-full px-6 md:px-20 py-10 flex flex-col gap-10">

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Image */}
        <div className="w-full md:w-[480px] h-72 md:h-[420px] relative bg-stone-50 rounded-2xl overflow-hidden shrink-0 border border-zinc-100">
          {image && (
            <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 768px) 100vw, 480px" priority className="object-contain p-6" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h1 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              {product.on_sale && product.regular_price && (
                <span className="text-zinc-400 text-sm line-through font-['Onest']">{formatPrice(product.regular_price)}</span>
              )}
              {hasPrice ? (
                <span className="text-sky-700 text-xl font-semibold font-['Onest']">{formatPrice(product.price)}</span>
              ) : (
                <span className="text-rose-600 text-sm font-semibold font-['Space_Grotesk'] uppercase">Out of stock</span>
              )}
            </div>
            {product.short_description && (
              <div className="text-zinc-500 text-sm leading-relaxed font-['Space_Grotesk']"
                dangerouslySetInnerHTML={{ __html: cleanHtml(product.short_description) }} />
            )}
          </div>

          {/* Qty */}
          <div className="w-36 h-10 px-3 bg-stone-50 rounded-full border border-zinc-200 flex items-center justify-between">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
              <Minus className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase">
              <Plus className="w-3.5 h-3.5 text-sky-700" />
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <a
                href={`https://prag.global/product/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full flex items-center justify-center gap-2 transition-colors"
              >
                Buy Now →
              </a>
              <a
                href="https://wa.me/2348032170129"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Space_Grotesk'] rounded-full flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact sales
              </a>
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm font-['Space_Grotesk']">Share to</span>
            <div className="flex items-center gap-2">
              {[
                { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${product.name} ${pageUrl}`)}`, icon: <path d="M20.52 3.48A11.8 11.8 0 0012.04 0C5.62 0 .39 5.23.39 11.65c0 2.06.54 4.08 1.57 5.86L0 24l6.66-1.88a11.6 11.6 0 005.37 1.37h.01c6.42 0 11.65-5.22 11.65-11.64a11.6 11.6 0 00-3.17-8.37zM12.05 21.5h-.01a9.66 9.66 0 01-4.93-1.35l-.35-.21-3.95 1.12 1.06-3.85-.23-.39a9.67 9.67 0 01-1.49-5.16c0-5.34 4.35-9.68 9.7-9.68 2.59 0 5.02 1.01 6.85 2.84a9.61 9.61 0 012.84 6.84c0 5.34-4.35 9.69-9.69 9.69z" /> },
                { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></> },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:text-sky-700 hover:border-sky-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200 flex flex-col">
        <div className="border-b border-zinc-200 flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="inline-flex flex-col items-center shrink-0">
              <span className={`px-4 py-3.5 text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${activeTab === tab ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-800'}`}>
                {tab}
              </span>
              <div className={`h-0.5 w-full ${activeTab === tab ? 'bg-sky-700' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'Description' && (
            <div className="prose prose-sm max-w-none text-zinc-700 font-['Space_Grotesk']"
              dangerouslySetInnerHTML={{ __html: cleanHtml(product.description || product.short_description) }} />
          )}

          {activeTab === 'Specifications' && (
            product.attributes && product.attributes.length > 0 ? (
              <table className="w-full text-sm font-['Space_Grotesk']">
                <tbody>
                  {product.weight && (
                    <tr className="border-b border-zinc-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium w-48">Weight</td>
                      <td className="py-3 text-zinc-800">{product.weight} kg</td>
                    </tr>
                  )}
                  {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                    <tr className="border-b border-zinc-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium w-48">Dimensions</td>
                      <td className="py-3 text-zinc-800">{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm</td>
                    </tr>
                  )}
                  {product.attributes.map(attr => (
                    <tr key={attr.id} className="border-b border-zinc-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium w-48">{attr.name}</td>
                      <td className="py-3 text-zinc-800">{attr.options.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-zinc-400 font-['Space_Grotesk']">No specifications available.</p>
            )
          )}

          {activeTab === 'Technical Resources' && (
            techDocs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {techDocs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200">
                    <span className="text-zinc-800 text-sm font-medium font-['Onest']">{doc.title}</span>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 bg-sky-50 text-sky-700 text-sm font-medium font-['Space_Grotesk'] rounded-lg hover:bg-sky-100 transition-colors">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 font-['Space_Grotesk']">No technical documents available.</p>
            )
          )}

          {activeTab === 'Reviews' && (
            <div className="flex flex-col gap-6">
              {reviewItems.length > 0 ? reviewItems.map(review => (
                <div key={review.id} className="flex flex-col gap-2 pb-6 border-b border-zinc-100 last:border-0">
                  <span className="text-zinc-900 font-semibold font-['Onest']">{review.reviewer}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-zinc-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-zinc-400 text-xs font-['Space_Grotesk']">
                      {new Date(review.date_created).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-sm font-['Space_Grotesk']" dangerouslySetInnerHTML={{ __html: cleanHtml(review.review) }} />
                </div>
              )) : (
                <p className="text-zinc-400 font-['Space_Grotesk']">No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Onest']">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <B2BProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

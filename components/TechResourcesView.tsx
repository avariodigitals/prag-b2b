'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Download, FileText } from 'lucide-react';
import type { Product, TechDocument } from '@/lib/woocommerce';

interface Props {
  products: Product[];
  selectedSlug?: string;
}

export default function TechResourcesView({ products, selectedSlug }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(selectedSlug ?? '');
  const selectedProduct = products.find(p => p.slug === slug);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSlug(e.target.value);
    router.push(`/resources?product=${e.target.value}`);
  }

  return (
    <div className="w-full px-6 md:px-20 py-10 md:py-16 flex flex-col gap-10">
      {/* Product selector */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sky-700 rounded-sm" />
          <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Select Product</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-zinc-900 text-2xl font-bold font-['Onest'] shrink-0">Product:</span>
          <div className="relative w-full md:w-[420px]">
            <select value={slug} onChange={handleSelect}
              className="w-full h-12 pl-4 pr-10 bg-white rounded-xl border-2 border-sky-700 text-zinc-700 text-sm font-['Space_Grotesk'] appearance-none outline-none focus:border-sky-800">
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-sky-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedProduct
        ? <TechDocumentsPanel key={selectedProduct.id} product={selectedProduct} />
        : <p className="text-zinc-400 text-base font-['Space_Grotesk'] text-center py-10">Select a product above to view available documents.</p>
      }
    </div>
  );
}

function TechDocumentsPanel({ product }: { product: Product }) {
  const [docs, setDocs] = useState<TechDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/product/docs?id=${product.id}`)
      .then(r => r.json())
      .then(data => setDocs(data.docs ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [product.id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h2 className="text-zinc-900 text-2xl font-bold font-['Onest']">{product.name}</h2>
        {!loading && (
          <span className="text-zinc-500 text-sm font-['Space_Grotesk']">
            {docs.length} document{docs.length !== 1 ? 's' : ''} available
          </span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <svg className="w-7 h-7 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {!loading && docs.length === 0 && (
        <p className="text-zinc-400 text-sm font-['Space_Grotesk'] py-4">No documents available for this product.</p>
      )}

      {!loading && docs.length > 0 && (
        <div className="flex flex-col gap-4">
          {docs.map(doc => (
            <div key={doc.id} className="p-4 md:p-5 bg-white rounded-2xl border border-zinc-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-700 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-900 text-base font-semibold font-['Onest']">{doc.title}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {doc.file_type && <span className="text-zinc-500 text-sm font-['Space_Grotesk']">{doc.file_type.toUpperCase()}</span>}
                    {doc.file_size && <><span className="text-zinc-300">•</span><span className="text-zinc-500 text-sm font-['Space_Grotesk']">{doc.file_size}</span></>}
                    {doc.pages && <><span className="text-zinc-300">•</span><span className="text-zinc-500 text-sm font-['Space_Grotesk']">{doc.pages} pages</span></>}
                  </div>
                </div>
              </div>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-xl transition-colors w-full md:w-auto shrink-0">
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

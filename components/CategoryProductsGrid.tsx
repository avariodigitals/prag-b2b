'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import B2BProductCard from './B2BProductCard';
import type { Product } from '@/lib/woocommerce';

const SORT_OPTIONS = [
  { label: 'Sort by', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const SECTION_TABS: Record<string, { label: string; slug: string }[]> = {
  'inverters': [
    { label: 'Hybrid Inverters', slug: 'hybrid-inverters' },
    { label: 'Heavy Duty Inverters', slug: 'heavy-duty-inverters' },
  ],
  'all-prag-stabilizers': [
    { label: 'Thyristor Stabilizers', slug: 'thyristor-stabilizers' },
    { label: 'Relay Stabilizers', slug: 'relay-voltage-stabilizers' },
    { label: 'Servo Stabilizers', slug: 'servo-voltage-stabilizers' },
    { label: '3-phase Stabilizers', slug: 'advanced-stabilizers' },
  ],
  'batteries': [
    { label: 'Tubular Batteries', slug: 'tubular-batteries' },
    { label: 'Lithium Batteries', slug: 'lithium-battery' },
  ],
  'solar': [
    { label: 'Solar Charge Controllers', slug: 'solar-charge-controllers' },
    { label: 'Protective Device', slug: 'protective-device' },
    { label: 'Solar bundle Packages', slug: 'solar-panels' },
  ],
};

const ALL_LABELS: Record<string, string> = {
  'inverters': 'All inverters',
  'all-prag-stabilizers': 'All Stabilizers',
  'batteries': 'All Batteries',
  'solar': 'All Solars',
};

interface Props {
  products: Product[];
  total: number;
  categorySlug: string;
  activeSub?: string;
  activeSort?: string;
}

export default function CategoryProductsGrid({ products: init, total, categorySlug, activeSub, activeSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>(init);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(init.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);

  async function loadMore() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', categorySlug);
      params.set('page', String(page));
      params.set('per_page', '16');
      if (activeSub) params.set('sub', activeSub);
      if (activeSort) params.set('sort', activeSort);
      const res = await fetch(`/api/products/category?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(prev => {
        const ids = new Set(prev.map(p => p.id));
        return [...prev, ...data.products.filter((p: Product) => !ids.has(p.id))];
      });
      setPage(p => p + 1);
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, page, activeSub, activeSort]);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    params.delete('page');
    startTransition(() => router.push(`/products/${categorySlug}?${params}`));
  }

  const subs = SECTION_TABS[categorySlug] ?? [];
  const allLabel = ALL_LABELS[categorySlug] ?? 'All';
  const tabs = [{ label: allLabel, slug: undefined }, ...subs];

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Subcategory tabs — desktop */}
        <div className="hidden md:flex border-b border-zinc-200 overflow-x-auto flex-1">
          {tabs.map(tab => {
            const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
            return (
              <button key={tab.label} onClick={() => navigate({ sub: tab.slug })}
                className="inline-flex flex-col items-center shrink-0">
                <span className={`px-4 py-3 text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${isActive ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
                  {tab.label}
                </span>
                <div className={`h-0.5 w-full ${isActive ? 'bg-sky-700' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        {/* Mobile subcategory select */}
        <div className="relative md:hidden flex-1">
          <select value={activeSub ?? ''} onChange={e => navigate({ sub: e.target.value || undefined })}
            className="appearance-none w-full h-10 px-3 pr-8 bg-white rounded-full border border-sky-700 text-sky-700 text-xs font-medium font-['Space_Grotesk'] outline-none">
            {tabs.map(tab => <option key={tab.label} value={tab.slug ?? ''}>{tab.label}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-sky-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select value={activeSort ?? ''} onChange={e => navigate({ sort: e.target.value || undefined })}
            className="appearance-none h-10 px-3 pr-8 bg-white rounded-lg border border-zinc-300 text-zinc-600 text-sm font-['Space_Grotesk'] outline-none cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square bg-stone-100 rounded-xl" />
              <div className="h-3 w-3/4 bg-stone-200 rounded" />
              <div className="h-3 w-1/2 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-zinc-400 text-center py-16 font-['Space_Grotesk']">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(p => <B2BProductCard key={p.id} product={p} />)}
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex justify-center py-4">
          <svg className="w-6 h-6 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-zinc-400 text-xs font-['Space_Grotesk'] py-2">All products loaded</p>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import B2BProductCard from './B2BProductCard';
import type { Product } from '@/lib/woocommerce';
import { sortProductsBySizeThenPrice } from '@/lib/productSort';

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
    { label: 'Tabular Batteries', slug: 'tubular-batteries' },
    { label: 'Lithium Batteries', slug: 'lithium-battery' },
    { label: 'Battery Racks', slug: 'battery-rack' },
  ],
  'solar': [
    { label: 'Solar Panels', slug: 'solar-panels' },
    { label: 'Solar Charge Controllers', slug: 'solar-charge-controllers' },
    { label: 'Protective Devices', slug: 'protective-device' },
  ],
};

const ALL_LABELS: Record<string, string> = {
  'inverters': 'All inverters',
  'all-prag-stabilizers': 'All Stabilizers',
  'batteries': 'All Batteries',
  'solar': 'All Solar',
};

interface Props {
  products: Product[];
  total: number;
  categorySlug: string;
  activeSub?: string;
}

export default function CategoryProductsGrid({ products: init, total, categorySlug, activeSub }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>(sortProductsBySizeThenPrice(init));
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
      const res = await fetch(`/api/products/category?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(prev => {
        const ids = new Set(prev.map(p => p.id));
        const merged = [...prev, ...data.products.filter((p: Product) => !ids.has(p.id))];
        return sortProductsBySizeThenPrice(merged);
      });
      setPage(p => p + 1);
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setProducts(sortProductsBySizeThenPrice(init));
    setPage(2);
    setHasMore(init.length < total);
    setLoading(false);
  }, [init, total, categorySlug, activeSub]);

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
  }, [hasMore, loading, page, activeSub, categorySlug]);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    params.delete('page');
    params.delete('sort');
    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;
    startTransition(() => router.push(`/products/${categorySlug}?${next}`));
  }

  const subs = SECTION_TABS[categorySlug] ?? [];
  const allLabel = ALL_LABELS[categorySlug] ?? 'All';
  const tabs = [{ label: allLabel, slug: undefined }, ...subs];

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Subcategory tabs — desktop with category label prefix */}
        <div className="hidden md:flex items-start gap-4 overflow-x-auto">
          {subs.length > 0 && (
            <span className="text-[#0166a5] text-base font-medium font-['Space_Grotesk'] whitespace-nowrap pt-3 shrink-0 capitalize">
              {allLabel.replace(/^All /, '')}:
            </span>
          )}
          <div className="flex items-stretch gap-0 border-b border-[#e4e7ec] flex-1 overflow-x-auto">
            {tabs.map(tab => {
              const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
              return (
                <button key={tab.label} onClick={() => navigate({ sub: tab.slug })}
                  className="inline-flex flex-col items-center shrink-0">
                  <span className={`px-4 py-3 text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${isActive ? 'text-[#0166a5]' : 'text-[#888888] hover:text-[#444444]'}`}>
                    {tab.label}
                  </span>
                  <div className={`h-[2px] w-full ${isActive ? 'bg-[#0166a5]' : 'bg-[#e4e7ec]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile subcategory pills */}
        <div className="md:hidden -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-3 pr-6">
            {tabs.map(tab => {
              const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => navigate({ sub: tab.slug })}
                  className={`shrink-0 rounded-full px-6 py-3.5 text-lg font-semibold font-['Onest'] leading-none whitespace-nowrap transition-colors ${isActive ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square bg-stone-100 rounded-xl" />
              <div className="h-3 w-3/4 bg-stone-200 rounded" />
              <div className="h-3 w-1/2 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-zinc-400 text-center py-16 font-['Onest']">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(p => <B2BProductCard key={p.id} product={p} listingMode />)}
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
        <p className="text-center text-zinc-400 text-lg md:text-xl font-['Onest'] py-2">All products loaded</p>
      )}
    </div>
  );
}

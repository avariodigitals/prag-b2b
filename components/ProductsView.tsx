'use client';

import { useState } from 'react';
import B2BProductCard from './B2BProductCard';
import type { Product, Category } from '@/lib/woocommerce';
import { sortProductsBySizeThenPrice } from '@/lib/productSort';

interface Props {
  allProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  categories: Category[];
  categoryOrder?: string[];
  subcategoryOrder?: Record<string, string[]>;
}

export default function ProductsView({ allProducts, productsByCategory, categories, categoryOrder, subcategoryOrder }: Props) {
  const [activeTop, setActiveTop] = useState('all');
  const [activeSub, setActiveSub] = useState<string | null>(null);

  // Build dynamic top-level tabs from categories + order
  const orderMap = new Map((categoryOrder ?? []).map((slug, i) => [slug, i]));
  const parentCats = categories
    .filter(c => c.parent === 0)
    .sort((a, b) => {
      const aIdx = orderMap.get(a.slug);
      const bIdx = orderMap.get(b.slug);
      if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
      if (aIdx !== undefined) return -1;
      if (bIdx !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });

  const TOP_CATEGORIES = [
    { label: 'All products', slug: 'all' },
    ...parentCats.map(c => ({ label: c.name, slug: c.slug })),
  ];

  // Find the active top-level category object
  const topCat = categories.find(c => c.slug === activeTop);

  // Subcategories of the active top category, sorted by subcategoryOrder
  const subOrder = subcategoryOrder?.[activeTop] ?? [];
  const subcategories = topCat
    ? categories
        .filter(c => c.parent === topCat.id && c.count > 0)
        .sort((a, b) => {
          const aIdx = subOrder.indexOf(a.slug);
          const bIdx = subOrder.indexOf(b.slug);
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
          if (aIdx !== -1) return -1;
          if (bIdx !== -1) return 1;
          return a.name.localeCompare(b.name);
        })
    : [];

  // Determine which products to show
  let products: Product[];
  if (activeTop === 'all') {
    products = allProducts;
  } else if (activeSub) {
    products = productsByCategory[activeSub] ?? [];
  } else {
    products = productsByCategory[activeTop] ?? [];
  }

  products = sortProductsBySizeThenPrice(products);

  function handleTopChange(slug: string) {
    setActiveTop(slug);
    setActiveSub(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top category pills - scrollable on mobile */}
      <div className="-mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 min-w-max md:min-w-0 md:flex-wrap pb-1">
          {TOP_CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => handleTopChange(cat.slug)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium font-['Onest'] border transition-colors ${
                activeTop === cat.slug
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-sky-700 hover:text-sky-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory tabs */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-6 border-b border-zinc-300 overflow-x-auto pb-0">
          <button
            onClick={() => setActiveSub(null)}
            className={`pb-3 text-sm font-medium font-['Onest'] whitespace-nowrap border-b-2 transition-colors ${
              !activeSub
                ? 'border-sky-700 text-sky-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            All {topCat?.name}
          </button>
          {subcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.slug)}
              className={`pb-3 text-sm font-medium font-['Onest'] whitespace-nowrap border-b-2 transition-colors ${
                activeSub === sub.slug
                  ? 'border-sky-700 text-sky-700'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-zinc-400 text-center py-16 font-['Onest']">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(product => (
            <B2BProductCard key={product.id} product={product} listingMode />
          ))}
        </div>
      )}
    </div>
  );
}

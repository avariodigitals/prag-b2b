'use client';

import { useState } from 'react';
import B2BProductCard from './B2BProductCard';
import type { Product, Category } from '@/lib/woocommerce';

const TOP_CATEGORIES = [
  { label: 'All products', slug: 'all' },
  { label: 'Inverters', slug: 'inverters' },
  { label: 'Stabilizers', slug: 'all-prag-stabilizers' },
  { label: 'Batteries', slug: 'batteries' },
  { label: 'Solar', slug: 'solar' },
];

interface Props {
  allProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  categories: Category[];
}

export default function ProductsView({ allProducts, productsByCategory, categories }: Props) {
  const [activeTop, setActiveTop] = useState('all');
  const [activeSub, setActiveSub] = useState<string | null>(null);

  // Find the active top-level category object
  const topCat = categories.find(c => c.slug === activeTop);

  // Subcategories of the active top category
  const subcategories = topCat
    ? categories.filter(c => c.parent === topCat.id && c.count > 0)
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

  function handleTopChange(slug: string) {
    setActiveTop(slug);
    setActiveSub(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top category pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {TOP_CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleTopChange(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium font-['Montserrat'] border transition-colors ${
              activeTop === cat.slug
                ? 'bg-sky-700 text-white border-sky-700'
                : 'bg-white text-zinc-700 border-zinc-300 hover:border-sky-700 hover:text-sky-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Subcategory tabs */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-6 border-b border-zinc-200 overflow-x-auto pb-0">
          <button
            onClick={() => setActiveSub(null)}
            className={`pb-3 text-sm font-medium font-['Montserrat'] whitespace-nowrap border-b-2 transition-colors ${
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
              className={`pb-3 text-sm font-medium font-['Montserrat'] whitespace-nowrap border-b-2 transition-colors ${
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
        <p className="text-zinc-400 text-center py-16 font-['Montserrat']">No products found.</p>
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

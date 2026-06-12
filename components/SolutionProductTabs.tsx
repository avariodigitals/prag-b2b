import Link from 'next/link';
import B2BProductCard from '@/components/B2BProductCard';
import { sortProductsBySizeThenPrice } from '@/lib/productSort';
import type { Product } from '@/lib/woocommerce';

export interface SolutionTabItem {
  key: string;
  label: string;
  products: Product[];
}

interface Props {
  basePath: string;
  tabs: SolutionTabItem[];
  activeTab?: string;
  emptyMessage?: string;
}

export default function SolutionProductTabs({
  basePath,
  tabs,
  activeTab,
  emptyMessage = 'No products found for this section.',
}: Props) {
  const firstNonEmptyTab = tabs.find((tab) => tab.products.length > 0)?.key;
  const resolvedActive = tabs.find((tab) => tab.key === activeTab)?.key
    ?? firstNonEmptyTab
    ?? tabs[0]?.key;
  const currentTab = tabs.find((tab) => tab.key === resolvedActive) ?? tabs[0];
  const products = sortProductsBySizeThenPrice(currentTab?.products ?? []);

  if (!currentTab) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden md:flex items-center gap-0 border-b border-[#c4c7cc] overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === resolvedActive;
          return (
            <Link
              key={tab.key}
              href={`${basePath}?tab=${encodeURIComponent(tab.key)}`}
              className="inline-flex flex-col items-center shrink-0"
            >
              <span
                className={`px-4 py-3 text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${
                  isActive ? 'text-[#0166a5]' : 'text-[#888888] hover:text-[#444444]'
                }`}
              >
                {tab.label}
              </span>
              <div className={`h-[2px] w-full ${isActive ? 'bg-[#0166a5]' : 'bg-[#e4e7ec]'}`} />
            </Link>
          );
        })}
      </div>

      <div className="md:hidden -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-3 pr-6">
          {tabs.map((tab) => {
            const isActive = tab.key === resolvedActive;
            return (
              <Link
                key={tab.key}
                href={`${basePath}?tab=${encodeURIComponent(tab.key)}`}
                className={`shrink-0 rounded-full px-6 py-3.5 text-lg font-semibold font-['Onest'] leading-none whitespace-nowrap transition-colors ${
                  isActive ? 'bg-sky-700 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-400 text-center py-16 font-['Onest']">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <B2BProductCard key={product.id} product={product} listingMode />
          ))}
        </div>
      )}
    </div>
  );
}

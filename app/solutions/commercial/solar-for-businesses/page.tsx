export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import SolutionProductTabs from '@/components/SolutionProductTabs';
import { getProductsForCategoryCode } from '@/app/solutions/residential/_data';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export const metadata: Metadata = {
  title: 'Solar for Businesses',
  description: 'Solar-ready complete systems, inverters, and batteries for efficient commercial energy operations.',
};

export default async function SolarForBusinessesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [completeSystems, inverters, batteries, solar] = await Promise.all([
    getProductsForCategoryCode('Complete Systems SFB'),
    getProductsForCategoryCode('inverters'),
    getProductsForCategoryCode('batteries'),
    getProductsForCategoryCode('solar'),
  ]);

  const tabs = [
    { key: 'complete-systems', label: 'Complete Systems', products: completeSystems },
    { key: 'inverters', label: 'Inverters', products: inverters },
    { key: 'batteries', label: 'Batteries', products: batteries },
    { key: 'solar', label: 'Solar', products: solar },
  ];

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-6 md:px-20 py-4 border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Home</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Solutions</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions/commercial" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Commercial</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 font-['Onest'] text-sm font-medium">Solar for Businesses</span>
        </div>
      </div>

      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">Solar for Businesses</h1>
        <p className="breadcrumb-description-lock max-w-[700px]">
          Explore commercial solar bundles with inverter and battery options designed to reduce operating costs and fuel dependence.
        </p>
      </div>

      <div className="w-full px-6 md:px-20 py-10">
        <div className="max-w-[1280px] mx-auto">
          <SolutionProductTabs
            basePath="/solutions/commercial/solar-for-businesses"
            tabs={tabs}
            activeTab={sp.tab}
            emptyMessage="No products available in this Solar for Businesses tab yet."
          />
        </div>
      </div>
    </main>
  );
}

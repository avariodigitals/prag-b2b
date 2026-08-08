export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import SolutionProductTabs from '@/components/SolutionProductTabs';
import { getProductsForCategoryCode } from '@/app/solutions/residential/_data';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export const metadata: Metadata = {
  title: 'Power Stabilization & Protection',
  description: 'Voltage stabilizers and protection products that safeguard residential equipment from unstable power.',
  alternates: { canonical: 'https://www.prag.global/solutions/residential/power-stabilization-protection' },
};

export default async function PowerStabilizationProtectionPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [allStabilizers, relay, servo, thyristor, advanced] = await Promise.all([
    getProductsForCategoryCode('voltage-stabilizers'),
    getProductsForCategoryCode('relay-voltage-stabilizers'),
    getProductsForCategoryCode('servo-voltage-stabilizers'),
    getProductsForCategoryCode('thyristor-stabilizers'),
    getProductsForCategoryCode('advanced-stabilizers'),
  ]);

  const tabs = [
    { key: 'all', label: 'All Stabilizers', products: allStabilizers },
    { key: 'relay', label: 'Relay Stabilizers', products: relay },
    { key: 'servo', label: 'Servo Stabilizers', products: servo },
    { key: 'thyristor', label: 'Thyristor Stabilizers', products: thyristor },
    { key: 'three-phase', label: '3-Phase Stabilizers', products: advanced },
  ];

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-6 md:px-20 py-4 border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Home</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Solutions</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions/residential" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Residential</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 font-['Onest'] text-sm font-medium">Power Stabilization & Protection</span>
        </div>
      </div>

      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">Power Stabilization & Protection</h1>
        <p className="breadcrumb-description-lock max-w-[720px]">
          Choose from relay, servo, thyristor, and advanced stabilizers to protect home appliances from voltage fluctuations.
        </p>
      </div>

      <div className="w-full px-6 md:px-20 py-10">
        <div className="max-w-[1280px] mx-auto">
          <SolutionProductTabs
            basePath="/solutions/residential/power-stabilization-protection"
            tabs={tabs}
            activeTab={sp.tab}
            emptyMessage="No stabilizer products available in this tab yet."
          />
        </div>
      </div>
    </main>
  );
}

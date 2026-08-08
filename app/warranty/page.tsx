import type { Metadata } from 'next';
import { Zap, Gauge, Sun, BatteryFull } from 'lucide-react';
import WarrantyCard from '@/components/WarrantyCard';

export const metadata: Metadata = { title: 'Product Warranty', alternates: { canonical: 'https://www.prag.global/warranty' } };

const categories = [
  {
    title: 'Inverter Warranty',
    href: '/warranty/inverter',
    icon: <Zap className="w-7 h-7" aria-hidden="true" />,
  },
  {
    title: 'Stabilizer Warranty',
    href: '/warranty/stabilizer',
    icon: <Gauge className="w-7 h-7" aria-hidden="true" />,
  },
  {
    title: 'Solar Warranty',
    href: '/warranty/solar',
    icon: <Sun className="w-7 h-7" aria-hidden="true" />,
  },
  {
    title: 'Lithium Battery Warranty',
    href: '/warranty/battery',
    icon: <BatteryFull className="w-7 h-7" aria-hidden="true" />,
  },
];

export default function WarrantyPage() {
  return (
    <main className="w-full flex flex-col">
      {/* Hero */}
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">Product Warranty</h1>
        <p className="breadcrumb-description-lock max-w-2xl">
          Find warranty details for PRAG inverters, stabilizers, solar products and batteries.
        </p>
      </div>

      {/* Cards */}
      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <WarrantyCard key={category.href} {...category} />
          ))}
        </div>
      </section>
    </main>
  );
}

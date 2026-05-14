import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProducts } from '@/lib/woocommerce';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; sort?: string }>;
}

const KNOWN_IDS: Record<string, number> = {
  'inverters': 117,
  'solar': 147,
  'batteries': 151,
  'all-prag-stabilizers': 144,
  'thyristor-stabilizers': 266,
  'relay-voltage-stabilizers': 167,
  'servo-voltage-stabilizers': 168,
  'advanced-stabilizers': 178,
  'hybrid-inverters': 171,
  'heavy-duty-inverters': 165,
  'pure-sine-inverters': 203,
  'solar-panels': 169,
  'solar-charge-controllers': 170,
  'protective-device': 261,
  'tubular-batteries': 220,
  'lithium-battery': 240,
  'battery-rack': 179,
};

const DISPLAY: Record<string, { name: string; description: string }> = {
  'inverters': { name: 'Inverter', description: 'A selection of solar inverters that convert DC power from solar panels into AC power.' },
  'all-prag-stabilizers': { name: 'Voltage Stabilizers', description: 'Explore our range of voltage stabilizers, designed to protect your appliances from power fluctuations.' },
  'batteries': { name: 'Batteries', description: 'Explore our wide range of batteries for solar power, inverters, and other energy storage solutions.' },
  'solar': { name: 'Solar', description: 'Explore our range of solar solutions, designed to maximize energy efficiency and protect against voltage fluctuations.' },
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const name = DISPLAY[category]?.name ?? category;
  return { title: `${name}` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  const activeSlug = sp.sub ?? category;
  const category_id = KNOWN_IDS[activeSlug];

  if (!category_id && !DISPLAY[category]) notFound();

  const { products, total } = await getProducts({ category_id, per_page: 16, page: 1 });

  const { name, description } = DISPLAY[category] ?? { name: category, description: '' };

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">{name}</h1>
        {description && (
          <p className="breadcrumb-description-lock max-w-[531px]">{description}</p>
        )}
      </div>

      {/* Grid */}
      <div className="w-full px-6 md:px-20 py-10">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[302/275] bg-stone-100 rounded-xl" />
                <div className="h-4 w-3/4 bg-stone-200 rounded mx-auto" />
                <div className="h-3 w-1/2 bg-stone-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        }>
          <CategoryProductsGrid
            products={products}
            total={total}
            categorySlug={category}
            activeSub={sp.sub}
          />
        </Suspense>
      </div>
    </main>
  );
}

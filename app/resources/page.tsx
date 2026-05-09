export const dynamic = 'force-dynamic';

import TechResourcesView from '@/components/TechResourcesView';
import { getProducts } from '@/lib/woocommerce';

export const metadata = { title: 'Technical Resources – PRAG Power Engineering B2B' };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { products } = await getProducts({ per_page: 100 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-6 md:px-20 pt-14 pb-10 bg-stone-50 flex flex-col items-center gap-4 text-center">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest']">
          Product Documentation &amp; Technical Guides
        </h1>
        <p className="text-sky-700 text-base md:text-lg font-['Space_Grotesk'] max-w-lg">
          Download detailed specifications, installation manuals, and technical documentation for all PRAG products.
        </p>
      </div>
      <TechResourcesView products={products} selectedSlug={sp.product} />
    </main>
  );
}

import PowerCalculatorTool from '@/components/PowerCalculatorTool';
import { getProducts } from '@/lib/woocommerce';

export const metadata = {
  title: 'Power Calculator',
  description: 'Select your appliances and get an instant system size recommendation.',
};

export default async function PowerCalculatorPage() {
  const { products } = await getProducts({ per_page: 100, page: 1 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full bg-stone-50 flex flex-col items-center gap-4 px-6 md:px-20 breadcrumb-hero-shell">
        <h1 className="breadcrumb-title-lock text-center">
          What Size System<br />Do You Actually Need?
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] text-center">
          Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
        </p>
      </div>
      <PowerCalculatorTool products={products} />
    </main>
  );
}

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
      <div className="w-full pt-10 md:pt-14 pb-6 md:pb-8 bg-stone-50 flex flex-col items-center gap-4 px-4">
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Montserrat'] text-center">
          What Size System<br />Do You Actually Need?
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-lg md:text-xl font-normal font-['Montserrat']">
          Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
        </p>
      </div>
      <PowerCalculatorTool products={products} />
    </main>
  );
}

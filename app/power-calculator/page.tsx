import PowerCalculatorTool from '@/components/PowerCalculatorTool';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Power Calculator',
  description: 'Select your appliances and get an instant system size recommendation.',
  alternates: { canonical: 'https://www.prag.global/power-calculator' },
};

export default function PowerCalculatorPage() {
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
      <PowerCalculatorTool />
    </main>
  );
}

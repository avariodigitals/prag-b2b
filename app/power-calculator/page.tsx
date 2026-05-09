import PowerCalculatorTool from '@/components/PowerCalculatorTool';

export const metadata = {
  title: 'Power Calculator – Prag B2B',
  description: 'Select your appliances and get an instant system size recommendation.',
};

export default function PowerCalculatorPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full pt-10 md:pt-14 pb-6 md:pb-8 bg-stone-50 flex flex-col items-center gap-4 px-4">
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Onest'] text-center">
          What Size System<br />Do You Actually Need?
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-base font-normal font-['Space_Grotesk']">
          Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
        </p>
      </div>
      <PowerCalculatorTool />
    </main>
  );
}

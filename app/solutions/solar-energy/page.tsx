import type { Metadata } from 'next';
import Link from 'next/link';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Solar Energy Solutions',
  description: 'Reduce energy costs and generator dependence with PRAG solar power systems.',
};

export default async function SolarEnergyPage() {
  const content = await getSolutionCategoryContent('solar-energy');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;

  const sections = [
    {
      title: 'Lower Energy Costs',
      description: 'Reduce electricity and generator fuel costs with solar energy solutions designed for long-term savings.',
      href: '/products/solar',
    },
    {
      title: 'Reduced Generator Dependence',
      description: 'Reduce reliance on generators with cleaner, quieter, and more sustainable power generation.',
      href: '/products/solar',
    },
    {
      title: 'Energy Independence',
      description: 'Generate your own electricity and reduce dependence on unreliable utility power.',
      href: '/products/solar',
    },
  ];

  return (
    <main className="w-full flex flex-col">
      <div className="breadcrumb-hero-shell flex flex-col items-center gap-4 text-center px-6 bg-stone-50">
        <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
          {content.heroTitle}
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          <SentenceText text={content.heroDescription} />
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <ProblemsCarousel problems={problems} products={[]} showProductsSection={false} />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-7 flex flex-col gap-4 hover:border-[#0166a5]/40 hover:shadow-sm transition-colors"
              >
                <h2 className="text-[#1a1a1a] text-[24px] font-semibold font-['Onest'] leading-tight">{section.title}</h2>
                <p className="text-[#6f6f6f] text-[16px] font-['Space_Grotesk'] leading-6">{section.description}</p>
                <span className="text-[#0166a5] text-[14px] font-semibold font-['Space_Grotesk']">View Products →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

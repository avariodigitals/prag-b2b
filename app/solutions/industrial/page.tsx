import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Industrial Power Solutions',
  description: 'Engineered power for heavy-duty operations. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption.',
};

export default async function IndustrialSolutionsPage() {
  const content = await getSolutionCategoryContent('industrial');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;

  const sections = [
    {
      title: 'Voltage Stabilization & Protection',
      description: 'Maintain stable power across production equipment and help protect critical assets from damaging voltage conditions.',
      href: '/products/all-prag-stabilizers',
    },
    {
      title: 'Industrial Solar Solutions',
      description: 'Reduce energy costs, lower generator fuel consumption, and improve long-term energy efficiency.',
      href: '/products/solar',
    },
    {
      title: 'Power Systems Engineering',
      description: "Power solutions designed around your facility's operational requirements, equipment loads, and growth plans.",
      href: '/free-power-assessment',
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
                <span className="text-[#0166a5] text-[16px] md:text-[18px] font-semibold font-['Space_Grotesk'] inline-flex items-center gap-2">
                  {section.href === '/free-power-assessment' ? 'Contact an Expert' : 'View Products'}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

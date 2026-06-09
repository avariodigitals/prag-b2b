import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Voltage Stabilization & Protection Solutions',
  description: 'Protect your equipment from voltage fluctuations with PRAG stabilization and protection systems.',
};

export default async function VoltageStabilizationProtectionPage() {
  const content = await getSolutionCategoryContent('voltage-stabilization-protection');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;

  const sections = [
    {
      title: 'Stable Power',
      description: 'Improve equipment performance and operational reliability with consistent voltage.',
      href: '/products/all-prag-stabilizers',
    },
    {
      title: 'Equipment Protection',
      description: 'Reduce the risk of voltage-related damage, repairs, and premature equipment failure.',
      href: '/products/all-prag-stabilizers',
    },
    {
      title: 'Facility-Wide Coverage',
      description: 'Stabilize power across entire homes, offices, businesses, and industrial facilities.',
      href: '/products/all-prag-stabilizers',
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
                  View Products
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

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Residential Power Solutions',
  description: 'Keep your home comfortable, secure, and fully powered with smart energy solutions designed for everyday living.',
};

export default async function ResidentialSolutionsPage() {
  const content = await getSolutionCategoryContent('residential');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;
  const sections = [
    {
      title: 'Home Backup Power',
      description: 'Explore complete backup bundles, inverters, and batteries designed for uninterrupted home comfort.',
      href: '/solutions/residential/home-backup-power',
    },
    {
      title: 'Home Solar Systems',
      description: 'Browse residential solar-ready bundles and storage options that reduce fuel dependence.',
      href: '/solutions/residential/home-solar-systems',
    },
    {
      title: 'Power Stabilization & Protection',
      description: 'Find stabilizers and voltage protection products to keep home electronics safe from fluctuations.',
      href: '/solutions/residential/power-stabilization-protection',
    },
  ];

  return (
    <main className="w-full flex flex-col">
      <div className="breadcrumb-hero-shell flex flex-col items-center gap-4 text-center px-6 bg-stone-50">
        <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
          Reliable Power for
          <br />
          Modern Living
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

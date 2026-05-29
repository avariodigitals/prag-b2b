import type { Metadata } from 'next';
import Link from 'next/link';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Commercial Power Solutions',
  description: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
};

export default async function CommercialSolutionsPage() {
  const content = await getSolutionCategoryContent('commercial');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;
  const sections = [
    {
      title: 'Office Backup Power',
      description: 'Explore complete backup bundles, inverters, and batteries tailored for uninterrupted business operations.',
      href: '/solutions/commercial/office-backup-power',
    },
    {
      title: 'Solar for Businesses',
      description: 'Browse commercial solar-ready systems and storage options to reduce diesel dependence and operating costs.',
      href: '/solutions/commercial/solar-for-businesses',
    },
    {
      title: 'Power Stabilization & Protection',
      description: 'Find stabilizers and power-protection products built for sensitive commercial equipment and systems.',
      href: '/solutions/commercial/power-stabilization-protection',
    },
  ];

  return (
    <main className="w-full flex flex-col">
      <div className="breadcrumb-hero-shell flex flex-col items-center gap-4 text-center px-6 bg-stone-50">
        <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
          {content.heroTitle}
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          {content.heroDescription}
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
                <span className="text-[#0166a5] text-[14px] font-semibold font-['Space_Grotesk']">View products</span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0166A5] text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-[#01588e] transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

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

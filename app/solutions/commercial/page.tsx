import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getProblemProductRecommendations, getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Commercial Power Solutions – Prag B2B',
  description: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
};

export default async function CommercialSolutionsPage() {
  const content = await getSolutionCategoryContent('commercial');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;
  const [catalog, recommendedProductsByProblem] = await Promise.all([
    getProducts({ per_page: 100 }),
    getProblemProductRecommendations(problems),
  ]);
  const products = catalog.products;

  return (
    <main className="w-full flex flex-col">
      <div className="flex flex-col items-center gap-4 text-center pt-16 pb-10 px-6 bg-stone-50">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight max-w-2xl">
          {content.heroTitle}
        </h1>
        <p className="text-sky-700 text-sm md:text-base font-['Space_Grotesk'] max-w-lg leading-relaxed">
          {content.heroDescription}
        </p>
      </div>

      <div className="w-full px-6 md:px-10 py-14">
        <div className="max-w-4xl mx-auto">
          <ProblemsCarousel problems={problems} products={products} recommendedProductsByProblem={recommendedProductsByProblem} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={content.ctaHref}
            className="px-8 py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full transition-colors"
          >
            {content.ctaLabel}
          </Link>
          <Link
            href={content.secondaryCtaHref}
            className="px-8 py-3.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Space_Grotesk'] rounded-full transition-colors"
          >
            {content.secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}

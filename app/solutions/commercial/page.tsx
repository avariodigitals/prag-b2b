import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getProblemProductRecommendations, getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Commercial Power Solutions',
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
          <ProblemsCarousel problems={problems} products={products} recommendedProductsByProblem={recommendedProductsByProblem} />
        </div>
      </div>
    </main>
  );
}

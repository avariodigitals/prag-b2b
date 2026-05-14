import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getProblemProductRecommendations, getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Industrial Power Solutions',
  description: 'Engineered power for heavy-duty operations. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption.',
};

export default async function IndustrialSolutionsPage() {
  const content = await getSolutionCategoryContent('industrial');
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

      <div className="w-full px-6 md:px-20 py-14">
        <div className="max-w-[1280px] mx-auto">
          <ProblemsCarousel problems={problems} products={products} recommendedProductsByProblem={recommendedProductsByProblem} />
        </div>
      </div>
    </main>
  );
}

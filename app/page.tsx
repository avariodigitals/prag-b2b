export const revalidate = 600;

import Hero from '@/components/Hero';
import ProblemsSection from '@/components/ProblemsSection';
import SolutionsSection from '@/components/SolutionsSection';
import WhyPragSection from '@/components/WhyPragSection';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import KnowledgeCenterSection from '@/components/KnowledgeCenterSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemsSection />
      <SolutionsSection />
      <WhyPragSection />
      <CaseStudiesSection />
      <KnowledgeCenterSection />
    </>
  );
}

import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProblemsSection from '@/components/ProblemsSection';
import SolutionsSection from '@/components/SolutionsSection';
import WhyPragSection from '@/components/WhyPragSection';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import KnowledgeCenterSection from '@/components/KnowledgeCenterSection';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.prag.global/' },
};

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

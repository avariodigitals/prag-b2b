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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.prag.global/#website',
  url: 'https://www.prag.global/',
  name: 'PRAG',
  alternateName: 'PRAG Power',
  publisher: { '@id': 'https://www.prag.global/#organization' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.prag.global/#organization',
  name: 'PRAG',
  url: 'https://www.prag.global/',
  logo: 'https://www.prag.global/images/prag-logo.png',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <ProblemsSection />
      <SolutionsSection />
      <WhyPragSection />
      <CaseStudiesSection />
      <KnowledgeCenterSection />
    </>
  );
}

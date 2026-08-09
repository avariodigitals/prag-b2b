import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProblemsSection from '@/components/ProblemsSection';
import SolutionsSection from '@/components/SolutionsSection';
import WhyPragSection from '@/components/WhyPragSection';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import KnowledgeCenterSection from '@/components/KnowledgeCenterSection';
import JsonLd from '@/components/JsonLd';
import { getB2BPublicContent } from '@/lib/b2bContent';
import { resolveStaticSeo, buildMetadata, getAdminSeoOverride } from '@/lib/seoMeta';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getB2BPublicContent();
  const override = getAdminSeoOverride(content?.seoOverrides, '/');
  const seo = resolveStaticSeo('/', override);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
  });
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.prag.global/#website',
  url: 'https://www.prag.global/',
  name: 'PRAG',
  alternateName: 'PRAG Power',
  description: 'Inverters, voltage stabilizers, batteries and solar solutions in Nigeria.',
  publisher: { '@id': 'https://www.prag.global/#organization' },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <Hero />
      <ProblemsSection />
      <SolutionsSection />
      <WhyPragSection />
      <CaseStudiesSection />
      <KnowledgeCenterSection />
    </>
  );
}

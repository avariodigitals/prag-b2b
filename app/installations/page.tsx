import type { Metadata } from 'next';
import InstallationsView from '@/components/InstallationsView';
import JsonLd from '@/components/JsonLd';
import { getCaseStudiesContent } from '@/lib/caseStudies';
import { getB2BPublicContent } from '@/lib/b2bContent';
import { resolveStaticSeo, buildMetadata, buildBreadcrumbJsonLd, getAdminSeoOverride, SITE_BASE } from '@/lib/seoMeta';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getB2BPublicContent();
  const override = getAdminSeoOverride(content?.seoOverrides, '/installations');
  const seo = resolveStaticSeo('/installations', override);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
  });
}

export default async function InstallationsPage() {
  const content = await getCaseStudiesContent();
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Home', url: `${SITE_BASE}/` },
        { name: 'Installations', url: `${SITE_BASE}/installations` },
      ])} />
      <InstallationsView content={content} />
    </>
  );
}

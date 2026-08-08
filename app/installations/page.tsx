import type { Metadata } from 'next';
import InstallationsView from '@/components/InstallationsView';
import { getCaseStudiesContent } from '@/lib/caseStudies';

export const metadata: Metadata = {
  title: 'Installations',
  alternates: { canonical: 'https://www.prag.global/installations' },
};

export default async function InstallationsPage() {
  const content = await getCaseStudiesContent();
  return <InstallationsView content={content} />;
}

import InstallationsView from '@/components/InstallationsView';
import { getCaseStudiesContent } from '@/lib/caseStudies';

export default async function InstallationsPage() {
  const content = await getCaseStudiesContent();
  return <InstallationsView content={content} />;
}

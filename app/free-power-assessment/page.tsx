import type { Metadata } from 'next';
import FreePowerAssessmentForm from '@/components/FreePowerAssessmentForm';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = { title: 'Free Power Assessment' };

async function getPageContent() {
  const fallback = {
    title: 'Get a Free Power Assessment',
    description: 'Kindly provide your details and we will contact you shortly to provide a free power assesment.',
  };

  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/free-power-assessment');
  const hero = findVisibleSectionsByType(page, 'hero')[0];

  if (!hero) return fallback;

  return {
    title: hero.summary?.trim() || page?.title?.trim() || fallback.title,
    description: hero.content?.trim() || page?.description?.trim() || fallback.description,
  };
}

export default async function FreePowerAssessmentPage() {
  const pageContent = await getPageContent();

  return (
    <main className="w-full flex flex-col">
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">{pageContent.title}</h1>
        <p className="breadcrumb-description-lock max-w-[690px]">
          {pageContent.description}
        </p>
      </div>

      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <div className="max-w-[760px] mx-auto">
          <FreePowerAssessmentForm />
        </div>
      </section>
    </main>
  );
}
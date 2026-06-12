import type { Metadata } from 'next';
import CareersForm from '@/components/CareersForm';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = { title: 'Careers' };

async function getPageContent() {
  const fallback = {
    title: 'Build Your Future With PRAG',
    description: 'Join a team of engineers and professionals solving real power challenges across Nigeria.',
    submitLabel: 'Submit Application',
  };

  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/careers');
  const hero = findVisibleSectionsByType(page, 'hero')[0];
  const ctaSection = findVisibleSectionsByType(page, 'cta')[0];

  if (!hero) return fallback;

  return {
    title: hero.summary?.trim() || page?.title?.trim() || fallback.title,
    description: hero.content?.trim() || page?.description?.trim() || fallback.description,
    submitLabel: ctaSection?.ctaLabel?.trim() || fallback.submitLabel,
  };
}

export default async function CareersPage() {
  const pageContent = await getPageContent();

  return (
    <main className="w-full flex flex-col">
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">{pageContent.title}</h1>
        <p className="breadcrumb-description-lock max-w-[690px]">
          <SentenceText text={pageContent.description} />
        </p>
      </div>

      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <CareersForm />
      </section>
    </main>
  );
}

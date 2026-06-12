import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = {
  title: 'Backup Power Solutions',
  description: 'Stay powered during outages with PRAG inverter and battery backup systems.',
};

export default async function BackupPowerPage() {
  const content = await getSolutionCategoryContent('backup-power');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;

  const b2bContent = await getB2BPublicContent();
  const page = findB2BPage(b2bContent, '/solutions/backup-power');
  const cardSections = findVisibleSectionsByType(page, 'solution-card');

  const fallbackCards = [
    { title: 'Power During Outages', description: 'Keep essential appliances, equipment, and systems running during power outages.', href: '/products/inverters', ctaLabel: 'View Products' },
    { title: 'Continuity & Productivity', description: 'Maintain comfort, connectivity, security, and productivity when utility power is unavailable.', href: '/products/inverters', ctaLabel: 'View Products' },
    { title: 'Reduced Generator Dependence', description: 'Reduce reliance on generators with quieter, cleaner, and more convenient backup power solutions.', href: '/products/inverters', ctaLabel: 'View Products' },
  ];

  const cards = fallbackCards.map((fallback, index) => {
    const section = cardSections[index];
    return {
      title: section?.summary?.trim() || fallback.title,
      description: section?.content?.trim() || fallback.description,
      href: section?.ctaHref?.trim() || fallback.href,
      ctaLabel: section?.ctaLabel?.trim() || fallback.ctaLabel,
    };
  });

  return (
    <main className="w-full flex flex-col">
      <div className="breadcrumb-hero-shell flex flex-col items-center gap-4 text-center px-6 bg-stone-50">
        <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
          {content.heroTitle}
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          <SentenceText text={content.heroDescription} />
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <ProblemsCarousel problems={problems} products={[]} showProductsSection={false} />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-zinc-300 bg-white p-6 md:p-7 flex flex-col gap-4 hover:border-[#0166a5]/40 hover:shadow-sm transition-colors"
              >
                <h2 className="text-[#1a1a1a] text-[24px] font-semibold font-['Onest'] leading-tight">{card.title}</h2>
                <p className="text-[#6f6f6f] text-[18px] font-['Space_Grotesk'] leading-7">{card.description}</p>
                <span className="text-[#0166a5] text-[16px] md:text-[18px] font-semibold font-['Space_Grotesk'] inline-flex items-center gap-2">
                  {card.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

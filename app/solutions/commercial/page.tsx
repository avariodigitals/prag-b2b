import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import { getSolutionCategoryContent } from '@/lib/solutions';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = {
  title: 'Commercial Power Solutions',
  description: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
  alternates: { canonical: 'https://www.prag.global/solutions/commercial' },
  openGraph: {
    title: 'Commercial Power Solutions',
    description: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
    url: 'https://www.prag.global/solutions/commercial',
    type: 'website',
  },
};

export default async function CommercialSolutionsPage() {
  const content = await getSolutionCategoryContent('commercial');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;

  const b2bContent = await getB2BPublicContent();
  const page = findB2BPage(b2bContent, '/solutions/commercial');
  const cardSections = findVisibleSectionsByType(page, 'solution-card');

  const fallbackCards = [
    { title: 'Business Backup Power', description: 'Maintain productivity, connectivity, and essential operations during power outages.', href: '/products/inverters', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
    { title: 'Commercial Solar Solutions', description: 'Reduce operating costs and generator dependence with reliable solar energy solutions.', href: '/products/solar', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
    { title: 'Voltage Stabilization & Protection', description: 'Maintain stable power across your facility and help protect valuable equipment from damaging voltage conditions.', href: '/products/all-prag-stabilizers', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
  ];

  const cards = fallbackCards.map((fallback, index) => {
    const section = cardSections[index];
    return {
      title: section?.summary?.trim() || fallback.title,
      description: section?.content?.trim() || fallback.description,
      href: section?.ctaHref?.trim() || fallback.href,
      ctaLabel: section?.ctaLabel?.trim() || fallback.ctaLabel,
      image: section?.imageUrl?.trim() || fallback.image,
      imageAlt: section?.imageAlt?.trim() || fallback.title,
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
                className="rounded-2xl border border-zinc-300 bg-white flex flex-col overflow-hidden hover:border-[#0166a5]/40 hover:shadow-sm transition-colors"
              >
                <div className="relative w-full h-48 md:h-52 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.imageAlt || card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
                  <h2 className="text-[#1a1a1a] text-[24px] font-semibold font-['Onest'] leading-tight">{card.title}</h2>
                  <p className="text-[#6f6f6f] text-[18px] font-['Space_Grotesk'] leading-7">{card.description}</p>
                  <span className="text-[#0166a5] text-[16px] md:text-[18px] font-semibold font-['Space_Grotesk'] inline-flex items-center gap-2 mt-auto">
                    {card.ctaLabel}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

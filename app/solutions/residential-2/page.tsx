import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import { getSolutionCategoryContent } from '@/lib/solutions';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = {
  title: 'Residential Power Solutions 2',
  description: 'Residential solutions navigation with dedicated sections for backup, solar systems, and stabilization.',
  alternates: { canonical: 'https://www.prag.global/solutions/residential-2' },
};

export default async function ResidentialSolutionsTwoPage() {
  const content = await getSolutionCategoryContent('residential');

  const b2bContent = await getB2BPublicContent();
  const page = findB2BPage(b2bContent, '/solutions/residential');
  const cardSections = findVisibleSectionsByType(page, 'solution-card');

  const fallbackCards = [
    { title: 'Home Backup Power', description: 'Explore complete backup bundles, inverters, and batteries designed for uninterrupted home comfort.', href: '/solutions/residential-2/home-backup-power', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png' },
    { title: 'Home Solar Systems', description: 'Browse residential solar-ready bundles and storage options that reduce fuel dependence.', href: '/solutions/residential-2/home-solar-systems', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png' },
    { title: 'Power Stabilization & Protection', description: 'Find stabilizers and voltage protection products to keep home electronics safe from fluctuations.', href: '/solutions/residential-2/power-stabilization-protection', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png' },
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
      <div className="w-full px-6 md:px-20 py-4 border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Home</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Solutions</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 font-['Onest'] text-sm font-medium">Residential 2</span>
        </div>
      </div>

      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">Residential</h1>
        <p className="breadcrumb-description-lock max-w-[600px] leading-relaxed">
          <SentenceText text={content.heroDescription} />
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-20 py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
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

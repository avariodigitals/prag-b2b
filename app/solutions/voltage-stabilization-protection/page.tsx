export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import ProblemsCarousel from '@/components/ProblemsCarousel';
import SolutionBody from '@/components/SolutionContent';
import JsonLd from '@/components/JsonLd';
import { getSolutionCategoryContent } from '@/lib/solutions';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { resolveStaticSeo, buildMetadata, buildBreadcrumbJsonLd, getAdminSeoOverride, SITE_BASE } from '@/lib/seoMeta';
import { getSolutionBody } from '@/lib/solutionContent';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getB2BPublicContent();
  const override = getAdminSeoOverride(content?.seoOverrides, '/solutions/voltage-stabilization-protection');
  const seo = resolveStaticSeo('/solutions/voltage-stabilization-protection', override);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
  });
}

export default async function VoltageStabilizationProtectionPage() {
  const content = await getSolutionCategoryContent('voltage-stabilization-protection');
  const activeProblems = content.problems.filter((problem) => problem.active);
  const problems = activeProblems.length > 0 ? activeProblems : content.problems;
  const body = getSolutionBody('voltage-stabilization-protection');

  const b2bContent = await getB2BPublicContent();
  const page = findB2BPage(b2bContent, '/solutions/voltage-stabilization-protection');
  const cardSections = findVisibleSectionsByType(page, 'solution-card');

  const fallbackCards = [
    { title: 'Stable Power', description: 'Improve equipment performance and operational reliability with consistent voltage.', href: '/products/voltage-stabilizers', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
    { title: 'Equipment Protection', description: 'Reduce the risk of voltage-related damage, repairs, and premature equipment failure.', href: '/products/voltage-stabilizers', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
    { title: 'Facility-Wide Coverage', description: 'Stabilize power across entire homes, offices, businesses, and industrial facilities.', href: '/products/voltage-stabilizers', ctaLabel: 'View Products', image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png' },
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
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Home', url: `${SITE_BASE}/` },
        { name: 'Solutions', url: `${SITE_BASE}/solutions` },
        { name: 'Voltage Stabilization & Protection', url: `${SITE_BASE}/solutions/voltage-stabilization-protection` },
      ])} />
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

          {body && <SolutionBody body={body} />}
        </div>
      </div>
    </main>
  );
}

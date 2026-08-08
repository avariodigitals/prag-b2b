import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = {
  title: 'Power Solutions',
  description: 'From industrial plants to residential homes, we engineer power systems that never let you down.',
  alternates: { canonical: 'https://www.prag.global/solutions' },
  openGraph: {
    title: 'Power Solutions',
    description: 'From industrial plants to residential homes, we engineer power systems that never let you down.',
    url: 'https://www.prag.global/solutions',
    type: 'website',
  },
};

const SOLUTIONS = [
  {
    tag: 'Industrial',
    title: 'Heavy-Duty Power Engineering for Industry',
    challenge:
      'Industrial operations have zero tolerance for power problems. Voltage fluctuations can destroy motors, VFDs, and CNC machines. Unexpected outages halt production lines and cause massive losses.',
    solution:
      "PRAG's Industrial division handles complex, high-load power installations. We work directly with factory engineers to design systems that integrate with existing infrastructure.",
    href: '/solutions/industrial',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
    imageLeft: true,
  },
  {
    tag: 'Commercial',
    title: 'Protect Your Business From Power Disruption',
    challenge:
      'For businesses, every hour of downtime costs money. Voltage surges can destroy servers, POS systems, and refrigeration. Power interruptions kill productivity and customer experience.',
    solution:
      'We engineer power reliability systems for offices, retail outlets, hospitals, hotels, and educational institutions — sized for your actual load and growth plans.',
    href: '/solutions/commercial',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
    imageLeft: false,
  },
  {
    tag: 'Residential',
    title: 'Complete Home Power Solutions',
    challenge:
      'Most Nigerian homes deal with power that comes unpredictably, appliances that get damaged, and generators that run all night. You deserve better.',
    solution:
      'PRAG designs complete home power systems that combine voltage stabilisation, solar generation, and battery storage — so your home stays powered whether NEPA is around or not.',
    href: '/solutions/residential',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
    imageLeft: true,
  },
];

function parseChallengeAndSolution(content: string): { challenge: string; solution: string } {
  const text = content.trim();
  if (!text) return { challenge: '', solution: '' };

  const challengeMatch = text.match(/challenge:\s*([\s\S]*?)(?:our solutions?:|$)/i);
  const solutionMatch = text.match(/our solutions?:\s*([\s\S]*)$/i);

  if (challengeMatch || solutionMatch) {
    return {
      challenge: challengeMatch?.[1]?.trim() || '',
      solution: solutionMatch?.[1]?.trim() || '',
    };
  }

  return { challenge: text, solution: '' };
}

export default async function SolutionsPage() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/solutions');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const contentSections = findVisibleSectionsByType(page, 'content');
  const mergedSolutions = SOLUTIONS.map((fallback, index) => {
    const section = contentSections[index];
    if (!section) return fallback;
    const parsed = parseChallengeAndSolution(section.content?.trim() || '');
    return {
      ...fallback,
      tag: section.kicker?.trim() || fallback.tag,
      title: section.summary?.trim() || section.title?.trim() || fallback.title,
      challenge: parsed.challenge || fallback.challenge,
      solution: parsed.solution || fallback.solution,
      href: section.ctaHref?.trim() || fallback.href,
      image: section.imageUrl?.trim() || fallback.image,
    };
  });

  const heroTitle = heroSection?.summary?.trim() || page?.title?.trim() || 'Power Solutions for Every Challenge';
  const heroDescription = heroSection?.content?.trim() || page?.description?.trim() || 'From industrial plants to residential homes, we engineer power systems that never let you down.';

  return (
    <main className="w-full">
      {/* Hero */}
      <div className="breadcrumb-hero-shell flex flex-col items-center gap-3 text-center px-4 sm:px-6 bg-stone-50">
        <h1 className="breadcrumb-title-lock">
          {heroTitle}
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          <SentenceText text={heroDescription} />
        </p>
      </div>

      {/* Solutions */}
      <div className="w-full px-4 sm:px-6 md:px-20 py-10 sm:py-12 pb-16 sm:pb-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-14 md:gap-20">
          {mergedSolutions.map((s) => (
            <div
              key={s.tag}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start"
            >
            {/* Image */}
            <div className={`w-full h-[240px] sm:h-[300px] md:h-[450px] rounded-xl overflow-hidden relative ${s.imageLeft ? 'md:order-1' : 'md:order-2'}`}>
              <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className={`flex flex-col gap-5 ${s.imageLeft ? 'md:order-2' : 'md:order-1'}`}>
              {/* Tag */}
              <div className="flex items-center gap-[6px]">
                <div className="w-4 h-4 bg-[#0166a5] rounded-sm shrink-0" />
                <span className="text-[#1a1a1a] font-['Space_Grotesk'] text-[18px] font-normal uppercase tracking-wide">
                  {s.tag}
                </span>
              </div>

              <h2 className="text-[#1a1a1a] text-[32px] font-bold font-['Onest'] leading-[36px]">{s.title}</h2>

              {/* Challenge + Solutions block */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#0166a5] text-[16px] font-medium font-['Space_Grotesk'] leading-[20px]">Challenge:</p>
                  <p className="text-[#888888] text-[18px] font-['Space_Grotesk'] leading-[24px]"><SentenceText text={s.challenge} /></p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[#0166a5] text-[16px] font-medium font-['Space_Grotesk'] leading-[20px]">Our Solutions:</p>
                  <p className="text-[#888888] text-[18px] font-['Space_Grotesk'] leading-[24px]"><SentenceText text={s.solution} /></p>
                </div>

              </div>

              <Link
                href={s.href}
                className="inline-flex items-center gap-[6px] text-[#0166a5] text-[18px] font-semibold font-['DM_Sans'] hover:gap-3 transition-all w-fit"
              >
                Learn More <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

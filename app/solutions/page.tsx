import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import SolutionProductTags from '@/components/SolutionProductTags';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata: Metadata = {
  title: 'Power Solutions',
  description: 'From industrial plants to residential homes, we engineer power systems that never let you down.',
};

const SOLUTIONS = [
  {
    tag: 'Industrial',
    title: 'Heavy-Duty Power Engineering for Industry',
    challenge:
      'Industrial operations have zero tolerance for power problems. Voltage fluctuations can destroy motors, VFDs, and CNC machines. Unexpected outages halt production lines and cause massive losses.',
    solution:
      "PRAG's Industrial division handles complex, high-load power installations. We work directly with factory engineers to design systems that integrate with existing infrastructure.",
    products: [
      'Industrial Stabilizers (100–500kVA)',
      'Three-Phase Inverter Systems',
      'Power Factor Correction Units',
      'Large-Scale Solar + Storage',
    ],
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
    products: [
      'Commercial Voltage Stabilizers (10–100kVA)',
      'Three-Phase Hybrid Inverters',
      'Commercial Solar Systems (10–500kW)',
      'UPS Systems for Critical Loads',
    ],
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
    products: [
      'Automatic Voltage Stabilizers (1–5kVA)',
      'Hybrid Solar Inverter Systems',
      'Lithium Battery Banks (100–400Ah)',
      'Monocrystalline Solar Panels',
    ],
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
      <div className="flex flex-col items-center gap-3 text-center pt-14 pb-8 px-6 bg-stone-50">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest']">
          {heroTitle}
        </h1>
        <p className="text-zinc-500 text-sm font-['Space_Grotesk'] max-w-sm leading-relaxed">
          {heroDescription}
        </p>
      </div>

      {/* Solutions */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 flex flex-col gap-20 py-12 pb-20">
        {mergedSolutions.map((s) => (
          <div
            key={s.tag}
            className={`flex flex-col ${s.imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}
          >
            {/* Image */}
            <div className="w-full md:w-[340px] shrink-0 rounded-2xl overflow-hidden aspect-[4/3] relative">
              <Image src={s.image} alt={s.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 340px" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Tag */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-700 rounded-sm shrink-0" />
                <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">
                  {s.tag}
                </span>
              </div>

              <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-snug">{s.title}</h2>

              <div className="flex flex-col gap-1">
                <p className="text-zinc-800 text-sm font-semibold font-['Space_Grotesk']">Challenge:</p>
                <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">{s.challenge}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-zinc-800 text-sm font-semibold font-['Space_Grotesk']">Our Solutions:</p>
                <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">{s.solution}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-zinc-800 text-sm font-semibold font-['Space_Grotesk']">Recommended Products:</p>
                <SolutionProductTags tags={s.products} />
              </div>

              <Link
                href={s.href}
                className="flex items-center gap-1 text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:gap-2 transition-all w-fit"
              >
                Learn More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

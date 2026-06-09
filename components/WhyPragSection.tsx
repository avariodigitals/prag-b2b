import Link from 'next/link';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

async function getWhyPragContent() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/');
  const headerSection = findVisibleSectionsByType(page, 'reason-header')[0];
  const reasonSections = findVisibleSectionsByType(page, 'reason');

  const header = {
    kicker: headerSection?.kicker?.trim() || headerSection?.title?.trim() || 'The PRAG Difference',
    title: headerSection?.summary?.trim() || 'Why Leading Homes and Businesses Choose PRAG',
    description: headerSection?.content?.trim() || 'Our work is guided by a commitment to quality, precision, and long-term performance.',
  };

  const reasons = REASONS.map((fallback, index) => {
    const section = reasonSections[index];
    if (!section) return fallback;
    const title = section.summary?.trim() || section.title?.trim() || fallback.title;
    return {
      image: section.imageUrl?.trim() || fallback.image,
      title,
      desc: section.content?.trim() || fallback.desc,
    };
  });

  return { header, reasons };
}

const REASONS = [
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/6333bffe31c649645bdba2b956b3e4bafe0a7868-scaled.jpg',
    title: 'Built for Nigerian power conditions',
    desc: 'Our systems are specifically engineered to handle voltage fluctuations, frequent outages, and harsh environmental conditions, ensuring consistent performance where it matters most.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/8d3cd2d330451451580f7d3cb8661c92c954a0fa-scaled.jpg',
    title: 'End-to-End Delivery',
    desc: 'From initial consultation and system design to professional installation and ongoing maintenance, we manage the entire process so you can enjoy a seamless, stress-free experience.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/9ef4a5ee5bff2a6013ceebaf1698c605c4ed6fc4-scaled.jpg',
    title: 'Trusted by Thousands Nationwide',
    desc: 'With a growing network of satisfied customers across the country, our solutions have been tested and proven in real homes and businesses you can relate to.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/aa2e989afcc2e3f55275cac3da1e786d9b35d788.jpg',
    title: 'Long-Term Reliability, Not Quick Fixes',
    desc: 'We focus on building durable energy systems designed to last for years, helping you avoid frequent replacements and unnecessary costs over time.',
  },
];

export default async function WhyPragSection() {
  const content = await getWhyPragContent();

  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8 md:gap-12">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-[6px]">
            <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
            <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase tracking-wide">
              {content.header.kicker}
            </span>
          </div>
          <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1.1] tracking-[-2px] max-w-[500px] md:max-w-[600px]">
            {content.header.title}
          </h2>
          <p className="text-zinc-500 text-[16px] md:text-[20px] font-['Onest'] max-w-[480px]">
            {content.header.description}
          </p>
        </div>

        {/* Cards Grid — single column on mobile, 2 columns on md+ */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.reasons.map((r) => (
            <div
              key={r.title}
              className="relative min-h-[300px] sm:min-h-[340px] md:min-h-[380px] h-full rounded-2xl overflow-hidden group"
            >
              <img
                src={r.image}
                alt={r.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Base dark tint over whole card */}
              <div
                className="absolute inset-0"
                style={{ background: 'rgba(0,0,0,0.28)' }}
                aria-hidden="true"
              />
              {/* Stronger gradient for text area */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.90) 100%)' }}
                aria-hidden="true"
              />
              {/* Text */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 flex flex-col gap-2">
                <h3 className="text-white text-[19px] md:text-[20px] font-semibold [font-family:var(--font-space-grotesk)] leading-snug drop-shadow-sm">
                  {r.title}
                </h3>
                <p className="text-white/90 text-[15px] md:text-[18px] font-normal [font-family:var(--font-space-grotesk)] leading-normal drop-shadow-sm">
                  <SentenceText text={r.desc} />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0166A5] text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-[#01588e] transition-colors"
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

async function getWhyPragContent() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/');
  const reasonSections = findVisibleSectionsByType(page, 'reason');

  return REASONS.map((fallback, index) => {
    const section = reasonSections[index];
    if (!section) return fallback;
    return {
      image: section.imageUrl?.trim() || fallback.image,
      title: section.summary?.trim() || section.title?.trim() || fallback.title,
      desc: section.content?.trim() || fallback.desc,
    };
  });
}

const REASONS = [
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/6333bffe31c649645bdba2b956b3e4bafe0a7868-scaled.jpg',
    title: 'Built for Nigerian power conditions',
    desc: 'Our systems are specifically engineered to handle voltage fluctuations, frequent outages, and harsh environmental conditions, ensuring consistent performance where it matters most.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/8d3cd2d330451451580f7d3cb8661c92c954a0fa-scaled.jpg',
    title: 'End-to-End Delivery (Design → Installation → Support)',
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
  const reasons = await getWhyPragContent();
  return (
    <section className="w-full bg-white py-16 md:py-20 px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sky-700 rounded-[1px] shrink-0" />
            <span className="text-black text-[16px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal">The Prag Difference</span>
          </div>
          <h2 className="text-black text-3xl md:text-[48px] font-bold font-['Onest'] leading-[1.2] tracking-[-2px] md:hidden">
            Why Leading Homes<br />and Businesses Choose<br />PRAG
          </h2>
          <h2 className="hidden md:block text-black md:text-[48px] font-bold font-['Onest'] leading-[1.2] tracking-[-2px]">
            Why Leading Homes and<br />Businesses Choose PRAG
          </h2>
          <p className="text-zinc-500 text-base md:text-lg font-['Onest']">
            Our work is guided by a commitment to quality, precision, and long-term performance.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {reasons.map((r) => (
            <div key={r.title} className="relative min-h-[320px] md:min-h-[360px] h-full rounded-2xl outline outline-[0.30px] outline-offset-[-0.30px] outline-zinc-500/50 overflow-hidden group">
              <Image
                src={r.image}
                alt={r.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-black/80" />
              <div className="absolute inset-0 self-stretch px-6 pt-48 pb-6 bg-gradient-to-b from-white/0 to-black/80 rounded-2xl inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch justify-start text-white text-lg md:text-[18px] lg:text-[20px] font-medium font-['Space_Grotesk'] leading-normal whitespace-nowrap">{r.title}</div>
                  <div className="self-stretch justify-start text-white text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed md:leading-normal">{r.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

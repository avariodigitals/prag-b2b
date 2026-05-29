'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { CaseStudiesContent } from '@/lib/caseStudies';

function hasNumericSignal(text: string) {
  return /\d|%|₦|kva|kw|kwh/i.test(text);
}

function getNarrativeOutcome(item: {
  category: string;
  results: Array<{ label: string; value: string }>;
}) {
  const qualitativeResult = item.results.find(
    (result) => !hasNumericSignal(result.value) && result.value.trim().length >= 20,
  );
  if (qualitativeResult) return qualitativeResult.value.trim();

  const category = item.category.toLowerCase();
  if (category === 'industrial') {
    return 'Operations became more stable and predictable, so teams could focus on production targets instead of emergency power interruptions.';
  }
  if (category === 'commercial') {
    return 'Daily operations became smoother for staff and customers, with fewer disruptions and stronger confidence in business continuity.';
  }
  return 'The home environment became noticeably more comfortable and dependable, with less stress around outages and equipment safety.';
}

export default function InstallationsView({ content }: { content: CaseStudiesContent }) {
  const available = useMemo(
    () => content.studies.filter((study) => study.active),
    [content.studies],
  );

  return (
    <main className="w-full bg-white flex flex-col">
      {/* ── Hero ── */}
      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="text-[28px] md:text-[48px] font-bold font-['Onest'] text-[#0166a5] leading-tight max-w-2xl">
          {content.installationsHeroTitle}
        </h1>
        <p className="text-[#0166a5] text-[16px] md:text-[18px] font-normal font-['Space_Grotesk'] leading-[1.4] max-w-[560px]">
          {content.installationsHeroDescription}
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="w-full px-6 md:px-20 py-10 flex flex-col gap-10 max-w-[1280px] mx-auto">

        {/* Case study cards */}
        <div className="flex flex-col gap-4">
          {available.map((item) => (
            <article
              key={item.id}
              className="w-full p-4 sm:p-6 bg-white rounded-3xl border border-zinc-300/60 flex flex-col lg:flex-row justify-start items-stretch gap-6"
            >
              <div
                className={`relative w-full lg:w-[52%] lg:max-w-none shrink-0 h-[280px] sm:h-[340px] lg:h-auto lg:min-h-[500px] rounded-2xl overflow-hidden
                            ${!item.imageLeft ? 'md:order-2' : 'md:order-1'}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className={`w-full lg:flex-1 flex flex-col justify-start items-start gap-5 lg:gap-6
                            ${!item.imageLeft ? 'md:order-1' : 'md:order-2'}`}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#0166A5]/30 bg-[#0166A5]/5">
                  <span className="text-[#0166A5] text-xs uppercase tracking-[0.09em] font-semibold font-['Space_Grotesk']">{item.category}</span>
                </div>

                <h2 className="self-stretch text-black text-[20px] sm:text-2xl font-semibold font-['Onest'] leading-snug">
                  {item.title}
                </h2>

                <div className="self-stretch grid grid-cols-1 gap-4">
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">The Problem</p>
                    <p className="mt-2 text-neutral-700 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">The Solution</p>
                    <p className="mt-2 text-neutral-700 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed">
                      {item.solution}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#0166A5]/25 bg-[#0166A5]/5 p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">Outcome</p>
                    <p className="mt-2 text-neutral-800 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed">
                      {getNarrativeOutcome(item)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── Process section ── */}
      <div className="w-full border-t border-zinc-100 py-10 md:py-16 px-6 md:px-20 flex flex-col gap-10">

        {/* Kicker + heading */}
        <div className="flex flex-col gap-[30px] text-center">
          <div className="flex items-center justify-center gap-[6px]">
            <div className="w-4 h-4 bg-[#0166a5] rounded-sm shrink-0" aria-hidden="true" />
            <span className="text-[#1a1a1a] text-[16px] font-normal font-['Space_Grotesk'] uppercase">
              {content.processKicker}
            </span>
          </div>
          <h2 className="text-[#1a1a1a] text-[28px] md:text-[40px] font-bold font-['Onest'] tracking-[-2px] leading-tight max-w-2xl mx-auto">
            {content.processTitle}
          </h2>
        </div>

        {/* Steps */}
        <div className="w-full max-w-[1280px] mx-auto flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-8">
          {content.processSteps.map((step) => (
            <div key={step.id} className="flex flex-col gap-3">
              {/* Step number: Onest 44px 800 #0166a5 */}
              <span className="text-[#0166a5] text-[44px] font-extrabold font-['Onest'] leading-[44px]">
                {step.label}
              </span>
              {/* Step title: Onest 17px 700 #1a1a1a */}
              <h3 className="text-[#1a1a1a] text-[17px] font-bold font-['Onest']">{step.title}</h3>
              {/* Description: Onest 14px 400 #6b6b6b */}
              <p className="text-[#6b6b6b] text-[14px] font-normal font-['Onest'] leading-[23.8px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {content.installationsCtaLabel && (
          <div className="flex justify-center">
            <Link
              href={content.installationsCtaHref}
              className="px-8 py-3.5 bg-[#0166a5] text-white text-sm font-semibold font-['Onest'] rounded-full hover:bg-sky-800 transition-colors"
            >
              {content.installationsCtaLabel}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

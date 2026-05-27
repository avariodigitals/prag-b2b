'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { CaseStudiesContent } from '@/lib/caseStudies';

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
            <div
              key={item.id}
              /* Mobile: padded card (Figma: 24px radius, rgba border, 12px padding)
                 Desktop: edge-to-edge image in a standard card */
              className="w-full rounded-[24px] border border-[rgba(136,136,136,0.4)] p-3 flex flex-col gap-6
                         md:rounded-2xl md:border-zinc-200 md:p-0 md:overflow-hidden md:flex-row"
            >
              {/* Image — always on top on mobile; left/right on desktop per imageLeft */}
              <div
                className={`relative shrink-0 rounded-2xl overflow-hidden h-[246px]
                            md:rounded-none md:h-auto md:w-[400px] lg:w-[480px]
                            ${!item.imageLeft ? 'md:order-2' : 'md:order-1'}`}
              >
                {/* Use <img> because imageUrl is an external https URL */}
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div
                className={`flex flex-col gap-6 md:gap-5 md:p-6 lg:p-8 flex-1
                            ${!item.imageLeft ? 'md:order-1' : 'md:order-2'}`}
              >
                {/* Title + Problem + Solutions + Tags */}
                <div className="flex flex-col gap-3">
                  {/* Title */}
                  <h2 className="text-[#1a1a1a] text-[18px] font-medium font-['Onest'] leading-snug">
                    {item.title}
                  </h2>

                  {/* Problem */}
                  <div className="flex flex-col gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0166a5]/10 text-[#0166a5] text-[14px] font-medium font-['Onest'] w-fit">
                      Problem
                    </span>
                    <p className="text-[#444444] text-[14px] font-normal font-['Onest'] leading-[1.7]">
                      {item.problem}
                    </p>
                  </div>

                  {/* Solutions */}
                  <div className="flex flex-col gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0166a5]/10 text-[#0166a5] text-[14px] font-medium font-['Onest'] uppercase tracking-wide w-fit">
                      {content.solutionSectionLabel}
                    </span>
                    <p className="text-[#444444] text-[14px] font-normal font-['Onest'] leading-[1.7]">
                      {item.solution}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full border border-[#444444]/30 text-[#444444] text-[12px] font-normal font-['Onest']"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-3">
                  <span className="text-[#1a1a1a] text-[16px] font-normal font-['Onest'] uppercase">{content.resultsSectionLabel}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {item.results.map((result, index) => (
                      <div
                        key={`${item.id}-${result.label}-${index}`}
                        className="bg-[#f8f8f8] rounded-[12px] border border-[#444444]/30 px-2 py-2 flex flex-col gap-2"
                      >
                        <span className="text-[#444444] text-[12px] font-normal font-['Onest'] uppercase tracking-wide leading-tight">
                          {result.label}
                        </span>
                        <span className="text-[#444444] text-[14px] font-normal font-['Onest']">
                          {result.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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

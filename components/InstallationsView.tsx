'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CaseStudiesContent } from '@/lib/caseStudies';

export default function InstallationsView({ content }: { content: CaseStudiesContent }) {
  const [active, setActive] = useState<'All' | 'Residential' | 'Commercial' | 'Industrial'>('All');

  const categories = useMemo(
    () => ['All', ...content.categories] as const,
    [content.categories],
  );

  const available = useMemo(
    () => content.studies.filter((study) => study.active),
    [content.studies],
  );

  const filtered = useMemo(
    () => (active === 'All' ? available : available.filter((study) => study.category === active)),
    [active, available],
  );

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full pt-12 md:pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-4 px-4 text-center border-b border-zinc-200">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat'] leading-tight">
          {content.installationsHeroTitle.split('\n').map((line, index) => (
            <span key={`${line}-${index}`}>
              {line}
              {index < content.installationsHeroTitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="max-w-[560px] text-sky-700 text-lg md:text-xl font-normal font-['Montserrat']">
          {content.installationsHeroDescription}
        </p>
      </div>

      <div className="w-full px-6 md:px-10 py-10 flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-3xl text-sm font-medium font-['Montserrat'] transition-colors ${active === cat ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="w-full rounded-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row">
              {item.imageLeft && (
                <div className="relative w-full md:w-[480px] shrink-0 h-64 md:h-auto">
                  <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                </div>
              )}

              <div className="flex-1 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Montserrat']">{item.title}</h2>

                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-medium font-['Montserrat'] rounded-full w-fit border border-sky-200">Problem</span>
                  <p className="text-zinc-600 text-lg md:text-xl font-['Montserrat'] leading-relaxed mt-1">{item.problem}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold font-['Montserrat'] rounded-full w-fit uppercase tracking-wider">Solutions</span>
                  <p className="text-zinc-600 text-lg md:text-xl font-['Montserrat'] leading-relaxed mt-1">{item.solution}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-zinc-200 text-zinc-600 text-xs font-['Montserrat']">{tag}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-zinc-900 text-xs font-bold font-['Montserrat'] uppercase tracking-widest">Results</span>
                  <div className="grid grid-cols-3 gap-2">
                    {item.results.map((result, index) => (
                      <div key={`${item.id}-${result.label}-${index}`} className="border border-zinc-200 rounded-lg px-3 py-2.5 flex flex-col gap-0.5">
                        <span className="text-zinc-400 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wider">{result.label}</span>
                        <span className="text-zinc-900 text-sm font-bold font-['Montserrat']">{result.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!item.imageLeft && (
                <div className="relative w-full md:w-[480px] shrink-0 h-64 md:h-auto order-first md:order-last">
                  <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-zinc-200 py-16 px-6 md:px-10 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">{content.processKicker}</span>
          </div>
          <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Montserrat'] leading-tight">
            {content.processTitle.split('\n').map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < content.processTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
          {content.processSteps.map((step) => (
            <div key={step.id} className="flex flex-col gap-3">
              <span className="text-sky-700 text-4xl font-bold font-['Montserrat']">{step.label}</span>
              <h3 className="text-zinc-900 text-base font-bold font-['Montserrat']">{step.title}</h3>
              <p className="text-zinc-500 text-lg md:text-xl font-['Montserrat'] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <Link
          href={content.installationsCtaHref}
          className="px-8 py-3.5 bg-sky-700 text-white text-sm font-semibold font-['Montserrat'] rounded-full hover:bg-sky-800 transition-colors"
        >
          {content.installationsCtaLabel}
        </Link>
      </div>
    </main>
  );
}

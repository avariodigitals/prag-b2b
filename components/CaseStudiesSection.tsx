import Link from 'next/link';
import { SentenceText } from '@/lib/sentenceText';
import { getCaseStudiesContent } from '@/lib/caseStudies';

function hasNumericSignal(text: string) {
  return /\d|%|₦|kva|kw|kwh/i.test(text);
}

function getNarrativeOutcome(study: {
  category: string;
  title: string;
  problem: string;
  solution: string;
  results: Array<{ label: string; value: string }>;
}) {
  const qualitativeResult = study.results.find(
    (item) => !hasNumericSignal(item.value) && item.value.trim().length >= 20,
  );
  if (qualitativeResult) return qualitativeResult.value.trim();

  const category = study.category.toLowerCase();
  if (category === 'industrial') {
    return 'Operations became more stable and predictable, so teams could focus on production targets instead of emergency power interruptions.';
  }
  if (category === 'commercial') {
    return 'Daily operations became smoother for staff and customers, with fewer disruptions and stronger confidence in business continuity.';
  }
  return 'The home environment became noticeably more comfortable and dependable, with less stress around outages and equipment safety.';
}

export default async function CaseStudiesSection() {
  const content = await getCaseStudiesContent();
  const activeStudies = content.studies.filter((study) => study.active);
  const featuredStudy = activeStudies.find((study) => study.featured)
    ?? activeStudies[0]
    ?? content.studies[0];

  const displayStudies = featuredStudy ? [featuredStudy] : [];

  if (displayStudies.length === 0) return null;

  const sectionTitleLines = content.sectionTitle.includes('Real Projects')
    ? [content.sectionTitle.replace(/\s*Real Projects\s*$/, '').trim(), 'Real Projects']
    : content.sectionTitle.split('\n');

  return (
    <section className="w-full bg-[#fafafa] py-12 md:py-16 px-4 sm:px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-[6px]">
            <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
            <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase tracking-wide">{content.sectionKicker}</span>
          </div>
          <h2 className="text-black text-[28px] sm:text-[34px] md:text-5xl font-bold font-['Onest'] leading-[1.1] tracking-[-2px] max-w-[631px]">
            {sectionTitleLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-zinc-500 text-[16px] md:text-[20px] font-['Onest'] max-w-xl text-center">
            {content.sectionDescription}
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="self-stretch w-full flex flex-col gap-6">
          {displayStudies.map((study) => (
            <article
              key={study.id}
              className="w-full p-4 sm:p-6 bg-white rounded-3xl border border-[#888888] flex flex-col lg:flex-row justify-start items-stretch gap-6"
            >
              <div className="relative w-full lg:w-[52%] lg:max-w-none shrink-0 h-[280px] sm:h-[340px] lg:h-auto lg:min-h-[500px] rounded-2xl overflow-hidden">
                <img
                  src={study.imageUrl}
                  alt={study.imageAlt || study.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full lg:flex-1 flex flex-col justify-start items-start gap-5 lg:gap-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#0166A5]/30 bg-[#0166A5]/5">
                  <span className="text-[#0166A5] text-xs uppercase tracking-[0.09em] font-semibold font-['Space_Grotesk']">{study.category}</span>
                </div>

                <h3 className="self-stretch text-black text-[20px] sm:text-2xl font-semibold font-['Onest'] leading-snug">
                  {study.title}
                </h3>

                <div className="self-stretch grid grid-cols-1 gap-4">
                  <div className="rounded-2xl p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">The Problem</p>
                    <p className="mt-2 text-neutral-700 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed"><SentenceText text={study.problem} /></p>
                  </div>

                  <div className="rounded-2xl p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">The Solution</p>
                    <p className="mt-2 text-neutral-700 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed"><SentenceText text={study.solution} /></p>
                  </div>

                  <div className="rounded-2xl p-4">
                    <p className="text-[#0166A5] text-[12px] uppercase tracking-[0.08em] font-semibold font-['Space_Grotesk']">Outcome</p>
                    <p className="mt-2 text-neutral-800 text-[15px] sm:text-base font-normal font-['Onest'] leading-relaxed"><SentenceText text={getNarrativeOutcome(study)} /></p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={content.sectionCtaHref}
          className="px-6 py-4 bg-[#0166A5] rounded-3xl inline-flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors min-w-[200px]"
        >
          <span className="text-white text-base font-medium [font-family:var(--font-space-grotesk)]">
            {content.sectionCtaLabel}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

      </div>
    </section>
  );
}

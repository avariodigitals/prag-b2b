import Link from 'next/link';
import { getCaseStudiesContent } from '@/lib/caseStudies';

export default async function CaseStudiesSection() {
  const content = await getCaseStudiesContent();
  const featuredStudy = content.studies.find((study) => study.featured && study.active)
    ?? content.studies.find((study) => study.active)
    ?? content.studies[0];

  if (!featuredStudy) return null;

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

        {/* Case Study Card */}
        <div className="self-stretch w-full p-4 sm:p-6 bg-white rounded-3xl border border-zinc-500/40 flex flex-col lg:flex-row justify-start items-start gap-6">
          {/* Image */}
          <div className="relative w-full lg:w-[546px] lg:max-w-[546px] shrink-0 h-[240px] sm:h-[300px] lg:h-[458px] rounded-2xl overflow-hidden">
            <img
              src={featuredStudy.imageUrl}
              alt={featuredStudy.imageAlt || featuredStudy.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:flex-1 flex flex-col justify-start items-start gap-6 lg:gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <h3 className="self-stretch text-black text-[18px] sm:text-xl font-medium font-['Onest'] leading-snug">
                {featuredStudy.title}
              </h3>
              <p className="self-stretch text-neutral-500 text-[14px] sm:text-base font-normal font-['Onest'] leading-normal">
                {featuredStudy.problem}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {featuredStudy.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-stone-50 rounded-[32px] border border-neutral-500/30 inline-flex items-center">
                    <span className="text-neutral-500 text-[11px] sm:text-xs font-normal font-['Onest'] leading-normal">{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="self-stretch flex flex-col gap-3">
              <span className="text-black text-sm font-normal font-['Onest'] leading-normal uppercase tracking-[0.08em]">Results</span>
              <div className="grid grid-cols-2 gap-2">
                {featuredStudy.results.map((r) => (
                  <div key={`${r.label}-${r.value}`} className="p-2 sm:p-3 bg-stone-50 rounded-xl border border-neutral-500/30 flex flex-col gap-1 sm:gap-2">
                    <span className="text-neutral-500 text-[10px] sm:text-xs font-bold font-['Onest'] leading-normal uppercase">{r.label}</span>
                    <span className="text-neutral-700 text-base sm:text-lg font-bold font-['Onest'] leading-normal">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

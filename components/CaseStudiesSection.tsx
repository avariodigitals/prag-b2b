import Image from 'next/image';
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
    <section className="w-full bg-[#f3f3f3] pt-8 pb-16 md:py-16 px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sky-700 rounded-[1px] shrink-0" />
            <span className="text-black text-[16px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal">{content.sectionKicker}</span>
          </div>
          <h2 className="w-full md:w-[631px] text-center justify-start text-black text-3xl md:text-5xl font-bold font-['Onest'] leading-[1.2] tracking-[-2px]">
            {sectionTitleLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-zinc-500 text-base md:text-lg font-['Onest'] max-w-xl text-center">
            {content.sectionDescription}
          </p>
        </div>

        {/* Case Study Card */}
        <div className="self-stretch w-full p-6 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-500/40 inline-flex flex-col lg:flex-row justify-start items-center gap-6">
          {/* Image */}
          <div className="relative w-full lg:w-[546px] lg:max-w-[546px] shrink-0 h-[280px] sm:h-[340px] lg:h-[458px] rounded-2xl overflow-hidden">
            <Image
              src={featuredStudy.imageUrl}
              alt={featuredStudy.imageAlt || featuredStudy.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 546px, 100vw"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-[662px] self-stretch px-4 py-6 bg-white inline-flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <h3 className="self-stretch text-black text-2xl font-medium font-['Onest'] leading-normal">
              {featuredStudy.title}
            </h3>
              <p className="self-stretch text-neutral-500 text-lg font-normal font-['Onest'] leading-normal">
              {featuredStudy.problem}
            </p>

              {/* Tags */}
              <div className="inline-flex justify-start items-start gap-1 flex-wrap content-start">
                {featuredStudy.tags.map((tag) => (
                  <span key={tag} className="p-1 bg-stone-50 rounded-[32px] outline outline-[0.30px] outline-offset-[-0.30px] outline-neutral-500 inline-flex justify-start items-center gap-2">
                    <span className="justify-start text-neutral-500 text-xs font-normal font-['Onest'] leading-normal">{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <span className="self-stretch justify-start text-black text-xl font-normal font-['Onest'] leading-normal uppercase tracking-[0.08em]">Results</span>
              <div className="self-stretch inline-flex justify-start items-start gap-2 flex-wrap content-start">
                {featuredStudy.results.map((r) => (
                  <div key={`${r.label}-${r.value}`} className="w-48 p-2 bg-stone-50 rounded-xl outline outline-[0.30px] outline-offset-[-0.30px] outline-neutral-500 inline-flex flex-col justify-center items-start gap-2">
                    <span className="self-stretch justify-start text-neutral-700 text-sm font-normal font-['Onest'] leading-normal uppercase">{r.label}</span>
                    <span className="self-stretch justify-start text-neutral-700 text-lg font-normal font-['Onest'] leading-normal">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={content.sectionCtaHref}
          className="p-4 bg-sky-700 rounded-3xl inline-flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
        >
          <span className="justify-start text-white text-base font-medium [font-family:var(--font-space-grotesk)]">
            {content.sectionCtaLabel}
          </span>
          <span className="size-6 relative overflow-hidden inline-flex items-center justify-center" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>

      </div>
    </section>
  );
}

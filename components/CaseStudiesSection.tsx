import Image from 'next/image';
import Link from 'next/link';
import { getCaseStudiesContent } from '@/lib/caseStudies';

export default async function CaseStudiesSection() {
  const content = await getCaseStudiesContent();
  const featuredStudy = content.studies.find((study) => study.featured && study.active)
    ?? content.studies.find((study) => study.active)
    ?? content.studies[0];

  if (!featuredStudy) return null;

  return (
    <section className="w-full bg-white pt-8 pb-16 md:py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">{content.sectionKicker}</span>
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-bold font-['Montserrat'] leading-tight text-center">
            {content.sectionTitle.split('\n').map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < content.sectionTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-['Montserrat'] max-w-xl text-center">
            {content.sectionDescription}
          </p>
        </div>

        {/* Case Study Card */}
        <div className="w-full rounded-2xl bg-white border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Image */}
          <div className="relative w-full md:w-[380px] shrink-0 h-64 md:h-auto rounded-xl overflow-hidden">
            <Image
              src={featuredStudy.imageUrl}
              alt={featuredStudy.imageAlt || featuredStudy.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 380px, 100vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 flex-1">
            <h3 className="text-zinc-900 text-lg md:text-xl font-bold font-['Montserrat'] leading-snug">
              {featuredStudy.title}
            </h3>
            <p className="text-zinc-500 text-lg md:text-xl font-['Montserrat'] leading-relaxed">
              {featuredStudy.problem}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {featuredStudy.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-gray-200 text-zinc-600 text-xs font-['Montserrat']">
                  {tag}
                </span>
              ))}
            </div>

            {/* Results */}
            <div className="flex flex-col gap-3">
              <span className="text-zinc-900 text-xs font-bold font-['Montserrat'] uppercase tracking-widest">Results</span>
              <div className="grid grid-cols-3 gap-2">
                {featuredStudy.results.map((r) => (
                  <div key={`${r.label}-${r.value}`} className="border border-gray-200 rounded-lg px-3 py-2.5 flex flex-col gap-0.5">
                    <span className="text-zinc-400 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wider">{r.label}</span>
                    <span className="text-zinc-900 text-sm font-bold font-['Montserrat']">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={content.sectionCtaHref}
          className="px-8 py-3.5 bg-sky-900 text-white text-sm font-semibold font-['Montserrat'] rounded-full hover:bg-sky-800 transition-colors flex items-center gap-2"
        >
          {content.sectionCtaLabel}
        </Link>

      </div>
    </section>
  );
}

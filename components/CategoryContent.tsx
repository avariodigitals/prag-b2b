import Link from 'next/link';
import type { CategoryContent, Paragraph, Segment } from '@/lib/categoryContent';

function SegmentText({ segment }: { segment: Segment }) {
  if (typeof segment === 'string') return <>{segment}</>;
  return (
    <Link
      href={segment.href}
      className="text-[#0166a5] font-medium underline decoration-[#0166a5]/30 underline-offset-2 hover:decoration-[#0166a5] transition-colors"
    >
      {segment.label}
    </Link>
  );
}

function ParagraphBlock({ paragraph }: { paragraph: Paragraph }) {
  return (
    <p className="text-[#52525b] text-[16px] md:text-[18px] font-normal font-['Onest'] leading-relaxed">
      {paragraph.segments.map((segment, i) => (
        <SegmentText key={i} segment={segment} />
      ))}
    </p>
  );
}

/**
 * Renders the Step 9 on-page content for a product category: quick navigation,
 * guidance sections (H2 + paragraphs/lists), and the proof links block.
 * FAQs and the primary CTA are rendered separately by the page so they can sit
 * after the product grid.
 */
export function CategoryContentSections({ content }: { content: CategoryContent }) {
  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* Quick category/type navigation */}
      {content.quickNav && content.quickNav.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[#1a1a1a] text-[20px] md:text-[22px] font-semibold font-['Onest'] leading-tight">
            Browse by type
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {content.quickNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-[15px] font-medium font-['Onest'] text-[#1a1a1a] capitalize hover:border-[#0166a5] hover:text-[#0166a5] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Guidance sections */}
      {content.sections.map((section, i) => (
        <section key={`${section.heading}-${i}`} id={section.id} className="flex flex-col gap-4 scroll-mt-24">
          <h2 className="text-[#1a1a1a] text-[24px] md:text-[28px] font-bold font-['Onest'] leading-tight tracking-[-0.5px]">
            {section.heading}
          </h2>
          {section.paragraphs?.map((paragraph, j) => (
            <ParagraphBlock key={j} paragraph={paragraph} />
          ))}
          {section.list && section.list.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {section.list.map((item, k) => (
                <li
                  key={k}
                  className="flex items-start gap-3 text-[#52525b] text-[16px] md:text-[18px] font-normal font-['Onest'] leading-relaxed"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0166a5]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Contextual proof links — only where a real relevant project exists */}
      {content.proofLinks && content.proofLinks.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-200 pt-6">
          {content.proofLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 text-[#0166a5] text-[15px] md:text-[16px] font-semibold font-['Onest'] hover:underline underline-offset-2"
            >
              {link.label}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Renders the FAQ + primary/secondary CTA block, placed after the product grid.
 */
export function CategoryFaqAndCta({ content }: { content: CategoryContent }) {
  return (
    <div className="flex flex-col gap-12">
      {content.faqs.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-[#1a1a1a] text-[24px] md:text-[28px] font-bold font-['Onest'] leading-tight tracking-[-0.5px]">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 open:border-[#0166a5]/40"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="text-[#1a1a1a] text-[16px] md:text-[18px] font-medium font-['Onest'] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className="shrink-0 text-[#0166a5] text-xl leading-none transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[#52525b] text-[15px] md:text-[16px] font-normal font-['Onest'] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Primary CTA */}
      <section className="flex flex-col items-start gap-4 rounded-2xl bg-stone-50 px-6 py-8 md:px-8 md:py-10">
        <h2 className="text-[#1a1a1a] text-[22px] md:text-[26px] font-bold font-['Onest'] leading-tight">
          Not sure where to start?
        </h2>
        <p className="text-[#52525b] text-[16px] md:text-[18px] font-normal font-['Onest'] leading-relaxed max-w-xl">
          Tell PRAG what you need to power and how long for. We{"\u2019"}ll recommend the right equipment and sizing for your site.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={content.primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-[#0166a5] px-6 py-3 text-white text-[16px] font-medium font-['Onest'] hover:bg-[#01588e] transition-colors"
          >
            {content.primaryCta.label}
          </Link>
          {content.secondaryCta && (
            <Link
              href={content.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-[#1a1a1a] text-[16px] font-medium font-['Onest'] hover:border-[#0166a5] hover:text-[#0166a5] transition-colors"
            >
              {content.secondaryCta.label}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

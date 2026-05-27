import Link from 'next/link';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

async function getHeroContent() {
  const fallback = {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg',
    mobileImage: 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg',
    title: 'Low or High Voltage?\nUnreliable or No Power?\nGet PRAG',
    body: 'We design, install, and support reliable power systems for homes, businesses, and industries across Nigeria.',
    ctaLabel: 'Get a Free Power Assessment',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Chat on WhatsApp',
    secondaryCtaHref: 'https://wa.me/2348032170129',
  };

  const content = await getB2BPublicContent();
  const homePage = findB2BPage(content, '/');
  const hero = findVisibleSectionsByType(homePage, 'hero')[0];
  if (!hero) return fallback;

  const mobileImage = (
    hero as typeof hero & { mobileImageUrl?: string; imageUrlMobile?: string; mobileImage?: string }
  ).mobileImageUrl?.trim()
    || (hero as typeof hero & { mobileImageUrl?: string; imageUrlMobile?: string; mobileImage?: string }).imageUrlMobile?.trim()
    || (hero as typeof hero & { mobileImageUrl?: string; imageUrlMobile?: string; mobileImage?: string }).mobileImage?.trim()
    || hero.imageUrl?.trim()
    || fallback.image;

  return {
    image: hero.imageUrl?.trim() || fallback.image,
    mobileImage,
    title: hero.summary?.trim() || hero.title?.trim() || fallback.title,
    body: hero.content?.trim() || fallback.body,
    ctaLabel: hero.ctaLabel?.trim() || fallback.ctaLabel,
    ctaHref: hero.ctaHref?.trim() || fallback.ctaHref,
    secondaryCtaLabel: hero.secondaryCtaLabel?.trim() || fallback.secondaryCtaLabel,
    secondaryCtaHref: hero.secondaryCtaHref?.trim() || fallback.secondaryCtaHref,
  };
}

export default async function Hero() {
  const hero = await getHeroContent();
  const titleLines = hero.title.replace(/\r\n/g, '\n').split('\n');
  const normalizedCtaLabel = hero.ctaLabel.replace(/\s+/g, ' ').trim().toLowerCase();
  const resolvedCtaHref = normalizedCtaLabel === 'get a free power assessment'
    ? '/free-power-assessment'
    : hero.ctaHref;

  return (
    <section className="relative overflow-hidden w-full min-h-[420px] md:h-[704px] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-20 pt-[150px] pb-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: "url('/images/herobg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.60) contrast(1.08) saturate(0.92)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: `
            linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%),
            linear-gradient(13deg, rgba(0, 0, 0, 0.72) 30.12%, rgba(255, 255, 255, 0.04) 76.12%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%),
            url('/images/herobg.jpg') lightgray 50% / cover no-repeat
          `,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.22) 0%,
              rgba(0, 0, 0, 0.30) 30%,
              rgba(0, 0, 0, 0.48) 60%,
              rgba(0, 0, 0, 0.78) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center justify-center gap-8 md:gap-12">
        {/* Text */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <h1 className="text-white text-center font-['Onest'] text-[28px] sm:text-[40px] md:text-[64px] font-bold leading-[1.05] px-2">
            {titleLines.map((line, index) => {
              let marginBottom: string | undefined;
              if (index === 0) marginBottom = '2pt';
              if (index === 1) marginBottom = '3pt';

              return (
                <span
                  key={`${line}-${index}`}
                  className="block text-center"
                  style={{ marginBottom }}
                >
                  {line.length > 0 ? line : '\u00A0'}
                </span>
              );
            })}
          </h1>
          <p className="text-white text-center [font-family:var(--font-space-grotesk)] text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-[1.5] max-w-[361px] sm:max-w-[480px] md:max-w-[760px]">
            {hero.body}
          </p>
        </div>

        {/* CTAs */}
        <div className="w-full max-w-[361px] sm:max-w-[440px] md:max-w-[700px] flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4">
          <Link
            href={resolvedCtaHref}
            className="flex-1 sm:flex-none w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-[#0166A5] text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-[#01588e] transition-colors text-center"
          >
            {hero.ctaLabel}
          </Link>
          <a
            href={hero.secondaryCtaHref}
            target={hero.secondaryCtaHref.startsWith('http') ? '_blank' : undefined}
            rel={hero.secondaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex-1 sm:flex-none w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-white hover:text-zinc-900 transition-colors"
          >
            {hero.secondaryCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

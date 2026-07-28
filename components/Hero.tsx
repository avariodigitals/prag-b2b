import Link from 'next/link';
import Image from 'next/image';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

async function getHeroContent() {
  const fallback = {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg',
    mobileImage: 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg',
    title: 'Low or High Voltage?\nUnreliable or No Power?\nGet PRAG',
    body: 'Reliable power solutions for homes, businesses, and industries across Nigeria.',
    ctaLabel: 'Get a Free Power Assessment',
    ctaHref: '/free-power-assessment',
    secondaryCtaLabel: 'Phone/WhatsApp',
    secondaryCtaHref: 'https://wa.me/2348032170129',
  };

  const content = await getB2BPublicContent();
  const homePage = findB2BPage(content, '/');
  const hero = findVisibleSectionsByType(homePage, 'hero')[0];
  if (!hero) return fallback;

  const mobileImage = hero.mobileImageUrl?.trim() || hero.imageUrl?.trim() || fallback.image;

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

  return (
    <section className="relative overflow-hidden w-full min-h-[420px] md:h-[704px] flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 sm:px-6 md:px-20 pt-[150px] md:pt-[100px] pb-10">
      <div
        className="absolute inset-x-0 top-0 h-full bg-cover bg-bottom bg-no-repeat md:hidden"
        style={{
          backgroundImage: `url('${hero.mobileImage}')`,
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-full bg-black/40 md:hidden" aria-hidden="true" />

      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'right center' }}
        />
      </div>

      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: 'linear-gradient(90deg, rgba(8, 28, 48, 0.72) 0%, rgba(8, 28, 48, 0.45) 35%, rgba(8, 28, 48, 0.15) 60%, rgba(8, 28, 48, 0) 80%)',
        }}
        aria-hidden="true"
      />


      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center md:items-start justify-center gap-8 md:gap-12">
        {/* Text */}
        <div className="flex flex-col items-center md:items-start gap-4 md:gap-6">
          <h1 className="text-white text-center md:text-left font-['Onest'] text-[28px] sm:text-[40px] md:text-[64px] font-bold leading-[1.05] px-2 md:px-0 mb-2 md:mb-0">
            {titleLines.map((line, index) => {
              const marginClass =
                index === 0
                  ? 'mb-1 md:mb-2'
                  : index === 1
                    ? 'mb-1 md:mb-2'
                    : '';

              return (
                <span
                  key={`${line}-${index}`}
                  className={`block text-center md:text-left ${marginClass}`}
                >
                  {line.length > 0 ? line : '\u00A0'}
                </span>
              );
            })}
          </h1>
          <p className="text-white text-center md:text-left [font-family:var(--font-space-grotesk)] text-[18px] sm:text-[20px] md:text-[22px] font-normal leading-[1.5] max-w-[361px] sm:max-w-[520px] md:max-w-[640px]">
            <SentenceText text={hero.body} />
          </p>
        </div>

        {/* CTAs */}
        <div className="w-full max-w-[361px] sm:max-w-[440px] md:max-w-[700px] flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 md:gap-4">
          <Link
            href={hero.ctaHref}
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

import Link from 'next/link';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

async function getHeroContent() {
  const fallback = {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg',
    title: 'Unstable Power? We Fix It Permanently.',
    body: 'We design, install, and support reliable power systems for homes, businesses, and industries across Nigeria.',
    ctaLabel: 'Get a Free Power Assessment',
    ctaHref: '/contact',
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
  };
}

export default async function Hero() {
  const hero = await getHeroContent();
  const mobileHeroImage = (hero as typeof hero & { mobileImage?: string }).mobileImage || hero.image;
  const questionMarkIndex = hero.title.indexOf('?');
  const firstLine = questionMarkIndex >= 0 ? hero.title.slice(0, questionMarkIndex + 1) : hero.title;
  const secondLine = questionMarkIndex >= 0 ? hero.title.slice(questionMarkIndex + 1).trim() : '';

  return (
    <section className="relative w-full h-auto md:h-[704px] flex flex-col justify-start md:justify-center items-center text-center px-4 sm:px-6 md:px-20 pt-[80px] pb-[40px] md:pt-0 md:pb-0 overflow-hidden">
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: `url('${mobileHeroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'lightgray',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: `url('${hero.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'lightgray',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.56) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center justify-center gap-7 sm:gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-7">
          <h1 className="text-white text-center font-['Onest'] text-[28px] sm:text-[44px] md:text-[64px] font-bold leading-[1]">
            <span className="block">{firstLine}</span>
            {secondLine && <span className="block">{secondLine}</span>}
          </h1>
          <p className="text-white text-center [font-family:var(--font-space-grotesk)] text-[15px] sm:text-[17px] md:text-[18px] font-normal leading-[1.4] max-w-[760px]">
            {hero.body}
          </p>
        </div>

        <div className="w-full max-w-[520px] flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Link
            href={hero.ctaHref}
            className="w-full sm:w-auto px-6 py-3 bg-[#0166A5] text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-[#01588e] transition-colors"
          >
            {hero.ctaLabel}
          </Link>
          <a
            href="https://wa.me/2348032170129"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white text-white [font-family:var(--font-space-grotesk)] text-[16px] font-medium leading-normal rounded-full hover:bg-white hover:text-zinc-900 transition-colors inline-flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#25D366]" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

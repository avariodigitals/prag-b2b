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

  return {
    image: hero.imageUrl?.trim() || fallback.image,
    title: hero.summary?.trim() || hero.title?.trim() || fallback.title,
    body: hero.content?.trim() || fallback.body,
    ctaLabel: hero.ctaLabel?.trim() || fallback.ctaLabel,
    ctaHref: hero.ctaHref?.trim() || fallback.ctaHref,
  };
}

export default async function Hero() {
  const hero = await getHeroContent();
  return (
    <section
      className="relative w-full min-h-[84vh] md:min-h-[88vh] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url('${hero.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold font-['Onest'] leading-tight">
          {hero.title}
        </h1>
        <p className="text-white/80 text-base md:text-lg font-['Space_Grotesk'] max-w-xl">
          {hero.body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href={hero.ctaHref}
            className="px-6 py-3 bg-sky-700 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-sky-800 transition-colors"
          >
            {hero.ctaLabel}
          </Link>
          <a
            href="https://wa.me/2348032170129"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-transparent border border-white text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-white hover:text-zinc-900 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TECHNOLOGIES = [
  {
    name: 'Voltage Stabilizers',
    slug: 'voltage-stabilizers',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
    href: '/products/all-prag-stabilizers',
  },
  {
    name: 'Inverters',
    slug: 'inverters',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png',
    href: '/products/inverters',
  },
  {
    name: 'Solar Systems',
    slug: 'solar',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
    href: '/products/solar',
  },
  {
    name: 'Battery Storage',
    slug: 'batteries',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
    href: '/products/batteries',
  },
];

export default function TechnologiesSection() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [technologies, setTechnologies] = useState(TECHNOLOGIES);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        const res = await fetch('/api/public/b2b-content', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const page = data?.pages?.find((entry: { route: string; sections?: Array<{ type: string; imageUrl?: string; summary?: string; title?: string; ctaHref?: string }> }) => entry.route === '/');
        const technologySections = Array.isArray(page?.sections)
          ? page.sections.filter((section: { type?: string; visible?: boolean }) => section.type === 'technology' && section.visible !== false)
          : [];
        if (cancelled) return;

        setTechnologies((current) => current.map((item, index) => {
          const section = technologySections[index];
          if (!section) return item;
          return {
            ...item,
            name: section.summary?.trim() || section.title?.trim() || item.name,
            image: section.imageUrl?.trim() || item.image,
            href: section.ctaHref?.trim() || item.href,
          };
        }));
      } catch {
        // Keep the built-in images as a safe fallback.
      }
    }

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container) return;
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards.length === 0) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
  };

  const handleDotClick = (index: number) => {
    const container = sliderRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement | undefined;
    if (!card) return;

    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setActiveIndex(index);
  };

  return (
    <section className="w-full bg-white pt-12 pb-6 md:py-20 overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-8 md:gap-10">

          {/* Header */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Kicker */}
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
              <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase tracking-wide">
                Our Technologies
              </span>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
              {/* Title */}
              <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1.1] tracking-[-2px] max-w-[600px] md:max-w-[680px]">
                <span className="block md:hidden">
                  Four Technologies.
                  <br />
                  One Complete System.
                </span>
                <span className="hidden md:inline">Four Technologies. One Complete System.</span>
              </h2>
              {/* Description */}
              <p className="text-[#787878] text-[16px] md:text-xl font-normal font-['Onest'] leading-normal max-w-[600px] md:max-w-[520px]">
                Every PRAG solution is built from the right combination of technologies — engineered, installed, and warranted by our team.
              </p>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-3 sm:gap-5 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {technologies.map((tech) => (
              <Link
                key={tech.slug}
                href={tech.href}
                className="relative snap-start flex-none w-full sm:w-[60%] md:w-[600px] h-[527px] md:h-[755px] rounded-3xl overflow-hidden group"
                style={{
                  background: 'linear-gradient(179.15deg, rgba(102,102,102,0.2) 12.01%, rgba(0,0,0,1) 99.26%)',
                }}
              >
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="absolute inset-0 w-full h-full object-contain p-8 pb-28 md:p-16 md:pb-24 group-hover:scale-105 transition-transform duration-300"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.85) 100%)',
                  }}
                  aria-hidden="true"
                />
                {/* Label */}
                <div className="absolute inset-x-0 bottom-5 md:bottom-8 flex justify-center px-6 md:px-7 text-center">
                  <span className="text-white text-2xl md:text-3xl font-semibold font-['Onest'] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    {tech.name}
                  </span>
                </div>
                {/* Arrow button */}
                <div className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex p-2.5 md:p-3 items-center gap-[10px] bg-[#0166A5] rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg">
                  <ArrowUpRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2">
            {technologies.map((tech, index) => (
              <button
                key={tech.slug}
                type="button"
                aria-label={`Go to ${tech.name}`}
                onClick={() => handleDotClick(index)}
                className={`h-[11px] rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-[42px] bg-[#0166A5]' : 'w-[11px] bg-[#D0D0D0] hover:bg-[#BEBEBE]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

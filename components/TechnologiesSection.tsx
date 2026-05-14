"use client";

import Image from 'next/image';
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
    <section className="w-full bg-white pt-16 pb-6 md:py-20 overflow-hidden">
      <div className="w-full px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-14">
          <div className="flex flex-col gap-3 md:w-1/2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-700 rounded-[1px] shrink-0" />
              <span className="text-black text-[16px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal">Our Technologies</span>
            </div>
            <h2
              className="text-black text-3xl md:text-[48px] font-bold font-['Onest'] leading-normal"
              style={{
                letterSpacing: '-2px',
                lineHeight: 'normal',
              }}
            >
              Four Technologies.<br /><span>One Complete System.</span>
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col gap-4 md:pt-10">
            <p
              className="max-w-[520px]"
              style={{
                color: '#787878',
                fontFamily: 'Onest, sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
              }}
            >
              Every PRAG solution is built using the right combination of: Voltage Stabilizers, Inverters, Solar Systems and Lithium Battery Storage engineered, installed, and supported by our team.
            </p>

          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-0 sm:gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pr-0 sm:pr-6 md:pr-28 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {technologies.map((tech) => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="relative snap-start flex-none w-full sm:w-[54%] md:w-[600px] h-[540px] md:h-[755px] bg-gradient-to-b from-stone-500/10 via-zinc-700/50 to-black rounded-[32px] md:rounded-xl overflow-hidden group"
            >
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 54vw, 82vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300 p-8 pb-28 md:p-16 md:pb-24"
              />
              <div className="absolute inset-x-0 bottom-5 md:bottom-8 flex justify-start px-6 md:px-7">
                <span className="justify-start text-left text-white text-3xl font-semibold font-['Onest'] leading-tight whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">{tech.name}</span>
              </div>
              <div className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex p-3 items-center gap-[10px] bg-sky-700 rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg">
                <ArrowUpRight className="w-5 h-5 md:w-10 md:h-10 text-white" />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          {technologies.map((tech, index) => (
            <button
              key={tech.slug}
              type="button"
              aria-label={`Go to ${tech.name}`}
              onClick={() => handleDotClick(index)}
              className={`h-4 rounded-full transition-all ${
                activeIndex === index ? 'w-16 bg-[#0166A5]' : 'w-8 bg-[#D0D0D0] hover:bg-[#BEBEBE]'
              }`}
            />
          ))}
        </div>

        </div>
      </div>
    </section>
  );
}

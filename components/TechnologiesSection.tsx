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
    const baseUrl = process.env.NEXT_PUBLIC_B2B_ADMIN_PUBLIC_URL;
    if (!baseUrl) return;
    const publicBaseUrl = baseUrl.replace(/\/$/, '');

    let cancelled = false;

    async function loadImages() {
      try {
        const res = await fetch(`${publicBaseUrl}/api/public/b2b-content`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const page = data?.pages?.find((entry: { route: string; sections?: Array<{ type: string; imageUrl?: string }> }) => entry.route === '/');
        if (cancelled) return;

        setTechnologies((current) => current.map((item, index) => {
          const override = page?.sections?.find((section: { type: string; imageUrl?: string }, sectionIndex: number) => section.type === 'technology' && sectionIndex === index)?.imageUrl
            || page?.sections?.[index + 5]?.imageUrl;
          return override ? { ...item, image: override } : item;
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
    <section className="w-full bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-20">
          <div className="flex flex-col gap-3 md:w-1/2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Technologies</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight">
              Four Technologies.<br /><span>One Complete System.</span>
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col gap-4 md:pt-10">
            <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed">
              Every PRAG solution is built using the right combination of: Voltage Stabilizers, Inverters, Solar Systems and Lithium Battery Storage engineered, installed, and supported by our team.
            </p>

          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pr-6 md:pr-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {technologies.map((tech) => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="relative snap-start flex-none w-[82%] sm:w-[54%] md:w-[440px] h-[305px] md:h-[570px] bg-gradient-to-b from-stone-500/10 via-zinc-700/50 to-black rounded-3xl overflow-hidden group"
            >
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 54vw, 82vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300 p-9 md:p-20"
              />
              <div className="absolute inset-x-0 bottom-5 md:bottom-8 flex justify-start px-6 md:px-7">
                <span className="text-white text-left text-base md:text-[1.6rem] font-semibold font-['Onest'] leading-tight">{tech.name}</span>
              </div>
              <div className="absolute right-3 top-4 md:right-5 md:top-6 p-2 md:p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                activeIndex === index ? 'bg-sky-600' : 'bg-zinc-300 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

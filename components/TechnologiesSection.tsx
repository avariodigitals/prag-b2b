'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const TECHNOLOGIES = [
  {
    name: 'Voltage Stabilizers',
    slug: 'voltage-stabilizers',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
    href: '/solutions/stabilizer',
  },
  {
    name: 'Inverters',
    slug: 'inverters',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png',
    href: '/solutions/inverter',
  },
  {
    name: 'Solar Systems',
    slug: 'solar',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
    href: '/solutions/solar',
  },
  {
    name: 'Battery Storage',
    slug: 'batteries',
    image: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
    href: '/products/batteries',
  },
];

export default function TechnologiesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
  }

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-20">
          <div className="flex flex-col gap-3 md:w-1/2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Technologies</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight">
              Four Technologies. One<br />Complete System.
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col gap-4 md:pt-10">
            <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed">
              Every PRAG solution is built using the right combination of: Voltage Stabilizers, Inverters, Solar Systems and Lithium Battery Storage engineered, installed, and supported by our team.
            </p>
            {/* Scroll Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-600" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TECHNOLOGIES.map((tech) => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="relative shrink-0 w-[300px] md:w-[460px] h-[420px] md:h-[560px] bg-gradient-to-b from-stone-500/10 to-sky-700 rounded-3xl overflow-hidden group"
            >
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                sizes="460px"
                className="object-contain group-hover:scale-105 transition-transform duration-300 p-8"
              />
              <div className="absolute left-6 bottom-6">
                <span className="text-white text-lg md:text-xl font-semibold font-['Onest']">{tech.name}</span>
              </div>
              <div className="absolute right-5 top-6 p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

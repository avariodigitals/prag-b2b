import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
              Four Technologies.<br /><span className="whitespace-nowrap">One Complete System.</span>
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col gap-4 md:pt-10">
            <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed">
              Every PRAG solution is built using the right combination of: Voltage Stabilizers, Inverters, Solar Systems and Lithium Battery Storage engineered, installed, and supported by our team.
            </p>

          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {TECHNOLOGIES.map((tech) => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="relative w-full h-[220px] md:h-[340px] bg-gradient-to-b from-stone-500/10 to-sky-700 rounded-3xl overflow-hidden group"
            >
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300 p-4 md:p-6"
              />
              <div className="absolute inset-x-0 bottom-5 md:bottom-6 flex justify-center px-3">
                <span className="text-white text-center text-xs md:text-xl font-semibold font-['Onest'] leading-tight whitespace-nowrap">{tech.name}</span>
              </div>
              <div className="absolute right-3 top-4 md:right-5 md:top-6 p-2 md:p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

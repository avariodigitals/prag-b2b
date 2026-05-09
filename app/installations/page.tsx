'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = ['All', 'Industrial', 'Commercial', 'Residential'];

const INSTALLATIONS = [
  {
    category: 'Residential',
    title: 'Meadows Estate, Lekki Phase II',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-7.png',
    imageLeft: true,
    problem: '60 housing units dependent on shared generator, disputes over fuel costs, and 8–12 hour daily power cuts.',
    solution: 'Communal 50kW solar microgrid + 120kWh battery bank + individual unit smart metering for transparent consumption billing.',
    tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
    results: [
      { label: 'Unit Powered', value: '60' },
      { label: 'Cost Production', value: '65%' },
      { label: 'Power Supply', value: '24/7' },
    ],
  },
  {
    category: 'Industrial',
    title: 'Zenith Textile Factory, Kano',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-8.png',
    imageLeft: false,
    problem: 'Voltage fluctuations causing 3–5 motor burnouts per month on industrial looms, costing ₦8M+ in repairs annually.',
    solution: 'Three-phase 250kVA servo-motor stabilizer + power factor correction capacitors + surge protection system across all production lines.',
    tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
    results: [
      { label: 'Motor Burnout', value: '0' },
      { label: 'Production Gain', value: '+22.8%' },
      { label: 'Cost Production', value: '87%' },
    ],
  },
  {
    category: 'Commercial',
    title: 'Federal Medical Centre, Abuja',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-9.png',
    imageLeft: true,
    problem: 'Severe voltage fluctuations destroying diagnostic equipment and theatre instruments worth ₦45M annually.',
    solution: '100kVA three-phase industrial stabilizer + dual-input online UPS system deployed across all critical wards and theatres.',
    tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
    results: [
      { label: 'Power Rating', value: '100KVA' },
      { label: 'Uptime', value: '99.8%' },
      { label: 'Annual Savings', value: '₦45M' },
    ],
  },
  {
    category: 'Commercial',
    title: 'Ikeja Shopping Mall, Lagos',
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-10.png',
    imageLeft: false,
    problem: 'Daily 6–8hr outages causing ₦2.1M/week in lost sales and spoiled perishables across 42 tenants.',
    solution: '200kW rooftop solar system + 500kWh lithium battery storage + three-phase hybrid inverters with remote monitoring dashboard.',
    tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
    results: [
      { label: 'Tenants Powered', value: '42' },
      { label: 'Uptime', value: '99.5%' },
      { label: 'Weekly Savings', value: '₦2.1M' },
    ],
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Site Assessment',
    desc: 'We visit your site, measure load, assess infrastructure, and identify problem sources before touching any equipment.',
  },
  {
    num: '02',
    title: 'Custom Design',
    desc: 'Your system is engineered specifically for your load profile, space constraints, and budget — never a template.',
  },
  {
    num: '03',
    title: 'Certified Installation',
    desc: 'PRAG-trained engineers install to NSO standards. No subs, no shortcuts.',
  },
  {
    num: '04',
    title: 'Testing & Support',
    desc: 'We test every circuit and component, brief your team, and provide ongoing warranty and maintenance.',
  },
];

export default function InstallationsPage() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? INSTALLATIONS
    : INSTALLATIONS.filter((i) => i.category === active);

  return (
    <main className="w-full bg-white flex flex-col">

      {/* Hero */}
      <div className="w-full pt-12 md:pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-4 px-4 text-center border-b border-zinc-200">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight">
          Real Installations,<br />Measurable Results.
        </h1>
        <p className="max-w-[560px] text-sky-700 text-base md:text-lg font-normal font-['Space_Grotesk']">
          Every project tells the story of a solved problem. Browse our installation portfolio and see the outcomes we&apos;ve delivered.
        </p>
      </div>

      {/* Filter + Cards */}
      <div className="w-full px-4 md:px-20 py-10 flex flex-col gap-8 max-w-[1280px] mx-auto">

        {/* Category filter */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-3xl text-sm font-medium font-['Space_Grotesk'] transition-colors ${active === cat ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Installation cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((item) => (
            <div key={item.title} className="w-full rounded-2xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row">

              {/* Image — left or right based on layout */}
              {item.imageLeft && (
                <div className="relative w-full md:w-[480px] shrink-0 h-64 md:h-auto">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Onest']">{item.title}</h2>

                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-medium font-['Space_Grotesk'] rounded-full w-fit border border-sky-200">Problem</span>
                  <p className="text-zinc-600 text-sm font-['Space_Grotesk'] leading-relaxed mt-1">{item.problem}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold font-['Space_Grotesk'] rounded-full w-fit uppercase tracking-wider">Solutions</span>
                  <p className="text-zinc-600 text-sm font-['Space_Grotesk'] leading-relaxed mt-1">{item.solution}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-zinc-200 text-zinc-600 text-xs font-['Space_Grotesk']">{tag}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] uppercase tracking-widest">Results</span>
                  <div className="grid grid-cols-3 gap-2">
                    {item.results.map((r) => (
                      <div key={r.label} className="border border-zinc-200 rounded-lg px-3 py-2.5 flex flex-col gap-0.5">
                        <span className="text-zinc-400 text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wider">{r.label}</span>
                        <span className="text-zinc-900 text-sm font-bold font-['Onest']">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image — right side */}
              {!item.imageLeft && (
                <div className="relative w-full md:w-[480px] shrink-0 h-64 md:h-auto order-first md:order-last">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Process section */}
      <div className="w-full border-t border-zinc-200 py-16 px-4 md:px-20 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Process</span>
          </div>
          <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight">
            Every Installation Follows the<br />Same Process
          </h2>
        </div>

        <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="flex flex-col gap-3">
              <span className="text-sky-700 text-4xl font-bold font-['Onest']">{step.num}</span>
              <h3 className="text-zinc-900 text-base font-bold font-['Onest']">{step.title}</h3>
              <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/contact"
          className="px-8 py-3.5 bg-sky-700 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-sky-800 transition-colors"
        >
          Start Your Installation →
        </Link>
      </div>

    </main>
  );
}

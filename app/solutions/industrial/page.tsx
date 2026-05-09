import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';
import ProblemsCarousel from '@/components/ProblemsCarousel';

export const metadata: Metadata = {
  title: 'Industrial Power Solutions – Prag B2B',
  description: 'Engineered power for heavy-duty operations. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption.',
};

const PROBLEMS = [
  {
    title: 'Voltage Instability & Equipment Damage',
    body: 'Unstable power supply causes sudden voltage spikes and fluctuations that can damage sensitive systems, reduce equipment lifespan, and disrupt daily operations.',
    impact: [
      'For businesses that depend on stable electricity, voltage instability creates serious operational and financial challenges. Sudden power surges, voltage drops, and inconsistent grid supply can damage sensitive equipment, interrupt production processes, and reduce the lifespan of critical machinery.',
      'In sectors such as manufacturing, healthcare, hospitality, and commercial facilities, unreliable power affects daily performance and customer experience. Sensitive devices, servers, refrigeration systems, and automation equipment are especially vulnerable, exposing businesses to unexpected downtime and costly repairs.',
      'Frequent voltage fluctuations force businesses to rely on temporary fixes and backup systems that increase costs without solving the root problem. As energy demands grow, these inefficiencies limit scalability, reduce profitability, and create long-term operational risks.',
    ],
    solution: [
      'PRAG delivers intelligent power stabilization solutions designed to protect businesses from voltage instability. Our systems provide consistent, regulated power that safeguards sensitive equipment and ensures uninterrupted operations.',
      'We begin by assessing your facility\'s power requirements and designing a tailored solution using advanced voltage stabilizers, surge protection, and smart energy management technologies to create a stable and reliable power infrastructure.',
      'Our integrated solutions minimize equipment damage, reduce maintenance costs, and improve operational efficiency by ensuring your systems receive clean and consistent power at all times.',
    ],
  },
  {
    title: 'Unplanned Downtime',
    body: 'Frequent outages interrupt workflows, delay production timelines, and result in costly operational downtime for businesses and facilities.',
    impact: [
      'Unplanned power outages can bring entire production lines and business operations to a standstill. Every minute of downtime translates directly to lost revenue, missed deadlines, and reduced customer trust.',
      'In industries where continuity is critical — manufacturing, data centres, healthcare — even a brief outage can have cascading consequences including spoiled goods, corrupted data, and delayed services.',
      'Without a reliable backup power strategy, businesses remain permanently exposed to grid unreliability, making it impossible to make credible delivery commitments or maintain service-level agreements.',
    ],
    solution: [
      'PRAG designs and installs high-capacity inverter and backup power systems that automatically take over the moment grid supply fails, keeping your operations running without interruption.',
      'Our systems are sized to your actual load requirements, ensuring every critical piece of equipment stays powered through outages of any duration.',
      'With remote monitoring and automatic switchover, your team can focus on operations while PRAG\'s systems handle power continuity in the background.',
    ],
  },
  {
    title: 'High Generator Dependence',
    body: 'Heavy reliance on diesel generators increases fuel expenses, maintenance costs, noise pollution, and overall operational inefficiency.',
    impact: [
      'Diesel generators are expensive to run, noisy, and require constant maintenance. Businesses that depend on them as a primary backup solution face escalating fuel costs and frequent service interruptions.',
      'Beyond cost, generator dependence creates environmental and compliance risks, particularly as regulations around emissions tighten and sustainability reporting becomes more prominent.',
      'Generators also provide inconsistent power quality — the start-up surge and voltage irregularities they introduce can themselves damage sensitive equipment.',
    ],
    solution: [
      'PRAG replaces or supplements generator dependence with clean, reliable inverter and battery storage systems that provide instant power without fuel costs, noise, or emissions.',
      'Our hybrid solutions integrate solar generation with battery storage to create an energy-independent infrastructure that dramatically reduces ongoing operational costs.',
      'Businesses that transition to PRAG-designed systems typically see significant reductions in fuel and maintenance spend within the first year, with a clear path to full energy independence.',
    ],
  },
  {
    title: 'Power Quality Issues',
    body: 'Harmonics, surges, and poor power factor degrade equipment performance, increase energy bills, and shorten the lifespan of industrial machinery.',
    impact: [
      'Poor power quality — including harmonics, transients, and low power factor — quietly degrades the performance and lifespan of industrial equipment, often going undetected until costly failures occur.',
      'Energy bills increase as inefficient power consumption drives up demand charges. Equipment running on poor-quality power consumes more energy while delivering less output.',
      'In precision manufacturing and automated environments, power quality issues can cause process errors, product defects, and safety incidents that are difficult to trace back to their electrical root cause.',
    ],
    solution: [
      'PRAG\'s power quality solutions include automatic voltage regulators, power factor correction systems, and harmonic filters designed to deliver clean, stable power to every load in your facility.',
      'We conduct a detailed power quality assessment before recommending a solution, ensuring the system we design addresses your specific mix of loads and operational patterns.',
      'By improving power quality, businesses reduce energy waste, extend equipment life, lower maintenance frequency, and create a safer working environment for both people and machines.',
    ],
  },
];

const TECHNOLOGIES = [
  'Industrial Automatic Voltage Regulators',
  'High Capacity Inverter Systems',
  'Lithium Battery Storage Solution',
  'Hybrid Power System',
  'Power Distribution and Protection Panels',
];

export default async function IndustrialSolutionsPage() {
  const { products } = await getProducts({ per_page: 4 });
  const productImages = products.slice(0, 4);

  return (
    <main className="w-full flex flex-col">

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center pt-16 pb-10 px-6 bg-stone-50">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight max-w-2xl">
          Engineered Power for Heavy-Duty Operations
        </h1>
        <p className="text-sky-700 text-sm md:text-base font-['Space_Grotesk'] max-w-lg leading-relaxed">
          Downtime is expensive. PRAG delivers robust, high-capacity<br />
          power systems designed to keep industrial operations<br />
          running without interruption.
        </p>
        <div className="w-full border-t border-dashed border-sky-200 mt-4" />
      </div>

      {/* Problems carousel */}
      <div className="w-full px-6 md:px-10 py-14">
        <div className="max-w-4xl mx-auto">
          <ProblemsCarousel problems={PROBLEMS} />
        </div>
      </div>

      {/* Full-width image + rest of page */}
      <div className="max-w-4xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

        {/* Full-width image */}
        <div className="w-full rounded-2xl overflow-hidden aspect-[16/7] relative">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png"
            alt="Industrial power installation"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Technologies & Products */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">Technologies &amp; Products</h2>
          <ul className="flex flex-col gap-3">
            {TECHNOLOGIES.map((tech) => (
              <li key={tech} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-700 shrink-0" />
                <span className="text-zinc-700 text-sm font-['Space_Grotesk']">{tech}</span>
              </li>
            ))}
          </ul>

          {/* 2x2 product image grid */}
          {productImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {productImages.map((product) => {
                const img = product.images?.[0];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.categories[0]?.slug ?? 'products'}/${product.slug}`}
                    className="aspect-square bg-stone-50 rounded-2xl overflow-hidden relative flex items-center justify-center hover:shadow-md transition-shadow"
                  >
                    {img ? (
                      <Image
                        src={img.src}
                        alt={img.alt || product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-6"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-200 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full transition-colors"
          >
            Get a Custom Quote
          </Link>
          <Link
            href="/products"
            className="px-8 py-3.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Space_Grotesk'] rounded-full transition-colors"
          >
            Browse All Products →
          </Link>
        </div>
      </div>

    </main>
  );
}

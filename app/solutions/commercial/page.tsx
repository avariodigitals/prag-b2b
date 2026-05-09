import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Commercial Power Solutions – Prag B2B',
  description: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
};

const PROBLEMS = [
  {
    title: 'Operational Downtime',
    body: 'Frequent power outages interrupt workflows, delay services, and reduce overall business productivity. Downtime can negatively impact customer experience, staff efficiency, and daily operations.',
  },
  {
    title: 'High Energy Expenses',
    body: 'Businesses often rely heavily on generators, leading to rising fuel and maintenance costs. Increasing operational expenses reduce profitability and affect long term business growth.',
  },
  {
    title: 'Unstable Equipment Performance',
    body: 'Voltage instability affects computers, servers, and critical office equipment performance. Power fluctuations can cause system failures, data loss, and unexpected operational disruptions.',
  },
  {
    title: 'Inconsistent Customer Experience',
    body: 'Power interruptions in retail, hospitality, and service environments directly affect customer satisfaction, brand reputation, and revenue generation.',
  },
];

const TECHNOLOGIES = [
  'Commercial Voltage Stabilizers (10–100kVA)',
  'Three-Phase Hybrid Inverter Systems',
  'Commercial Solar Systems (10–500kW)',
  'UPS Systems for Critical Loads',
  'Smart Energy Monitoring & Management',
];

export default async function CommercialSolutionsPage() {
  const { products } = await getProducts({ per_page: 4 });
  const productImages = products.slice(0, 4);

  return (
    <main className="w-full flex flex-col">

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center pt-16 pb-10 px-6 bg-stone-50">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight max-w-2xl">
          Smart Energy Systems for Growing Businesses
        </h1>
        <p className="text-sky-700 text-sm md:text-base font-['Space_Grotesk'] max-w-lg leading-relaxed">
          Efficient and reliable power solutions built to support daily<br />
          business operations without interruption.
        </p>
        <div className="w-full border-t border-dashed border-sky-200 mt-4" />
      </div>

      {/* Problems cards */}
      <div className="w-full px-6 md:px-20 py-14 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.slice(0, 3).map((p) => (
            <div key={p.title} className="p-6 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-6 min-w-[260px]">
              <div className="w-10 h-10 rounded-full border border-sky-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h3 className="text-zinc-900 text-lg font-semibold font-['Onest'] leading-snug">{p.title}</h3>
              <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed mt-auto">{p.body}</p>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {PROBLEMS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-sky-700' : 'bg-zinc-300'}`} />
          ))}
        </div>
      </div>

      {/* The Impact + The Solution + image + products */}
      <div className="max-w-4xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

        {/* The Impact */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Impact</h2>
          <div className="flex flex-col gap-4 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            <p>For businesses that depend on stable electricity to operate efficiently, voltage instability can create serious operational and financial challenges. Sudden power surges, voltage drops, and inconsistent grid supply can damage sensitive equipment, interrupt production processes, and reduce the lifespan of critical machinery. Over time, these disruptions lead to increased maintenance costs, delayed operations, and reduced productivity.</p>
            <p>In sectors such as manufacturing, healthcare, hospitality, and commercial facilities, unreliable power can affect daily performance and customer experience. Sensitive devices, servers, refrigeration systems, industrial machines, and automation equipment are especially vulnerable to unstable power conditions, making businesses more exposed to unexpected downtime and costly repairs.</p>
            <p>Frequent voltage fluctuations also force businesses to rely heavily on temporary fixes and backup systems, which often increase operational expenses without solving the root problem. As energy demands grow, these inefficiencies can limit scalability, reduce profitability, and create long-term operational risks.</p>
          </div>
        </div>

        {/* The Solution */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Solution</h2>
          <div className="flex flex-col gap-4 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            <p>PRAG delivers intelligent power stabilization and backup solutions designed to protect businesses from voltage instability and power-related disruptions. Our systems are engineered to provide consistent, regulated power that safeguards sensitive equipment and ensures uninterrupted operations.</p>
            <p>We begin by assessing your facility&apos;s power requirements, operational demands, and energy challenges to design a solution tailored specifically to your business. Through advanced voltage stabilizers, backup power systems, surge protection, and smart energy management technologies, we help create a stable and reliable power infrastructure.</p>
            <p>Our integrated solutions minimize equipment damage, reduce maintenance costs, and improve operational efficiency by ensuring your systems receive clean and consistent power at all times. For businesses looking to reduce dependence on unreliable grid supply and expensive diesel generators, PRAG also provides scalable solar and hybrid energy solutions that support long-term sustainability and cost savings. With professional installation, continuous monitoring, and dedicated technical support, PRAG helps businesses maintain productivity, protect critical assets, and operate with confidence regardless of power conditions.</p>
          </div>
        </div>

        {/* Full-width image */}
        <div className="w-full rounded-2xl overflow-hidden aspect-[16/7] relative">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png"
            alt="Commercial power installation"
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

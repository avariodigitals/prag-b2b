import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Residential Power Solutions – Prag B2B',
  description: 'Keep your home comfortable, secure, and fully powered with smart energy solutions designed for everyday living.',
};

const PROBLEMS = [
  {
    title: 'Frequent Power Interruptions',
    body: 'Unstable electricity disrupts essential home activities, affecting comfort, security, and productivity. Frequent outages create inconvenience and make daily living less reliable for modern households.',
  },
  {
    title: 'Rising Energy Costs',
    body: 'Constant generator usage and fuel consumption significantly increase monthly household expenses. High energy costs make it difficult for families to maintain affordable and efficient power access.',
  },
  {
    title: 'Appliance & Electronics Damage',
    body: 'Voltage fluctuations and sudden surges can damage sensitive household electronics and appliances. Repeated exposure to unstable power reduces equipment lifespan and increases repair costs.',
  },
  {
    title: 'Dependence on Diesel Generators',
    body: 'Running generators around the clock creates noise, air pollution, and safety risks. Families deserve a cleaner, quieter, and more sustainable alternative for home power.',
  },
];

const TECHNOLOGIES = [
  'Automatic Voltage Stabilizers (1–5kVA)',
  'Hybrid Solar Inverter Systems',
  'Lithium Battery Banks (100–400Ah)',
  'Monocrystalline Solar Panels',
  'Home Energy Monitoring Systems',
];

export default async function ResidentialSolutionsPage() {
  const { products } = await getProducts({ per_page: 4 });
  const productImages = products.slice(0, 4);

  return (
    <main className="w-full flex flex-col">

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center pt-16 pb-10 px-6 bg-stone-50">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight max-w-2xl">
          Reliable Power for Modern Living
        </h1>
        <p className="text-sky-700 text-sm md:text-base font-['Space_Grotesk'] max-w-lg leading-relaxed">
          Keep your home comfortable, secure, and fully powered with<br />
          smart energy solutions designed for everyday living.
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

      {/* Body content */}
      <div className="max-w-4xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col gap-10">

        {/* The Impact */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Impact</h2>
          <div className="flex flex-col gap-4 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            <p>For households that depend on stable electricity for daily comfort and productivity, power instability creates serious challenges. Sudden voltage spikes, frequent outages, and inconsistent grid supply can damage home appliances, disrupt routines, and reduce the quality of life for families across Nigeria.</p>
            <p>Modern homes rely on a wide range of sensitive electronics — from refrigerators and air conditioners to televisions, computers, and security systems. Unstable power conditions expose these devices to damage, leading to costly repairs and replacements that strain household budgets over time.</p>
            <p>Frequent power cuts also force families to depend heavily on diesel generators, which are expensive to run, noisy, and environmentally harmful. As electricity demands in the home continue to grow, these inefficiencies make it harder for households to maintain a comfortable, safe, and productive living environment.</p>
          </div>
        </div>

        {/* The Solution */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Solution</h2>
          <div className="flex flex-col gap-4 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            <p>PRAG designs complete home power systems that combine voltage stabilisation, solar generation, and battery storage — so your home stays powered whether NEPA is around or not. Our residential solutions are tailored to the specific needs of Nigerian households, delivering clean, consistent power around the clock.</p>
            <p>We begin by evaluating your home&apos;s energy consumption, appliance load, and power requirements to design a system that fits your lifestyle and budget. From automatic voltage stabilizers that protect your appliances to hybrid solar inverter systems that reduce your dependence on the grid, every solution is built for reliability and longevity.</p>
            <p>Our integrated home energy systems minimize appliance damage, eliminate generator noise and fuel costs, and provide uninterrupted power for your family. With professional installation, ongoing technical support, and smart monitoring options, PRAG ensures your home remains comfortable, secure, and fully powered — every day.</p>
          </div>
        </div>

        {/* Full-width image */}
        <div className="w-full rounded-2xl overflow-hidden aspect-[16/7] relative">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png"
            alt="Residential power solution"
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
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
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

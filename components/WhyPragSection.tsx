import Image from 'next/image';

const REASONS = [
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/6333bffe31c649645bdba2b956b3e4bafe0a7868-scaled.jpg',
    title: 'Built for Nigerian power conditions',
    desc: 'Our systems are specifically engineered to handle voltage fluctuations, frequent outages, and harsh environmental conditions, ensuring consistent performance where it matters most.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/8d3cd2d330451451580f7d3cb8661c92c954a0fa-scaled.jpg',
    title: 'End-to-End Delivery (Design → Installation → Support)',
    desc: 'From initial consultation and system design to professional installation and ongoing maintenance, we manage the entire process so you can enjoy a seamless, stress-free experience.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/9ef4a5ee5bff2a6013ceebaf1698c605c4ed6fc4-scaled.jpg',
    title: 'Trusted by Thousands Nationwide',
    desc: 'With a growing network of satisfied customers across the country, our solutions have been tested and proven in real homes and businesses you can relate to.',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/aa2e989afcc2e3f55275cac3da1e786d9b35d788.jpg',
    title: 'Long-Term Reliability, Not Quick Fixes',
    desc: 'We focus on building durable energy systems designed to last for years, helping you avoid frequent replacements and unnecessary costs over time.',
  },
];

export default function WhyPragSection() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">The Prag Difference</span>
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight">
            Why Leading Homes and<br />Businesses Choose PRAG
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk']">
            Our work is guided by a commitment to quality, precision, and long-term performance.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {REASONS.map((r) => (
            <div key={r.title} className="relative h-72 md:h-80 rounded-2xl overflow-hidden group">
              <Image
                src={r.image}
                alt={r.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <h3 className="text-white text-base md:text-lg font-semibold font-['Onest'] leading-snug">{r.title}</h3>
                <p className="text-white/80 text-xs md:text-sm font-['Space_Grotesk'] leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

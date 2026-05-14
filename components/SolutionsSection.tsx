import Link from 'next/link';

const SOLUTIONS = [
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
    title: 'Residential',
    desc: 'Protect your home with stable power. Enjoy uninterrupted electricity for your family, appliances, and comfort.',
    href: '/solutions/residential',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
    title: 'Commercial',
    desc: 'Keep your business running 24/7. Power solutions tailored for offices, retail, and commercial operations.',
    href: '/solutions/commercial',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
    title: 'Industrial',
    desc: 'Heavy-duty power engineering for manufacturing, warehouses, and large-scale industrial operations.',
    href: '/solutions/industrial',
  },
];

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path d="M1 5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 1.5L12.5 5 8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SolutionsSection() {
  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-20 py-12 md:py-20 overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 md:gap-16">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 md:gap-7">
          <div className="flex items-center gap-[6px]">
            <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
            <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase tracking-wide">
              Our Solutions
            </span>
          </div>
          <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1.1] tracking-[-2px] max-w-[600px] md:max-w-[631px]">
            Complete Power Systems Designed for Nigeria
          </h2>
          <p className="text-[#787878] text-[14px] sm:text-[16px] md:text-xl font-normal font-['Onest'] leading-snug max-w-[600px]">
            We design, supply, and install integrated solutions using:{' '}
            <span className="inline-block">Stabilizers • Inverters • Solar • Batteries</span>
          </p>
        </div>

        {/* Solution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((s) => (
            <div
              key={s.title}
              className="w-full rounded-2xl overflow-hidden flex flex-col bg-white border border-zinc-500/40"
            >
              {/* Image */}
              <div className="relative w-full h-56 md:h-60 overflow-hidden rounded-tl-2xl rounded-tr-2xl">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-6 py-6 flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-4">
                  <h3 className="text-black text-2xl font-medium font-['Onest'] leading-normal">{s.title}</h3>
                  <p className="text-[#787878] text-base md:text-lg font-normal font-['Onest'] leading-normal">{s.desc}</p>
                </div>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-[10px] text-[#0166A5] text-[16px] font-normal font-['Onest'] leading-normal hover:gap-3 transition-all mt-auto"
                  aria-label={`Learn more about ${s.title} solutions`}
                >
                  <span>Learn more</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

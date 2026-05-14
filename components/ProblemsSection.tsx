import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { label: 'Trusted across\n36 states', weight: 'medium' },
  { label: '20+Years of\nEngineering\nExperience', weight: 'light' },
  { label: '500+\ninstallations\nnationwide', weight: 'medium' },
];

const PROBLEMS = [
  {
    icon: '/images/ix_voltage.svg',
    title: 'Low, High, or Fluctuating Voltage',
    desc: 'Protect your appliances and equipment from silent damage.',
    cta: 'Get a Stabilization Solution',
    href: '/products/all-prag-stabilizers',
  },
  {
    icon: '/images/arcticons_chuden-power-outage-infomation.svg',
    title: 'Frequent Power Outages',
    desc: 'Keep your home or business running without interruption.',
    cta: 'Get Backup Power',
    href: '/products/inverters',
  },
  {
    icon: '/images/ph_solar-panel-bold.svg',
    title: 'No Reliable Power Source',
    desc: 'Generate your own electricity with a dependable solar system.',
    cta: 'Go Solar with PRAG',
    href: '/products/solar',
  },
  {
    icon: '/images/streamline-plump_disable-protection-remix.svg',
    title: 'Poor Energy Storage',
    desc: 'Ensure consistent power with high-performance battery systems.',
    cta: 'Upgrade Your Storage',
    href: '/products/batteries',
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

export default function ProblemsSection() {
  return (
    <section className="w-full bg-white">
      {/* Stats Bar */}
      <div className="w-full px-4 sm:px-6 md:px-20 pt-6 pb-6 md:pt-[93px] md:pb-[39px] bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-3 divide-x divide-[#0166A5] text-center gap-0 w-full items-stretch">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-center min-h-[60px] px-2 md:px-4 py-0 md:py-5"
            >
              <span
                className={`text-[#0166A5] text-[14px] sm:text-[16px] md:text-[34px] leading-[1.15] md:leading-[1.08] tracking-[0] text-center font-['Onest'] ${
                  s.weight === 'light' ? 'font-light' : 'font-medium'
                }`}
              >
                {s.label.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems Content */}
      <div className="w-full px-4 sm:px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto pt-10 pb-12 md:py-[4.5rem] flex flex-col gap-8 md:gap-12">
          {/* Header */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-5">
            <div className="flex items-center justify-center md:justify-start gap-[6px]">
              <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
              <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal tracking-wide">
                Power Problems
              </span>
            </div>
            <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1] tracking-[-2px]">
              Power Problems Cost You More Than You Think
            </h2>
            <p className="text-[#787878] text-[14px] sm:text-[16px] md:text-[20px] font-normal font-['Onest'] leading-[1.6] max-w-[600px] md:max-w-none">
              Unstable electricity leads to damaged equipment, costly downtime, and reduced efficiency.
              PRAG delivers reliable solutions—from voltage stabilizers and UPS systems to hybrid inverters
              and solar power—designed to keep your home or business running without interruption.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-[#888888] px-6 pt-6 pb-5 flex flex-col justify-start items-start gap-5 md:gap-6 bg-white"
              >
                <div className="w-8 h-8 flex items-center justify-start overflow-hidden shrink-0">
                  <Image src={p.icon} alt="" width={32} height={32} className="w-8 h-8 object-contain" aria-hidden="true" />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <h3 className="self-stretch text-black text-[22px] sm:text-2xl font-medium font-['Onest'] leading-snug">
                    {p.title}
                  </h3>
                  <p className="self-stretch text-[#787878] text-[16px] sm:text-lg font-normal font-['Onest'] leading-normal">
                    {p.desc}
                  </p>
                </div>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-[10px] text-[#0166A5] text-[16px] font-normal font-['Onest'] leading-normal hover:gap-3 transition-all group"
                  aria-label={p.cta}
                >
                  <span>{p.cta}</span>
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { label: 'Trusted across all\n36 states' },
  { label: '20+Years of\nEngineering Experience' },
  { label: '500+ installations\nnationwide' },
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
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.5 7.5L18 12l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProblemsSection() {
  return (
    <section className="w-full bg-white">
      {/* Stats Bar */}
      <div className="w-full flex flex-col justify-center items-start gap-[10px] self-stretch px-6 md:px-20 pt-6 pb-6 md:pt-[93px] md:pb-[39px] bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-3 divide-x divide-[#0166A5] text-center gap-0 w-full items-stretch">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-center min-h-[60px] px-2 md:px-4 py-0 md:py-5"
            >
              <span className="text-[#0166A5] text-[16px] md:text-[34px] font-medium font-['Onest'] leading-[1] md:leading-[1.08] tracking-[0] text-center">
                {s.label.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems Content */}
      <div className="w-full px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto pt-12 pb-16 md:py-[4.5rem] flex flex-col gap-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-14">
            <div className="flex flex-col gap-3 md:w-1/2 items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-3 h-3 bg-sky-700 rounded-[1px] shrink-0" />
                <span className="text-black text-[16px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal">Power Issues We Solve</span>
              </div>
              <h2 className="text-black text-[28px] sm:text-4xl md:text-[48px] font-bold font-['Onest'] leading-8 sm:leading-[1] md:leading-[0.92] tracking-[-2px]">
                Protecting Homes & Businesses <br />From Power Failure
              </h2>
            </div>
            <p className="md:w-1/2 text-[#787878] text-[16px] md:text-[20px] font-normal font-['Onest'] leading-[1.6] md:leading-normal md:pt-9 max-w-[540px] text-center md:text-left mx-auto md:mx-0">
              Unstable electricity leads to damaged equipment, downtime and lost revenue, and high fuel and maintenance costs. PRAG delivers engineered power systems that eliminate these risks and keep your operations running smoothly.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="self-stretch rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-500 px-6 pt-6 pb-4 flex flex-col justify-start items-start gap-6">
                <div className="w-8 h-8 flex items-center justify-start overflow-hidden">
                  <Image src={p.icon} alt="" width={32} height={32} className="w-8 h-8" aria-hidden="true" />
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <h3 className="self-stretch text-black text-2xl font-medium font-['Onest'] leading-normal">{p.title}</h3>
                  <p className="self-stretch text-neutral-500 text-lg font-normal font-['Onest'] leading-normal">{p.desc}</p>
                </div>
                <Link href={p.href} className="inline-flex justify-center items-center gap-2.5 text-sky-700 text-base font-normal font-['Onest'] leading-normal hover:gap-3 transition-all">
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

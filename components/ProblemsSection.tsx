import Link from 'next/link';

const STATS = [
  { label: 'Trusted across all\n36 states' },
  { label: '20+Years of\nEngineering Experience' },
  { label: '500+ installations\nnationwide' },
];

const PROBLEMS = [
  {
    title: 'Low, High, or Fluctuating Voltage',
    desc: 'Protect your appliances and equipment from silent damage.',
    cta: 'Get PRAG Stabilizer',
    href: '/products/all-prag-stabilizers',
  },
  {
    title: 'Frequent Power Outages',
    desc: 'Keep your home or business running without interruption.',
    cta: 'Get PRAG Inverters',
    href: '/products/inverters',
  },
  {
    title: 'No Reliable Power Source',
    desc: 'Generate your own electricity with a dependable solar system.',
    cta: 'Go Solar with PRAG',
    href: '/products/solar',
  },
  {
    title: 'Poor Energy Storage',
    desc: 'Ensure consistent power with high-performance battery systems.',
    cta: 'Get PRAG Batteries',
    href: '/products/batteries',
  },
];

export default function ProblemsSection() {
  return (
    <section className="w-full bg-white">
      {/* Stats Bar */}
      <div className="w-full py-6 md:py-8 px-6 md:px-20 bg-stone-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sky-700/20 text-center gap-0">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center justify-center px-6 py-6 md:py-3">
              <span className="text-sky-700 text-lg md:text-2xl font-medium font-['Montserrat'] leading-snug text-center">
                {s.label.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 pt-10 pb-16 md:py-16 flex flex-col gap-12">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-20">
          <div className="flex flex-col gap-3 md:w-1/2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="text-zinc-500 text-sm md:text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">Power Issues We Solve</span>
            </div>
            <h2 className="text-zinc-900 text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] leading-tight">
              <span className="whitespace-nowrap">Protecting Homes </span><br />& Businesses From <br /> Power Failure
            </h2>
          </div>
          <p className="md:w-1/2 text-zinc-500 text-lg md:text-xl font-['Montserrat'] leading-relaxed md:pt-10">
            Unstable electricity leads to: Damaged equipment, Downtime and lost revenue and High fuel and maintenance costs. PRAG delivers engineered power systems that eliminate these risks and keep your operations running smoothly.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl border-2 border-zinc-300 p-6 flex flex-col gap-5 hover:border-sky-400 transition-colors">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-lg md:text-xl font-semibold font-['Montserrat'] leading-snug truncate">{p.title}</h3>
                <p className="text-zinc-500 text-lg md:text-xl font-['Montserrat'] leading-relaxed">{p.desc}</p>
              </div>
              <Link href={p.href} className="flex items-center gap-1 text-sky-700 text-base font-bold font-['Montserrat'] hover:gap-2 transition-all">
                {p.cta} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

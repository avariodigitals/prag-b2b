import CountUp from './CountUp';
import { TriangleAlert, Home, Sun, ShieldOff } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { value: 36, suffix: '', label: 'Trusted across all\n36 states' },
  { value: 20, suffix: '+', label: '20+Years of\nEngineering Experience' },
  { value: 500, suffix: '+', label: '500+ installations\nnationwide' },
];

const PROBLEMS = [
  {
    icon: <TriangleAlert className="w-6 h-6 text-sky-700" />,
    title: 'Low, High, or Fluctuating Voltage',
    desc: 'Protect your appliances and equipment from silent damage.',
    cta: 'Get a Stabilization Solution',
    href: '/solutions/stabilizer',
  },
  {
    icon: <Home className="w-6 h-6 text-sky-700" />,
    title: 'Frequent Power Outages',
    desc: 'Keep your home or business running without interruption.',
    cta: 'Get Backup Power',
    href: '/solutions/inverter',
  },
  {
    icon: <Sun className="w-6 h-6 text-sky-700" />,
    title: 'No Reliable Power Source',
    desc: 'Generate your own electricity with a dependable solar system.',
    cta: 'Go Solar with PRAG',
    href: '/solutions/solar',
  },
  {
    icon: <ShieldOff className="w-6 h-6 text-sky-700" />,
    title: 'Poor Energy Storage',
    desc: 'Ensure consistent power with high-performance battery systems.',
    cta: 'Upgrade Your Storage',
    href: '/products/batteries',
  },
];

export default function ProblemsSection() {
  return (
    <section className="w-full bg-white">
      {/* Stats Bar */}
      <div className="w-full border border-sky-700/20 py-8 px-6 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sky-700/20 text-center gap-6 md:gap-0">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center px-6 py-2 gap-1">
              <span className="text-sky-700 text-2xl md:text-3xl font-bold font-['Onest']">
                <CountUp value={s.value} suffix={s.suffix} />
                {s.label.split('\n')[0].replace(String(s.value) + s.suffix, '')}
              </span>
              <span className="text-sky-700 text-xl md:text-2xl font-bold font-['Onest']">
                {s.label.split('\n')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Problems Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16 flex flex-col gap-12">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-20">
          <div className="flex flex-col gap-3 md:w-1/2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Common Issues We Solve</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight">
              Power Problems Cost You<br />More Than You Think
            </h2>
          </div>
          <p className="md:w-1/2 text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed md:pt-10">
            Unstable electricity leads to: Damaged equipment, Downtime and lost revenue and High fuel and maintenance costs. PRAG delivers engineered power systems that eliminate these risks and keep your operations running smoothly.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 hover:border-sky-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
                {p.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-lg font-semibold font-['Onest']">{p.title}</h3>
                <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">{p.desc}</p>
              </div>
              <Link href={p.href} className="flex items-center gap-1 text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:gap-2 transition-all">
                {p.cta} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

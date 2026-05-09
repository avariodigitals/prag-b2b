import Image from 'next/image';
import Link from 'next/link';

const RESULTS = [
  { label: 'Power Rating', value: '500KVA' },
  { label: 'Uptime', value: '99.8%' },
  { label: 'Solar Panels', value: '99.8%' },
  { label: 'Annual Savings', value: '₦15M' },
  { label: 'Life Span', value: '3X' },
  { label: 'Life Span', value: '3X' },
];

const TAGS = ['Stabilizer', 'Inverter', 'Solar Panels'];

export default function CaseStudiesSection() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Case Studies</span>
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight text-center">
            Real Results from<br />Real Projects
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] max-w-xl text-center">
            Explore how we&apos;ve helped homes, businesses, and industrial facilities overcome power challenges with tailored solutions.
          </p>
        </div>

        {/* Case Study Card */}
        <div className="w-full rounded-2xl bg-white border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Image */}
          <div className="relative w-full md:w-[380px] shrink-0 h-64 md:h-auto rounded-xl overflow-hidden">
            <Image
              src="https://central.prag.global/wp-content/uploads/2026/05/Rectangle-7.png"
              alt="Lagos manufacturing case study"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 380px, 100vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 flex-1">
            <h3 className="text-zinc-900 text-lg md:text-xl font-bold font-['Onest'] leading-snug">
              A Lagos manufacturing company reduced downtime by over 90% with a PRAG system — achieving 99.8% uptime.
            </h3>
            <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">
              To reduce frequent power outages causing 12+ hours of weekly downtime, damaging expensive CNC machines.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-gray-200 text-zinc-600 text-xs font-['Space_Grotesk']">
                  {tag}
                </span>
              ))}
            </div>

            {/* Results */}
            <div className="flex flex-col gap-3">
              <span className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] uppercase tracking-widest">Results</span>
              <div className="grid grid-cols-3 gap-2">
                {RESULTS.map((r, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg px-3 py-2.5 flex flex-col gap-0.5">
                    <span className="text-zinc-400 text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wider">{r.label}</span>
                    <span className="text-zinc-900 text-sm font-bold font-['Onest']">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/installations"
          className="px-8 py-3.5 bg-sky-900 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-sky-800 transition-colors flex items-center gap-2"
        >
          View all Case studies →
        </Link>

      </div>
    </section>
  );
}

import Image from 'next/image';
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

export default function SolutionsSection() {
  return (
    <section className="w-full bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Solutions</span>
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight">
            Complete Power Systems<br />Designed for Nigeria
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed max-w-xl text-center">
            We don&apos;t sell products.<br />
            We design and deploy integrated power systems built for Nigerian conditions.<br />
            Our Systems Include:<br />
            Stabilization • Backup Power • Solar • Battery Storage
          </p>
        </div>

        {/* Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOLUTIONS.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:border-sky-200 transition-colors">
              <div className="relative w-full h-52">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Onest']">{s.title}</h3>
                <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed flex-1">{s.desc}</p>
                <Link href={s.href} className="flex items-center gap-1 text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:gap-2 transition-all">
                  Explore Solutions <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

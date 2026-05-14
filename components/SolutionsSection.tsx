import Image from 'next/image';
import Link from 'next/link';

const SOLUTIONS = [
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
    title: 'Residential',
    desc: 'Protect your home with stable power. Enjoy uninterrupted electricity for your family, appliances, and comfort.',
    bodyGap: 'gap-6',
    href: '/solutions/residential',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
    title: 'Commercial',
    desc: 'Keep your business running 24/7. Power solutions tailored for offices, retail, and commercial operations.',
    bodyGap: 'gap-4',
    href: '/solutions/commercial',
  },
  {
    image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
    title: 'Industrial',
    desc: 'Heavy-duty power engineering for manufacturing, warehouses, and large-scale industrial operations.',
    bodyGap: 'gap-6',
    href: '/solutions/industrial',
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

export default function SolutionsSection() {
  return (
    <section className="w-full bg-neutral-50 px-6 md:px-20 py-12 overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto flex w-full flex-col items-center gap-2.5">
        <div className="w-full flex flex-col justify-center items-center gap-20">
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col justify-start items-center gap-7">
              <div className="inline-flex justify-start items-center gap-1.5">
                <div className="w-4 h-4 relative bg-sky-700" />
                <div className="justify-start text-black text-base font-normal font-['Space_Grotesk'] uppercase">Our Solutions</div>
              </div>
              <div className="w-full md:w-[631px] text-center justify-start text-black text-[28px] md:text-5xl font-bold font-['Onest'] leading-[1.2] tracking-[-2px]">
                Complete Power Systems Designed for Nigeria
              </div>
            </div>
            <div className="w-full md:w-[1280px] text-center text-neutral-500 text-xl font-normal font-['Onest'] leading-tight">
              <span className="block">We don&apos;t sell products.</span>
              <span className="block">We design and deploy integrated power systems built for Nigerian conditions.</span>
              <span className="block">Our Systems Include:</span>
              <span className="block">Stabilization • Backup Power • Solar • Battery Storage</span>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center gap-6">
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
              {SOLUTIONS.map((s) => (
                <div key={s.title} className="w-full min-w-0 rounded-bl-2xl rounded-br-2xl flex flex-col justify-center items-start">
                  <div className="relative self-stretch h-56 rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                    <Image src={s.image} alt={s.title} fill className="object-cover" />
                  </div>
                  <div className={`self-stretch px-6 py-6 bg-white rounded-bl-2xl rounded-br-2xl border border-zinc-500/40 flex flex-col justify-start items-start ${s.bodyGap}`}>
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                      <div className="self-stretch justify-start text-black text-[28px] md:text-2xl font-medium font-['Onest'] leading-normal">{s.title}</div>
                      <div className="self-stretch justify-start text-neutral-500 text-[16px] md:text-lg font-normal font-['Onest'] leading-normal">{s.desc}</div>
                    </div>
                    <Link href={s.href} className="inline-flex justify-center items-center gap-2.5 text-sky-700 text-base font-normal font-['Onest'] leading-normal hover:gap-3 transition-all">
                      <span>Explore Solutions</span>
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

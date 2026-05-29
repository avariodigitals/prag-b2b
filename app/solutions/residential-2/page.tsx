import type { Metadata } from 'next';
import Link from 'next/link';
import { getSolutionCategoryContent } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Residential Power Solutions 2',
  description: 'Residential solutions navigation with dedicated sections for backup, solar systems, and stabilization.',
};

export default async function ResidentialSolutionsTwoPage() {
  const content = await getSolutionCategoryContent('residential');
  const sections = [
    {
      title: 'Home Backup Power',
      description: 'Explore complete backup bundles, inverters, and batteries designed for uninterrupted home comfort.',
      href: '/solutions/residential-2/home-backup-power',
    },
    {
      title: 'Home Solar Systems',
      description: 'Browse residential solar-ready bundles and storage options that reduce fuel dependence.',
      href: '/solutions/residential-2/home-solar-systems',
    },
    {
      title: 'Power Stabilization & Protection',
      description: 'Find stabilizers and voltage protection products to keep home electronics safe from fluctuations.',
      href: '/solutions/residential-2/power-stabilization-protection',
    },
  ];

  return (
    <main className="w-full flex flex-col">
      <div className="w-full px-6 md:px-20 py-4 border-b border-zinc-100">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Home</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/solutions" className="text-[#0166a5] font-['Onest'] text-sm font-medium hover:underline">Solutions</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 font-['Onest'] text-sm font-medium">Residential 2</span>
        </div>
      </div>

      <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-3 text-center">
        <h1 className="breadcrumb-title-lock">Residential</h1>
        <p className="breadcrumb-description-lock max-w-[600px] leading-relaxed">
          {content.heroDescription}
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-20 py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-7 flex flex-col gap-4 hover:border-[#0166a5]/40 hover:shadow-sm transition-colors"
              >
                <h2 className="text-[#1a1a1a] text-[24px] font-semibold font-['Onest'] leading-tight">{section.title}</h2>
                <p className="text-[#6f6f6f] text-[16px] font-['Space_Grotesk'] leading-6">{section.description}</p>
                <span className="text-[#0166a5] text-[14px] font-semibold font-['Space_Grotesk']">View products</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

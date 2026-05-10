import Image from 'next/image';
import CountUp from '@/components/CountUp';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

export const metadata = { title: 'About Us' };

const STATS = [
  { display: 50, suffix: 'K+', label: 'System Installed' },
  { display: 20, suffix: '+', label: 'Years Active' },
  { display: 500, suffix: '+', label: 'Happy Clients' },
  { display: 36, suffix: '', label: 'States Covered' },
];

const VALUES = [
  { title: 'Engineering for Reliable Power', body: 'Engineering Power Systems with Precision, Technical Expertise, and a Focus on Long-Term Performance' },
  { title: 'Reliable Power Systems You Trust', body: 'Building Reliable Power Solutions That Perform Consistently Under Real-World Conditions' },
  { title: 'Practical Solutions for Real Conditions', body: 'Delivering Practical Power Solutions Designed for Real Environments, Not Just Ideal Scenarios' },
  { title: 'Designed to Meet Your Needs', body: 'Putting Client Needs First by Designing Power Systems Around Real Challenges and Requirements' },
];

const STORY_PARAS = [
  'PRAG Power Engineering was founded in 2005 by a team of electrical engineers who were frustrated with the poor quality of power solutions being installed across Nigeria. They saw expensive imported equipment failing because installers didn\'t understand Nigerian power conditions. They saw families and businesses suffering from systems that were never properly designed.',
  'We started with a simple mission: engineer power systems that actually work in Nigerian conditions. Not imported cookie-cutter solutions, but systems designed specifically for the voltage fluctuations, frequent outages, and harsh environments we face here.',
  'Twenty years later, we\'ve installed over 50,000 systems across 36 states. Our engineers hold COREN certifications and international qualifications. Our systems are running in homes, hospitals, hotels, banks, factories, and data centers across Nigeria.',
  'We\'ve grown, but our mission hasn\'t changed: reliable power engineering, done right.',
];

export default async function AboutPage() {
  const content = await getB2BPublicContent();
  const aboutPage = findB2BPage(content, '/about');
  const heroSection = findVisibleSectionsByType(aboutPage, 'hero')[0];
  const contentSections = findVisibleSectionsByType(aboutPage, 'content');

  const aboutMain = contentSections[0];
  const storyMain = contentSections[1];
  const valuesMain = contentSections[2];

  const heroTitle = heroSection?.summary?.trim() || 'Engineering Reliable Power Solutions for Real-World Challenges';
  const heroDescription = heroSection?.content?.trim() || 'PRAG is a power solutions company focused on designing and delivering systems that solve unstable electricity problems for homes, businesses, and industries.';
  const aboutTitle = aboutMain?.summary?.trim() || 'Built on Engineering, Driven by Real Power Challenges';
  const aboutBody = aboutMain?.content?.trim() || 'PRAG was founded to address one core problem, unreliable electricity. Instead of simply supplying equipment, we set out to design complete power solutions that ensure stability, efficiency, and long-term performance.\n\nToday, we work with homeowners, businesses, and industrial clients to deliver systems tailored to their specific needs, backed by technical expertise and real-world experience.';
  const aboutImage = aboutMain?.imageUrl?.trim() || 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6.png';
  const storyTitle = storyMain?.summary?.trim() || 'Nigeria\'s Leading Provider of Voltage Regulation, Power Backup, Storage, and Renewable Energy Solutions.';
  const storyImage = storyMain?.imageUrl?.trim() || 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png';
  const storyParas = storyMain?.content?.trim()
    ? storyMain.content.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
    : STORY_PARAS;
  const valuesTitle = valuesMain?.summary?.trim() || 'Built on Principles That Deliver Reliable Results';

  return (
    <main className="w-full bg-white flex flex-col">

      {/* Hero */}
      <div className="w-full px-6 md:px-10 pt-14 pb-10 bg-stone-50 flex flex-col items-center gap-4 text-center">
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight max-w-3xl">
          {heroTitle}
        </h1>
        <p className="text-sky-700 text-base md:text-lg font-['Space_Grotesk'] max-w-lg leading-relaxed">
          {heroDescription}
        </p>
      </div>

      {/* About section */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-4 h-4 bg-sky-700 rounded-sm" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">About PRAG</span>
          </div>
          <div className="flex-1 flex flex-col gap-10 md:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight">
                {aboutTitle}
              </h2>
              <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed whitespace-pre-line">
                {aboutBody}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map(stat => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest']">
                    <CountUp value={stat.display} suffix={stat.suffix} />
                  </span>
                  <span className="text-zinc-500 text-sm font-['Space_Grotesk'] text-center">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="relative w-full h-64 md:h-[499px] rounded-3xl overflow-hidden">
              <Image
                src={aboutImage}
                alt="PRAG Team"
                fill
                sizes="(max-width: 768px) 100vw, 1082px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Story</span>
          </div>
          <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight max-w-3xl">
            {storyTitle}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10 w-full">
          <div className="relative w-full md:w-[480px] h-64 md:h-[440px] rounded-3xl overflow-hidden shrink-0">
            <Image
              src={storyImage}
              alt="Our Story"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {storyParas.map((para, i) => (
              <p key={i} className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 bg-stone-50 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm" />
            <span className="text-zinc-500 text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-widest">Our Core Values</span>
          </div>
          <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight max-w-xl">
            {valuesTitle}
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-['Space_Grotesk'] max-w-lg">
            Our work is guided by a commitment to quality, precision, and long-term performance.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-5">
          {VALUES.map(val => (
            <div key={val.title} className="p-6 bg-white rounded-2xl border border-zinc-200 flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <h3 className="text-zinc-900 text-base font-semibold font-['Onest'] leading-snug">{val.title}</h3>
              </div>
              <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">{val.body}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

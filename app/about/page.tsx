import Image from 'next/image';
import CountUp from '@/components/CountUp';
import { SentenceText } from '@/lib/sentenceText';
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

      {/* ── Hero ── */}
      <div className="w-full px-6 md:px-20 breadcrumb-hero-shell bg-stone-50 flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock leading-tight max-w-3xl">
          {heroTitle}
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] leading-relaxed">
          <SentenceText text={heroDescription} />
        </p>
      </div>

      {/* ── About section ── */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20">

            {/* Kicker — left column */}
            <div className="flex items-center gap-[6px] shrink-0 pt-2">
              <div className="w-4 h-4 bg-[#0166a5] rounded-sm shrink-0" aria-hidden="true" />
              <span className="section-kicker text-[#1a1a1a]">About PRAG</span>
            </div>

            {/* Content — right column */}
            <div className="flex-1 flex flex-col gap-20">
              {/* Heading + body */}
              <div className="flex flex-col gap-6">
                {/* n_13900: Space Grotesk 48px 500 #1a1a1a */}
                <h2 className="text-[#1a1a1a] text-[32px] md:text-[48px] font-medium font-['Space_Grotesk'] leading-tight">
                  {aboutTitle}
                </h2>
                {/* n_064b1: Space Grotesk 20px 400 #888888 */}
                <p className="text-[#888888] text-[18px] md:text-[20px] font-normal font-['Space_Grotesk'] leading-relaxed whitespace-pre-line">
                  {aboutBody}
                </p>
              </div>

              {/* Stats — n_98039: Onest 48px 300, n_10871: Onest 28px 400, both #0166a5 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center text-center">
                {STATS.map(stat => (
                  <div key={stat.label} className="flex flex-col items-center gap-[2px]">
                    <span className="text-[#0166a5] text-[40px] md:text-[48px] font-light font-['Onest'] leading-none">
                      <CountUp value={stat.display} suffix={stat.suffix} />
                    </span>
                    <span className="text-[#0166a5] text-[20px] md:text-[28px] font-normal font-['Onest'] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Image — n_b9386: border-radius 24px */}
              <div className="relative w-full h-64 md:h-[499px] rounded-[24px] overflow-hidden">
                <img
                  src={aboutImage}
                  alt="PRAG solar installation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10">

          {/* Kicker + heading — centered */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-[#0166a5] rounded-sm shrink-0" aria-hidden="true" />
              <span className="section-kicker text-[#1a1a1a]">Our Story</span>
            </div>
            {/* n_5e5c5: Space Grotesk 48px 500 #1a1a1a — 1082px wide per Figma */}
            <h2 className="text-[#1a1a1a] text-[32px] md:text-[48px] font-medium font-['Space_Grotesk'] leading-tight max-w-[1082px]">
              {storyTitle}
            </h2>
          </div>

          {/* Image (left) + text (right) */}
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 w-full">
            {/* n_79ae4: 539×499px, border-radius 24px */}
            <div className="relative w-full md:w-[539px] h-64 md:h-[499px] rounded-[24px] overflow-hidden shrink-0">
              <img
                src={storyImage}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>

            {/* n_ad465 etc.: Space Grotesk 20px 400 #888888 */}
            <div className="flex-1 flex flex-col gap-6">
              {storyParas.map((para, i) => (
                <p key={i} className="text-[#888888] text-[18px] md:text-[20px] font-normal font-['Space_Grotesk'] leading-relaxed">
                  <SentenceText text={para} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24 bg-stone-50">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

          {/* Kicker + heading + subtitle — centered */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-[#0166a5] rounded-sm shrink-0" aria-hidden="true" />
              <span className="section-kicker text-[#1a1a1a]">Our Core Values</span>
            </div>
            {/* n_133ab: Onest 48px 700 tracking-[-2px] #1a1a1a */}
            <h2 className="text-[#1a1a1a] text-[32px] md:text-[48px] font-bold font-['Onest'] tracking-[-2px] leading-tight max-w-xl">
              {valuesTitle}
            </h2>
            {/* n_316b9: Onest 20px 400 #444444 */}
            <p className="text-[#444444] text-[18px] md:text-[20px] font-normal font-['Onest'] max-w-lg">
              Our work is guided by a commitment to quality, precision, and long-term performance.
            </p>
          </div>

          {/* Value cards grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(val => (
              <div
                key={val.title}
                /* n_af255: border-radius 24px, border 0.3px solid rgba(136,136,136,0.5), gap 60px */
                className="p-6 bg-white rounded-[24px] border border-[rgba(136,136,136,0.5)] flex flex-col gap-10 md:gap-[60px]"
              >
                {/* Top: icon circle + title */}
                <div className="flex flex-col gap-3">
                  {/* Blue round frame containing pin icon — matches Figma value card */}
                  <div className="w-10 h-10 rounded-full bg-[#0166a5] flex items-center justify-center shrink-0">
                    <img
                      src="/images/pin-icon.svg"
                      alt=""
                      width={8}
                      height={13}
                      aria-hidden="true"
                      className="w-2 h-[13px] object-contain"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <h3 className="text-[#1a1a1a] text-[20px] font-medium font-['Onest'] leading-snug">
                    {val.title}
                  </h3>
                </div>
                <p className="text-[#444444] text-[14px] font-normal font-['Onest'] leading-relaxed">
                  <SentenceText text={val.body} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

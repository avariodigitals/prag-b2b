export const dynamic = 'force-dynamic';

import DistributorForm from '@/components/DistributorForm';
import type { Metadata } from 'next';
import { SentenceText } from '@/lib/sentenceText';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { LayoutGrid, Tag, GraduationCap, Headphones, BadgeCheck, Users } from 'lucide-react';

export const metadata: Metadata = { title: 'Become a Distributor', alternates: { canonical: 'https://www.prag.global/distributor' } };

const BENEFIT_ICONS = [LayoutGrid, Tag, GraduationCap, Headphones, BadgeCheck, Users];

const FALLBACK_BENEFITS = [
  { title: 'High-Margin Products', body: 'PRAG distributors earn industry-leading margins on our full product range — stabilizers, inverters, batteries, and solar.' },
  { title: 'Exclusive Territories', body: "We offer protected territories so you're not competing with other PRAG distributors in your area." },
  { title: 'Technical Training', body: 'Comprehensive product training and certification so your team can advise customers with authority.' },
  { title: 'Sales & Marketing Support', body: 'Co-branded marketing materials, digital assets, and dedicated account management from our team.' },
  { title: 'PRAG Certification', body: 'Carry the PRAG Certified Partner badge — a mark of quality that builds customer trust in your market.' },
  { title: 'Nationwide Network', body: 'Join a growing network of distributors across all 36 states and leverage shared referrals and leads.' },
];

const FALLBACK_TIERS = [
  { title: 'Become an Authorized Dealer', body: "As a dealer, you'll be equipped with the tools, pricing, and support needed to sell confidently and grow your business in a rapidly expanding market." },
  { title: 'Partner as a Certified Installer', body: "As a certified installer, you'll handle system setup while we ensure you have access to the right equipment, and ongoing support to execute projects seamlessly." },
  { title: 'Join as a Product Reseller', body: 'Expand your offerings by reselling PRAG solar solutions to your network. With flexible purchasing options and competitive margins.' },
];

export default async function DistributorPage() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/distributor');

  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const sectionHeaders = findVisibleSectionsByType(page, 'section-header');
  const benefitSections = findVisibleSectionsByType(page, 'benefit');
  const tierSections = findVisibleSectionsByType(page, 'tier');

  const heroTitle = heroSection?.summary?.trim() || 'Sell the Solutions Nigeria Needs.';
  const heroBody = heroSection?.content?.trim() || "Partner with PRAG and build a profitable business distributing Nigeria's most trusted power engineering products.";

  const benefitsHeader = sectionHeaders.find((s) => String(s.id).includes('benefits'));
  const benefitsKicker = benefitsHeader?.kicker?.trim() || 'Partner Benefits';
  const benefitsTitle = benefitsHeader?.summary?.trim() || 'Everything You Need to Build a Thriving Power Business';

  const benefits = benefitSections.length > 0
    ? benefitSections.map((s, i) => ({
        icon: BENEFIT_ICONS[i] ?? LayoutGrid,
        title: s.summary?.trim() || FALLBACK_BENEFITS[i]?.title || '',
        body: s.content?.trim() || FALLBACK_BENEFITS[i]?.body || '',
      }))
    : FALLBACK_BENEFITS.map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] ?? LayoutGrid }));

  const tiersHeader = sectionHeaders.find((s) => String(s.id).includes('tiers'));
  const tiersKicker = tiersHeader?.kicker?.trim() || 'Partnership Tier';
  const tiersTitle = tiersHeader?.summary?.trim() || 'Choose the Tier That Fits Your Business';

  const formHeader = sectionHeaders.find((s) => String(s.id).includes('form'));
  const formKicker = formHeader?.kicker?.trim() || 'Application Form';
  const formTitle = formHeader?.summary?.trim() || 'Start Your PRAG Partnership';
  const formDescription = formHeader?.content?.trim() || 'Fill in the form below and our partnership team will contact you within 2 business days.';

  const tiers = tierSections.length > 0
    ? tierSections.map((s, i) => ({
        title: s.summary?.trim() || FALLBACK_TIERS[i]?.title || '',
        body: s.content?.trim() || FALLBACK_TIERS[i]?.body || '',
      }))
    : FALLBACK_TIERS;

  return (
    <main className="w-full bg-white flex flex-col">

        {/* Hero */}
        <div className="w-full bg-stone-50 px-6 md:px-10 lg:px-20 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
          <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
            {heroTitle}
          </h1>
          <p className="breadcrumb-description-lock max-w-[531px]">
            <SentenceText text={heroBody} />
          </p>
        </div>

        {/* Benefits */}
        <section className="w-full px-6 md:px-10 lg:px-20 py-14">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">{benefitsKicker}</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] max-w-xl leading-tight">
              {benefitsTitle}
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, title, body }, i) => (
              <div key={`${title}-${i}`} className="p-6 rounded-2xl border border-zinc-300 md:border-zinc-500 flex flex-col gap-3">
                <Icon className="w-6 h-6 text-sky-700" />
                <h3 className="text-zinc-900 text-base font-semibold font-['Onest']">{title}</h3>
                <p className="text-zinc-500 text-base font-['Onest'] leading-relaxed"><SentenceText text={body} /></p>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="w-full px-6 md:px-10 lg:px-20 py-14 bg-white">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">{tiersKicker}</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] max-w-xl leading-tight">
              {tiersTitle}
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiers.map((tier, i) => (
              <div key={`${tier.title}-${i}`} className="p-6 bg-white rounded-2xl border border-zinc-300 md:border-zinc-500 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-full bg-sky-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold font-['Onest']">{i + 1}</span>
                </div>
                <h3 className="text-zinc-900 text-base font-semibold font-['Onest']">{tier.title}</h3>
                <p className="text-zinc-500 text-base font-['Onest'] leading-relaxed"><SentenceText text={tier.body} /></p>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="w-full px-6 md:px-10 lg:px-20 py-14">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">{formKicker}</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest']">{formTitle}</h2>
            <p className="text-zinc-500 text-lg md:text-xl font-['Onest'] max-w-lg">
              {formDescription}
            </p>
            </div>
            <DistributorForm />
          </div>
        </section>

    </main>
  );
}

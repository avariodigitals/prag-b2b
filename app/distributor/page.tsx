import DistributorForm from '@/components/DistributorForm';
import { SentenceText } from '@/lib/sentenceText';
import { LayoutGrid, Tag, GraduationCap, Headphones, BadgeCheck, Users } from 'lucide-react';

export const metadata = { title: 'Become a Distributor' };

const BENEFITS = [
  { icon: LayoutGrid, title: 'High-Margin Products', body: 'PRAG distributors earn industry-leading margins on our full product range — stabilizers, inverters, batteries, and solar.' },
  { icon: Tag, title: 'Exclusive Territories', body: "We offer protected territories so you're not competing with other PRAG distributors in your area." },
  { icon: GraduationCap, title: 'Technical Training', body: 'Comprehensive product training and certification so your team can advise customers with authority.' },
  { icon: Headphones, title: 'Sales & Marketing Support', body: 'Co-branded marketing materials, digital assets, and dedicated account management from our team.' },
  { icon: BadgeCheck, title: 'PRAG Certification', body: 'Carry the PRAG Certified Partner badge — a mark of quality that builds customer trust in your market.' },
  { icon: Users, title: 'Nationwide Network', body: 'Join a growing network of distributors across all 36 states and leverage shared referrals and leads.' },
];

const TIERS = [
  { title: 'Become an Authorized Dealer', body: "As a dealer, you'll be equipped with the tools, pricing, and support needed to sell confidently and grow your business in a rapidly expanding market." },
  { title: 'Partner as a Certified Installer', body: "As a certified installer, you'll handle system setup while we ensure you have access to the right equipment, and ongoing support to execute projects seamlessly." },
  { title: 'Join as a Product Reseller', body: 'Expand your offerings by reselling PRAG solar solutions to your network. With flexible purchasing options and competitive margins.' },
];

export default function DistributorPage() {
  return (
    <main className="w-full bg-white flex flex-col">

        {/* Hero */}
        <div className="w-full bg-stone-50 px-6 md:px-20 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
          <h1 className="breadcrumb-title-lock leading-tight max-w-2xl">
            Sell the Solutions Nigeria Needs.
          </h1>
          <p className="breadcrumb-description-lock max-w-[531px]">
            <SentenceText text="Partner with PRAG and build a profitable business distributing Nigeria&apos;s most trusted power engineering products." />
          </p>
        </div>

        {/* Benefits */}
        <section className="w-full px-6 md:px-20 py-14">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">Partner Benefits</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] max-w-xl leading-tight">
              Everything You Need to Build a Thriving Power Business
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6 rounded-2xl border border-zinc-300 md:border-zinc-500 flex flex-col gap-3">
                <Icon className="w-6 h-6 text-sky-700" />
                <h3 className="text-zinc-900 text-base font-semibold font-['Onest']">{title}</h3>
                <p className="text-zinc-500 text-base font-['Onest'] leading-relaxed"><SentenceText text={body} /></p>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="w-full px-6 md:px-20 py-14 bg-white">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">Partnership Tier</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] max-w-xl leading-tight">
              Choose the Tier That Fits Your Business
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => (
              <div key={tier.title} className="p-6 bg-white rounded-2xl border border-zinc-300 md:border-zinc-500 flex flex-col gap-4">
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
        <section className="w-full px-6 md:px-20 py-14">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
              <span className="section-kicker">Application Form</span>
            </div>
            <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest']">Start Your PRAG Partnership</h2>
            <p className="text-zinc-500 text-lg md:text-xl font-['Onest'] max-w-lg">
              Fill in the form below and our partnership team will contact you within 2 business days.
            </p>
            </div>
            <DistributorForm />
          </div>
        </section>

    </main>
  );
}

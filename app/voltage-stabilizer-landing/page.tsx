export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowDown,
  ArrowUp,
  Activity,
  ShieldCheck,
  Home,
  Building2,
  Factory,
  Phone,
} from 'lucide-react';
import { getB2BPublicContent, type PublicB2BContent } from '@/lib/b2bContent';
import { buildBreadcrumbJsonLd } from '@/lib/seoMeta';
import JsonLd from '@/components/JsonLd';
import VoltageStabilizerAssessmentForm from '@/components/VoltageStabilizerAssessmentForm';

const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
const PAGE_PATH = '/voltage-stabilizer-landing';
const CANONICAL = `${SITE_BASE}${PAGE_PATH}`;

const SALES_PHONE = '+234 803 217 0129';
const SALES_PHONE_HREF = 'tel:+2348032170129';

const HERO_IMAGE_FALLBACK = 'https://central.prag.global/wp-content/uploads/2024/11/Untitled-design-8-2-500x500.jpg';

function getWhatsAppNumber(settings?: PublicB2BContent['settings']): string {
  const fromSettings =
    settings?.integrations?.whatsappChatNumber?.trim() ||
    settings?.contact?.whatsapp?.trim() ||
    '';
  const digits = fromSettings.replace(/\D/g, '');
  if (digits) return digits.startsWith('234') ? digits : `234${digits.replace(/^0/, '')}`;
  return '2348032170129';
}

function buildWhatsAppHref(number: string, text: string) {
  const digits = number.replace(/\D/g, '') || '2348032170129';
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const metadata: Metadata = {
  title: {
    absolute: 'Voltage Stabilizers in Nigeria – Buy PRAG Stabilizers for Home, Office & Industry',
  },
  description:
    'Get stable voltage with PRAG stabilizers. Protect appliances and equipment from low, high and fluctuating voltage. Free voltage assessment and WhatsApp support.',
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  keywords: [
    'voltage stabilizer Nigeria',
    'buy voltage stabilizer',
    'PRAG stabilizer',
    'home stabilizer',
    'commercial stabilizer',
    'industrial stabilizer',
    'voltage regulator',
    'servo stabilizer',
    'relay stabilizer',
    'thyristor stabilizer',
    'voltage protection',
    'power fluctuation solution',
  ],
  openGraph: {
    title: 'Voltage Stabilizers in Nigeria – Buy PRAG Stabilizers for Home, Office & Industry',
    description:
      'Get stable voltage with PRAG stabilizers. Protect appliances and equipment from low, high and fluctuating voltage. Free voltage assessment and WhatsApp support.',
    url: CANONICAL,
    siteName: 'PRAG',
    type: 'website',
    images: [
      {
        url: HERO_IMAGE_FALLBACK,
        width: 500,
        height: 500,
        alt: 'PRAG voltage stabilizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voltage Stabilizers in Nigeria – Buy PRAG Stabilizers for Home, Office & Industry',
    description:
      'Get stable voltage with PRAG stabilizers. Protect appliances and equipment from low, high and fluctuating voltage. Free voltage assessment and WhatsApp support.',
    images: [HERO_IMAGE_FALLBACK],
  },
};

export default async function VoltageStabilizerLandingPage() {
  const b2bContent = await getB2BPublicContent();

  const settings = b2bContent?.settings;
  const whatsappNumber = getWhatsAppNumber(settings);

  const chatHref = buildWhatsAppHref(
    whatsappNumber,
    'Hi PRAG, I want to know more about voltage stabilizers.'
  );

  return (
    <main className="w-full min-h-screen bg-white text-[#1a1a1a]">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: `${SITE_BASE}/` },
          { name: 'Voltage Stabilizers', url: CANONICAL },
        ])}
      />

      {/* Top bar */}
      <div className="w-full bg-white border-b border-zinc-100">
        <div className="w-full px-8 sm:px-12 lg:px-16 h-auto md:h-20 py-3 md:py-0 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <a href={SITE_BASE} target="_blank" rel="noopener noreferrer" className="relative h-8 w-28 md:h-10 md:w-32 shrink-0">
            <Image
              src="/images/prag-logo-landing.png"
              alt="PRAG"
              fill
              className="object-contain object-left"
              priority
            />
          </a>
          <div className="hidden sm:flex items-center gap-2 text-right">
            <span className="text-[#0a4f7c] text-sm font-semibold font-['Arial, Helvetica, sans-serif']">Sales support:</span>
            <span className="text-zinc-600 text-sm font-['Arial, Helvetica, sans-serif']">Mon–Sat, 8am–6pm</span>
          </div>
          <a
            href={SALES_PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#38bdf8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0a4f7c] font-['Arial, Helvetica, sans-serif'] hover:bg-[#38bdf8] hover:text-white transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            Call {SALES_PHONE}
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-[#071a2f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a2f] via-[#0a2b4a] to-[#0a4f7c] opacity-90" />
        <div className="relative w-full px-8 sm:px-12 lg:px-16 py-14 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <p className="tracking-widest uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: 800, fontStyle: 'normal', color: 'rgb(248, 162, 78)' }}>
                PRAG Voltage Stabilizers
              </p>
              <h1 className="text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '74px', lineHeight: '78px', fontWeight: 400, fontStyle: 'normal' }}>
                Get Stable Voltage. <br />
                <span className="text-[#7BB7FF]">Protect Your Equipment.</span>
              </h1>
              <p className="text-zinc-300 max-w-xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                Whether your voltage is low, high or constantly fluctuating, a PRAG voltage stabilizer corrects it to a stable level—and protects your connected appliances and equipment at the same time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#free-assessment"
                  className="inline-flex items-center justify-center rounded-lg bg-[#FF6B00] px-6 py-3.5 text-sm font-semibold text-white font-['Arial, Helvetica, sans-serif'] shadow-lg hover:bg-[#e65f00] transition-colors"
                >
                  Get a Free Voltage Assessment
                </a>
                <a
                  href={chatHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white font-['Arial, Helvetica, sans-serif'] backdrop-blur hover:bg-white/20 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat with an Expert on WhatsApp
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 border-t border-white/10 pt-6">
                <div className="px-4 sm:px-6 border-r border-white/10 last:border-r-0">
                  <p className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-[#7BB7FF] font-['Arial, Helvetica, sans-serif'] leading-none">36</span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-white font-['Arial, Helvetica, sans-serif']">STATES</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-400 font-['Arial, Helvetica, sans-serif']">Trusted Across Nigeria</p>
                </div>
                <div className="px-4 sm:px-6 border-r border-white/10 last:border-r-0">
                  <p className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-[#7BB7FF] font-['Arial, Helvetica, sans-serif'] leading-none">15+</span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-white font-['Arial, Helvetica, sans-serif']">YEARS</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-400 font-['Arial, Helvetica, sans-serif']">Power Expertise</p>
                </div>
                <div className="px-4 sm:px-6 border-r border-white/10 last:border-r-0">
                  <p className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-[#7BB7FF] font-['Arial, Helvetica, sans-serif'] leading-none">50K+</span>
                    <span className="text-sm font-semibold uppercase tracking-wider text-white font-['Arial, Helvetica, sans-serif']">INSTALLATIONS</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-400 font-['Arial, Helvetica, sans-serif']">Nationwide</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/pragitnow.avif"
                  alt="PRAG LVG45-30KVA"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <p className="text-left tracking-widest uppercase mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: 800, fontStyle: 'normal', color: '#1261B8' }}>
            One Solution, Four Essential Benefits
          </p>
          <h2 className="text-left text-[#1a1a1a] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '54px', lineHeight: '58px', fontWeight: 400, fontStyle: 'normal' }}>
            Stable voltage—and <br />
            protection for your equipment.
          </h2>
          <p className="text-left text-zinc-600 max-w-3xl mb-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
            Most customers come to us because their voltage is too low, too high or unstable. Others primarily want protection. With every PRAG voltage stabilizer, you get both.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: ArrowDown, title: 'Corrects low voltage', body: 'Boosts incoming voltage to the stable level your equipment needs.' },
              { icon: ArrowUp, title: 'Corrects high voltage', body: 'Reduces excessive incoming voltage back to a safe, stable range.' },
              { icon: Activity, title: 'Stabilizes fluctuations', body: 'Continuously corrects changing voltage to deliver dependable output.' },
              { icon: ShieldCheck, title: 'Protects your equipment', body: 'Built-in safeties help protect appliances and equipment.' },
            ].map((b) => (
              <div key={b.title} className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="w-full flex items-center justify-center h-40 rounded-2xl bg-[#38bdf8]/5">
                  <div className="h-20 w-20 rounded-full bg-[#38bdf8]/10 text-[#0a4f7c] flex items-center justify-center">
                    <b.icon className="w-10 h-10" />
                  </div>
                </div>
                <div className="w-full text-left flex flex-col justify-center">
                  <h3 className="text-[#1a1a1a] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '24px', lineHeight: '36px', fontWeight: 400, fontStyle: 'normal' }}>{b.title}</h3>
                  <p className="text-zinc-600" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="relative w-full overflow-hidden bg-[#071a2f] py-14 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a2f] via-[#0a2b4a] to-[#0a4f7c] opacity-90" />
        <div className="relative w-full px-8 sm:px-12 lg:px-16">
          <p className="tracking-widest uppercase mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: 800, fontStyle: 'normal', color: 'rgb(248, 162, 78)' }}>ONE RANGE. EVERY SCALE.</p>
          <h2 className="text-white mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '54px', lineHeight: '58px', fontWeight: 400, fontStyle: 'normal' }}>Stable, protected power at<br />every scale.</h2>
          <p className="text-zinc-300 max-w-2xl mb-16" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>From one appliance to an entire facility, our team helps you select the right stabilizer for your voltage conditions, connected load and required level of protection.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Home, title: 'Homes', body: 'Protect air conditioners, refrigerators, televisions and your entire home.', href: '#free-assessment' },
              { icon: Building2, title: 'Businesses', body: 'Keep offices, shops, hospitality equipment and essential systems protected.', href: '#free-assessment' },
              { icon: Factory, title: 'Industry', body: 'Stabilize voltage for production equipment, motors and critical infrastructure.', href: '#free-assessment' },
            ].map((a, i) => (
              <div key={a.title} className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-6 md:p-8 text-white flex flex-col min-h-[260px] border border-white/20">
                <div className="absolute top-0 right-0 p-4 opacity-60">
                  <a.icon className="w-16 h-16" />
                </div>
                <span className="text-4xl font-bold text-[#7BB7FF] font-['Arial, Helvetica, sans-serif'] mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '24px', lineHeight: '36px', fontWeight: 400, fontStyle: 'normal' }}>{a.title}</h3>
                <p className="text-white/80 mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>{a.body}</p>
                <Link href={a.href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#7BB7FF] font-['Arial, Helvetica, sans-serif'] hover:underline">
                  Get a recommendation <span className="text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free assessment */}
      <section id="free-assessment" className="w-full bg-[#f2f4f7] py-14 md:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="pr-8 lg:pr-12">
              <p className="tracking-widest uppercase mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: 800, fontStyle: 'normal', color: '#1261B8' }}>Free Voltage Assessment</p>
              <h2 className="text-[#1a1a1a] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '54px', lineHeight: '58px', fontWeight: 400, fontStyle: 'normal' }}>
                Tell us your voltage<br />
                problem.
              </h2>
              <p className="text-zinc-600 mb-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                Whether your voltage is low, high or unstable, a PRAG power expert will help you choose the right stabilizer for your space and budget.
              </p>
              <ol className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#38bdf8] text-sm font-bold text-[#38bdf8] font-['Arial, Helvetica, sans-serif']">1</span>
                  <div className="pt-0.5" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontStyle: 'normal' }}>
                    <p className="font-bold text-[#1a1a1a]">Submit your details</p>
                    <p className="font-normal text-zinc-600">This takes less than one minute</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#38bdf8] text-sm font-bold text-[#38bdf8] font-['Arial, Helvetica, sans-serif']">2</span>
                  <div className="pt-0.5" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontStyle: 'normal' }}>
                    <p className="font-bold text-[#1a1a1a]">We assess your requirement</p>
                    <p className="font-normal text-zinc-600">We may call to confirm your load and voltage conditions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#38bdf8] text-sm font-bold text-[#38bdf8] font-['Arial, Helvetica, sans-serif']">3</span>
                  <div className="pt-0.5" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontStyle: 'normal' }}>
                    <p className="font-bold text-[#1a1a1a]">Receive a recommendation</p>
                    <p className="font-normal text-zinc-600">Get the appropriate capacity and next steps.</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
              <p className="tracking-widest uppercase mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '20px', fontWeight: 800, fontStyle: 'normal', color: 'rgb(248, 162, 78)' }}>Free Assessment</p>
              <h3 className="text-[#1a1a1a] mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '24px', lineHeight: '36px', fontWeight: 700, fontStyle: 'normal' }}>Get your recommendation</h3>
              <VoltageStabilizerAssessmentForm whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="w-full bg-[#0a1420] py-8 border-t border-white/5">
        <div className="w-full px-8 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-300 font-['Arial, Helvetica, sans-serif']">
          <a href={SITE_BASE} target="_blank" rel="noopener noreferrer" className="relative h-10 w-[132px]">
            <Image
              src="/images/prag-white.avif"
              alt="PRAG"
              fill
              className="object-contain object-left brightness-0 invert"
              sizes="(max-width: 768px) 132px, 132px"
            />
          </a>
          <p className="text-center">Trusted power solutions for homes and businesses across Nigeria.</p>
          <p className="md:text-right">© 2026 Pragmatic Technologies Ltd.</p>
        </div>
      </footer>
    </main>
  );
}

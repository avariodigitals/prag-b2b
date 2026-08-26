export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  Activity,
  ShieldCheck,
  Plug2,
  Gauge,
  Home,
  Building2,
  Factory,
  Phone,
  Headphones,
  ClipboardList,
} from 'lucide-react';
import { getB2BPublicContent, type PublicB2BContent } from '@/lib/b2bContent';
import { buildBreadcrumbJsonLd } from '@/lib/seoMeta';
import JsonLd from '@/components/JsonLd';
import AssessmentForm from './AssessmentForm';

const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
const PAGE_PATH = '/voltage-stab2';
const CANONICAL = `${SITE_BASE}${PAGE_PATH}`;

const SALES_PHONE_HREF = 'tel:+2348032170129';

const HERO_IMAGE = '/images/PRAG-stabilizers-banner-high-resolution.png';
const HERO_IMAGE_FALLBACK = 'https://central.prag.global/wp-content/uploads/2024/11/Untitled-design-8-2-500x500.jpg';

const HOME_STABILIZER = '/images/resstab.png';
const COMMERCIAL_STABILIZER = 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png';
const INDUSTRIAL_STABILIZER = '/images/indstab.png';

const INSTALLATION_IMAGE = 'https://central.prag.global/wp-content/uploads/2024/11/PRAG-LVG45-30K-STABILIZER-2-2000x2000.jpg';

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

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: { absolute: 'Not Found' },
  robots: { index: false, follow: false },
};

export default async function VoltageStabilizerLandingPage() {
  // This page is disabled from public view and SEO.
  // Kept in the repo for reference / future iteration.
  notFound();

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

      {/* Landing page header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-zinc-100 shadow-sm">
        <div className="w-full px-6 sm:px-10 lg:px-16 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="relative h-8 w-28 md:h-10 md:w-32 shrink-0">
            <Image
              src="/images/prag-logo-landing.png"
              alt="PRAG"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto">
            <span className="text-[#0a4f7c] text-base lg:text-lg font-semibold font-['Onest']">Need help choosing?</span>
            <a
              href={SALES_PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a4f7c] bg-white px-4 lg:px-5 py-2.5 text-sm font-semibold text-[#0a4f7c] font-['Onest'] hover:bg-[#0a4f7c] hover:text-white transition-colors shrink-0"
            >
              <Phone className="w-4 h-4" />
              Call PRAG
            </a>
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 lg:px-5 py-2.5 text-sm font-semibold text-white font-['Onest'] hover:bg-[#128C7E] transition-colors shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <a
            href={chatHref}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white font-['Onest'] hover:bg-[#128C7E] transition-colors shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-[#071a2f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a2f] via-[#0a2b4a] to-[#0a4f7c] opacity-90" />
        <div className="relative w-full px-8 sm:px-12 lg:px-16 py-14 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <p className="tracking-widest uppercase" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: 800, fontStyle: 'normal', color: 'rgb(248, 162, 78)' }}>
                PRAG Voltage Stabilizers
              </p>
              <h1 className="text-white text-[40px] leading-[46px] md:text-[74px] md:leading-[78px]" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 400, fontStyle: 'normal' }}>
                Get Stable Voltage. <br className="hidden md:inline" />
                <span className="text-[#7BB7FF]">Protect Your Equipment.</span>
              </h1>
              <p className="text-zinc-300 max-w-xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                Whether your voltage is low, high or constantly fluctuating, a PRAG voltage stabilizer corrects it to a stable level—and protects your connected appliances and equipment at the same time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#free-assessment"
                  className="inline-flex items-center justify-center rounded-lg bg-[#FF6B00] px-6 py-3.5 text-sm font-semibold text-white font-['Onest'] shadow-lg hover:bg-[#e65f00] transition-colors"
                >
                  Get a Free Voltage Assessment
                </a>
                <a
                  href={chatHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white font-['Onest'] backdrop-blur hover:bg-white/20 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Chat with an Expert on WhatsApp
                </a>
              </div>

              {/* Hero stats */}
              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 pt-6">
                {[
                  { num: '36', label: 'States Covered' },
                  { num: '15+', label: 'Years of Power Industry Experience' },
                  { num: '50K+', label: 'Systems Installed' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1 items-center text-center px-2 sm:px-6 border-r border-white/10 last:border-r-0 sm:items-start sm:text-left">
                    <p className="text-3xl md:text-4xl font-bold text-[#7BB7FF] font-['Onest'] leading-none">{s.num}</p>
                    <p className="mt-1 text-sm md:text-[15px] font-medium text-white/95 font-['Space_Grotesk'] leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end min-h-[360px] md:min-h-[460px] lg:min-h-[520px] overflow-visible">
              <div className="relative w-full h-[360px] md:h-[460px] lg:h-[520px] overflow-visible">
                <Image
                  src={HERO_IMAGE}
                  alt="PRAG stabilizers for home, commercial and industrial use"
                  fill
                  className="object-contain object-bottom scale-[1.25] md:scale-[1.55] md:-translate-x-[8%]"
                  sizes="(max-width: 768px) 100vw, 55vw"
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
          <p className="text-left tracking-widest uppercase mb-4 font-['Onest'] text-sm font-extrabold text-[#1261B8]" style={{ letterSpacing: '0.18em' }}>
            One Solution, Four Essential Benefits
          </p>
          <h2 className="text-left text-[#1a1a1a] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 'clamp(36px, 5.3vw, 58px)', fontWeight: 400, fontStyle: 'normal' }}>
            Stable voltage—and <br />
            protection for your equipment.
          </h2>
          <p className="text-left text-zinc-600 max-w-3xl mb-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
            Whether your voltage is too low, too high or constantly changing, PRAG helps deliver the stable power your equipment needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: ArrowDown, title: 'Corrects low voltage', body: 'Boosts incoming voltage to the stable level your equipment needs.' },
              { icon: ArrowUp, title: 'Corrects high voltage', body: 'Reduces excessive incoming voltage back to a safe, stable range.' },
              { icon: Activity, title: 'Stabilizes fluctuations', body: 'Continuously corrects changing voltage to deliver dependable output.' },
              { icon: ShieldCheck, title: 'Protects your equipment', body: 'Built-in safeties help protect appliances and equipment.' },
            ].map((b) => (
              <div key={b.title} className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="w-full sm:w-1/2 flex items-center justify-center h-40 rounded-2xl bg-[#38bdf8]/5">
                  <div className="h-20 w-20 rounded-full bg-[#38bdf8]/10 text-[#0a4f7c] flex items-center justify-center">
                    <b.icon className="w-10 h-10" />
                  </div>
                </div>
                <div className="w-full sm:w-1/2 text-left flex flex-col justify-center">
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
          <p className="tracking-widest uppercase mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: 800, fontStyle: 'normal', color: 'rgb(248, 162, 78)' }}>ONE RANGE. EVERY SCALE.</p>
          <h2 className="text-white mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 'clamp(36px, 5.3vw, 58px)', fontWeight: 400, fontStyle: 'normal' }}>Stable, protected power at<br />every scale.</h2>
          <p className="text-zinc-300 max-w-2xl mb-16" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>From one appliance to an entire facility, our team helps you select the right stabilizer for your voltage conditions, connected load and required level of protection.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Home, title: 'Home', body: 'Protect air conditioners, refrigerators, televisions and your entire home.', href: '#free-assessment' },
              { icon: Building2, title: 'Commercial', body: 'Keep offices, shops, hospitality equipment and essential systems protected.', href: '#free-assessment' },
              { icon: Factory, title: 'Industrial', body: 'Stabilize voltage for production equipment, motors and critical infrastructure.', href: '#free-assessment' },
            ].map((a, i) => (
              <div key={a.title} className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white flex flex-col min-h-[280px] border border-white/20 bg-gradient-to-br from-white/10 via-[#0a4f7c]/30 to-[#0a4f7c]/60 backdrop-blur-md">
                <div className="w-16 h-16 rounded-2xl bg-[#7BB7FF]/20 flex items-center justify-center text-[#7BB7FF] mb-6">
                  <a.icon className="w-9 h-9" />
                </div>
                <span className="text-4xl font-bold text-[#7BB7FF] font-['Onest'] mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '30px', lineHeight: '38px', fontWeight: 400, fontStyle: 'normal' }}>{a.title}</h3>
                <p className="text-white/80 mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>{a.body}</p>
                <Link href={a.href} className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white font-['Space_Grotesk'] hover:bg-[#e65f00] transition-colors">
                  Get a recommendation <span className="text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Backed by Experience */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="tracking-widest uppercase mb-4 font-['Onest'] text-sm font-extrabold text-[#1261B8]" style={{ letterSpacing: '0.18em' }}>
                Protection Backed by Experience
              </p>
              <h2 className="text-left text-[#1a1a1a] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(28px, 4.2vw, 42px)', lineHeight: 'clamp(32px, 4.6vw, 48px)', fontWeight: 400, fontStyle: 'normal' }}>
                Trusted by thousands of homes and businesses.
              </h2>
              <p className="text-zinc-600 max-w-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                Maintain a stable power supply for your home, business, or industry with automatic voltage stabilizers that deliver consistent performance while protecting your valuable equipment from voltage fluctuations.
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Headphones, title: 'Technical Support', body: 'Our power experts are available to help you choose, install and maintain the right stabilizer for your needs.' },
                  { icon: ShieldCheck, title: 'Product Warranty', body: 'Every PRAG stabilizer comes with dependable warranty coverage so your investment is protected.' },
                  { icon: ClipboardList, title: 'Free Power Assessment', body: 'Get a no-obligation evaluation of your voltage conditions and the right capacity recommendation.' },
                ].map((r) => (
                  <div key={r.title} className="flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 w-12 h-12 rounded-xl bg-[#0a4f7c] flex items-center justify-center text-white">
                      <r.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#1a1a1a] mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '24px', lineHeight: '32px', fontWeight: 400, fontStyle: 'normal' }}>{r.title}</h3>
                    <p className="text-zinc-600" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-full max-w-[640px] ml-auto aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={INSTALLATION_IMAGE}
                alt="PRAG voltage stabilizer installation"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product range */}
      <section className="relative w-full overflow-hidden bg-[#071a2f] py-14 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a2f] via-[#0a2b4a] to-[#0a4f7c] opacity-90" />
        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16">
          <p className="tracking-widest uppercase mb-4 font-['Onest'] text-sm font-extrabold text-white" style={{ letterSpacing: '0.18em' }}>
            Explore the Range
          </p>
          <h2 className="text-left text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 'clamp(36px, 5.3vw, 58px)', fontWeight: 400, fontStyle: 'normal' }}>
            A PRAG Stabilizer for Every Requirement.
          </h2>
          <p className="text-left text-white/80 max-w-2xl mt-4 mb-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
            50K+ systems installed across Nigeria. The right capacity and technology for homes, commercial premises and industrial plants.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Home Stabilizers',
                img: HOME_STABILIZER,
                alt: 'Compact PRAG stabilizer for home use',
                desc: 'Home and appliances',
                cta: 'Explore range',
                href: chatHref,
              },
              {
                title: 'Commercial Stabilizers',
                img: COMMERCIAL_STABILIZER,
                alt: 'Medium PRAG stabilizer for offices and businesses',
                desc: 'Offices and businesses',
                cta: 'Explore range',
                href: chatHref,
              },
              {
                title: 'Industrial Stabilizers',
                img: INDUSTRIAL_STABILIZER,
                alt: 'Large cabinet PRAG stabilizer for factories and equipment',
                desc: 'Factories and equipment',
                cta: 'Request assessment',
                href: '#free-assessment',
              },
            ].map((p) => (
              <div key={p.title} className="flex flex-col items-center text-center p-6">
                <div className={`relative w-full aspect-square mb-6 ${p.title === 'Home Stabilizers' ? 'p-16' : ''}`}>
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-white mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '26px', lineHeight: '32px', fontWeight: 400, fontStyle: 'normal' }}>{p.title}</h3>
                <p className="text-white/80 mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>{p.desc}</p>
                <Link href={p.href} className="mt-auto inline-flex items-center gap-2 rounded-lg bg-[#0a4f7c] px-5 py-3 text-sm font-semibold text-white font-['Onest'] hover:bg-[#083a5c] transition-colors">
                  {p.cta} <span className="text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Specification strip */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl border border-white/20 bg-white/10 p-6 md:p-8 backdrop-blur-md">
            <div className="flex items-start gap-4 text-white">
              <div className="w-12 h-12 rounded-xl bg-[#0a4f7c] flex items-center justify-center text-white shrink-0">
                <Plug2 className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-base md:text-lg font-normal font-['Onest'] leading-tight pt-1">Covers 45V–456V input range</span>
            </div>
            <div className="flex items-start gap-4 text-white">
              <div className="w-12 h-12 rounded-xl bg-[#0a4f7c] flex items-center justify-center text-white shrink-0">
                <Gauge className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="text-base md:text-lg font-normal font-['Onest'] leading-tight pt-1">5kVA to 200kVA capacities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Free assessment */}
      <section id="free-assessment" className="w-full bg-zinc-100 py-14 md:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="pr-8 lg:pr-12">
              <p className="tracking-widest uppercase mb-2 font-['Onest'] text-sm font-extrabold text-[#1261B8]" style={{ letterSpacing: '0.18em' }}>
                Free Voltage Assessment
              </p>
              <h2 className="text-[#1a1a1a] mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 'clamp(36px, 5.3vw, 58px)', fontWeight: 400, fontStyle: 'normal' }}>
                Tell us your voltage<br />
                problem.
              </h2>
              <p className="text-zinc-600 mb-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                Whether your voltage is low, high or unstable, a PRAG power expert will help you choose the right stabilizer for your space and budget.
              </p>
              <ol className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-bold text-white font-['Onest']">1</span>
                  <div className="pt-0.5 text-zinc-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                    <p>Submit your details —</p>
                    <p>This takes more than one minute</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-bold text-white font-['Onest']">2</span>
                  <div className="pt-0.5 text-zinc-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                    <p>We assess your requirement</p>
                    <p>We may call to confirm your load and voltage conditions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-bold text-white font-['Onest']">3</span>
                  <div className="pt-0.5 text-zinc-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 400, fontStyle: 'normal' }}>
                    <p>Receive a recommendation</p>
                    <p>Get the appropriate capacity and next steps.</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
              <p className="tracking-widest uppercase mb-2 font-['Onest'] text-sm font-extrabold text-[#1261B8]" style={{ letterSpacing: '0.18em' }}>
                Free Assessment
              </p>
              <h3 className="text-[#1a1a1a] mb-6" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '28px', lineHeight: '36px', fontWeight: 400, fontStyle: 'normal' }}>
                Get your recommendation
              </h3>
              <AssessmentForm whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="w-full bg-[#0a1420] py-8 border-t border-white/5">
        <div className="w-full px-8 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-300 font-['Space_Grotesk']">
          <div className="relative h-10 w-[132px]">
            <Image
              src="/images/prag-white.avif"
              alt="PRAG"
              fill
              className="object-contain object-left brightness-0 invert"
              sizes="(max-width: 768px) 132px, 132px"
            />
          </div>
          <p className="text-center">Trusted power solutions for homes and businesses across Nigeria.</p>
          <p className="md:text-right">© 2026 Pragmatic Technologies Ltd.</p>
        </div>
      </footer>
    </main>
  );
}

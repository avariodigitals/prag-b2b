import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';

const SOLUTIONS = [
  { label: 'Power Stabilization Systems', href: '/solutions' },
  { label: 'Backup Power (Inverters & Batteries)', href: '/solutions' },
  { label: 'Solar Power Systems', href: '/solutions' },
  { label: 'Complete Power Solutions', href: '/solutions' },
];

const COMPANY = [
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'PRAG Stores', href: '/find-a-distributor' },
  { label: 'Knowledge Center', href: '/knowledge-center' },
  { label: 'Become a Distributor', href: '/distributor' },
];

const QUICKLINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Use Cases', href: '/solutions' },
  { label: 'Installations', href: '/installations' },
  { label: 'Power Calculator', href: '/power-calculator' },
  { label: 'Technical Resources', href: '/resources' },
];

export default function Footer({ settings }: { settings?: PublicB2BContent['settings'] }) {
  const contact = settings?.contact;
  const integrations = settings?.integrations;
  const footer = settings?.footer;

  const phone = contact?.contactPhone?.trim() || '+2348032170129';
  const email = contact?.contactEmail?.trim() || 'sales@prag.global';
  const address = contact?.address?.trim() || 'Lagos, Nigeria';
  const whatsappNumber = (integrations?.whatsappChatNumber ?? '').replace(/\D/g, '');
  const whatsapp = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : (contact?.whatsapp?.trim() || 'https://wa.me/2348032170129');
  const ctaDescription = footer?.ctaDescription?.trim() || 'Talk to a PRAG engineer today and fix your power issues permanently.';
  const primaryCtaLabel = footer?.primaryCtaLabel?.trim() || 'Get a Free Power Assessment';
  const primaryCtaHref = footer?.primaryCtaHref?.trim() || '/power-calculator';
  const secondaryCtaLabel = footer?.secondaryCtaLabel?.trim() || 'WhatsApp Us Now';
  const secondaryCtaHref = footer?.secondaryCtaHref?.trim() || whatsapp;

  const companyName = footer?.companyName?.trim() || 'PRAG Power Engineering Ltd';
  const footerTagline = footer?.tagline?.trim() || 'Nigeria\'s leading power engineering company delivering reliable power systems for homes, businesses, and industries nationwide.';
  const footerCopyright = footer?.copyright?.trim() || `© Copyright ${new Date().getFullYear()} PRAG. All rights reserved.`;
  const disclaimerText = footer?.disclaimerText?.trim() || 'The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.';
  const defaultLegalLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms of use', href: '/terms-of-use' },
    { label: 'Sitemap', href: '/' },
  ];
  const legalLinks = defaultLegalLinks;

  const defaultColumns = [
    { title: 'Solutions', items: SOLUTIONS },
    { title: 'Company', items: COMPANY },
    { title: 'Quicklinks', items: QUICKLINKS },
  ];
  const displayColumns = defaultColumns
    .map((column) => ({
      title: column.title,
      items: (() => {
        const items = column.items.filter((item) => item?.label && item?.href);
        const isCompany = column.title.trim().toLowerCase() === 'company';
        if (!isCompany) return items;
        const distributorItems = items.filter((item) => item.label.trim().toLowerCase() === 'become a distributor');
        const otherItems = items.filter((item) => item.label.trim().toLowerCase() !== 'become a distributor');
        return [...otherItems, ...distributorItems];
      })(),
    }))
    .filter((column) => column.items.length > 0);

  const socials = contact?.socials ?? {};
  const facebook = socials.facebook?.trim() || 'https://facebook.com';
  const instagram = socials.instagram?.trim() || 'https://instagram.com';
  const linkedin = socials.linkedin?.trim() || 'https://linkedin.com';

  return (
    <footer>
      {/* Top CTA Banner */}
      <div className="w-full px-4 sm:px-6 md:px-20 py-10 sm:py-12 md:py-16 bg-sky-950 border-b border-stone-50 flex flex-col justify-center items-center gap-6 overflow-hidden">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center gap-8 text-center">
          <div className="w-full flex flex-col items-center gap-4 text-center">
            <h2 className="w-full text-center text-white text-[28px] sm:text-[40px] md:text-[58px] lg:text-7xl font-bold font-['Onest'] leading-[1.1]">
              <span className="block">Stop Losing Money</span>
              <span className="block">to Bad Power</span>
            </h2>
            <p className="w-full max-w-[740px] text-center text-white/70 text-[14px] sm:text-base md:text-xl font-normal font-['Onest'] leading-[1.5]">
              {ctaDescription}
            </p>
          </div>
          <div className="w-full max-w-[400px] md:max-w-[700px] flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href={primaryCtaHref}
              className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-[#1B7FC0] to-[#0166A5] rounded-full flex justify-center items-center gap-2.5 hover:brightness-110 transition-all"
            >
              <span className="text-white text-[16px] font-medium [font-family:var(--font-space-grotesk)] leading-[1.2]">
                {primaryCtaLabel}
              </span>
            </Link>
            <a
              href={secondaryCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto h-14 px-8 rounded-full border border-white text-white flex justify-center items-center gap-2.5 hover:bg-white hover:text-sky-950 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366] group-hover:text-sky-950 transition-colors" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="justify-start text-current text-[16px] sm:text-[18px] font-medium [font-family:var(--font-space-grotesk)] leading-[1.2] tracking-[0] transition-colors">
                {secondaryCtaLabel}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full bg-[#fcfdff] px-6 md:px-20 py-12 md:py-14">
        <div className="max-w-[1280px] mx-auto">
          <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-12">

          {/* Brand */}
          <div className="w-full lg:w-80 flex flex-col items-start justify-start gap-3 text-left">
            <div className="self-stretch flex flex-col items-start justify-start gap-1 text-left">
              <Image
                src="/images/PRAGC70a-A01aT07a-Z%202.png"
                alt="PRAG"
                width={100}
                height={30}
                className="w-[100px] h-[30px] object-contain object-left"
              />
              <div className="self-stretch justify-start text-neutral-700/70 text-sm font-normal [font-family:var(--font-space-grotesk)] leading-5">
                <span className="block">{companyName}</span>
                <span className="block">RC: 1234567.</span>
              </div>
            </div>
            <p className="self-stretch justify-start text-neutral-700 text-[18px] font-normal [font-family:var(--font-space-grotesk)]">
              {footerTagline}
            </p>
            <div className="w-full lg:w-80 flex flex-col justify-start items-start gap-2">
              <a href={whatsapp} className="self-stretch inline-flex justify-start items-center gap-4 text-neutral-700 text-[18px] md:text-lg font-normal [font-family:var(--font-space-grotesk)] hover:text-sky-700 transition-colors">
                <svg className="size-6 relative overflow-hidden shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="inline-flex justify-end items-center gap-4 text-neutral-700 text-[18px] md:text-lg font-normal [font-family:var(--font-space-grotesk)] underline underline-offset-2 hover:text-sky-700 transition-colors">
                <Mail className="size-6 shrink-0" />
                <span>{email}</span>
              </a>
              <span className="self-stretch inline-flex justify-start items-center gap-4 text-neutral-700 text-[18px] md:text-lg font-normal [font-family:var(--font-space-grotesk)]">
                <MapPin className="size-6 shrink-0" />
                <span>{address}</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-[903px] flex flex-col md:flex-row justify-start items-start gap-8 md:gap-6">
          {displayColumns.map((column) => (
            <div
              key={column.title}
              className={column.title.trim().toLowerCase() === 'solutions'
                ? 'inline-flex flex-col justify-start items-start gap-6'
                : 'flex-1 inline-flex flex-col justify-start items-start gap-6'}
            >
              <h4 className="self-stretch justify-start text-neutral-700 text-2xl font-bold [font-family:var(--font-space-grotesk)]">{column.title}</h4>
              <ul className={column.title.trim().toLowerCase() === 'solutions'
                ? 'w-full md:w-96 flex flex-col justify-start items-start gap-2'
                : column.title.trim().toLowerCase() === 'company'
                  ? 'w-full md:w-60 flex flex-col justify-start items-start gap-2'
                  : 'self-stretch flex flex-col justify-start items-start gap-2'}>
                {column.items.map((item, itemIndex) => (
                  <li key={`${column.title}-${item.label}-${item.href}-${itemIndex}`} className="w-full">
                    <Link
                      href={item.href}
                      className={column.title.trim().toLowerCase() === 'solutions'
                        ? 'block w-full text-neutral-700 text-[20px] md:text-xl font-normal [font-family:var(--font-space-grotesk)] leading-7 md:leading-normal whitespace-nowrap hover:text-sky-700 transition-colors'
                        : column.title.trim().toLowerCase() === 'company'
                          ? item.label.trim().toLowerCase() === 'prag stores'
                            ? 'block w-full text-zinc-700 text-[20px] md:text-xl font-normal [font-family:var(--font-space-grotesk)] leading-7 md:leading-normal hover:text-sky-700 transition-colors'
                            : 'block w-full text-Text-Brand-Secondary text-[20px] md:text-xl font-normal [font-family:var(--font-space-grotesk)] leading-7 md:leading-normal hover:text-sky-700 transition-colors'
                          : 'block w-full text-zinc-700 text-[20px] md:text-xl font-normal [font-family:var(--font-space-grotesk)] leading-7 md:leading-normal hover:text-sky-700 transition-colors'}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
          </div>

          {/* Divider + Bottom bar */}
          <div className="mt-12 border-t border-[#888888] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-700/70 text-[14px] md:text-sm font-normal [font-family:var(--font-space-grotesk)] leading-5 md:leading-5 whitespace-nowrap md:whitespace-normal text-center md:text-left">{footerCopyright}</p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href={facebook} aria-label="Facebook" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href={instagram} aria-label="Instagram" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href={linkedin} aria-label="LinkedIn" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center text-neutral-700/70 text-[18px] md:text-sm font-normal [font-family:var(--font-space-grotesk)] leading-7 md:leading-5">
            {legalLinks.map((item, index) => (
              <span key={`legal-${item.href}`} className="flex items-center gap-3">
                {index > 0 && <span>|</span>}
                <Link href={item.href} className="hover:text-sky-700 transition-colors">{item.label}</Link>
              </span>
            ))}
            <span className="flex items-center gap-3">
              {legalLinks.length > 0 && <span>|</span>}
              <button id="open_preferences_center" type="button" className="hover:text-sky-700 transition-colors cursor-pointer">
                Update cookies preferences
              </button>
            </span>
          </div>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="w-full px-2.5 py-5 bg-[#1873AB] inline-flex justify-center items-center gap-2.5">
        <p className="justify-start text-white text-sm font-normal [font-family:var(--font-space-grotesk)] leading-5 text-center">
          {disclaimerText}
        </p>
      </div>
    </footer>
  );
}

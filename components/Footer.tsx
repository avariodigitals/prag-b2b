import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Handshake,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';
import { formatPhone } from '@/lib/formatPhone';

const defaultProductLinks = [
  { label: 'Inverters', href: '/products/inverters' },
  { label: 'Batteries', href: '/products/batteries' },
  { label: 'Voltage Stabilizers', href: '/products/voltage-stabilizers' },
  { label: 'Solar Products', href: '/products/solar' },
  { label: 'Accessories & Parts', href: '/products' },
  { label: 'Hybrid Energy Solutions', href: '/solutions' },
];

const defaultSolutionLinks = [
  { label: 'For Homes', href: '/solutions/residential' },
  { label: 'For Offices', href: '/solutions/commercial' },
  { label: 'For Commercial', href: '/solutions/commercial' },
  { label: 'For Industrial', href: '/solutions/industrial' },
  { label: 'Power Stabilization & Protection', href: '/products/voltage-stabilizers' },
  { label: 'Renewable Energy Solutions', href: '/solutions' },
  { label: 'Energy Backup Solutions', href: '/solutions' },
];

const defaultSupportLinks = [
  { label: 'Warranty', href: '/warranty' },
  { label: 'Power Calculator', href: '/power-calculator' },
  { label: 'Technical Support', href: '/contact' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Downloads', href: '/resources' },
  { label: 'Contact Us', href: '/contact' },
];

const defaultCompanyLinks = [
  { label: 'About PRAG', href: '/about' },
  { label: 'Our Impact', href: '/about' },
  { label: 'Become a Reseller', href: '/distributor' },
  { label: 'Careers', href: '/careers' },
  { label: 'News & Insights', href: '/knowledge-center' },
];

const defaultLegalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms of use', href: '/terms-of-use' },
  { label: 'Warranty Policy', href: '/warranty' },
  { label: 'Delivery Policy', href: '/shipping-policy' },
  { label: 'Returns Policy', href: '/return-policy' },
];

const nationwidePresence = ['Lagos', 'Abuja', 'Port Harcourt', 'Alaba', 'Onikan'];

type FooterLink = {
  label: string;
  href: string;
};

const defaultFooterColumns: Array<{ title: string; items: FooterLink[] }> = [
  { title: 'Products', items: defaultProductLinks },
  { title: 'Solutions', items: defaultSolutionLinks },
  { title: 'Support', items: defaultSupportLinks },
  { title: 'Company', items: defaultCompanyLinks },
];

function FooterColumn({ title, links, showUnderline = true }: { title: string; links: FooterLink[]; showUnderline?: boolean }) {
  return (
    <div className="min-w-0">
      <h3 className="text-[1.6rem] font-bold uppercase leading-none tracking-[-0.02em] text-white md:text-[1.35rem]">
        {title}
      </h3>
      {showUnderline && (
        <>
          <div className="mt-2 h-px w-[38%] bg-white md:hidden" />
          <div className="mt-2 hidden h-px w-full bg-white/75 md:block" />
        </>
      )}
      <ul className="mt-5 space-y-4 md:space-y-4">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-3 text-[1.12rem] leading-[1.2] text-white/92 transition-colors hover:text-white md:text-[1.02rem]"
            >
              <span>{link.label}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/75 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function XIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.901 2H22l-6.768 7.737L23.2 22h-6.24l-4.887-7.498L5.51 22H2.4l7.24-8.275L2 2h6.398l4.418 6.83L18.901 2zm-1.095 18h1.717L7.47 3.895H5.628L17.806 20z" />
    </svg>
  );
}

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer({ settings }: { settings?: PublicB2BContent['settings'] }) {
  const contact = settings?.contact;
  const integrations = settings?.integrations;
  const footer = settings?.footer;
  const socials = contact?.socials ?? {};

  const salesPhone = contact?.contactPhone?.trim() || '+2348032170129';
  const supportPhone = salesPhone;
  const email = contact?.contactEmail?.trim() || 'sales@prag.global';
  const address = contact?.address?.trim() || '4, Obanikoro Street, Via Falemi House, Off Ikorodu Road, Lagos';
  const mapLink = contact?.mapLink?.trim() || 'https://maps.app.goo.gl/6MUDUGwKQC7stPZ56';
  const whatsappNumber = (integrations?.whatsappChatNumber ?? '').replace(/\D/g, '');
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : contact?.whatsapp?.trim() || 'https://wa.me/2348032170129';
  const whatsappDisplay = whatsappNumber ? formatPhone(`+${whatsappNumber}`) : formatPhone(salesPhone);
  const footerCopyright = footer?.copyright?.trim() || '© Copyright 2026 PRAG. All rights reserved.';
  const disclaimerText = footer?.disclaimerText?.trim() || 'The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.';
  const footerCtaTitle = footer?.ctaTitle?.trim() || 'Stop Losing Money to Bad Power';
  const footerCtaDescription = footer?.ctaDescription?.trim() || 'Talk to a PRAG engineer today and fix your power issues permanently.';
  const footerPrimaryCtaLabel = footer?.primaryCtaLabel?.trim() || 'Get a Free Power Assessment';
  const footerPrimaryCtaHref = footer?.primaryCtaHref?.trim() || '/power-calculator';
  const footerSecondaryCtaLabel = footer?.secondaryCtaLabel?.trim() || 'WhatsApp Us Now';
  const footerSecondaryCtaHref = footer?.secondaryCtaHref?.trim() || whatsappHref;
  const footerCompanyName = footer?.companyName?.trim() ?? 'PRAG Power Engineering Ltd';
  const footerCompanyRegistration = footer?.companyRegistration?.trim() ?? 'RC: 1234567.';
  const footerCompanyLine = [footerCompanyName, footerCompanyRegistration].filter((value) => value).join(' ');
  const footerTagline = footer?.tagline?.trim() || 'Nigeria\'s leading power engineering company delivering reliable power systems for homes, businesses, and industries nationwide.';
  const whatsappChatTitle = integrations?.whatsappChatText?.trim() || 'Chat with us on WhatsApp';
  const supportCardLeadText = footer?.supportCardLeadText?.trim() || 'Need help choosing the right power solution';
  const supportCardCtaText = footer?.supportCardCtaText?.trim() || 'Talk to an Expert';
  const trustCardTitle = footer?.trustCardTitle?.trim() || 'Trusted Power Solutions for Homes and Businesses Across Nigeria';
  const trustCardSubtitle = footer?.trustCardSubtitle?.trim() || 'Voltage Stabilizers • Inverters • Lithium Batteries • Solar Solutions';
  const whatsappHelperText = footer?.whatsappHelperText?.trim() || 'Quick replies. Real people';
  const partnerTitle = footer?.partnerTitle?.trim() || 'Become a Partner';
  const partnerDescription = footer?.partnerDescription?.trim() || 'Join our network of resellers and installers across Nigeria';
  const partnerCtaText = footer?.partnerCtaText?.trim() || 'Partner with PRAG';
  const partnerHref = footer?.partnerHref?.trim() || '/distributor';
  const contactHeading = footer?.contactHeading?.trim() || 'Contact Us';
  const headOfficeLabel = footer?.headOfficeLabel?.trim() || 'Head Office';
  const salesHotlineLabel = footer?.salesHotlineLabel?.trim() || 'Sales Hotline';
  const customerSupportLabel = footer?.customerSupportLabel?.trim() || 'Customer Support';
  const whatsappLabel = footer?.whatsappLabel?.trim() || 'Whatsapp';
  const emailLabel = footer?.emailLabel?.trim() || 'Email';
  const workingHoursLabel = footer?.workingHoursLabel?.trim() || 'Working Hours';
  const workingHoursText = footer?.workingHoursText?.trim() || 'Mon- Sat: 8:00am - 6:00pm';
  const facebook = socials.facebook?.trim() || 'https://facebook.com';
  const xSocial = socials.twitter?.trim() || 'https://x.com/PRAG_Ng';
  const instagram = socials.instagram?.trim() || 'https://instagram.com';
  const linkedin = socials.linkedin?.trim() || 'https://linkedin.com';
  const configuredColumns = Array.isArray(footer?.columns)
    ? footer.columns
      .map((column) => {
        const title = String(column?.title ?? '').trim();
        const items = Array.isArray(column?.items)
          ? column.items
            .map((item) => ({
              label: String(item?.label ?? '').trim(),
              href: String(item?.href ?? '').trim(),
            }))
            .filter((item) => item.label && item.href)
          : [];

        return { title, items };
      })
      .filter((column) => column.title && column.items.length > 0)
    : [];
  const footerColumns = configuredColumns.length > 0 ? configuredColumns : defaultFooterColumns;
  const configuredLegalLinks = Array.isArray(footer?.legalLinks)
    ? footer.legalLinks
      .map((item) => ({
        label: String(item?.label ?? '').trim(),
        href: String(item?.href ?? '').trim(),
      }))
      .filter((item) => item.label && item.href)
    : [];
  const legalLinks = configuredLegalLinks.length > 0 ? configuredLegalLinks : defaultLegalLinks;

  return (
    <footer className="bg-[#082F53] font-[family-name:var(--font-space-grotesk)] text-white">
      <section className="bg-[#f1f2f3] px-4 py-10 text-center md:px-6 md:py-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5">
          <h2 className="max-w-[320px] text-[46px] font-bold font-['Onest'] leading-[1.02] tracking-[-0.02em] text-[#0166A5] md:max-w-[620px] md:text-[62px] md:leading-[1.0]">
            {footerCtaTitle}
          </h2>
          <p className="text-[20px] leading-[1.35] text-zinc-700">
            {footerCtaDescription}
          </p>
          <div className="mt-2 flex w-full max-w-[560px] flex-col items-center gap-3 md:w-auto md:max-w-none md:flex-row">
            <Link
              href={footerPrimaryCtaHref}
              className="w-full rounded-full bg-[#0166A5] px-6 py-3 text-center text-[16px] font-semibold text-white transition-colors hover:bg-[#01558a] md:w-auto"
            >
              {footerPrimaryCtaLabel}
            </Link>
            <a
              href={footerSecondaryCtaHref}
              target={footerSecondaryCtaHref.startsWith('http') ? '_blank' : undefined}
              rel={footerSecondaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="w-full rounded-full border border-[#0166A5] bg-transparent px-6 py-3 text-center text-[16px] font-semibold text-[#0166A5] transition-colors hover:bg-[#0166A5] hover:text-white md:w-auto"
            >
              {footerSecondaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      <div className="px-4 pb-6 pt-7 sm:px-6 md:px-14 md:pb-0 md:pt-7 xl:px-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="hidden rounded-[2px] border border-white bg-[#0d3d67] px-4 py-3 md:hidden">
            <div className="flex flex-col divide-y divide-white md:flex-row md:divide-x md:divide-y-0">
              <Link href="/contact" className="flex flex-1 items-center gap-3 py-3 first:pt-0 last:pb-0 md:px-4 md:py-1.5 md:first:pl-0 md:last:pr-0">
                <img
                  src="/images/contact_support.png"
                  alt="Contact support"
                  className="h-10 w-10 shrink-0 md:h-11 md:w-11"
                />
                <div className="min-w-0">
                  <p className="max-w-[14rem] text-[18px] leading-[1.2] text-white/90 md:max-w-none md:text-[17px]">{supportCardLeadText}</p>
                  <div className="mt-2 flex items-center gap-3 text-[18px] font-semibold leading-none">
                    <span>{supportCardCtaText}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </div>
                </div>
              </Link>

              <div className="flex flex-1 items-center gap-3 py-3 md:px-4 md:py-1.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#123c66] md:h-11 md:w-11">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="max-w-[22rem] text-[18px] font-semibold leading-[1.18]">{trustCardTitle}</p>
                  <br />
                  <p className="text-[0.84rem] leading-[1.3] text-white/75 md:text-[0.92rem]">{trustCardSubtitle}</p>
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center gap-3 py-3 last:pb-0 md:px-4 md:py-1.5 md:last:pb-1.5"
              >
                <WhatsAppIcon className="h-10 w-10 shrink-0 text-[#25D366] md:h-11 md:w-11" />
                <div className="min-w-0">
                  <p className="text-[0.84rem] text-white/90 md:text-[0.9rem]">{whatsappChatTitle}</p>
                  <p className="mt-1 text-[26px] font-semibold leading-none tracking-[0.03em] md:text-[24px] md:tracking-[0.02em]">{whatsappDisplay}</p>
                  <p className="mt-1 text-[0.84rem] text-white/75 md:text-[0.9rem]">{whatsappHelperText}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-6 pb-8 md:mt-[40px] md:grid md:grid-cols-[228px_minmax(0,1fr)] md:gap-10 md:pb-7 lg:gap-10">
            <div className="md:self-start md:border-r md:border-white md:pr-6">
              <Link href="/" aria-label="PRAG home" className="relative mt-[5px] block h-[34px] w-[118px] md:mt-0 md:h-[38px] md:w-[128px]">
                <Image
                  src="/images/PRAGC70a-A01aT07a-Z%202.png"
                  alt="PRAG"
                  fill
                  className="object-contain object-left brightness-0 invert"
                  sizes="136px"
                />
              </Link>

              <div className="mt-3 space-y-3 text-[1.05rem] leading-[1.24] text-white/92 md:text-[1.02rem]">
                <p>{footerTagline}</p>
                {footerCompanyLine ? <p>{footerCompanyLine}</p> : null}
              </div>

              <div className="hidden mt-5 border-t border-white pt-4 md:hidden">
                <h3 className="text-[1.6rem] font-bold uppercase leading-none tracking-[-0.02em] md:text-[1.35rem]">{contactHeading}</h3>
                <ul className="mt-4 space-y-3 text-white/94 md:space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{headOfficeLabel}</p>
                      <p className="mt-1 text-[1.05rem] leading-[1.3] text-white/88 md:text-[1.02rem]">{address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-1 h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{salesHotlineLabel}</p>
                      <a href={`tel:${salesPhone.replace(/\s+/g, '')}`} className="mt-1 block text-[1.05rem] leading-[1.3] text-white/88 transition-colors hover:text-white md:text-[1.02rem]">
                        {formatPhone(salesPhone)}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Headphones className="mt-1 h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{customerSupportLabel}</p>
                      <a href={`tel:${supportPhone.replace(/\s+/g, '')}`} className="mt-1 block text-[1.05rem] leading-[1.3] text-white/88 transition-colors hover:text-white md:text-[1.02rem]">
                        {formatPhone(supportPhone)}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <WhatsAppIcon className="mt-1 h-4 w-4 shrink-0 text-white/92" />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{whatsappLabel}</p>
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[1.05rem] leading-[1.3] text-white/88 transition-colors hover:text-white md:text-[1.02rem]">
                        {whatsappDisplay}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-1 h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{emailLabel}</p>
                      <a href={`mailto:${email}`} className="mt-1 block text-[1.05rem] leading-[1.3] text-white/88 transition-colors hover:text-white md:text-[1.02rem]">
                        {email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock3 className="mt-1 h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <div>
                      <p className="font-onest text-[1.02rem] font-semibold leading-[1.15] md:text-[0.98rem]">{workingHoursLabel}</p>
                      <p className="mt-1 text-[1.05rem] leading-[1.3] text-white/88 md:text-[1.02rem]">{workingHoursText}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-4 md:border-t md:border-white">
                <ul className="space-y-2.5 text-white/94">
                  <li className="flex items-center gap-2.5">
                    <WhatsAppIcon className="h-4 w-4 shrink-0 text-white/92" />
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[1.12rem] leading-[1.3] text-white/88 transition-colors hover:text-white">
                      {whatsappDisplay}
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <a href={`mailto:${email}`} className="text-[1.12rem] leading-[1.3] text-white/88 transition-colors hover:text-white">
                      {email}
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-white/92" strokeWidth={2} />
                    <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-[1.12rem] leading-[1.3] text-white/88 transition-colors hover:text-white">
                      {address}
                    </a>
                  </li>
                </ul>
              </div>

              <Link
                href={partnerHref}
                className="mt-6 flex min-h-[96px] items-center gap-3 rounded-[2px] border-[0.5px] border-white px-4 py-4 transition-colors hover:bg-white/5 md:hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white text-white">
                    <Handshake className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[1.28rem] font-semibold leading-none">{partnerTitle}</p>
                    <p className="mt-1.5 text-[0.82rem] leading-[1.3] text-white/78">{partnerDescription}</p>
                    <div className="mt-3 flex items-center gap-2.5 text-[1.08rem] font-semibold">
                      <span>{partnerCtaText}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-8 md:mt-0">
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                {footerColumns.map((column) => (
                  <FooterColumn key={column.title} title={column.title} links={column.items} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 hidden border-t-0 pt-0 md:mt-[38px] md:block md:pt-0 lg:pt-0">
            <Link
              href={partnerHref}
              className="flex min-h-[96px] items-center gap-3 rounded-[2px] border-[0.5px] border-white px-4 py-4 transition-colors hover:bg-white/5 md:min-h-[188px] md:justify-between md:border md:border-[#1873AB] md:bg-[#0E416F] md:px-12 md:py-7"
            >
              <div className="flex items-center gap-3 md:gap-9">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white text-white md:h-[136px] md:w-[136px] md:border-[1.5px]">
                  <Handshake className="h-4.5 w-4.5 md:h-[56px] md:w-[56px]" strokeWidth={2} />
                </div>
                <div className="min-w-0 md:max-w-[700px]">
                  <p className="text-[1.28rem] font-semibold leading-none md:text-[36px] md:leading-[1]">{partnerTitle}</p>
                  <p className="mt-1.5 text-[0.82rem] leading-[1.3] text-white/78 md:mt-2 md:text-[28px] md:leading-[1.22] md:tracking-[0.01em] md:text-white/85">{partnerDescription}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2.5 text-[1.08rem] font-semibold md:mt-0 md:rounded-[16px] md:border md:border-white md:px-8 md:py-4 md:text-[1.18rem] md:leading-none md:whitespace-nowrap md:transition-colors md:hover:bg-[#0166A5]">
                <span>{partnerCtaText}</span>
                <ArrowRight className="h-4 w-4 shrink-0 md:h-9 md:w-9" />
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-8 py-8 text-center lg:flex-row lg:justify-between lg:gap-6 lg:text-left">
            <p className="w-full text-[0.95rem] leading-[1.45] text-white/78 lg:w-auto lg:text-[1.05rem]">
              {footerCopyright}
            </p>

            <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[0.95rem] leading-[1.4] text-white/78 lg:w-auto lg:flex-nowrap lg:gap-x-2 lg:gap-y-0 lg:text-[1.05rem]">
              {legalLinks.map((link, index) => (
                <span key={link.label} className="flex items-center gap-3">
                  {index > 0 && <span className="text-white/40">|</span>}
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </span>
              ))}
              <span className="flex items-center gap-3">
                <span className="text-white/40">|</span>
                <button id="open_preferences_center" type="button" className="cursor-pointer transition-colors hover:text-white">
                  Cookies
                </button>
              </span>
            </div>

            <div className="flex items-center gap-8 text-white md:gap-5">
              <a href={facebook} aria-label="Facebook" className="transition-colors hover:text-white/75">
                <FacebookIcon className="h-8 w-8 md:h-6 md:w-6" />
              </a>
              <a href={xSocial} target="_blank" rel="noopener noreferrer" aria-label="X" className="transition-colors hover:text-white/75">
                <XIcon className="h-8 w-8 md:h-6 md:w-6" />
              </a>
              <a href={instagram} aria-label="Instagram" className="transition-colors hover:text-white/75">
                <InstagramIcon className="h-8 w-8 md:h-6 md:w-6" />
              </a>
              <a href={linkedin} aria-label="LinkedIn" className="transition-colors hover:text-white/75">
                <LinkedinIcon className="h-8 w-8 md:h-6 md:w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1873AB] px-4 py-5 text-center sm:px-6 md:px-8">
        <p className="mx-auto max-w-[1280px] text-[0.9rem] leading-[1.45] text-white/95 md:text-[0.95rem]">
          {disclaimerText}
        </p>
      </div>
    </footer>
  );
}
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import { getB2BPublicContent } from '@/lib/b2bContent';
import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';
import FAQSection from '@/components/FAQ';

export const metadata: Metadata = { title: 'Get in Touch' };

function SocialIcon({ network }: { network: string }) {
  if (network === 'facebook')
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
      </svg>
    );
  if (network === 'instagram')
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    );
  if (network === 'linkedin')
    return (
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" />
      </svg>
    );
  return null;
}

export default async function ContactPage() {
  const [stores, settings, content] = await Promise.all([
    getStores(),
    getSiteSettings(),
    getB2BPublicContent(),
  ]);

  const b2bContact = content?.settings?.contact;
  const phone = b2bContact?.contactPhone?.trim() || settings.contact_phone;
  const email = b2bContact?.contactEmail?.trim() || settings.contact_email;
  const address = b2bContact?.address?.trim() || settings.address;
  const hoursWeekday = settings.business_hours_weekday;
  const hoursSaturday = settings.business_hours_saturday;
  const socials = b2bContact?.socials;
  const whatsappNumber = (content?.settings?.integrations?.whatsappChatNumber ?? '').replace(/\D/g, '');
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : (b2bContact?.whatsapp?.trim() || 'https://wa.me/2348032170129');

  const socialLinks = [
    { label: 'Facebook', href: socials?.facebook || settings.socials?.facebook, network: 'facebook' },
    { label: 'Instagram', href: socials?.instagram || settings.socials?.instagram, network: 'instagram' },
    { label: 'Linkedin', href: socials?.linkedin || settings.socials?.linkedin, network: 'linkedin' },
  ].filter((s) => Boolean(s.href));

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full flex flex-col">
      {/* ── Hero ── */}
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">Get in Touch</h1>
        <p className="breadcrumb-description-lock max-w-[531px]">
          Have a question or need a custom power solution?{' '}
          <br className="hidden md:block" />
          We&apos;d love to hear from you.
        </p>
      </div>

      {/* ── Contact Info + Form ── */}
      <section className="w-full px-6 md:px-20 py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left: Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="px-5 py-5 bg-[#f9f9f9] rounded-[14px] flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0166a5] rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#1a1a1a] text-sm font-medium font-['Space_Grotesk']">Email</span>
                <a
                  href={`mailto:${email}`}
                  className="text-[#6b6b6b] text-sm font-['Space_Grotesk'] hover:text-[#0166a5] transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="px-5 py-5 bg-[#f9f9f9] rounded-[14px] flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0166a5] rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#1a1a1a] text-sm font-medium font-['Space_Grotesk']">Phone</span>
                <a
                  href={`tel:${phone}`}
                  className="text-[#888888] text-sm font-['Space_Grotesk'] hover:text-[#0166a5] transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="px-5 py-5 bg-[#f9f9f9] rounded-[14px] flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0166a5] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#1a1a1a] text-sm font-medium font-['Space_Grotesk']">Location</span>
                <span className="text-[#6b6b6b] text-sm font-['Space_Grotesk']">{address}</span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="px-5 py-5 bg-[#f9f9f9] rounded-[14px] flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0166a5] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#1a1a1a] text-sm font-medium font-['Space_Grotesk']">Business Hours</span>
                <span className="text-[#6b6b6b] text-sm font-['Space_Grotesk']">{hoursWeekday}</span>
                {hoursSaturday && (
                  <span className="text-[#6b6b6b] text-sm font-['Space_Grotesk']">{hoursSaturday}</span>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="p-5 rounded-[14px] border border-[#eeeeee] flex flex-col gap-4">
                <span className="text-[#1a1a1a] text-sm font-medium font-['Space_Grotesk']">
                  Follow our socials
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                      aria-label={`Follow us on ${s.label}`}
                    >
                      <div className="w-10 h-10 bg-[#0166a5] rounded-full flex items-center justify-center shrink-0">
                        <SocialIcon network={s.network} />
                      </div>
                      <span className="text-[#1a1a1a] text-sm font-normal font-['Space_Grotesk']">
                        {s.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Enquiry Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── PRAG / Online / Chain Stores ── */}
      <section className="w-full py-4 pb-20 flex flex-col gap-16">
        <StoresGrid
          pragStores={pragStores}
          onlineStores={onlineStores}
          chainStores={chainStores}
        />
      </section>

      {/* ── FAQ ── */}
      <FAQSection />
    </main>
  );
}

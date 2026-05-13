import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import { getB2BPublicContent } from '@/lib/b2bContent';
import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';

export const metadata: Metadata = { title: 'Get in Touch' };

function SocialIcon({ network }: { network: string }) {
  if (network === 'facebook')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" /></svg>;
  if (network === 'whatsapp')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
  if (network === 'instagram')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>;
  if (network === 'linkedin')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" /></svg>;
  return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.01 6.87L22 22h-5.48l-4.29-5.6L7.2 22H4.44l6.43-7.35L2 2h5.62l3.88 5.13zm-.97 18.35h1.53L6.8 3.57H5.17z" /></svg>;
}

export default async function ContactPage() {
  const [stores, settings, content] = await Promise.all([getStores(), getSiteSettings(), getB2BPublicContent()]);
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
    { label: 'WhatsApp', href: whatsappLink, network: 'whatsapp' },
    { label: 'Instagram', href: socials?.instagram || settings.socials?.instagram, network: 'instagram' },
    { label: 'LinkedIn', href: socials?.linkedin || settings.socials?.linkedin, network: 'linkedin' },
  ].filter((s) => Boolean(s.href));

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full flex flex-col">
      {/* Hero */}
      <div className="w-full bg-stone-50 py-16 md:py-20 px-6 flex flex-col items-center gap-4 text-center">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat'] leading-tight">Get in Touch</h1>
        <p className="text-sky-700 text-lg md:text-xl font-['Montserrat'] leading-relaxed max-w-lg">
          Have a question or need a custom power solution?<br className="hidden md:block" /> We&apos;d love to hear from you.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-10 py-16 md:py-20 flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {/* Left: contact info */}
        <div className="w-full md:w-96 shrink-0 flex flex-col gap-4">
          <div className="p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-base font-medium font-['Montserrat']">Email</span>
              <a href={`mailto:${email}`} className="text-zinc-500 text-base font-['Montserrat'] hover:text-sky-700">{email}</a>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-base font-medium font-['Montserrat']">Phone</span>
              <a href={`tel:${phone}`} className="text-zinc-500 text-base font-['Montserrat'] hover:text-sky-700">{phone}</a>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-base font-medium font-['Montserrat']">Location</span>
              <span className="text-zinc-500 text-base font-['Montserrat']">{address}</span>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-base font-medium font-['Montserrat']">Business Hours</span>
              <span className="text-zinc-500 text-base font-['Montserrat']">{hoursWeekday}</span>
              <span className="text-zinc-500 text-base font-['Montserrat']">{hoursSaturday}</span>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-sky-700 flex flex-col gap-4">
              <span className="text-zinc-900 text-base font-medium font-['Montserrat']">Follow our socials</span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 min-w-[140px] sm:min-w-[160px]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                      <SocialIcon network={s.network} />
                    </div>
                    <span className="text-zinc-900 text-base font-['Montserrat'] whitespace-nowrap">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: form */}
        <ContactForm />
      </div>

      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
    </main>
  );
}

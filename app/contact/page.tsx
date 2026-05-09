import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';

export const metadata: Metadata = { title: 'Get in Touch – Prag B2B' };

function SocialIcon({ network }: { network: string }) {
  if (network === 'facebook')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" /></svg>;
  if (network === 'instagram')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>;
  if (network === 'linkedin')
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" /></svg>;
  return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.01 6.87L22 22h-5.48l-4.29-5.6L7.2 22H4.44l6.43-7.35L2 2h5.62l3.88 5.13zm-.97 18.35h1.53L6.8 3.57H5.17z" /></svg>;
}

export default async function ContactPage() {
  const [stores, settings] = await Promise.all([getStores(), getSiteSettings()]);

  const phone = settings.contact_phone;
  const email = settings.contact_email;
  const address = settings.address;
  const hoursWeekday = settings.business_hours_weekday;
  const hoursSaturday = settings.business_hours_saturday;

  const socialLinks = [
    { label: 'Facebook', href: settings.socials?.facebook, network: 'facebook' },
    { label: 'Instagram', href: settings.socials?.instagram, network: 'instagram' },
    { label: 'LinkedIn', href: settings.socials?.linkedin, network: 'linkedin' },
  ].filter((s) => Boolean(s.href));

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center pt-14 pb-8 px-6">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest']">Get in Touch</h1>
        <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">
          Have a question or need a custom power solution?<br />
          We&apos;d love to hear from you.
        </p>
        <div className="w-full border-t border-dashed border-sky-200 mt-2" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto w-full px-6 md:px-10 py-10 flex flex-col md:flex-row gap-10 items-start">
        {/* Left: contact info */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
          <div className="p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk']">Email</span>
              <a href={`mailto:${email}`} className="text-zinc-500 text-sm font-['Space_Grotesk'] hover:text-sky-700">{email}</a>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk']">Phone</span>
              <a href={`tel:${phone}`} className="text-zinc-500 text-sm font-['Space_Grotesk'] hover:text-sky-700">{phone}</a>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk']">Location</span>
              <span className="text-zinc-500 text-sm font-['Space_Grotesk']">{address}</span>
            </div>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk']">Business Hours</span>
              <span className="text-zinc-500 text-sm font-['Space_Grotesk']">{hoursWeekday}</span>
              <span className="text-zinc-500 text-sm font-['Space_Grotesk']">{hoursSaturday}</span>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="p-5 bg-white rounded-2xl border border-sky-700 flex flex-col gap-4">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk']">Follow our socials</span>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center">
                      <SocialIcon network={s.network} />
                    </div>
                    <span className="text-zinc-900 text-sm font-['Space_Grotesk']">{s.label}</span>
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

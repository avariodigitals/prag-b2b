'use client';

import { useState, useEffect } from 'react';
import { submitContactForm } from '@/lib/woocommerce';

const ENQUIRY_TYPES = ['General Enquiry', 'Product Enquiry', 'Technical Support', 'Partnership', 'Bulk Order'];
const ALLOWED_ENQUIRY = new Set(ENQUIRY_TYPES);
const EMPTY_FORM = { name: '', email: '', phone: '', company: '', enquiry_type: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-(). ]{0,25}$/;
const INJECTION_RE = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg/i;

function validateContactForm(form: typeof EMPTY_FORM): string | null {
  if (!form.name.trim() || form.name.trim().length > 100) return 'Enter a valid full name (max 100 characters).';
  if (INJECTION_RE.test(form.name)) return 'Name contains invalid characters.';
  if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';
  if (form.phone && !PHONE_RE.test(form.phone)) return 'Enter a valid phone number (digits, spaces, +, -, ( ) only).';
  if (form.company && (form.company.length > 150 || INJECTION_RE.test(form.company))) return 'Company name contains invalid characters.';
  if (form.enquiry_type && !ALLOWED_ENQUIRY.has(form.enquiry_type)) return 'Select a valid enquiry type.';
  if (INJECTION_RE.test(form.message)) return 'Message contains invalid content.';
  if (form.message.trim().length > 2000) return 'Message is too long (max 2000 characters).';
  return null;
}

interface Toast { type: 'success' | 'error'; message: string }

function FormToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm w-[calc(100vw-3rem)] ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}
      role="alert" aria-live="assertive">
      <div className="mt-0.5 shrink-0">
        {toast.type === 'success' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg md:text-xl font-bold font-['Montserrat']">
          {toast.type === 'success' ? 'Message Sent!' : 'Submission Failed'}
        </p>
        <p className="text-lg md:text-xl font-['Montserrat'] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="ml-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validateContactForm(form);
    if (error) { setToast({ type: 'error', message: error }); return; }
    setSending(true);
    const result = await submitContactForm(form);
    setSending(false);
    if (result.success) {
      setForm(EMPTY_FORM);
      setToast({ type: 'success', message: "We'll get back to you shortly." });
    } else {
      setToast({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' });
    }
  }

  const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-stone-200 text-zinc-900 text-base font-['Montserrat'] focus:border-sky-700 outline-none transition-colors";

  return (
    <>
      {toast && <FormToast toast={toast} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} noValidate className="flex-1 bg-stone-50 rounded-2xl p-8 md:p-10 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-900 text-base font-['Montserrat']">Full Name *</label>
          <input required type="text" value={form.name} onChange={set('name')} maxLength={100} className={inputCls} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-900 text-base font-['Montserrat']">Email Address *</label>
          <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base font-['Montserrat']">Phone Number</label>
            <input type="tel" value={form.phone} onChange={set('phone')} maxLength={25} className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base font-['Montserrat']">Company</label>
            <input type="text" value={form.company} onChange={set('company')} maxLength={150} className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-900 text-base font-['Montserrat']">Enquiry Type</label>
          <select value={form.enquiry_type} onChange={set('enquiry_type')} className={inputCls}>
            <option value=""></option>
            {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-900 text-base font-['Montserrat']">Message *</label>
          <textarea required value={form.message} onChange={set('message')} rows={5} maxLength={2000}
            className="w-full p-3 bg-white rounded-lg border border-stone-200 text-zinc-900 text-base font-['Montserrat'] focus:border-sky-700 outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Montserrat'] rounded-lg transition-colors disabled:opacity-60"
        >
          {sending ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';

const TIERS = ['Authorized Dealer', 'Certified Installer', 'Product Reseller'];
const ALLOWED_TIERS = new Set(TIERS);
const EMPTY_FORM = { name: '', business: '', phone: '', email: '', city: '', type: '', tier: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-(). ]{0,25}$/;
const INJECTION_RE = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg/i;

function validateDistributorForm(form: typeof EMPTY_FORM): string | null {
  if (!form.name.trim() || form.name.trim().length > 100) return 'Enter a valid full name (max 100 characters).';
  if (INJECTION_RE.test(form.name)) return 'Name contains invalid characters.';
  if (!form.business.trim() || form.business.trim().length > 150) return 'Enter a valid business name.';
  if (INJECTION_RE.test(form.business)) return 'Business name contains invalid characters.';
  if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';
  if (form.phone && !PHONE_RE.test(form.phone)) return 'Enter a valid phone number (digits, spaces, +, -, ( ) only).';
  if (form.city && (form.city.length > 100 || INJECTION_RE.test(form.city))) return 'City contains invalid characters.';
  if (form.type && (form.type.length > 150 || INJECTION_RE.test(form.type))) return 'Business type contains invalid characters.';
  if (form.tier && !ALLOWED_TIERS.has(form.tier)) return 'Select a valid partnership tier.';
  if (INJECTION_RE.test(form.message)) return 'Message contains invalid content.';
  if (form.message.length > 2000) return 'Message is too long (max 2000 characters).';
  return null;
}

interface Toast { type: 'error'; message: string }

function ErrorToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm w-[calc(100vw-3rem)] bg-red-600 text-white"
      role="alert" aria-live="assertive">
      <div className="mt-0.5 shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg md:text-xl font-bold font-['Onest']">Submission Failed</p>
        <p className="text-lg md:text-xl font-['Onest'] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="ml-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-zinc-200 text-zinc-900 text-base font-['Onest'] focus:border-sky-700 outline-none transition-colors";

export default function DistributorForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validateDistributorForm(form);
    if (error) { setToast({ type: 'error', message: error }); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('sent');
      } else {
        setStatus('idle');
        setToast({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' });
      }
    } catch {
      setStatus('idle');
      setToast({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' });
    }
  }

  if (status === 'sent') {
    return (
      <div className="w-full max-w-3xl p-10 bg-white rounded-xl border border-zinc-100 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-zinc-900 text-xl font-bold font-['Onest']">Application Submitted!</h3>
        <p className="text-zinc-500 text-lg md:text-xl font-['Onest']">Our partnership team will contact you within 2 business days.</p>
      </div>
    );
  }

  return (
    <>
      {toast && <ErrorToast toast={toast} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-3xl p-6 md:p-10 bg-white rounded-xl border border-zinc-100 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">Full Name *</label>
            <input required type="text" value={form.name} onChange={set('name')} maxLength={100} className={inputCls} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">Business Name *</label>
            <input required type="text" value={form.business} onChange={set('business')} maxLength={150} className={inputCls} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">Phone Number</label>
            <input type="tel" value={form.phone} onChange={set('phone')} maxLength={25} className={inputCls} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">Email Address *</label>
            <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">City</label>
            <input type="text" value={form.city} onChange={set('city')} maxLength={100} className={inputCls} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-900 text-base font-['Onest']">Business type</label>
            <input type="text" value={form.type} onChange={set('type')} maxLength={150} className={inputCls} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-base font-['Onest']">Preferred Partnership Tier</label>
          <select value={form.tier} onChange={set('tier')} className={inputCls}>
            <option value="">Select tier</option>
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-base font-['Onest']">Tell Us About Your Business</label>
          <textarea value={form.message} onChange={set('message')} rows={5} maxLength={2000}
            className="w-full p-3 bg-white rounded-lg border border-zinc-200 text-zinc-900 text-base font-['Onest'] focus:border-sky-700 outline-none transition-colors resize-none" />
        </div>

        <button type="submit" disabled={status === 'sending'}
          className="w-full py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-base font-semibold font-['Onest'] rounded-lg transition-colors disabled:opacity-60">
          {status === 'sending' ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </>
  );
}

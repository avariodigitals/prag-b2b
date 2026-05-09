'use client';

import { useState } from 'react';

const TIERS = ['Authorized Dealer', 'Certified Installer', 'Product Reseller'];

const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-zinc-200 text-zinc-900 text-sm font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors";

export default function DistributorForm() {
  const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', city: '', type: '', tier: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(res.ok && data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
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
        <p className="text-zinc-500 text-sm font-['Space_Grotesk']">Our partnership team will contact you within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 md:p-10 bg-white rounded-xl border border-zinc-100 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Full Name *</label>
          <input required type="text" value={form.name} onChange={set('name')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Business Name *</label>
          <input required type="text" value={form.business} onChange={set('business')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Phone Number</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Email Address *</label>
          <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">City</label>
          <input type="text" value={form.city} onChange={set('city')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Business type</label>
          <input type="text" value={form.type} onChange={set('type')} className={inputCls} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Preferred Partnership Tier</label>
        <select value={form.tier} onChange={set('tier')} className={inputCls}>
          <option value="">Select tier</option>
          {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Tell Us About Your Business</label>
        <textarea value={form.message} onChange={set('message')} rows={5}
          className="w-full p-3 bg-white rounded-lg border border-zinc-200 text-zinc-900 text-sm font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors resize-none" />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm font-['Space_Grotesk']">Something went wrong. Please try again or email us directly.</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="w-full py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-base font-semibold font-['Space_Grotesk'] rounded-lg transition-colors disabled:opacity-60">
        {status === 'sending' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}

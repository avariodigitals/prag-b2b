'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/woocommerce';

const ENQUIRY_TYPES = ['General Enquiry', 'Product Enquiry', 'Technical Support', 'Partnership', 'Bulk Order'];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', enquiry_type: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const result = await submitContactForm(form);
    setStatus(result.success ? 'sent' : 'error');
  }

  const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-stone-200 text-zinc-900 text-sm font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex-1 bg-stone-50 rounded-2xl p-8 md:p-10 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Full Name *</label>
        <input required type="text" value={form.name} onChange={set('name')} className={inputCls} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Email Address *</label>
        <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Phone Number</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Company</label>
          <input type="text" value={form.company} onChange={set('company')} className={inputCls} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Enquiry Type</label>
        <select value={form.enquiry_type} onChange={set('enquiry_type')} className={inputCls}>
          <option value=""></option>
          {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-900 text-sm font-['Space_Grotesk']">Message *</label>
        <textarea required value={form.message} onChange={set('message')} rows={5}
          className="w-full p-3 bg-white rounded-lg border border-stone-200 text-zinc-900 text-sm font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors resize-none"
        />
      </div>

      {status === 'sent' && <p className="text-green-600 text-sm font-['Space_Grotesk']">Message sent! We&apos;ll get back to you shortly.</p>}
      {status === 'error' && <p className="text-red-600 text-sm font-['Space_Grotesk']">Something went wrong. Please try again or email us directly.</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-lg transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}

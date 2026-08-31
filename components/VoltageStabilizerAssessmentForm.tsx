'use client';

import { useState } from 'react';
import { trackLead } from '@/lib/metaPixel';

interface Props {
  whatsappNumber: string;
}

const PROPERTY_TYPES = [
  'Home / Residential',
  'Office / Commercial',
  'Factory / Industrial',
  'Other',
];

const AREAS = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Other',
];

const PROBLEMS = [
  'Low voltage',
  'High voltage',
  'Frequent voltage fluctuations',
  'Need a new stabilizer',
  'Not sure — need advice',
];

const PROTECTS = [
  'Entire property',
  'Selected appliances',
  'Air conditioners',
  'Office / commercial equipment',
  'Industrial equipment',
  'Not sure — please advise',
];

export default function VoltageStabilizerAssessmentForm({ whatsappNumber }: Props) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    property: PROPERTY_TYPES[0],
    area: AREAS[0],
    problem: PROBLEMS[0],
    protect: PROTECTS[0],
  });
  const [sending, setSending] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string | null {
    const name = form.name.trim();
    if (!name || name.length > 100) return 'Please enter your name (max 100 characters).';
    const phone = form.phone.trim();
    if (!phone || phone.length < 7) return 'Please enter a valid phone / WhatsApp number.';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      window.alert(error);
      return;
    }
    setSending(true);

    const message = [
      'Hello PRAG, I need a free voltage stabilizer assessment.',
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Property type: ${form.property}`,
      `Area: ${form.area}`,
      `Issue: ${form.problem}`,
      `What to protect: ${form.protect}`,
    ].join('\n');

    const number = (whatsappNumber || '2348032170129').replace(/\D/g, '');
    const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
    trackLead({ content_name: 'Voltage Stabilizer Assessment', content_category: form.property });
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="vsa-name" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">Full name</label>
          <input
            id="vsa-name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] placeholder:text-zinc-400 focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            placeholder="e.g. John Adeyemi"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa-phone" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">Phone / WhatsApp</label>
          <input
            id="vsa-phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] placeholder:text-zinc-400 focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            placeholder="e.g. 0803 217 0129"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa-property" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">Property type</label>
          <select
            id="vsa-property"
            value={form.property}
            onChange={(e) => updateField('property', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa-area" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">Your area / state</label>
          <select
            id="vsa-area"
            value={form.area}
            onChange={(e) => updateField('area', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa-problem" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">What issue are you trying to solve?</label>
          <select
            id="vsa-problem"
            value={form.problem}
            onChange={(e) => updateField('problem', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
          >
            {PROBLEMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="vsa-protect" className="text-sm font-medium text-[#1a1a1a] font-['Arial, Helvetica, sans-serif']">What do you want to protect?</label>
          <select
            id="vsa-protect"
            value={form.protect}
            onChange={(e) => updateField('protect', e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] font-['Arial, Helvetica, sans-serif'] focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
          >
            {PROTECTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={sending}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-3.5 text-sm font-semibold text-white font-['Arial, Helvetica, sans-serif'] shadow-md transition-colors hover:bg-[#e65f00] disabled:opacity-60"
      >
        {sending ? 'Opening WhatsApp…' : 'Send via WhatsApp'}
      </button>
      <p className="mt-3 text-center text-xs text-zinc-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        By submitting, you will be redirected to WhatsApp to chat with a PRAG power expert.
      </p>
    </form>
  );
}

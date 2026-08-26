'use client';

import { useState } from 'react';

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

export default function AssessmentForm({ whatsappNumber }: Props) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    property: PROPERTY_TYPES[0],
    area: AREAS[0],
    problem: PROBLEMS[0],
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
    ].join('\n');

    const number = (whatsappNumber || '2348032170129').replace(/\D/g, '');
    const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="vsa2-name" className="text-sm font-medium text-[#1a1a1a] font-['Onest']">Full name</label>
          <input
            id="vsa2-name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-[#1a1a1a] font-['Space_Grotesk'] placeholder:text-zinc-400 focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
            placeholder="e.g. John Adeyemi"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa2-phone" className="text-sm font-medium text-[#1a1a1a] font-['Onest']">Phone / WhatsApp</label>
          <input
            id="vsa2-phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-[#1a1a1a] font-['Space_Grotesk'] placeholder:text-zinc-400 focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
            placeholder="e.g. 0803 217 0129"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa2-property" className="text-sm font-medium text-[#1a1a1a] font-['Onest']">Property type</label>
          <select
            id="vsa2-property"
            value={form.property}
            onChange={(e) => updateField('property', e.target.value)}
            className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-[#1a1a1a] font-['Space_Grotesk'] focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vsa2-area" className="text-sm font-medium text-[#1a1a1a] font-['Onest']">Your area / state</label>
          <select
            id="vsa2-area"
            value={form.area}
            onChange={(e) => updateField('area', e.target.value)}
            className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-[#1a1a1a] font-['Space_Grotesk'] focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="vsa2-problem" className="text-sm font-medium text-[#1a1a1a] font-['Onest']">What issue are you trying to solve?</label>
          <select
            id="vsa2-problem"
            value={form.problem}
            onChange={(e) => updateField('problem', e.target.value)}
            className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-[#1a1a1a] font-['Space_Grotesk'] focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
          >
            {PROBLEMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={sending}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 py-3.5 text-sm font-semibold text-white font-['Onest'] shadow-md transition-colors hover:bg-[#e65f00] disabled:opacity-60"
      >
        {sending ? 'Opening WhatsApp…' : 'Get My Recommendation on WhatsApp'}
      </button>
      <p className="mt-3 text-xs text-zinc-500 font-['Space_Grotesk']">
        By submitting, you will be redirected to WhatsApp to chat with a PRAG power expert.
      </p>
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { submitContactForm } from '@/lib/woocommerce';

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  preferredContactMethod: '',
};

const CONTACT_METHODS = ['WhatsApp', 'Email', 'Phone'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-(). ]{7,25}$/;
const INJECTION_RE = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg/i;

interface Toast {
  type: 'success' | 'error';
  message: string;
}

function validate(form: typeof EMPTY_FORM): string | null {
  if (!form.name.trim() || form.name.trim().length > 100) return 'Enter a valid name (max 100 characters).';
  if (INJECTION_RE.test(form.name)) return 'Name contains invalid characters.';
  if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';
  if (!PHONE_RE.test(form.phone)) return 'Enter a valid phone / WhatsApp number.';
  if (!CONTACT_METHODS.includes(form.preferredContactMethod)) return 'Select a preferred contact method.';
  return null;
}

function FormToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm w-[calc(100vw-3rem)] ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}
      role="alert"
      aria-live="assertive"
    >
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
        <p className="text-base font-bold font-['Space_Grotesk']">
          {toast.type === 'success' ? 'Request Sent!' : 'Submission Failed'}
        </p>
        <p className="text-sm font-['Space_Grotesk'] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="ml-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface Props {
  submitLabel?: string;
}

export default function FreePowerAssessmentForm({ submitLabel }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  function set(field: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate(form);
    if (error) {
      setToast({ type: 'error', message: error });
      return;
    }

    setSending(true);
    const message = [
      'Free Power Assessment Request',
      `Phone / WhatsApp Number: ${form.phone.trim()}`,
      `Preferred Contact Method: ${form.preferredContactMethod}`,
    ].join('\n');

    const result = await submitContactForm({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: 'Free Power Assessment',
      route: '/free-power-assessment',
      enquiry_type: 'Power Assessment',
      message,
    });
    setSending(false);

    if (result.success) {
      setForm(EMPTY_FORM);
      setToast({ type: 'success', message: 'We will contact you shortly.' });
      return;
    }

    setToast({ type: 'error', message: 'Something went wrong. Please try again shortly.' });
  }

  const labelCls = "text-[#1a1a1a] text-base font-medium font-['Space_Grotesk']";
  const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-zinc-300 text-[#1a1a1a] text-base font-['Space_Grotesk'] focus:border-[#0166a5] focus:outline-none transition-colors placeholder:text-[#888888]";

  return (
    <>
      {toast && <FormToast toast={toast} onClose={() => setToast(null)} />}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full bg-white rounded-xl border border-zinc-300 p-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={set('name')}
            maxLength={100}
            className={inputCls}
            aria-label="Name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Phone / WhatsApp Number *</label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            maxLength={25}
            className={inputCls}
            aria-label="Phone / WhatsApp Number"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            className={inputCls}
            aria-label="Email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls}>Preffered Contact Method *</label>
          <select
            required
            value={form.preferredContactMethod}
            onChange={set('preferredContactMethod')}
            className={inputCls}
            aria-label="Preffered Contact Method"
          >
            <option value=""></option>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-[#0166a5] hover:bg-[#015490] text-white text-[15px] font-semibold font-['DM_Sans'] rounded-lg transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {sending ? 'Submitting...' : (submitLabel?.trim() || 'Get a Free Power Assessment')}
        </button>
      </form>
    </>
  );
}
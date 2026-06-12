'use client';

import { useState } from 'react';
import { submitCareersForm } from '@/lib/woocommerce';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-(). ]{7,25}$/;
const INJECTION_RE = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg/i;

interface Toast {
  type: 'success' | 'error';
  message: string;
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
          {toast.type === 'success' ? 'Application Sent!' : 'Submission Failed'}
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

const STEPS = ['Personal Info', 'Application', 'Review'];

const POSITION_GROUPS: { department: string; positions: string[] }[] = [
  {
    department: 'Engineering & Technical',
    positions: [
      'Electrical Engineer',
      'Power Systems Engineer',
      'Solar Installer',
      'Inverter Technician',
      'Battery Technician',
      'Stabilizer Technician',
      'Technical Support Engineer',
      'R&D Engineer',
      'Quality Control Inspector',
      'Field Service Engineer',
      'Project Engineer',
    ],
  },
  {
    department: 'Sales & Marketing',
    positions: [
      'Sales Officer',
      'Sales Representative',
      'Key Account Manager',
      'Business Development Manager',
      'Digital Marketer',
      'Social Media Manager',
      'Brand Manager',
      'Marketing Manager',
      'Product Marketing Specialist',
    ],
  },
  {
    department: 'Operations & Logistics',
    positions: [
      'Operations Manager',
      'Logistics Coordinator',
      'Warehouse Manager',
      'Procurement Officer',
      'Inventory Manager',
      'Supply Chain Manager',
      'Dispatch Officer',
      'Fleet Manager',
    ],
  },
  {
    department: 'Customer Service',
    positions: [
      'Customer Support Representative',
      'Call Center Agent',
      'After-Sales Service Coordinator',
      'Customer Success Manager',
    ],
  },
  {
    department: 'Finance & Accounting',
    positions: [
      'Accountant',
      'Finance Manager',
      'Accounts Officer',
      'Auditor',
      'Payroll Officer',
    ],
  },
  {
    department: 'Human Resources & Admin',
    positions: [
      'HR Manager',
      'HR Officer',
      'Administrative Assistant',
      'Office Manager',
      'Receptionist',
      'Executive Assistant',
    ],
  },
  {
    department: 'Information Technology',
    positions: [
      'Software Developer',
      'IT Support Specialist',
      'Network Administrator',
      'Web Developer',
      'Data Analyst',
      'Systems Administrator',
    ],
  },
  {
    department: 'Legal & Compliance',
    positions: [
      'Legal Officer',
      'Compliance Officer',
    ],
  },
];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  location: '',
  position: '',
  experience: '',
  education: '',
  cvLink: '',
  coverLetter: '',
};

type FormData = typeof EMPTY_FORM;
type FormField = keyof FormData;

function validateStep(step: number, form: FormData): string | null {
  if (step === 0) {
    if (!form.name.trim() || form.name.trim().length > 100) return 'Enter a valid name (max 100 characters).';
    if (INJECTION_RE.test(form.name)) return 'Name contains invalid characters.';
    if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';
    if (!PHONE_RE.test(form.phone)) return 'Enter a valid phone number.';
    if (!form.location.trim()) return 'Enter your location / city.';
  }
  if (step === 1) {
    if (!form.position.trim()) return 'Select the position you are applying for.';
    if (!form.experience.trim()) return 'Enter your years of experience.';
    if (!form.education.trim()) return 'Enter your education background.';
  }
  return null;
}

export default function CareersForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function setField(field: FormField) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function nextStep() {
    const error = validateStep(step, form);
    if (error) {
      setToast({ type: 'error', message: error });
      return;
    }
    setToast(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setToast(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    const error = validateStep(step, form);
    if (error) {
      setToast({ type: 'error', message: error });
      return;
    }

    setSending(true);
    const result = await submitCareersForm(form);
    setSending(false);

    if (result.success) {
      setSubmitted(true);
      setToast({ type: 'success', message: 'Your application has been received. We will contact you shortly.' });
      setForm(EMPTY_FORM);
      setStep(0);
      return;
    }

    setToast({ type: 'error', message: result.message || 'Something went wrong. Please try again.' });
  }

  const labelCls = "text-[#1a1a1a] text-base font-medium font-['Space_Grotesk']";
  const inputCls = "w-full h-12 px-3 bg-white rounded-lg border border-zinc-300 text-[#1a1a1a] text-base font-['Space_Grotesk'] focus:border-[#0166a5] focus:outline-none transition-colors placeholder:text-[#888888]";
  const textareaCls = "w-full p-3 bg-white rounded-lg border border-zinc-300 text-[#1a1a1a] text-base font-['Space_Grotesk'] focus:border-[#0166a5] focus:outline-none transition-colors placeholder:text-[#888888] resize-none";

  if (submitted) {
    return (
      <div className="w-full max-w-[640px] mx-auto">
        <div className="bg-white rounded-xl border border-zinc-300 p-8 md:p-12 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-[#1a1a1a] text-[24px] md:text-[32px] font-medium font-['Space_Grotesk'] leading-tight">
              Application Received
            </h2>
            <p className="text-[#444444] text-[16px] md:text-[18px] font-normal font-['Onest'] leading-relaxed">
              Thank you for your interest in joining PRAG. We have received your application and will review it shortly. If your profile matches our requirements, we will contact you for the next steps.
            </p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); setStep(0); }}
            className="px-6 py-3 bg-[#0166a5] hover:bg-[#015490] text-white text-[15px] font-semibold font-['DM_Sans'] rounded-lg transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <FormToast toast={toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-[640px] mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-['Space_Grotesk'] transition-colors ${
                    i < step ? 'bg-[#0166a5] text-white' : i === step ? 'bg-[#0166a5] text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs font-medium font-['Onest'] ${i <= step ? 'text-[#0166a5]' : 'text-zinc-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0166a5] transition-all duration-300 rounded-full"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-zinc-300 p-6 md:p-8">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[#1a1a1a] text-[20px] font-medium font-['Space_Grotesk']">Personal Information</h2>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={form.name} onChange={setField('name')} maxLength={100} className={inputCls} placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.email} onChange={setField('email')} className={inputCls} placeholder="john@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={setField('phone')} maxLength={25} className={inputCls} placeholder="+234 803 217 0129" />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Location / City *</label>
                <input type="text" value={form.location} onChange={setField('location')} maxLength={150} className={inputCls} placeholder="Lagos, Nigeria" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[#1a1a1a] text-[20px] font-medium font-['Space_Grotesk']">Application Details</h2>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Position Applying For *</label>
                <select value={form.position} onChange={setField('position')} className={inputCls}>
                  <option value="">Select a position</option>
                  {POSITION_GROUPS.map((group) => (
                    <optgroup key={group.department} label={group.department}>
                      {group.positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Years of Experience *</label>
                <select value={form.experience} onChange={setField('experience')} className={inputCls}>
                  <option value="">Select experience level</option>
                  <option value="0-1 years">0–1 years</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5-10 years">5–10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Highest Education *</label>
                <select value={form.education} onChange={setField('education')} className={inputCls}>
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Diploma / OND">Diploma / OND</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional Certification">Professional Certification</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>CV / Resume Link</label>
                <input type="url" value={form.cvLink} onChange={setField('cvLink')} maxLength={300} className={inputCls} placeholder="Google Drive, Dropbox, or LinkedIn profile link" />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Cover Letter</label>
                <textarea value={form.coverLetter} onChange={setField('coverLetter')} rows={5} maxLength={2000} className={textareaCls} placeholder="Tell us why you want to join PRAG and what makes you a great fit..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[#1a1a1a] text-[20px] font-medium font-['Space_Grotesk']">Review Your Application</h2>
              <div className="bg-stone-50 rounded-lg p-5 flex flex-col gap-4 text-[15px] font-['Onest']">
                <div>
                  <span className="text-zinc-500 text-sm">Name</span>
                  <p className="text-[#1a1a1a] font-medium">{form.name}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-sm">Email</span>
                  <p className="text-[#1a1a1a] font-medium">{form.email}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-sm">Phone</span>
                  <p className="text-[#1a1a1a] font-medium">{form.phone}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-sm">Location</span>
                  <p className="text-[#1a1a1a] font-medium">{form.location}</p>
                </div>
                <hr className="border-zinc-200" />
                <div>
                  <span className="text-zinc-500 text-sm">Position</span>
                  <p className="text-[#1a1a1a] font-medium">{form.position}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-sm">Experience</span>
                  <p className="text-[#1a1a1a] font-medium">{form.experience}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-sm">Education</span>
                  <p className="text-[#1a1a1a] font-medium">{form.education}</p>
                </div>
                {form.cvLink && (
                  <div>
                    <span className="text-zinc-500 text-sm">CV / Resume Link</span>
                    <p className="text-[#1a1a1a] font-medium">{form.cvLink}</p>
                  </div>
                )}
                {form.coverLetter && (
                  <div>
                    <span className="text-zinc-500 text-sm">Cover Letter</span>
                    <p className="text-[#1a1a1a] whitespace-pre-line">{form.coverLetter}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 text-[15px] font-medium font-['DM_Sans'] hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-[#0166a5] hover:bg-[#015490] text-white text-[15px] font-semibold font-['DM_Sans'] rounded-lg transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending}
                className="px-6 py-2.5 bg-[#0166a5] hover:bg-[#015490] text-white text-[15px] font-semibold font-['DM_Sans'] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

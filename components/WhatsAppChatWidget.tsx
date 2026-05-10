'use client';

import { useMemo, useState } from 'react';
import type { PublicB2BContent } from '@/lib/b2bContent';

function normalizeWhatsAppLink(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('wa.me/') || trimmed.startsWith('api.whatsapp.com/')) return `https://${trimmed}`;
  if (trimmed.startsWith('+')) return `https://wa.me/${trimmed.replace(/[^\d]/g, '')}`;
  if (/^\d{7,}$/.test(trimmed)) return `https://wa.me/${trimmed}`;
  return `https://${trimmed}`;
}

function withPrefill(link: string, message: string) {
  const trimmed = message.trim();
  if (!link || !trimmed) return link;
  try {
    const url = new URL(link);
    url.searchParams.set('text', trimmed);
    return url.toString();
  } catch {
    const sep = link.includes('?') ? '&' : '?';
    return `${link}${sep}text=${encodeURIComponent(trimmed)}`;
  }
}

export default function WhatsAppChatWidget({ settings }: { settings?: PublicB2BContent['settings'] }) {
  const [open, setOpen] = useState(false);

  const integrations = settings?.integrations;
  const contact = settings?.contact;

  const enabled = integrations?.whatsappChatEnabled ?? true;
  const baseLink = useMemo(() => {
    const number = (integrations?.whatsappChatNumber ?? '').replace(/\D/g, '');
    if (number) return `https://wa.me/${number}`;
    const raw = contact?.whatsapp?.trim() || 'https://wa.me/2348032170129';
    return normalizeWhatsAppLink(raw);
  }, [integrations?.whatsappChatNumber, contact?.whatsapp]);

  const title = integrations?.whatsappChatText?.trim() || 'Chat with us on WhatsApp';
  const subtitle = 'We typically reply within a few minutes.';
  const prefill = 'Hi PRAG, I need help.';

  const options = useMemo(() => ([
    { label: 'General Enquiries', subtitle: 'Ask anything', prefill: 'Hi PRAG, I have a general enquiry.' },
    { label: 'Sales', subtitle: 'Pricing & product advice', prefill: 'Hi PRAG Sales, I want to buy and need help.' },
    { label: 'Support', subtitle: 'Technical help', prefill: 'Hi PRAG Support, I need technical assistance.' },
    { label: 'Delivery', subtitle: 'Orders & logistics', prefill: 'Hi PRAG, I need help with delivery / logistics.' },
  ]), []);

  if (!enabled || !baseLink) return null;

  function openWhatsApp(message: string) {
    const href = withPrefill(baseLink, message);
    window.open(href, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  const startChatHref = withPrefill(baseLink, prefill);

  return (
    <div className="fixed left-4 bottom-4 z-50 flex flex-col items-start gap-3">
      {open && (
        <div className="w-[280px] overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-2xl backdrop-blur">
          <div className="bg-gradient-to-br from-[#25D366] to-[#12B76A] px-4 py-3 text-white flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold font-['Space_Grotesk'] truncate">{title}</p>
              <p className="mt-0.5 text-xs text-white/85 font-['Space_Grotesk'] line-clamp-2">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-full p-1.5 hover:bg-white/10 transition-colors text-white"
              aria-label="Close WhatsApp chat widget"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-3 pt-3 pb-3">
            <p className="px-1 pb-2 text-[11px] font-semibold tracking-wide uppercase text-zinc-500 font-['Space_Grotesk']">
              Choose an option
            </p>

            <div className="flex flex-col gap-2">
              {options.map((option) => {
                const optionPrefill = option.prefill?.trim() || prefill;
                const optionSubtitle = option.subtitle?.trim() || '';
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => openWhatsApp(optionPrefill)}
                    className="group rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/60"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 font-['Space_Grotesk'] truncate">{option.label}</p>
                      {optionSubtitle && (
                        <p className="mt-0.5 text-xs text-zinc-600 font-['Space_Grotesk'] truncate">{optionSubtitle}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <a
              href={startChatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#25D366] to-[#12B76A] text-white px-4 py-2.5 text-sm font-semibold font-['Space_Grotesk'] shadow-lg shadow-emerald-200/50 transition-transform duration-200 hover:scale-[1.02]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.52 3.48A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413zM12.05 21.78h-.005a9.824 9.824 0 01-5.01-1.38l-.36-.214-3.741.982.999-3.648-.235-.374a9.858 9.858 0 01-1.51-5.254c.003-5.45 4.437-9.884 9.893-9.884a9.825 9.825 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.912 9.88zm5.44-7.433c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.149-.67.149-.198.297-.769.967-.942 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.917-2.206-.242-.58-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                />
              </svg>
              Start WhatsApp chat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#12B76A] text-white shadow-xl shadow-emerald-200/50 ring-1 ring-emerald-200/60 transition-transform duration-200 hover:scale-[1.06]"
        aria-label={open ? 'Close WhatsApp chat widget' : 'Open WhatsApp chat widget'}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413zM12.05 21.78h-.005a9.824 9.824 0 01-5.01-1.38l-.36-.214-3.741.982.999-3.648-.235-.374a9.858 9.858 0 01-1.51-5.254c.003-5.45 4.437-9.884 9.893-9.884a9.825 9.825 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.912 9.88z"
          />
        </svg>
      </button>
    </div>
  );
}

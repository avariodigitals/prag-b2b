'use client';

import { useEffect, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';
import TrackedWhatsAppLink from './TrackedWhatsAppLink';

interface Props {
  settings?: PublicB2BContent['settings'];
}

function normalizeWhatsAppLink(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('wa.me/') || trimmed.startsWith('api.whatsapp.com/')) return `https://${trimmed}`;
  if (trimmed.startsWith('+')) return `https://wa.me/${trimmed.replace(/[^\d]/g, '')}`;
  if (/^\d{7,}$/.test(trimmed)) return `https://wa.me/${trimmed}`;
  return `https://${trimmed}`;
}

export default function SlideOutChat({ settings }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const title = 'Need help choosing?';
  const subtitle = 'Chat on WhatsApp';
  const message = 'Hi PRAG team, I was browsing your product pages and need help choosing the right product. Can you assist?';

  useEffect(() => {
    if (dismissed) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight > 0 && scrolled / pageHeight > 0.3) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  const chatNumber = (settings?.integrations?.whatsappChatNumber ?? '').replace(/\D/g, '');
  const baseLink = chatNumber
    ? `https://wa.me/${chatNumber}`
    : normalizeWhatsAppLink(settings?.contact?.whatsapp?.trim() || 'https://wa.me/2348032170129');
  const waLink = `${baseLink}${baseLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed right-0 bottom-24 z-40 transition-transform duration-500 ease-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-stretch">
        <TrackedWhatsAppLink
          href={waLink}
          leadName="Slide-out WhatsApp CTA"
          className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] transition-colors pl-4 pr-5 py-4 rounded-l-2xl shadow-lg shadow-black/10 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold font-['Onest'] leading-tight whitespace-nowrap">
              {title}
            </span>
            <span className="text-white/90 text-xs font-medium font-['Onest'] leading-tight whitespace-nowrap">
              {subtitle}
            </span>
          </div>
        </TrackedWhatsAppLink>
        <button
          onClick={() => setDismissed(true)}
          className="bg-[#25D366] hover:bg-[#1ebe5d] transition-colors w-7 flex items-center justify-center rounded-l-none border-l border-white/20"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>
    </div>
  );
}

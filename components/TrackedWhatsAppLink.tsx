'use client';

import { trackLead } from '@/lib/metaPixel';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  leadName?: string;
  leadCategory?: string;
}

/**
 * Wraps a WhatsApp anchor so that a Meta Pixel `Lead` event is fired when the
 * user clicks it. Safe to use even when the pixel is not loaded — `trackLead`
 * silently no-ops in that case.
 *
 * Page views are never counted as leads; this only fires on the click.
 */
export default function TrackedWhatsAppLink({
  href,
  children,
  className,
  leadName = 'WhatsApp CTA',
  leadCategory = 'WhatsApp',
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackLead({ content_name: leadName, content_category: leadCategory })}
    >
      {children}
    </a>
  );
}

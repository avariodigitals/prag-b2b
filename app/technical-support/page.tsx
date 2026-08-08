import type { Metadata } from 'next';
import TechnicalSupportForm from '@/components/TechnicalSupportForm';

export const metadata: Metadata = { title: 'Technical Support', alternates: { canonical: 'https://www.prag.global/technical-support' } };

export default function TechnicalSupportPage() {
  return (
    <main className="w-full flex flex-col">
      {/* ── Hero ── */}
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">Technical Support</h1>
        <p className="breadcrumb-description-lock max-w-[531px]">
          Need help with a product or installation?{' '}
          <br className="hidden md:block" />
          Submit a ticket and our team will assist you.
        </p>
      </div>

      {/* ── Form ── */}
      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <TechnicalSupportForm />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { ManagedFAQSection } from '@/components/FAQ';

export const metadata: Metadata = { title: 'FAQ', alternates: { canonical: 'https://www.prag.global/faq' } };

const FALLBACK_DESCRIPTION = 'Answers to common questions about PRAG products, warranty, installation, and support.';
const FALLBACK_ITEMS = [
  {
    question: 'What is the warranty period on PRAG products?',
    answer: 'All PRAG products come with a standard 5-year warranty covering manufacturing defects and component failures under normal use conditions.',
  },
  {
    question: 'Do you offer installation services?',
    answer: 'Yes, PRAG offers professional installation services through our certified engineers and authorized partner network across Nigeria. Contact us or visit a PRAG store to schedule an installation.',
  },
  {
    question: 'Can I get bulk pricing for large orders?',
    answer: 'Yes, we offer competitive bulk pricing for businesses, contractors, and distributors. Please reach out to our sales team via the enquiry form or email sales@prag.global for a custom quote.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, PRAG primarily serves customers within Nigeria. For international inquiries, please contact us directly and our team will assess feasibility and provide shipping options.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, card payments (Visa/Mastercard), and USSD payments. For large corporate orders, we also support purchase orders and invoice-based payments.',
  },
  {
    question: 'How do I request technical support?',
    answer: 'You can request technical support by calling our support line at +2348032170129, emailing sales@prag.global, or submitting a request through the contact form.',
  },
];

export default async function FAQPage() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/faq');
  const hero = findVisibleSectionsByType(page, 'hero')[0];
  const faqItems = findVisibleSectionsByType(page, 'faq-item')
    .map((item) => ({
      question: item.summary?.trim() || item.title?.trim() || '',
      answer: item.content?.trim() || '',
    }))
    .filter((item) => item.question && item.answer);

  const title = hero?.summary?.trim() || page?.title?.trim() || 'FAQ';
  const description = hero?.content?.trim() || page?.description?.trim() || FALLBACK_DESCRIPTION;
  const kicker = hero?.kicker?.trim() || hero?.title?.trim() || 'FAQ';

  return (
    <main className="w-full flex flex-col">
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">{title}</h1>
        <p className="breadcrumb-description-lock max-w-[531px]">{description}</p>
      </div>

      <ManagedFAQSection
        kicker={kicker}
        title={title}
        items={faqItems.length > 0 ? faqItems : FALLBACK_ITEMS}
        hideHeader
      />
    </main>
  );
}

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';
import { ManagedFAQSection } from '@/components/FAQ';

export const metadata: Metadata = { title: 'FAQ', alternates: { canonical: 'https://www.prag.global/faq' } };

const FALLBACK_DESCRIPTION = 'Answers to common questions about PRAG products, warranty, installation, and support.';

// General / commercial FAQs (existing approved set). Used as the "General"
// section when the CMS does not provide managed faq-items.
const GENERAL_ITEMS = [
  {
    question: 'What is the warranty period on PRAG products?',
    answer: 'All PRAG products come with a standard 5-year warranty covering manufacturing defects and component failures under normal use conditions.',
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
];

const INVERTER_ITEMS = [
  {
    question: 'What size inverter do I need?',
    answer: 'Add up the wattage of the appliances you want to run at the same time, then choose an inverter with some headroom above that total. A typical Nigerian home running lights, fans, a TV, and a fridge often lands around 1kVA–5kVA. A PRAG engineer can confirm sizing from your actual load list.',
  },
  {
    question: 'What is the difference between a hybrid inverter and a regular inverter?',
    answer: 'A hybrid inverter combines solar charging and battery backup in one unit, so you can add solar panels now or later without replacing the inverter. A regular (backup) inverter converts battery DC to AC but does not manage solar charging directly.',
  },
  {
    question: 'Which battery can I use with my inverter?',
    answer: 'PRAG inverters work with a range of battery technologies, including lithium banks for longer life and faster charging. Match the battery voltage and chemistry to the inverter’s supported profile — PRAG can confirm a compatible setup before you buy.',
  },
];

const STABILIZER_ITEMS = [
  {
    question: 'What size voltage stabilizer do I need?',
    answer: 'Capacity should match or exceed the total wattage of the equipment you are protecting, with headroom for inrush currents from motors and compressors. PRAG sizes this from your load list and measured voltage range.',
  },
  {
    question: 'What is the difference between relay, servo and thyristor stabilizers?',
    answer: 'Relay stabilizers switch between fixed voltage steps quickly and affordably — suited to typical home and office loads. Servo stabilizers use a motor for continuous, precise correction — suited to sensitive equipment. Thyristor stabilizers use solid-state switching with no moving parts for high-speed, maintenance-free precision in demanding environments.',
  },
  {
    question: 'Why do I need a voltage stabilizer?',
    answer: 'Unstable grid supply, generator switching, and load shedding can push voltage above or below safe levels. A stabilizer keeps output voltage within a safe range, helping protect appliances and equipment from damage and shortened lifespan.',
  },
];

const BATTERY_ITEMS = [
  {
    question: 'Can lithium batteries work with my inverter?',
    answer: 'In most cases yes, provided the inverter supports the battery’s voltage and lithium charging profile. PRAG can confirm compatibility between a specific inverter and lithium bank before you buy.',
  },
  {
    question: 'What is the difference between kWh and Ah?',
    answer: 'Amp-hours (Ah) measure current over time at a given battery voltage. Kilowatt-hours (kWh) measure total energy and make it easier to compare banks of different voltages. Energy (kWh) ≈ voltage × Ah ÷ 1000.',
  },
  {
    question: 'How do I choose the right battery capacity?',
    answer: 'List the appliances you want to back up, their wattage, and how many hours each should run. Multiply to get watt-hours, then choose a bank that covers that with some margin. PRAG turns this into a correctly sized bank so you avoid paying for capacity you won’t use.',
  },
];

const SOLAR_ITEMS = [
  {
    question: 'What components make up a solar power system?',
    answer: 'A complete system typically needs solar panels, a charge controller, a battery bank, and an inverter, plus cabling and protective devices. PRAG bundles these into matched kits or designs a custom system from your load profile.',
  },
  {
    question: 'What is the difference between MPPT and PWM charge controllers?',
    answer: 'PWM controllers are simpler and lower cost, suited to smaller systems where panel voltage matches battery voltage. MPPT controllers track the panel’s maximum power point and extract more energy, especially in larger or variable-condition systems.',
  },
  {
    question: 'How do I know what size solar system I need?',
    answer: 'Sizing depends on your daily energy use, available roof or ground space, and how much of your load you want solar to cover. PRAG calculates this from your appliance usage and site conditions.',
  },
];

const BUYING_ITEMS = [
  {
    question: 'How long will a battery bank power my appliances?',
    answer: 'Runtime depends on battery capacity (Ah/Wh) and your total load. A larger bank runs the same load longer. PRAG sizes the bank to the hours of backup you actually need so you avoid paying for capacity you won’t use.',
  },
  {
    question: 'Can I add solar panels to my existing inverter and battery?',
    answer: 'Often yes, if your inverter supports solar input (or you add a charge controller) and your battery can accept the extra charging current. PRAG can assess whether your current setup is expandable or needs a hybrid inverter.',
  },
  {
    question: 'Can one stabilizer protect my whole house or office?',
    answer: 'Whole-facility stabilizers exist, but whether one unit is right depends on your load size, phases, and wiring. Some setups are better served by a main stabilizer plus point-of-use protection. A site assessment gives the correct answer.',
  },
];

const SUPPORT_ITEMS = [
  {
    question: 'Do you offer installation services?',
    answer: 'Yes, PRAG offers professional installation services through our certified engineers and authorized partner network across Nigeria. Contact us or visit a PRAG store to schedule an installation.',
  },
  {
    question: 'How do I request technical support?',
    answer: 'You can request technical support by calling our support line at +2348032170129, emailing sales@prag.global, or submitting a request through the contact form.',
  },
];

// Questions that belong to the "Installation & Support" section. These are
// filtered out of the CMS-driven General set so the same question never appears
// in two sections (no duplicated FAQs).
const SUPPORT_QUESTIONS = new Set(SUPPORT_ITEMS.map((item) => item.question));

const SECTIONS = [
  { title: 'Inverters', items: INVERTER_ITEMS },
  { title: 'Voltage Stabilizers', items: STABILIZER_ITEMS },
  { title: 'Batteries', items: BATTERY_ITEMS },
  { title: 'Solar', items: SOLAR_ITEMS },
  { title: 'Buying & Product Selection', items: BUYING_ITEMS },
  { title: 'Installation & Support', items: SUPPORT_ITEMS },
];

export default async function FAQPage() {
  const content = await getB2BPublicContent();
  const page = findB2BPage(content, '/faq');
  const hero = findVisibleSectionsByType(page, 'hero')[0];
  const cmsFaqItems = findVisibleSectionsByType(page, 'faq-item')
    .map((item) => ({
      question: item.summary?.trim() || item.title?.trim() || '',
      answer: item.content?.trim() || '',
    }))
    .filter((item) => item.question && item.answer);

  const title = hero?.summary?.trim() || page?.title?.trim() || 'FAQ';
  const description = hero?.content?.trim() || page?.description?.trim() || FALLBACK_DESCRIPTION;

  // The "General" section prefers CMS-managed faq-items when present, falling
  // back to the approved static general set. Support questions are filtered out
  // so they only appear in the "Installation & Support" section (no duplicates).
  // Category sections are consolidated from the approved Step 9 FAQ material,
  // deduplicated and kept concise.
  const generalItems = (cmsFaqItems.length > 0 ? cmsFaqItems : GENERAL_ITEMS)
    .filter((item) => !SUPPORT_QUESTIONS.has(item.question));

  return (
    <main className="w-full flex flex-col">
      <div className="w-full bg-stone-50 px-6 breadcrumb-hero-shell flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">{title}</h1>
        <p className="breadcrumb-description-lock max-w-[531px]">{description}</p>
      </div>

      <ManagedFAQSection
        kicker="FAQ"
        title="General"
        items={generalItems}
        hideHeader={false}
      />

      {SECTIONS.map((section) => (
        <ManagedFAQSection
          key={section.title}
          kicker="FAQ"
          title={section.title}
          items={section.items}
          hideHeader={false}
        />
      ))}
    </main>
  );
}

/**
 * Step 9 on-page body content for solution pages.
 *
 * Each solution page gets distinct, intent-specific body sections so they do
 * not duplicate one generic paragraph. Content is rendered after the existing
 * ProblemsCarousel + solution cards, adding engineering/approach guidance,
 * contextual internal links, proof links (only where a real project exists),
 * and a clear CTA.
 *
 * Rules: no unverified factual claims; internal links point at canonical 200
 * URLs; Step 8 metadata untouched.
 */

import type { CatLink, Paragraph, Section, Faq, Segment } from '@/lib/categoryContent';
import type { PublicB2BSolutionBodyOverride } from '@/lib/b2bContent';

export type { CatLink, Paragraph, Section, Faq, Segment };

export interface SolutionBody {
  sections: Section[];
  faqs?: Faq[];
  proofLinks?: CatLink[];
  primaryCta: CatLink;
  secondaryCta?: CatLink;
}

const INV: CatLink = { label: 'PRAG inverters', href: '/products/inverters' };
const HYBRID: CatLink = { label: 'hybrid inverters', href: '/products/hybrid-inverters' };
const BATT: CatLink = { label: 'PRAG batteries', href: '/products/batteries' };
const LITH: CatLink = { label: 'PRAG lithium batteries', href: '/products/lithium-batteries' };
const SOLAR: CatLink = { label: 'solar products', href: '/products/solar' };
const PANELS: CatLink = { label: 'solar panels', href: '/products/solar-panels' };
const CTRL: CatLink = { label: 'solar charge controllers', href: '/products/solar-charge-controllers' };
const PROT: CatLink = { label: 'protective devices', href: '/products/protective-device' };
const STAB: CatLink = { label: 'PRAG voltage stabilizers', href: '/products/voltage-stabilizers' };
const RELAY: CatLink = { label: 'relay stabilizers', href: '/products/relay-voltage-stabilizers' };
const SERVO: CatLink = { label: 'servo stabilizers', href: '/products/servo-voltage-stabilizers' };
const THYR: CatLink = { label: 'thyristor stabilizers', href: '/products/thyristor-stabilizers' };
const ADV: CatLink = { label: 'advanced stabilizers', href: '/products/advanced-stabilizers' };
const RES: CatLink = { label: 'residential solutions', href: '/solutions/residential' };
const COM: CatLink = { label: 'commercial solutions', href: '/solutions/commercial' };
const IND: CatLink = { label: 'industrial solutions', href: '/solutions/industrial' };
const INSTALL: CatLink = { label: 'See a backup power installation', href: '/installations' };
const ASSESS: CatLink = { label: 'Request a backup power assessment', href: '/free-power-assessment' };

const p = (segments: Paragraph['segments']): Paragraph => ({ segments });

export const SOLUTION_BODY: Record<string, SolutionBody> = {
  'backup-power': {
    sections: [
      {
        heading: 'The Backup Power Problem in Nigeria',
        paragraphs: [
          p([
            'Frequent outages interrupt daily life and business operations, while running generators brings fuel cost, noise, and maintenance burden. A properly designed backup system delivers quiet, automatic power the moment the grid drops \u2014 without refuelling.',
          ]),
        ],
      },
      {
        heading: 'The PRAG Approach',
        paragraphs: [
          p([
            'PRAG builds backup systems around an inverter and a correctly sized battery bank, with solar added where it makes sense. The inverter converts stored DC battery power into clean AC, and the battery bank determines how long your essential loads stay powered. See ',
            INV,
            ', ',
            BATT,
            ' and ',
            LITH,
            ' for the components involved.',
          ]),
        ],
      },
      {
        heading: 'System Sizing & Backup Duration',
        paragraphs: [
          p([
            'Backup runtime depends on your total load and battery capacity. PRAG sizes the bank to the hours of backup you actually need, so you don\u2019t pay for capacity you won\u2019t use or fall short when it matters. Solar can be added to extend runtime and reduce generator use.',
          ]),
        ],
      },
      {
        heading: 'Applications',
        paragraphs: [
          p([
            'Homes keep lights, fridges, fans, and internet running through outages. Offices protect computers, networking, and point-of-sale systems. Industrial sites keep critical processes and controls alive. Explore ',
            RES,
            ', ',
            COM,
            ' and ',
            IND,
            ' for audience-specific guidance.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'What size inverter and battery do I need for backup?',
        answer:
          'It depends on the appliances you want to back up and for how long. PRAG calculates this from your load list and target runtime, then sizes the inverter and battery bank together.',
      },
      {
        question: 'How long can a backup system run?',
        answer:
          'Runtime scales with battery capacity and drops with load. A larger bank runs the same load longer; adding solar extends daytime runtime. PRAG designs to your required hours of backup.',
      },
      {
        question: 'Can solar be added to a backup system later?',
        answer:
          'Yes \u2014 especially if you start with a hybrid inverter. PRAG can design the backup system so solar panels can be added in a later phase without replacing the core equipment.',
      },
    ],
    proofLinks: [INSTALL],
    primaryCta: ASSESS,
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
  },

  'solar-energy': {
    sections: [
      {
        heading: 'Solar as a Solution',
        paragraphs: [
          p([
            'Solar energy reduces generator dependence and fuel cost by generating your own electricity from sunlight. A PRAG solar system is designed as a complete solution \u2014 not just panels \u2014 with sizing, installation, and support included.',
          ]),
        ],
      },
      {
        heading: 'Design & Installation Process',
        paragraphs: [
          p([
            'PRAG follows a clear process: site assessment, system design, professional installation, and ongoing support. We size the array and battery bank to your actual usage so the system covers the load you care about.',
          ]),
        ],
      },
      {
        heading: 'System Components',
        paragraphs: [
          p([
            'A complete solar system combines ',
            PANELS,
            ', ',
            CTRL,
            ', ',
            HYBRID,
            ' or a compatible inverter, ',
            LITH,
            ' storage, and ',
            PROT,
            '. Browse the individual components in ',
            SOLAR,
            ' if you prefer to assemble a system yourself.',
          ]),
        ],
      },
      {
        heading: 'Residential, Commercial & Industrial Applications',
        paragraphs: [
          p([
            'Homes reduce fuel bills and gain quieter power. Businesses lower operating costs and reduce downtime. Industrial sites offset heavy daytime loads. See ',
            RES,
            ', ',
            COM,
            ' and ',
            IND,
            ' for audience-specific design.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'How much solar do I need to run my home?',
        answer:
          'It depends on your daily energy use and how much of it you want solar to cover. PRAG sizes the array and battery from your appliance usage and site conditions.',
      },
      {
        question: 'Can solar eliminate generator use?',
        answer:
          'A well-sized solar-battery system can eliminate or drastically reduce generator use for most loads. The result depends on your load profile, available roof space, and budget.',
      },
      {
        question: 'What does a PRAG solar installation include?',
        answer:
          'Site assessment, system design, panels, charge controller, inverter, battery storage, protective devices, cabling, installation, and commissioning \u2014 plus ongoing support.',
      },
    ],
    proofLinks: [{ label: 'See solar energy installations', href: '/installations' }],
    primaryCta: { label: 'Get a free solar assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Solar Engineer', href: '/contact' },
  },

  'voltage-stabilization-protection': {
    sections: [
      {
        heading: 'Voltage Fluctuation as a Nigerian Problem',
        paragraphs: [
          p([
            'High, low, and fluctuating voltage damages appliances and equipment, shortens lifespan, and causes unplanned downtime. For businesses and households on unstable supply or generator networks, voltage stabilization is a protection investment, not an optional extra.',
          ]),
        ],
      },
      {
        heading: 'Engineering Approach',
        paragraphs: [
          p([
            'PRAG starts with a site survey and load analysis, then specifies the right stabilizer technology and capacity for each circuit or facility. The goal is stable, safe voltage matched to your real load profile \u2014 not a generic unit.',
          ]),
        ],
      },
      {
        heading: 'Types Deployed',
        paragraphs: [
          p([
            'PRAG deploys ',
            RELAY,
            ', ',
            SERVO,
            ', ',
            THYR,
            ' and ',
            ADV,
            ' depending on the load sensitivity and environment. See ',
            STAB,
            ' for the full range.',
          ]),
        ],
      },
      {
        heading: 'Facility-Wide vs Equipment-Level Protection',
        paragraphs: [
          p([
            'Some sites need a main stabilizer for the whole facility; others are better served by point-of-use protection on sensitive equipment. PRAG advises which combination is right for your site and budget.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I know if my facility needs voltage stabilization?',
        answer:
          'If you see flickering lights, appliances failing early, or measured voltage outside the safe range, your facility likely needs stabilization. A PRAG site survey confirms it and specifies the right unit.',
      },
      {
        question: 'What stabilizer capacity is right for a factory?',
        answer:
          'Factory sizing depends on total load, motor inrush currents, and phase requirements. PRAG sizes industrial stabilizers from a measured load profile rather than a nameplate estimate.',
      },
    ],
    proofLinks: [{ label: 'See voltage stabilization projects', href: '/installations' }],
    primaryCta: { label: 'Request a site assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
  },

  residential: {
    sections: [
      {
        heading: 'How PRAG Designs Home Power Systems',
        paragraphs: [
          p([
            'PRAG designs residential systems around your actual household usage \u2014 the appliances you want to run, for how long, and whether you want solar now or later. The result is a matched setup of ',
            INV,
            ', ',
            LITH,
            ' and ',
            STAB,
            ' sized for your home, not a generic bundle.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the best backup power system for a Nigerian home?',
        answer:
          'The best system depends on your essential loads and runtime needs. A PRAG assessment identifies the right inverter capacity, battery bank, and whether solar or stabilization should be included.',
      },
      {
        question: 'How much does a home solar system cost?',
        answer:
          'Cost depends on system size, battery capacity, and whether it includes backup. PRAG quotes from your actual load profile after a free assessment.',
      },
    ],
    proofLinks: [{ label: 'See a residential installation', href: '/installations' }],
    primaryCta: { label: 'Request a home power assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
  },

  commercial: {
    sections: [
      {
        heading: 'Power for Growing Businesses',
        paragraphs: [
          p([
            'PRAG commercial systems keep offices, retail, and service businesses running through outages and unstable voltage. Designs combine ',
            INV,
            ', ',
            SOLAR,
            ' and ',
            STAB,
            ' to protect productivity, equipment, and customer experience.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I protect business equipment from voltage fluctuations?',
        answer:
          'A correctly sized voltage stabilizer protects sensitive business equipment. PRAG specifies the right technology and capacity after a site assessment.',
      },
      {
        question: 'Can a commercial building run entirely on solar?',
        answer:
          'Partial solar is common and cost-effective; full solar independence depends on roof space, load profile, and battery budget. PRAG models the options during a free assessment.',
      },
    ],
    proofLinks: [{ label: 'See commercial installations', href: '/installations' }],
    primaryCta: { label: 'Request a power assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
  },

  industrial: {
    sections: [
      {
        heading: 'Engineered Power for Heavy-Duty Operations',
        paragraphs: [
          p([
            'PRAG industrial systems are engineered for continuous, critical loads \u2014 production lines, motors, controls, and infrastructure that cannot tolerate downtime. Designs combine ',
            STAB,
            ', ',
            SOLAR,
            ' and heavy-duty power equipment sized to your facility\u2019s operational requirements.',
          ]),
        ],
      },
    ],
    faqs: [
      {
        question: 'What power-quality problems do factories face?',
        answer:
          'Voltage fluctuations, surges, outages, and harmonic issues. These cause equipment damage, downtime, and quality defects. PRAG diagnoses and specifies the right stabilization and backup.',
      },
      {
        question: 'How is an industrial stabilizer sized?',
        answer:
          'From the measured load profile, including motor inrush currents and phase requirements, rather than a nameplate estimate. PRAG performs a site survey to size correctly.',
      },
    ],
    proofLinks: [{ label: 'See industrial installations', href: '/installations' }],
    primaryCta: { label: 'Talk to an industrial engineer', href: '/free-power-assessment' },
    secondaryCta: { label: 'Contact PRAG', href: '/contact' },
  },
};

export function getSolutionBody(slug: string, adminOverride?: PublicB2BSolutionBodyOverride | null): SolutionBody | undefined {
  const fallback = SOLUTION_BODY[slug];
  if (!adminOverride || (!adminOverride.sections?.length && !adminOverride.faqs?.length)) {
    return fallback;
  }

  // Start from fallback to preserve proofLinks and CTAs (which stay hardcoded)
  const base: SolutionBody = fallback ?? {
    sections: [],
    primaryCta: { label: 'Request a power assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
  };

  // Override sections if admin has any
  const sections: Section[] = (adminOverride.sections ?? []).map((s) => ({
    id: s.id,
    heading: s.heading,
    paragraphs: [{ segments: [s.body] }],
    list: s.list,
  }));

  // Override FAQs if admin has any
  const faqs: Faq[] = (adminOverride.faqs ?? []).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return {
    ...base,
    sections: sections.length > 0 ? sections : base.sections,
    faqs: faqs.length > 0 ? faqs : base.faqs,
  };
}

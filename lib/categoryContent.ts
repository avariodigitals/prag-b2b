/**
 * Step 9 on-page content for product category pages.
 *
 * This content is rendered by app/products/[category]/page.tsx between the
 * hero and the product grid (and after the grid for FAQs + CTA) so that useful
 * guidance is integrated into the page UX rather than appended as an SEO block.
 *
 * Rules followed:
 *  - Factual marketing claims (founded year, installation counts, customer counts,
 *    states covered, "leading provider", "trusted by thousands") are managed
 *    centrally per docs/STEP9_FACT_CLAIM_RECONCILIATION.md and are NOT inserted
 *    into category/solution body copy (they live on About, Homepage, and metadata).
 *  - Step 7 keyword ownership preserved (no title/meta changes here).
 *  - Each page has exactly one H1 (overridden here for the 4 core pages whose
 *    CMS hero summary produced a generic/ambiguous H1).
 *  - Internal links point directly at canonical 200 URLs (never at
 *    /products/all-prag-stabilizers).
 *  - Distinct intent between parent category, subcategory, and solution pages.
 */

export interface CatLink {
  label: string;
  href: string;
}

/** A paragraph is a sequence of text runs; a run is either plain text or a link. */
export type Segment = string | CatLink;

export interface Paragraph {
  segments: Segment[];
}

export interface Section {
  id?: string;
  heading: string;
  paragraphs?: Paragraph[];
  list?: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CategoryContent {
  /** Overrides the generic CMS/fallback H1 for this category. */
  h1: string;
  /** Concise intent-specific introduction shown directly under the H1. */
  intro: string;
  /** Quick category/type navigation chips shown above the grid. */
  quickNav?: CatLink[];
  /** Body sections (H2 + paragraphs/lists) shown above the grid. */
  sections: Section[];
  /** 3–6 FAQs shown after the grid. */
  faqs: Faq[];
  /** One clear primary CTA shown after the FAQs. */
  primaryCta: CatLink;
  /** Optional secondary CTA. */
  secondaryCta?: CatLink;
  /** Contextual proof links — only where a real relevant project exists. */
  proofLinks?: CatLink[];
}

const INV: CatLink = { label: 'inverters', href: '/products/inverters' };
const HYBRID: CatLink = { label: 'hybrid inverters', href: '/products/hybrid-inverters' };
const HEAVY: CatLink = { label: 'heavy-duty inverters', href: '/products/heavy-duty-inverters' };
const BATT: CatLink = { label: 'PRAG batteries', href: '/products/batteries' };
const LITH: CatLink = { label: 'PRAG lithium batteries', href: '/products/lithium-batteries' };
const SOLAR: CatLink = { label: 'solar products', href: '/products/solar' };
const PANELS: CatLink = { label: 'PRAG solar panels', href: '/products/solar-panels' };
const CTRL: CatLink = { label: 'solar charge controllers', href: '/products/solar-charge-controllers' };
const PROT: CatLink = { label: 'protective devices', href: '/products/protective-device' };
const STAB: CatLink = { label: 'voltage stabilizers', href: '/products/voltage-stabilizers' };
const RELAY: CatLink = { label: 'relay voltage stabilizers', href: '/products/relay-voltage-stabilizers' };
const SERVO: CatLink = { label: 'servo voltage stabilizers', href: '/products/servo-voltage-stabilizers' };
const THYR: CatLink = { label: 'thyristor stabilizers', href: '/products/thyristor-stabilizers' };
const ADV: CatLink = { label: 'advanced stabilizers', href: '/products/advanced-stabilizers' };
const BACKUP: CatLink = { label: 'backup power solutions', href: '/solutions/backup-power' };
const SOLARE: CatLink = { label: 'solar energy solutions', href: '/solutions/solar-energy' };
const VSP: CatLink = { label: 'voltage stabilization solutions', href: '/solutions/voltage-stabilization-protection' };
const RES: CatLink = { label: 'residential solutions', href: '/solutions/residential' };
const COM: CatLink = { label: 'commercial solutions', href: '/solutions/commercial' };
const IND: CatLink = { label: 'industrial solutions', href: '/solutions/industrial' };
const INSTALL: CatLink = { label: 'See PRAG installations', href: '/installations' };
const ASSESS: CatLink = { label: 'Request a free power assessment', href: '/free-power-assessment' };

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  // ───────────────────────── Tier 1: core commercial pages ─────────────────────────

  inverters: {
    h1: 'Inverters Built for Nigerian Power Conditions',
    intro:
      'PRAG inverters convert stored DC battery power into clean, stable AC electricity for homes, offices, and industrial facilities. Designed for Nigeria\u2019s unreliable grid, they keep essential appliances and equipment running through outages and voltage fluctuations \u2014 whether paired with batteries, solar panels, or the grid.',
    quickNav: [HYBRID, HEAVY, LITH],
    sections: [
      {
        heading: 'Inverter Options from PRAG',
        paragraphs: [
          {
            segments: [
              'Browse ',
              HYBRID,
              ' that combine solar charging with battery backup, ',
              HEAVY,
              ' for continuous commercial and industrial loads, and standard backup inverters that protect homes during outages. The right choice depends on your total load, backup duration, and whether solar will be added now or later.',
            ],
          },
        ],
      },
      {
        heading: 'What Is an Inverter and Where Is It Used?',
        paragraphs: [
          {
            segments: [
              'An inverter changes DC battery power into AC power for everyday appliances. In Nigeria, it is used for lights, fans, TVs, computers, fridges, pumps, and production equipment when grid power fails. The right inverter depends on your total load and how long you need backup.',
            ],
          },
        ],
      },
      {
        heading: 'Which Inverter Suits a Home or Business?',
        paragraphs: [
          {
            segments: [
              'Home users typically need 1kVA\u20135kVA systems for lights, fans, TVs, and fridges. Offices and shops often need 3kVA\u201310kVA. Factories and plants use heavy-duty units sized to protect critical equipment and avoid downtime. Not sure what size you need? Talk to a PRAG engineer.',
            ],
          },
        ],
      },
      {
        heading: 'Inverter + Battery Compatibility',
        paragraphs: [
          {
            segments: [
              'PRAG inverters work with a range of battery technologies. For longer life and faster charging, lithium battery banks are a strong match. See ',
              LITH,
              ' and the broader ',
              BATT,
              ' range to plan a compatible bank.',
            ],
          },
        ],
      },
      {
        heading: 'Why Choose PRAG Inverters?',
        list: [
          'Engineered for Nigerian grid conditions',
          'Pure sine wave output for sensitive electronics',
          'Hybrid, heavy-duty, and backup options in one catalogue',
          'Supported by local technical support and installation services',
        ],
      },
      {
        heading: 'Related Solutions',
        paragraphs: [
          {
            segments: [
              'For complete systems, explore PRAG ',
              BACKUP,
              ' and ',
              SOLARE,
              '.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What size inverter do I need for my home?',
        answer:
          'Add up the wattage of the appliances you want to run at the same time, then choose an inverter with some headroom above that total. A typical Nigerian home running lights, fans, a TV, and a fridge often lands around 1kVA\u20135kVA. A PRAG engineer can confirm sizing from your actual load list.',
      },
      {
        question: 'What is the difference between hybrid and heavy-duty inverters?',
        answer:
          'Hybrid inverters combine solar charging and battery backup in one unit, ideal when you want to add panels now or later. Heavy-duty inverters are built for continuous commercial and industrial loads where reliability and runtime matter more than solar integration.',
      },
      {
        question: 'Can PRAG inverters work with lithium batteries?',
        answer:
          'Yes. PRAG inverters are compatible with lithium battery banks, which offer longer cycle life and faster charging than traditional options. Check the inverter\u2019s battery voltage and chemistry support, or ask PRAG to confirm a matched setup.',
      },
      {
        question: 'How long will a battery bank power my appliances?',
        answer:
          'Runtime depends on battery capacity (Ah/Wh) and your total load. A larger bank runs the same load longer. PRAG sizes the bank to the hours of backup you actually need so you avoid paying for capacity you won\u2019t use.',
      },
    ],
    primaryCta: { label: 'Find the Right Inverter', href: '/free-power-assessment' },
    secondaryCta: { label: 'Talk to a PRAG Engineer', href: '/contact' },
    proofLinks: [INSTALL],
  },

  'voltage-stabilizers': {
    h1: 'Voltage Stabilizers for Homes, Businesses & Industry',
    intro:
      'PRAG voltage stabilizers protect appliances and equipment from the high, low, and fluctuating voltage common across Nigerian power networks. By keeping output voltage within a safe range, they help extend equipment life, reduce repairs, and keep operations running smoothly.',
    quickNav: [RELAY, SERVO, THYR, ADV],
    sections: [
      {
        heading: 'Why Voltage Stabilization Matters in Nigeria',
        paragraphs: [
          {
            segments: [
              'Unstable grid supply, generator switching, and load shedding can push voltage well above or below safe levels. Air conditioners, fridges, pumps, medical equipment, and CNC machines can suffer damage or shortened lifespan without stable voltage.',
            ],
          },
        ],
      },
      {
        id: 'types',
        heading: 'Types of Voltage Stabilizers Available',
        list: [
          'Relay stabilizers \u2014 fast, cost-effective protection for homes and offices.',
          'Servo stabilizers \u2014 precise, continuous correction for sensitive and high-value equipment.',
          'Thyristor stabilizers \u2014 maintenance-free, solid-state precision for demanding environments.',
          'Advanced stabilizers \u2014 modern voltage protection with enhanced control features.',
        ],
      },
      {
        heading: 'Residential, Commercial & Industrial Use',
        paragraphs: [
          {
            segments: [
              'Home users protect fridges, TVs, and air conditioners. Offices protect servers, printers, and POS systems. Industrial users protect motors, VFDs, CNC machines, and production lines. Explore ',
              RES,
              ', ',
              COM,
              ' and ',
              IND,
              ' for system-level guidance.',
            ],
          },
        ],
      },
      {
        heading: 'How to Choose the Right Stabilizer',
        paragraphs: [
          {
            segments: [
              'Capacity, input voltage range, load type, and response speed all matter. PRAG engineers can help you size a stabilizer to your actual load profile rather than guessing. Compare the four types above to narrow down the right technology.',
            ],
          },
        ],
      },
      {
        heading: 'Related Solutions',
        paragraphs: [
          {
            segments: ['For facility-wide voltage protection, see our ', VSP, '.'],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between relay and servo stabilizers?',
        answer:
          'Relay stabilizers switch between fixed voltage steps quickly and affordably, suiting typical home and office loads. Servo stabilizers use a motor-driven correction for continuous, precise output, suiting sensitive or high-value equipment.',
      },
      {
        question: 'What stabilizer capacity do I need?',
        answer:
          'Capacity should match or exceed the total wattage of the equipment you are protecting, with headroom for inrush currents from motors and compressors. PRAG can size this from your load list and measured voltage range.',
      },
      {
        question: 'Can one stabilizer protect my whole house or office?',
        answer:
          'Whole-facility stabilizers exist, but whether one unit is right depends on your load size, phases, and wiring. Some setups are better served by a main stabilizer plus point-of-use protection. A site assessment gives the correct answer.',
      },
      {
        question: 'Why do my appliances keep failing despite using a stabilizer?',
        answer:
          'Common causes include an undersized stabilizer, a unit with too narrow an input voltage range for your location, or surges rather than steady voltage issues. PRAG can diagnose whether you need a higher-capacity unit, a wider input range, or surge protection.',
      },
    ],
    primaryCta: { label: 'Request a Stabilizer Assessment', href: '/free-power-assessment' },
    secondaryCta: { label: 'Compare Stabilizer Types', href: '#types' },
    proofLinks: [INSTALL],
  },

  batteries: {
    h1: 'Reliable Batteries for Inverter, Solar & Backup Systems',
    intro:
      'PRAG batteries store the energy that keeps your home, business, or facility running when grid power is unavailable. Whether used with an inverter, a solar charge controller, or a complete backup system, the right battery bank determines how long your essential loads stay powered.',
    quickNav: [LITH, INV, SOLAR],
    sections: [
      {
        heading: 'How PRAG Batteries Are Used',
        paragraphs: [
          {
            segments: [
              'Inverters draw DC power from batteries and convert it to AC for appliances. Solar systems use batteries to store energy generated during the day for use at night. Backup systems rely on batteries to bridge the gap during outages.',
            ],
          },
        ],
      },
      {
        heading: 'Battery Technologies',
        paragraphs: [
          {
            segments: [
              'PRAG offers ',
              LITH,
              ' for longer cycle life, faster charging, and lighter weight, as well as traditional options suited to different budgets and use cases. The right chemistry depends on your runtime needs, budget, and maintenance preference.',
            ],
          },
        ],
      },
      {
        heading: 'Capacity & Sizing',
        paragraphs: [
          {
            segments: [
              'Battery capacity is measured in amp-hours (Ah) or watt-hours (Wh). The right size depends on the load you need to support and how many hours of backup you require. Oversizing wastes budget; undersizing leaves you in the dark.',
            ],
          },
        ],
      },
      {
        heading: 'Compatibility Considerations',
        paragraphs: [
          {
            segments: [
              'Battery voltage and chemistry must match the inverter or solar charge controller. PRAG systems are designed so that inverter, battery, and solar components work together correctly. Pair your bank with a ',
              INV,
              ' or ',
              SOLAR,
              ' setup for a matched system.',
            ],
          },
        ],
      },
      {
        heading: 'Related Products & Solutions',
        paragraphs: [
          {
            segments: [
              'See ',
              BACKUP,
              ' and ',
              SOLARE,
              ' for complete system design and installation.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can lithium batteries work with my inverter?',
        answer:
          'In most cases yes, provided the inverter supports the battery\u2019s voltage and lithium charging profile. PRAG can confirm compatibility between a specific inverter and lithium bank before you buy.',
      },
      {
        question: 'How do I size a battery bank for my home?',
        answer:
          'List the appliances you want to back up, their wattage, and how many hours each should run. Multiply to get watt-hours, then choose a bank that covers that with some margin. PRAG turns this into a correctly sized bank.',
      },
      {
        question: 'What battery voltage do I need for a 5kVA inverter?',
        answer:
          'Most 5kVA inverters use a 48V battery bank, but some models differ. Always confirm the inverter\u2019s nominal DC voltage before buying batteries, and match the bank configuration accordingly.',
      },
      {
        question: 'How does backup time change with more batteries?',
        answer:
          'Adding batteries increases total stored energy, so the same load runs longer. Backup time scales roughly with total Ah/Wh, assuming the inverter and charging source can keep up.',
      },
    ],
    primaryCta: { label: 'Find the Right Battery', href: '/free-power-assessment' },
    secondaryCta: { label: 'Explore Lithium Batteries', href: '/products/lithium-batteries' },
    proofLinks: [INSTALL],
  },

  solar: {
    h1: 'Solar Products & Equipment for Nigerian Homes & Businesses',
    intro:
      'PRAG solar products give you the components you need to generate, control, store, and protect solar power. From high-efficiency panels to charge controllers, protective devices, compatible batteries, and inverters, every product is selected to work together in Nigerian conditions.',
    quickNav: [PANELS, CTRL, PROT, LITH, HYBRID],
    sections: [
      {
        heading: 'Solar Panels',
        paragraphs: [
          {
            segments: [
              'Convert sunlight into DC electricity. PRAG panels are chosen for efficiency and durability in high-temperature, high-humidity environments. See ',
              PANELS,
              '.',
            ],
          },
        ],
      },
      {
        heading: 'Solar Charge Controllers',
        paragraphs: [
          {
            segments: [
              'Controllers regulate power from panels to batteries, helping prevent overcharging and extending battery life. See ',
              CTRL,
              '.',
            ],
          },
        ],
      },
      {
        heading: 'Protective Devices',
        paragraphs: [
          {
            segments: [
              'Surge protectors and safety devices protect your solar and power systems from lightning, surges, and faults. See ',
              PROT,
              '.',
            ],
          },
        ],
      },
      {
        heading: 'Compatible Storage & Inverters',
        paragraphs: [
          {
            segments: [
              'Solar panels need a controller, a battery, and an inverter to deliver usable AC power. PRAG offers ',
              LITH,
              ' and ',
              HYBRID,
              ' designed for solar-battery integration.',
            ],
          },
        ],
      },
      {
        heading: 'Need a Complete Designed & Installed Solar System?',
        paragraphs: [
          {
            segments: [
              'If you need system design, sizing, and installation rather than individual products, explore PRAG ',
              SOLARE,
              '.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What do I need for a complete solar power system?',
        answer:
          'A complete system typically needs solar panels, a charge controller, a battery bank, and an inverter, plus cabling and protective devices. PRAG bundles these into matched kits or designs a custom system from your load profile.',
      },
      {
        question: 'What size solar panel system do I need?',
        answer:
          'Sizing depends on your daily energy use, available roof space, and how much of your load you want solar to cover. PRAG calculates this from your appliance usage and site conditions.',
      },
      {
        question: 'What is the difference between MPPT and PWM charge controllers?',
        answer:
          'PWM controllers are simpler and lower cost, suited to smaller systems where panel voltage matches battery voltage. MPPT controllers track the panel\u2019s maximum power point and extract more energy, especially in larger or variable-condition systems.',
      },
      {
        question: 'Can I add solar panels to my existing inverter and battery?',
        answer:
          'Often yes, if your inverter supports solar input (or you add a charge controller) and your battery can accept the extra charging current. PRAG can assess whether your current setup is expandable or needs a hybrid inverter.',
      },
    ],
    primaryCta: { label: 'Talk to a PRAG Solar Engineer', href: '/contact' },
    secondaryCta: { label: 'View Solar Installations', href: '/installations' },
    proofLinks: [INSTALL],
  },

  // ───────────────────────── Tier 2: subcategory pages ─────────────────────────
  // Lighter scope: intro + 1\u20132 guidance sections + cross-links + 1\u20132 FAQs + CTA.

  'hybrid-inverters': {
    h1: 'Hybrid Inverters: Solar + Battery Backup in One Unit',
    intro:
      'PRAG hybrid inverters combine solar charging and battery backup in a single unit, so you can generate, store, and use solar power without separate charge-controller and inverter boxes.',
    quickNav: [INV, PANELS, LITH, SOLAR],
    sections: [
      {
        heading: 'When to Choose a Hybrid Inverter',
        paragraphs: [
          {
            segments: [
              'A hybrid inverter is the right choice when you want solar and battery backup together \u2014 it manages panel charging, battery state, and AC output in one device. It also lets you add solar panels later without replacing the inverter. Compare with the broader ',
              INV,
              ' range and pair with ',
              PANELS,
              ' and ',
              LITH,
              ' for a complete system.',
            ],
          },
        ],
      },
      {
        heading: 'Related Solutions',
        paragraphs: [
          { segments: ['See PRAG ', SOLARE, ' for full design and installation.'] },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a hybrid inverter?',
        answer:
          'A hybrid inverter integrates solar charge control, battery management, and DC-to-AC inversion in one unit, simplifying solar-battery systems compared to using separate devices.',
      },
      {
        question: 'Can a hybrid inverter work without solar panels?',
        answer:
          'Yes. A hybrid inverter can run as a battery backup inverter and have solar panels added later, which makes it a flexible starting point if you want to phase in solar.',
      },
    ],
    primaryCta: { label: 'Explore Hybrid Inverters', href: '/products/hybrid-inverters' },
    secondaryCta: ASSESS,
  },

  'heavy-duty-inverters': {
    h1: 'Heavy-Duty Inverters for Continuous Commercial & Industrial Loads',
    intro:
      'PRAG heavy-duty inverters are built for demanding, continuous loads where downtime is not an option \u2014 factories, plants, telecom sites, and large commercial facilities.',
    quickNav: [INV, IND, COM],
    sections: [
      {
        heading: 'When You Need a Heavy-Duty Inverter',
        paragraphs: [
          {
            segments: [
              'Choose a heavy-duty inverter when loads are large, runtime requirements are long, and equipment cannot tolerate interruptions. These units are sized and protected for continuous duty, unlike residential backup inverters. See the parent ',
              INV,
              ' category and the ',
              IND,
              ' and ',
              COM,
              ' solution pages for system context.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'When do I need a heavy-duty inverter?',
        answer:
          'When your load is large or must run continuously \u2014 motors, production lines, servers, or critical infrastructure. PRAG sizes heavy-duty units to your actual operational load and required runtime.',
      },
    ],
    primaryCta: { label: 'Explore Heavy-Duty Inverters', href: '/products/heavy-duty-inverters' },
    secondaryCta: ASSESS,
  },

  'relay-voltage-stabilizers': {
    h1: 'Relay Voltage Stabilizers: Fast, Affordable Protection',
    intro:
      'PRAG relay voltage stabilizers switch between fixed voltage steps to correct high and low voltage quickly and cost-effectively \u2014 a practical choice for homes and offices.',
    quickNav: [STAB, SERVO, VSP, RES],
    sections: [
      {
        heading: 'How Relay Stabilizers Work',
        paragraphs: [
          {
            segments: [
              'Relay stabilizers detect output voltage and switch taps on a transformer to bring it back into range. Correction is fast and the design is affordable, making it well suited to typical home and office loads. For sensitive or high-value equipment, compare ',
              SERVO,
              '. See the parent ',
              STAB,
              ' category for the full range.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'How fast is relay stabilizer correction?',
        answer:
          'Relay stabilizers correct within a fraction of a second by switching voltage steps. This is fast enough for most household and office appliances, though not as continuous as servo correction.',
      },
      {
        question: 'Is a relay stabilizer enough for my home?',
        answer:
          'For fridges, TVs, air conditioners, and similar loads, a correctly sized relay stabilizer is usually sufficient. If you run sensitive medical or lab equipment, consider a servo stabilizer instead.',
      },
    ],
    primaryCta: { label: 'Explore Relay Stabilizers', href: '/products/relay-voltage-stabilizers' },
    secondaryCta: ASSESS,
  },

  'servo-voltage-stabilizers': {
    h1: 'Servo Voltage Stabilizers: Precise Correction for Sensitive Equipment',
    intro:
      'PRAG servo voltage stabilizers use a motor-driven correction to deliver continuous, precise output voltage \u2014 ideal for sensitive medical, lab, IT, and industrial control equipment.',
    quickNav: [STAB, THYR, COM, IND],
    sections: [
      {
        heading: 'Why Choose a Servo Stabilizer',
        paragraphs: [
          {
            segments: [
              'A servo stabilizer adjusts voltage continuously rather than in steps, holding output tight around the set point. This suits equipment that cannot tolerate voltage steps or drift. Compare with ',
              THYR,
              ' for maintenance-free solid-state correction, and see the parent ',
              STAB,
              ' category.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Servo vs relay stabilizer: which is better?',
        answer:
          'Servo gives smoother, more precise correction for sensitive equipment; relay is faster and cheaper for typical household loads. Choose by the sensitivity of what you are protecting.',
      },
    ],
    primaryCta: { label: 'Explore Servo Stabilizers', href: '/products/servo-voltage-stabilizers' },
    secondaryCta: ASSESS,
  },

  'thyristor-stabilizers': {
    h1: 'Thyristor Stabilizers: Maintenance-Free, High-Precision Power',
    intro:
      'PRAG thyristor stabilizers use solid-state switching with no moving parts for high-speed, maintenance-free voltage correction in demanding industrial and healthcare environments.',
    quickNav: [STAB, SERVO, IND, VSP],
    sections: [
      {
        heading: 'Why Choose a Thyristor Stabilizer',
        paragraphs: [
          {
            segments: [
              'With no motor or mechanical contacts, thyristor stabilizers correct voltage at high speed with minimal maintenance, making them well suited to industrial and healthcare sites that need reliability and precision. Compare with ',
              SERVO,
              ' and see the parent ',
              STAB,
              ' category.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Are thyristor stabilizers better than servo?',
        answer:
          'Thyristor units offer faster, maintenance-free correction with no moving parts, while servo units are typically lower cost for similar precision. For critical, continuous-duty sites, thyristor is often preferred; PRAG can advise based on your load and budget.',
      },
    ],
    primaryCta: { label: 'Explore Thyristor Stabilizers', href: '/products/thyristor-stabilizers' },
    secondaryCta: ASSESS,
  },

  'advanced-stabilizers': {
    h1: 'Advanced Stabilizers with Modern Voltage Protection',
    intro:
      'PRAG advanced stabilizers bring modern control and protection features to voltage stabilization \u2014 smart monitoring, enhanced regulation, and application-aware protection.',
    quickNav: [STAB, COM, IND],
    sections: [
      {
        heading: 'What Makes an Advanced Stabilizer Different',
        paragraphs: [
          {
            segments: [
              'Advanced stabilizers add control and monitoring features beyond basic voltage correction, suiting facilities that want tighter management of power quality. Compare with relay, servo, and thyristor options in the parent ',
              STAB,
              ' category to find the right technology.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What makes an advanced stabilizer different?',
        answer:
          'Enhanced control, monitoring, and protection features that go beyond step or continuous correction \u2014 useful where you need visibility into power quality and tighter regulation than a basic stabilizer offers.',
      },
    ],
    primaryCta: { label: 'Explore Advanced Stabilizers', href: '/products/advanced-stabilizers' },
    secondaryCta: ASSESS,
  },

  'lithium-batteries': {
    h1: 'Lithium Batteries for Inverter & Solar Storage',
    intro:
      'PRAG lithium batteries offer longer cycle life, faster charging, and lighter weight than traditional options \u2014 a strong match for inverter and solar storage where space, runtime, and low maintenance matter.',
    quickNav: [BATT, INV, HYBRID, SOLAR],
    sections: [
      {
        heading: 'Why Choose Lithium',
        paragraphs: [
          {
            segments: [
              'Lithium batteries (typically LiFePO4 chemistry) deliver more usable capacity per unit, charge faster, and last more cycles than traditional lead-acid banks. They pair well with ',
              INV,
              ' and ',
              HYBRID,
              ' systems. See the parent ',
              BATT,
              ' category for the full storage range.',
            ],
          },
        ],
      },
      {
        heading: 'Related Solutions',
        paragraphs: [
          { segments: ['See ', BACKUP, ' and ', SOLARE, ' for complete systems.'] },
        ],
      },
    ],
    faqs: [
      {
        question: 'Can lithium batteries work with my inverter?',
        answer:
          'Usually yes, if the inverter supports the battery\u2019s voltage and lithium charging profile. PRAG confirms compatibility before you buy.',
      },
      {
        question: 'Why choose lithium over other batteries?',
        answer:
          'Longer cycle life, faster charging, lighter weight, and higher usable capacity. The upfront cost is higher, but lifetime cost per cycle is typically lower.',
      },
    ],
    primaryCta: { label: 'Explore Lithium Batteries', href: '/products/lithium-batteries' },
    secondaryCta: ASSESS,
  },

  'solar-panels': {
    h1: 'High-Efficiency Solar Panels in Nigeria',
    intro:
      'PRAG solar panels are selected for efficiency and durability in Nigerian heat and humidity, giving you reliable DC generation for residential and commercial solar systems.',
    quickNav: [SOLAR, CTRL, LITH, SOLARE],
    sections: [
      {
        heading: 'Choosing Solar Panels',
        paragraphs: [
          {
            segments: [
              'Panel choice depends on available roof or ground space, daily energy need, and budget. Higher-efficiency panels produce more per square metre, which matters when space is limited. Pair panels with ',
              CTRL,
              ' and ',
              LITH,
              ' storage; see the parent ',
              SOLAR,
              ' category for the full equipment range.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What size solar panel do I need?',
        answer:
          'It depends on your daily energy use and available space. PRAG sizes the array from your appliance usage and site conditions so the panels cover your target load.',
      },
    ],
    primaryCta: { label: 'Explore Solar Panels', href: '/products/solar-panels' },
    secondaryCta: ASSESS,
  },

  'solar-charge-controllers': {
    h1: 'Solar Charge Controllers: MPPT & PWM Options',
    intro:
      'PRAG solar charge controllers regulate power from your panels to your battery bank, preventing overcharging and helping extend battery life.',
    quickNav: [PANELS, LITH, SOLAR],
    sections: [
      {
        heading: 'MPPT vs PWM',
        paragraphs: [
          {
            segments: [
              'PWM controllers are simpler and lower cost, suited to smaller systems where panel voltage matches battery voltage. MPPT controllers extract more energy by tracking the panel\u2019s maximum power point, especially valuable in larger systems or variable conditions. Pair with ',
              PANELS,
              ' and ',
              LITH,
              '; see ',
              SOLAR,
              ' for the full range.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'MPPT vs PWM: which should I choose?',
        answer:
          'Choose MPPT for larger systems or where conditions vary, since it extracts more energy. PWM is fine for small, simple systems where cost matters more than maximum yield.',
      },
    ],
    primaryCta: { label: 'Explore Charge Controllers', href: '/products/solar-charge-controllers' },
    secondaryCta: ASSESS,
  },

  'protective-device': {
    h1: 'Protective Devices for Solar & Power Systems',
    intro:
      'PRAG protective devices guard your solar and power systems against lightning, surges, and faults \u2014 helping prevent damage to panels, inverters, batteries, and connected equipment.',
    quickNav: [SOLAR, STAB, SOLARE],
    sections: [
      {
        heading: 'Where Protection Matters',
        paragraphs: [
          {
            segments: [
              'Surge protection should be installed at key points: between panels and the controller, between the controller/inverter and the battery, and at the AC distribution point. Pair protection with ',
              SOLAR,
              ' and ',
              STAB,
              ' systems so the whole installation is covered.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do I need a surge protector for solar?',
        answer:
          'Lightning and grid surges can travel into panels, controllers, and inverters and damage them. A correctly placed surge protector diverts that energy away from expensive components.',
      },
    ],
    primaryCta: { label: 'Explore Protective Devices', href: '/products/protective-device' },
    secondaryCta: ASSESS,
  },
};

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT[slug];
}

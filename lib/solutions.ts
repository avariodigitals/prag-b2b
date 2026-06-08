import { getProducts, searchProducts } from '@/lib/woocommerce';
import { getB2BPublicContent } from '@/lib/b2bContent';

export type SolutionCategoryKey = 'residential' | 'commercial' | 'industrial' | 'voltage-stabilization-protection' | 'backup-power' | 'solar-energy';

export interface SolutionProblem {
  id: string;
  title: string;
  body: string;
  impact: string[];
  solution: string[];
  image: string;
  technologies: string[];
  productIds?: number[];
  productCategories: string[];
  active: boolean;
}

export interface SolutionCategoryContent {
  key: SolutionCategoryKey;
  label: string;
  route: string;
  heroTitle: string;
  heroDescription: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  problems: SolutionProblem[];
}

export type ProblemRecommendations = Record<string, Array<{
  id: number;
  name: string;
  slug: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
}>>;

interface PublicSolutionsPayload {
  categories?: Array<{
    key?: string;
    label?: string;
    route?: string;
    heroTitle?: string;
    heroDescription?: string;
    ctaLabel?: string;
    ctaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    problems?: Array<{
      id?: string;
      title?: string;
      body?: string;
      impact?: string[];
      solution?: string[];
      imageUrl?: string;
      technologies?: string[];
      productIds?: number[];
      productCategories?: string[];
      active?: boolean;
    }>;
  }>;
}

const DEFAULT_SOLUTIONS: Record<SolutionCategoryKey, SolutionCategoryContent> = {
  residential: {
    key: 'residential',
    label: 'Residential',
    route: '/solutions/residential',
    heroTitle: 'Reliable Power for Modern Living',
    heroDescription: 'Keep your home comfortable, secure, and fully powered with smart energy solutions designed for everyday living.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'residential-frequent-power-interruptions',
        title: 'Frequent Power Interruptions',
        body: 'Unstable electricity disrupts essential home activities, affecting comfort, security, and productivity.',
        impact: [
          'Frequent outages disrupt daily routines across lighting, refrigeration, internet access, and home productivity.',
          'In homes with remote work and e-learning, unstable electricity directly affects output and quality of life.',
        ],
        solution: [
          'PRAG builds residential continuity systems combining inverter and battery capacity to keep essential circuits running.',
          'We design around your real household usage so the system supports comfort and productivity loads.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
        technologies: ['Hybrid Solar Inverter Systems', 'Lithium Battery Banks (100-400Ah)', 'Automatic Changeover Controls'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
      {
        id: 'residential-rising-energy-costs',
        title: 'Rising Energy Costs',
        body: 'Constant generator usage and fuel consumption significantly increase monthly household expenses.',
        impact: [
          'Generator fuel and maintenance place steady pressure on monthly household budgets.',
          'High energy spend limits financial flexibility and makes long-term planning difficult.',
        ],
        solution: [
          'PRAG reduces recurring costs through solar-inverter-battery systems optimized for residential demand.',
          'We balance affordability, reliability, and future expandability in one design.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
        technologies: ['Monocrystalline Solar Panels', 'Hybrid Solar Inverter Systems', 'Residential Battery Storage'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'residential-appliance-damage',
        title: 'Appliance & Electronics Damage',
        body: 'Voltage fluctuations and surges can damage sensitive household electronics and appliances.',
        impact: [
          'Voltage spikes and drops can damage TVs, refrigerators, AC units, and routers.',
          'Repeated unstable power reduces appliance lifespan and increases maintenance frequency.',
        ],
        solution: [
          'PRAG deploys voltage regulation and surge control tailored for residential environments.',
          'Our setup delivers cleaner, more consistent power to sensitive home electronics.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
        technologies: ['Automatic Voltage Stabilizers (1-5kVA)', 'Surge Protection for Home Circuits', 'Clean Power Distribution'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'residential-generator-dependence',
        title: 'Dependence on Diesel Generators',
        body: 'Running generators around the clock creates noise, pollution, and safety risks.',
        impact: [
          'Continuous generator use introduces persistent noise and emissions into home life.',
          'Fuel logistics and maintenance interruptions make generator-only strategies expensive.',
        ],
        solution: [
          'PRAG replaces generator-heavy setups with cleaner hybrid systems that prioritize solar and battery power.',
          'Families get a safer, quieter, and more sustainable home power experience.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png',
        technologies: ['Hybrid Inverter + Battery Systems', 'Solar Integration for Homes', 'Smart Backup Prioritization'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
    ],
  },
  commercial: {
    key: 'commercial',
    label: 'Commercial',
    route: '/solutions/commercial',
    heroTitle: 'Smart Energy Systems for Growing Businesses',
    heroDescription: 'Efficient and reliable power solutions built to support daily business operations without interruption.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'commercial-low-high-voltage',
        title: 'Low or High Voltage?',
        body: 'Low or high voltage can affect equipment performance and reduce operational efficiency.',
        impact: [
          'Voltage abnormalities can cause air conditioners, computers, networking equipment, refrigeration systems, and other business-critical assets to operate inefficiently or fail prematurely.',
          'Over time, unstable voltage can increase maintenance costs and disrupt business operations.',
        ],
        solution: [
          'PRAG provides voltage stabilization solutions that deliver consistent, reliable power to your business.',
          'Our systems help improve equipment performance, extend asset lifespan, and reduce voltage-related disruptions.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Commercial Voltage Stabilizers', 'Servo and Relay Voltage Regulators', 'Power Conditioning Units'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'commercial-power-outages',
        title: 'Power Outages?',
        body: 'Power outages can disrupt business operations, affect customer service, and reduce productivity.',
        impact: [
          'Unexpected power interruptions can affect computers, internet connectivity, communications systems, security infrastructure, and other business-critical operations.',
          'For offices, retail stores, clinics, schools, and service businesses, even short outages can interrupt workflows, delay customer transactions, and reduce operational efficiency.',
        ],
        solution: [
          'PRAG provides business backup power solutions designed to keep essential operations running when utility power is unavailable.',
          'Our systems are tailored to support critical loads such as computers, networking equipment, communications systems, security infrastructure, and other business-essential services — helping maintain productivity and continuity during outages.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Three-Phase Hybrid Inverter Systems', 'Commercial Battery Storage', 'Automatic Changeover Controls'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
      {
        id: 'commercial-equipment-failure-downtime',
        title: 'Equipment Failure & Downtime?',
        body: 'Power-related equipment failures can disrupt operations and increase business costs.',
        impact: [
          'Unexpected equipment failures can result in lost productivity, delayed service delivery, dissatisfied customers, and unplanned repair expenses.',
          'For many businesses, downtime directly impacts revenue and profitability.',
        ],
        solution: [
          'PRAG helps protect critical equipment through professionally engineered power stabilization and protection solutions.',
          'Our systems are designed to improve power quality and reduce the risk of costly power-related failures.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['UPS Systems for Critical Loads', 'Power Conditioning and Surge Protection', 'Voltage Stabilizers'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'inverters'],
        active: true,
      },
      {
        id: 'commercial-rising-operating-costs',
        title: 'Rising Operating Costs?',
        body: 'Increasing energy and fuel costs place growing pressure on business profitability.',
        impact: [
          'Generator fuel, electricity costs, and equipment operating expenses can significantly increase the cost of running a business.',
          'These recurring costs reduce margins and limit opportunities for growth and investment.',
        ],
        solution: [
          'PRAG provides solar energy solutions that help businesses reduce long-term energy costs and improve energy efficiency.',
          'Our systems are designed to balance performance, reliability, and return on investment.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Commercial Solar Systems', 'High-Efficiency Inverter Platforms', 'Lithium Battery Storage'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'commercial-generator-dependence',
        title: 'Generator Dependence?',
        body: 'Heavy reliance on generators can increase costs, maintenance requirements, and operational complexity.',
        impact: [
          'Generator-based operations often involve fuel management, maintenance schedules, noise concerns, and rising operating expenses.',
          'For many businesses, generators become an expensive and inefficient long-term power strategy.',
        ],
        solution: [
          'PRAG helps businesses reduce dependence on generators through integrated backup power and solar energy solutions.',
          'Our systems provide cleaner, quieter, and more cost-effective alternatives for reliable business operations.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Hybrid Inverter + Battery Systems', 'Solar Integration for Businesses', 'Automatic Transfer Systems'],
        productCategories: ['inverters', 'solar', 'batteries'],
        active: true,
      },
    ],
  },
  industrial: {
    key: 'industrial',
    label: 'Industrial',
    route: '/solutions/industrial',
    heroTitle: 'Engineered Power for Heavy-Duty Operations',
    heroDescription: 'Downtime is expensive. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'industrial-low-high-voltage',
        title: 'Low or High Voltage?',
        body: 'Low or high voltage can affect machinery performance, process efficiency, and operational reliability.',
        impact: [
          'Voltage abnormalities can reduce equipment efficiency, affect process stability, and increase stress on critical machinery.',
          'Over time, unstable voltage can contribute to higher maintenance costs, reduced productivity, and unexpected operational disruptions.',
        ],
        solution: [
          'PRAG provides industrial voltage stabilization solutions that deliver consistent, reliable power to production equipment and critical systems.',
          'Our solutions help improve equipment performance, operational efficiency, and system reliability.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Industrial Automatic Voltage Regulators', 'Servo and Relay Voltage Stabilizers', 'Power Quality Monitoring'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'servo-voltage-stabilizers'],
        active: true,
      },
      {
        id: 'industrial-equipment-failure-downtime',
        title: 'Equipment Failure & Production Losses?',
        body: 'Power-related equipment failures can disrupt production and create significant operational costs.',
        impact: [
          'Unexpected equipment failures can halt operations, affect product quality, and result in costly repairs or replacement expenses.',
          'For industrial facilities, a single equipment failure can have far-reaching consequences across production, logistics, and customer commitments.',
        ],
        solution: [
          'PRAG helps protect critical industrial assets through professionally engineered power stabilization and protection solutions.',
          'Our systems are designed to improve power quality and reduce the risk of power-related equipment failures.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Power Conditioning and Surge Protection', 'UPS Systems for Critical Loads', 'Voltage Stabilizers'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'inverters'],
        active: true,
      },
      {
        id: 'industrial-generator-dependence',
        title: 'Generator Dependence?',
        body: 'Heavy reliance on generators can increase fuel costs, maintenance requirements, and operational complexity.',
        impact: [
          'Generator-dependent operations often face rising fuel costs, maintenance challenges, operational complexity, and exposure to fuel supply disruptions.',
          'For many facilities, generators become an expensive long-term energy strategy.',
        ],
        solution: [
          'PRAG provides solar energy solutions that help reduce dependence on generators and lower long-term energy costs.',
          'Our systems are designed to improve energy reliability while reducing fuel consumption and operating expenses.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Hybrid Power Systems', 'Solar + Inverter Integration', 'Lithium Battery Storage Solution'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'industrial-rising-energy-costs',
        title: 'Rising Energy Costs?',
        body: 'Increasing energy costs place growing pressure on operating margins and long-term competitiveness.',
        impact: [
          'Higher electricity tariffs, fuel expenses, and inefficient energy usage can significantly increase production and facility operating costs.',
          'Over time, rising energy costs can affect profitability, investment capacity, and business growth.',
        ],
        solution: [
          'PRAG provides industrial solar energy solutions that help reduce long-term energy costs and improve energy efficiency.',
          'Our systems are designed to balance operational requirements, performance, and return on investment.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Commercial Solar Systems', 'High-Efficiency Inverter Platforms', 'Power Factor Correction Systems'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
    ],
  },
  'voltage-stabilization-protection': {
    key: 'voltage-stabilization-protection',
    label: 'Voltage Stabilization & Protection',
    route: '/solutions/voltage-stabilization-protection',
    heroTitle: 'Voltage Stabilization & Protection Solutions',
    heroDescription: 'Protect your equipment from voltage fluctuations with PRAG stabilization and protection systems.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'vsp-low-high-voltage',
        title: 'Low or High Voltage?',
        body: 'Low or high voltage can affect equipment performance, shorten equipment lifespan, and increase the risk of costly damage.',
        impact: [
          'Voltage levels outside the recommended operating range can cause appliances, equipment, and machinery to perform poorly or fail prematurely.',
          'Over time, unstable voltage can result in increased maintenance costs, reduced efficiency, and unplanned equipment replacement.',
        ],
        solution: [
          'PRAG provides voltage stabilization solutions designed to deliver consistent, reliable power despite fluctuations in utility supply.',
          'Our systems help improve equipment performance, extend asset lifespan, and support reliable day-to-day operations.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Automatic Voltage Stabilizers', 'Servo Voltage Regulators', 'Power Conditioning Units'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'vsp-equipment-appliance-damage',
        title: 'Equipment & Appliance Damage?',
        body: 'Power fluctuations can damage valuable appliances, electronics, and business-critical equipment.',
        impact: [
          'Voltage spikes, surges, and prolonged overvoltage conditions can affect air conditioners, refrigerators, computers, production equipment, and other sensitive devices.',
          'Unexpected failures can result in costly repairs, replacements, and operational disruption.',
        ],
        solution: [
          'PRAG helps protect valuable equipment through professionally engineered voltage stabilization and protection solutions.',
          'Our systems are designed to reduce the risk of voltage-related damage and improve long-term equipment reliability.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Surge Protection Devices', 'Voltage Stabilizers', 'Power Conditioning Units'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'vsp-poor-equipment-performance',
        title: 'Poor Equipment Performance?',
        body: 'Inadequate voltage can reduce the efficiency and performance of connected equipment.',
        impact: [
          'Air conditioners may cool poorly, motors may struggle to start, refrigeration systems may operate inefficiently, and sensitive electronics may experience instability.',
          'These issues can affect comfort, productivity, and overall operational performance.',
        ],
        solution: [
          'PRAG stabilizers help ensure equipment receives voltage within an acceptable operating range, improving performance and supporting reliable operation.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Automatic Voltage Stabilizers', 'Servo Voltage Regulators', 'Clean Power Distribution'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'vsp-frequent-equipment-breakdowns',
        title: 'Frequent Equipment Breakdowns?',
        body: 'Repeated exposure to unstable voltage can increase equipment wear and maintenance requirements.',
        impact: [
          'Voltage abnormalities place additional stress on electrical and electronic components, increasing the likelihood of faults and premature failure.',
          'This can lead to recurring maintenance expenses and unnecessary downtime.',
        ],
        solution: [
          'PRAG provides voltage stabilization solutions that help reduce electrical stress on equipment and support longer service life.',
          'Our systems are designed to improve reliability while reducing maintenance and replacement costs.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Voltage Stabilizers', 'Power Conditioning', 'Surge Protection'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
      {
        id: 'vsp-unstable-utility-power',
        title: 'Unstable Utility Power?',
        body: 'Utility voltage conditions can vary significantly throughout the day, affecting reliability and performance.',
        impact: [
          'Low voltage, high voltage, and voltage fluctuations can create uncertainty for homes, businesses, and industrial facilities that depend on stable electricity.',
          'Without proper voltage regulation, these conditions can negatively affect equipment and operations.',
        ],
        solution: [
          'PRAG delivers voltage stabilization solutions engineered for Nigerian power conditions.',
          'Our systems help maintain consistent voltage levels and provide dependable power for homes, businesses, and industrial facilities.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Automatic Voltage Stabilizers', 'Servo Voltage Regulators', 'Power Quality Monitoring'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers'],
        active: true,
      },
    ],
  },
  'backup-power': {
    key: 'backup-power',
    label: 'Backup Power',
    route: '/solutions/backup-power',
    heroTitle: 'Reliable Backup Power Solutions',
    heroDescription: 'Stay powered during outages with PRAG inverter and battery backup systems.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'bp-power-outages',
        title: 'Power Outages?',
        body: 'Frequent power outages disrupt comfort, productivity, connectivity, and everyday activities.',
        impact: [
          'Power interruptions can affect lighting, internet access, communications, security systems, refrigeration, and other essential services.',
          'For homes and offices, unreliable electricity creates inconvenience, lost productivity, and operational challenges.',
        ],
        solution: [
          'PRAG provides backup power solutions designed to keep essential systems running when utility power is unavailable.',
          'Our systems are tailored to your requirements, helping maintain comfort, connectivity, security, and productivity during outages.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Hybrid Inverter Systems', 'Lithium Battery Banks', 'Automatic Changeover Controls'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
      {
        id: 'bp-generator-dependence',
        title: 'Dependence on Generators?',
        body: 'Generators can be expensive, noisy, and inconvenient for meeting everyday power needs.',
        impact: [
          'Fuel costs, maintenance requirements, noise, and operational complexity can increase the cost and inconvenience of maintaining reliable electricity.',
          'For many homes and offices, generators become an expensive long-term dependency.',
        ],
        solution: [
          'PRAG backup power solutions help reduce reliance on generators while providing dependable electricity during outages.',
          'Our systems deliver quieter, cleaner, and more convenient backup power.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Hybrid Inverter + Battery Systems', 'Smart Backup Prioritization', 'Energy Monitoring'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
    ],
  },
  'solar-energy': {
    key: 'solar-energy',
    label: 'Solar Energy',
    route: '/solutions/solar-energy',
    heroTitle: 'Solar Energy Solutions',
    heroDescription: 'Reduce energy costs and generator dependence with PRAG solar power systems.',
    ctaLabel: 'Get a Custom Quote',
    ctaHref: '/contact',
    secondaryCtaLabel: 'Browse All Products →',
    secondaryCtaHref: '/products',
    problems: [
      {
        id: 'se-rising-energy-costs',
        title: 'Rising Energy Costs?',
        body: 'Rising electricity and fuel costs place increasing pressure on household and business budgets.',
        impact: [
          'Higher utility bills and generator fuel expenses can significantly increase the cost of maintaining reliable power.',
          'Over time, these recurring expenses reduce financial flexibility, profitability, and long-term planning capacity.',
        ],
        solution: [
          'PRAG provides solar energy solutions that help reduce dependence on grid electricity and generator fuel.',
          'Our systems are designed to lower long-term energy costs while providing reliable, sustainable power.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Monocrystalline Solar Panels', 'High-Efficiency Inverter Platforms', 'Lithium Battery Storage'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'se-generator-dependence',
        title: 'Dependence on Generators?',
        body: 'Heavy reliance on generators can increase fuel costs, maintenance requirements, noise, and operational inconvenience.',
        impact: [
          'Generators require ongoing fuel purchases, regular maintenance, and operational oversight.',
          'For many homes and businesses, generator dependence becomes an expensive and inefficient long-term power strategy.',
        ],
        solution: [
          'PRAG solar energy solutions help reduce reliance on generators by providing a cleaner, quieter, and more cost-effective source of electricity.',
          'Our systems are tailored to your energy requirements, helping improve energy independence and reduce operating costs.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Commercial Solar Systems', 'Solar + Inverter Integration', 'Battery Storage Solutions'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
    ],
  },
};

function normalizeCategoryKey(value: string | undefined): SolutionCategoryKey {
  if (value === 'commercial' || value === 'industrial' || value === 'voltage-stabilization-protection' || value === 'backup-power' || value === 'solar-energy') return value;
  return 'residential';
}

function mergeCategory(defaultCategory: SolutionCategoryContent, raw?: NonNullable<PublicSolutionsPayload['categories']>[number]): SolutionCategoryContent {
  const incomingProblems = Array.isArray(raw?.problems) ? raw.problems : [];
  const problems = incomingProblems
    .map((problem, index) => ({
      id: String(problem?.id ?? `${defaultCategory.key}-problem-${index + 1}`).trim(),
      title: String(problem?.title ?? '').trim(),
      body: String(problem?.body ?? '').trim(),
      impact: Array.isArray(problem?.impact) ? problem.impact.map((item) => String(item).trim()).filter(Boolean) : [],
      solution: Array.isArray(problem?.solution) ? problem.solution.map((item) => String(item).trim()).filter(Boolean) : [],
      image: String(problem?.imageUrl ?? defaultCategory.problems[index]?.image ?? '').trim(),
      technologies: Array.isArray(problem?.technologies) ? problem.technologies.map((item) => String(item).trim()).filter(Boolean) : [],
      productIds: Array.isArray(problem?.productIds) ? problem.productIds.map((item) => Number(item)).filter((item) => Number.isFinite(item) && item > 0) : [],
      productCategories: Array.isArray(problem?.productCategories) ? problem.productCategories.map((item) => String(item).trim()).filter(Boolean) : [],
      active: problem?.active ?? true,
    }))
    .filter((problem) => problem.title);

  return {
    ...defaultCategory,
    label: String(raw?.label ?? defaultCategory.label).trim(),
    route: String(raw?.route ?? defaultCategory.route).trim(),
    heroTitle: String(raw?.heroTitle ?? defaultCategory.heroTitle).trim(),
    heroDescription: String(raw?.heroDescription ?? defaultCategory.heroDescription).trim(),
    ctaLabel: String(raw?.ctaLabel ?? defaultCategory.ctaLabel).trim(),
    ctaHref: String(raw?.ctaHref ?? defaultCategory.ctaHref).trim(),
    secondaryCtaLabel: String(raw?.secondaryCtaLabel ?? defaultCategory.secondaryCtaLabel).trim(),
    secondaryCtaHref: String(raw?.secondaryCtaHref ?? defaultCategory.secondaryCtaHref).trim(),
    problems: problems.length > 0 ? problems : defaultCategory.problems,
  };
}

export async function getSolutionCategoryContent(key: SolutionCategoryKey): Promise<SolutionCategoryContent> {
  const defaultCategory = DEFAULT_SOLUTIONS[key];
  const data = await getB2BPublicContent();
  if (!data) return defaultCategory;

  try {
    const payload = (data?.solutions ?? {}) as PublicSolutionsPayload;
    const incoming = Array.isArray(payload.categories) ? payload.categories : [];
    const entry = incoming.find((category) => normalizeCategoryKey(category?.key) === key);
    const merged = mergeCategory(defaultCategory, entry);

    const routeByKey: Record<SolutionCategoryKey, string> = {
      residential: '/solutions/residential',
      commercial: '/solutions/commercial',
      industrial: '/solutions/industrial',
      'voltage-stabilization-protection': '/solutions/voltage-stabilization-protection',
      'backup-power': '/solutions/backup-power',
      'solar-energy': '/solutions/solar-energy',
    };
    const route = routeByKey[key];
    const page = Array.isArray(data?.pages)
      ? (data.pages as Array<{ route?: string; sections?: Array<{ type?: string; summary?: string; content?: string; ctaLabel?: string; ctaHref?: string; visible?: boolean }> }>).find((item) => item?.route === route)
      : null;
    const heroSection = page?.sections?.find((section) => section?.type === 'hero' && section?.visible !== false)
      ?? page?.sections?.find((section) => section?.visible !== false);

    if (!heroSection) return merged;

    return {
      ...merged,
      heroTitle: heroSection.summary?.trim() || merged.heroTitle,
      heroDescription: heroSection.content?.trim() || merged.heroDescription,
      ctaLabel: heroSection.ctaLabel?.trim() || merged.ctaLabel,
      ctaHref: heroSection.ctaHref?.trim() || merged.ctaHref,
    };
  } catch {
    return defaultCategory;
  }
}

function uniqueProducts<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  const output: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    output.push(item);
  }
  return output;
}

function slugToPhrase(slug: string): string {
  return slug.replace(/-/g, ' ').trim();
}

function overlapsCategory(product: { categories?: Array<{ slug: string }> }, slugs: string[]): boolean {
  if (!Array.isArray(product.categories) || slugs.length === 0) return false;
  return product.categories.some((category) => slugs.includes(category.slug));
}

function buildProblemSearchPhrases(problem: SolutionProblem): string[] {
  const phrases = [
    problem.title,
    ...problem.technologies.slice(0, 2),
    ...problem.productCategories.slice(0, 2).map(slugToPhrase),
  ]
    .map((item) => item.trim())
    .filter((item) => item.length >= 3);

  return Array.from(new Set(phrases)).slice(0, 4);
}

export async function getProblemProductRecommendations(problems: SolutionProblem[]): Promise<ProblemRecommendations> {
  if (problems.length === 0) return {};

  const { products: catalogProducts } = await getProducts({ per_page: 100 });
  const recommendations: ProblemRecommendations = {};

  await Promise.all(problems.map(async (problem) => {
    const selectedById = Array.isArray(problem.productIds) && problem.productIds.length > 0
      ? catalogProducts.filter((product) => problem.productIds?.includes(product.id))
      : [];

    if (selectedById.length > 0) {
      recommendations[problem.id] = selectedById.slice(0, 8);
      return;
    }

    const categoryCandidates = problem.productCategories.length > 0
      ? catalogProducts.filter((product) => overlapsCategory(product, problem.productCategories))
      : [];

    const phrases = buildProblemSearchPhrases(problem);
    const searched = await Promise.all(phrases.map((phrase) => searchProducts(phrase)));
    const searchedProducts = uniqueProducts(searched.flat());

    const prioritized = problem.productCategories.length > 0
      ? searchedProducts.filter((product) => overlapsCategory(product, problem.productCategories))
      : searchedProducts;

    const merged = uniqueProducts([
      ...prioritized,
      ...searchedProducts,
      ...categoryCandidates,
      ...catalogProducts,
    ]).slice(0, 8);

    recommendations[problem.id] = merged;
  }));

  return recommendations;
}

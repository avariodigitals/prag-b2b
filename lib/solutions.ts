import { getProducts, searchProducts } from '@/lib/woocommerce';
import { getB2BPublicContent } from '@/lib/b2bContent';

export type SolutionCategoryKey = 'residential' | 'commercial' | 'industrial';

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
        id: 'commercial-operational-downtime',
        title: 'Operational Downtime',
        body: 'Frequent outages interrupt workflows, delay services, and reduce productivity.',
        impact: [
          'Outages can halt customer-facing and back-office operations, reducing output and revenue.',
          'Downtime weakens customer confidence and increases recovery costs.',
        ],
        solution: [
          'PRAG deploys continuity-focused backup systems so critical operations remain powered during outages.',
          'We size inverter and battery capacity around your actual business load profile.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Three-Phase Hybrid Inverter Systems', 'Commercial Battery Storage', 'Automatic Changeover Controls'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
      {
        id: 'commercial-high-energy-expenses',
        title: 'High Energy Expenses',
        body: 'Generator-heavy operations increase fuel and maintenance costs, reducing profitability.',
        impact: [
          'Unpredictable energy bills make planning and expansion decisions harder.',
          'High recurring energy costs limit reinvestment and growth.',
        ],
        solution: [
          'PRAG designs cost-optimized systems to reduce diesel dependence with inverter, battery, and solar integration.',
          'This improves cost predictability while maintaining continuity and power quality.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Commercial Solar Systems (10-500kW)', 'High-Efficiency Inverter Platforms', 'Lithium Battery Storage Solution'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'commercial-unstable-equipment-performance',
        title: 'Unstable Equipment Performance',
        body: 'Voltage instability affects servers, POS systems, and other critical office equipment.',
        impact: [
          'Unstable voltage shortens equipment lifespan and increases failure events.',
          'Abrupt outages can interrupt transactions and damage data integrity.',
        ],
        solution: [
          'PRAG implements voltage regulation and protection layers for sensitive business loads.',
          'From stabilizers to surge protection, we reduce stress on equipment and prevent avoidable failures.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Commercial Voltage Stabilizers (10-100kVA)', 'Power Conditioning and Surge Protection', 'UPS Systems for Critical Loads'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'inverters'],
        active: true,
      },
      {
        id: 'commercial-inconsistent-customer-experience',
        title: 'Inconsistent Customer Experience',
        body: 'Power interruptions in service environments reduce satisfaction and brand trust.',
        impact: [
          'Outages in retail and hospitality directly affect payment systems, cooling, and service delivery.',
          'Repeated interruptions reduce repeat business and customer confidence.',
        ],
        solution: [
          'PRAG builds continuity-first power systems that keep front-of-house and core operations live.',
          'We prioritize service-critical loads to maintain smooth operations during grid instability.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
        technologies: ['Hybrid Inverter + Battery Systems', 'Commercial Solar Integration', 'Energy Monitoring Dashboards'],
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
        id: 'industrial-voltage-instability',
        title: 'Voltage Instability & Equipment Damage',
        body: 'Unstable power causes spikes and drops that damage critical machinery and disrupt operations.',
        impact: [
          'Sensitive industrial equipment is vulnerable to unstable supply and repeated fluctuations.',
          'Frequent incidents increase repair costs, downtime, and delivery risk.',
        ],
        solution: [
          'PRAG delivers regulated power architecture to protect sensitive loads and maintain continuity.',
          'We combine advanced stabilizers, surge protection, and monitoring for long-term stability.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Industrial Automatic Voltage Regulators', 'Servo and Relay Voltage Stabilizers', 'Power Quality Monitoring'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'servo-voltage-stabilizers'],
        active: true,
      },
      {
        id: 'industrial-unplanned-downtime',
        title: 'Unplanned Downtime',
        body: 'Frequent outages interrupt production workflows and cause costly downtime.',
        impact: [
          'Every minute of outage can translate into delayed production and lost revenue.',
          'In continuity-critical operations, brief outages can have cascading operational impact.',
        ],
        solution: [
          'PRAG installs high-capacity inverter and backup systems with automatic switchover.',
          'Our systems are sized to keep critical equipment powered through outage events.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['High Capacity Inverter Systems', 'Lithium Battery Storage Solution', 'Automatic Transfer Systems'],
        productCategories: ['inverters', 'batteries'],
        active: true,
      },
      {
        id: 'industrial-high-generator-dependence',
        title: 'High Generator Dependence',
        body: 'Heavy reliance on diesel generators increases cost, noise, and emissions.',
        impact: [
          'Generator-first strategies create high recurring fuel and service costs.',
          'Noise, emissions, and inconsistent output introduce additional operational risk.',
        ],
        solution: [
          'PRAG replaces generator dependence with hybrid inverter and battery systems.',
          'Solar + storage integration reduces fuel exposure while preserving reliability.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Hybrid Power Systems', 'Solar + Inverter Integration', 'Lithium Battery Storage Solution'],
        productCategories: ['solar', 'inverters', 'batteries'],
        active: true,
      },
      {
        id: 'industrial-power-quality-issues',
        title: 'Power Quality Issues',
        body: 'Harmonics, surges, and poor power factor degrade performance and increase energy costs.',
        impact: [
          'Poor power quality reduces equipment lifespan and can cause precision process errors.',
          'Energy waste and demand inefficiency increase overall operating cost.',
        ],
        solution: [
          'PRAG deploys power-factor correction, filtering, and voltage regulation to clean and stabilize supply.',
          'Facilities gain safer operations, longer equipment life, and improved energy efficiency.',
        ],
        image: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6-1.png',
        technologies: ['Power Factor Correction Systems', 'Harmonic Filtering', 'Advanced Voltage Regulation'],
        productCategories: ['all-prag-stabilizers', 'voltage-stabilizers', 'inverters'],
        active: true,
      },
    ],
  },
};

function normalizeCategoryKey(value: string | undefined): SolutionCategoryKey {
  if (value === 'commercial' || value === 'industrial') return value;
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

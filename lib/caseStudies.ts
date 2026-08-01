import { getB2BPublicContent } from '@/lib/b2bContent';

export type CaseStudyCategory = 'Residential' | 'Commercial' | 'Industrial';

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudyRecord {
  id: string;
  category: CaseStudyCategory;
  title: string;
  imageUrl: string;
  imageAlt: string;
  imageLeft: boolean;
  problem: string;
  solution: string;
  tags: string[];
  results: CaseStudyResult[];
  outcome?: string;
  featured: boolean;
  active: boolean;
}

export interface CaseStudyProcessStep {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface CaseStudiesContent {
  sectionKicker: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionCtaLabel: string;
  sectionCtaHref: string;
  installationsHeroTitle: string;
  installationsHeroDescription: string;
  processKicker: string;
  processTitle: string;
  processSteps: CaseStudyProcessStep[];
  installationsCtaLabel: string;
  installationsCtaHref: string;
  solutionSectionLabel: string;
  resultsSectionLabel: string;
  categories: CaseStudyCategory[];
  studies: CaseStudyRecord[];
}

interface PublicPageSection {
  type?: string;
  visible?: boolean;
  summary?: string;
  content?: string;
}

interface PublicPageRecord {
  route?: string;
  title?: string;
  description?: string;
  sections?: PublicPageSection[];
}

export const DEFAULT_CASE_STUDIES_CONTENT: CaseStudiesContent = {
  sectionKicker: 'Case Studies',
  sectionTitle: 'Real Results from Real Projects',
  sectionDescription: 'Explore how we\'ve helped homes, businesses, and industrial facilities overcome power challenges with tailored solutions.',
  sectionCtaLabel: 'View all Case studies →',
  sectionCtaHref: '/installations',
  installationsHeroTitle: 'Real Installations,\nMeasurable Results.',
  installationsHeroDescription: 'Every project tells the story of a solved problem. Browse our installation portfolio and see the outcomes we\'ve delivered.',
  processKicker: 'Our Process',
  processTitle: 'Every Installation Follows the\nSame Process',
  processSteps: [
    {
      id: 'process-01',
      label: '01',
      title: 'Site Assessment',
      description: 'We visit your site, measure load, assess infrastructure, and identify problem sources before touching any equipment.',
    },
    {
      id: 'process-02',
      label: '02',
      title: 'Custom Design',
      description: 'Your system is engineered specifically for your load profile, space constraints, and budget - never a template.',
    },
    {
      id: 'process-03',
      label: '03',
      title: 'Certified Installation',
      description: 'PRAG-trained engineers install to NSO standards. No subs, no shortcuts.',
    },
    {
      id: 'process-04',
      label: '04',
      title: 'Testing & Support',
      description: 'We test every circuit and component, brief your team, and provide ongoing warranty and maintenance.',
    },
  ],
  installationsCtaLabel: 'Start Your Installation →',
  installationsCtaHref: '/contact',
  solutionSectionLabel: 'Solution Deployed',
  resultsSectionLabel: 'Result/Outcome',
  categories: ['Residential', 'Commercial', 'Industrial'],
  studies: [
    {
      id: 'industrial-lagos-manufacturing',
      category: 'Industrial',
      title: 'A Lagos manufacturing company reduced downtime by over 90% with a PRAG system — achieving 99.8% uptime.',
      imageUrl: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-7.png',
      imageAlt: 'Lagos manufacturing case study',
      imageLeft: true,
      problem: 'To reduce frequent power outages causing 12+ hours of weekly downtime, damaging expensive CNC machines.',
      solution: '500KVA integrated stabilizer, inverter, and solar system designed for high-load manufacturing operations with continuous uptime requirements.',
      tags: ['Stabilizer', 'Inverter', 'Solar Panels'],
      results: [
        { label: 'Power Rating', value: '500KVA' },
        { label: 'Uptime', value: '99.8%' },
        { label: 'Solar Panels', value: '99.8%' },
        { label: 'Annual Savings', value: '₦15M' },
        { label: 'Life Span', value: '3X' },
      ],
      featured: true,
      active: true,
    },
    {
      id: 'residential-meadows-estate',
      category: 'Residential',
      title: 'Meadows Estate, Lekki Phase II',
      imageUrl: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-7.png',
      imageAlt: 'Meadows Estate installation',
      imageLeft: true,
      problem: '60 housing units dependent on shared generator, disputes over fuel costs, and 8-12 hour daily power cuts.',
      solution: 'Communal 50kW solar microgrid + 120kWh battery bank + individual unit smart metering for transparent consumption billing.',
      tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
      results: [
        { label: 'Unit Powered', value: '60' },
        { label: 'Cost Production', value: '65%' },
        { label: 'Power Supply', value: '24/7' },
      ],
      featured: false,
      active: true,
    },
    {
      id: 'industrial-zenith-textile',
      category: 'Industrial',
      title: 'Zenith Textile Factory, Kano',
      imageUrl: 'https://central.prag.global/wp-content/uploads/2026/05/de54212698666fc36bad495a64ee3ac2e8d43166.png',
      imageAlt: 'Zenith Textile factory installation',
      imageLeft: false,
      problem: 'Voltage fluctuations causing 3-5 motor burnouts per month on industrial looms, costing ₦8M+ in repairs annually.',
      solution: 'Three-phase 250kVA servo-motor stabilizer + power factor correction capacitors + surge protection system across all production lines.',
      tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
      results: [
        { label: 'Motor Burnout', value: '0' },
        { label: 'Production Gain', value: '+22.8%' },
        { label: 'Cost Production', value: '87%' },
      ],
      featured: false,
      active: true,
    },
    {
      id: 'commercial-federal-medical-centre',
      category: 'Commercial',
      title: 'Federal Medical Centre, Abuja',
      imageUrl: 'https://central.prag.global/wp-content/uploads/2026/05/7fc3e3ba69e25dbdf5621fb3f7498f827e5c525f.png',
      imageAlt: 'Federal Medical Centre installation',
      imageLeft: true,
      problem: 'Severe voltage fluctuations destroying diagnostic equipment and theatre instruments worth ₦45M annually.',
      solution: '100kVA three-phase industrial stabilizer + dual-input online UPS system deployed across all critical wards and theatres.',
      tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
      results: [
        { label: 'Power Rating', value: '100KVA' },
        { label: 'Uptime', value: '99.8%' },
        { label: 'Annual Savings', value: '₦45M' },
      ],
      featured: false,
      active: true,
    },
    {
      id: 'commercial-ikeja-shopping-mall',
      category: 'Commercial',
      title: 'Ikeja Shopping Mall, Lagos',
      imageUrl: 'https://central.prag.global/wp-content/uploads/2026/05/Rectangle-6.png',
      imageAlt: 'Ikeja shopping mall installation',
      imageLeft: false,
      problem: 'Daily 6-8hr outages causing ₦2.1M/week in lost sales and spoiled perishables across 42 tenants.',
      solution: '200kW rooftop solar system + 500kWh lithium battery storage + three-phase hybrid inverters with remote monitoring dashboard.',
      tags: ['Stabilizer', 'Inverter', 'Solar Panels', 'Lithium Battery'],
      results: [
        { label: 'Tenants Powered', value: '42' },
        { label: 'Uptime', value: '99.5%' },
        { label: 'Weekly Savings', value: '₦2.1M' },
      ],
      featured: false,
      active: true,
    },
  ],
};

function normalizeCategory(value: string | undefined): CaseStudyCategory {
  if (value === 'Industrial' || value === 'Commercial') return value;
  return 'Residential';
}

function mergeCaseStudiesContent(content?: Partial<CaseStudiesContent> | null): CaseStudiesContent {
  const incoming = content?.studies ?? [];
  const deduped = new Map<string, CaseStudyRecord>();
  const processSteps = Array.isArray(content?.processSteps)
    ? content.processSteps
      .map((step, index) => ({
        id: String(step?.id ?? `process-${index + 1}`).trim(),
        label: String(step?.label ?? `${index + 1}`.padStart(2, '0')).trim(),
        title: String(step?.title ?? '').trim(),
        description: String(step?.description ?? '').trim(),
      }))
      .filter((step) => step.title || step.description)
    : [];

  for (const [index, item] of incoming.entries()) {
    const title = String(item?.title ?? '').trim();
    if (!title) continue;

    const key = title.toLowerCase();
    if (deduped.has(key)) continue;

    const fallback = DEFAULT_CASE_STUDIES_CONTENT.studies[index] ?? DEFAULT_CASE_STUDIES_CONTENT.studies[0];
    deduped.set(key, {
      id: String(item?.id ?? `${normalizeCategory(item?.category)}-${index + 1}`).trim(),
      category: normalizeCategory(item?.category),
      title,
      imageUrl: String(item?.imageUrl ?? fallback.imageUrl).trim(),
      imageAlt: String(item?.imageAlt ?? fallback.imageAlt ?? title).trim(),
      imageLeft: item?.imageLeft ?? fallback.imageLeft,
      problem: String(item?.problem ?? '').trim(),
      solution: String(item?.solution ?? '').trim(),
      tags: Array.isArray(item?.tags) ? item.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      results: Array.isArray(item?.results)
        ? item.results
          .map((result) => ({ label: String(result?.label ?? '').trim(), value: String(result?.value ?? '').trim() }))
          .filter((result) => result.label && result.value)
        : [],
      outcome: String(item?.outcome ?? '').trim(),
      featured: Boolean(item?.featured),
      active: item?.active ?? true,
    });
  }

  const studies = deduped.size > 0 ? Array.from(deduped.values()) : DEFAULT_CASE_STUDIES_CONTENT.studies;
  if (!studies.some((study) => study.featured && study.active)) {
    studies[0] = { ...studies[0], featured: true };
  }

  return {
    ...DEFAULT_CASE_STUDIES_CONTENT,
    ...content,
    processKicker: String(content?.processKicker ?? DEFAULT_CASE_STUDIES_CONTENT.processKicker),
    processTitle: String(content?.processTitle ?? DEFAULT_CASE_STUDIES_CONTENT.processTitle),
    processSteps: processSteps.length > 0 ? processSteps : DEFAULT_CASE_STUDIES_CONTENT.processSteps,
    solutionSectionLabel: String(content?.solutionSectionLabel ?? DEFAULT_CASE_STUDIES_CONTENT.solutionSectionLabel),
    resultsSectionLabel: String(content?.resultsSectionLabel ?? DEFAULT_CASE_STUDIES_CONTENT.resultsSectionLabel),
    categories: ['Residential', 'Commercial', 'Industrial'],
    studies,
  };
}

export async function getCaseStudiesContent(): Promise<CaseStudiesContent> {
  const data = await getB2BPublicContent();
  if (!data) return DEFAULT_CASE_STUDIES_CONTENT;

  try {
    const caseStudiesInput = data?.caseStudies;
    const merged = mergeCaseStudiesContent(
      caseStudiesInput && typeof caseStudiesInput === 'object'
        ? (caseStudiesInput as Partial<CaseStudiesContent>)
        : undefined,
    );
    const installationsPage = Array.isArray(data?.pages)
      ? (data.pages as PublicPageRecord[]).find((entry) => entry?.route === '/installations')
      : undefined;

    const mainSection = installationsPage?.sections?.find((section) => section?.visible !== false && section?.type === 'hero')
      ?? installationsPage?.sections?.find((section) => section?.visible !== false)
      ?? installationsPage?.sections?.[0];

    const titleFromPage = String(mainSection?.summary ?? installationsPage?.title ?? '').trim();
    const descriptionFromPage = String(mainSection?.content ?? installationsPage?.description ?? '').trim();

    return {
      ...merged,
      installationsHeroTitle: titleFromPage || merged.installationsHeroTitle,
      installationsHeroDescription: descriptionFromPage || merged.installationsHeroDescription,
    };
  } catch {
    return DEFAULT_CASE_STUDIES_CONTENT;
  }
}

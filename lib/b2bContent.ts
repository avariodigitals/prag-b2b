import { promises as fs } from 'node:fs';
import path from 'node:path';
import { unstable_cache } from 'next/cache';

const B2B_PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;

export interface PublicB2BPageSection {
  id?: string;
  type?: string;
  title?: string;
  summary?: string;
  content?: string;
  kicker?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  mobileImageUrl?: string;
  visible?: boolean;
}

export interface PublicB2BPage {
  route?: string;
  title?: string;
  description?: string;
  sections?: PublicB2BPageSection[];
}

export interface PublicB2BHeaderMenuItem {
  label?: string;
  href?: string;
  children?: PublicB2BHeaderMenuItem[];
}

export interface PublicB2BHeaderSettings {
  brandLabel?: string;
  announcement?: string;
  ctaLabel?: string;
  ctaHref?: string;
  solutionsMenuItems?: PublicB2BHeaderMenuItem[];
  productsMenuItems?: PublicB2BHeaderMenuItem[];
  companyMenuItems?: PublicB2BHeaderMenuItem[];
  contactLabel?: string;
  contactHref?: string;
  menuItems?: PublicB2BHeaderMenuItem[];
  solutionsMegaTitle?: string;
  solutionsMegaBody?: string;
  productsMegaTitle?: string;
  productsMegaBody?: string;
  companyMegaTitle?: string;
  companyMegaBody?: string;
}

export interface PublicB2BFooterSettings {
  ctaTitle?: string;
  ctaDescription?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  companyName?: string;
  companyRegistration?: string;
  tagline?: string;
  supportCardLeadText?: string;
  supportCardCtaText?: string;
  trustCardTitle?: string;
  trustCardSubtitle?: string;
  whatsappHelperText?: string;
  partnerTitle?: string;
  partnerDescription?: string;
  partnerCtaText?: string;
  partnerHref?: string;
  contactHeading?: string;
  headOfficeLabel?: string;
  salesHotlineLabel?: string;
  customerSupportLabel?: string;
  whatsappLabel?: string;
  emailLabel?: string;
  workingHoursLabel?: string;
  workingHoursText?: string;
  copyright?: string;
  disclaimerText?: string;
  legalLinks?: Array<{ label: string; href: string }>;
  columns?: Array<{ title: string; items: Array<{ label: string; href: string }> }>;
}

export interface PublicB2BLaunchSettings {
  enabled?: boolean;
  title?: string;
  message?: string;
}

export interface PublicB2BScriptSettings {
  head?: string;
  body?: string;
  footer?: string;
}

export interface PublicB2BIntegrationsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  searchConsoleVerification?: string;
  zohoOneScript?: string;
  customDomainHook?: string;
  whatsappChatEnabled?: boolean;
  whatsappChatNumber?: string;
  whatsappChatText?: string;
}

export interface PublicB2BContactSettings {
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  mapLink?: string;
  /**
   * Legacy location for WhatsApp link. Prefer `settings.integrations.whatsappChatLink`.
   */
  whatsapp?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface PublicB2BContent {
  settings?: {
    contact?: PublicB2BContactSettings;
    header?: PublicB2BHeaderSettings;
    footer?: PublicB2BFooterSettings;
    launch?: PublicB2BLaunchSettings;
    scripts?: PublicB2BScriptSettings;
    integrations?: PublicB2BIntegrationsSettings;
  };
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: PublicB2BPage[];
  updatedAt?: string;
}

interface LocalB2BStoreShape {
  settings?: PublicB2BContent['settings'];
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: PublicB2BPage[];
  audit?: Array<{ at?: string }>;
}

interface WordPressAdminConfigShape {
  b2bAdminStore?: LocalB2BStoreShape;
  settings?: PublicB2BContent['settings'];
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: PublicB2BPage[];
  audit?: Array<{ at?: string }>;
}

function resolveB2BAdminBaseUrl() {
  const candidates = [
    process.env.B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_PUBLIC_URL,
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

function resolveWordPressApiUrl() {
  const candidate = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!candidate || !candidate.trim()) return null;
  return candidate.replace(/\/$/, '');
}

function buildWordPressAuthHeader(): Record<string, string> {
  const user = process.env.WP_APP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!user || !password) return {};

  const encoded = Buffer.from(`${user}:${password}`).toString('base64');
  return { Authorization: `Basic ${encoded}` };
}

function mapStoreToPublicContent(store: LocalB2BStoreShape): PublicB2BContent {
  return {
    settings: store.settings,
    caseStudies: store.caseStudies,
    solutions: store.solutions,
    pages: Array.isArray(store.pages) ? store.pages : [],
    updatedAt: store.audit?.[0]?.at ?? new Date().toISOString(),
  };
}

async function getB2BContentFromLocalStore(): Promise<PublicB2BContent | null> {
  try {
    const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
    const raw = await fs.readFile(localStorePath, 'utf8');
    const parsed = JSON.parse(raw) as LocalB2BStoreShape;
    return mapStoreToPublicContent(parsed);
  } catch {
    return null;
  }
}

async function getB2BContentFromAdminPublicApi(baseUrl: string): Promise<PublicB2BContent | null> {
  try {
    const res = await fetch(`${baseUrl}/api/public/b2b-content`, {
      next: {
        revalidate: B2B_PUBLIC_CONTENT_REVALIDATE_SECONDS,
        tags: ['b2b-public-content'],
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicB2BContent;
  } catch {
    return null;
  }
}

async function getB2BContentFromWordPress(): Promise<PublicB2BContent | null> {
  const wpApiUrl = resolveWordPressApiUrl();
  if (!wpApiUrl) return null;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...buildWordPressAuthHeader(),
    };

    const res = await fetch(`${wpApiUrl}/prag-core/v1/admin-config`, {
      headers,
      next: {
        revalidate: B2B_PUBLIC_CONTENT_REVALIDATE_SECONDS,
        tags: ['b2b-public-content'],
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok || res.status === 204) return null;

    const parsed = (await res.json()) as WordPressAdminConfigShape;
    const store = parsed?.b2bAdminStore && typeof parsed.b2bAdminStore === 'object'
      ? parsed.b2bAdminStore
      : parsed;

    return mapStoreToPublicContent(store);
  } catch {
    return null;
  }
}

async function getB2BPublicContentFresh(): Promise<PublicB2BContent | null> {
  // Local file fallback is useful in local dev, but avoid it on Vercel where
  // the Prag-Admin workspace path does not exist and adds unnecessary latency.
  if (!process.env.VERCEL) {
    const localContent = await getB2BContentFromLocalStore();
    if (localContent) return localContent;
  }

  const baseUrl = resolveB2BAdminBaseUrl();
  if (baseUrl) {
    const adminContent = await getB2BContentFromAdminPublicApi(baseUrl);
    if (adminContent) return adminContent;
  }

  const wpContent = await getB2BContentFromWordPress();
  if (wpContent) return wpContent;

  return null;
}

export async function getB2BPublicContent(): Promise<PublicB2BContent | null> {
  // In development, always read fresh content so Prag-Admin edits are visible immediately.
  if (process.env.NODE_ENV === 'development') {
    return getB2BPublicContentFresh();
  }
  return getB2BPublicContentCached();
}

const getB2BPublicContentCached = unstable_cache(async (): Promise<PublicB2BContent | null> => {
  return getB2BPublicContentFresh();
}, ['b2b-public-content'], {
  revalidate: B2B_PUBLIC_CONTENT_REVALIDATE_SECONDS,
});

export function findB2BPage(content: PublicB2BContent | null, route: string): PublicB2BPage | null {
  if (!content?.pages || !Array.isArray(content.pages)) return null;
  return content.pages.find((page) => page?.route === route) ?? null;
}

export function findVisibleSectionsByType(page: PublicB2BPage | null, type: string): PublicB2BPageSection[] {
  if (!page?.sections || !Array.isArray(page.sections)) return [];
  return page.sections.filter((section) => section?.type === type && section?.visible !== false);
}

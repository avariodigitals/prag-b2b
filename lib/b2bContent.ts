import { promises as fs } from 'node:fs';
import path from 'node:path';
import { unstable_cache } from 'next/cache';
import type { SeoOverrideMap } from '@/lib/seoMeta';

const B2B_PUBLIC_CONTENT_REVALIDATE_SECONDS = 60;

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
  image?: string;
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

export interface PublicB2BWhatsAppChatOption {
  label?: string;
  subtitle?: string;
  prefill?: string;
  number?: string;
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
  whatsappChatOptions?: PublicB2BWhatsAppChatOption[];
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
  seoOverrides?: SeoOverrideMap;
  updatedAt?: string;
}

interface LocalB2BStoreShape {
  settings?: PublicB2BContent['settings'];
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: PublicB2BPage[];
  seoOverrides?: SeoOverrideMap;
  audit?: Array<{ at?: string }>;
}

interface WordPressAdminConfigShape {
  b2bAdminStore?: LocalB2BStoreShape;
  settings?: PublicB2BContent['settings'];
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: PublicB2BPage[];
  seoOverrides?: SeoOverrideMap;
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
    seoOverrides: store.seoOverrides && typeof store.seoOverrides === 'object' ? store.seoOverrides : undefined,
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

/**
 * Rewrite internal links that point at a redirected canonical URL so they
 * resolve to the final 200 URL directly. This avoids internal redirect
 * chains (e.g. /products/all-prag-stabilizers → /products/voltage-stabilizers)
 * for any CMS-provided navigation, card, or CTA link.
 *
 * The legacy redirects themselves are preserved in lib/redirects.ts,
 * lib/seoTaxonomy.ts and next.config.ts so external/legacy URLs still resolve.
 * Only CMS-provided *internal* links are normalized here.
 */
const INTERNAL_HREF_REDIRECTS: Record<string, string> = {
  '/products/all-prag-stabilizers': '/products/voltage-stabilizers',
};

function normalizeInternalHref(href: string | undefined): string | undefined {
  if (!href || typeof href !== 'string') return href;
  const trimmed = href.trim();
  if (!trimmed) return trimmed;
  // Leave external URLs and non-/paths untouched.
  if (!trimmed.startsWith('/')) return trimmed;

  // Split into path + query/hash so we only rewrite the path portion.
  const queryOrHashStart = trimmed.search(/[?#]/);
  const path = queryOrHashStart === -1 ? trimmed : trimmed.slice(0, queryOrHashStart);
  const rest = queryOrHashStart === -1 ? '' : trimmed.slice(queryOrHashStart);

  const normalizedPath = path.replace(/\/+$/, '') || path;
  const replacement = INTERNAL_HREF_REDIRECTS[normalizedPath];
  if (!replacement) return trimmed;
  return `${replacement}${rest}`;
}

function normalizeMenuItems(items: PublicB2BHeaderMenuItem[] | undefined): void {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (!item) continue;
    item.href = normalizeInternalHref(item.href);
    if (item.children) normalizeMenuItems(item.children);
  }
}

function normalizeFooterColumns(
  columns: PublicB2BFooterSettings['columns'] | undefined,
): void {
  if (!Array.isArray(columns)) return;
  for (const col of columns) {
    if (!col || !Array.isArray(col.items)) continue;
    for (const link of col.items) {
      if (!link) continue;
      link.href = normalizeInternalHref(link.href) ?? link.href;
    }
  }
}

function normalizeLegalLinks(
  links: PublicB2BFooterSettings['legalLinks'] | undefined,
): void {
  if (!Array.isArray(links)) return;
  for (const link of links) {
    if (!link) continue;
    link.href = normalizeInternalHref(link.href) ?? link.href;
  }
}

/**
 * Sanitize B2B content to remove retired "PRAG B2B" branding from any
 * admin-configured fields, and normalize CMS-provided internal links so they
 * never point at a redirected canonical URL. The brandLabel is not rendered
 * by any component but appears in the RSC flight data payload — sanitize it
 * so "PRAG B2B" never appears in the HTML source.
 */
function sanitizeB2BContent(content: PublicB2BContent): PublicB2BContent {
  if (content?.settings?.header?.brandLabel) {
    content.settings.header.brandLabel = content.settings.header.brandLabel
      .replace(/PRAG B2B/gi, 'PRAG')
      .trim();
  }

  // Normalize CMS-provided internal links to avoid redirect chains.
  if (content?.pages && Array.isArray(content.pages)) {
    for (const page of content.pages) {
      if (!page?.sections || !Array.isArray(page.sections)) continue;
      for (const section of page.sections) {
        if (!section) continue;
        section.ctaHref = normalizeInternalHref(section.ctaHref);
        section.secondaryCtaHref = normalizeInternalHref(section.secondaryCtaHref);
      }
    }
  }

  if (content?.settings?.header) {
    const header = content.settings.header;
    header.ctaHref = normalizeInternalHref(header.ctaHref);
    header.contactHref = normalizeInternalHref(header.contactHref);
    normalizeMenuItems(header.solutionsMenuItems);
    normalizeMenuItems(header.productsMenuItems);
    normalizeMenuItems(header.companyMenuItems);
    normalizeMenuItems(header.menuItems);
  }

  if (content?.settings?.footer) {
    const footer = content.settings.footer;
    footer.primaryCtaHref = normalizeInternalHref(footer.primaryCtaHref);
    footer.secondaryCtaHref = normalizeInternalHref(footer.secondaryCtaHref);
    footer.partnerHref = normalizeInternalHref(footer.partnerHref);
    normalizeFooterColumns(footer.columns);
    normalizeLegalLinks(footer.legalLinks);
  }

  return content;
}

async function getB2BPublicContentFresh(): Promise<PublicB2BContent | null> {
  // Local file fallback is useful in local dev, but avoid it in production where
  // the Prag-Admin workspace path does not exist and adds unnecessary latency.
  if (process.env.NODE_ENV !== 'production') {
    const localContent = await getB2BContentFromLocalStore();
    if (localContent) return sanitizeB2BContent(localContent);
  }

  const baseUrl = resolveB2BAdminBaseUrl();
  if (baseUrl) {
    const adminContent = await getB2BContentFromAdminPublicApi(baseUrl);
    if (adminContent) return sanitizeB2BContent(adminContent);
  }

  const wpContent = await getB2BContentFromWordPress();
  if (wpContent) return sanitizeB2BContent(wpContent);

  return null;
}

export async function getB2BPublicContent(): Promise<PublicB2BContent | null> {
  // In development, always read fresh content so Prag-Admin edits are visible immediately.
  if (process.env.NODE_ENV === 'development') {
    return getB2BPublicContentFresh();
  }
  try {
    return await getB2BPublicContentCached();
  } catch {
    return null;
  }
}

const getB2BPublicContentCached = unstable_cache(async (): Promise<PublicB2BContent> => {
  const content = await getB2BPublicContentFresh();
  if (!content) {
    throw new Error('B2B content unavailable from all sources');
  }
  return content;
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

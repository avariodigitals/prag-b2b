import { promises as fs } from 'node:fs';
import path from 'node:path';
import { unstable_noStore as noStore } from 'next/cache';

export interface PublicB2BPageSection {
  id?: string;
  type?: string;
  title?: string;
  summary?: string;
  content?: string;
  kicker?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  visible?: boolean;
}

export interface PublicB2BPage {
  route?: string;
  title?: string;
  description?: string;
  sections?: PublicB2BPageSection[];
}

export interface PublicB2BHeaderSettings {
  brandLabel?: string;
  announcement?: string;
  ctaLabel?: string;
  ctaHref?: string;
  menuItems?: Array<{ label: string; href: string }>;
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
}

export interface PublicB2BContactSettings {
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
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

async function getB2BContentFromLocalStore(): Promise<PublicB2BContent | null> {
  try {
    const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
    const raw = await fs.readFile(localStorePath, 'utf8');
    const parsed = JSON.parse(raw) as LocalB2BStoreShape;
    return {
      settings: parsed.settings,
      caseStudies: parsed.caseStudies,
      solutions: parsed.solutions,
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
      updatedAt: parsed.audit?.[0]?.at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getB2BPublicContent(): Promise<PublicB2BContent | null> {
  noStore();

  const localContent = await getB2BContentFromLocalStore();
  if (localContent) return localContent;

  const baseUrl = resolveB2BAdminBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/public/b2b-content`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicB2BContent;
  } catch {
    return null;
  }
}

export function findB2BPage(content: PublicB2BContent | null, route: string): PublicB2BPage | null {
  if (!content?.pages || !Array.isArray(content.pages)) return null;
  return content.pages.find((page) => page?.route === route) ?? null;
}

export function findVisibleSectionsByType(page: PublicB2BPage | null, type: string): PublicB2BPageSection[] {
  if (!page?.sections || !Array.isArray(page.sections)) return [];
  return page.sections.filter((section) => section?.type === type && section?.visible !== false);
}

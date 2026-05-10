import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

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

async function readLocalB2BStore() {
  try {
    const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
    const raw = await fs.readFile(localStorePath, 'utf8');
    const parsed = JSON.parse(raw) as {
      settings?: unknown;
      caseStudies?: unknown;
      solutions?: unknown;
      pages?: unknown;
      audit?: Array<{ at?: string }>;
    };
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

export async function GET() {
  const localData = await readLocalB2BStore();
  if (localData) {
    return NextResponse.json(localData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-B2B-Content-Source': 'local-store',
      },
    });
  }

  const baseUrl = resolveB2BAdminBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'B2B admin public URL not configured.' }, { status: 500 });
  }

  try {
    const upstream = await fetch(`${baseUrl}/api/public/b2b-content`, { cache: 'no-store' });
    if (!upstream.ok) {
      return NextResponse.json({ error: 'Unable to fetch B2B content.' }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-B2B-Content-Source': 'upstream-api',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to fetch B2B content.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

type B2BStoreShape = {
  settings?: unknown;
  caseStudies?: unknown;
  solutions?: unknown;
  pages?: unknown;
  audit?: Array<{ at?: string }>;
};

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

async function readWordPressB2BStore() {
  const wpApiUrl = resolveWordPressApiUrl();
  if (!wpApiUrl) return null;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...buildWordPressAuthHeader(),
    };

    const res = await fetch(`${wpApiUrl}/prag-core/v1/admin-config`, {
      next: { revalidate: 60 },
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok || res.status === 204) return null;

    const parsed = (await res.json()) as {
      b2bAdminStore?: B2BStoreShape;
    } & B2BStoreShape;
    const store = parsed?.b2bAdminStore && typeof parsed.b2bAdminStore === 'object'
      ? parsed.b2bAdminStore
      : parsed;

    return {
      settings: store.settings,
      caseStudies: store.caseStudies,
      solutions: store.solutions,
      pages: Array.isArray(store.pages) ? store.pages : [],
      updatedAt: store.audit?.[0]?.at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  // Local-file fallback removed — production WordPress is the single source of
  // truth. Local dev now mirrors production so localhost content can never
  // diverge from the live site.
  const baseUrl = resolveB2BAdminBaseUrl();

  if (baseUrl) {
    try {
      const upstream = await fetch(`${baseUrl}/api/public/b2b-content`, { next: { revalidate: 60 } });
      if (upstream.ok) {
        const data = await upstream.json();
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            'X-B2B-Content-Source': 'upstream-api',
          },
        });
      }
    } catch {
      // Fall through to WordPress fallback
    }
  }

  const wpData = await readWordPressB2BStore();
  if (wpData) {
    return NextResponse.json(wpData, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'X-B2B-Content-Source': 'wordpress-fallback',
      },
    });
  }

  return NextResponse.json({ error: 'Unable to fetch B2B content.' }, { status: 500 });
}

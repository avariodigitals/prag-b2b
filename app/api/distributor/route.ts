import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { verifyTurnstileToken, getClientIp } from '@/lib/turnstile';
import { checkRateLimit, FORM_RATE_LIMIT } from '@/lib/rateLimit';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

type LocalSubmissionRecord = {
  id: string;
  kind: 'contact' | 'distributor';
  status: 'new' | 'in-review' | 'resolved';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  source: 'public-form' | 'admin';
  route: string;
  createdAt: string;
};

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function persistDistributorLocally(body: Record<string, unknown>) {
  const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
  const raw = await fs.readFile(localStorePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    distributorApplications?: LocalSubmissionRecord[];
    audit?: Array<{ id?: string; at?: string; actor?: string; action?: string; target?: string; details?: string }>;
  };

  const record: LocalSubmissionRecord = {
    id: randomId(),
    kind: 'distributor',
    status: 'new',
    name: String(body?.name ?? ''),
    email: String(body?.email ?? ''),
    phone: body?.phone ? String(body.phone) : undefined,
    company: body?.business ? String(body.business) : body?.company ? String(body.company) : undefined,
    subject: body?.tier ? `Partnership Tier: ${String(body.tier)}` : 'Distributor Application',
    message: String(body?.message ?? ''),
    source: 'public-form',
    route: '/distributor',
    createdAt: new Date().toISOString(),
  };

  const distributorApplications = Array.isArray(parsed.distributorApplications) ? parsed.distributorApplications : [];
  const audit = Array.isArray(parsed.audit) ? parsed.audit : [];

  const next = {
    ...parsed,
    distributorApplications: [record, ...distributorApplications].slice(0, 500),
    audit: [
      {
        id: randomId(),
        at: new Date().toISOString(),
        actor: record.email || 'public-form',
        action: 'create',
        target: 'distributor application',
        details: 'Received via /distributor',
      },
      ...audit,
    ].slice(0, 1000),
  };

  await fs.writeFile(localStorePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

function resolveB2BAdminUrl() {
  const candidates = [
    process.env.B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_PUBLIC_URL,
    process.env.ECOMMERCE_ADMIN_API_URL,
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`distributor:${ip}`, FORM_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const body = await req.json();

  const turnstile = await verifyTurnstileToken(body?.turnstileToken, ip);
  if (!turnstile.success) {
    return NextResponse.json(
      { message: 'Security check failed. Please complete the verification and try again.' },
      { status: 400 },
    );
  }

  if (!body.name || !body.email || !body.business) {
    return NextResponse.json({ message: 'Name, email and business name are required.' }, { status: 400 });
  }

  // Don't forward the captcha token downstream.
  delete body.turnstileToken;

  const res = await fetch(`${WP_API}/prag-core/v1/distributor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const adminUrl = resolveB2BAdminUrl();
  if (res.ok) {
    let syncedToAdmin = false;

    if (adminUrl) {
      try {
        const intakeRes = await fetch(`${adminUrl}/api/admin/b2b/intake`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...body,
            kind: 'distributor',
            route: '/distributor',
            company: body.business,
          }),
        });
        syncedToAdmin = intakeRes.ok;
      } catch {
        syncedToAdmin = false;
      }
    }

    if (!syncedToAdmin && process.env.NODE_ENV !== 'production') {
      try {
        await persistDistributorLocally(body as Record<string, unknown>);
      } catch {
        // Ignore local persistence failures so the public submission still succeeds.
      }
    }
  }

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || 'Submission failed. Please try again.' },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}

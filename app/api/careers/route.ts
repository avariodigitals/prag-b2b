import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

type LocalSubmissionRecord = {
  id: string;
  kind: 'careers';
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

async function persistCareersLocally(body: Record<string, unknown>) {
  const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
  const raw = await fs.readFile(localStorePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    careerApplications?: LocalSubmissionRecord[];
    audit?: Array<{ id?: string; at?: string; actor?: string; action?: string; target?: string; details?: string }>;
  };

  const record: LocalSubmissionRecord = {
    id: randomId(),
    kind: 'careers',
    status: 'new',
    name: String(body?.name ?? ''),
    email: String(body?.email ?? ''),
    phone: body?.phone ? String(body.phone) : undefined,
    company: body?.position ? String(body.position) : undefined,
    subject: body?.position ? `Position: ${String(body.position)}` : 'Careers Application',
    message: String(body?.message ?? ''),
    source: 'public-form',
    route: '/careers',
    createdAt: new Date().toISOString(),
  };

  const careerApplications = Array.isArray(parsed.careerApplications) ? parsed.careerApplications : [];
  const audit = Array.isArray(parsed.audit) ? parsed.audit : [];

  const next = {
    ...parsed,
    careerApplications: [record, ...careerApplications].slice(0, 500),
    audit: [
      {
        id: randomId(),
        at: new Date().toISOString(),
        actor: record.email || 'public-form',
        action: 'create',
        target: 'careers application',
        details: 'Received via /careers',
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
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email || !body.phone || !body.position) {
    return NextResponse.json(
      { message: 'Name, email, phone and position are required.' },
      { status: 400 }
    );
  }

  const message = [
    `Careers Application`,
    `Position: ${body.position}`,
    `Location: ${body.location || 'Not provided'}`,
    `Experience: ${body.experience || 'Not provided'}`,
    `Education: ${body.education || 'Not provided'}`,
    `Portfolio/Resume: ${body.portfolio || 'Not provided'}`,
    '',
    'Cover Letter:',
    body.coverLetter || 'Not provided',
  ].join('\n');

  const wpBody = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: `Careers Application: ${body.position}`,
    message,
    route: '/careers',
  };

  const res = await fetch(`${WP_API}/prag-core/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wpBody),
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
            ...wpBody,
            kind: 'careers',
            route: '/careers',
            company: body.position,
          }),
        });
        syncedToAdmin = intakeRes.ok;
      } catch {
        syncedToAdmin = false;
      }
    }

    if (!syncedToAdmin && !process.env.VERCEL) {
      try {
        await persistCareersLocally(body as Record<string, unknown>);
      } catch {
        // Ignore local persistence failures so public submission still succeeds.
      }
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data?.message || 'Submission failed. Please try again.' },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}

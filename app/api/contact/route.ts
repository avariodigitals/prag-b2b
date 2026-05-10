import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

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

async function persistContactLocally(body: Record<string, unknown>) {
  const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
  const raw = await fs.readFile(localStorePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    enquiries?: LocalSubmissionRecord[];
    audit?: Array<{ id?: string; at?: string; actor?: string; action?: string; target?: string; details?: string }>;
  };

  const record: LocalSubmissionRecord = {
    id: randomId(),
    kind: 'contact',
    status: 'new',
    name: String(body?.name ?? ''),
    email: String(body?.email ?? ''),
    phone: body?.phone ? String(body.phone) : undefined,
    company: body?.company ? String(body.company) : undefined,
    subject: body?.subject ? String(body.subject) : undefined,
    message: String(body?.message ?? ''),
    source: 'public-form',
    route: '/contact',
    createdAt: new Date().toISOString(),
  };

  const enquiries = Array.isArray(parsed.enquiries) ? parsed.enquiries : [];
  const audit = Array.isArray(parsed.audit) ? parsed.audit : [];

  const next = {
    ...parsed,
    enquiries: [record, ...enquiries].slice(0, 500),
    audit: [
      {
        id: randomId(),
        at: new Date().toISOString(),
        actor: record.email || 'public-form',
        action: 'create',
        target: 'contact enquiry',
        details: 'Received via /contact',
      },
      ...audit,
    ].slice(0, 1000),
  };

  await fs.writeFile(localStorePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
    const res = await fetch(`${wpUrl}/prag-core/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const adminUrl = process.env.B2B_ADMIN_API_URL || process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL;
    if (res.ok) {
      let syncedToAdmin = false;

      if (adminUrl) {
        try {
          const intakeRes = await fetch(`${adminUrl.replace(/\/$/, '')}/api/admin/b2b/intake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...body, kind: 'contact', route: '/contact' }),
          });
          syncedToAdmin = intakeRes.ok;
        } catch {
          syncedToAdmin = false;
        }
      }

      if (!syncedToAdmin) {
        try {
          await persistContactLocally(body as Record<string, unknown>);
        } catch {
          // Ignore local persistence failures so public submission still succeeds.
        }
      }
    }

    return NextResponse.json({ success: res.ok }, { status: res.ok ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

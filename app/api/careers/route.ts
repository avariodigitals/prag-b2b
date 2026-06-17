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
  location?: string;
  position?: string;
  experience?: string;
  education?: string;
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
    location: body?.location ? String(body.location) : undefined,
    position: body?.position ? String(body.position) : undefined,
    experience: body?.experience ? String(body.experience) : undefined,
    education: body?.education ? String(body.education) : undefined,
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
    process.env.ECOMMERCE_ADMIN_API_URL,
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

async function fileToBase64(file: File): Promise<{ base64: string; filename: string; type: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    base64: buffer.toString('base64'),
    filename: file.name,
    type: file.type || 'application/octet-stream',
  };
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const phone = String(formData.get('phone') ?? '');
  const location = String(formData.get('location') ?? '');
  const position = String(formData.get('position') ?? '');
  const experience = String(formData.get('experience') ?? '');
  const education = String(formData.get('education') ?? '');
  const coverLetter = String(formData.get('coverLetter') ?? '');

  if (!name || !email || !phone || !position) {
    return NextResponse.json(
      { message: 'Name, email, phone and position are required.' },
      { status: 400 }
    );
  }

  const cvFile = formData.get('cv') as File | null;
  let cvPayload: { base64: string; filename: string; type: string } | undefined;
  if (cvFile && cvFile.size > 0) {
    cvPayload = await fileToBase64(cvFile);
  }

  const message = [
    `Careers Application`,
    `Position: ${position}`,
    `Location: ${location || 'Not provided'}`,
    `Experience: ${experience || 'Not provided'}`,
    `Education: ${education || 'Not provided'}`,
    `CV/Resume: ${cvPayload ? cvPayload.filename : 'Not provided'}`,
    '',
    'Cover Letter:',
    coverLetter || 'Not provided',
  ].join('\n');

  const wpBody = {
    name,
    email,
    phone,
    subject: `Careers Application: ${position}`,
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
            company: position,
            location,
            experience,
            education,
            ...(cvPayload && { cvBase64: cvPayload.base64, cvFilename: cvPayload.filename, cvType: cvPayload.type }),
          }),
        });
        syncedToAdmin = intakeRes.ok;
      } catch {
        syncedToAdmin = false;
      }
    }

    if (!syncedToAdmin && !process.env.VERCEL) {
      try {
        await persistCareersLocally({
          name, email, phone, location, position, experience, education, coverLetter, message,
        });
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

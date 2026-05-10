import { NextResponse } from 'next/server';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email || !body.business) {
    return NextResponse.json({ message: 'Name, email and business name are required.' }, { status: 400 });
  }

  const res = await fetch(`${WP_API}/prag-core/v1/distributor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const adminUrl = process.env.B2B_ADMIN_API_URL || process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL;
  if (res.ok && adminUrl) {
    try {
      await fetch(`${adminUrl.replace(/\/$/, '')}/api/admin/b2b/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          kind: 'distributor',
          route: '/distributor',
          company: body.business,
        }),
      });
    } catch {
      // Ignore admin sync failures so the public submission still succeeds.
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

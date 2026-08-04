import { NextRequest, NextResponse } from 'next/server';

function isAllowedHost(host: string) {
  const normalized = host.toLowerCase();
  const allowed = (process.env.B2B_404_ALLOWED_HOSTS ?? 'localhost,127.0.0.1,prag.global').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.some((item) => normalized === item || normalized.endsWith(`.${item}`));
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { source?: string; host?: string };
    const source = String(body.source ?? '').trim();
    const host = String(body.host ?? '').trim();

    if (!source.startsWith('/') || !host || !isAllowedHost(host)) {
      return NextResponse.json({ success: false, ignored: true });
    }

    const adminUrl = process.env.B2B_ADMIN_API_URL || process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL;
    
    if (adminUrl) {
      try {
        await fetch(`${adminUrl.replace(/\/$/, '')}/api/admin/b2b/redirect-hit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, host }),
        });
      } catch {
        // Ignore admin sync errors
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
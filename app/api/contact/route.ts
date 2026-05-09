import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
    const res = await fetch(`${wpUrl}/prag-core/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: res.ok }, { status: res.ok ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

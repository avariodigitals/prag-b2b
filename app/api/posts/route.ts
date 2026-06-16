import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const page = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('per_page') || '10');

  const data = await getPosts({ perPage, category, page });
  return NextResponse.json(data);
}

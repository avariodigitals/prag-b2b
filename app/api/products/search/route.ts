import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/woocommerce';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get('q') ?? '').trim();
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit') ?? 8), 1), 12);

  if (!query) {
    return NextResponse.json(
      { products: [] },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' } }
    );
  }

  const products = await searchProducts(query);

  return NextResponse.json(
    { products: products.slice(0, limit) },
    { headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate=60' } }
  );
}

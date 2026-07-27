import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/woocommerce';

export const runtime = 'nodejs';

const KNOWN_IDS: Record<string, number> = {
  'inverters': 314,
  'solar': 320,
  'batteries': 327,
  'all-prag-stabilizers': 321,
  'voltage-stabilizers': 322,
  'thyristor-stabilizers': 349,
  'relay-voltage-stabilizers': 323,
  'servo-voltage-stabilizers': 324,
  'advanced-stabilizers': 338,
  'hybrid-inverters': 319,
  'heavy-duty-inverters': 315,
  'pure-sine-wave-inverters': 316,
  'solar-panels': 326,
  'solar-charge-controllers': 325,
  'protective-device': 340,
  'tubular-batteries': 348,
  'lithium-batteries': 344,
  'battery-rack': 339,
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const categorySlug = sp.get('category') ?? '';
  const sub = sp.get('sub');
  const page = Number(sp.get('page') ?? 2);
  const per_page = Number(sp.get('per_page') ?? 16);

  const activeSlug = sub ?? categorySlug;
  const category_id = KNOWN_IDS[activeSlug];

  let products: Product[] = [];
  let total = 0;
  try {
    const result = await getProducts({
      category_id,
      per_page,
      page,
      orderby: 'title',
      order: 'asc',
    });
    products = result.products;
    total = result.total;
  } catch {
    products = [];
    total = 0;
  }

  return NextResponse.json(
    { products, hasMore: page * per_page < total },
    { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=120' } }
  );
}

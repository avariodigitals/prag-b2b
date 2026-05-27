import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export const runtime = 'nodejs';

const KNOWN_IDS: Record<string, number> = {
  'inverters': 117,
  'solar': 147,
  'batteries': 151,
  'all-prag-stabilizers': 144,
  'voltage-stabilizers': 144,
  'thyristor-stabilizers': 266,
  'relay-voltage-stabilizers': 167,
  'servo-voltage-stabilizers': 168,
  'advanced-stabilizers': 178,
  'hybrid-inverters': 171,
  'heavy-duty-inverters': 165,
  'pure-sine-inverters': 203,
  'solar-panels': 169,
  'solar-charge-controllers': 170,
  'protective-device': 261,
  'tubular-batteries': 220,
  'lithium-battery': 240,
  'battery-rack': 179,
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const categorySlug = sp.get('category') ?? '';
  const sub = sp.get('sub');
  const page = Number(sp.get('page') ?? 2);
  const per_page = Number(sp.get('per_page') ?? 16);

  const activeSlug = sub ?? categorySlug;
  const category_id = KNOWN_IDS[activeSlug];

  const { products, total } = await getProducts({
    category_id,
    per_page,
    page,
    orderby: 'title',
    order: 'asc',
  });

  return NextResponse.json(
    { products, hasMore: page * per_page < total },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } }
  );
}

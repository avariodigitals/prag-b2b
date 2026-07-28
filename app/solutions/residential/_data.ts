import type { Product } from '@/lib/woocommerce';
import { getCategories, getProducts } from '@/lib/woocommerce';

const KNOWN_CATEGORY_IDS: Record<string, number> = {
  inverters: 314,
  solar: 320,
  batteries: 327,
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

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function resolveCategoryId(codeOrSlug: string): Promise<number | undefined> {
  const normalized = normalize(codeOrSlug);
  const slugCandidate = slugify(codeOrSlug);

  if (KNOWN_CATEGORY_IDS[slugCandidate]) {
    return KNOWN_CATEGORY_IDS[slugCandidate];
  }

  const categories = await getCategories();

  const bySlug = categories.find((category) => normalize(category.slug) === normalized)
    ?? categories.find((category) => normalize(category.slug) === slugCandidate);
  if (bySlug) return bySlug.id;

  const byName = categories.find((category) => normalize(category.name) === normalized);
  if (byName) return byName.id;

  return undefined;
}

export async function getProductsForCategoryCode(codeOrSlug: string): Promise<Product[]> {
  const categoryId = await resolveCategoryId(codeOrSlug);
  if (!categoryId) return [];

  try {
    const { products } = await getProducts({
      category_id: categoryId,
      per_page: 100,
      page: 1,
      orderby: 'title',
      order: 'asc',
    });
    return products;
  } catch {
    return [];
  }
}

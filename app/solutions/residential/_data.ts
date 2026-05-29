import type { Product } from '@/lib/woocommerce';
import { getCategories, getProducts } from '@/lib/woocommerce';

const KNOWN_CATEGORY_IDS: Record<string, number> = {
  inverters: 117,
  batteries: 151,
  'all-prag-stabilizers': 144,
  'thyristor-stabilizers': 266,
  'relay-voltage-stabilizers': 167,
  'servo-voltage-stabilizers': 168,
  'advanced-stabilizers': 178,
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

  const { products } = await getProducts({
    category_id: categoryId,
    per_page: 100,
    page: 1,
    orderby: 'title',
    order: 'asc',
  });

  return products;
}

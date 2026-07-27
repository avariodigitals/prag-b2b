import { getProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/woocommerce';
import CompareView from '@/components/CompareView';

export const metadata = { title: 'Compare Products' };

export default async function ComparePage() {
  let products: Product[] = [];
  try {
    const result = await getProducts({ per_page: 100 });
    products = result.products;
  } catch {
    products = [];
  }
  return <CompareView products={products} />;
}

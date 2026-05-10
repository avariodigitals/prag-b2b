import { getProducts } from '@/lib/woocommerce';
import CompareView from '@/components/CompareView';

export const metadata = { title: 'Compare Products' };

export default async function ComparePage() {
  const { products } = await getProducts({ per_page: 100 });
  return <CompareView products={products} />;
}

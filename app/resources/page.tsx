export const dynamic = 'force-dynamic';

import TechResourcesView from '@/components/TechResourcesView';
import { getProducts } from '@/lib/woocommerce';

export const metadata = { title: 'Technical Resources' };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { products } = await getProducts({ per_page: 100 });

  const allowedCategoryKeywords = ['solar', 'inverter', 'battery', 'stabilizer', 'stablizer'];
  const filteredProducts = products.filter((product) =>
    product.categories?.some((category) => {
      const normalizedName = category.name.toLowerCase();
      const normalizedSlug = category.slug.toLowerCase();
      return allowedCategoryKeywords.some(
        (keyword) => normalizedName.includes(keyword) || normalizedSlug.includes(keyword)
      );
    })
  );

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-6 md:px-10 pt-14 pb-10 bg-stone-50 flex flex-col items-center gap-4 text-center">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat']">
          Product Documentation &amp; Technical Guides
        </h1>
        <p className="text-sky-700 text-lg md:text-xl font-['Montserrat'] max-w-lg">
          Download detailed specifications, installation manuals, and technical documentation for all PRAG products.
        </p>
      </div>
      <TechResourcesView products={filteredProducts} selectedSlug={sp.product} />
    </main>
  );
}

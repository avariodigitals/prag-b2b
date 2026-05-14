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
      <div className="w-full px-6 md:px-20 breadcrumb-hero-shell bg-stone-50 flex flex-col items-center gap-4 text-center">
        <h1 className="breadcrumb-title-lock">
          Product Documentation &amp; Technical Guides
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px]">
          Download detailed specifications, installation manuals, and technical documentation for all PRAG products.
        </p>
      </div>
      <TechResourcesView products={filteredProducts} selectedSlug={sp.product} />
    </main>
  );
}

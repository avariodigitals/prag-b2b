export const revalidate = 300;

import { Suspense } from 'react';
import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/wordpress';

export const metadata = {
  title: 'Knowledge Center',
  description: 'Practical guides, honest comparisons, and expert insights from PRAG\'s engineering team.',
};

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function KnowledgeCenterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [{ posts }, categories] = await Promise.all([
    getPosts({ perPage: 10, category: sp.category, page: sp.page ? Number(sp.page) : 1 }),
    getPostCategories(),
  ]);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full bg-stone-50 flex flex-col items-center gap-4 px-6 md:px-20 breadcrumb-hero-shell">
        {/* Figma: Onest 28px 700 #0166a5 on mobile */}
        <h1 className="text-[28px] md:text-[48px] font-bold font-['Onest'] text-[#0166a5] leading-tight text-center max-w-2xl">
          Understand Power.<br />Make Better Decisions.
        </h1>
        <p className="text-[#0166a5] text-[16px] md:text-[18px] font-normal font-['Space_Grotesk'] leading-[1.4] max-w-[531px] text-center">
          Practical guides, honest comparisons, and expert insights from PRAG&apos;s engineering team — written for Nigerian conditions.
        </p>
      </div>
      <Suspense>
        <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
      </Suspense>
    </main>
  );
}

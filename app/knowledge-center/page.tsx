export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/wordpress';

export const metadata = {
  title: 'Knowledge Center – Prag B2B',
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
      <div className="w-full pt-10 md:pt-20 pb-8 bg-stone-50 flex flex-col items-center gap-4 px-4">
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Onest'] text-center">
          Understand Power.<br />Make Better Decisions.
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-base font-normal font-['Space_Grotesk']">
          Practical guides, honest comparisons, and expert insights from PRAG&apos;s engineering team — written for Nigerian conditions.
        </p>
      </div>
      <Suspense>
        <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
      </Suspense>
    </main>
  );
}

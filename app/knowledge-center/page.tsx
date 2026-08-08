export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/wordpress';
import { HIDDEN_KNOWLEDGE_SLUGS } from '@/lib/seoTaxonomy';

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description: 'Practical guides, honest comparisons, and expert insights from PRAG\'s engineering team.',
  alternates: { canonical: 'https://www.prag.global/knowledge-center' },
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

  // Filter out obsolete/excluded and redirected articles (e.g. 55977-2
  // "Our Past Projects" → /installations) so they never appear as cards.
  const filteredPosts = posts.filter((p) => !HIDDEN_KNOWLEDGE_SLUGS.has(p.slug));
  const featured = filteredPosts[0] ?? null;
  const rest = filteredPosts.slice(1);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full bg-stone-50 flex flex-col items-center gap-4 px-6 md:px-10 lg:px-20 breadcrumb-hero-shell">
        <h1 className="breadcrumb-title-lock text-center max-w-2xl">
          Understand Power.<br />Make Better Decisions.
        </h1>
        <p className="breadcrumb-description-lock max-w-[531px] text-center">
          Practical guides, honest comparisons, and expert insights from PRAG&apos;s engineering team — written for Nigerian conditions.
        </p>
      </div>
      <Suspense>
        <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
      </Suspense>
    </main>
  );
}

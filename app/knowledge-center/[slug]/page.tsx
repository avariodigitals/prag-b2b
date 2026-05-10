import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug, getPostCategories, getPosts, postImage, postDate, stripHtml } from '@/lib/wordpress';
import type { WPPost, WPCategory } from '@/lib/wordpress';

interface Props {
  params: Promise<{ slug: string }>;
}

function sanitize(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '');
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article – Prag B2B' };
  return {
    title: `${stripHtml(post.title.rendered)} – Prag B2B`,
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
  };
}

export default async function KnowledgeCenterPost({ params }: Props) {
  const { slug } = await params;

  const [post, categories, { posts: recentPosts }] = await Promise.all([
    getPostBySlug(slug),
    getPostCategories(),
    getPosts({ perPage: 4 }),
  ]);

  if (!post) notFound();

  const img = postImage(post);
  const catName = (categories as WPCategory[]).find((c) => post.categories.includes(c.id))?.name ?? 'Article';
  const related = recentPosts.filter((p: WPPost) => p.slug !== slug).slice(0, 3);

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-6 md:px-10 pt-8 pb-6 bg-stone-50 max-w-6xl mx-auto flex flex-col gap-3">
        <Link href="/knowledge-center" className="flex items-center gap-2 text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Center
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-xs font-medium font-['Space_Grotesk']">{catName}</span>
          <span className="text-zinc-400 text-sm font-['Space_Grotesk']" suppressHydrationWarning>{postDate(post)}</span>
        </div>
        <h1
          className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight"
          dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
        />
      </div>

      {/* Content */}
      <div className="w-full px-6 md:px-10 py-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {img && (
          <div className="relative w-full h-56 md:h-[420px] rounded-2xl overflow-hidden">
            <Image src={img} alt={stripHtml(post.title.rendered)} fill sizes="(max-width: 768px) 100vw, 1280px" className="object-cover" priority />
          </div>
        )}
        <article
          className="prose prose-zinc max-w-none text-zinc-700 text-base md:text-lg font-['Space_Grotesk'] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitize(post.content.rendered) }}
        />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="w-full px-6 md:px-10 py-8 border-t border-zinc-100 max-w-6xl mx-auto flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Onest']">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p: WPPost) => {
              const rImg = postImage(p);
              return (
                <Link key={p.id} href={`/knowledge-center/${p.slug}`} className="flex flex-col gap-3 group">
                  {rImg && (
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <Image src={rImg} alt={stripHtml(p.title.rendered)} fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <h3
                    className="text-zinc-900 text-base font-medium font-['Onest'] line-clamp-2 group-hover:text-sky-700 transition-colors"
                    dangerouslySetInnerHTML={{ __html: sanitize(p.title.rendered) }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

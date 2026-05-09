'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { WPPost, WPCategory } from '@/lib/wordpress';
import { postImage, postDate, stripHtml, readTime } from '@/lib/wordpress';

function sanitize(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '');
}

interface Props {
  featured: WPPost | null;
  posts: WPPost[];
  categories: WPCategory[];
  activeCategory?: string;
}

export default function BlogGrid({ featured, posts, categories, activeCategory }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('page');
    router.push(`/knowledge-center?${params.toString()}`);
  }

  const rows: WPPost[][] = [];
  for (let i = 0; i < posts.length; i += 3) rows.push(posts.slice(i, i + 3));

  return (
    <div className="w-full px-4 md:px-20 py-8 md:py-16 flex flex-col gap-8 md:gap-10">

      {/* Featured post */}
      {featured && (
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-zinc-500/20">
          {postImage(featured) && (
            <div className="relative w-full md:w-[540px] h-56 md:h-[380px] shrink-0">
              <Image
                src={postImage(featured)!}
                alt={featured.title.rendered}
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="flex-1 p-6 bg-white flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-sm font-medium font-['Space_Grotesk']">
                  {categories.find((c) => featured.categories.includes(c.id))?.name ?? 'Power Guide'}
                </span>
                <span className="text-neutral-700 text-sm font-['Onest']" suppressHydrationWarning>{readTime(featured)}</span>
                <span className="text-sky-700 text-sm font-['Onest']" suppressHydrationWarning>{postDate(featured)}</span>
              </div>
              <h2
                className="text-zinc-900 text-2xl md:text-3xl font-medium font-['Onest']"
                dangerouslySetInnerHTML={{ __html: sanitize(featured.title.rendered) }}
              />
              <p className="text-neutral-700 text-base md:text-lg font-['Onest'] line-clamp-3">
                {stripHtml(featured.excerpt.rendered)}
              </p>
            </div>
            <Link
              href={`/knowledge-center/${featured.slug}`}
              className="flex items-center gap-2 text-sky-700 text-base font-['Onest'] hover:underline mt-auto"
            >
              Read full Article <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setCategory(undefined)}
          className={`px-5 py-2.5 rounded-3xl text-sm font-medium font-['Space_Grotesk'] transition-colors ${!activeCategory ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(String(cat.id))}
            className={`px-5 py-2.5 rounded-3xl text-sm font-medium font-['Space_Grotesk'] transition-colors ${activeCategory === String(cat.id) ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Article grid */}
      {posts.length === 0 ? (
        <p className="text-zinc-400 text-lg font-['Space_Grotesk'] text-center py-10">No articles found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {row.map((post) => {
                const img = postImage(post);
                const catName = categories.find((c) => post.categories.includes(c.id))?.name ?? 'Article';
                return (
                  <div key={post.id} className="rounded-2xl flex flex-col overflow-hidden border border-zinc-500/20">
                    {img && (
                      <div className="relative h-52 shrink-0">
                        <Image src={img} alt={post.title.rendered} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                      </div>
                    )}
                    <div className="px-5 py-5 bg-white flex flex-col gap-4 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-xs font-medium font-['Space_Grotesk']">{catName}</span>
                        <span className="text-neutral-700 text-xs font-['Onest']" suppressHydrationWarning>{readTime(post)}</span>
                      </div>
                      <h3
                        className="text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
                      />
                      <p className="text-neutral-700 text-sm font-['Onest'] line-clamp-2">
                        {stripHtml(post.excerpt.rendered)}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <Link
                          href={`/knowledge-center/${post.slug}`}
                          className="flex items-center gap-1.5 text-sky-700 text-sm font-['Onest'] hover:underline"
                        >
                          Read full Article <ArrowRight className="w-4 h-4" />
                        </Link>
                        <span className="text-zinc-500 text-xs font-['Onest']" suppressHydrationWarning>{postDate(post)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

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

  const getCatName = (post: WPPost) =>
    categories.find((c) => post.categories.includes(c.id))?.name ?? 'Power Guide';

  return (
    <div className="w-full px-6 md:px-20 py-8 md:py-16">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-10">

        {/* ── Featured post ── */}
        {featured && (
          <>
            {/* Mobile: full-height overlay card (Figma: h=376px, overlay style) */}
            <div className="md:hidden relative rounded-2xl overflow-hidden h-[376px]">
              <img
                src={postImage(featured) || ''}
                alt={featured.title.rendered}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top: category badge + read time + date */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-[#0166a5] text-white text-[14px] font-medium font-['Space_Grotesk']">
                    {getCatName(featured)}
                  </span>
                  <span className="text-white text-[14px] font-normal font-['Onest']" suppressHydrationWarning>
                    {readTime(featured)}
                  </span>
                  <span className="text-white text-[14px] font-normal font-['Onest']" suppressHydrationWarning>
                    {postDate(featured)}
                  </span>
                </div>
                {/* Bottom: title + excerpt + link */}
                <div className="flex flex-col gap-2">
                  <h2
                    className="text-white text-[18px] font-medium font-['Onest'] line-clamp-3 leading-snug"
                    dangerouslySetInnerHTML={{ __html: sanitize(featured.title.rendered) }}
                  />
                  <p className="text-white/70 text-[14px] font-normal font-['Onest'] line-clamp-2 leading-relaxed">
                    {stripHtml(featured.excerpt.rendered)}
                  </p>
                  <Link
                    href={`/knowledge-center/${featured.slug}`}
                    className="flex items-center gap-2 text-[#0166a5] text-[14px] font-normal font-['Onest'] hover:gap-3 transition-all"
                  >
                    Read full Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop: image-left layout */}
            <div className="hidden md:flex flex-row rounded-2xl overflow-hidden border border-zinc-500/20">
              {postImage(featured) && (
                <div className="relative w-[540px] h-[380px] shrink-0">
                  <img
                    src={postImage(featured)!}
                    alt={featured.title.rendered}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-6 bg-white flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="px-2.5 py-1 bg-[#0166a5] rounded-full text-white text-sm font-medium font-['Space_Grotesk']">
                      {getCatName(featured)}
                    </span>
                    <span className="text-neutral-700 text-base font-['Onest']" suppressHydrationWarning>{readTime(featured)}</span>
                    <span className="text-[#0166a5] text-base font-['Onest']" suppressHydrationWarning>{postDate(featured)}</span>
                  </div>
                  <h2
                    className="text-zinc-900 text-2xl md:text-3xl font-medium font-['Onest']"
                    dangerouslySetInnerHTML={{ __html: sanitize(featured.title.rendered) }}
                  />
                  <p className="text-neutral-700 text-base font-['Onest'] line-clamp-3">
                    {stripHtml(featured.excerpt.rendered)}
                  </p>
                </div>
                <Link
                  href={`/knowledge-center/${featured.slug}`}
                  className="flex items-center gap-1 text-[#0166a5] text-base font-bold font-['Onest'] hover:gap-2 transition-all mt-auto"
                >
                  Read full Article <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── Category filter — scrollable on mobile ── */}
        <div className="-mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-4 min-w-max md:min-w-0 md:flex-wrap">
            <button
              onClick={() => setCategory(undefined)}
              className={`shrink-0 px-5 py-2 rounded-full text-[16px] font-medium font-['Space_Grotesk'] transition-colors ${
                !activeCategory
                  ? 'bg-[#0166a5] text-white'
                  : 'bg-white border border-[#1a1a1a] text-[#444444] hover:border-[#0166a5] hover:text-[#0166a5]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(String(cat.id))}
                className={`shrink-0 px-5 py-2 rounded-full text-[16px] font-medium font-['Space_Grotesk'] transition-colors ${
                  activeCategory === String(cat.id)
                    ? 'bg-[#0166a5] text-white'
                    : 'bg-white border border-[#1a1a1a] text-[#444444] hover:border-[#0166a5] hover:text-[#0166a5]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Article list ── */}
        {posts.length === 0 ? (
          <p className="text-zinc-400 text-lg font-['Onest'] text-center py-10">No articles found.</p>
        ) : (
          /* Mobile: 1 col stacked; Desktop: 3-col grid */
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
            {posts.map((post) => {
              const img = postImage(post);
              const catName = getCatName(post);
              return (
                <div key={post.id} className="flex flex-col">
                  {/* Image — top-only rounded corners (Figma: border-radius 16px 16px 0 0) */}
                  {img && (
                    <div className="relative h-[229px] md:h-52 shrink-0 rounded-t-[16px] overflow-hidden">
                      <img
                        src={img}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {/* Content — bottom-only rounded, side+bottom border (no top border) */}
                  <div className="flex flex-col gap-4 px-4 pt-5 pb-4 rounded-b-[16px] border-b border-l border-r border-[rgba(136,136,136,0.4)] flex-1">
                    {/* Category badge + read time */}
                    <div className="flex items-center gap-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#0166a5] text-white text-[14px] font-medium font-['Space_Grotesk']">
                        {catName}
                      </span>
                      <span className="text-[#444444] text-[14px] font-normal font-['Onest']" suppressHydrationWarning>
                        {readTime(post)}
                      </span>
                    </div>
                    {/* Title */}
                    <h3
                      className="text-[#1a1a1a] text-[18px] font-medium font-['Onest'] line-clamp-2 leading-snug"
                      dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
                    />
                    {/* Excerpt */}
                    <p className="text-[#444444] text-[14px] font-normal font-['Onest'] line-clamp-2 leading-relaxed">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                    {/* Read link + date */}
                    <div className="flex items-center justify-between mt-auto">
                      <Link
                        href={`/knowledge-center/${post.slug}`}
                        className="flex items-center gap-2 text-[#0166a5] text-[14px] font-normal font-['Onest'] hover:gap-3 transition-all"
                      >
                        Read full Article <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[#888888] text-[14px] font-normal font-['Onest']" suppressHydrationWarning>
                        {postDate(post)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

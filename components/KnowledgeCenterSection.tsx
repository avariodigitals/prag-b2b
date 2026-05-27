import Link from 'next/link';
import { getPosts, getPostCategories, postImage, postDate, readTime, stripHtml, type WPPost, type WPCategory } from '@/lib/wordpress';
import { findB2BPage, findVisibleSectionsByType, getB2BPublicContent } from '@/lib/b2bContent';

function sanitize(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '');
}

function PostCard({ post, categories }: { post: WPPost; categories: WPCategory[] }) {
  const img = postImage(post);
  const cat = categories.find(c => post.categories.includes(c.id));
  const secondaryCat = categories.find(c => post.categories.includes(c.id) && c.id !== cat?.id);

  return (
    <div className="rounded-2xl flex flex-col overflow-hidden bg-white border border-zinc-200">
      {img && (
        <div className="relative h-48 shrink-0 overflow-hidden">
          <img
            src={img}
            alt={post.title.rendered}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="px-5 py-5 bg-white flex flex-col gap-3 flex-1">
        {/* Category + read time */}
        <div className="flex items-center gap-3 flex-wrap">
          {cat && (
            <span className="inline-flex items-center justify-center gap-[10px] px-3 py-1 rounded-[24px] bg-[#0166A5] text-white text-xs font-medium [font-family:var(--font-space-grotesk)] leading-normal">
              {cat.name}
            </span>
          )}
          {secondaryCat && (
            <span className="text-[#787878] text-sm font-normal font-['Onest'] leading-normal">{secondaryCat.name}</span>
          )}
          {!secondaryCat && (
            <span className="text-[#787878] text-sm font-normal font-['Onest'] leading-normal" suppressHydrationWarning>
              {readTime(post)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-black text-[20px] font-medium font-['Onest'] leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
        />

        {/* Excerpt */}
        <p className="text-[#787878] text-[14px] font-normal font-['Onest'] leading-normal line-clamp-2 flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>

        {/* Date */}
        <span className="text-[#0166A5] text-[14px] font-normal font-['Onest'] leading-normal" suppressHydrationWarning>
          {postDate(post)}
        </span>
      </div>
    </div>
  );
}

export default async function KnowledgeCenterSection() {
  const [{ posts }, categories, b2bContent] = await Promise.all([getPosts({ perPage: 3 }), getPostCategories(), getB2BPublicContent()]);
  const homepage = findB2BPage(b2bContent, '/');
  const headerSection = findVisibleSectionsByType(homepage, 'knowledge-header')[0];
  const header = {
    kicker: headerSection?.kicker?.trim() || headerSection?.title?.trim() || 'Knowledge Center',
    title: headerSection?.summary?.trim() || 'Power Insights & Expert Guides',
    ctaLabel: headerSection?.ctaLabel?.trim() || 'View all articles',
    ctaHref: headerSection?.ctaHref?.trim() || '/knowledge-center',
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-12 md:py-16 px-4 sm:px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 md:gap-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-3">
            {/* Kicker */}
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-[#0166A5] shrink-0" aria-hidden="true" />
              <span className="text-black text-[14px] font-normal [font-family:var(--font-space-grotesk)] uppercase tracking-wide">
                {header.kicker}
              </span>
            </div>
            {/* Title */}
            <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1.1] tracking-[-2px]">
              {header.title}
            </h2>
          </div>
        </div>

        {/* Cards */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map(post => (
              <Link key={post.id} href={`/knowledge-center/${post.slug}`} className="group">
                <PostCard post={post} categories={categories} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center py-10 font-['Onest']">No articles found.</p>
        )}

        <Link
          href={header.ctaHref}
          className="px-6 py-4 bg-[#0166A5] rounded-3xl inline-flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors min-w-[200px] self-center"
        >
          <span className="text-white text-base font-medium [font-family:var(--font-space-grotesk)]">
            {header.ctaLabel}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

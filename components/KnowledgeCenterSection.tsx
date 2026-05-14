import Link from 'next/link';
import { getPosts, getPostCategories, postImage, postDate, readTime, stripHtml, type WPPost, type WPCategory } from '@/lib/wordpress';

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
  const [{ posts }, categories] = await Promise.all([getPosts({ perPage: 3 }), getPostCategories()]);

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
                Knowledge Center
              </span>
            </div>
            {/* Title */}
            <h2 className="text-black text-[28px] sm:text-[34px] md:text-[48px] font-bold font-['Onest'] leading-[1.1] tracking-[-2px]">
              Power Insights &amp; Expert Guides
            </h2>
            {/* View all link — shown below title on mobile */}
            <Link
              href="/knowledge-center"
              className="md:hidden inline-flex items-center gap-[10px] text-[#0166A5] text-[16px] font-normal font-['Onest'] leading-normal hover:gap-3 transition-all w-fit"
            >
              <span>View all articles</span>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M1 5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 1.5L12.5 5 8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* View all — desktop only (aligned to bottom-right) */}
          <Link
            href="/knowledge-center"
            className="hidden md:inline-flex items-center gap-[10px] text-[#0166A5] text-base font-normal font-['Onest'] hover:gap-3 transition-all shrink-0 mb-1"
          >
            <span>View all articles</span>
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M1 5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 1.5L12.5 5 8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
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
      </div>
    </section>
  );
}

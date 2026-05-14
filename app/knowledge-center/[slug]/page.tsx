import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPostBySlug,
  getPostCategories,
  getPosts,
  postImage,
  postDate,
  stripHtml,
  readTime,
} from '@/lib/wordpress';
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

function postDateLong(post: WPPost): string {
  return new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" />
    </svg>
  );
}

function RelatedCard({
  post,
  categories,
}: {
  post: WPPost;
  categories: WPCategory[];
}) {
  const img = postImage(post);
  const catName =
    categories.find((c) => post.categories.includes(c.id))?.name ?? 'Article';

  return (
    <Link href={`/knowledge-center/${post.slug}`} className="flex flex-col group">
      {/* Image */}
      <div className="relative h-[229px] rounded-t-[16px] overflow-hidden bg-stone-100 shrink-0">
        {img && (
          <img
            src={img}
            alt={stripHtml(post.title.rendered)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-b-[16px] border-b border-l border-r border-[rgba(136,136,136,0.4)] flex-1">
        <div className="flex flex-col gap-4">
          {/* Badge + read time */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[14px] font-medium font-['Space_Grotesk'] rounded-xl">
              {catName}
            </span>
            <span className="text-[#888888] text-[14px] font-normal font-['Onest']">
              {readTime(post)}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-[#1a1a1a] text-[24px] font-medium font-['Onest'] leading-snug line-clamp-2"
            dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
          />

          {/* Excerpt */}
          <p className="text-[#444444] text-[18px] font-normal font-['Onest'] leading-relaxed line-clamp-3">
            {stripHtml(post.excerpt.rendered)}
          </p>
        </div>

        {/* Date */}
        <span className="text-[#0166a5] text-[16px] font-normal font-['Onest'] mt-auto">
          {postDate(post)}
        </span>
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article' };
  return {
    title: stripHtml(post.title.rendered),
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
  const catName =
    (categories as WPCategory[]).find((c) => post.categories.includes(c.id))?.name ?? 'Article';
  const related = recentPosts
    .filter((p: WPPost) => p.slug !== slug)
    .slice(0, 3);

  const title = stripHtml(post.title.rendered);
  const shareUrl = `https://prag.global/knowledge-center/${slug}`;

  return (
    <main className="w-full bg-white flex flex-col">

      {/* ── Breadcrumb + Title ── */}
      <div className="w-full px-6 md:px-20 pt-8 pb-8">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-5">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
            <Link
              href="/knowledge-center"
              className="text-[#0166a5] text-[24px] font-medium font-['Onest'] leading-none hover:underline"
            >
              Blogs
            </Link>
            <svg
              width="8"
              height="18"
              viewBox="0 0 8 18"
              fill="none"
              className="shrink-0 text-[#888888]"
              aria-hidden="true"
            >
              <path
                d="M1 1L7 9L1 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#888888] text-[16px] font-normal font-['Space_Grotesk'] line-clamp-1 flex-1 min-w-0">
              {title}
            </span>
          </nav>

          {/* Article Title */}
          <h1
            className="text-[#1a1a1a] text-[28px] md:text-[40px] font-medium font-['Onest'] leading-tight"
            dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
          />
        </div>
      </div>

      {/* ── 2-column: Content + Sidebar ── */}
      <div className="w-full px-6 md:px-20 pb-16">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start">

          {/* Left: Article Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 md:pr-[31px]">

            {/* Feature image */}
            {img && (
              <img
                src={img}
                alt={title}
                className="w-full object-cover"
                style={{ borderRadius: 0 }}
              />
            )}

            {/* Article body */}
            <article
              className="article-body"
              dangerouslySetInnerHTML={{ __html: sanitize(post.content.rendered) }}
            />
          </div>

          {/* Vertical divider */}
          <div
            className="hidden md:block w-px bg-[#888888]/30 self-stretch shrink-0"
            aria-hidden="true"
          />

          {/* Right: Sidebar */}
          <div className="w-full md:w-[308px] shrink-0 md:pl-[36px] mt-8 md:mt-0">
            <div className="bg-[#f9f9f9] rounded-[16px] p-4 flex flex-col gap-4">

              {/* Category row */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#eeeeee]">
                <span className="text-[#888888] text-[18px] font-medium font-['Space_Grotesk'] shrink-0">
                  Category:
                </span>
                <span className="text-[#444444] text-[16px] font-medium font-['Space_Grotesk'] text-right">
                  {catName}
                </span>
              </div>

              {/* Date row */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#eeeeee]">
                <span className="text-[#888888] text-[18px] font-medium font-['Space_Grotesk'] shrink-0">
                  Date:
                </span>
                <span className="text-[#444444] text-[16px] font-medium font-['Space_Grotesk'] text-right">
                  {postDateLong(post)}
                </span>
              </div>

              {/* Share to row */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#888888] text-[18px] font-medium font-['Space_Grotesk'] shrink-0">
                  Share to
                </span>
                <div className="flex items-center gap-3 text-[#444444]">
                  <a
                    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="hover:text-[#0166a5] transition-colors"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/pragpowerng"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on Instagram"
                    className="hover:text-[#0166a5] transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="hover:text-[#0166a5] transition-colors"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Latest Articles ── */}
      {related.length > 0 && (
        <div className="w-full px-6 md:px-20 py-16">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-8">

            {/* Section header */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#0166a5] shrink-0" aria-hidden="true" />
                <span className="text-[#1a1a1a] text-[16px] font-medium font-['Space_Grotesk'] uppercase tracking-wide">
                  Other Articles
                </span>
              </div>
              <h2 className="text-[#1a1a1a] text-[32px] md:text-[48px] font-bold font-['Onest'] tracking-[-2px] leading-tight">
                Related Latest Articles
              </h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p: WPPost) => (
                <RelatedCard key={p.id} post={p} categories={categories as WPCategory[]} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import Image from 'next/image';
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
    <div className="rounded-xl flex flex-col overflow-hidden border border-zinc-200 bg-white">
      {img && (
        <div className="relative h-44 shrink-0">
          <Image src={img} alt={post.title.rendered} fill sizes="(max-width: 768px) 100vw, 411px" className="object-cover" />
        </div>
      )}
      <div className="px-4 py-4 bg-white flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          {cat && (
            <span className="inline-flex items-center justify-center gap-[10px] px-2 py-1 rounded-[24px] bg-[#0166A5] text-white text-[12px] font-medium font-['Onest'] leading-normal">
              {cat.name}
            </span>
          )}
          {secondaryCat && (
            <span className="text-[#787878] text-[18px] font-normal font-['Onest'] leading-normal">{secondaryCat.name}</span>
          )}
          {!secondaryCat && (
            <span className="text-[#787878] text-[18px] font-normal font-['Onest'] leading-normal" suppressHydrationWarning>{readTime(post)}</span>
          )}
        </div>
        <h3
          className="text-black text-[24px] font-medium font-['Onest'] leading-normal line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
        />
        <p className="text-[#787878] text-[18px] font-normal font-['Onest'] leading-normal line-clamp-2 flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <span className="text-[#0166A5] text-[16px] font-normal font-['Onest'] leading-normal" suppressHydrationWarning>
          {postDate(post)}
        </span>
      </div>
    </div>
  );
}

export default async function KnowledgeCenterSection() {
  const [{ posts }, categories] = await Promise.all([getPosts({ perPage: 3 }), getPostCategories()]);

  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sky-700 rounded-[1px] shrink-0" />
            <span className="text-black text-[16px] font-normal [font-family:var(--font-space-grotesk)] uppercase leading-normal">
              Knowledge Center
            </span>
          </div>
          <h2 className="text-black text-3xl md:text-[48px] font-bold font-['Onest'] leading-normal tracking-[-2px]">
            Power Insights &amp; Expert Guides
          </h2>
        </div>
        <Link
          href="/knowledge-center"
          className="hidden md:flex items-center gap-1 self-start md:self-end md:mt-12 text-sky-700 text-base font-normal font-['Onest'] hover:gap-2 transition-all shrink-0"
        >
          View all articles →
        </Link>
      </div>

      {/* Cards */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map(post => (
            <Link key={post.id} href={`/knowledge-center/${post.slug}`} className="group">
              <PostCard post={post} categories={categories} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-center py-10 font-['Onest']">No articles found.</p>
      )}

      {/* Mobile view all */}
      <div className="flex md:hidden justify-center mt-8">
        <Link
          href="/knowledge-center"
          className="flex items-center gap-1 text-sky-700 text-base font-normal font-['Onest'] hover:gap-2 transition-all"
        >
          View all articles →
        </Link>
      </div>
      </div>
    </section>
  );
}

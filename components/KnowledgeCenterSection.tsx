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
    <div className="rounded-2xl flex flex-col overflow-hidden border border-zinc-200">
      {img && (
        <div className="relative h-52 shrink-0">
          <Image src={img} alt={post.title.rendered} fill sizes="(max-width: 768px) 100vw, 411px" className="object-cover" />
        </div>
      )}
      <div className="px-6 py-6 bg-white flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          {cat && (
            <span className="px-3 py-1 bg-sky-700 rounded-full text-white text-xs font-semibold font-['Montserrat']">
              {cat.name}
            </span>
          )}
          {secondaryCat && (
            <span className="text-zinc-600 text-base md:text-lg font-['Montserrat']">{secondaryCat.name}</span>
          )}
          {!secondaryCat && (
            <span className="text-zinc-500 text-base md:text-lg font-['Montserrat']" suppressHydrationWarning>{readTime(post)}</span>
          )}
        </div>
        <h3
          className="text-zinc-900 text-xl font-semibold font-['Montserrat'] line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }}
        />
        <p className="text-neutral-600 text-base md:text-lg font-['Montserrat'] line-clamp-2 flex-1">
          {stripHtml(post.excerpt.rendered)}
        </p>
        <span className="text-sky-700 text-base md:text-lg font-['Montserrat']" suppressHydrationWarning>
          {postDate(post)}
        </span>
      </div>
    </div>
  );
}

export default async function KnowledgeCenterSection() {
  const [{ posts }, categories] = await Promise.all([getPosts({ perPage: 3 }), getPostCategories()]);

  return (
    <section className="w-full bg-[#f3f4f6] py-16 px-6 md:px-20">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" />
            <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">
              Knowledge Center
            </span>
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-bold font-['Montserrat'] leading-tight">
            Power Insights &amp; Expert Guides
          </h2>
        </div>
        <Link
          href="/knowledge-center"
          className="hidden md:flex items-center gap-1 text-sky-700 text-base font-bold font-['Montserrat'] hover:gap-2 transition-all mt-4 shrink-0"
        >
          View all articles →
        </Link>
      </div>

      {/* Cards */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/knowledge-center/${post.slug}`} className="group">
              <PostCard post={post} categories={categories} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-center py-10 font-['Montserrat']">No articles found.</p>
      )}

      {/* Mobile view all */}
      <div className="flex md:hidden justify-center mt-8">
        <Link
          href="/knowledge-center"
          className="flex items-center gap-1 text-sky-700 text-base font-bold font-['Montserrat'] hover:gap-2 transition-all"
        >
          View all articles →
        </Link>
      </div>
    </section>
  );
}

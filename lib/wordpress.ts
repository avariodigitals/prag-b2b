const WP_BASE = `${process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json'}/wp/v2`;

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  categories: number[];
  _embedded?: { 'wp:featuredmedia'?: [{ source_url: string; alt_text: string }] };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export function postImage(post: WPPost): string | null {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}

export function postDate(post: WPPost): string {
  return new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export function readTime(post: WPPost): string {
  const words = stripHtml(post.content?.rendered ?? post.excerpt.rendered).split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))}min read`;
}

export async function getPosts({
  perPage = 10,
  category,
  page = 1,
}: { perPage?: number; category?: string; page?: number } = {}): Promise<{ posts: WPPost[]; total: number }> {
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      _embed: '1',
    });
    if (category) params.set('categories', category);
    const res = await fetch(`${WP_BASE}/posts?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return { posts: [], total: 0 };
    const total = Number(res.headers.get('X-WP-Total') ?? 0);
    return { posts: await res.json(), total };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_BASE}/posts?slug=${slug}&_embed=1`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPostCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${WP_BASE}/categories?per_page=20&hide_empty=true`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

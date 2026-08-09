// PRAG Step 11 — Fetch complete Knowledge Center inventory from WordPress
//
// Fetches every published KC article with:
//   - WP Post ID, title, slug, status, dates, author, categories, tags
//   - Featured image, excerpt, full body content
//   - Yoast SEO title, meta description, focus keyphrase
//   - Rendered SEO title + meta description from live site
//   - Word count, H1, H2 structure, internal/external links, images
//
// Output: scripts/out/step11-kc-inventory.json
//
// Run from prag-b2b root:
//   node scripts/step11-fetch-kc-inventory.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
const envText = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const WP_API_URL = env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WP_BASE = WP_API_URL.replace('/wp-json', '');
const SITE_BASE = env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';
const WP_APP_USER = env.WP_APP_USER;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;
const authHeader = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64');

const OUT_DIR = path.join(__dirname, 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Helpers ──────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function extractH1s(html) {
  const matches = [];
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push(stripHtml(m[1]));
  }
  return matches;
}

function extractH2s(html) {
  const matches = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push(stripHtml(m[1]));
  }
  return matches;
}

function extractLinks(html) {
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    links.push({ href: m[1], anchorText: stripHtml(m[2]) });
  }
  return links;
}

function extractImages(html) {
  const images = [];
  const re = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    images.push({ src: m[1], alt: altMatch ? altMatch[1] : '' });
  }
  return images;
}

function wordCount(html) {
  const text = stripHtml(html);
  return text.split(/\s+/).filter(Boolean).length;
}

function isInternal(href, siteBase) {
  if (!href) return false;
  if (href.startsWith('/')) return true;
  try {
    const u = new URL(href);
    return u.hostname === new URL(siteBase).hostname || u.hostname === 'www.prag.global' || u.hostname === 'prag.global';
  } catch {
    return false;
  }
}

function isExternal(href, siteBase) {
  if (!href) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return false;
  if (href.startsWith('/')) return false;
  try {
    const u = new URL(href);
    const siteHost = new URL(siteBase).hostname;
    return u.hostname !== siteHost && u.hostname !== 'www.prag.global' && u.hostname !== 'prag.global';
  } catch {
    return false;
  }
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

// ─── Fetch all published posts ─────────────────────────────────────────────

async function fetchAllPosts() {
  const base = `${WP_API_URL}/wp/v2/posts`;
  const params = new URLSearchParams({
    per_page: '100',
    page: '1',
    status: 'publish',
    _embed: '1',
    context: 'view',
  });

  console.log('Fetching posts page 1...');
  const first = await fetchJson(`${base}?${params}`);
  if (!first || !first.ok) {
    throw new Error(`Failed to fetch posts: ${first ? first.status : 'network error'}`);
  }

  const firstData = await first.json();
  const total = Number(first.headers.get('X-WP-Total') ?? firstData.length);
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');
  console.log(`  Total posts: ${total}, Total pages: ${totalPages}`);

  let allPosts = [...firstData];

  for (let page = 2; page <= totalPages; page++) {
    console.log(`Fetching posts page ${page}...`);
    const p = new URLSearchParams({ ...params, page: String(page) });
    const res = await fetchJson(`${base}?${p}`);
    if (res && res.ok) {
      allPosts = [...allPosts, ...(await res.json())];
    }
  }

  return allPosts;
}

// ─── Fetch all categories ──────────────────────────────────────────────────

async function fetchAllCategories() {
  const base = `${WP_API_URL}/wp/v2/categories?per_page=100&_embed=1`;
  const res = await fetchJson(base);
  if (!res || !res.ok) return [];
  return res.json();
}

// ─── Fetch all tags ─────────────────────────────────────────────────────────

async function fetchAllTags() {
  const base = `${WP_API_URL}/wp/v2/tags?per_page=100`;
  const res = await fetchJson(base);
  if (!res || !res.ok) return [];
  return res.json();
}

// ─── Fetch Yoast SEO for a post ────────────────────────────────────────────

async function fetchYoastSeo(postId) {
  if (!postId) return null;
  const res = await fetchJson(`${WP_BASE}/wp-json/prag-core/v1/post-seo/${postId}`);
  if (!res || !res.ok) return null;
  const data = await res.json();
  return {
    seo_title: data.seo_title || '',
    meta_description: data.meta_description || '',
    focus_keyphrase: data.focus_keyphrase || '',
  };
}

// ─── Fetch rendered SEO from live site ─────────────────────────────────────

async function fetchRenderedSeo(slug) {
  const url = `${SITE_BASE}/knowledge-center/${slug}`;
  const res = await fetchJson(url, { redirect: 'manual' });
  if (!res) return { url, status: 0, seoTitle: '', metaDescription: '', canonical: '' };

  const status = res.status;
  // Don't try to parse HTML for redirects/404s
  if (status === 308 || status === 301 || status === 302 || status === 307 || status === 404) {
    const loc = res.headers.get('location') || '';
    return { url, status, redirectLocation: loc, seoTitle: '', metaDescription: '', canonical: '' };
  }
  if (!res.ok) return { url, status, seoTitle: '', metaDescription: '', canonical: '' };

  const html = await res.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);

  return {
    url,
    status,
    seoTitle: titleMatch ? titleMatch[1].trim() : '',
    metaDescription: metaDescMatch ? metaDescMatch[1].trim() : '',
    canonical: canonicalMatch ? canonicalMatch[1].trim() : '',
    ogTitle: ogTitleMatch ? ogTitleMatch[1].trim() : '',
    robots: robotsMatch ? robotsMatch[1].trim() : '',
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== PRAG Step 11 — Knowledge Center Inventory ===\n');
  console.log(`WP API: ${WP_API_URL}`);
  console.log(`Site:   ${SITE_BASE}\n`);

  // 1. Fetch categories and tags (for mapping)
  const [categories, tags] = await Promise.all([fetchAllCategories(), fetchAllTags()]);
  const categoryMap = new Map(categories.map((c) => [c.id, { id: c.id, name: c.name, slug: c.slug }]));
  const tagMap = new Map(tags.map((t) => [t.id, { id: t.id, name: t.name, slug: t.slug }]));
  console.log(`Categories: ${categories.length}, Tags: ${tags.length}\n`);

  // 2. Fetch all published posts
  const posts = await fetchAllPosts();
  console.log(`\nTotal published posts fetched: ${posts.length}\n`);

  // 3. For each post, fetch Yoast SEO + rendered SEO + analyze content
  const inventory = [];
  let idx = 0;

  for (const post of posts) {
    idx++;
    const slug = post.slug;
    console.log(`[${idx}/${posts.length}] Processing: ${slug}`);

    // Categories
    const postCategories = (post.categories || []).map((id) => categoryMap.get(id)).filter(Boolean);
    // Tags
    const postTags = (post.tags || []).map((id) => tagMap.get(id)).filter(Boolean);
    // Author
    const author = post._embedded?.author?.[0]?.name ?? '';
    // Featured image
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const featuredImage = featuredMedia?.source_url ?? null;
    const featuredImageAlt = featuredMedia?.alt_text ?? '';

    // Content analysis
    const contentHtml = post.content?.rendered ?? '';
    const wc = wordCount(contentHtml);
    const h1s = extractH1s(contentHtml);
    const h2s = extractH2s(contentHtml);
    const allLinks = extractLinks(contentHtml);
    const internalLinks = allLinks.filter((l) => isInternal(l.href, SITE_BASE));
    const externalLinks = allLinks.filter((l) => isExternal(l.href, SITE_BASE));
    const images = extractImages(contentHtml);

    // Yoast SEO
    const yoast = await fetchYoastSeo(post.id);

    // Rendered SEO from live site
    const rendered = await fetchRenderedSeo(slug);

    const entry = {
      wpPostId: post.id,
      title: stripHtml(post.title?.rendered ?? ''),
      titleRendered: post.title?.rendered ?? '',
      slug,
      canonicalUrl: `${SITE_BASE}/knowledge-center/${slug}`,
      status: post.status,
      datePublished: post.date,
      dateModified: post.modified,
      author,
      categories: postCategories,
      tags: postTags,
      featuredImage,
      featuredImageAlt,
      excerpt: stripHtml(post.excerpt?.rendered ?? ''),
      excerptRendered: post.excerpt?.rendered ?? '',
      bodyContent: contentHtml,
      yoastSeoTitle: yoast?.seo_title ?? '',
      yoastMetaDescription: yoast?.meta_description ?? '',
      yoastFocusKeyphrase: yoast?.focus_keyphrase ?? '',
      renderedSeoTitle: rendered.seoTitle,
      renderedMetaDescription: rendered.metaDescription,
      renderedCanonical: rendered.canonical,
      renderedRobots: rendered.robots,
      renderedStatus: rendered.status,
      renderedRedirect: rendered.redirectLocation ?? null,
      h1: h1s,
      h2: h2s,
      wordCount: wc,
      internalLinks,
      externalLinks,
      images,
    };

    inventory.push(entry);
  }

  // 4. Save inventory
  const outPath = path.join(OUT_DIR, 'step11-kc-inventory.json');
  fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2));
  console.log(`\n=== Inventory saved to ${outPath} ===`);
  console.log(`Total articles: ${inventory.length}`);

  // 5. Save categories + tags metadata
  const metaPath = path.join(OUT_DIR, 'step11-kc-metadata.json');
  fs.writeFileSync(metaPath, JSON.stringify({ categories, tags }, null, 2));
  console.log(`Metadata saved to ${metaPath}`);

  // 6. Reconciliation summary
  const redirected = inventory.filter((a) => a.renderedStatus === 308 || a.renderedStatus === 301);
  const notFound = inventory.filter((a) => a.renderedStatus === 404);
  const okArticles = inventory.filter((a) => a.renderedStatus === 200);

  console.log(`\n=== Reconciliation ===`);
  console.log(`Total published KC posts in WordPress: ${inventory.length}`);
  console.log(`Rendered 200 (indexable): ${okArticles.length}`);
  console.log(`Rendered redirect (308/301): ${redirected.length}`);
  console.log(`Rendered 404: ${notFound.length}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

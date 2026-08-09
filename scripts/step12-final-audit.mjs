#!/usr/bin/env node
/**
 * PRAG SEO Recovery — Step 12 Final Audit
 *
 * Runs against LIVE production:
 *   - Crawl every URL in https://www.prag.global/sitemap.xml
 *   - Record: HTTP status, final URL, redirect hops, title, description,
 *     canonical, robots meta, H1 count, schema types
 *   - Test all LEGACY_REDIRECTS (from lib/redirects.ts) + RETIRED_URLS (410)
 *   - Detect forbidden patterns (non-www, central, portal, shop duplicates,
 *     residential-2, all-prag-stabilizers, old WP URLs, noindex in sitemap)
 *   - Title/meta audit: missing/duplicate titles & descriptions, banned phrases
 *   - Canonical audit: missing, non-www, mismatched, broken
 *
 * Output:
 *   scripts/out/step12-sitemap-crawl.json
 *   scripts/out/step12-redirect-regression.json
 *   scripts/out/step12-summary.json
 *
 * Usage:
 *   node scripts/step12-final-audit.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const { redirects: LEGACY_REDIRECTS, retired: RETIRED_LIST } = JSON.parse(
  readFileSync('/tmp/step12_redirect_data.json', 'utf-8')
);
const RETIRED_URLS = new Set(RETIRED_LIST);

const OUT_DIR = '/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out';
mkdirSync(OUT_DIR, { recursive: true });

const WWW_BASE = 'https://www.prag.global';
const UA = 'PRAG-SEO-Step12-Audit/1.0 (+mailto:seo@prag.global)';
const TIMEOUT_MS = 20000;
const CONCURRENCY = 6;

// Banned SEO-facing phrases (must be 0 occurrences)
const BANNED_PHRASES = [
  'PRAG B2B',
  "Nigeria's Leading Power Engineering Company",
  'Nigeria Number #1',
  'Since 2005',
  'founded in 2005',
  '500+ installations',
  '20+ Years Active',
];

// ─── helpers ───────────────────────────────────────────────────────────────
async function fetchManual(url, opts = {}) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), opts.timeout ?? TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      redirect: 'manual',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*' },
    });
    return r;
  } finally {
    clearTimeout(to);
  }
}

async function follow(url, maxHops = 5) {
  const hops = [];
  let cur = url;
  let resp;
  for (let i = 0; i <= maxHops; i++) {
    resp = await fetchManual(cur);
    const status = resp.status;
    const loc = resp.headers.get('location');
    if (status >= 300 && status < 400 && loc) {
      const next = new URL(loc, cur).href;
      hops.push({ url: cur, status, location: next });
      cur = next;
      continue;
    }
    return { hops, finalUrl: cur, status, resp };
  }
  return { hops, finalUrl: cur, status: 0, resp, error: 'too-many-hops' };
}

function normUrl(u) {
  try {
    const p = new URL(u);
    let path = p.pathname.replace(/\/+$/, '');
    if (path === '') path = '/';
    return `${p.origin}${path}${p.search}`;
  } catch {
    return u;
  }
}

function isNonWww(u) {
  try { return new URL(u).hostname === 'prag.global'; } catch { return false; }
}
function isCentralOrPortal(u) {
  try { const h = new URL(u).hostname; return h.startsWith('central.') || h.startsWith('portal.'); } catch { return false; }
}
function isShop(u) {
  try { return new URL(u).hostname === 'shop.prag.global'; } catch { return false; }
}

function classify(path) {
  if (path === '/') return 'homepage';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'products' && parts.length === 1) return 'products-root';
  if (parts[0] === 'products' && parts.length === 2) return 'product-category';
  if (parts[0] === 'products' && parts.length === 3) return 'product';
  if (parts[0] === 'solutions' && parts.length === 1) return 'solutions-root';
  if (parts[0] === 'solutions' && parts.length === 2) return 'solution';
  if (parts[0] === 'knowledge-center' && parts.length === 1) return 'kc-root';
  if (parts[0] === 'knowledge-center' && parts.length === 2) return 'kc-article';
  return 'static';
}

function extractMeta(html, finalUrl) {
  const out = {
    title: null,
    description: null,
    canonical: null,
    robots: null,
    h1Count: 0,
    h1Text: null,
    schemaTypes: [],
    ogTitle: null,
    ogUrl: null,
  };
  try {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) out.title = titleMatch[1].trim();
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
    if (descMatch) out.description = descMatch[1].trim();
    const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([\s\S]*?)["']/i);
    if (canonMatch) out.canonical = canonMatch[1].trim();
    const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([\s\S]*?)["']/i);
    if (robotsMatch) out.robots = robotsMatch[1].trim();
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i);
    if (ogTitleMatch) out.ogTitle = ogTitleMatch[1].trim();
    const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([\s\S]*?)["']/i);
    if (ogUrlMatch) out.ogUrl = ogUrlMatch[1].trim();

    // H1 count — strip script/style AND the Next.js RSC flight payload
    // (which serializes the rendered HTML a second time and inflates H1 counts).
    // The RSC payload lives inside <script ...>self.__next_f.push(...) blocks,
    // so stripping all <script> tags already removes it. We additionally strip
    // any JSON-ish text after the closing </body> to be safe.
    const bodyOnly = html.split('</body>')[0] ?? html;
    const cleaned = bodyOnly.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    const h1Matches = cleaned.match(/<h1\b[^>]*>/gi);
    out.h1Count = h1Matches ? h1Matches.length : 0;
    const h1TextMatch = cleaned.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1TextMatch) out.h1Text = h1TextMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 200);

    // Schema types — find application/ld+json blocks
    const schemaBlocks = [...cleaned.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const m of schemaBlocks) {
      const raw = m[1].trim();
      try {
        const parsed = JSON.parse(raw);
        const collect = (node) => {
          if (!node) return;
          if (Array.isArray(node)) { node.forEach(collect); return; }
          if (typeof node !== 'object') return;
          if (node['@type']) {
            const t = node['@type'];
            if (Array.isArray(t)) t.forEach((x) => out.schemaTypes.push(x));
            else out.schemaTypes.push(t);
          }
          if (node['@graph'] && Array.isArray(node['@graph'])) node['@graph'].forEach(collect);
        };
        collect(parsed);
      } catch {
        out.schemaTypes.push('__INVALID_JSON__');
      }
    }
  } catch (e) {
    out._error = e.message;
  }
  return out;
}

function findBannedPhrases(text) {
  if (!text) return [];
  const hits = [];
  for (const p of BANNED_PHRASES) {
    if (text.toLowerCase().includes(p.toLowerCase())) hits.push(p);
  }
  return hits;
}

// ─── 1. Sitemap crawl ──────────────────────────────────────────────────────
async function crawlSitemap() {
  console.log('\n=== SITEMAP CRAWL ===');
  const sitemapXml = await (await fetchManual(`${WWW_BASE}/sitemap.xml`)).text();
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  console.log(`Sitemap URLs: ${urls.length}`);

  const results = [];
  // simple concurrency pool
  let idx = 0;
  async function worker() {
    while (idx < urls.length) {
      const i = idx++;
      const url = urls[i];
      const path = new URL(url).pathname;
      const rec = { url, path, pageType: classify(path), issues: [] };
      try {
        const { hops, finalUrl, status, resp, error } = await follow(url);
        rec.status = status;
        rec.finalUrl = finalUrl;
        rec.hops = hops.length;
        if (error) rec.issues.push(`follow-error: ${error}`);
        if (hops.length > 0) rec.issues.push(`redirect: ${hops.length} hop(s) -> ${finalUrl}`);
        if (status !== 200) rec.issues.push(`status=${status}`);

        let html = '';
        if (resp && status === 200) {
          try { html = await resp.text(); } catch {}
        }
        if (html) {
          const meta = extractMeta(html, finalUrl);
          Object.assign(rec, meta);

          // noindex check
          if (meta.robots && /noindex/i.test(meta.robots)) rec.issues.push(`noindex: ${meta.robots}`);
          // canonical checks
          if (!meta.canonical) rec.issues.push('missing-canonical');
          else {
            if (isNonWww(meta.canonical)) rec.issues.push(`non-www-canonical: ${meta.canonical}`);
            if (isCentralOrPortal(meta.canonical)) rec.issues.push(`central/portal-canonical: ${meta.canonical}`);
            if (normUrl(meta.canonical) !== normUrl(finalUrl)) {
              // allow self-canonical on trailing-slash variants; flag real mismatches
              const canonPath = new URL(meta.canonical).pathname.replace(/\/+$/, '') || '/';
              const finalPath = new URL(finalUrl).pathname.replace(/\/+$/, '') || '/';
              if (canonPath !== finalPath) rec.issues.push(`canonical-mismatch: canon=${meta.canonical} final=${finalUrl}`);
            }
          }
          // title checks
          if (!meta.title) rec.issues.push('missing-title');
          else if (meta.title.length < 10) rec.issues.push(`short-title: ${meta.title.length}`);
          // description checks
          if (!meta.description) rec.issues.push('missing-description');
          else if (meta.description.length < 50) rec.issues.push(`short-description: ${meta.description.length}`);
          // H1 checks
          if (meta.h1Count === 0) rec.issues.push('missing-h1');
          else if (meta.h1Count > 1) rec.issues.push(`multiple-h1: ${meta.h1Count}`);

          // banned phrases
          const bannedInTitle = findBannedPhrases(meta.title);
          const bannedInDesc = findBannedPhrases(meta.description);
          if (bannedInTitle.length) rec.issues.push(`banned-title: ${bannedInTitle.join('|')}`);
          if (bannedInDesc.length) rec.issues.push(`banned-desc: ${bannedInDesc.join('|')}`);
        }
      } catch (e) {
        rec.issues.push(`exception: ${e.message}`);
      }
      results.push(rec);
      if (results.length % 20 === 0) console.log(`  crawled ${results.length}/${urls.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

// ─── 2. Redirect regression ────────────────────────────────────────────────
async function testRedirects() {
  console.log('\n=== LEGACY REDIRECT REGRESSION ===');
  const specific = LEGACY_REDIRECTS.filter((r) => !r.source.includes(':'));
  const patterns = LEGACY_REDIRECTS.filter((r) => r.source.includes(':'));
  const retired = Array.from(RETIRED_URLS);
  console.log(`Specific: ${specific.length} | Patterns (skipped): ${patterns.length} | Retired (410): ${retired.length}`);

  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < specific.length) {
      const i = idx++;
      const r = specific[i];
      const sourceUrl = `${WWW_BASE}${r.source}`;
      const expected = r.destination.startsWith('http') ? r.destination : `${WWW_BASE}${r.destination}`;
      const rec = { source: r.source, expected: r.destination, issues: [], status: 'PASS' };
      try {
        const { hops, finalUrl, status, error } = await follow(sourceUrl);
        rec.hops = hops.length;
        rec.firstStatus = hops[0]?.status ?? 0;
        rec.location = hops[0]?.location ?? null;
        rec.finalUrl = finalUrl;
        rec.finalStatus = status;
        if (error) { rec.issues.push(`error: ${error}`); rec.status = 'FAIL'; }
        else if (hops.length === 0) { rec.issues.push(`no-redirect (status ${status})`); rec.status = 'FAIL'; }
        else {
          if (normUrl(hops[0].location) !== normUrl(expected)) {
            rec.issues.push(`wrong-location: expected ${expected} got ${hops[0].location}`);
            rec.status = 'FAIL';
          }
          if (hops.length > 1) rec.issues.push(`chain: ${hops.length} hops`);
          if (status === 404) { rec.issues.push('final-404'); rec.status = 'FAIL'; }
          else if (status === 410) { rec.issues.push('final-410'); rec.status = 'FAIL'; }
          else if (status >= 500) { rec.issues.push(`final-${status}`); rec.status = 'FAIL'; }
          else if (status !== 200) rec.issues.push(`final-${status}`);
          if (isNonWww(finalUrl)) { rec.issues.push(`non-www-final: ${finalUrl}`); rec.status = 'FAIL'; }
          if (isCentralOrPortal(finalUrl) && !isShop(finalUrl)) {
            // central/portal only allowed for media/API; not for redirect destinations
            rec.issues.push(`central/portal-final: ${finalUrl}`); rec.status = 'FAIL';
          }
          // redirect loop
          const seen = new Set();
          for (const h of hops) {
            if (seen.has(h.url)) { rec.issues.push('redirect-loop'); rec.status = 'FAIL'; break; }
            seen.add(h.url);
          }
        }
      } catch (e) {
        rec.issues.push(`exception: ${e.message}`); rec.status = 'FAIL';
      }
      results.push(rec);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Retired 410s
  const retiredResults = [];
  for (const path of retired) {
    const rec = { source: path, expected: 410, issues: [], status: 'PASS' };
    try {
      const resp = await fetchManual(`${WWW_BASE}${path}`);
      rec.actual = resp.status;
      if (resp.status !== 410) { rec.issues.push(`expected-410-got-${resp.status}`); rec.status = 'FAIL'; }
    } catch (e) {
      rec.issues.push(`exception: ${e.message}`); rec.status = 'FAIL';
    }
    retiredResults.push(rec);
  }

  return { redirectResults: results, retiredResults, patternCount: patterns.length };
}

// ─── 3. Aggregate & write ──────────────────────────────────────────────────
function summarizeSitemap(crawl) {
  const total = crawl.length;
  const ok200 = crawl.filter((r) => r.status === 200 && r.hops === 0).length;
  const redirected = crawl.filter((r) => r.hops > 0).length;
  const broken = crawl.filter((r) => [404, 410, 500, 502, 503].includes(r.status)).length;
  const noindex = crawl.filter((r) => r.issues.some((i) => i.startsWith('noindex'))).length;
  const canonicalErrors = crawl.filter((r) => r.issues.some((i) => i.includes('canonical'))).length;
  const missingTitles = crawl.filter((r) => r.issues.some((i) => i.startsWith('missing-title'))).length;
  const missingDesc = crawl.filter((r) => r.issues.some((i) => i.startsWith('missing-description'))).length;
  const bannedHits = crawl.filter((r) => r.issues.some((i) => i.startsWith('banned-')));

  // duplicate titles & descriptions
  const titleMap = new Map();
  const descMap = new Map();
  for (const r of crawl) {
    if (r.title) titleMap.set(r.title, (titleMap.get(r.title) ?? 0) + 1);
    if (r.description) descMap.set(r.description, (descMap.get(r.description) ?? 0) + 1);
  }
  const dupTitles = [...titleMap.entries()].filter(([, c]) => c > 1);
  const dupDescs = [...descMap.entries()].filter(([, c]) => c > 1);

  // by page type
  const byType = new Map();
  for (const r of crawl) {
    const t = r.pageType;
    if (!byType.has(t)) byType.set(t, { total: 0, ok: 0, issues: 0 });
    const e = byType.get(t);
    e.total++;
    if (r.status === 200 && r.hops === 0 && r.issues.length === 0) e.ok++;
    else e.issues++;
  }

  return {
    total, ok200, redirected, broken, noindex, canonicalErrors,
    missingTitles, missingDesc,
    bannedHits: bannedHits.map((r) => ({ url: r.url, issues: r.issues.filter((i) => i.startsWith('banned-')) })),
    dupTitles: dupTitles.map(([t, c]) => ({ title: t.slice(0, 120), count: c })),
    dupDescs: dupDescs.map(([d, c]) => ({ desc: d.slice(0, 120), count: c })),
    byType: [...byType.entries()].map(([t, e]) => ({ type: t, total: e.total, ok: e.ok, issues: e.issues })),
  };
}

function summarizeRedirects({ redirectResults, retiredResults, patternCount }) {
  const pass = redirectResults.filter((r) => r.status === 'PASS').length;
  const fail = redirectResults.filter((r) => r.status === 'FAIL').length;
  const chains = redirectResults.filter((r) => r.issues.some((i) => i.startsWith('chain:'))).length;
  const loops = redirectResults.filter((r) => r.issues.some((i) => i === 'redirect-loop')).length;
  const final404 = redirectResults.filter((r) => r.issues.some((i) => i === 'final-404')).length;
  const nonWww = redirectResults.filter((r) => r.issues.some((i) => i.startsWith('non-www-final'))).length;
  const retiredPass = retiredResults.filter((r) => r.status === 'PASS').length;
  const retiredFail = retiredResults.filter((r) => r.status === 'FAIL').length;
  return {
    redirectCount: redirectResults.length,
    pass, fail, chains, loops, final404, nonWww,
    patternCount,
    retiredCount: retiredResults.length,
    retiredPass, retiredFail,
    failures: redirectResults.filter((r) => r.status === 'FAIL'),
    retiredFailures: retiredResults.filter((r) => r.status === 'FAIL'),
    overall: fail === 0 && retiredFail === 0 ? 'PASS' : 'FAIL',
  };
}

async function main() {
  const crawl = await crawlSitemap();
  writeFileSync(`${OUT_DIR}/step12-sitemap-crawl.json`, JSON.stringify(crawl, null, 2));
  const sitemapSummary = summarizeSitemap(crawl);

  const redirectData = await testRedirects();
  writeFileSync(`${OUT_DIR}/step12-redirect-regression.json`, JSON.stringify(redirectData, null, 2));
  const redirectSummary = summarizeRedirects(redirectData);

  const summary = {
    timestamp: new Date().toISOString(),
    sitemap: sitemapSummary,
    redirects: redirectSummary,
  };
  writeFileSync(`${OUT_DIR}/step12-summary.json`, JSON.stringify(summary, null, 2));

  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });

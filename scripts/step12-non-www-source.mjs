#!/usr/bin/env node
/**
 * Step 12 — Find which pages contain the non-www and redirecting internal links.
 * Re-crawls sitemap pages and records the foundOn page for each flagged link.
 */
import { readFileSync, writeFileSync } from 'fs';

const WWW = 'https://www.prag.global';
const UA = 'PRAG-SEO-Step12-Audit/1.0';
const OUT = '/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out';

const linkReport = JSON.parse(readFileSync(`${OUT}/step12-internal-links.json`, 'utf-8'));
const flagged = new Set([
  ...linkReport.nonWwwLinks,
  ...linkReport.redirecting.map((r) => r.url),
]);

async function fetchText(url) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 20000);
    try {
      const r = await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': UA } });
      if (r.status !== 200) return '';
      return await r.text();
    } finally { clearTimeout(to); }
  } catch { return ''; }
}

function extractLinks(html, baseUrl) {
  const links = new Set();
  const re = /<a\b[^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try { links.add(new URL(href, baseUrl).href); } catch {}
  }
  return [...links];
}

async function main() {
  const sitemapXml = await (await fetch(`${WWW}/sitemap.xml`, { headers: { 'User-Agent': UA } })).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const foundOn = new Map(); // flaggedUrl -> [pages]
  for (const flaggedUrl of flagged) foundOn.set(flaggedUrl, []);

  let i = 0;
  for (const pageUrl of sitemapUrls) {
    const html = await fetchText(pageUrl);
    if (!html) { i++; continue; }
    const links = extractLinks(html, pageUrl);
    for (const link of links) {
      if (foundOn.has(link)) foundOn.get(link).push(pageUrl);
      // also normalise trailing slash for matching
      const noSlash = link.replace(/\/$/, '');
      if (foundOn.has(noSlash)) foundOn.get(noSlash).push(pageUrl);
    }
    i++;
    if (i % 25 === 0) console.log(`  sourced ${i}/${sitemapUrls.length}`);
  }

  const report = [...foundOn.entries()].map(([url, pages]) => ({ flaggedUrl: url, foundOn: [...new Set(pages)] }));
  writeFileSync(`${OUT}/step12-flagged-link-sources.json`, JSON.stringify(report, null, 2));
  console.log('\nFLAGGED LINK SOURCES:');
  for (const r of report) console.log(`  ${r.flaggedUrl}\n    found on: ${r.foundOn.length ? r.foundOn.join(', ') : '(not found in <a> — likely in schema/og or image src)'}`);
}
main().catch((e) => { console.error(e); process.exit(1); });

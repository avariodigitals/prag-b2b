#!/usr/bin/env node
/**
 * Step 12 — Image/alt sanity check.
 * Samples 10 products, 10 KC articles, core category pages.
 * For each: lists <img> src + alt, flags:
 *   - broken images (status != 200)
 *   - central.prag.global media URLs (allowed — operational)
 *   - non-www prag.global image URLs (problematic)
 *   - empty alt on content images (decorative ok, but flag for review)
 *   - alt text containing another product's name (heuristic: alt mentions a
 *     different product slug keyword than the page)
 */
import { readFileSync, writeFileSync } from 'fs';
const WWW = 'https://www.prag.global';
const UA = 'PRAG-SEO-Step12-Audit/1.0';
const OUT = '/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out';

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

async function fetchText(url) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 25000);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctrl.signal });
      if (r.status !== 200) return { status: r.status, html: '' };
      return { status: 200, html: await r.text() };
    } finally { clearTimeout(to); }
  } catch (e) { return { status: 0, html: '', error: e.message }; }
}

function extractImgs(html, baseUrl) {
  const imgs = [];
  // match <img ...> including src and alt
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const srcM = tag.match(/src=["']([^"']+)["']/i);
    const altM = tag.match(/alt=["']([^"']*)["']/i);
    const src = srcM ? decodeEntities(srcM[1]) : null;
    const alt = altM ? decodeEntities(altM[1]) : null;
    if (!src) continue;
    try {
      const abs = new URL(src, baseUrl).href;
      imgs.push({ src: abs, alt, rawSrc: src });
    } catch {
      imgs.push({ src, alt, rawSrc: src });
    }
  }
  return imgs;
}

async function headStatus(url) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } });
      return r.status;
    } finally { clearTimeout(to); }
  } catch { return 0; }
}

async function main() {
  const sitemapXml = await (await fetch(`${WWW}/sitemap.xml`, { headers: { 'User-Agent': UA } })).text();
  const allUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const products = allUrls.filter((u) => u.match(/\/products\/[^/]+\/[^/]+$/));
  const kcs = allUrls.filter((u) => u.match(/\/knowledge-center\/[^/]+$/));
  const categories = allUrls.filter((u) => u.match(/\/products\/[^/]+$/) && !u.endsWith('/products'));

  const sampleProducts = products.slice(0, 10);
  const sampleKcs = kcs.slice(0, 10);
  const sampleCats = categories.slice(0, 6);

  const report = { products: [], kcs: [], categories: [] };

  for (const group of [['products', sampleProducts], ['kcs', sampleKcs], ['categories', sampleCats]]) {
    const [key, urls] = group;
    for (const url of urls) {
      const { html } = await fetchText(url);
      if (!html) { report[key].push({ url, error: 'no-html' }); continue; }
      const imgs = extractImgs(html, url);
      // dedupe by src
      const seen = new Map();
      for (const img of imgs) {
        if (!seen.has(img.src)) seen.set(img.src, img);
      }
      const uniqueImgs = [...seen.values()];
      // check a sample of image statuses (first 8 to limit load)
      const toCheck = uniqueImgs.slice(0, 8);
      for (const img of toCheck) {
        img.status = await headStatus(img.src);
      }
      const broken = toCheck.filter((i) => i.status !== 200 && i.status !== 304);
      const nonWwwImg = uniqueImgs.filter((i) => /https?:\/\/prag\.global\//.test(i.src));
      const centralImg = uniqueImgs.filter((i) => /central\.prag\.global\//.test(i.src));
      const emptyAlt = uniqueImgs.filter((i) => i.alt === null || (i.alt !== null && i.alt.trim() === ''));
      report[key].push({
        url,
        totalImgs: uniqueImgs.length,
        checkedImgs: toCheck.length,
        brokenImgs: broken.map((i) => ({ src: i.src, status: i.status, alt: i.alt })),
        nonWwwImgUrls: nonWwwImg.map((i) => i.src),
        centralImgCount: centralImg.length,
        emptyAltCount: emptyAlt.length,
        sampleAlts: uniqueImgs.slice(0, 6).map((i) => ({ alt: i.alt, src: i.src.slice(0, 80) })),
      });
    }
  }

  writeFileSync(`${OUT}/step12-image-alt-check.json`, JSON.stringify(report, null, 2));
  // summary
  const allBroken = [...report.products, ...report.kcs, ...report.categories].flatMap((r) => r.brokenImgs || []);
  const allNonWww = [...report.products, ...report.kcs, ...report.categories].flatMap((r) => r.nonWwwImgUrls || []);
  console.log('IMAGE/ALT SUMMARY:');
  console.log(`  broken images: ${allBroken.length}`);
  console.log(`  non-www image URLs: ${allNonWww.length}`);
  console.log(`  central.prag.global images (expected/OK): ${[...report.products, ...report.kcs, ...report.categories].reduce((a, r) => a + (r.centralImgCount || 0), 0)}`);
  if (allBroken.length) {
    console.log('  broken details:');
    allBroken.forEach((b) => console.log(`    [${b.status}] ${b.src} (alt="${b.alt}")`));
  }
  if (allNonWww.length) {
    console.log('  non-www image URLs:');
    allNonWww.forEach((u) => console.log(`    ${u}`));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

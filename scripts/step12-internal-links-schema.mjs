#!/usr/bin/env node
/**
 * Step 12 — Internal-link crawl + schema validation.
 *
 * - Crawls the www homepage + all sitemap URLs, extracts every <a href>,
 *   classifies internal links, and reports:
 *     broken internal links (404/410/5xx)
 *     redirecting internal links (3xx)
 *     old WordPress links (/category/, /product-tag/, /?p=, /blog-2, etc.)
 *     non-www internal links
 *     accidental central/portal links
 *     accidental all-prag-stabilizers links
 * - Validates schema (JSON-LD) on representative pages:
 *     homepage (WebSite + Organization)
 *     product category (BreadcrumbList + Product list)
 *     product (Product + Offer + BreadcrumbList)
 *     KC article (Article + BreadcrumbList)
 *     solution (BreadcrumbList)
 *
 * Output:
 *   scripts/out/step12-internal-links.json
 *   scripts/out/step12-schema-validation.json
 */
import { readFileSync, writeFileSync } from 'fs';

const WWW = 'https://www.prag.global';
const UA = 'PRAG-SEO-Step12-Audit/1.0 (+mailto:seo@prag.global)';
const TIMEOUT = 20000;
const OUT = '/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out';

async function fetchManual(url) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    return await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': UA } });
  } finally { clearTimeout(to); }
}

async function fetchText(url) {
  const r = await fetchManual(url);
  if (r.status >= 300 && r.status < 400) return { status: r.status, html: '', redirect: r.headers.get('location') };
  if (r.status !== 200) return { status: r.status, html: '' };
  return { status: 200, html: await r.text() };
}

function extractLinks(html, baseUrl) {
  const links = new Set();
  const re = /<a\b[^>]*href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const abs = new URL(href, baseUrl).href;
      links.add(abs);
    } catch {}
  }
  return [...links];
}

function classifyLink(absUrl) {
  let kind = 'external';
  try {
    const u = new URL(absUrl);
    if (u.hostname === 'www.prag.global') kind = 'www-internal';
    else if (u.hostname === 'prag.global') kind = 'non-www';
    else if (u.hostname === 'shop.prag.global') kind = 'shop';
    else if (u.hostname === 'central.prag.global') kind = 'central';
    else if (u.hostname === 'portal.prag.global') kind = 'portal';
    else kind = 'external';
  } catch {}
  return kind;
}

function isOldWp(path) {
  return /\/category\//.test(path) || /\/product-tag\//.test(path) || /\/product-category\//.test(path) || /[?&]p=\d/.test(path) || /\/blog-2/.test(path) || /\/wp-/.test(path);
}

// ─── Internal-link crawl ───────────────────────────────────────────────────
async function crawlInternalLinks() {
  console.log('\n=== INTERNAL-LINK CRAWL ===');
  // Seed: homepage + sitemap URLs (we crawl the homepage deeply + sample others)
  const sitemapXml = await (await fetchManual(`${WWW}/sitemap.xml`)).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  // Collect all internal links found across all sitemap pages
  const allInternalLinks = new Map(); // url -> { foundOn: [] }
  const linkStatuses = new Map(); // url -> { status, checked }
  const oldWpLinks = new Set();
  const nonWwwLinks = new Set();
  const centralLinks = new Set();
  const portalLinks = new Set();
  const allPragStabilizersLinks = new Set();

  let processed = 0;
  for (const pageUrl of sitemapUrls) {
    const { html } = await fetchText(pageUrl);
    if (!html) { processed++; continue; }
    const links = extractLinks(html, pageUrl);
    for (const link of links) {
      const kind = classifyLink(link);
      if (kind === 'www-internal') {
        if (!allInternalLinks.has(link)) allInternalLinks.set(link, { foundOn: [] });
        allInternalLinks.get(link).foundOn.push(pageUrl);
        try {
          const p = new URL(link).pathname;
          if (isOldWp(p)) oldWpLinks.add(link);
          if (/all-prag-stabilizers/.test(p)) allPragStabilizersLinks.add(link);
        } catch {}
      } else if (kind === 'non-www') nonWwwLinks.add(link);
      else if (kind === 'central') centralLinks.add(link);
      else if (kind === 'portal') portalLinks.add(link);
    }
    processed++;
    if (processed % 25 === 0) console.log(`  link-crawled ${processed}/${sitemapUrls.length}`);
  }

  // Now HEAD/GET every unique internal link to find broken/redirecting ones
  // (limit to those NOT already known-OK from sitemap crawl)
  const sitemapSet = new Set(sitemapUrls);
  const toCheck = [...allInternalLinks.keys()].filter((u) => !sitemapSet.has(u));
  console.log(`  unique internal links: ${allInternalLinks.size} (already-OK from sitemap: ${sitemapUrls.length}, to-check: ${toCheck.length})`);

  const broken = [];
  const redirecting = [];
  let idx = 0;
  async function worker() {
    while (idx < toCheck.length) {
      const i = idx++;
      const url = toCheck[i];
      try {
        const r = await fetchManual(url);
        if (r.status >= 300 && r.status < 400) {
          redirecting.push({ url, status: r.status, location: r.headers.get('location') });
        } else if (r.status === 404 || r.status === 410 || r.status >= 500) {
          broken.push({ url, status: r.status });
        } else if (r.status !== 200) {
          broken.push({ url, status: r.status, note: 'unexpected-status' });
        }
      } catch (e) {
        broken.push({ url, status: 0, error: e.message });
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));

  return {
    pagesCrawled: sitemapUrls.length,
    uniqueInternalLinks: allInternalLinks.size,
    broken,
    redirecting,
    oldWpLinks: [...oldWpLinks],
    nonWwwLinks: [...nonWwwLinks],
    centralLinks: [...centralLinks],
    portalLinks: [...portalLinks],
    allPragStabilizersLinks: [...allPragStabilizersLinks],
  };
}

// ─── Schema validation ─────────────────────────────────────────────────────
function extractSchema(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  for (const m of blocks) {
    try { nodes.push(JSON.parse(m[1].trim())); } catch { nodes.push({ __invalid: true }); }
  }
  return nodes;
}

function listTypes(nodes) {
  const types = [];
  const walk = (n) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (typeof n !== 'object') return;
    if (n['@type']) {
      const t = n['@type'];
      if (Array.isArray(t)) t.forEach((x) => types.push(x));
      else types.push(t);
    }
    if (n['@graph'] && Array.isArray(n['@graph'])) n['@graph'].forEach(walk);
  };
  nodes.forEach(walk);
  return types;
}

async function validateSchemaFor(url, expectations) {
  const { html } = await fetchText(url);
  if (!html) return { url, error: 'no-html' };
  const nodes = extractSchema(html);
  const types = listTypes(nodes);
  const result = { url, expectations, foundTypes: types, valid: true, issues: [] };
  // check JSON validity
  if (nodes.some((n) => n && n.__invalid)) { result.valid = false; result.issues.push('invalid-json'); }
  // check expected types present
  for (const exp of expectations) {
    if (!types.includes(exp)) result.issues.push(`missing-type: ${exp}`);
  }
  // check canonical URL inside schema (look for url/mainEntityOfPage/@id matching the page)
  const pageUrl = url;
  const findUrls = (n, acc) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach((x) => findUrls(x, acc));
    if (typeof n !== 'object') return;
    for (const k of ['url', 'mainEntityOfPage', '@id']) {
      if (typeof n[k] === 'string') acc.push({ key: k, value: n[k] });
      else if (n[k] && typeof n[k] === 'object' && typeof n[k]['@id'] === 'string') acc.push({ key: k, value: n[k]['@id'] });
    }
    if (n['@graph'] && Array.isArray(n['@graph'])) n['@graph'].forEach((x) => findUrls(x, acc));
    for (const v of Object.values(n)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && !v['@type']) findUrls(v, acc);
    }
  };
  const urls = [];
  nodes.forEach((n) => findUrls(n, urls));
  result.schemaUrls = urls;
  // We don't fail on canonical URL mismatch inside schema automatically; just record.
  return result;
}

async function validateSchema() {
  console.log('\n=== SCHEMA VALIDATION ===');
  const checks = [
    { url: `${WWW}/`, expectations: ['WebSite', 'Organization'] },
    { url: `${WWW}/products/inverters`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/products/voltage-stabilizers`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/products/hybrid-inverters`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/products/servo-voltage-stabilizers`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/products/lithium-batteries`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/products/thyristor-stabilizers`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/solutions/backup-power`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/solutions/solar-energy`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/solutions/voltage-stabilization-protection`, expectations: ['BreadcrumbList'] },
    { url: `${WWW}/knowledge-center`, expectations: [] },
  ];
  // representative products
  const productUrls = [
    `${WWW}/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt`,
    `${WWW}/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-100-250v`,
    `${WWW}/products/lithium-batteries/5kwh-24v-lithium-battery`,
    `${WWW}/products/solar-panels/540w-mono-panel`,
  ];
  for (const u of productUrls) checks.push({ url: u, expectations: ['Product', 'BreadcrumbList'] });
  // representative KC articles
  const kcUrls = [
    `${WWW}/knowledge-center/servo-stabilizers`,
    `${WWW}/knowledge-center/lifepo4-battery-in-nigeria`,
    `${WWW}/knowledge-center/solar-installation-lagos-cost`,
  ];
  for (const u of kcUrls) checks.push({ url: u, expectations: ['Article', 'BreadcrumbList'] });

  const results = [];
  for (const c of checks) {
    const r = await validateSchemaFor(c.url, c.expectations);
    results.push(r);
    const types = (r && r.foundTypes) ? r.foundTypes : [];
    const issues = (r && r.issues) ? r.issues : ['no-response'];
    console.log(`  ${c.url}: types=[${types.join(',')}] issues=[${issues.join(';')}]`);
  }
  return results;
}

async function main() {
  const linkReport = await crawlInternalLinks();
  writeFileSync(`${OUT}/step12-internal-links.json`, JSON.stringify(linkReport, null, 2));
  console.log('\nINTERNAL LINKS SUMMARY:');
  console.log(JSON.stringify({
    broken: linkReport.broken.length,
    redirecting: linkReport.redirecting.length,
    oldWpLinks: linkReport.oldWpLinks.length,
    nonWwwLinks: linkReport.nonWwwLinks.length,
    centralLinks: linkReport.centralLinks.length,
    portalLinks: linkReport.portalLinks.length,
    allPragStabilizersLinks: linkReport.allPragStabilizersLinks.length,
  }, null, 2));

  const schemaResults = await validateSchema();
  writeFileSync(`${OUT}/step12-schema-validation.json`, JSON.stringify(schemaResults, null, 2));
  const schemaPass = schemaResults.every((r) => r && r.valid && r.issues.length === 0);
  console.log(`\nSCHEMA VALIDATION: ${schemaPass ? 'PASS' : 'ISSUES'}`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });

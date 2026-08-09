#!/usr/bin/env node
/**
 * Step 12.1 — Final Technical Cleanup
 *
 * 1. Fix the 10 redirecting internal links (from step12-internal-links.json)
 * 2. Fix the 2 broken legacy media images
 * 3. Collapse one two-hop product redirect in lib/redirects.ts
 *
 * Does NOT touch:
 *   - catalogue decisions (duplicate -2 products)
 *   - Search Console
 *   - the 13 fallback descriptions (only classified)
 *   - legacy redirect rules (except the one controlled two-hop collapse)
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
const envText = readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const WP_API_URL = env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WC_API_URL = 'https://central.prag.global/wp-json/wc/v3';
const WP_APP_USER = env.WP_APP_USER;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;
const authHeader = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const SITE_BASE = env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';

const outDir = path.join(__dirname, 'out');
const links = JSON.parse(readFileSync(path.join(outDir, 'step12-internal-links.json'), 'utf-8'));
const flagged = JSON.parse(readFileSync(path.join(outDir, 'step12-flagged-link-sources.json'), 'utf-8'));
const kcInventory = JSON.parse(readFileSync(path.join(outDir, 'step11-kc-inventory.json'), 'utf-8'));
const productsData = JSON.parse(readFileSync(path.join(outDir, 'all-products.json'), 'utf-8'));
const products = productsData.products || [];

const redirectFixes = [
  { from: 'https://www.prag.global/shop/30kva-servo-voltage-stabilizer/', to: `${SITE_BASE}/products/servo-voltage-stabilizers/30kva-servo-voltage-stabilizer-80-260v` },
  { from: 'https://www.prag.global/20kva-servo-voltage-stabilizer/', to: `${SITE_BASE}/knowledge-center/20kva-servo-voltage-stabilizer` },
  { from: 'https://www.prag.global/shop/455w-canadian-mono-panel/', to: `${SITE_BASE}/products/solar-panels/455w-canadian-mono-panel` },
  { from: 'https://www.prag.global/solar-products/', to: `${SITE_BASE}/products/solar` },
  { from: 'https://www.prag.global/shop/540w-mono-panel/', to: `${SITE_BASE}/products/solar-panels/540w-mono-panel` },
  { from: 'https://www.prag.global/integrating-solar-batteries-with-grid-tied-systems/', to: `${SITE_BASE}/knowledge-center/integrating-solar-batteries-with-grid-tied-systems` },
  { from: 'https://www.prag.global/shop/10kwh-48v-lifepo4-lithium-battery/', to: `${SITE_BASE}/products/lithium-batteries` },
  { from: 'https://www.prag.global/shop/2-5kwh-bt-lithium-battery/', to: `${SITE_BASE}/products/lithium-batteries` },
  { from: 'https://www.prag.global/stabilizers', to: `${SITE_BASE}/products/voltage-stabilizers` },
  { from: 'https://www.prag.global/shop/20kva-servo-voltage-stabilizer-130-260v/', to: `${SITE_BASE}/products/servo-voltage-stabilizers` },
];

function makeVariants(url) {
  const variants = [];
  const noSlash = url.replace(/\/+$/, '');
  const withSlash = noSlash + '/';
  const noWwwNoSlash = noSlash.replace(/^https:\/\/www\.prag\.global/, 'https://prag.global');
  const noWwwWithSlash = noWwwNoSlash + '/';
  const httpWwwNoSlash = noSlash.replace(/^https:/, 'http:');
  const httpWwwWithSlash = httpWwwNoSlash + '/';
  const httpNoWwwNoSlash = noWwwNoSlash.replace(/^https:/, 'http:');
  const httpNoWwwWithSlash = httpNoWwwNoSlash + '/';
  return [withSlash, noSlash, noWwwWithSlash, noWwwNoSlash, httpWwwWithSlash, httpWwwNoSlash, httpNoWwwWithSlash, httpNoWwwNoSlash];
}

function resolveSource(url) {
  const u = new URL(url);
  const pathParts = u.pathname.split('/').filter(Boolean);
  if (pathParts[0] === 'knowledge-center') {
    const slug = pathParts[1];
    const kc = kcInventory.find((a) => a.slug === slug);
    if (kc) return { type: 'kc', id: kc.wpPostId, slug };
    return { type: 'kc', id: null, slug };
  }
  if (pathParts[0] === 'products') {
    const slug = pathParts[pathParts.length - 1];
    const prod = products.find((p) => p.slug === slug);
    if (prod) return { type: 'product', id: prod.id, slug };
    return { type: 'product', id: null, slug };
  }
  return { type: 'unknown', id: null };
}

async function readKc(id) {
  const r = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, { headers: { Authorization: authHeader } });
  if (!r.ok) return null;
  return await r.json();
}

async function readProduct(id) {
  const r = await fetch(`${WC_API_URL}/products/${id}`, { headers: { Authorization: authHeader } });
  if (!r.ok) return null;
  return await r.json();
}

async function updateKc(id, content) {
  const r = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ content }),
  });
  return { ok: r.ok, status: r.status, text: r.ok ? '' : await r.text() };
}

async function updateProduct(id, data) {
  const r = await fetch(`${WC_API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify(data),
  });
  return { ok: r.ok, status: r.status, text: r.ok ? '' : await r.text() };
}

function fixContent(content, fixes) {
  let changed = content;
  const applied = [];
  for (const f of fixes) {
    const vs = makeVariants(f.from);
    for (const v of vs) {
      const re = escapeRegex(v);
      const count = (changed.match(new RegExp(re, 'g')) || []).length;
      if (count > 0) {
        changed = changed.split(v).join(f.to);
        applied.push({ from: v, to: f.to, count });
      }
    }
  }
  return { content: changed, applied };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function processLinkFixes() {
  console.log('\n=== LINK FIXES ===');
  const results = [];
  const bySource = new Map();
  for (const f of redirectFixes) {
    const foundOn = flagged.find((r) => r.flaggedUrl === f.from)?.foundOn || [];
    for (const src of foundOn) {
      if (!bySource.has(src)) bySource.set(src, { source: src, entity: resolveSource(src), fixes: [] });
      bySource.get(src).fixes.push(f);
    }
  }

  for (const [src, entry] of bySource) {
    const { type, id, slug } = entry.entity;
    if (!id) {
      console.log(`  SKIP (no entity): ${src}`);
      results.push({ source: src, type, slug, status: 'NO_ENTITY' });
      continue;
    }
    console.log(`  ${type.toUpperCase()} ${id}: ${src}`);
    let raw = '';
    if (type === 'kc') {
      const post = await readKc(id);
      if (!post) { results.push({ source: src, type, id, slug, status: 'READ_FAILED' }); continue; }
      raw = post.content?.raw || '';
    } else if (type === 'product') {
      const prod = await readProduct(id);
      if (!prod) { results.push({ source: src, type, id, slug, status: 'READ_FAILED' }); continue; }
      raw = prod.description || '';
    } else {
      results.push({ source: src, type, slug, status: 'UNKNOWN_TYPE' });
      continue;
    }

    const { content: newContent, applied } = fixContent(raw, entry.fixes);
    if (applied.length === 0) {
      console.log(`    No matching links found`);
      results.push({ source: src, type, id, slug, status: 'NO_MATCH', applied });
      continue;
    }

    if (newContent === raw) {
      results.push({ source: src, type, id, slug, status: 'NO_CHANGE', applied });
      continue;
    }

    let updateRes;
    if (type === 'kc') {
      updateRes = await updateKc(id, newContent);
    } else {
      updateRes = await updateProduct(id, { description: newContent });
    }

    if (updateRes.ok) {
      console.log(`    UPDATED: ${applied.map((a) => `${a.count}x ${a.from.slice(0, 50)}...`).join(' | ')}`);
      results.push({ source: src, type, id, slug, status: 'UPDATED', applied });
    } else {
      console.log(`    UPDATE FAILED: ${updateRes.status} ${updateRes.text.slice(0, 120)}`);
      results.push({ source: src, type, id, slug, status: 'UPDATE_FAILED', applied, error: updateRes.text });
    }
  }

  writeFileSync(path.join(outDir, 'step12-1-link-fixes.json'), JSON.stringify(results, null, 2));
  console.log(`\nLink fixes: ${results.filter((r) => r.status === 'UPDATED').length} updated, ${results.length} checked`);
}

async function processMediaFixes() {
  console.log('\n=== BROKEN MEDIA FIXES ===');
  const results = [];

  // 1. 40A MPPT — ensure all broken variants point to central image
  const prod40 = products.find((p) => p.name.includes('40A MPPT'));
  if (prod40) {
    const full40 = await readProduct(prod40.id);
    if (full40) {
      let desc = full40.description || '';
      let changed = false;
      const brokenPatterns = [
        'http://prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4.jpg',
        'http://prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4-769x1024.jpg',
        'http://prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4-',
        'https://prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4',
        'http://www.prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4',
      ];
      const replacement = 'https://central.prag.global/wp-content/uploads/2026/07/PRAG-Solar-MPPT-Charge-Controller-1.png';
      for (const bp of brokenPatterns) {
        if (desc.includes(bp)) {
          desc = desc.split(bp).join(replacement);
          changed = true;
        }
      }
      if (changed) {
        const res = await updateProduct(prod40.id, { description: desc });
        results.push({ product: prod40.name, productId: prod40.id, status: res.ok ? 'UPDATED' : 'UPDATE_FAILED', replacement: res.ok ? replacement : res.text });
        console.log(`  40A MPPT: ${res.ok ? 'UPDATED' : 'FAILED'}`);
      } else {
        results.push({ product: prod40.name, productId: prod40.id, status: 'NO_MATCH' });
        console.log('  40A MPPT: no broken reference found');
      }
    }
  }

  // 2. 3.5kVA Studer — remove the broken image block, no reliable replacement
  const prodStuder = products.find((p) => p.name.includes('3.5kVA') && p.name.includes('Studer'));
  if (prodStuder) {
    const fullStuder = await readProduct(prodStuder.id);
    if (fullStuder) {
      let desc = fullStuder.description || '';
      const before = desc;
      // Remove the entire figure containing the 2019/04 Studer image
      const re = /<figure[^>]*>.*?<a\s+[^>]*href=["'][^"']*\/2019\/04\/Studer-Xtender-XTM-3500[^"']*["'][^>]*>.*?<\/a>.*?<\/figure>/gis;
      desc = desc.replace(re, '');
      // Also remove any loose <a><img> blocks pointing to the broken image
      const re2 = /<a\s+[^>]*href=["'][^"']*\/2019\/04\/Studer-Xtender-XTM-3500[^"']*["'][^>]*>.*?<\/a>/gis;
      desc = desc.replace(re2, '');
      const changed = desc !== before;
      if (changed) {
        const res = await updateProduct(prodStuder.id, { description: desc });
        results.push({ product: prodStuder.name, productId: prodStuder.id, status: res.ok ? 'UPDATED' : 'UPDATE_FAILED', replacement: null, error: res.ok ? '' : res.text });
        console.log(`  3.5kVA Studer: ${res.ok ? 'REMOVED broken image block' : 'FAILED'}`);
      } else {
        results.push({ product: prodStuder.name, productId: prodStuder.id, status: 'NO_MATCH' });
        console.log('  3.5kVA Studer: no broken reference found');
      }
    }
  }

  writeFileSync(path.join(outDir, 'step12-1-media-fixes.json'), JSON.stringify(results, null, 2));
}

function collapseTwoHopRedirect() {
  console.log('\n=== TWO-HOP REDIRECT COLLAPSE ===');
  const file = path.join(__dirname, '..', 'lib', 'redirects.ts');
  let src = readFileSync(file, 'utf-8');
  const oldLine = "{ source: '/shop/5-5kw-48v-hybrid-inverter-6000w-mppt', destination: '/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt', permanent: true },";
  const newLine = "{ source: '/shop/5-5kw-48v-hybrid-inverter-6000w-mppt', destination: '/products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt', permanent: true },";
  if (!src.includes(oldLine)) {
    if (src.includes(newLine)) {
      console.log('  already collapsed');
      return { status: 'ALREADY_COLLAPSED' };
    }
    console.log('  old line not found — may already be collapsed');
    return { status: 'NOT_FOUND' };
  }
  src = src.replace(oldLine, newLine);
  writeFileSync(file, src);
  console.log('  COLLAPSED: /shop/5-5kw-48v-hybrid-inverter-6000w-mppt → /products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt');
  return { status: 'COLLAPSED' };
}

function classifyFallbackDescriptions() {
  console.log('\n=== FALLBACK DESCRIPTION CLASSIFICATION ===');
  const crawl = JSON.parse(readFileSync(path.join(outDir, 'step12-sitemap-crawl.json'), 'utf-8'));
  const desc = 'Discover PRAG inverters, voltage stabilizers, lithium batteries and solar solutions for homes, businesses and industries across Nigeria.';
  const rows = crawl
    .filter((r) => r.description === desc)
    .map((r) => ({
      url: r.url,
      pageType: r.pageType,
      title: r.title,
      classification: r.url === 'https://www.prag.global/' ? 'IMPORTANT SEO LANDING PAGE' : 'SUPPORT/UTILITY PAGE',
      action: r.url === 'https://www.prag.global/' ? 'Homepage meta description should be reviewed in post-launch optimisation' : 'POST-LAUNCH SEO OPTIMISATION',
    }));
  writeFileSync(path.join(outDir, 'step12-1-fallback-descriptions.json'), JSON.stringify(rows, null, 2));
  console.log(`  Classified ${rows.length} pages`);
  console.log('  IMPORTANT:', rows.filter((r) => r.classification === 'IMPORTANT SEO LANDING PAGE').map((r) => r.url));
  return rows;
}

async function main() {
  const twoHop = collapseTwoHopRedirect();
  const fallbackRows = classifyFallbackDescriptions();
  await processLinkFixes();
  await processMediaFixes();
  const summary = {
    timestamp: new Date().toISOString(),
    twoHop,
    fallbackDescriptionCount: fallbackRows.length,
  };
  writeFileSync(path.join(outDir, 'step12-1-summary.json'), JSON.stringify(summary, null, 2));
  console.log('\n=== Step 12.1 cleanup complete ===');
}

main().catch((err) => { console.error('FATAL:', err); process.exit(1); });

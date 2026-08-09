// PRAG Step 11.1 — Fix Internal Links in KC Articles
//
// Replaces old prag.global/ URLs with final canonical www.prag.global URLs.
// Removes broken links (404 after redirect chain).
// Adds contextual commercial links and CTAs where recommended.
//
// Run from prag-b2b root:
//   node scripts/step11-1-fix-internal-links.mjs

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
const WP_APP_USER = env.WP_APP_USER;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;
const authHeader = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const SITE_BASE = env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';

// ─── Old URL → New URL mapping ─────────────────────────────────────────────
// These are the redirect-chain URLs found in article content.
// Map them to final canonical www.prag.global URLs.

const urlMapping = {
  // Old shop URLs → product category pages (most shop product URLs 404 now)
  'https://prag.global/inverter/': `${SITE_BASE}/products/inverters`,
  'https://prag.global/batteries/': `${SITE_BASE}/products/batteries`,
  'https://prag.global/lifepo4-battery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/lithiumbattery-solarbattery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/solar-lithium-ion-batteries/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/product-category/solar/solar-panels/': `${SITE_BASE}/products/solar-panels`,
  'https://prag.global/product-category/batteries/lithium-battery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/product-category/sales/': `${SITE_BASE}/products`,
  'http://prag.global/batteries/': `${SITE_BASE}/products/batteries`,
  'http://prag.global/where-to-buy-prag/': `${SITE_BASE}/where-to-buy`,
  'http://prag.global': SITE_BASE,
  'https://prag.global': SITE_BASE,

  // Old shop product URLs that 404 → map to parent category
  'https://prag.global/shop/5kva-single-phase-stabilizer/': `${SITE_BASE}/products/voltage-stabilizers`,
  'https://prag.global/shop/2-5kwh-bt-lithium-battery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery-2/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/shop/5kwh-48v-lifepo4-lithium-battery/': `${SITE_BASE}/products/lithium-batteries`,
  'https://prag.global/shop/1-5kva-pure-sine-inverter/': `${SITE_BASE}/products/inverters`,
  'https://prag.global/shop/455w-canadian-mono-panel/': `${SITE_BASE}/products/solar-panels`,
  'https://prag.global/shop/540w-mono-panel/': `${SITE_BASE}/products/solar-panels`,
  'https://prag.global/shop/30kva-servo-voltage-stabilizer/': `${SITE_BASE}/products/servo-voltage-stabilizers`,
  'https://prag.global/shop/20kva-servo-voltage-stabilizer-130-260v/': `${SITE_BASE}/products/servo-voltage-stabilizers`,
  'https://prag.global/shop/tmb-986-blood-pressure-monitor/': `${SITE_BASE}/products`,
  'https://prag.global/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply/': `${SITE_BASE}/knowledge-center/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply`,

  // Old prag.global (without www) → www.prag.global
  // Generic catch: replace remaining prag.global/ with www.prag.global/
};

// ─── CTA blocks ────────────────────────────────────────────────────────────
// One CTA per article, placed naturally at the end of content.
// Uses the existing article design system (simple text link, not a hard-sell block).

const ctas = {
  // KEEP
  39: `<p><strong>Not sure which stabilizer type you need?</strong> <a href="${SITE_BASE}/products/voltage-stabilizers">Compare PRAG voltage stabilizers</a> or <a href="${SITE_BASE}/solutions/voltage-stabilization-protection">learn about voltage stabilization solutions</a> for your home or business.</p>`,
  26: `<p><strong>Ready to choose the right inverter?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> to find the right capacity for your home or business.</p>`,
  9: `<p><strong>Looking for a reliable lithium battery?</strong> <a href="${SITE_BASE}/products/lithium-batteries">View PRAG lithium batteries</a> for long-lasting, safe backup power in Nigeria.</p>`,
  8: `<p><strong>Need help choosing a solar battery?</strong> <a href="${SITE_BASE}/products/batteries">View PRAG batteries</a> or <a href="${SITE_BASE}/solutions/solar-energy">explore solar energy solutions</a>.</p>`,
  24: `<p><strong>Having inverter issues you can't resolve?</strong> <a href="${SITE_BASE}/technical-support">Talk to a PRAG engineer</a> for professional support and service.</p>`,
  41: `<p><strong>Want to learn more about battery specifications?</strong> <a href="${SITE_BASE}/products/batteries">View PRAG batteries</a> or <a href="${SITE_BASE}/products/lithium-batteries">explore lithium battery options</a>.</p>`,

  // OPTIMISE
  1: `<p><strong>Ready to go solar?</strong> <a href="${SITE_BASE}/products/solar">Explore PRAG solar products</a> or <a href="${SITE_BASE}/solutions/solar-energy">learn about solar energy solutions</a> for your home or business.</p>`,
  2: `<p><strong>Want to explore solar options for your needs?</strong> <a href="${SITE_BASE}/products/solar">Explore PRAG solar products</a> to find the right system size.</p>`,
  3: `<p><strong>Planning a solar installation in Lagos?</strong> <a href="${SITE_BASE}/solutions/solar-energy">Talk to PRAG about solar installation</a> for your home or business.</p>`,
  16: `<p><strong>Need a voltage stabilizer for your equipment?</strong> <a href="${SITE_BASE}/products/servo-voltage-stabilizers">Explore PRAG servo voltage stabilizers</a> or <a href="${SITE_BASE}/products/voltage-stabilizers">compare all stabilizer types</a>.</p>`,
  7: `<p><strong>Building a solar battery system?</strong> <a href="${SITE_BASE}/products/batteries">View PRAG batteries</a> or <a href="${SITE_BASE}/products/inverters">explore PRAG inverters</a> for your setup.</p>`,
  23: `<p><strong>Need an industrial voltage stabilizer?</strong> <a href="${SITE_BASE}/products/servo-voltage-stabilizers">Explore PRAG servo voltage stabilizers</a> for high-capacity equipment protection.</p>`,
  31: `<p><strong>Choosing an inverter for your renewable energy system?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> or <a href="${SITE_BASE}/products/hybrid-inverters">view hybrid inverter options</a>.</p>`,
  30: `<p><strong>Planning a grid-tied solar system with battery backup?</strong> <a href="${SITE_BASE}/products/batteries">View PRAG batteries</a> or <a href="${SITE_BASE}/solutions/solar-energy">explore solar energy solutions</a>.</p>`,
  32: `<p><strong>Concerned about battery safety?</strong> <a href="${SITE_BASE}/products/lithium-batteries">View PRAG lithium batteries</a> — designed with built-in safety protections for Nigerian conditions.</p>`,
  33: `<p><strong>Experiencing power supply problems?</strong> <a href="${SITE_BASE}/products/voltage-stabilizers">Find the right voltage stabilizer</a> or <a href="${SITE_BASE}/solutions/voltage-stabilization-protection">learn about voltage protection solutions</a>.</p>`,
  37: `<p><strong>Choosing batteries for your solar system?</strong> <a href="${SITE_BASE}/products/batteries">View PRAG batteries</a> or <a href="${SITE_BASE}/products/solar">explore solar products</a>.</p>`,
  21: `<p><strong>Looking for an inverter within your budget?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> to compare capacities and pricing.</p>`,
  22: `<p><strong>Ready to choose a solar inverter?</strong> <a href="${SITE_BASE}/products/hybrid-inverters">Explore PRAG hybrid inverters</a> or <a href="${SITE_BASE}/products/inverters">view all inverter options</a>.</p>`,
  20: `<p><strong>Looking for solar panels in Nigeria?</strong> <a href="${SITE_BASE}/products/solar-panels">Explore PRAG solar panels</a> for your home or business.</p>`,
  17: `<p><strong>Ready to harness solar energy?</strong> <a href="${SITE_BASE}/solutions/solar-energy">Explore solar energy solutions</a> or <a href="${SITE_BASE}/products/solar">browse PRAG solar products</a>.</p>`,
  34: `<p><strong>Want to go solar?</strong> <a href="${SITE_BASE}/products/solar-panels">Explore PRAG solar panels</a> or <a href="${SITE_BASE}/solutions/solar-energy">learn about solar energy solutions</a>.</p>`,
  38: `<p><strong>Interested in modern solar technology?</strong> <a href="${SITE_BASE}/products/solar">Explore PRAG solar products</a> or <a href="${SITE_BASE}/solutions/solar-energy">learn about solar energy solutions</a>.</p>`,

  // REWRITE
  12: `<p><strong>Looking for an affordable inverter?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> to find options that fit your budget.</p>`,
  13: `<p><strong>Want an energy-efficient inverter?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> with energy-saving features.</p>`,
  14: `<p><strong>Building an energy storage system?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> or <a href="${SITE_BASE}/solutions/backup-power">learn about backup power solutions</a>.</p>`,
  15: `<p><strong>Looking for a solar inverter with MPPT?</strong> <a href="${SITE_BASE}/products/hybrid-inverters">Explore PRAG hybrid inverters</a> with integrated MPPT charge controllers.</p>`,
  25: `<p><strong>Tired of power outages?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> for reliable backup power in Nigeria.</p>`,
  29: `<p><strong>Not sure whether you need a stabilizer, backup power, or both?</strong> <a href="${SITE_BASE}/products/voltage-stabilizers">Find the right voltage stabilizer</a> or <a href="${SITE_BASE}/solutions/backup-power">explore backup power solutions</a>.</p>`,
  36: `<p><strong>Need a servo voltage stabilizer?</strong> <a href="${SITE_BASE}/products/servo-voltage-stabilizers">Explore PRAG servo voltage stabilizers</a> for reliable equipment protection.</p>`,
  42: `<p><strong>Still having inverter charging issues?</strong> <a href="${SITE_BASE}/technical-support">Talk to a PRAG engineer</a> for professional support.</p>`,
};

// ─── Articles to process ──────────────────────────────────────────────────
// S/N → WP Post ID mapping (KEEP + OPTIMISE + REWRITE = 31)

const articles = [
  // KEEP (6)
  { sn: 39, id: 56089, action: 'KEEP' },
  { sn: 26, id: 56615, action: 'KEEP' },
  { sn: 9, id: 57363, action: 'KEEP' },
  { sn: 8, id: 57374, action: 'KEEP' },
  { sn: 24, id: 56637, action: 'KEEP' },
  { sn: 41, id: 124, action: 'KEEP' },
  // OPTIMISE (17)
  { sn: 1, id: 57421, action: 'OPTIMISE' },
  { sn: 2, id: 57423, action: 'OPTIMISE' },
  { sn: 3, id: 57425, action: 'OPTIMISE' },
  { sn: 16, id: 57169, action: 'OPTIMISE' },
  { sn: 7, id: 57379, action: 'OPTIMISE' },
  { sn: 23, id: 57152, action: 'OPTIMISE' },
  { sn: 31, id: 56578, action: 'OPTIMISE' },
  { sn: 30, id: 56597, action: 'OPTIMISE' },
  { sn: 32, id: 56573, action: 'OPTIMISE' },
  { sn: 33, id: 56565, action: 'OPTIMISE' },
  { sn: 37, id: 56485, action: 'OPTIMISE' },
  { sn: 21, id: 57157, action: 'OPTIMISE' },
  { sn: 22, id: 57155, action: 'OPTIMISE' },
  { sn: 20, id: 57159, action: 'OPTIMISE' },
  { sn: 17, id: 57167, action: 'OPTIMISE' },
  { sn: 34, id: 56536, action: 'OPTIMISE' },
  { sn: 38, id: 56477, action: 'OPTIMISE' },
  // REWRITE (8)
  { sn: 12, id: 57252, action: 'REWRITE' },
  { sn: 13, id: 57250, action: 'REWRITE' },
  { sn: 14, id: 57248, action: 'REWRITE' },
  { sn: 15, id: 57245, action: 'REWRITE' },
  { sn: 25, id: 56627, action: 'REWRITE' },
  { sn: 29, id: 56604, action: 'REWRITE' },
  { sn: 36, id: 56493, action: 'REWRITE' },
  { sn: 42, id: 105, action: 'REWRITE' },
];

// ─── Link fixing ───────────────────────────────────────────────────────────

function fixLinks(content) {
  let fixed = content;
  const fixes = [];

  // Replace known old URLs with canonical URLs
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    // Handle both with and without trailing slash variations
    const variants = [oldUrl, oldUrl.replace(/\/$/, ''), oldUrl + '/'];
    for (const v of variants) {
      if (fixed.includes(v)) {
        const count = (fixed.match(new RegExp(escapeRegex(v), 'g')) || []).length;
        fixed = fixed.split(v).join(newUrl);
        if (count > 0) fixes.push({ old: v, new: newUrl, count });
      }
    }
  }

  // Replace remaining prag.global/ (without www) with www.prag.global/
  // But don't touch prag.global/shop/ (already mapped above) or prag.global/product-category/ (already mapped)
  // Generic replacement for any remaining prag.global/ links
  const remainingOld = fixed.match(/https?:\/\/prag\.global\/(?!shop\/|product-category\/)/gi);
  if (remainingOld) {
    fixed = fixed.replace(/https?:\/\/prag\.global\//gi, `${SITE_BASE}/`);
    fixes.push({ old: 'prag.global/ (generic)', new: 'www.prag.global/', count: remainingOld.length });
  }

  // Remove broken external links (DNS failures, 404s)
  // buyright.biz — DNS failure
  if (fixed.includes('buyright.biz')) {
    fixed = fixed.replace(/<a\s+[^>]*href=[\"']http:\/\/www\.buyright\.biz[^\"']*[\"'][^>]*>(.*?)<\/a>/gi, '$1');
    fixes.push({ old: 'buyright.biz link', new: 'removed (DNS failure)', count: 1 });
  }
  // prag.cc — DNS failure
  if (fixed.includes('prag.cc')) {
    fixed = fixed.replace(/<a\s+[^>]*href=[\"']http:\/\/www\.prag\.cc[^\"']*[\"'][^>]*>(.*?)<\/a>/gi, '$1');
    fixes.push({ old: 'prag.cc link', new: 'removed (DNS failure)', count: 1 });
  }
  // konga.com/prag — 404
  if (fixed.includes('konga.com/prag')) {
    fixed = fixed.replace(/<a\s+[^>]*href=[\"']https:\/\/www\.konga\.com\/prag[^\"']*[\"'][^>]*>(.*?)<\/a>/gi, '$1');
    fixes.push({ old: 'konga.com/prag link', new: 'removed (404)', count: 1 });
  }

  return { content: fixed, fixes };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── CTA insertion ─────────────────────────────────────────────────────────

function addCta(content, sn) {
  const cta = ctas[sn];
  if (!cta) return { content, added: false };

  // Check if CTA already exists (idempotency)
  const ctaText = cta.replace(/<[^>]+>/g, '').trim().slice(0, 50);
  if (content.includes(ctaText.slice(0, 30))) {
    return { content, added: false };
  }

  // Append CTA at the end of content
  const newContent = content.trimEnd() + '\n\n' + cta;
  return { content: newContent, added: true };
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function processArticles() {
  console.log('=== Step 11.1: Fix Internal Links + Add CTAs ===');
  console.log('Articles to process:', articles.length);

  const results = [];

  for (const article of articles) {
    const { sn, id, action } = article;
    console.log(`\n--- #${sn} (ID:${id}) ${action} ---`);

    // 1. Read current content
    const readRes = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, {
      headers: { Authorization: authHeader },
    });
    if (!readRes.ok) {
      console.log(`  READ FAILED: ${readRes.status}`);
      results.push({ sn, id, action, status: 'READ_FAILED', linkFixes: [], ctaAdded: false });
      continue;
    }
    const post = await readRes.json();
    const originalContent = post.content?.raw || '';

    // 2. Fix links
    const { content: linkFixedContent, fixes } = fixLinks(originalContent);
    if (fixes.length > 0) {
      console.log(`  Link fixes: ${fixes.length}`);
      fixes.forEach(f => console.log(`    ${f.old} → ${f.new} (${f.count}x)`));
    } else {
      console.log(`  Link fixes: none needed`);
    }

    // 3. Add CTA
    const { content: finalContent, added: ctaAdded } = addCta(linkFixedContent, sn);
    console.log(`  CTA added: ${ctaAdded ? 'YES' : 'NO (already present)'}`);

    // 4. Only update if content changed
    if (finalContent === originalContent) {
      console.log(`  No changes needed — skipping update`);
      results.push({ sn, id, action, status: 'NO_CHANGE', linkFixes: fixes, ctaAdded: false });
      continue;
    }

    // 5. Update post
    const updateRes = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ content: finalContent }),
    });

    if (updateRes.ok) {
      console.log(`  UPDATE: SUCCESS`);
      results.push({ sn, id, action, status: 'UPDATED', linkFixes: fixes, ctaAdded });
    } else {
      const body = await updateRes.text();
      console.log(`  UPDATE FAILED: ${updateRes.status} ${body.slice(0, 200)}`);
      results.push({ sn, id, action, status: 'UPDATE_FAILED', linkFixes: fixes, ctaAdded });
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  const updated = results.filter(r => r.status === 'UPDATED').length;
  const noChange = results.filter(r => r.status === 'NO_CHANGE').length;
  const failed = results.filter(r => r.status.includes('FAILED')).length;
  const totalLinkFixes = results.reduce((sum, r) => sum + r.linkFixes.length, 0);
  const totalCtas = results.filter(r => r.ctaAdded).length;

  console.log(`Articles updated: ${updated}`);
  console.log(`No changes needed: ${noChange}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total link fixes: ${totalLinkFixes}`);
  console.log(`CTAs added: ${totalCtas}`);

  // Save results
  const summary = {
    timestamp: new Date().toISOString(),
    totalArticles: articles.length,
    updated,
    noChange,
    failed,
    totalLinkFixes,
    totalCtas,
    results,
  };

  const outPath = path.join(__dirname, 'out', 'step11-1-link-fixes-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nSummary saved: ${outPath}`);
}

processArticles().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

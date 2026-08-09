// PRAG Step 11.1 — Add H1/H2 Structure to OPTIMISE Articles
//
// For each OPTIMISE article:
// - Add H1 (article title) at the top if missing
// - Promote H3 → H2 (they're acting as section headers)
// - Promote H4 → H3 (maintain hierarchy under new H2s)
// - For articles with no headings, add H2s based on content paragraphs
//
// Run from prag-b2b root:
//   node scripts/step11-1-add-h2-structure.mjs

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

// ─── Articles to process (17 OPTIMISE) ─────────────────────────────────────
const articles = [
  { sn: 1, id: 57421 },
  { sn: 2, id: 57423 },
  { sn: 3, id: 57425 },
  { sn: 16, id: 57169 },
  { sn: 7, id: 57379 },
  { sn: 23, id: 57152 },
  { sn: 31, id: 56578 },
  { sn: 30, id: 56597 },
  { sn: 32, id: 56573 },
  { sn: 33, id: 56565 },
  { sn: 37, id: 56485 },
  { sn: 21, id: 57157 },
  { sn: 22, id: 57155 },
  { sn: 20, id: 57159 },
  { sn: 17, id: 57167 },
  { sn: 34, id: 56536 },
  { sn: 38, id: 56477 },
];

// ─── H2 headings to add for articles with no structure ─────────────────────
// These are for articles that have zero headings and need manual H2 insertion.
// The key is the S/N, value is an array of { afterText, heading } where afterText
// is a snippet of text that the H2 should be inserted before.

const manualH2s = {
  31: [
    { beforeText: 'Inverters play a crucial', heading: '<h2>The Role of Inverters in Renewable Energy</h2>' },
    { beforeText: 'Solar inverters convert', heading: '<h2>Types of Renewable Energy Inverters</h2>' },
    { beforeText: 'When selecting an inverter', heading: '<h2>Choosing the Right Inverter for Your System</h2>' },
    { beforeText: 'Proper installation', heading: '<h2>Installation and Maintenance Considerations</h2>' },
  ],
  30: [
    { beforeText: 'Integrating solar batteries', heading: '<h2>How Grid-Tied Solar Battery Systems Work</h2>' },
    { beforeText: 'One of the primary', heading: '<h2>Benefits of Battery Integration with Grid-Tied Systems</h2>' },
    { beforeText: 'When planning', heading: '<h2>Planning Your Grid-Tied Battery System</h2>' },
    { beforeText: 'Proper sizing', heading: '<h2>Sizing and Battery Selection</h2>' },
  ],
  32: [
    { beforeText: 'Lithium batteries have become', heading: '<h2>Why Lithium Batteries Overheat</h2>' },
    { beforeText: 'Several factors', heading: '<h2>Common Causes of Lithium Battery Overheating</h2>' },
    { beforeText: 'Preventing overheating', heading: '<h2>How to Prevent Lithium Battery Overheating</h2>' },
    { beforeText: 'Proper installation', heading: '<h2>Installation Best Practices for Nigerian Conditions</h2>' },
  ],
  33: [
    { beforeText: 'Power supply problems', heading: '<h2>Common Power Supply Problems in Nigeria</h2>' },
    { beforeText: 'Voltage stabilizers', heading: '<h2>How Voltage Stabilizers Solve Power Problems</h2>' },
    { beforeText: 'Different types', heading: '<h2>Types of Voltage Stabilizers</h2>' },
    { beforeText: 'Choosing the right', heading: '<h2>Choosing the Right Stabilizer for Your Needs</h2>' },
  ],
  37: [
    { beforeText: 'Solar electric systems', heading: '<h2>Why Batteries Matter in Solar Systems</h2>' },
    { beforeText: 'Lead-acid batteries', heading: '<h2>Lead-Acid Batteries</h2>' },
    { beforeText: 'Lithium-ion batteries', heading: '<h2>Lithium-Ion Batteries</h2>' },
    { beforeText: 'LiFePO4 batteries', heading: '<h2>LiFePO4 (Lithium Iron Phosphate) Batteries</h2>' },
    { beforeText: 'When choosing', heading: '<h2>Choosing the Right Battery for Your Solar System</h2>' },
  ],
  21: [
    { beforeText: 'In Nigeria, where power', heading: '<h2>Factors That Affect Inverter Pricing</h2>' },
    { beforeText: 'Inverter capacity', heading: '<h2>Inverter Capacity and Price Ranges</h2>' },
    { beforeText: 'When budgeting', heading: '<h2>Additional Costs to Consider</h2>' },
    { beforeText: 'To get the best', heading: '<h2>Tips for Getting the Best Value</h2>' },
  ],
  22: [
    { beforeText: 'Solar inverters are', heading: '<h2>What Affects Solar Inverter Pricing</h2>' },
    { beforeText: 'Solar inverter capacity', heading: '<h2>Solar Inverter Capacity Options</h2>' },
    { beforeText: 'When choosing', heading: '<h2>Choosing the Right Solar Inverter</h2>' },
    { beforeText: 'To get the best', heading: '<h2>Getting the Best Value for Your Solar Inverter</h2>' },
  ],
  17: [
    { beforeText: 'Nigeria is blessed', heading: '<h2>The State of Solar Energy in Nigeria</h2>' },
    { beforeText: 'Solar power works', heading: '<h2>How Solar Energy Works</h2>' },
    { beforeText: 'For Nigerian homes', heading: '<h2>Solar Solutions for Nigerian Homes and Businesses</h2>' },
    { beforeText: 'Despite the benefits', heading: '<h2>Challenges and Solutions for Solar in Nigeria</h2>' },
  ],
  34: [
    { beforeText: 'Solar panels are', heading: '<h2>What Are Solar Panels?</h2>' },
    { beforeText: 'The photovoltaic effect', heading: '<h2>The Photovoltaic Effect: How Solar Panels Generate Electricity</h2>' },
    { beforeText: 'Solar cells are made', heading: '<h2>Types of Solar Cells</h2>' },
    { beforeText: 'Several factors', heading: '<h2>Factors That Affect Solar Panel Efficiency</h2>' },
  ],
  38: [
    { beforeText: 'Solar power has come', heading: '<h2>The Evolution of Solar Power Technology</h2>' },
    { beforeText: 'Modern solar panels', heading: '<h2>Advancements in Solar Panel Efficiency</h2>' },
    { beforeText: 'Battery storage', heading: '<h2>Advancements in Battery Storage</h2>' },
    { beforeText: 'Smart inverters', heading: '<h2>Smart Inverters and Monitoring Systems</h2>' },
  ],
};

// ─── Structure transformation ──────────────────────────────────────────────

function addStructure(content, title, sn) {
  let result = content;
  let changes = [];

  // 1. Add H1 at the top if missing
  if (!/<h1[^>]*>/i.test(result)) {
    const cleanTitle = title.replace(/&amp;/g, '&');
    result = `<h1>${cleanTitle}</h1>\n` + result;
    changes.push('Added H1');
  }

  // 2. Promote H3 → H2 and H4 → H3 (if there are no H2s)
  const hasH2 = /<h2[^>]*>/i.test(result);
  if (!hasH2) {
    const h3Count = (result.match(/<h3[^>]*>/gi) || []).length;
    const h4Count = (result.match(/<h4[^>]*>/gi) || []).length;

    if (h3Count > 0) {
      // Promote H3 → H2
      result = result.replace(/<h3([^>]*)>/gi, '<h2$1>').replace(/<\/h3>/gi, '</h2>');
      changes.push(`Promoted ${h3Count} H3 → H2`);
    }
    if (h4Count > 0) {
      // Promote H4 → H3
      result = result.replace(/<h4([^>]*)>/gi, '<h3$1>').replace(/<\/h4>/gi, '</h3>');
      changes.push(`Promoted ${h4Count} H4 → H3`);
    }
  }

  // 3. For articles with no headings at all, insert manual H2s
  if (manualH2s[sn]) {
    const stillNoH2 = !/<h2[^>]*>/i.test(result);
    if (stillNoH2) {
      for (const { beforeText, heading } of manualH2s[sn]) {
        // Find the text and insert H2 before it
        const idx = result.indexOf(beforeText);
        if (idx >= 0) {
          result = result.slice(0, idx) + heading + '\n' + result.slice(idx);
          changes.push(`Added H2: ${heading.replace(/<[^>]+>/g, '')}`);
        }
      }
    }
  }

  return { content: result, changes };
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function processArticles() {
  console.log('=== Step 11.1: Add H1/H2 Structure to OPTIMISE Articles ===');
  console.log('Articles to process:', articles.length);

  const results = [];

  for (const { sn, id } of articles) {
    console.log(`\n--- #${sn} (ID:${id}) ---`);

    // Read current content
    const readRes = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, {
      headers: { Authorization: authHeader },
    });
    if (!readRes.ok) {
      console.log(`  READ FAILED: ${readRes.status}`);
      results.push({ sn, id, status: 'READ_FAILED' });
      continue;
    }
    const post = await readRes.json();
    const originalContent = post.content?.raw || '';
    const title = post.title?.raw || post.title?.rendered || '';

    // Add structure
    const { content: structuredContent, changes } = addStructure(originalContent, title, sn);

    if (changes.length === 0) {
      console.log(`  No structure changes needed`);
      results.push({ sn, id, status: 'NO_CHANGE', changes: [] });
      continue;
    }

    console.log(`  Changes: ${changes.join(', ')}`);

    // Update post
    const updateRes = await fetch(`${WP_API_URL}/wp/v2/posts/${id}?context=edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ content: structuredContent }),
    });

    if (updateRes.ok) {
      console.log(`  UPDATE: SUCCESS`);
      results.push({ sn, id, status: 'UPDATED', changes });
    } else {
      const body = await updateRes.text();
      console.log(`  UPDATE FAILED: ${updateRes.status} ${body.slice(0, 200)}`);
      results.push({ sn, id, status: 'UPDATE_FAILED', changes });
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  const updated = results.filter(r => r.status === 'UPDATED').length;
  const noChange = results.filter(r => r.status === 'NO_CHANGE').length;
  const failed = results.filter(r => r.status.includes('FAILED')).length;
  console.log(`Articles updated: ${updated}`);
  console.log(`No changes needed: ${noChange}`);
  console.log(`Failed: ${failed}`);

  const summary = {
    timestamp: new Date().toISOString(),
    totalArticles: articles.length,
    updated,
    noChange,
    failed,
    results,
  };

  const outPath = path.join(__dirname, 'out', 'step11-1-h2-structure-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nSummary saved: ${outPath}`);
}

processArticles().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

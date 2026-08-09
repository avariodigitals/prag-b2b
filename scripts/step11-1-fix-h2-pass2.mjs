// PRAG Step 11.1 — Fix remaining H1/H2 structure (second pass)
//
// Fixes 12 articles that still lack proper H1/H2:
// - 6 KEEP articles: add H1 + H2 (content preserved, only headings added)
// - 6 OPTIMISE articles: add H2 (H1 already present)
//
// Run from prag-b2b root:
//   node scripts/step11-1-fix-h2-pass2.mjs

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

// ─── H1 + H2 insertions ────────────────────────────────────────────────────
// For each article: { id, h1, h2s: [{ beforeText, heading }] }
// beforeText is a unique text snippet to insert the H2 before.

const fixes = {
  // ─── KEEP articles ───────────────────────────────────────────────────────

  // #39 — Relay vs Servo Stabilizer
  56089: {
    h1: 'What is the Difference Between Relay & Servo Voltage Stabilizer?',
    h2s: [
      { beforeText: 'AVRs (Automatic Voltage Regulators)', heading: '<h2>Why Voltage Stabilizers Matter</h2>' },
      { beforeText: 'The production of this Stabilizers', heading: '<h2>Two Stabilizer Technologies: Relay vs Servo</h2>' },
      { beforeText: 'Relay</strong> Voltage Stabilizers', heading: '<h2>Relay Voltage Stabilizers</h2>' },
      { beforeText: 'Servo Voltage Stabilizers:</li>', heading: '<h2>Servo Voltage Stabilizers</h2>' },
      { beforeText: 'If we compare servo', heading: '<h2>Comparison: Servo vs Relay Stabilizers</h2>' },
    ],
  },

  // #26 — Inverter Sizing
  56615: {
    h1: 'Inverter Sizing and Load Capacity: Ensuring Efficient Power Supply',
    h2s: [
      { beforeText: 'In today\'s environment', heading: '<h2>Why Inverter Sizing Matters</h2>' },
      { beforeText: 'The power requirement', heading: '<h2>Calculating Your Power Requirements</h2>' },
      { beforeText: 'Inverter capacity', heading: '<h2>Understanding Inverter Capacity</h2>' },
      { beforeText: 'To determine', heading: '<h2>How to Choose the Right Inverter Size</h2>' },
    ],
  },

  // #9 — LiFePO4 Battery in Nigeria
  57363: {
    h1: 'LiFePO4 Battery in Nigeria: A Reliable and Efficient Solution for Power Storage',
    h2s: [
      { beforeText: 'As Nigeria continues', heading: '<h2>Why LiFePO4 Batteries Matter in Nigeria</h2>' },
      { beforeText: 'What is a LiFePO4', heading: '<h2>What is a LiFePO4 Battery?</h2>' },
      { beforeText: 'Advantages of LiFePO4', heading: '<h2>Advantages of LiFePO4 Batteries</h2>' },
      { beforeText: 'Applications of LiFePO4', heading: '<h2>Applications of LiFePO4 Batteries in Nigeria</h2>' },
      { beforeText: 'Why Choose PRAG', heading: '<h2>Why Choose PRAG for LiFePO4 Batteries</h2>' },
    ],
  },

  // #8 — Solar Battery Guide
  57374: {
    h1: 'The Essential Guide to Solar Batteries: Maximizing Your Solar Power Storage',
    h2s: [
      { beforeText: 'In an era where', heading: '<h2>Why Solar Batteries Are Essential</h2>' },
      { beforeText: 'How Solar Batteries', heading: '<h2>How Solar Batteries Work</h2>' },
      { beforeText: 'Types of Solar', heading: '<h2>Types of Solar Batteries</h2>' },
      { beforeText: 'Factors to Consider', heading: '<h2>Factors to Consider When Choosing a Solar Battery</h2>' },
      { beforeText: 'Maximizing the Lifespan', heading: '<h2>Maximizing the Lifespan of Your Solar Battery</h2>' },
    ],
  },

  // #24 — Maintaining and Troubleshooting Inverters
  56637: {
    h1: 'Maintaining and Troubleshooting Inverters',
    h2s: [
      { beforeText: 'If you\'re as fascinated', heading: '<h2>Understanding Inverter Maintenance</h2>' },
      { beforeText: 'Regular Maintenance', heading: '<h2>Regular Maintenance Tips</h2>' },
      { beforeText: 'Common Inverter', heading: '<h2>Common Inverter Problems and Troubleshooting</h2>' },
      { beforeText: 'When to Call', heading: '<h2>When to Call a Professional</h2>' },
    ],
  },

  // #41 — Depth of Discharge (has panel layout with H3)
  124: {
    h1: 'What is Depth of Discharge (DOD)?',
    promoteH3toH2: true,
    h2s: [],
  },

  // ─── OPTIMISE articles (have H1, need H2) ────────────────────────────────

  // #32 — Lithium Battery Overheating
  56573: {
    h2s: [
      { beforeText: 'Due to their greater', heading: '<h2>Why Lithium Batteries Overheat</h2>' },
      { beforeText: 'Several factors', heading: '<h2>Common Causes of Overheating</h2>' },
      { beforeText: 'Preventing overheating', heading: '<h2>How to Prevent Overheating</h2>' },
      { beforeText: 'Proper installation', heading: '<h2>Installation Best Practices</h2>' },
    ],
  },

  // #33 — Power Supply Problems
  56565: {
    h2s: [
      { beforeText: 'Power supply is an essential', heading: '<h2>Common Power Supply Problems in Nigeria</h2>' },
      { beforeText: 'Voltage stabilizers', heading: '<h2>How Voltage Stabilizers Help</h2>' },
      { beforeText: 'Different types', heading: '<h2>Types of Voltage Stabilizers</h2>' },
      { beforeText: 'Choosing the right', heading: '<h2>Choosing the Right Stabilizer</h2>' },
    ],
  },

  // #21 — How Much is Inverter in Nigeria
  57157: {
    h2s: [
      { beforeText: 'Inverters are crucial', heading: '<h2>Factors Affecting Inverter Prices in Nigeria</h2>' },
      { beforeText: 'Inverter Capacity', heading: '<h2>Inverter Capacity and Pricing</h2>' },
      { beforeText: 'When budgeting', heading: '<h2>Additional Costs to Consider</h2>' },
      { beforeText: 'To get the best', heading: '<h2>Tips for Getting the Best Value</h2>' },
    ],
  },

  // #22 — How Much is Solar Inverter
  57155: {
    h2s: [
      { beforeText: 'The demand for solar', heading: '<h2>Understanding Solar Inverters</h2>' },
      { beforeText: 'Solar inverter capacity', heading: '<h2>Factors Affecting Solar Inverter Prices</h2>' },
      { beforeText: 'When choosing', heading: '<h2>Choosing the Right Solar Inverter</h2>' },
      { beforeText: 'To get the best', heading: '<h2>Getting the Best Value</h2>' },
    ],
  },

  // #34 — Science Behind Solar Panels
  56536: {
    h2s: [
      { beforeText: 'Solar panels have grown', heading: '<h2>What Are Solar Panels?</h2>' },
      { beforeText: 'These cells are constructed', heading: '<h2>How Solar Cells Work: The Photovoltaic Effect</h2>' },
      { beforeText: 'The efficiency', heading: '<h2>Solar Panel Efficiency Factors</h2>' },
      { beforeText: 'In conclusion', heading: '<h2>The Future of Solar Panel Technology</h2>' },
    ],
  },

  // #38 — Advancements of Solar Power
  56477: {
    h2s: [
      { beforeText: 'The level of developments', heading: '<h2>The Growth of Solar Energy</h2>' },
      { beforeText: 'One of the most', heading: '<h2>Key Advancements in Solar Technology</h2>' },
      { beforeText: 'Solar battery storage', heading: '<h2>Battery Storage Advancements</h2>' },
      { beforeText: 'In conclusion', heading: '<h2>The Future of Solar Power in Nigeria</h2>' },
    ],
  },
};

// ─── Apply fixes ───────────────────────────────────────────────────────────

async function applyFixes() {
  console.log('=== Step 11.1: Fix H1/H2 Structure (Pass 2) ===');
  console.log('Articles to fix:', Object.keys(fixes).length);

  const results = [];

  for (const [id, fix] of Object.entries(fixes)) {
    const postId = parseInt(id);
    console.log(`\n--- Post ID:${postId} ---`);

    // Read current content
    const readRes = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}?context=edit`, {
      headers: { Authorization: authHeader },
    });
    if (!readRes.ok) {
      console.log(`  READ FAILED: ${readRes.status}`);
      results.push({ id: postId, status: 'READ_FAILED' });
      continue;
    }
    const post = await readRes.json();
    let content = post.content?.raw || '';
    const changes = [];

    // 1. Add H1 if specified and not present
    if (fix.h1 && !/<h1[^>]*>/i.test(content)) {
      content = `<h1>${fix.h1}</h1>\n` + content;
      changes.push('Added H1');
    }

    // 2. Promote H3 → H2 if specified
    if (fix.promoteH3toH2) {
      const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
      if (h3Count > 0) {
        content = content.replace(/<h3([^>]*)>/gi, '<h2$1>').replace(/<\/h3>/gi, '</h2>');
        changes.push(`Promoted ${h3Count} H3 → H2`);
      }
    }

    // 3. Insert H2s
    for (const { beforeText, heading } of fix.h2s) {
      if (!content.includes(heading)) {
        const idx = content.indexOf(beforeText);
        if (idx >= 0) {
          content = content.slice(0, idx) + heading + '\n' + content.slice(idx);
          changes.push(`Added H2: ${heading.replace(/<[^>]+>/g, '')}`);
        } else {
          console.log(`  WARNING: Could not find "${beforeText.slice(0, 40)}..."`);
        }
      }
    }

    if (changes.length === 0) {
      console.log(`  No changes needed`);
      results.push({ id: postId, status: 'NO_CHANGE', changes: [] });
      continue;
    }

    console.log(`  Changes: ${changes.join(', ')}`);

    // Update post
    const updateRes = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}?context=edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ content }),
    });

    if (updateRes.ok) {
      console.log(`  UPDATE: SUCCESS`);
      results.push({ id: postId, status: 'UPDATED', changes });
    } else {
      const body = await updateRes.text();
      console.log(`  UPDATE FAILED: ${updateRes.status} ${body.slice(0, 200)}`);
      results.push({ id: postId, status: 'UPDATE_FAILED', changes });
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  const updated = results.filter(r => r.status === 'UPDATED').length;
  const failed = results.filter(r => r.status.includes('FAILED')).length;
  console.log(`Articles updated: ${updated}`);
  console.log(`Failed: ${failed}`);

  const summary = {
    timestamp: new Date().toISOString(),
    totalArticles: Object.keys(fixes).length,
    updated,
    failed,
    results,
  };

  const outPath = path.join(__dirname, 'out', 'step11-1-h2-fix-pass2-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nSummary saved: ${outPath}`);
}

applyFixes().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

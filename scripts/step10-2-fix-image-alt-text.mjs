// PRAG Step 10.2 — Fix image alt text via WooCommerce API
// for all SEO_READY products (P0, P1, P2).
//
// Step 10 found empty image alt fields across the entire catalogue (58/58).
// This script adds accurate descriptive alt text based on what each image
// represents — the product itself.
//
// Alt text format: "PRAG {product name}" (descriptive, no keyword-stuffing)
// Examples:
//   "PRAG 10kVA servo voltage stabilizer"
//   "PRAG 3kW 24V hybrid inverter"
//
// Restrictions:
//   - Does NOT change product name, slug, SKU, price, stock, or categories
//   - Only updates the `alt` field on product images
//   - Logs every before/after for audit trail
//
// Run from prag-b2b root:
//   node scripts/step10-2-fix-image-alt-text.mjs
//   DRY_RUN=1 node scripts/step10-2-fix-image-alt-text.mjs  (dry run)

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
const WC_KEY = env.WC_CONSUMER_KEY;
const WC_SECRET = env.WC_CONSUMER_SECRET;
const base = `${WP_API_URL}/wc/v3`;
const auth = `consumer_key=${encodeURIComponent(WC_KEY)}&consumer_secret=${encodeURIComponent(WC_SECRET)}`;

// ─── SEO_READY product IDs (39 products) ─────────────────────────────────────
// Same set as the SEO overrides script.
const SEO_READY_IDS = [
  // Heavy-duty inverters
  60455, 60360, 60276, 60359,
  // Hybrid inverters
  60491, 60489, 60464, 60485, 60458, 60406, 60490, 60463,
  // Relay stabilizers
  60468, 60469, 60479, 60309, 60627, 60476, 60447,
  // Servo stabilizers
  60470, 60380, 60471, 60304, 60285, 60482, 60474, 60473, 60493, 60494, 60495,
  // Thyristor stabilizers
  60622, 60477, 60623, 60624,
  // Protective devices
  60357, 60356,
  // Solar charge controllers
  60381, 60289,
  // Solar panels (P0 only)
  60434,
];

// ─── Alt text map: WC ID → alt text ──────────────────────────────────────────
// Based on the product name, cleaned to a natural descriptive phrase.
// Format: "PRAG {cleaned product name}"
const ALT_TEXT_MAP = {
  60455: 'PRAG 2.5kVA 24V heavy-duty inverter',
  60360: 'PRAG 3.5kVA 24V heavy-duty inverter Studer Xtender XTM-3500',
  60276: 'PRAG 6.5kVA 48V heavy-duty inverter',
  60359: 'PRAG 7.5kVA 48V heavy-duty inverter',

  60491: 'PRAG 3.6kW 24V hybrid inverter MPPT 5000W',
  60489: 'PRAG 3.8kVA 24V heavy-duty hybrid inverter MPPT 1600W',
  60464: 'PRAG 3kW 24V hybrid inverter MPPT 2400W',
  60485: 'PRAG 5.5kW 48V hybrid inverter MPPT 6000W',
  60458: 'PRAG 5kW 48V hybrid inverter MPPT 5000W',
  60406: 'PRAG 5kW 48V hybrid inverter zero transfer time MPPT 4000W',
  60490: 'PRAG 6.3kVA 48V heavy-duty hybrid inverter MPPT 6400W',
  60463: 'PRAG 6kW 48V hybrid inverter MPPT 6000W expandable',

  60468: 'PRAG 5kVA relay voltage stabilizer 95-270V',
  60469: 'PRAG 5kVA relay XTRA power voltage stabilizer 95-280V',
  60479: 'PRAG 20kVA relay voltage stabilizer 45-280V',
  60309: 'PRAG 20kVA relay voltage stabilizer 95-280V',
  60627: 'PRAG 25kVA relay voltage stabilizer 45-280V',
  60476: 'PRAG 30kVA relay voltage stabilizer 45-280V',
  60447: 'PRAG 30kVA relay voltage stabilizer 95-270V',

  60470: 'PRAG 10kVA servo voltage stabilizer 100-250V',
  60380: 'PRAG 10kVA servo voltage stabilizer 130-250V',
  60471: 'PRAG 15kVA servo voltage stabilizer 100-260V',
  60304: 'PRAG 20kVA servo voltage stabilizer 80-260V',
  60285: 'PRAG 30kVA servo voltage stabilizer 80-260V',
  60482: 'PRAG 50kVA servo voltage stabilizer 80-260V',
  60474: 'PRAG 30kVA 3-phase servo voltage stabilizer 260-456V',
  60473: 'PRAG 60kVA 3-phase servo voltage stabilizer 260-456V',
  60493: 'PRAG 100kVA 3-phase servo voltage stabilizer 304-456V',
  60494: 'PRAG 200kVA 3-phase servo voltage stabilizer 304-456V',
  60495: 'PRAG 200kVA 3-phase servo voltage stabilizer 304-456V independent phase regulation',

  60622: 'PRAG 10kVA thyristor voltage stabilizer 50-255V',
  60477: 'PRAG 10kVA thyristor voltage stabilizer 95-250V',
  60623: 'PRAG 20kVA thyristor voltage stabilizer 50-255V',
  60624: 'PRAG 30kVA thyristor voltage stabilizer 50-255V',

  60357: 'PRAG DS50/320(V+T)-S AC surge protective device with 2-pole enclosure',
  60356: 'PRAG PV40-200-V-C-S 200V DC surge protective device with 2-pole enclosure',

  60381: 'PRAG 40A MPPT solar charge controller',
  60289: 'PRAG EPSolar remote display with cable for solar charge controllers',

  60434: 'PRAG 535W Jinko mono solar panel',
};

// ─── Fetch product images ────────────────────────────────────────────────────
async function getProductImages(id) {
  const url = `${base}/products/${id}?_fields=id,name,slug,images&${auth}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET product ${id} failed: HTTP ${res.status}`);
  return res.json();
}

// ─── Update product images with alt text ─────────────────────────────────────
async function updateProductImages(id, images) {
  const url = `${base}/products/${id}?${auth}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      images: images.map((img) => ({
        id: img.id,
        src: img.src,
        name: img.name,
        alt: img.alt,
      })),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`PUT product ${id} failed: HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const DRY_RUN = process.env.DRY_RUN === '1';
  const log = [];

  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Step 10.2 — Fixing image alt text for ${SEO_READY_IDS.length} SEO_READY products\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const id of SEO_READY_IDS) {
    const altText = ALT_TEXT_MAP[id];
    if (!altText) {
      console.log(`─ ${id}: NO ALT TEXT DEFINED — skipping`);
      skipped++;
      continue;
    }

    console.log(`─ ${id}: ${altText}`);

    // 1. Fetch current images
    let product;
    try {
      product = await getProductImages(id);
    } catch (err) {
      console.error(`  ERROR fetching: ${err.message}`);
      errors++;
      log.push({ id, status: 'ERROR_FETCH', error: err.message });
      continue;
    }

    const images = product.images ?? [];
    if (images.length === 0) {
      console.log(`  No images — skipping`);
      skipped++;
      log.push({ id, name: product.name, status: 'NO_IMAGES' });
      continue;
    }

    // Check if alt text already matches (skip if already set correctly)
    const allMatch = images.every((img) => img.alt === altText);
    if (allMatch) {
      console.log(`  Alt text already correct — skipping`);
      skipped++;
      log.push({ id, name: product.name, status: 'ALREADY_SET', altText });
      continue;
    }

    // Log before state
    const before = images.map((img) => ({ id: img.id, alt: img.alt || '' }));
    console.log(`  Before: ${before.map((b) => `alt="${b.alt}"`).join(', ')}`);

    // Set alt text on all images
    const updatedImages = images.map((img) => ({
      ...img,
      alt: altText,
    }));

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would set: alt="${altText}" on ${images.length} image(s)`);
      log.push({ id, name: product.name, status: 'DRY_RUN', before, after: altText });
      continue;
    }

    // 2. Update via API
    try {
      await updateProductImages(id, updatedImages);
      console.log(`  After: alt="${altText}" on ${images.length} image(s)`);
      updated++;
      log.push({ id, name: product.name, status: 'UPDATED', before, after: altText, imageCount: images.length });
    } catch (err) {
      console.error(`  ERROR updating: ${err.message}`);
      errors++;
      log.push({ id, name: product.name, status: 'ERROR_UPDATE', error: err.message });
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  // Write audit log
  const logPath = path.join(ROOT, 'scripts', 'out', 'step10-2-alt-text-log.json');
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf8');

  console.log(`\n── Summary ──`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (already set / no images): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Audit log: ${logPath}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

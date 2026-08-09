// PRAG Step 10.2 — Rewrite duplicate/templated product short descriptions
// for REWRITE-classified SEO_READY products.
//
// Step 10 found duplicate short descriptions across:
//   - Relay 45-280V trio (15/20/25KVA share identical copy — 15KVA is PRAG_REVIEW_REQUIRED)
//   - 200KVA 3-phase servo pair (standard vs independent phase regulation)
//   - 2 surge protectors (DS50 AC + PV40 DC share identical copy)
//
// This script differentiates each product's short description using actual
// capacity, voltage, technology, and application differences.
//
// Restrictions:
//   - Only updates short_description (not full description, specs, or any other field)
//   - Does NOT change product name, slug, SKU, price, stock, categories, or images
//   - Does NOT invent technical details
//   - Does NOT add unsupported performance claims
//   - Preserves the WhatsApp contact button
//
// Products NOT rewritten (CONTENT DATA REQUIRED FROM PRAG):
//   - 535W Jinko Solar Panel (60434): short desc says "Canadian" but product is Jinko.
//     Correct brand text requires PRAG confirmation. Left unchanged.
//
// Run from prag-b2b root:
//   node scripts/step10-2-rewrite-descriptions.mjs
//   DRY_RUN=1 node scripts/step10-2-rewrite-descriptions.mjs  (dry run)

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

const WHATSAPP_BTN = '<p><a href="https://wa.me/+2347036463977"><img class="alignnone size-medium wp-image-57655" src="https://prag.global/wp-content/uploads/2025/04/WhatsApp-Button-4-300x69.png" alt="" width="300" height="69"></a></p>';

// ─── New short descriptions ──────────────────────────────────────────────────
// Each description is unique and communicates the product's specific capacity,
// voltage range, technology, and intended application.
// No invented technical details. No unsupported performance claims.

const REWRITES = {
  // ── 20KVA Relay Voltage Stabilizer (45-280V) — WC:60479 ──
  // Was: identical to 15KVA and 25KVA (templated, said "20000VA")
  // Now: capacity-specific, mentions 20kVA / 20000VA
  60479: `<p>The PRAG 20kVA relay voltage stabilizer handles input voltage from 45-280V, delivering steady 220V output for Nigerian commercial facilities with severe voltage dips. With 20000VA capacity, it protects equipment and machinery in areas with inconsistent power supply.</p>
<ul>
<li><strong>Wide Voltage Range:</strong> Handles input voltage from 45-280V, ideal for areas with inconsistent power supply.</li>
<li><strong>Reliable Output:</strong> Maintains a steady 220V output with ±10% tolerance, ensuring optimal appliance performance.</li>
<li><strong>Advanced Protection:</strong> Built-in safeguards against over-voltage, overload, high temperature, and short circuits keep your devices safe.</li>
<li><strong>Flexible Delay Options:</strong> Short (3-5 seconds) and long (3-7 minutes) delays protect sensitive electronics during power fluctuations.</li>
<li><strong>20kVA Capacity:</strong> With 20000VA, this stabilizer supports commercial loads, making it suitable for offices, shops, and small facilities.</li>
<li><strong>Compact and Durable:</strong> Dark grey, compact design fits easily in tight spaces and adds a sleek look to your setup.</li>
</ul>
${WHATSAPP_BTN}`,

  // ── 25KVA Relay Voltage Stabilizer (45-280V) — WC:60627 ──
  // Was: identical to 15KVA and 20KVA (templated, incorrectly said "20000VA")
  // Now: capacity-specific, mentions 25kVA / 25000VA
  60627: `<p>The PRAG 25kVA relay voltage stabilizer handles input voltage from 45-280V, delivering steady 220V output for Nigerian commercial and light-industrial facilities with severe voltage dips. With 25000VA capacity, it protects motors and equipment in areas with inconsistent power supply.</p>
<ul>
<li><strong>Wide Voltage Range:</strong> Handles input voltage from 45-280V, ideal for areas with inconsistent power supply.</li>
<li><strong>Reliable Output:</strong> Maintains a steady 220V output with ±10% tolerance, ensuring optimal appliance performance.</li>
<li><strong>Advanced Protection:</strong> Built-in safeguards against over-voltage, overload, high temperature, and short circuits keep your devices safe.</li>
<li><strong>Flexible Delay Options:</strong> Short (3-5 seconds) and long (3-7 minutes) delays protect sensitive electronics during power fluctuations.</li>
<li><strong>25kVA Capacity:</strong> With 25000VA, this stabilizer supports commercial and light-industrial loads, making it suitable for workshops and larger facilities.</li>
<li><strong>Compact and Durable:</strong> Dark grey, compact design fits easily in tight spaces and adds a sleek look to your setup.</li>
</ul>
${WHATSAPP_BTN}`,

  // ── 200KVA 3-Phase Servo (304-456V) Standard — WC:60494 ──
  // Was: templated short desc shared with 100KVA variant
  // Now: mentions 200kVA capacity specifically
  60494: `<p>The PRAG 200kVA 3-phase servo voltage stabilizer regulates 304-456V input to steady 380V output for heavy Nigerian industrial installations. Servo-motor precision protects large-scale machinery and plant equipment from voltage fluctuation.</p>
<ul>
<li><strong>Input Voltage</strong>: <strong>AC 175V-265V / 304V-456V</strong></li>
<li><strong>Output Voltage</strong>: AC <strong>380V ± 3%</strong>, suitable for both <strong>50Hz and 60Hz</strong> operations</li>
<li><strong>Delay Time</strong>: Quick response with a <strong>short delay of 3-5 seconds</strong></li>
<li><strong>Comprehensive Protection</strong>: Equipped with safeguards against <strong>over voltage</strong>, <strong>overload</strong>, <strong>high temperature</strong>, and <strong>short circuits</strong></li>
<li><strong>Dimensions</strong>: Packing size of <strong>95 cm x 72 cm x 159 cm</strong> facilitates easy transport.</li>
<li><strong>Weight</strong>: Weighing <strong>562&nbsp;kg</strong> (gross), this regulator is built to last.</li>
</ul>
${WHATSAPP_BTN}`,

  // ── 200KVA 3-Phase Servo (304-456V) Independent Phase Regulation — WC:60495 ──
  // Was: identical to standard 200KVA (missing independent phase regulation distinction)
  // Now: clearly differentiates the independent phase regulation feature
  60495: `<p>The PRAG 200kVA 3-phase servo voltage stabilizer with independent phase regulation corrects each phase individually, making it ideal for Nigerian industrial plants with unbalanced loads. 304-456V input, steady 380V output per phase.</p>
<ul>
<li><strong>Independent Phase Regulation</strong>: Each phase is regulated individually, compensating for unbalanced loads across the three phases</li>
<li><strong>Input Voltage</strong>: <strong>AC 175V-265V / 304V-456V</strong></li>
<li><strong>Output Voltage</strong>: AC <strong>380V ± 3%</strong>, suitable for both <strong>50Hz and 60Hz</strong> operations</li>
<li><strong>Delay Time</strong>: Quick response with a <strong>short delay of 3-5 seconds</strong></li>
<li><strong>Comprehensive Protection</strong>: Equipped with safeguards against <strong>over voltage</strong>, <strong>overload</strong>, <strong>high temperature</strong>, and <strong>short circuits</strong></li>
</ul>
${WHATSAPP_BTN}`,

  // ── DS50/320(V+T)-S AC Surge Protective Device — WC:60357 ──
  // Was: identical to PV40 DC SPD (generic "surge protective device")
  // Now: AC-specific, mentions AC power system protection
  60357: `<p>The PRAG DS50/320(V+T)-S is an AC surge protective device designed for low-voltage AC power supply systems at the boundaries from lightning protection zone 1-2 and higher. Type 1+2 protection for Nigerian AC power installations.</p>
<ul>
<li><strong>Type</strong>: AC surge protective device (Type 1+2)</li>
<li><strong>Model</strong>: DS50/320(V+T)-S with 2-pole enclosure</li>
<li><strong>Application</strong>: Low-voltage AC power supply systems</li>
<li><strong>Protection Zone</strong>: Lightning protection zones 1-2 and higher</li>
</ul>
${WHATSAPP_BTN}`,

  // ── PV40-200-V-C-S 200V DC Surge Protective Device — WC:60356 ──
  // Was: identical to DS50 AC SPD (generic "surge protective device")
  // Now: DC-specific, mentions solar PV DC system protection
  60356: `<p>The PRAG PV40-200-V-C-S is a DC surge protective device designed for low-voltage DC power supply systems, particularly solar PV installations, at the boundaries from lightning protection zone 1-2 and higher. Type 1+2 protection for Nigerian solar DC power systems.</p>
<ul>
<li><strong>Type</strong>: DC surge protective device (Type 1+2)</li>
<li><strong>Model</strong>: PV40-200-V-C-S 200V with 2-pole enclosure</li>
<li><strong>Application</strong>: Low-voltage DC power supply systems, solar PV</li>
<li><strong>Protection Zone</strong>: Lightning protection zones 1-2 and higher</li>
</ul>
${WHATSAPP_BTN}`,
};

// ─── Fetch current product state ─────────────────────────────────────────────
async function getProduct(id) {
  const url = `${base}/products/${id}?_fields=id,name,slug,sku,short_description&${auth}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET product ${id} failed: HTTP ${res.status}`);
  return res.json();
}

// ─── Update short description ────────────────────────────────────────────────
async function updateShortDescription(id, shortDescription) {
  const url = `${base}/products/${id}?${auth}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ short_description: shortDescription }),
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
  const ids = Object.keys(REWRITES).map(Number);

  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Step 10.2 — Rewriting short descriptions for ${ids.length} REWRITE products\n`);

  let updated = 0;
  let errors = 0;

  for (const id of ids) {
    const newDesc = REWRITES[id];
    console.log(`─ ${id}: ${newDesc.slice(0, 80).replace(/\n/g, ' ')}...`);

    // 1. Fetch current state
    let product;
    try {
      product = await getProduct(id);
    } catch (err) {
      console.error(`  ERROR fetching: ${err.message}`);
      errors++;
      log.push({ id, status: 'ERROR_FETCH', error: err.message });
      continue;
    }

    const beforeLen = (product.short_description ?? '').length;
    const afterLen = newDesc.length;
    console.log(`  Before: ${beforeLen} chars → After: ${afterLen} chars`);

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would update short_description`);
      log.push({ id, name: product.name, status: 'DRY_RUN', beforeLen, afterLen });
      continue;
    }

    // 2. Update via API
    try {
      await updateShortDescription(id, newDesc);
      console.log(`  Updated successfully`);
      updated++;
      log.push({ id, name: product.name, status: 'UPDATED', beforeLen, afterLen });
    } catch (err) {
      console.error(`  ERROR updating: ${err.message}`);
      errors++;
      log.push({ id, name: product.name, status: 'ERROR_UPDATE', error: err.message });
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  // Write audit log
  const logPath = path.join(ROOT, 'scripts', 'out', 'step10-2-rewrite-log.json');
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf8');

  console.log(`\n── Summary ──`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log(`Audit log: ${logPath}`);

  // Note: products NOT rewritten
  console.log(`\n── CONTENT DATA REQUIRED FROM PRAG ──`);
  console.log(`  535W Jinko Mono Solar Panel (WC:60434): short desc says "Canadian Solar Panel" but product is Jinko.`);
  console.log(`  Correct brand text requires PRAG confirmation. Short description left unchanged.`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

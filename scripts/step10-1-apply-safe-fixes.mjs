// PRAG Step 10.1 — Safe WooCommerce category fixes
// AUDIT TRAIL: logs every before/after to scripts/out/step10-1-fix-log.json
// Only implements items classified as SAFE TO FIX.
// Does NOT change slugs, prices, descriptions, SKUs, or URLs.
//
// Run from prag-b2b root:
//   node scripts/step10-1-apply-safe-fixes.mjs

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

// Category IDs (verified from live WC API)
const CAT = {
  uncategorized: 186,
  inverters: 314,
  heavyDutyInverters: 315,
  hybridInverters: 319,
  sales: 317,
  solar: 320,
  solarChargeControllers: 325,
  solarPanels: 326,
  batteries: 327,
  lithiumBatteries: 344,
  lithiumIon: 345,
  voltageStabilizers: 322,
  relayVoltageStabilizers: 323,
  servoVoltageStabilizers: 324,
  thyristorStabilizers: 349,
  advancedStabilizers: 338,
  protectiveDevice: 340,
  accessories: 335,
  moreProducts: 331,
  healthFitness: 332,
  travel: 333,
  personalElectronics: 334,
};

// ─── SAFE TO FIX definitions ─────────────────────────────────────────────────
// Each fix: { id, name, reason, before: [catIds], after: [catIds] }
// Only category assignment changes. No slugs, prices, descriptions, or SKUs.
const fixes = [
  // ── Section 2: Uncategorized stabilizers → relay-voltage-stabilizers ──
  {
    id: 60309,
    name: '20KVA Relay Voltage Stabilizer (95-280V)',
    reason: 'Genuine relay stabilizer assigned only to uncategorized. Name says "Relay Voltage Stabilizer"; short desc confirms "Central Stabilizer... Input Voltage (95V-280V)". Add relay-voltage-stabilizers + voltage-stabilizers (parent); remove uncategorized.',
    before: [CAT.uncategorized],
    after: [CAT.relayVoltageStabilizers, CAT.voltageStabilizers],
  },
  {
    id: 60447,
    name: '30KVA Relay Voltage Stabilizer (95-270V)',
    reason: 'Genuine relay stabilizer assigned only to uncategorized. Name says "Relay Voltage Stabilizer"; short desc confirms "TMA-30KVA (95-270V)-RELAY". Add relay-voltage-stabilizers + voltage-stabilizers (parent); remove uncategorized.',
    before: [CAT.uncategorized],
    after: [CAT.relayVoltageStabilizers, CAT.voltageStabilizers],
  },

  // ── Section 4: Hybrid inverters missing hybrid-inverters category ──
  {
    id: 60486,
    name: '3KW/24V Hybrid Inverter (3000W-MPPT)',
    reason: 'Product name says "Hybrid Inverter"; short desc confirms "Built-in MPPT Solar Charge Controller" and "Compatible with all Battery types, including Lithium". Clearly a hybrid inverter. Add hybrid-inverters; keep existing inverters (parent) + sales.',
    before: [CAT.inverters, CAT.sales],
    after: [CAT.hybridInverters, CAT.inverters, CAT.sales],
  },
  {
    id: 60485,
    name: '5.5KW/48V Hybrid Inverter (6000W-MPPT)',
    reason: 'Product name says "Hybrid Inverter"; short desc confirms "Built-in MPPT Solar Charge Controller: 450V/6000W" and "Compatible with all Battery types, including Lithium". Clearly a hybrid inverter. Add hybrid-inverters; keep existing inverters (parent) + sales.',
    before: [CAT.inverters, CAT.sales],
    after: [CAT.hybridInverters, CAT.inverters, CAT.sales],
  },

  // ── Section 5: Accessories incorrectly in solar-charge-controllers + solar ──
  {
    id: 60366,
    name: 'Battery Status Processor BSP-500',
    reason: 'Battery monitoring accessory for Studer systems. Name and description confirm it is a state-of-charge processor, not a charge controller or solar product. Already correctly in accessories. Remove solar-charge-controllers + solar; keep accessories.',
    before: [CAT.accessories, CAT.solar, CAT.solarChargeControllers],
    after: [CAT.accessories],
  },
  {
    id: 60364,
    name: 'Battery Temperature Sensor Studer BTS-01',
    reason: 'Temperature sensor for Studer inverter-chargers. Name and description confirm it is a sensor accessory, not a charge controller or solar product. Already correctly in accessories. Remove solar-charge-controllers + solar; keep accessories.',
    before: [CAT.accessories, CAT.solar, CAT.solarChargeControllers],
    after: [CAT.accessories],
  },
  {
    id: 60365,
    name: 'Internet Based Communication Set XCOM-GSM (Including GSM Modem & Cables)',
    reason: 'GSM modem for remote communication with Studer systems. Name and description confirm it is a communication accessory, not a charge controller or solar product. Already correctly in accessories. Remove solar-charge-controllers + solar; keep accessories + sales.',
    before: [CAT.accessories, CAT.sales, CAT.solar, CAT.solarChargeControllers],
    after: [CAT.accessories, CAT.sales],
  },
  {
    id: 60368,
    name: 'Internet Based Communication Set XCOM-LAN (Including Ethernet Bridge & Cables)',
    reason: 'Ethernet bridge for remote communication with Studer systems. Name and description confirm it is a communication accessory, not a charge controller or solar product. Already correctly in accessories. Remove solar-charge-controllers + solar; keep accessories.',
    before: [CAT.accessories, CAT.solar, CAT.solarChargeControllers],
    after: [CAT.accessories],
  },
  {
    id: 60363,
    name: 'RCC-02 Remote Control Centre For Studer',
    reason: 'Remote control centre for Studer systems. Name and description confirm it is a remote control accessory, not a charge controller or solar product. Already correctly in accessories. Remove solar-charge-controllers + solar; keep accessories.',
    before: [CAT.accessories, CAT.solar, CAT.solarChargeControllers],
    after: [CAT.accessories],
  },
];

// ─── Fetch current product state (for audit trail verification) ──────────────
async function getProduct(id) {
  const url = `${base}/products/${id}?_fields=id,name,slug,sku,categories&${auth}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET product ${id} failed: HTTP ${res.status}`);
  return res.json();
}

// ─── Apply category update ───────────────────────────────────────────────────
async function updateProductCategories(id, categoryIds) {
  const url = `${base}/products/${id}?${auth}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categories: categoryIds.map((cid) => ({ id: cid })),
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
  const log = [];
  const DRY_RUN = process.env.DRY_RUN === '1';
  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Applying ${fixes.length} safe category fixes...\n`);

  for (const fix of fixes) {
    console.log(`─ ${fix.id}: ${fix.name}`);
    console.log(`  Reason: ${fix.reason.slice(0, 100)}...`);

    // 1. Fetch current state
    let before;
    try {
      before = await getProduct(fix.id);
    } catch (err) {
      console.error(`  ERROR fetching before state: ${err.message}`);
      log.push({ ...fix, status: 'ERROR_FETCH_BEFORE', error: err.message });
      continue;
    }
    const beforeCats = before.categories?.map((c) => ({ id: c.id, slug: c.slug, name: c.name })) ?? [];
    const beforeCatIds = beforeCats.map((c) => c.id).sort((a, b) => a - b);
    console.log(`  Before: [${beforeCatIds.join(', ')}] (${beforeCats.map((c) => c.slug).join(', ')})`);

    // Verify before matches expected
    const expectedBefore = [...fix.before].sort((a, b) => a - b);
    const beforeMatches = JSON.stringify(beforeCatIds) === JSON.stringify(expectedBefore);
    if (!beforeMatches) {
      console.warn(`  WARNING: Before state does not match expected!`);
      console.warn(`    Expected: [${expectedBefore.join(', ')}]`);
      console.warn(`    Actual:   [${beforeCatIds.join(', ')}]`);
      // Continue anyway — log the discrepancy
    }

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would set to: [${fix.after.join(', ')}]`);
      log.push({ ...fix, status: 'DRY_RUN', beforeActual: beforeCats, beforeExpected: fix.before, after: fix.after });
      continue;
    }

    // 2. Apply fix
    let after;
    try {
      after = await updateProductCategories(fix.id, fix.after);
    } catch (err) {
      console.error(`  ERROR applying fix: ${err.message}`);
      log.push({ ...fix, status: 'ERROR_APPLY', error: err.message, beforeActual: beforeCats });
      continue;
    }
    const afterCats = after.categories?.map((c) => ({ id: c.id, slug: c.slug, name: c.name })) ?? [];
    const afterCatIds = afterCats.map((c) => c.id).sort((a, b) => a - b);
    console.log(`  After:  [${afterCatIds.join(', ')}] (${afterCats.map((c) => c.slug).join(', ')})`);

    // 3. Verify after matches expected
    const expectedAfter = [...fix.after].sort((a, b) => a - b);
    const afterMatches = JSON.stringify(afterCatIds) === JSON.stringify(expectedAfter);
    if (!afterMatches) {
      console.warn(`  WARNING: After state does not match expected!`);
      console.warn(`    Expected: [${expectedAfter.join(', ')}]`);
      console.warn(`    Actual:   [${afterCatIds.join(', ')}]`);
    }

    console.log(`  Status: ${afterMatches ? 'OK' : 'MISMATCH'}\n`);
    log.push({
      id: fix.id,
      name: fix.name,
      reason: fix.reason,
      before: beforeCats,
      after: afterCats,
      beforeExpected: fix.before,
      afterExpected: fix.after,
      status: afterMatches ? 'OK' : 'MISMATCH',
    });
  }

  // Write audit log
  const logPath = path.join(__dirname, 'out', 'step10-1-fix-log.json');
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log(`\nAudit log: ${logPath}`);
  console.log(`\nSummary: ${log.filter((l) => l.status === 'OK').length} OK, ${log.filter((l) => l.status !== 'OK').length} issues`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

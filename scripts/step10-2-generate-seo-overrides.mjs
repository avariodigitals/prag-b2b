// PRAG Step 10.2 — Generate SEO title + meta description overrides
// for all SEO_READY products (P0, P1, P2).
//
// Uses the Step 8 admin SEO override architecture (seoOverrides map in
// b2b-admin-config.json). Resolution remains:
//   manual product SEO override → automatic {Product Name} | PRAG fallback
//
// Meta descriptions are unique per product — no identical templates.
// SEO titles follow the approved structure where appropriate:
//   {Capacity / Model} {Product Type} in Nigeria | PRAG
//
// Run from prag-b2b root:
//   node scripts/step10-2-generate-seo-overrides.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ADMIN_CONFIG_PATH = path.join(ROOT, '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');

// ─── Product classification ──────────────────────────────────────────────────
// PRAG_REVIEW_REQUIRED: SEO recommendation depends on unresolved info.
//   - Probable duplicate relationship (2 pairs)
//   - Conflicting technical specification (2 lithium batteries)
const PRAG_REVIEW_REQUIRED = new Set([
  60486, // 3KW/24V Hybrid Inverter (3000W-MPPT) — duplicate pair
  60297, // 3KW/24V Hybrid Inverter (3000W-MPPT) — duplicate pair
  60625, // 15KVA Relay Voltage Stabilizer (45-280V) — duplicate pair
  60345, // 15KVA Relay Voltage Stabilizer (45-280V) — duplicate pair
  60488, // 5KWH/24V Lithium Battery — spec conflict (kWh/V rounding)
  60487, // 5KWH/48V Lithium Battery — spec conflict (kWh/V rounding)
]);

// P3 parked: do not spend significant SEO effort.
const P3_PARKED = new Set([
  60452, // 455W Canadian Mono Panel — P3, missing price, PRAG-decision
  60462, // 480W Jinko Mono Panel — P3, wrong brand copy, PRAG-decision
  60433, // 540W Mono Panel — P3, missing price, PRAG-decision
  60432, // 595W Canadian Mono Panel — P3, missing price, PRAG-decision
  60366, // Battery Status Processor BSP-500 — P3, excluded accessory
  60364, // Battery Temperature Sensor Studer BTS-01 — P3, excluded
  60365, // XCOM-GSM — P3, excluded accessory
  60368, // XCOM-LAN — P3, excluded accessory
  60363, // RCC-02 Remote Control Centre — P3, excluded accessory
  60369, // Car MP3 Bluetooth Player — P3, excluded
  60292, // Car MP3 Player — P3, excluded
  60290, // TMB-1491 Blood Pressure Monitor — P3, excluded
  60291, // Traveler Luggage Scale — P3, excluded
]);

// ─── SEO overrides for all 39 SEO_READY products ─────────────────────────────
// Each entry keyed by canonical route: /products/{preferred-category}/{slug}
// seoTitle: manual override (replaces {Product Name} | PRAG fallback)
// seoDescription: unique meta description using verified product data only
//
// No "Best", "Cheapest", "#1", "Leading", "Top" in titles.
// No unsupported performance claims.
// No identical templates — each description communicates a meaningful differentiator.

const SEO_OVERRIDES = {
  // ── Heavy-Duty Inverters (4) ──────────────────────────────────────────────
  '/products/heavy-duty-inverters/2-5kva-24v-heavy-duty-inverter': {
    seoTitle: '2.5kVA 24V Heavy-Duty Inverter in Nigeria | PRAG',
    seoDescription: 'PRAG 2.5kVA 24V heavy-duty inverter — compact continuous-duty backup for small Nigerian homes and offices. 24V battery bank, pure sine wave output. Specs, pricing and availability.',
  },
  '/products/heavy-duty-inverters/3-5kva-24v-heavy-duty-inverter-studer-xtender-xtm-3500': {
    seoTitle: '3.5kVA 24V Heavy-Duty Inverter (Studer Xtender) in Nigeria | PRAG',
    seoDescription: 'PRAG Studer Xtender XTM-3500 3.5kVA 24V heavy-duty inverter — Swiss-engineered inverter-charger for demanding Nigerian backup installations. 24V system, expandable. Specs and pricing.',
  },
  '/products/heavy-duty-inverters/6-5kva-48v-heavy-duty-inverter': {
    seoTitle: '6.5kVA 48V Heavy-Duty Inverter in Nigeria | PRAG',
    seoDescription: 'PRAG 6.5kVA 48V heavy-duty inverter — continuous-duty power for larger Nigerian homes and small businesses. 48V battery bank for efficiency at higher loads. Specs, pricing and availability.',
  },
  '/products/heavy-duty-inverters/7-5kva-48v-heavy-duty-inverter': {
    seoTitle: '7.5kVA 48V Heavy-Duty Inverter in Nigeria | PRAG',
    seoDescription: 'PRAG 7.5kVA 48V heavy-duty inverter — high-capacity continuous-duty backup for Nigerian businesses and large residences. 48V system, pure sine wave. Specs, pricing and availability.',
  },

  // ── Hybrid Inverters (8) ──────────────────────────────────────────────────
  '/products/hybrid-inverters/3-6kw-24v-hybrid-inverter-mppt-5000w': {
    seoTitle: '3.6kW 24V Hybrid Inverter (MPPT 5000W) | PRAG',
    seoDescription: 'PRAG 3.6kW 24V hybrid inverter with 5000W MPPT solar charging — combines solar and battery backup in one unit for Nigerian homes. 24V system, compatible with lithium batteries. Specs and pricing.',
  },
  '/products/hybrid-inverters/3-8kva-24v-heavy-duty-hybrid-inverter-mppt-1600w': {
    seoTitle: '3.8kVA 24V Hybrid Inverter (MPPT 1600W) | PRAG',
    seoDescription: 'PRAG 3.8kVA 24V heavy-duty hybrid inverter with 1600W MPPT — solar charging and battery backup in a single unit for Nigerian homes and small businesses. 24V system. Specs and pricing.',
  },
  '/products/hybrid-inverters/3kw-24v-hybrid-inverter-2400w-mppt': {
    seoTitle: '3kW 24V Hybrid Inverter (MPPT 2400W) | PRAG',
    seoDescription: 'PRAG 3kW 24V hybrid inverter with 2400W MPPT solar charging — entry-level solar-plus-storage in one unit for Nigerian homes. 24V battery bank, lithium-compatible. Specs and pricing.',
  },
  '/products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt': {
    seoTitle: '5.5kW 48V Hybrid Inverter (MPPT 6000W) | PRAG',
    seoDescription: 'PRAG 5.5kW 48V hybrid inverter with 6000W MPPT — high-power solar charging and battery backup for Nigerian homes and businesses. 48V system, lithium-compatible. Specs and pricing.',
  },
  '/products/hybrid-inverters/5kw-48v-hybrid-inverter-5000w-mppt': {
    seoTitle: '5kW 48V Hybrid Inverter (MPPT 5000W) | PRAG',
    seoDescription: 'PRAG 5kW 48V hybrid inverter with 5000W MPPT solar charging — mid-range solar-plus-storage unit for Nigerian homes and businesses. 48V system, lithium-compatible. Specs and pricing.',
  },
  '/products/hybrid-inverters/5kw-48v-hybrid-inverter-zero-transfer-time-4000w-mppt-expandable-5-45kw': {
    seoTitle: '5kW 48V Hybrid Inverter Zero Transfer Time (MPPT 4000W) | PRAG',
    seoDescription: 'PRAG 5kW 48V hybrid inverter with zero transfer time and 4000W MPPT — seamless backup with solar charging, expandable from 5 to 45kW for growing Nigerian installations. Specs and pricing.',
  },
  '/products/hybrid-inverters/6-3kva-48v-heavy-duty-hybrid-inverter-mppt-6400w': {
    seoTitle: '6.3kVA 48V Hybrid Inverter (MPPT 6400W) | PRAG',
    seoDescription: 'PRAG 6.3kVA 48V heavy-duty hybrid inverter with 6400W MPPT — high-capacity solar charging and battery backup for Nigerian businesses and large homes. 48V system. Specs and pricing.',
  },
  '/products/hybrid-inverters/6kw-48v-hybrid-inverter-6000w-mppt-expandable-6-to-36kw': {
    seoTitle: '6kW 48V Hybrid Inverter (MPPT 6000W) Expandable | PRAG',
    seoDescription: 'PRAG 6kW 48V hybrid inverter with 6000W MPPT — expandable from 6 to 36kW for scalable Nigerian solar-plus-storage systems. 48V system, lithium-compatible. Specs and pricing.',
  },

  // ── Relay Voltage Stabilizers (7) ─────────────────────────────────────────
  '/products/relay-voltage-stabilizers/5kva-relay-voltage-stabilizer-95-270v': {
    seoTitle: '5kVA Relay Voltage Stabilizer (95-270V) in Nigeria | PRAG',
    seoDescription: 'PRAG 5kVA relay voltage stabilizer — affordable 220V protection for home appliances in Nigerian areas with moderate voltage fluctuation. 95-270V input range. Specs, pricing and availability.',
  },
  '/products/relay-voltage-stabilizers/5kva-relay-xtra-power-voltage-stabilizer-95-280v': {
    seoTitle: '5kVA Relay Voltage Stabilizer XTRA (95-280V) in Nigeria | PRAG',
    seoDescription: 'PRAG 5kVA XTRA relay voltage stabilizer — wider 95-280V input range for Nigerian areas with severe voltage fluctuation. Protects home and office appliances with steady 220V output. Specs and pricing.',
  },
  '/products/relay-voltage-stabilizers/20kva-relay-voltage-stabilizer-45-280v': {
    seoTitle: '20kVA Relay Voltage Stabilizer (45-280V) in Nigeria | PRAG',
    seoDescription: 'PRAG 20kVA relay voltage stabilizer — wide 45-280V input range for Nigerian commercial facilities with severe voltage dips. Delivers steady 220V to protect equipment and machinery. Specs and pricing.',
  },
  '/products/relay-voltage-stabilizers/20kva-relay-voltage-stabilizer-95-280v': {
    seoTitle: '20kVA Relay Voltage Stabilizer (95-280V) in Nigeria | PRAG',
    seoDescription: 'PRAG 20kVA relay voltage stabilizer — 95-280V input for Nigerian commercial sites with moderate to severe voltage fluctuation. Steady 220V output protects equipment and appliances. Specs and pricing.',
  },
  '/products/relay-voltage-stabilizers/25kva-relay-voltage-stabilizer-45-280v': {
    seoTitle: '25kVA Relay Voltage Stabilizer (45-280V) in Nigeria | PRAG',
    seoDescription: 'PRAG 25kVA relay voltage stabilizer — wide 45-280V input handles extreme voltage dips in Nigerian commercial and light-industrial sites. Steady 220V output protects motors and equipment. Specs and pricing.',
  },
  '/products/relay-voltage-stabilizers/30kva-relay-voltage-stabilizer-45-280v': {
    seoTitle: '30kVA Relay Voltage Stabilizer (45-280V) in Nigeria | PRAG',
    seoDescription: 'PRAG 30kVA relay voltage stabilizer — high-capacity 45-280V input for Nigerian industrial facilities with severe voltage fluctuation. Protects heavy equipment with steady 220V output. Specs and pricing.',
  },
  '/products/relay-voltage-stabilizers/30kva-relay-voltage-stabilizer-95-270v': {
    seoTitle: '30kVA Relay Voltage Stabilizer (95-270V) in Nigeria | PRAG',
    seoDescription: 'PRAG 30kVA relay voltage stabilizer — 95-270V input for Nigerian industrial sites with moderate voltage fluctuation. High-capacity 220V output protects three-phase equipment and machinery. Specs and pricing.',
  },

  // ── Servo Voltage Stabilizers (10) ────────────────────────────────────────
  '/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-100-250v': {
    seoTitle: '10kVA Servo Voltage Stabilizer (100-250V) in Nigeria | PRAG',
    seoDescription: 'PRAG 10kVA servo voltage stabilizer — precise voltage correction for sensitive Nigerian equipment. 100-250V input, steady 220V output. Servo motor technology for tight regulation. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-130-250v': {
    seoTitle: '10kVA Servo Voltage Stabilizer (130-250V) in Nigeria | PRAG',
    seoDescription: 'PRAG 10kVA servo voltage stabilizer — 130-250V input for Nigerian locations with narrower voltage variation. Precise servo-motor regulation delivers steady 220V for sensitive equipment. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/15kva-servo-voltage-stabilizer-100-260v': {
    seoTitle: '15kVA Servo Voltage Stabilizer (100-260V) in Nigeria | PRAG',
    seoDescription: 'PRAG 15kVA servo voltage stabilizer — 100-260V input with precise servo-motor correction for Nigerian offices and workshops with sensitive equipment. Steady 220V output, ±3% regulation. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/20kva-servo-voltage-stabilizer-80-260v': {
    seoTitle: '20kVA Servo Voltage Stabilizer (80-260V) in Nigeria | PRAG',
    seoDescription: 'PRAG 20kVA servo voltage stabilizer — very wide 80-260V input for Nigerian commercial sites with extreme voltage fluctuation. Servo-motor precision delivers steady 220V for sensitive loads. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/30kva-servo-voltage-stabilizer-80-260v': {
    seoTitle: '30kVA Servo Voltage Stabilizer (80-260V) in Nigeria | PRAG',
    seoDescription: 'PRAG 30kVA servo voltage stabilizer — high-capacity 80-260V input for Nigerian industrial facilities with extreme voltage variation. Servo-motor precision protects sensitive three-phase equipment. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/50kva-servo-voltage-stabilizer-80-260v': {
    seoTitle: '50kVA Servo Voltage Stabilizer (80-260V) in Nigeria | PRAG',
    seoDescription: 'PRAG 50kVA servo voltage stabilizer — very high-capacity 80-260V input for Nigerian industrial plants with severe voltage fluctuation. Servo-motor regulation delivers steady 220V for heavy loads. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/30kva-3-phase-servo-voltage-stabilizer-260-456v': {
    seoTitle: '30kVA 3-Phase Servo Voltage Stabilizer (260-456V) in Nigeria | PRAG',
    seoDescription: 'PRAG 30kVA 3-phase servo voltage stabilizer — 260-456V input for Nigerian industrial three-phase equipment. Servo-motor regulation delivers steady 380V output for motors and machinery. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/60kva-3-phase-servo-voltage-stabilizer-260-456v': {
    seoTitle: '60kVA 3-Phase Servo Voltage Stabilizer (260-456V) in Nigeria | PRAG',
    seoDescription: 'PRAG 60kVA 3-phase servo voltage stabilizer — 260-456V input for Nigerian industrial three-phase loads. High-capacity servo-motor regulation delivers steady 380V for heavy machinery and plant equipment. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/100kva-3-phase-servo-voltage-stabilizer-304-456v': {
    seoTitle: '100kVA 3-Phase Servo Voltage Stabilizer (304-456V) in Nigeria | PRAG',
    seoDescription: 'PRAG 100kVA 3-phase servo voltage stabilizer — 304-456V input for heavy Nigerian industrial installations. Servo-motor regulation delivers steady 380V output for large motors and plant equipment. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/200kva-3-phase-servo-voltage-stabilizer-304-456v': {
    seoTitle: '200kVA Servo Voltage Stabilizer (304-456V) in Nigeria | PRAG',
    seoDescription: 'PRAG 200kVA 3-phase servo voltage stabilizer — 304-456V input for heavy Nigerian industrial plants. High-capacity servo-motor regulation delivers steady 380V for large-scale machinery and equipment. Specs and pricing.',
  },
  '/products/servo-voltage-stabilizers/200kva-3-phase-servo-voltage-stabilizer-304-456v-independent-phase-regulation': {
    seoTitle: '200kVA Servo Voltage Stabilizer Independent Phase Regulation in Nigeria | PRAG',
    seoDescription: 'PRAG 200kVA 3-phase servo stabilizer with independent phase regulation — each phase corrected individually for unbalanced Nigerian industrial loads. 304-456V input, steady 380V output. Specs and pricing.',
  },

  // ── Thyristor Stabilizers (4) ─────────────────────────────────────────────
  '/products/thyristor-stabilizers/10kva-thyristor-voltage-stabilizer-50-255v': {
    seoTitle: '10kVA Thyristor Voltage Stabilizer (50-255V) in Nigeria | PRAG',
    seoDescription: 'PRAG 10kVA thyristor voltage stabilizer — maintenance-free solid-state regulation with very wide 50-255V input for Nigerian areas with severe voltage fluctuation. No moving parts, instant response. Specs and pricing.',
  },
  '/products/thyristor-stabilizers/10kva-thyristor-voltage-stabilizer-95-250v': {
    seoTitle: '10kVA Thyristor Voltage Stabilizer (95-250V) in Nigeria | PRAG',
    seoDescription: 'PRAG 10kVA thyristor voltage stabilizer — solid-state maintenance-free regulation with 95-250V input for Nigerian sites with moderate voltage fluctuation. Instant response, no moving parts. Specs and pricing.',
  },
  '/products/thyristor-stabilizers/20kva-thyristor-voltage-stabilizer-50-255v': {
    seoTitle: '20kVA Thyristor Voltage Stabilizer (50-255V) in Nigeria | PRAG',
    seoDescription: 'PRAG 20kVA thyristor voltage stabilizer — maintenance-free solid-state regulation with very wide 50-255V input for Nigerian commercial facilities with severe voltage dips. No moving parts. Specs and pricing.',
  },
  '/products/thyristor-stabilizers/30kva-thyristor-voltage-stabilizer-50-255v': {
    seoTitle: '30kVA Thyristor Voltage Stabilizer (50-255V) in Nigeria | PRAG',
    seoDescription: 'PRAG 30kVA thyristor voltage stabilizer — high-capacity maintenance-free solid-state regulation with 50-255V input for Nigerian industrial sites with extreme voltage fluctuation. No moving parts. Specs and pricing.',
  },

  // ── Protective Devices (2) ────────────────────────────────────────────────
  '/products/protective-device/ds50-320vt-s-ac-surge-protective-device-2-pole-enclosure': {
    seoTitle: 'DS50/320(V+T)-S AC Surge Protective Device | PRAG',
    seoDescription: 'PRAG DS50/320(V+T)-S AC surge protective device — Type 1+2 lightning and surge protection for low-voltage AC power systems in Nigeria. 2-pole enclosure included. Specs, pricing and availability.',
  },
  '/products/protective-device/pv40-200-v-c-s-200v-dc-surge-protective-device-2-pole-enclosure': {
    seoTitle: 'PV40-200-V-C-S 200V DC Surge Protective Device | PRAG',
    seoDescription: 'PRAG PV40-200-V-C-S 200V DC surge protective device — Type 1+2 lightning and surge protection for solar PV DC power systems in Nigeria. 2-pole enclosure included. Specs, pricing and availability.',
  },

  // ── Solar Charge Controllers (2) ──────────────────────────────────────────
  '/products/solar-charge-controllers/prag-40a-mppt-solar-charge-controller': {
    seoTitle: '40A MPPT Solar Charge Controller in Nigeria | PRAG',
    seoDescription: 'PRAG 40A MPPT solar charge controller — maximum power point tracking for efficient solar charging and battery protection in Nigerian solar systems. Compatible with lead-acid and lithium batteries. Specs and pricing.',
  },
  '/products/solar-charge-controllers/epsolar-remote-display-with-cable': {
    seoTitle: 'EPSolar Remote Display with Cable | PRAG',
    seoDescription: 'EPSolar remote display and program controller with cable — monitor and configure EPSolar solar charge controllers remotely in Nigerian solar installations. Specs, pricing and availability.',
  },

  // ── Solar Panels (1 P0) ───────────────────────────────────────────────────
  '/products/solar-panels/535w-jinko-mono-solar-panel': {
    seoTitle: '535W Jinko Mono Solar Panel in Nigeria | PRAG',
    seoDescription: 'PRAG 535W Jinko monocrystalline solar panel — high-efficiency module for residential and commercial solar installations in Nigeria. Durable build, excellent low-light performance. Specs and availability.',
  },
};

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Step 10.2 — Generating SEO overrides for ${Object.keys(SEO_OVERRIDES).length} SEO_READY products\n`);

  // Load the admin config
  const raw = fs.readFileSync(ADMIN_CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);

  // Initialise seoOverrides if not present
  if (!config.seoOverrides || typeof config.seoOverrides !== 'object') {
    config.seoOverrides = {};
  }

  const existingCount = Object.keys(config.seoOverrides).length;
  console.log(`Existing SEO overrides: ${existingCount}`);

  // Merge — only add product overrides, don't touch existing non-product overrides
  let added = 0;
  let updated = 0;
  for (const [route, override] of Object.entries(SEO_OVERRIDES)) {
    if (config.seoOverrides[route]) {
      updated++;
    } else {
      added++;
    }
    config.seoOverrides[route] = {
      ...config.seoOverrides[route],
      ...override,
    };
  }

  console.log(`Added: ${added} new product SEO overrides`);
  console.log(`Updated: ${updated} existing product SEO overrides`);
  console.log(`Total SEO overrides after merge: ${Object.keys(config.seoOverrides).length}`);

  // Write back
  fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`\nWritten to: ${ADMIN_CONFIG_PATH}`);

  // Also save a standalone copy for audit trail
  const auditPath = path.join(ROOT, 'scripts', 'out', 'step10-2-seo-overrides.json');
  fs.writeFileSync(auditPath, JSON.stringify(SEO_OVERRIDES, null, 2), 'utf8');
  console.log(`Audit copy: ${auditPath}`);

  // Summary
  console.log('\n── Summary ──');
  console.log(`SEO_READY products with overrides: ${Object.keys(SEO_OVERRIDES).length}`);
  console.log(`PRAG_REVIEW_REQUIRED (skipped): ${PRAG_REVIEW_REQUIRED.size}`);
  console.log(`P3 parked (skipped): ${P3_PARKED.size}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

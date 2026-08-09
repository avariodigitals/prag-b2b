// PRAG Step 11.1 — Apply SEO Metadata Overrides for KC Articles
//
// Adds admin-config seoOverrides for all 31 KEEP/OPTIMISE/REWRITE articles.
// Does NOT touch MERGE/CONSOLIDATE or RETIRE/REVIEW articles.
//
// Run from prag-b2b root:
//   node scripts/step11-1-apply-seo-metadata.mjs

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

// ─── SEO Metadata for all 31 articles ──────────────────────────────────────
// Format: { slug, seoTitle, seoDescription }
// Excludes MERGE/CONSOLIDATE (9) and RETIRE/REVIEW (2) = 42 - 11 = 31

const seoMetadata = [
  // ─── KEEP (6) ────────────────────────────────────────────────────────────
  { slug: 'what-is-the-difference-between-relay-servo-voltage-stabilizer',
    seoTitle: 'Relay vs Servo Voltage Stabilizer: Which Is Right for You? | PRAG',
    seoDescription: 'Relay vs servo voltage stabilizer comparison — response speed, capacity, price, and best use cases for Nigerian homes and businesses.' },
  { slug: 'inverter-sizing-and-load-capacity-ensuring-efficient-power-supply',
    seoTitle: 'Inverter Sizing Guide: How to Choose the Right Capacity | PRAG',
    seoDescription: 'How to size an inverter for your home or business in Nigeria — calculate total load, add safety margin, and choose the right inverter capacity.' },
  { slug: 'lifepo4-battery-in-nigeria',
    seoTitle: 'LiFePO4 Battery in Nigeria: Benefits, Prices, and Uses | PRAG',
    seoDescription: 'LiFePO4 batteries in Nigeria — longer lifespan, safer chemistry, and better value than lead-acid. Learn why lithium iron phosphate is the future of backup power.' },
  { slug: 'solar-battery',
    seoTitle: 'Solar Batteries: A Complete Guide for Nigerian Homes | PRAG',
    seoDescription: 'Solar battery guide for Nigeria — compare lithium, LiFePO4, and lead-acid options. Learn sizing, lifespan, and how to choose the right solar battery.' },
  { slug: 'maintaining-and-troubleshooting-inverters',
    seoTitle: 'Inverter Maintenance and Troubleshooting Guide | PRAG',
    seoDescription: 'How to maintain and troubleshoot your inverter in Nigeria — common problems, diagnostic steps, and when to call a PRAG engineer for support.' },
  { slug: 'what-is-depth-of-discharge-dod',
    seoTitle: 'What is Depth of Discharge (DOD)? Battery Guide | PRAG',
    seoDescription: 'Depth of discharge (DOD) explained — how it affects battery lifespan, the difference between DOD and SOC, and why it matters for Nigerian backup power systems.' },

  // ─── OPTIMISE (17) ───────────────────────────────────────────────────────
  { slug: 'solar-panel-installation-a-comprehensive-guide-to-harnessing-renewable-energy',
    seoTitle: 'Solar Panel Installation Guide for Nigeria | PRAG',
    seoDescription: 'Complete guide to solar panel installation in Nigeria — planning, site assessment, system types, costs, and maintenance tips for homes and businesses.' },
  { slug: 'what-can-a-2-5-kva-solar-system-power',
    seoTitle: 'What Can a 2.5 kVA Solar System Power? | PRAG',
    seoDescription: 'What can a 2.5 kVA solar system power in Nigeria? See which appliances and combinations work, sizing considerations, and when to upgrade.' },
  { slug: 'solar-installation-lagos-cost',
    seoTitle: 'Solar Installation Cost in Lagos: Complete Guide | PRAG',
    seoDescription: 'Solar installation cost in Lagos — system sizes, pricing factors, and what to expect when going solar in Nigeria. Get expert guidance from PRAG.' },
  { slug: 'servo-stabilizers',
    seoTitle: 'Servo Voltage Stabilizers: Complete Guide | PRAG',
    seoDescription: 'Servo voltage stabilizer guide — how they work, advantages over relay stabilizers, capacity ranges, and choosing the right one for Nigerian equipment.' },
  { slug: 'inverter-solar-battery',
    seoTitle: 'Inverter Solar Battery Systems Explained | PRAG',
    seoDescription: 'How inverter solar battery systems work — combining solar panels, batteries, and inverters for reliable backup power in Nigerian homes and businesses.' },
  { slug: '20kva-servo-voltage-stabilizer',
    seoTitle: '20kVA Servo Voltage Stabilizer Guide | PRAG',
    seoDescription: '20kVA servo voltage stabilizer — industrial-grade voltage protection for Nigerian businesses. Learn specifications, applications, and installation guidance.' },
  { slug: 'inverters-for-renewable-energy-systems',
    seoTitle: 'Inverters for Renewable Energy Systems | PRAG',
    seoDescription: 'Guide to inverters for renewable energy — solar inverters, hybrid inverters, and grid-tied options for Nigerian homes and businesses going solar.' },
  { slug: 'integrating-solar-batteries-with-grid-tied-systems',
    seoTitle: 'Integrating Solar Batteries with Grid-Tied Systems | PRAG',
    seoDescription: 'How to integrate solar batteries with grid-tied systems in Nigeria — hybrid configurations, backup power, and maximizing self-consumption.' },
  { slug: 'what-causes-lithium-batteries-to-overheat-and-how-to-prevent-it',
    seoTitle: 'Lithium Battery Overheating: Causes and Prevention | PRAG',
    seoDescription: 'What causes lithium batteries to overheat and how to prevent it — safety tips, proper installation, and maintenance for Nigerian battery systems.' },
  { slug: 'common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them',
    seoTitle: 'Power Supply Problems and How Stabilizers Help | PRAG',
    seoDescription: 'Common power supply problems in Nigeria — voltage fluctuations, low voltage, high voltage, and how voltage stabilizers protect your equipment.' },
  { slug: 'what-types-of-batteries-are-used-in-solar-electric-systems',
    seoTitle: 'Types of Batteries Used in Solar Electric Systems | PRAG',
    seoDescription: 'Battery types for solar electric systems — lead-acid, lithium-ion, and LiFePO4 compared. Learn which battery is best for your Nigerian solar setup.' },
  { slug: 'how-much-is-inverter-in-nigeria',
    seoTitle: 'How Much is an Inverter in Nigeria? Pricing Guide | PRAG',
    seoDescription: 'Inverter prices in Nigeria — what affects the cost, capacity-to-price comparison, and how to choose the right inverter for your budget and power needs.' },
  { slug: 'how-much-is-a-solar-inverter-in-nigeria',
    seoTitle: 'How Much is a Solar Inverter in Nigeria? | PRAG',
    seoDescription: 'Solar inverter prices in Nigeria — capacity options, features that affect cost, and how to choose the right solar inverter for your system.' },
  { slug: 'solar-panel-prices-in-nigeria',
    seoTitle: 'Solar Panel Prices in Nigeria: Cost Guide | PRAG',
    seoDescription: 'Solar panel prices in Nigeria — wattage options, brand comparisons, and what to consider when buying solar panels for your home or business.' },
  { slug: 'solar-energy-in-nigeria',
    seoTitle: 'Solar Energy in Nigeria: Complete Guide | PRAG',
    seoDescription: 'Solar energy in Nigeria — why it matters, how it works, and how PRAG helps homes and businesses transition to reliable, clean power.' },
  { slug: 'the-science-behind-solar-panels',
    seoTitle: 'The Science Behind Solar Panels Explained | PRAG',
    seoDescription: 'How solar panels work — the photovoltaic effect, cell types, efficiency factors, and what makes solar energy viable for Nigerian homes and businesses.' },
  { slug: 'advancements-of-solar-power',
    seoTitle: 'Advancements in Solar Power Technology | PRAG',
    seoDescription: 'Recent advancements in solar power technology — panel efficiency, battery storage, and smart inverters shaping the future of energy in Nigeria.' },

  // ─── REWRITE (8) ─────────────────────────────────────────────────────────
  { slug: 'affordable-inverter',
    seoTitle: 'Affordable Inverter Options in Nigeria | PRAG',
    seoDescription: 'Affordable inverter options in Nigeria — how to choose a budget-friendly inverter without sacrificing quality. Sizing, features, and value for money.' },
  { slug: 'inverter-with-energy-saving-mode',
    seoTitle: 'Inverter Energy-Saving Mode: How It Works | PRAG',
    seoDescription: 'Inverter energy-saving mode explained — how it reduces power consumption, when to use it, and which PRAG inverters offer energy-saving features.' },
  { slug: 'inverter-for-energy-storage',
    seoTitle: 'Inverters for Energy Storage Systems | PRAG',
    seoDescription: 'Choosing an inverter for energy storage in Nigeria — battery compatibility, capacity matching, and how to build a reliable backup power system.' },
  { slug: 'inverter-with-integrated-mppt',
    seoTitle: 'Inverters with Integrated MPPT: Complete Guide | PRAG',
    seoDescription: 'What is MPPT and why it matters in solar inverters — how maximum power point tracking works, benefits, and choosing the right MPPT inverter in Nigeria.' },
  { slug: 'inverters-to-the-rescue-your-trusted-sidekick-for-power-outages',
    seoTitle: 'Power Outage Solutions: Inverter Backup Guide | PRAG',
    seoDescription: 'How inverters provide reliable backup during power outages in Nigeria — sizing, battery options, and choosing the right system for your home or business.' },
  { slug: 'stabilizer-batteries-vs-traditional-backup-power',
    seoTitle: 'Voltage Stabilizer vs Backup Power: Which Do You Need? | PRAG',
    seoDescription: 'Voltage stabilizers vs backup power systems — what each does, when you need one or both, and how to protect your equipment in Nigeria.' },
  { slug: 'why-we-need-servo-stabilizer',
    seoTitle: 'Why You Need a Servo Voltage Stabilizer | PRAG',
    seoDescription: 'Why a servo voltage stabilizer is essential in Nigeria — voltage fluctuation risks, equipment protection, and how servo stabilizers outperform relay types.' },
  { slug: 'things-to-check-if-your-1kva-2-5kva-prag-inverter-is-not-charging',
    seoTitle: 'PRAG Inverter Not Charging? Troubleshooting Guide | PRAG',
    seoDescription: 'Troubleshooting guide for PRAG inverters not charging — check battery connections, input voltage, fuse status, and when to contact PRAG support.' },
];

// ─── Apply SEO overrides ───────────────────────────────────────────────────

async function applySeoMetadata() {
  console.log('=== Step 11.1: Apply SEO Metadata Overrides ===');
  console.log('Articles to update:', seoMetadata.length);

  // 1. Read current admin-config
  console.log('\n1. Reading current admin-config...');
  const configRes = await fetch(WP_API_URL + '/prag-core/v1/admin-config', {
    headers: { Authorization: authHeader },
  });
  if (!configRes.ok) throw new Error('Failed to read admin-config: ' + configRes.status);
  const config = await configRes.json();
  const store = config.b2bAdminStore;
  console.log('Current seoOverrides count:', Object.keys(store.seoOverrides || {}).length);

  // 2. Add KC article overrides
  const updatedOverrides = { ...(store.seoOverrides || {}) };
  let added = 0;
  let updated = 0;

  for (const meta of seoMetadata) {
    const route = `/knowledge-center/${meta.slug}`;
    const newEntry = {
      seoTitle: meta.seoTitle,
      seoDescription: meta.seoDescription,
    };
    if (updatedOverrides[route]) {
      updated++;
    } else {
      added++;
    }
    updatedOverrides[route] = newEntry;
  }

  console.log('Overrides to add:', added);
  console.log('Overrides to update:', updated);
  console.log('Total overrides after:', Object.keys(updatedOverrides).length);

  // 3. Write back to admin-config
  console.log('\n2. Writing updated admin-config...');
  const updatedStore = { ...store, seoOverrides: updatedOverrides };
  const updatedConfig = { ...config, b2bAdminStore: updatedStore };

  const writeRes = await fetch(WP_API_URL + '/prag-core/v1/admin-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(updatedConfig),
  });

  console.log('Write status:', writeRes.status);
  if (!writeRes.ok) {
    const body = await writeRes.text();
    throw new Error('Failed to write admin-config: ' + writeRes.status + ' ' + body.slice(0, 300));
  }

  const writeResult = await writeRes.json();
  console.log('Write result seoOverrides count:', Object.keys(writeResult?.b2bAdminStore?.seoOverrides || {}).length);

  // 4. Verify
  console.log('\n3. Verifying...');
  const verifyRes = await fetch(WP_API_URL + '/prag-core/v1/admin-config', {
    headers: { Authorization: authHeader },
  });
  const verifyConfig = await verifyRes.json();
  const verifyOverrides = verifyConfig.b2bAdminStore.seoOverrides;
  const verifyKc = Object.keys(verifyOverrides).filter(k => k.includes('/knowledge-center/'));
  console.log('KC overrides after update:', verifyKc.length);

  // Verify a few entries
  for (const slug of ['what-is-the-difference-between-relay-servo-voltage-stabilizer', 'affordable-inverter', 'solar-panel-prices-in-nigeria']) {
    const route = `/knowledge-center/${slug}`;
    const entry = verifyOverrides[route];
    console.log(`  ${route}: ${entry ? 'OK (' + entry.seoTitle.slice(0, 40) + '...)' : 'MISSING'}`);
  }

  // Save summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalOverridesBefore: Object.keys(store.seoOverrides || {}).length,
    totalOverridesAfter: Object.keys(verifyOverrides).length,
    kcOverridesAdded: added,
    kcOverridesUpdated: updated,
    kcOverridesTotal: verifyKc.length,
    articles: seoMetadata.map(m => ({
      slug: m.slug,
      route: `/knowledge-center/${m.slug}`,
      seoTitle: m.seoTitle,
      seoDescription: m.seoDescription,
    })),
  };

  const outPath = path.join(__dirname, 'out', 'step11-1-seo-metadata-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log('\nSummary saved:', outPath);
  console.log('\n=== SEO Metadata Applied Successfully ===');
}

applySeoMetadata().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

// PRAG Step 11 — Build Knowledge Center SEO Audit Workbook
//
// Reads:  scripts/out/step11-kc-inventory.json
// Writes: PRAG_Knowledge_Center_SEO_Audit.xlsx
//
// Run from prag-b2b root:
//   node scripts/step11-build-workbook.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE_BASE = 'https://www.prag.global';

const inv = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'step11-kc-inventory.json'), 'utf8'));

// ─── Classification logic ──────────────────────────────────────────────────
// Based on content analysis: word count, structure, quality, relevance, age

// Every canonical article (42 total — excludes #40 which is 308-redirected)
// has exactly ONE primary action. Merge/cannibalisation flags are in separate columns.

const classifications = {
  // KEEP — strong, useful, aligned (6)
  39: { action: 'KEEP', reason: 'Valuable comparison article (relay vs servo stabilizer). Good word count (710). Core commercial support. Needs meta/internal links only.' },
  26: { action: 'KEEP', reason: 'Inverter sizing guide — strong commercial-support topic. Good word count (551). Needs meta + internal links.' },
  9: { action: 'KEEP', reason: 'LiFePO4 in Nigeria — good commercial-support topic, decent word count (756). Needs meta + internal links. Merge group primary (DG-2).' },
  8: { action: 'KEEP', reason: 'Solar battery guide — strongest battery article (801 words). Needs meta + internal links. Merge group primary (DG-3).' },
  24: { action: 'KEEP', reason: 'Inverter maintenance/troubleshooting — useful practical guide. Needs meta + internal links.' },
  41: { action: 'KEEP', reason: 'Depth of discharge (DOD) — useful technical battery concept. Short but valid. Needs meta + internal links.' },

  // OPTIMISE — useful, needs title/meta/H2/internal links/CTA (17)
  16: { action: 'OPTIMISE', reason: 'Servo stabilizers guide — merge group primary (DG-1). Needs meta, H2 structure, internal links. Consolidate #4 into this.' },
  7: { action: 'OPTIMISE', reason: 'Inverter solar battery — useful topic. Needs meta, H2, internal links, CTA.' },
  1: { action: 'OPTIMISE', reason: 'Solar panel installation guide — useful topic but no H2, no internal links. Needs structure + links + CTA.' },
  2: { action: 'OPTIMISE', reason: 'What can 2.5kVA solar power — useful sizing topic. No H2, no links. Needs structure + links + CTA.' },
  3: { action: 'OPTIMISE', reason: 'Solar installation Lagos cost — merge group primary (DG-4). Needs structure + links + CTA. Consolidate #5, #6 into this.' },
  23: { action: 'OPTIMISE', reason: '20KVA servo stabilizer — product-specific article. Needs meta, H2, internal links, CTA.' },
  31: { action: 'OPTIMISE', reason: 'Inverters for renewable energy — useful topic. Needs meta, H2, internal links, CTA.' },
  30: { action: 'OPTIMISE', reason: 'Integrating solar batteries with grid-tied — useful technical topic. Needs meta, H2, internal links.' },
  32: { action: 'OPTIMISE', reason: 'Lithium battery overheating — useful safety topic. Needs meta, H2, internal links.' },
  33: { action: 'OPTIMISE', reason: 'Common power supply problems + stabilizers — useful topic. Needs meta, H2, internal links.' },
  37: { action: 'OPTIMISE', reason: 'Battery types in solar systems — useful topic. Needs meta, H2, internal links.' },
  21: { action: 'OPTIMISE', reason: 'How much is inverter in Nigeria — pricing topic, needs update + meta + links. Cannibalisation risk with category.' },
  22: { action: 'OPTIMISE', reason: 'How much is solar inverter in Nigeria — pricing topic, needs update + meta + links. Cannibalisation risk.' },
  20: { action: 'OPTIMISE', reason: 'Solar panel prices in Nigeria — pricing topic, needs update + meta + links. Cannibalisation risk with category.' },
  17: { action: 'OPTIMISE', reason: 'Solar energy in Nigeria — broad topic, needs meta + H2 + links + CTA.' },
  34: { action: 'OPTIMISE', reason: 'Science behind solar panels — useful educational topic. Short (303). Needs meta, H2, links, expansion.' },
  38: { action: 'OPTIMISE', reason: 'Advancements of solar power — useful topic. Short (395). Needs meta, H2, links, expansion.' },

  // REWRITE — thin, weak, outdated, poorly structured (8)
  12: { action: 'REWRITE', reason: 'Affordable inverter — thin (312 words), generic, no structure. Needs full rewrite with sizing guidance.' },
  13: { action: 'REWRITE', reason: 'Inverter with energy-saving mode — thin (319), generic feature description. Needs rewrite with real value.' },
  14: { action: 'REWRITE', reason: 'Inverter for energy storage — thin (298), generic. Needs rewrite with technical depth.' },
  15: { action: 'REWRITE', reason: 'Inverter with integrated MPPT — thin (278), generic. Needs rewrite explaining MPPT properly.' },
  25: { action: 'REWRITE', reason: 'Inverters to the rescue — casual/blog style (635), off-intent. Needs rewrite as practical guide.' },
  29: { action: 'REWRITE', reason: 'Stabilizer batteries vs traditional backup — merge group primary (DG-5). Confusing concept, needs rewrite/clarification. Consolidate #27, #28 into this.' },
  36: { action: 'REWRITE', reason: 'Why you need servo stabilizer — thin (254), ALL CAPS title, no structure. Needs full rewrite.' },
  42: { action: 'REWRITE', reason: 'Things to check if inverter not charging — useful troubleshooting but thin (280), ALL CAPS. Needs rewrite.' },

  // MERGE/CONSOLIDATE — secondary articles in duplicate groups (9)
  4: { action: 'MERGE/CONSOLIDATE', reason: 'Servo stabilizer guide — duplicate of #16. Consolidate into #16 (survivor). 301 redirect #4 → #16 after approval.' },
  10: { action: 'MERGE/CONSOLIDATE', reason: 'LiFePO4 battery guide — duplicate of #9. Consolidate into #9 (survivor). 301 redirect #10 → #9 after approval.' },
  18: { action: 'MERGE/CONSOLIDATE', reason: 'Lithium solar batteries — duplicate of #9. Consolidate into #9 (survivor). 301 redirect #18 → #9 after approval.' },
  19: { action: 'MERGE/CONSOLIDATE', reason: 'Lithium batteries for inverters — duplicate of #9. Consolidate into #9 (survivor). 301 redirect #19 → #9 after approval.' },
  11: { action: 'MERGE/CONSOLIDATE', reason: 'Solar battery Nigeria — duplicate of #8. Consolidate into #8 (survivor). 301 redirect #11 → #8 after approval.' },
  5: { action: 'MERGE/CONSOLIDATE', reason: 'Solar installation Lagos — duplicate of #3. Consolidate into #3 (survivor). 301 redirect #5 → #3 after approval.' },
  6: { action: 'MERGE/CONSOLIDATE', reason: 'Solar installation services by PRAG — duplicate of #3. Consolidate into #3 (survivor). 301 redirect #6 → #3 after approval.' },
  27: { action: 'MERGE/CONSOLIDATE', reason: 'Benefits of stabilizer batteries — duplicate of #29. Consolidate into #29 (survivor). 301 redirect #27 → #29 after approval.' },
  28: { action: 'MERGE/CONSOLIDATE', reason: 'Maximizing lifespan of stabilizer batteries — duplicate of #29. Consolidate into #29 (survivor). 301 redirect #28 → #29 after approval.' },

  // RETIRE/REVIEW (2 — excludes #40 which is already 308-redirected, not canonical)
  35: { action: 'RETIRE/REVIEW', reason: 'Blood pressure monitor article — off-topic, not a PRAG power product. No commercial value. Retire or redirect.' },
  43: { action: 'RETIRE/REVIEW', reason: 'Tired of generators — extremely thin (52 words), promotional social post, not an article. Retire or redirect.' },
};

// Merge group mapping (separate column — not a primary action)
const mergeGroups = {
  4: { group: 'DG-1', role: 'Secondary', survivor: 16 },
  16: { group: 'DG-1', role: 'Primary', survivor: 16 },
  9: { group: 'DG-2', role: 'Primary', survivor: 9 },
  10: { group: 'DG-2', role: 'Secondary', survivor: 9 },
  18: { group: 'DG-2', role: 'Secondary', survivor: 9 },
  19: { group: 'DG-2', role: 'Secondary', survivor: 9 },
  8: { group: 'DG-3', role: 'Primary', survivor: 8 },
  11: { group: 'DG-3', role: 'Secondary', survivor: 8 },
  3: { group: 'DG-4', role: 'Primary', survivor: 3 },
  5: { group: 'DG-4', role: 'Secondary', survivor: 3 },
  6: { group: 'DG-4', role: 'Secondary', survivor: 3 },
  29: { group: 'DG-5', role: 'Primary', survivor: 29 },
  27: { group: 'DG-5', role: 'Secondary', survivor: 29 },
  28: { group: 'DG-5', role: 'Secondary', survivor: 29 },
};

// ─── Cluster mapping ───────────────────────────────────────────────────────

const clusters = {
  1: 'SOLAR', 2: 'SOLAR', 3: 'SOLAR', 5: 'SOLAR', 6: 'SOLAR', 17: 'SOLAR',
  20: 'SOLAR', 30: 'SOLAR', 34: 'SOLAR', 38: 'SOLAR',
  4: 'VOLTAGE STABILIZERS', 16: 'VOLTAGE STABILIZERS', 23: 'VOLTAGE STABILIZERS',
  33: 'VOLTAGE STABILIZERS', 36: 'VOLTAGE STABILIZERS', 39: 'VOLTAGE STABILIZERS',
  7: 'BATTERIES', 8: 'BATTERIES', 9: 'BATTERIES', 10: 'BATTERIES', 11: 'BATTERIES',
  18: 'BATTERIES', 19: 'BATTERIES', 32: 'BATTERIES', 37: 'BATTERIES', 41: 'BATTERIES',
  12: 'INVERTERS', 13: 'INVERTERS', 14: 'INVERTERS', 15: 'INVERTERS',
  21: 'INVERTERS', 22: 'INVERTERS', 24: 'INVERTERS', 25: 'INVERTERS',
  26: 'INVERTERS', 31: 'INVERTERS', 42: 'INVERTERS', 43: 'INVERTERS',
  27: 'GENERAL POWER', 28: 'GENERAL POWER', 29: 'GENERAL POWER',
  35: 'CORPORATE / OTHER', 40: 'CORPORATE / OTHER',
};

const secondaryClusters = {
  7: 'SOLAR', 8: 'SOLAR', 11: 'SOLAR', 18: 'SOLAR', 22: 'SOLAR',
  26: 'BATTERIES', 27: 'VOLTAGE STABILIZERS', 28: 'VOLTAGE STABILIZERS', 29: 'VOLTAGE STABILIZERS',
  30: 'SOLAR', 37: 'SOLAR',
};

// ─── Commercial page mapping ───────────────────────────────────────────────

const commercialPages = {
  1: { primary: '/products/solar', secondary: '/solutions/solar-energy' },
  2: { primary: '/products/solar', secondary: '/solutions/solar-energy' },
  3: { primary: '/solutions/solar-energy', secondary: '/products/solar' },
  4: { primary: '/products/voltage-stabilizers', secondary: '/products/servo-voltage-stabilizers' },
  5: { primary: '/solutions/solar-energy', secondary: '/products/solar' },
  6: { primary: '/solutions/solar-energy', secondary: '/products/solar' },
  7: { primary: '/products/batteries', secondary: '/products/lithium-batteries' },
  8: { primary: '/products/batteries', secondary: '/products/lithium-batteries' },
  9: { primary: '/products/lithium-batteries', secondary: '/products/batteries' },
  10: { primary: '/products/lithium-batteries', secondary: '/products/batteries' },
  11: { primary: '/products/batteries', secondary: '/solutions/backup-power' },
  12: { primary: '/products/inverters', secondary: '/solutions/backup-power' },
  13: { primary: '/products/inverters', secondary: '/products/hybrid-inverters' },
  14: { primary: '/products/inverters', secondary: '/solutions/backup-power' },
  15: { primary: '/products/hybrid-inverters', secondary: '/products/inverters' },
  16: { primary: '/products/voltage-stabilizers', secondary: '/products/servo-voltage-stabilizers' },
  17: { primary: '/solutions/solar-energy', secondary: '/products/solar' },
  18: { primary: '/products/lithium-batteries', secondary: '/products/batteries' },
  19: { primary: '/products/lithium-batteries', secondary: '/products/inverters' },
  20: { primary: '/products/solar-panels', secondary: '/products/solar' },
  21: { primary: '/products/inverters', secondary: '/solutions/backup-power' },
  22: { primary: '/products/hybrid-inverters', secondary: '/products/inverters' },
  23: { primary: '/products/servo-voltage-stabilizers', secondary: '/products/voltage-stabilizers' },
  24: { primary: '/products/inverters', secondary: '/technical-support' },
  25: { primary: '/products/inverters', secondary: '/solutions/backup-power' },
  26: { primary: '/products/inverters', secondary: '/solutions/backup-power' },
  27: { primary: '/products/voltage-stabilizers', secondary: '/solutions/voltage-stabilization-protection' },
  28: { primary: '/products/voltage-stabilizers', secondary: '/solutions/voltage-stabilization-protection' },
  29: { primary: '/products/voltage-stabilizers', secondary: '/solutions/backup-power' },
  30: { primary: '/products/batteries', secondary: '/solutions/solar-energy' },
  31: { primary: '/products/inverters', secondary: '/products/hybrid-inverters' },
  32: { primary: '/products/lithium-batteries', secondary: '/products/batteries' },
  33: { primary: '/products/voltage-stabilizers', secondary: '/solutions/voltage-stabilization-protection' },
  34: { primary: '/products/solar-panels', secondary: '/products/solar' },
  35: { primary: 'N/A', secondary: 'N/A' },
  36: { primary: '/products/servo-voltage-stabilizers', secondary: '/products/voltage-stabilizers' },
  37: { primary: '/products/batteries', secondary: '/products/solar' },
  38: { primary: '/products/solar', secondary: '/solutions/solar-energy' },
  39: { primary: '/products/voltage-stabilizers', secondary: '/solutions/voltage-stabilization-protection' },
  40: { primary: '/installations', secondary: 'N/A' },
  41: { primary: '/products/batteries', secondary: '/products/lithium-batteries' },
  42: { primary: '/products/inverters', secondary: '/technical-support' },
  43: { primary: '/products/inverters', secondary: 'N/A' },
};

// ─── Keyword intent ─────────────────────────────────────────────────────────

const keywords = {
  1: { intent: 'Informational', primary: 'solar panel installation guide', secondary: ['solar panel installation Nigeria', 'how to install solar panels'] },
  2: { intent: 'Informational', primary: 'what can 2.5 kVA solar system power', secondary: ['2.5 kVA solar system appliances', 'small solar system capacity'] },
  3: { intent: 'Informational', primary: 'solar installation cost Lagos', secondary: ['solar installation Lagos price', 'cost of solar panels Lagos'] },
  4: { intent: 'Informational', primary: 'servo stabilizer guide', secondary: ['what is servo stabilizer', 'servo voltage stabilizer explained'] },
  5: { intent: 'Informational', primary: 'solar installation Lagos', secondary: ['solar energy Lagos', 'solar power Lagos'] },
  6: { intent: 'Informational', primary: 'PRAG solar installation services', secondary: ['solar installation Nigeria', 'PRAG solar services'] },
  7: { intent: 'Informational', primary: 'inverter solar battery', secondary: ['solar battery for inverter', 'inverter battery system'] },
  8: { intent: 'Informational', primary: 'solar battery guide', secondary: ['solar battery storage', 'best solar battery Nigeria'] },
  9: { intent: 'Informational', primary: 'LiFePO4 battery Nigeria', secondary: ['lithium iron phosphate battery', 'LiFePO4 vs lead acid'] },
  10: { intent: 'Informational', primary: 'LiFePO4 battery explained', secondary: ['lithium iron phosphate', 'LiFePO4 advantages'] },
  11: { intent: 'Informational', primary: 'solar battery Nigeria', secondary: ['solar battery price Nigeria', 'best solar battery Nigeria'] },
  12: { intent: 'Transactional', primary: 'affordable inverter Nigeria', secondary: ['cheap inverter Nigeria', 'budget inverter'] },
  13: { intent: 'Informational', primary: 'inverter energy saving mode', secondary: ['energy efficient inverter', 'inverter power saving'] },
  14: { intent: 'Informational', primary: 'inverter for energy storage', secondary: ['energy storage inverter', 'battery inverter system'] },
  15: { intent: 'Informational', primary: 'inverter with MPPT', secondary: ['MPPT solar inverter', 'integrated MPPT charge controller'] },
  16: { intent: 'Informational', primary: 'servo stabilizer guide', secondary: ['servo voltage stabilizer', 'power stabilizer equipment'] },
  17: { intent: 'Informational', primary: 'solar energy Nigeria', secondary: ['solar power Nigeria', 'renewable energy Nigeria'] },
  18: { intent: 'Informational', primary: 'lithium solar batteries', secondary: ['lithium battery for solar', 'solar battery lithium'] },
  19: { intent: 'Informational', primary: 'lithium batteries for inverters', secondary: ['lithium inverter battery', 'best battery for inverter'] },
  20: { intent: 'Transactional', primary: 'solar panel prices Nigeria', secondary: ['solar panel cost Nigeria', 'solar panel price'] },
  21: { intent: 'Transactional', primary: 'inverter price Nigeria', secondary: ['how much is inverter', 'inverter cost Nigeria'] },
  22: { intent: 'Transactional', primary: 'solar inverter price Nigeria', secondary: ['solar inverter cost', 'how much is solar inverter'] },
  23: { intent: 'Transactional', primary: '20kVA servo voltage stabilizer', secondary: ['20kVA stabilizer', 'industrial voltage stabilizer'] },
  24: { intent: 'Informational', primary: 'inverter maintenance troubleshooting', secondary: ['inverter not working', 'inverter repair'] },
  25: { intent: 'Informational', primary: 'inverter for power outages', secondary: ['inverter backup power', 'power outage solutions'] },
  26: { intent: 'Informational', primary: 'inverter sizing guide', secondary: ['inverter load capacity', 'how to size an inverter'] },
  27: { intent: 'Informational', primary: 'stabilizer battery benefits', secondary: ['stabilizer backup power', 'voltage stabilizer battery'] },
  28: { intent: 'Informational', primary: 'stabilizer battery maintenance', secondary: ['battery maintenance tips', 'stabilizer battery lifespan'] },
  29: { intent: 'Informational', primary: 'stabilizer battery vs backup power', secondary: ['stabilizer vs generator', 'backup power comparison'] },
  30: { intent: 'Informational', primary: 'solar batteries grid-tied', secondary: ['grid-tied solar battery', 'solar battery integration'] },
  31: { intent: 'Informational', primary: 'inverters for renewable energy', secondary: ['solar inverter types', 'renewable energy inverter'] },
  32: { intent: 'Informational', primary: 'lithium battery overheating', secondary: ['lithium battery safety', 'battery overheating prevention'] },
  33: { intent: 'Informational', primary: 'power supply problems stabilizers', secondary: ['voltage fluctuation solutions', 'power stabilizer help'] },
  34: { intent: 'Informational', primary: 'how solar panels work', secondary: ['solar panel science', 'photovoltaic cells explained'] },
  35: { intent: 'Informational', primary: 'blood pressure monitor', secondary: ['health monitor'] },
  36: { intent: 'Informational', primary: 'servo voltage stabilizer need', secondary: ['why use servo stabilizer', 'servo stabilizer benefits'] },
  37: { intent: 'Informational', primary: 'solar battery types', secondary: ['batteries for solar systems', 'solar electric battery'] },
  38: { intent: 'Informational', primary: 'solar power advancements', secondary: ['solar technology trends', 'solar energy improvements'] },
  39: { intent: 'Informational', primary: 'relay vs servo stabilizer', secondary: ['types of voltage stabilizer', 'relay vs servo comparison'] },
  40: { intent: 'N/A', primary: 'N/A', secondary: [] },
  41: { intent: 'Informational', primary: 'depth of discharge DOD', secondary: ['battery DOD explained', 'battery discharge depth'] },
  42: { intent: 'Informational', primary: 'PRAG inverter not charging', secondary: ['inverter troubleshooting', 'inverter charging problems'] },
  43: { intent: 'N/A', primary: 'N/A', secondary: [] },
};

// ─── Cannibalisation risk ──────────────────────────────────────────────────

const cannibalisation = {
  4: { risk: 'HIGH', reason: 'Duplicate topic with #16 (servo-stabilizers). Both target "servo stabilizer guide".' },
  16: { risk: 'HIGH', reason: 'Duplicate topic with #4 (servo-stabilizer). Both target "servo stabilizer guide".' },
  9: { risk: 'HIGH', reason: 'Overlaps with #10, #18, #19 — all lithium battery articles targeting similar intent.' },
  10: { risk: 'HIGH', reason: 'Overlaps with #9, #18, #19 — LiFePO4/lithium battery articles.' },
  18: { risk: 'HIGH', reason: 'Overlaps with #9, #10, #19 — lithium battery articles.' },
  19: { risk: 'HIGH', reason: 'Overlaps with #9, #10, #18 — lithium battery articles.' },
  8: { risk: 'MEDIUM', reason: 'Overlaps with #11 (solar-battery-nigeria). Similar solar battery intent.' },
  11: { risk: 'MEDIUM', reason: 'Overlaps with #8 (solar-battery). Similar solar battery intent.' },
  5: { risk: 'MEDIUM', reason: 'Overlaps with #3, #6 — solar installation Lagos articles.' },
  6: { risk: 'MEDIUM', reason: 'Overlaps with #5 — solar installation articles.' },
  3: { risk: 'MEDIUM', reason: 'Overlaps with #5 — solar installation Lagos articles.' },
  20: { risk: 'MEDIUM', reason: 'Pricing article may cannibalise /products/solar-panels category page.' },
  21: { risk: 'MEDIUM', reason: 'Pricing article may cannibalise /products/inverters category page.' },
  22: { risk: 'MEDIUM', reason: 'Pricing article may cannibalise /products/hybrid-inverters category page.' },
  27: { risk: 'MEDIUM', reason: 'Overlaps with #28, #29 — "stabilizer batteries" concept articles.' },
  28: { risk: 'MEDIUM', reason: 'Overlaps with #27, #29 — "stabilizer batteries" concept articles.' },
  29: { risk: 'MEDIUM', reason: 'Overlaps with #27, #28 — "stabilizer batteries" concept articles.' },
  7: { risk: 'LOW', reason: 'Some overlap with battery articles but distinct "inverter solar battery" angle.' },
  17: { risk: 'LOW', reason: 'Broad "solar energy Nigeria" — may overlap with multiple solar articles.' },
  23: { risk: 'LOW', reason: 'Product-specific (20kVA) — low cannibalisation but thin commercial page overlap.' },
};

// ─── Duplicate groups ──────────────────────────────────────────────────────

const duplicateGroups = [
  {
    group: 'DG-1: Servo Stabilizer Guides',
    articles: [4, 16],
    similarity: 'Both titled "Ultimate Guide to Servo Stabilizers". Same topic, same intent, similar content structure.',
    survivor: 16,
    survivorReason: 'Newer (Oct 2024), slightly longer (727 vs 632), "Power Stability for Your Equipment" angle is more equipment-focused.',
    redirect: '301 redirect #4 (servo-stabilizer) → #16 (servo-stabilizers) after consolidation.',
  },
  {
    group: 'DG-2: Lithium / LiFePO4 Battery Guides',
    articles: [9, 10, 18, 19],
    similarity: 'All cover lithium/LiFePO4 batteries. #9 (LiFePO4 in Nigeria, 756wc), #10 (LiFePO4 guide, 662wc), #18 (lithium solar batteries, 624wc), #19 (lithium for inverters, 643wc). Substantially overlapping intent.',
    survivor: 9,
    survivorReason: 'Longest (756wc), most commercially relevant ("in Nigeria"), already has internal links to product pages.',
    redirect: 'Consider 301 redirecting #10, #18, #19 → #9 after consolidation. Or repurpose each for distinct sub-intent (LiFePO4 explained, lithium for solar, lithium for inverters).',
  },
  {
    group: 'DG-3: Solar Battery Guides',
    articles: [8, 11],
    similarity: '#8 (solar-battery, 801wc) and #11 (solar-battery-nigeria, 554wc) both target "solar battery" intent.',
    survivor: 8,
    survivorReason: 'Longer (801 vs 554), more comprehensive, already has product links.',
    redirect: '301 redirect #11 → #8 after consolidation. Or differentiate: #8 = general guide, #11 = Nigeria-specific pricing/options.',
  },
  {
    group: 'DG-4: Solar Installation Lagos',
    articles: [3, 5, 6],
    similarity: '#3 (Lagos cost, 613wc), #5 (Rise of solar Lagos, 687wc), #6 (PRAG solar services, 692wc). All solar installation in Lagos.',
    survivor: 3,
    survivorReason: 'Most actionable ("cost" intent), strongest commercial funnel. Consolidate #5 and #6 content into #3.',
    redirect: '301 redirect #5, #6 → #3 after consolidation. Or keep #6 as "PRAG services" if distinct enough.',
  },
  {
    group: 'DG-5: Stabilizer Batteries',
    articles: [27, 28, 29],
    similarity: 'All three cover "stabilizer batteries" — a confusing concept. #27 (benefits), #28 (maintenance), #29 (vs traditional). Likely meant "inverter batteries" or "batteries for stabilizer systems".',
    survivor: 29,
    survivorReason: 'Most structured (comparison format). But concept needs clarification first — may need full rewrite.',
    redirect: 'Pending PRAG clarification on "stabilizer battery" concept. May consolidate into one article or reframe as "inverter battery" articles.',
  },
];

// ─── Freshness ─────────────────────────────────────────────────────────────

function assessFreshness(article) {
  const modDate = new Date(article.dateModified);
  const pubDate = new Date(article.datePublished);
  const now = new Date('2026-08-09');
  const monthsSinceMod = (now - modDate) / (1000 * 60 * 60 * 24 * 30);
  const yearsSincePub = (now - pubDate) / (1000 * 60 * 60 * 24 * 365);

  if (monthsSinceMod < 12) return { status: 'CURRENT', reason: 'Modified within last 12 months' };
  if (yearsSincePub > 4) return { status: 'OUTDATED', reason: `Published ${yearsSincePub.toFixed(1)} years ago, not recently modified` };
  if (monthsSinceMod > 24) return { status: 'NEEDS UPDATE', reason: `Not modified in ${(monthsSinceMod/12).toFixed(1)} years` };
  return { status: 'NEEDS UPDATE', reason: 'Not recently modified' };
}

// ─── Title/meta recommendations ────────────────────────────────────────────

function recommendTitle(article, idx) {
  const t = article.title;
  // Remove "PRAG" if already in title to avoid duplication
  const cleanT = t.replace(/\s*[|–-]\s*PRAG\s*$/i, '').replace(/^PRAG\s+/i, '');
  const kw = keywords[idx]?.primary || cleanT;

  // If title is ALL CAPS, convert to title case
  const isAllCaps = t === t.toUpperCase() && t.length > 10;
  const titleCase = isAllCaps
    ? t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : cleanT;

  return `${titleCase} | PRAG`;
}

function recommendMeta(article, idx) {
  const kw = keywords[idx]?.primary || article.title;
  const cluster = clusters[idx] || '';
  const excerpt = article.excerpt.slice(0, 120);

  if (article.yoastMetaDescription) return article.yoastMetaDescription;

  // Generate based on cluster
  const templates = {
    'INVERTERS': `PRAG guide to ${kw} — practical advice for Nigerian homes and businesses. Understand sizing, types, and choosing the right inverter.`,
    'VOLTAGE STABILIZERS': `PRAG guide to ${kw} — protect your equipment from voltage fluctuations in Nigeria. Learn about servo, relay, and thyristor stabilizers.`,
    'BATTERIES': `PRAG guide to ${kw} — compare lithium, LiFePO4, and solar batteries for Nigerian power systems. Expert advice from PRAG.`,
    'SOLAR': `PRAG guide to ${kw} — solar energy solutions for Nigerian homes and businesses. Learn about panels, installation, and costs.`,
    'GENERAL POWER': `PRAG guide to ${kw} — reliable power solutions for Nigerian homes and businesses.`,
    'CORPORATE / OTHER': article.excerpt.slice(0, 155),
  };

  let meta = templates[cluster] || excerpt;
  if (meta.length > 155) meta = meta.slice(0, 152) + '...';
  return meta;
}

// ─── CTA recommendations ───────────────────────────────────────────────────

const ctaRecommendations = {
  1: 'Explore Solar Energy Systems',
  2: 'Explore PRAG Solar Panels',
  3: 'Talk to PRAG about Solar Installation',
  4: 'Explore Servo Voltage Stabilizers',
  5: 'Talk to PRAG about Solar Installation',
  6: 'Talk to PRAG about Solar Installation',
  7: 'View PRAG Lithium Batteries',
  8: 'View PRAG Batteries',
  9: 'View PRAG Lithium Batteries',
  10: 'View PRAG Lithium Batteries',
  11: 'View PRAG Batteries',
  12: 'Explore PRAG Inverters',
  13: 'Explore PRAG Inverters',
  14: 'Explore PRAG Inverters',
  15: 'Explore PRAG Hybrid Inverters',
  16: 'Explore Servo Voltage Stabilizers',
  17: 'Explore Solar Energy Systems',
  18: 'View PRAG Lithium Batteries',
  19: 'View PRAG Lithium Batteries',
  20: 'Explore PRAG Solar Panels',
  21: 'Explore PRAG Inverters',
  22: 'Explore PRAG Hybrid Inverters',
  23: 'Explore Servo Voltage Stabilizers',
  24: 'Talk to a PRAG Engineer',
  25: 'Explore PRAG Inverters',
  26: 'Explore PRAG Inverters',
  27: 'Find the Right Stabilizer',
  28: 'Find the Right Stabilizer',
  29: 'Find the Right Stabilizer',
  30: 'View PRAG Batteries',
  31: 'Explore PRAG Inverters',
  32: 'View PRAG Lithium Batteries',
  33: 'Find the Right Stabilizer',
  34: 'Explore PRAG Solar Panels',
  35: 'N/A',
  36: 'Find the Right Stabilizer',
  37: 'View PRAG Batteries',
  38: 'Explore Solar Energy Systems',
  39: 'Find the Right Stabilizer',
  40: 'N/A',
  41: 'View PRAG Batteries',
  42: 'Talk to a PRAG Engineer',
  43: 'N/A',
};

// ─── Broken link data (from our crawl) ─────────────────────────────────────

const brokenInternalLinks = {
  // /shop/ URLs that 308 redirect then 404
  4: ['https://prag.global/shop/5kva-single-phase-stabilizer/ (308→404)'],
  7: ['https://prag.global/shop/2-5kwh-bt-lithium-battery/ (308→404)', 'https://prag.global/solar-lithium-ion-batteries/ (308→404)'],
  8: ['https://prag.global/lithiumbattery-solarbattery/ (308→404)'],
  9: ['https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery/ (308→404)'],
  10: ['https://prag.global/shop/5kwh-48v-lifepo4-lithium-battery/ (308→404)'],
  11: ['https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery-2/ (308→404)'],
  12: ['https://prag.global/shop/1-5kva-pure-sine-inverter/ (308→404)'],
  14: ['https://prag.global/shop/455w-canadian-mono-panel/ (301→OK)', 'https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery/ (308→404)'],
  16: ['https://prag.global/shop/30kva-servo-voltage-stabilizer/ (308→404 after redirect)'],
  17: ['https://prag.global/shop/455w-canadian-mono-panel/ (301→OK)'],
  18: ['https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery-2/ (308→404)'],
  19: ['https://prag.global/shop/10kwh-48v-lifepo4-lithium-battery-2/ (308→404)'],
  20: ['https://prag.global/shop/540w-mono-panel/ (301→OK)'],
  23: ['https://prag.global/shop/20kva-servo-voltage-stabilizer-130-260v/ (308→404)'],
  24: ['https://prag.global/product-category/sales/ (410 Gone)'],
  35: ['https://prag.global/shop/tmb-986-blood-pressure-monitor/ (308→404)'],
};

const brokenExternalLinks = {
  41: ['http://www.buyright.biz/... (DNS failure — site down)'],
  42: ['http://www.prag.cc (DNS failure — domain expired)'],
  43: ['https://www.konga.com/prag (404)'],
};

// All internal links use old prag.global (not www.prag.global) URLs — redirected via 308
const allInternalLinksRedirected = 'All internal links use old prag.global/shop/, prag.global/product-category/, prag.global/inverter/ URLs → 308 redirect to www.prag.global → some 404. Should be updated to final canonical www.prag.global URLs.';

// ─── Content opportunities ─────────────────────────────────────────────────

const contentOpportunities = [
  { priority: 'P0', topic: 'Inverter Sizing Calculator Guide', intent: 'Informational', page: '/products/inverters', cluster: 'INVERTERS', reason: 'Core commercial support. Existing #26 is basic. Need comprehensive sizing guide with load calculation examples for Nigeria.' },
  { priority: 'P0', topic: 'Relay vs Servo vs Thyristor Stabilizer Comparison', intent: 'Informational', page: '/products/voltage-stabilizers', cluster: 'VOLTAGE STABILIZERS', reason: 'Existing #39 only covers relay vs servo. Need full 3-way comparison including thyristor. Core buying-decision content.' },
  { priority: 'P0', topic: 'Lithium vs Lead-Acid Battery Comparison', intent: 'Informational', page: '/products/lithium-batteries', cluster: 'BATTERIES', reason: 'Fundamental buying decision. Not adequately covered. Multiple thin lithium articles exist but no direct comparison.' },
  { priority: 'P0', topic: 'Solar System Sizing Guide', intent: 'Informational', page: '/solutions/solar-energy', cluster: 'SOLAR', reason: 'Core solar funnel content. No comprehensive sizing guide exists. #2 only covers one system size.' },
  { priority: 'P0', topic: 'How Voltage Stabilizers Work', intent: 'Informational', page: '/products/voltage-stabilizers', cluster: 'VOLTAGE STABILIZERS', reason: 'Foundational educational content. No dedicated article explains the working principle clearly.' },
  { priority: 'P0', topic: 'What Size Stabilizer Do I Need', intent: 'Informational', page: '/products/voltage-stabilizers', cluster: 'VOLTAGE STABILIZERS', reason: 'Core buying-decision content. No sizing guide exists for stabilizers.' },
  { priority: 'P1', topic: 'Inverter vs Generator Comparison', intent: 'Informational', page: '/products/inverters', cluster: 'INVERTERS', reason: 'Common Nigerian question. #43 mentions generators but is 52 words. Need real comparison.' },
  { priority: 'P1', topic: 'Hybrid vs Regular Inverter', intent: 'Informational', page: '/products/hybrid-inverters', cluster: 'INVERTERS', reason: 'PRAG sells hybrid inverters but no article explains the difference. Direct commercial support.' },
  { priority: 'P1', topic: '3-Phase Voltage Stabilizers Guide', intent: 'Informational', page: '/products/servo-voltage-stabilizers', cluster: 'VOLTAGE STABILIZERS', reason: 'PRAG sells 3-phase stabilizers (200kVA). No article covers industrial 3-phase use.' },
  { priority: 'P1', topic: 'MPPT vs PWM Charge Controller', intent: 'Informational', page: '/products/solar-charge-controllers', cluster: 'SOLAR', reason: 'PRAG sells charge controllers. #15 mentions MPPT but is thin (278wc). Need proper comparison.' },
  { priority: 'P1', topic: 'Battery Sizing for Inverter Systems', intent: 'Informational', page: '/products/batteries', cluster: 'BATTERIES', reason: 'Core buying-decision. No dedicated battery sizing guide exists.' },
  { priority: 'P1', topic: 'kWh vs Ah Battery Capacity Explained', intent: 'Informational', page: '/products/batteries', cluster: 'BATTERIES', reason: 'Common confusion. #41 covers DOD but not capacity units. Supports all battery products.' },
  { priority: 'P1', topic: 'Solar + Battery + Inverter System Design', intent: 'Informational', page: '/solutions/solar-energy', cluster: 'SOLAR', reason: 'Whole-system guide. No article ties the three components together for Nigerian buyers.' },
  { priority: 'P1', topic: 'Causes of Low/High Voltage in Nigeria', intent: 'Informational', page: '/solutions/voltage-stabilization-protection', cluster: 'VOLTAGE STABILIZERS', reason: 'Local problem framing. #33 touches this but is thin (403wc). Need expanded version.' },
  { priority: 'P2', topic: 'Inverter Battery Compatibility Guide', intent: 'Informational', page: '/products/batteries', cluster: 'BATTERIES', reason: 'Useful long-tail. Which batteries work with which inverters.' },
  { priority: 'P2', topic: 'Solar Panel Selection Guide', intent: 'Informational', page: '/products/solar-panels', cluster: 'SOLAR', reason: 'Useful supporting content. How to choose between wattages/brands.' },
  { priority: 'P2', topic: 'Battery Lifespan Factors', intent: 'Informational', page: '/products/lithium-batteries', cluster: 'BATTERIES', reason: 'Long-tail authority content. #28 covers stabilizer batteries but concept is confusing.' },
  { priority: 'P2', topic: 'Industrial Equipment Protection Guide', intent: 'Informational', page: '/solutions/industrial', cluster: 'VOLTAGE STABILIZERS', reason: 'Industrial solution support. PRAG sells large stabilizers for factories.' },
];

// ─── Build workbook ────────────────────────────────────────────────────────

async function buildWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'PRAG SEO Step 11';
  wb.created = new Date();

  // ─── Sheet 1: Master Workbook ────────────────────────────────────────────
  const ws = wb.addWorksheet('Master Workbook', { views: [{ state: 'frozen', ySplit: 1 }] });

  const columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Priority', key: 'priority', width: 8 },
    { header: 'Recommendation', key: 'recommendation', width: 18 },
    { header: 'WP Post ID', key: 'wpPostId', width: 10 },
    { header: 'Article Title', key: 'title', width: 45 },
    { header: 'Slug', key: 'slug', width: 40 },
    { header: 'Canonical URL', key: 'canonical', width: 55 },
    { header: 'Published Date', key: 'datePub', width: 14 },
    { header: 'Modified Date', key: 'dateMod', width: 14 },
    { header: 'Primary Cluster', key: 'cluster', width: 20 },
    { header: 'Secondary Cluster', key: 'cluster2', width: 20 },
    { header: 'Primary Search Intent', key: 'intent', width: 16 },
    { header: 'Suggested Primary Keyword', key: 'kwPrimary', width: 30 },
    { header: 'Suggested Secondary Keywords', key: 'kwSecondary', width: 45 },
    { header: 'Current SEO Title', key: 'curTitle', width: 50 },
    { header: 'Recommended SEO Title', key: 'recTitle', width: 50 },
    { header: 'Current Meta Description', key: 'curMeta', width: 55 },
    { header: 'Recommended Meta Description', key: 'recMeta', width: 55 },
    { header: 'Current H1', key: 'curH1', width: 30 },
    { header: 'H1 Recommendation', key: 'recH1', width: 40 },
    { header: 'Content Quality', key: 'quality', width: 14 },
    { header: 'Freshness', key: 'freshness', width: 16 },
    { header: 'Word Count', key: 'wc', width: 10 },
    { header: 'Merge Group', key: 'mergeGroup', width: 12 },
    { header: 'Merge Role', key: 'mergeRole', width: 12 },
    { header: 'Cannibalisation Risk', key: 'cannib', width: 14 },
    { header: 'Duplicate Content Risk', key: 'dupRisk', width: 14 },
    { header: 'Related Article(s)', key: 'related', width: 40 },
    { header: 'Current Internal Links', key: 'curIntLinks', width: 50 },
    { header: 'Recommended Commercial Links', key: 'recCommLinks', width: 50 },
    { header: 'Recommended Article Links', key: 'recArtLinks', width: 45 },
    { header: 'Installation/Proof Opportunity', key: 'installOpp', width: 35 },
    { header: 'CTA Recommendation', key: 'cta', width: 30 },
    { header: 'Featured Image', key: 'featImg', width: 12 },
    { header: 'Image Recommendation', key: 'imgRec', width: 16 },
    { header: 'Broken Link Issues', key: 'brokenLinks', width: 50 },
    { header: 'Schema Status', key: 'schema', width: 30 },
    { header: 'Key Problem', key: 'keyProblem', width: 50 },
    { header: 'My Recommendation', key: 'myRec', width: 55 },
    { header: 'PRAG Recommendation', key: 'pragRec', width: 25 },
    { header: 'Approval Status', key: 'approval', width: 16 },
  ];

  ws.columns = columns;
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Priority mapping
  const priorities = {};
  // P0: core commercial support, strong topic
  [39, 26, 9, 8, 24, 4, 16, 1, 2, 3, 23, 21, 22, 20, 41, 42, 36, 33].forEach(i => priorities[i] = 'P0');
  // P1: useful supporting
  [7, 10, 11, 18, 19, 5, 6, 17, 30, 31, 32, 37, 34, 38, 12, 13, 14, 15, 25, 27, 28, 29].forEach(i => priorities[i] = 'P1');
  // P2: optional/retire
  [35, 43].forEach(i => priorities[i] = 'P2');

  inv.forEach((a, i) => {
    const idx = i + 1;
    // Skip #40 (55977-2) — already 308-redirected to /installations, not canonical
    if (a.renderedStatus !== 200) return;
    const cls = classifications[idx] || { action: 'OPTIMISE', reason: 'Default' };
    const cluster = clusters[idx] || '';
    const cluster2 = secondaryClusters[idx] || '';
    const kw = keywords[idx] || { intent: '', primary: '', secondary: [] };
    const cannib = cannibalisation[idx] || { risk: 'NONE', reason: '' };
    const comm = commercialPages[idx] || { primary: '', secondary: '' };
    const cta = ctaRecommendations[idx] || '';
    const freshness = assessFreshness(a);

    // Quality assessment
    let quality = 'GOOD';
    if (a.wordCount < 300) quality = 'THIN';
    else if (a.wordCount < 500) quality = 'BASIC';
    else if (a.wordCount >= 700) quality = 'STRONG';

    // Duplicate risk
    let dupRisk = 'NONE';
    const dupGroup = duplicateGroups.find(g => g.articles.includes(idx));
    if (dupGroup) dupRisk = 'HIGH';

    // Related articles (from duplicate group)
    let related = '';
    if (dupGroup) {
      related = dupGroup.articles.filter(x => x !== idx).map(x => `#${x}`).join(', ');
    }

    // Current internal links summary
    const curIntLinks = a.internalLinks.map(l => `${l.href} [${l.anchorText.slice(0,20)}]`).join('; ');

    // Recommended commercial links
    let recCommLinks = '';
    if (comm.primary && comm.primary !== 'N/A') {
      recCommLinks = `${SITE_BASE}${comm.primary}`;
      if (comm.secondary && comm.secondary !== 'N/A') {
        recCommLinks += `; ${SITE_BASE}${comm.secondary}`;
      }
    }

    // Recommended article links (from same cluster)
    const sameClusterArticles = inv
      .map((aa, ii) => ({ aa, ii: ii + 1 }))
      .filter(({ ii }) => clusters[ii] === cluster && ii !== idx && classifications[ii]?.action !== 'RETIRE/REVIEW')
      .slice(0, 3)
      .map(({ aa, ii }) => `${SITE_BASE}/knowledge-center/${aa.slug}`)
      .join('; ');
    recCommLinks = recCommLinks + (sameClusterArticles ? (recCommLinks ? '; ' : '') + sameClusterArticles : '');

    // Installation opportunity
    let installOpp = 'None identified';
    if (cluster === 'SOLAR') installOpp = 'Link to /installations for solar project proof';
    if (cluster === 'INVERTERS') installOpp = 'Link to /installations for inverter project proof';
    if (cluster === 'VOLTAGE STABILIZERS') installOpp = 'Link to /installations for stabilizer project proof';

    // Image recommendation
    let imgRec = 'KEEP';
    if (!a.featuredImage) imgRec = 'ADD IMAGE';
    if (a.images.length === 0 && a.wordCount > 400) imgRec = 'ADD IMAGE';

    // Broken links
    let brokenLinks = '';
    if (brokenInternalLinks[idx]) brokenLinks += 'Broken internal: ' + brokenInternalLinks[idx].join('; ') + '. ';
    if (brokenExternalLinks[idx]) brokenLinks += 'Broken external: ' + brokenExternalLinks[idx].join('; ') + '. ';
    if (a.internalLinks.length > 0 && !brokenLinks) brokenLinks = allInternalLinksRedirected;
    if (a.internalLinks.length > 0 && brokenLinks && !brokenLinks.includes('old prag.global')) {
      brokenLinks += ' | ' + allInternalLinksRedirected;
    }

    // Schema status — verified on live production: publisher IS present as @id reference
    let schemaStatus = 'Article + BreadcrumbList present; publisher OK (@id ref); ';
    schemaStatus += a.renderedStatus === 200 ? 'mainEntityOfPage OK' : 'REDIRECTED';

    // H1 recommendation
    let recH1 = 'Use article title as H1';
    if (a.h1.length === 0) recH1 = 'Add H1 matching article title (template renders H1)';
    if (a.h1.length > 1) recH1 = 'Use single H1 — remove extras';

    // Key problem
    const clsReason = cls.reason;
    let keyProblem = clsReason;
    if (a.wordCount < 300) keyProblem += ` | THIN content (${a.wordCount} words)`;
    if (a.h2.length === 0) keyProblem += ' | No H2 structure';
    if (a.internalLinks.length === 0) keyProblem += ' | No internal links';
    if (a.yoastSeoTitle === '' && a.yoastMetaDescription === '') keyProblem += ' | No Yoast meta';

    ws.addRow({
      sn: idx,
      priority: priorities[idx] || 'P1',
      recommendation: cls.action,
      wpPostId: a.wpPostId,
      title: a.title,
      slug: a.slug,
      canonical: a.canonicalUrl,
      datePub: a.datePublished.slice(0, 10),
      dateMod: a.dateModified.slice(0, 10),
      cluster,
      cluster2,
      intent: kw.intent,
      kwPrimary: kw.primary,
      kwSecondary: (kw.secondary || []).join(', '),
      curTitle: a.renderedSeoTitle,
      recTitle: recommendTitle(a, idx),
      curMeta: a.renderedMetaDescription,
      recMeta: recommendMeta(a, idx),
      curH1: a.h1.length > 0 ? a.h1.join('; ') : '(template H1)',
      recH1,
      quality,
      freshness: freshness.status + ' — ' + freshness.reason,
      wc: a.wordCount,
      mergeGroup: mergeGroups[idx]?.group || '',
      mergeRole: mergeGroups[idx]?.role || '',
      cannib: cannib.risk,
      dupRisk,
      related,
      curIntLinks,
      recCommLinks,
      recArtLinks: sameClusterArticles,
      installOpp,
      cta,
      featImg: a.featuredImage ? 'Yes' : 'No',
      imgRec,
      brokenLinks,
      schema: schemaStatus,
      keyProblem,
      myRec: cls.reason,
      pragRec: '',
      approval: '',
    });
  });

  ws.getRow(1).height = 30;

  // ─── Sheet 2: Summary ────────────────────────────────────────────────────
  const ws2 = wb.addWorksheet('Summary');
  ws2.getColumn(1).width = 40;
  ws2.getColumn(2).width = 15;

  const keepCount = Object.values(classifications).filter(c => c.action === 'KEEP').length;
  const optimiseCount = Object.values(classifications).filter(c => c.action === 'OPTIMISE').length;
  const rewriteCount = Object.values(classifications).filter(c => c.action === 'REWRITE').length;
  const mergeCount = Object.values(classifications).filter(c => c.action === 'MERGE/CONSOLIDATE').length;
  const retireCount = Object.values(classifications).filter(c => c.action === 'RETIRE/REVIEW').length;
  const totalClassified = keepCount + optimiseCount + rewriteCount + mergeCount + retireCount;

  const summaryData = [
    ['PRAG Knowledge Center SEO Audit — Summary', ''],
    ['Generated', '2026-08-09'],
    ['Reconciled', '2026-08-09'],
    ['', ''],
    ['INVENTORY', ''],
    ['Total published KC posts in WordPress', inv.length],
    ['Total canonical/indexable articles (200)', inv.filter(a => a.renderedStatus === 200).length],
    ['Total excluded/noindex', 0],
    ['Total redirects/retired (308)', inv.filter(a => a.renderedStatus === 308).length],
    ['Total sitemap KC URLs', inv.filter(a => a.renderedStatus === 200).length],
    ['', ''],
    ['CLASSIFICATION (each article = exactly one action)', ''],
    ['KEEP', keepCount],
    ['OPTIMISE', optimiseCount],
    ['REWRITE', rewriteCount],
    ['MERGE/CONSOLIDATE', mergeCount],
    ['RETIRE/REVIEW', retireCount],
    ['TOTAL', totalClassified],
    ['', ''],
    ['MERGE GROUPS (separate column, not double-counted)', ''],
    ['DG-1: Servo Stabilizer Guides', '2 articles (#4→#16)'],
    ['DG-2: Lithium/LiFePO4 Battery', '4 articles (#10,#18,#19→#9)'],
    ['DG-3: Solar Battery', '2 articles (#11→#8)'],
    ['DG-4: Solar Installation Lagos', '3 articles (#5,#6→#3)'],
    ['DG-5: Stabilizer Batteries', '3 articles (#27,#28→#29)'],
    ['Total articles in merge groups', '14'],
    ['Total merge groups', duplicateGroups.length],
    ['', ''],
    ['TOPIC CLUSTERS', ''],
    ['INVERTERS', inv.filter((a, i) => clusters[i+1] === 'INVERTERS' && a.renderedStatus === 200).length],
    ['VOLTAGE STABILIZERS', inv.filter((a, i) => clusters[i+1] === 'VOLTAGE STABILIZERS' && a.renderedStatus === 200).length],
    ['BATTERIES', inv.filter((a, i) => clusters[i+1] === 'BATTERIES' && a.renderedStatus === 200).length],
    ['SOLAR', inv.filter((a, i) => clusters[i+1] === 'SOLAR' && a.renderedStatus === 200).length],
    ['GENERAL POWER', inv.filter((a, i) => clusters[i+1] === 'GENERAL POWER' && a.renderedStatus === 200).length],
    ['CORPORATE / OTHER', inv.filter((a, i) => clusters[i+1] === 'CORPORATE / OTHER' && a.renderedStatus === 200).length],
    ['', ''],
    ['MAJOR ISSUES', ''],
    ['Thin articles (<300 words)', inv.filter(a => a.wordCount < 300 && a.renderedStatus === 200).length],
    ['Articles with no H2 structure', inv.filter(a => a.h2.length === 0 && a.renderedStatus === 200).length],
    ['Articles with no internal links', inv.filter(a => a.internalLinks.length === 0 && a.renderedStatus === 200).length],
    ['Articles with no Yoast meta', inv.filter(a => a.yoastSeoTitle === '' && a.yoastMetaDescription === '' && a.renderedStatus === 200).length],
    ['Articles with broken internal links', Object.keys(brokenInternalLinks).length],
    ['Articles with broken external links', Object.keys(brokenExternalLinks).length],
    ['Articles using old prag.global URLs (308 redirect)', inv.filter(a => a.internalLinks.some(l => l.href.includes('prag.global/') && !l.href.includes('www.prag.global'))).length],
    ['Duplicate topic groups', duplicateGroups.length],
    ['Cannibalisation HIGH', Object.values(cannibalisation).filter(c => c.risk === 'HIGH').length],
    ['Cannibalisation MEDIUM', Object.values(cannibalisation).filter(c => c.risk === 'MEDIUM').length],
    ['Schema: publisher present (verified live)', 'YES — @id ref to #organization'],
    ['Schema: Article + BreadcrumbList', 'PASS (verified on 5 live URLs)'],
    ['Off-topic articles', 1],
    ['', ''],
    ['PERSISTENCE SAFEGUARD (Step 0)', ''],
    ['Before (local admin-config)', '39'],
    ['WordPress (durable source)', '39'],
    ['Prag-Admin public API', '39'],
    ['www consumption', '39'],
    ['Persistence', 'PASS'],
  ];

  summaryData.forEach(([k, v]) => {
    const row = ws2.addRow([k, v]);
    if (k === k.toUpperCase() && k !== '' && v === '') {
      row.font = { bold: true, size: 12 };
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
    }
  });

  // ─── Sheet 3: Cluster Breakdown ──────────────────────────────────────────
  const ws3 = wb.addWorksheet('Content Clusters');
  ws3.columns = [
    { header: 'Cluster', key: 'cluster', width: 25 },
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Primary Keyword', key: 'kw', width: 35 },
    { header: 'Commercial Destination', key: 'comm', width: 45 },
    { header: 'Role', key: 'role', width: 30 },
  ];
  ws3.getRow(1).font = { bold: true };

  const clusterOrder = ['INVERTERS', 'VOLTAGE STABILIZERS', 'BATTERIES', 'SOLAR', 'GENERAL POWER', 'CORPORATE / OTHER'];
  clusterOrder.forEach(clusterName => {
    inv.forEach((a, i) => {
      const idx = i + 1;
      if (clusters[idx] !== clusterName) return;
      const comm = commercialPages[idx] || {};
      const kw = keywords[idx] || { primary: '' };
      const cls = classifications[idx] || { action: '' };
      ws3.addRow({
        cluster: clusterName,
        article: `#${idx} ${a.title}`,
        kw: kw.primary,
        comm: comm.primary ? `${SITE_BASE}${comm.primary}` : 'N/A',
        role: cls.action,
      });
    });
    ws3.addRow({ cluster: '', article: '', kw: '', comm: '', role: '' });
  });

  // ─── Sheet 4: Cannibalisation HIGH ───────────────────────────────────────
  const ws4 = wb.addWorksheet('Cannibalisation HIGH');
  ws4.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Slug', key: 'slug', width: 40 },
    { header: 'Risk', key: 'risk', width: 10 },
    { header: 'Reason', key: 'reason', width: 70 },
    { header: 'Related Articles', key: 'related', width: 30 },
  ];
  ws4.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    const cannib = cannibalisation[idx];
    if (!cannib || cannib.risk !== 'HIGH') return;
    const dupGroup = duplicateGroups.find(g => g.articles.includes(idx));
    ws4.addRow({
      sn: idx,
      article: a.title,
      slug: a.slug,
      risk: cannib.risk,
      reason: cannib.reason,
      related: dupGroup ? dupGroup.articles.filter(x => x !== idx).map(x => `#${x}`).join(', ') : '',
    });
  });

  // ─── Sheet 5: Duplicate Groups ───────────────────────────────────────────
  const ws5 = wb.addWorksheet('Duplicate Groups');
  ws5.columns = [
    { header: 'Group', key: 'group', width: 35 },
    { header: 'Articles', key: 'articles', width: 20 },
    { header: 'Similarity Reason', key: 'similarity', width: 70 },
    { header: 'Preferred Survivor', key: 'survivor', width: 15 },
    { header: 'Survivor Reason', key: 'survivorReason', width: 60 },
    { header: 'Redirect Implication', key: 'redirect', width: 60 },
  ];
  ws5.getRow(1).font = { bold: true };

  duplicateGroups.forEach(g => {
    ws5.addRow({
      group: g.group,
      articles: g.articles.map(a => `#${a}`).join(', '),
      similarity: g.similarity,
      survivor: `#${g.survivor}`,
      survivorReason: g.survivorReason,
      redirect: g.redirect,
    });
  });

  // ─── Sheet 6: Merge Review ───────────────────────────────────────────────
  const ws6 = wb.addWorksheet('Merge Review');
  ws6.columns = [
    { header: 'Primary Article', key: 'primary', width: 45 },
    { header: 'Secondary Article(s)', key: 'secondary', width: 45 },
    { header: 'Similarity Reason', key: 'similarity', width: 60 },
    { header: 'Preferred Survivor', key: 'survivor', width: 15 },
    { header: 'Redirect Implication', key: 'redirect', width: 60 },
    { header: 'Manual Review', key: 'manual', width: 20 },
  ];
  ws6.getRow(1).font = { bold: true };

  duplicateGroups.forEach(g => {
    const primaryArticle = inv[g.survivor - 1];
    const secondaryArticles = g.articles.filter(a => a !== g.survivor).map(a => `#${a} ${inv[a-1].title}`).join('; ');
    ws6.addRow({
      primary: `#${g.survivor} ${primaryArticle.title}`,
      secondary: secondaryArticles,
      similarity: g.similarity,
      survivor: `#${g.survivor}`,
      redirect: g.redirect,
      manual: 'REQUIRED',
    });
  });

  // ─── Sheet 7: Retire Review ──────────────────────────────────────────────
  const ws7 = wb.addWorksheet('Retire Review');
  ws7.columns = [
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Reason', key: 'reason', width: 60 },
    { header: 'Current Value', key: 'value', width: 20 },
    { header: 'Relevant Replacement?', key: 'replacement', width: 40 },
    { header: 'Recommended Action', key: 'action', width: 40 },
  ];
  ws7.getRow(1).font = { bold: true };

  const retireArticles = [
    { idx: 35, reason: 'Blood pressure monitor — not a PRAG power product. Off-topic for Knowledge Center.', value: 'None', replacement: 'N/A — remove from KC', action: 'RETIRE: set to draft or delete. No redirect needed (no commercial replacement).' },
    { idx: 43, reason: '52-word promotional social post. Not an article. No informational value.', value: 'None', replacement: '#25 (inverters to the rescue) or new inverter vs generator article', action: 'RETIRE: set to draft. Optionally 301 to /products/inverters or a future inverter vs generator article.' },
    { idx: 40, reason: 'Already redirected (308) to /installations. Contains only shortcode placeholder.', value: 'Already handled', replacement: '/installations (already redirecting)', action: 'ALREADY HANDLED — no action needed. 308 redirect active.' },
  ];

  retireArticles.forEach(r => {
    const a = inv[r.idx - 1];
    ws7.addRow({
      article: `#${r.idx} ${a.title} (${a.slug})`,
      reason: r.reason,
      value: r.value,
      replacement: r.replacement,
      action: r.action,
    });
  });

  // ─── Sheet 8: Broken Internal Links ──────────────────────────────────────
  const ws8 = wb.addWorksheet('Broken Internal Links');
  ws8.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 45 },
    { header: 'Broken Link', key: 'link', width: 60 },
    { header: 'Issue', key: 'issue', width: 30 },
    { header: 'Recommended Fix', key: 'fix', width: 55 },
  ];
  ws8.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    if (brokenInternalLinks[idx]) {
      brokenInternalLinks[idx].forEach(link => {
        ws8.addRow({
          sn: idx,
          article: a.title,
          link: link,
          issue: link.includes('404') ? '404 after redirect chain' : link.includes('410') ? '410 Gone' : 'Redirect chain',
          fix: 'Update to final canonical www.prag.global URL or remove if product no longer exists',
        });
      });
    }
    // Also flag old prag.global links
    a.internalLinks.forEach(l => {
      if (l.href.includes('prag.global/') && !l.href.includes('www.prag.global')) {
        ws8.addRow({
          sn: idx,
          article: a.title,
          link: l.href,
          issue: 'Old URL (308 redirect chain)',
          fix: 'Update to final canonical www.prag.global URL',
        });
      }
    });
  });

  // ─── Sheet 9: Broken External Links ──────────────────────────────────────
  const ws9 = wb.addWorksheet('Broken External Links');
  ws9.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 45 },
    { header: 'Broken Link', key: 'link', width: 60 },
    { header: 'Issue', key: 'issue', width: 25 },
    { header: 'Recommended Fix', key: 'fix', width: 50 },
  ];
  ws9.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    if (brokenExternalLinks[idx]) {
      brokenExternalLinks[idx].forEach(link => {
        ws9.addRow({
          sn: idx,
          article: a.title,
          link: link,
          issue: link.includes('DNS') ? 'DNS failure' : link.includes('404') ? '404 Not Found' : 'Broken',
          fix: 'Remove link or replace with valid alternative source',
        });
      });
    }
  });

  // ─── Sheet 10: Articles with no commercial link ──────────────────────────
  const ws10 = wb.addWorksheet('No Commercial Link');
  ws10.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Cluster', key: 'cluster', width: 20 },
    { header: 'Recommended Commercial Link', key: 'recLink', width: 55 },
  ];
  ws10.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    if (classifications[idx]?.action === 'RETIRE/REVIEW') return;
    const comm = commercialPages[idx];
    if (!comm || comm.primary === 'N/A') return;
    // Check if article already links to a commercial page
    const hasCommercialLink = a.internalLinks.some(l =>
      l.href.includes('/products/') || l.href.includes('/solutions/') || l.href.includes('product-category')
    );
    if (!hasCommercialLink) {
      ws10.addRow({
        sn: idx,
        article: a.title,
        cluster: clusters[idx] || '',
        recLink: `${SITE_BASE}${comm.primary}` + (comm.secondary !== 'N/A' ? `; ${SITE_BASE}${comm.secondary}` : ''),
      });
    }
  });

  // ─── Sheet 11: Articles with no CTA ──────────────────────────────────────
  const ws11 = wb.addWorksheet('No CTA');
  ws11.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Recommended CTA', key: 'cta', width: 35 },
    { header: 'CTA Destination', key: 'dest', width: 55 },
  ];
  ws11.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    if (classifications[idx]?.action === 'RETIRE/REVIEW') return;
    const cta = ctaRecommendations[idx];
    const comm = commercialPages[idx];
    if (cta && cta !== 'N/A') {
      // All articles lack explicit CTA (WordPress content has no CTA blocks)
      ws11.addRow({
        sn: idx,
        article: a.title,
        cta: cta,
        dest: comm?.primary ? `${SITE_BASE}${comm.primary}` : '',
      });
    }
  });

  // ─── Sheet 12: Internal Link Map ─────────────────────────────────────────
  const ws12 = wb.addWorksheet('Internal Link Map');
  ws12.columns = [
    { header: 'Source Article', key: 'source', width: 45 },
    { header: 'Destination', key: 'dest', width: 55 },
    { header: 'Anchor/Context', key: 'anchor', width: 35 },
    { header: 'Reason', key: 'reason', width: 45 },
  ];
  ws12.getRow(1).font = { bold: true };

  // Current internal links
  inv.forEach((a, i) => {
    const idx = i + 1;
    a.internalLinks.forEach(l => {
      ws12.addRow({
        source: `#${idx} ${a.title.slice(0, 40)}`,
        dest: l.href,
        anchor: l.anchorText.slice(0, 30),
        reason: 'Current link (needs URL update to canonical)',
      });
    });
  });

  ws12.addRow({ source: '', dest: '', anchor: '', reason: '' });
  ws12.addRow({ source: '--- RECOMMENDED NEW LINKS ---', dest: '', anchor: '', reason: '' });

  // Recommended commercial links for articles with none
  inv.forEach((a, i) => {
    const idx = i + 1;
    if (classifications[idx]?.action === 'RETIRE/REVIEW') return;
    const comm = commercialPages[idx];
    if (!comm || comm.primary === 'N/A') return;
    const hasCommercialLink = a.internalLinks.some(l =>
      l.href.includes('/products/') || l.href.includes('/solutions/') || l.href.includes('product-category')
    );
    if (!hasCommercialLink) {
      ws12.addRow({
        source: `#${idx} ${a.title.slice(0, 40)}`,
        dest: `${SITE_BASE}${comm.primary}`,
        anchor: ctaRecommendations[idx] || 'Explore PRAG Products',
        reason: 'Missing commercial link — add contextual link to primary product category',
      });
    }
  });

  // ─── Sheet 13: Content Opportunities ─────────────────────────────────────
  const ws13 = wb.addWorksheet('Content Opportunities');
  ws13.columns = [
    { header: 'Priority', key: 'priority', width: 10 },
    { header: 'Proposed Topic', key: 'topic', width: 50 },
    { header: 'Search Intent', key: 'intent', width: 16 },
    { header: 'Primary Commercial Page', key: 'page', width: 40 },
    { header: 'Cluster', key: 'cluster', width: 22 },
    { header: 'Reason', key: 'reason', width: 70 },
  ];
  ws13.getRow(1).font = { bold: true };

  contentOpportunities.forEach(opp => {
    ws13.addRow(opp);
  });

  // ─── Sheet 14: Outdated Articles ─────────────────────────────────────────
  const ws14 = wb.addWorksheet('Outdated Articles');
  ws14.columns = [
    { header: 'S/N', key: 'sn', width: 6 },
    { header: 'Article', key: 'article', width: 50 },
    { header: 'Published', key: 'pub', width: 14 },
    { header: 'Modified', key: 'mod', width: 14 },
    { header: 'Freshness', key: 'freshness', width: 16 },
    { header: 'Reason', key: 'reason', width: 60 },
  ];
  ws14.getRow(1).font = { bold: true };

  inv.forEach((a, i) => {
    const idx = i + 1;
    const f = assessFreshness(a);
    if (f.status === 'OUTDATED' || f.status === 'NEEDS UPDATE') {
      ws14.addRow({
        sn: idx,
        article: a.title,
        pub: a.datePublished.slice(0, 10),
        mod: a.dateModified.slice(0, 10),
        freshness: f.status,
        reason: f.reason,
      });
    }
  });

  // ─── Save ────────────────────────────────────────────────────────────────
  const outPath = path.join(ROOT, 'PRAG_Knowledge_Center_SEO_Audit.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log(`Workbook saved: ${outPath}`);
  console.log(`Sheets: ${wb.worksheets.length}`);
  wb.worksheets.forEach(s => console.log(`  - ${s.name}`));
}

buildWorkbook().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});

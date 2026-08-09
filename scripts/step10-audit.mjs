// PRAG Step 10 — Individual Product SEO Audit & Workbook Generator
// AUDIT + RECOMMENDATION ONLY. No production data is modified.
//
// Run from prag-b2b root:
//   node scripts/step10-audit.mjs
//
// Inputs:  scripts/out/all-products.json  (from fetch-all-products.mjs)
// Outputs: PRAG_Product_SEO_Master_Audit.xlsx  (project root)
//          scripts/out/step10-analysis.json    (full structured analysis)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Taxonomy (mirrors lib/seoTaxonomy.ts — DO NOT import TS at runtime) ──────
const APPROVED_PARENT = ['inverters', 'voltage-stabilizers', 'batteries', 'solar'];
const APPROVED_SUB = [
  'hybrid-inverters', 'heavy-duty-inverters',
  'relay-voltage-stabilizers', 'servo-voltage-stabilizers', 'thyristor-stabilizers', 'advanced-stabilizers',
  'lithium-batteries',
  'solar-panels', 'solar-charge-controllers', 'protective-device',
];
const APPROVED = new Set([...APPROVED_PARENT, ...APPROVED_SUB]);
const EXCLUDED = new Set(['health-fitness', 'personal-electronics', 'travel', 'sales']);
const NON_CANONICAL = new Set([
  'sales', 'travel', 'health-fitness', 'personal-electronics', 'all-prag-stabilizers',
  'more-products', 'uncategorized', 'accessories', 'lithium-ion', 'pure-sine-wave-inverters',
  'all-batteries', 'gel-inverter-battery', 'opzv-batteries', 'agm-gel-inverter-battery',
  'solar-batteries', 'eco-series-inverter', 'tbb', 'electrical-lights', 'prag-promo-bundle',
  'prag-solar-complete-bundles', 'all-bundle-package',
  'all-prag-bundle-inverter-battery-and-solar-inverter-new-version',
  'all-prag-bundle-inverter-and-battery-new-version', 'bundle-package-prag',
  'prag-inverter-battery-installation', 'battery-rack',
]);
const SUB_PRIORITY = [
  'hybrid-inverters', 'heavy-duty-inverters',
  'servo-voltage-stabilizers', 'thyristor-stabilizers', 'relay-voltage-stabilizers', 'advanced-stabilizers',
  'lithium-batteries',
  'solar-panels', 'solar-charge-controllers', 'protective-device',
];
const PARENT_PRIORITY = ['inverters', 'voltage-stabilizers', 'batteries', 'solar'];
const OVERRIDES = {};

function preferredProductCategory(categories, productSlug) {
  if (!categories || categories.length === 0) return 'products';
  const approvedSlugs = categories.map((c) => c.slug).filter((s) => APPROVED.has(s));
  if (approvedSlugs.length === 0) return 'products';
  if (productSlug && productSlug in OVERRIDES && approvedSlugs.includes(OVERRIDES[productSlug])) return OVERRIDES[productSlug];
  for (const p of SUB_PRIORITY) if (approvedSlugs.includes(p)) return p;
  for (const p of PARENT_PRIORITY) if (approvedSlugs.includes(p)) return p;
  return [...approvedSlugs].sort()[0];
}

function hasApprovedCategory(categories) {
  return !!(categories && categories.some((c) => APPROVED.has(c.slug)));
}

function onlyExcludedCategories(categories) {
  if (!categories || categories.length === 0) return true;
  return categories.every((c) => EXCLUDED.has(c.slug) || NON_CANONICAL.has(c.slug));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function stripHtml(h) {
  return (h || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#8220;|&#8221;/gi, '"')
    .replace(/&#8217;/gi, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function titleCase(s) { return (s || '').replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()); }

// Parse capacity / voltage / key specs from a product name.
function parseSpecs(name) {
  const n = name || '';
  const kva = n.match(/([\d.]+)\s*kva/i)?.[1];
  const kw = n.match(/([\d.]+)\s*kw\b/i)?.[1];
  const kwh = n.match(/([\d.]+)\s*kwh/i)?.[1];
  const v = n.match(/(\d+)\s*v\b/i)?.[1];
  const w = n.match(/([\d.]+)\s*w\b/i)?.[1];
  const voltRange = n.match(/\(?\s*(\d[\d.-]*)\s*[-–]\s*(\d[\d.-]*)\s*v\s*\)?/i);
  const amp = n.match(/(\d+)\s*a\b/i)?.[1];
  return { kva, kw, kwh, v, w, voltRange, amp };
}

// ─── Load data ───────────────────────────────────────────────────────────────
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'all-products.json'), 'utf8'));
const products = raw.products;
const SITE = 'https://www.prag.global';

// ─── Build canonical inventory ───────────────────────────────────────────────
// Products are unique by slug in WooCommerce. Alternate category routes are NOT
// separate products — the preferredProductCategory() collapses them to one URL.
const inventory = products.map((p) => {
  const cats = p.categories || [];
  const preferred = preferredProductCategory(cats, p.slug);
  const approved = hasApprovedCategory(cats);
  const onlyExcluded = onlyExcludedCategories(cats);
  const canonical = preferred === 'products'
    ? `${SITE}/products/${cats[0]?.slug ?? 'products'}/${p.slug}`
    : `${SITE}/products/${preferred}/${p.slug}`;
  return { p, cats, preferred, approved, onlyExcluded, canonical };
});

// Canonical indexable products = has an approved category (preferred !== 'products').
const canonical = inventory.filter((i) => i.approved && i.preferred !== 'products');
// Excluded / non-SEO products = only excluded/non-canonical categories, no approved.
const excluded = inventory.filter((i) => !i.approved);

// ─── Duplicate product detection ─────────────────────────────────────────────
// Group by normalized name (ignoring trailing -2 slug suffix and minor diffs).
function dupKey(name) {
  // Strip parenthetical voltage ranges and trailing digits to find near-identical names.
  return norm(name)
    .replace(/\b\d+\s*[-–]\s*\d+\s*v\b/g, 'VRANGE')
    .replace(/\bvrange\b/g, 'VRANGE')
    .replace(/\b\d+v\b/g, 'V')
    .replace(/\s+/g, ' ')
    .trim();
}
const byNormName = {};
for (const i of inventory) {
  const k = dupKey(i.p.name);
  (byNormName[k] ||= []).push(i);
}
// Also detect same-name exactly.
const byExactName = {};
for (const i of inventory) {
  const k = norm(i.p.name);
  (byExactName[k] ||= []).push(i);
}

function duplicateRelationships(item) {
  const rels = [];
  const exact = byExactName[norm(item.p.name)].filter((x) => x.p.id !== item.p.id);
  for (const o of exact) rels.push({ with: o, type: 'DUPLICATE', reason: 'Identical product name' });
  const near = byNormName[dupKey(item.p.name)].filter((x) => x.p.id !== item.p.id);
  for (const o of near) {
    if (rels.some((r) => r.with.p.id === o.p.id)) continue;
    rels.push({ with: o, type: 'POSSIBLE DUPLICATE', reason: 'Near-identical name (same capacity/type, differing voltage/spec)' });
  }
  return rels;
}

// ─── Duplicate content detection ─────────────────────────────────────────────
const shortDescGroups = {};
for (const i of inventory) {
  const s = stripHtml(i.p.short_description);
  if (s.length > 20) (shortDescGroups[s] ||= []).push(i.p.id);
}
const fullDescGroups = {};
for (const i of inventory) {
  const s = stripHtml(i.p.description);
  if (s.length > 60) (fullDescGroups[s] ||= []).push(i.p.id);
}

// ─── Per-product audit ───────────────────────────────────────────────────────
const CATEGORY_DISPLAY = {
  inverters: 'Inverters', 'hybrid-inverters': 'Hybrid Inverters', 'heavy-duty-inverters': 'Heavy-Duty Inverters',
  'voltage-stabilizers': 'Voltage Stabilizers', 'relay-voltage-stabilizers': 'Relay Voltage Stabilizers',
  'servo-voltage-stabilizers': 'Servo Voltage Stabilizers', 'thyristor-stabilizers': 'Thyristor Stabilizers',
  'advanced-stabilizers': 'Advanced Stabilizers', batteries: 'Batteries', 'lithium-batteries': 'Lithium Batteries',
  solar: 'Solar Products', 'solar-panels': 'Solar Panels', 'solar-charge-controllers': 'Solar Charge Controllers',
  'protective-device': 'Protective Devices',
};

// Recommended internal links per category.
const INTERNAL_LINKS = {
  'hybrid-inverters': ['/products/hybrid-inverters', '/products/lithium-batteries', '/solutions/solar-energy', '/solutions/backup-power'],
  'heavy-duty-inverters': ['/products/heavy-duty-inverters', '/products/inverters', '/products/lithium-batteries', '/solutions/backup-power', '/solutions/industrial'],
  inverters: ['/products/inverters', '/products/batteries', '/solutions/backup-power'],
  'relay-voltage-stabilizers': ['/products/relay-voltage-stabilizers', '/products/voltage-stabilizers', '/solutions/voltage-stabilization-protection'],
  'servo-voltage-stabilizers': ['/products/servo-voltage-stabilizers', '/products/voltage-stabilizers', '/solutions/voltage-stabilization-protection'],
  'thyristor-stabilizers': ['/products/thyristor-stabilizers', '/products/voltage-stabilizers', '/solutions/voltage-stabilization-protection'],
  'advanced-stabilizers': ['/products/advanced-stabilizers', '/products/voltage-stabilizers', '/solutions/voltage-stabilization-protection', '/solutions/industrial'],
  'lithium-batteries': ['/products/lithium-batteries', '/products/batteries', '/products/hybrid-inverters', '/solutions/backup-power', '/solutions/solar-energy'],
  batteries: ['/products/batteries', '/products/lithium-batteries', '/products/inverters', '/solutions/backup-power'],
  'solar-panels': ['/products/solar-panels', '/products/solar', '/solutions/solar-energy'],
  'solar-charge-controllers': ['/products/solar-charge-controllers', '/products/solar', '/products/solar-panels', '/solutions/solar-energy'],
  'protective-device': ['/products/protective-device', '/products/solar', '/solutions/voltage-stabilization-protection'],
  solar: ['/products/solar', '/solutions/solar-energy'],
};

function gradeDescription(p) {
  const sd = stripHtml(p.short_description);
  const fd = stripHtml(p.description);
  const total = sd.length + fd.length;
  // Duplicate short desc?
  const sdDup = shortDescGroups[sd] && shortDescGroups[sd].length > 1;
  const fdDup = fullDescGroups[fd] && fullDescGroups[fd].length > 1;
  if (sdDup || fdDup) return 'DUPLICATE';
  if (total < 120) return 'THIN';
  if (total < 400) return 'ADEQUATE';
  return 'STRONG';
}

function detectSpecIssues(p, preferred) {
  const issues = [];
  const name = p.name;
  const sd = stripHtml(p.short_description);
  const fd = stripHtml(p.description);
  const ns = parseSpecs(name);

  // Lithium battery: name kWh/V vs description actual kWh/V
  if (/lithium/i.test(name)) {
    const dKwh = sd.match(/([\d.]+)\s*kwh/i)?.[1] || fd.match(/([\d.]+)\s*kwh/i)?.[1];
    const dV = sd.match(/([\d.]+)\s*v\b/i)?.[1] || fd.match(/([\d.]+)\s*v\b/i)?.[1];
    if (ns.kwh && dKwh && ns.kwh !== dKwh) issues.push(`Name ${ns.kwh}kWh vs description ${dKwh}kWh (rounding convention — PRAG VERIFICATION REQUIRED)`);
    if (ns.v && dV && ns.v !== dV) issues.push(`Name ${ns.v}V vs description ${dV}V (nominal vs actual cell voltage — PRAG VERIFICATION REQUIRED)`);
  }
  // kVA vs kW confusion in name
  if (ns.kva && ns.kw) issues.push(`Name contains both ${ns.kva}kVA and ${ns.kw}kW — verify which is inverter output vs MPPT input`);
  // Servo 3-phase: name range vs description range
  if (/3-?phase/i.test(name) && ns.voltRange) {
    const dr = sd.match(/(\d[\d.-]*)\s*[-–]\s*(\d[\d.-]*)\s*v/i);
    if (dr && (dr[1] !== ns.voltRange[1] || dr[2] !== ns.voltRange[2])) {
      issues.push(`Name voltage ${ns.voltRange[1]}-${ns.voltRange[2]}V vs description ${dr[1]}-${dr[2]}V (single vs 3-phase range — PRAG VERIFICATION REQUIRED)`);
    }
  }
  // Stabilizer technology vs preferred category mismatch
  const tech = /servo/i.test(name) ? 'servo' : /thyristor/i.test(name) ? 'thyristor' : /relay/i.test(name) ? 'relay' : null;
  if (tech === 'servo' && preferred === 'advanced-stabilizers') issues.push(`Name says Servo but canonical category is advanced-stabilizers (taxonomy review)`);
  // Uncategorized real power product
  if (p.categories?.every((c) => NON_CANONICAL.has(c.slug) || c.slug === 'uncategorized')) {
    issues.push(`DATA FIX REQUIRED: product has no approved category (only uncategorized) — should be ${tech ? tech + '-voltage-stabilizers' : 'an approved category'}`);
  }
  // Solar panel short desc says "Canadian" for non-Canadian panels
  if (/panel/i.test(name) && /canadian/i.test(sd) && !/canadian/i.test(name)) {
    issues.push(`Short description says "Canadian Solar Panel" but product is ${name.split(' ').slice(0, 2).join(' ')} (INACCURATE)`);
  }
  return issues;
}

function categoryAccuracy(p, preferred) {
  const name = p.name.toLowerCase();
  const issues = [];
  if (preferred === 'products') return { accurate: false, issue: 'No approved category assigned' };
  // Hybrid inverter should be hybrid-inverters
  if (/hybrid/i.test(name) && preferred === 'inverters') issues.push('Hybrid inverter assigned to broad inverters instead of hybrid-inverters');
  if (/heavy.?duty/i.test(name) && preferred === 'inverters') issues.push('Heavy-duty inverter assigned to broad inverters instead of heavy-duty-inverters');
  if (/servo/i.test(name) && preferred === 'advanced-stabilizers') issues.push('Servo stabilizer assigned to advanced-stabilizers (review vs servo-voltage-stabilizers)');
  if (/relay/i.test(name) && preferred !== 'relay-voltage-stabilizers' && preferred !== 'voltage-stabilizers') issues.push(`Relay stabilizer assigned to ${preferred}`);
  if (/thyristor/i.test(name) && preferred !== 'thyristor-stabilizers' && preferred !== 'voltage-stabilizers') issues.push(`Thyristor stabilizer assigned to ${preferred}`);
  if (/lithium/i.test(name) && preferred === 'batteries') issues.push('Lithium battery assigned to broad batteries instead of lithium-batteries');
  if (/panel/i.test(name) && preferred === 'solar') issues.push('Solar panel assigned to broad solar instead of solar-panels');
  if (/charge controller/i.test(name) && preferred === 'solar') issues.push('Charge controller assigned to broad solar instead of solar-charge-controllers');
  // Accessories miscategorized as charge controllers
  const isAccessory = p.categories?.some((c) => c.slug === 'accessories');
  if (isAccessory && preferred === 'solar-charge-controllers' && !/charge controller/i.test(name)) {
    issues.push('Accessory product assigned to solar-charge-controllers (should likely be excluded as accessories)');
  }
  return { accurate: issues.length === 0, issue: issues.join('; ') || '' };
}

// Build a recommended SEO title from real product data.
function recommendTitle(p, preferred) {
  const name = p.name;
  const cat = CATEGORY_DISPLAY[preferred] || '';
  // Stabilizers: "{Capacity} {Tech} Voltage Stabilizer in Nigeria | PRAG"
  const kva = name.match(/([\d.]+)\s*kva/i)?.[1];
  const kw = name.match(/([\d.]+)\s*kw\b/i)?.[1];
  const kwh = name.match(/([\d.]+)\s*kwh/i)?.[1];
  const v = name.match(/(\d+)\s*v\b/i)?.[1];
  const w = name.match(/([\d.]+)\s*w\b/i)?.[1];
  const vr = name.match(/\(?\s*(\d[\d.-]*)\s*[-–]\s*(\d[\d.-]*)\s*v\s*\)?/i);

  if (/stabilizer/i.test(name)) {
    const tech = /servo/i.test(name) ? 'Servo' : /thyristor/i.test(name) ? 'Thyristor' : /relay/i.test(name) ? 'Relay' : '';
    const cap = kva ? `${kva}kVA` : '';
    const range = vr ? ` (${vr[1]}-${vr[2]}V)` : '';
    const indep = /independent phase regulation/i.test(name) ? ' Independent Phase Regulation' : '';
    const parts = [cap, tech, 'Voltage Stabilizer'].filter(Boolean).join(' ');
    if (parts) return `${parts}${range}${indep} in Nigeria | PRAG`;
  }
  if (/hybrid inverter/i.test(name)) {
    const cap = kw ? `${kw}kW` : kva ? `${kva}kVA` : '';
    const volt = v ? ` ${v}V` : '';
    const mppt = name.match(/(\d+)w-?mppt/i)?.[1];
    const mpptStr = mppt ? ` (MPPT ${mppt}W)` : '';
    if (cap) return `${cap}${volt} Hybrid Inverter${mpptStr} | PRAG`;
  }
  if (/heavy.?duty inverter/i.test(name)) {
    const cap = kva ? `${kva}kVA` : kw ? `${kw}kW` : '';
    const volt = v ? ` ${v}V` : '';
    if (cap) return `${cap}${volt} Heavy-Duty Inverter in Nigeria | PRAG`;
  }
  if (/lithium battery/i.test(name)) {
    const cap = kwh ? `${kwh}kWh` : '';
    const volt = v ? ` ${v}V` : '';
    if (cap) return `${cap}${volt} Lithium Battery in Nigeria | PRAG`;
  }
  if (/solar panel|mono panel/i.test(name)) {
    const cap = w ? `${w}W` : '';
    const brand = name.match(/(jinko|canadian)/i)?.[1];
    const brandStr = brand ? ` ${titleCase(brand)}` : '';
    if (cap) return `${cap}${brandStr} Mono Solar Panel in Nigeria | PRAG`;
  }
  if (/charge controller/i.test(name)) {
    const amp = name.match(/(\d+)\s*a\b/i)?.[1];
    if (amp) return `${amp}A MPPT Solar Charge Controller in Nigeria | PRAG`;
  }
  if (/surge protective|surge protect/i.test(name)) {
    return `${name.replace(/\s*\+.*$/, '').replace(/\s*-\s*2 Pole.*/i, '')} | PRAG`;
  }
  // Fallback: keep product name | PRAG
  return `${name} | PRAG`;
}

function recommendMetaDescription(p, preferred) {
  const name = p.name;
  const sd = stripHtml(p.short_description);
  const fd = stripHtml(p.description);
  const cat = CATEGORY_DISPLAY[preferred] || '';
  const kva = name.match(/([\d.]+)\s*kva/i)?.[1];
  const kw = name.match(/([\d.]+)\s*kw\b/i)?.[1];
  const kwh = name.match(/([\d.]+)\s*kwh/i)?.[1];
  const v = name.match(/(\d+)\s*v\b/i)?.[1];
  const w = name.match(/([\d.]+)\s*w\b/i)?.[1];
  const vr = name.match(/\(?\s*(\d[\d.-]*)\s*[-–]\s*(\d[\d.-]*)\s*v\s*\)?/i);

  if (/stabilizer/i.test(name)) {
    const tech = /servo/i.test(name) ? 'servo' : /thyristor/i.test(name) ? 'thyristor' : /relay/i.test(name) ? 'relay' : '';
    const cap = kva ? `${kva}kVA ` : '';
    const range = vr ? ` ${vr[1]}-${vr[2]}V input` : '';
    return `PRAG ${cap}${tech} voltage stabilizer${range} delivers steady 220V output, protecting appliances and equipment from Nigerian voltage fluctuations. Specs, pricing and availability.`;
  }
  if (/hybrid inverter/i.test(name)) {
    const cap = kw ? `${kw}kW ` : kva ? `${kva}kVA ` : '';
    const volt = v ? ` ${v}V` : '';
    return `PRAG ${cap}${volt} hybrid inverter combines solar MPPT charging and battery backup in one unit for Nigerian homes and businesses. Specs, pricing and availability.`;
  }
  if (/heavy.?duty inverter/i.test(name)) {
    const cap = kva ? `${kva}kVA ` : kw ? `${kw}kW ` : '';
    const volt = v ? ` ${v}V` : '';
    return `PRAG ${cap}${volt} heavy-duty inverter built for continuous operation and demanding loads in Nigerian homes, businesses and industry. Specs, pricing and availability.`;
  }
  if (/lithium battery/i.test(name)) {
    const cap = kwh ? `${kwh}kWh ` : '';
    const volt = v ? ` ${v}V` : '';
    return `PRAG ${cap}${volt} LiFePO4 lithium battery — lightweight, long-life energy storage for inverter and solar systems in Nigeria. Specs, pricing and availability.`;
  }
  if (/solar panel|mono panel/i.test(name)) {
    const cap = w ? `${w}W ` : '';
    return `PRAG ${cap}monocrystalline solar panel for residential and commercial solar installations in Nigeria. High efficiency, durable build. Specs, pricing and availability.`;
  }
  if (/charge controller/i.test(name)) {
    const amp = name.match(/(\d+)\s*a\b/i)?.[1];
    return `PRAG ${amp ? amp + 'A ' : ''}MPPT solar charge controller optimises solar charging and protects batteries in Nigerian solar systems. Specs, pricing and availability.`;
  }
  if (/surge protective/i.test(name)) {
    return `PRAG surge protective device for low-voltage solar and power systems in Nigeria — safeguards equipment from electrical surges. Specs, pricing and availability.`;
  }
  // Generic fallback from cleaned short description
  const base = (sd || fd).slice(0, 150);
  return base || `${name} — specs, pricing and availability from PRAG Nigeria.`;
}

function primaryKeyword(p, preferred) {
  const name = p.name;
  const kva = name.match(/([\d.]+)\s*kva/i)?.[1];
  const kw = name.match(/([\d.]+)\s*kw\b/i)?.[1];
  const kwh = name.match(/([\d.]+)\s*kwh/i)?.[1];
  const v = name.match(/(\d+)\s*v\b/i)?.[1];
  const w = name.match(/([\d.]+)\s*w\b/i)?.[1];
  if (/stabilizer/i.test(name)) {
    const tech = /servo/i.test(name) ? 'servo' : /thyristor/i.test(name) ? 'thyristor' : /relay/i.test(name) ? 'relay' : '';
    const cap = kva ? `${kva}kVA ` : '';
    return `${cap}${tech} voltage stabilizer`.trim();
  }
  if (/hybrid inverter/i.test(name)) {
    const cap = kw ? `${kw}kW ` : kva ? `${kva}kVA ` : '';
    const volt = v ? ` ${v}V` : '';
    return `${cap}${volt} hybrid inverter`.trim();
  }
  if (/heavy.?duty inverter/i.test(name)) {
    const cap = kva ? `${kva}kVA ` : kw ? `${kw}kW ` : '';
    return `${cap}heavy-duty inverter`.trim();
  }
  if (/lithium battery/i.test(name)) {
    const cap = kwh ? `${kwh}kWh ` : '';
    const volt = v ? ` ${v}V` : '';
    return `${cap}${volt} lithium battery`.trim();
  }
  if (/solar panel|mono panel/i.test(name)) {
    const cap = w ? `${w}W ` : '';
    return `${cap}solar panel`.trim();
  }
  if (/charge controller/i.test(name)) return 'MPPT solar charge controller';
  if (/surge protective/i.test(name)) return 'surge protective device';
  return name.toLowerCase();
}

function secondaryKeywords(p, preferred) {
  const pk = primaryKeyword(p, preferred);
  const out = [pk + ' Nigeria', pk + ' price'];
  if (/stabilizer/i.test(p.name)) out.push('voltage stabilizer', 'voltage regulator');
  if (/hybrid|inverter/i.test(p.name)) out.push('hybrid inverter', 'solar inverter');
  if (/lithium/i.test(p.name)) out.push('LiFePO4 battery', 'lithium battery Nigeria');
  if (/panel/i.test(p.name)) out.push('monocrystalline solar panel', 'buy solar panel Nigeria');
  if (/charge controller/i.test(p.name)) out.push('solar charge controller', 'MPPT controller');
  return [...new Set(out)].slice(0, 5);
}

// ─── Classification + priority ───────────────────────────────────────────────
function classify(item) {
  const { p, preferred, approved } = item;
  // Excluded product
  if (!approved) {
    const isRealPower = /stabilizer|inverter|battery|panel|charge controller|surge/i.test(p.name);
    if (isRealPower && p.categories?.every((c) => c.slug === 'uncategorized' || NON_CANONICAL.has(c.slug))) return 'DATA FIX';
    return 'EXCLUDED';
  }
  const descGrade = gradeDescription(p);
  const specIssues = detectSpecIssues(p, preferred);
  const catAcc = categoryAccuracy(p, preferred);
  const rels = duplicateRelationships(item);
  const hasDataIssue = specIssues.some((s) => /DATA FIX REQUIRED/.test(s)) ||
    p.categories?.every((c) => NON_CANONICAL.has(c.slug) || c.slug === 'uncategorized');
  if (hasDataIssue) return 'DATA FIX';
  if (rels.some((r) => r.type === 'DUPLICATE')) return 'MERGE/REVIEW';
  if (descGrade === 'DUPLICATE' || descGrade === 'INACCURATE') return 'REWRITE';
  if (descGrade === 'THIN') return 'REWRITE';
  if (specIssues.length > 0 || !catAcc.accurate) return 'DATA FIX';
  // Every product currently has empty image alt text and no in-body internal
  // links, and uses the generic {Name} | PRAG fallback title — so even
  // STRONG/ADEQUATE products need optimisation work. Reserve GOOD for products
  // that genuinely need nothing (none currently qualify).
  return 'OPTIMISE';
}

function priority(item, recommendation) {
  const { p, preferred } = item;
  if (recommendation === 'EXCLUDED') return 'P3';
  const name = p.name;
  const price = Number(String(p.price ?? '').replace(/,/g, ''));
  // "Core" = a primary PRAG power product with strong specific search intent.
  const isCorePower = /stabilizer|hybrid inverter|heavy.?duty inverter|lithium battery|solar panel|charge controller|surge protective/i.test(name);
  // Accessories / communication modules / sensors / remote displays are NOT core
  // commercial power products — they are low-value for SEO and mostly need
  // taxonomy/data review rather than content optimisation.
  const isAccessory = p.categories?.some((c) => c.slug === 'accessories') && !/charge controller/i.test(name);
  const hasMajorIssue = recommendation === 'DATA FIX' || recommendation === 'MERGE/REVIEW' || recommendation === 'REWRITE';
  // High commercial value: high price OR a flagship capacity in the range.
  const highValue = price >= 500000 || /200kva|100kva|60kva|50kva|30kva|25kva|20kva|15kva|10kva|7\.5kva|6\.5kva|6\.3kva|6kw|5\.5kw|5kwh|595w|540w|535w|480w/i.test(name);

  // P3: accessories, non-core data-review, low-value duplicates.
  if (isAccessory) return 'P3';
  if (recommendation === 'DATA FIX' && !isCorePower) return 'P3';

  // P0: core power product with a major issue (data fix / merge / rewrite) that
  // is also high commercial value, OR a flagship product blocking a capacity
  // cluster. These must be resolved before the catalogue can be optimised.
  if (isCorePower && hasMajorIssue && highValue) return 'P0';
  if (recommendation === 'MERGE/REVIEW' && isCorePower) return 'P0';

  // P1: important active core products to optimise soon (OPTIMISE on core, or
  // REWRITE on a lower-value core product).
  if (isCorePower && recommendation === 'OPTIMISE') return 'P1';
  if (isCorePower && recommendation === 'REWRITE') return 'P1';
  if (recommendation === 'DATA FIX' && isCorePower) return 'P1';

  // P2: valid lower-priority minor work (non-core OPTIMISE).
  if (recommendation === 'OPTIMISE') return 'P2';

  // P3: anything remaining (low-value / uncertain / review).
  return 'P3';
}

// ─── Build audit rows ────────────────────────────────────────────────────────
const auditRows = [];
const duplicateReviewRows = [];
const dataIssueRows = [];
const taxonomyReviewRows = [];
const seoOpportunities = [];

let sn = 0;
// Sort: canonical first (by preferred category then name), then excluded.
const sorted = [...inventory].sort((a, b) => {
  const aCanon = a.approved ? 0 : 1;
  const bCanon = b.approved ? 0 : 1;
  if (aCanon !== bCanon) return aCanon - bCanon;
  if (a.preferred !== b.preferred) return a.preferred.localeCompare(b.preferred);
  return a.p.name.localeCompare(b.p.name);
});

for (const item of sorted) {
  const { p, cats, preferred, approved, canonical } = item;
  sn += 1;
  const recommendation = classify(item);
  const prio = priority(item, recommendation);
  const sd = stripHtml(p.short_description);
  const fd = stripHtml(p.description);
  const descGrade = gradeDescription(p);
  const specIssues = detectSpecIssues(p, preferred);
  const catAcc = categoryAccuracy(p, preferred);
  const rels = duplicateRelationships(item);
  const dupRisk = rels.length > 0 ? rels.map((r) => `${r.type}: ${r.with.p.name}`).join(' | ') : (shortDescGroups[sd]?.length > 1 ? 'Duplicate short description' : 'None');
  const duplicateProductRisk = rels.length > 0 ? rels[0].type : 'TRUE DISTINCT PRODUCT';
  const currentTitle = `${p.name} | PRAG`;
  const currentMeta = (sd.slice(0, 155) || fd.slice(0, 155) || `${p.name} — specs, pricing and availability from PRAG Nigeria.`);
  const recTitle = recommendation === 'EXCLUDED' ? '' : recommendTitle(p, preferred).replace(/\s+/g, ' ').trim();
  const recMeta = recommendation === 'EXCLUDED' ? '' : recommendMetaDescription(p, preferred).replace(/\s+/g, ' ').trim();
  const pk = recommendation === 'EXCLUDED' ? '' : primaryKeyword(p, preferred).replace(/\s+/g, ' ').trim();
  const sk = recommendation === 'EXCLUDED' ? [] : secondaryKeywords(p, preferred).map((s) => s.replace(/\s+/g, ' ').trim());
  const hasPrice = String(p.price ?? '').trim() !== '' && Number(String(p.price).replace(/,/g, '')) > 0;
  const imgCount = p.images?.length ?? 0;
  const imgRec = imgCount === 0 ? 'IMAGE REPLACE' : 'ALT FIX' + (imgCount < 2 ? ' + ADD GALLERY' : '');
  const altRec = imgCount > 0 ? `PRAG ${p.name.toLowerCase()}` : '';
  const recLinks = INTERNAL_LINKS[preferred] ? INTERNAL_LINKS[preferred].join(', ') : '';
  const schemaStatus = approved ? (hasPrice ? 'Product + Offer (complete)' : 'Product only (no price → no Offer)') : 'noindex (excluded)';
  const offerStatus = hasPrice ? 'Offer present (price + availability)' : 'MISSING — no valid price';
  const conversionIssue = !hasPrice ? 'No price → "Call for Price"; Buy Now disabled' : (p.stock_status === 'outofstock' ? 'Out of stock → Buy Now disabled' : 'None');
  const wcCats = cats.map((c) => c.slug).join(', ');
  const status = approved ? (p.stock_status === 'instock' ? 'publish/in-stock' : 'publish/out-of-stock') : 'publish (non-SEO)';

  auditRows.push({
    sn, priority: prio, recommendation,
    wcId: p.id, sku: p.sku || '', name: p.name, slug: p.slug,
    preferredCategory: preferred === 'products' ? '(none — excluded)' : preferred,
    canonicalUrl: canonical, productStatus: status,
    currentPrice: hasPrice ? `₦${Number(p.price).toLocaleString('en-NG')}` : 'MISSING',
    stockStatus: p.stock_status || '',
    primaryIntent: pk, primaryKeyword: pk, secondaryKeywords: sk.join(', '),
    currentSeoTitle: currentTitle, recommendedSeoTitle: recTitle,
    currentMetaDescription: currentMeta, recommendedMetaDescription: recMeta,
    currentH1: p.name, h1Status: 'OK (single H1 = product name)',
    descriptionQuality: descGrade, duplicateContentRisk: dupRisk, duplicateProductRisk,
    keySpecs: JSON.stringify(parseSpecs(p.name)),
    specificationIssues: specIssues.join(' | '),
    categoryAccuracy: catAcc.accurate ? 'OK' : 'REVIEW',
    taxonomyIssue: catAcc.issue,
    currentInternalLinks: 'Breadcrumb only (no in-body related links)',
    recommendedInternalLinks: recLinks,
    productSchemaStatus: schemaStatus, offerSchemaStatus: offerStatus,
    schemaDataIssue: !hasPrice ? 'No price → Offer schema omitted' : (!p.sku ? 'No SKU' : ''),
    mainImage: imgCount > 0 ? p.images[0].src.slice(0, 80) : 'MISSING',
    imageRecommendation: imgRec, altTextRecommendation: altRec,
    conversionIssue,
    myRecommendation: recommendation === 'EXCLUDED' ? 'Exclude from SEO catalogue (non-core category)' :
      recommendation === 'DATA FIX' ? 'Fix WooCommerce category/data before SEO work' :
      recommendation === 'MERGE/REVIEW' ? 'Review duplicate vs counterpart; do not merge yet' :
      recommendation === 'REWRITE' ? 'Rewrite thin/duplicated product copy with product-specific specs' :
      recommendation === 'OPTIMISE' ? 'Apply recommended SEO title, meta, alt text, internal links' :
      'Minor/no changes needed',
    pragRecommendation: '', approvalStatus: '',
  });

  // Duplicate review rows
  for (const r of rels) {
    duplicateReviewRows.push({
      'Product A': p.name, 'Product B': r.with.p.name,
      'Similarity Reason': r.reason,
      'SKU A': p.sku || '', 'SKU B': r.with.p.sku || '',
      'Specification A': JSON.stringify(parseSpecs(p.name)), 'Specification B': JSON.stringify(parseSpecs(r.with.p.name)),
      'Recommended Action': r.type === 'DUPLICATE' ? 'Confirm whether one should be retired/redirected (do not merge in Step 10)' : 'Confirm both are genuine distinct variants; differentiate copy',
      'Manual Review Required': 'YES',
    });
  }
  // Data issue rows
  for (const iss of specIssues) {
    dataIssueRows.push({
      'Product': p.name, 'WC ID': p.id,
      'Issue Type': /DATA FIX REQUIRED/.test(iss) ? 'Missing category' : /INACCURATE/.test(iss) ? 'Inaccurate copy' : 'Specification conflict',
      'Conflicting Values': iss,
      'Source Locations': 'name / short_description / description / categories',
      'Required PRAG Confirmation': /PRAG VERIFICATION REQUIRED/.test(iss) ? 'YES' : 'NO',
    });
  }
  // Taxonomy issue (accessory in solar-charge-controllers etc.) → also record as data issue
  if (!catAcc.accurate && approved && catAcc.issue) {
    dataIssueRows.push({
      'Product': p.name, 'WC ID': p.id,
      'Issue Type': 'Taxonomy / category assignment',
      'Conflicting Values': catAcc.issue,
      'Source Locations': 'categories / product name',
      'Required PRAG Confirmation': 'YES',
    });
  }
  if (!catAcc.accurate && approved) {
    taxonomyReviewRows.push({
      'Product': p.name, 'Current WC Categories': wcCats,
      'Current Preferred SEO Category': preferred,
      'Recommended Category': catAcc.issue || 'Review',
      'Reason': catAcc.issue,
      'Do Not Implement Yet': 'YES',
    });
  }
  if (!approved && /stabilizer|inverter|battery|panel|charge controller/i.test(p.name)) {
    taxonomyReviewRows.push({
      'Product': p.name, 'Current WC Categories': wcCats,
      'Current Preferred SEO Category': '(none)',
      'Recommended Category': 'Assign correct approved category',
      'Reason': 'Real power product with no approved category (excluded from SEO catalogue)',
      'Do Not Implement Yet': 'YES',
    });
  }
}

// ─── SEO Opportunities (clusters) ────────────────────────────────────────────
function cluster(label, filter) {
  const items = canonical.filter((i) => filter(i.p.name));
  return { label, products: items.map((i) => `${i.p.name} (₦${i.p.price || 'n/a'})`) };
}
seoOpportunities.push(
  { opportunity: 'Servo stabilizer capacity cluster', detail: cluster('Servo', (n) => /servo/i.test(n)).products.join('; ') },
  { opportunity: 'Relay stabilizer capacity cluster', detail: cluster('Relay', (n) => /relay/i.test(n)).products.join('; ') },
  { opportunity: 'Thyristor stabilizer capacity cluster', detail: cluster('Thyristor', (n) => /thyristor/i.test(n)).products.join('; ') },
  { opportunity: 'Hybrid inverter capacity cluster', detail: cluster('Hybrid', (n) => /hybrid/i.test(n)).products.join('; ') },
  { opportunity: 'Heavy-duty inverter capacity cluster', detail: cluster('Heavy-duty', (n) => /heavy.?duty/i.test(n)).products.join('; ') },
  { opportunity: 'Lithium battery cluster', detail: cluster('Lithium', (n) => /lithium/i.test(n)).products.join('; ') },
  { opportunity: 'Solar panel wattage cluster', detail: cluster('Panel', (n) => /panel/i.test(n)).products.join('; ') },
  { opportunity: 'FUTURE: capacity landing pages (e.g. /10kva-stabilizer)', detail: 'Do NOT create in Step 10. Report only. Multiple 10/20/30/50/100/200kVA stabilizers and 3/5/6kW inverters could eventually support capacity-specific landing pages.' },
  { opportunity: 'FUTURE: product comparison content', detail: 'Relay vs Servo vs Thyristor stabilizer comparison; Hybrid vs Heavy-duty inverter comparison; Lithium vs lead-acid battery comparison.' },
  { opportunity: 'FUTURE: category buying guides', detail: 'How to choose a voltage stabilizer by kVA; how to size a hybrid inverter; solar panel wattage guide for Nigeria.' },
  { opportunity: 'FUTURE: category FAQs', detail: 'Already added on category pages in Step 9; expand with product-specific questions.' },
);

// ─── Summary ─────────────────────────────────────────────────────────────────
const summary = {
  totalWooCommerceProducts: products.length,
  totalCanonicalIndexable: canonical.length,
  excludedNonSeo: excluded.length,
  duplicateRouteVariantsRemoved: 0, // products are unique by slug; alternate category routes collapse via preferredProductCategory
  GOOD: auditRows.filter((r) => r.recommendation === 'GOOD').length,
  OPTIMISE: auditRows.filter((r) => r.recommendation === 'OPTIMISE').length,
  REWRITE: auditRows.filter((r) => r.recommendation === 'REWRITE').length,
  DATA_FIX: auditRows.filter((r) => r.recommendation === 'DATA FIX').length,
  MERGE_REVIEW: auditRows.filter((r) => r.recommendation === 'MERGE/REVIEW').length,
  EXCLUDED: auditRows.filter((r) => r.recommendation === 'EXCLUDED').length,
  P0: auditRows.filter((r) => r.priority === 'P0').length,
  P1: auditRows.filter((r) => r.priority === 'P1').length,
  P2: auditRows.filter((r) => r.priority === 'P2').length,
  P3: auditRows.filter((r) => r.priority === 'P3').length,
  missingMetaDescriptions: auditRows.filter((r) => !r.currentMetaDescription).length,
  thinDescriptions: auditRows.filter((r) => r.descriptionQuality === 'THIN').length,
  duplicateDescriptions: auditRows.filter((r) => r.descriptionQuality === 'DUPLICATE').length,
  suspectedDuplicateProducts: auditRows.filter((r) => r.duplicateProductRisk !== 'TRUE DISTINCT PRODUCT' && r.recommendation !== 'EXCLUDED').length,
  taxonomyIssues: taxonomyReviewRows.length,
  specificationConflicts: dataIssueRows.filter((r) => r['Issue Type'] === 'Specification conflict').length,
  missingSku: auditRows.filter((r) => !r.sku).length,
  missingPrice: auditRows.filter((r) => r.currentPrice === 'MISSING').length,
  missingImage: auditRows.filter((r) => r.mainImage === 'MISSING').length,
  schemaDataIssues: auditRows.filter((r) => r.schemaDataIssue).length,
};

// ─── Write workbook ──────────────────────────────────────────────────────────
const wb = new ExcelJS.Workbook();
wb.creator = 'PRAG Step 10 Audit';
wb.created = new Date();

function addSheet(name, columns, rows) {
  const ws = wb.addWorksheet(name);
  // Use the exact header string as the key; row objects must use the same strings.
  ws.columns = columns.map((c) => ({ header: c, key: c, width: 28 }));
  for (const r of rows) ws.addRow(r);
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0166A5' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { mode: 'autofilter', from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
}

const mainCols = [
  'S/N','Priority','Recommendation','WC Product ID','SKU','Product Name','Current Slug',
  'Preferred Category','Canonical URL','Product Status','Current Price','Stock Status',
  'Primary Search Intent','Suggested Primary Keyword','Suggested Secondary Keywords',
  'Current SEO Title','Recommended SEO Title',
  'Current Meta Description','Recommended Meta Description',
  'Current H1','H1 Status',
  'Description Quality','Duplicate Content Risk','Duplicate Product Risk',
  'Key Specifications','Specification Issues',
  'Category Accuracy','Taxonomy Issue',
  'Current Internal Links','Recommended Internal Links',
  'Product Schema Status','Offer Schema Status','Schema/Data Issue',
  'Main Image','Image Recommendation','Alt Text Recommendation',
  'Conversion Issue',
  'My Recommendation','PRAG Recommendation','Approval Status',
];
const mainRows = auditRows.map((r) => ({
  'S/N': r.sn, 'Priority': r.priority, 'Recommendation': r.recommendation, 'WC Product ID': r.wcId,
  'SKU': r.sku, 'Product Name': r.name, 'Current Slug': r.slug,
  'Preferred Category': r.preferredCategory, 'Canonical URL': r.canonicalUrl,
  'Product Status': r.productStatus, 'Current Price': r.currentPrice, 'Stock Status': r.stockStatus,
  'Primary Search Intent': r.primaryIntent, 'Suggested Primary Keyword': r.primaryKeyword,
  'Suggested Secondary Keywords': r.secondaryKeywords,
  'Current SEO Title': r.currentSeoTitle, 'Recommended SEO Title': r.recommendedSeoTitle,
  'Current Meta Description': r.currentMetaDescription, 'Recommended Meta Description': r.recommendedMetaDescription,
  'Current H1': r.currentH1, 'H1 Status': r.h1Status,
  'Description Quality': r.descriptionQuality, 'Duplicate Content Risk': r.duplicateContentRisk,
  'Duplicate Product Risk': r.duplicateProductRisk,
  'Key Specifications': r.keySpecs, 'Specification Issues': r.specificationIssues,
  'Category Accuracy': r.categoryAccuracy, 'Taxonomy Issue': r.taxonomyIssue,
  'Current Internal Links': r.currentInternalLinks, 'Recommended Internal Links': r.recommendedInternalLinks,
  'Product Schema Status': r.productSchemaStatus, 'Offer Schema Status': r.offerSchemaStatus,
  'Schema/Data Issue': r.schemaDataIssue,
  'Main Image': r.mainImage, 'Image Recommendation': r.imageRecommendation,
  'Alt Text Recommendation': r.altTextRecommendation,
  'Conversion Issue': r.conversionIssue,
  'My Recommendation': r.myRecommendation, 'PRAG Recommendation': r.pragRecommendation,
  'Approval Status': r.approvalStatus,
}));
addSheet('Master Audit', mainCols, mainRows);

const summaryCols = ['Metric','Value'];
const summaryRows = [
  ['Total WooCommerce products', summary.totalWooCommerceProducts],
  ['Total canonical/indexable PRAG products', summary.totalCanonicalIndexable],
  ['Excluded/non-SEO products', summary.excludedNonSeo],
  ['Duplicate route variants removed', summary.duplicateRouteVariantsRemoved],
  ['GOOD', summary.GOOD],
  ['OPTIMISE', summary.OPTIMISE],
  ['REWRITE', summary.REWRITE],
  ['DATA FIX', summary.DATA_FIX],
  ['MERGE/REVIEW', summary.MERGE_REVIEW],
  ['EXCLUDED (non-SEO)', summary.EXCLUDED],
  ['P0', summary.P0],
  ['P1', summary.P1],
  ['P2', summary.P2],
  ['P3', summary.P3],
  ['Missing meta descriptions', summary.missingMetaDescriptions],
  ['Thin descriptions', summary.thinDescriptions],
  ['Duplicate descriptions', summary.duplicateDescriptions],
  ['Suspected duplicate products', summary.suspectedDuplicateProducts],
  ['Taxonomy issues', summary.taxonomyIssues],
  ['Specification conflicts', summary.specificationConflicts],
  ['Missing SKU', summary.missingSku],
  ['Missing price', summary.missingPrice],
  ['Missing image', summary.missingImage],
  ['Schema/data issues', summary.schemaDataIssues],
  ['Search Console data', 'Not available for Step 10 prioritisation'],
];
addSheet('Summary', summaryCols, summaryRows.map((r) => ({ 'Metric': r[0], 'Value': r[1] })));

addSheet('Duplicate Review',
  ['Product A','Product B','Similarity Reason','SKU A','SKU B','Specification A','Specification B','Recommended Action','Manual Review Required'],
  duplicateReviewRows);

addSheet('Data Issues',
  ['Product','WC ID','Issue Type','Conflicting Values','Source Locations','Required PRAG Confirmation'],
  dataIssueRows);

addSheet('Taxonomy Review',
  ['Product','Current WC Categories','Current Preferred SEO Category','Recommended Category','Reason','Do Not Implement Yet'],
  taxonomyReviewRows);

addSheet('SEO Opportunities',
  ['Opportunity','Detail'],
  seoOpportunities.map((o) => ({ 'Opportunity': o.opportunity, 'Detail': o.detail })));

const outXlsx = path.join(ROOT, 'PRAG_Product_SEO_Master_Audit.xlsx');
await wb.xlsx.writeFile(outXlsx);

const outJson = path.join(__dirname, 'out', 'step10-analysis.json');
fs.writeFileSync(outJson, JSON.stringify({ summary, auditRows, duplicateReviewRows, dataIssueRows, taxonomyReviewRows, seoOpportunities }, null, 2));

console.log('Workbook written:', outXlsx);
console.log('Analysis JSON:', outJson);
console.log('\nSummary:');
console.log(JSON.stringify(summary, null, 2));

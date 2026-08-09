#!/usr/bin/env node
/** Step 12 — Schema validation only (re-runnable). */
import { readFileSync, writeFileSync } from 'fs';
const WWW = 'https://www.prag.global';
const UA = 'PRAG-SEO-Step12-Audit/1.0';
const OUT = '/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out';

async function fetchText(url) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 25000);
    try {
      const r = await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': UA } });
      if (r.status !== 200) return '';
      return await r.text();
    } finally { clearTimeout(to); }
  } catch { return ''; }
}

function extractSchema(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  for (const m of blocks) {
    try { nodes.push(JSON.parse(m[1].trim())); } catch { nodes.push({ __invalid: true }); }
  }
  return nodes;
}

function listTypes(nodes) {
  const types = [];
  const walk = (n) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (typeof n !== 'object') return;
    if (n['@type']) {
      const t = n['@type'];
      if (Array.isArray(t)) t.forEach((x) => types.push(x));
      else types.push(t);
    }
    if (n['@graph'] && Array.isArray(n['@graph'])) n['@graph'].forEach(walk);
  };
  nodes.forEach(walk);
  return types;
}

async function validateSchemaFor(url, expectations) {
  const html = await fetchText(url);
  if (!html) return { url, expectations, foundTypes: [], valid: false, issues: ['no-html'], schemaUrls: [] };
  const nodes = extractSchema(html);
  const types = listTypes(nodes);
  const result = { url, expectations, foundTypes: types, valid: true, issues: [] };
  if (nodes.some((n) => n && n.__invalid)) { result.valid = false; result.issues.push('invalid-json'); }
  for (const exp of expectations) {
    if (!types.includes(exp)) result.issues.push(`missing-type: ${exp}`);
  }
  // collect schema urls/ids
  const urls = [];
  const findUrls = (n) => {
    if (!n) return;
    if (Array.isArray(n)) return n.forEach(findUrls);
    if (typeof n !== 'object') return;
    for (const k of ['url', 'mainEntityOfPage', '@id']) {
      if (typeof n[k] === 'string') urls.push({ key: k, value: n[k] });
      else if (n[k] && typeof n[k] === 'object' && typeof n[k]['@id'] === 'string') urls.push({ key: k, value: n[k]['@id'] });
    }
    if (n['@graph'] && Array.isArray(n['@graph'])) n['@graph'].forEach(findUrls);
  };
  nodes.forEach(findUrls);
  result.schemaUrls = urls;
  // check for ratings/reviews (must not be present)
  const hasRating = types.includes('AggregateRating') || nodes.some((n) => JSON.stringify(n).includes('AggregateRating'));
  if (hasRating) result.issues.push('ratings-reviews-present (forbidden)');
  return result;
}

async function main() {
  const checks = [
    { url: `${WWW}/`, expectations: ['WebSite', 'Organization'], label: 'Homepage' },
    { url: `${WWW}/products/inverters`, expectations: ['BreadcrumbList'], label: 'Category: inverters' },
    { url: `${WWW}/products/voltage-stabilizers`, expectations: ['BreadcrumbList'], label: 'Category: voltage-stabilizers' },
    { url: `${WWW}/products/batteries`, expectations: ['BreadcrumbList'], label: 'Category: batteries' },
    { url: `${WWW}/products/solar`, expectations: ['BreadcrumbList'], label: 'Category: solar' },
    { url: `${WWW}/products/hybrid-inverters`, expectations: ['BreadcrumbList'], label: 'Category: hybrid-inverters' },
    { url: `${WWW}/products/lithium-batteries`, expectations: ['BreadcrumbList'], label: 'Category: lithium-batteries' },
    { url: `${WWW}/products/servo-voltage-stabilizers`, expectations: ['BreadcrumbList'], label: 'Category: servo-voltage-stabilizers' },
    { url: `${WWW}/products/thyristor-stabilizers`, expectations: ['BreadcrumbList'], label: 'Category: thyristor-stabilizers' },
    { url: `${WWW}/solutions/backup-power`, expectations: ['BreadcrumbList'], label: 'Solution: backup-power' },
    { url: `${WWW}/solutions/solar-energy`, expectations: ['BreadcrumbList'], label: 'Solution: solar-energy' },
    { url: `${WWW}/solutions/voltage-stabilization-protection`, expectations: ['BreadcrumbList'], label: 'Solution: voltage-stabilization-protection' },
    { url: `${WWW}/knowledge-center`, expectations: ['BreadcrumbList'], label: 'KC root' },
    { url: `${WWW}/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt`, expectations: ['Product', 'BreadcrumbList'], label: 'Product: hybrid inverter' },
    { url: `${WWW}/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-100-250v`, expectations: ['Product', 'BreadcrumbList'], label: 'Product: servo stabilizer' },
    { url: `${WWW}/products/lithium-batteries/5kwh-24v-lithium-battery`, expectations: ['Product', 'BreadcrumbList'], label: 'Product: lithium battery' },
    { url: `${WWW}/products/solar-panels/540w-mono-panel`, expectations: ['Product', 'BreadcrumbList'], label: 'Product: solar panel' },
    { url: `${WWW}/knowledge-center/servo-stabilizers`, expectations: ['Article', 'BreadcrumbList'], label: 'KC: servo stabilizers' },
    { url: `${WWW}/knowledge-center/lifepo4-battery-in-nigeria`, expectations: ['Article', 'BreadcrumbList'], label: 'KC: lifepo4 battery' },
    { url: `${WWW}/knowledge-center/solar-installation-lagos-cost`, expectations: ['Article', 'BreadcrumbList'], label: 'KC: solar installation lagos' },
  ];

  const results = [];
  for (const c of checks) {
    const r = await validateSchemaFor(c.url, c.expectations);
    r.label = c.label;
    results.push(r);
    const types = (r && r.foundTypes) ? r.foundTypes : [];
    const issues = (r && r.issues) ? r.issues : ['no-response'];
    console.log(`  [${c.label}] ${c.url}`);
    console.log(`    types=[${types.join(',')}]  issues=[${issues.join(';')}]  valid=${r.valid}`);
  }
  writeFileSync(`${OUT}/step12-schema-validation.json`, JSON.stringify(results, null, 2));
  const pass = results.every((r) => r.valid && r.issues.length === 0);
  console.log(`\nSCHEMA VALIDATION: ${pass ? 'PASS' : 'ISSUES'} (${results.filter(r=>r.valid && r.issues.length===0).length}/${results.length} clean)`);
}
main().catch((e) => { console.error(e); process.exit(1); });

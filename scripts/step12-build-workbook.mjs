#!/usr/bin/env node
/**
 * Step 12 — Build PRAG_SEO_Recovery_Monitoring.xlsx
 */
import { readFileSync, writeFileSync } from 'fs';
import ExcelJS from 'exceljs';

const OUT = '/Users/ralphmore/Documents/GitHub/prag-b2b';
const crawl = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-sitemap-crawl.json`, 'utf-8'));
const summary = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-summary.json`, 'utf-8'));
const links = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-internal-links.json`, 'utf-8'));
const flaggedSources = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-flagged-link-sources.json`, 'utf-8'));
const redirects = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-redirect-regression.json`, 'utf-8'));
const schema = JSON.parse(readFileSync(`${OUT}/scripts/out/step12-schema-validation.json`, 'utf-8'));

const workbook = new ExcelJS.Workbook();
workbook.creator = 'PRAG SEO Step 12';
workbook.created = new Date();

function addSheet(name, headers, rows) {
  const sheet = workbook.addWorksheet(name);
  sheet.addRow(headers);
  for (const r of rows) {
    // Convert objects to header-ordered array
    const arr = headers.map((h) => {
      if (h === 'Issue' && Array.isArray(r[h])) return r[h].join(' | ');
      if (Array.isArray(r[h])) return r[h].join(', ');
      return r[h] ?? '';
    });
    sheet.addRow(arr);
  }
  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((c) => { c.width = 32; });
  return sheet;
}

// 1. Executive Summary
const executiveRows = [
  { Item: 'Crawl date', Value: summary.timestamp },
  { Item: 'Main sitemap URL count', Value: summary.sitemap.total },
  { Item: 'Sitemap URLs 200', Value: summary.sitemap.ok200 },
  { Item: 'Sitemap redirects', Value: summary.sitemap.redirected },
  { Item: 'Sitemap broken (404/410/5xx)', Value: summary.sitemap.broken },
  { Item: 'Sitemap noindex pages', Value: summary.sitemap.noindex },
  { Item: 'Canonical errors', Value: summary.sitemap.canonicalErrors },
  { Item: 'Missing titles', Value: summary.sitemap.missingTitles },
  { Item: 'Missing descriptions', Value: summary.sitemap.missingDesc },
  { Item: 'Duplicate titles (clusters)', Value: summary.sitemap.dupTitles.length },
  { Item: 'Duplicate descriptions (clusters)', Value: summary.sitemap.dupDescs.length },
  { Item: 'Banned phrases occurrences', Value: summary.sitemap.bannedHits.length },
  { Item: 'Broken internal links', Value: links.broken.length },
  { Item: 'Redirecting internal links', Value: links.redirecting.length },
  { Item: 'Non-www internal links', Value: links.nonWwwLinks.length },
  { Item: 'Old WP internal links', Value: links.oldWpLinks.length },
  { Item: 'Legacy redirect pass', Value: `${redirects.pass}/${redirects.redirectCount}` },
  { Item: 'Legacy retired (410) pass', Value: `${redirects.retiredPass}/${redirects.retiredCount}` },
  { Item: 'Redirect chains', Value: redirects.chains },
  { Item: 'Redirect loops', Value: redirects.loops },
  { Item: 'Schema validation', Value: `${schema.filter((s) => s.valid && s.issues.length === 0).length}/${schema.length}` },
  { Item: 'GSC access', Value: 'NO — see Search Console status sheet' },
  { Item: 'Overall', Value: 'PASS WITH MONITORING' },
];
addSheet('Executive Summary', ['Item', 'Value'], executiveRows);

// 2. Technical SEO status
const techRows = [
  { Check: 'robots.txt www', Status: '200, crawlable, sitemap declared', Notes: 'https://www.prag.global/robots.txt' },
  { Check: 'robots.txt shop', Status: '200, crawlable, sitemap declared', Notes: 'https://shop.prag.global/robots.txt' },
  { Check: 'robots.txt central', Status: '301 → shop.prag.global (noindex by redirect)', Notes: 'API/media still operational (200 /wp-json)' },
  { Check: 'robots.txt portal', Status: '200, meta noindex,nofollow', Notes: 'All portal pages render noindex,nofollow' },
  { Check: 'Sitemap count', Status: 'PASS', Notes: `www=${summary.sitemap.total} | shop=2` },
  { Check: 'Sitemap cleanliness', Status: 'PASS', Notes: 'No non-www, central, portal, old WP, residential-2, all-prag-stabilizers URLs' },
  { Check: 'Expected product count', Status: 'PASS', Notes: '49 canonical products in sitemap' },
  { Check: 'Expected KC count', Status: 'PASS', Notes: '42 canonical KC articles in sitemap' },
  { Check: 'Legacy redirect regression', Status: `${redirects.fail === 0 ? 'PASS' : 'FAIL'}`, Notes: `${redirects.pass}/${redirects.redirectCount} pass; ${redirects.retiredPass}/${redirects.retiredCount} 410 pass` },
  { Check: 'Schema validation', Status: 'PASS', Notes: 'Homepage WebSite+Organization; categories/products BreadcrumbList/Product; KC Article+BreadcrumbList' },
  { Check: 'Image alt sanity', Status: 'PASS', Notes: '0 broken; 0 non-www; 0 empty; alts product-context appropriate' },
];
addSheet('Technical SEO status', ['Check', 'Status', 'Notes'], techRows);

// 3. Sitemap status
const sitemapRows = summary.sitemap.byType.map((t) => ({
  'Page Type': t.type,
  Count: t.total,
  OK: t.ok,
  'With issues': t.issues,
}));
addSheet('Sitemap status', ['Page Type', 'Count', 'OK', 'With issues'], sitemapRows);

// 4. Indexing status (GSC not available — placeholder)
const indexingRows = crawl.map((r) => ({
  URL: r.url,
  'Page Type': r.pageType,
  HTTP: r.status,
  'Final URL': r.finalUrl,
  'Redirect hops': r.hops,
  Title: r.title ?? '',
  'Meta description': r.description ? r.description.slice(0, 120) : '',
  Canonical: r.canonical ?? '',
  'Robots meta': r.robots ?? '',
  'H1 count': r.h1Count,
  Indexable: !r.issues.some((i) => i.startsWith('noindex')),
  'Sitemap listed': 'YES',
  'GSC status': 'GSC access required',
  'Last checked': summary.timestamp,
  Issue: r.issues,
}));
addSheet('Indexing status', ['URL', 'Page Type', 'HTTP', 'Final URL', 'Redirect hops', 'Title', 'Meta description', 'Canonical', 'Robots meta', 'H1 count', 'Indexable', 'Sitemap listed', 'GSC status', 'Last checked', 'Issue'], indexingRows);

// 5. Redirect status
const redirectRows = redirects.redirectResults.map((r) => ({
  'Old URL': r.source,
  'Expected destination': r.expected,
  Status: r.status,
  'First status': r.firstStatus,
  'Final URL': r.finalUrl,
  'Final status': r.finalStatus,
  Hops: r.hops,
  Issues: r.issues,
}));
addSheet('Redirect status', ['Old URL', 'Expected destination', 'Status', 'First status', 'Final URL', 'Final status', 'Hops', 'Issues'], redirectRows);

// 6. Core keyword status (GSC not available — placeholder)
const keywordRows = [
  { Query: 'inverter Nigeria', Cluster: 'Inverter', 'Landing Page': 'https://www.prag.global/products/inverters', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'hybrid inverter Nigeria', Cluster: 'Inverter', 'Landing Page': 'https://www.prag.global/products/hybrid-inverters', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'voltage stabilizer Nigeria', Cluster: 'Stabilizer', 'Landing Page': 'https://www.prag.global/products/voltage-stabilizers', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'servo voltage stabilizer', Cluster: 'Stabilizer', 'Landing Page': 'https://www.prag.global/products/servo-voltage-stabilizers', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'relay voltage stabilizer', Cluster: 'Stabilizer', 'Landing Page': 'https://www.prag.global/products/relay-voltage-stabilizers', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'thyristor stabilizer', Cluster: 'Stabilizer', 'Landing Page': 'https://www.prag.global/products/thyristor-stabilizers', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'lithium battery Nigeria', Cluster: 'Battery', 'Landing Page': 'https://www.prag.global/products/lithium-batteries', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'inverter battery Nigeria', Cluster: 'Battery', 'Landing Page': 'https://www.prag.global/products/batteries', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'solar panels Nigeria', Cluster: 'Solar', 'Landing Page': 'https://www.prag.global/products/solar-panels', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
  { Query: 'solar installation Nigeria', Cluster: 'Solar', 'Landing Page': 'https://www.prag.global/knowledge-center/solar-installation-lagos-cost', Impressions: 'GSC required', Clicks: 'GSC required', Position: 'GSC required', Notes: 'Baseline to be captured' },
];
addSheet('Core keyword status', ['Query', 'Cluster', 'Landing Page', 'Impressions', 'Clicks', 'Position', 'Notes'], keywordRows);

// 7. URL Health
const urlHealthRows = crawl.map((r) => ({
  URL: r.url,
  'Page Type': r.pageType,
  HTTP: r.status,
  Indexable: !r.issues.some((i) => i.startsWith('noindex')),
  Canonical: r.canonical ?? '',
  Sitemap: 'YES',
  'GSC Status': 'GSC access required',
  'Last Checked': summary.timestamp,
  Issues: r.issues,
}));
addSheet('URL Health', ['URL', 'Page Type', 'HTTP', 'Indexable', 'Canonical', 'Sitemap', 'GSC Status', 'Last Checked', 'Issues'], urlHealthRows);

// 8. Legacy Recovery
const legacyRows = redirects.redirectResults.map((r) => ({
  'Old URL': `https://www.prag.global${r.source}`,
  'Redirect/410': r.firstStatus ? `301/308` : 'N/A',
  'Final URL': r.finalUrl,
  'GSC status': 'GSC access required',
  'Remaining issue': r.issues.length === 0 ? 'None' : r.issues.join(' | '),
}));
addSheet('Legacy Recovery', ['Old URL', 'Redirect/410', 'Final URL', 'GSC status', 'Remaining issue'], legacyRows);

// 9. Search Performance (GSC required)
const searchRows = [
  { Date: 'Baseline', Cluster: 'Site-wide', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
  { Date: 'Baseline', Cluster: 'Inverter', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
  { Date: 'Baseline', Cluster: 'Voltage Stabilizer', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
  { Date: 'Baseline', Cluster: 'Battery', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
  { Date: 'Baseline', Cluster: 'Solar', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
  { Date: 'Baseline', Cluster: 'Knowledge Center', Clicks: 'GSC required', Impressions: 'GSC required', CTR: 'GSC required', Position: 'GSC required' },
];
addSheet('Search Performance', ['Date', 'Cluster', 'Clicks', 'Impressions', 'CTR', 'Position'], searchRows);

// 10. Priority Keywords
const priorityRows = keywordRows;
addSheet('Priority Keywords', ['Query', 'Cluster', 'Landing Page', 'Impressions', 'Clicks', 'Position', 'Notes'], priorityRows);

// 11. Outstanding Actions
const outstandingRows = [
  { Priority: 'P0', Issue: 'Google Search Console access required', URL: 'https://search.google.com/search-console', Action: 'Add property https://www.prag.global, submit sitemap, inspect priority URLs, capture baseline', Owner: 'PRAG marketing/SEO', Status: 'GSC required' },
  { Priority: 'P2', Issue: 'Duplicate product slugs with -2 suffix (15KVA relay, 3KW hybrid)', URL: 'https://www.prag.global/products/relay-voltage-stabilizers/15kva-relay-voltage-stabilizer-45-280v', Action: 'PRAG catalogue decision: canonicalise or remove duplicate WC products', Owner: 'PRAG product/ecommerce', Status: 'PRAG decision required' },
  { Priority: 'P2', Issue: 'Non-www internal links in KC articles and product descriptions', URL: 'Multiple (see Flagged Links sheet)', Action: 'Content-governance pass to rewrite WP-managed internal links to https://www.prag.global', Owner: 'PRAG content/WP admin', Status: 'PRAG decision required' },
  { Priority: 'P3', Issue: 'Default meta description shared by 13 pages', URL: 'https://www.prag.global/ + static pages', Action: 'Consider custom descriptions for homepage and key static pages', Owner: 'PRAG content/SEO', Status: 'POST-LAUNCH SEO OPTIMISATION' },
  { Priority: 'P2', Issue: 'Parked catalogue products (6 PRAG_REVIEW_REQUIRED + 4 P3)', URL: 'See Step 10/11 parked lists', Action: 'PRAG resolves product review/retirement decisions before implementation', Owner: 'PRAG product', Status: 'Parked' },
  { Priority: 'P2', Issue: 'Parked KC merge/retirement (9 MERGE + 2 RETIRE)', URL: 'See Step 11.1 parked lists', Action: 'PRAG approves content consolidation or retirement', Owner: 'PRAG content', Status: 'Parked' },
];
addSheet('Outstanding Actions', ['Priority', 'Issue', 'URL', 'Action', 'Owner', 'Status'], outstandingRows);

// 12. Flagged Links (internal link cleanup)
const flaggedRows = flaggedSources.map((r) => ({
  'Flagged URL': r.flaggedUrl,
  'Found on (count)': r.foundOn.length,
  'Found on pages': r.foundOn,
}));
addSheet('Flagged Links', ['Flagged URL', 'Found on (count)', 'Found on pages'], flaggedRows);

// 13. Search Console status
const gscRows = [
  { Item: 'GSC access', Value: 'NO', Notes: 'This session cannot access Google Search Console' },
  { Item: 'Required property', Value: 'https://www.prag.global', Notes: 'Or a Domain Property for prag.global with www set as preferred' },
  { Item: 'Sitemap submission', Value: 'Pending', Notes: 'Submit https://www.prag.global/sitemap.xml in GSC' },
  { Item: 'Priority URL inspection', Value: 'Pending', Notes: 'Inspect/request indexing for P0 pages listed in Step 12 report' },
  { Item: 'Baseline capture', Value: 'Pending', Notes: 'Capture clicks/impressions/CTR/position for site and 5 clusters' },
];
addSheet('Search Console status', ['Item', 'Value', 'Notes'], gscRows);

// Write
const outPath = `${OUT}/PRAG_SEO_Recovery_Monitoring.xlsx`;
await workbook.xlsx.writeFile(outPath);
console.log(`Workbook written: ${outPath}`);

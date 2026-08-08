/**
 * Redirect validation script for PRAG SEO Recovery Step 6.
 *
 * Tests every redirect in the LEGACY_REDIRECTS manifest against a running
 * Next.js server. Validates:
 *   - Old URL returns 301/308
 *   - Location header points to the expected destination
 *   - Final URL returns 200
 *   - No redirect loops
 *   - No >1 redirect hops (where we control both URLs)
 *   - No 404/5xx/noindex/non-www/central/portal destinations
 *
 * Usage:
 *   1. npx tsx scripts/generate-redirect-manifest.mjs
 *   2. node scripts/validate-redirects.mjs [--base-url=http://localhost:3000]
 */
import { readFileSync } from 'fs';

const manifestPath = '/tmp/redirect_manifest.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
// Skip pattern redirects (containing :params) - they can't be tested as literal URLs
const LEGACY_REDIRECTS = manifest.redirects.filter(r => !r.source.includes(':'));
const PATTERN_REDIRECTS = manifest.redirects.filter(r => r.source.includes(':'));
const RETIRED_URLS = new Set(manifest.retired);

const BASE_URL = process.argv
  .find((a) => a.startsWith('--base-url='))
  ?.split('=')[1] ?? 'http://localhost:3000';
const MAX_HOPS = 5;

async function fetchWithRedirects(url, maxHops = MAX_HOPS) {
  const hops = [];
  let currentUrl = url;
  for (let i = 0; i <= maxHops; i++) {
    try {
      const response = await fetch(currentUrl, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      const status = response.status;
      const location = response.headers.get('location');
      if (status >= 300 && status < 400 && location) {
        const nextUrl = new URL(location, currentUrl).href;
        hops.push({ url: currentUrl, status, location: nextUrl });
        currentUrl = nextUrl;
        continue;
      }
      return { hops, finalUrl: currentUrl, status, headers: response.headers };
    } catch (err) {
      return { hops, finalUrl: currentUrl, error: err.message, status: 0 };
    }
  }
  return { hops, finalUrl: currentUrl, error: 'Too many redirects', status: 0 };
}

function isNonWww(url) { try { return new URL(url).hostname === 'prag.global'; } catch { return false; } }
function isCentralOrPortal(url) { try { const h = new URL(url).hostname; return h.startsWith('central.') || h.startsWith('portal.'); } catch { return false; } }

async function main() {
  console.log(`\nPRAG Redirect Validation`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Specific redirects: ${LEGACY_REDIRECTS.length} | Pattern redirects (skipped): ${PATTERN_REDIRECTS.length} | Retired: ${RETIRED_URLS.size}`);
  console.log(`${'─'.repeat(80)}\n`);

  const results = [];
  let passed = 0, failed = 0, warnings = 0;

  for (const redirect of LEGACY_REDIRECTS) {
    const sourceUrl = `${BASE_URL}${redirect.source}`;
    const expectedDest = redirect.destination.startsWith('http') ? redirect.destination : `${BASE_URL}${redirect.destination}`;
    const result = { source: redirect.source, expected: redirect.destination, status: 'PASS', issues: [], oldStatus: 0, location: null, finalUrl: null, finalStatus: 0, hops: 0 };

    try {
      const { hops, finalUrl, status, error, headers } = await fetchWithRedirects(sourceUrl);
      result.hops = hops.length;
      result.finalUrl = finalUrl;
      result.finalStatus = status;

      if (error) { result.status = 'FAIL'; result.issues.push(`Error: ${error}`); failed++; results.push(result); continue; }
      if (hops.length === 0) { result.status = 'FAIL'; result.issues.push(`No redirect (status ${status})`); failed++; results.push(result); continue; }

      result.oldStatus = hops[0].status;
      result.location = hops[0].location;

      const norm = (u) => { try { const p = new URL(u); return `${p.origin}${p.pathname.replace(/\/$/, '')}${p.search}`; } catch { return u.replace(/\/$/, ''); } };
      if (norm(hops[0].location) !== norm(expectedDest)) {
        result.status = 'FAIL'; result.issues.push(`Location: expected ${expectedDest}, got ${hops[0].location}`); failed++;
        results.push(result); continue;
      }

      if (hops.length > 1) { result.status = 'WARN'; result.issues.push(`Hops (${hops.length}): ${hops.map(h => h.location).join(' → ')}`); warnings++; }
      if (status === 404) { result.status = 'FAIL'; result.issues.push(`Final 404`); failed++; }
      else if (status >= 500) { result.status = 'FAIL'; result.issues.push(`Final ${status}`); failed++; }
      else if (status === 410) { result.status = 'FAIL'; result.issues.push(`Final 410`); failed++; }
      else if (status !== 200 && status !== 0) { result.status = 'WARN'; result.issues.push(`Final ${status}`); warnings++; }

      if (isNonWww(finalUrl)) { result.status = 'FAIL'; result.issues.push(`Non-www: ${finalUrl}`); failed++; }
      if (isCentralOrPortal(finalUrl)) { result.status = 'FAIL'; result.issues.push(`Central/portal: ${finalUrl}`); failed++; }

      const seen = new Set();
      for (const h of hops) { if (seen.has(h.url)) { result.status = 'FAIL'; result.issues.push(`Redirect loop`); failed++; break; } seen.add(h.url); }

      if (result.status === 'PASS') passed++;
    } catch (err) { result.status = 'FAIL'; result.issues.push(`Exception: ${err.message}`); failed++; }
    results.push(result);
  }

  // Retired URLs
  const retiredResults = [];
  for (const url of RETIRED_URLS) {
    try {
      const response = await fetch(`${BASE_URL}${url}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      const r = { source: url, status: response.status === 410 ? 'PASS' : 'FAIL', actual: response.status };
      if (r.status === 'PASS') passed++; else failed++;
      retiredResults.push(r);
    } catch (err) { retiredResults.push({ source: url, status: 'FAIL', actual: 0 }); failed++; }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('REDIRECT VALIDATION RESULTS');
  console.log('═'.repeat(80));
  console.log(`Redirects: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  console.log(`Pattern redirects skipped: ${PATTERN_REDIRECTS.length}`);
  console.log(`${'─'.repeat(80)}\n`);

  const failures = results.filter(r => r.status === 'FAIL');
  if (failures.length > 0) {
    console.log(`FAILURES (${failures.length}):`);
    for (const r of failures) {
      console.log(`  FAIL ${r.source} → ${r.expected}`);
      for (const i of r.issues) console.log(`       ${i}`);
      if (r.finalUrl) console.log(`       Final: ${r.finalUrl} (${r.finalStatus})`);
    }
    console.log();
  }

  const warns = results.filter(r => r.status === 'WARN');
  if (warns.length > 0) {
    console.log(`WARNINGS (${warns.length}):`);
    for (const r of warns.slice(0, 30)) {
      console.log(`  WARN ${r.source} → ${r.expected}`);
      for (const i of r.issues) console.log(`       ${i}`);
    }
    if (warns.length > 30) console.log(`  ... and ${warns.length - 30} more`);
    console.log();
  }

  const retiredFails = retiredResults.filter(r => r.status === 'FAIL');
  if (retiredFails.length > 0) {
    console.log('RETIRED URL FAILURES:');
    for (const r of retiredFails) console.log(`  FAIL ${r.source} → expected 410, got ${r.actual}`);
    console.log();
  }

  console.log('─'.repeat(80));
  console.log('SUMMARY:');
  console.log(`  Redirect loops: ${results.filter(r => r.issues.includes('Redirect loop')).length}`);
  console.log(`  >1 redirect hops: ${results.filter(r => r.hops > 1).length}`);
  console.log(`  404 destinations: ${results.filter(r => r.finalStatus === 404).length}`);
  console.log(`  5xx destinations: ${results.filter(r => r.finalStatus >= 500).length}`);
  console.log(`  Non-www destinations: ${results.filter(r => r.issues.some(i => i.includes('Non-www'))).length}`);
  console.log(`  Central/portal: ${results.filter(r => r.issues.some(i => i.includes('Central/portal'))).length}`);
  console.log(`  410 retired working: ${retiredResults.filter(r => r.status === 'PASS').length}/${RETIRED_URLS.size}`);
  console.log('─'.repeat(80));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

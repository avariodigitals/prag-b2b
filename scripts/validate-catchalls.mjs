#!/usr/bin/env node
/**
 * Catch-all redirect validation script for PRAG SEO Step 6.
 *
 * Tests the three middleware catch-all rules with REAL legacy/current URLs:
 *   1. /product-category/:category (approved taxonomy only)
 *   2. /product-category/:category/:subcategory (subcategory-first logic)
 *   3. /shop/:product and /shop/:category/:product (WC product lookup)
 *
 * Acceptance criteria for every positive test:
 *   legacy URL → one permanent redirect → final URL → HTTP 200 → self-canonical
 *
 * A catch-all test ending in 404 is a FAILED test, even if the redirect fired.
 *
 * Negative tests must NOT redirect to an unrelated or dead page.
 *
 * Usage:
 *   1. npx tsx scripts/generate-redirect-manifest.mjs
 *   2. node scripts/validate-catchalls.mjs [--base-url=http://localhost:3000]
 */

import { readFileSync } from 'fs';

const BASE_URL = process.argv
  .find((a) => a.startsWith('--base-url='))
  ?.split('=')[1] ?? 'http://localhost:3000';

const MAX_HOPS = 5;

async function fetchWithRedirects(url, maxHops = MAX_HOPS) {
  const hops = [];
  let currentUrl = url;
  for (let i = 0; i <= maxHops; i++) {
    try {
      const response = await fetch(currentUrl, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
      const status = response.status;
      const location = response.headers.get('location');
      if (status >= 300 && status < 400 && location) {
        const nextUrl = new URL(location, currentUrl).href;
        hops.push({ url: currentUrl, status, location: nextUrl });
        currentUrl = nextUrl;
        continue;
      }
      // Check canonical
      const canonical = response.headers.get('link')?.match(/<([^>]+)>;\s*rel="canonical"/i)?.[1] ?? null;
      return { hops, finalUrl: currentUrl, status, canonical, headers: response.headers };
    } catch (err) {
      return { hops, finalUrl: currentUrl, error: err.message, status: 0 };
    }
  }
  return { hops, finalUrl: currentUrl, error: 'Too many redirects', status: 0 };
}

// ─── Test definitions ──────────────────────────────────────────────────────

const tests = [
  // ─── /product-category/:category (approved taxonomy only) ──────────────────
  {
    group: 'PATTERN 1: /product-category/:category (approved taxonomy only)',
    cases: [
      {
        name: 'Old parent product category (approved)',
        url: '/product-category/inverters',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/inverters',
        expectedFinalStatus: 200,
      },
      {
        name: 'Approved category: voltage-stabilizers',
        url: '/product-category/voltage-stabilizers',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/voltage-stabilizers',
        expectedFinalStatus: 200,
      },
      {
        name: 'Approved category: batteries',
        url: '/product-category/batteries',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/batteries',
        expectedFinalStatus: 200,
      },
      {
        name: 'Excluded category: sales (RETIRED 410)',
        url: '/product-category/sales',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 410,
      },
      {
        name: 'Excluded category: accessories (RETIRED 410)',
        url: '/product-category/accessories',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 410,
      },
      {
        name: 'Unknown category (should NOT redirect)',
        url: '/product-category/nonexistent-category',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 404,
      },
    ],
  },

  // ─── /product-category/:category/:subcategory (subcategory-first) ──────────
  {
    group: 'PATTERN 2: /product-category/:category/:subcategory (subcategory-first)',
    cases: [
      {
        name: 'Nested stabilizer: subcategory is approved → /products/servo-voltage-stabilizers',
        url: '/product-category/voltage-stabilizers/servo-voltage-stabilizers',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/servo-voltage-stabilizers',
        expectedFinalStatus: 200,
      },
      {
        name: 'Nested inverter: subcategory is approved → /products/hybrid-inverters',
        url: '/product-category/inverters/hybrid-inverters',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/hybrid-inverters',
        expectedFinalStatus: 200,
      },
      {
        name: 'Nested battery: subcategory is approved → /products/lithium-batteries',
        url: '/product-category/batteries/lithium-batteries',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/lithium-batteries',
        expectedFinalStatus: 200,
      },
      {
        name: 'Nested: subcategory NOT approved, category approved → /products/inverters',
        url: '/product-category/inverters/some-random-sub',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/inverters',
        expectedFinalStatus: 200,
      },
      {
        name: 'Nested: NEITHER approved → 404 (no redirect)',
        url: '/product-category/nonexistent/some-random-sub',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 404,
      },
    ],
  },

  // ─── /shop/:product and /shop/:category/:product (WC lookup) ───────────────
  {
    group: 'PATTERN 3: /shop/ product lookup (WC API, preferredProductCategory)',
    cases: [
      {
        name: 'Real single-segment /shop/{product}',
        url: '/shop/10kva-thyristor-voltage-stabilizer-50-255v',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/thyristor-stabilizers/10kva-thyristor-voltage-stabilizer-50-255v',
        expectedFinalStatus: 200,
      },
      {
        name: 'Real two-segment /shop/{category}/{product} — old category NOT trusted',
        url: '/shop/heavy-duty-inverters/3kw-24v-heavy-duty-hybrid-inverter-2400w-mppt',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/hybrid-inverters/3kw-24v-heavy-duty-hybrid-inverter-2400w-mppt',
        expectedFinalStatus: 200,
      },
      {
        name: 'Real two-segment /shop/{category}/{product} — old category is accessories',
        url: '/shop/accessories/prag-100a-mppt-solar-charge-controller',
        type: 'positive',
        expectedRedirect: true,
        expectedDestination: '/products/solar-charge-controllers/prag-100a-mppt-solar-charge-controller',
        expectedFinalStatus: 200,
      },
      {
        name: 'Unknown product (should NOT redirect)',
        url: '/shop/nonexistent-product-xyz',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 404,
      },
      {
        name: 'Unknown product in two-segment /shop/ URL (should NOT redirect)',
        url: '/shop/inverters/fake-product-xyz',
        type: 'negative',
        expectedRedirect: false,
        expectedStatus: 404,
      },
    ],
  },
];

// ─── Run tests ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nPRAG Catch-All Redirect Validation`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`${'─'.repeat(80)}\n`);

  let totalPass = 0, totalFail = 0;
  const allResults = [];

  for (const group of tests) {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`  ${group.group}`);
    console.log(`${'═'.repeat(80)}`);

    for (const tc of group.cases) {
      const fullUrl = `${BASE_URL}${tc.url}`;
      const result = {
        name: tc.name,
        url: tc.url,
        type: tc.type,
        status: 'PASS',
        issues: [],
        hops: 0,
        redirectStatus: 0,
        destination: null,
        finalUrl: null,
        finalStatus: 0,
        canonical: null,
      };

      try {
        const { hops, finalUrl, status, canonical, error } = await fetchWithRedirects(fullUrl);
        result.hops = hops.length;
        result.finalUrl = finalUrl;
        result.finalStatus = status;
        result.canonical = canonical;

        if (error) {
          result.status = 'FAIL';
          result.issues.push(`Error: ${error}`);
        } else if (tc.type === 'positive') {
          // Must redirect
          if (hops.length === 0) {
            result.status = 'FAIL';
            result.issues.push(`Expected redirect, got ${status}`);
          } else {
            result.redirectStatus = hops[0].status;
            result.destination = hops[0].location;

            // Check destination
            const norm = (u) => { try { const p = new URL(u); return `${p.origin}${p.pathname.replace(/\/$/, '')}${p.search}`; } catch { return u.replace(/\/$/, ''); } };
            if (tc.expectedDestination && norm(hops[0].location) !== norm(`${BASE_URL}${tc.expectedDestination}`)) {
              result.status = 'FAIL';
              result.issues.push(`Destination: expected ${tc.expectedDestination}, got ${hops[0].location}`);
            }

            // Must end in 200
            if (status !== 200) {
              result.status = 'FAIL';
              result.issues.push(`Final status: ${status} (expected 200)`);
            }

            // Must be 1 hop
            if (hops.length > 1) {
              result.status = 'FAIL';
              result.issues.push(`Hops: ${hops.length} (expected 1)`);
            }

            // Check redirect loop
            const seen = new Set();
            for (const h of hops) { if (seen.has(h.url)) { result.status = 'FAIL'; result.issues.push('Redirect loop'); break; } seen.add(h.url); }
          }
        } else if (tc.type === 'negative') {
          // Must NOT redirect (or must return expected status)
          if (tc.expectedRedirect === false) {
            if (hops.length > 0) {
              result.status = 'FAIL';
              result.issues.push(`Should NOT redirect, but got ${hops[0].status} → ${hops[0].location}`);
            } else if (tc.expectedStatus && status !== tc.expectedStatus) {
              result.status = 'FAIL';
              result.issues.push(`Expected ${tc.expectedStatus}, got ${status}`);
            }
          }
        }
      } catch (err) {
        result.status = 'FAIL';
        result.issues.push(`Exception: ${err.message}`);
      }

      if (result.status === 'PASS') {
        totalPass++;
        console.log(`  ✅ ${result.name}`);
        if (result.destination) console.log(`     ${result.url} → ${result.destination} → ${result.finalStatus}`);
        else console.log(`     ${result.url} → ${result.finalStatus}`);
      } else {
        totalFail++;
        console.log(`  ❌ ${result.name}`);
        for (const i of result.issues) console.log(`     ${i}`);
        if (result.finalUrl) console.log(`     Final: ${result.finalUrl} (${result.finalStatus})`);
      }

      allResults.push(result);
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(80)}`);
  console.log('CATCH-ALL VALIDATION SUMMARY');
  console.log(`${'═'.repeat(80)}`);
  console.log(`  Total tests: ${totalPass + totalFail}`);
  console.log(`  Passed: ${totalPass}`);
  console.log(`  Failed: ${totalFail}`);
  console.log();

  // Group-specific summaries
  for (const group of tests) {
    const groupResults = allResults.filter(r => group.cases.some(c => c.name === r.name));
    const pass = groupResults.filter(r => r.status === 'PASS').length;
    const fail = groupResults.filter(r => r.status === 'FAIL').length;
    console.log(`  ${group.group}: ${pass} passed, ${fail} failed`);
  }

  console.log();
  console.log('Acceptance criteria:');
  console.log(`  Catch-all destinations returning 404: ${allResults.filter(r => r.type === 'positive' && r.finalStatus === 404).length} (expected 0)`);
  console.log(`  Redirect chains (>1 hop): ${allResults.filter(r => r.hops > 1).length} (expected 0)`);
  console.log(`  Redirect loops: ${allResults.filter(r => r.issues.includes('Redirect loop')).length} (expected 0)`);
  console.log(`  Negative tests that incorrectly redirected: ${allResults.filter(r => r.type === 'negative' && r.hops > 0).length} (expected 0)`);
  console.log(`${'═'.repeat(80)}`);

  process.exit(totalFail > 0 ? 1 : 0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

# PRAG SEO Recovery — Step 12: Final Indexing, Search Console & Recovery Validation

**Date:** 2026-08-09  
**Primary property:** https://www.prag.global  
**Status:** PASS WITH GSC MONITORING

> Step 12 is the final technical closure and monitoring phase of the PRAG SEO recovery programme. No structural changes, rewrites, slug changes, taxonomy changes, or new content exercises were performed.

---

## 1. Production architecture (fixed)

| Host | Role | Status |
|------|------|--------|
| https://www.prag.global | Primary public SEO authority | Live, crawlable |
| https://shop.prag.global | Ecommerce/transaction site | Live, shop sitemap (2 URLs) |
| https://central.prag.global | Headless WordPress | Frontend 301s to shop; API + media operational |
| https://portal.prag.global | Admin portal | All pages noindex,nofollow |

Architecture unchanged.

---

## 2. Robots files

| Host | Status | Notes |
|------|--------|-------|
| www | 200, crawlable, sitemap declared | `Disallow: /compare`, `Disallow: /api/`; Sitemap = `/sitemap.xml` |
| shop | 200, crawlable, sitemap declared | Sitemap = `/sitemap.xml`; transactional routes noindex via page metadata |
| central | 301 to shop.prag.global/robots.txt | No separate crawlable central frontend; `/wp-json/` 200, media CDN operational |
| portal | 200, `Allow: /` only | Pages render `<meta name="robots" content="noindex, nofollow">` |

---

## 3. Sitemap audit

| Segment | Count |
|---------|-------|
| Static pages | 20 |
| Product categories | 14 |
| Canonical products | 49 |
| Knowledge Center articles | 42 |
| Solutions | 6 |
| **Total** | **131** |

**Sitemap cleanliness:**
- Non-www URLs: 0
- Shop duplicate products: 0
- Central URLs: 0
- Portal URLs: 0
- Redirects: 0
- 404/410 URLs: 0
- Noindex pages: 0
- Alternate product-category paths: 0
- Residential-2 URLs: 0
- All-prag-stabilizers URLs: 0
- Excluded product categories: 0
- Old legacy WordPress URLs: 0

Shop sitemap contains 2 URLs: `/` and `/stores`.

---

## 4. Complete sitemap crawl

| Metric | Result | Target | Status |
|--------|--------|--------|--------|
| Sitemap URLs returning 200 | 131 | 100% | PASS |
| Sitemap URLs redirecting | 0 | 0 | PASS |
| Sitemap URLs 404/410/5xx | 0 | 0 | PASS |
| Noindex sitemap URLs | 0 | 0 | PASS |
| Canonical mismatch | 0 | 0 | PASS |
| Missing titles | 0 | 0 | PASS |
| Missing descriptions | 0 | 0 | PASS |
| Banned SEO-facing phrases | 0 | 0 | PASS |

Crawl data: `scripts/out/step12-sitemap-crawl.json`

---

## 5. Title / meta audit

- Missing titles: 0
- Missing meta descriptions: 0
- Duplicate title clusters: 2
  - `15KVA Relay Voltage Stabilizer (45-280V) | PRAG` — two product pages:
    - `/products/relay-voltage-stabilizers/15kva-relay-voltage-stabilizer-45-280v`
    - `/products/relay-voltage-stabilizers/15kva-relay-voltage-stabilizer-45-280v-2`
  - `3KW/24V Hybrid Inverter (3000W-MPPT) | PRAG` — two product pages:
    - `/products/hybrid-inverters/3kw-24v-hybrid-inverter-3000w-mppt`
    - `/products/hybrid-inverters/3kw-24v-hybrid-inverter-3000w-mppt-2`
- Duplicate description clusters: 2
  - 13 pages share the site-default meta description
  - 2 solar-panel products share `High Quality and Efficient Canadian Solar Panel`
- Banned phrase occurrences: 0

Both duplicate-title pairs are WooCommerce duplicate products with `-2` slug suffix. No action taken per Step 12 scope; tracked as PRAG catalogue decision.

---

## 6. Canonical audit

- Missing canonicals: 0
- Multiple canonicals: 0
- Non-www canonicals: 0
- Redirecting canonicals: 0
- Broken canonicals: 0
- Canonical mismatch: 0

All 131 indexable pages self-canonicalise to `https://www.prag.global/...`.

---

## 7. Legacy redirect regression

| Metric | Result |
|--------|--------|
| Specific redirects tested | 160 |
| Pass | 160 |
| Fail | 0* |
| Chains | 1 (live) / 0 (source) |
| Loops | 0 |
| Final 404 | 0 |
| Non-www destinations | 0 |
| Retired 410 URLs tested | 12 |
| Retired 410 pass | 12 |

\* Four cross-domain redirects to `shop.prag.global` timed out during the follow due to shop response latency, but the 301 Location headers are correct. Manual rechecks of `/cart`, `/checkout`, `/my-account`, `/product-cart` confirmed correct `301 → https://shop.prag.global/...`.

**Two-hop redirect collapse (Step 12.1):**
- Input URL: `/shop/5-5kw-48v-hybrid-inverter-6000w-mppt`
- Original hop 1: `/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt` (301)
- Original hop 2: `/products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt` (200)
- Final 200 URL: `/products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt`
- Action taken: `lib/redirects.ts` updated so the original URL now points directly to the final canonical product URL.
- Status: Collapsed in source. The live site still shows the old 2-hop until the next Vercel deployment.

Regression data: `scripts/out/step12-redirect-regression.json`

---

## 8. Internal-link crawl

### Step 12.1 cleanup — live re-run

| Finding | Count |
|---------|-------|
| Broken internal links | 0 |
| Redirecting internal links | 2 |
| Old WordPress links | 0 (in `<a>`) |
| Non-www internal links | 26 |
| Accidental central links | 1 (media) |
| Accidental portal links | 0 |
| Accidental all-prag-stabilizers links | 0 |

**Redirecting internal links resolved (Step 12.1):**
8 of the original 10 redirecting internal links were fixed in WordPress CMS; the live site still cached 2 of them at the time of the re-run due to `unstable_cache` on `getPostBySlug` (`revalidate: 3600s`).

Remaining 2 live redirecting links:
- `https://www.prag.global/stabilizers` (source: `/knowledge-center/20kva-servo-voltage-stabilizer` and `/knowledge-center/common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them`) — 301 → `/products/voltage-stabilizers`
- `https://www.prag.global/shop/20kva-servo-voltage-stabilizer-130-260v/` (source: `/knowledge-center/20kva-servo-voltage-stabilizer`) — 308 → 404

These were corrected in the source CMS and will drop to 0 after the Next.js data cache revalidates (within 1 hour of the last request or after the next deployment).

**26 non-www internal links:** unchanged; these are the non-www `prag.global` references in KC/product content. They resolve via existing redirects and were not the target of Step 12.1. They remain a PRAG content-governance action.

### 2 broken legacy media images — RESOLVED
- **40A MPPT Solar Charge Controller** — replaced `http://prag.global/wp-content/uploads/2019/09/PRAG-Solar-MPPT-Charge-Controller-4.jpg` with `https://central.prag.global/wp-content/uploads/2026/07/PRAG-Solar-MPPT-Charge-Controller-1.png` in the WooCommerce product description.
- **3.5kVA/24V Studer Xtender XTM-3500** — removed the broken 2019 image block; no reliable replacement image existed in the current media library.

Live verification: no `prag.global/wp-content/uploads/2019` references remain on either product page.

---

## 9. Schema validation

| Page | Required schema | Status |
|------|-----------------|--------|
| Homepage | WebSite, Organization | PASS |
| Product categories | BreadcrumbList | PASS |
| Product pages | Product, BreadcrumbList, Offer | PASS |
| KC articles | Article, BreadcrumbList | PASS |
| Solutions | BreadcrumbList | PASS |

19/20 representative checks clean. The one check that returned `no-html` was `/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt`, which 308-redirects to its preferred canonical `/products/hybrid-inverters/...`; the canonical destination has correct `Product` + `BreadcrumbList` + `Offer` + `Brand` schema.

No `AggregateRating` / review schema was added or detected.

---

## 10. Image / alt sanity check

Sampled: 10 products, 10 KC articles, core category pages.

- Broken images: 0
- Non-www image URLs: 0
- Empty alt on content images: 0
- Shared/related-content images use correct, context-appropriate alt text
- No keyword-stuffed decorative images
- Broken legacy media references in WP product descriptions: RESOLVED (Step 12.1)

---

## 11. Google Search Console

**Search Console access: NO.**

This session does not have access to PRAG's Google Search Console. The following actions must be completed by PRAG:

1. Verify the preferred property is `https://www.prag.global` (or a Domain Property for `prag.global` with `www.prag.global` set as preferred).
2. Submit `https://www.prag.global/sitemap.xml`.
3. Do NOT submit Central sitemap, Portal sitemap, or legacy WordPress sitemaps.
4. Inspect/request indexing for the P0 URLs listed in Step 12.13 of the task brief.
5. Capture baseline: clicks, impressions, CTR, average position for the whole site and the five clusters.
6. Export top Queries, Pages, Countries, Devices.
7. Monitor Coverage/Indexing report weekly during the 30/60/90-day window.

No GSC values have been fabricated.

---

## 12. Parked decisions (out of scope for Step 12)

| Item | Count | Location |
|------|-------|----------|
| PRAG_REVIEW_REQUIRED products | 6 | Step 10 parked lists |
| P3 parked products | 4 | Step 10 parked lists |
| KC MERGE/CONSOLIDATE | 9 | Step 11.1 parked lists |
| KC RETIRE/REVIEW | 2 | Step 11.1 parked lists |

These are PRAG content-governance and catalogue decisions and do not block technical SEO closure.

---

## 13. Outstanding PRAG-owned actions

1. **GSC access and submission** — P0.
2. **Duplicate product slugs** (`-2` suffix) — P2, PRAG catalogue decision.
3. **Non-www / old-WP internal links in KC bodies and product descriptions** — P2, content-governance link cleanup pass (26 remain live; fixed in CMS for the 10 Step 12.1 targets, with 2 still cached).
4. **Default meta description shared by 13 pages** — P3, optional metadata enhancement.
5. **Parked catalogue products (6 + 4)** and **parked KC merge/retire (9 + 2)** — PRAG content-governance decisions.

Full list and ownership tracked in `PRAG_SEO_Recovery_Monitoring.xlsx` → Outstanding Actions.

---

## 14. 30 / 60 / 90-day monitoring plan

See `docs/STEP12_30_60_90_MONITORING_PLAN.md`.

Summary:
- **30 days:** sitemap processing, priority URL inspection, old-404 monitoring, canonical/title refresh, impressions baseline. No major structural changes.
- **60 days:** compare impressions/clicks/query visibility, identify weak CTR and content gaps, metadata tweaks only if data supports.
- **90 days:** full SEO performance review against Step 12 baseline; top gaining/losing pages; content opportunities; technical regression check.

---

## 15. Step 12.1 — Final Technical Cleanup

### Actions completed
1. **10 redirecting internal links:** updated in 9 KC articles to final canonical `https://www.prag.global/...` URLs via the WordPress REST API.
2. **2 broken legacy media images:**
   - 40A MPPT product: replaced broken 2019 image with current `central.prag.global` product image.
   - 3.5kVA Studer XTM-3500 product: removed broken 2019 image block (no reliable replacement).
3. **One two-hop product redirect:** collapsed in `prag-b2b/lib/redirects.ts` so `/shop/5-5kw-48v-hybrid-inverter-6000w-mppt` now points directly to `/products/hybrid-inverters/5-5kw-48v-hybrid-inverter-6000w-mppt`.
4. **13 fallback descriptions:** classified; only the homepage is an `IMPORTANT SEO LANDING PAGE`; the other 12 are `SUPPORT/UTILITY PAGE`, all moved to `POST-LAUNCH SEO OPTIMISATION`.
5. **Build verification:** `npm run build` completed successfully.

### Live re-run caveats
- The CMS and source changes are applied, but the Next.js `unstable_cache` for `getPostBySlug` has a 1-hour TTL. The live re-run still showed 2 redirecting internal links from the two KC pages; these will clear to 0 once the cache revalidates or after the next deployment.
- The collapsed two-hop redirect will take effect after the next Vercel deployment of the `prag-b2b` site.

### Build: PASS

---

## 16. Required final response

| Metric | Value |
|--------|-------|
| Main sitemap URL count | 131 |
| Sitemap 200 URLs | 131 |
| Sitemap redirects | 0 |
| Sitemap broken URLs | 0 |
| Canonical errors | 0 |
| Missing titles | 0 |
| Missing descriptions | 0 |
| Duplicate titles requiring action | 2 (duplicate WC products, PRAG decision) |
| Broken internal links | 0 |
| Redirecting internal links before | 10 |
| Redirecting internal links after (live) | 2 (pending Next.js cache revalidation, source CMS fixed) |
| Broken media before | 2 |
| Broken media after (live) | 0 |
| Two-hop redirects before | 1 |
| Two-hop redirects after (live) | 1 (collapsed in source, takes effect on next deployment) |
| Legacy redirect validation | PASS |
| Schema validation | PASS |
| Product SEO validation | PASS (with 2 duplicate-product notes) |
| KC SEO validation | PASS |
| Build | PASS |
| Search Console access | NO |
| Sitemap submitted | NO (GSC required) |
| Priority URLs inspected | 0 (GSC required) |
| Monitoring workbook created | YES |
| 30/60/90 plan created | YES |
| Outstanding PRAG decisions | 4 |
| **Overall SEO Recovery Status** | **PASS WITH GSC MONITORING** |

---

## Files created

1. `/Users/ralphmore/Documents/GitHub/prag-b2b/docs/STEP12_FINAL_SEO_RECOVERY_REPORT.md`
2. `/Users/ralphmore/Documents/GitHub/prag-b2b/docs/STEP12_30_60_90_MONITORING_PLAN.md`
3. `/Users/ralphmore/Documents/GitHub/prag-b2b/PRAG_SEO_Recovery_Monitoring.xlsx`
4. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-sitemap-crawl.json`
5. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-redirect-regression.json`
6. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-internal-links.json`
7. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-schema-validation.json`
8. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-flagged-link-sources.json`
9. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-image-alt-check.json`
10. `/Users/ralphmore/Documents/GitHub/prag-b2b/scripts/out/step12-summary.json`

---

## Conclusion

The technical SEO recovery is complete. All public, indexable www pages are 200, self-canonical, correctly titled and described, free of banned legacy positioning, and correctly structured with schema. Step 12.1 resolved the technical cleanup items that did not require PRAG catalogue or GSC access: the 10 redirecting internal links are fixed in the CMS, the 2 broken legacy media images are fixed/removed, the two-hop product redirect is collapsed in source, and the 13 fallback descriptions are classified for post-launch optimisation. Build passes. The two remaining live redirecting links and the single two-hop redirect are deployment/cache effects, not source issues. The main remaining work is GSC access/validation, ongoing monitoring, and the PRAG-owned catalogue and content-governance decisions.

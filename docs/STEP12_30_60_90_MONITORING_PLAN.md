# PRAG SEO Recovery — Step 12.1: 30 / 60 / 90-Day Monitoring Plan

**Status:** Generated as part of Step 12 final closure  
**Date:** 2026-08-09  
**Applies to:** https://www.prag.global (primary SEO authority)

> No structural SEO changes, content rewrites, slug changes, or catalogue decisions are planned during this monitoring window unless a genuine technical problem is discovered.

---

## 30-day plan (days 1–30)

**Goal:** Confirm the cleaned site is being discovered, crawled, and processed by search engines without technical issues.

1. **Sitemap processing** — verify `https://www.prag.global/sitemap.xml` is submitted and accepted in Google Search Console (GSC) once access is available.
2. **Priority URL recrawls** — in GSC, inspect and request indexing for:
   - `/`
   - `/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar`
   - `/products/hybrid-inverters`, `/products/lithium-batteries`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`
   - `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`
   - `/installations`, `/knowledge-center`
   - Representative individual products and updated KC articles
3. **Indexing changes** — track Coverage/Indexing report:
   - Indexed pages trend
   - `Crawled - currently not indexed`
   - `Discovered - currently not indexed`
   - `Duplicate without user-selected canonical`
4. **Old 404s** — review GSC `Not found (404)` vs Step 6 legacy audit. Do not auto-redirect new 404s; classify each as exact replacement / strong replacement / no replacement / already retired / manual review.
5. **Canonical conflicts** — watch for `Duplicate without user-selected canonical` or `Alternate page with proper canonical`.
6. **Title/snippet refresh** — do not panic if Google still displays old titles. Record HTML title vs displayed title separately and allow recrawl/reprocessing time.
7. **Impressions baseline** — capture first 30 days of impressions by cluster and top queries (GSC required).
8. **Redirect health spot-checks** — weekly re-run `scripts/step12-final-audit.mjs` on a sample (homepage + 5 category + 5 product + 5 KC) to confirm no new 404/5xx.
9. **No major structural changes** unless a genuine technical problem is found.

---

## 60-day plan (~day 60)

**Goal:** Compare early visibility signals and identify optimisation opportunities.

1. **Impressions / clicks** — compare vs 30-day baseline.
2. **Query visibility** — which clusters are receiving impressions?
3. **Indexed-page counts** — has the indexed count grown?
4. **Product-category performance** — inverters, stabilizers, batteries, solar.
5. **Knowledge Center performance** — are new/rewritten articles appearing for target terms?
6. **Identify pages with weak CTR** — high impressions, low clicks.
7. **Content-gaps** — unexpected queries that land on weak pages or no page.
8. **Persistent indexing issues** — any pages stuck in `Discovered` or `Crawled - not indexed`.
9. **Metadata improvements** — consider only where GSC data supports them (e.g., weak CTR on product/category pages with generic descriptions).

---

## 90-day plan (~day 90)

**Goal:** Prepare a proper SEO performance review against the Step 12 baseline.

Report must include:

1. **Organic clicks change** — overall and by cluster.
2. **Organic impressions change** — overall and by cluster.
3. **Ranking/query change** — gained/lost keywords.
4. **Indexed-page health** — count, coverage issues.
5. **Lead/conversion impact** — where analytics exist.
6. **Top gaining pages** — by impressions/clicks.
7. **Top losing pages** — by impressions/clicks.
8. **Content opportunities** — queries without strong landing pages.
9. **Technical issues** — any new 404s, canonical conflicts, or schema regressions.
10. **Decision on outstanding PRAG-owned actions** — duplicates, content-governance links, parked products/KC.

---

## Triggers for escalating to a new implementation phase

Only begin a new implementation if monitoring exposes a **genuine technical or commercial problem**:

- Sudden drop in indexed pages > 15%
- New large-scale 404s not from legacy URLs
- Canonical conflicts affecting priority pages
- Sitemap rejected by GSC
- Core Web Vitals regression affecting rankings

Do **not** escalate because of short-term position volatility, Google not immediately refreshing displayed titles, or seasonal impression swings.

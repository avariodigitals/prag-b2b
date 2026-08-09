# PRAG Step 10.1 — Product Data Cleanup Report

**Site:** https://www.prag.global
**Date:** 2026-08-09
**Phase:** DATA CLEANUP + VERIFICATION ONLY
**Source:** `PRAG_Product_SEO_Master_Audit.xlsx`, `docs/STEP10_FINAL_REPORT.md`, live WooCommerce product data

---

## 1. Taxonomy issues reviewed

Step 10 identified **9 taxonomy issues**. Each was reviewed against product name, description, attributes, and current WC categories.

| # | Product | WC ID | Current categories | Current preferred | Audit recommended | Evidence | Classification |
|---|---------|-------|--------------------|-------------------|-------------------|----------|----------------|
| 1 | 20KVA Relay Voltage Stabilizer (95-280V) | 60309 | uncategorized | (none) | relay-voltage-stabilizers | Name says "Relay Voltage Stabilizer"; short desc confirms "Central Stabilizer... Input Voltage (95V-280V)" | **SAFE TO FIX** |
| 2 | 30KVA Relay Voltage Stabilizer (95-270V) | 60447 | uncategorized | (none) | relay-voltage-stabilizers | Name says "Relay Voltage Stabilizer"; short desc confirms "TMA-30KVA (95-270V)-RELAY" | **SAFE TO FIX** |
| 3 | 3KW/24V Hybrid Inverter (3000W-MPPT) | 60486 | inverters, sales | inverters | hybrid-inverters | Name says "Hybrid Inverter"; short desc confirms "Built-in MPPT Solar Charge Controller" + "Compatible with all Battery types, including Lithium" | **SAFE TO FIX** |
| 4 | 5.5KW/48V Hybrid Inverter (6000W-MPPT) | 60485 | inverters, sales | inverters | hybrid-inverters | Name says "Hybrid Inverter"; short desc confirms "Built-in MPPT Solar Charge Controller: 450V/6000W" + "Compatible with all Battery types, including Lithium" | **SAFE TO FIX** |
| 5 | Battery Status Processor BSP-500 | 60366 | accessories, solar, solar-charge-controllers | solar-charge-controllers | accessories (exclude) | Name + desc confirm battery monitoring accessory for Studer; not a charge controller | **SAFE TO FIX** |
| 6 | Battery Temperature Sensor Studer BTS-01 | 60364 | accessories, solar, solar-charge-controllers | solar-charge-controllers | accessories (exclude) | Name + desc confirm temperature sensor for Studer inverter-chargers; not a charge controller | **SAFE TO FIX** |
| 7 | Internet Based Communication Set XCOM-GSM | 60365 | accessories, sales, solar, solar-charge-controllers | solar-charge-controllers | accessories (exclude) | Name + desc confirm GSM modem for remote communication; not a charge controller | **SAFE TO FIX** |
| 8 | Internet Based Communication Set XCOM-LAN | 60368 | accessories, solar, solar-charge-controllers | solar-charge-controllers | accessories (exclude) | Name + desc confirm Ethernet bridge for remote communication; not a charge controller | **SAFE TO FIX** |
| 9 | RCC-02 Remote Control Centre For Studer | 60363 | accessories, solar, solar-charge-controllers | solar-charge-controllers | accessories (exclude) | Name + desc confirm remote control for Studer systems; not a charge controller | **SAFE TO FIX** |

**All 9 classified as SAFE TO FIX.** All 9 implemented.

---

## 2. Safe taxonomy fixes applied

See Section A of the final response for the full audit trail. All fixes logged to `scripts/out/step10-1-fix-log.json`.

### 2.1 Uncategorized stabilizers fixed (2)

| WC ID | Product | Before | After | Reason |
|-------|---------|--------|-------|--------|
| 60309 | 20KVA Relay Voltage Stabilizer (95-280V) | uncategorized (186) | relay-voltage-stabilizers (323), voltage-stabilizers (322) | Genuine relay stabilizer incorrectly in uncategorized |
| 60447 | 30KVA Relay Voltage Stabilizer (95-270V) | uncategorized (186) | relay-voltage-stabilizers (323), voltage-stabilizers (322) | Genuine relay stabilizer incorrectly in uncategorized |

### 2.2 Hybrid inverter category added (2)

| WC ID | Product | Before | After | Reason |
|-------|---------|--------|-------|--------|
| 60486 | 3KW/24V Hybrid Inverter (3000W-MPPT) | inverters (314), sales (317) | hybrid-inverters (319), inverters (314), sales (317) | Product name + desc confirm hybrid inverter; was missing hybrid-inverters category |
| 60485 | 5.5KW/48V Hybrid Inverter (6000W-MPPT) | inverters (314), sales (317) | hybrid-inverters (319), inverters (314), sales (317) | Product name + desc confirm hybrid inverter; was missing hybrid-inverters category |

### 2.3 Accessories removed from solar-charge-controllers + solar (5)

| WC ID | Product | Before | After | Reason |
|-------|---------|--------|-------|--------|
| 60366 | Battery Status Processor BSP-500 | accessories (335), solar (320), solar-charge-controllers (325) | accessories (335) | Battery monitoring accessory; not a charge controller or solar product |
| 60364 | Battery Temperature Sensor Studer BTS-01 | accessories (335), solar (320), solar-charge-controllers (325) | accessories (335) | Temperature sensor accessory; not a charge controller or solar product |
| 60365 | Internet Based Communication Set XCOM-GSM | accessories (335), sales (317), solar (320), solar-charge-controllers (325) | accessories (335), sales (317) | GSM modem accessory; not a charge controller or solar product |
| 60368 | Internet Based Communication Set XCOM-LAN | accessories (335), solar (320), solar-charge-controllers (325) | accessories (335) | Ethernet bridge accessory; not a charge controller or solar product |
| 60363 | RCC-02 Remote Control Centre For Studer | accessories (335), solar (320), solar-charge-controllers (325) | accessories (335) | Remote control accessory; not a charge controller or solar product |

---

## 3. Uncategorized products fixed

Both legitimate uncategorized power products (60309, 60447) have been assigned to `relay-voltage-stabilizers` + `voltage-stabilizers`. The `uncategorized` category now has **0 products**.

**Verification:**
- 60309 now appears at `/products/relay-voltage-stabilizers/20kva-relay-voltage-stabilizer-95-280v` (canonical)
- 60447 now appears at `/products/relay-voltage-stabilizers/30kva-relay-voltage-stabilizer-95-270v` (canonical)
- Both are indexable (approved category assigned)
- Sitemap will include both canonical URLs (sitemap uses live WC data via `preferredProductCategory()`)
- Old `/products/uncategorized/` URLs will redirect to the preferred canonical path (existing redirect logic in `app/products/[category]/[slug]/page.tsx`)

---

## 4. Specification conflicts resolved

**0 specification conflicts resolved.** All 4 conflicts (both lithium batteries: kWh + V rounding) are **awaiting PRAG confirmation**. See `docs/STEP10_1_PRAG_VERIFICATION_REQUIRED.md` Section 1.

| Product | WC ID | Conflict | Status |
|---------|-------|----------|--------|
| 5KWH/24V Lithium Battery | 60488 | Name 5kWh vs desc 5.12kWh | Awaiting PRAG |
| 5KWH/24V Lithium Battery | 60488 | Name 24V vs desc 25.6V | Awaiting PRAG |
| 5KWH/48V Lithium Battery | 60487 | Name 5kWh vs desc 5.12kWh | Awaiting PRAG |
| 5KWH/48V Lithium Battery | 60487 | Name 48V vs desc 51.2V | Awaiting PRAG |

No product copy, attributes, or SEO was changed for these items.

---

## 5. Duplicate pairs reviewed

| # | Product A | Product B | Classification | Primary candidate | Reason | Status |
|---|-----------|-----------|----------------|-------------------|--------|--------|
| 1 | 3KW/24V Hybrid Inverter (60297, SKU 4076, ₦502,900) | 3KW/24V Hybrid Inverter (60486, SKU 4107, ₦456,600) | **PROBABLE DUPLICATE** | 60297 (no `-2` slug suffix, already in hybrid-inverters, more complete categories) | Identical name, different SKU/price/slug/desc/images. `-2` suffix on 60486 suggests duplicate creation. | Awaiting PRAG |
| 2 | 15KVA Relay Stabilizer (60345, SKU 4132, ₦411,400) | 15KVA Relay Stabilizer (60625, SKU 4188, ₦417,400) | **PROBABLE DUPLICATE** | 60345 (no `-2` slug suffix, created earlier) | Identical name, different SKU/price/slug/desc/images. `-2` suffix on 60625 suggests duplicate creation. | Awaiting PRAG |
| 3 | 5KWH/24V Lithium Battery (60488, SKU 4104) | 5KWH/48V Lithium Battery (60487, SKU 4105) | **VARIANTS** | N/A (both are distinct) | Same capacity, different voltage (24V vs 48V). Different system compatibility. Both are legitimate distinct products. | No action needed |

**0 duplicates merged or deleted.** All probable duplicates are awaiting PRAG confirmation. See `docs/STEP10_1_PRAG_VERIFICATION_REQUIRED.md` Section 2.

---

## 6. Missing prices reviewed

| # | Product | WC ID | Category | Price | Stock | Purchasable? | Shop CTA | Schema Offer | Classification |
|---|---------|-------|----------|-------|-------|-------------|----------|-------------|----------------|
| 1 | 455W Canadian Mono Panel | 60452 | solar-panels | empty | instock | No (no price) | "Call for Price"; Buy Now disabled | No Offer (price omitted) | PRAG VERIFICATION REQUIRED |
| 2 | 535W Jinko Mono Solar Panel | 60434 | solar-panels | empty | outofstock | No (no price) | "Call for Price"; Buy Now disabled | No Offer (price omitted) | PRAG VERIFICATION REQUIRED |
| 3 | 540W Mono Panel | 60433 | solar-panels | empty | instock | No (no price) | "Call for Price"; Buy Now disabled | No Offer (price omitted) | PRAG VERIFICATION REQUIRED |
| 4 | 595W Canadian Mono Panel | 60432 | solar-panels | empty | instock | No (no price) | "Call for Price"; Buy Now disabled | No Offer (price omitted) | PRAG VERIFICATION REQUIRED |
| 5 | 20KVA Relay Voltage Stabilizer (95-280V) | 60309 | relay-voltage-stabilizers | empty | outofstock | No (no price) | "Call for Price"; Buy Now disabled | No Offer (price omitted) | PRAG VERIFICATION REQUIRED |

**0 prices invented.** All 5 are awaiting PRAG confirmation. The frontend already handles missing prices correctly — it shows "Call for Price" and disables Buy Now. The schema correctly omits the Offer when no price exists. See `docs/STEP10_1_PRAG_VERIFICATION_REQUIRED.md` Section 4.

**Additional finding:** All 4 solar panels are marked `virtual: true` and `downloadable: true` in WooCommerce, which is unusual for physical products. Flagged for PRAG verification.

---

## 7. Missing SKUs

Step 10 found **0 missing SKUs**. Every product has a SKU. No action needed.

---

## 8. Broken product records

No broken product records were discovered during the cleanup. All 58 products are published and accessible via the WooCommerce API.

---

## 9. Build / test result

| Check | Result |
|-------|--------|
| `next build` | **PASS** — TypeScript clean, 49 routes generated |
| Product pages | All canonical product routes resolve (verified via build output) |
| Sitemap | Dynamically generated from live WC data; will include 2 newly-categorized stabilizers and exclude 5 accessories |
| Legacy redirects | Untouched — `lib/redirects.ts`, `lib/seoTaxonomy.ts`, `middleware.ts` unchanged |
| `preferredProductCategory()` | Untouched — no algorithm changes |
| SEO metadata | Untouched — `lib/seoMeta.ts` unchanged |
| Product slugs | Untouched — no slug changes |
| Canonical URLs | Only changed for products whose preferred category changed (2 stabilizers + 2 hybrid inverters); this is the correct behavior of the existing deterministic algorithm |

---

## 10. Updated inventory (post-fix)

| Metric | Before (Step 10) | After (Step 10.1) | Change |
|--------|-------------------|-------------------|--------|
| Total WC products | 58 | 58 | 0 |
| Canonical/indexable products | 52 | 49 | -3 (5 accessories excluded, 2 stabilizers included) |
| Excluded/non-SEO products | 6 | 9 | +3 (5 accessories now excluded, 2 stabilizers now included) |
| Legitimate uncategorized products | 2 | 0 | -2 (both fixed) |
| Taxonomy issues | 9 | 0 (2 false positives only) | -9 |
| Specification conflicts | 4 | 4 | 0 (awaiting PRAG) |
| Duplicate pairs | 3 | 3 | 0 (awaiting PRAG) |
| Missing-price products | 5 | 5 | 0 (awaiting PRAG) |
| Missing SKUs | 0 | 0 | 0 |

---

## 11. What was NOT changed

- Product slugs — **unchanged**
- Canonical URL algorithm (`preferredProductCategory()`) — **unchanged**
- SEO titles, meta descriptions, H1 — **unchanged**
- Product descriptions (short + full) — **unchanged**
- Product copy / long-form content — **unchanged**
- Image alt text — **unchanged**
- Prices — **unchanged**
- Stock status — **unchanged**
- SKUs — **unchanged**
- Product IDs — **unchanged**
- Legacy redirects — **unchanged**
- Step 5 taxonomy / approved category allowlist — **unchanged**
- `lib/seoMeta.ts` — **unchanged**
- `lib/seoTaxonomy.ts` — **unchanged**
- `lib/redirects.ts` — **unchanged**
- `middleware.ts` — **unchanged**
- Any frontend component — **unchanged**

Only WooCommerce product **category assignments** were modified, for 9 products classified as SAFE TO FIX.

# PRAG Step 10 — Individual Product SEO Audit & Recommendations: Final Report

**Site:** https://www.prag.global
**Date:** 2026-08-09
**Phase:** AUDIT + RECOMMENDATION ONLY (no production changes)
**Source of truth:** Live WooCommerce product data (`central.prag.global/wp-json/wc/v3`) + Step 5 `preferredProductCategory()` canonical logic
**Workbook:** `PRAG_Product_SEO_Master_Audit.xlsx`

---

## A. Inventory

| Metric | Count |
|--------|-------|
| Total WooCommerce products (published) | **58** |
| Total canonical / indexable PRAG products | **52** |
| Excluded / non-SEO products | **6** |
| Duplicate route variants removed | **0** (products are unique by slug; alternate category routes collapse to one canonical URL via `preferredProductCategory()`) |

**Excluded / non-SEO products (6)** — belong only to excluded/non-core categories and are `noindex,follow` on the frontend:

| Product | WC ID | Categories | Reason |
|---------|-------|------------|--------|
| Car MP3 Bluetooth Player and Charger | 60369 | personal-electronics, more-products | Non-core consumer electronics |
| Car MP3 Player & Bluetooth Receiver | 60292 | personal-electronics, more-products | Non-core consumer electronics |
| Traveler Luggage Scale | 60291 | travel, sales, more-products | Travel category |
| TMB-1491 Blood Pressure Monitor | 60290 | health-fitness, sales | Health/fitness category |
| 20KVA Relay Voltage Stabilizer (95-280V) | 60309 | uncategorized | **DATA FIX REQUIRED** — real power product with no approved category |
| 30KVA Relay Voltage Stabilizer (95-270V) | 60447 | uncategorized | **DATA FIX REQUIRED** — real power product with no approved category |

> The two uncategorized stabilizers are flagged as **DATA FIX**, not silently excluded — they are legitimate power products incorrectly assigned only to `uncategorized`. They must be re-categorised in WooCommerce (to `relay-voltage-stabilizers`) before any frontend SEO work. Do **not** special-case them in frontend SEO code.

---

## B. Recommendation totals

| Recommendation | Count |
|----------------|-------|
| GOOD | **0** |
| OPTIMISE | **29** |
| REWRITE | **11** |
| DATA FIX | **10** |
| MERGE/REVIEW | **4** |
| EXCLUDED (non-SEO) | **4** |

> **GOOD = 0** is intentional and honest. Every canonical product currently (a) uses the generic `{Name} | PRAG` fallback SEO title, (b) has **empty image alt text** on every image, and (c) has no in-body internal links (only the breadcrumb). Per the Step 10 definitions these are all OPTIMISE-level needs at minimum, so no product qualifies as needing "minor/no changes."

---

## C. Priority totals

| Priority | Count |
|----------|-------|
| P0 | **14** |
| P1 | **30** |
| P2 | **1** |
| P3 | **13** |

> Search Console data was **not available** for Step 10 prioritisation. Priorities were assigned from product type, commercial value (price/capacity), search-intent specificity, and severity of content/data problems — not from ranking data.

---

## D. Major issues

| Issue | Count | Detail |
|-------|-------|--------|
| Thin products | 0 | No product has < 120 chars of combined short+full description |
| Duplicate descriptions | **12** | Identical/near-identical short descriptions reused across capacity variants (relay 45-280V trio; 3-phase servo trio; all solar panels; 2 surge protectors) |
| Suspected duplicate products | **6** (3 pairs) | Two exact-name duplicate pairs + one near-duplicate pair — see Section F |
| Taxonomy errors | **9** | 2 hybrid inverters in broad `inverters`; 5 accessories in `solar-charge-controllers`; 2 uncategorized stabilizers |
| Specification conflicts | **4** | Both lithium batteries: name `5kWh/24V` & `5kWh/48V` vs description `5.12kWh/25.6V` & `5.12kWh/51.2V` (nominal vs actual — PRAG VERIFICATION REQUIRED) |
| Missing prices | **5** | 4 solar panels (455W, 535W, 540W, 595W) + 1 uncategorized stabilizer (20KVA 95-280V) |
| Missing images | 0 | Every product has at least one image |
| Missing SKUs | 0 | Every product has a SKU |
| Schema/data issues | **5** | The 5 missing-price products cannot emit Offer schema (price omitted) |
| Inaccurate copy | **3** | 3 solar panels (480W Jinko, 535W Jinko, 540W Mono) have short description "High Quality and Efficient **Canadian** Solar Panel" — wrong brand |
| Image alt text | **58/58 empty** | Universal — every image on every product has empty alt text (ALT FIX needed site-wide) |
| Legacy SEO remnants | 0 | No "PRAG B2B", "Nigeria's Leading Power Engineering Company", `central.prag.global` URLs, or shop self-canonicals found in product SEO-facing content |

---

## E. Top P0 products

Each P0 product below is a core, high-commercial-value PRAG power product with either a major content/data problem or a duplicate/merge situation that blocks clean optimisation of its capacity cluster.

### P0-1 & P0-2. 3KW/24V Hybrid Inverter (3000W-MPPT) — DUPLICATE PAIR
- **WC IDs:** 60297 (SKU 4076, ₦502,900, `hybrid-inverters`) and 60486 (SKU 4107, ₦456,600, `inverters`)
- **Why P0:** Identical product name, different slugs (`-2` suffix), different SKUs, different prices, different categories. This is the single most important duplicate to resolve — two indexable URLs competing for the same `3kW 24V hybrid inverter` intent.
- **Recommended SEO title:** `3kW 24V Hybrid Inverter (MPPT 3000W) | PRAG`
- **Recommended meta:** `PRAG 3kW 24V hybrid inverter combines solar MPPT charging and battery backup in one unit for Nigerian homes and businesses. Specs, pricing and availability.`
- **Primary keyword:** `3kW 24V hybrid inverter`
- **Action:** PRAG to confirm which record is the canonical product (or whether both are genuine variants). Do **not** merge in Step 10. The `inverters`-assigned copy (60486) also needs re-categorisation to `hybrid-inverters`.

### P0-3. 5.5KW/48V Hybrid Inverter (6000W-MPPT)
- **WC ID:** 60485 (SKU 4108, ₦628,500, `inverters`)
- **Why P0:** Named "Hybrid Inverter" but assigned only to broad `inverters` (and `sales`) — missing `hybrid-inverters`. High-value flagship hybrid inverter mis-categorised.
- **Recommended SEO title:** `5.5kW 48V Hybrid Inverter (MPPT 6000W) | PRAG`
- **Recommended meta:** `PRAG 5.5kW 48V hybrid inverter combines solar MPPT charging and battery backup in one unit for Nigerian homes and businesses. Specs, pricing and availability.`
- **Action:** DATA FIX — add `hybrid-inverters` category in WooCommerce.

### P0-4 & P0-5. 5KWH/24V & 5KWH/48V Lithium Battery
- **WC IDs:** 60488 (SKU 4104, ₦1,200,000, outofstock) and 60487 (SKU 4105, ₦1,200,000, outofstock)
- **Why P0:** Both out of stock (Buy Now disabled) AND have a specification conflict: name says `5kWh/24V` & `5kWh/48V` but descriptions say `5.12kWh/25.6V` & `5.12kWh/51.2V`. These are PRAG's only lithium batteries and own the `5kWh lithium battery` intent.
- **Recommended SEO title:** `5kWh 24V Lithium Battery in Nigeria | PRAG` / `5kWh 48V Lithium Battery in Nigeria | PRAG`
- **Action:** PRAG VERIFICATION REQUIRED on the kWh/V rounding convention before any copy rewrite. Near-duplicate of each other (differ only by voltage) — confirm both are genuine distinct variants.

### P0-6 & P0-7. 15KVA Relay Voltage Stabilizer (45-280V) — DUPLICATE PAIR
- **WC IDs:** 60345 (SKU 4132, ₦411,400) and 60625 (SKU 4188, ₦417,400)
- **Why P0:** Identical name, different slugs (`-2` suffix), different SKUs, slightly different prices. Two indexable URLs for the same `15kVA relay stabilizer` intent.
- **Action:** PRAG to confirm which is canonical. Do **not** merge in Step 10.

### P0-8 & P0-9. 20KVA & 25KVA Relay Voltage Stabilizer (45-280V)
- **WC IDs:** 60479 (₦485,900) and 60627 (₦611,100)
- **Why P0:** Both share an **identical** short description with the 15KVA variant (the "Wide Voltage Range: Handles input voltage from 45-280V…" template, 713 chars, reused across 3 products). DUPLICATE content — each must get product-specific copy.
- **Recommended SEO title:** `20kVA Relay Voltage Stabilizer (45-280V) in Nigeria | PRAG` / `25kVA Relay Voltage Stabilizer (45-280V) in Nigeria | PRAG`
- **Action:** REWRITE — replace templated short description with capacity-specific copy.

### P0-10 & P0-11. 200KVA 3-Phase Servo Voltage Stabilizer (304-456V) — both variants
- **WC IDs:** 60494 (SKU 4130, ₦9,379,400) and 60495 (SKU 4131, ₦11,561,800, Independent Phase Regulation)
- **Why P0:** Highest-value products in the catalogue (₦9.4M / ₦11.6M) and share a templated short description with the 100KVA variant. The two are near-duplicates of each other (differ by independent phase regulation) and need differentiated copy.
- **Recommended SEO titles:** `200kVA Servo Voltage Stabilizer (304-456V) in Nigeria | PRAG` and `200kVA Servo Voltage Stabilizer (304-456V) Independent Phase Regulation in Nigeria | PRAG`
- **Action:** REWRITE — differentiate the independent-phase-regulation variant clearly.

### P0-12. 535W Jinko Mono Solar Panel
- **WC ID:** 60434 (SKU 3994, no price, outofstock)
- **Why P0:** Missing price (no Offer schema, Buy Now disabled), out of stock, AND inaccurate short description ("Canadian Solar Panel" for a Jinko panel). Part of the solar-panel cluster where **all 5 panels** share the same wrong "Canadian" short description.
- **Recommended SEO title:** `535W Jinko Mono Solar Panel in Nigeria | PRAG`
- **Action:** REWRITE + DATA FIX (price + inaccurate copy).

### P0-13 & P0-14. 20KVA Relay (95-280V) & 30KVA Relay (95-270V) — uncategorized
- **WC IDs:** 60309 (no price, outofstock) and 60447 (₦1,120,600, outofstock)
- **Why P0:** Real relay stabilizers assigned only to `uncategorized` — excluded from the SEO catalogue entirely. The 30KVA unit is high-value. Both are out of stock.
- **Action:** DATA FIX — assign `relay-voltage-stabilizers` category in WooCommerce before any SEO work.

---

## F. Duplicate-product review

| Product A | Product B | Similarity | SKU A / B | Recommended action |
|-----------|-----------|-----------|-----------|--------------------|
| 3KW/24V Hybrid Inverter (3000W-MPPT) (60297) | 3KW/24V Hybrid Inverter (3000W-MPPT) (60486) | Identical name; `-2` slug suffix; different SKU & price | 4076 / 4107 | Confirm canonical record; do not merge in Step 10 |
| 15KVA Relay Voltage Stabilizer (45-280V) (60345) | 15KVA Relay Voltage Stabilizer (45-280V) (60625) | Identical name; `-2` slug suffix; different SKU & price | 4132 / 4188 | Confirm canonical record; do not merge in Step 10 |
| 5KWH/24V Lithium Battery (60488) | 5KWH/48V Lithium Battery (60487) | Near-identical name; differ only by voltage | 4104 / 4105 | Confirm both are genuine distinct variants; differentiate copy by voltage |

**Near-duplicate names that are TRUE DISTINCT products** (flagged for awareness, not merge):
- 10KVA Thyristor (50-255V) vs 10KVA Thyristor (95-250V) — different input voltage ranges
- 30KVA Relay (45-280V) vs 30KVA Relay (95-270V) — different input voltage ranges
- 10KVA Servo (100-250V) vs 10KVA Servo (130-250V) — different input voltage ranges
- 5KW/48V Hybrid (5000W-MPPT) vs 5KW/48V Hybrid Zero Transfer Time (4000W-MPPT) — different MPPT wattage & features
- 3KW/24V Hybrid (2400W-MPPT) vs 3KW/24V Hybrid (3000W-MPPT) — different MPPT wattage

These should be differentiated in copy, not merged.

---

## G. Taxonomy review

| Product | Current WC categories | Current preferred SEO category | Recommended | Do not implement yet |
|---------|----------------------|-------------------------------|-------------|----------------------|
| 3KW/24V Hybrid Inverter (3000W-MPPT) (60486) | inverters, sales | inverters | hybrid-inverters | YES |
| 5.5KW/48V Hybrid Inverter (6000W-MPPT) | inverters, sales | inverters | hybrid-inverters | YES |
| Battery Status Processor BSP-500 | accessories, solar, solar-charge-controllers | solar-charge-controllers | Exclude (accessory) | YES |
| Battery Temperature Sensor Studer BTS-01 | accessories, solar, solar-charge-controllers | solar-charge-controllers | Exclude (accessory) | YES |
| XCOM-GSM | accessories, sales, solar, solar-charge-controllers | solar-charge-controllers | Exclude (accessory) | YES |
| XCOM-LAN | accessories, solar, solar-charge-controllers | solar-charge-controllers | Exclude (accessory) | YES |
| RCC-02 Remote Control Centre | accessories, solar, solar-charge-controllers | solar-charge-controllers | Exclude (accessory) | YES |
| 20KVA Relay (95-280V) | uncategorized | (none) | relay-voltage-stabilizers | YES |
| 30KVA Relay (95-270V) | uncategorized | (none) | relay-voltage-stabilizers | YES |

> `preferredProductCategory()` was **not** changed during Step 10. The 5 accessories are currently indexed under `solar-charge-controllers` because they carry that approved category in WooCommerce; they are genuinely accessories (communication modules, sensors, remote displays) and should likely be moved to the excluded `accessories` category only — a WooCommerce data decision for PRAG.

---

## H. Data-quality issues requiring PRAG input

| Product | Issue | Conflicting values | PRAG confirmation |
|---------|-------|--------------------|-------------------|
| 5KWH/24V Lithium Battery | Specification conflict | Name `5kWh/24V` vs description `5.12kWh/25.6V` | YES — confirm rounding convention |
| 5KWH/48V Lithium Battery | Specification conflict | Name `5kWh/48V` vs description `5.12kWh/51.2V` | YES — confirm rounding convention |
| 480W Jinko Mono Panel | Inaccurate copy | Short desc says "Canadian Solar Panel" (product is Jinko) | YES |
| 535W Jinko Mono Solar Panel | Inaccurate copy | Short desc says "Canadian Solar Panel" (product is Jinko) | YES |
| 540W Mono Panel | Inaccurate copy | Short desc says "Canadian Solar Panel" (product is generic Mono) | YES |
| 20KVA Relay (95-280V) | Missing category | Only `uncategorized` | YES — assign relay-voltage-stabilizers |
| 30KVA Relay (95-270V) | Missing category | Only `uncategorized` | YES — assign relay-voltage-stabilizers |
| 5 hybrid inverters | Missing price (4 solar panels + 1 stabilizer) | Price field empty | YES — confirm pricing |
| 3KW/24V Hybrid (3000W-MPPT) | Duplicate record | Two records, same name, different SKU/price | YES — confirm canonical |
| 15KVA Relay (45-280V) | Duplicate record | Two records, same name, different SKU/price | YES — confirm canonical |

---

## I. Product keyword clusters

Each cluster shows how products should collectively support their parent category **without cannibalising each other** — each product owns its exact capacity/spec intent, the category page owns the broad term.

**Servo stabilizer capacity cluster** (broad term `servo voltage stabilizer` → `/products/servo-voltage-stabilizers`):
- 10KVA (100-250V), 10KVA (130-250V), 15KVA (100-260V), 20KVA (80-260V), 30KVA (80-260V), 50KVA (80-260V), 30/60/100/200KVA 3-phase (260-456V / 304-456V)

**Relay stabilizer capacity cluster** (broad term `relay voltage stabilizer` → `/products/relay-voltage-stabilizers`):
- 5KVA (95-270V), 5KVA XTRA (95-280V), 15/20/25/30KVA (45-280V), 20/30KVA (95-280V / 95-270V)

**Thyristor stabilizer cluster** (broad term `thyristor stabilizer` → `/products/thyristor-stabilizers`):
- 10KVA (50-255V), 10KVA (95-250V), 20KVA (50-255V), 30KVA (50-255V)

**Hybrid inverter capacity cluster** (broad term `hybrid inverter` → `/products/hybrid-inverters`):
- 3KW/24V (2400W & 3000W MPPT), 3.6KW/24V, 5KW/48V (5000W & 4000W zero-transfer), 5.5KW/48V, 6KW/48V expandable

**Heavy-duty inverter cluster** (broad term `heavy-duty inverter` → `/products/heavy-duty-inverters`):
- 2.5KVA/24V, 3.5KVA/24V Studer, 3.8KVA/24V, 6.3KVA/48V, 6.5KVA/48V, 7.5KVA/48V

**Lithium battery cluster** (broad term `lithium battery` → `/products/lithium-batteries`):
- 5KWH/24V, 5KWH/48V (both 5.12kWh LiFePO4)

**Solar panel wattage cluster** (broad term `solar panel` → `/products/solar-panels`):
- 455W Canadian, 480W Jinko, 535W Jinko, 540W Mono, 595W Canadian

**Charge controller cluster** → `/products/solar-charge-controllers`: PRAG 40A MPPT (plus 5 accessories currently miscategorised here)

**Protective device cluster** → `/products/protective-device`: DS50 AC SPD, PV40 DC SPD

**Gaps identified:** No 1-3KVA small relay stabilizers in the catalogue; no lithium batteries above 5kWh; no solar panels below 455W. These are reported as future opportunities only (Section J).

---

## J. Future SEO opportunities (report only — do NOT create yet)

| Opportunity | Detail |
|-------------|--------|
| Capacity landing pages | Multiple 10/20/30/50/100/200kVA stabilizers and 3/5/6kW inverters could eventually support capacity-specific landing pages (e.g. `/10kva-stabilizer`). **FUTURE OPPORTUNITY — do not create in Step 10.** |
| Product comparison content | Relay vs Servo vs Thyristor stabilizer comparison; Hybrid vs Heavy-duty inverter comparison; Lithium vs lead-acid battery comparison. |
| Category buying guides | How to choose a voltage stabilizer by kVA; how to size a hybrid inverter; solar panel wattage guide for Nigeria. |
| Category FAQs | Already added on category pages in Step 9; expand with product-specific questions. |
| Product gaps | Consider adding small (1-3KVA) relay stabilizers, larger lithium batteries (>5kWh), and lower-wattage solar panels to round out clusters. |

---

## K. Workbook location

```
PRAG_Product_SEO_Master_Audit.xlsx
```

Located at the prag-b2b project root: `/Users/ralphmore/Documents/GitHub/prag-b2b/PRAG_Product_SEO_Master_Audit.xlsx`

**Sheets:**
1. **Master Audit** — 58 rows × 40 columns (every product, full audit + recommendations; `PRAG Recommendation` and `Approval Status` left blank for review)
2. **Summary** — inventory + recommendation + priority + issue totals
3. **Duplicate Review** — 6 rows (3 duplicate pairs + near-duplicates)
4. **Data Issues** — 20 rows (spec conflicts, inaccurate copy, missing categories, missing prices)
5. **Taxonomy Review** — 9 rows (category reassignment recommendations; not implemented)
6. **SEO Opportunities** — 12 rows (clusters + future opportunities)

Supporting raw data: `scripts/out/all-products.json` (full WC product dump) and `scripts/out/step10-analysis.json` (structured audit).

---

## L. Confirmation

```
No product changes implemented.
Step 11 not started.
```

**No production product content was modified during Step 10.** Specifically, no WooCommerce data, product titles, descriptions, SEO overrides, product names, images, categories, prices, stock, slugs, or preferred canonical routing were changed. The `preferredProductCategory()` logic in `lib/seoTaxonomy.ts` was not modified. No new routes or capacity landing pages were created. The audit package is ready for PRAG review before any implementation begins.

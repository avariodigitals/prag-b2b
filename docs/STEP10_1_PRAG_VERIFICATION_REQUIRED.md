# PRAG Step 10.1 — PRAG Verification Required

**Date:** 2026-08-09
**Purpose:** PRAG review needed before product SEO implementation can begin.
**Instructions:** Please fill in the "PRAG confirmation" column for each row.

---

## 1. Specifications

### 1.1 Lithium battery capacity & voltage rounding

Both lithium batteries use nominal values in the product name but actual cell values in the description. PRAG must confirm which convention is the official one.

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 1 | 5KWH/24V Lithium Battery | 60488 | Please confirm the correct usable capacity to display: | Name: **5kWh** / Description: **5.12kWh** | A. 5kWh (nominal) — B. 5.12kWh (actual) — C. Other: ______ | |
| 2 | 5KWH/24V Lithium Battery | 60488 | Please confirm the correct nominal voltage to display: | Name: **24V** / Description: **25.6V** | A. 24V (nominal) — B. 25.6V (actual cell) — C. Other: ______ | |
| 3 | 5KWH/48V Lithium Battery | 60487 | Please confirm the correct usable capacity to display: | Name: **5kWh** / Description: **5.12kWh** | A. 5kWh (nominal) — B. 5.12kWh (actual) — C. Other: ______ | |
| 4 | 5KWH/48V Lithium Battery | 60487 | Please confirm the correct nominal voltage to display: | Name: **48V** / Description: **51.2V** | A. 48V (nominal) — B. 51.2V (actual cell) — C. Other: ______ | |

---

## 2. Duplicate Products

### 2.1 3KW/24V Hybrid Inverter (3000W-MPPT) — two records with the same name

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 5 | 3KW/24V Hybrid Inverter (3000W-MPPT) | 60297 & 60486 | Two products have the identical name "3KW/24V Hybrid Inverter (3000W-MPPT)" but different SKUs, prices, slugs, descriptions and images. Are these: | Record A (60297): SKU 4076, ₦502,900, slug `3kw-24v-hybrid-inverter-3000w-mppt`, already in hybrid-inverters. Record B (60486): SKU 4107, ₦456,600, slug `...-2`, was in inverters (now fixed to hybrid-inverters). | A. Same product — keep 60297 as primary, retire/redirect 60486 — B. Same product — keep 60486 as primary, retire/redirect 60297 — C. Distinct variants — keep both, differentiate copy — D. Other: ______ | |

### 2.2 15KVA Relay Voltage Stabilizer (45-280V) — two records with the same name

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 6 | 15KVA Relay Voltage Stabilizer (45-280V) | 60345 & 60625 | Two products have the identical name "15KVA Relay Voltage Stabilizer (45-280V)" but different SKUs, prices, slugs, descriptions and images. Are these: | Record A (60345): SKU 4132, ₦411,400, slug `15kva-relay-voltage-stabilizer-45-280v`. Record B (60625): SKU 4188, ₦417,400, slug `...-2`. | A. Same product — keep 60345 as primary, retire/redirect 60625 — B. Same product — keep 60625 as primary, retire/redirect 60345 — C. Distinct variants — keep both, differentiate copy — D. Other: ______ | |

### 2.3 5KWH/24V vs 5KWH/48V Lithium Battery — near-duplicate

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 7 | 5KWH/24V & 5KWH/48V Lithium Battery | 60488 & 60487 | Two lithium batteries differ only by voltage (24V vs 48V). Same capacity (5kWh), same price (₦1,200,000), both out of stock. Are these: | 60488: 24V, SKU 4104. 60487: 48V, SKU 4105. | A. Distinct variants — keep both (different system voltages) — B. Other: ______ | |

---

## 3. Taxonomy

All 9 taxonomy issues from Step 10 have been resolved with safe fixes (see cleanup report). No taxonomy items remain for PRAG verification.

**Note:** The audit script flags "Battery Status Processor BSP-500" and "Battery Temperature Sensor Studer BTS-01" as taxonomy issues because "battery" appears in their names. These are **false positives** — both are Studer accessories (now correctly in `accessories` only) and are intentionally excluded from the SEO catalogue. No action needed.

---

## 4. Pricing

### 4.1 Solar panels without prices

Four solar panels have empty price fields. All are marked `virtual: true` and `downloadable: true` in WooCommerce (which is unusual for physical solar panels and may indicate a data entry issue).

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 8 | 455W Canadian Mono Panel | 60452 | This product has no price set. Should it: | Price: empty / Stock: instock / Virtual+Downloadable: true | A. Price required — please provide ₦______ — B. Price on request (quote only) — C. Intentionally unpriced — D. Other: ______ | |
| 9 | 535W Jinko Mono Solar Panel | 60434 | This product has no price set. Should it: | Price: empty / Stock: outofstock / Virtual+Downloadable: true | A. Price required — please provide ₦______ — B. Price on request (quote only) — C. Intentionally unpriced — D. Other: ______ | |
| 10 | 540W Mono Panel | 60433 | This product has no price set. Should it: | Price: empty / Stock: instock / Virtual+Downloadable: true | A. Price required — please provide ₦______ — B. Price on request (quote only) — C. Intentionally unpriced — D. Other: ______ | |
| 11 | 595W Canadian Mono Panel | 60432 | This product has no price set. Should it: | Price: empty / Stock: instock / Virtual+Downloadable: true | A. Price required — please provide ₦______ — B. Price on request (quote only) — C. Intentionally unpriced — D. Other: ______ | |

### 4.2 Stabilizer without price

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 12 | 20KVA Relay Voltage Stabilizer (95-280V) | 60309 | This product has no price set and is out of stock. Should it: | Price: empty / Stock: outofstock | A. Price required — please provide ₦______ — B. Price on request (quote only) — C. Intentionally unpriced (discontinued) — D. Other: ______ | |

### 4.3 Solar panel virtual/downloadable flag

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 13 | 455W, 535W, 540W, 595W solar panels | 60452, 60434, 60433, 60432 | These 4 solar panels are marked `virtual: true` and `downloadable: true` in WooCommerce. Solar panels are physical products. Should these flags be: | Virtual: true / Downloadable: true | A. Set both to false (physical products) — B. Leave as-is — C. Other: ______ | |

---

## 5. SKU / Data

### 5.1 Missing SKUs

Step 10 found **0 missing SKUs**. Every product has a SKU. No action needed.

### 5.2 Inaccurate solar panel short descriptions

Three solar panels have a short description that says "High Quality and Efficient **Canadian** Solar Panel" but the products are not all Canadian-brand.

| S/N | Product | WC ID | Question | Current values | Recommended option | PRAG confirmation |
|-----|---------|-------|----------|-----------------|-------------------|-------------------|
| 14 | 480W Jinko Mono Panel | 60462 | Short description says "Canadian Solar Panel" but product is Jinko brand. Correct description should say: | Current: "High Quality and Efficient Canadian Solar Panel" | A. "High Quality and Efficient Jinko Solar Panel" — B. Other: ______ | |
| 15 | 535W Jinko Mono Solar Panel | 60434 | Short description says "Canadian Solar Panel" but product is Jinko brand. Correct description should say: | Current: "High Quality and Efficient Canadian Solar Panel Order Now" | A. "High Quality and Efficient Jinko Solar Panel" — B. Other: ______ | |
| 16 | 540W Mono Panel | 60433 | Short description says "Canadian Solar Panel" but product is a generic Mono panel. Correct description should say: | Current: "High Quality and Efficient Canadian Solar Panel Order Now" | A. "High Quality and Efficient Mono Solar Panel" — B. Other: ______ | |

---

## Summary

| Category | Questions | Awaiting PRAG |
|----------|-----------|---------------|
| Specifications | 4 | 4 |
| Duplicate Products | 3 | 3 |
| Taxonomy | 0 | 0 (all resolved) |
| Pricing | 6 | 6 |
| SKU/Data | 3 | 3 |
| **Total** | **16** | **16** |

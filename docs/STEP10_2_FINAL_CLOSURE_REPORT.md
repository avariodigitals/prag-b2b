# PRAG Step 10.2 — Final Closure Report

**Site:** https://www.prag.global
**Date:** 2026-08-09
**Phase:** FINAL CLOSURE (shared-image alt fix + live validation)
**Live site tested:** https://www.prag.global (not localhost)

---

## Final metrics

| Metric | Value |
|--------|-------|
| Indexable products | **49** |
| SEO_READY implemented | **39** |
| PRAG_REVIEW_REQUIRED | **6** |
| P3 parked | **4** |
| Shared media attachments found | **14** |
| Product-context alt implementation | **PASS** |
| Shared-image collision tests | **PASS** |
| Live SEO title tests | **PASS** |
| Live meta description tests | **PASS** |
| Live canonical tests | **PASS** |
| Live schema tests | **PASS** |
| Live internal-link tests | **PASS** |
| Broken links | **0** |
| Canonical errors | **0** |
| Incorrect shared-image alt text | **0** |
| Build | **PASS** |

---

## 1. Shared WooCommerce image alt behaviour — FIXED

### Problem

Some WooCommerce products share the same media attachment (same image ID). WC stores alt text on the attachment, not per-product. Updating the attachment-level alt with a product-specific description creates a conflict: the last product update wins, causing the wrong product's alt text to appear on other products sharing that image.

### Solution

Product-page rendering now derives alt text from the current product context, not from the shared attachment metadata.

**Implementation:** `resolveProductImageAlt()` in `lib/seoMeta.ts`

```
if image-specific alt exactly matches the product-context alt
    use image-specific alt (it is accurate for this product)
else
    use safe product-context alt: "PRAG {Product Name}"
```

This guarantees:
- Product A page → alt always refers to Product A
- Product B page → alt always refers to Product B

...even when the underlying WC media attachment is shared and has a different product's alt text stored at the attachment level.

### Shared media attachments

**14 shared media attachments** found across the catalogue:

| Media ID | Shared by | Products |
|----------|-----------|----------|
| 59978 | 3 products | 20KVA Relay, 25KVA Relay, 15KVA Relay (PRAG_REVIEW) |
| 59976 | 2 products | 10KVA Thyristor 50-255V, 10KVA Thyristor 95-250V |
| 59988 | 2 products | 6.3KVA Hybrid, 3.8KVA Hybrid |
| 59818 | 5 products | 5 solar panels (455W, 480W, 535W, 540W, 595W) |
| 59600 | 5 products | 5 solar panels (same as above) |
| 59755 | 2 products | XCOM-LAN, XCOM-GSM (both excluded accessories) |
| 59516 | 2 products | 6.5KVA Heavy-duty, 7.5KVA Heavy-duty |
| 59517-59523 | 2 products each | 6.5KVA Heavy-duty, 7.5KVA Heavy-duty (7 additional images) |

### WC attachment-level alt text

For shared attachments: left attachment metadata alone — frontend context overrides it. No guessing what images depict beyond available evidence.

For unique attachments (used by one product): WC attachment alt remains as set in Step 10.2 ("PRAG {product name}") — accurately describes the image.

---

## 2. Shared-image collision tests — PASS

### Test 1: Relay stabilizer pair (media ID 59978)

| Page | Expected alt | Actual alt | Result |
|------|-------------|------------|--------|
| 20KVA Relay (45-280V) | PRAG 20KVA Relay Voltage Stabilizer (45-280V) | PRAG 20KVA Relay Voltage Stabilizer (45-280V) | **PASS** |
| 25KVA Relay (45-280V) | PRAG 25KVA Relay Voltage Stabilizer (45-280V) | PRAG 25KVA Relay Voltage Stabilizer (45-280V) | **PASS** |

### Test 2: Thyristor stabilizer pair (media ID 59976)

| Page | Expected alt | Actual alt | Result |
|------|-------------|------------|--------|
| 10KVA Thyristor (50-255V) | PRAG 10KVA Thyristor Voltage Stabilizer (50-255V) | PRAG 10KVA Thyristor Voltage Stabilizer (50-255V) | **PASS** |
| 10KVA Thyristor (95-250V) | PRAG 10KVA Thyristor Voltage Stabilizer (95-250V) | PRAG 10KVA Thyristor Voltage Stabilizer (95-250V) | **PASS** |

### Test 3: Heavy-duty inverter pair (media IDs 59516-59523)

| Page | Expected alt | Actual alt | Result |
|------|-------------|------------|--------|
| 6.5KVA/48V Heavy-Duty | PRAG 6.5KVA/48V Heavy-Duty Inverter | PRAG 6.5KVA/48V Heavy-Duty Inverter | **PASS** |
| 7.5KVA/48V Heavy-Duty | PRAG 7.5KVA/48V Heavy-Duty Inverter | PRAG 7.5KVA/48V Heavy-Duty Inverter | **PASS** |

---

## 3. Live sample validation — PASS

Tested against **https://www.prag.global** (not localhost/dev server).

### 9 products tested

| # | Category | Product | HTTP | Title | Meta | Canonical | Robots | Product | Offer | Breadcrumb | Int. Links | PRAG B2B |
|---|----------|---------|------|-------|------|-----------|--------|---------|-------|------------|------------|----------|
| 1 | Hybrid inverter | 3kW 24V (2400W MPPT) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 2 | Hybrid inverter | 5kW 48V (5000W MPPT) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 3 | Relay stabilizer | 20kVA (45-280V) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 4 | Relay stabilizer | 5kVA (95-270V) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 5 | Servo stabilizer | 200kVA 3-phase (304-456V) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 6 | Thyristor stabilizer | 10kVA (50-255V) | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 7 | Heavy-duty inverter | 2.5kVA 24V | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |
| 8 | Solar panel | 535W Jinko Mono | 200 | PASS | PASS | PASS | index,follow | ✓ | 0 (no price) | ✓ | ✓ | 0 |
| 9 | Protective device | DS50 AC SPD | 200 | PASS | PASS | PASS | index,follow | ✓ | ✓ | ✓ | ✓ | 0 |

### Validation details per product

**Product 1: 3kW 24V Hybrid Inverter (MPPT 2400W)**
- Title: `3kW 24V Hybrid Inverter (MPPT 2400W) | PRAG` ✓
- Meta: `PRAG 3kW 24V hybrid inverter with 2400W MPPT solar charging — entry-level solar-plus-storage...` ✓
- Canonical: `https://www.prag.global/products/hybrid-inverters/3kw-24v-hybrid-inverter-2400w-mppt` ✓
- Offer: present (price exists) ✓

**Product 5: 200kVA Servo Stabilizer**
- Title: `200kVA Servo Voltage Stabilizer (304-456V) in Nigeria | PRAG` ✓
- Meta: `PRAG 200kVA 3-phase servo voltage stabilizer — 304-456V input for heavy Nigerian industrial plants...` ✓
- Canonical: `https://www.prag.global/products/servo-voltage-stabilizers/200kva-3-phase-servo-voltage-stabilizer-304-456v` ✓

**Product 8: 535W Jinko Mono Solar Panel (no price)**
- Title: `535W Jinko Mono Solar Panel in Nigeria | PRAG` ✓
- Offer: **0** (no price → no Offer schema, price not fabricated) ✓
- Product schema: present ✓

---

## 4. Preserved work

All completed SEO work preserved — no changes to:

| Item | Status |
|------|--------|
| 39 SEO title overrides | Preserved ✓ |
| 39 meta descriptions | Preserved ✓ |
| 6 verified description rewrites | Preserved ✓ |
| ProductContextLinks component | Preserved ✓ |
| Step 5 canonical taxonomy | Preserved ✓ |
| Step 8 SEO override architecture | Preserved ✓ |
| Product slugs | Unchanged ✓ |
| Prices | Unchanged ✓ |
| Stock status | Unchanged ✓ |
| SKUs | Unchanged ✓ |
| Catalogue status | Unchanged ✓ |
| PRAG-review parked products | Not optimised ✓ |

---

## 5. Deployment

### prag-b2b
- Commit: `2f05455` on `pixelright` branch
- Pushed to `origin/pixelright`
- Vercel deployment triggered and completed
- Live site confirmed serving new code (product-context alt + SEO overrides)

### Prag-Admin
- Commit: `5a7c454` on `master` branch
- Pushed to `origin/master`
- Vercel deployment triggered and completed
- Public API now includes `seoOverrides` in response

### WordPress
- 39 SEO overrides synced to WordPress admin-config endpoint
- Verified: 39 entries present and served via Prag-Admin public API

---

## 6. Files modified in this closure

### prag-b2b

| File | Change |
|------|--------|
| `lib/seoMeta.ts` | Added `resolveProductImageAlt()` + `cleanProductNameForAlt()` functions |
| `components/ProductDetailView.tsx` | Use `resolveProductImageAlt()` for main image + gallery thumbnails |
| `scripts/step10-2-sync-seo-overrides-to-wp.mjs` | New script to sync SEO overrides to WordPress |

### Prag-Admin

| File | Change |
|------|--------|
| `app/api/public/b2b-content/route.ts` | Added `seoOverrides: store.seoOverrides` to public API response |

---

## 7. Restrictions compliance

| Restriction | Status |
|-------------|--------|
| Did not reopen product catalogue decisions | ✓ |
| Did not keyword-stuff alt text | ✓ |
| Did not guess image content beyond available evidence | ✓ |
| Did not force product-name alt on decorative gallery images unnecessarily | ✓ (product-context alt is accurate for all product page images) |
| Did not alter completed SEO work | ✓ |
| Did not optimise parked PRAG-review products | ✓ |
| Did not begin Step 11 | ✓ |

---

## 8. Stop condition

Step 10.2 is **closed**.

- ✓ Shared-image alt behaviour fixed (product-context resolution)
- ✓ 14 shared media attachments identified and handled
- ✓ Shared-image collision tests pass on live site
- ✓ 9 live sample products validated (titles, meta, canonical, schema, internal links, alt text)
- ✓ Build passes
- ✓ Deployed to production
- ✓ All preserved work intact

**Step 11 has not been started.**

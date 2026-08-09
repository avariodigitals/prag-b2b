# PRAG SEO Recovery — Step 7: Keyword Architecture & Search Appearance Audit

**Site:** https://www.prag.global
**Date:** 2026-08-09
**Status:** AUDIT + RECOMMENDATIONS ONLY — awaiting PRAG review. No code/metadata changes made.

**Intended brand/search positioning:**
> PRAG – Nigeria's #1 Inverter, Stabilizer, Battery & Solar Solutions Provider

**Retired positioning (must be removed from all SEO surfaces):**
- "Nigeria's Leading Power Engineering Company"
- "PRAG B2B" (must never appear in SEO titles, descriptions, H1, OG, or schema)

---

## 1. Indexable URL inventory (from main sitemap)

Source of truth: `app/sitemap.ts`. Redirected/noindex/retired URLs are excluded from the sitemap and are NOT audited as SEO landing pages.

### 1a. Static routes (26)
| URL | Page type |
|---|---|
| `/` | Homepage |
| `/products` | Product hub |
| `/solutions` | Solutions hub |
| `/solutions/residential` | Solution category |
| `/solutions/commercial` | Solution category |
| `/solutions/industrial` | Solution category |
| `/solutions/backup-power` | Solution category |
| `/solutions/solar-energy` | Solution category |
| `/solutions/voltage-stabilization-protection` | Solution category |
| `/about` | Static |
| `/contact` | Static |
| `/careers` | Static |
| `/distributor` | Static |
| `/find-a-distributor` | Static |
| `/knowledge-center` | Blog hub |
| `/resources` | Static |
| `/technical-support` | Static |
| `/power-calculator` | Static (tool) |
| `/free-power-assessment` | Static (lead-gen) |
| `/installations` | Case-study showcase |
| `/faq` | Static |
| `/warranty` | Static |
| `/shipping-policy` | Static (legal) |
| `/return-policy` | Static (legal) |
| `/privacy` | Static (legal) |
| `/terms-of-use` | Static (legal) |

### 1b. Product-category routes (14) — from `APPROVED_CATEGORIES`
`/products/inverters`, `/products/hybrid-inverters`, `/products/heavy-duty-inverters`, `/products/voltage-stabilizers`, `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/products/batteries`, `/products/lithium-batteries`, `/products/solar`, `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/protective-device`

### 1c. Dynamic routes
- Product detail: `/products/{preferred-category}/{slug}` (one canonical path per product, deduplicated)
- Knowledge Center articles: `/knowledge-center/{slug}` (excludes retired + redirected slugs)

### 1d. Orphan indexable routes NOT in sitemap (flag for review)
These routes render HTTP 200 with no robots block and are NOT in the sitemap. They are crawlable and could create duplicate/cannibalising indexable URLs:
- ~~`/solutions/residential-2` and its children~~ — **RESOLVED in Step 8 verification.** All four `/solutions/residential-2/*` routes already issue 308 redirects to the equivalent `/solutions/residential/*` paths via `next.config.ts` (lines 55–74). Verified in production 2026-08-09. Removed from the unresolved list.
- `/solutions/residential/home-backup-power`, `/solutions/residential/home-solar-systems`, `/solutions/residential/power-stabilization-protection` — internally linked but not in sitemap.
- `/solutions/commercial/office-backup-power`, `/solutions/commercial/power-stabilization-protection`, `/solutions/commercial/solar-for-businesses` — internally linked but not in sitemap.
- `/warranty/battery`, `/warranty/inverter`, `/warranty/solar`, `/warranty/stabilizer` — sub-pages not in sitemap.
- `/compare` — disallowed in robots (correct).

**Recommendation:** Decide for each whether to (a) add to sitemap + optimise, (b) `noindex,follow`, or (c) 308-redirect to a canonical page. `/solutions/residential-2` should almost certainly 308 → `/solutions/residential`.

---

## 2. Core keyword map (keyword ownership)

Each primary commercial keyword is assigned to ONE principal landing page. Product pages own exact model/spec queries; Knowledge Center owns informational; Solutions own problem/use-case.

### Pillar: INVERTERS
| Keyword (intent) | Owner URL | Page type | Notes |
|---|---|---|---|
| inverter / inverters in Nigeria (commercial) | `/products/inverters` | Category | Broad pillar |
| hybrid inverter | `/products/hybrid-inverters` | Category | Specific sub |
| heavy duty inverter / industrial inverter | `/products/heavy-duty-inverters` | Category | Specific sub |
| {model} inverter / {model} specs | `/products/{cat}/{slug}` | Product | Exact product |
| home inverter backup / backup power for home | `/solutions/backup-power` | Solution | Use-case |
| inverter installation / inverter for business | `/solutions/commercial`, `/solutions/industrial` | Solution | Use-case |

### Pillar: VOLTAGE STABILIZERS
| Keyword (intent) | Owner URL | Page type | Notes |
|---|---|---|---|
| voltage stabilizer / stabilizer in Nigeria | `/products/voltage-stabilizers` | Category | Broad pillar |
| relay voltage stabilizer | `/products/relay-voltage-stabilizers` | Category | Specific sub |
| servo voltage stabilizer | `/products/servo-voltage-stabilizers` | Category | Specific sub |
| thyristor stabilizer | `/products/thyristor-stabilizers` | Category | Specific sub |
| advanced stabilizer | `/products/advanced-stabilizers` | Category | Specific sub |
| {model} stabilizer specs | `/products/{cat}/{slug}` | Product | Exact product |
| voltage protection / voltage fluctuation solution | `/solutions/voltage-stabilization-protection` | Solution | Problem/use-case |

### Pillar: BATTERIES
| Keyword (intent) | Owner URL | Page type | Notes |
|---|---|---|---|
| battery / inverter battery / solar battery (commercial) | `/products/batteries` | Category | Broad pillar |
| lithium battery / lithium inverter battery | `/products/lithium-batteries` | Category | Specific sub |
| {model} battery specs | `/products/{cat}/{slug}` | Product | Exact product |
| battery backup solution / energy storage for home | `/solutions/backup-power` | Solution | Use-case |

### Pillar: SOLAR (required product/solution split)
| Keyword (intent) | Owner URL | Page type | Notes |
|---|---|---|---|
| solar panels / buy solar panels Nigeria | `/products/solar-panels` | Category | Equipment |
| solar charge controller / MPPT / PWM | `/products/solar-charge-controllers` | Category | Equipment |
| solar products / solar equipment | `/products/solar` | Category | Equipment hub |
| {model} solar panel / {model} controller specs | `/products/{cat}/{slug}` | Product | Exact product |
| solar installation / solar energy systems / solar solution for home/business | `/solutions/solar-energy` | Solution | Service/system intent |
| solar for business / commercial solar | `/solutions/commercial` (+ `/solutions/solar-energy`) | Solution | Use-case |

**Critical rule (per brief):** `/products/solar` = solar **products/equipment**. `/solutions/solar-energy` = solar **installation/systems/service**. These two must NOT target the same intent. Currently they overlap (see §3).

### Other owned intents
| Keyword (intent) | Owner URL |
|---|---|
| PRAG / PRAG Nigeria / power solutions company | `/` |
| power solutions / power engineering company Nigeria | `/solutions` |
| residential power solutions Nigeria | `/solutions/residential` |
| commercial power solutions Nigeria | `/solutions/commercial` |
| industrial power solutions Nigeria | `/solutions/industrial` |
| PRAG installations / power installation projects | `/installations` |
| PRAG about / power engineering company | `/about` |
| power guide / inverter vs stabilizer / informational Q&A | `/knowledge-center/{slug}` |

---

## 3. Keyword cannibalisation findings

| # | Conflict | Pages | Issue | Recommended resolution |
|---|---|---|---|---|
| C1 | Solar product vs solar solution | `/products/solar` ↔ `/solutions/solar-energy` | `/products/solar` description says "solar solutions, designed to maximize energy efficiency" — uses solution language. Both compete for "solar solutions". | Reword `/products/solar` to equipment/catalog language ("solar panels, charge controllers and solar equipment"). Reserve "solar installation / solar energy systems" for `/solutions/solar-energy`. |
| C2 | Stabilizer product vs stabilizer solution | `/products/voltage-stabilizers` ↔ `/solutions/voltage-stabilization-protection` | Both target "voltage stabilizer" + "voltage protection". Category is product-buy intent; solution is problem intent. Currently both use generic stabilizer copy. | Category = "buy voltage stabilizers" (product list). Solution = "voltage fluctuation problems / protection strategy". Differentiate copy + title. |
| C3 | Backup power solution vs inverter/battery products | `/solutions/backup-power` ↔ `/products/inverters`, `/products/batteries` | `/solutions/backup-power` links only to `/products/inverters` for all 3 cards. Batteries excluded. Backup-power intent overlaps both inverter and battery commercial intent. | Solution page = use-case (keep lights on during outages). Link to BOTH inverters and batteries. Products own "buy inverter" / "buy battery". |
| C4 | Residential sub-pages vs top solution pages | `/solutions/residential/home-backup-power` ↔ `/solutions/backup-power` | Both target "home backup power". The residential sub-page is not in sitemap but is indexable. | Either consolidate (308 residential sub → `/solutions/backup-power` or merge into residential) or differentiate (residential sub = "home" only, backup-power = cross-segment). Decide and add canonical to sitemap. |
| C5 | ~~Duplicate residential route~~ **RESOLVED** | `/solutions/residential-2/*` ↔ `/solutions/residential/*` | Entire `residential-2` directory duplicates `residential`. | Already 308-redirected in `next.config.ts` (lines 55–74). Verified in production 2026-08-09. No action needed. |
| C6 | Commercial sub-pages vs top solution pages | `/solutions/commercial/office-backup-power` ↔ `/solutions/backup-power`; `/solutions/commercial/solar-for-businesses` ↔ `/solutions/solar-energy` | Overlap on backup-power and solar intent. Sub-pages not in sitemap. | Decide canonical owner per intent; 308 or noindex the commercial sub-pages, or add to sitemap with differentiated commercial-only copy. |
| C7 | Inverters category mis-label | `/products/inverters` | DISPLAY description: "A selection of **solar inverters** that convert DC power from solar panels into AC power." Inverters category is broader than solar (also backup inverters). Undersells non-solar inverter queries. | Reword to cover all inverter types (backup, hybrid, heavy-duty), not just solar. |

---

## 4. Current metadata audit (priority pages)

Title template in `layout.tsx`: `default: "PRAG - Nigeria's Leading Power Engineering Company."`, `template: '%s - PRAG'`. Pages that supply a `title` get `"<title> - PRAG"`; pages without a title fall back to the default (old positioning). Pages that hardcode "– PRAG B2B" bypass the template.

| URL | Current `<title>` | Current meta description | H1 | Canonical | Robots | OG title | OG description | Schema |
|---|---|---|---|---|---|---|---|---|
| `/` | PRAG - Nigeria's Leading Power Engineering Company. (layout default; page sets no title) | Enterprise power engineering solutions across Nigeria. (layout default) | Hero title from admin (fallback: "Low or High Voltage? Unreliable or No Power? Get PRAG") | https://www.prag.global/ | index (default) | PRAG – Nigeria's Leading Power Engineering Company | Enterprise power engineering solutions across Nigeria. | WebSite + Organization |
| `/products` | Products – PRAG B2B | Browse all PRAG product categories and power technologies. | Admin hero (fallback "Products") | https://www.prag.global/products | index | Products – PRAG B2B | Browse all PRAG product categories and power technologies. | None |
| `/products/inverters` | Inverters – PRAG B2B | A selection of solar inverters that convert DC power from solar panels into AC power. | Admin hero (fallback "Inverters") | https://www.prag.global/products/inverters | index | Inverters – PRAG B2B | (same as desc) | None |
| `/products/hybrid-inverters` | Hybrid Inverters – PRAG B2B | Explore PRAG hybrid inverters — combining solar charging and battery backup in a single unit. | "Hybrid Inverters" | …/products/hybrid-inverters | index | Hybrid Inverters – PRAG B2B | (same) | None |
| `/products/heavy-duty-inverters` | Heavy-Duty Inverters – PRAG B2B | Explore PRAG heavy-duty inverters — built for demanding loads and continuous operation. | "Heavy-Duty Inverters" | …/products/heavy-duty-inverters | index | Heavy-Duty Inverters – PRAG B2B | (same) | None |
| `/products/voltage-stabilizers` | Voltage Stabilizers – PRAG B2B | Explore our range of voltage stabilizers, designed to protect your appliances from power fluctuations. | "Voltage Stabilizers" | …/products/voltage-stabilizers | index | Voltage Stabilizers – PRAG B2B | (same) | None |
| `/products/relay-voltage-stabilizers` | Relay Voltage Stabilizers – PRAG B2B | Explore PRAG relay voltage stabilizers — fast, affordable voltage protection for home and office. | "Relay Voltage Stabilizers" | …/products/relay-voltage-stabilizers | index | Relay Voltage Stabilizers – PRAG B2B | (same) | None |
| `/products/servo-voltage-stabilizers` | Servo Voltage Stabilizers – PRAG B2B | Explore PRAG servo voltage stabilizers — precise voltage correction for sensitive equipment. | "Servo Voltage Stabilizers" | …/products/servo-voltage-stabilizers | index | Servo Voltage Stabilizers – PRAG B2B | (same) | None |
| `/products/thyristor-stabilizers` | Thyristor Stabilizers – PRAG B2B | Explore PRAG thyristor stabilizers — maintenance-free, high-precision voltage stabilization. | "Thyristor Stabilizers" | …/products/thyristor-stabilizers | index | Thyristor Stabilizers – PRAG B2B | (same) | None |
| `/products/advanced-stabilizers` | Advanced Stabilizers – PRAG B2B | Explore PRAG advanced stabilizers — cutting-edge voltage protection technology. | "Advanced Stabilizers" | …/products/advanced-stabilizers | index | Advanced Stabilizers – PRAG B2B | (same) | None |
| `/products/batteries` | Batteries – PRAG B2B | Explore our wide range of batteries for solar power, inverters, and other energy storage solutions. | "Batteries" | …/products/batteries | index | Batteries – PRAG B2B | (same) | None |
| `/products/lithium-batteries` | Lithium Batteries – PRAG B2B | Explore PRAG lithium batteries — lightweight, long-lasting energy storage for inverter and solar systems. | "Lithium Batteries" | …/products/lithium-batteries | index | Lithium Batteries – PRAG B2B | (same) | None |
| `/products/solar` | Solar – PRAG B2B | Explore our range of solar solutions, designed to maximize energy efficiency and protect against voltage fluctuations. | "Solar" | …/products/solar | index | Solar – PRAG B2B | (same) | None |
| `/products/solar-panels` | Solar Panels – PRAG B2B | Explore PRAG solar panels — high-efficiency panels for residential and commercial solar installations. | "Solar Panels" | …/products/solar-panels | index | Solar Panels – PRAG B2B | (same) | None |
| `/products/solar-charge-controllers` | Solar Charge Controllers – PRAG B2B | Explore PRAG solar charge controllers — MPPT and PWM controllers for optimal solar charging. | "Solar Charge Controllers" | …/products/solar-charge-controllers | index | Solar Charge Controllers – PRAG B2B | (same) | None |
| `/products/protective-device` | Protective Devices – PRAG B2B | Explore PRAG protective devices — surge protection for solar and power systems. | "Protective Devices" | …/products/protective-device | index | Protective Devices – PRAG B2B | (same) | None |
| `/solutions` | Power Solutions | From industrial plants to residential homes, we engineer power systems that never let you down. | Admin hero (fallback "Power Solutions for Every Challenge") | https://www.prag.global/solutions | index | Power Solutions | (same) | None |
| `/solutions/residential` | Residential Power Solutions | Keep your home comfortable, secure, and fully powered with smart energy solutions designed for everyday living. | "Reliable Power for Modern Living" (hardcoded) | …/solutions/residential | index | (inherits layout default OG) | (inherits layout default) | None |
| `/solutions/commercial` | Commercial Power Solutions | Efficient and reliable power solutions built to support daily business operations without interruption. | Admin hero (content.heroTitle) | …/solutions/commercial | index | Commercial Power Solutions | (same as desc) | None |
| `/solutions/industrial` | Industrial Power Solutions | Engineered power for heavy-duty operations. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption. | Admin hero (content.heroTitle) | …/solutions/industrial | index | (inherits layout default OG) | (inherits layout default) | None |
| `/solutions/backup-power` | Backup Power Solutions | Stay powered during outages with PRAG inverter and battery backup systems. | Admin hero (content.heroTitle) | …/solutions/backup-power | index | (inherits layout default OG) | (inherits layout default) | None |
| `/solutions/solar-energy` | Solar Energy Solutions | Reduce energy costs and generator dependence with PRAG solar power systems. | Admin hero (content.heroTitle) | …/solutions/solar-energy | index | (inherits layout default OG) | (inherits layout default) | None |
| `/solutions/voltage-stabilization-protection` | Voltage Stabilization & Protection Solutions | Protect your equipment from voltage fluctuations with PRAG stabilization and protection systems. | Admin hero (content.heroTitle) | …/solutions/voltage-stabilization-protection | index | (inherits layout default OG) | (inherits layout default) | None |
| `/about` | About Us | (none — falls back to layout default "Enterprise power engineering solutions across Nigeria.") | Admin hero (fallback "Engineering Reliable Power Solutions for Real-World Challenges") | https://www.prag.global/about | index | (inherits layout default OG) | (inherits layout default) | None |
| `/installations` | Installations | (none — falls back to layout default) | (in InstallationsView) | https://www.prag.global/installations | index | (inherits layout default OG) | (inherits layout default) | None |
| `/knowledge-center` | Knowledge Center | Practical guides, honest comparisons, and expert insights from PRAG's engineering team. | "Understand Power. Make Better Decisions." (hardcoded) | https://www.prag.global/knowledge-center | index | (inherits layout default OG) | (inherits layout default) | None |

**Audit-wide issues:**
1. Every category page title ends in "– PRAG B2B" (banned wording).
2. `/about`, `/installations`, `/solutions/residential`, `/solutions/industrial`, `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`, `/knowledge-center` have **no explicit meta description** and **no explicit OG title/description** → they inherit the layout default ("Nigeria's Leading Power Engineering Company" / "Enterprise power engineering solutions across Nigeria."). This propagates the retired positioning to many pages.
3. No BreadcrumbList, Product, Offer, or Article schema anywhere (see §8).

---

## 5. SEO recommendations workbook (priority pages)

Columns: S/N · Search Query / Target Keyword · Search Intent · Current Ranking/Relevant URL · Current SEO Title · Current Meta Description · Recommended PRAG URL · Recommended SEO Title · Recommended Meta Description · Primary Keyword · Secondary Keywords · Page Type · Current Schema · Recommended Schema · My Recommendation / Reason · PRAG Recommendation · Approval Status.

`PRAG Recommendation` and `Approval Status` are left **blank** for client review. No `<meta name="keywords">` is to be emitted; Primary/Secondary Keywords are editorial only.

| S/N | Search Query / Target Keyword | Search Intent | Current Ranking/Relevant URL | Current SEO Title | Current Meta Description | Recommended PRAG URL | Recommended SEO Title | Recommended Meta Description | Primary Keyword | Secondary Keywords | Page Type | Current Schema | Recommended Schema | My Recommendation / Reason | PRAG Recommendation | Approval Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PRAG Nigeria / inverter stabilizer battery solar company | Navigational + brand commercial | `/` | PRAG - Nigeria's Leading Power Engineering Company. | Enterprise power engineering solutions across Nigeria. | `/` | PRAG – Nigeria's #1 Inverter, Stabilizer, Battery & Solar Solutions Provider | Inverters, voltage stabilizers, batteries and solar systems engineered for Nigerian homes, businesses and industries. Shop PRAG. | PRAG Nigeria | inverter, stabilizer, battery, solar, power solutions Nigeria | Homepage | WebSite + Organization | WebSite + Organization (keep; update name/description to match new positioning) | Replace retired positioning in title/description/OG/twitter. Keep WebSite+Organization schema but align `name`/`alternateName`/description. | | |
| 2 | power products / inverter stabilizer battery solar products | Commercial (catalog) | `/products` | Products – PRAG B2B | Browse all PRAG product categories and power technologies. | `/products` | Power Products – Inverters, Stabilizers, Batteries & Solar \| PRAG | Browse PRAG's full range of inverters, voltage stabilizers, batteries, solar panels and charge controllers — engineered for Nigerian power conditions. | PRAG products | inverter, voltage stabilizer, battery, solar panels, solar charge controller | Product hub | None | BreadcrumbList | Remove "PRAG B2B". Lead with the four pillars. Add BreadcrumbList. | | |
| 3 | inverter / buy inverter Nigeria | Commercial | `/products/inverters` | Inverters – PRAG B2B | A selection of solar inverters that convert DC power from solar panels into AC power. | `/products/inverters` | Inverters in Nigeria – Hybrid, Heavy-Duty & Backup Inverters \| PRAG | Buy PRAG inverters in Nigeria — hybrid, heavy-duty and backup inverters that convert battery DC to stable AC for homes, businesses and industry. | inverter Nigeria | buy inverter, hybrid inverter, heavy duty inverter, backup inverter, inverter price Nigeria | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". Fix mis-label (currently says "solar inverters" only). Cover all inverter types. | | |
| 4 | hybrid inverter | Commercial | `/products/hybrid-inverters` | Hybrid Inverters – PRAG B2B | Explore PRAG hybrid inverters — combining solar charging and battery backup in a single unit. | `/products/hybrid-inverters` | Hybrid Inverters in Nigeria – Solar + Battery in One Unit \| PRAG | PRAG hybrid inverters combine solar charging and battery backup in a single unit — ideal for Nigerian homes wanting solar with storage. | hybrid inverter | hybrid solar inverter, hybrid inverter Nigeria, best hybrid inverter | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". Sharpen "hybrid" definition. | | |
| 5 | heavy duty inverter / industrial inverter | Commercial | `/products/heavy-duty-inverters` | Heavy-Duty Inverters – PRAG B2B | Explore PRAG heavy-duty inverters — built for demanding loads and continuous operation. | `/products/heavy-duty-inverters` | Heavy-Duty Inverters in Nigeria – Industrial & Continuous Duty \| PRAG | PRAG heavy-duty inverters are built for demanding loads and continuous operation — engineered for factories, plants and large facilities in Nigeria. | heavy duty inverter | industrial inverter, continuous duty inverter, high capacity inverter | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 6 | voltage stabilizer / buy stabilizer Nigeria | Commercial | `/products/voltage-stabilizers` | Voltage Stabilizers – PRAG B2B | Explore our range of voltage stabilizers, designed to protect your appliances from power fluctuations. | `/products/voltage-stabilizers` | Voltage Stabilizers in Nigeria – Relay, Servo & Thyristor \| PRAG | Buy PRAG voltage stabilizers in Nigeria — relay, servo and thyristor stabilizers that protect appliances and equipment from voltage fluctuations. | voltage stabilizer | stabilizer Nigeria, voltage regulator, buy stabilizer, voltage protection | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". Differentiate from `/solutions/voltage-stabilization-protection` (problem intent). | | |
| 7 | relay voltage stabilizer | Commercial | `/products/relay-voltage-stabilizers` | Relay Voltage Stabilizers – PRAG B2B | Explore PRAG relay voltage stabilizers — fast, affordable voltage protection for home and office. | `/products/relay-voltage-stabilizers` | Relay Voltage Stabilizers in Nigeria – Fast, Affordable Protection \| PRAG | PRAG relay voltage stabilizers deliver fast, affordable voltage protection for home and office appliances across Nigeria. | relay voltage stabilizer | relay stabilizer, affordable voltage stabilizer, home stabilizer | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 8 | servo voltage stabilizer | Commercial | `/products/servo-voltage-stabilizers` | Servo Voltage Stabilizers – PRAG B2B | Explore PRAG servo voltage stabilizers — precise voltage correction for sensitive equipment. | `/products/servo-voltage-stabilizers` | Servo Voltage Stabilizers in Nigeria – Precise Voltage Correction \| PRAG | PRAG servo voltage stabilizers provide precise voltage correction for sensitive and high-value equipment in Nigeria. | servo voltage stabilizer | servo stabilizer, precision voltage stabilizer, servo voltage regulator | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 9 | thyristor stabilizer | Commercial | `/products/thyristor-stabilizers` | Thyristor Stabilizers – PRAG B2B | Explore PRAG thyristor stabilizers — maintenance-free, high-precision voltage stabilization. | `/products/thyristor-stabilizers` | Thyristor Stabilizers in Nigeria – Maintenance-Free, High Precision \| PRAG | PRAG thyristor stabilizers offer maintenance-free, high-precision voltage stabilization for industrial and commercial use in Nigeria. | thyristor stabilizer | thyristor voltage stabilizer, static stabilizer, maintenance-free stabilizer | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 10 | advanced stabilizer | Commercial | `/products/advanced-stabilizers` | Advanced Stabilizers – PRAG B2B | Explore PRAG advanced stabilizers — cutting-edge voltage protection technology. | `/products/advanced-stabilizers` | Advanced Voltage Stabilizers in Nigeria – Cutting-Edge Protection \| PRAG | PRAG advanced stabilizers use cutting-edge voltage protection technology for demanding Nigerian power conditions. | advanced stabilizer | advanced voltage stabilizer, smart stabilizer, modern voltage protection | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". Clarify what "advanced" means technically. | | |
| 11 | battery / inverter battery / solar battery Nigeria | Commercial | `/products/batteries` | Batteries – PRAG B2B | Explore our wide range of batteries for solar power, inverters, and other energy storage solutions. | `/products/batteries` | Batteries in Nigeria – Inverter, Solar & Lithium Batteries \| PRAG | Buy PRAG batteries in Nigeria — inverter batteries, solar batteries and lithium batteries for reliable energy storage in homes and businesses. | battery Nigeria | inverter battery, solar battery, lithium battery, energy storage | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 12 | lithium battery / lithium inverter battery | Commercial | `/products/lithium-batteries` | Lithium Batteries – PRAG B2B | Explore PRAG lithium batteries — lightweight, long-lasting energy storage for inverter and solar systems. | `/products/lithium-batteries` | Lithium Batteries in Nigeria – Long-Lasting Energy Storage \| PRAG | PRAG lithium batteries — lightweight, long-lasting energy storage for inverter and solar systems in Nigeria. Faster charging, longer life than lead-acid. | lithium battery | lithium inverter battery, lithium battery Nigeria, LiFePO4, lithium solar battery | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 13 | solar products / solar equipment | Commercial (equipment) | `/products/solar` | Solar – PRAG B2B | Explore our range of solar solutions, designed to maximize energy efficiency and protect against voltage fluctuations. | `/products/solar` | Solar Products in Nigeria – Panels, Charge Controllers & Solar Equipment \| PRAG | Browse PRAG solar products — solar panels, charge controllers and solar equipment for residential and commercial solar setups in Nigeria. | solar products | solar equipment, solar panels, solar charge controller, buy solar Nigeria | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". **Reword away from "solar solutions"** to avoid cannibalising `/solutions/solar-energy` (C1). Equipment/catalog language only. | | |
| 14 | solar panels / buy solar panels Nigeria | Commercial | `/products/solar-panels` | Solar Panels – PRAG B2B | Explore PRAG solar panels — high-efficiency panels for residential and commercial solar installations. | `/products/solar-panels` | Solar Panels in Nigeria – High-Efficiency Panels for Home & Business \| PRAG | Buy high-efficiency PRAG solar panels in Nigeria — for residential and commercial solar installations. Durable, high-output, built for Nigerian conditions. | solar panels | buy solar panels Nigeria, solar panel price, monocrystalline solar panel, residential solar panel | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 15 | solar charge controller / MPPT / PWM | Commercial | `/products/solar-charge-controllers` | Solar Charge Controllers – PRAG B2B | Explore PRAG solar charge controllers — MPPT and PWM controllers for optimal solar charging. | `/products/solar-charge-controllers` | Solar Charge Controllers in Nigeria – MPPT & PWM Controllers \| PRAG | PRAG solar charge controllers — MPPT and PWM controllers for optimal solar charging and battery protection in Nigeria. | solar charge controller | MPPT charge controller, PWM charge controller, solar regulator | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". | | |
| 16 | protective device / surge protection | Commercial | `/products/protective-device` | Protective Devices – PRAG B2B | Explore PRAG protective devices — surge protection for solar and power systems. | `/products/protective-device` | Protective Devices in Nigeria – Surge Protection for Power Systems \| PRAG | PRAG protective devices — surge protection and safety devices for solar and power systems in Nigeria. | protective device | surge protection, surge protector, power protection device | Category | None | BreadcrumbList + ItemList | Remove "PRAG B2B". Singular slug "protective-device" but plural content — keep slug, pluralise title copy. | | |
| 17 | power solutions Nigeria / power engineering company | Commercial (services) | `/solutions` | Power Solutions | From industrial plants to residential homes, we engineer power systems that never let you down. | `/solutions` | Power Solutions in Nigeria – Residential, Commercial & Industrial \| PRAG | PRAG engineers complete power solutions across Nigeria — residential, commercial and industrial systems for backup, solar and voltage stabilization. | power solutions Nigeria | power engineering Nigeria, power systems, backup power, solar solutions | Solutions hub | None | BreadcrumbList | Add explicit description + OG (currently inherits retired default). | | |
| 18 | residential power solutions Nigeria | Commercial (use-case) | `/solutions/residential` | Residential Power Solutions | Keep your home comfortable, secure, and fully powered with smart energy solutions designed for everyday living. | `/solutions/residential` | Residential Power Solutions in Nigeria – Home Backup, Solar & Stabilizers \| PRAG | PRAG residential power solutions — home backup power, solar systems and voltage stabilizers that keep Nigerian homes powered and protected. | residential power solutions | home backup power Nigeria, home solar systems, home voltage stabilizer | Solution | None | BreadcrumbList | Add explicit OG title/description (currently inherits retired default). H1 is hardcoded "Reliable Power for Modern Living" — consider aligning to keyword. | | |
| 19 | commercial power solutions Nigeria | Commercial (use-case) | `/solutions/commercial` | Commercial Power Solutions | Efficient and reliable power solutions built to support daily business operations without interruption. | `/solutions/commercial` | Commercial Power Solutions in Nigeria – Backup, Solar & Stabilization \| PRAG | PRAG commercial power solutions — backup power, solar and voltage stabilization for offices, retail, hospitals and hospitality across Nigeria. | commercial power solutions | business power solutions, office backup power, commercial solar | Solution | None | BreadcrumbList | Sharpen to commercial intent. | | |
| 20 | industrial power solutions Nigeria | Commercial (use-case) | `/solutions/industrial` | Industrial Power Solutions | Engineered power for heavy-duty operations. PRAG delivers robust, high-capacity power systems designed to keep industrial operations running without interruption. | `/solutions/industrial` | Industrial Power Solutions in Nigeria – Heavy-Duty Power Engineering \| PRAG | PRAG industrial power solutions — heavy-duty voltage stabilization, backup and solar systems engineered for factories, plants and large facilities in Nigeria. | industrial power solutions | industrial voltage stabilizer, industrial backup power, heavy duty power systems | Solution | None | BreadcrumbList | Add explicit OG (currently inherits retired default). | | |
| 21 | backup power solution Nigeria | Commercial (use-case) | `/solutions/backup-power` | Backup Power Solutions | Stay powered during outages with PRAG inverter and battery backup systems. | `/solutions/backup-power` | Backup Power Solutions in Nigeria – Inverter & Battery Backup \| PRAG | PRAG backup power solutions — inverter and battery systems that keep Nigerian homes and businesses running through outages. Reduce generator dependence. | backup power solutions | power backup Nigeria, inverter backup, battery backup, generator alternative | Solution | None | BreadcrumbList | Add explicit OG. Link to BOTH inverters and batteries (C3). | | |
| 22 | solar installation / solar energy systems Nigeria | Commercial (service/system) | `/solutions/solar-energy` | Solar Energy Solutions | Reduce energy costs and generator dependence with PRAG solar power systems. | `/solutions/solar-energy` | Solar Energy Systems in Nigeria – Solar Installation & Design \| PRAG | PRAG solar energy systems — design and installation of solar power systems for Nigerian homes and businesses. Lower energy costs, reduce generator dependence. | solar energy systems | solar installation Nigeria, solar power system, solar solution, solar for home | Solution | None | BreadcrumbList | Reserve for **installation/system/service** intent (C1). Do NOT use "solar products" language. | | |
| 23 | voltage stabilization / voltage protection solution Nigeria | Commercial (problem/use-case) | `/solutions/voltage-stabilization-protection` | Voltage Stabilization & Protection Solutions | Protect your equipment from voltage fluctuations with PRAG stabilization and protection systems. | `/solutions/voltage-stabilization-protection` | Voltage Stabilization & Protection in Nigeria – Solve Voltage Fluctuation \| PRAG | PRAG voltage stabilization and protection solutions — engineering and products that solve voltage fluctuation and protect equipment across Nigerian facilities. | voltage stabilization | voltage protection Nigeria, voltage fluctuation solution, voltage regulation service | Solution | None | BreadcrumbList | Differentiate from `/products/voltage-stabilizers` (C2): this is problem/service, that is buy-product. | | |
| 24 | PRAG about / power engineering company Nigeria | Informational / trust | `/about` | About Us | (inherits retired default) | `/about` | About PRAG – Nigeria's Power Engineering Company Since 2005 \| PRAG | PRAG is a Nigerian power engineering company founded in 2005, designing and installing inverter, stabilizer, battery and solar systems across 36 states. | PRAG about | PRAG power engineering, about PRAG Nigeria, PRAG history | Static | None | BreadcrumbList | Add explicit title + description + OG (currently inherits retired default). | | |
| 25 | PRAG installations / power installation projects Nigeria | Informational / trust | `/installations` | Installations | (inherits retired default) | `/installations` | PRAG Installations in Nigeria – Power Systems Projects & Case Studies \| PRAG | Explore PRAG power installation projects across Nigeria — inverter, stabilizer, battery and solar systems delivered for homes, businesses and industry. | PRAG installations | power installation projects Nigeria, PRAG case studies, installed systems | Static | None | BreadcrumbList + CollectionPage | Add explicit title + description + OG. | | |
| 26 | power guide / inverter vs stabilizer / informational Q&A | Informational | `/knowledge-center` | Knowledge Center | Practical guides, honest comparisons, and expert insights from PRAG's engineering team. | `/knowledge-center` | Knowledge Center – Power Guides & Engineering Insights \| PRAG | Practical guides, honest comparisons and expert insights from PRAG's engineering team — written for Nigerian power conditions. | PRAG knowledge center | power guide Nigeria, inverter guide, stabilizer guide, solar guide | Blog hub | None | BreadcrumbList | Add explicit OG (currently inherits retired default). | | |

---

## 6. Remaining "PRAG B2B" occurrences (search-result wording)

Every template/page still capable of generating "PRAG B2B" in a search surface (title / description / H1 / OG / schema). **No changes made — listed for approval.**

| # | File:line | Surface | Current value | Proposed replacement |
|---|---|---|---|---|
| 1 | `app/layout.tsx:40` | `<title>` default | "PRAG - Nigeria's Leading Power Engineering Company." | "PRAG – Nigeria's #1 Inverter, Stabilizer, Battery & Solar Solutions Provider" |
| 2 | `app/layout.tsx:43` | meta description default | "Enterprise power engineering solutions across Nigeria." | "Inverters, voltage stabilizers, batteries and solar systems engineered for Nigerian homes, businesses and industries." |
| 3 | `app/layout.tsx:48` | OG title default | "PRAG – Nigeria's Leading Power Engineering Company" | "PRAG – Nigeria's #1 Inverter, Stabilizer, Battery & Solar Solutions Provider" |
| 4 | `app/layout.tsx:49` | OG description default | "Enterprise power engineering solutions across Nigeria." | (same as #2) |
| 5 | `app/layout.tsx:57` | OG image alt | "PRAG – Nigeria's Leading Power Engineering Company" | "PRAG – Inverters, Stabilizers, Batteries & Solar Solutions in Nigeria" |
| 6 | `app/layout.tsx:64` | Twitter title | "PRAG – Nigeria's Leading Power Engineering Company" | (same as #3) |
| 7 | `app/layout.tsx:65` | Twitter description | "Enterprise power engineering solutions across Nigeria." | (same as #2) |
| 8 | `app/layout.tsx:140` | Launch-mode logo `alt` | "PRAG B2B" | "PRAG" |
| 9 | `app/products/page.tsx:11` | `<title>` | "Products – PRAG B2B" | "Power Products – Inverters, Stabilizers, Batteries & Solar \| PRAG" |
| 10 | `app/products/page.tsx:15` | OG title | "Products – PRAG B2B" | (same as #9) |
| 11 | `app/products/[category]/page.tsx:65` | Excluded-category `<title>` | "${name} – PRAG B2B" | "${name} \| PRAG" (excluded pages are noindex anyway, but wording should still be clean) |
| 12 | `app/products/[category]/page.tsx:79` | Category `<title>` | "${name} – PRAG B2B" | Per-workbook recommendations (rows 3–16) |
| 13 | `app/products/[category]/page.tsx:83` | Category OG title | "${name} – PRAG B2B" | (match #12) |
| 14 | `app/products/[category]/[slug]/page.tsx:24` | Product fallback `<title>` | "Product – PRAG B2B" | "Product \| PRAG" |
| 15 | `app/products/[category]/[slug]/page.tsx:32` | Non-core product `<title>` | "${product.name} – PRAG B2B" | "${product.name} \| PRAG" (noindex page) |
| 16 | `app/products/[category]/[slug]/page.tsx:68` | Product fallback `<title>` | "Product – PRAG B2B" | "Product \| PRAG" |
| 17 | `app/knowledge-center/[slug]/page.tsx:160` | Excluded article `<title>` | "Article – PRAG B2B" | "Article \| PRAG" (noindex) |
| 18 | `app/knowledge-center/[slug]/page.tsx:166` | Article fallback `<title>` | "Article – PRAG B2B" | "Article \| PRAG" |
| 19 | `components/CookieConsentLoader.tsx:16` | Cookie banner `website_name` | "PRAG B2B" | "PRAG" (not a search surface, but brand consistency) |
| 20 | `app/products/[category]/page.tsx:75` | Category fallback description | "Browse ${name} from PRAG. Enterprise-grade power engineering solutions for businesses in Nigeria." | Replace with category-specific copy (remove "Enterprise-grade power engineering solutions for businesses"). |
| 21 | `app/products/[category]/[slug]/page.tsx:40` | Product fallback description | "${product.name} — available from PRAG. Enterprise-grade power engineering solutions for businesses." | "${product.name} — specs, pricing and availability from PRAG Nigeria." |

**Note on title template:** `layout.tsx` uses `template: '%s - PRAG'`. Pages that pass a `title` render `"<title> - PRAG"`. The recommended titles above use a trailing `\| PRAG` and therefore should set `title: { absolute: "..." }` (or restructure) to avoid double-suffixing. This is an implementation detail for Step 8 — flagged here for awareness.

---

## 7. Remaining old-positioning occurrences ("Nigeria's Leading Power Engineering Company" / "Enterprise power engineering…")

These are the same layout.tsx entries as §6 rows 1–7, plus two fallback descriptions (§6 rows 20–21). All are covered above. No additional occurrences of "Nigeria's Leading Power Engineering Company" were found in `app/`, `components/`, or `lib/`.

The H1s across the site do **not** contain the retired positioning (homepage H1 is admin-driven; category/solution H1s are admin-driven or keyword-relevant). The only H1 concern is `/solutions/residential` ("Reliable Power for Modern Living") and `/knowledge-center` ("Understand Power. Make Better Decisions.") being non-keyword — noted in the workbook.

---

## 8. SEO field architecture recommendation

### Current state
| Entity | Editable SEO fields in admin? | What the frontend actually renders |
|---|---|---|
| **Products** | ❌ None. Admin product editor has no SEO title/description fields. | `<title>` = `product.name` (then ` - PRAG` template). Description = `short_description` stripped to 160 chars, else `description` stripped, else hardcoded fallback. OG = product name + image. |
| **Product categories** | ❌ None. Category admin only controls visibility/order. | `<title>` = admin hero `summary` or hardcoded `DISPLAY[slug].name` + " – PRAG B2B". Description = hardcoded `DISPLAY[slug].description`. |
| **Knowledge Center articles** | ⚠️ Yoast fields exist in admin (`_yoast_wpseo_title`, `_yoast_wpseo_metadesc`, `_yoast_wpseo_focuskw`) and are saved to WordPress. **BUT the headless frontend (`lib/wordpress.ts`) does not fetch them** — it uses `post.title.rendered` and `post.excerpt.rendered`. Yoast is effectively dead on the frontend. | `<title>` = `post.title.rendered`. Description = `post.excerpt.rendered` stripped to 160 chars. OG type = article. |
| **Static Next.js pages** | ⚠️ B2B page editor has "Page title" + "Description" fields, but these feed **content/H1 fallbacks**, not dedicated SEO metadata. The actual `<title>`/meta description are **hardcoded in each `page.tsx`**. No SEO override. | Hardcoded per-route `Metadata` export. Pages without a description inherit the layout default (retired positioning). |

### Recommendation (manual override + safe automatic fallback)
Do NOT install Yoast/RankMath and assume their HTML controls the headless frontend — the frontend is Next.js and renders its own `<head>`. Instead:

1. **Add a single SEO-overrides layer** in the B2B admin store (`b2b-admin-config.json` → consumed via `getB2BPublicContent`), keyed by route, e.g.:
   ```
   seoOverrides: {
     "/products/inverters": { title: "...", description: "...", canonical: "...", robots: "index,follow", ogTitle: "...", ogDescription: "..." },
     "/products/{cat}/{slug}": { ... },   // per-product override
     "/knowledge-center/{slug}": { ... }  // per-article override
   }
   ```
2. **Frontend resolution order** (in `generateMetadata` for each route):
   a. Admin `seoOverrides[route]` (manual override) — highest priority.
   b. Yoast meta for KC articles (`_yoast_wpseo_title` / `_yoast_wpseo_metadesc`) — wire `lib/wordpress.ts` to fetch `meta` via `_fields=meta` or the Yoast REST endpoint, as a secondary source for articles only.
   c. Safe automatic fallback formula (per page type) — lowest priority.
3. **Product fallback formula** (do not bulk-optimise yet — later phase):
   - Title: `{Product Name} | PRAG`
   - Description: `{Product Name} — {first 150 chars of short_description stripped}. Available from PRAG Nigeria.`
   - Allow manual SEO-title and description overrides per product via the admin SEO-overrides layer.
4. **Category fallback formula**: `{Category Name} in Nigeria | PRAG` + category-specific description (per workbook).
5. **Static-page fallback**: each route gets a sensible default in code (per workbook), overridable via admin.
6. **Next.js must consume and render** the resolved metadata via the Metadata API (`generateMetadata` / `metadata` exports) — no reliance on WordPress `<head>` output.

This gives PRAG manual control where it matters (priority commercial pages, key products, key articles) with a safe automatic fallback everywhere else, all rendered by Next.js.

---

## 9. Schema gap report

WebSite and Organization already exist on `/` (from Step 3) and must NOT be duplicated.

| Schema type | Current state | Where it should exist | Gap / issue | Recommended action |
|---|---|---|---|---|
| **WebSite** | ✅ Present on `/` (`app/page.tsx`) | `/` only | None — keep. Do not duplicate on other pages. | Update `name`/`alternateName`/`description` to new positioning. |
| **Organization** | ✅ Present on `/` (`app/page.tsx`) | `/` only (or sitewide via layout) | `logo` URL points to `https://www.prag.global/images/prag-logo.png` — verify this file exists (public/images). If not, use the central.prag.global logo URL. | Verify logo URL; update `name`/`url`. Do not invent contact/address fields unless verified. |
| **BreadcrumbList** | ❌ Absent everywhere | Every category, product, solution, KC article, and static sub-page | Visual breadcrumbs exist on product pages (`ProductDetailView.tsx`) but emit no JSON-LD. | Add `BreadcrumbList` JSON-LD on all non-root pages, generated from the page's location in the site tree. |
| **Product** | ❌ Absent on product pages | `/products/{cat}/{slug}` | No Product schema despite product detail pages with name/image/description. | Add `Product` schema (name, image, description, brand=PRAG, sku if available, category). **Do NOT invent `aggregateRating`/`review`** — only include if real reviews exist (reviews are fetched via `getProductReviews`; include only when count > 0 and use real data). |
| **Offer** | ❌ Absent | Inside Product schema on product pages | Products have `price`/`regular_price`/`sale_price`/`stock_status` in the WC data but it is not currently fetched into the detail view metadata. | Add `Offer` inside Product schema using real price/currency (NGN) and `availability` from `stock_status`. Only when price is present. Do not invent. |
| **Article** | ❌ Absent on KC articles | `/knowledge-center/{slug}` | OG `type: 'article'` is set but no `Article` JSON-LD. | Add `Article` (or `BlogPosting`) schema: headline, image, datePublished, dateModified, author (PRAG), publisher (`@id` → Organization). Use real post data only. |

**No invented data:** Per brief, do not fabricate ratings, reviews, or business information. Only schema fields with real source data should be populated.

---

## 10. Product SEO — not started (later phase)

Per brief, bulk product SEO is a later phase. The recommended **product fallback formula** for that phase:

- **Title:** `{Product Name} | PRAG`
- **Description:** `{Product Name} — {short_description stripped, ~150 chars}. Available from PRAG Nigeria.`
- **OG:** title = product name; image = first product image.
- **Schema:** Product + Offer (real price/stock) + BreadcrumbList.
- **Manual overrides:** per-product `seoOverrides` entry (title, description, canonical, OG) via the admin SEO-overrides layer described in §8.

Individual product optimisation will follow after the core-page architecture in §5 is approved.

---

## Summary of required PRAG decisions before Step 8

1. **Approve the keyword ownership map (§2)** — confirm each pillar owner and the solar product/solution split.
2. **Approve the workbook titles/descriptions (§5)** — or provide PRAG's preferred wording in the `PRAG Recommendation` column.
3. **Confirm cannibalisation resolutions (§3)** — especially:
   - `/solutions/residential-2` → 308 redirect to `/solutions/residential`? **(VERIFIED — already 308 in production)**
   - Residential/commercial sub-pages: add to sitemap, noindex, or 308?
   - `/solutions/backup-power` linking to both inverters + batteries? **(IMPLEMENTED — links to inverters, batteries, and lithium batteries)**
4. **Approve the SEO field architecture (§8)** — admin `seoOverrides` layer + Next.js rendering, Yoast wired only for KC articles as secondary source. **(IMPLEMENTED — see Step 8 report below)**
5. **Approve schema additions (§9)** — BreadcrumbList (all sub-pages), Product+Offer (product pages), Article (KC articles). Confirm no invented ratings/reviews. **(IMPLEMENTED — see Step 8 report below)**
6. **Confirm product fallback formula (§10)** for the later product phase. **(IMPLEMENTED — `{Product Name} | PRAG` safe fallback)**

No code or metadata changes will be made until the above are reviewed and approved.

---

## Step 8 Implementation Report — SEO Metadata Architecture & Schema

**Date:** 2026-08-10
**Status:** IMPLEMENTED + BUILD VERIFIED. Both `prag-b2b` and `Prag-Admin` pass `tsc --noEmit` and `npm run build`. Live dev-server validation confirms correct metadata and JSON-LD output on all page types.

### What was built

#### 1. Central SEO metadata layer (`prag-b2b/lib/seoMeta.ts`)
Single source of truth for:
- Brand constants (`SITE_BASE`, `BRAND_NAME`, `OG_SITE_NAME`, homepage title/description).
- `SeoOverride` / `SeoOverrideMap` types (admin-editable fields).
- `ROUTE_SEO_CONFIG` — approved Step 7 workbook values for all 26 priority pages.
- `CATEGORY_DISPLAY` — category names for H1 and fallback descriptions.
- Resolution helpers: `resolveStaticSeo()`, `resolveCategorySeo()`, `resolveProductSeo()`, `resolveKcArticleSeo()`.
- `buildMetadata()` — Next.js Metadata builder using `title: { absolute }` to avoid layout template double-suffixing.
- Structured-data builders: `buildBreadcrumbJsonLd()`, `buildProductJsonLd()`, `buildArticleJsonLd()`.
- `fetchYoastPostSeo()` — fetches Yoast postmeta via the new `prag-core/v1/post-seo/{id}` endpoint.
- `getAdminSeoOverride()` — extracts an override from the admin B2B content.

**Resolution order (per page type):**
- Static pages: admin override → approved route config → safe fallback
- Product categories: admin override → approved category config → category fallback
- Products: admin override → automatic fallback (`{Product Name} | PRAG`)
- Knowledge Center: admin override → Yoast meta → article title/excerpt

`primaryKeyword` and `secondaryKeywords` are editorial/admin data only. They are NEVER output as `<meta name="keywords">`.

#### 2. Admin-editable SEO override layer
- **Prag-Admin store** (`lib/b2bAdminStore.ts`): added `seoOverrides: B2BSeoOverrideMap` to `B2BAdminStore`, `DEFAULT_STORE`, and `normalizeStore()`.
- **Public API** (`app/api/public/b2b-content/route.ts`): `seoOverrides` included in the public content response.
- **Admin API** (`app/api/admin/b2b/seo/route.ts`): GET / PUT / DELETE for SEO overrides, with audit logging.
- **Admin UI** (`components/B2BSeoClient.tsx`): full editor with priority-route quick-select, custom route input, search, edit modal (SEO title, description, primary/secondary keywords, OG title/description/image, canonical override, robots index, SEO notes), and delete.
- **Admin sidebar** (`components/B2BSidebar.tsx`): "SEO Overrides" nav item added.
- **Access control** (`B2BSectionKey`, `DEFAULT_SECTION_VISIBILITY`, `B2BAccessClient`): `seo` section added; visible to administrators only by default.
- **prag-b2b content layer** (`lib/b2bContent.ts`): `seoOverrides` added to `PublicB2BContent`, `LocalB2BStoreShape`, `WordPressAdminConfigShape`, and `mapStoreToPublicContent()`.

#### 3. WordPress plugin endpoint (`prag-core-plugin/prag-core-by-avario.php`)
- Added `GET /prag-core/v1/post-seo/{id}` — read-only endpoint exposing Yoast postmeta (`_yoast_wpseo_title`, `_yoast_wpseo_metadesc`, `_yoast_wpseo_focuskw`) for headless KC article consumption. Publicly accessible (matches the existing custom-tabs endpoint pattern).

#### 4. Next.js resolution order wired (all page types)
Every priority page now uses `generateMetadata()` with the central SEO layer:

| Route | File | Resolution |
|-------|------|------------|
| `/` | `app/page.tsx` | `resolveStaticSeo('/', override)` |
| `/products` | `app/products/page.tsx` | `resolveStaticSeo('/products', override)` |
| `/products/[category]` | `app/products/[category]/page.tsx` | `resolveCategorySeo(category, override)` |
| `/products/[category]/[slug]` | `app/products/[category]/[slug]/page.tsx` | `resolveProductSeo(...)` |
| `/solutions` | `app/solutions/page.tsx` | `resolveStaticSeo('/solutions', override)` |
| `/solutions/residential` | `app/solutions/residential/page.tsx` | `resolveStaticSeo('/solutions/residential', override)` |
| `/solutions/commercial` | `app/solutions/commercial/page.tsx` | `resolveStaticSeo('/solutions/commercial', override)` |
| `/solutions/industrial` | `app/solutions/industrial/page.tsx` | `resolveStaticSeo('/solutions/industrial', override)` |
| `/solutions/backup-power` | `app/solutions/backup-power/page.tsx` | `resolveStaticSeo('/solutions/backup-power', override)` |
| `/solutions/solar-energy` | `app/solutions/solar-energy/page.tsx` | `resolveStaticSeo('/solutions/solar-energy', override)` |
| `/solutions/voltage-stabilization-protection` | `app/solutions/voltage-stabilization-protection/page.tsx` | `resolveStaticSeo('/solutions/voltage-stabilization-protection', override)` |
| `/about` | `app/about/page.tsx` | `resolveStaticSeo('/about', override)` |
| `/installations` | `app/installations/page.tsx` | `resolveStaticSeo('/installations', override)` |
| `/knowledge-center` | `app/knowledge-center/page.tsx` | `resolveStaticSeo('/knowledge-center', override)` |
| `/knowledge-center/[slug]` | `app/knowledge-center/[slug]/page.tsx` | `resolveKcArticleSeo(...)` with Yoast fetch |

#### 5. Old positioning removed from all SEO surfaces
- `app/layout.tsx`: `metadata.title.default`, `openGraph.title`, `openGraph.images[0].alt`, `twitter.title`, `twitter.description` — all replaced with "PRAG – Inverters, Stabilizers, Batteries & Solar Solutions in Nigeria".
- `app/layout.tsx`: launch-mode logo `alt="PRAG B2B"` → `alt="PRAG"`.
- `components/CookieConsentLoader.tsx`: `website_name: 'PRAG B2B'` → `'PRAG'`.
- `Prag-Admin/components/B2BSidebar.tsx`: "PRAG B2B" sidebar header → "PRAG Admin".
- All category/product/KC/solution pages: "PRAG B2B" removed from titles, descriptions, and fallbacks.
- Verified: zero occurrences of "PRAG B2B" or "Nigeria's Leading Power Engineering Company" remain in any SEO surface in `prag-b2b/app`, `prag-b2b/components`, or `prag-b2b/lib`.

#### 6. Backup Power correction (cannibalisation C6)
`app/solutions/backup-power/page.tsx` fallback cards now link to:
- `/products/inverters` (View Inverters)
- `/products/batteries` (View Batteries)
- `/products/lithium-batteries` (View Lithium Batteries)

Previously all three cards linked to `/products/inverters` only.

#### 7. Category H1/description cannibalisation fixes
`app/products/[category]/page.tsx` `DISPLAY` map:
- `inverters`: "A selection of solar inverters..." → "Browse PRAG inverters — hybrid, heavy-duty and backup inverters..." (fixes C7: was targeting "solar inverters")
- `solar`: "Explore our range of solar solutions..." → "Browse PRAG solar products — solar panels, charge controllers and solar equipment..." (fixes C1: was conflating equipment with solutions)

#### 8. Schema additions

| Schema type | Where | Source data |
|-------------|-------|-------------|
| WebSite | `/` (preserved) | Static config, now with `description` |
| Organization | `/` (preserved) | Static config |
| BreadcrumbList | All category, product, solution, KC, about, installations pages | Real breadcrumb trail from route |
| Product + Offer | All product pages | Real WC data: name, description, image, SKU, price, currency, availability. No invented ratings/reviews. |
| Article | All KC articles | Real WP data: headline, description, image, datePublished, dateModified, publisher @id. Author only if genuinely available. |

Reusable `JsonLd` component (`components/JsonLd.tsx`) renders one or more structured-data objects.

#### 9. Build + live validation
- `prag-b2b`: `tsc --noEmit` passes, `npm run build` passes (all 26+ routes built).
- `Prag-Admin`: `tsc --noEmit` passes, `npm run build` passes.
- Live dev-server validation confirmed:
  - Homepage: `<title>PRAG – Inverters, Stabilizers, Batteries & Solar Solutions in Nigeria</title>` + WebSite + Organization JSON-LD.
  - `/products`: `<title>Power Products – Inverters, Stabilizers, Batteries & Solar | PRAG</title>` + BreadcrumbList.
  - `/products/inverters`: `<title>Inverters in Nigeria – Hybrid, Heavy-Duty & Backup Inverters | PRAG</title>` + BreadcrumbList.
  - Product page: `<title>3KW/24V Hybrid Inverter (3000W-MPPT) | PRAG</title>` + Product JSON-LD (price: 456600 NGN, SKU: 4107, InStock) + BreadcrumbList.
  - `/solutions/solar-energy`: `<title>Solar Energy Systems in Nigeria – Solar Installation & Design | PRAG</title>` + BreadcrumbList.
  - KC article: `<title>Solar Panel Installation: A Comprehensive Guide...</title>` + Article JSON-LD (datePublished, dateModified, image, publisher @id) + BreadcrumbList.

### What was NOT done (per Step 8 brief)
- No bulk product SEO optimisation — only the safe automatic fallback formula `{Product Name} | PRAG`.
- No `<meta name="keywords">` output anywhere.
- No invented aggregateRating, review, ratingValue, or reviewCount in Product schema.
- No changes to the sitemap or robots.txt (those are separate steps).

### Deployment notes
1. **prag-core plugin** must be re-deployed to `central.prag.global` to activate the `/prag-core/v1/post-seo/{id}` endpoint. Until then, KC articles will use the article-title/excerpt fallback (Yoast meta will return null).
2. **Prag-Admin** must be re-deployed to activate the SEO Overrides admin UI and API.
3. **prag-b2b** must be re-deployed to activate the new metadata resolution and schema output.
4. After deployment, admins can create SEO overrides at `/dashboard/b2b/seo` — these take priority over the approved defaults.

# PRAG SEO Recovery — Step 9: On-Page SEO, Category Content & Internal Linking Audit

**Site:** https://www.prag.global  
**Date:** 2026-08-09  
**Status:** AUDIT + RECOMMENDATIONS ONLY — awaiting PRAG review. No code or content changes made.

> **Scope note:** Step 9 audits only *visible* on-page content, H1/H2 structure, internal linking, product-card UX, and conversion CTAs. All SEO titles, meta descriptions, canonicals, robots directives, sitemap architecture, schema infrastructure, redirects, and product URL structure from Steps 5–8 are preserved and NOT changed.

---

## A. Overall Audit Summary

### Pages audited
Total priority URLs audited: **30**

| Tier | Count | URLs |
|------|-------|------|
| Tier 1 — Core commercial | 4 | `/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar` |
| Tier 2 — Product subcategories | 10 | `/products/hybrid-inverters`, `/products/heavy-duty-inverters`, `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/products/lithium-batteries`, `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/protective-device` |
| Tier 3 — Solution pages | 6 | `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`, `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial` |
| Tier 4 — Supporting authority | 5 | `/products`, `/solutions`, `/installations`, `/knowledge-center`, `/about` |
| Plus cross-cutting | 5 | Homepage, header navigation, product cards, footer CTA, Knowledge Center article inventory |

### Grades

> **Reconciliation note (2026-08-09):** The original grade table listed only 16 of the 30 audited URLs (A=0, B=4, C=3, D=9 — but the D row listed only 8 pages). The table below assigns exactly one grade to every one of the 30 audited URLs so the grade totals equal 30. The 10 Tier 2 subcategory pages are graded D per section C (fallback text only, no CMS body). The 5 cross-cutting items (homepage, header navigation, product cards, footer CTA, Knowledge Center article inventory) are graded on their structural/UX quality independent of the 25 routed pages.

| Grade | Count | Pages |
|-------|-------|-------|
| **A — Strong** | 0 | — |
| **B — Good but needs improvement** | 6 | `/solutions`, `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial`, header navigation, footer CTA |
| **C — Thin/weak** | 6 | `/products`, `/about`, `/knowledge-center`, homepage, product cards, Knowledge Center article inventory |
| **D — Major rewrite required** | 18 | `/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar`, `/products/hybrid-inverters`, `/products/heavy-duty-inverters`, `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/products/lithium-batteries`, `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/protective-device`, `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`, `/installations` |

**Grade totals: 0 + 6 + 6 + 18 = 30 ✓ (every audited URL has exactly one grade)**

### Thin pages
- All 4 Tier 1 commercial category pages are effectively hero + product grid only.
- `/products` hub is only hero + product grid.
- `/installations` hero is present, but the rest is dynamic case-study grid with no supporting body.
- `/knowledge-center` is only hero + blog grid.
- All Tier 2 subcategory pages rely on code fallback text (name + one-sentence description) with no unique body content.

### Duplicate-content risks
- `/products/inverters` describes itself as "solar inverters" — overlapping `/products/hybrid-inverters` and `/products/solar`.
- `/products/solar` says "solar solutions" — overlapping `/solutions/solar-energy`.
- `/products/solar` mentions "protect against voltage fluctuations" — off-topic for solar products and overlaps stabilizer pages.
- `/solutions/backup-power`, `/solutions/solar-energy`, and `/solutions/voltage-stabilization-protection` use near-identical 3-card structures and identical placeholder CTA copy.
- `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial` share almost identical problem-carousel structure (each lists 4 problems) and can feel templated.
- About page summary claims "Nigeria's Leading Provider" and homepage claims "Trusted by Thousands Nationwide" — unverified superlatives that can reduce E-E-A-T trust.

### H1 issues
- `/products/inverters` — H1 "Inverters" is generic; hero copy narrows intent to "solar inverters", conflicting with Step 7 broad-inverter ownership.
- `/products/voltage-stabilizers` — H1 "Voltage Stabilizers" (fallback) is acceptable but generic.
- `/products/batteries` — H1 "Batteries" is generic.
- `/products/solar` — H1 rendered as "Solar" (CMS summary overrides CATEGORY_DISPLAY h1 "Solar Products"), creating ambiguity.
- `/solutions/*` — H1s are functional but too flat (e.g. "Reliable Backup Power Solutions").
- `/products` — H1 "Our Products" is acceptable for a hub.
- `/installations` — H1 "Real Installations, Measurable Results." is acceptable.

### Internal-link gaps
- **Critical redirect-chain issue:** 7 high-priority internal links point to `/products/all-prag-stabilizers`, which 308-redirects to `/products/voltage-stabilizers`. This wastes crawl budget and link equity.
- Header nav "Lithium Batteries" label points to `/products/batteries` (mismatch; should be `/products/lithium-batteries` or label "Batteries").
- Homepage "Get PRAG Lithium Batteries" CTA points to `/products/batteries` (label mismatch).
- Product category pages have **zero** body cross-links to related categories, related solutions, Knowledge Center, or installations.
- Solution pages link to `/contact` for quotes but rarely to `/free-power-assessment`, `/installations`, or Knowledge Center guides.
- `/installations` is not linked back from product or solution pages.

### FAQ opportunities
- Strong opportunities on Tier 1 category pages (inverters, stabilizers, batteries, solar).
- Good opportunities on `/solutions/backup-power` and `/solutions/solar-energy`.
- **Do NOT add FAQ schema in Step 9** unless separately approved.

### Conversion gaps
- Category pages have only product cards + "Learn more" / "Buy >" buttons.
- Missing clear category-level CTAs: "Talk to a PRAG Engineer", "Request a Power Assessment", "Find the Right Inverter/Battery/Stabilizer", "View Installations".
- `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection` have placeholder CTA text ("Final conversion headline." / "Final CTA supporting copy.") in CMS that is not currently rendered, but the CMS data is stale/placeholder.

---

## B. Four Core-Page Detailed Proposals

### B.1 `/products/inverters`

**Primary keyword (Step 7):** `inverter Nigeria`  
**Search intent:** User wants to compare and buy inverter options in Nigeria; broad inverter category intent, not only solar or hybrid.  
**Current H1:** `Inverters`  
**Recommended H1:** `Inverters Built for Nigerian Power Conditions`  
**Current grade:** D — Major rewrite required  
**Key problem:** Hero copy "A selection of solar inverters that convert DC power from solar panels into AC power" narrows the page to solar inverters only, cannibalising `/products/hybrid-inverters` and `/products/solar`.

#### Proposed structure

**H1:** Inverters Built for Nigerian Power Conditions

**Opening paragraph:**  
PRAG inverters convert stored DC battery power into clean, stable AC electricity for homes, offices, and industrial facilities. Designed for Nigeria's unreliable grid, they keep essential appliances and equipment running through outages and voltage fluctuations — whether paired with batteries, solar panels, or the grid.

**H2 — Inverter Options from PRAG**  
Browse hybrid inverters that combine solar charging with battery backup, heavy-duty inverters for continuous commercial and industrial loads, and standard backup inverters that protect homes during NEPA outages. [Internal link: `hybrid inverters` → `/products/hybrid-inverters`; `heavy-duty inverters` → `/products/heavy-duty-inverters`]

**H2 — What Is an Inverter and Where Is It Used?**  
An inverter changes DC battery power into AC power for everyday appliances. In Nigeria, it is used for lights, fans, TVs, computers, fridges, pumps, and production equipment when grid power fails. The right inverter depends on your total load and how long you need backup.

**H2 — Which Inverter Suits a Home or Business?**  
Home users typically need 1kVA–5kVA systems for lights, fans, TVs, and fridges. Offices and shops often need 3kVA–10kVA. Factories and plants use heavy-duty units sized to protect critical equipment and avoid downtime. Not sure what size you need? Talk to a PRAG engineer.

**H2 — Inverter + Battery Compatibility**  
PRAG inverters work with a range of battery technologies. For longer life and faster charging, lithium battery banks are a strong match. [Internal link: `PRAG lithium batteries` → `/products/lithium-batteries`; `PRAG batteries` → `/products/batteries`]

**H2 — Why Choose PRAG Inverters?**  
- Engineered for Nigerian grid conditions  
- Pure sine wave output for sensitive electronics  
- Hybrid, heavy-duty, and backup options in one catalogue  
- Supported by local technical support and installation services  

**H2 — Related Solutions**  
For complete systems, explore PRAG backup power solutions and solar energy solutions. [Internal links: `backup power solutions` → `/solutions/backup-power`; `solar energy solutions` → `/solutions/solar-energy`]

**H2 — Frequently Asked Questions**
- What size inverter do I need for my home?  
- What is the difference between hybrid and heavy-duty inverters?  
- Can PRAG inverters work with lithium batteries?  
- How long will a battery bank power my appliances?

**CTA:** `Find the Right Inverter` → `/contact` (or `/free-power-assessment`)  
**Secondary CTA:** `Talk to a PRAG Engineer` → `/contact`

---

### B.2 `/products/voltage-stabilizers`

**Primary keyword (Step 7):** `voltage stabilizer`  
**Search intent:** User wants to understand, compare, and buy voltage stabilizers in Nigeria; broad stabilizer category.  
**Current H1:** `Voltage Stabilizers` (code fallback)  
**Recommended H1:** `Voltage Stabilizers for Homes, Businesses & Industry`  
**Current grade:** D — Major rewrite required  
**Key problem:** No CMS page exists; only code fallback text. Page is hero + product grid with no educational body content.

#### Proposed structure

**H1:** Voltage Stabilizers for Homes, Businesses & Industry

**Opening paragraph:**  
PRAG voltage stabilizers protect appliances and equipment from the high, low, and fluctuating voltage common across Nigerian power networks. By keeping output voltage within a safe range, they help extend equipment life, reduce repairs, and keep operations running smoothly.

**H2 — Why Voltage Stabilization Matters in Nigeria**  
Unstable grid supply, generator switching, and load shedding can push voltage well above or below safe levels. Air conditioners, fridges, pumps, medical equipment, and CNC machines can suffer damage or shortened lifespan without stable voltage.

**H2 — Types of Voltage Stabilizers Available**  
- **Relay stabilizers** — fast, cost-effective protection for homes and offices. [Internal link: `relay voltage stabilizers` → `/products/relay-voltage-stabilizers`]  
- **Servo stabilizers** — precise, continuous correction for sensitive and high-value equipment. [Internal link: `servo voltage stabilizers` → `/products/servo-voltage-stabilizers`]  
- **Thyristor stabilizers** — maintenance-free, solid-state precision for demanding environments. [Internal link: `thyristor stabilizers` → `/products/thyristor-stabilizers`]  
- **Advanced stabilizers** — modern voltage protection with enhanced control features. [Internal link: `advanced stabilizers` → `/products/advanced-stabilizers`]

**H2 — Residential, Commercial & Industrial Use**  
Home users protect fridges, TVs, and air conditioners. Offices protect servers, printers, and POS systems. Industrial users protect motors, VFDs, CNC machines, and production lines.

**H2 — How to Choose the Right Stabilizer**  
Capacity, input voltage range, load type, and response speed all matter. PRAG engineers can help you size a stabilizer to your actual load profile rather than guessing.

**H2 — Related Solutions**  
For facility-wide voltage protection, see our voltage stabilization and protection solutions. [Internal link: `voltage stabilization solutions` → `/solutions/voltage-stabilization-protection`]

**H2 — Frequently Asked Questions**
- What is the difference between relay and servo stabilizers?  
- What stabilizer capacity do I need?  
- Can one stabilizer protect my whole house or office?  
- Why do my appliances keep failing despite using a stabilizer?

**CTA:** `Request a Stabilizer Assessment` → `/contact`  
**Secondary CTA:** `Compare Stabilizer Types` → anchor to H2 "Types of Voltage Stabilizers Available"

---

### B.3 `/products/batteries`

**Primary keyword (Step 7):** `battery Nigeria`  
**Search intent:** User wants to find batteries for inverters, solar, and backup systems in Nigeria.  
**Current H1:** `Batteries`  
**Recommended H1:** `Reliable Batteries for Inverter, Solar & Backup Systems`  
**Current grade:** D — Major rewrite required  
**Key problem:** Hero content is thin and contains generic "other energy storage solutions" wording. No body copy, no compatibility guidance, no lithium link prominence.

#### Proposed structure

**H1:** Reliable Batteries for Inverter, Solar & Backup Systems

**Opening paragraph:**  
PRAG batteries store the energy that keeps your home, business, or facility running when grid power is unavailable. Whether used with an inverter, a solar charge controller, or a complete backup system, the right battery bank determines how long your essential loads stay powered.

**H2 — How PRAG Batteries Are Used**  
Inverters draw DC power from batteries and convert it to AC for appliances. Solar systems use batteries to store energy generated during the day for use at night. Backup systems rely on batteries to bridge the gap during outages.

**H2 — Battery Technologies**  
PRAG offers lithium batteries for longer cycle life, faster charging, and lighter weight, as well as traditional options suited to different budgets and use cases. [Internal link: `PRAG lithium batteries` → `/products/lithium-batteries`]

**H2 — Capacity & Sizing**  
Battery capacity is measured in amp-hours (Ah) or watt-hours (Wh). The right size depends on the load you need to support and how many hours of backup you require. Oversizing wastes budget; undersizing leaves you in the dark.

**H2 — Compatibility Considerations**  
Battery voltage and chemistry must match the inverter or solar charge controller. PRAG systems are designed so that inverter, battery, and solar components work together correctly.

**H2 — Related Products & Solutions**  
Pair your battery with a PRAG inverter or solar system. [Internal links: `inverters` → `/products/inverters`; `solar products` → `/products/solar`; `backup power solutions` → `/solutions/backup-power`; `solar energy solutions` → `/solutions/solar-energy`]

**H2 — Frequently Asked Questions**
- Can lithium batteries work with my inverter?  
- How do I size a battery bank for my home?  
- What battery voltage do I need for a 5kVA inverter?  
- How does backup time change with more batteries?

**CTA:** `Find the Right Battery` → `/contact`  
**Secondary CTA:** `Explore Lithium Batteries` → `/products/lithium-batteries`

---

### B.4 `/products/solar`

**Primary keyword (Step 7):** `solar products`  
**Search intent:** User wants to browse and buy solar equipment (panels, controllers, protective devices, compatible batteries/inverters) in Nigeria.  
**Current H1:** `Solar` (rendered from CMS, overriding "Solar Products")  
**Recommended H1:** `Solar Products & Equipment for Nigerian Homes & Businesses`  
**Current grade:** D — Major rewrite required  
**Key problem:** Hero content says "solar solutions" and "protect against voltage fluctuations" — both off-intent. This page should be an equipment catalogue, not a solar installation/services page.

#### Proposed structure

**H1:** Solar Products & Equipment for Nigerian Homes & Businesses

**Opening paragraph:**  
PRAG solar products give you the components you need to generate, control, store, and protect solar power. From high-efficiency panels to charge controllers, protective devices, compatible batteries, and inverters, every product is selected to work together in Nigerian conditions.

**H2 — Solar Panels**  
Convert sunlight into DC electricity. PRAG panels are chosen for efficiency and durability in high-temperature, high-humidity environments. [Internal link: `PRAG solar panels` → `/products/solar-panels`]

**H2 — Solar Charge Controllers**  
Controllers regulate power from panels to batteries, helping prevent overcharging and extending battery life. [Internal link: `solar charge controllers` → `/products/solar-charge-controllers`]

**H2 — Protective Devices**  
Surge protectors and safety devices protect your solar and power systems from lightning, surges, and faults. [Internal link: `protective devices` → `/products/protective-device`]

**H2 — Compatible Storage & Inverters**  
Solar panels need a controller, a battery, and an inverter to deliver usable AC power. PRAG offers lithium batteries and hybrid inverters designed for solar-battery integration. [Internal links: `lithium batteries` → `/products/lithium-batteries`; `hybrid inverters` → `/products/hybrid-inverters`]

**H2 — Need a Complete Designed & Installed Solar System?**  
If you need system design, sizing, and installation rather than individual products, explore PRAG solar energy solutions. [Internal link: `Solar energy solutions` → `/solutions/solar-energy`]

**H2 — Frequently Asked Questions**
- What do I need for a complete solar power system?  
- What size solar panel system do I need?  
- What is the difference between MPPT and PWM charge controllers?  
- Can I add solar panels to my existing inverter and battery?

**CTA:** `Shop Solar Products` → `/products/solar` (catalogue CTA) / or `Talk to a PRAG Solar Engineer` → `/contact`  
**Secondary CTA:** `View Solar Installations` → `/installations` (filter/contextual link to relevant case studies)

---

## C. Tier 2 Page Recommendations

All Tier 2 pages currently render using `DISPLAY` fallback text in `app/products/[category]/page.tsx` and have **no CMS body content**. Each is essentially H1 + one-sentence description + product grid. Treat them as Grade D / thin, but with smaller scope than Tier 1.

| URL | Recommended H1 | Missing Topics | Internal Links to Add | FAQ Opportunities | Rewrite Level |
|-----|----------------|----------------|----------------------|-------------------|---------------|
| `/products/hybrid-inverters` | `Hybrid Inverters: Solar + Battery Backup in One Unit` | Solar charging integration, battery compatibility, home use, when to choose hybrid vs standalone | `/products/inverters`, `/products/solar-panels`, `/products/lithium-batteries`, `/products/solar`, `/solutions/solar-energy` | What is a hybrid inverter? Can a hybrid inverter work without solar? | Major rewrite |
| `/products/heavy-duty-inverters` | `Heavy-Duty Inverters for Continuous Commercial & Industrial Loads` | Continuous duty, large load support, commercial/industrial applications, protection features, difference from hybrid | `/products/inverters`, `/solutions/industrial`, `/solutions/commercial` | When do I need a heavy-duty inverter? | Major rewrite |
| `/products/relay-voltage-stabilizers` | `Relay Voltage Stabilizers: Fast, Affordable Protection` | How relay correction works, speed vs precision, best use cases (home/office), capacity selection | `/products/voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/solutions/voltage-stabilization-protection`, `/solutions/residential` | How fast is relay stabilizer correction? Is a relay stabilizer enough for my home? | Major rewrite |
| `/products/servo-voltage-stabilizers` | `Servo Voltage Stabilizers: Precise Correction for Sensitive Equipment` | Servo-motor principle, high precision, medical/lab/IT equipment, industrial control | `/products/voltage-stabilizers`, `/products/thyristor-stabilizers`, `/solutions/commercial`, `/solutions/industrial` | Servo vs relay stabilizer: which is better? | Major rewrite |
| `/products/thyristor-stabilizers` | `Thyristor Stabilizers: Maintenance-Free, High-Precision Power` | Solid-state switching, no moving parts, high-speed correction, industrial/healthcare suitability | `/products/voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/solutions/industrial`, `/solutions/voltage-stabilization-protection` | Are thyristor stabilizers better than servo? | Major rewrite |
| `/products/advanced-stabilizers` | `Advanced Stabilizers with Modern Voltage Protection` | Smart/control features, application fit, how it differs from relay/servo/thyristor | `/products/voltage-stabilizers`, `/solutions/commercial`, `/solutions/industrial` | What makes an advanced stabilizer different? | Major rewrite |
| `/products/lithium-batteries` | `Lithium Batteries for Inverter & Solar Storage` | LiFePO4 chemistry, cycle life, fast charging, weight, compatibility with PRAG inverters, use cases | `/products/batteries`, `/products/inverters`, `/products/hybrid-inverters`, `/products/solar`, `/solutions/backup-power`, `/solutions/solar-energy` | Can lithium batteries work with my inverter? Why choose lithium over other batteries? | Major rewrite |
| `/products/solar-panels` | `High-Efficiency Solar Panels in Nigeria` | Panel types, wattage, efficiency, durability in heat/humidity, compatible controllers/batteries | `/products/solar`, `/products/solar-charge-controllers`, `/products/lithium-batteries`, `/solutions/solar-energy` | What size solar panel do I need? | Major rewrite |
| `/products/solar-charge-controllers` | `Solar Charge Controllers: MPPT & PWM Options` | MPPT vs PWM, battery protection, panel matching, efficiency | `/products/solar-panels`, `/products/lithium-batteries`, `/products/solar` | MPPT vs PWM: which should I choose? | Major rewrite |
| `/products/protective-device` | `Protective Devices for Solar & Power Systems` | Surge protection, safety devices, where to install, compatibility with solar and stabilizer systems | `/products/solar`, `/products/voltage-stabilizers`, `/solutions/solar-energy` | Why do I need a surge protector for solar? | Major rewrite |

---

## D. Solution-Page Recommendations

### D.1 `/solutions/backup-power`
- **Current grade:** D
- **H1:** `Reliable Backup Power Solutions` — acceptable, but can be stronger.
- **Problem:** 3 cards all currently link to `/products/inverters` in CMS; placeholders in section 4.
- **Recommended new sections:**
  1. The backup power problem in Nigeria (outages, generator cost, noise).
  2. PRAG approach (inverter + battery + optional solar).
  3. System sizing and backup duration.
  4. Applications (home, office, industrial).
  5. Related products: inverters, batteries, lithium batteries.
  6. Installations proof (link to relevant case studies).
- **Internal links:** `/products/inverters`, `/products/batteries`, `/products/lithium-batteries`, `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial`, `/installations`, `/free-power-assessment`
- **FAQ:** What size inverter and battery do I need for backup? How long can a backup system run? Can solar be added later?
- **CTA:** `Request a Backup Power Assessment` → `/free-power-assessment`

### D.2 `/solutions/solar-energy`
- **Current grade:** D
- **H1:** `Solar Energy Solutions` — acceptable.
- **Problem:** CMS cards all link to `/products/solar`; page reads like a product-category copy. Needs design/sizing/installation content.
- **Recommended new sections:**
  1. Solar energy as a solution (reduce generator dependence, cut fuel costs).
  2. PRAG design & installation process (assessment → design → install → support).
  3. System components (panels, controllers, inverters, batteries, protection).
  4. Residential, commercial, industrial applications.
  5. Related products and case studies.
- **Internal links:** `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/hybrid-inverters`, `/products/lithium-batteries`, `/products/protective-device`, `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial`, `/installations`, `/free-power-assessment`
- **FAQ:** How much solar do I need to run my home? Can solar eliminate generator use? What does a solar installation include?
- **CTA:** `Get a Free Solar Assessment` → `/free-power-assessment`

### D.3 `/solutions/voltage-stabilization-protection`
- **Current grade:** D
- **H1:** `Voltage Stabilization & Protection Solutions` — acceptable.
- **Problem:** Cards link to redirected `/products/all-prag-stabilizers` in CMS; placeholder section 4.
- **Recommended new sections:**
  1. Voltage fluctuation as a Nigerian business/household problem.
  2. Engineering approach (survey, load analysis, stabilizer specification).
  3. Types deployed (relay, servo, thyristor, advanced).
  4. Facility-wide vs equipment-level protection.
  5. Related products and case studies.
- **Internal links:** `/products/voltage-stabilizers`, `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/solutions/commercial`, `/solutions/industrial`, `/installations`, `/free-power-assessment`
- **FAQ:** How do I know if my facility needs voltage stabilization? What stabilizer capacity is right for a factory?
- **CTA:** `Request a Site Assessment` → `/free-power-assessment`

### D.4 `/solutions/residential`
- **Current grade:** B
- **H1:** `Reliable Power for Modern Living` — acceptable but could be stronger.
- **Problem:** 4 problem sections are good, but solution cards could use richer descriptions. No installation proof link.
- **Recommended additions:**
  - Short "How PRAG designs home power systems" section.
  - Link to 1–2 residential case studies on `/installations`.
  - Link to relevant Knowledge Center guides (e.g. inverter sizing, solar system sizing).
- **Internal links:** `/solutions/residential/home-backup-power`, `/solutions/residential/home-solar-systems`, `/solutions/residential/power-stabilization-protection`, `/products/inverters`, `/products/lithium-batteries`, `/products/voltage-stabilizers`, `/installations`, `/free-power-assessment`
- **FAQ:** What is the best backup power system for a Nigerian home? How much does a home solar system cost?
- **Rewrite:** Minor improvement.

### D.5 `/solutions/commercial`
- **Current grade:** B
- **H1:** `Smart Energy Systems for Growing Businesses` — acceptable.
- **Problem:** Solution cards link to `/products/all-prag-stabilizers` (redirect). No installation proof. Card copy is generic.
- **Recommended additions:**
  - Link to commercial case studies on `/installations`.
  - Update stabilizer link to `/products/voltage-stabilizers`.
  - Add "Request a Power Assessment" CTA to `/free-power-assessment`.
- **Internal links:** `/products/inverters`, `/products/solar`, `/products/voltage-stabilizers`, `/solutions/commercial/office-backup-power`, `/solutions/commercial/solar-for-businesses`, `/solutions/commercial/power-stabilization-protection`, `/installations`, `/free-power-assessment`
- **Rewrite:** Minor improvement + link fixes.

### D.6 `/solutions/industrial`
- **Current grade:** B
- **H1:** `Engineered Power for Heavy-Duty Operations` — acceptable.
- **Problem:** Stabilizer card links to `/products/all-prag-stabilizers` (redirect). Solution cards are short. No installation proof.
- **Recommended additions:**
  - Link to industrial case studies.
  - Update stabilizer card to `/products/voltage-stabilizers`.
  - Add "Talk to an Industrial Engineer" CTA.
- **Internal links:** `/products/voltage-stabilizers`, `/products/solar`, `/products/heavy-duty-inverters`, `/solutions/industrial`, `/installations`, `/free-power-assessment`
- **Rewrite:** Minor improvement + link fixes.

---

## E. Internal-Link Map

### Critical redirect-chain fix (do first)
`/products/all-prag-stabilizers` 308-redirects to `/products/voltage-stabilizers`. All internal links below should be updated to point directly to `/products/voltage-stabilizers`.

| Source page | Current destination | Recommended destination | Suggested anchor/context | Reason |
|-------------|---------------------|-------------------------|--------------------------|--------|
| Header nav — "Voltage Stabilizers" | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "Voltage Stabilizers" | Avoid redirect chain |
| Header nav — "Lithium Batteries" | `/products/batteries` | `/products/lithium-batteries` OR label "Batteries" | "Lithium Batteries" / "Batteries" | Label/URL mismatch |
| Homepage section [11] Voltage Stabilizers | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "View Voltage Stabilizers" | Avoid redirect chain |
| Homepage problem [20] | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "Get PRAG Stabilizers" | Avoid redirect chain |
| Homepage problem [23] | `/products/batteries` | `/products/lithium-batteries` | "Get PRAG Lithium Batteries" | Match label to URL |
| `/solutions/voltage-stabilization-protection` card 1 | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "View Voltage Stabilizers" | Avoid redirect chain |
| `/solutions/commercial` card 3 | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "Voltage Stabilization & Protection" | Avoid redirect chain |
| `/solutions/industrial` card 1 | `/products/all-prag-stabilizers` | `/products/voltage-stabilizers` | "Voltage Stabilization & Protection" | Avoid redirect chain |

### New contextual internal links to add
| Source page | Recommended destination | Suggested anchor/context |
|-------------|-------------------------|--------------------------|
| `/products/inverters` | `/products/hybrid-inverters` | "hybrid inverters" |
| `/products/inverters` | `/products/heavy-duty-inverters` | "heavy-duty inverters" |
| `/products/inverters` | `/products/batteries` | "PRAG batteries" |
| `/products/inverters` | `/products/lithium-batteries` | "PRAG lithium batteries" |
| `/products/inverters` | `/solutions/backup-power` | "backup power solutions" |
| `/products/inverters` | `/solutions/solar-energy` | "solar energy solutions" |
| `/products/voltage-stabilizers` | `/products/relay-voltage-stabilizers` | "relay voltage stabilizers" |
| `/products/voltage-stabilizers` | `/products/servo-voltage-stabilizers` | "servo voltage stabilizers" |
| `/products/voltage-stabilizers` | `/products/thyristor-stabilizers` | "thyristor stabilizers" |
| `/products/voltage-stabilizers` | `/products/advanced-stabilizers` | "advanced stabilizers" |
| `/products/voltage-stabilizers` | `/solutions/voltage-stabilization-protection` | "voltage stabilization solutions" |
| `/products/batteries` | `/products/lithium-batteries` | "PRAG lithium batteries" |
| `/products/batteries` | `/products/inverters` | "PRAG inverters" |
| `/products/batteries` | `/solutions/backup-power` | "backup power solutions" |
| `/products/batteries` | `/solutions/solar-energy` | "solar energy solutions" |
| `/products/solar` | `/products/solar-panels` | "PRAG solar panels" |
| `/products/solar` | `/products/solar-charge-controllers` | "solar charge controllers" |
| `/products/solar` | `/products/protective-device` | "protective devices" |
| `/products/solar` | `/products/lithium-batteries` | "lithium batteries" |
| `/products/solar` | `/products/hybrid-inverters` | "hybrid inverters" |
| `/products/solar` | `/solutions/solar-energy` | "Need a complete designed and installed solar system?" |
| `/solutions/backup-power` | `/products/inverters` | "PRAG inverters" |
| `/solutions/backup-power` | `/products/batteries` | "PRAG batteries" |
| `/solutions/backup-power` | `/products/lithium-batteries` | "PRAG lithium batteries" |
| `/solutions/backup-power` | `/free-power-assessment` | "Request a backup power assessment" |
| `/solutions/solar-energy` | `/products/solar-panels` | "solar panels" |
| `/solutions/solar-energy` | `/products/solar-charge-controllers` | "solar charge controllers" |
| `/solutions/solar-energy` | `/products/hybrid-inverters` | "hybrid inverters" |
| `/solutions/solar-energy` | `/products/lithium-batteries` | "lithium batteries" |
| `/solutions/solar-energy` | `/free-power-assessment` | "Get a free solar assessment" |
| `/solutions/voltage-stabilization-protection` | `/products/voltage-stabilizers` | "PRAG voltage stabilizers" |
| `/solutions/voltage-stabilization-protection` | `/free-power-assessment` | "Request a site assessment" |
| `/solutions/residential` | `/installations` | "See related home power installations" |
| `/solutions/commercial` | `/installations` | "See PRAG commercial installations" |
| `/solutions/industrial` | `/installations` | "See PRAG industrial installations" |
| `/products` | `/solutions` | "Explore power solutions" |
| `/installations` | `/solutions/*` | "Explore backup/solar/stabilization solutions" |

---

## F. Knowledge Center Support Map

All links should be contextual, not SEO-link blocks. Prioritise articles that naturally answer user questions.

| Commercial page | Recommended Knowledge Center article | Anchor / context |
|-----------------|--------------------------------------|------------------|
| `/products/inverters` | `inverter-sizing-and-load-capacity-ensuring-efficient-power-supply` | "inverter sizing guide" |
| `/products/inverters` | `maintaining-and-troubleshooting-inverters` | "inverter maintenance guide" |
| `/products/inverters` | `how-much-is-inverter-in-nigeria` | "inverter prices in Nigeria" |
| `/products/voltage-stabilizers` | `what-is-the-difference-between-relay-servo-voltage-stabilizer` | "difference between relay and servo stabilizers" |
| `/products/voltage-stabilizers` | `servo-stabilizer` or `why-we-need-servo-stabilizer` | "when to choose a servo stabilizer" |
| `/products/batteries` | `lithium-batteries-for-inverters` | "lithium batteries for inverters" |
| `/products/batteries` | `what-types-of-batteries-are-used-in-solar-electric-systems` | "batteries used in solar systems" |
| `/products/batteries` | `what-is-depth-of-discharge-dod` | "depth of discharge explained" |
| `/products/solar` | `the-science-behind-solar-panels` | "how solar panels work" |
| `/products/solar` | `solar-panel-installation-a-comprehensive-guide-to-harnessing-renewable-energy` | "solar panel installation guide" |
| `/products/solar` | `mppt-vs-pwm` (if exists) | see existing article `inverter-with-integrated-mppt` |
| `/solutions/solar-energy` | `solar-installation-services-by-prag` | "PRAG solar installation services" |
| `/solutions/solar-energy` | `what-can-a-2-5-kva-solar-system-power` | "what a 2.5kVA solar system can power" |
| `/solutions/backup-power` | `tired-of-generators` | "tired of generators?" |
| `/solutions/voltage-stabilization-protection` | `common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them` | "common power problems and how stabilizers help" |

**Reverse links (Knowledge Center → commercial):** Each relevant Knowledge Center article should naturally link back to the matching product or solution page once, using descriptive anchor text (e.g. "browse PRAG inverters", "view voltage stabilizers").

---

## G. Installation/Proof Map

Existing case studies (from `lib/caseStudies.ts`):
1. Lagos manufacturing company — Industrial (500KVA stabilizer + inverter + solar, 99.8% uptime)
2. Meadows Estate, Lekki Phase II — Residential (60 units, 50kW solar microgrid)
3. Zenith Textile Factory, Kano — Industrial (250kVA servo stabilizer)
4. Federal Medical Centre, Abuja — Commercial (100kVA stabilizer + UPS)
5. Ikeja Shopping Mall, Lagos — Commercial (200kW rooftop solar + 500kWh lithium)

**Note:** Some result labels contain data-quality issues (e.g. "Solar Panels: 99.8%", "Cost Production: 65%"). Recommend a separate data-validation pass, but do not invent or change numbers without PRAG approval.

### Recommended contextual proof links
| Commercial/solution page | Installation to link to | Anchor text |
|--------------------------|------------------------|-------------|
| `/products/inverters` | Ikeja Shopping Mall or Lagos manufacturing | "See inverter + battery installations" |
| `/products/voltage-stabilizers` | Zenith Textile or Federal Medical Centre | "See voltage stabilizer installations" |
| `/products/solar` | Ikeja Shopping Mall or Meadows Estate | "See PRAG solar installations" |
| `/products/batteries` | Ikeja Shopping Mall or Meadows Estate | "See battery storage installations" |
| `/solutions/backup-power` | Ikeja Shopping Mall | "See a backup power installation" |
| `/solutions/solar-energy` | Meadows Estate, Ikeja Shopping Mall | "See solar energy installations" |
| `/solutions/voltage-stabilization-protection` | Zenith Textile, Federal Medical Centre | "See voltage stabilization projects" |
| `/solutions/residential` | Meadows Estate | "See a residential installation" |
| `/solutions/commercial` | Ikeja Shopping Mall, Federal Medical Centre | "See commercial installations" |
| `/solutions/industrial` | Lagos manufacturing, Zenith Textile | "See industrial installations" |

---

## H. FAQ Recommendation List

### Tier 1 category pages
`/products/inverters`:
1. What size inverter do I need?
2. What is the difference between hybrid and heavy-duty inverters?
3. Can PRAG inverters work with lithium batteries?
4. How long will a battery bank power my appliances?

`/products/voltage-stabilizers`:
1. What is the difference between relay and servo stabilizers?
2. What stabilizer capacity do I need?
3. Can one stabilizer protect my whole house or office?
4. Why do my appliances keep failing despite using a stabilizer?

`/products/batteries`:
1. Can lithium batteries work with my inverter?
2. How do I size a battery bank for my home?
3. What battery voltage do I need for a 5kVA inverter?
4. How does backup time change with more batteries?

`/products/solar`:
1. What do I need for a complete solar power system?
2. What size solar panel system do I need?
3. What is the difference between MPPT and PWM charge controllers?
4. Can I add solar panels to my existing inverter and battery?

### Solution pages
`/solutions/backup-power`:
1. What size inverter and battery do I need for backup?
2. How long can a backup system run?
3. Can solar be added to a backup system later?

`/solutions/solar-energy`:
1. How much solar do I need to run my home?
2. Can solar eliminate generator use?
3. What does a PRAG solar installation include?

`/solutions/voltage-stabilization-protection`:
1. How do I know if my facility needs voltage stabilization?
2. What stabilizer capacity is right for a factory?

### Audience pages
`/solutions/residential`:
1. What is the best backup power system for a Nigerian home?
2. How much does a home solar system cost?

`/solutions/commercial`:
1. How do I protect business equipment from voltage fluctuations?
2. Can a commercial building run entirely on solar?

`/solutions/industrial`:
1. What power-quality problems do factories face?
2. How is an industrial stabilizer sized?

---

## I. Pages Requiring Full Rewrite

1. `/products/inverters`
2. `/products/voltage-stabilizers`
3. `/products/batteries`
4. `/products/solar`
5. `/products/hybrid-inverters` (add body content)
6. `/products/heavy-duty-inverters` (add body content)
7. `/products/relay-voltage-stabilizers` (add body content)
8. `/products/servo-voltage-stabilizers` (add body content)
9. `/products/thyristor-stabilizers` (add body content)
10. `/products/advanced-stabilizers` (add body content)
11. `/products/lithium-batteries` (add body content)
12. `/products/solar-panels` (add body content)
13. `/products/solar-charge-controllers` (add body content)
14. `/products/protective-device` (add body content)
15. `/solutions/backup-power`
16. `/solutions/solar-energy`
17. `/solutions/voltage-stabilization-protection`
18. `/installations` (expand hero + add intro copy)

---

## J. Pages Requiring Only Minor Improvement

1. `/solutions/residential` — add installation proof links, richer solution card descriptions, one Knowledge Center link.
2. `/solutions/commercial` — fix stabilizer redirect link, add case-study proof, adjust CTA.
3. `/solutions/industrial` — fix stabilizer redirect link, add case-study proof, adjust CTA.
4. `/solutions` — good structure; consider adding a 1–2 sentence closing CTA and link to `/free-power-assessment`.
5. `/products` hub — add a short introductory paragraph and a link to `/solutions`.
6. `/about` — rewrite "Nigeria's Leading Provider" summary and reconcile installation/stat claims with homepage.
7. `/knowledge-center` — hub is acceptable; focus on ensuring article pages have strong contextual links back to commercial pages.

---

## K. Content That Should Not Be Changed

The following are already live and approved from Steps 5–8. Do **not** modify without separate approval:

- **SEO titles** (from `lib/seoMeta.ts` `ROUTE_SEO_CONFIG`)
- **Meta descriptions** (from `lib/seoMeta.ts` `ROUTE_SEO_CONFIG`)
- **Canonical URLs** and `canonical` tags
- **Robots directives** (noindex rules, follow rules)
- **Sitemap architecture** (`app/sitemap.ts`)
- **Schema infrastructure** (`JsonLd` components, breadcrumb schema)
- **Redirect manifest** (`lib/redirects.ts`) — but internal links should stop pointing to redirected URLs
- **Preferred product category / URL structure** (`lib/seoTaxonomy.ts`)
- **WooCommerce product canonical paths**
- **Taxonomy approved-category allowlist**

---

## L. Proposed Implementation Order

| Phase | Action | Estimated priority |
|-------|--------|-------------------|
| 1 | Fix internal redirect chains: update all `/products/all-prag-stabilizers` internal links to `/products/voltage-stabilizers`; fix header "Lithium Batteries" → `/products/lithium-batteries`; fix homepage CTA label/URL mismatch | P0 |
| 2 | Rewrite 4 Tier 1 core commercial pages (`/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar`) with full H1 + body + FAQs + CTAs | P0 |
| 3 | Update 3 primary solution pages (`/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`) with body content, distinct intent, and proper internal links | P0 |
| 4 | Add contextual links to `/installations` from product and solution pages | P1 |
| 5 | Update `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial` with proof links, corrected stabilizer URLs, and Knowledge Center links | P1 |
| 6 | Add body content to Tier 2 subcategory pages (10 pages) | P2 |
| 7 | Add Knowledge Center reverse links from articles to commercial pages | P2 |
| 8 | Review and reconcile stat/superlative claims on `/about` and homepage with PRAG evidence | P2 |
| 9 | Product-card UX improvement: expose capacity/voltage/technology where feasible (requires WooCommerce data review) | P3 |
| 10 | FAQ schema review (Step 10, not in Step 9) | — |

---

## Master Audit Table

| S/N | URL | Page Type | Priority | Primary Keyword | Search Intent | Current H1 | Recommended H1 | Current Content Grade | Key Content Problem | Recommended New Sections | Existing Internal Links | Recommended Internal Links | Knowledge Center Opportunities | Installation/Proof Opportunities | FAQ Opportunities | CTA Recommendation | Image/Alt Issues | Cannibalisation Risk | Rewrite Level | My Recommendation |
|-----|-----|-----------|----------|-----------------|---------------|------------|----------------|----------------------|---------------------|------------------------|------------------------|---------------------------|------------------------------|----------------------------------|-------------------|--------------------|---------------------|---------------------|---------------|------------------|
| 1 | `/products/inverters` | Category | P0 | inverter Nigeria | Broad inverter products/buying | Inverters | Inverters Built for Nigerian Power Conditions | D | Hero copy narrows to "solar inverters" only; no body content | Options overview, use, home/business fit, hybrid vs heavy-duty, battery compatibility, why PRAG, related products, related solutions, FAQs | Product grid only (links to individual products) | `/products/hybrid-inverters`, `/products/heavy-duty-inverters`, `/products/batteries`, `/products/lithium-batteries`, `/solutions/backup-power`, `/solutions/solar-energy` | `inverter-sizing-and-load-capacity`, `maintaining-and-troubleshooting-inverters`, `how-much-is-inverter-in-nigeria` | Ikeja Shopping Mall, Lagos manufacturing | 4 questions | Find the Right Inverter / Talk to a PRAG Engineer | Product images use product name fallback — acceptable; review for descriptive alt | High (competes with hybrid-inverters and solar) | Major rewrite | Rewrite hero + add full body, FAQs, CTAs |
| 2 | `/products/voltage-stabilizers` | Category | P0 | voltage stabilizer | Broad stabilizer products/buying | Voltage Stabilizers | Voltage Stabilizers for Homes, Businesses & Industry | D | No CMS page; only fallback name + one sentence | Why stabilization matters, relay/servo/thyristor/advanced, residential/commercial/industrial, how to choose, why PRAG | Product grid only | `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/solutions/voltage-stabilization-protection` | `what-is-the-difference-between-relay-servo-voltage-stabilizer`, `why-we-need-servo-stabilizer`, `common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them` | Zenith Textile, Federal Medical Centre | 4 questions | Request a Stabilizer Assessment / Compare Stabilizer Types | Product images use product name fallback | Low among siblings; high vs all-prag-stabilizers redirect | Major rewrite | Create CMS page with full content |
| 3 | `/products/batteries` | Category | P0 | battery Nigeria | Battery products for inverter/solar/backup | Batteries | Reliable Batteries for Inverter, Solar & Backup Systems | D | Thin hero; generic description | Use in inverters/solar, lithium vs others, capacity/sizing, compatibility, why correct sizing | Product grid only | `/products/lithium-batteries`, `/products/inverters`, `/solutions/backup-power`, `/solutions/solar-energy` | `lithium-batteries-for-inverters`, `what-types-of-batteries-are-used-in-solar-electric-systems`, `what-is-depth-of-discharge-dod` | Ikeja Shopping Mall, Meadows Estate | 4 questions | Find the Right Battery / Explore Lithium Batteries | Product images use product name fallback | Low | Major rewrite | Rewrite hero + add full body, FAQs, CTAs |
| 4 | `/products/solar` | Category | P0 | solar products | Solar equipment catalogue | Solar | Solar Products & Equipment for Nigerian Homes & Businesses | D | Hero says "solar solutions" and "voltage fluctuations" — off-intent | Panels, controllers, protective devices, compatible batteries/inverters, complete system CTA, FAQs | Product grid only | `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/protective-device`, `/products/lithium-batteries`, `/products/hybrid-inverters`, `/solutions/solar-energy` | `the-science-behind-solar-panels`, `solar-panel-installation-a-comprehensive-guide-to-harnessing-renewable-energy`, `inverter-with-integrated-mppt` | Ikeja Shopping Mall, Meadows Estate | 4 questions | Shop Solar Products / Talk to a PRAG Solar Engineer / View Solar Installations | Product images use product name fallback | High (overlaps `/solutions/solar-energy`) | Major rewrite | Distinct equipment catalogue intent; link to solar-energy solution |
| 5 | `/products/hybrid-inverters` | Category | P1 | hybrid inverter | Specific hybrid inverter buying | Hybrid Inverters | Hybrid Inverters: Solar + Battery Backup in One Unit | D | No CMS content; fallback only | What is hybrid, solar integration, battery compatibility, home use, when to choose | Product grid only | `/products/inverters`, `/products/solar-panels`, `/products/lithium-batteries`, `/products/solar`, `/solutions/solar-energy` | `inverter-with-integrated-mppt`, `lithium-batteries-for-inverters`, `inverter-solar-battery` | Ikeja Shopping Mall | 2 questions | Explore Hybrid Inverters | Product images use product name fallback | Low (clear subcategory) | Major rewrite (add body) | Add CMS content sections |
| 6 | `/products/heavy-duty-inverters` | Category | P1 | heavy duty inverter | Specific heavy-duty/continuous inverter buying | Heavy-Duty Inverters | Heavy-Duty Inverters for Continuous Commercial & Industrial Loads | D | No CMS content; fallback only | Continuous duty, large load support, industrial applications, protection | Product grid only | `/products/inverters`, `/solutions/industrial`, `/solutions/commercial` | `inverters-for-renewable-energy-systems` | Lagos manufacturing, Zenith Textile | 1 question | Explore Heavy-Duty Inverters | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 7 | `/products/relay-voltage-stabilizers` | Category | P2 | relay voltage stabilizer | Specific relay stabilizer buying | Relay Voltage Stabilizers | Relay Voltage Stabilizers: Fast, Affordable Protection | D | No CMS content; fallback only | How relay works, speed, home/office use, capacity selection | Product grid only | `/products/voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/solutions/voltage-stabilization-protection` | `what-is-the-difference-between-relay-servo-voltage-stabilizer` | Zenith Textile (comparison) | 2 questions | Explore Relay Stabilizers | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 8 | `/products/servo-voltage-stabilizers` | Category | P2 | servo voltage stabilizer | Specific servo stabilizer buying | Servo Voltage Stabilizers | Servo Voltage Stabilizers: Precise Correction for Sensitive Equipment | D | No CMS content; fallback only | Servo-motor principle, precision, sensitive equipment, medical/lab/IT | Product grid only | `/products/voltage-stabilizers`, `/products/thyristor-stabilizers`, `/solutions/commercial`, `/solutions/industrial` | `servo-stabilizer`, `why-we-need-servo-stabilizer` | Federal Medical Centre, Zenith Textile | 1 question | Explore Servo Stabilizers | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 9 | `/products/thyristor-stabilizers` | Category | P2 | thyristor stabilizer | Specific thyristor stabilizer buying | Thyristor Stabilizers | Thyristor Stabilizers: Maintenance-Free, High-Precision Power | D | No CMS content; fallback only | Solid-state, no moving parts, high-speed, industrial/healthcare | Product grid only | `/products/voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/solutions/industrial` | `common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them` | Federal Medical Centre | 1 question | Explore Thyristor Stabilizers | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 10 | `/products/advanced-stabilizers` | Category | P2 | advanced stabilizer | Specific advanced stabilizer buying | Advanced Stabilizers | Advanced Stabilizers with Modern Voltage Protection | D | No CMS content; fallback only | Smart features, application fit, vs other types | Product grid only | `/products/voltage-stabilizers`, `/solutions/commercial`, `/solutions/industrial` | — | Zenith Textile | 1 question | Explore Advanced Stabilizers | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 11 | `/products/lithium-batteries` | Category | P1 | lithium battery | Specific lithium battery buying | Lithium Batteries | Lithium Batteries for Inverter & Solar Storage | D | No CMS content; fallback only | LiFePO4, cycle life, fast charging, compatibility, use cases | Product grid only | `/products/batteries`, `/products/inverters`, `/products/hybrid-inverters`, `/products/solar`, `/solutions/backup-power`, `/solutions/solar-energy` | `lithium-batteries-for-inverters`, `what-causes-lithium-batteries-to-overheat-and-how-to-prevent-it`, `what-is-depth-of-discharge-dod` | Ikeja Shopping Mall, Meadows Estate | 2 questions | Explore Lithium Batteries | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 12 | `/products/solar-panels` | Category | P2 | solar panels | Specific solar panel buying | Solar Panels | High-Efficiency Solar Panels in Nigeria | D | No CMS content; fallback only | Panel types, wattage, efficiency, durability, compatible controllers/batteries | Product grid only | `/products/solar`, `/products/solar-charge-controllers`, `/products/lithium-batteries`, `/solutions/solar-energy` | `the-science-behind-solar-panels`, `solar-panel-prices-in-nigeria` | Meadows Estate, Ikeja Shopping Mall | 1 question | Explore Solar Panels | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 13 | `/products/solar-charge-controllers` | Category | P2 | solar charge controller | Specific charge controller buying | Solar Charge Controllers | Solar Charge Controllers: MPPT & PWM Options | D | No CMS content; fallback only | MPPT vs PWM, battery protection, panel matching, efficiency | Product grid only | `/products/solar-panels`, `/products/lithium-batteries`, `/products/solar` | `inverter-with-integrated-mppt` | — | 1 question | Explore Charge Controllers | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 14 | `/products/protective-device` | Category | P2 | protective device | Specific protective device buying | Protective Devices | Protective Devices for Solar & Power Systems | D | No CMS content; fallback only | Surge protection, safety devices, install location, compatibility | Product grid only | `/products/solar`, `/products/voltage-stabilizers`, `/solutions/solar-energy` | — | Ikeja Shopping Mall | 1 question | Explore Protective Devices | Product images use product name fallback | Low | Major rewrite (add body) | Add CMS content sections |
| 15 | `/solutions/backup-power` | Solution | P0 | backup power solutions | Engineering/installation of backup power | Reliable Backup Power Solutions | Reliable Backup Power Solutions for Homes & Businesses | D | Placeholder CTA copy in CMS; cards all link to `/products/inverters`; no body content | Problem, approach, components, sizing, applications, related products, proof | Cards to inverters/batteries (currently all inverters) | `/products/inverters`, `/products/batteries`, `/products/lithium-batteries`, `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial`, `/installations`, `/free-power-assessment` | `tired-of-generators`, `inverter-sizing-and-load-capacity` | 3 questions | Request a Backup Power Assessment | No image alt issues | Medium (overlaps product pages if not differentiated) | Major rewrite | Add body, fix card links, add proof |
| 16 | `/solutions/solar-energy` | Solution | P0 | solar energy systems | Solar installation & design | Solar Energy Solutions | Solar Energy Systems & Installation for Nigerian Homes & Businesses | D | CMS cards all link to `/products/solar`; too product-like | Design & install process, components, applications, case studies | Cards to `/products/solar` | `/products/solar-panels`, `/products/solar-charge-controllers`, `/products/hybrid-inverters`, `/products/lithium-batteries`, `/products/protective-device`, `/installations`, `/free-power-assessment` | `solar-installation-services-by-prag`, `what-can-a-2-5-kva-solar-system-power` | Meadows Estate, Ikeja Shopping Mall | 3 questions | Get a Free Solar Assessment | No image alt issues | High (overlaps `/products/solar`) | Major rewrite | Solution intent: design/install, not equipment catalogue |
| 17 | `/solutions/voltage-stabilization-protection` | Solution | P0 | voltage stabilization | Voltage protection engineering & install | Voltage Stabilization & Protection Solutions | Voltage Stabilization & Protection Solutions for Nigerian Facilities | D | Cards link to redirected `/products/all-prag-stabilizers` | Problem, engineering approach, stabilizer types, facility coverage, proof | Cards to all-prag-stabilizers (redirect) | `/products/voltage-stabilizers`, `/products/relay-voltage-stabilizers`, `/products/servo-voltage-stabilizers`, `/products/thyristor-stabilizers`, `/products/advanced-stabilizers`, `/installations`, `/free-power-assessment` | `common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them` | Zenith Textile, Federal Medical Centre | 2 questions | Request a Site Assessment | No image alt issues | Medium | Major rewrite | Fix redirects, add body/proof |
| 18 | `/solutions/residential` | Solution | P1 | residential power solutions | Home power solutions | Reliable Power for Modern Living | Reliable Home Power Solutions for Nigerian Households | B | Good problem carousel; cards generic; no proof | Add "How PRAG designs home systems", proof links, Knowledge Center | Solution cards to sub-solution pages | `/solutions/residential/home-backup-power`, `/solutions/residential/home-solar-systems`, `/solutions/residential/power-stabilization-protection`, `/products/inverters`, `/products/lithium-batteries`, `/products/voltage-stabilizers`, `/installations` | `how-much-is-inverter-in-nigeria`, `what-can-a-2-5-kva-solar-system-power` | Meadows Estate | 2 questions | Get a Home Power Assessment | Decorative images have alt text — acceptable | Low | Minor improvement | Enrich cards + add proof |
| 19 | `/solutions/commercial` | Solution | P1 | commercial power solutions | Business power solutions | Smart Energy Systems for Growing Businesses | Commercial Power Solutions for Nigerian Businesses | B | Stabilizer card uses redirect; no proof | Fix stabilizer link, add commercial case-study proof, add assessment CTA | Solution cards to products and sub-solutions | `/products/inverters`, `/products/solar`, `/products/voltage-stabilizers`, `/solutions/commercial/office-backup-power`, `/solutions/commercial/solar-for-businesses`, `/solutions/commercial/power-stabilization-protection`, `/installations` | `how-much-is-inverter-in-nigeria` | Ikeja Shopping Mall, Federal Medical Centre | 2 questions | Request a Business Power Assessment | Decorative images have alt text | Low | Minor improvement | Fix links, add proof |
| 20 | `/solutions/industrial` | Solution | P1 | industrial power solutions | Heavy-duty power solutions | Engineered Power for Heavy-Duty Operations | Industrial Power Solutions for Factories & Plants | B | Stabilizer card uses redirect; no proof | Fix stabilizer link, add industrial case-study proof | Solution cards to products and sub-solutions | `/products/voltage-stabilizers`, `/products/solar`, `/products/heavy-duty-inverters`, `/installations` | `common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them` | Lagos manufacturing, Zenith Textile | 2 questions | Talk to an Industrial Engineer | Decorative images have alt text | Low | Minor improvement | Fix links, add proof |
| 21 | `/products` | Product hub | P2 | PRAG products | Browse product categories | Our Products | Our Products | C | Hero only; no supporting copy | Short intro, links to 4 pillars and `/solutions` | Links to product categories within grid | `/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar`, `/solutions` | — | — | — | Explore Power Solutions / Browse Categories | No images | Low | Minor improvement | Add hub intro + cross-link to solutions |
| 22 | `/solutions` | Solutions hub | P2 | power solutions Nigeria | Browse solutions | Power Solutions for Every Challenge | Power Solutions for Every Challenge | B | 3 good content cards; no closing CTA | Add closing CTA to `/free-power-assessment` | Cards to residential/commercial/industrial | `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial`, `/solutions/backup-power`, `/solutions/solar-energy`, `/solutions/voltage-stabilization-protection`, `/free-power-assessment` | — | — | — | Request a Power Assessment | Industrial/commercial/residential images have alt text | Low | Minor improvement | Add hub CTA |
| 23 | `/installations` | Proof/case studies | P2 | PRAG installations | View PRAG project portfolio | Real Installations, Measurable Results. | Real PRAG Installations Across Nigeria | C | Hero only; rest is dynamic grid | Expand hero description; add category filter intro | CTA to `/contact` | `/solutions/residential`, `/solutions/commercial`, `/solutions/industrial` | — | — | — | Start Your Installation → | Case-study images use descriptive alt — acceptable | Low | Minor rewrite | Expand intro + contextual cross-links |
| 24 | `/knowledge-center` | Blog hub | P2 | PRAG knowledge center | Read guides & insights | Knowledge Center | Knowledge Center | C | Hero only; rest is dynamic grid | Consider adding category/tag intros | Links to individual articles | `/products/inverters`, `/products/voltage-stabilizers`, `/products/batteries`, `/products/solar` (from individual articles, not hub) | — | — | — | View all articles | No images | Low | Minor improvement | Ensure article pages link back to commercial pages |
| 25 | `/about` | Static | P3 | PRAG about | Learn about PRAG | Engineering Reliable Power Solutions for Real-World Challenges | Engineering Reliable Power Solutions for Real-World Challenges | C | "Nigeria's Leading Provider" unverified claim; stats conflict with homepage | Rewrite summary; reconcile stats | — | `/installations`, `/solutions` | — | — | — | — | Team/story images have alt text — acceptable | Low | Minor improvement | Remove unverified superlatives; reconcile numbers |
| 26 | `/` (Homepage) | Homepage | P0 | PRAG Nigeria | Main brand/products | Unreliable or No Power? Low or High Voltage? Get PRAG | Unreliable or No Power? Low or High Voltage? Get PRAG | B | Good structure; unverified claims and redirect links | Fix stabilizer CTA to `/products/voltage-stabilizers`; fix lithium CTA to `/products/lithium-batteries`; reconcile stat claims | Hero, 3 solutions, 4 reasons, 4 technologies, knowledge, problems | Technology/problem CTAs to product pages | `/products/voltage-stabilizers`, `/products/inverters`, `/products/solar`, `/products/lithium-batteries`, `/solutions/*` | — | — | — | Get a Free Power Assessment | Decorative images have alt text | Low | Minor improvement | Fix redirect links and superlatives |

---

## Additional Notes

1. **No code or content changes were made** in this Step 9 audit. All recommendations are staged for PRAG approval.
2. **Metadata ownership preserved:** No SEO titles, meta descriptions, canonicals, robots, sitemap, schema, redirects, or product URL structure were modified.
3. **Statistical consistency required:** Homepage claims "500+ installations nationwide"; About page claims "50K+ System Installed". PRAG must confirm the correct number; conflicting claims harm trust.
4. **Superlative claims to verify or remove:** "Nigeria's Leading Provider", "Trusted by Thousands Nationwide", "Leading Homes and Businesses" — remove or support with approved evidence.
5. **Product-card improvement scope:** Do not redesign cards. Recommended SEO/UX additions only: expose key specs (capacity, voltage, type) if they exist in WooCommerce attributes; keep price and "Learn more" / "Buy" CTAs.
6. **FAQ structured data:** Do not implement in Step 9 unless separately approved.

---

*Report prepared by Devin for PRAG SEO Recovery Step 9. Awaiting approval before implementation.*

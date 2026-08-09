# PRAG Step 9 — Fact Claim Reconciliation Table

**Status:** PRAG-APPROVED VALUES APPLIED. All conflicting claims corrected across the live site. Factual consistency verified.
**Date:** 2026-08-09 (updated with PRAG-approved values)

## PRAG-approved facts and public wording

| Claim | PRAG-approved value | Public wording to use |
|-------|---------------------|------------------------|
| Founding Year | 2012 | "Founded in 2012" |
| Power Industry Experience | 15+ Years | "15+ Years of Power Industry Experience" |
| States Covered | 36 | "36 States Covered" |
| Systems Installed | 50K+ | "50K+ Systems Installed" |
| Trusted by Thousands | APPROVED | "Trusted by Thousands" |
| Leading Provider | APPROVED | "Leading Provider" |

## Wording that must NOT be used

- **"15+ Years Active"** — conflicts with the 2012 founding year (2012 → 2026 = 14 years). Use "15+ Years of Power Industry Experience" instead, which refers to industry experience rather than company age.
- **"Founded in 2005"** / **"Since 2005"** — incorrect; replaced with "Founded in 2012".
- **"500+ installations"** — incorrect; replaced with "50K+ Systems Installed".
- **"Twenty years later"** (in the About story) — conflicts with 2012 founding; rephrased.
- **"20+ Years of Engineering Experience"** — replaced with "15+ Years of Power Industry Experience".
- **"20+ Years Active"** — replaced with "15+ Years of Power Industry Experience".

## Fact Claim Reconciliation Table (resolved)

| # | Claim | Current page/location | Original value | Conflicting value | Corrected to | Status |
|---|-------|-----------------------|----------------|-------------------|--------------|--------|
| 1 | Year founded | `/about` story paragraph (`STORY_PARAS`) | "founded in 2005" | 2012 (PRAG-confirmed) | "Founded in 2012" | ✅ Applied |
| 2 | Year founded (metadata) | `lib/seoMeta.ts` `/about` title & description | "Since 2005", "founded in 2005" | 2012 (PRAG-confirmed) | "Founded in 2012" | ✅ Applied |
| 3 | Years of power industry experience | `/about` fallback stats (`FALLBACK_STATS`) | "20+ Years Active" | 15+ (PRAG-confirmed) | "15+ Years of Power Industry Experience" | ✅ Applied |
| 4 | Years of engineering experience (homepage) | Homepage `ProblemsSection.tsx` `STATS` | "20+ Years of Engineering Experience" | 15+ (PRAG-confirmed) | "15+ Years of Power Industry Experience" | ✅ Applied |
| 5 | Systems installed (/about) | `/about` story paragraph & fallback stats | "over 50,000 systems" / "50K+ System Installed" | 50K+ (PRAG-confirmed) | "50K+ Systems Installed" | ✅ Applied |
| 6 | Installation count (homepage) | Homepage `ProblemsSection.tsx` `STATS` | "500+ installations nationwide" | 50K+ (PRAG-confirmed) | "50K+ Systems Installed" | ✅ Applied |
| 7 | System count | `/about` fallback stats | "50K+ System Installed" | 50K+ (PRAG-confirmed) | "50K+ Systems Installed" | ✅ Applied |
| 8 | Customer trust | Homepage `WhyPragSection.tsx` | "Trusted by Thousands Nationwide" | APPROVED | "Trusted by Thousands" (kept) | ✅ Confirmed |
| 9 | States covered | `/about`, Homepage `ProblemsSection.tsx`, `/distributor`, `lib/seoMeta.ts` | "36 states" / "all 36 states" | 36 (PRAG-confirmed) | "36 States Covered" | ✅ Applied |
| 10 | "Leading provider" superlative | `/about` story title fallback (`storyTitle`) | "Nigeria's Leading Provider..." | APPROVED | "Leading Provider" (kept) | ✅ Confirmed |
| 11 | "Trusted by thousands" | Homepage `WhyPragSection.tsx` | "Trusted by Thousands Nationwide" | APPROVED | "Trusted by Thousands" (kept) | ✅ Confirmed |
| 12 | "Twenty years later" (About story) | `/about` `STORY_PARAS` | "Twenty years later, we've installed over 50,000 systems across 36 states" | Conflicts with 2012 founding | Rephrased to remove "twenty years" and use "50K+ systems" | ✅ Applied |

## Files modified

- `docs/STEP9_FACT_CLAIM_RECONCILIATION.md` — this file
- `components/ProblemsSection.tsx` — homepage stats bar
- `components/WhyPragSection.tsx` — "Trusted by Thousands" (confirmed, no change needed)
- `app/about/page.tsx` — story paragraphs, fallback stats, story title
- `lib/seoMeta.ts` — `/about` route SEO title + description
- `app/distributor/page.tsx` — "all 36 states" (confirmed correct, no change needed)
- `components/Footer.tsx` — "leading power engineering company" (confirmed, no change needed)

## Notes

- The single most important reconciliation was **#5 vs #6**: the About page claimed 50,000+ systems while the Homepage claimed 500+ installations. Both now consistently use "50K+ Systems Installed".
- "15+ Years of Power Industry Experience" is used instead of "15+ Years Active" because the 2012 founding year (14 years to 2026) would make "years active" factually inconsistent, whereas "power industry experience" can encompass the team's pre-founding experience.
- No schema/JSON-LD `foundingDate` field existed, so none needed correction. The Organization and WebSite schema descriptions in `app/page.tsx` contain no factual claims and were left unchanged.
- The layout-level metadata in `app/layout.tsx` (title, description, OG, Twitter) contains no factual claims and was left unchanged.

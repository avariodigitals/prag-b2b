# Prag B2B — Project Notes

## Commands
- `npm run dev` — start dev server (webpack)
- `npm run build` — production build
- `npm run lint` — eslint

## Bot Protection (Cloudflare Turnstile + Rate Limiting)
All public-facing forms are protected by Cloudflare Turnstile plus per-IP
server-side rate limiting (5 submissions / 10 min / IP / route).

### Required env vars (in `.env.local`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — public site key (used by the client widget)
- `TURNSTILE_SECRET_KEY` — server secret key (used to verify tokens)

Get both from https://dash.cloudflare.com -> Turnstile -> Add site.
When left blank, verification is skipped (fail-open) so dev/forms keep working.
**Set real keys in production** to actually enforce the robot check.

### How it's wired
- Client widget: `components/Turnstile.tsx` (renders the challenge, reports token up)
- Server verify: `lib/turnstile.ts` (`verifyTurnstileToken`, `getClientIp`)
- Rate limiter: `lib/rateLimit.ts` (in-memory, per-route buckets)

### Protected forms / routes
- `components/ContactForm.tsx` -> `app/api/contact/route.ts`
- `components/FreePowerAssessmentForm.tsx` -> `app/api/contact/route.ts` (reuses contact)
- `components/CareersForm.tsx` -> `app/api/careers/route.ts` (FormData; token in `turnstileToken` field)
- `components/DistributorForm.tsx` -> `app/api/distributor/route.ts`
- `components/TechnicalSupportForm.tsx` -> `app/api/technical-support/route.ts`

Each route: (1) rate-limit check -> 429, (2) Turnstile verify -> 400, then existing logic.
The captcha token is stripped before forwarding to WordPress / Prag-Admin.

## Performance / Rendering (do not regress)
- Pages are static/ISR by default (content revalidates every 60s via the
  `b2b-public-content` cache in `lib/b2bContent.ts`, plus `/api/revalidate`
  tags). Only query-driven pages stay dynamic (`/products`, `/products/[category]`,
  `/knowledge-center`, `/resources`, `/compare`... and the `?tab=` solution
  subpages). Do NOT add `force-dynamic` to content pages.
- `middleware.ts` uses precompiled matchers (`splitRedirects`): exact-match
  sources go in a Map, `:param` sources are compiled once at module scope.
  Add redirects to `lib/redirects.ts` (LEGACY_REDIRECTS) — do not hand-roll
  regex matching in middleware.
- Admin-injected scripts (`settings.scripts.head/body/footer`,
  `integrations.zohoOneScript`, `integrations.customDomainHook`) render via
  `next/script` (deferred) in `app/layout.tsx` — they no longer block render.
  Keep it that way; do not revert to raw `<script>` tags.
- Always use `next/image` for content images. Only use `unoptimized` or raw
  `<img>` for assets whose host is outside `**.prag.global`
  (images.remotePatterns) — e.g. third-party store logos.

## On-Demand Revalidation (Prag-Admin -> frontend)
Prag-Admin calls `POST /api/revalidate?secret=...` with `{paths, tags}` after
every save (`lib/revalidateFrontend.ts`, a `'use server'` module).
`app/api/revalidate/route.ts` uses `revalidateTag(tag, { expire: 0 })` for
immediate expiry (the `'max'` profile serves stale for ~5 min). Any `fetch()`
inside an `unstable_cache` in `lib/woocommerce.ts` must set `next.tags`
matching the wrapper's tag or `revalidateTag` won't reach the underlying
fetch cache — tag names must match what Prag-Admin sends (`b2b-*` tags).

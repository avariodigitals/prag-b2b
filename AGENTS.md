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

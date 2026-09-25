# Amsi Spaces — build

Astro site (SSR, via the official `@astrojs/cloudflare` adapter) for
amsispaces.com, deployed to Cloudflare Pages, backed by D1 (leads, click
logs, webhook events) and KV (cached Palmera catalogue). Built from
`amsi-spaces-project-brief.md`, then rewired against Palmera's real Partner
API once it was found (see below) — no more manual-only lead registration
or MCP-only property data; both are live integrations now.

## Architecture

```
src/
  layouts/, components/, data/, lib/currency.ts
  lib/palmera.ts        Palmera Partner API client — Track A (catalogue
                         sync + read) and Track B (create lead)
  pages/
    index.astro, properties/, resources/, blog/, disclosure/privacy/terms,
    advertise.astro          — SSR where they need live data, static
                                (`export const prerender = true`) where they don't
    api/
      lead.ts               POST /api/lead — saves to D1, registers a
                             Palmera lead (Track B) when project-specific
      properties.ts         GET /api/properties — used by the client-side
                             market-tab/filter refresh on /properties
      palmera-sync.ts        POST/GET /api/palmera-sync — runs the daily
                             catalogue sync (see "Scheduling the sync" below)
      palmera-webhook.ts     POST /api/palmera-webhook — Palmera's
                             lead.status_changed etc. land here
      gumroad-ping.ts        POST /api/gumroad-ping — Gumroad sale webhook
    go/[partner].ts          GET /go/:partner — click logging + redirect
                             (Tools/Courses/e-guide affiliate links only;
                             Palmera "View project" links go straight to
                             Palmera's shareUrl and never touch this route)
schema.sql                  D1 schema
wrangler.toml                Cloudflare Pages config
```

Every page in the brief's sitemap is built: Home, Properties (+ detail),
Resources (4 tabs), Blog (+ article), the three legal pages, the shared
enquiry footer, and a placeholder Advertise page. `npm run build` produces
a working Cloudflare Worker (`dist/_worker.js`) plus static assets — tested
locally end to end with `wrangler pages dev` against local D1/KV emulation:
routes render, the enquiry form writes to D1, `/go/:partner` logs and
redirects, and `/api/palmera-sync` correctly attempts the real Palmera API
call (it only failed in this dev sandbox because that network egress isn't
allowed here — the request shape itself is right).

## Palmera integration — now real, not manual

The brief assumed "no lead-submission API exists" and that property data
came from an MCP-only connector. Both of those turned out to be
incomplete: Palmera has a documented Partner REST API at
`https://api.palmera.realestate/api/v1/partner-api/v1` (OpenAPI spec at
`/api/partner-docs-json`, integration brief at `/api/partner-docs.md`).
This build now calls it directly — see `src/lib/palmera.ts`, which is a
straight implementation of that spec (only endpoints/fields/headers it
documents are used; nothing invented).

**Track A — show projects.** `syncCatalogue()` runs a full
`GET /projects/export` on day one (stores the ETag), then
`GET /projects/changes?since=<cursor>` on every later run (added/updated
projects are upserted, removed ones are deleted from the cache — nothing
lingers). The result lives in the `PALMERA_CACHE` KV namespace.
`fetchProjects`/`fetchProject` read from that cache; `/properties` and its
detail pages never call Palmera directly on a visitor's request. If the
cache is empty (fresh deploy, sync hasn't run yet), everything falls back
to `src/data/sampleProperties.ts` — real sample data, not placeholders — so
the site never shows a blank page.

**Track B — send & track leads.** When someone submits the enquiry form
about a specific project (via "Ask Amsi about this" on a card or a property
page) and ticks the required consent checkbox, `POST /api/lead` calls
Palmera's `POST /leads` with an `Idempotency-Key` (the lead's own D1 id, so
a retry never double-creates it), then stores the returned Palmera lead id
and status. Status after that is **not polled** — Palmera pushes updates to
`POST /api/palmera-webhook`, which verifies the HMAC signature over the raw
request body exactly per their recipe (timestamp tolerance, dedupe on event
id, 2xx-then-process), and updates `leads.palmera_status` accordingly.

Two Palmera surfaces that are **not** used here, on purpose:
- `https://api.palmera.realestate/api/v1/partner/mcp` — Palmera's own
  hosted MCP server, for AI agents to talk to. Not designed for a plain
  backend to call.
- The Palmera MCP connector available inside a Claude session
  (`get_partner_context`, `list_projects`, ...) — only reachable from
  Claude, not from a Cloudflare Worker.

## Testing the Palmera integration before you touch production

Do this yourself once you have a real key — I don't have `PALMERA_KEY` and
never asked you to paste it here:

```bash
curl -sH "Authorization: Bearer $PALMERA_KEY" \
  https://api.palmera.realestate/api/v1/partner-api/v1/me
```

Confirms the key works and shows its scopes, your referral links, and the
current catalogue size. Check the response has `projects:read` and
`leads:write` in `key.scopes` — those are the two this build needs.

## Deploying

```bash
npm install
npm run build                                  # -> dist/ (a working Cloudflare Worker)

wrangler d1 create amsi_spaces                 # paste the returned id into wrangler.toml
wrangler kv namespace create PALMERA_CACHE     # paste the returned id into wrangler.toml
wrangler d1 execute amsi_spaces --remote --file=./schema.sql

wrangler pages project create amsi-spaces
wrangler pages secret put PALMERA_KEY              # from Palmera's partner area (ppk_live_...)
wrangler pages secret put PALMERA_WEBHOOK_SECRET    # from the webhook endpoint you create there
wrangler pages secret put PALMERA_SYNC_SECRET       # generate your own: openssl rand -hex 32
wrangler pages secret put TURNSTILE_SECRET_KEY
wrangler pages secret put ALERT_EMAIL_API_KEY
wrangler pages secret put N8N_LEAD_WEBHOOK_URL      # optional

npm run pages:deploy
```

### Google Analytics & Search Console

Both are optional, non-secret, and inlined into the static build at
`astro build` time (not runtime Cloudflare bindings), so they're set via a
local `.env` file (gitignored) before running `npm run build` /
`npm run pages:deploy` rather than `wrangler pages secret put`:

```bash
# .env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX          # analytics.google.com → Admin → Data streams
PUBLIC_GOOGLE_SITE_VERIFICATION=abc123...       # search.google.com/search-console → Settings →
                                                 # Ownership verification → HTML tag method, just the
                                                 # content="..." value, not the full <meta> tag
```

Leaving either unset omits it entirely — no script tag, no meta tag, no
request to Google. When `PUBLIC_GA_MEASUREMENT_ID` is set, GA4 still only
loads once a visitor accepts the "Analytics" category in the cookie banner
(`src/components/CookieBanner.astro` / `src/components/GoogleAnalytics.astro`);
it does not track visitors who decline or haven't yet answered the banner.

`/sitemap.xml` and `/robots.txt` are already wired up (the latter is a
static file at `public/robots.txt`; the former is a live route —
`src/pages/sitemap.xml.ts` — that includes property detail pages straight
from the same Palmera KV cache `/properties` reads, so it never goes stale
against the catalogue).

### AdSense (Blog only)

Per `advertise.astro`'s existing policy ("We do not run display advertising
on Properties or Financing pages"), the only AdSense placement is a sticky
right-rail ad on `/blog` and `/blog/:slug` (`src/components/BlogSidebarAd.astro`),
gated behind the "Advertising" cookie category exactly like GA is gated
behind "Analytics" — no ad network request happens until a visitor clicks
"Accept all". Two more build-time `PUBLIC_` vars, same pattern as GA/Search
Console:

```bash
# .env
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-5667967016852581           # your AdSense publisher ID, "ca-" + the pub-... value
PUBLIC_ADSENSE_BLOG_SIDEBAR_SLOT=xxxxxxxxxx                  # the ad unit's slot ID — create a Display ad unit
                                                              # in AdSense (Ads → By ad unit → Display ads) sized
                                                              # for a sidebar, and use the data-ad-slot value it gives you
```

`public/ads.txt` is already in place with the `pub-5667967016852581`
account. Leaving `PUBLIC_ADSENSE_BLOG_SIDEBAR_SLOT` unset omits the ad
entirely (same "unset = feature off" pattern as everything else here).

Then in the Cloudflare dashboard: Pages project → Custom domains → add
`amsispaces.com` (and `www`), which walks you through pointing the domain's
nameservers at Cloudflare if it isn't already on Cloudflare DNS.

In Palmera's partner area, create a webhook endpoint pointed at
`https://amsispaces.com/api/palmera-webhook`, copy the signing secret it
shows you (once — that's `PALMERA_WEBHOOK_SECRET`), and send yourself a test
`endpoint.test` ping to confirm it verifies.

## Scheduling the daily catalogue sync

`/api/palmera-sync` isn't self-scheduling — Cloudflare Pages Functions
don't get a built-in cron trigger the way a standalone Worker does. Pick
one:

1. **cron-job.org** (free, simplest) — a daily job that does
   `POST https://amsispaces.com/api/palmera-sync` with header
   `X-Sync-Secret: <your PALMERA_SYNC_SECRET>`.
2. **GitHub Actions** — a workflow on a `schedule: cron:` trigger that curls
   the same URL.
3. **n8n**, once it's stood up per the brief — a Cron node calling the same
   endpoint. This is probably the natural long-term home for it since n8n
   is already planned for Gumroad/lead automation.

`/projects/changes` is rate-limited at 60/min, so there's no harm running
this more than once a day if you want fresher listings — just don't run the
*first* full export (`/projects/export`, 6/hour · 24/day) more than that.

## Real open items left

1. **Legal page content.** `disclosure.astro`/`privacy.astro`/`terms.astro`
   have the right structure and every confirmed point wired in, but body
   paragraphs are `[PLACEHOLDER]` — the brief referenced finished drafts
   that weren't in the uploaded file. Drop in the real text, then get the
   lawyer review the brief calls for regardless (Tanzania jurisdiction
   clause especially).
2. **Real Gumroad products** — `src/data/eguides.ts` has placeholder
   `gumroadUrl`s.
3. **A real financing partner** — Financing tab is built and correctly
   labelled, no partner signed yet (brief Section 9).
4. **The Advertise page's actual design** — not yet drafted in Claude
   Design per the brief; current page is a reasonable placeholder.
5. **A confirmed sender for the email alert** — `api/lead.ts` calls a
   generic Resend-style endpoint; swap for whichever of
   Brevo/MailerLite/Resend you pick, per the brief.

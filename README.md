# nourishwithcalista.com

Callie Chammas’s founder page. Static Astro on Cloudflare Pages — same pattern as the Macros and Mamas marketing site.

Two jobs, in order:

1. Send mamas to [macrosandmamas.com](https://www.macrosandmamas.com)
2. Corporate speaking inquiries via `mailto:calista@nourishwithcalista.com`

## Local

```bash
npm install
npm run dev
npm run build
npm run preview
```

Node 22.12+.

## Cloudflare Pages

This repo is the Pages project. Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Astro (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

`functions/api/subscribe.ts` is picked up as a Pages Function (`POST /api/subscribe`).

Do **not** add the `@astrojs/cloudflare` adapter. This site is static HTML plus classic Pages Functions, same as `macrosandmamas-marketing`.

### Environment

**Plaintext** (also in `wrangler.toml`):

- `RESEND_AUDIENCE_ID` — Resend segment `General` (`f26d50aa-ffcb-4936-a970-20908c499174`)

**Secret** (Pages → Settings → Variables and Secrets, Production and Preview):

- `RESEND_API_KEY` — full-access Resend key (contacts create)

Optional build var: `PUBLIC_NOINDEX=true` on preview.

### Domain

`nourishwithcalista.com` and `www.nourishwithcalista.com` are Pages custom domains. Apex + www CNAMEs point at `nourishwithcalista.pages.dev` (proxied). Google Workspace MX records must stay untouched.

`www` → apex is handled by `functions/_middleware.ts`. Pages `_redirects` cannot match on hostname.

SSL/TLS should be **Full (strict)**. Always Use HTTPS: on.

## Newsletter

The footer form POSTs `{ email }` to `/api/subscribe`. Honeypot field is `website`. Works without JS (normal form POST → `/?subscribed=1`).

Resend’s plan is at the 3-segment cap, so subscribers land on the existing **General** segment rather than a dedicated “Nourish newsletter” list. Upgrade Resend if you want a separate audience.

## After launch

Export the Webflow site as a backup zip, then cancel Webflow once the new site has been live for a few days. Submit `https://nourishwithcalista.com/sitemap-index.xml` in Search Console (the Google verification tag is kept).

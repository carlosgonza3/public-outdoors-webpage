# PUBLIC launch checklist

Production domain: https://publicoutdoors.com. Hosting provider: not selected.
This document records preparation, not a completed deployment.

## Already prepared

- Spanish document language, distinct route titles and descriptions.
- Static Open Graph/Twitter metadata using the existing contact card image.
- Organization structured data and domain-aware canonical URLs.
- Production sitemap and robots.txt; previews use noindex (crawling remains allowed so crawlers can see that directive).
- Availability remains noindex while it says “Próximamente”.
- Route HTML entry points for direct links and reloads, including GitHub Pages subpaths.
- Standalone 404 page and unknown-route UI; no blanket home-page redirect.
- Optional Cloudflare Web Analytics, disabled by default and in non-indexable builds.
- Netlify build configuration, security headers, and immutable caching for hashed assets.
- Automated build-output checks: `npm run check:release`.

## Content blocker

`src/sections/TeamScene.tsx` explicitly contains placeholder names, roles, biographies and illustrated portraits (Alex Rivera, Sofía Méndez, Mateo Cruz, Valeria Santos). Replace these with approved team content or hide the section and its navigation links before launch. Also verify the impact figures and company timeline.

## Hosting and domain

1. Choose a static host and connect this repository. Use Node 24, `npm ci`, `npm run lint && npm run build`, publish `dist`.
2. Set production build variables:
   - `VITE_SITE_URL=https://publicoutdoors.com`
   - `VITE_BASE_PATH=/`
   - `VITE_ALLOW_INDEXING=true`
   - `VITE_CLOUDFLARE_ANALYTICS_TOKEN=` (optional; see below)
3. Keep previews and branch deployments at `VITE_ALLOW_INDEXING=false`. The Netlify configuration does this for its standard preview contexts. Keep the existing GitHub Pages build as a noindex preview, or retire it after production is working.
4. Configure apex and www DNS with the selected provider's exact records. Preserve existing MX, SPF, DKIM, DMARC and verification records. Confirm email still works.
5. Enable HTTPS, redirect HTTP and www to `https://publicoutdoors.com`, preserving paths and query strings. Serve route directories consistently with their trailing-slash canonical URLs.
6. Serve known route directories before the 404 fallback. Unknown URLs must return HTTP 404. `_headers` and `_redirects` are provider-specific; configure equivalent behavior on hosts that do not support them. GitHub Pages does not apply these header files.
7. Record who owns the hosting/DNS accounts and how to restore the previous deploy. Do not change production DNS until preview checks pass.

## Analytics

Recommended initial option: Cloudflare Web Analytics for traffic and performance metrics. It can be installed on a site hosted elsewhere, and it supports React history navigation. This integration does not measure bespoke WhatsApp/contact conversions.

Create a Web Analytics site for `publicoutdoors.com` in the business's Cloudflare account. Copy the public token from its beacon snippet into `VITE_CLOUDFLARE_ANALYTICS_TOKEN` in the production build environment, then rebuild. Do not use a Cloudflare API token. The build validates the beacon token format. Use manual snippet installation if Cloudflare offers automatic injection, to avoid duplicate collection. Leave the variable empty to launch without analytics.

Before enabling it, finalize the privacy notice and assess the chosen configuration against the applicable privacy rules. A cookie-free service does not by itself settle all data-protection obligations. After deployment, verify one beacon loads and page changes appear in the dashboard. Check the actual browser network/storage state, including scripts injected by the hosting platform. No analytics account or active token was provisioned during this preparation.

Sources:
- https://www.cloudflare.com/web-analytics/ (no cookies or localStorage)
- https://developers.cloudflare.com/web-analytics/get-started/ (manual installation)
- https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/ (SPA navigation)

## Cookies and privacy

The audited app code does not write cookies, localStorage or sessionStorage. There are no embedded maps, social feeds, advertising pixels, or onsite data-submission forms. Contact buttons open external email, phone, WhatsApp, map and social services. The contact-card export fetches a local image. Device orientation is used locally for a visual effect; the code does not send it to a server.

Do not add a cosmetic cookie banner to this implementation. Reassess the live host and any analytics, marketing pixels, embedded services or storage added later. If the chosen technology requires consent, block it until consent and provide rejection and withdrawal controls; a banner alone is insufficient.

Publish a Spanish privacy notice linked from the footer once these facts are confirmed:

- Legal business/controller name and a monitored privacy contact.
- Hosting provider and actual access-log purposes, retention and recipients.
- Whether Cloudflare analytics is enabled, its data processing and transfers.
- How inquiries received by email/WhatsApp are handled, retained and deleted.
- The applicable rights and how people can exercise them.

Suggested starting copy (incomplete, not ready to publish):

> Este sitio presenta los servicios de PUBLIC en El Salvador. La aplicación no utiliza cookies publicitarias ni almacena preferencias en tu navegador. Al seleccionar enlaces de correo, WhatsApp, mapas o redes sociales, accederás a servicios de terceros sujetos a sus propios avisos de privacidad. Para consultas sobre privacidad, contacta a [contacto confirmado].

Add the confirmed controller, hosting/logging, inquiry handling and analytics disclosures before publishing the notice. Do not claim that the website collects no personal data: hosting logs and subsequent contact inquiries may contain it. El Salvador has a personal-data protection law and reported amendments in September 2026, so the final notice should be checked against the current local requirements.

Sources:
- https://www.asamblea.gob.sv/node/13376
- https://www.asamblea.gob.sv/node/14116
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/ (UK guidance only, not a determination of Salvadoran law)

## Release verification

- Run lint, build and `npm run check:release` against the release commit.
- Run `npm audit` with registry access and address applicable production vulnerabilities.
- Open home, indoor, outdoor, innovations and availability directly and refresh each. Verify unknown URLs return 404 from the host, not just an error-looking page with HTTP 200.
- Test mobile Safari, Chrome/Android, desktop, keyboard navigation and reduced motion. Check contact links, gallery modals, back navigation and image/card sharing.
- Check PageSpeed Insights on the actual deployment. The current body depends on JavaScript; use Search Console URL Inspection to confirm rendered content is indexed. Full body prerendering is a possible follow-up if indexing or performance suffers.
- Confirm the social preview image and published phone/email details are approved, and rights to project photos and client logos are cleared.
- Confirm the intended treatment of the coming-soon availability page (currently public but noindex).
- Verify the production HTML has `index, follow`, correct canonicals and working absolute social image URLs. Check that previews retain noindex.
- Verify `/robots.txt` and `/sitemap.xml`; submit the sitemap to Google Search Console after domain verification. Search indexing is not immediate or guaranteed.
- Test HTTPS/www redirects, security headers, 404 responses and cache behavior on the selected host. Avoid long caching for HTML; hashed assets may be cached for one year.
- Capture a last working deployment for rollback, then check the live site after DNS propagation.

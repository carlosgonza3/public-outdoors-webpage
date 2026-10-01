# PUBLIC Outdoors

Phase 1 of the PUBLIC Outdoors website: an animated, responsive marketing site
for PUBLIC's outdoor, indoor, and innovative advertising formats in El Salvador.

Production domain: [publicoutdoors.com](https://publicoutdoors.com)

Phase 1 is a static React application. A second phase is planned approximately
one month after launch and will turn the current availability placeholder into a
CMS-backed catalog of advertising spaces, most likely using Sanity.

## Current status

Phase 1 includes:

- An animated home page with introduction, media gallery, impact, purpose,
  team, history, and contact sections.
- Dedicated routes for indoor, outdoor, and innovation media.
- A public `/disponibilidad/` route that currently displays a “Próximamente”
  placeholder. It is intentionally excluded from search indexing.
- Responsive layouts, reduced-motion handling, image lightboxes, and contact
  card sharing.
- Route-specific SEO metadata, Open Graph/Twitter metadata, organization
  structured data, sitemap generation, and crawler controls.
- Optional cookie-free Cloudflare Web Analytics support.
- GitHub Pages preview deployment and production-ready Netlify configuration.

Netlify is the production host, the GitHub repository is connected, and the
production domain is configured. The temporary coming-soon branch remains live
until the Phase 1 release is promoted from `main`. See
[`docs/launch-checklist.md`](docs/launch-checklist.md) before release.

## Technology stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript 6 |
| Build tooling | Vite 8 |
| Routing | React Router 7 |
| Animation | GSAP 3, `@gsap/react` |
| Image export | `html-to-image` |
| Styling | Plain CSS organized by section/component |
| Quality checks | ESLint, TypeScript build, custom release checks |
| Preview hosting | GitHub Pages and Netlify Deploy Previews |
| Production hosting | Netlify |
| Planned Phase 2 content | Sanity CMS or an equivalent headless CMS |

## Requirements

- Node.js 24, matching CI and `netlify.toml`.
- npm, using the committed `package-lock.json`.

## Local development

Install dependencies and start Vite:

```bash
npm ci
npm run dev
```

Vite prints the local development URL in the terminal. Local builds default to
`noindex`, so development or preview deployments are not accidentally presented
to search engines as the production site.

To test a local production build:

```bash
npm run build
npm run preview
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create the production bundle in `dist/`. |
| `npm run preview` | Serve the current `dist/` bundle locally. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run check:release` | Build and validate metadata, routes, assets, sitemap, analytics gating, subpath behavior, and 404 handling. |

Before merging or releasing, run:

```bash
npm run lint
npm run build
npm run check:release
```

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. All `VITE_` variables
are embedded in the browser bundle and must never contain secrets.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SITE_URL` | Production only | Canonical HTTPS origin. Production value: `https://publicoutdoors.com`. Include any subpath if one is used. |
| `VITE_BASE_PATH` | No | Vite/React Router base path. Defaults to `/`. Must begin and end with `/`. |
| `VITE_ALLOW_INDEXING` | Production only | Set to `true` only for the final production build. All other values produce `noindex` pages. |
| `VITE_CLOUDFLARE_ANALYTICS_TOKEN` | No | Public 32-character Cloudflare Web Analytics site token. The beacon is included only in an indexable build. This is not an API token. |

Recommended production settings:

```dotenv
VITE_SITE_URL=https://publicoutdoors.com
VITE_BASE_PATH=/
VITE_ALLOW_INDEXING=true
VITE_CLOUDFLARE_ANALYTICS_TOKEN=
```

Leave the analytics token empty if analytics is not ready at launch.

## Application routes

| Route | Purpose | Search behavior |
| --- | --- | --- |
| `/` | Main scroll-driven presentation | Indexable in production |
| `/indoor/` | Indoor media collection | Indexable in production |
| `/outdoor/` | Outdoor media collection | Indexable in production |
| `/innovaciones/` | Colección de medios de innovación | Indexable in production |
| `/disponibilidad/` | Phase 1 availability placeholder | Always `noindex`; omitted from sitemap |

Collection routes can open as full pages or as modal-style routes over the home
page. React Router location state preserves the background location and scroll
position for that interaction.

## Architecture

The project is a client-rendered React application. `src/main.tsx` creates the
React root, configures the router base path, and mounts application providers.
`src/App.tsx` owns route composition and modal-route behavior.

```text
.
├── build/                 # Vite build plugins, including static SEO output
├── docs/                  # Release and operational documentation
├── public/                # Files copied directly into the production bundle
├── scripts/               # Release-output verification
├── src/
│   ├── animation/         # GSAP registration and motion/page-tone helpers
│   ├── assets/            # Images, client logos, and icon assets
│   ├── components/        # Shared navigation, cards, lightbox, metadata, footer
│   ├── data/              # Project content and page metadata
│   ├── pages/             # Route-level pages
│   ├── platform/          # iOS Safari and Google app browser workarounds
│   ├── sections/          # Home-page scenes and their animation timelines
│   └── styles/            # Global, responsive, page, section, and component CSS
├── index.html             # Base HTML document
├── netlify.toml           # Optional Netlify build configuration
└── vite.config.ts         # Environment validation and Vite plugins
```

### Content and media

The Phase 1 media catalog is stored in `src/data/projects.ts`. Images are
imported from `src/assets/images/`, which lets Vite fingerprint and optimize
their production URLs. Client logos live in `src/assets/clients/`.

To add or update a Phase 1 project, edit the relevant collection in
`src/data/projects.ts`, add the image under `src/assets/images/`, and supply a
descriptive Spanish `alt` value. Keep IDs unique across the catalog.

### Animation

Animations use GSAP and `@gsap/react`. Shared registration and helpers live in
`src/animation/`; section-specific timelines stay with their section or page.
New animations must respect `prefers-reduced-motion`, clean up through
`useGSAP`/GSAP context, and favor transforms and opacity over layout-changing
properties.

### Styling

The site uses regular CSS rather than CSS-in-JS. Global foundations are loaded
through `src/index.css` and `src/App.css`; focused styles live under
`src/styles/`. Responsive overrides are centralized in
`src/styles/responsive.css` where they affect multiple scenes.

### SEO generation

`src/data/seo.ts` is the source of truth for route titles and descriptions.
`src/components/PageMetadata.tsx` updates metadata during client-side
navigation. `build/seo.ts` also emits route-specific HTML files so direct links
have the correct metadata before React loads.

For indexable production builds, the build creates:

- Canonical URLs based on `VITE_SITE_URL`.
- Open Graph and Twitter metadata.
- Organization JSON-LD.
- `robots.txt` with the sitemap location.
- `sitemap.xml`, excluding pages marked `noindex`.
- Static HTML entry points for every known route.

This is metadata prerendering, not full page-body prerendering. Search engines
still need to execute JavaScript to render the page content.

### Browser and accessibility behavior

The application includes explicit workarounds for iOS Safari and Google in-app
browsers. Motion-heavy experiences respond to reduced-motion preferences.
Interactive imagery uses a shared lightbox provider, and modal routes preserve
keyboard and history behavior. Any Phase 2 UI must maintain these behaviors.

## Deployment

The production build command is `npm run build`, and the publish directory is
`dist`.

### GitHub Pages preview

Pushes to `main` currently run `.github/workflows/deploy-pages.yml`. The workflow
uses the repository name as `VITE_BASE_PATH` and leaves indexing disabled. This
is a preview channel, not the intended public production deployment.

### Netlify production

The Netlify project is connected to this GitHub repository and to
`publicoutdoors.com`. `netlify.toml`, `public/_headers`, and
`public/_redirects` define the build, security headers, caching, and routing
behavior. Netlify uses Node 24, runs `npm run lint && npm run build`, and
publishes `dist`.

The temporary `production/coming-soon` branch is the production branch until
launch. After the `main` branch passes the release checklist, change Netlify's
production branch to `main`. Future releases should use feature branches and
pull requests for Deploy Previews, then merge approved changes into `main`.

### Hosting requirements

The production configuration must:

- Serve the generated route directories and hashed assets from `dist/`.
- Return `404.html` with an actual HTTP 404 status for unknown URLs.
- Redirect HTTP and `www` to `https://publicoutdoors.com` while preserving paths
  and query strings.
- Apply the security and caching rules in Netlify `_headers` and `_redirects`.
- Avoid long-lived caching for HTML; fingerprinted files under `/assets/` may be
  cached for one year.

Production DNS, TLS, indexing, analytics, social previews, and rollback steps
are documented in [`docs/launch-checklist.md`](docs/launch-checklist.md).

## Analytics, cookies, and privacy

The Phase 1 application code does not write cookies, `localStorage`, or
`sessionStorage`. It does not embed maps, social feeds, advertising pixels, or
onsite contact forms. Contact actions open external services such as email,
telephone, WhatsApp, maps, and social networks.

The optional Cloudflare Web Analytics integration is cookie-free and does not
use browser storage. Its token must be configured before the production build;
otherwise no analytics script is emitted. Re-audit the deployed site because a
hosting provider can inject scripts or set cookies independently of this code.

Do not add a cookie banner unless the final hosting/analytics/marketing setup
actually requires consent. A Spanish privacy notice still needs to be completed
for launch, including hosting logs, contact handling, processors, retention, and
the applicable rights. The launch checklist records the outstanding decisions.

## Phase 2: availability with a CMS

Phase 2 is planned for roughly one month after the Phase 1 launch. Its goal is
to replace the current `/disponibilidad/` placeholder with a searchable,
maintainable view of available advertising spaces. Sanity is the leading CMS
candidate, but it has not been installed or configured in this repository.

### Proposed Phase 2 scope

- A CMS workspace owned by PUBLIC, with production and optional staging
  datasets.
- Published advertising-space records fetched from the CMS.
- Filters for media type, format, area/location, and availability.
- Space detail views with approved photos, dimensions, specifications,
  location information, and a clear contact action.
- Editorial draft/publish workflows and validation rules.
- Loading, empty, error, and stale-data states.
- Route metadata and sitemap entries for public space detail pages.
- Analytics events for filter usage, space views, and contact/WhatsApp actions,
  subject to the approved privacy setup.

### Proposed Sanity content model

An `advertisingSpace` document will likely need:

| Field | Suggested type | Notes |
| --- | --- | --- |
| `title` | String | Public display name; required |
| `slug` | Slug | Stable detail-page URL; required and unique |
| `status` | Enum | `available`, `reserved`, `unavailable`, or an approved business vocabulary |
| `mediaType` | Reference/enum | Indoor, outdoor, innovation, or a future category |
| `format` | Reference/enum | Billboard, screen, cylinder, bus shelter, etc. |
| `locationName` | String | Human-readable commercial location |
| `area` | Reference/enum | Search/filter grouping such as city, zone, or department |
| `coordinates` | Geopoint | Optional; publish only at an approved precision |
| `images` | Image array | Alt text and crop/hotspot metadata required |
| `dimensions` | Object | Width, height, and unit |
| `specifications` | Portable Text/object | Production and placement requirements |
| `availabilityFrom` | Datetime | Optional scheduling signal |
| `featured` | Boolean | Editorial ordering control |
| `sortOrder` | Number | Stable manual ordering where required |
| `contactLabel` | String | Optional space-specific call to action |
| `seo` | Object | Optional title, description, and social image overrides |

The final schema should be based on PUBLIC's real inventory workflow. In
particular, confirm whether availability is a simple current status or a
date-range/calendar system before implementation. That decision changes the
schema, filtering, preview logic, and editorial workflow substantially.

### Recommended integration boundaries

- Keep CMS queries and mapping in a dedicated `src/cms/` or
  `src/features/availability/` layer rather than querying Sanity directly from
  presentation components.
- Map Sanity responses into stable application types so the UI is not coupled
  to raw CMS documents.
- Store only public project ID/dataset/API version values in `VITE_` variables.
  Keep write tokens and preview secrets on a server or hosting platform.
- Use Sanity's CDN for published, public reads. Draft preview must be gated and
  must never expose a token in the client bundle.
- Pin the Sanity API version to a calendar date and update it deliberately.
- Decide whether changes appear immediately through client fetching, through
  timed revalidation, or after a deploy webhook. Phase 1 is fully static, so
  this is also a hosting architecture decision.
- Preserve a graceful fallback when the CMS is unavailable; availability data
  should never break the rest of the marketing site.

Likely future public environment variables are shown below for planning only;
they are not consumed by the Phase 1 code:

```dotenv
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=YYYY-MM-DD
```

Do not add a browser-visible Sanity write token. If Phase 2 requires authenticated
preview, lead capture, reservations, or mutation, add a server-side boundary
instead of sending credentials or writes directly from the public app.

### Phase 2 decisions to make before development

1. Define exactly what “available” means and who is responsible for keeping it
   accurate.
2. Confirm whether the public experience shows live status, approximate status,
   or a request-to-confirm workflow.
3. Define how Netlify deploys and cache invalidation should respond to CMS
   updates.
4. Confirm the URL model for individual spaces and whether unpublished or
   unavailable spaces remain accessible.
5. Approve the geographic precision, contact workflow, analytics events, and
   privacy wording.
6. Design roles, publishing permissions, backups, and recovery for the CMS.
7. Plan migration from `src/data/projects.ts` only if the CMS will also own the
   existing gallery; the Phase 2 availability catalog can remain separate.

## Known launch considerations

- Confirm the team names, roles, biographies, and portraits with PUBLIC.
- Verify all impact figures, timeline copy, contact details, client logos, and
  image usage rights with PUBLIC.
- Confirm whether the Phase 1 availability placeholder should remain linked in
  the public navigation. It is visible to users even though it is not indexed.
- The main page content is client-rendered. Use Search Console URL Inspection
  after launch to verify that Google renders it successfully.

## Release checklist

The authoritative operational checklist is
[`docs/launch-checklist.md`](docs/launch-checklist.md). It covers hosting, DNS,
TLS, redirects, security headers, analytics activation, privacy, browser checks,
Search Console, asset approval, and rollback preparation.

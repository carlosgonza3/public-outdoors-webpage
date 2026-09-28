# Coming-soon release

The `production/coming-soon` branch publishes a standalone white page with the PUBLIC logo and “Coming soon”. The logo bounces on entry, every four seconds, and on click or keyboard activation. Reduced-motion preferences disable movement.

## Local preview

Run `npm ci`, then `npm run dev:coming-soon`. To inspect the production artifact, run `npm run build:coming-soon` and `npm run preview`. Netlify runs `npm run lint && npm run build:coming-soon` and publishes `dist`.

The separate Vite root deliberately excludes the full application, its generated route HTML, and its public assets. All non-file URLs, including former routes, serve the placeholder. The page works without JavaScript (static logo and text). Indexing is disabled. There is no scheduled or date-driven release.

## Publish the placeholder

1. Push `production/coming-soon` to the connected Git repository.
2. In the existing Netlify project, set the production branch to `production/coming-soon` and verify the effective build command and publish directory match this branch's `netlify.toml`.
3. Deploy and review the Netlify URL before routing the custom domain to it.
4. Follow Netlify's domain-specific DNS instructions; confirm HTTPS and both the primary domain and its alias.
5. Verify `/`, `/indoor`, `/outdoor`, `/innovations`, and `/disponibilidad` all show only the placeholder.

## Launch on October 1, 2026

1. Finish, commit, and push the full website on `development` (or the agreed full-site release branch). Current uncommitted development work was intentionally left untouched when this branch was created.
2. Preview that branch and run its release checks. Confirm the production site URL and indexing environment settings.
3. Switch Netlify's production branch to the approved full-site branch. Its configuration must build the full site with `npm run build`, not `build:coming-soon`.
4. Trigger a production deploy and verify the home page, routes, contact interactions, and domain HTTPS. DNS remains unchanged.
5. If necessary, restore the previous coming-soon deploy in Netlify and switch the production branch back to `production/coming-soon` to keep later builds on the placeholder.

Do not merge this branch's temporary Netlify build configuration into the full-site release branch. Publishing and Netlify account changes are separate from preparing this branch.

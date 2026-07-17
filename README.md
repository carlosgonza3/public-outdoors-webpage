# Public Outdoors

Animated single-page website built with React, TypeScript, Vite, and GSAP.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Deployment

Pushes to `main` deploy automatically through the GitHub Pages workflow. The
workflow supplies the repository subpath to Vite, so project-page assets resolve
correctly.

The default production build uses `/` as its base path, keeping the project ready
for a later Netlify deployment without further configuration. Netlify should use:

- Build command: `npm run build`
- Publish directory: `dist`

## Architecture

The page is organized as scroll-controlled scenes:

- `src/sections/` owns each scene's markup and GSAP timeline.
- `src/components/` contains reusable visual building blocks.
- `src/data/` contains gallery content and asset references.
- `src/animation/` centralizes GSAP registration and motion preferences.
- `src/hooks/useScrollScenes.ts` coordinates page-level scene snapping.

To add a new slideshow stop, create a section component and add the
`data-scroll-scene` attribute to its root element. Section-specific animation
should stay scoped to that component with `useGSAP`.

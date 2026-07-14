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

import type { Plugin } from 'vite'
import { pages, notFound, pageUrl, type PageMetadata } from '../src/data/seo.ts'

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!))

export function seoPlugin(siteUrl: string, indexable: boolean, base: string, analyticsToken: string): Plugin {
  function head(page: PageMetadata, path: string) {
    const tags = [
      `<title>${escape(page.title)}</title>`,
      `<meta name="description" content="${escape(page.description)}" />`,
      `<meta name="robots" content="${indexable && !page.noindex ? 'index, follow' : 'noindex, follow'}" />`,
      '<meta property="og:type" content="website" />',
      '<meta property="og:locale" content="es_SV" />',
      '<meta property="og:site_name" content="PUBLIC" />',
      `<meta property="og:title" content="${escape(page.title)}" />`,
      `<meta property="og:description" content="${escape(page.description)}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${escape(page.title)}" />`,
      `<meta name="twitter:description" content="${escape(page.description)}" />`,
    ]
    if (siteUrl) {
      const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'PUBLIC', url: `${siteUrl}/`, email: 'marketing@publicsv.net', telephone: '+50322645458', areaServed: 'El Salvador' }
      tags.push(`<script type="application/ld+json">${JSON.stringify(organization).replace(/</g, '\\u003c')}</script>`)
      if (!page.noindex) tags.push(`<link rel="canonical" href="${escape(pageUrl(siteUrl, path))}" />`)
      tags.push(`<meta property="og:url" content="${escape(pageUrl(siteUrl, path))}" />`)
      const image = `${siteUrl}/public-contacto.png`
      tags.push(`<meta property="og:image" content="${escape(image)}" />`,
        '<meta property="og:image:alt" content="PUBLIC — Publicidad en El Salvador" />',
        `<meta name="twitter:image" content="${escape(image)}" />`)
    }
    return `<!-- seo:start -->\n${tags.join('\n')}\n<!-- seo:end -->`
  }

  function notFoundDocument() {
    const home = escape(base)
    const mark = escape(`${base}favicon.svg`)

    return `<!doctype html>
<html lang="es" style="background:#f7f5ef">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#f7f5ef">
<link rel="icon" type="image/svg+xml" href="${mark}">
${head(notFound, '/404')}
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#000;background:#f7f5ef;font-synthesis:none;-webkit-font-smoothing:antialiased}*{box-sizing:border-box}body{min-width:320px;min-height:100vh;min-height:100dvh;margin:0;background:#f7f5ef}.page{min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:clamp(1.25rem,3vw,3rem);background:#f7f5ef}.content{width:min(52rem,100%);display:flex;flex-direction:column;align-items:center;text-align:center}.mark{width:clamp(2.8rem,4.5vw,4.25rem);height:auto;margin-bottom:clamp(1.6rem,3vw,2.5rem)}.eyebrow{margin:0 0 clamp(1rem,2vw,1.5rem);color:rgb(23 61 53/.52);font-size:clamp(.713rem,.92vw,.863rem);font-weight:700;letter-spacing:.2em;text-transform:uppercase}h1{margin:0;color:#000;font-size:clamp(3.5rem,9vw,7.75rem);font-weight:520;line-height:.88;letter-spacing:-.075em}.copy{max-width:30rem;margin:clamp(1.65rem,3vw,2.4rem) 0 0;color:#000;font-size:clamp(1rem,1.35vw,1.2rem);line-height:1.55}.action{min-height:3.2rem;display:inline-flex;align-items:center;gap:.65rem;margin-top:clamp(1.7rem,3vw,2.4rem);padding:.2rem 1.2rem;border:1px solid rgb(0 0 0/.24);border-radius:999px;color:#000;background:transparent;font-size:.782rem;font-weight:700;letter-spacing:.14em;text-decoration:none;text-transform:uppercase}@media(hover:hover) and (pointer:fine){.action:hover{border-color:#000;color:#f7f5ef;background:#000}}@media(max-width:600px){h1{font-size:clamp(3.5rem,17vw,5.5rem)}.copy{max-width:22rem}}
</style>
</head>
<body>
<main class="page">
<section class="content" aria-labelledby="not-found-title">
<img class="mark" src="${mark}" alt="">
<p class="eyebrow">Error 404</p>
<h1 id="not-found-title">Página no encontrada</h1>
<p class="copy">La página que buscas cambió de lugar o ya no está disponible.</p>
<a class="action" href="${home}"><span aria-hidden="true">←</span> Volver al inicio</a>
</section>
</main>
</body>
</html>`
  }

  return {
    name: 'public-release-metadata',
    enforce: 'post',
    transformIndexHtml(html) {
      const result = html.replace(/<title>.*?<\/title>/s, head(pages['/'], '/'))
      if (!indexable || !analyticsToken) return result
      return result.replace('</head>', `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token: analyticsToken })}'></script>\n</head>`)
    },
    generateBundle(_, bundle) {
      const entry = bundle['index.html']
      if (!entry || entry.type !== 'asset') throw new Error('Missing built index.html')
      const html = String(entry.source)
      for (const [path, page] of Object.entries(pages)) {
        if (path === '/') continue
        this.emitFile({ type: 'asset', fileName: `${path.slice(1)}/index.html`,
          source: html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, head(page, path))
            .replaceAll('#f7f5ef', path === '/disponibilidad' ? '#07080b' : '#0b0d0c')
            .replace('name="color-scheme" content="light"', 'name="color-scheme" content="dark"') })
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: notFoundDocument() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: indexable
        ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n' })
      if (indexable) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.entries(pages).filter(([, page]) => !page.noindex).map(([path]) => `<url><loc>${escape(pageUrl(siteUrl, path))}</loc></url>`).join('')}</urlset>\n` })
    },
  }
}

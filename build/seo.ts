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
      this.emitFile({ type: 'asset', fileName: '404.html', source: `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head(notFound, '/404')}</head><body style="font-family:system-ui;background:#f7f5ef;color:#151515;padding:10vw"><h1>Página no encontrada</h1><p>La página que buscas no está disponible.</p><a href="${escape(base)}">Volver al inicio de PUBLIC</a></body></html>` })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: indexable
        ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n' })
      if (indexable) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.entries(pages).filter(([, page]) => !page.noindex).map(([path]) => `<url><loc>${escape(pageUrl(siteUrl, path))}</loc></url>`).join('')}</urlset>\n` })
    },
  }
}

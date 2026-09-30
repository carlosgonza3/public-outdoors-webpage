import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const output = mkdtempSync(join(tmpdir(), 'public-release-'))
const token = '0123456789abcdef0123456789abcdef'
function build(settings) {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', output, '--emptyOutDir'], {
    env: { ...process.env, VITE_CLOUDFLARE_ANALYTICS_TOKEN: token, ...settings }, stdio: 'pipe',
  })
}
const read = (path) => readFileSync(join(output, path), 'utf8')
try {
  build({ VITE_SITE_URL: 'https://publicoutdoors.com', VITE_BASE_PATH: '/', VITE_ALLOW_INDEXING: 'true' })
  const titles = new Set()
  for (const route of ['', 'indoor/', 'outdoor/', 'innovaciones/', 'innovations/', 'disponibilidad/']) {
    const html = read(`${route}index.html`)
    assert.match(html, /lang="es"/)
    assert.doesNotMatch(html, /safari-tint-rail/)
    const tone = !route ? '#f7f5ef' : route === 'disponibilidad/' ? '#07080b' : '#0b0d0c'
    assert.ok(html.includes(`name="theme-color" content="${tone}"`))
    assert.ok(html.includes(`background-color: ${tone}`))
    assert.ok(html.includes(`name="color-scheme" content="${!route ? 'light' : 'dark'}"`))
    assert.equal((html.match(/<title>/g) || []).length, 1)
    titles.add(html.match(/<title>(.*?)<\/title>/)[1])
    assert.match(html, /property="og:image" content="https:\/\/publicoutdoors.com\/public-contacto.png"/)
    assert.match(html, /static.cloudflareinsights.com\/beacon.min.js/)
    const organization = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])
    assert.equal(organization.url, 'https://publicoutdoors.com/')
    if (route === 'disponibilidad/' || route === 'innovations/') {
      assert.match(html, /content="noindex, follow"/)
      assert.doesNotMatch(html, /rel="canonical"/)
    } else {
      assert.ok(html.includes(`rel="canonical" href="https://publicoutdoors.com/${route}"`))
      assert.match(html, /content="index, follow"/)
    }
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
      assert.ok(existsSync(join(output, match[1])), `Missing asset: ${match[1]}`)
    }
  }
  assert.equal(titles.size, 6)
  assert.equal((read('sitemap.xml').match(/<loc>/g) || []).length, 4)
  assert.doesNotMatch(read('sitemap.xml'), /disponibilidad/)
  assert.match(read('robots.txt'), /Sitemap: https:\/\/publicoutdoors.com\/sitemap.xml/)
  assert.match(read('404.html'), /noindex, follow/)
  assert.match(read('_redirects'), /\/404.html\s+404/)
  build({ VITE_SITE_URL: '', VITE_BASE_PATH: '/public-outdoors/', VITE_ALLOW_INDEXING: 'false' })
  for (const route of ['', 'indoor/', 'outdoor/', 'innovaciones/', 'innovations/', 'disponibilidad/']) {
    const html = read(`${route}index.html`)
    assert.match(html, /content="noindex, follow"/)
    assert.match(html, /src="\/public-outdoors\/assets\//)
    assert.doesNotMatch(html, /rel="canonical"|cloudflareinsights/)
  }
  assert.ok(!existsSync(join(output, 'sitemap.xml')))
  assert.match(read('404.html'), /href="\/public-outdoors\/"/)
  assert.throws(() => build({ VITE_SITE_URL: '', VITE_BASE_PATH: '/', VITE_ALLOW_INDEXING: 'true' }))
  console.log('Release checks passed: production metadata, browser tones without fixed tint rails, assets, sitemap, analytics gating, subpath previews, 404, invalid configuration.')
} finally {
  rmSync(output, { recursive: true, force: true })
}

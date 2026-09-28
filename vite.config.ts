import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPlugin } from './build/seo.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  const analyticsToken = env.VITE_CLOUDFLARE_ANALYTICS_TOKEN || ''
  if (analyticsToken && !/^[a-f0-9]{32}$/i.test(analyticsToken)) throw new Error('Invalid Cloudflare Web Analytics token')
  const indexable = env.VITE_ALLOW_INDEXING === 'true'
  if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('VITE_BASE_PATH must start and end with /')
  if (siteUrl) {
    const url = new URL(siteUrl)
    if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password || `${url.pathname.replace(/\/$/, '')}/` !== base) {
      throw new Error('VITE_SITE_URL must be an HTTPS URL matching VITE_BASE_PATH, without query, fragment or credentials')
    }
  }
  if (indexable && !siteUrl) throw new Error('Set VITE_SITE_URL before enabling indexing')
  return { base, plugins: [react(), seoPlugin(siteUrl, indexable, base, analyticsToken)] }
})

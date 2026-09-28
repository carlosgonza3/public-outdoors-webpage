import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'

const style = () => ({ setProperty(key, value) { this[key] = value } })
const metadata = new Map(['theme-color', 'color-scheme', 'apple-mobile-web-app-status-bar-style'].map(name => [name, {
  content: name === 'apple-mobile-web-app-status-bar-style' ? 'default' : '',
  setAttribute(key, value) { this[key] = value },
}]))
const document = {
  documentElement: { style: style() }, body: { style: style() },
  querySelector(selector) { return metadata.get(selector.match(/name="([^"]+)"/)[1]) },
}
const source = stripTypeScriptTypes(readFileSync(new URL('../src/animation/pageTone.ts', import.meta.url), 'utf8')).replaceAll('export function', 'function')
const api = runInNewContext(`${source}\n;({ setPageTone, pushPageTone, refreshPageTone })`, { document })
function expectTone(color, scheme) {
  assert.equal(document.documentElement.style.backgroundColor, color)
  assert.equal(document.documentElement.style['--page-background'], color)
  assert.equal(document.body.style.backgroundColor, color)
  assert.equal(metadata.get('theme-color').content, color)
  assert.equal(metadata.get('color-scheme').content, scheme)
  assert.equal(document.documentElement.style.colorScheme, `only ${scheme}`)
}
api.setPageTone('#ffffff'); expectTone('#ffffff', 'light')
api.setPageTone('#07080b', true); expectTone('#07080b', 'dark')
api.setPageTone('#f7f5ef', true); expectTone('#f7f5ef', 'light')
const closeCollection = api.pushPageTone('#0b0d0c')
const closeLightbox = api.pushPageTone('#020404')
api.setPageTone('#ffffff', true)
expectTone('#020404', 'dark')
closeCollection() // Out-of-order unmount must not override the top dialog.
expectTone('#020404', 'dark')
closeLightbox(); expectTone('#ffffff', 'light')
closeLightbox(); expectTone('#ffffff', 'light') // Cleanup is idempotent.
const closeDialog = api.pushPageTone('#090b0d')
document.body.style.backgroundColor = '#ffffff'
api.refreshPageTone(); expectTone('#090b0d', 'dark')
closeDialog(); expectTone('#ffffff', 'light')
assert.equal(metadata.get('apple-mobile-web-app-status-bar-style').content, 'default')
console.log('Browser tone checks passed: light/dark, rapid changes, nested overlays, cleanup, page restoration, stable status bar.')

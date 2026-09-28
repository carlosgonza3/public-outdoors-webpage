const LIGHT_TONE = '#f7f5ef'
let pageTone = LIGHT_TONE
let activeTone = ''
const overlays = new Map<symbol, string>()

// Use luminance rather than a single special-case hex value: white and future
// light surfaces must also get light native controls, regardless of OS theme.
function isLight(color: string) {
  const channels = color.slice(1).match(/.{2}/g)!.map((channel) => {
    const value = parseInt(channel, 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.179
}

function applyTone(force = false) {
  const color = [...overlays.values()].at(-1) ?? pageTone
  if (activeTone === color && !force) return
  activeTone = color
  const scheme = isLight(color) ? 'light' : 'dark'
  const root = document.documentElement
  root.style.setProperty('--page-background', color)
  root.style.backgroundColor = color
  root.style.colorScheme = `only ${scheme}`
  document.body.style.backgroundColor = color
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', color)
  document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')?.setAttribute('content', scheme)
  // Standalone iOS status bar styles are launch-time settings, not a reliable
  // dynamic tint API. Do not toggle them and change the viewport geometry.
}

/** Section backgrounds are opaque six-digit hex colors. */
export function setPageTone(color: string, force = false) {
  pageTone = color
  applyTone(force)
}

/** Keep background scroll callbacks from overriding a visible dialog. */
export function pushPageTone(color: string) {
  const owner = Symbol('page-tone')
  overlays.set(owner, color)
  applyTone()
  return () => {
    overlays.delete(owner)
    applyTone()
  }
}

export function refreshPageTone() {
  applyTone(true)
}

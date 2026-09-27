const IOS_DEVICE = /iPad|iPhone|iPod/
const IOS_ALTERNATE_BROWSER = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/
const SAFARI_ALTERNATE_BROWSER =
  /Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|OPiOS|Android|DuckDuckGo/

export function isSafari() {
  const { userAgent } = navigator
  return /Safari/.test(userAgent) && !SAFARI_ALTERNATE_BROWSER.test(userAgent)
}

export function isIOSSafari() {
  const { maxTouchPoints, platform, userAgent } = navigator
  const isIOS =
    IOS_DEVICE.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)

  return (
    isIOS &&
    isSafari() &&
    !IOS_ALTERNATE_BROWSER.test(userAgent)
  )
}

export function initializeIOSSafariWorkaround() {
  if (!isSafari()) return

  document.documentElement.classList.add('is-safari')

  if (!isIOSSafari()) return

  document.documentElement.classList.add('is-ios-safari')

  if (new URLSearchParams(window.location.search).has('debug-safari-tint')) {
    document.documentElement.classList.add('debug-safari-tint')
  }
}

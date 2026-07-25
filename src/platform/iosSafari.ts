const IOS_DEVICE = /iPad|iPhone|iPod/
const IOS_ALTERNATE_BROWSER = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/

export function isIOSSafari() {
  const { maxTouchPoints, platform, userAgent } = navigator
  const isIOS =
    IOS_DEVICE.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)

  return (
    isIOS &&
    /Safari/.test(userAgent) &&
    !IOS_ALTERNATE_BROWSER.test(userAgent)
  )
}

export function initializeIOSSafariWorkaround() {
  if (!isIOSSafari()) return

  document.documentElement.classList.add('is-ios-safari')

  if (new URLSearchParams(window.location.search).has('debug-safari-tint')) {
    document.documentElement.classList.add('debug-safari-tint')
  }
}

let activeTone = ''

export function setPageTone(color: string) {
  if (activeTone === color) return

  activeTone = color
  const isOpeningTone = color.toLowerCase() === '#f7f5ef'

  document.documentElement.style.setProperty('--page-background', color)
  document.documentElement.style.backgroundColor = color
  document.documentElement.style.colorScheme = isOpeningTone ? 'only light' : 'dark'
  document.body.style.backgroundColor = color
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', color)
  document
    .querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    ?.setAttribute('content', isOpeningTone ? 'light' : 'dark')
  document
    .querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]')
    ?.setAttribute('content', isOpeningTone ? 'default' : 'black-translucent')
}

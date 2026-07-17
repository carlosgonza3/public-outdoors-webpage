let activeTone = ''

export function setPageTone(color: string) {
  if (activeTone === color) return

  activeTone = color
  document.documentElement.style.setProperty('--page-background', color)
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', color)
}

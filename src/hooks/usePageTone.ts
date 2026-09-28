import { useLayoutEffect } from 'react'
import { pushPageTone, setPageTone } from '../animation/pageTone'

export function usePageTone(color: string, overlay: boolean, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return
    if (overlay) return pushPageTone(color)
    setPageTone(color, true)
  }, [color, overlay, enabled])
}

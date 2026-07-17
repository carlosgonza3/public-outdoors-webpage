import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { AmbientField } from '../components/AmbientField'
import { BrandMask } from '../components/BrandMask'

export function IntroScene() {
  const section = useRef<HTMLElement>(null)
  const mark = useRef<SVGGElement>(null)
  const colorMark = useRef<SVGGElement>(null)
  const veil = useRef<SVGSVGElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const ambient = useRef<HTMLDivElement>(null)
  const scrollCue = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(veil.current, { autoAlpha: 0 })
        return
      }

      let lockedProgress: number | null = null
      let inputReady = true
      let stopAcknowledged = false
      let quietTimer: ReturnType<typeof window.setTimeout> | undefined

      const markInputQuiet = () => {
        window.clearTimeout(quietTimer)
        quietTimer = window.setTimeout(() => {
          inputReady = true
        }, 650)
      }

      const stopMomentum = (event: WheelEvent) => {
        if (lockedProgress !== null && !inputReady) {
          event.preventDefault()
          markInputQuiet()
          return
        }

        if (lockedProgress !== null && inputReady) lockedProgress = null
      }

      const startTouchGesture = () => {
        if (lockedProgress !== null && inputReady) lockedProgress = null
      }

      const stopTouchMomentum = (event: TouchEvent) => {
        if (lockedProgress !== null) event.preventDefault()
      }

      const endTouchGesture = () => {
        if (lockedProgress !== null) inputReady = true
      }

      window.addEventListener('wheel', stopMomentum, { passive: false })
      window.addEventListener('touchstart', startTouchGesture, { passive: true })
      window.addEventListener('touchmove', stopTouchMomentum, { passive: false })
      window.addEventListener('touchend', endTouchGesture, { passive: true })

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'intro-scene',
          trigger: section.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.18,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const stop = timeline.labels.outside / timeline.duration()

            if (self.direction < 0) {
              if (self.progress < stop - 0.002) stopAcknowledged = false
              lockedProgress = null
              inputReady = true
              return
            }

            if (lockedProgress !== null) {
              self.scroll(self.start + lockedProgress * (self.end - self.start))
              return
            }

            if (!stopAcknowledged && self.progress >= stop) {
              lockedProgress = stop
              stopAcknowledged = true
              inputReady = false
              self.scroll(self.start + stop * (self.end - self.start))
              markInputQuiet()
            }
          },
        },
      })

      const flight = { x: 0, y: 0, rotation: 0, scale: 3.2 }
      const renderMark = () => {
        const transform = `translate(${flight.x} ${flight.y}) rotate(${flight.rotation}) scale(${flight.scale})`
        mark.current?.setAttribute('transform', transform)
        colorMark.current?.setAttribute('transform', transform)
      }

      renderMark()
      gsap.set(content.current, { autoAlpha: 0, scale: 1.04 })
      gsap.set(ambient.current, { autoAlpha: 1, scale: 1 })
      gsap.set(copy.current, { autoAlpha: 1 })

      timeline
        .to(flight, {
          x: -3,
          y: -16,
          rotation: -3,
          scale: 3.8,
          duration: 0.16,
          ease: 'sine.inOut',
          onUpdate: renderMark,
        })
        .to(flight, {
          x: 4,
          y: -45,
          rotation: 3,
          scale: 5.2,
          duration: 0.16,
          ease: 'sine.inOut',
          onUpdate: renderMark,
        })
        .to(flight, {
          x: -3,
          y: -92,
          rotation: -2,
          scale: 8,
          duration: 0.16,
          ease: 'sine.inOut',
          onUpdate: renderMark,
        })
        .to(flight, {
          x: 0,
          y: -260,
          rotation: 0,
          scale: 58,
          duration: 0.52,
          ease: 'power3.in',
          onUpdate: renderMark,
        })
        .to(colorMark.current, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, 0.62)
        .to(veil.current, { autoAlpha: 0, duration: 0.08 }, 0.94)
        .to(scrollCue.current, { autoAlpha: 0, y: -12, duration: 0.12 }, 0.78)
        .to(content.current, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.8)
        .addLabel('outside', 1.08)
        .to({}, { duration: 0.42 })

      return () => {
        window.clearTimeout(quietTimer)
        window.removeEventListener('wheel', stopMomentum)
        window.removeEventListener('touchstart', startTouchGesture)
        window.removeEventListener('touchmove', stopTouchMomentum)
        window.removeEventListener('touchend', endTouchGesture)
        timeline.kill()
      }
    },
    { scope: section },
  )

  return (
    <section
      className="intro"
      ref={section}
      aria-label="Public Outdoors introduction"
    >
      <div className="reveal-content" ref={content}>
        <AmbientField variant="intro" fieldRef={ambient} />
        <div className="scene-copy scene-copy--intro" ref={copy}>
          <h1>
            Espacios únicos para
            <br />
            elevar tu marca
          </h1>
        </div>
      </div>

      <BrandMask veilRef={veil} markRef={mark} colorMarkRef={colorMark} />

      <div className="scroll-cue" ref={scrollCue} aria-hidden="true">
        <span>PUBLIC</span>
        <i />
      </div>
    </section>
  )
}

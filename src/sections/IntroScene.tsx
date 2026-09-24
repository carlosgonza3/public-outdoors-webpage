import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { isMobileExperience } from '../animation/mobile'
import { setPageTone } from '../animation/pageTone'
import { AmbientField } from '../components/AmbientField'
import { BrandMask } from '../components/BrandMask'
import { isIOSSafari } from '../platform/iosSafari'

type IntroSceneProps = {
  onMaskStateChange?: (complete: boolean) => void
  onMobileNavigationGapChange?: (hidden: boolean) => void
}

export function IntroScene({
  onMaskStateChange,
  onMobileNavigationGapChange,
}: IntroSceneProps) {
  const section = useRef<HTMLElement>(null)
  const mark = useRef<SVGGElement>(null)
  const colorMark = useRef<SVGGElement>(null)
  const markPerspective = useRef<SVGGElement>(null)
  const colorMarkPerspective = useRef<SVGGElement>(null)
  const markPress = useRef<SVGGElement>(null)
  const colorMarkPress = useRef<SVGGElement>(null)
  const markPulse = useRef<SVGGElement>(null)
  const colorMarkPulse = useRef<SVGGElement>(null)
  const veil = useRef<SVGSVGElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const sloganGlow = useRef<HTMLDivElement>(null)
  const ambient = useRef<HTMLDivElement>(null)
  const scrollCue = useRef<HTMLDivElement>(null)
  const logoButton = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      const mobile = isMobileExperience()
      let maskComplete = false
      let mobileNavigationHidden = false
      const updateMaskState = (complete: boolean) => {
        if (maskComplete === complete) return
        maskComplete = complete
        onMaskStateChange?.(complete)
      }
      const updateMobileNavigationGap = (hidden: boolean) => {
        if (mobileNavigationHidden === hidden) return
        mobileNavigationHidden = hidden
        onMobileNavigationGapChange?.(hidden)
      }

      onMaskStateChange?.(false)
      onMobileNavigationGapChange?.(false)

      if (prefersReducedMotion()) {
        gsap.set(veil.current, { autoAlpha: 0 })
        updateMaskState(true)
        setPageTone('#07080b')
        return
      }

      const pulse = { scale: 1 }
      const renderPulse = () => {
        const transform = `scale(${pulse.scale})`
        markPulse.current?.setAttribute('transform', transform)
        colorMarkPulse.current?.setAttribute('transform', transform)
      }
      let pulseActive = true
      const pulseTimeline = gsap.timeline({ repeat: -1, delay: 0.8 })
        .to(pulse, {
          scale: 1.055,
          duration: 0.46,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 0.992,
          duration: 0.52,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 1,
          duration: 0.34,
          ease: 'power2.out',
          onUpdate: renderPulse,
        })
        .to({}, { duration: 1.35 })
        .to(pulse, {
          scale: 1.11,
          duration: 0.84,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 0.978,
          duration: 0.74,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: renderPulse,
        })
        .to({}, { duration: 2.15 })
        .to(pulse, {
          scale: 1.085,
          duration: 0.26,
          ease: 'power2.out',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 0.982,
          duration: 0.22,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 1.072,
          duration: 0.24,
          ease: 'power2.out',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 0.99,
          duration: 0.24,
          ease: 'sine.inOut',
          onUpdate: renderPulse,
        })
        .to(pulse, {
          scale: 1,
          duration: 0.32,
          ease: 'power2.out',
          onUpdate: renderPulse,
        })
        .to({}, { duration: 1.7 })

      const setPulseActive = (active: boolean) => {
        if (active === pulseActive) return
        pulseActive = active

        if (active) {
          pulseTimeline.restart(true)
          return
        }

        pulseTimeline.pause(0)
        pulse.scale = 1
        renderPulse()
      }

      if (mobile) {
        const sloganLines = gsap.utils.toArray<HTMLElement>(
          '.slogan-line > span',
        )
        const mobileMarks = [mark.current, colorMark.current]
        let darkToneActive = false

        gsap.set(mobileMarks, {
          scale: 3.2,
          rotation: 0,
          svgOrigin: '0 0',
          willChange: 'transform',
        })
        gsap.set(colorMark.current, { autoAlpha: 1 })
        gsap.set(content.current, { autoAlpha: 1 })
        gsap.set(copy.current, { autoAlpha: 0, y: 24 })
        gsap.set(sloganLines, { yPercent: 34 })
        gsap.set(sloganGlow.current, { autoAlpha: 0, scale: 0.84 })
        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            id: 'intro-scene-mobile',
            trigger: section.current,
            start: 'top top',
            end: '+=125%',
            pin: true,
            pinType: isIOSSafari() ? 'transform' : 'fixed',
            scrub: 0.12,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPulseActive(self.progress <= 0.001)
              const duration = mobileTimeline.duration()
              const timelineTime = self.progress * duration
              updateMobileNavigationGap(
                timelineTime >= 0.2 && timelineTime < 0.26,
              )
              updateMaskState(duration > 0 && timelineTime >= 0.26)
              const shouldUseDarkTone = self.progress > 0.04
              if (shouldUseDarkTone === darkToneActive) return
              darkToneActive = shouldUseDarkTone
              setPageTone(shouldUseDarkTone ? '#07080b' : '#f7f5ef')
            },
          },
        })

        mobileTimeline
          .to(
            mobileMarks,
            {
              scale: 5.2,
              rotation: -1.25,
              duration: 0.12,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            mobileMarks,
            {
              scale: 45,
              rotation: -3,
              duration: 0.24,
              ease: 'power3.inOut',
            },
            0.12,
          )
          .to(
            colorMark.current,
            {
              autoAlpha: 0,
              duration: 0.16,
              ease: 'power2.inOut',
            },
            0.1,
          )
          .to(
            veil.current,
            {
              autoAlpha: 0,
              duration: 0.16,
              ease: 'power2.inOut',
            },
            0.1,
          )
          .to(
            scrollCue.current,
            { autoAlpha: 0, y: -8, duration: 0.14, ease: 'power2.out' },
            0.12,
          )
          .to(
            content.current,
            { autoAlpha: 1, duration: 0.24, ease: 'power2.out' },
            0.16,
          )
          .to(
            sloganGlow.current,
            { autoAlpha: 0.72, scale: 1, duration: 0.25, ease: 'power2.out' },
            0.2,
          )
          .to(
            copy.current,
            { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power3.out' },
            0.22,
          )
          .to(
            sloganLines,
            { yPercent: 0, duration: 0.24, stagger: 0.025, ease: 'power3.out' },
            0.22,
          )
          .to({}, { duration: 0.28 })
          .to(copy.current, {
            autoAlpha: 0,
            yPercent: -16,
            scale: 1.035,
            duration: 0.2,
            ease: 'power2.inOut',
          })
          .to(
            sloganGlow.current,
            { autoAlpha: 0, scale: 1.18, duration: 0.2, ease: 'power2.inOut' },
            '<',
          )
          .to(
            ambient.current,
            { autoAlpha: 0, scale: 1.06, duration: 0.22, ease: 'power2.inOut' },
            '<',
          )
          .set(mobileMarks, { willChange: 'auto' })

        return () => {
          pulseTimeline.kill()
          mobileTimeline.kill()
        }
      }

      const perspective = { x: 0, y: 0 }
      let perspectiveTargetX = 0
      let perspectiveTargetY = 0
      let perspectiveActive = true
      let logoCenterX = window.innerWidth / 2
      let logoCenterY = window.innerHeight / 2
      const finePointer = window.matchMedia('(pointer: fine)').matches
      const press = { y: 0, rotation: 0, scale: 1 }
      const pressTimeline = gsap.timeline({ paused: true })
      let logoButtonActive = true

      const measureLogoCenter = () => {
        const bounds = colorMark.current?.getBoundingClientRect()
        if (!bounds) return
        logoCenterX = bounds.left + bounds.width / 2
        logoCenterY = bounds.top + bounds.height / 2
      }

      const renderPerspective = () => {
        const x = perspective.x
        const y = perspective.y
        const transform = [
          `translate(${x * 0.8} ${y * 0.55})`,
          `rotate(${x * 1.8})`,
          `skewX(${-y * 2.4})`,
          `skewY(${x * 3.2})`,
          `scale(${1 - Math.abs(x) * 0.025} ${1 - Math.abs(y) * 0.02})`,
        ].join(' ')
        markPerspective.current?.setAttribute('transform', transform)
        colorMarkPerspective.current?.setAttribute('transform', transform)
      }

      const updatePerspective = () => {
        if (!perspectiveActive) return

        const deltaX = perspectiveTargetX - perspective.x
        const deltaY = perspectiveTargetY - perspective.y
        if (Math.abs(deltaX) < 0.0001 && Math.abs(deltaY) < 0.0001) return

        const smoothing = 1 - Math.pow(0.84, gsap.ticker.deltaRatio(60))
        perspective.x += deltaX * smoothing
        perspective.y += deltaY * smoothing
        renderPerspective()
      }

      const resetPerspectiveTarget = () => {
        perspectiveTargetX = 0
        perspectiveTargetY = 0
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (!perspectiveActive) return
        const horizontalRange = Math.max(280, window.innerWidth * 0.36)
        const verticalRange = Math.max(220, window.innerHeight * 0.38)
        perspectiveTargetX = gsap.utils.clamp(
          -1,
          1,
          (event.clientX - logoCenterX) / horizontalRange,
        )
        perspectiveTargetY = gsap.utils.clamp(
          -1,
          1,
          (event.clientY - logoCenterY) / verticalRange,
        )
      }

      const setPerspectiveActive = (active: boolean) => {
        if (!finePointer || active === perspectiveActive) return
        perspectiveActive = active
        resetPerspectiveTarget()

        if (active) {
          measureLogoCenter()
          return
        }

        perspective.x = 0
        perspective.y = 0
        renderPerspective()
      }

      const renderPress = () => {
        const transform =
          `translate(0 ${press.y}) rotate(${press.rotation}) scale(${press.scale})`
        markPress.current?.setAttribute('transform', transform)
        colorMarkPress.current?.setAttribute('transform', transform)
      }

      const handleLogoPress = () => {
        if (!logoButtonActive) return
        pressTimeline
          .clear()
          .to(press, {
            y: 1.8,
            rotation: -2.4,
            scale: 0.88,
            duration: 0.1,
            ease: 'power2.in',
            onUpdate: renderPress,
          })
          .to(press, {
            y: -2.8,
            rotation: 2.8,
            scale: 1.16,
            duration: 0.22,
            ease: 'back.out(2.6)',
            onUpdate: renderPress,
          })
          .to(press, {
            y: 0.7,
            rotation: -1,
            scale: 0.97,
            duration: 0.16,
            ease: 'sine.inOut',
            onUpdate: renderPress,
          })
          .to(press, {
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.34,
            ease: 'elastic.out(1, 0.5)',
            onUpdate: renderPress,
          })
          .restart()
      }

      const setLogoButtonActive = (active: boolean) => {
        if (active === logoButtonActive) return
        logoButtonActive = active
        if (logoButton.current) {
          logoButton.current.disabled = !active
          logoButton.current.style.pointerEvents = active ? 'auto' : 'none'
        }

        if (active) return
        pressTimeline.pause(0).clear()
        press.y = 0
        press.rotation = 0
        press.scale = 1
        renderPress()
      }

      if (finePointer) {
        measureLogoCenter()
        gsap.ticker.add(updatePerspective)
        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        window.addEventListener('resize', measureLogoCenter, { passive: true })
        document.documentElement.addEventListener('mouseleave', resetPerspectiveTarget)
        logoButton.current?.addEventListener('click', handleLogoPress)
      }

      let lockedProgress: number | null = null
      let inputReady = true
      let stopAcknowledged = false
      let quietTimer: ReturnType<typeof window.setTimeout> | undefined
      const iosSafari = isIOSSafari()

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

      const releaseIntroForNavigation = () => {
        window.clearTimeout(quietTimer)
        lockedProgress = null
        stopAcknowledged = true
        inputReady = true
      }

      window.addEventListener('wheel', stopMomentum, { passive: false })
      window.addEventListener('touchstart', startTouchGesture, { passive: true })
      window.addEventListener('touchmove', stopTouchMomentum, { passive: false })
      window.addEventListener('touchend', endTouchGesture, { passive: true })
      window.addEventListener(
        'public:navigate-to-media',
        releaseIntroForNavigation,
      )
      window.addEventListener('public:navigate-home', releaseIntroForNavigation)

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'intro-scene',
          trigger: section.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          pinType: iosSafari ? 'transform' : 'fixed',
          scrub: 0.18,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setPulseActive(self.progress <= 0.001)
            setPerspectiveActive(self.progress <= 0.001)
            setLogoButtonActive(self.progress <= 0.001)
            const duration = timeline.duration()
            updateMaskState(duration > 0 && self.progress >= 1.02 / duration)
            const stop = timeline.labels.outside / timeline.duration()
            // Keep Safari's browser edges cream only while the opening mask is
            // completely untouched. As soon as its animation starts, blend the
            // browser chrome into the dark experience behind the mask.
            setPageTone(self.progress <= 0.001 ? '#f7f5ef' : '#07080b')

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
      const sloganLines = gsap.utils.toArray<HTMLElement>('.slogan-line > span')
      const renderMark = () => {
        const transform = `translate(${flight.x} ${flight.y}) rotate(${flight.rotation}) scale(${flight.scale})`
        mark.current?.setAttribute('transform', transform)
        colorMark.current?.setAttribute('transform', transform)
      }

      renderMark()
      gsap.set(content.current, { autoAlpha: 0, scale: 1.04 })
      gsap.set(ambient.current, { autoAlpha: 1, scale: 1 })
      gsap.set(copy.current, {
        autoAlpha: 0,
        y: 34,
        scale: 0.86,
        filter: 'blur(12px)',
      })
      gsap.set(sloganLines, { yPercent: 42 })
      gsap.set(sloganGlow.current, { autoAlpha: 0, scale: 0.72 })
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
        .to(
          sloganGlow.current,
          {
            autoAlpha: 0.82,
            scale: 1,
            duration: 0.42,
            ease: 'power3.out',
          },
          0.82,
        )
        .to(
          copy.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.38,
            ease: 'power3.out',
          },
          0.84,
        )
        .to(
          sloganLines,
          {
            yPercent: 0,
            duration: 0.36,
            stagger: 0.045,
            ease: 'power4.out',
          },
          0.86,
        )
        .addLabel('outside', 1.08)
        .to({}, { duration: 0.18 })
        .to(
          copy.current,
          {
            autoAlpha: 0,
            yPercent: -24,
            scale: 1.1,
            filter: 'blur(14px)',
            duration: 0.46,
            ease: 'power3.inOut',
          },
        )
        .to(
          sloganGlow.current,
          {
            autoAlpha: 0,
            scale: 1.38,
            duration: 0.46,
            ease: 'power3.inOut',
          },
          '<',
        )
        .to(
          ambient.current,
          {
            autoAlpha: 0,
            scale: 1.14,
            duration: 0.5,
            ease: 'power3.inOut',
          },
          '<',
        )

      return () => {
        pulseTimeline.kill()
        pressTimeline.kill()
        gsap.ticker.remove(updatePerspective)
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('resize', measureLogoCenter)
        document.documentElement.removeEventListener(
          'mouseleave',
          resetPerspectiveTarget,
        )
        logoButton.current?.removeEventListener('click', handleLogoPress)
        window.clearTimeout(quietTimer)
        window.removeEventListener('wheel', stopMomentum)
        window.removeEventListener('touchstart', startTouchGesture)
        window.removeEventListener('touchmove', stopTouchMomentum)
        window.removeEventListener('touchend', endTouchGesture)
        window.removeEventListener(
          'public:navigate-to-media',
          releaseIntroForNavigation,
        )
        window.removeEventListener(
          'public:navigate-home',
          releaseIntroForNavigation,
        )
        timeline.kill()
      }
    },
    {
      dependencies: [onMaskStateChange, onMobileNavigationGapChange],
      scope: section,
    },
  )

  return (
    <section
      className="intro"
      ref={section}
      aria-label="Public Outdoors introduction"
    >
      <div className="reveal-content" ref={content}>
        <AmbientField variant="intro" fieldRef={ambient} />
        <div className="slogan-glow" ref={sloganGlow} aria-hidden="true" />
        <div className="scene-copy scene-copy--intro" ref={copy}>
          <h1>
            <span className="slogan-line">
              <span>Espacios únicos para</span>
            </span>
            <span className="slogan-line">
              <span>elevar tu marca</span>
            </span>
          </h1>
        </div>
      </div>

      <BrandMask
        veilRef={veil}
        markRef={mark}
        colorMarkRef={colorMark}
        markPerspectiveRef={markPerspective}
        colorMarkPerspectiveRef={colorMarkPerspective}
        markPressRef={markPress}
        colorMarkPressRef={colorMarkPress}
        markPulseRef={markPulse}
        colorMarkPulseRef={colorMarkPulse}
      />

      <button
        className="logo-play-button"
        ref={logoButton}
        type="button"
        aria-label="Animar mariposa"
      />

      <div className="scroll-cue" ref={scrollCue} aria-hidden="true">
        <span>Desliza para explorar</span>
        <i />
      </div>
    </section>
  )
}

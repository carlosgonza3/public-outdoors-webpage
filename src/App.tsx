import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import indoorOne from './assets/images/indoor-1.JPG'
import indoorTwo from './assets/images/indoor-2.JPG'
import outdoorOne from './assets/images/outdoor-1.JPG'
import outdoorTwo from './assets/images/outdoor-2.JPG'
import outdoorThree from './assets/images/outdoor-3.JPG'

import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const page = useRef<HTMLElement>(null)
  const intro = useRef<HTMLElement>(null)
  const mark = useRef<SVGGElement>(null)
  const colorMark = useRef<SVGGElement>(null)
  const veil = useRef<SVGSVGElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const introCopy = useRef<HTMLDivElement>(null)
  const purposeCopy = useRef<HTMLDivElement>(null)
  const ambientField = useRef<HTMLDivElement>(null)
  const purposeAmbientField = useRef<HTMLDivElement>(null)
  const scrollCue = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLElement>(null)
  const purposeSection = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(veil.current, { autoAlpha: 0 })
        return
      }

      let nextStopIndex = 0
      let lockedProgress: number | null = null
      let inputReady = true
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

        if (lockedProgress !== null && inputReady) {
          lockedProgress = null
        }
      }

      const startTouchGesture = () => {
        if (lockedProgress !== null && inputReady) lockedProgress = null
      }

      const stopTouchMomentum = (event: TouchEvent) => {
        if (lockedProgress !== null) event.preventDefault()
      }

      const endTouchGesture = () => {
        if (lockedProgress !== null) {
          inputReady = true
        }
      }

      window.addEventListener('wheel', stopMomentum, { passive: false })
      window.addEventListener('touchstart', startTouchGesture, { passive: true })
      window.addEventListener('touchmove', stopTouchMomentum, { passive: false })
      window.addEventListener('touchend', endTouchGesture, { passive: true })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: intro.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.18,
          anticipatePin: 1,
          onUpdate: (self) => {
            const stops = [timeline.labels.outside / timeline.duration()]

            if (self.direction < 0) {
              nextStopIndex = stops.findIndex((stop) => stop > self.progress + 0.002)
              if (nextStopIndex < 0) nextStopIndex = stops.length
              lockedProgress = null
              inputReady = true
              return
            }

            if (lockedProgress !== null) {
              self.scroll(self.start + lockedProgress * (self.end - self.start))
              return
            }

            const nextStop = stops[nextStopIndex]
            if (nextStop !== undefined && self.progress >= nextStop) {
              lockedProgress = nextStop
              nextStopIndex += 1
              inputReady = false
              self.scroll(self.start + nextStop * (self.end - self.start))
              markInputQuiet()
            }
          },
        },
      })

      gsap.set([mark.current, colorMark.current], {
        scale: 3.2,
        svgOrigin: '500 500',
      })
      gsap.set(content.current, { autoAlpha: 0, scale: 1.04 })
      gsap.set(ambientField.current, {
        autoAlpha: 1,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
      })
      gsap.set(introCopy.current, { autoAlpha: 1, y: 0, filter: 'none' })

      timeline
        .addLabel('start')
        .to([mark.current, colorMark.current], {
          keyframes: [
            {
              x: -3,
              y: -16,
              rotation: -3,
              scale: 3.8,
              duration: 0.16,
              ease: 'sine.inOut',
            },
            {
              x: 4,
              y: -45,
              rotation: 3,
              scale: 5.2,
              duration: 0.16,
              ease: 'sine.inOut',
            },
            {
              x: -3,
              y: -92,
              rotation: -2,
              scale: 8,
              duration: 0.16,
              ease: 'sine.inOut',
            },
            {
              x: 0,
              y: -260,
              rotation: 0,
              scale: 58,
              duration: 0.52,
              ease: 'power3.in',
            },
          ],
        })
        .to(colorMark.current, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, 0.62)
        .to(veil.current, { autoAlpha: 0, duration: 0.08 }, 0.94)
        .to(scrollCue.current, { autoAlpha: 0, y: -12, duration: 0.12 }, 0.78)
        .to(
          content.current,
          { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.2 },
          0.8,
        )
        .addLabel('outside', 1.08)
        .to({}, { duration: 0.42 })

      grid.current?.querySelectorAll('.project-collection').forEach((collection) => {
        const cards = collection.querySelectorAll('.project-card')
        const label = collection.querySelector('[data-collection-label]')

        gsap.from(label, {
          x: -30,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: collection, start: 'top 82%' },
        })

        gsap.from(cards, {
          y: 90,
          autoAlpha: 0,
          rotation: (index) => [-2.5, 1.5, -1][index % 3],
          duration: 0.9,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: { trigger: collection, start: 'top 72%' },
        })
      })

      const purposeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: purposeSection.current,
          start: 'top 75%',
        },
      })

      purposeTimeline
        .fromTo(
          purposeAmbientField.current,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        )
        .fromTo(
          purposeCopy.current,
          { autoAlpha: 0, y: 55 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          0.22,
        )

      return () => {
        window.clearTimeout(quietTimer)
        window.removeEventListener('wheel', stopMomentum)
        window.removeEventListener('touchstart', startTouchGesture)
        window.removeEventListener('touchmove', stopTouchMomentum)
        window.removeEventListener('touchend', endTouchGesture)
        timeline.kill()
        purposeTimeline.kill()
      }
    },
    { scope: page },
  )

  return (
    <main ref={page}>
      <section className="intro" ref={intro} aria-label="Public Outdoors introduction">
        <div className="reveal-content" ref={content}>
          <div className="ambient-field" ref={ambientField} aria-hidden="true">
            <i className="ambient-glow ambient-glow--red" />
            <i className="ambient-glow ambient-glow--blue" />
            <i className="ambient-glow ambient-glow--green" />
          </div>

          <div className="scene-copy scene-copy--intro" ref={introCopy}>
            <h1>Espacios únicos para<br />elevar tu marca</h1>
          </div>

        </div>

        <svg
          ref={veil}
          className="logo-veil"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask id="mark-cutout">
              <rect width="1000" height="1000" fill="white" />
              <g ref={mark}>
                <g transform="translate(477.75 475)">
                  <path d="M43.0353 26.6296L44.4875 2.77441L34.9963 4.44748L35.902 16.4822L31.1837 39.0645L29.9401 43.0015L37.3543 37.6176L43.0353 26.6296Z" fill="black" />
                  <path d="M37.3544 37.6178L21.248 49.1966C21.248 49.1966 19.4579 39.5513 31.8109 31.1765C36.144 30.2517 37.3556 37.6189 37.3556 37.6189L37.3544 37.6178Z" fill="black" />
                  <path d="M0 46.4197C0 46.4197 3.40361 27.4772 22.162 26.1996L12.6293 18.3623L15.3678 2.7624L33.3853 0L43.0354 26.6294L37.3544 37.6174L8.36617 44.4104L0 46.4197Z" fill="black" />
                </g>
              </g>
            </mask>
          </defs>
          <rect width="1000" height="1000" fill="#f7f5ef" mask="url(#mark-cutout)" />
          <g ref={colorMark}>
            <g transform="translate(477.75 475)">
              <path d="M43.0353 26.6296L44.4875 2.77441L34.9963 4.44748L35.902 16.4822L31.1837 39.0645L29.9401 43.0015L37.3543 37.6176L43.0353 26.6296Z" fill="#00B0F4" />
              <path d="M37.3544 37.6178L21.248 49.1966C21.248 49.1966 19.4579 39.5513 31.8109 31.1765C36.144 30.2517 37.3556 37.6189 37.3556 37.6189L37.3544 37.6178Z" fill="#38D430" />
              <path d="M0 46.4197C0 46.4197 3.40361 27.4772 22.162 26.1996L12.6293 18.3623L15.3678 2.7624L33.3853 0L43.0354 26.6294L37.3544 37.6174L8.36617 44.4104L0 46.4197Z" fill="#FF0109" />
            </g>
          </g>
        </svg>

        <div className="scroll-cue" ref={scrollCue} aria-hidden="true">
          <span>PUBLIC</span><i />
        </div>
      </section>

      <section className="project-grid-section" ref={grid}>
        <header className="grid-heading">
          <span />
          <h2>Places designed to feel alive.</h2>
        </header>

        <div className="project-collections">
          <section className="project-collection collection--indoor">
            <header className="indoor-heading" data-collection-label><p className="eyebrow">INDOOR</p><span /></header>
            <div className="indoor-grid">
              <article className="project-card indoor-card indoor-card--one">
                <div className="card-visual card-visual--image"><img src={indoorOne} alt="Indoor project 1" /></div><h3>Indoor 01</h3>
              </article>
              <article className="project-card indoor-card indoor-card--two">
                <div className="card-visual card-visual--image"><img src={indoorTwo} alt="Indoor project 2" /></div><h3>Indoor 02</h3>
              </article>
              <article className="project-card indoor-card indoor-card--three">
                <div className="card-visual card-visual--green"></div><h3>Placeholder 03</h3>
              </article>
            </div>
          </section>

          <section className="project-collection collection--outdoor">
            <header className="outdoor-heading" data-collection-label><p className="eyebrow">OUTDOOR</p><span /></header>
            <div className="outdoor-grid">
              <article className="project-card outdoor-card outdoor-card--one">
                <div className="card-visual card-visual--image"><img src={outdoorOne} alt="Outdoor project 1" /></div><h5>Outdoor 01</h5>
              </article>
              <article className="project-card outdoor-card outdoor-card--two">
                <div className="card-visual card-visual--image"><img src={outdoorTwo} alt="Outdoor project 2" /></div><h3>Outdoor 02</h3>
              </article>
              <article className="project-card outdoor-card outdoor-card--three">
                <div className="card-visual card-visual--image"><img src={outdoorThree} alt="Outdoor project 3" /></div><h3>Outdoor 03</h3>
              </article>
            </div>
          </section>

          <section className="project-collection collection--innovations">
            <header className="innovations-heading" data-collection-label><p className="eyebrow">INNOVATIONS</p><span /></header>
            <div className="innovations-grid">
              <article className="project-card innovations-card innovations-card--one">
                <div className="card-visual card-visual--blue"><span>07</span></div><h3>Placeholder 07</h3>
              </article>
              <article className="project-card innovations-card innovations-card--two">
                <div className="card-visual card-visual--green"><span>08</span></div><h3>Placeholder 08</h3>
              </article>
              <article className="project-card innovations-card innovations-card--three">
                <div className="card-visual card-visual--red"><span>09</span></div><h3>Placeholder 09</h3>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section className="purpose-section" ref={purposeSection}>
        <div className="ambient-field ambient-field--purpose" ref={purposeAmbientField} aria-hidden="true">
          <i className="purpose-glow purpose-glow--blue-main" />
          <i className="purpose-glow purpose-glow--green-main" />
          <i className="purpose-glow purpose-glow--blue-small" />
          <i className="purpose-glow purpose-glow--green-small" />
          <i className="purpose-glow purpose-glow--red-accent" />
        </div>
        <div className="purpose-copy" ref={purposeCopy}>
          <p className="eyebrow">OUR PURPOSE</p>
          <h2>Built around the way people really use the outdoors.</h2>
        </div>
      </section>
    </main>
  )
}

export default App

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const intro = useRef<HTMLElement>(null)
  const mark = useRef<SVGGElement>(null)
  const colorMark = useRef<SVGGElement>(null)
  const veil = useRef<SVGSVGElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(veil.current, { autoAlpha: 0 })
        return
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: intro.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      gsap.set([mark.current, colorMark.current], {
        scale: 3.2,
        svgOrigin: '500 500',
      })
      gsap.set(content.current, { autoAlpha: 0, scale: 1.04 })

      timeline
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
        .to(
          content.current,
          { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.2 },
          0.8,
        )

      return () => timeline.kill()
    },
    { scope: intro },
  )

  return (
    <main>
      <section className="intro" ref={intro} aria-label="Public Outdoors introduction">
        <div className="reveal-content" ref={content}>
          <h1>Outside is<br />for everyone.</h1>
          <p>Scroll to discover public spaces made for gathering, moving, and belonging.</p>
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

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span><i />
        </div>
      </section>

      <section className="story">
        <p className="eyebrow">OUR PURPOSE</p>
        <h2>Built around the way people really use the outdoors.</h2>
      </section>
    </main>
  )
}

export default App

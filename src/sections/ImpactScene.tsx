import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { isMobileExperience } from '../animation/mobile'
import { setPageTone } from '../animation/pageTone'
import { isIOSSafari } from '../platform/iosSafari'

const metrics = [
  {
    value: '400,000',
    label: 'Impactos con el tráfico en nuestras ubicaciones premium',
  },
  {
    value: '600+',
    label: 'Clientes',
  },
  {
    value: '80+',
    label: 'Campañas exitosas',
  },
  {
    value: '21+',
    label: 'Años de experiencia en el mercado',
  },
]

const clientLogos = Object.values(
  import.meta.glob('../assets/clients/*.svg', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
) as string[]

clientLogos.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

export function ImpactScene() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const metricValues = useRef<Array<HTMLElement | null>>([])

  useGSAP(
    () => {
      if (!section.current || !track.current) return

      const mobile = isMobileExperience()
      const reducedMotion = prefersReducedMotion()
      const iosSafari = isIOSSafari()

      if (mobile) {
        const mobileMetrics = gsap.utils.toArray<HTMLElement>(
          '.impact-metric',
          section.current,
        )
        const clientsIntro = section.current.querySelector<HTMLElement>(
          '.clients-intro',
        )
        const clientLogos = gsap.utils.toArray<HTMLElement>(
          '.client-logo',
          section.current,
        )
        const clientsList = section.current.querySelector<HTMLElement>(
          '.clients-list',
        )
        const endMessage = section.current.querySelector<HTMLElement>(
          '.impact-track__end',
        )
        const mobileAnimations: gsap.core.Animation[] = []

        gsap.set(track.current, { clearProps: 'transform' })

        const toneTrigger = ScrollTrigger.create({
          trigger: section.current,
          start: 'top 78%',
          end: 'bottom top',
          onEnter: () => setPageTone('#080b0a', true),
          onEnterBack: () => setPageTone('#080b0a', true),
          onLeaveBack: () => setPageTone('#171717', true),
        })

        if (!reducedMotion) {
          mobileMetrics.forEach((metric) => {
            const value = metric.querySelector<HTMLElement>('strong > span')
            const label = metric.querySelector<HTMLElement>('p')
            if (!value || !label) return

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: metric,
                start: 'top 92%',
                end: 'top 54%',
                scrub: 0.42,
              },
            })

            timeline
              .from(metric, {
                autoAlpha: 0.12,
                y: 64,
                scale: 0.965,
                duration: 1,
                ease: 'power3.out',
              })
              .from(value, {
                autoAlpha: 0,
                yPercent: 24,
                scale: 0.92,
                duration: 0.82,
                ease: 'power3.out',
              }, 0.04)
              .from(label, {
                autoAlpha: 0,
                y: 22,
                duration: 0.64,
                ease: 'power2.out',
              }, 0.24)

            mobileAnimations.push(timeline)
          })

          if (clientsIntro) {
            const eyebrow = clientsIntro.querySelector<HTMLElement>('p')
            const title = clientsIntro.querySelector<HTMLElement>('strong')
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: clientsIntro,
                start: 'top 90%',
                end: 'top 52%',
                scrub: 0.45,
              },
            })

            timeline
              .from(clientsIntro, {
                autoAlpha: 0.18,
                y: 58,
                scale: 0.97,
                duration: 1,
                ease: 'power3.out',
              })
              .from(eyebrow, {
                autoAlpha: 0,
                y: 16,
                duration: 0.5,
                ease: 'power2.out',
              }, 0.08)
              .from(title, {
                autoAlpha: 0,
                yPercent: 18,
                duration: 0.76,
                ease: 'power3.out',
              }, 0.2)

            mobileAnimations.push(timeline)
          }

          if (clientsList && clientLogos.length) {
            mobileAnimations.push(gsap.from(clientLogos, {
              autoAlpha: 0,
              y: (index) => 42 + (index % 3) * 9,
              scale: 0.72,
              rotation: (index) => (index % 2 === 0 ? -11 : 11),
              duration: 0.82,
              stagger: {
                each: 0.045,
                from: 'random',
              },
              ease: 'back.out(1.45)',
              scrollTrigger: {
                trigger: clientsList,
                start: 'top 92%',
                end: 'bottom 58%',
                scrub: 0.5,
              },
            }))
          }

          if (endMessage) {
            mobileAnimations.push(gsap.from(endMessage, {
              autoAlpha: 0,
              y: 54,
              scale: 0.97,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: endMessage,
                start: 'top 90%',
                end: 'top 56%',
                scrub: 0.45,
              },
            }))
          }
        }

        return () => {
          toneTrigger.kill()
          mobileAnimations.forEach((animation) => animation.kill())
        }
      }

      const counterAnimations = new Map<Element, gsap.core.Tween>()
      const playedCounters = new Set<Element>()

      const scrambleValue = (target: string, progress: number) => {
        if (progress > 0.7) return target

        return [...target]
          .map((character) =>
            /\d/.test(character) ? Math.floor(Math.random() * 10).toString() : character,
          )
          .join('')
      }

      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const value = entry.target as HTMLElement
            const target = value.dataset.target ?? value.textContent ?? ''
            if (!entry.isIntersecting || playedCounters.has(value)) return

            if (reducedMotion) {
              value.textContent = target
              gsap.set(value, { clearProps: 'all' })
              playedCounters.add(value)
              counterObserver.unobserve(value)
              return
            }

            playedCounters.add(value)
            counterObserver.unobserve(value)

            const animation = gsap.to(
              { progress: 0 },
              {
                progress: 1,
                duration: 0.72,
                ease: 'power3.out',
                onStart: () => {
                  gsap.to(value, {
                    autoAlpha: 1,
                    yPercent: 0,
                    filter: 'blur(0px)',
                    duration: 0.28,
                    ease: 'power2.out',
                  })
                },
                onUpdate() {
                  value.textContent = scrambleValue(target, this.progress())
                },
                onComplete: () => {
                  value.textContent = target
                  counterAnimations.delete(value)
                },
              },
            )

            counterAnimations.set(value, animation)
          })
        },
        { threshold: 0.01 },
      )

      metricValues.current.forEach((value) => {
        if (!value) return
        if (!reducedMotion) {
          gsap.set(value, {
            autoAlpha: 0,
            yPercent: 14,
            filter: 'blur(10px)',
          })
        }
        counterObserver.observe(value)
      })

      if (reducedMotion) {
        return () => {
          counterObserver.disconnect()
          counterAnimations.forEach((animation) => animation.kill())
        }
      }

      const distance = () =>
        Math.max(0, track.current!.scrollWidth - document.documentElement.clientWidth)
      const previewDistance = () =>
        Math.min(window.innerWidth * 0.1, 160)
      const scrollDistance = () =>
        Math.max(1, distance() - previewDistance())

      const entryPreview = gsap.fromTo(
        track.current,
        { x: 0 },
        {
          x: () => -previewDistance(),
          force3D: true,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top 90%',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      const horizontalScroll = gsap.fromTo(
        track.current,
        { x: () => -previewDistance() },
        {
          x: () => -distance(),
          force3D: true,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${scrollDistance()}`,
            pin: true,
            pinType: iosSafari ? 'transform' : 'fixed',
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => setPageTone('#080b0a', true),
            onEnterBack: () => setPageTone('#080b0a', true),
            onLeaveBack: () => setPageTone('#03131c', true),
          },
        },
      )

      return () => {
        entryPreview.kill()
        horizontalScroll.kill()
        counterObserver.disconnect()
        counterAnimations.forEach((animation) => animation.kill())
      }
    },
    { scope: section },
  )

  return (
    <section
      className="impact-section"
      ref={section}
      aria-label="Nuestro impacto y clientes"
      data-scene-id="impact"
    >
      <div className="impact-track" ref={track}>
        {metrics.map((metric, index) => (
          <article className="impact-metric" key={metric.value}>
            <strong aria-label={metric.value}>
              <span
                aria-hidden="true"
                data-target={index < 3 ? metric.value : undefined}
                ref={
                  index < 3
                    ? (element) => {
                        metricValues.current[index] = element
                      }
                    : undefined
                }
              >
                {metric.value}
              </span>
            </strong>
            <p>{metric.label}</p>
          </article>
        ))}
        <div className="clients-intro">
          <p>Marcas que confían en nosotros</p>
          <strong>Nuestros clientes</strong>
        </div>
        <div className="clients-list" aria-label="Logotipos de nuestros clientes">
          {clientLogos.map((logo, index) => (
            <figure className="client-logo" key={logo}>
              <img
                src={logo}
                alt={`Cliente ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
        <p className="impact-track__end" aria-hidden="true">
          Juntos llegamos más lejos.
        </p>
      </div>
    </section>
  )
}

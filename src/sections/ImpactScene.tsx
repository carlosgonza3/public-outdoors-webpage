import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { LightboxImage } from '../components/ImageLightbox'
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
  const chrome = useRef<HTMLDivElement>(null)
  const metricValues = useRef<Array<HTMLElement | null>>([])

  useGSAP(
    () => {
      if (!section.current || !track.current) return

      const reducedMotion = prefersReducedMotion()
      const mobile = window.matchMedia('(max-width: 720px)').matches
      const iosSafari = isIOSSafari()
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
          gsap.set(value, { autoAlpha: 0, yPercent: 14, filter: 'blur(10px)' })
        }
        counterObserver.observe(value)
      })

      if (reducedMotion) {
        return () => {
          counterObserver.disconnect()
          counterAnimations.forEach((animation) => animation.kill())
        }
      }

      if (mobile) {
        gsap.set(track.current, { clearProps: 'transform' })

        const mobileTone = ScrollTrigger.create({
          trigger: section.current,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => setPageTone('#080b0a', true),
          onEnterBack: () => setPageTone('#080b0a', true),
          onLeaveBack: () => setPageTone('#171717', true),
        })

        return () => {
          mobileTone.kill()
          counterObserver.disconnect()
          counterAnimations.forEach((animation) => animation.kill())
        }
      }

      const distance = () =>
        Math.max(0, track.current!.scrollWidth - document.documentElement.clientWidth)
      const leadInProgress = 0.035
      const scrollDistance = () => distance() / (1 - leadInProgress)

      const horizontalScroll = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          pin: true,
          pinType: iosSafari ? 'transform' : 'fixed',
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setPageTone('#080b0a', true),
          onEnterBack: () => setPageTone('#080b0a', true),
          onLeaveBack: () => setPageTone('#03131c', true),
        },
      })

      horizontalScroll
        .to({}, { duration: leadInProgress })
        .to(
          chrome.current,
          {
            autoAlpha: 0,
            y: -24,
            duration: 0.045,
            ease: 'power2.out',
          },
          leadInProgress,
        )
        .to(
          track.current,
          {
            x: () => -distance(),
            force3D: true,
            duration: 1 - leadInProgress,
            ease: 'none',
          },
          leadInProgress,
        )

      return () => {
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
      <div className="impact-section__chrome" ref={chrome} aria-hidden="true">
        <span>Nuestro impacto</span>
        <span>Desliza para descubrir</span>
      </div>

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
              <LightboxImage
                src={logo}
                alt={`Cliente ${index + 1}`}
                caption={`Cliente ${index + 1}`}
                triggerClassName="image-lightbox-trigger--contain"
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

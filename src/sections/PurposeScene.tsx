import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { AmbientField } from '../components/AmbientField'

export function PurposeScene() {
  const section = useRef<HTMLElement>(null)
  const ambient = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top 84%',
          end: 'bottom 62%',
          toggleActions: 'play reverse play reverse',
        },
      })

      timeline
        .fromTo(
          ambient.current,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 0.78, ease: 'power2.out' },
        )
        .fromTo(
          copy.current,
          { autoAlpha: 0, yPercent: 18 },
          { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power3.out' },
          0.1,
        )

      return () => timeline.kill()
    },
    { scope: section },
  )

  return (
    <section className="purpose-section" ref={section} data-scene-id="purpose">
      <AmbientField variant="purpose" fieldRef={ambient} />
      <div className="purpose-copy" ref={copy}>
        <p className="eyebrow">¿No viste tu anuncio?</p>
        <h2>No dejes que pase de nuevo ¡Anúnciate con nosotros!</h2>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import butterfly from '../assets/public-butterfly.svg'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { setPageTone } from '../animation/pageTone'

export function AvailabilityPage() {
  const page = useRef<HTMLElement>(null)
  const mark = useRef<HTMLImageElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setPageTone('#07080b', true)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap
        .timeline()
        .from('.availability-page__back', {
          autoAlpha: 0,
          y: -12,
          duration: 0.45,
          ease: 'power3.out',
        })
        .from(
          mark.current,
          {
            autoAlpha: 0,
            scale: 0.65,
            rotation: -16,
            duration: 0.8,
            ease: 'back.out(2.3)',
          },
          0.08,
        )
        .from(
          '.availability-page__eyebrow, .availability-page__copy',
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power3.out',
          },
          0.2,
        )
        .from(
          '.availability-page__title > span',
          {
            yPercent: 115,
            duration: 0.85,
            ease: 'power4.out',
          },
          0.24,
        )
        .from(
          '.availability-page__footer',
          {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.55,
        )

      const idle = gsap
        .timeline({ repeat: -1, repeatDelay: 3.6, delay: 2 })
        .to(mark.current, {
          rotation: -6,
          scaleX: 0.92,
          scaleY: 1.06,
          duration: 0.22,
          ease: 'sine.inOut',
        })
        .to(mark.current, {
          rotation: 7,
          scaleX: 1.06,
          scaleY: 0.95,
          duration: 0.26,
          ease: 'sine.inOut',
        })
        .to(mark.current, {
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.42,
          ease: 'elastic.out(1, .5)',
        })

      return () => {
        timeline.kill()
        idle.kill()
      }
    },
    { scope: page },
  )

  return (
    <main className="availability-page" ref={page}>
      <div className="availability-page__glow" aria-hidden="true" />

      <section className="availability-page__content">
        <img
          className="availability-page__mark"
          ref={mark}
          src={butterfly}
          alt=""
        />
        <p className="availability-page__eyebrow">
          <span aria-hidden="true" />
          Próximamente
        </p>
        <h1 className="availability-page__title">
          <span>Disponibilidad</span>
        </h1>
        <p className="availability-page__copy">
          Estamos preparando una nueva forma de descubrir nuestros espacios.
        </p>
          <Link className="availability-page__back" to="/">
              <span aria-hidden="true">←</span>
              Volver
          </Link>
      </section>
    </main>
  )
}

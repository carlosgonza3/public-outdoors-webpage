import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { setPageTone } from '../animation/pageTone'
import { AmbientField } from '../components/AmbientField'
import { ContactCard } from '../components/ContactCard'
import { isIOSSafari } from '../platform/iosSafari'

const questionWords = ['¿No', 'viste', 'tu', 'marca?']
const statementWords = ['No', 'dejes', 'que', 'pase', 'de', 'nuevo.']
const actionWords = ['¡Anúnciate', 'con', 'nosotros!']

export function PurposeScene() {
  const section = useRef<HTMLElement>(null)
  const ambient = useRef<HTMLDivElement>(null)
  const question = useRef<HTMLDivElement>(null)
  const statement = useRef<HTMLDivElement>(null)
  const action = useRef<HTMLDivElement>(null)
  const contact = useRef<HTMLDivElement>(null)
  const contactBackdrop = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!section.current) return

      const stages = [question.current, statement.current, action.current]
      const siteNavigation = document.querySelector<HTMLElement>(
        '.site-overlay-nav',
      )
      const contactContainer = contact.current
      const backdrop = contactBackdrop.current
      const contactMotion = contactContainer?.querySelector<HTMLElement>(
        '.contact-card__motion',
      )
      const iosSafari = isIOSSafari()
      const mobile = window.matchMedia(
        '(max-width: 720px), (pointer: coarse)',
      ).matches

      if (!contactContainer || !backdrop || !contactMotion) return

      if (prefersReducedMotion()) {
        gsap.set(stages, { autoAlpha: 0 })
        gsap.set(action.current, { autoAlpha: 1 })
        gsap.set(contactContainer, { autoAlpha: 0 })
        return
      }

      gsap.set(statement.current, { autoAlpha: 0 })
      gsap.set(action.current, { autoAlpha: 0 })
      gsap.set('.purpose-stage__word > span', { yPercent: 115, autoAlpha: 0 })
      gsap.set('.purpose-statement__word', { yPercent: 72, autoAlpha: 0 })
      gsap.set('.purpose-action__word--lead > span', {
        yPercent: 70,
        scale: 0.78,
        autoAlpha: 0,
      })
      gsap.set('.purpose-action__word--support > span', {
        xPercent: 28,
        autoAlpha: 0,
      })
      gsap.set(contactContainer, { autoAlpha: 1 })
      gsap.set(backdrop, { autoAlpha: 0 })
      gsap.set(contactMotion, {
        autoAlpha: 0,
        xPercent: mobile ? 0 : -12,
        yPercent: mobile ? 7 : 0,
        rotationY: mobile ? 0 : -48,
        scale: mobile ? 0.975 : 0.96,
        clipPath: mobile ? 'none' : 'inset(0 82% 0 0 round 1.5rem)',
        transformOrigin: 'left center',
      })
      gsap.set(ambient.current, {
        transformOrigin: '50% 50%',
        force3D: true,
      })
      gsap.set('.purpose-glow', {
        transformOrigin: '50% 50%',
        force3D: true,
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: mobile ? '+=420%' : '+=500%',
          pin: true,
          pinType: iosSafari ? 'transform' : 'fixed',
          scrub: mobile ? true : 1.35,
          anticipatePin: mobile ? 0.5 : 1,
          invalidateOnRefresh: true,
          onEnter: () => setPageTone('#03131c', true),
          onEnterBack: () => setPageTone('#03131c', true),
          onLeaveBack: () => setPageTone('#080b0a', true),
        },
      })

      timeline
        // Camera position one — wide view of the static gradient field.
        .fromTo(
          ambient.current,
          { autoAlpha: 0, xPercent: -1.5, yPercent: -0.5, scale: 1.035 },
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 1.05,
            ease: 'sine.out',
          },
          0,
        )
        .to(
          '.purpose-stage__word > span',
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.075,
            ease: 'power4.out',
          },
          0.08,
        )
        .to({}, { duration: 0.45 })
        .to(question.current, {
          autoAlpha: 0,
          xPercent: -10,
          scale: 0.97,
          duration: 0.55,
          ease: 'power3.in',
        })
        // Camera position two — pan right and move slightly closer.
        .to(
          ambient.current,
          {
            xPercent: 2,
            yPercent: -1,
            scale: 1.045,
            duration: 1.05,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--blue-main',
          {
            xPercent: -14,
            yPercent: 9,
            scale: 1.04,
            duration: 1.05,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--green-main',
          {
            xPercent: 16,
            yPercent: -8,
            scale: 0.97,
            duration: 1.08,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--red-accent',
          {
            xPercent: -12,
            yPercent: -14,
            scale: 1.08,
            duration: 1.04,
            ease: 'sine.inOut',
          },
          '<',
        )

        // Act two — measured vertical convergence.
        .set(statement.current, { autoAlpha: 1 })
        .fromTo(
          statement.current,
          { scale: 0.9, yPercent: 8 },
          {
            scale: 1,
            yPercent: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
        )
        .to(
          '.purpose-statement__word',
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.055,
            ease: 'power4.out',
          },
          '<',
        )
        .to({}, { duration: 0.5 })
        .to(statement.current, {
          autoAlpha: 0,
          yPercent: -12,
          scale: 0.98,
          duration: 0.6,
          ease: 'power3.in',
        })
        // Camera position three — pan across the same canvas and pull back.
        .to(
          ambient.current,
          {
            xPercent: -1.75,
            yPercent: 1,
            scale: 1.015,
            duration: 1.08,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--blue-main',
          {
            xPercent: 12,
            yPercent: -7,
            scale: 0.98,
            duration: 1.08,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--green-main',
          {
            xPercent: -12,
            yPercent: 10,
            scale: 1.05,
            duration: 1.1,
            ease: 'sine.inOut',
          },
          '<',
        )
        .to(
          '.purpose-glow--red-accent',
          {
            xPercent: 14,
            yPercent: 8,
            scale: 0.96,
            duration: 1.06,
            ease: 'sine.inOut',
          },
          '<',
        )

        // Act three — direct call-to-action.
        .set(action.current, { autoAlpha: 1 })
        .to('.purpose-action__word--lead > span', {
          yPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.72,
          ease: 'back.out(1.18)',
        })
        .to(
          '.purpose-action__word--support > span',
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.08,
            ease: 'power4.out',
          },
          '-=.42',
        )
        .to({}, { duration: 0.75 })
        .to(action.current, {
          autoAlpha: 0,
          yPercent: -10,
          scale: 1.06,
          filter: mobile ? 'none' : 'blur(12px)',
          duration: 0.6,
          ease: 'power3.inOut',
        })
        .to(
          backdrop,
          {
            autoAlpha: 1,
            duration: 0.42,
            ease: 'power2.out',
          },
          '-=.24',
        )
        .to(
          siteNavigation,
          {
            autoAlpha: 0,
            y: -10,
            filter: 'blur(6px)',
            duration: 0.35,
            ease: 'power3.in',
          },
          '<',
        )
        .to(
          contactMotion,
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            rotationY: 0,
            scale: 1,
            clipPath: mobile ? 'none' : 'inset(0 0% 0 0 round 1.5rem)',
            duration: 0.82,
            ease: 'power4.out',
          },
          '<',
        )
        .set(contactMotion, { clipPath: 'none' })
        .to({}, { duration: 0.9 })
        .to(contactMotion, {
          xPercent: mobile ? 0 : 16,
          yPercent: mobile ? -7 : 0,
          rotationX: 0,
          rotationY: mobile ? 0 : 62,
          scale: mobile ? 0.975 : 0.91,
          clipPath: mobile ? 'none' : 'inset(0 0 0 100% round 1.5rem)',
          autoAlpha: 0,
          duration: 0.72,
          ease: 'power3.inOut',
          transformOrigin: 'right center',
        })
        .to(
          backdrop,
          {
            autoAlpha: 0,
            duration: 0.38,
            ease: 'power2.in',
          },
          '-=.48',
        )
        .to(
          siteNavigation,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.35,
            ease: 'power3.out',
          },
          '-=.12',
        )

      return () => {
        timeline.kill()
      }
    },
    { scope: section },
  )

  return (
    <section className="purpose-section" ref={section} data-scene-id="purpose">
      <AmbientField variant="purpose" fieldRef={ambient} />

      <div className="purpose-stage purpose-question" ref={question}>
        <h2 aria-label="¿No viste tu marca?">
          {questionWords.map((word) => (
            <span className="purpose-stage__word" key={word}>
              <span>{word}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="purpose-stage purpose-statement" ref={statement}>
        <h2 aria-label="No dejes que pase de nuevo.">
          {statementWords.map((word) => (
            <span className="purpose-statement__clip" key={word}>
              <span className="purpose-statement__word">{word}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="purpose-stage purpose-action" ref={action}>
        <h2 aria-label="¡Anúnciate con nosotros!">
          {actionWords.map((word, index) => (
            <span
              className={`purpose-action__word ${
                index === 0
                  ? 'purpose-action__word--lead'
                  : 'purpose-action__word--support'
              }`}
              key={word}
            >
              <span>{word}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="purpose-contact" ref={contact}>
        <div
          className="purpose-contact__backdrop"
          ref={contactBackdrop}
          aria-hidden="true"
        />
        <ContactCard mode="scroll" />
      </div>
    </section>
  )
}

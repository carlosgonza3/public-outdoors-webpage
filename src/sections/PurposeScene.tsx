import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { setPageTone } from '../animation/pageTone'
import { AmbientField } from '../components/AmbientField'

const questionWords = ['¿No', 'viste', 'tu', 'marca?']
const statementWords = ['No', 'dejes', 'que', 'pase', 'de', 'nuevo.']
const actionWords = ['¡Anúnciate', 'con', 'nosotros!']

export function PurposeScene() {
  const section = useRef<HTMLElement>(null)
  const ambient = useRef<HTMLDivElement>(null)
  const question = useRef<HTMLDivElement>(null)
  const statement = useRef<HTMLDivElement>(null)
  const action = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!section.current) return

      const stages = [question.current, statement.current, action.current]

      if (prefersReducedMotion()) {
        gsap.set(stages, { autoAlpha: 0 })
        gsap.set(action.current, { autoAlpha: 1 })
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
      gsap.set(ambient.current, {
        transformOrigin: '50% 50%',
        force3D: true,
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 1.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setPageTone('#03131c'),
          onEnterBack: () => setPageTone('#03131c'),
          onLeaveBack: () => setPageTone('#080b0a'),
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

      return () => timeline.kill()
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
    </section>
  )
}

import { useRef, useState } from 'react'
import { gsap, Observer, useGSAP } from '../animation/gsap'
import { isMobileExperience } from '../animation/mobile'
import { prefersReducedMotion } from '../animation/motion'
import { ContactCard } from '../components/ContactCard'
import { LightboxImage } from '../components/ImageLightbox'
import { projectCollections } from '../data/projects'
import { CollectionPage } from './CollectionPage'

interface IndoorPageProps {
  modal?: boolean
}

type IndoorFormat = 'digital' | 'fijo'

const indoorCollection = projectCollections.find(({ id }) => id === 'indoor')!
const [, indoorLandscape, indoorContext] = indoorCollection.projects

const formats = {
  digital: {
    index: '01',
    label: 'Digital',
    title: 'Movimiento que captura atención.',
    description:
      'Pantallas y cilindros digitales que integran movimiento, contexto y creatividad en espacios de alta afluencia.',
    image: indoorLandscape.image!,
    alt: indoorLandscape.alt ?? indoorLandscape.title,
  },
  fijo: {
    index: '02',
    label: 'Fijo',
    title: 'Presencia que permanece.',
    description:
      'Formatos de gran visibilidad integrados al recorrido de cada espacio para construir una presencia clara y memorable.',
    image: indoorContext.image!,
    alt: indoorContext.alt ?? indoorContext.title,
  },
} satisfies Record<
  IndoorFormat,
  {
    index: string
    label: string
    title: string
    description: string
    image: string
    alt: string
  }
>

const processSteps = [
  {
    title: 'Estrategia',
    description: 'Definamos tu audiencia, momento y ubicación.',
    icon: 'strategy',
  },
  {
    title: 'Producción',
    description: 'Convirtamos tus ideas en piezas que destacan',
    icon: 'production',
  },
  {
    title: 'Implementación',
    description: 'Nosotros instalamos, supervisamos y cuidamos la ejecución',
    icon: 'implementation',
  },
] as const

function ProcessIcon({ icon }: { icon: (typeof processSteps)[number]['icon'] }) {
  if (icon === 'strategy') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="13" />
        <circle cx="24" cy="24" r="4" />
        <path d="M24 4v7M24 37v7M4 24h7M37 24h7" />
      </svg>
    )
  }

  if (icon === 'production') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="m24 5 16 9-16 9L8 14l16-9Z" />
        <path d="m8 23 16 9 16-9M8 32l16 9 16-9" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M39 21c0 10-15 22-15 22S9 31 9 21a15 15 0 1 1 30 0Z" />
      <path d="m18 21 4 4 8-9" />
    </svg>
  )
}

export function IndoorPage({ modal = false }: IndoorPageProps) {
  const page = useRef<HTMLDivElement>(null)
  const strategySection = useRef<HTMLElement>(null)
  const formatsSection = useRef<HTMLElement>(null)
  const formatStage = useRef<HTMLDivElement>(null)
  const [activeFormat, setActiveFormat] = useState<IndoorFormat>('digital')
  const [contactOpen, setContactOpen] = useState(false)
  const selectedFormat = formats[activeFormat]

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const mobile = isMobileExperience()
      const modalScroller = modal
        ? page.current?.closest<HTMLElement>('.route-modal__panel')
        : undefined
      const title = page.current?.querySelector('.indoor-hero__title-inner')
      const eyebrow = page.current?.querySelector('.indoor-hero__eyebrow')
      const statement = page.current?.querySelectorAll(
        '.indoor-hero__statement > *',
      )
      const heroMedia = page.current?.querySelector('.indoor-hero__media')
      const introduction = gsap.timeline({ defaults: { ease: 'power4.out' } })

      if (eyebrow) {
        introduction.from(eyebrow, { autoAlpha: 0, y: 12, duration: 0.45 })
      }

      if (title) {
        introduction.from(
          title,
          { yPercent: 112, duration: mobile ? 0.68 : 0.9 },
          0.08,
        )
      }

      if (statement?.length) {
        introduction.from(
          statement,
          {
            autoAlpha: 0,
            y: mobile ? 18 : 28,
            duration: mobile ? 0.5 : 0.65,
            stagger: 0.08,
          },
          0.28,
        )
      }

      if (heroMedia) {
        introduction.fromTo(
          heroMedia,
          {
            autoAlpha: 0,
            clipPath: mobile
              ? 'inset(10% 0% 0% 0% round 1.4rem)'
              : 'inset(18% 0% 0% 0% round 2.5rem)',
            scale: 1.035,
          },
          {
            autoAlpha: 1,
            clipPath: mobile
              ? 'inset(0% 0% 0% 0% round 1.4rem)'
              : 'inset(0% 0% 0% 0% round 2.5rem)',
            scale: 1,
            duration: mobile ? 0.72 : 1,
          },
          0.22,
        )
      }

      gsap.utils.toArray<HTMLElement>('.indoor-reveal', page.current).forEach(
        (element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: mobile ? 28 : 52,
            duration: mobile ? 0.62 : 0.82,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: element,
              start: mobile ? 'top 90%' : 'top 84%',
              once: true,
              scroller: modalScroller,
            },
          })
        },
      )

      if (!mobile) {
        gsap.utils
          .toArray<HTMLElement>('[data-indoor-parallax]', page.current)
          .forEach((element) => {
            const image = element.querySelector('img')
            if (!image) return

            gsap.fromTo(
              image,
              { yPercent: -3 },
              {
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: element,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.7,
                  scroller: modalScroller,
                },
              },
            )
          })
      }

      return () => introduction.kill()
    },
    { scope: page, dependencies: [modal] },
  )

  useGSAP(
    () => {
      const section = strategySection.current
      if (!section || prefersReducedMotion()) return

      const mobile = isMobileExperience()
      const modalScroller = modal
        ? page.current?.closest<HTMLElement>('.route-modal__panel')
        : undefined
      const eyebrow = section.querySelector('.indoor-strategy__eyebrow')
      const title = section.querySelector('.indoor-strategy__lead h2')
      const description = section.querySelector('.indoor-strategy__description')
      const steps = gsap.utils.toArray<HTMLElement>(
        '.indoor-strategy__step',
        section,
      )
      const stepDescriptions = steps.map((step) =>
        step.querySelector<HTMLElement>('.indoor-strategy__step-copy small')!,
      )

      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: mobile ? 'top 88%' : 'top 76%',
          once: true,
          scroller: modalScroller,
        },
        defaults: { ease: 'power4.out' },
      })

      entrance
        .from(eyebrow, { autoAlpha: 0, y: 18, duration: 0.5 })
        .from(title, { autoAlpha: 0, y: mobile ? 32 : 54, duration: 0.8 }, 0.08)
        .from(
          description,
          { autoAlpha: 0, y: 28, duration: 0.65 },
          0.22,
        )

      if (mobile) {
        entrance.from(
          steps,
          {
            autoAlpha: 0,
            x: 24,
            duration: 0.55,
            stagger: 0.12,
          },
          0.3,
        )
        return () => entrance.kill()
      }

      gsap.set(steps, { opacity: 0.42 })
      gsap.set(steps[0], { opacity: 1 })
      gsap.set(stepDescriptions, {
        autoAlpha: 0,
        y: 6,
      })
      gsap.set(stepDescriptions[0], {
        autoAlpha: 1,
        y: 0,
      })
      steps[0]?.setAttribute('aria-current', 'step')
      let activeIndex = 0
      let stepTransition: gsap.core.Timeline | undefined

      const showStep = (nextIndex: number, immediate = false) => {
        if (!immediate && nextIndex === activeIndex) return
        activeIndex = nextIndex
        stepTransition?.kill()

        steps.forEach((step, index) => {
          if (index === nextIndex) step.setAttribute('aria-current', 'step')
          else step.removeAttribute('aria-current')
        })

        if (immediate) {
          gsap.set(steps, { opacity: 0.42 })
          gsap.set(steps[nextIndex], { opacity: 1 })
          gsap.set(stepDescriptions, {
            autoAlpha: 0,
            y: 6,
          })
          gsap.set(stepDescriptions[nextIndex], {
            autoAlpha: 1,
            y: 0,
          })
          return
        }

        stepTransition = gsap.timeline({ defaults: { overwrite: true } })
        stepTransition
          .to(steps, { opacity: 0.42, duration: 0.18, ease: 'power2.out' }, 0)
          .to(
            stepDescriptions,
            {
              autoAlpha: 0,
              y: 6,
              duration: 0.16,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            steps[nextIndex],
            { opacity: 1, duration: 0.22, ease: 'power2.out' },
            0.12,
          )
          .to(
            stepDescriptions[nextIndex],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.22,
              ease: 'power2.out',
            },
            0.12,
          )
      }

      showStep(0, true)
      const scrollSource: HTMLElement | Window = modalScroller ?? window
      let updateFrame = 0
      const updateActiveStep = () => {
        updateFrame = 0
        const viewportTop = modalScroller?.getBoundingClientRect().top ?? 0
        const viewportHeight = modalScroller?.clientHeight ?? window.innerHeight
        const rect = section.getBoundingClientRect()
        const travel = Math.max(section.offsetHeight - viewportHeight, 1)
        const progress = gsap.utils.clamp(
          0,
          1,
          (viewportTop - rect.top) / travel,
        )
        const nextIndex = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2
        showStep(nextIndex)
      }
      const queueStepUpdate = () => {
        if (updateFrame) return
        updateFrame = window.requestAnimationFrame(updateActiveStep)
      }

      scrollSource.addEventListener('scroll', queueStepUpdate, {
        passive: true,
      })
      updateActiveStep()

      return () => {
        scrollSource.removeEventListener('scroll', queueStepUpdate)
        if (updateFrame) window.cancelAnimationFrame(updateFrame)
        stepTransition?.kill()
        entrance.kill()
      }
    },
    { scope: strategySection, dependencies: [modal] },
  )

  useGSAP(
    () => {
      const section = formatsSection.current
      const pinnedStage = section?.querySelector<HTMLElement>(
        '.indoor-formats__sticky',
      )
      const modalScroller = page.current?.closest<HTMLElement>(
        '.route-modal__panel',
      )

      if (
        !modal ||
        !section ||
        !pinnedStage ||
        !modalScroller ||
        prefersReducedMotion() ||
        isMobileExperience()
      ) {
        return
      }

      let stage: 0 | 1 = 0
      let engaged = false
      let releasing = false
      let locked = false
      let lastScrollTop = modalScroller.scrollTop
      let unlockCall: gsap.core.Tween | undefined
      let scrollTween: gsap.core.Tween | undefined

      const sectionStart = () =>
        modalScroller.scrollTop +
        section.getBoundingClientRect().top -
        modalScroller.getBoundingClientRect().top
      const sectionEnd = () =>
        sectionStart() + section.offsetHeight - modalScroller.clientHeight

      const selectFormat = (format: IndoorFormat) => {
        setActiveFormat((currentFormat) =>
          currentFormat === format ? currentFormat : format,
        )
      }

      const unlock = () => {
        unlockCall?.kill()
        unlockCall = gsap.delayedCall(0.55, () => {
          locked = false
        })
      }

      const snapScroll = (scrollTop: number, onComplete?: () => void) => {
        scrollTween?.kill()
        scrollTween = gsap.to(modalScroller, {
          scrollTop,
          duration: 0.5,
          ease: 'power2.inOut',
          overwrite: true,
          onComplete: () => {
            scrollTween = undefined
            lastScrollTop = modalScroller.scrollTop
            onComplete?.()
          },
        })
      }

      const release = (direction: 1 | -1) => {
        releasing = true
        engaged = false
        observer.disable()
        const exitDistance = modalScroller.clientHeight * 0.72
        snapScroll(
          direction > 0
            ? sectionEnd() + exitDistance
            : sectionStart() - exitDistance,
          () => {
            locked = false
            releasing = false
          },
        )
      }

      const advance = (direction: 1 | -1) => {
        if (!engaged) {
          observer.disable()
          return
        }

        if (locked) return
        locked = true

        if (direction > 0) {
          if (stage === 0) {
            stage = 1
            selectFormat('fijo')
            unlock()
          } else {
            release(1)
          }
          return
        }

        if (stage === 1) {
          stage = 0
          selectFormat('digital')
          unlock()
        } else {
          release(-1)
        }
      }

      const observer = Observer.create({
        target: modalScroller,
        type: 'wheel',
        preventDefault: true,
        tolerance: 12,
        wheelSpeed: 1,
        onChangeY: (self) => advance(self.deltaY > 0 ? 1 : -1),
      })
      observer.disable()

      const engage = (nextStage: 0 | 1) => {
        if (engaged || releasing) return

        engaged = true
        stage = nextStage
        locked = true
        observer.disable()
        selectFormat(nextStage === 0 ? 'digital' : 'fijo')
        snapScroll(nextStage === 0 ? sectionStart() : sectionEnd() - 1, () => {
          observer.enable()
          unlock()
        })
      }

      const handleScroll = () => {
        const currentScrollTop = modalScroller.scrollTop
        const direction = currentScrollTop >= lastScrollTop ? 1 : -1
        lastScrollTop = currentScrollTop

        if (releasing || scrollTween) return

        const panelRect = modalScroller.getBoundingClientRect()
        const sectionRect = section.getBoundingClientRect()
        const relativeTop = sectionRect.top - panelRect.top
        const relativeBottom = sectionRect.bottom - panelRect.top
        const insideSection =
          relativeTop <= 1 && relativeBottom >= modalScroller.clientHeight - 1

        if (!insideSection) {
          engaged = false
          observer.disable()
          if (relativeTop > 1) {
            stage = 0
            selectFormat('digital')
          }
          return
        }

        if (!engaged) engage(direction > 0 ? 0 : 1)
      }

      modalScroller.addEventListener('scroll', handleScroll, { passive: true })

      const initialTop =
        section.getBoundingClientRect().top -
        modalScroller.getBoundingClientRect().top
      const initialBottom = initialTop + section.offsetHeight
      if (
        initialTop <= 1 &&
        initialBottom >= modalScroller.clientHeight - 1
      ) {
        const midpoint = (sectionStart() + sectionEnd()) / 2
        engage(modalScroller.scrollTop < midpoint ? 0 : 1)
      } else {
        if (initialTop > 1) {
          stage = 0
          selectFormat('digital')
        }
      }

      return () => {
        modalScroller.removeEventListener('scroll', handleScroll)
        observer.kill()
        unlockCall?.kill()
        scrollTween?.kill()
      }
    },
    { scope: formatsSection, dependencies: [modal] },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion() || !formatStage.current) return

      const transitionTargets = formatStage.current.querySelectorAll(
        '.indoor-formats__visual, .indoor-formats__copy > h3, .indoor-formats__copy > p',
      )

      gsap.fromTo(
        transitionTargets,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.035,
          ease: 'power3.out',
        },
      )
    },
    {
      scope: formatStage,
      dependencies: [activeFormat],
      revertOnUpdate: true,
    },
  )

  return (
    <>
      <CollectionPage
        collectionId="indoor"
        label={indoorCollection.label}
        modal={modal}
      >
        <div className="indoor-page" ref={page}>
          <header className="indoor-hero">
            <div className="indoor-hero__heading">
              <h1 aria-label={indoorCollection.label}>
                <span className="indoor-hero__title-mask">
                  <span className="indoor-hero__title-inner">
                    {indoorCollection.label}
                  </span>
                </span>
              </h1>

              <div className="indoor-hero__statement">
                <h2>
                  Tu marca,
                  <br />
                  en el momento correcto.
                </h2>
                <p>
                  Presencia estratégica en espacios donde las personas esperan,
                  compran y se conectan.
                </p>
              </div>
            </div>

            <div className="indoor-hero__media" data-indoor-parallax>
              <LightboxImage
                src={indoorContext.image!}
                alt={indoorContext.alt ?? indoorContext.title}
                caption="Indoor · Presencia de marca"
                triggerClassName="image-lightbox-trigger--fill"
                loading="eager"
                decoding="async"
              />
            </div>
          </header>

          <section
            className="indoor-strategy"
            aria-labelledby="indoor-strategy-title"
            ref={strategySection}
          >
            <div className="indoor-strategy__sticky">
              <div className="indoor-strategy__lead">
                <p className="indoor-kicker indoor-strategy__eyebrow">
                  Estrategia OOH personalizada
                </p>
                <h2 id="indoor-strategy-title">
                  No solo ocupamos espacios.
                  <br />
                  Diseñamos encuentros.
                </h2>
              </div>

              <div className="indoor-strategy__body">
                <p className="indoor-strategy__description">
                  Creamos experiencias de marca dentro de centros comerciales,
                  combinando estrategia, creatividad y producción in-house para
                  que cada campaña se integre naturalmente a su entorno.
                </p>

                <ol aria-label="Nuestro proceso">
                  {processSteps.map((step) => (
                    <li className="indoor-strategy__step" key={step.title}>
                      <span className="indoor-strategy__icon">
                        <ProcessIcon icon={step.icon} />
                      </span>
                      <span className="indoor-strategy__step-copy">
                        <strong>{step.title}</strong>
                        <small>{step.description}</small>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section
            className="indoor-formats"
            aria-labelledby="indoor-formats-title"
            ref={formatsSection}
          >
            <div className="indoor-formats__sticky">
              <header className="indoor-formats__header indoor-reveal">
                <div>
                  <h2 id="indoor-formats-title">
                    Formatos que viven en el espacio.
                  </h2>
                </div>
              </header>

              <div
                className="indoor-formats__stage"
                id="indoor-format-panel"
                role="tabpanel"
                aria-labelledby={`indoor-format-${activeFormat}`}
                ref={formatStage}
              >
                <div className="indoor-formats__visual" data-indoor-parallax>
                  <LightboxImage
                    key={selectedFormat.image}
                    src={selectedFormat.image}
                    alt={selectedFormat.alt}
                    caption={`Indoor · ${selectedFormat.label}`}
                    triggerClassName="image-lightbox-trigger--fill"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="indoor-formats__copy">
                  <div
                    className="indoor-formats__tabs"
                    role="tablist"
                    aria-label="Formatos Indoor"
                  >
                    {(Object.keys(formats) as IndoorFormat[]).map((format) => (
                      <button
                        className={
                          activeFormat === format ? 'is-active' : undefined
                        }
                        id={`indoor-format-${format}`}
                        key={format}
                        type="button"
                        role="tab"
                        aria-controls="indoor-format-panel"
                        aria-selected={activeFormat === format}
                        onClick={() => setActiveFormat(format)}
                      >
                        {formats[format].label}
                      </button>
                    ))}
                  </div>
                  <h3>{selectedFormat.title}</h3>
                  <p>{selectedFormat.description}</p>
                  {/*<ul aria-label="Características">*/}
                  {/*  <li>Alta afluencia</li>*/}
                  {/*  <li>Integración contextual</li>*/}
                  {/*  <li>Producción in-house</li>*/}
                  {/*</ul>*/}
                </div>
              </div>
            </div>
          </section>

          <section
            className="indoor-cta indoor-reveal"
            aria-labelledby="indoor-cta-title"
          >
            <div>
              <h2 id="indoor-cta-title">
                Hagamos visible
                <br />
                tu próxima idea.
              </h2>
              <button type="button" onClick={() => setContactOpen(true)}>
                Contáctanos <span aria-hidden="true">↗</span>
              </button>
            </div>
          </section>
        </div>
      </CollectionPage>

      {contactOpen && <ContactCard onClose={() => setContactOpen(false)} />}
    </>
  )
}

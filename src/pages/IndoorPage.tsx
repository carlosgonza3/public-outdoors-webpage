import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
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

const projectNames = [
  'Pantalla estratégica',
  'Cilindro digital',
  'Presencia de marca',
]

export function IndoorPage({ modal = false }: IndoorPageProps) {
  const page = useRef<HTMLDivElement>(null)
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
      if (prefersReducedMotion() || !formatStage.current) return

      gsap.fromTo(
        formatStage.current,
        { autoAlpha: 0.45, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
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
            <div className="indoor-hero__eyebrow" aria-hidden="true">
              <span>Public / Indoor</span>
              <span>01</span>
            </div>

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
              {/*<span className="indoor-hero__media-label" aria-hidden="true">*/}
              {/*  Centros comerciales / El Salvador*/}
              {/*</span>*/}
            </div>
          </header>

          <section
            className="indoor-strategy"
            aria-labelledby="indoor-strategy-title"
          >
            <div className="indoor-strategy__lead indoor-reveal">
              <p className="indoor-kicker">Estrategia OOH personalizada</p>
              <h2 id="indoor-strategy-title">
                No solo ocupamos espacios.
                <br />
                Diseñamos encuentros.
              </h2>
            </div>

            <div className="indoor-strategy__body indoor-reveal">
              <p>
                Creamos experiencias de marca dentro de centros comerciales,
                combinando estrategia, creatividad y producción in-house para
                que cada campaña se integre naturalmente a su entorno.
              </p>

              <ol aria-label="Nuestro proceso">
                <li>
                  <span>01</span>
                  <strong>Estrategia</strong>
                </li>
                <li>
                  <span>02</span>
                  <strong>Producción</strong>
                </li>
                <li>
                  <span>03</span>
                  <strong>Implementación</strong>
                </li>
              </ol>
            </div>
          </section>

          <section
            className="indoor-formats"
            aria-labelledby="indoor-formats-title"
          >
            <header className="indoor-formats__header indoor-reveal">
              <div>
                <p className="indoor-kicker">Medios en centros comerciales</p>
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
                <span aria-hidden="true">
                  {selectedFormat.index} / {selectedFormat.label}
                </span>
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
                <span>{selectedFormat.index}</span>
                <h3>{selectedFormat.title}</h3>
                <p>{selectedFormat.description}</p>
                {/*<ul aria-label="Características">*/}
                {/*  <li>Alta afluencia</li>*/}
                {/*  <li>Integración contextual</li>*/}
                {/*  <li>Producción in-house</li>*/}
                {/*</ul>*/}
              </div>
            </div>
          </section>

          <section className="indoor-work" aria-labelledby="indoor-work-title">
            <header className="indoor-work__header indoor-reveal">
              <p className="indoor-kicker">Proyectos seleccionados</p>
              <h2 id="indoor-work-title">Presencia que se siente.</h2>
            </header>

            <div className="indoor-work__grid">
              {indoorCollection.projects.map((project, index) => (
                <article
                  className="indoor-work__project indoor-reveal"
                  key={project.id}
                >
                  <div className="indoor-work__visual" data-indoor-parallax>
                    <LightboxImage
                      src={project.image!}
                      alt={project.alt ?? project.title}
                      caption={projectNames[index]}
                      triggerClassName="image-lightbox-trigger--fill"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="indoor-work__meta">
                    <span>{project.id}</span>
                    <h3>{projectNames[index]}</h3>
                    <p>{index === 2 ? 'Formato fijo' : 'Formato digital'}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="indoor-cta indoor-reveal"
            aria-labelledby="indoor-cta-title"
          >
            {/*<p className="indoor-kicker">Public · El Salvador</p>*/}
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

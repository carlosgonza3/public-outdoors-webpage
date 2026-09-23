import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { isMobileExperience } from '../animation/mobile'
import { prefersReducedMotion } from '../animation/motion'
import { ContactCard } from '../components/ContactCard'
import { LightboxImage } from '../components/ImageLightbox'
import { projectCollections } from '../data/projects'
import { CollectionPage } from './CollectionPage'

interface OutdoorPageProps {
  modal?: boolean
}

type OutdoorFormat = 'gran-formato' | 'digital' | 'proximidad'

const outdoorCollection = projectCollections.find(({ id }) => id === 'outdoor')!
const [streetFurniture, billboard, verticalDigital] = outdoorCollection.projects

const formats = {
  'gran-formato': {
    index: '01',
    label: 'Gran formato',
    title: 'Presencia que domina el recorrido.',
    description:
      'Pasarelas y vallas fijas ubicadas en vías estratégicas para construir alcance, frecuencia y recordación.',
    products: ['Pasarela fija', 'Vallas fijas'],
    image: billboard.image!,
    alt: billboard.alt ?? billboard.title,
  },
  digital: {
    index: '02',
    label: 'Digital',
    title: 'Historias que avanzan con la ciudad.',
    description:
      'Pasarelas digitales y pantallas triples que combinan movimiento, secuencia y escala para multiplicar el impacto.',
    products: ['Pasarela digital', 'Pantalla digital triple'],
    image: verticalDigital.image!,
    alt: verticalDigital.alt ?? verticalDigital.title,
  },
  proximidad: {
    index: '03',
    label: 'Proximidad',
    title: 'Mensajes que acompañan el trayecto.',
    description:
      'Paradas de buses y banderolas que acercan tu marca a las personas en momentos cotidianos de espera y movilidad.',
    products: ['Parada de buses', 'Banderolas'],
    image: streetFurniture.image!,
    alt: streetFurniture.alt ?? streetFurniture.title,
  },
} satisfies Record<
  OutdoorFormat,
  {
    index: string
    label: string
    title: string
    description: string
    products: string[]
    image: string
    alt: string
  }
>

const coverageSteps = [
  {
    number: '01',
    title: 'Ubicación',
    description: 'Puntos estratégicos e intersecciones de alta circulación.',
  },
  {
    number: '02',
    title: 'Formato',
    description: 'El medio correcto para el objetivo y ritmo de tu campaña.',
  },
  {
    number: '03',
    title: 'Exposición',
    description: 'Presencia sostenida para que tu marca se vea y se recuerde.',
  },
] as const

export function OutdoorPage({ modal = false }: OutdoorPageProps) {
  const page = useRef<HTMLDivElement>(null)
  const formatStage = useRef<HTMLDivElement>(null)
  const [activeFormat, setActiveFormat] =
    useState<OutdoorFormat>('gran-formato')
  const [contactOpen, setContactOpen] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const mobile = isMobileExperience()
      const modalScroller = modal
        ? page.current?.closest<HTMLElement>('.route-modal__panel')
        : undefined
      const title = page.current?.querySelector('.indoor-hero__title-inner')
      const statement = page.current?.querySelectorAll(
        '.indoor-hero__statement > *',
      )
      const heroMedia = page.current?.querySelector('.indoor-hero__media')
      const introduction = gsap.timeline({ defaults: { ease: 'power4.out' } })

      if (title) {
        introduction.from(title, {
          yPercent: 112,
          duration: mobile ? 0.68 : 0.9,
        })
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
          0.2,
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
          0.18,
        )
      }

      gsap.utils.toArray<HTMLElement>('.outdoor-reveal', page.current).forEach(
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
          .toArray<HTMLElement>('[data-outdoor-parallax]', page.current)
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

      const layers = gsap.utils.toArray<HTMLElement>(
        '[data-outdoor-format-layer]',
        formatStage.current,
      )
      const activeLayers = layers.filter(
        (layer) => layer.dataset.outdoorFormatLayer === activeFormat,
      )
      const inactiveLayers = layers.filter(
        (layer) => layer.dataset.outdoorFormatLayer !== activeFormat,
      )
      const transition = gsap.timeline({ defaults: { overwrite: 'auto' } })

      transition
        .to(
          inactiveLayers,
          { autoAlpha: 0, y: -8, duration: 0.28, ease: 'power2.out' },
          0,
        )
        .fromTo(
          activeLayers,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' },
          0.06,
        )

      return () => transition.kill()
    },
    { scope: formatStage, dependencies: [activeFormat] },
  )

  return (
    <>
      <CollectionPage
        collectionId="outdoor"
        label={outdoorCollection.label}
        modal={modal}
      >
        <div className="indoor-page outdoor-page" ref={page}>
          <header className="indoor-hero outdoor-hero">
            <div className="indoor-hero__heading">
              <h1 aria-label={outdoorCollection.label}>
                <span className="indoor-hero__title-mask">
                  <span className="indoor-hero__title-inner">
                    {outdoorCollection.label}
                  </span>
                </span>
              </h1>

              <div className="indoor-hero__statement">
                <h2>
                  Tu marca,
                  <br />
                    presente en puntos clave del camino.
                </h2>
                <p>
                    Presencia de alto impacto en ubicaciones estratégicas que conectan con las personas durante sus recorridos.
                </p>
              </div>
            </div>

            <div className="indoor-hero__media" data-outdoor-parallax>
              <LightboxImage
                src={billboard.image!}
                alt={billboard.alt ?? billboard.title}
                caption="Outdoor · Presencia de marca"
                triggerClassName="image-lightbox-trigger--fill"
                loading="eager"
                decoding="async"
              />
            </div>
          </header>

          <section
            className="indoor-strategy outdoor-strategy outdoor-reveal"
            aria-labelledby="outdoor-strategy-title"
          >
            <div className="indoor-strategy__sticky">
              <div className="indoor-strategy__lead">
                <p className="indoor-kicker">Cobertura estratégica</p>
                <h2 id="outdoor-strategy-title">
                  No solo mostramos
                  <br />
                  tu marca. La ponemos
                  <br />
                  en movimiento.
                </h2>
              </div>

              <div className="indoor-strategy__body">
                <p>
                  Combinamos ubicación, formato y exposición para que cada
                  campaña conecte con la ciudad en el momento y lugar indicados.
                </p>

                <ol aria-label="Nuestra cobertura">
                  {coverageSteps.map((step) => (
                    <li className="indoor-strategy__step" key={step.title}>
                      <span className="outdoor-strategy__number">
                        {step.number}
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
            className="indoor-formats outdoor-formats"
            aria-labelledby="outdoor-formats-title"
          >
            <div className="indoor-formats__sticky">
              <header className="indoor-formats__header outdoor-reveal">
                <div>
                  <h2 id="outdoor-formats-title">
                    Formatos que viven en la ciudad.
                  </h2>
                </div>
              </header>

              <div
                className="indoor-formats__stage"
                id="outdoor-format-panel"
                role="tabpanel"
                aria-labelledby={`outdoor-format-${activeFormat}`}
                ref={formatStage}
              >
                <div
                  className="indoor-formats__visual"
                  data-outdoor-parallax
                >
                  {(Object.keys(formats) as OutdoorFormat[]).map((format) => (
                    <div
                      className="indoor-formats__visual-layer"
                      data-outdoor-format-layer={format}
                      aria-hidden={activeFormat !== format}
                      key={format}
                    >
                      <LightboxImage
                        src={formats[format].image}
                        alt={formats[format].alt}
                        caption={`Outdoor · ${formats[format].label}`}
                        triggerClassName="image-lightbox-trigger--fill"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>

                <div className="indoor-formats__copy">
                  <div
                    className="indoor-formats__tabs"
                    role="tablist"
                    aria-label="Formatos Outdoor"
                  >
                    {(Object.keys(formats) as OutdoorFormat[]).map((format) => (
                      <button
                        className={activeFormat === format ? 'is-active' : undefined}
                        id={`outdoor-format-${format}`}
                        key={format}
                        type="button"
                        role="tab"
                        aria-controls="outdoor-format-panel"
                        aria-selected={activeFormat === format}
                        onClick={() => setActiveFormat(format)}
                      >
                        {formats[format].label}
                      </button>
                    ))}
                  </div>

                  <div className="indoor-formats__copy-layers">
                    {(Object.keys(formats) as OutdoorFormat[]).map((format) => (
                      <div
                        className="indoor-formats__copy-layer"
                        data-outdoor-format-layer={format}
                        aria-hidden={activeFormat !== format}
                        key={format}
                      >
                        <span className="outdoor-formats__index">
                          {formats[format].index} / 03
                        </span>
                        <h3>{formats[format].title}</h3>
                        <p>{formats[format].description}</p>
                        <ul aria-label={`Incluye ${formats[format].label}`}>
                          {formats[format].products.map((product) => (
                            <li key={product}>{product}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="indoor-cta outdoor-cta outdoor-reveal"
            aria-labelledby="outdoor-cta-title"
          >
            <div>
              <h2 id="outdoor-cta-title">
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

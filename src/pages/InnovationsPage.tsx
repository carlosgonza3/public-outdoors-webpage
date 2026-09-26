import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CollectionPage } from './CollectionPage'
import { ContactCard } from '../components/ContactCard'
import { LightboxImage } from '../components/ImageLightbox'
import { projectCollections } from '../data/projects'
import { prefersReducedMotion } from '../animation/motion'
import { gsap, useGSAP } from '../animation/gsap'

interface InnovationsPageProps {
  modal?: boolean
}

const innovationsCollection = projectCollections.find(
  ({ id }) => id === 'innovations',
)!

const ideaRecommendations = [
  'un mupi en una experiencia interactiva para presentar un producto',
  'una valla digital en una campaña que cambie según la hora del día',
  'una parada de bus en un espacio de marca con sombra y carga para el celular',
]

export function InnovationsPage({ modal = false }: InnovationsPageProps) {
  const [idea, setIdea] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const [ideaError, setIdeaError] = useState(false)
  const [recommendationIndex, setRecommendationIndex] = useState(0)
  const [recommendationText, setRecommendationText] = useState('')
  const [ideaHovered, setIdeaHovered] = useState(false)
  const [ideaFocused, setIdeaFocused] = useState(false)
  const ideaForm = useRef<HTMLFormElement>(null)
  const recommendationTimeline = useRef<gsap.core.Timeline | null>(null)
  const project = innovationsCollection.projects[0]

  useGSAP(
    (_, contextSafe) => {
      const recommendation = ideaRecommendations[recommendationIndex]

      if (idea || prefersReducedMotion()) {
        setRecommendationText(recommendation)
        return
      }

      const typewriter = { characters: 0 }
      const renderRecommendation = contextSafe!(() => {
        setRecommendationText(
          recommendation.slice(0, Math.round(typewriter.characters)),
        )
      })
      const showNextRecommendation = contextSafe!(() => {
        setRecommendationIndex(
          (current) => (current + 1) % ideaRecommendations.length,
        )
      })

      setRecommendationText('')
      recommendationTimeline.current = gsap
        .timeline({ onComplete: showNextRecommendation })
        .to(typewriter, {
          characters: recommendation.length,
          duration: Math.min(3.2, Math.max(1.8, recommendation.length * 0.035)),
          ease: 'none',
          onUpdate: renderRecommendation,
          snap: { characters: 1 },
        })
        .to({}, { duration: 7 })

      return () => {
        recommendationTimeline.current = null
      }
    },
    {
      scope: ideaForm,
      dependencies: [idea, recommendationIndex],
      revertOnUpdate: true,
    },
  )

  useEffect(() => {
    recommendationTimeline.current?.paused(ideaHovered || ideaFocused)
  }, [ideaFocused, ideaHovered])

  const prepareIdeaEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = idea.trim()

    if (!message) {
      setIdeaError(true)
      return
    }

    const subject = encodeURIComponent('Nueva idea para innovar con Public')
    const body = encodeURIComponent(
      `Hola Public,\n\nTengo una idea que me gustaría explorar con ustedes:\n\n${message}\n\nMe gustaría conversar sobre cómo podríamos hacerla realidad.`,
    )

    window.location.href = `mailto:marketing@publicsv.net?subject=${subject}&body=${body}`
  }

  return (
    <>
      <CollectionPage
        collectionId="innovations"
        label={innovationsCollection.label}
        modal={modal}
      >
        <div className="innovations-page">
          <header className="collection-page__header innovations-hero">
            <div className="collection-page__intro innovations-hero__intro">
              <h1 aria-label={innovationsCollection.label}>
                <span className="collection-page__title-line">
                  <span>{innovationsCollection.label}</span>
                </span>
              </h1>
              <p>
                Tecnología, creatividad y producción para ideas que todavía no
                tienen formato.
              </p>
            </div>

            <div className="innovations-hero__statement">
              <h2>
                Si todavía no existe,
                <br />
                lo creamos juntos.
              </h2>
              <p>
                Trae una intuición, un reto o una idea imposible. Nosotros
                ponemos el espacio, la experiencia y la manera de hacerla
                visible.
              </p>
            </div>
          </header>

          <section
            className="collection-page__project innovations-proof"
            aria-labelledby="innovations-proof-title"
          >
            <div className="innovations-proof__media">
              <LightboxImage
                src={project.image!}
                alt={project.alt ?? project.title}
                caption="Innovations · Una idea hecha visible"
                triggerClassName="image-lightbox-trigger--fill"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="innovations-proof__caption">
              <div className="innovations-proof__message">
                <h2 id="innovations-proof-title">
                  Cada innovación empieza con una conversación.
                </h2>
                <p>
                  Cuéntanos qué quieres transformar, activar o hacer visible.
                  Puede ser una idea apenas empezando o un reto que todavía no
                  tiene solución.
                </p>
              </div>
            </div>
          </section>

          <section
            className="innovations-invite"
            aria-label="Comparte tu idea"
          >
            <form
              ref={ideaForm}
              className="innovations-idea"
              onSubmit={prepareIdeaEmail}
              onMouseEnter={() => setIdeaHovered(true)}
              onMouseLeave={() => setIdeaHovered(false)}
              onFocusCapture={() => setIdeaFocused(true)}
              onBlurCapture={() => setIdeaFocused(false)}
            >
              <div className="innovations-idea__label-row">
                <label htmlFor="innovation-idea">Quiero convertir…</label>
              </div>
              <textarea
                id="innovation-idea"
                name="idea"
                rows={2}
                value={idea}
                placeholder={recommendationText}
                aria-describedby={ideaError ? 'innovation-idea-error' : undefined}
                aria-invalid={ideaError || undefined}
                onChange={(event) => {
                  setIdea(event.target.value)
                  if (ideaError) setIdeaError(false)
                }}
              />
              {ideaError && (
                <p className="innovations-idea__error" id="innovation-idea-error">
                  Escribe tu idea en una frase para preparar el correo.
                </p>
              )}

              <div className="innovations-idea__actions">
                <button className="innovations-idea__submit" type="submit">
                  Preparar correo <span aria-hidden="true">↗</span>
                </button>
                <button
                  className="innovations-idea__contact"
                  type="button"
                  onClick={() => setContactOpen(true)}
                >
                  Ver formas de contacto
                </button>
              </div>
            </form>
          </section>
        </div>
      </CollectionPage>

      {contactOpen && <ContactCard onClose={() => setContactOpen(false)} />}
    </>
  )
}

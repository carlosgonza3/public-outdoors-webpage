import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import {
  projectCollections,
  type ProjectCollection,
} from '../data/projects'

type CollectionId = ProjectCollection['id']

interface CollectionPageProps {
  collectionId: CollectionId
  modal?: boolean
}

const collectionCopy: Record<CollectionId, string> = {
  indoor:
    'Presencia estratégica en espacios donde las personas esperan, compran y se conectan.',
  outdoor:
    'Formatos de alto impacto que convierten la ciudad y sus recorridos en oportunidades.',
  innovations:
    'Nuevas tecnologías y experiencias que amplifican la relación entre marcas y audiencias.',
}

export function CollectionPage({
  collectionId,
  modal = false,
}: CollectionPageProps) {
  const page = useRef<HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const collection = projectCollections.find(({ id }) => id === collectionId)!

  useEffect(() => {
    if (modal) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [collectionId, modal])

  useEffect(() => {
    if (!modal) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate(-1)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [modal, navigate])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline()

      timeline
        .from('.collection-page__back', {
          y: -12,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power3.out',
        })
        .from(
          '.collection-page__title-line > span',
          {
            yPercent: 110,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power4.out',
          },
          0.06,
        )
        .from(
          '.collection-page__intro p',
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power3.out',
          },
          0.24,
        )
        .from(
          '.collection-page__project',
          {
            y: 48,
            autoAlpha: 0,
            scale: 0.97,
            duration: 0.72,
            stagger: 0.1,
            ease: 'power4.out',
          },
          0.34,
        )

      return () => timeline.kill()
    },
    { scope: page, dependencies: [collectionId] },
  )

  const Root = modal ? 'section' : 'main'

  const pageContent = (
    <Root
      className={`collection-page collection-page--${collection.id}`}
      ref={page}
    >
      <header className="collection-page__header">
        <button
          className="collection-page__back"
          type="button"
          onClick={() => {
            if (modal || location.state?.backgroundLocation) {
              navigate(-1)
              return
            }

            navigate('/')
          }}
        >
          <span aria-hidden="true">←</span>
          Volver
        </button>

        <div className="collection-page__intro">
          <p>{collectionCopy[collection.id]}</p>
          <h1 aria-label={collection.label}>
            <span className="collection-page__title-line">
              <span>{collection.label}</span>
            </span>
          </h1>
        </div>
      </header>

      <section
        className="collection-page__projects"
        aria-label={`Proyectos ${collection.label}`}
      >
        {collection.projects.map((project, index) => (
          <article className="collection-page__project" key={project.id}>
            <div
              className={`collection-page__visual ${
                project.image
                  ? 'collection-page__visual--image'
                  : `collection-page__visual--${project.tone}`
              }`}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.alt ?? ''}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : (
                <span>{project.id}</span>
              )}
            </div>
            <div className="collection-page__project-meta">
              <span>{project.id}</span>
              <h2>{project.title}</h2>
            </div>
          </article>
        ))}
      </section>
    </Root>
  )

  if (!modal) return pageContent

  return (
    <div
      className="route-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Proyectos ${collection.label}`}
    >
      <button
        className="route-modal__backdrop"
        type="button"
        aria-label="Cerrar"
        onClick={() => navigate(-1)}
      />
      <div className="route-modal__panel">{pageContent}</div>
    </div>
  )
}

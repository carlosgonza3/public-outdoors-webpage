import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { isMobileExperience } from '../animation/mobile'
import { setPageTone } from '../animation/pageTone'
import { ProjectCard } from '../components/ProjectCard'
import {
  projectCollections,
  type ProjectCollection,
} from '../data/projects'

export function GalleryScene() {
  const section = useRef<HTMLElement>(null)
  const carouselRefs = useRef<
    Partial<Record<ProjectCollection['id'], HTMLDivElement>>
  >({})
  const [activeSlides, setActiveSlides] = useState<
    Record<ProjectCollection['id'], number>
  >({
    indoor: 0,
    outdoor: 0,
    innovations: 0,
  })
  const location = useLocation()
  const navigate = useNavigate()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const mobile = isMobileExperience()
      const heading = section.current?.querySelector<HTMLElement>('.grid-heading')
      const headingLines = heading
        ? gsap.utils.toArray<HTMLElement>('.grid-heading__line > span', heading)
        : []
      const headingBottom = heading?.querySelector<HTMLElement>('.grid-heading__bottom')
      const headingSignal = heading?.querySelector<HTMLElement>('.grid-heading__signal')
      const headingSignals = heading
        ? gsap.utils.toArray<HTMLElement>('.grid-heading__signal i', heading)
        : []
      const collections = gsap.utils.toArray<HTMLElement>('.project-collection')

      if (heading && headingBottom && headingSignal) {
        gsap.set(headingSignal, { autoAlpha: 1 })
        gsap.set(headingSignals, { y: 0, scale: 0.74, autoAlpha: 0.42 })

        const typingTimeline = gsap.timeline({
          paused: true,
          repeat: -1,
          repeatDelay: 0.16,
        })

        headingSignals.forEach((dot, index) => {
          const start = index * 0.18

          typingTimeline
            .to(dot, {
              y: -18,
              scale: 1.08,
              autoAlpha: 1,
              duration: 0.28,
              ease: 'power2.out',
            }, start)
            .to(dot, {
              y: 0,
              scale: 0.74,
              autoAlpha: 0.42,
              duration: 0.42,
              ease: 'power2.inOut',
            }, start + 0.22)
        })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: heading,
              start: 'top 92%',
              end: 'bottom 68%',
              toggleActions: mobile
                ? 'play none none none'
                : 'play reverse play reverse',
              once: mobile,
              onEnter: () => {
                setPageTone('#171717', true)
                typingTimeline.play()
              },
              onEnterBack: () => {
                setPageTone('#171717', true)
                typingTimeline.play()
              },
              onLeave: () => typingTimeline.pause(),
              onLeaveBack: () => {
                setPageTone('#07080b', true)
                typingTimeline.pause()
              },
            },
          })
          .from(headingLines, {
            yPercent: 110,
            rotation: 1.5,
            duration: 0.68,
            stagger: 0.08,
            ease: 'power4.out',
          })
          .from(headingBottom, {
            y: 14,
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, 0.22)
          .from(headingSignal, {
            y: 18,
            scale: 0.94,
            duration: 0.46,
            ease: 'power3.out',
          }, 0.16)
      }

      collections.forEach((collection) => {
        const label = collection.querySelector<HTMLElement>('[data-collection-label]')
        const title = label?.querySelector<HTMLElement>('.collection-heading__title')
        const details = label?.querySelector<HTMLElement>('.collection-heading__details')
        const actions = label?.querySelector<HTMLElement>(
          '.collection-heading__actions',
        )

        if (!title || !details || !actions) return

        gsap
          .timeline({
            scrollTrigger: {
              trigger: collection,
              start: 'top 76%',
              end: 'top 28%',
              toggleActions: mobile
                ? 'play none none none'
                : 'play none none reverse',
              once: mobile,
            },
          })
          .from(title, {
            yPercent: 80,
            autoAlpha: 0,
            duration: 0.58,
            ease: 'power4.out',
          })
          .from(details, {
            y: 12,
            autoAlpha: 0,
            duration: 0.36,
            ease: 'power3.out',
          }, 0.18)
          .from(actions, {
            y: 8,
            autoAlpha: 0,
            duration: 0.3,
            ease: 'power3.out',
          }, 0.28)
      })
    },
    { scope: section },
  )

  const openCollection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    collectionId: string,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    const source = event.currentTarget.closest<HTMLElement>(
      '.collection-heading__cta',
    )
    const sourceBounds = source?.getBoundingClientRect()

    navigate(`/${collectionId}`, {
      state: {
        backgroundLocation: location,
        backgroundScrollY: window.scrollY,
        transitionOrigin: sourceBounds
          ? {
              x: sourceBounds.x,
              y: sourceBounds.y,
              width: sourceBounds.width,
              height: sourceBounds.height,
            }
          : undefined,
      },
    })
  }

  const renderHeadingActions = (
    collection: (typeof projectCollections)[number],
  ) => {
    return (
      <div className="collection-heading__actions">
        <Link
          className="collection-heading__cta"
          to={`/${collection.id}`}
          state={{ backgroundLocation: location }}
          onClick={(event) => openCollection(event, collection.id)}
          aria-label={`Ver más proyectos ${collection.label}`}
        >
          <strong>Ver más</strong>
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M10 32h42M36 16l16 16-16 16" />
          </svg>
        </Link>

        {collection.id !== 'innovations' && (
          <Link
            className="collection-heading__availability"
            to="/disponibilidad"
            aria-label={`Ver disponibilidad de medios ${collection.label}`}
          >
            Ver disponibilidad
          </Link>
        )}
      </div>
    )
  }

  const updateActiveSlide = (
    collectionId: ProjectCollection['id'],
    carousel: HTMLDivElement,
  ) => {
    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>('.project-card'),
    )
    if (cards.length < 2) return

    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(cardCenter - carouselCenter)

      if (distance < closestDistance) {
        closestIndex = index
        closestDistance = distance
      }
    })

    setActiveSlides((current) =>
      current[collectionId] === closestIndex
        ? current
        : { ...current, [collectionId]: closestIndex },
    )
  }

  const goToSlide = (
    collectionId: ProjectCollection['id'],
    slideIndex: number,
  ) => {
    const carousel = carouselRefs.current[collectionId]
    const card = carousel?.querySelectorAll<HTMLElement>('.project-card')[
      slideIndex
    ]
    if (!carousel || !card) return

    carousel.scrollTo({
      left: card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section className="project-grid-section" ref={section}>
      <header className="grid-heading" data-scene-id="gallery-intro">
        <h2 aria-label="Donde las ideas se vuelven visibles.">
          <span className="grid-heading__line">
            <span>Donde tus ideas</span>
          </span>
          <span className="grid-heading__line grid-heading__line--soft">
            <span>se vuelven visibles.</span>
          </span>
        </h2>

        <div className="grid-heading__signal" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="grid-heading__bottom">
          <p>Indoor · Outdoor · Innovations</p>
          <span>Desliza y explora nuestros medios</span>
        </div>
      </header>

      <div className="project-collections">
        {projectCollections.map((collection) => (
          <section
            className={`project-collection collection--${collection.id}`}
            data-scene-id={collection.id}
            id={`${collection.id}-gallery`}
            key={collection.id}
          >
            <div className="project-collection__stage">
              <header className="collection-heading" data-collection-label>
                <div className="collection-heading__intro">
                  <div className="collection-heading__title-mask">
                    <h2 className="collection-heading__title">{collection.label}</h2>
                  </div>
                  <div className="collection-heading__details">
                    <p>{collection.description}</p>
                  </div>
                  {renderHeadingActions(collection)}
                </div>
              </header>

              <div
                className="collection-carousel"
                ref={(node) => {
                  carouselRefs.current[collection.id] = node ?? undefined
                }}
                onScroll={(event) =>
                  updateActiveSlide(collection.id, event.currentTarget)
                }
              >
                <div
                  className={`collection-carousel__track ${collection.id}-grid${
                    collection.projects.length === 1 ? ' is-single-project' : ''
                  }`}
                >
                  {collection.projects.map((project, index) => (
                    <ProjectCard
                      project={project}
                      collectionId={collection.id}
                      index={index}
                      key={project.id}
                    />
                  ))}
                </div>
              </div>

              {collection.projects.length > 1 && (
                <div
                  className="collection-carousel__pagination"
                  role="group"
                  aria-label={`Diapositivas de ${collection.label}`}
                >
                  {collection.projects.map((project, index) => (
                    <button
                      className={
                        activeSlides[collection.id] === index
                          ? 'is-active'
                          : undefined
                      }
                      type="button"
                      aria-label={`Ir a imagen ${index + 1} de ${collection.projects.length}`}
                      aria-current={
                        activeSlides[collection.id] === index
                          ? 'true'
                          : undefined
                      }
                      onClick={() => goToSlide(collection.id, index)}
                      key={project.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

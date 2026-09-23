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

type GallerySceneProps = {
  onContact: () => void
}

export function GalleryScene({ onContact }: GallerySceneProps) {
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

      collections.forEach((collection, collectionIndex) => {
        const stage = collection.querySelector<HTMLElement>('.project-collection__stage')
        const label = collection.querySelector<HTMLElement>('[data-collection-label]')
        const title = label?.querySelector<HTMLElement>('.collection-heading__title')
        const details = label?.querySelector<HTMLElement>('.collection-heading__details')
        const viewport = collection.querySelector<HTMLElement>('.collection-carousel')
        const track = collection.querySelector<HTMLElement>('.collection-carousel__track')
        const cards = gsap.utils.toArray<HTMLElement>('.project-card', collection)
        const carouselCta = collection.querySelector<HTMLElement>(
          '.collection-carousel__cta',
        )
        const carouselItems = carouselCta ? [...cards, carouselCta] : cards
        const visuals = cards
          .map((card) => card.querySelector<HTMLElement>('.card-visual'))
          .filter((visual): visual is HTMLElement => Boolean(visual))

        if (!stage || !title || !details || !viewport || !track) return

        gsap
          .timeline({
            scrollTrigger: {
              trigger: collection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: mobile ? 0.3 : 0.48,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            stage,
            {
              autoAlpha: 0,
              y: mobile ? 20 : 34,
              scale: mobile ? 1 : 0.992,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.24,
              ease: 'power2.out',
            },
          )
          .to(stage, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
          })
          .to(stage, {
            autoAlpha: 0,
            y: mobile ? -16 : -28,
            scale: mobile ? 1 : 0.994,
            duration: 0.26,
            ease: 'power2.inOut',
          })

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
          .from(visuals, {
            y: 32,
            scale: 0.985,
            autoAlpha: 0,
            duration: 0.52,
            stagger: 0.05,
            ease: 'power4.out',
          }, 0.1)

        if (mobile) return

        const ctaAction = carouselCta?.querySelector<HTMLElement>(
          '.collection-carousel__cta-action',
        )
        const pulseCta = () => {
          if (!ctaAction) return

          gsap.killTweensOf(ctaAction)
          gsap
            .timeline()
            .fromTo(
              ctaAction,
              { scale: 0.94, autoAlpha: 0.62 },
              {
                scale: 1.06,
                autoAlpha: 1,
                duration: 0.18,
                ease: 'back.out(2)',
              },
            )
            .to(ctaAction, {
              scale: 1,
              autoAlpha: 1,
              duration: 0.2,
              ease: 'power2.out',
            })
        }

        if (collection.dataset.sceneId === 'innovations' && cards[0]) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: collection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.46,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              cards[0],
              { scale: 0.975 },
              {
                scale: 1.015,
                duration: 0.62,
                ease: 'power2.inOut',
              },
            )
            .to(cards[0], {
              scale: 1,
              duration: 0.38,
              ease: 'power2.out',
            })

          return
        }

        const horizontalPosition = (atEnd: boolean) => {
          const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth)
          const edge = Math.min(viewport.clientWidth * 0.035, 48)
          const forward = collectionIndex % 2 === 0

          if (forward) return atEnd ? -(overflow + edge) : edge
          return atEnd ? edge : -(overflow + edge)
        }

        const edgeFadeEase = gsap.parseEase('power2.inOut')

        const updateCardPresence = () => {
          const viewportBounds = viewport.getBoundingClientRect()
          const fadeZone = Math.min(viewportBounds.width * 0.22, 260)

          carouselItems.forEach((card) => {
            const cardBounds = card.getBoundingClientRect()
            const leftEdgePresence = gsap.utils.clamp(
              0,
              1,
              (cardBounds.right - viewportBounds.left) / fadeZone,
            )
            const rightEdgePresence = gsap.utils.clamp(
              0,
              1,
              (viewportBounds.right - cardBounds.left) / fadeZone,
            )
            const edgePresence = Math.min(
              leftEdgePresence,
              rightEdgePresence,
            )
            const opacity = edgeFadeEase(edgePresence)

            gsap.set(card, {
              opacity,
              scale: 0.96 + opacity * 0.04,
              transformOrigin: 'center center',
            })
          })
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: collection,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.46,
              invalidateOnRefresh: true,
              onRefresh: updateCardPresence,
              onUpdate: updateCardPresence,
              onSnapComplete: pulseCta,
              snap: {
                snapTo: (value) =>
                  value > 0.58 && value < 0.9 ? 0.76 : value,
                delay: 0.05,
                duration: { min: 0.12, max: 0.22 },
                ease: 'power2.out',
              },
            },
          })
          .fromTo(
            track,
            { x: () => horizontalPosition(false) },
            {
              x: () => horizontalPosition(true),
              duration: 0.76,
              ease: 'power1.inOut',
            },
          )
          .to(track, {
            x: () => horizontalPosition(true),
            duration: 0.24,
            ease: 'none',
          })
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
      '.collection-carousel__cta, .collection-heading__cta',
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

  const renderCollectionCta = (
    collection: (typeof projectCollections)[number],
  ) => {
    const isContactCta = collection.id === 'innovations'
    const action = (
      <span className="collection-carousel__cta-action">
        {collection.id === 'outdoor' && (
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M10 32h42M36 16l16 16-16 16" />
          </svg>
        )}
        <strong>
          {isContactCta
            ? 'Contáctanos'
            : collection.id === 'outdoor'
              ? 'Explora'
              : 'Ver más'}
        </strong>
        {collection.id !== 'outdoor' && (
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M10 32h42M36 16l16 16-16 16" />
          </svg>
        )}
      </span>
    )

    return (
      <article className="collection-carousel__cta">
        {isContactCta ? (
          <button
            className="collection-carousel__cta-link"
            type="button"
            onClick={onContact}
            aria-label="Contáctanos sobre Innovations"
          >
            {action}
          </button>
        ) : (
          <Link
        className="collection-carousel__cta-link"
        to={`/${collection.id}`}
        state={{ backgroundLocation: location }}
        onClick={(event) => openCollection(event, collection.id)}
        aria-label={`Ver más proyectos ${collection.label}`}
      >
            {action}
          </Link>
        )}
      </article>
    )
  }

  const renderHeadingCta = (
    collection: (typeof projectCollections)[number],
  ) => {
    const isContactCta = collection.id === 'innovations'
    const label = isContactCta
      ? 'Contáctanos'
      : collection.id === 'outdoor'
        ? 'Explora'
        : 'Ver más'
    const content = (
      <>
        <strong>{label}</strong>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M10 32h42M36 16l16 16-16 16" />
        </svg>
      </>
    )

    return isContactCta ? (
      <button
        className="collection-heading__cta"
        type="button"
        onClick={onContact}
        aria-label="Contáctanos sobre Innovations"
      >
        {content}
      </button>
    ) : (
      <Link
        className="collection-heading__cta"
        to={`/${collection.id}`}
        state={{ backgroundLocation: location }}
        onClick={(event) => openCollection(event, collection.id)}
        aria-label={`Ver más proyectos ${collection.label}`}
      >
        {content}
      </Link>
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
          <span>Desliza para explorar</span>
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
                  {renderHeadingCta(collection)}
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
                  {collection.id === 'outdoor' && renderCollectionCta(collection)}
                  {collection.projects.map((project, index) => (
                    <ProjectCard
                      project={project}
                      collectionId={collection.id}
                      index={index}
                      key={project.id}
                    />
                  ))}
                  {collection.id !== 'outdoor' && renderCollectionCta(collection)}
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

import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { isMobileExperience } from '../animation/mobile'
import { setPageTone } from '../animation/pageTone'
import { ProjectCard } from '../components/ProjectCard'
import { projectCollections } from '../data/projects'

export function GalleryScene() {
  const section = useRef<HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const mobile = isMobileExperience()

      const heading = section.current?.querySelector<HTMLElement>('.grid-heading')
      const headingTop = heading?.querySelector<HTMLElement>('.grid-heading__top')
      const headingLines = heading
        ? gsap.utils.toArray<HTMLElement>('.grid-heading__line > span', heading)
        : []
      const headingBottom = heading?.querySelector<HTMLElement>('.grid-heading__bottom')
      const headingSignal =
        heading?.querySelector<HTMLElement>('.grid-heading__signal')
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
            .to(
              dot,
              {
                y: -18,
                scale: 1.08,
                autoAlpha: 1,
                duration: 0.28,
                ease: 'power2.out',
              },
              start,
            )
            .to(
              dot,
              {
                y: 0,
                scale: 0.74,
                autoAlpha: 0.42,
                duration: 0.42,
                ease: 'power2.inOut',
              },
              start + 0.22,
            )
        })

        const headingTimeline = gsap.timeline({
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

        if (headingTop) {
          headingTimeline.from(headingTop, {
            y: 12,
            autoAlpha: 0,
            duration: 0.36,
            ease: 'power3.out',
          })
        }

        headingTimeline
          .from(
            headingLines,
            {
              yPercent: 110,
              rotation: 1.5,
              duration: 0.68,
              stagger: 0.08,
              ease: 'power4.out',
            },
            headingTop ? 0.06 : 0,
          )
          .from(
            headingBottom,
            {
              y: 14,
              autoAlpha: 0,
              duration: 0.4,
              ease: 'power3.out',
            },
            headingTop ? 0.28 : 0.22,
          )
          .from(
            headingSignal,
            {
              y: 18,
              scale: 0.94,
              duration: 0.46,
              ease: 'power3.out',
            },
            headingTop ? 0.22 : 0.16,
          )
      }

      collections.forEach((collection) => {
        const label = collection.querySelector<HTMLElement>('[data-collection-label]')
        const eyebrow = label?.querySelector('.eyebrow')
        const line = label?.querySelector('.collection-heading__line')
        const cards = gsap.utils.shuffle(
          gsap.utils.toArray<HTMLElement>('.project-card', collection),
        )
        const visuals = cards
          .map((card) => card.querySelector<HTMLElement>('.card-visual'))
          .filter((visual): visual is HTMLElement => Boolean(visual))
        const lineOrigin =
          collection.dataset.sceneId === 'innovations' ? 'right center' : 'left center'

        if (!eyebrow || !line) return

        const collectionTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: collection,
              start: 'top 82%',
              end: 'bottom 58%',
              toggleActions: mobile
                ? 'play none none none'
                : 'play reverse play reverse',
              once: mobile,
            },
          })
          .from(eyebrow, {
            y: mobile ? 8 : 12,
            autoAlpha: 0,
            duration: 0.34,
            ease: 'power3.out',
          })
          .from(
            line,
            {
              scaleX: 0,
              autoAlpha: 0.2,
              transformOrigin: lineOrigin,
              duration: 0.5,
              ease: 'power3.out',
            },
            0,
          )
          .from(
            cards,
            {
              y: 44,
              scale: mobile ? 1 : 0.965,
              autoAlpha: 0,
              rotation: mobile
                ? 0
                : (index) => [-1.25, 0.8, -0.55][index % 3],
              duration: mobile ? 0.48 : 0.58,
              stagger: mobile ? 0.045 : 0.06,
              ease: 'power4.out',
            },
            0.05,
          )

        if (!mobile) {
          collectionTimeline.from(
            visuals,
            {
              scale: 1.045,
              duration: 0.78,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.05,
          )
        }
      })
    },
    { scope: section },
  )

  return (
    <section className="project-grid-section" ref={section}>
      <header
        className="grid-heading"
        data-scene-id="gallery-intro"
      >

        <h2 aria-label="Donde las ideas se vuelven visibles.">
            <span className="grid-heading__line">
                <span>Donde las ideas</span>
            </span>
            <span className="grid-heading__line grid-heading__line--soft">
                <span > se vuelven visibles.</span>
            </span>
        </h2>

        <div className="grid-heading__signal" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="grid-heading__bottom">
          <p>Indoor · Outdoor · Innovations</p>
          <span>Scroll to explore</span>
        </div>
      </header>

      <div className="project-collections">
        {projectCollections.map((collection) => (
          <section
            className={`project-collection collection--${collection.id}`}
            data-scene-id={collection.id}
            id={collection.id === 'indoor' ? 'indoor-gallery' : undefined}
            key={collection.id}
          >
            <header className={`${collection.id}-heading`} data-collection-label>
              <p className="eyebrow">
                <Link
                  className="collection-heading__link"
                  to={`/${collection.id}`}
                  state={{ backgroundLocation: location }}
                  onClick={(event) => {
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
                    navigate(`/${collection.id}`, {
                      state: {
                        backgroundLocation: location,
                        backgroundScrollY: window.scrollY,
                      },
                    })
                  }}
                  aria-label={`Ver todos los proyectos ${collection.label}`}
                >
                  <span className="collection-heading__title">
                    {collection.label}
                  </span>
                  <svg
                    className="collection-heading__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Link>
              </p>
              <span className="collection-heading__line" />
            </header>
            <div
              className={`${collection.id}-grid${
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
          </section>
        ))}
      </div>
    </section>
  )
}

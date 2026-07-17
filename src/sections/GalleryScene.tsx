import { useRef } from 'react'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { setPageTone } from '../animation/pageTone'
import { ProjectCard } from '../components/ProjectCard'
import { projectCollections } from '../data/projects'

export function GalleryScene() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

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
            toggleActions: 'play reverse play reverse',
            onEnter: () => {
              setPageTone('#171717')
              typingTimeline.play()
            },
            onEnterBack: () => {
              setPageTone('#171717')
              typingTimeline.play()
            },
            onLeave: () => typingTimeline.pause(),
            onLeaveBack: () => {
              setPageTone('#07080b')
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
        const line = label?.querySelector('span')
        const cards = gsap.utils.shuffle(
          gsap.utils.toArray<HTMLElement>('.project-card', collection),
        )
        const visuals = cards
          .map((card) => card.querySelector<HTMLElement>('.card-visual'))
          .filter((visual): visual is HTMLElement => Boolean(visual))
        const lineOrigin =
          collection.dataset.sceneId === 'innovations' ? 'right center' : 'left center'

        if (!eyebrow || !line) return

        gsap
          .timeline({
            scrollTrigger: {
              trigger: collection,
              start: 'top 82%',
              end: 'bottom 58%',
              toggleActions: 'play reverse play reverse',
            },
          })
          .from(eyebrow, {
            y: 12,
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
              scale: 0.965,
              autoAlpha: 0,
              rotation: (index) => [-1.25, 0.8, -0.55][index % 3],
              duration: 0.58,
              stagger: 0.06,
              ease: 'power4.out',
            },
            0.05,
          )
          .from(
            visuals,
            {
              scale: 1.045,
              duration: 0.78,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.05,
          )
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
            key={collection.id}
          >
            <header className={`${collection.id}-heading`} data-collection-label>
              <p className="eyebrow">{collection.label}</p>
              <span />
            </header>
            <div className={`${collection.id}-grid`}>
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

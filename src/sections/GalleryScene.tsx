import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
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
      const mergeLayer =
        section.current?.querySelector<HTMLElement>('.gallery-merge')
      const mergeDroplets = mergeLayer
        ? gsap.utils.toArray<HTMLElement>('.gallery-merge__droplet', mergeLayer)
        : []
      const mergePreviews = mergeLayer
        ? gsap.utils.toArray<HTMLElement>('.gallery-merge__preview', mergeLayer)
        : []
      const firstCollection =
        section.current?.querySelector<HTMLElement>('.collection--indoor')
      const mergeTargets = firstCollection
        ? gsap.utils
            .toArray<HTMLElement>('.card-visual', firstCollection)
            .slice(0, 3)
        : []
      const collections = gsap.utils.toArray<HTMLElement>('.project-collection')
      let mergeMedia: ReturnType<typeof gsap.matchMedia> | undefined

      if (heading && headingBottom && headingSignal) {
        let mergeIsActive = false

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
              setPageTone('#171717', true)
              typingTimeline.play()
            },
            onEnterBack: () => {
              setPageTone('#171717', true)
              if (!mergeIsActive) typingTimeline.play()
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

        if (
          mergeLayer &&
          mergeDroplets.length === 3 &&
          mergePreviews.length === 3 &&
          mergeTargets.length === 3
        ) {
          const pointInLayer = (
            element: HTMLElement,
            xRatio: number,
            yRatio: number,
          ) => {
            const elementBounds = element.getBoundingClientRect()
            const layerBounds = mergeLayer.getBoundingClientRect()

            return {
              x:
                elementBounds.left -
                layerBounds.left +
                elementBounds.width * xRatio,
              y:
                elementBounds.top -
                layerBounds.top +
                elementBounds.height * yRatio,
            }
          }

          const boxInLayer = (element: HTMLElement) => {
            const elementBounds = element.getBoundingClientRect()
            const layerBounds = mergeLayer.getBoundingClientRect()

            return {
              x: elementBounds.left - layerBounds.left,
              y: elementBounds.top - layerBounds.top,
              width: elementBounds.width,
              height: elementBounds.height,
            }
          }

          const beginMerge = () => {
            mergeIsActive = true
            typingTimeline.pause(0)
            gsap.set(headingSignals, {
              y: 0,
              scale: 0.74,
              autoAlpha: 0,
            })
          }

          gsap.set(mergeDroplets, {
            xPercent: 0,
            yPercent: 0,
            autoAlpha: 0,
            transformOrigin: 'center center',
          })
          mergePreviews.forEach((preview, index) => {
            const targetImage =
              mergeTargets[index].querySelector<HTMLImageElement>('img')
            const targetStyles = getComputedStyle(mergeTargets[index])
            const imageStyles = targetImage
              ? getComputedStyle(targetImage)
              : undefined

            gsap.set(preview, {
              backgroundColor: targetStyles.backgroundColor,
              backgroundImage: targetImage
                ? `url("${targetImage.currentSrc || targetImage.src}")`
                : targetStyles.backgroundImage,
              backgroundPosition: imageStyles?.objectPosition || 'center center',
              autoAlpha: 0,
            })
          })

          const buildMergeTimeline = (compactLayout: boolean) => {
            const mergeTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: heading,
                start: 'bottom 72%',
                end: compactLayout ? '+=1580' : 'bottom 8%',
                scrub: compactLayout ? 0.58 : 0.72,
                invalidateOnRefresh: true,
                onEnter: beginMerge,
                onEnterBack: beginMerge,
                onLeaveBack: () => {
                  mergeIsActive = false
                  gsap.set(mergeDroplets, { autoAlpha: 0 })
                  gsap.set(headingSignals, {
                    y: 0,
                    scale: 0.74,
                    autoAlpha: 0.42,
                  })
                  typingTimeline.restart()
                },
              },
            })

            mergeDroplets.forEach((droplet, index) => {
              mergeTimeline.set(
                droplet,
                {
                  x: () =>
                    pointInLayer(headingSignals[index], 0.5, 0.5).x -
                    droplet.offsetWidth / 2,
                  y: () =>
                    pointInLayer(headingSignals[index], 0.5, 0.5).y -
                    droplet.offsetHeight / 2,
                  scale: 0.74,
                  autoAlpha: 0,
                },
                0,
              )
            })

            gsap.set(mergeTargets, {
              autoAlpha: 0,
            })

            mergeTimeline
              .to(
                mergeDroplets,
                {
                  autoAlpha: 0.94,
                  duration: 0.045,
                  ease: 'power2.out',
                },
                0,
              )

            if (compactLayout) {
              const impactTimes = [0.34, 0.67, 1]

              mergeDroplets.forEach((droplet, index) => {
                const impactAt = impactTimes[index]
                const preview = mergePreviews[index]
                const target = mergeTargets[index]

                mergeTimeline
                  .to(
                    droplet,
                    {
                      x: () =>
                        pointInLayer(target, 0.5, 0.16).x -
                        droplet.offsetWidth / 2,
                      y: () =>
                        pointInLayer(target, 0.5, 0.16).y -
                        droplet.offsetHeight / 2,
                      duration: impactAt - 0.12,
                      ease: 'power1.in',
                    },
                    0.08,
                  )
                  .to(
                    droplet,
                    {
                      scaleX: 0.64,
                      scaleY: 1.18,
                      rotation: [1.4, -1.1, 0.7][index],
                      duration: Math.max(impactAt - 0.15, 0.12),
                      ease: 'sine.in',
                    },
                    0.08,
                  )
                  .to(
                    droplet,
                    {
                      borderRadius: '48% 52% 47% 53% / 38% 38% 62% 62%',
                      duration: Math.max(impactAt - 0.14, 0.12),
                      ease: 'sine.inOut',
                    },
                    0.08,
                  )
                  .to(
                    preview,
                    {
                      autoAlpha: 1,
                      duration: 0.22,
                      ease: 'power2.inOut',
                    },
                    Math.max(0.1, impactAt - 0.28),
                  )
                  .to(
                    droplet,
                    {
                      x: () => boxInLayer(target).x,
                      y: () => boxInLayer(target).y,
                      width: () => boxInLayer(target).width,
                      height: () => boxInLayer(target).height,
                      scaleX: 1,
                      scaleY: 1,
                      rotation: 0,
                      borderRadius: () => getComputedStyle(target).borderRadius,
                      duration: 0.16,
                      ease: 'power4.inOut',
                    },
                    impactAt - 0.06,
                  )
                  .to(
                    target,
                    {
                      autoAlpha: 1,
                      duration: 0.055,
                      ease: 'none',
                    },
                    impactAt + 0.075,
                  )
                  .to(
                    droplet,
                    {
                      autoAlpha: 0,
                      duration: 0.055,
                      ease: 'none',
                    },
                    impactAt + 0.075,
                  )
                  .to(
                    target,
                    {
                      filter: 'brightness(1.06) saturate(1.03)',
                      duration: 0.08,
                      ease: 'power2.inOut',
                    },
                    impactAt + 0.05,
                  )
                  .to(
                    target,
                    {
                      filter: 'brightness(1) saturate(1)',
                      duration: 0.12,
                      ease: 'power2.out',
                    },
                    impactAt + 0.11,
                  )
              })

              return
            }

            mergeTimeline
              .to(
                mergeDroplets,
                {
                  x: (index, droplet) =>
                    pointInLayer(mergeTargets[index], 0.5, 0.16).x -
                    (droplet as HTMLElement).offsetWidth / 2,
                  y: (index, droplet) =>
                    pointInLayer(mergeTargets[index], 0.5, 0.16).y -
                    (droplet as HTMLElement).offsetHeight / 2,
                  scaleX: 0.64,
                  scaleY: 1.18,
                  rotation: (index) => [1.4, -1.1, 0.7][index],
                  borderRadius: '48% 52% 47% 53% / 38% 38% 62% 62%',
                  duration: 0.65,
                  stagger: 0.035,
                  ease: 'power2.in',
                },
                0.08,
              )
              .to(
                mergePreviews,
                {
                  autoAlpha: 1,
                  duration: 0.32,
                  stagger: 0.035,
                  ease: 'power2.inOut',
                },
                0.22,
              )
              .to(
                mergeDroplets,
                {
                  x: (index) => boxInLayer(mergeTargets[index]).x,
                  y: (index) => boxInLayer(mergeTargets[index]).y,
                  width: (index) => boxInLayer(mergeTargets[index]).width,
                  height: (index) => boxInLayer(mergeTargets[index]).height,
                  scaleX: 1,
                  scaleY: 1,
                  rotation: 0,
                  borderRadius: (index) =>
                    getComputedStyle(mergeTargets[index]).borderRadius,
                  duration: 0.27,
                  stagger: 0.035,
                  ease: 'power4.inOut',
                },
                0.69,
              )
              .to(
                mergeTargets,
                {
                  autoAlpha: 1,
                  duration: 0.055,
                  stagger: 0.035,
                  ease: 'none',
                },
                0.925,
              )
              .to(
                mergeDroplets,
                {
                  autoAlpha: 0,
                  duration: 0.055,
                  stagger: 0.035,
                  ease: 'none',
                },
                0.925,
              )
              .to(
                mergeTargets,
                {
                  filter: 'brightness(1.06) saturate(1.03)',
                  duration: 0.08,
                  stagger: 0.035,
                  ease: 'power2.inOut',
                },
                0.9,
              )
              .to(
                mergeTargets,
                {
                  filter: 'brightness(1) saturate(1)',
                  duration: 0.14,
                  stagger: 0.035,
                  ease: 'power2.out',
                },
                0.98,
              )
          }

          mergeMedia = gsap.matchMedia()
          mergeMedia.add('(min-width: 721px)', () => buildMergeTimeline(false))
          mergeMedia.add('(max-width: 720px)', () => buildMergeTimeline(true))
        }
      }

      collections.forEach((collection) => {
        const label = collection.querySelector<HTMLElement>('[data-collection-label]')
        const eyebrow = label?.querySelector('.eyebrow')
        const lines = label
          ? gsap.utils.toArray<HTMLElement>('.collection-heading__line', label)
          : []
        const cards = gsap.utils.shuffle(
          gsap.utils.toArray<HTMLElement>('.project-card', collection),
        )
        const visuals = cards
          .map((card) => card.querySelector<HTMLElement>('.card-visual'))
          .filter((visual): visual is HTMLElement => Boolean(visual))
        if (!eyebrow || lines.length === 0) return

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
            lines,
            {
              scaleX: 0,
              autoAlpha: 0.2,
              transformOrigin: (index) => {
                if (collection.dataset.sceneId === 'innovations') {
                  return 'right center'
                }

                if (collection.dataset.sceneId === 'outdoor' && index === 0) {
                  return 'right center'
                }

                return 'left center'
              },
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

      return () => mergeMedia?.revert()
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

      <div className="gallery-merge" aria-hidden="true">
        <i className="gallery-merge__droplet">
          <span className="gallery-merge__preview" />
        </i>
        <i className="gallery-merge__droplet">
          <span className="gallery-merge__preview" />
        </i>
        <i className="gallery-merge__droplet">
          <span className="gallery-merge__preview" />
        </i>
      </div>

      <div className="project-collections">
        {projectCollections.map((collection) => (
          <section
            className={`project-collection collection--${collection.id}`}
            data-scene-id={collection.id}
            key={collection.id}
          >
            <header className={`${collection.id}-heading`} data-collection-label>
              {collection.id === 'outdoor' && (
                <span className="collection-heading__line collection-heading__line--leading" />
              )}
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

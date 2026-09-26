import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../animation/gsap'
import { setPageTone } from '../animation/pageTone'

type TeamSceneProps = {
  onSurfaceChange?: (light: boolean) => void
}

type PortraitProps = {
  accent: string
  variant: number
}

// Placeholder content: keep this array as the single replacement point when
// the final portraits, names, roles, and biographies are available.
const teamMembers = [
  {
    name: 'Alex Rivera',
    role: 'Dirección general',
    description:
      'Conecta visión, estrategia y oportunidades para que cada proyecto tenga una dirección clara.',
    accent: '#ff4b43',
  },
  {
    name: 'Sofía Méndez',
    role: 'Estrategia y cuentas',
    description:
      'Convierte objetivos de marca en planes cercanos, medibles y pensados para cada audiencia.',
    accent: '#00a7e8',
  },
  {
    name: 'Mateo Cruz',
    role: 'Operaciones',
    description:
      'Coordina equipos, ubicaciones y tiempos para que las ideas lleguen a la calle con precisión.',
    accent: '#30c82f',
  },
  {
    name: 'Valeria Santos',
    role: 'Creatividad',
    description:
      'Da forma a experiencias visuales que hacen que las marcas se sientan vivas en el espacio público.',
    accent: '#ffb629',
  },
]

function PlaceholderPortrait({ accent, variant }: PortraitProps) {
  const faceShift = variant % 2 === 0 ? -8 : 9
  const tilt = variant % 2 === 0 ? -3 : 3

  return (
    <svg
      viewBox="0 0 720 900"
      role="img"
      aria-label="Retrato provisional"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="720" height="900" fill={accent} />
      <circle cx={110 + variant * 120} cy="126" r="210" fill="#f7f5ef" opacity=".18" />
      <circle cx={650 - variant * 72} cy="720" r="280" fill="#07110f" opacity=".12" />
      <g transform={`translate(${faceShift} 14) rotate(${tilt} 360 450)`}>
        <path
          d="M160 900c16-190 88-298 200-298s184 108 200 298H160Z"
          fill="#111814"
        />
        <path
          d="M300 550h120v116c-12 43-108 43-120 0V550Z"
          fill="#d8a37c"
        />
        <ellipse cx="360" cy="392" rx="142" ry="184" fill="#e9b68f" />
        <path
          d="M217 405c-17-151 40-239 149-239 105 0 163 71 148 214-39-31-74-75-94-127-51 83-117 128-203 152Z"
          fill="#101613"
        />
        <path d="M286 412c20 10 39 10 58 0" fill="none" stroke="#101613" strokeWidth="10" strokeLinecap="round" />
        <path d="M390 412c20 10 39 10 58 0" fill="none" stroke="#101613" strokeWidth="10" strokeLinecap="round" />
        <path d="M334 505c20 15 43 15 64 0" fill="none" stroke="#8e5141" strokeWidth="8" strokeLinecap="round" />
      </g>
      <path d="M36 52h150M36 52v150" fill="none" stroke="#f7f5ef" strokeWidth="3" opacity=".72" />
      <text x="42" y="842" fill="#f7f5ef" fontSize="18" fontWeight="700" letterSpacing="4">RETRATO PENDIENTE</text>
    </svg>
  )
}

export function TeamScene({ onSurfaceChange }: TeamSceneProps) {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = section.current
      if (!root) return

      const media = gsap.matchMedia()
      media.add({
        desktop: '(min-width: 901px)',
        mobile: '(max-width: 900px)',
        reducedMotion: '(prefers-reduced-motion: reduce)',
      }, (context) => {
        const { desktop, reducedMotion } = context.conditions!
        const profiles = gsap.utils.toArray<HTMLElement>('.team-profile', root)

        if (!reducedMotion && desktop) {
          const portraits = gsap.utils.toArray<HTMLElement>('.team-profile__portrait', root)
          const copies = gsap.utils.toArray<HTMLElement>('.team-profile__copy', root)
          const portraitStep = () => root.clientHeight * 0.68
          const horizontalStep = () => Math.min(root.clientWidth * 0.24, 340)
          const copyStep = () => Math.max(root.clientHeight * 0.28,
            ...copies.map((copy) => copy.offsetHeight + 40))
          const distance = (offset: number) => Math.min(Math.abs(offset), 3)
          const angle = (offset: number) => offset === 0 ? 0 : offset < 0 ? 11 : -11
          const wheelTilt = (offset: number) => offset === 0 ? 0 : offset < 0 ? -18 : 18
          const cardScale = (offset: number) => offset === 0 ? 1.12 : 0.77 - distance(offset) * 0.055
          const cardOpacity = (offset: number) => offset === 0 ? 1 : Math.max(0.14, 0.62 - distance(offset) * 0.18)
          const cardDepth = (offset: number) => offset === 0 ? 0 : -90 - distance(offset) * 55
          const copyOpacity = (offset: number) => offset === 0 ? 1 : Math.max(0.08, 0.28 - distance(offset) * 0.08)

          gsap.set(portraits, {
            xPercent: -50,
            y: (index) => index * portraitStep(),
            x: (index) => index * -horizontalStep(),
            rotation: (index) => angle(index),
            rotationX: (index) => wheelTilt(index),
            scale: (index) => cardScale(index),
            opacity: (index) => cardOpacity(index),
            z: (index) => cardDepth(index),
            transformPerspective: 1100,
            transformOrigin: '50% 50%',
            force3D: true,
          })
          gsap.set(copies, {
            y: (index) => index * copyStep(),
            opacity: (index) => copyOpacity(index),
            force3D: true,
          })
          // The scroll range contains exactly one pass. No timers, wraparound,
          // or entry callbacks: returning naturally retraces the same sequence.
          const timeline = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
              id: 'team-sequence',
              trigger: root,
              start: 'top top',
              end: () => `+=${root.clientHeight * profiles.length}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          for (let active = 1; active < profiles.length; active += 1) {
            const at = active - 0.65
            // Explicit endpoints keep refreshes and reverse scrolling stable.
            timeline.fromTo(portraits, {
              y: (index) => (index - active + 1) * portraitStep(),
              x: (index) => (index - active + 1) * -horizontalStep(),
              rotation: (index) => angle(index - active + 1),
              rotationX: (index) => wheelTilt(index - active + 1),
              scale: (index) => cardScale(index - active + 1),
              opacity: (index) => cardOpacity(index - active + 1),
              z: (index) => cardDepth(index - active + 1),
            }, {
              y: (index) => (index - active) * portraitStep(),
              x: (index) => (index - active) * -horizontalStep(),
              rotation: (index) => angle(index - active),
              rotationX: (index) => wheelTilt(index - active),
              scale: (index) => cardScale(index - active),
              opacity: (index) => cardOpacity(index - active),
              z: (index) => cardDepth(index - active),
              duration: 0.78,
              ease: 'power3.inOut',
              immediateRender: false,
            }, at)
            .fromTo(copies, {
              y: (index) => (index - active + 1) * copyStep(),
              opacity: (index) => copyOpacity(index - active + 1),
            }, {
              y: (index) => (index - active) * copyStep(),
              opacity: (index) => copyOpacity(index - active),
              duration: 0.72,
              ease: 'power3.inOut',
              immediateRender: false,
            }, at + 0.04)
          }
          timeline.to({}, { duration: 0.35 })
        } else if (!reducedMotion) {
          profiles.forEach((profile, index) => {
            const portrait = profile.querySelector('.team-profile__portrait')
            const copy = profile.querySelector('.team-profile__copy')
            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: profile,
                start: 'top 95%',
                end: 'top 65%',
                scrub: 0.45,
              },
            })

            reveal
              .from(portrait, {
                autoAlpha: 0.2,
                y: 58,
                scale: 0.88,
                rotation: index % 2 === 0 ? -3 : 3,
                ease: 'power3.out',
              })
              .from(copy, {
                autoAlpha: 0,
                y: 28,
                scale: 0.96,
                ease: 'power2.out',
              }, 0.12)
          })
        }

        // Create this after the pin so the light navigation covers its full range.
        ScrollTrigger.create({
          trigger: root,
          start: 'top 58%',
          end: 'bottom 42%',
          onToggle: (self) => {
            onSurfaceChange?.(self.isActive)
            if (self.isActive) setPageTone('#f7f5ef', true)
            else if (self.direction < 0) setPageTone('#080b0a', true)
          },
          onRefresh: (self) => onSurfaceChange?.(self.isActive),
        })
      })

      return () => {
        media.revert()
        onSurfaceChange?.(false)
      }

    },
    { scope: section },
  )

  return (
    <section
      className="team-section"
      ref={section}
      aria-labelledby="team-title"
      data-scene-id="team"
    >
      <h2 className="team-section__title" id="team-title">
        Nuestro Equipo
      </h2>

      <ol className="team-list">
        {teamMembers.map((member, index) => (
          <li className="team-profile" key={member.name}>
            <article>
              <div className="team-profile__copy">
                <h3>{member.name}</h3>
                <p className="team-profile__role">{member.role}</p>
                <p className="team-profile__description">{member.description}</p>
              </div>

              <figure className="team-profile__portrait">
                <PlaceholderPortrait accent={member.accent} variant={index} />
              </figure>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

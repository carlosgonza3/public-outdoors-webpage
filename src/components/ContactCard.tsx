import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import butterflyLogo from '../assets/public-butterfly.svg'

type ContactCardProps = {
  onClose: () => void
}

type ShareState = 'idle' | 'exporting' | 'shared' | 'error'

const contactDetails = [
  {
    id: 'address',
    label: 'Oficina',
    display: (
      <>
        Condominio Balam Quitze, local 2-31
        <br />
        Paseo General Escalón, San Salvador
      </>
    ),
    value:
      'Condominio Balam Quitze, segundo nivel, local 2-31, Paseo General Escalón, San Salvador, El Salvador',
  },
  {
    id: 'phone',
    label: 'Teléfono',
    display: '+503 2264-5458',
    value: '+503 2264-5458',
  },
  {
    id: 'email',
    label: 'Email',
    display: 'marketing@publicsv.net',
    value: 'marketing@publicsv.net',
  },
  {
    id: 'website',
    label: 'Sitio web',
    display: 'publicoutdoors.com',
    value: 'https://publicoutdoors.com',
  },
]

const socialLinks = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/publicoutdoors/' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/publicoutdoors/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/publicoutdoors1/' },
]

function SocialIcon({ id }: { id: string }) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="contact-card__social-dot" cx="17.4" cy="6.7" r="1" />
      </svg>
    )
  }

  if (id === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.2 9.4v8.4M6.2 6.2v.1M10.3 17.8V9.4m0 3.4c.7-2.1 6.9-3.1 6.9 1.9v3.1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 20v-7h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6H18V3.8c-.5-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V10H8.5v3h2.8v7" />
    </svg>
  )
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export function ContactCard({ onClose }: ContactCardProps) {
  const overlay = useRef<HTMLDivElement>(null)
  const cardStage = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const tiltReady = useRef(false)
  const copiedTimer = useRef<ReturnType<typeof window.setTimeout> | undefined>(
    undefined,
  )
  const shareTimer = useRef<ReturnType<typeof window.setTimeout> | undefined>(
    undefined,
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [shareState, setShareState] = useState<ShareState>('idle')

  useGSAP(
    () => {
      if (!overlay.current || !cardStage.current) return

      if (prefersReducedMotion()) {
        gsap.set([overlay.current, cardStage.current], { autoAlpha: 1 })
        tiltReady.current = true
        return
      }

      gsap
        .timeline({
          onComplete: () => {
            tiltReady.current = true
          },
        })
        .set(overlay.current, { autoAlpha: 0 })
        .set(cardStage.current, {
          autoAlpha: 0,
          xPercent: -18,
          rotationY: -68,
          scale: 0.9,
          filter: 'blur(10px)',
          clipPath: 'inset(0 100% 0 0 round 1.5rem)',
          transformOrigin: 'left center',
        })
        .to(overlay.current, {
          autoAlpha: 1,
          duration: 0.42,
          ease: 'power2.out',
        })
        .to(
          cardStage.current,
          {
            autoAlpha: 1,
            xPercent: -7,
            rotationY: -34,
            scale: 0.95,
            filter: 'blur(4px)',
            clipPath: 'inset(0 48% 0 0 round 1.5rem)',
            duration: 0.42,
            ease: 'power3.out',
          },
          0.08,
        )
        .to(
          cardStage.current,
          {
            xPercent: 0,
            rotationY: 0,
            scale: 1,
            filter: 'blur(0px)',
            clipPath: 'inset(0 0% 0 0 round 1.5rem)',
            duration: 0.58,
            ease: 'power4.out',
          },
          0.42,
        )
        .from(
          '.contact-card__reveal',
          {
            y: 24,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.055,
            ease: 'power3.out',
          },
          0.56,
        )
        .set(cardStage.current, { clipPath: 'none' }, 1.01)
    },
    { scope: overlay },
  )

  useEffect(() => {
    const stage = cardStage.current
    const canTilt = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches

    if (!stage || !canTilt || prefersReducedMotion()) return

    const rotateX = gsap.quickTo(stage, 'rotationX', {
      duration: 0.7,
      ease: 'power3.out',
    })
    const rotateY = gsap.quickTo(stage, 'rotationY', {
      duration: 0.7,
      ease: 'power3.out',
    })

    const handlePointerMove = (event: PointerEvent) => {
      if (!tiltReady.current || closing.current) return

      const horizontal = event.clientX / window.innerWidth - 0.5
      const vertical = event.clientY / window.innerHeight - 0.5

      rotateX(vertical * -3.2)
      rotateY(horizontal * 4)
    }

    const resetTilt = () => {
      if (!tiltReady.current || closing.current) return
      rotateX(0)
      rotateY(0)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', resetTilt)
    document.documentElement.addEventListener('pointerleave', resetTilt)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', resetTilt)
      document.documentElement.removeEventListener('pointerleave', resetTilt)
      gsap.killTweensOf(stage, ['rotationX', 'rotationY'])
    }
  }, [])

  const requestClose = useCallback(() => {
    if (closing.current || !overlay.current || !cardStage.current) return
    closing.current = true
    tiltReady.current = false

    if (prefersReducedMotion()) {
      onClose()
      return
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(cardStage.current, {
        xPercent: 16,
        rotationX: 0,
        rotationY: 62,
        scale: 0.91,
        filter: 'blur(8px)',
        clipPath: 'inset(0 0 0 100% round 1.5rem)',
        autoAlpha: 0,
        duration: 0.62,
        ease: 'power3.inOut',
        transformOrigin: 'right center',
      })
      .to(
        overlay.current,
        {
          autoAlpha: 0,
          duration: 0.32,
          ease: 'power2.in',
        },
        0.24,
      )
  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    const previousInert = appRoot?.inert ?? false
    const focusTimer = window.setTimeout(() => {
      closeButton.current?.focus({ preventScroll: true })
    }, prefersReducedMotion() ? 0 : 700)

    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose()

      if (event.key === 'Tab' && overlay.current) {
        const focusable = Array.from(
          overlay.current.querySelectorAll<HTMLElement>('button, [href]'),
        ).filter((element) => !element.hasAttribute('disabled'))
        const first = focusable[0]
        const last = focusable.at(-1)

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.clearTimeout(copiedTimer.current)
      window.clearTimeout(shareTimer.current)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = previousInert
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [requestClose])

  const handleCopy = async (id: string, value: string) => {
    try {
      await copyText(value)
      window.clearTimeout(copiedTimer.current)
      setCopiedId(id)
      copiedTimer.current = window.setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setCopiedId(null)
    }
  }

  const handleShare = async () => {
    const stage = cardStage.current
    if (!stage || shareState === 'exporting') return

    setShareState('exporting')
    window.clearTimeout(shareTimer.current)

    try {
      await document.fonts.ready

      const dataUrl = await toPng(stage, {
        cacheBust: true,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        backgroundColor: '#090b0d',
        style: {
          transform: 'none',
          transformOrigin: 'center',
          filter: 'none',
          clipPath: 'none',
        },
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.dataset.exportExclude === 'true'
          ),
      })
      const blob = await fetch(dataUrl).then((response) => response.blob())
      const file = new File([blob], 'public-contacto.png', {
        type: 'image/png',
      })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Public · Contacto',
          text: 'Hagamos visible tu próxima idea.',
          files: [file],
        })
      } else {
        const download = document.createElement('a')
        download.href = dataUrl
        download.download = file.name
        document.body.appendChild(download)
        download.click()
        download.remove()
      }

      setShareState('shared')
      shareTimer.current = window.setTimeout(
        () => setShareState('idle'),
        2200,
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setShareState('idle')
        return
      }

      setShareState('error')
      shareTimer.current = window.setTimeout(
        () => setShareState('idle'),
        2200,
      )
    }
  }

  const shareLabel = {
    idle: 'Compartir',
    exporting: 'Preparando',
    shared: 'Listo',
    error: 'Reintentar',
  }[shareState]

  return createPortal(
    <div
      className="contact-overlay"
      ref={overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div className="contact-card__stage" ref={cardStage}>
        <article
          className="contact-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-card-title"
        >
        <header className="contact-card__header contact-card__reveal">
          <p>Public · El Salvador</p>
          <div
            className="contact-card__actions"
            data-export-exclude="true"
          >
            <button
              className={`contact-card__share is-${shareState}`}
              type="button"
              onClick={handleShare}
              disabled={shareState === 'exporting'}
              aria-label={`${shareLabel} tarjeta de contacto`}
            >
              <span>{shareLabel}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" />
              </svg>
            </button>
            <button
              className="contact-card__close"
              type="button"
              ref={closeButton}
              onClick={requestClose}
              aria-label="Cerrar información de contacto"
            >
              <span>Cerrar</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
        </header>

        <div className="contact-card__body">
          <div className="contact-card__statement contact-card__reveal">
            <img
              className="contact-card__mark"
              src={butterflyLogo}
              alt="Public"
            />
            <p>Hagamos visible tu próxima idea.</p>
            <h2 id="contact-card-title">Hablemos.</h2>
          </div>

          <div className="contact-card__details">
            {contactDetails.map((detail) => {
              const copied = copiedId === detail.id

              return (
                <button
                  className="contact-card__datum contact-card__reveal"
                  type="button"
                  key={detail.id}
                  onClick={() => handleCopy(detail.id, detail.value)}
                  aria-label={`Copiar ${detail.label}: ${detail.value}`}
                >
                  <span className="contact-card__datum-label">{detail.label}</span>
                  <strong>{detail.display}</strong>
                  {copied && (
                    <span
                      className="contact-card__copy-icon"
                      role="status"
                      aria-label={`${detail.label} copiado`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 5H7.5A2.5 2.5 0 0 0 5 7.5v11A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 16.5 5H15" />
                        <path d="M9 3.5h6v3H9zM8.5 14l2.2 2.2 4.8-5" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <footer className="contact-card__footer contact-card__reveal">
          <div className="contact-card__services" aria-hidden="true">
            <span>Indoor</span>
            <span>Outdoor</span>
            <span>Innovations</span>
          </div>

          <nav className="contact-card__socials" aria-label="Redes sociales">
            <span>Síguenos</span>
            {socialLinks.map((social) => (
              <a
                href={social.href || undefined}
                target={"_blank"}
                aria-disabled={!social.href}
                aria-label={social.label}
                tabIndex={social.href ? undefined : -1}
                key={social.id}
              >
                <SocialIcon id={social.id} />
              </a>
            ))}
          </nav>
        </footer>

        </article>
      </div>
    </div>,
    document.body,
  )
}

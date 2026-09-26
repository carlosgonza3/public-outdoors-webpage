import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import { gsap, useGSAP } from '../animation/gsap'
import { prefersReducedMotion } from '../animation/motion'
import { isMobileExperience } from '../animation/mobile'
import butterflyLogo from '../assets/public-butterfly.svg'

type ContactCardProps = {
  onClose?: () => void
  mode?: 'modal' | 'scroll'
}

type ShareState = 'idle' | 'exporting' | 'shared' | 'error'

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

const contactDetails = [
  {
    id: 'address',
    label: 'Oficina',
    display: (
      <>
        Condominio Balam Quitze, segundo nivel, local 2-31
        <br />
        Paseo General Escalón, San Salvador, El Salvador
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
    id: 'whatsapp',
    label: 'WhatsApp',
    display: 'Elige tu contacto',
    value: 'Seleccionar contacto de WhatsApp',
  },
]

const whatsappContacts = [
  { name: 'Iris Cisneros', number: '+503 7840 0641', whatsapp: '50378400641' },
  { name: 'Zayda Reyes', number: '+503 7607 9725', whatsapp: '50376079725' },
  { name: 'Rosemary Daboub', number: '+503 7855 7192', whatsapp: '50378557192' },
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

function ContactDetailIcon({ id }: { id: string }) {
  if (id === 'address') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.1" />
      </svg>
    )
  }

  if (id === 'phone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.1 3.7 4.5 5c-.7.4-1 1.2-.8 2 1.6 6.4 6.6 11.4 13 13 .8.2 1.6-.1 2-.8l1.3-2.6-4.2-2-1.3 2a13.2 13.2 0 0 1-7.1-7.1l2-1.3-2.3-4.5Z" />
      </svg>
    )
  }

  if (id === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m5 7 7 5 7-5" />
      </svg>
    )
  }

  if (id === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 11.8a8.4 8.4 0 0 1-12.5 7.3L3.5 20.5l1.4-4.3a8.4 8.4 0 1 1 15.5-4.4Z" />
        <path d="M8.1 7.3c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l1 2.3c.1.3 0 .5-.1.7l-.7.9c-.2.2-.1.4 0 .6.8 1.4 1.9 2.5 3.4 3.2.2.1.4.1.6-.1l.9-1.1c.2-.2.4-.3.7-.2l2.2 1c.3.1.4.3.4.5 0 .3-.2 1.5-.8 2.1-.6.6-1.5.9-2.4.7-1.1-.2-2.5-.7-4.2-1.8-2.5-1.6-4.1-4-4.5-5.4-.4-1.3 0-2.7.6-3.3.3-.3.7-.5 1.1-.5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" />
    </svg>
  )
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Safari and embedded browsers can expose the Clipboard API while still
      // rejecting it. Fall through to the selection-based copy path.
    }
  }

  const textarea = document.createElement('textarea')
  const previouslyFocused = document.activeElement as HTMLElement | null
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  textarea.setAttribute('readonly', '')
  document.body.appendChild(textarea)
  textarea.focus({ preventScroll: true })
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  previouslyFocused?.focus({ preventScroll: true })

  if (!copied) throw new Error('Copy command was rejected')
}

export function ContactCard({ onClose, mode = 'modal' }: ContactCardProps) {
  const overlay = useRef<HTMLDivElement>(null)
  const cardMotion = useRef<HTMLDivElement>(null)
  const cardStage = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const whatsappPanel = useRef<HTMLDivElement>(null)
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
  const [whatsappOpen, setWhatsappOpen] = useState(false)

  useGSAP(
    () => {
      if (!overlay.current || !cardMotion.current) return
      if (mode === 'scroll') return

      if (prefersReducedMotion()) {
        gsap.set([overlay.current, cardMotion.current], {
          autoAlpha: 1,
          clearProps: 'transform,filter,clipPath',
        })
        tiltReady.current = true
        return
      }

      if (isMobileExperience()) {
        tiltReady.current = false
        const timeline = gsap
          .timeline({
            onComplete: () => {
              tiltReady.current = true
            },
          })
          .set(overlay.current, { autoAlpha: 0 })
          .set(cardMotion.current, {
            autoAlpha: 0,
            y: 24,
            scale: 0.98,
            transformOrigin: 'center center',
          })
          .to(overlay.current, {
            autoAlpha: 1,
            duration: 0.28,
            ease: 'power2.out',
          })
          .to(
            cardMotion.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.48,
              ease: 'power3.out',
            },
            0.04,
          )

        return () => timeline.kill()
      }

      gsap
        .timeline({
          onComplete: () => {
            tiltReady.current = true
          },
        })
        .set(overlay.current, { autoAlpha: 0 })
        .set(cardMotion.current, {
          autoAlpha: 0,
          xPercent: -12,
          rotationY: -48,
          scale: 0.96,
          clipPath: 'inset(0 82% 0 0 round 1.5rem)',
          transformOrigin: 'left center',
        })
        .to(overlay.current, {
          autoAlpha: 1,
          duration: 0.42,
          ease: 'power2.out',
        })
        .to(
          cardMotion.current,
          {
            autoAlpha: 1,
            xPercent: 0,
            rotationY: 0,
            scale: 1,
            clipPath: 'inset(0 0% 0 0 round 1.5rem)',
            duration: 0.82,
            ease: 'power4.out',
          },
          0.06,
        )
        .set(cardMotion.current, { clipPath: 'none' }, 0.88)
    },
    { scope: overlay },
  )

  useGSAP((_, contextSafe) => {
    const stage = cardStage.current
    const safe = contextSafe!
    const canPointerTilt = window.matchMedia(
      '(any-hover: hover) and (any-pointer: fine)',
    ).matches

    if (!stage || prefersReducedMotion()) return

    if (mode === 'scroll') tiltReady.current = true

    gsap.set(stage, {
      transformPerspective: 1400,
      transformOrigin: 'center center',
    })

    const rotateX = gsap.quickTo(stage, 'rotationX', {
      duration: 0.58,
      ease: 'power3.out',
    })
    const rotateY = gsap.quickTo(stage, 'rotationY', {
      duration: 0.58,
      ease: 'power3.out',
    })

    const resetTilt = safe(() => {
      if (!tiltReady.current || closing.current) return
      rotateX(0)
      rotateY(0)
    })

    if (isMobileExperience() || !canPointerTilt) {
      if (typeof window.DeviceOrientationEvent === 'undefined') return

      let initialBeta: number | null = null
      let initialGamma: number | null = null
      let listening = false
      let permissionRequested = false

      const resetCalibration = safe(() => {
        initialBeta = null
        initialGamma = null
        resetTilt()
      })

      const handleOrientation = safe((event: DeviceOrientationEvent) => {
        if (
          !tiltReady.current ||
          closing.current ||
          event.beta === null ||
          event.gamma === null
        ) return

        if (initialBeta === null || initialGamma === null) {
          initialBeta = event.beta
          initialGamma = event.gamma
          return
        }

        const beta = event.beta - initialBeta
        const gamma = event.gamma - initialGamma
        const angle = screen.orientation?.angle ?? 0

        let horizontal = gamma
        let vertical = beta

        if (angle === 90) {
          horizontal = beta
          vertical = -gamma
        } else if (angle === 180) {
          horizontal = -gamma
          vertical = -beta
        } else if (angle === 270) {
          horizontal = -beta
          vertical = gamma
        }

        rotateX(gsap.utils.clamp(-4, 4, (vertical / 18) * -4))
        rotateY(gsap.utils.clamp(-5.5, 5.5, (horizontal / 18) * 5.5))
      })

      const startListening = () => {
        if (listening) return
        listening = true
        window.addEventListener('deviceorientation', handleOrientation, {
          passive: true,
        })
      }

      const orientationEvent = window.DeviceOrientationEvent as
        DeviceOrientationEventWithPermission

      const requestOrientationAccess = safe(async () => {
        if (permissionRequested) return
        permissionRequested = true

        try {
          const permission = await orientationEvent.requestPermission?.()
          if (permission === 'granted') startListening()
        } catch {
          // Sensor permission was declined or is unavailable in this context.
        }
      })

      if (orientationEvent.requestPermission) {
        stage.addEventListener('pointerdown', requestOrientationAccess)
      } else {
        startListening()
      }

      screen.orientation?.addEventListener('change', resetCalibration)
      window.addEventListener('blur', resetCalibration)

      return () => {
        stage.removeEventListener('pointerdown', requestOrientationAccess)
        window.removeEventListener('deviceorientation', handleOrientation)
        screen.orientation?.removeEventListener('change', resetCalibration)
        window.removeEventListener('blur', resetCalibration)
        gsap.killTweensOf(stage, ['rotationX', 'rotationY'])
        tiltReady.current = false
      }
    }

    const handlePointerMove = safe((event: PointerEvent) => {
      if (
        event.pointerType === 'touch' ||
        !tiltReady.current ||
        closing.current
      ) return

      const horizontal = (event.clientX / window.innerWidth - 0.5) * 2
      const vertical = (event.clientY / window.innerHeight - 0.5) * 2

      rotateX(vertical * -4)
      rotateY(horizontal * 5.5)
    })

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', resetTilt)
    document.documentElement.addEventListener('pointerleave', resetTilt)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', resetTilt)
      document.documentElement.removeEventListener('pointerleave', resetTilt)
      gsap.killTweensOf(stage, ['rotationX', 'rotationY'])
      tiltReady.current = false
    }
  }, {
    scope: cardMotion,
    dependencies: [mode],
    revertOnUpdate: true,
  })

  const requestClose = useCallback(() => {
    if (
      mode !== 'modal' ||
      !onClose ||
      closing.current ||
      !overlay.current ||
      !cardMotion.current
    ) return
    closing.current = true
    tiltReady.current = false

    if (prefersReducedMotion()) {
      onClose()
      return
    }

    if (isMobileExperience()) {
      gsap
        .timeline({ onComplete: onClose })
        .to(cardMotion.current, {
          autoAlpha: 0,
          y: -14,
          scale: 0.985,
          duration: 0.28,
          ease: 'power2.in',
        })
        .to(
          overlay.current,
          {
            autoAlpha: 0,
            duration: 0.24,
            ease: 'power2.in',
          },
          0.06,
        )
      return
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(cardMotion.current, {
        xPercent: 16,
        rotationX: 0,
        rotationY: 62,
        scale: 0.91,
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
  }, [mode, onClose])

  useEffect(() => {
    if (mode !== 'modal') return

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
      if (event.key === 'Escape') {
        if (whatsappPanel.current) setWhatsappOpen(false)
        else requestClose()
      }

      if (event.key === 'Tab' && overlay.current) {
        const focusRoot = whatsappPanel.current ?? overlay.current
        const focusable = Array.from(
          focusRoot.querySelectorAll<HTMLElement>('button, [href]'),
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
  }, [mode, requestClose])

  useEffect(() => {
    if (!whatsappOpen) return

    const firstContact = whatsappPanel.current?.querySelector<HTMLElement>('a')
    firstContact?.focus({ preventScroll: true })
  }, [whatsappOpen])

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

      const exportTarget =
        stage.querySelector<HTMLElement>('.contact-card') ?? stage

      const dataUrl = await toPng(exportTarget, {
        cacheBust: false,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        backgroundColor: '#f5f2eb',
        style: {
          transform: 'none',
          transformOrigin: 'center',
          filter: 'none',
          clipPath: 'none',
          overflow: 'visible',
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

  const titleId = mode === 'modal'
    ? 'contact-card-title'
    : 'purpose-contact-card-title'

  const cardContent = (
    <div
      className="contact-card__motion"
      ref={cardMotion}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="contact-card__stage" ref={cardStage}>
        <article
          className="contact-card"
          role={mode === 'modal' ? 'dialog' : 'region'}
          aria-modal={mode === 'modal' ? true : undefined}
          aria-labelledby={titleId}
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
            {mode === 'modal' && (
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
            )}
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
            <h2 id={titleId}>Hablemos.</h2>
          </div>

          <div className="contact-card__details">
            {contactDetails.map((detail) => {
              const copied = copiedId === detail.id
              const isWhatsapp = detail.id === 'whatsapp'

              return (
                <button
                  className={`contact-card__datum contact-card__reveal${isWhatsapp ? ' is-whatsapp' : ''}`}
                  type="button"
                  key={detail.id}
                  onClick={() => {
                    if (isWhatsapp) setWhatsappOpen(true)
                    else void handleCopy(detail.id, detail.value)
                  }}
                  aria-label={isWhatsapp
                    ? 'Elegir contacto de WhatsApp'
                    : `Copiar ${detail.label}: ${detail.value}`}
                  aria-haspopup={isWhatsapp ? 'dialog' : undefined}
                  aria-expanded={isWhatsapp ? whatsappOpen : undefined}
                  title={`${detail.label}: ${detail.value}`}
                >
                  <span className="contact-card__datum-icon">
                    <ContactDetailIcon id={detail.id} />
                  </span>
                  <span className="contact-card__datum-content">
                    <span className="contact-card__datum-label">{detail.label}</span>
                    <strong>{detail.display}</strong>
                  </span>
                  {copied && !isWhatsapp && (
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

        {whatsappOpen && (
          <div
            className="contact-card__whatsapp-panel"
            ref={whatsappPanel}
            data-export-exclude="true"
            onClick={() => setWhatsappOpen(false)}
          >
            <div
              className="contact-card__whatsapp-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-card-whatsapp-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="contact-card__whatsapp-header">
                <div>
                  <span>WhatsApp</span>
                  <strong id="contact-card-whatsapp-title">¿Con quién deseas hablar?</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappOpen(false)}
                  aria-label="Cerrar contactos de WhatsApp"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </header>

              <div className="contact-card__whatsapp-list">
                {whatsappContacts.map((contact) => (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setWhatsappOpen(false)}
                    key={contact.whatsapp}
                    aria-label={`Abrir WhatsApp con ${contact.name}, ${contact.number}`}
                  >
                    <span className="contact-card__whatsapp-avatar" aria-hidden="true">
                      {contact.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{contact.name}</strong>
                      <small>{contact.number}</small>
                    </span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 12h8M13 8l4 4-4 4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        </article>
      </div>
    </div>
  )

  if (mode === 'scroll') {
    return <div className="contact-card-embed">{cardContent}</div>
  }

  return createPortal(
    <div
      className="contact-overlay"
      ref={overlay}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      {cardContent}
    </div>,
    document.body,
  )
}

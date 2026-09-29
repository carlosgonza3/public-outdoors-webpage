import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePageTone } from '../hooks/usePageTone'
import { innovationShowcaseImages } from '../data/innovationShowcase'

type InnovationGalleryModalProps = {
  onClose: () => void
}

export function InnovationGalleryModal({ onClose }: InnovationGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const closeButton = useRef<HTMLButtonElement>(null)
  const pointerStart = useRef<number | null>(null)
  usePageTone('#070908', true)

  const showPrevious = useCallback(() => {
    setActiveIndex((index) =>
      (index - 1 + innovationShowcaseImages.length) %
      innovationShowcaseImages.length,
    )
  }, [])

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % innovationShowcaseImages.length)
  }, [])

  useEffect(() => {
    const appRoot = document.getElementById('root')
    const previousOverflow = document.body.style.overflow
    const previousInert = appRoot?.inert ?? false
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }

    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true
    window.addEventListener('keydown', handleKeyDown)
    closeButton.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = previousInert
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, showNext, showPrevious])

  const activeImage = innovationShowcaseImages[activeIndex]

  return createPortal(
    <div
      className="innovation-gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="innovation-gallery-title"
    >
      <button
        className="innovation-gallery-modal__backdrop"
        type="button"
        aria-label="Cerrar galería de innovaciones"
        onClick={onClose}
      />

      <section className="innovation-gallery-modal__panel">
        <header className="innovation-gallery-modal__header">
          <div>
            <p>Innovaciones</p>
            <h2 id="innovation-gallery-title">Imagina tu marca aquí</h2>
          </div>
          <span aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(innovationShowcaseImages.length).padStart(2, '0')}
          </span>
        </header>

        <div
          className="innovation-gallery-modal__stage"
          onPointerDown={(event) => {
            if (event.pointerType !== 'mouse') pointerStart.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return
            const distance = event.clientX - pointerStart.current
            pointerStart.current = null
            if (Math.abs(distance) < 42) return
            if (distance > 0) showPrevious()
            else showNext()
          }}
          onPointerCancel={() => {
            pointerStart.current = null
          }}
        >
          <img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            decoding="async"
          />

          <button
            className="innovation-gallery-modal__arrow is-previous"
            type="button"
            aria-label="Imagen anterior"
            onClick={showPrevious}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <button
            className="innovation-gallery-modal__arrow is-next"
            type="button"
            aria-label="Imagen siguiente"
            onClick={showNext}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          className="innovation-gallery-modal__thumbnails"
          role="tablist"
          aria-label="Imágenes de innovaciones"
        >
          {innovationShowcaseImages.map((image, index) => (
            <button
              className={index === activeIndex ? 'is-active' : undefined}
              type="button"
              role="tab"
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              key={image.src}
            >
              <img src={image.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </section>

      <button
        className="innovation-gallery-modal__close"
        type="button"
        onClick={onClose}
        ref={closeButton}
      >
        <span aria-hidden="true">×</span>
        Cerrar
      </button>
    </div>,
    document.body,
  )
}

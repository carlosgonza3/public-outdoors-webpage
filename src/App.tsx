import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ContactCard } from './components/ContactCard'
import { IndoorPage } from './pages/IndoorPage'
import { InnovationsPage } from './pages/InnovationsPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { GalleryScene } from './sections/GalleryScene'
import { ImpactScene } from './sections/ImpactScene'
import { IntroScene } from './sections/IntroScene'
import { PurposeScene } from './sections/PurposeScene'
import './App.css'

function HomePage() {
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigation = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!mobileMenuOpen) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!navigation.current?.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    window.addEventListener('pointerdown', closeOnOutsidePress)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('pointerdown', closeOnOutsidePress)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [mobileMenuOpen])

  const scrollToIndoor = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false)
    const indoorCollection = document.getElementById('indoor-gallery')

    if (!indoorCollection) return

    event.preventDefault()
    window.dispatchEvent(new Event('public:navigate-to-media'))
    window.requestAnimationFrame(() => {
      indoorCollection.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <>
      <nav
        className={`site-overlay-nav${mobileMenuOpen ? ' is-open' : ''}`}
        aria-label="Navegación principal"
        ref={navigation}
      >
        <button
          className="site-overlay-nav__toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span>Menú</span>
          <i aria-hidden="true">
            <span />
            <span />
          </i>
        </button>

        <div className="site-overlay-nav__menu" id="site-mobile-menu">
          <a href="#indoor-gallery" onClick={scrollToIndoor}>
            Nuestros medios
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              setContactOpen(true)
            }}
          >
            Contáctanos
          </button>
        </div>
      </nav>

      <main>
        <IntroScene />
        <GalleryScene />
        <ImpactScene />
        <PurposeScene />
      </main>

      {contactOpen && <ContactCard onClose={() => setContactOpen(false)} />}
    </>
  )
}

function App() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/indoor" element={<IndoorPage />} />
        <Route path="/outdoor" element={<OutdoorPage />} />
        <Route path="/innovations" element={<InnovationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/indoor" element={<IndoorPage modal />} />
          <Route path="/outdoor" element={<OutdoorPage modal />} />
          <Route path="/innovations" element={<InnovationsPage modal />} />
        </Routes>
      )}
    </>
  )
}

export default App

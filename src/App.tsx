import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { useCallback, useState } from 'react'
import { ContactCard } from './components/ContactCard'
import { SiteNavigation } from './components/SiteNavigation'
import { AvailabilityPage } from './pages/AvailabilityPage'
import { IndoorPage } from './pages/IndoorPage'
import { InnovationsPage } from './pages/InnovationsPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { GalleryScene } from './sections/GalleryScene'
import { ImpactScene } from './sections/ImpactScene'
import { IntroScene } from './sections/IntroScene'
import { PurposeScene } from './sections/PurposeScene'
import { TeamScene } from './sections/TeamScene'
import './App.css'

function HomePage() {
  const [contactOpen, setContactOpen] = useState(false)
  const [navigationRevealed, setNavigationRevealed] = useState(false)
  const [mobileNavigationGap, setMobileNavigationGap] = useState(false)
  const [teamLightSurface, setTeamLightSurface] = useState(false)

  const handleMaskStateChange = useCallback((complete: boolean) => {
    setNavigationRevealed(complete)
  }, [])

  const scrollToMedia = (
    event: React.MouseEvent<HTMLAnchorElement>,
    collectionId: 'indoor' | 'outdoor' | 'innovations',
  ) => {
    const collection = document.getElementById(`${collectionId}-gallery`)

    if (!collection) return

    event.preventDefault()
    window.dispatchEvent(new Event('public:navigate-to-media'))
    window.requestAnimationFrame(() => {
      collection.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <>
      <SiteNavigation
        revealed
        hideButterfly={!navigationRevealed}
        lightSurface={!navigationRevealed || teamLightSurface}
        temporarilyHidden={mobileNavigationGap}
        onContact={() => setContactOpen(true)}
        onMedia={scrollToMedia}
      />

      <main id="hero">
        <IntroScene
          onMaskStateChange={handleMaskStateChange}
          onMobileNavigationGapChange={setMobileNavigationGap}
        />
        <GalleryScene />
        <ImpactScene />
        <PurposeScene />
        <TeamScene onSurfaceChange={setTeamLightSurface} />
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
        <Route path="/disponibilidad" element={<AvailabilityPage />} />
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

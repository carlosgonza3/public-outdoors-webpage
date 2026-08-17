import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { IndoorPage } from './pages/IndoorPage'
import { InnovationsPage } from './pages/InnovationsPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { GalleryScene } from './sections/GalleryScene'
import { ImpactScene } from './sections/ImpactScene'
import { IntroScene } from './sections/IntroScene'
import { PurposeScene } from './sections/PurposeScene'
import './App.css'

function HomePage() {
  return (
    <main>
      <IntroScene />
      <GalleryScene />
      <ImpactScene />
      <PurposeScene />
    </main>
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

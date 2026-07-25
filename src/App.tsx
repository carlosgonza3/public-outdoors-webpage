import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { CollectionPage } from './pages/CollectionPage'
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
        <Route path="/indoor" element={<CollectionPage collectionId="indoor" />} />
        <Route path="/outdoor" element={<CollectionPage collectionId="outdoor" />} />
        <Route
          path="/innovations"
          element={<CollectionPage collectionId="innovations" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/indoor"
            element={<CollectionPage collectionId="indoor" modal />}
          />
          <Route
            path="/outdoor"
            element={<CollectionPage collectionId="outdoor" modal />}
          />
          <Route
            path="/innovations"
            element={<CollectionPage collectionId="innovations" modal />}
          />
        </Routes>
      )}
    </>
  )
}

export default App

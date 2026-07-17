import { GalleryScene } from './sections/GalleryScene'
import { IntroScene } from './sections/IntroScene'
import { PurposeScene } from './sections/PurposeScene'
import './App.css'

function App() {
  return (
    <main>
      <div className="safari-browser-tone" aria-hidden="true" />
      <IntroScene />
      <GalleryScene />
      <PurposeScene />
    </main>
  )
}

export default App

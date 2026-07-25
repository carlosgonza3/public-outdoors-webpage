import { GalleryScene } from './sections/GalleryScene'
import { ImpactScene } from './sections/ImpactScene'
import { IntroScene } from './sections/IntroScene'
import { PurposeScene } from './sections/PurposeScene'
import './App.css'

function App() {
  return (
    <main>
      <IntroScene />
      <GalleryScene />
      <ImpactScene />
      <PurposeScene />
    </main>
  )
}

export default App

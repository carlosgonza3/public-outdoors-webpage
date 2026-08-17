import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ImageLightboxProvider } from './components/ImageLightbox.tsx'
import { initializeIOSSafariWorkaround } from './platform/iosSafari'

initializeIOSSafariWorkaround()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageLightboxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ImageLightboxProvider>
  </StrictMode>,
)

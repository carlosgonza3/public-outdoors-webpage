import { refreshPageTone, setPageTone } from './animation/pageTone'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ImageLightboxProvider } from './components/ImageLightbox.tsx'
import { initializeIOSSafariWorkaround } from './platform/iosSafari'

initializeIOSSafariWorkaround()
window.addEventListener('pageshow', refreshPageTone)
const initialPath = window.location.pathname.slice(import.meta.env.BASE_URL.length).replace(/\/$/, '')
setPageTone(['indoor', 'outdoor', 'innovations'].includes(initialPath)
  ? '#0b0d0c' : initialPath === 'disponibilidad' ? '#07080b' : '#f7f5ef', true)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageLightboxProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ImageLightboxProvider>
  </StrictMode>,
)

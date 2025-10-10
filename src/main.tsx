import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './router/AppRouter.tsx'
import './styles/globals.css'
import { registerSW } from './utils/pwa.ts'

// Register service worker for PWA functionality
registerSW();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)

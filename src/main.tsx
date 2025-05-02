import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppNew from './AppNew.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppNew />
    </ThemeProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import App from './App.jsx'

const rootElement =
  document.getElementById('root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'root'
    document.body.appendChild(el)
    return el
  })()

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Failed to start Smart Campus client:', error)
  rootElement.innerHTML =
    '<div style="padding:24px;font-family:Inter,system-ui,sans-serif;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;max-width:720px;margin:32px auto;">App failed to start. Check browser console for details.</div>'
}

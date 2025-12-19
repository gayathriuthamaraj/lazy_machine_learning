import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CallMain from './models/call_main'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CallMain/>
  </StrictMode>,
)

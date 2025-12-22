import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CallMain from './models/call_main'
import App from './App'
import Theme_check from './theme_check'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CallMain/>
    <App/>
    <Theme_check/>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StoreContextProvider from './StoreContext/StoreContext.jsx'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </StrictMode>,
)

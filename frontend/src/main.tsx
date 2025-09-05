import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import "./index.css"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="h-full w-full flex flex-row justify-center items-center">
      <App />
    </div>
  </StrictMode>,
)

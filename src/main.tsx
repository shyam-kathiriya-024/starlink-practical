import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppointmentProvider } from './contexts/AppointmentContext'


createRoot(document.getElementById('root')!).render(
  <AppointmentProvider>
    <App />
  </AppointmentProvider>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AdminDataProvider } from './context/AdminDataContext'
import { siteConfig } from './data/config'

document.documentElement.style.setProperty('--forest', siteConfig.brand.forest)
document.documentElement.style.setProperty('--paper', siteConfig.brand.ivory)
document.documentElement.style.setProperty('--brass', siteConfig.brand.brass)
document.documentElement.style.setProperty('--display', `'${siteConfig.fonts.display}', Georgia, serif`)
document.documentElement.style.setProperty('--body', `'${siteConfig.fonts.body}', sans-serif`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminDataProvider>
        <App />
      </AdminDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
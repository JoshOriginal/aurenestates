import { useEffect } from 'react'
import { Route, Routes, useLocation, Outlet } from 'react-router-dom'
import { Footer, Header } from './components/SiteChrome'
import { FavoritesProvider } from './context/FavoritesContext'
import AdminLayout from './admin/AdminLayout'
import OverviewPage from './admin/OverviewPage'
import { PropertiesAdminPage, PropertyEditorPage } from './admin/PropertiesAdminPage'
import DevelopmentsAdminPage from './admin/DevelopmentsAdminPage'
import { LeadsAdminPage, ViewingsAdminPage } from './admin/LeadsViewingsPages'
import { MediaAdminPage, TeamAdminPage } from './admin/TeamMediaPages'
import { AnalyticsPage, ReportsPage, SecurityPage, SettingsPage, WebsiteEditorPage } from './admin/SettingsAnalyticsPages'
import ContactPage from './pages/ContactPage'
import DevelopmentsPage from './pages/DevelopmentsPage'
import HomePage from './pages/HomePage'
import LegalPage from './pages/LegalPage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'

function ScrollManager() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname, location.search, location.hash])
  return null
}

export default function App() {
  return (
    <FavoritesProvider>
      <ScrollManager />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="properties" element={<PropertiesAdminPage />} />
          <Route path="properties/new" element={<PropertyEditorPage />} />
          <Route path="properties/:id/edit" element={<PropertyEditorPage />} />
          <Route path="developments" element={<DevelopmentsAdminPage />} />
          <Route path="leads" element={<LeadsAdminPage />} />
          <Route path="viewings" element={<ViewingsAdminPage />} />
          <Route path="team" element={<TeamAdminPage />} />
          <Route path="media" element={<MediaAdminPage />} />
          <Route path="website" element={<WebsiteEditorPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/developments" element={<DevelopmentsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="*" element={<main className="not-found wrap"><span className="eyebrow">Page not found</span><h1>Let’s find our way back.</h1><a href="/" className="button button-dark">Return home</a></main>} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}

function PublicLayout() {
  return <><Header /><Outlet /><Footer /></>
}
import { useState } from 'react'
import { Activity, BarChart3, Building2, CalendarDays, ChevronLeft, ChevronRight, FileBarChart2, Image, Info, LayoutDashboard, Menu, MessageSquareText, MonitorCog, Settings2, ShieldCheck, Users, X, Plus, Search, Bell, ExternalLink } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAdminData } from '../context/AdminDataContext'
import { ToastProvider } from './AdminUI'

const groups = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Properties', to: '/admin/properties', icon: Building2 },
  { label: 'Developments', to: '/admin/developments', icon: MonitorCog },
  { label: 'Leads & customers', to: '/admin/leads', icon: MessageSquareText },
  { label: 'Viewings', to: '/admin/viewings', icon: CalendarDays },
  { label: 'Agents & team', to: '/admin/team', icon: Users },
  { label: 'Media library', to: '/admin/media', icon: Image },
  { label: 'Website editor', to: '/admin/website', icon: MonitorCog },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', to: '/admin/reports', icon: FileBarChart2 },
  { label: 'Settings', to: '/admin/settings', icon: Settings2 },
  { label: 'Users & security', to: '/admin/security', icon: ShieldCheck },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const location = useLocation()
  const { data } = useAdminData()
  const pendingLeads = data.settings.notifications.newLeads ? data.leads.filter((lead) => lead.status === 'New').length : 0
  const pendingRequests = data.settings.notifications.viewingRequests ? data.viewings.filter((viewing) => viewing.status === 'Requested').length : 0
  const pending = pendingLeads + pendingRequests

  return <ToastProvider><div className={`admin-app ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="admin-brand"><Link to="/admin" aria-label="Auren Estates admin overview"><span className="admin-brand-mark">A</span>{!collapsed && <span className="admin-brand-name">AUREN <small>ESTATES · STUDIO</small></span>}</Link><button className="admin-sidebar-collapse admin-icon-button" type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button></div>
      <div className="admin-workspace-label">{!collapsed && <><span className="workspace-avatar">A</span><span><strong>Auren Estates</strong><small>Demo workspace</small></span><ChevronRight size={14} /></>}</div>
      <nav className="admin-nav" aria-label="Admin navigation">{groups.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} title={collapsed ? label : undefined} className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`} onClick={() => setMobileOpen(false)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Leads & customers' && pending > 0 && <small>{pending}</small>}</NavLink>)}</nav>
      <div className="admin-sidebar-bottom">{!collapsed && <p>Prototype workspace<br /><span>Changes are stored in this browser.</span></p>}<Link to="/" className="admin-public-link" title="View public website"><ExternalLink size={16} /><span>{!collapsed && 'View public website'}</span></Link></div>
    </aside>
    {mobileOpen && <button type="button" className="admin-mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-menu admin-icon-button" type="button" aria-label="Open admin navigation" onClick={() => setMobileOpen(true)}><Menu size={19} /></button><div className="admin-topbar-crumb"><Activity size={15} /><span>Management studio</span><span>/</span><strong>{groups.find((group) => group.to === location.pathname)?.label ?? 'Workspace'}</strong></div><div className="admin-topbar-actions"><label className="admin-global-search"><Search size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && globalSearch.trim()) window.location.href = `/admin/properties?search=${encodeURIComponent(globalSearch)}` }} placeholder="Search properties" aria-label="Search properties" /></label><div className="admin-notification-wrap"><button className="admin-icon-button notification-trigger" type="button" aria-label={`${pending} pending items`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={17} />{pending > 0 && <i />}</button>{notificationsOpen && <div className="admin-notification-popover"><div><strong>Needs attention</strong><button className="admin-plain-button" type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={15} /></button></div><p>{pendingLeads} new leads and {pendingRequests} viewing requests awaiting review.</p><Link to="/admin/leads" onClick={() => setNotificationsOpen(false)}>Review leads <ChevronRight size={14} /></Link><Link to="/admin/viewings" onClick={() => setNotificationsOpen(false)}>Review viewings <ChevronRight size={14} /></Link></div>}</div><span className="admin-user-avatar">AE</span></div></header>
      <div className="admin-prototype-banner"><Info size={14} /><span><strong>Prototype mode</strong> · Browser-local demo data. Not connected to a database; no authentication or server-side access control.</span><button type="button" onClick={(event) => event.currentTarget.parentElement?.remove()} aria-label="Dismiss prototype notice"><X size={14} /></button></div>
      <main className="admin-content"><Outlet /></main>
    </div>
  </div></ToastProvider>
}

export function AdminCreateButton({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link className="admin-button admin-button-primary" to={to}><Plus size={16} />{children}</Link>
}

export function MobilePageClose() { return <X size={16} /> }
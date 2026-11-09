import { ArrowDownRight, ArrowRight, ArrowUpRight, Eye, FilePlus2, MessageSquareText, Plus, CalendarClock, Building2, Upload, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../context/AdminDataContext'
import { formatPrice } from '../data/properties'
import { formatAdminDate, PageHeader, StatusPill } from './AdminUI'
import { AdminCreateButton } from './AdminLayout'

export default function OverviewPage() {
  const { data } = useAdminData()
  const active = data.properties.filter((item) => item.status === 'Published').length
  const draft = data.properties.filter((item) => item.status === 'Draft').length
  const closed = data.properties.filter((item) => item.status === 'Sold' || item.status === 'Rented').length
  const freshLeads = data.leads.filter((item) => item.status === 'New').length
  const pendingViewings = data.viewings.filter((item) => item.status === 'Requested').length
  const views = data.analytics.daily.reduce((sum, day) => sum + day.views, 0)
  const maximumViews = Math.max(...data.analytics.daily.map((day) => day.views), 1)
  const topProperties = data.analytics.viewsByProperty.slice().sort((a, b) => b.views - a.views).slice(0, 4)

  return <>
    <PageHeader eyebrow="Friday, 16 October 2026" title="Overview" description="A clear view of your property activity and what needs attention." actions={<AdminCreateButton to="/admin/properties/new">Add property</AdminCreateButton>} />
    <div className="admin-data-note"><InfoIcon /> Demo data · Property and CRM records are editable in this browser. Traffic and source charts below are illustrative sample events, not live analytics.</div>
    <div className="admin-metric-grid">
      <Metric icon={<Building2 size={17} />} label="Total properties" value={data.properties.length} detail={`${active} currently published`} tone="green" />
      <Metric icon={<Eye size={17} />} label="Property views" value={views.toLocaleString()} detail="10–16 Oct · sample events" trend="Illustrative" />
      <Metric icon={<MessageSquareText size={17} />} label="New leads" value={freshLeads} detail={`${data.leads.length} enquiries in pipeline`} tone="brass" />
      <Metric icon={<CalendarClock size={17} />} label="Viewing requests" value={pendingViewings} detail="Awaiting internal review" tone="rust" />
      <Metric icon={<FilePlus2 size={17} />} label="Draft listings" value={draft} detail={`${closed} sold or rented`} />
      <Metric icon={<ArrowUpRight size={17} />} label="Inquiry conversion" value="—" detail="Unavailable without reliable tracking" />
    </div>

    <div className="admin-overview-grid overview-primary-grid">
      <section className="admin-panel chart-panel"><PanelHeading title="Property views & enquiries" detail="Daily · 10–16 October 2026" /><div className="chart-legend"><span><i className="legend-views" /> Property detail views</span><span><i className="legend-inquiries" /> Enquiries</span></div><div className="views-chart" role="img" aria-label="Illustrative daily property views from 10 to 16 October 2026">{data.analytics.daily.map((day) => <div className="views-chart-column" key={day.label} title={`${day.label}: ${day.views} sample views, ${day.inquiries} sample enquiries`}><div className="views-chart-bars"><span className="bar-views" style={{ height: `${Math.max(8, (day.views / maximumViews) * 100)}%` }} /><span className="bar-inquiries" style={{ height: `${Math.max(8, (day.inquiries / 12) * 100)}%` }} /></div><span>{day.label}</span></div>)}</div><div className="chart-footer"><span>Sample event data only</span><Link to="/admin/analytics">View analytics <ArrowRight size={13} /></Link></div></section>
      <section className="admin-panel sources-panel"><PanelHeading title="Inquiry sources" detail={`${data.analytics.sources.reduce((sum, source) => sum + source.count, 0)} illustrative demo events`} />{data.analytics.sources.map((source, index) => { const total = data.analytics.sources.reduce((sum, row) => sum + row.count, 0) || 1; return <div className="source-row" key={source.name}><div><span>{source.name}</span><strong>{source.count}</strong></div><div className="source-track"><i className={`source-fill source-fill-${index + 1}`} style={{ width: `${(source.count / total) * 100}%` }} /></div></div> })}<Link className="admin-panel-link" to="/admin/analytics">Explore analytics <ArrowRight size={13} /></Link></section>
    </div>

    <div className="admin-overview-grid overview-secondary-grid">
      <section className="admin-panel"><PanelHeading title="Most viewed properties" detail="Sample detail-page views · last 7 days" /><div className="top-properties-list">{topProperties.map((entry, index) => { const property = data.properties.find((item) => item.id === entry.propertyId); if (!property) return null; return <Link className="top-property-row" to={`/properties/${property.id}`} key={entry.propertyId}><span className="rank-number">0{index + 1}</span><img src={property.image} alt="" /><span className="top-property-name"><strong>{property.title}</strong><small>{property.location}</small></span><span className="top-property-views">{entry.views}<small>views</small></span></Link> })}</div></section>
      <section className="admin-panel"><PanelHeading title="Recent enquiries" detail="Latest activity in the local demo CRM" action={<Link to="/admin/leads">View all</Link>} /><div className="recent-leads-list">{data.leads.slice(0, 4).map((lead) => <Link className="recent-lead-row" to={`/admin/leads?lead=${lead.id}`} key={lead.id}><span className="lead-monogram">{lead.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="recent-lead-name"><strong>{lead.name}</strong><small>{lead.source} · {formatAdminDate(lead.createdAt)}</small></span><StatusPill status={lead.status} /></Link>)}</div></section>
      <section className="admin-panel"><PanelHeading title="Upcoming viewings" detail="Requested and confirmed · local schedule" action={<Link to="/admin/viewings">View calendar</Link>} /><div className="upcoming-list">{data.viewings.filter((item) => item.status === 'Requested' || item.status === 'Confirmed').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4).map((viewing) => { const property = data.properties.find((item) => item.id === viewing.propertyId); const lead = data.leads.find((item) => item.id === viewing.leadId); return <Link className="upcoming-row" to="/admin/viewings" key={viewing.id}><span className="upcoming-date"><strong>{new Date(`${viewing.date}T12:00:00`).getDate()}</strong><small>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${viewing.date}T12:00:00`))}</small></span><span><strong>{property?.title ?? 'Property request'}</strong><small>{lead?.name ?? 'Customer'} · {viewing.time}</small></span><StatusPill status={viewing.status} /></Link> })}</div></section>
      <section className="admin-panel activity-panel"><PanelHeading title="Recent activity" detail="Changes and submissions in this prototype" /><div className="activity-list">{data.activities.slice(0, 5).map((activity) => <div className="activity-row" key={activity.id}><span className={`activity-dot activity-${activity.type}`} /><div><p>{activity.message}</p><small>{formatAdminDate(activity.at, { day: 'numeric', month: 'short' })} · {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(activity.at))}</small></div></div>)}</div></section>
    </div>

    <section className="admin-quick-actions"><div><span className="admin-eyebrow">Keep things moving</span><h2>Quick actions</h2></div><Link to="/admin/properties/new"><Plus size={16} /><span><strong>Add a property</strong><small>Create a listing draft</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/media"><Upload size={16} /><span><strong>Upload media</strong><small>Add images to this session</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/leads"><Users size={16} /><span><strong>Review new leads</strong><small>{freshLeads} awaiting first contact</small></span><ArrowUpRight size={15} /></Link></section>
  </>
}

function Metric({ icon, label, value, detail, tone = 'default', trend }: { icon: React.ReactNode; label: string; value: string | number; detail: string; tone?: string; trend?: string }) {
  return <article className={`admin-metric metric-${tone}`}><div className="metric-top"><span>{icon}</span>{trend && <small>{trend}</small>}</div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-detail">{detail}</span></article>
}

function PanelHeading({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return <div className="admin-panel-heading"><div><h2>{title}</h2><p>{detail}</p></div>{action && <span>{action}</span>}</div>
}

function InfoIcon() { return <span className="demo-indicator">i</span> }
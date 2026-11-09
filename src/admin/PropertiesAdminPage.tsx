import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Check, ChevronDown, Copy, Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { assets } from '../data/assets'
import { useAdminData, type AdminRepository } from '../context/AdminDataContext'
import type { Property } from '../data/properties'
import { formatArea, formatPrice } from '../data/properties'
import { useToast, EmptyState, Modal, PageHeader, propertyStatuses, StatusPill } from './AdminUI'
import { AdminCreateButton } from './AdminLayout'

const pageSize = 8

export function PropertiesAdminPage() {
  const { data, updateData } = useAdminData()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('search') ?? '')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [transaction, setTransaction] = useState('')
  const [sort, setSort] = useState('created-new')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [deleteItem, setDeleteItem] = useState<Property | null>(null)
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    const search = params.get('search') ?? ''
    setQuery(search)
  }, [params])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return data.properties.filter((property) => {
      const matchesText = !needle || `${property.title} ${property.reference} ${property.location} ${property.neighborhood ?? ''}`.toLowerCase().includes(needle)
      return matchesText && (!status || (property.status ?? 'Published') === status) && (!category || property.category === category) && (!transaction || property.transaction === transaction)
    }).sort((a, b) => {
      if (sort === 'title-asc') return a.title.localeCompare(b.title)
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'status') return (a.status ?? 'Published').localeCompare(b.status ?? 'Published')
      return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
    })
  }, [data.properties, query, status, category, transaction, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  function setStatusFor(ids: string[], nextStatus: Property['status']) {
    updateData((current) => ({ ...current, properties: current.properties.map((property) => ids.includes(property.id) ? { ...property, status: nextStatus } : property) }), `${ids.length} ${ids.length === 1 ? 'property' : 'properties'} set to ${nextStatus}`)
    setSelected([])
    setBulkAction('')
    toast(`Updated ${ids.length} ${ids.length === 1 ? 'listing' : 'listings'}.`)
  }

  function duplicate(property: Property) {
    const referenceNumber = Math.max(0, ...data.properties.map((item) => Number(item.reference.match(/\d+$/)?.[0] ?? 0))) + 1
    const copy: Property = { ...property, id: `${property.id}-copy-${Date.now().toString().slice(-4)}`, title: `${property.title} (copy)`, reference: `AE-${String(referenceNumber).padStart(4, '0')}`, slug: `${property.slug ?? property.id}-copy`, status: 'Draft', featured: false, createdAt: new Date().toISOString().slice(0, 10) }
    updateData((current) => ({ ...current, properties: [copy, ...current.properties] }), `Draft created from ${property.title}`)
    toast('Duplicate created as a draft.')
  }

  function removeProperty() {
    if (!deleteItem) return
    updateData((current) => ({ ...current, properties: current.properties.filter((item) => item.id !== deleteItem.id), developments: current.developments.map((project) => ({ ...project, linkedPropertyIds: project.linkedPropertyIds?.filter((id) => id !== deleteItem.id) })) }), `${deleteItem.title} permanently deleted`)
    toast(`${deleteItem.title} was deleted.`, 'info')
    setDeleteItem(null)
  }

  function exportFiltered() {
    const header = ['Title', 'Reference', 'Location', 'Category', 'Transaction', 'Price', 'Currency', 'Status']
    const rows = filtered.map((item) => [item.title, item.reference, item.location, item.category, item.transaction, item.price, data.settings.currency, item.status ?? 'Published'])
    const content = [header, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'auren-properties.csv'; anchor.style.display = 'none'; document.body.append(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const allVisibleSelected = visible.length > 0 && visible.every((item) => selected.includes(item.id))
  function toggleAll() { setSelected(allVisibleSelected ? selected.filter((id) => !visible.some((item) => item.id === id)) : [...new Set([...selected, ...visible.map((item) => item.id)])]) }

  return <>
    <PageHeader eyebrow="Inventory management" title="Properties" description={`${filtered.length} listings in your local prototype workspace.`} actions={<><button className="admin-button admin-button-secondary" type="button" onClick={exportFiltered}><Download size={15} /> Export CSV</button><AdminCreateButton to="/admin/properties/new">Add property</AdminCreateButton></>} />
    <div className="admin-data-note"><span className="demo-indicator">i</span><span>Edits are saved to this browser and feed the public site in this session. This is not a shared or server-backed database.</span></div>
    <section className="admin-panel admin-table-panel">
      <div className="admin-table-toolbar"><label className="admin-table-search"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search title, reference or location" aria-label="Search properties" /><kbd>⌘ K</kbd></label><div className="admin-filter-controls"><select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option value="">All statuses</option>{propertyStatuses.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by type" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}><option value="">All types</option>{['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Land'].map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by transaction" value={transaction} onChange={(event) => { setTransaction(event.target.value); setPage(1) }}><option value="">Buy & rent</option><option>For sale</option><option>For rent</option></select><select aria-label="Sort properties" value={sort} onChange={(event) => setSort(event.target.value)}><option value="created-new">Newest</option><option value="title-asc">Title A–Z</option><option value="price-asc">Price low–high</option><option value="price-desc">Price high–low</option><option value="status">Status</option></select></div></div>
      {selected.length > 0 && <div className="admin-bulk-toolbar"><span>{selected.length} selected</span><select aria-label="Bulk status action" value={bulkAction} onChange={(event) => setBulkAction(event.target.value)}><option value="">Choose action</option><option value="Published">Publish selected</option><option value="Draft">Set as draft</option><option value="Archived">Archive selected</option></select><button className="admin-button admin-button-primary admin-button-small" disabled={!bulkAction} onClick={() => setStatusFor(selected, bulkAction as Property['status'])}>Apply</button><button className="admin-plain-button" onClick={() => setSelected([])}>Clear selection</button></div>}
      {filtered.length === 0 ? <EmptyState title="No properties found" description="Adjust your search and filters, or add the first listing to this workspace." action={<AdminCreateButton to="/admin/properties/new">Add property</AdminCreateButton>} /> : <>
        <div className="admin-table-scroll"><table className="admin-table property-admin-table"><thead><tr><th><input type="checkbox" aria-label="Select all properties on this page" checked={allVisibleSelected} onChange={toggleAll} /></th><th>Property</th><th>Reference</th><th>Type & transaction</th><th>Price</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((property) => <tr key={property.id}><td><input type="checkbox" aria-label={`Select ${property.title}`} checked={selected.includes(property.id)} onChange={() => setSelected((current) => current.includes(property.id) ? current.filter((id) => id !== property.id) : [...current, property.id])} /></td><td><div className="admin-property-cell"><img src={property.image} alt="" /><span><strong>{property.title}</strong><small>{property.location}</small></span></div></td><td className="table-reference">{property.reference}</td><td><span>{property.category}</span><small className="table-subline">{property.transaction}</small></td><td className="table-price">{property.priceOnRequest ? 'Price on request' : formatPrice(property.price, data.settings.currency, data.settings.locale)}{property.transaction === 'For rent' && <small className="table-subline">/ {property.rentPeriod ?? 'month'}</small>}</td><td><StatusPill status={property.status ?? 'Published'} /></td><td className="table-date">{property.createdAt ?? '—'}</td><td><PropertyActions property={property} onDuplicate={() => duplicate(property)} onDelete={() => setDeleteItem(property)} onStatus={(next) => setStatusFor([property.id], next)} /></td></tr>)}</tbody></table></div>
        <div className="admin-table-pagination"><span>Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div><button className="admin-icon-button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ArrowDown size={15} /></button><span>Page {page} of {pages}</span><button className="admin-icon-button" aria-label="Next page" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}><ArrowUp size={15} /></button></div></div>
      </>}
    </section>
    {deleteItem && <Modal title="Delete property?" onClose={() => setDeleteItem(null)}><p className="admin-confirm-copy">Permanently delete <strong>{deleteItem.title}</strong>? This also removes links to it from developments. This action cannot be undone.</p><div className="admin-form-actions"><button className="admin-button admin-button-secondary" onClick={() => setDeleteItem(null)}>Cancel</button><button className="admin-button admin-button-danger" onClick={removeProperty}><Trash2 size={15} /> Delete property</button></div></Modal>}
  </>
}

function PropertyActions({ property, onDuplicate, onDelete, onStatus }: { property: Property; onDuplicate: () => void; onDelete: () => void; onStatus: (status: Property['status']) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="admin-row-actions"><Link to={`/properties/${property.id}`} title="Preview property" aria-label={`Preview ${property.title}`}><Eye size={15} /></Link><Link to={`/admin/properties/${property.id}/edit`} title="Edit property" aria-label={`Edit ${property.title}`}><Pencil size={15} /></Link><div className="action-menu-wrap"><button type="button" aria-label={`More actions for ${property.title}`} aria-expanded={open} onClick={() => setOpen(!open)}><MoreHorizontal size={17} /></button>{open && <div className="admin-action-menu"><button onClick={() => { onDuplicate(); setOpen(false) }}><Copy size={14} /> Duplicate</button>{property.status === 'Published' ? <button onClick={() => { onStatus('Draft'); setOpen(false) }}><X size={14} /> Unpublish</button> : <button onClick={() => { onStatus('Published'); setOpen(false) }}><Check size={14} /> Publish</button>}<button onClick={() => { onStatus('Archived'); setOpen(false) }}><ArrowDown size={14} /> Archive</button><button className="is-danger" onClick={() => { onDelete(); setOpen(false) }}><Trash2 size={14} /> Delete</button></div>}</div></div>
}

function blankProperty(currencyCountry: string): Property {
  return { id: '', title: '', location: '', area: '', category: 'Villa', transaction: 'For sale', price: 0, beds: 3, baths: 2, size: 0, reference: '', yearAdded: new Date().getFullYear(), description: '', image: assets.hero, gallery: [assets.hero], amenities: [], status: 'Draft', featured: false, country: currencyCountry, county: '', neighborhood: '', address: '', parking: 0, priceOnRequest: false, rentPeriod: 'Month', slug: '', metaTitle: '', metaDescription: '', galleryAltTexts: [''] }
}

export function PropertyEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, updateData } = useAdminData()
  const toast = useToast()
  const existing = data.properties.find((property) => property.id === id)
  const isEditing = Boolean(id && existing)
  const [form, setForm] = useState<Property>(() => existing ? { ...existing, galleryAltTexts: existing.galleryAltTexts ?? [] } : blankProperty(data.settings.country))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [amenityText, setAmenityText] = useState(form.amenities.join(', '))

  useEffect(() => {
    if (existing) { setForm({ ...existing, galleryAltTexts: existing.galleryAltTexts ?? [] }); setAmenityText(existing.amenities.join(', ')) }
  }, [id])

  function update<K extends keyof Property>(key: K, value: Property[K]) { setForm((current) => ({ ...current, [key]: value })) }
  function save(status: Property['status']) {
    const nextErrors: Record<string, string> = {}
    if (!form.title.trim()) nextErrors.title = 'Enter a property title.'
    if (!form.reference.trim()) nextErrors.reference = 'Enter a unique property reference.'
    if (data.properties.some((property) => property.reference.toLowerCase() === form.reference.trim().toLowerCase() && property.id !== existing?.id)) nextErrors.reference = 'This reference is already in use.'
    if (!form.location.trim()) nextErrors.location = 'Enter a city or neighbourhood.'
    if (!form.description.trim()) nextErrors.description = 'Add a short property description.'
    if (!form.priceOnRequest && (!Number.isFinite(form.price) || form.price < 0)) nextErrors.price = 'Price must be a valid non-negative amount.'
    if (!Number.isFinite(form.beds) || form.beds < 0 || !Number.isInteger(form.beds)) nextErrors.beds = 'Use a whole number of bedrooms.'
    if (!Number.isFinite(form.baths) || form.baths < 0) nextErrors.baths = 'Bathrooms cannot be negative.'
    if (!Number.isFinite(form.size) || form.size < 0) nextErrors.size = 'Area must be a valid non-negative number.'
    const gallery = form.gallery.filter(Boolean)
    if (gallery.some((src) => !src.startsWith('/') && !/^https?:\/\//i.test(src))) nextErrors.gallery = 'Gallery references must be local paths or valid web URLs.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }

    const slug = (form.slug || form.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const propertyStatus = status ?? form.status ?? 'Draft'
    const property: Property = { ...form, id: (existing?.id ?? slug) || `property-${Date.now()}`, reference: form.reference.trim().toUpperCase(), status: propertyStatus, slug, gallery, image: gallery[0] ?? form.image, amenities: amenityText.split(',').map((item) => item.trim()).filter(Boolean), createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10) }
    updateData((current) => ({ ...current, properties: existing ? current.properties.map((item) => item.id === existing.id ? property : item) : [property, ...current.properties] }), `${existing ? 'Updated' : 'Created'} ${property.title} · ${status}`)
    toast(existing ? 'Property changes saved to this browser.' : `Property saved as ${propertyStatus.toLowerCase()}.`)
    navigate('/admin/properties')
  }

  if (id && !existing) return <div className="admin-page-wrap"><PageHeader title="Property not found" description="This record may have been removed from this browser." /><Link className="admin-button admin-button-secondary" to="/admin/properties">Back to properties</Link></div>

  return <div className="admin-page-wrap"><PageHeader eyebrow={isEditing ? `Editing ${existing?.reference}` : 'Guided listing setup'} title={isEditing ? 'Edit property' : 'Add property'} description="Add the details buyers need. Your changes update the public prototype immediately." actions={<Link className="admin-button admin-button-secondary" to="/admin/properties">Cancel</Link>} />
    {Object.keys(errors).length > 0 && <div className="admin-validation-summary" role="alert"><strong>Check these fields before saving</strong>{Object.values(errors).map((error) => <span key={error}>• {error}</span>)}</div>}
    <div className="property-editor-layout"><form className="admin-editor-form" onSubmit={(event: FormEvent) => event.preventDefault()}>
      <section className="admin-form-section"><div className="admin-form-section-heading"><span>01</span><div><h2>Basic information</h2><p>Give this listing a clear, useful identity.</p></div></div><div className="admin-form-grid"><Field label="Property title" error={errors.title} wide><input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. A considered family home" /></Field><Field label="Property reference" error={errors.reference}><input value={form.reference} onChange={(event) => update('reference', event.target.value)} placeholder="AE-0250" /></Field><Field label="Publication status"><select value={form.status} onChange={(event) => update('status', event.target.value as Property['status'])}>{propertyStatuses.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Property type"><select value={form.category} onChange={(event) => update('category', event.target.value as Property['category'])}>{['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Land'].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Transaction"><select value={form.transaction} onChange={(event) => update('transaction', event.target.value as Property['transaction'])}><option>For sale</option><option>For rent</option></select></Field><Field label="Assigned agent"><select value={form.agentId ?? ''} onChange={(event) => update('agentId', event.target.value || undefined)}><option value="">Unassigned</option>{data.agents.filter((agent) => agent.active).map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></Field><Field label="Description" error={errors.description} wide><textarea rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the property and what makes it distinctive." /></Field><label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => update('featured', event.target.checked)} /><span><strong>Feature on the website</strong><small>Use this listing in featured property sections.</small></span></label></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>02</span><div><h2>Pricing</h2><p>Set a price or mark the listing as price on request.</p></div></div><div className="admin-form-grid"><Field label={`Price (${data.settings.currency})`} error={errors.price}><input type="number" min="0" step="1" value={form.price || ''} disabled={form.priceOnRequest} onChange={(event) => update('price', Number(event.target.value))} placeholder="0" /></Field><Field label="Rent period"><select value={form.rentPeriod ?? 'Month'} disabled={form.transaction !== 'For rent'} onChange={(event) => update('rentPeriod', event.target.value as Property['rentPeriod'])}><option>Month</option><option>Week</option><option>Year</option></select></Field><label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(form.priceOnRequest)} onChange={(event) => update('priceOnRequest', event.target.checked)} /><span><strong>Price on request</strong><small>Hide the numeric amount on public pages.</small></span></label></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>03</span><div><h2>Location</h2><p>Help customers understand where this property sits.</p></div></div><div className="admin-form-grid"><Field label="Country"><input value={form.country ?? data.settings.country} onChange={(event) => update('country', event.target.value)} /></Field><Field label="County / region"><input value={form.county ?? ''} onChange={(event) => update('county', event.target.value)} placeholder="Nairobi County" /></Field><Field label="City"><input value={form.area} onChange={(event) => update('area', event.target.value)} placeholder="Nairobi" /></Field><Field label="Neighbourhood" error={errors.location}><input value={form.neighborhood ?? form.location} onChange={(event) => { update('neighborhood', event.target.value); update('location', event.target.value ? `${event.target.value}, ${form.area || 'Kenya'}` : '') }} placeholder="Karen" /></Field><Field label="Street address" wide><input value={form.address ?? ''} onChange={(event) => update('address', event.target.value)} placeholder="Optional; not shown publicly unless enabled" /></Field><Field label="Map latitude"><input type="number" step="any" value={form.latitude ?? ''} onChange={(event) => update('latitude', event.target.value ? Number(event.target.value) : undefined)} placeholder="Optional" /></Field><Field label="Map longitude"><input type="number" step="any" value={form.longitude ?? ''} onChange={(event) => update('longitude', event.target.value ? Number(event.target.value) : undefined)} placeholder="Optional" /></Field></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>04</span><div><h2>Property details</h2><p>Use the configured measurement unit: {data.settings.areaUnit}.</p></div></div><div className="admin-form-grid"><Field label="Bedrooms" error={errors.beds}><input type="number" min="0" step="1" value={form.beds} onChange={(event) => update('beds', Number(event.target.value))} /></Field><Field label="Bathrooms" error={errors.baths}><input type="number" min="0" step="0.5" value={form.baths} onChange={(event) => update('baths', Number(event.target.value))} /></Field><Field label={`Floor area (${data.settings.areaUnit})`} error={errors.size}><input type="number" min="0" step="any" value={form.size || ''} onChange={(event) => update('size', Number(event.target.value))} /></Field><Field label={`Plot area (${data.settings.areaUnit})`}><input type="number" min="0" step="any" value={form.plot ?? ''} onChange={(event) => update('plot', event.target.value ? Number(event.target.value) : undefined)} /></Field><Field label="Parking spaces"><input type="number" min="0" step="1" value={form.parking ?? 0} onChange={(event) => update('parking', Number(event.target.value))} /></Field><Field label="Year built"><input type="number" min="1800" max="2100" value={form.yearBuilt ?? ''} onChange={(event) => update('yearBuilt', event.target.value ? Number(event.target.value) : undefined)} placeholder="Optional" /></Field></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>05</span><div><h2>Features & amenities</h2><p>Separate items with commas.</p></div></div><Field label="Amenities"><textarea rows={3} value={amenityText} onChange={(event) => setAmenityText(event.target.value)} placeholder="Private garden, Covered terrace, Solar backup" /></Field><div className="admin-form-grid admin-form-grid-spaced"><Field label="Nearby facilities" wide><input value={form.nearbyFacilities?.join(', ') ?? ''} onChange={(event) => update('nearbyFacilities', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="Schools, parks, shopping" /></Field><Field label="Link to development" wide><select value={form.developmentId ?? ''} onChange={(event) => update('developmentId', event.target.value || undefined)}><option value="">No associated development</option>{data.developments.filter((project) => project.publicationStatus !== 'Archived').map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}</select></Field></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>06</span><div><h2>Media</h2><p>Use existing local references or links. New uploads are managed in the session-only media library.</p></div></div><Field label="Gallery image references" error={errors.gallery} help="One local asset path or HTTPS image URL per line. First image is the cover."><textarea rows={5} value={form.gallery.join('\n')} onChange={(event) => { const gallery = event.target.value.split('\n').map((item) => item.trim()).filter(Boolean); update('gallery', gallery); update('image', gallery[0] ?? '') }} /></Field><div className="admin-editor-gallery-preview">{form.gallery.slice(0, 4).map((src, index) => <div key={`${src}-${index}`}><img src={src} alt={form.galleryAltTexts?.[index] || `${form.title || 'Property'} image ${index + 1}`} onError={(event) => { event.currentTarget.style.opacity = '0.25' }} /><span>{index === 0 ? 'Cover image' : `Gallery ${index + 1}`}</span></div>)}</div><div className="admin-form-grid admin-form-grid-spaced"><Field label="Image alternative text" wide><input value={form.galleryAltTexts?.[0] ?? ''} onChange={(event) => update('galleryAltTexts', [event.target.value, ...(form.galleryAltTexts?.slice(1) ?? [])])} placeholder="Describe the cover image" /></Field><Field label="Floor-plan image reference"><input value={form.floorPlanImage ?? ''} onChange={(event) => update('floorPlanImage', event.target.value)} placeholder="Optional local path or HTTPS URL" /></Field><Field label="Video URL"><input type="url" value={form.videoUrl ?? ''} onChange={(event) => update('videoUrl', event.target.value)} placeholder="Optional HTTPS link" /></Field></div></section>

      <section className="admin-form-section"><div className="admin-form-section-heading"><span>07</span><div><h2>SEO & publishing</h2><p>These fields prepare the public listing and search preview.</p></div></div><div className="admin-form-grid"><Field label="URL slug"><input value={form.slug ?? ''} onChange={(event) => update('slug', event.target.value)} placeholder="Generated from the title" /></Field><Field label="Meta title"><input value={form.metaTitle ?? ''} onChange={(event) => update('metaTitle', event.target.value)} placeholder={form.title || 'Search title'} /></Field><Field label="Meta description" wide><textarea rows={3} value={form.metaDescription ?? ''} onChange={(event) => update('metaDescription', event.target.value)} maxLength={180} placeholder="Short summary for search results" /></Field></div></section>
      <div className="admin-editor-actions"><Link className="admin-button admin-button-secondary" to="/admin/properties">Cancel</Link><button className="admin-button admin-button-secondary" type="button" onClick={() => save('Draft')}>Save draft</button><button className="admin-button admin-button-primary" type="button" onClick={() => save(form.status === 'Draft' ? 'Published' : form.status)}>{form.status === 'Draft' ? 'Publish listing' : 'Save changes'} <ArrowUpRight size={15} /></button></div>
    </form>
    <aside className="admin-editor-aside"><div className="admin-panel editor-preview-panel"><span className="admin-eyebrow">Listing preview</span><img src={form.gallery[0] || form.image || assets.hero} alt="" /><span className="admin-property-preview-status"><StatusPill status={form.status ?? 'Draft'} /></span><h3>{form.title || 'Your property title'}</h3><p>{form.location || 'Location appears here'}</p><strong>{form.priceOnRequest ? 'Price on request' : form.price ? formatPrice(form.price, data.settings.currency, data.settings.locale) : 'Add a price'}</strong>{form.id && <Link to={`/properties/${form.id}`} target="_blank">Preview public page <ArrowUpRight size={13} /></Link>}</div><div className="admin-panel editor-tip"><span className="admin-eyebrow">A useful detail</span><p>Drafts stay out of the public collection. Publishing makes this record visible to public listing pages immediately in this browser.</p></div></aside></div>
  </div>
}

function Field({ label, children, error, help, wide }: { label: string; children: React.ReactNode; error?: string; help?: string; wide?: boolean }) {
  return <label className={`admin-field ${wide ? 'field-wide' : ''} ${error ? 'has-error' : ''}`}><span>{label}</span>{children}{help && <small>{help}</small>}{error && <small className="field-error">{error}</small>}</label>
}
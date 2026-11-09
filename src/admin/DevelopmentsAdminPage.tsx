import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, Building2, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminData } from '../context/AdminDataContext'
import type { Development } from '../data/developments'
import { formatPrice } from '../data/properties'
import { AdminCreateButton } from './AdminLayout'
import { EmptyState, Modal, PageHeader, StatusPill, useToast, developmentStatuses } from './AdminUI'

const emptyDevelopment = (): Development => ({ id: '', title: '', location: '', status: 'Planning', priceFrom: 0, types: [], amenities: [], image: '/assets/modern-houses.jpg', description: '', publicationStatus: 'Draft', featured: false, linkedPropertyIds: [], metaTitle: '', metaDescription: '' })

export default function DevelopmentsAdminPage() {
  const { data, updateData } = useAdminData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [publication, setPublication] = useState('')
  const [editing, setEditing] = useState<Development | null>(null)
  const [form, setForm] = useState<Development>(emptyDevelopment())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleting, setDeleting] = useState<Development | null>(null)

  const rows = useMemo(() => data.developments.filter((project) => `${project.title} ${project.location}`.toLowerCase().includes(query.toLowerCase()) && (!publication || (project.publicationStatus ?? 'Published') === publication)), [data.developments, query, publication])
  function startNew() { setEditing(emptyDevelopment()); setErrors({}); setForm(emptyDevelopment()) }
  function startEdit(project: Development) { setEditing(project); setErrors({}); setForm({ ...project }) }
  function setField<K extends keyof Development>(key: K, value: Development[K]) { setForm((current) => ({ ...current, [key]: value })) }

  function save(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Enter a project title.'
    if (!form.location.trim()) next.location = 'Enter a project location.'
    if (!form.description.trim()) next.description = 'Add a project description.'
    if (!Number.isFinite(form.priceFrom) || form.priceFrom < 0) next.priceFrom = 'Starting price must be zero or higher.'
    setErrors(next)
    if (Object.keys(next).length) return
    const isEditing = Boolean(editing?.id)
    const project: Development = { ...form, id: editing?.id || `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`, types: form.types.filter(Boolean), amenities: form.amenities.filter(Boolean), metaTitle: form.metaTitle || form.title, metaDescription: form.metaDescription || form.description.slice(0, 150) }
    updateData((current) => ({ ...current, developments: isEditing ? current.developments.map((item) => item.id === editing?.id ? project : item) : [project, ...current.developments] }), `${isEditing ? 'Updated' : 'Created'} development ${project.title}`)
    toast(isEditing ? 'Development changes saved.' : 'Development added to the local workspace.')
    setEditing(null)
  }

  function removeProject() {
    if (!deleting) return
    updateData((current) => ({ ...current, developments: current.developments.filter((item) => item.id !== deleting.id), properties: current.properties.map((property) => property.developmentId === deleting.id ? { ...property, developmentId: undefined } : property) }), `Deleted development ${deleting.title} and unlinked its properties`)
    toast('Development deleted; linked properties remain in the inventory.', 'info')
    setDeleting(null)
  }

  function setPublicationStatus(project: Development, nextStatus: Development['publicationStatus']) {
    updateData((current) => ({ ...current, developments: current.developments.map((item) => item.id === project.id ? { ...item, publicationStatus: nextStatus } : item) }), `${project.title} set to ${nextStatus}`)
    toast(`Project set to ${nextStatus?.toLowerCase()}.`)
  }

  return <>
    <PageHeader eyebrow="Project portfolio" title="Developments" description={`${data.developments.length} project records · manage status, units and linked properties.`} actions={<button className="admin-button admin-button-primary" type="button" onClick={startNew}><Plus size={16} /> Add development</button>} />
    <div className="admin-data-note"><span className="demo-indicator">i</span><span>Project details and prices are fictional demo records. Changes persist in this browser only.</span></div>
    <section className="admin-panel admin-table-panel"><div className="admin-table-toolbar"><label className="admin-table-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search project or location" aria-label="Search developments" /></label><div className="admin-filter-controls"><select value={publication} onChange={(event) => setPublication(event.target.value)} aria-label="Filter by publication status"><option value="">All publication states</option>{developmentStatuses.map((status) => <option key={status}>{status}</option>)}</select><span className="admin-result-count">{rows.length} projects</span></div></div>
      {rows.length === 0 ? <EmptyState title="No projects found" description="Try another search or add a development to this workspace." action={<button className="admin-button admin-button-primary" onClick={startNew}><Plus size={15} /> Add development</button>} /> : <div className="admin-development-list">{rows.map((project) => {
        const linked = data.properties.filter((property) => property.developmentId === project.id || project.linkedPropertyIds?.includes(property.id)).length
        return <article className="admin-development-row" key={project.id}><img src={project.image || '/assets/modern-houses.jpg'} alt="" /><div className="admin-development-info"><div><span className="admin-eyebrow">{project.location}</span><div className="admin-development-title"><h2>{project.title}</h2><StatusPill status={project.publicationStatus ?? 'Published'} /></div><p>{project.description}</p><div className="admin-development-tags">{project.types.slice(0, 3).map((type) => <span key={type}>{type}</span>)}<span><Building2 size={12} /> {linked} linked properties</span></div></div><div className="admin-development-price"><small>{project.status}</small><strong>{formatPrice(project.priceFrom, data.settings.currency, data.settings.locale)}</strong><span>starting price · demo</span></div><div className="admin-row-actions"><Link to="/developments" target="_blank" title="Preview developments" aria-label={`Preview ${project.title}`}><Eye size={15} /></Link><button title="Edit development" aria-label={`Edit ${project.title}`} onClick={() => startEdit(project)}><Pencil size={15} /></button><DevelopmentActions project={project} onStatus={(next) => setPublicationStatus(project, next)} onDelete={() => setDeleting(project)} /></div></div></article>
      })}</div>}
    </section>
    {editing !== null && <DevelopmentModal title={editing.id ? 'Edit development' : 'Add development'} form={form} errors={errors} currency={data.settings.currency} properties={data.properties} setField={setField} onSubmit={save} onClose={() => setEditing(null)} />}
    {deleting && <Modal title="Delete development?" onClose={() => setDeleting(null)}><p className="admin-confirm-copy">Delete <strong>{deleting.title}</strong>? Any linked property records will remain and be unlinked from this project.</p><div className="admin-form-actions"><button className="admin-button admin-button-secondary" onClick={() => setDeleting(null)}>Cancel</button><button className="admin-button admin-button-danger" onClick={removeProject}><Trash2 size={15} /> Delete project</button></div></Modal>}
  </>
}

function DevelopmentActions({ project, onStatus, onDelete }: { project: Development; onStatus: (status: Development['publicationStatus']) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  return <div className="action-menu-wrap"><button title="More project actions" aria-label={`More actions for ${project.title}`} onClick={() => setOpen(!open)}><MoreHorizontal size={17} /></button>{open && <div className="admin-action-menu">{project.publicationStatus === 'Published' ? <button onClick={() => { onStatus('Draft'); setOpen(false) }}>Unpublish</button> : <button onClick={() => { onStatus('Published'); setOpen(false) }}>Publish</button>}<button onClick={() => { onStatus('Archived'); setOpen(false) }}>Archive</button><button className="is-danger" onClick={() => { onDelete(); setOpen(false) }}><Trash2 size={14} /> Delete</button></div>}</div>
}

function DevelopmentModal({ title, form, errors, currency, properties, setField, onSubmit, onClose }: { title: string; form: Development; errors: Record<string, string>; currency: string; properties: import('../data/properties').Property[]; setField: <K extends keyof Development>(key: K, value: Development[K]) => void; onSubmit: (event: FormEvent) => void; onClose: () => void }) {
  return <Modal title={title} onClose={onClose} size="large"><form className="admin-modal-form" onSubmit={onSubmit}><div className="admin-form-grid"><AdminField label="Project title" error={errors.title} wide><input value={form.title} onChange={(event) => setField('title', event.target.value)} /></AdminField><AdminField label="Location" error={errors.location}><input value={form.location} onChange={(event) => setField('location', event.target.value)} /></AdminField><AdminField label="Project stage"><select value={form.status} onChange={(event) => setField('status', event.target.value)}>{['Planning', 'In progress', 'Now selling', 'Completed', 'Paused'].map((status) => <option key={status}>{status}</option>)}</select></AdminField><AdminField label="Publication status"><select value={form.publicationStatus ?? 'Draft'} onChange={(event) => setField('publicationStatus', event.target.value as Development['publicationStatus'])}>{developmentStatuses.map((status) => <option key={status}>{status}</option>)}</select></AdminField><AdminField label={`Starting price (${currency})`} error={errors.priceFrom}><input type="number" min="0" value={form.priceFrom || ''} onChange={(event) => setField('priceFrom', Number(event.target.value))} /></AdminField><AdminField label="Project description" wide error={errors.description}><textarea rows={4} value={form.description} onChange={(event) => setField('description', event.target.value)} /></AdminField><AdminField label="Available property types" wide help="Separate with commas."><input value={form.types.join(', ')} onChange={(event) => setField('types', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></AdminField><AdminField label="Available units"><input type="number" min="0" value={form.availableUnits ?? ''} onChange={(event) => setField('availableUnits', event.target.value ? Number(event.target.value) : undefined)} placeholder="Optional" /></AdminField><AdminField label="Amenities" wide help="Separate with commas."><input value={form.amenities.join(', ')} onChange={(event) => setField('amenities', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></AdminField><AdminField label="Image reference" wide><input value={form.image} onChange={(event) => setField('image', event.target.value)} placeholder="/assets/project-image.jpg" /></AdminField><AdminField label="Link properties" wide><select multiple size={Math.min(5, Math.max(2, properties.length))} value={form.linkedPropertyIds ?? []} onChange={(event) => setField('linkedPropertyIds', Array.from(event.target.selectedOptions, (option) => option.value))}>{properties.map((property) => <option value={property.id} key={property.id}>{property.title} · {property.reference}</option>)}</select></AdminField><AdminField label="Meta title"><input value={form.metaTitle ?? ''} onChange={(event) => setField('metaTitle', event.target.value)} /></AdminField><AdminField label="Meta description"><input value={form.metaDescription ?? ''} onChange={(event) => setField('metaDescription', event.target.value)} maxLength={180} /></AdminField><label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setField('featured', event.target.checked)} /><span><strong>Feature on website</strong><small>Promote this development in featured sections.</small></span></label></div><div className="admin-form-actions"><button className="admin-button admin-button-secondary" type="button" onClick={onClose}>Cancel</button><button className="admin-button admin-button-primary" type="submit">Save development <ArrowUpRight size={15} /></button></div></form></Modal>
}

function AdminField({ label, children, error, help, wide }: { label: string; children: React.ReactNode; error?: string; help?: string; wide?: boolean }) { return <label className={`admin-field ${wide ? 'field-wide' : ''} ${error ? 'has-error' : ''}`}><span>{label}</span>{children}{help && <small>{help}</small>}{error && <small className="field-error">{error}</small>}</label> }
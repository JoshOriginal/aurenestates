import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Check, Copy, Download, ImagePlus, Plus, Search, Trash2, Upload, UserRound, X } from 'lucide-react'
import { useAdminData, getAdminMediaSeed, type Agent } from '../context/AdminDataContext'
import { useToast, EmptyState, Modal, PageHeader, StatusPill } from './AdminUI'

const suppliedMedia = getAdminMediaSeed().map((media) => ({ ...media, source: 'supplied' as const, bytes: null as number | null, width: 1280, height: 720, kind: 'image' as const }))
type MediaItem = Omit<typeof suppliedMedia[number], 'source'> & { source: 'supplied' | 'session'; bytes: number | null; width: number; height: number; kind: 'image'; url: string }

export function TeamAdminPage() {
  const { data, updateData } = useAdminData()
  const toast = useToast()
  const [editing, setEditing] = useState<Agent | null>(null)
  const [form, setForm] = useState<Agent>(blankAgent())
  const [search, setSearch] = useState('')
  const [errors, setErrors] = useState('')
  const rows = data.agents.filter((agent) => `${agent.name} ${agent.title} ${agent.specialties.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  function openNew() { setEditing(null); setErrors(''); setForm(blankAgent()) }
  function openEdit(agent: Agent) { setEditing(agent); setErrors(''); setForm({ ...agent }) }
  function save(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setErrors('Name and email are required.'); return }
    updateData((current) => ({ ...current, agents: editing ? current.agents.map((agent) => agent.id === editing.id ? form : agent) : [{ ...form, id: `agent-${Date.now()}` }, ...current.agents] }), `${editing ? 'Updated' : 'Added'} team member ${form.name}`)
    toast(editing ? 'Team profile updated.' : 'Team member added.'); setEditing(null)
  }
  function toggleActive(agent: Agent) { updateData((current) => ({ ...current, agents: current.agents.map((item) => item.id === agent.id ? { ...item, active: !item.active } : item) }), `${agent.name} ${agent.active ? 'deactivated' : 'activated'}`); toast(`${agent.name} ${agent.active ? 'deactivated' : 'activated'} in this prototype.`, 'info') }

  return <>
    <PageHeader eyebrow="People & permissions" title="Agents & team" description="Manage the profiles assigned to property and customer records." actions={<button className="admin-button admin-button-primary" onClick={openNew}><Plus size={16} /> Add team member</button>} />
    <div className="admin-data-note"><span className="demo-indicator">i</span><span>Profiles and assignments are prototype data. This screen does not manage user accounts or enforce permissions.</span></div>
    <section className="admin-panel admin-table-panel"><div className="admin-table-toolbar"><label className="admin-table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team members" aria-label="Search team members" /></label><span className="admin-result-count">{rows.length} people · {data.agents.filter((agent) => agent.active).length} active</span></div>
      {rows.length ? <div className="team-grid">{rows.map((agent) => <article className="team-card" key={agent.id}><div className="team-card-top"><div className="team-avatar">{agent.profileImage ? <img src={agent.profileImage} alt={agent.name} /> : agent.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><StatusPill status={agent.active ? 'Active' : 'Inactive'} /><button className="admin-plain-button" onClick={() => openEdit(agent)}>Edit</button></div><h2>{agent.name}</h2><span className="team-title">{agent.title}</span><p>{agent.bio || 'No biography added.'}</p><div className="team-specialties">{agent.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}</div><div className="team-contact"><a href={`mailto:${agent.email}`}>{agent.email}</a><a href={`tel:${agent.phone.replaceAll(' ', '')}`}>{agent.phone}</a></div><div className="team-assignment"><span>Assigned leads<strong>{data.leads.filter((lead) => lead.assignedAgentId === agent.id && !['Won', 'Lost'].includes(lead.status)).length}</strong></span><span>Properties<strong>{data.properties.filter((property) => property.agentId === agent.id).length}</strong></span></div><button className={`admin-button ${agent.active ? 'admin-button-secondary' : 'admin-button-primary'} admin-button-small team-toggle`} onClick={() => toggleActive(agent)}>{agent.active ? 'Set inactive' : 'Activate profile'}</button></article>)}</div> : <EmptyState title="No team members match" description="Adjust your search or add a profile to the team." action={<button className="admin-button admin-button-primary" onClick={openNew}><Plus size={15} /> Add team member</button>} />}
    </section>
    {editing !== null && <Modal title={editing.id ? 'Edit team profile' : 'Add team member'} onClose={() => setEditing(null)}><form className="admin-modal-form" onSubmit={save}>{errors && <p className="field-error" role="alert">{errors}</p>}<AdminField label="Full name"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></AdminField><AdminField label="Role title"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Property advisor" /></AdminField><AdminField label="Email"><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></AdminField><AdminField label="Phone"><input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></AdminField><AdminField label="Biography"><textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></AdminField><AdminField label="Specialties" help="Separate with commas."><input value={form.specialties.join(', ')} onChange={(event) => setForm({ ...form, specialties: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></AdminField><AdminField label="Profile image reference"><input value={form.profileImage ?? ''} onChange={(event) => setForm({ ...form, profileImage: event.target.value })} placeholder="Optional local image path" /></AdminField><label className="admin-checkbox-field"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /><span><strong>Active profile</strong><small>Inactive agents remain in historical records.</small></span></label><div className="admin-form-actions"><button type="button" className="admin-button admin-button-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-button admin-button-primary" type="submit">Save profile</button></div></form></Modal>}
  </>
}

function blankAgent(): Agent { return { id: '', name: '', title: '', email: '', phone: '', bio: '', specialties: [], active: true } }

export function MediaAdminPage() {
  const { data, updateData } = useAdminData()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadUrls = useRef<string[]>([])
  const [uploads, setUploads] = useState<MediaItem[]>([])
  const [media, setMedia] = useState(suppliedMedia as MediaItem[])
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [type, setType] = useState('')
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [targetProperty, setTargetProperty] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const visible = useMemo(() => media.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (!type || item.kind === type)), [media, query, type])
  const usedMedia = new Set(data.properties.flatMap((property) => [property.image, ...property.gallery]).concat(data.developments.map((development) => development.image)))

  useEffect(() => () => uploadUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

  function receiveFiles(files: FileList | File[]) {
    const valid: MediaItem[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) { toast(`${file.name} was skipped: only images are accepted.`, 'error'); continue }
      if (file.size > 5 * 1024 * 1024) { toast(`${file.name} was skipped: maximum file size is 5 MB.`, 'error'); continue }
      const src = URL.createObjectURL(file)
      uploadUrls.current.push(src)
      const item: MediaItem = { id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: file.name, src, url: src, alt: '', source: 'session', bytes: file.size, width: 0, height: 0, kind: 'image' }
      const image = new Image(); image.onload = () => setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, width: image.naturalWidth, height: image.naturalHeight } : entry)); image.src = src
      valid.push(item)
    }
    if (valid.length) { setUploads((current) => [...valid, ...current]); setMedia((current) => [...valid, ...current]); toast(`${valid.length} image${valid.length === 1 ? '' : 's'} added for this browser session.`, 'info') }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) { if (event.target.files) receiveFiles(event.target.files); event.target.value = '' }
  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); receiveFiles(event.dataTransfer.files) }
  function updateAlt(id: string, alt: string) { setMedia((current) => current.map((item) => item.id === id ? { ...item, alt } : item)) }
  async function copyReference(item: MediaItem) { try { await navigator.clipboard.writeText(item.src); toast('Asset reference copied.') } catch { toast(item.src, 'info') } }
  function useSelected() {
    if (!targetProperty || selected.length === 0) { toast('Choose a property and at least one supplied image.', 'error'); return }
    if (selected.some((id) => uploads.some((upload) => upload.id === id))) { toast('Session uploads cannot be added to saved listings because they do not persist. Use a supplied asset or configure storage.', 'error'); return }
    const refs = selected.map((id) => media.find((item) => item.id === id)?.src).filter((src): src is string => Boolean(src))
    updateData((current) => ({ ...current, properties: current.properties.map((property) => property.id === targetProperty ? { ...property, gallery: [...new Set([...property.gallery, ...refs])], image: property.image || refs[0] } : property) }), `Added ${refs.length} supplied media reference${refs.length === 1 ? '' : 's'} to ${data.properties.find((item) => item.id === targetProperty)?.title ?? 'property'}`)
    setSelected([]); toast('Supplied media added to the property gallery.')
  }
  function moveItem(item: MediaItem, direction: number) {
    const index = media.findIndex((entry) => entry.id === item.id); const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= media.length) return
    setMedia((current) => { const copy = [...current]; [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]]; return copy })
  }
  function removeUpload() {
    if (!deleteTarget) return
    if (usedMedia.has(deleteTarget.src)) { toast('This image is still referenced by content and cannot be removed.', 'error'); setDeleteTarget(null); return }
    URL.revokeObjectURL(deleteTarget.src); uploadUrls.current = uploadUrls.current.filter((url) => url !== deleteTarget.src); setUploads((current) => current.filter((item) => item.id !== deleteTarget.id)); setMedia((current) => current.filter((item) => item.id !== deleteTarget.id)); setDeleteTarget(null); toast('Session upload removed.', 'info')
  }

  return <>
    <PageHeader eyebrow="Images & creative assets" title="Media library" description={`${visible.length} assets · supplied originals are preserved.`} actions={<button className="admin-button admin-button-primary" onClick={() => inputRef.current?.click()}><Upload size={15} /> Upload images</button>} />
    <div className="admin-data-note"><span className="demo-indicator">i</span><span>Supplied media uses existing project files. Uploads create temporary browser URLs only and disappear when this page is reloaded; no file is uploaded to a server.</span></div>
    <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleInput} />
    <div className={`admin-upload-drop ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}><ImagePlus size={22} /><span><strong>Drop images to add them to this session</strong><small>JPEG, PNG, WebP or GIF · maximum 5 MB per file</small></span><button className="admin-button admin-button-secondary admin-button-small" onClick={() => inputRef.current?.click()}>Browse files</button></div>
    <section className="admin-panel admin-table-panel"><div className="admin-table-toolbar"><label className="admin-table-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by filename" aria-label="Search media" /></label><div className="admin-filter-controls"><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter media type"><option value="">All media</option><option value="image">Images</option></select><div className="admin-view-tabs compact-tabs"><button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')}>Grid</button><button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}>List</button></div></div></div>
      {selected.length > 0 && <div className="admin-bulk-toolbar"><span>{selected.length} selected</span><select value={targetProperty} onChange={(event) => setTargetProperty(event.target.value)} aria-label="Choose property for selected media"><option value="">Add to property…</option>{data.properties.map((property) => <option value={property.id} key={property.id}>{property.title}</option>)}</select><button className="admin-button admin-button-primary admin-button-small" onClick={useSelected}>Use selected</button><button className="admin-plain-button" onClick={() => setSelected([])}>Clear</button></div>}
      {visible.length === 0 ? <EmptyState title="No media matches" description="Try another filename or add images for the current browser session." /> : <div className={`media-grid ${view === 'list' ? 'media-list-view' : ''}`}>{visible.map((item, index) => { const isUsed = usedMedia.has(item.src); return <article className="media-card" key={item.id}><div className="media-card-image"><img src={item.src} alt={item.alt} /><label className="media-select"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} aria-label={`Select ${item.name}`} /><span /></label><span className="media-origin">{item.source === 'supplied' ? 'Project asset' : 'Session only'}</span></div><div className="media-card-content"><strong title={item.name}>{item.name}</strong><span>{item.width ? `${item.width} × ${item.height}` : 'Reading dimensions…'}{item.bytes ? ` · ${(item.bytes / 1024).toFixed(0)} KB` : ''}</span><label className="media-alt-field">Alt text<input value={item.alt} onChange={(event) => updateAlt(item.id, event.target.value)} placeholder="Describe this image" /></label><div className="media-card-actions"><button title="Copy asset reference" aria-label={`Copy reference for ${item.name}`} onClick={() => copyReference(item)}><Copy size={14} /></button><button title="Move earlier" aria-label={`Move ${item.name} earlier`} onClick={() => moveItem(item, -1)} disabled={index === 0}><ArrowUp size={14} /></button><button title="Move later" aria-label={`Move ${item.name} later`} onClick={() => moveItem(item, 1)} disabled={index === visible.length - 1}><ArrowDown size={14} /></button>{item.source === 'session' ? <button title={isUsed ? 'In use' : 'Remove upload'} aria-label={`Remove ${item.name}`} disabled={isUsed} onClick={() => setDeleteTarget(item)}><Trash2 size={14} /></button> : <span className="media-protected"><Check size={13} /> Original protected</span>}</div></div></article> })}</div>}
    </section>
    {deleteTarget && <Modal title="Remove session upload?" onClose={() => setDeleteTarget(null)}><p className="admin-confirm-copy">Remove <strong>{deleteTarget.name}</strong> from this browser session? Project-supplied files are never deleted here.</p><div className="admin-form-actions"><button className="admin-button admin-button-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="admin-button admin-button-danger" onClick={removeUpload}><Trash2 size={15} /> Remove upload</button></div></Modal>}
  </>
}

function AdminField({ label, children, help }: { label: string; children: React.ReactNode; help?: string }) { return <label className="admin-field"><span>{label}</span>{children}{help && <small>{help}</small>}</label> }
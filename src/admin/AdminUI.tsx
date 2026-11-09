import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Check, Info, X } from 'lucide-react'

type ToastMessage = { id: number; message: string; kind: 'success' | 'error' | 'info' }
const ToastContext = createContext<(message: string, kind?: ToastMessage['kind']) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  function toast(message: string, kind: ToastMessage['kind'] = 'success') {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, kind }])
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3800)
  }
  return <ToastContext.Provider value={toast}>{children}<div className="admin-toasts" role="status" aria-live="polite">{toasts.map((item) => <div className={`admin-toast toast-${item.kind}`} key={item.id}><span>{item.kind === 'success' ? <Check size={16} /> : <Info size={16} />}</span>{item.message}<button type="button" onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))} aria-label="Dismiss notification"><X size={14} /></button></div>)}</div></ToastContext.Provider>
}

export function useToast() { return useContext(ToastContext) }

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="admin-page-header"><div><div className="admin-breadcrumb"><span>Workspace</span><span>/</span><strong>{title}</strong></div>{eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="admin-header-actions">{actions}</div>}</div>
}

export function Modal({ title, onClose, children, size = 'medium' }: { title: string; onClose: () => void; children: ReactNode; size?: 'medium' | 'large' }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`admin-modal admin-modal-${size}`} role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></header><div className="admin-modal-content">{children}</div></section></div>
}

export function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')
  return <span className={`admin-status status-${key}`}>{status}</span>
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="admin-empty"><span className="admin-empty-mark"><Info size={20} /></span><h2>{title}</h2><p>{description}</p>{action}</div>
}

export function formatAdminDate(date: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!date) return 'Not set'
  return new Intl.DateTimeFormat('en-KE', options).format(new Date(`${date.slice(0, 10)}T12:00:00`))
}

export function csvCell(value: unknown) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function downloadCsv(filename: string, rows: (string | number | undefined)[][]) {
  const content = rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const propertyStatuses = ['Published', 'Draft', 'Sold', 'Rented', 'Archived'] as const
export const developmentStatuses = ['Published', 'Draft', 'Archived'] as const
export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Viewing scheduled', 'Negotiation', 'Won', 'Lost'] as const
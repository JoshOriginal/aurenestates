import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useAdminData } from '../context/AdminDataContext'

export function InquiryForm({ title = 'Start a conversation', context = 'General enquiry', viewing = false, propertyId, developmentTitle }: { title?: string; context?: string; viewing?: boolean; propertyId?: string; developmentTitle?: string }) {
  const { data, updateData } = useAdminData()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = String(fields.get('name') ?? '').trim()
    const email = String(fields.get('email') ?? '').trim()
    const phone = String(fields.get('phone') ?? '').trim()
    const message = String(fields.get('message') ?? '').trim()
    const preferredDate = String(fields.get('date') ?? '')
    const selectedProperty = data.properties.find((property) => property.id === propertyId)
    const assignedAgentId = selectedProperty?.agentId ?? data.agents[0]?.id ?? ''
    const leadId = `lead-${Date.now()}`
    const lead = {
      id: leadId,
      name,
      email,
      phone,
      message: preferredDate ? `${message}\nPreferred viewing date: ${preferredDate}` : message,
      source: context,
      propertyId,
      developmentTitle,
      assignedAgentId,
      status: 'New' as const,
      priority: 'Normal' as const,
      followUp: preferredDate || undefined,
      createdAt: new Date().toISOString(),
      notes: [],
    }
    const viewingRequest = viewing && propertyId && preferredDate ? {
      id: `view-${Date.now()}`,
      leadId,
      propertyId,
      agentId: assignedAgentId,
      date: preferredDate,
      time: '10:00',
      status: 'Requested' as const,
      notes: 'Requested through the public demo form; no notification was sent.',
    } : null
    updateData((current) => ({ ...current, leads: [lead, ...current.leads], viewings: viewingRequest ? [viewingRequest, ...current.viewings] : current.viewings }), `${context} received from ${name}`)
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 450)
  }

  return (
    <section className="inquiry-panel">
      <span className="eyebrow">{context}</span>
      <h2>{submitted ? 'Request noted' : title}</h2>
      {submitted ? (
        <div className="form-success" role="status"><Check size={18} /><p>Saved to the browser-local demo CRM. No email, WhatsApp message or appointment notification was sent.</p><button className="text-button" type="button" onClick={() => setSubmitted(false)}>Send another request</button></div>
      ) : (
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <label>Your name<input name="name" autoComplete="name" required placeholder="Full name" /></label>
          <div className="form-row"><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required placeholder="+254" /></label></div>
          {viewing && <label>Preferred viewing date<input name="date" type="date" required min={new Date().toISOString().split('T')[0]} /></label>}
          <label>Message<textarea name="message" rows={3} placeholder="Tell us what you would like to know" required /></label>
          <button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Preparing…' : 'Submit demo request'}<ArrowUpRight size={15} /></button>
          <p className="form-disclaimer">Demo only. The request is stored in this browser and is not transmitted to a service.</p>
        </form>
      )}
    </section>
  )
}
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { InquiryForm } from '../components/InquiryForm'
import { PageIntro } from '../components/SiteChrome'
import { siteConfig } from '../data/config'
import { useAdminData } from '../context/AdminDataContext'

export default function ContactPage() {
  const { data } = useAdminData()
  const [params] = useSearchParams()
  const kind = params.get('kind') ?? 'general'
  const project = params.get('project')
  const isViewing = kind === 'viewing'
  const isDevelopment = kind === 'development'
  const title = isViewing ? 'Make time for a viewing.' : isDevelopment ? 'Tell us what you’re looking for.' : 'Good conversations start here.'
  const formTitle = isViewing ? 'Request a viewing' : isDevelopment ? 'Request project information' : 'Start a conversation'

  return (
    <>
      <div className="listing-top contact-top"><PageIntro eyebrow="A thoughtful conversation" title={<>Let’s make<br /><em>an introduction.</em></>} description="Whether you have a property in mind or are just beginning to explore, we’re here to listen." /></div>
      <main className="wrap contact-page"><div className="contact-details"><span className="eyebrow">Reach the property desk</span><h2>{title}</h2><p>{siteConfig.contact.isPlaceholder ? 'Our contact details below are placeholders for this fictional demo. Replace them with verified business information before launch.' : 'Get in touch with the property team.'}</p><a className="contact-detail-link" href={`mailto:${data.settings.email}`}><Mail size={18} /><span><small>Email</small>{data.settings.email}</span><ArrowUpRight size={15} /></a><a className="contact-detail-link" href={`tel:${data.settings.phone.replaceAll(' ', '')}`}><Phone size={18} /><span><small>Phone</small>{data.settings.phone}</span><ArrowUpRight size={15} /></a><div className="contact-detail-link"><MapPin size={18} /><span><small>Based in</small>{data.settings.country} · Demo location</span></div><div className="contact-hours"><span className="eyebrow">A note about this form</span><p>Submitting saves a demo record in this browser only. No email, WhatsApp message or appointment notification is sent.</p></div></div><div className="contact-form-wrap">{project && <p className="selected-project">Project of interest <strong>{project}</strong></p>}<InquiryForm title={formTitle} context={isViewing ? 'Viewing request' : isDevelopment ? 'Development enquiry' : 'General enquiry'} viewing={isViewing} developmentTitle={project ?? undefined} /></div></main>
      <section className="contact-alternative wrap"><span>Looking for a particular home?</span><Link className="underlined-link" to="/properties">Browse the property collection <ArrowUpRight size={15} /></Link></section>
    </>
  )
}
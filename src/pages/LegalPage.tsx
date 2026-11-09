import { Link, useLocation } from 'react-router-dom'
import { PageIntro } from '../components/SiteChrome'

export default function LegalPage() {
  const { pathname } = useLocation()
  const title = pathname === '/privacy' ? 'Privacy notice' : 'Terms of use'
  return <main className="legal-page wrap"><PageIntro eyebrow="Demo policy page" title={title} description="This template includes a placeholder page for your business-specific legal content." /><div className="legal-copy"><p>This is a demonstration website. No personal information submitted in the on-page forms is transmitted or stored. Before launch, replace this copy with a policy reviewed for your organization and jurisdiction.</p><p>Property details, prices, project names and testimonials on this site are illustrative and must not be treated as verified offers or customer statements.</p><Link className="underlined-link" to="/contact">Contact the property desk</Link></div></main>
}
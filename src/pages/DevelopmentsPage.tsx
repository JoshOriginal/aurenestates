import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/SiteChrome'
import { formatPrice } from '../data/properties'
import { useAdminData } from '../context/AdminDataContext'
import { assets } from '../data/assets'

export default function DevelopmentsPage() {
  const { data, publicDevelopments } = useAdminData()
  return (
    <>
      <div className="listing-top development-top"><PageIntro eyebrow="A vision taking shape" title={<>Built around<br /><em>what matters.</em></>} description="Residential projects and considered spaces, at every stage of their story." /></div>
      <main className="wrap developments-page">
        <div className="developments-intro"><p>Explore the next generation of living. Each project on this page is fictional demonstration content, ready to be replaced with verified project information.</p><span className="demo-note">Illustrative project data · Not an active offer</span></div>
        {publicDevelopments.map((project, index) => <article className={`development-detail ${index % 2 ? 'is-reversed' : ''}`} key={project.id}>
          <div className="development-detail-image"><img src={project.image || assets.townhouses} alt={`${project.title} project concept in ${project.location}`} loading="lazy" width="1280" height="720" /><span className="development-status">{project.status}</span><span className="development-index">0{index + 1}</span></div>
          <div className="development-detail-copy"><span className="eyebrow">{project.location}</span><h2>{project.title}</h2><p>{project.description}</p><div className="development-types"><span className="eyebrow">Available residences</span><div>{project.types.map((type) => <span key={type}>{type}</span>)}</div></div><div className="development-amenities"><span className="eyebrow">Considered amenities</span><ul>{project.amenities.map((amenity) => <li key={amenity}><Check size={14} /> {amenity}</li>)}</ul></div><div className="development-start-price"><span>Indicative prices from</span><strong>{formatPrice(project.priceFrom, data.settings.currency, data.settings.locale)}</strong></div><Link className="button button-dark" to={`/contact?kind=development&project=${encodeURIComponent(project.title)}`}>Request project information <ArrowUpRight size={15} /></Link></div>
        </article>)}
      </main>
      <section className="development-bottom-cta"><div className="wrap"><span className="eyebrow eyebrow-light">An idea, becoming a place</span><h2>Let’s talk about<br /><em>what’s next.</em></h2><Link className="button button-light" to="/contact?kind=development">Speak with our team <ArrowUpRight size={15} /></Link></div></section>
    </>
  )
}
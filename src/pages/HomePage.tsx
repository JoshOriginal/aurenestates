import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../data/assets'
import { siteConfig } from '../data/config'
import { PropertyCard } from '../components/PropertyCard'
import { useFavorites } from '../context/FavoritesContext'
import { useAdminData } from '../context/AdminDataContext'

const ArchitectureViewer = lazy(() => import('../components/ArchitectureViewer'))

function DeferredArchitectureViewer() {
  const [isNearViewport, setIsNearViewport] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px' })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return <div className="viewer-shell" ref={sectionRef}>{isNearViewport ? <Suspense fallback={<div className="viewer-loading">Preparing the architectural study…</div>}><ArchitectureViewer /></Suspense> : <div className="viewer-loading">The architectural study loads as you explore.</div>}</div>
}

function PropertySearch() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [transaction, setTransaction] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (category) params.set('category', category)
    if (transaction) params.set('transaction', transaction)
    if (maxPrice) params.set('maxPrice', maxPrice)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form className="hero-search" onSubmit={submit} aria-label="Search properties">
      <label><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Any location" aria-label="Location" /></label>
      <label><span>Property type</span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Property type"><option value="">Any type</option>{['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Land'].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Looking to</span><select value={transaction} onChange={(event) => setTransaction(event.target.value)} aria-label="Transaction type"><option value="">Buy or rent</option><option>For sale</option><option>For rent</option></select></label>
      <label><span>Maximum budget</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} aria-label="Maximum budget"><option value="">Any budget</option><option value="20000000">20M</option><option value="50000000">50M</option><option value="100000000">100M</option></select></label>
      <button className="search-submit" type="submit" aria-label="Search"><Search size={20} /><span>Find a property</span></button>
    </form>
  )
}

export default function HomePage() {
  const { data, publicProperties, publicDevelopments } = useAdminData()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const headlineLines = data.settings.homepageHeadline.split('\n')
  const featuredProperties = publicProperties.filter((property) => data.settings.featuredPropertyIds.includes(property.id)).slice(0, 3)
  const featured = featuredProperties.length ? featuredProperties : publicProperties.filter((property) => property.featured).slice(0, 3)
  return (
    <>
      <section className="hero">
        <img className="hero-image" src={assets.hero} alt="Contemporary timber and stone residence framed by its garden" width="1280" height="720" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <span className="hero-kicker"><i /> {data.settings.homepageEyebrow}</span>
          <h1>{headlineLines[0]}<br /><em>{headlineLines.slice(1).join(' ')}</em></h1>
          <p>{data.settings.homepageDescription}</p>
          <div className="hero-actions"><Link className="button button-light" to="/properties">Explore properties <ArrowUpRight size={16} /></Link><Link className="hero-text-link" to="/developments">Discover developments <ArrowRight size={15} /></Link></div>
          <span className="hero-index">Nairobi <b>·</b> Kenya</span>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><ArrowDown size={15} /></div>
        <div className="hero-search-wrap wrap"><PropertySearch /></div>
      </section>

      <section className="section featured-section wrap">
        <div className="section-heading"><div><span className="eyebrow">A considered collection</span><h2>Places to <em>belong.</em></h2></div><Link className="underlined-link" to="/properties">View all properties <ArrowUpRight size={16} /></Link></div>
        <div className="property-grid featured-grid">{featured.map((property) => <PropertyCard key={property.id} property={property} isFavorite={favoriteIds.includes(property.id)} onToggleFavorite={toggleFavorite} />)}</div>
      </section>

      <section className="categories-section">
        <div className="wrap"><div className="section-heading"><div><span className="eyebrow">Find your perspective</span><h2>Explore by <em>place.</em></h2></div><p>Different ways to live, gathered in one considered collection.</p></div>
          <div className="category-grid">{siteConfig.categories.map((category, index) => {
            const to = 'to' in category ? category.to : `/properties?category=${encodeURIComponent(category.category)}`
            return <Link key={category.label} className={`category-tile category-${index + 1}`} to={to}>
              <img src={`/assets/${encodeURIComponent(category.image)}`} alt={category.label} loading="lazy" width="1280" height="720" />
              <span className="category-number">0{index + 1}</span><span className="category-title">{category.label}</span><ArrowUpRight size={18} className="category-arrow" />
            </Link>
          })}</div>
        </div>
      </section>

      <section className="architecture-section">
        <div className="wrap architecture-layout">
          <div className="architecture-copy"><span className="eyebrow eyebrow-light">A new point of view</span><h2>Explore architecture<br /><em>differently.</em></h2><p>Turn a considered concept in space. Orbit and zoom around a procedural architectural study, built for this experience.</p><span className="model-disclosure">Interactive procedural model · Not a representation of a listed property</span><Link className="button button-outline-light" to="/properties">Discover the collection <ArrowUpRight size={15} /></Link></div>
          <DeferredArchitectureViewer />
        </div>
      </section>

      <section className="section developments-section wrap">
        <div className="section-heading"><div><span className="eyebrow">Made for what comes next</span><h2>New places, <em>taking shape.</em></h2></div><Link className="underlined-link" to="/developments">Explore developments <ArrowUpRight size={16} /></Link></div>
        <div className="development-preview-grid">{publicDevelopments.slice(0, 2).map((project) => <Link className="development-preview" key={project.id} to="/developments"><div className="development-preview-image"><img src={project.image || assets.rooftopPool} alt={`${project.title} development concept`} loading="lazy" width="1280" height="720" /><span>{project.status}</span></div><div className="development-preview-meta"><div><span className="property-location">{project.location}</span><h3>{project.title}</h3></div><ArrowUpRight size={20} /></div></Link>)}</div>
      </section>

      <section className="story-section" id="about"><div className="story-image"><img src={assets.interior} alt="A calm contemporary living room open to a garden" loading="lazy" width="1280" height="720" /></div><div className="story-copy"><span className="eyebrow">A more considered way to find home</span><h2>Good places<br />change how<br /><em>life feels.</em></h2><p>We believe a property is more than a set of rooms. It is the light at the end of a long day, the neighbourhood that becomes familiar, and the space to make your own.</p><p>Auren Estates is a fictional demonstration brand for a more thoughtful property experience.</p><Link className="underlined-link" to="/contact">Meet your property team <ArrowUpRight size={16} /></Link></div></section>

      <section className="testimonial-section wrap"><span className="eyebrow">A note from the journey</span><blockquote>“The right home didn’t just fit our plans. It gave us room to imagine new ones.”</blockquote><div className="testimonial-credit"><span className="testimonial-rule" /><span>Illustrative demonstration testimonial<br /><small>Not a verified customer review</small></span></div></section>

      <section className="closing-section"><div className="wrap closing-content"><div><span className="eyebrow eyebrow-light">Your next chapter starts here</span><h2>Let’s find the<br /><em>right place.</em></h2></div><div><p>Tell us what matters to you. We’ll help you explore the possibilities.</p><Link className="button button-light" to="/contact?kind=viewing">Arrange a conversation <ArrowUpRight size={16} /></Link></div></div><span className="closing-mark">A</span></section>
    </>
  )
}
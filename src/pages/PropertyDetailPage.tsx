import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BedDouble, Check, ChevronLeft, ChevronRight, Heart, MapPin, Maximize2, Ruler, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { InquiryForm } from '../components/InquiryForm'
import { PropertyCard } from '../components/PropertyCard'
import { useFavorites } from '../context/FavoritesContext'
import { formatArea, formatPrice } from '../data/properties'
import { useAdminData } from '../context/AdminDataContext'

const rooms = [
  { name: 'Living room', size: '6.2 × 5.4 m', detail: 'Open-plan gathering space, with garden access.' },
  { name: 'Kitchen', size: '4.1 × 3.8 m', detail: 'Illustrative kitchen zone; verify against architectural plans.' },
  { name: 'Primary suite', size: '5.0 × 4.2 m', detail: 'Illustrative primary bedroom and ensuite.' },
  { name: 'Bedroom 02', size: '3.7 × 3.4 m', detail: 'Illustrative secondary bedroom.' },
]

function FloorPlan() {
  const [activeRoom, setActiveRoom] = useState(0)
  return <section className="detail-section floor-plan-section"><div className="detail-section-heading"><div><span className="eyebrow">Space, at a glance</span><h2>Illustrative floor plan</h2></div><span className="plan-note">Concept only · Not an architectural drawing</span></div><div className="floor-plan-layout"><div className="floor-plan" aria-label="Illustrative floor plan, select a room for details"><button className={`plan-room plan-living ${activeRoom === 0 ? 'active' : ''}`} onClick={() => setActiveRoom(0)}>Living room</button><button className={`plan-room plan-kitchen ${activeRoom === 1 ? 'active' : ''}`} onClick={() => setActiveRoom(1)}>Kitchen</button><button className={`plan-room plan-primary ${activeRoom === 2 ? 'active' : ''}`} onClick={() => setActiveRoom(2)}>Primary suite</button><button className={`plan-room plan-bedroom ${activeRoom === 3 ? 'active' : ''}`} onClick={() => setActiveRoom(3)}>Bedroom 02</button><span className="plan-door">Entry</span></div><div className="room-details"><span className="eyebrow">Selected room</span><h3>{rooms[activeRoom].name}</h3><span>{rooms[activeRoom].size}</span><p>{rooms[activeRoom].detail}</p>{rooms.map((room, index) => <button type="button" className={`room-selector ${activeRoom === index ? 'active' : ''}`} key={room.name} onClick={() => setActiveRoom(index)}>{room.name}<ArrowRight size={14} /></button>)}</div></div></section>
}

export default function PropertyDetailPage() {
  const { data, publicProperties } = useAdminData()
  const { id } = useParams()
  const property = publicProperties.find((item) => item.id === id)
  const { favoriteIds, toggleFavorite } = useFavorites()
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview')

  useEffect(() => {
    if (!lightboxOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setLightboxOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [lightboxOpen])

  if (!property) return <main className="not-found wrap"><span className="eyebrow">Property not found</span><h1>This listing has moved.</h1><Link className="button button-dark" to="/properties">Return to properties <ArrowUpRight size={16} /></Link></main>

  const gallery = property.gallery
  const related = publicProperties.filter((item) => item.id !== property.id && item.category === property.category).slice(0, 3)
  const isFavorite = favoriteIds.includes(property.id)
  const changeImage = (direction: number) => setActiveImage((current) => (current + direction + gallery.length) % gallery.length)

  return (
    <main className="detail-page wrap">
      <Link className="back-link" to="/properties"><ArrowLeft size={15} /> All properties</Link>
      <div className="detail-heading"><div><span className="eyebrow">{property.reference} <i /> {property.category} · {property.transaction}</span><h1>{property.title}</h1><p className="detail-location"><MapPin size={16} /> {property.location}</p></div><div className="detail-price-block"><strong>{property.priceOnRequest ? 'Price on request' : formatPrice(property.price, data.settings.currency, data.settings.locale)}</strong>{property.transaction === 'For rent' && <span>per {property.rentPeriod?.toLowerCase() ?? 'month'}</span>}<button className={`save-detail ${isFavorite ? 'is-favorite' : ''}`} type="button" aria-pressed={isFavorite} onClick={() => toggleFavorite(property.id)}><Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Saved' : 'Save property'}</button></div></div>
      <div className="detail-gallery"><button className="gallery-main" type="button" onClick={() => setLightboxOpen(true)} aria-label="Enlarge property image"><img src={gallery[activeImage]} alt={`${property.title} property view ${activeImage + 1}`} width="1280" height="720" /><span><Maximize2 size={14} /> View gallery</span></button><div className="gallery-side">{gallery.slice(1, 3).map((image, index) => <button type="button" key={image} onClick={() => { setActiveImage(index + 1); setLightboxOpen(true) }}><img src={image} alt={`${property.title} interior ${index + 1}`} width="1280" height="720" /></button>)}<span className="gallery-count">{gallery.length} photographs</span></div></div>
      <div className="detail-summary"><div className="detail-stats"><span><BedDouble size={18} /> {property.beds || '—'} <small>Bedrooms</small></span><span><span className="bath-icon">⌂</span> {property.baths || '—'} <small>Bathrooms</small></span><span><Ruler size={17} /> {formatArea(property.size, data.settings.areaUnit, data.settings.locale)} <small>Internal area</small></span>{property.plot && <span><Maximize2 size={16} /> {formatArea(property.plot, data.settings.areaUnit, data.settings.locale)} <small>Plot area</small></span>}</div><a className="button button-dark" href="#inquiry">Request a viewing <ArrowUpRight size={15} /></a></div>
      <div className="detail-columns"><div className="detail-primary">
        <section className="detail-section"><div className="detail-tabs" role="tablist"><button type="button" role="tab" aria-selected={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</button><button type="button" role="tab" aria-selected={activeTab === 'features'} onClick={() => setActiveTab('features')}>Features & amenities</button></div>{activeTab === 'overview' ? <><h2>A home with room to live.</h2><p className="detail-description">{property.description}</p><div className="detail-facts"><div><span>Property type</span><strong>{property.category}</strong></div><div><span>Reference</span><strong>{property.reference}</strong></div><div><span>Location</span><strong>{property.location}</strong></div><div><span>Country</span><strong>{data.settings.country}</strong></div></div></> : <><h2>Thoughtful details.</h2><ul className="amenity-list">{property.amenities.map((amenity) => <li key={amenity}><Check size={15} /> {amenity}</li>)}</ul></>}</section>
        <FloorPlan />
        <section className="detail-section location-section"><div className="detail-section-heading"><div><span className="eyebrow">The neighbourhood</span><h2>Rooted in {property.area}.</h2></div></div><div className="location-placeholder"><MapPin size={22} /><div><strong>{property.location}</strong><span>Map and local points of interest can be connected during setup.</span></div><span className="demo-note">Location reference is illustrative</span></div></section>
        {related.length > 0 && <section className="detail-section related-section"><div className="detail-section-heading"><div><span className="eyebrow">Keep exploring</span><h2>Similar places.</h2></div><Link className="underlined-link" to="/properties">All properties <ArrowUpRight size={15} /></Link></div><div className="property-grid">{related.map((item) => <PropertyCard key={item.id} property={item} isFavorite={favoriteIds.includes(item.id)} onToggleFavorite={toggleFavorite} />)}</div></section>}
      </div><aside className="detail-sidebar" id="inquiry"><div className="agent-card"><span className="agent-initial">A</span><div><strong>{data.agents.find((agent) => agent.id === property.agentId)?.name ?? 'Auren Property Desk'}</strong><span>Property advisory · Demo profile</span></div><p>Talk through the details with our property team.</p></div><InquiryForm title="Request a viewing" context="Property enquiry" viewing propertyId={property.id} /><div className="whatsapp-note"><span className="eyebrow">Prefer a direct conversation?</span>{data.settings.whatsappNumber ? <p><a href={`https://wa.me/${data.settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Open WhatsApp contact <ArrowUpRight size={14} /></a></p> : <p>WhatsApp contact is not configured for this demo.</p>}<Link to="/contact">Contact the property desk <ArrowUpRight size={14} /></Link></div></aside></div>
      <div className="mobile-viewing-bar"><span>{property.priceOnRequest ? 'Price on request' : formatPrice(property.price, data.settings.currency, data.settings.locale)}</span><a className="button button-dark" href="#inquiry">Request a viewing <ArrowUpRight size={15} /></a></div>
      {lightboxOpen && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Property gallery" onClick={() => setLightboxOpen(false)}><button className="lightbox-close icon-button" type="button" aria-label="Close gallery" onClick={() => setLightboxOpen(false)}><X size={21} /></button><button className="lightbox-arrow lightbox-prev icon-button" type="button" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); changeImage(-1) }}><ChevronLeft size={24} /></button><img src={gallery[activeImage]} alt={`${property.title} gallery image ${activeImage + 1}`} onClick={(event) => event.stopPropagation()} /><button className="lightbox-arrow lightbox-next icon-button" type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); changeImage(1) }}><ChevronRight size={24} /></button><span className="lightbox-counter">{activeImage + 1} / {gallery.length}</span></div>}
    </main>
  )
}
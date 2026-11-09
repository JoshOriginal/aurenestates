import { ArrowUpRight, BedDouble, Heart, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../data/config'
import type { Property } from '../data/properties'
import { formatArea, formatPrice } from '../data/properties'
import { useAdminData } from '../context/AdminDataContext'

type PropertyCardProps = {
  property: Property
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  variant?: 'grid' | 'list'
}

export function PropertyCard({ property, isFavorite, onToggleFavorite, variant = 'grid' }: PropertyCardProps) {
  const { data } = useAdminData()
  return (
    <article className={`property-card ${variant === 'list' ? 'property-card-list' : ''}`}>
      <div className="property-image-wrap">
        <Link className="property-image-link" to={`/properties/${property.id}`} aria-label={`View ${property.title}`}>
          <img src={property.image} alt={`${property.title}, ${property.category.toLowerCase()} in ${property.location}`} loading="lazy" width="1280" height="720" />
        </Link>
        <span className="property-badge">{property.transaction}</span>
        <button className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} type="button" aria-label={isFavorite ? `Remove ${property.title} from saved properties` : `Save ${property.title}`} aria-pressed={isFavorite} onClick={() => onToggleFavorite(property.id)}>
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <span className="property-reference">{property.reference}</span>
      </div>
      <div className="property-card-content">
        <div className="property-title-row"><div><span className="property-location">{property.location}</span><h3><Link to={`/properties/${property.id}`}>{property.title}</Link></h3></div><Link className="arrow-link" to={`/properties/${property.id}`} aria-label={`View ${property.title}`}><ArrowUpRight size={18} /></Link></div>
        <div className="property-meta"><span>{property.category}</span>{property.beds > 0 && <span><BedDouble size={15} /> {property.beds} beds</span>}<span><Ruler size={14} /> {formatArea(property.size, data.settings.areaUnit, data.settings.locale)}</span></div>
        <div className="property-price">{property.priceOnRequest ? 'Price on request' : formatPrice(property.price, data.settings.currency, data.settings.locale)}{property.transaction === 'For rent' && <small> / {property.rentPeriod ?? 'month'}</small>}</div>
      </div>
    </article>
  )
}
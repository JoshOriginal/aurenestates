import { useEffect, useMemo, useState } from 'react'
import { Grid2X2, List, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageIntro } from '../components/SiteChrome'
import { PropertyCard } from '../components/PropertyCard'
import { useFavorites } from '../context/FavoritesContext'
import { useAdminData } from '../context/AdminDataContext'

type Filters = { query: string; location: string; category: string; transaction: string; maxPrice: string; bedrooms: string; sort: string }
const emptyFilters: Filters = { query: '', location: '', category: '', transaction: '', maxPrice: '', bedrooms: '', sort: 'newest' }

export default function PropertiesPage() {
  const { publicProperties, data } = useAdminData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    location: searchParams.get('location') ?? '',
    category: searchParams.get('category') ?? '',
    transaction: searchParams.get('transaction') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { favoriteIds, toggleFavorite } = useFavorites()

  useEffect(() => {
    setFilters((current) => ({ ...current, location: searchParams.get('location') ?? '', category: searchParams.get('category') ?? '', transaction: searchParams.get('transaction') ?? '', maxPrice: searchParams.get('maxPrice') ?? '' }))
  }, [searchParams])

  const results = useMemo(() => {
    const filtered = publicProperties.filter((property) => {
      const text = `${property.title} ${property.location} ${property.area}`.toLowerCase()
      return (!filters.query || text.includes(filters.query.toLowerCase()))
        && (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase()))
        && (!filters.category || property.category === filters.category)
        && (!filters.transaction || property.transaction === filters.transaction)
        && (!filters.maxPrice || property.price <= Number(filters.maxPrice))
        && (!filters.bedrooms || property.beds >= Number(filters.bedrooms))
    })
    return filtered.sort((a, b) => filters.sort === 'price-low' ? a.price - b.price : filters.sort === 'price-high' ? b.price - a.price : b.yearAdded - a.yearAdded)
  }, [filters, publicProperties])

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setFilters(emptyFilters)
    setSearchParams({})
  }

  return (
    <>
      <div className="listing-top"><PageIntro eyebrow="The property collection" title={<>Find your place<br /><em>in the world.</em></>} description="A considered selection of homes, apartments and opportunities." /></div>
      <main className="listing-page wrap">
        <section className="filter-panel" aria-label="Filter properties">
          <div className="filter-panel-heading"><span><SlidersHorizontal size={16} /> Refine your search</span><button className="text-button" type="button" onClick={resetFilters}>Reset filters <X size={14} /></button></div>
          <div className="filter-fields">
            <label className="filter-search">Search<input type="search" value={filters.query} onChange={(event) => setFilter('query', event.target.value)} placeholder="Name or location" /></label>
            <label>Location<input value={filters.location} onChange={(event) => setFilter('location', event.target.value)} placeholder="Any location" /></label>
            <label>Transaction<select value={filters.transaction} onChange={(event) => setFilter('transaction', event.target.value)}><option value="">Buy or rent</option><option>For sale</option><option>For rent</option></select></label>
            <label>Property type<select value={filters.category} onChange={(event) => setFilter('category', event.target.value)}><option value="">All types</option>{['Villa', 'Apartment', 'Townhouse', 'Commercial', 'Land'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Maximum price<select value={filters.maxPrice} onChange={(event) => setFilter('maxPrice', event.target.value)}><option value="">No maximum</option><option value="20000000">{data.settings.currency} 20M</option><option value="50000000">{data.settings.currency} 50M</option><option value="100000000">{data.settings.currency} 100M</option><option value="150000000">{data.settings.currency} 150M</option></select></label>
            <label>Bedrooms<select value={filters.bedrooms} onChange={(event) => setFilter('bedrooms', event.target.value)}><option value="">Any</option>{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}+ beds</option>)}</select></label>
          </div>
        </section>
        <div className="listing-toolbar"><p><strong>{results.length}</strong> {results.length === 1 ? 'property' : 'properties'} to explore</p><div className="listing-view-controls"><label>Sort by<select value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}><option value="newest">Recently added</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><div className="view-toggle" aria-label="Result layout"><button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Grid2X2 size={17} /></button><button type="button" aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={18} /></button></div></div></div>
        {results.length ? <div className={`property-grid listing-grid ${view === 'list' ? 'is-list' : ''}`}>{results.map((property) => <PropertyCard key={property.id} property={property} isFavorite={favoriteIds.includes(property.id)} onToggleFavorite={toggleFavorite} variant={view} />)}</div> : <div className="empty-state"><span className="eyebrow">No exact matches</span><h2>Let’s widen the search.</h2><p>Try another location or clear a few filters to see more of the collection.</p><button className="button button-dark" type="button" onClick={resetFilters}>Reset filters</button></div>}
        <p className="demo-data-note">All property names, prices and details shown are fictional demonstration data.</p>
      </main>
    </>
  )
}
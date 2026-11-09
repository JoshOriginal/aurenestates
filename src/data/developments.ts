import { assets } from './assets'

export type Development = {
  id: string
  title: string
  location: string
  status: string
  priceFrom: number
  types: string[]
  amenities: string[]
  image: string
  description: string
  publicationStatus?: 'Published' | 'Draft' | 'Archived'
  featured?: boolean
  linkedPropertyIds?: string[]
  metaTitle?: string
  metaDescription?: string
  availableUnits?: number
}

export const developments: Development[] = [
  {
    id: 'canopy-collection', title: 'The Canopy Collection', location: 'Westlands, Nairobi', status: 'In progress', priceFrom: 18500000,
    types: ['1–3 bedroom apartments', 'Penthouses'], amenities: ['Rooftop pool', 'Residents’ lounge', 'Wellness studio', 'Concierge'], image: assets.rooftopPool,
    description: 'An urban address shaped by greenery, open views and a quieter approach to city living. Project information and pricing shown are fictional demonstration content.',
  },
  {
    id: 'acacia-gardens', title: 'Acacia Gardens', location: 'Runda, Nairobi', status: 'Now selling', priceFrom: 68000000,
    types: ['3–5 bedroom townhouses', 'Garden homes'], amenities: ['Gated entry', 'Walking paths', 'Clubhouse', 'Children’s play lawn'], image: assets.townhouses,
    description: 'A limited collection of family homes arranged around planted courtyards and shared outdoor spaces. Illustrative information only.',
  },
  {
    id: 'shoreline-residences', title: 'Shoreline Residences', location: 'Nyali, Mombasa', status: 'Planning', priceFrom: 14200000,
    types: ['1–3 bedroom apartments', 'Duplexes'], amenities: ['Swimming pool', 'Garden terrace', 'Secure parking', 'Coastal walks'], image: assets.apartmentPool,
    description: 'A coastal residential concept balancing private retreat with the ease of a connected neighbourhood. This is a fictional project showcase.',
  },
]
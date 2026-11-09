import { assets } from './assets'
import { siteConfig } from './config'

export type Property = {
  id: string
  title: string
  location: string
  area: string
  category: 'Villa' | 'Apartment' | 'Townhouse' | 'Commercial' | 'Land'
  transaction: 'For sale' | 'For rent'
  price: number
  beds: number
  baths: number
  size: number
  plot?: number
  reference: string
  yearAdded: number
  description: string
  image: string
  gallery: string[]
  amenities: string[]
  status?: 'Published' | 'Draft' | 'Sold' | 'Rented' | 'Archived'
  featured?: boolean
  country?: string
  county?: string
  neighborhood?: string
  address?: string
  parking?: number
  yearBuilt?: number
  rentPeriod?: 'Month' | 'Week' | 'Year'
  priceOnRequest?: boolean
  slug?: string
  metaTitle?: string
  metaDescription?: string
  developmentId?: string
  createdAt?: string
  floorPlanImage?: string
  videoUrl?: string
  galleryAltTexts?: string[]
  latitude?: number
  longitude?: number
  nearbyFacilities?: string[]
  agentId?: string
}

export const properties: Property[] = [
  {
    id: 'ridge-house', title: 'The Ridge House', location: 'Karen, Nairobi', area: 'Nairobi', category: 'Villa', transaction: 'For sale', price: 128000000, beds: 5, baths: 4, size: 482, plot: 1100, reference: 'AE-0148', yearAdded: 2026,
    description: 'A considered family home shaped around light, quiet garden views and generous places to gather. Demonstration property details are illustrative and should be replaced before publication.',
    image: assets.hero, gallery: [assets.hero, assets.homePool, assets.livingRoom, assets.kitchen, assets.bedroomGreen], amenities: ['Private garden', 'Swimming pool', 'Covered terrace', 'Staff quarters', 'Solar backup'],
  },
  {
    id: 'the-canopy-residences', title: 'The Canopy Residences', location: 'Westlands, Nairobi', area: 'Nairobi', category: 'Apartment', transaction: 'For sale', price: 26500000, beds: 3, baths: 3, size: 176, reference: 'AE-0182', yearAdded: 2026,
    description: 'A bright city residence with an open living plan, broad windows and shared rooftop amenities. All property information on this demo site is fictional.',
    image: assets.apartment, gallery: [assets.apartment, assets.rooftopPool, assets.livingRoomWindow, assets.bedroomLight, assets.diningRoom], amenities: ['Rooftop pool', 'Concierge', 'Secure parking', 'Fitness room', 'Backup generator'],
  },
  {
    id: 'acacia-court', title: 'Acacia Court', location: 'Runda, Nairobi', area: 'Nairobi', category: 'Townhouse', transaction: 'For sale', price: 74000000, beds: 4, baths: 4, size: 356, plot: 520, reference: 'AE-0206', yearAdded: 2025,
    description: 'A quietly confident home in a landscaped enclave, with clear separation between entertaining and family spaces. This is fictional demonstration content.',
    image: assets.townhouses, gallery: [assets.townhouses, assets.diningRoom, assets.kitchen, assets.bedroomModern, assets.gardenPool], amenities: ['Gated community', 'Landscaped garden', 'Double garage', 'Clubhouse', '24-hour security'],
  },
  {
    id: 'ocean-house', title: 'Ocean House', location: 'Nyali, Mombasa', area: 'Mombasa', category: 'Villa', transaction: 'For rent', price: 480000, beds: 4, baths: 3, size: 328, plot: 760, reference: 'AE-0217', yearAdded: 2025,
    description: 'An easy coastal retreat with outdoor living at its centre and a private pool framed by mature planting. Demo details only.',
    image: assets.gardenPool, gallery: [assets.gardenPool, assets.homePool, assets.interior, assets.bedroomLight], amenities: ['Private pool', 'Garden', 'Furnished', 'Solar hot water', 'Secure parking'],
  },
  {
    id: 'parkline-suite', title: 'Parkline Suite', location: 'Kilimani, Nairobi', area: 'Nairobi', category: 'Apartment', transaction: 'For rent', price: 185000, beds: 2, baths: 2, size: 118, reference: 'AE-0224', yearAdded: 2024,
    description: 'A well-proportioned apartment with a leafy outlook and a practical open-plan living space. Fictional details are provided for interface demonstration.',
    image: assets.livingRoomWindow, gallery: [assets.livingRoomWindow, assets.apartmentPool, assets.bedroomModern, assets.kitchen], amenities: ['Swimming pool', 'Lift access', 'Balcony', 'Secure parking', 'Backup power'],
  },
  {
    id: 'westgate-atelier', title: 'Westgate Atelier', location: 'Westlands, Nairobi', area: 'Nairobi', category: 'Commercial', transaction: 'For rent', price: 420000, beds: 0, baths: 2, size: 240, reference: 'AE-0230', yearAdded: 2026,
    description: 'Flexible commercial space in a growing urban district, suitable for a studio, office or boutique practice. Demonstration listing.',
    image: assets.aerialCommunity, gallery: [assets.aerialCommunity, assets.apartment, assets.livingRoom], amenities: ['Reception area', 'Lift access', 'Visitor parking', 'Fibre-ready', 'Backup generator'],
  },
  {
    id: 'greenridge-parcel', title: 'Greenridge Parcel', location: 'Kikuyu, Kiambu', area: 'Kiambu', category: 'Land', transaction: 'For sale', price: 18500000, beds: 0, baths: 0, size: 1200, plot: 1200, reference: 'AE-0241', yearAdded: 2024,
    description: 'A generous residential parcel in a growing neighbourhood, presented as an example of land-listing fields. Verify all details before use.',
    image: assets.familyHomes, gallery: [assets.familyHomes, assets.aerialCommunity, assets.modernHouse], amenities: ['Residential zoning (demo)', 'Road access (demo)', 'Utilities nearby (demo)'],
  },
  {
    id: 'garden-house', title: 'Garden House', location: 'Lavington, Nairobi', area: 'Nairobi', category: 'Villa', transaction: 'For sale', price: 96000000, beds: 5, baths: 5, size: 418, plot: 930, reference: 'AE-0247', yearAdded: 2026,
    description: 'A private home with generous indoor-outdoor living, a landscaped garden and a calm material palette. Details are fictional.',
    image: assets.privateHome, gallery: [assets.privateHome, assets.homePool, assets.livingRoom, assets.bedroomGreen], amenities: ['Garden', 'Pool', 'Family room', 'Staff quarters', 'Solar backup'],
  },
]

export const formatPrice = (price: number, currency: string = siteConfig.currency, locale: string = siteConfig.locale) => new Intl.NumberFormat(locale, {
  style: 'currency', currency, maximumFractionDigits: 0,
}).format(price)

export const formatArea = (areaInSquareMetres: number, unit: string = siteConfig.areaUnit, locale: string = siteConfig.locale) => {
  const area = unit === 'ft²' ? Math.round(areaInSquareMetres * 10.7639) : areaInSquareMetres
  return `${new Intl.NumberFormat(locale).format(area)} ${unit}`
}
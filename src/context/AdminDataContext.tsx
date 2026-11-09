import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { assets } from '../data/assets'
import { siteConfig } from '../data/config'
import { developments, type Development } from '../data/developments'
import { properties, type Property } from '../data/properties'

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Viewing scheduled' | 'Negotiation' | 'Won' | 'Lost'
export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  source: string
  propertyId?: string
  developmentTitle?: string
  assignedAgentId: string
  status: LeadStatus
  priority: 'Low' | 'Normal' | 'High'
  followUp?: string
  createdAt: string
  lastContact?: string
  notes: string[]
}
export type Viewing = {
  id: string
  leadId: string
  propertyId: string
  agentId: string
  date: string
  time: string
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled'
  notes: string
}
export type Agent = {
  id: string
  name: string
  title: string
  email: string
  phone: string
  bio: string
  specialties: string[]
  active: boolean
  profileImage?: string
}
export type SiteSettings = {
  companyName: string
  logoUrl: string
  tagline: string
  country: string
  currency: string
  locale: string
  areaUnit: 'm²' | 'ft²'
  fonts: { display: string; body: string }
  footerNote: string
  notifications: { newLeads: boolean; viewingRequests: boolean }
  phone: string
  email: string
  whatsappNumber: string
  brand: { forest: string; ivory: string; brass: string }
  homepageEyebrow: string
  homepageHeadline: string
  homepageDescription: string
  featuredPropertyIds: string[]
  navigation: { label: string; to: string }[]
  socialLinks: { label: string; url: string }[]
  seoTitle: string
  seoDescription: string
}
export type Activity = { id: string; message: string; type: string; at: string }
export type AnalyticsData = {
  daily: { label: string; views: number; inquiries: number }[]
  sources: { name: string; count: number }[]
  viewsByProperty: { propertyId: string; views: number }[]
}
export type AdminRepository = {
  properties: Property[]
  developments: Development[]
  leads: Lead[]
  viewings: Viewing[]
  agents: Agent[]
  activities: Activity[]
  analytics: AnalyticsData
  settings: SiteSettings
}

type RepositoryContextValue = {
  data: AdminRepository
  updateData: (mutator: (current: AdminRepository) => AdminRepository, activity: string) => void
  resetDemo: () => AdminRepository
  publicProperties: Property[]
  publicDevelopments: Development[]
}

const storageKey = 'auren-admin-prototype-v1'
const agentSeed: Agent[] = [
  { id: 'agent-amani', name: 'Amani Njoroge', title: 'Senior property advisor', email: 'amani@example.test', phone: '+254 700 000 101', bio: 'Residential homes and considered family living.', specialties: ['Private homes', 'Nairobi'], active: true },
  { id: 'agent-wanjiku', name: 'Wanjiku Mwangi', title: 'Property advisor', email: 'wanjiku@example.test', phone: '+254 700 000 102', bio: 'Apartment living and urban neighbourhoods.', specialties: ['Apartments', 'Westlands'], active: true },
  { id: 'agent-kimani', name: 'Kimani Otieno', title: 'Development advisor', email: 'kimani@example.test', phone: '+254 700 000 103', bio: 'New projects and investment opportunities.', specialties: ['Developments', 'Coastal'], active: true },
]

function makeSettings(): SiteSettings {
  return {
    companyName: siteConfig.companyName,
    logoUrl: '',
    tagline: siteConfig.tagline,
    country: siteConfig.country,
    currency: siteConfig.currency,
    locale: siteConfig.locale,
    areaUnit: siteConfig.areaUnit,
    fonts: { ...siteConfig.fonts },
    footerNote: 'Exceptional places. Considered living.',
    notifications: { newLeads: true, viewingRequests: true },
    phone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    whatsappNumber: siteConfig.contact.whatsappNumber,
    brand: { ...siteConfig.brand },
    homepageEyebrow: 'Exceptional places. Considered living.',
    homepageHeadline: 'Find a place beyond ordinary.',
    homepageDescription: 'Discover exceptional homes, thoughtfully designed spaces, and property opportunities worth exploring.',
    featuredPropertyIds: properties.slice(0, 3).map((property) => property.id),
    navigation: [...siteConfig.navigation],
    socialLinks: [...siteConfig.socialLinks],
    seoTitle: `${siteConfig.companyName} | ${siteConfig.tagline}`,
    seoDescription: 'Exceptional homes, considered living, and property opportunities worth exploring.',
  }
}

function makeDemoData(): AdminRepository {
  const seededProperties = properties.map((property, index) => ({
    ...property,
    status: 'Published' as const,
    featured: index < 3,
    agentId: agentSeed[index % agentSeed.length].id,
    country: siteConfig.country,
    county: property.area,
    neighborhood: property.location.split(',')[0],
    address: '',
    parking: property.beds > 0 ? Math.min(property.beds, 3) : 0,
    yearBuilt: undefined,
    slug: property.id,
    metaTitle: property.title,
    metaDescription: property.description.slice(0, 150),
    createdAt: `2026-10-${String(16 - Math.min(index, 12)).padStart(2, '0')}`,
  }))
  const seededDevelopments = developments.map((development, index) => ({
    ...development,
    publicationStatus: 'Published' as const,
    featured: index === 0,
    linkedPropertyIds: [],
    metaTitle: development.title,
    metaDescription: development.description.slice(0, 150),
  }))
  const leads: Lead[] = [
    { id: 'lead-1001', name: 'Nia Kamau', email: 'nia@example.test', phone: '+254 700 100 001', message: 'Could I arrange a viewing this weekend?', source: 'Property enquiry', propertyId: 'ridge-house', assignedAgentId: 'agent-amani', status: 'New', priority: 'High', followUp: '2026-10-17', createdAt: '2026-10-16T08:30:00', notes: [] },
    { id: 'lead-1002', name: 'David Muli', email: 'david@example.test', phone: '+254 700 100 002', message: 'Please send details about the available apartment layouts.', source: 'Website form', propertyId: 'the-canopy-residences', assignedAgentId: 'agent-wanjiku', status: 'Contacted', priority: 'Normal', followUp: '2026-10-18', createdAt: '2026-10-15T15:10:00', lastContact: '2026-10-16', notes: ['Requested floor-plan details.'] },
    { id: 'lead-1003', name: 'Talia Otieno', email: 'talia@example.test', phone: '+254 700 100 003', message: 'Interested in the Canopy Collection.', source: 'Development enquiry', assignedAgentId: 'agent-kimani', status: 'Qualified', priority: 'Normal', createdAt: '2026-10-14T11:40:00', lastContact: '2026-10-15', notes: [] },
    { id: 'lead-1004', name: 'Musa Hassan', email: 'musa@example.test', phone: '+254 700 100 004', message: 'Looking for a coastal rental for a longer stay.', source: 'Property enquiry', propertyId: 'ocean-house', assignedAgentId: 'agent-amani', status: 'Viewing scheduled', priority: 'High', createdAt: '2026-10-13T09:15:00', lastContact: '2026-10-15', notes: ['Prefers an afternoon appointment.'] },
    { id: 'lead-1005', name: 'Zuri Wekesa', email: 'zuri@example.test', phone: '+254 700 100 005', message: 'Can you share more information on the project?', source: 'Development enquiry', assignedAgentId: 'agent-kimani', status: 'Negotiation', priority: 'Low', createdAt: '2026-10-12T14:20:00', lastContact: '2026-10-14', notes: [] },
  ]
  return {
    properties: seededProperties,
    developments: seededDevelopments,
    leads,
    viewings: [
      { id: 'view-201', leadId: 'lead-1001', propertyId: 'ridge-house', agentId: 'agent-amani', date: '2026-10-17', time: '10:30', status: 'Requested', notes: 'Customer asked for weekend availability.' },
      { id: 'view-202', leadId: 'lead-1004', propertyId: 'ocean-house', agentId: 'agent-amani', date: '2026-10-17', time: '14:00', status: 'Confirmed', notes: 'Internal status only; no notification sent.' },
      { id: 'view-203', leadId: 'lead-1002', propertyId: 'the-canopy-residences', agentId: 'agent-wanjiku', date: '2026-10-18', time: '11:00', status: 'Requested', notes: '' },
      { id: 'view-204', leadId: 'lead-1003', propertyId: 'acacia-court', agentId: 'agent-amani', date: '2026-10-15', time: '16:00', status: 'Completed', notes: 'Illustrative demo history.' },
    ],
    agents: agentSeed,
    activities: [
      { id: 'activity-1', message: 'Nia Kamau submitted a property enquiry', type: 'lead', at: '2026-10-16T08:30:00' },
      { id: 'activity-2', message: 'Viewing request received for The Ridge House', type: 'viewing', at: '2026-10-16T08:32:00' },
      { id: 'activity-3', message: 'The Canopy Collection project information requested', type: 'lead', at: '2026-10-15T15:10:00' },
      { id: 'activity-4', message: 'Parkline Suite listing updated', type: 'property', at: '2026-10-15T12:20:00' },
    ],
    analytics: {
      daily: [
        { label: '10 Oct', views: 92, inquiries: 4 }, { label: '11 Oct', views: 118, inquiries: 6 },
        { label: '12 Oct', views: 105, inquiries: 3 }, { label: '13 Oct', views: 146, inquiries: 8 },
        { label: '14 Oct', views: 132, inquiries: 5 }, { label: '15 Oct', views: 174, inquiries: 9 },
        { label: '16 Oct', views: 161, inquiries: 7 },
      ],
      sources: [{ name: 'Website form', count: 12 }, { name: 'Property enquiry', count: 9 }, { name: 'Development enquiry', count: 5 }, { name: 'Referral', count: 3 }],
      viewsByProperty: [{ propertyId: 'ridge-house', views: 548 }, { propertyId: 'the-canopy-residences', views: 426 }, { propertyId: 'acacia-court', views: 319 }, { propertyId: 'ocean-house', views: 211 }],
    },
    settings: makeSettings(),
  }
}

const demoSeed = makeDemoData()

function loadRepository(): AdminRepository {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return demoSeed
    const stored = JSON.parse(raw) as Partial<AdminRepository>
    if (!Array.isArray(stored.properties) || !Array.isArray(stored.developments)) return demoSeed
    return { ...demoSeed, ...stored, settings: { ...demoSeed.settings, ...stored.settings, brand: { ...demoSeed.settings.brand, ...stored.settings?.brand }, fonts: { ...demoSeed.settings.fonts, ...stored.settings?.fonts }, notifications: { ...demoSeed.settings.notifications, ...stored.settings?.notifications } } }
  } catch {
    return demoSeed
  }
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminRepository>(loadRepository)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch {
      // Storage can be disabled or full; current-session state remains usable.
    }
  }, [data])

  useEffect(() => {
    document.documentElement.style.setProperty('--forest', data.settings.brand.forest)
    document.documentElement.style.setProperty('--paper', data.settings.brand.ivory)
    document.documentElement.style.setProperty('--brass', data.settings.brand.brass)
    document.documentElement.style.setProperty('--display', `'${data.settings.fonts.display}', Georgia, serif`)
    document.documentElement.style.setProperty('--body', `'${data.settings.fonts.body}', sans-serif`)
    document.title = `${data.settings.companyName} | ${data.settings.tagline}`
  }, [data.settings])

  function updateData(mutator: (current: AdminRepository) => AdminRepository, activity: string) {
    setData((current) => {
      const next = mutator(current)
      return { ...next, activities: [{ id: `activity-${Date.now()}`, message: activity, type: 'admin', at: new Date().toISOString() }, ...next.activities].slice(0, 40) }
    })
  }

  function resetDemo() {
    localStorage.removeItem(storageKey)
    const defaults = makeDemoData()
    setData(defaults)
    return defaults
  }

  const value: RepositoryContextValue = {
    data,
    updateData,
    resetDemo,
    publicProperties: data.properties.filter((property) => !['Draft', 'Archived'].includes(property.status ?? 'Published')),
    publicDevelopments: data.developments.filter((development) => development.publicationStatus !== 'Draft' && development.publicationStatus !== 'Archived'),
  }

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>
}

export function useAdminData() {
  const context = useContext(RepositoryContext)
  if (!context) throw new Error('useAdminData must be used within AdminDataProvider')
  return context
}

export function getAdminMediaSeed() {
  const uniqueAssets = new Map<string, string>()
  for (const [name, src] of Object.entries(assets)) if (!uniqueAssets.has(src)) uniqueAssets.set(src, name)
  return [...uniqueAssets].map(([src, name]) => ({ id: name, name: decodeURIComponent(src.split('/').at(-1) ?? name), src, alt: name.replaceAll(/([A-Z])/g, ' $1').trim() }))
}
export const siteConfig = {
  companyName: 'Auren Estates',
  tagline: 'Exceptional Places. Considered Living.',
  fonts: {
    display: 'Playfair Display',
    body: 'DM Sans',
  },
  brand: {
    forest: '#183c32',
    ivory: '#f5f3ed',
    brass: '#b39969',
  },
  country: 'Kenya',
  currency: 'KES',
  locale: 'en-KE',
  areaUnit: 'm²' as 'm²' | 'ft²',
  contact: {
    phone: '+254 700 000 000',
    email: 'hello@example.com',
    whatsappNumber: '',
    isPlaceholder: true,
  },
  agent: {
    name: 'Auren Property Desk',
    title: 'Property advisory',
    image: '/assets/sitting-room.jpg',
  },
  navigation: [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Developments', to: '/developments' },
    { label: 'Our approach', to: '/#about' },
    { label: 'Contact', to: '/contact' },
  ],
  categories: [
    { label: 'Private homes', category: 'Villa', image: 'modern-large-roof-house.jpg' },
    { label: 'Apartments', category: 'Apartment', image: 'luxary-apartment-building.jpg' },
    { label: 'Townhouses', category: 'Townhouse', image: 'modern-flat-roof-houses.jpg' },
    { label: 'Commercial', category: 'Commercial', image: 'arial-view-houses.jpg' },
    { label: 'Land', category: 'Land', image: 'modern-houses.jpg' },
    { label: 'Developments', to: '/developments', image: 'rooftop-aprtment-swimming-pool.jpg' },
  ],
  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
  ],
} as const
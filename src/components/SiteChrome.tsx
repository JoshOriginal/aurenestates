import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { siteConfig } from '../data/config'
import { useAdminData } from '../context/AdminDataContext'

export function Header() {
  const { data } = useAdminData()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(window.scrollY > 48)
  const location = useLocation()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  return (
    <header className={`site-header ${scrolled || location.pathname !== '/' ? 'is-solid' : ''}`}>
      <div className="header-inner">
        <Link className="wordmark" to="/" aria-label={`${data.settings.companyName} home`}>
          {data.settings.logoUrl ? <img className="wordmark-logo" src={data.settings.logoUrl} alt="" /> : <span className="wordmark-mark">{data.settings.companyName[0]}</span>}
          <span>{data.settings.companyName.split(' ')[0].toUpperCase()} <small>{data.settings.companyName.split(' ').slice(1).join(' ').toUpperCase()}</small></span>
        </Link>
        <button className="mobile-menu-toggle icon-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {data.settings.navigation.map((item) => item.to.includes('#') ? (
            <a key={item.label} href={item.to} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ) : (
            <NavLink key={item.label} to={item.to} end={item.to === '/'}>{item.label}</NavLink>
          ))}
          <Link className="button button-dark header-book" to="/contact?kind=viewing">Book a viewing <ArrowUpRight size={15} /></Link>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  const { data } = useAdminData()
  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand">
          <Link className="wordmark" to="/" aria-label={`${data.settings.companyName} home`}>{data.settings.logoUrl ? <img className="wordmark-logo" src={data.settings.logoUrl} alt="" /> : <span className="wordmark-mark">{data.settings.companyName[0]}</span>}<span>{data.settings.companyName.split(' ')[0].toUpperCase()} <small>{data.settings.companyName.split(' ').slice(1).join(' ').toUpperCase()}</small></span></Link>
          <p>{data.settings.footerNote}</p>
          <span className="demo-note">Fictional demonstration brand</span>
        </div>
        <div className="footer-column"><h2>Explore</h2><Link to="/properties">Properties</Link><Link to="/developments">Developments</Link><Link to="/#about">Our approach</Link><Link to="/contact">Contact</Link></div>
        <div className="footer-column"><h2>Property</h2><Link to="/properties?category=Villa">Private homes</Link><Link to="/properties?category=Apartment">Apartments</Link><Link to="/properties?category=Townhouse">Townhouses</Link><Link to="/properties?category=Land">Land</Link></div>
        <div className="footer-column"><h2>Get in touch</h2><a href={`mailto:${data.settings.email}`}>{data.settings.email}</a><a href={`tel:${data.settings.phone.replaceAll(' ', '')}`}>{data.settings.phone}</a><span className="demo-note">{siteConfig.contact.isPlaceholder ? 'Placeholder contact details' : 'Contact details'}</span><div className="footer-social">{data.settings.socialLinks.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noreferrer">{social.label}<ArrowUpRight size={13} /></a>)}</div></div>
      </div>
      <div className="footer-bottom wrap"><span>© {new Date().getFullYear()} {data.settings.companyName}. Demo identity.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><span>Designed for considered living</span></div>
    </footer>
  )
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return <div className="page-intro wrap"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
}
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedPath, type AppLocale, type RouteKey } from '@/src/i18n/routes'

type ServiceLink = { label: string; routeKey: RouteKey }

function IconMapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-wdd-yellow flex-shrink-0">
      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-wdd-yellow flex-shrink-0">
      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-wdd-yellow flex-shrink-0">
      <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  )
}

export default function Footer() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  const regions = t('regions').split(',')

  const services: ServiceLink[] = [
    { label: nav('geo_fermee'), routeKey: 'geo_fermee' },
    { label: nav('geo_ouverte'), routeKey: 'geo_ouverte' },
    { label: nav('particuliers'), routeKey: 'particuliers' },
    { label: nav('pro'), routeKey: 'pro_chauffagistes' },
    { label: nav('geo_references'), routeKey: 'references' },
    { label: 'Blog', routeKey: 'blog' },
  ]

  return (
    <footer>
      <div className="bg-wdd-black px-8 pt-16 pb-0">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/8">

          {/* Col 1 — Logo + desc + CTA + socials */}
          <div className="flex flex-col">
            <Link href={getLocalizedPath(locale, 'home')} className="flex items-center mb-5">
              <div className="relative w-44 h-12">
                <Image src="/images/wdd_logo_white.svg" alt="WellDoneDrill" fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-xs font-extralight text-white/40 leading-relaxed mb-5">
              {t('desc')}
            </p>
            <Link
              href={getLocalizedPath(locale, 'demarrer')}
              className="block py-3 bg-wdd-yellow text-wdd-black text-xs font-bold text-center rounded-sm hover:bg-white transition-colors mb-4"
            >
              {t('cta')}
            </Link>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/company/welldonedrill" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/30 hover:text-wdd-yellow transition-colors">
                <IconLinkedIn />
              </a>
              <a href="https://www.facebook.com/welldonedrill" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/30 hover:text-wdd-yellow transition-colors">
                <IconFacebook />
              </a>
              <a href="https://www.instagram.com/welldonedrill" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/30 hover:text-wdd-yellow transition-colors">
                <IconInstagram />
              </a>
            </div>
          </div>

          {/* Col 2 — Services */}
          <div className="order-3 sm:order-2">
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('services_title')}
            </div>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.routeKey}>
                  <Link href={getLocalizedPath(locale, s.routeKey)} className="text-xs font-extralight text-white/45 hover:text-wdd-yellow transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Regions */}
          <div className="order-2 sm:order-3">
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('regions_title')}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {regions.map((region) => (
                <div key={region} className="text-xs font-extralight text-white/40">
                  {region.trim()}
                </div>
              ))}
            </div>
          </div>

          {/* Col 4 — Contact + socials */}
          <div>
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('contact_title')}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <IconMapPin />
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{t('address_label')}</div>
                  <div className="text-xs font-extralight text-white/55 leading-relaxed">{t('address')}</div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <IconPhone />
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{t('tel_label')}</div>
                  <a href={`tel:${t('tel').replace(/\s/g, '')}`} className="text-sm font-semibold text-wdd-yellow hover:text-white transition-colors">
                    {t('tel')}
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <IconMail />
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{t('email_label')}</div>
                  <a href={`mailto:${t('email')}`} className="text-xs font-extralight text-white/55 hover:text-wdd-yellow transition-colors">
                    {t('email')}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="bg-black px-8">
        <div className="max-w-screen-xl mx-auto py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-extralight text-white/20">© {t('copy')}</span>
          <div className="flex gap-6">
            <Link href={getLocalizedPath(locale, 'mentions_legales')} className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors">
              {t('legal1')}
            </Link>
            <Link href={getLocalizedPath(locale, 'politique_confidentialite')} className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors">
              {t('legal2')}
            </Link>
            <Link href={getLocalizedPath(locale, 'cookies')} className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors">
              Cookies
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('wdd:cookie-settings'))}
              className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors"
            >
              {locale === 'be-nl' ? 'Cookies beheren' : locale === 'lu-de' ? 'Cookies verwalten' : 'Gérer les cookies'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

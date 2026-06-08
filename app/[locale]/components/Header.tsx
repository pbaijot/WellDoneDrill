'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  getLocalizedPath,
  findRouteKeyByPath,
  type AppLocale,
  type RouteKey,
} from '@/src/i18n/routes'

const LOCALES = [
  { code: 'be-fr', flag: 'BE', label: 'Belgique - Français' },
  { code: 'be-nl', flag: 'BE', label: 'België - Nederlands' },
  { code: 'be-en', flag: 'BE', label: 'Belgium - English' },
  { code: 'fr-fr', flag: 'FR', label: 'France - Français' },
  { code: 'fr-en', flag: 'FR', label: 'France - English' },
  { code: 'lu-fr', flag: 'LU', label: 'Luxembourg - Français' },
  { code: 'lu-de', flag: 'LU', label: 'Luxemburg - Deutsch' },
  { code: 'lu-en', flag: 'LU', label: 'Luxembourg - English' },
] as const

const FLAGS: Record<'BE' | 'FR' | 'LU', string> = {
  BE: 'https://flagcdn.com/w40/be.png',
  FR: 'https://flagcdn.com/w40/fr.png',
  LU: 'https://flagcdn.com/w40/lu.png',
}

type MenuItem = {
  label: string
  sub?: string
  routeKey?: RouteKey
  href?: string
  highlight?: boolean
}

type Menu = {
  key: string
  label: string
  items?: MenuItem[]
  routeKey?: RouteKey
  href?: string
}

export default function Header() {
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const t = useTranslations('nav')

  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)

  const NAV_MENUS: Menu[] = [
    {
      key: 'geo',
      label: t('geo'),
      routeKey: 'geo',
      items: [
        { label: t('geo_fermee'), sub: t('geo_fermee_sub'), routeKey: 'geo_fermee' },
        { label: t('geo_ouverte'), sub: t('geo_ouverte_sub'), routeKey: 'geo_ouverte' },
      ],
    },
    {
      key: 'particuliers',
      label: t('menu_particuliers'),
      routeKey: 'particuliers',
    },
    {
      key: 'pro',
      label: t('menu_pro'),
      routeKey: 'pro',
      items: [
        { label: t('pro_chauffagistes'), sub: t('pro_chauffagistes_sub'), routeKey: 'pro_chauffagistes' },
        { label: t('pro_architectes'), sub: t('pro_architectes_sub'), routeKey: 'pro_architectes' },
        { label: t('pro_entrepreneurs'), sub: t('pro_entrepreneurs_sub'), routeKey: 'pro_entrepreneurs' },
      ],
    },
    {
      key: 'references',
      label: t('menu_references'),
      routeKey: 'references',
    },
    {
      key: 'blog',
      label: t('menu_blog'),
      routeKey: 'blog',
    },
    {
      key: 'a_propos',
      label: t('menu_apropos'),
      routeKey: 'a_propos',
    },
  ]

  const CTA_MENUS: Menu[] = [
    {
      key: 'contact',
      label: t('menu_contact'),
      routeKey: 'contact',
    },
  ]

  const currentLocale = LOCALES.find((l) => l.code === locale) || LOCALES[0]
  const currentRouteKey = findRouteKeyByPath(locale, pathname)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenu(null)
        setLangOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header ref={ref} className="fixed top-0 left-0 right-0 z-50 bg-wdd-yellow">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href={getLocalizedPath(locale, 'home')} className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-30 h-8">
            <Image
              src="/images/wdd_logo_black.svg"
              alt="WellDoneDrill"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {/* Informative links */}
          {NAV_MENUS.map((menu) => {
            if (!menu.items) {
              const href = menu.href ?? (menu.routeKey ? getLocalizedPath(locale, menu.routeKey) : '#')
              return (
                <Link key={menu.key} href={href}
                  className="px-3 py-2 text-sm text-wdd-black border-b-2 border-transparent hover:border-wdd-black/40 transition-all">
                  {menu.label}
                </Link>
              )
            }
            return (
              <div key={menu.key} className="relative"
                onMouseEnter={() => setOpenMenu(menu.key)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <div className={
                  'flex items-center border-b-2 transition-all ' +
                  (openMenu === menu.key ? 'border-wdd-black' : 'border-transparent hover:border-wdd-black/40')
                }>
                  {menu.routeKey ? (
                    <Link
                      href={getLocalizedPath(locale, menu.routeKey)}
                      className="px-3 py-2 text-sm text-wdd-black"
                    >
                      {menu.label}
                    </Link>
                  ) : (
                    <span className="px-3 py-2 text-sm text-wdd-black">{menu.label}</span>
                  )}
                  <span className="pr-3 py-2 text-wdd-black pointer-events-none">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                      className={'transition-transform duration-200 opacity-50 ' + (openMenu === menu.key ? 'rotate-180 opacity-100' : '')}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
                {openMenu === menu.key && (
                  <div className="absolute top-full left-0 bg-wdd-black border-t-2 border-wdd-yellow min-w-56 shadow-2xl z-50">
                    {menu.items.map((item) => (
                      <Link key={item.href ?? item.routeKey}
                        href={item.href ?? (item.routeKey ? getLocalizedPath(locale, item.routeKey) : '#')}
                        onClick={() => setOpenMenu(null)}
                        className="flex flex-col px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors group">
                        <span className="text-sm font-light text-white/85 group-hover:text-wdd-yellow">{item.label}</span>
                        {item.sub && <span className="text-xs text-white/35 mt-0.5">{item.sub}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Separator */}
          <div className="w-px h-4 bg-wdd-black/20 mx-3" />

          {/* CTA buttons */}
          {CTA_MENUS.map((menu) => {
            if (!menu.items) {
              const href = menu.href ?? (menu.routeKey ? getLocalizedPath(locale, menu.routeKey) : '#')
              return (
                <Link key={menu.key} href={href}
                  className="px-5 py-2.5 bg-wdd-black text-white text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors">
                  {menu.label}
                </Link>
              )
            }
            return (
              <div key={menu.key} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                  className={
                    'flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold border-2 transition-all ' +
                    (openMenu === menu.key
                      ? 'bg-transparent text-wdd-black border-wdd-black'
                      : 'bg-wdd-black text-white border-wdd-black hover:bg-transparent hover:text-wdd-black')
                  }
                >
                  {menu.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={'transition-transform duration-200 ' + (openMenu === menu.key ? 'rotate-180' : '')}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {openMenu === menu.key && (
                  <div className="absolute top-full right-0 bg-wdd-black border-t-2 border-wdd-yellow min-w-56 shadow-2xl z-50">
                    {menu.items.map((item) => (
                      <Link key={item.href ?? item.routeKey}
                        href={item.href ?? (item.routeKey ? getLocalizedPath(locale, item.routeKey) : '#')}
                        onClick={() => setOpenMenu(null)}
                        className="flex flex-col px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors group">
                        <span className="text-sm font-light text-white/85 group-hover:text-wdd-yellow">{item.label}</span>
                        {item.sub && <span className="text-xs text-white/35 mt-0.5">{item.sub}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Language picker — far right, no border */}
          <div className="relative ml-6">
            <button
              onClick={() => { setLangOpen(!langOpen); setOpenMenu(null) }}
              className="flex items-center gap-1.5 px-2 py-2 hover:opacity-60 transition-opacity text-sm text-wdd-black"
            >
              <img src={FLAGS[currentLocale.flag]} alt="" width="20" height="14" style={{ height: '14px', width: '20px', objectFit: 'cover' }} />
              <span>{currentLocale.code.split('-')[1].toUpperCase()}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                className={'opacity-50 transition-transform ' + (langOpen ? 'rotate-180' : '')}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-wdd-black border-t-2 border-wdd-yellow min-w-52 shadow-2xl z-50">
                {LOCALES.map((l) => {
                  const targetHref = currentRouteKey
                    ? getLocalizedPath(l.code as AppLocale, currentRouteKey)
                    : getLocalizedPath(l.code as AppLocale, 'home')
                  return (
                    <Link key={l.code} href={targetHref} onClick={() => setLangOpen(false)}
                      className={'flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors ' + (l.code === locale ? 'text-wdd-yellow' : 'text-white/75')}>
                      <img src={FLAGS[l.flag]} alt="" width="20" height="14" style={{ height: '14px', width: '20px', objectFit: 'cover' }} />
                      <span className="text-sm font-light">{l.label}</span>
                      {l.code === locale && <span className="ml-auto text-xs">ok</span>}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        <button className="lg:hidden p-2 text-wdd-black" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <div className={'w-5 h-0.5 bg-wdd-black mb-1.5 transition-all origin-center ' + (mobileOpen ? 'rotate-45 translate-y-2' : '')} />
          <div className={'w-5 h-0.5 bg-wdd-black mb-1.5 transition-all ' + (mobileOpen ? 'opacity-0' : '')} />
          <div className={'w-5 h-0.5 bg-wdd-black transition-all origin-center ' + (mobileOpen ? '-rotate-45 -translate-y-2' : '')} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-wdd-black border-t-2 border-wdd-yellow">
          {/* Nav links */}
          {NAV_MENUS.map((menu) => {
            if (!menu.items) {
              const href = menu.href ?? (menu.routeKey ? getLocalizedPath(locale, menu.routeKey) : '#')
              return (
                <div key={menu.key} className="border-b border-white/10">
                  <Link href={href} onClick={() => setMobileOpen(false)}
                    className="block px-6 py-4 text-sm font-light text-white/85 hover:text-white">
                    {menu.label}
                  </Link>
                </div>
              )
            }
            return (
              <div key={menu.key} className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  {menu.routeKey ? (
                    <Link href={getLocalizedPath(locale, menu.routeKey)} onClick={() => setMobileOpen(false)}
                      className="flex-1 px-6 py-4 text-sm font-light text-white/85 hover:text-white">
                      {menu.label}
                    </Link>
                  ) : (
                    <span className="flex-1 px-6 py-4 text-sm font-light text-white/85">{menu.label}</span>
                  )}
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === menu.key ? null : menu.key)}
                    className="px-6 py-4 text-white/50"
                    aria-label="Ouvrir sous-menu"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                      className={'transition-transform ' + (mobileExpanded === menu.key ? 'rotate-180' : '')}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                {mobileExpanded === menu.key && (
                  <div className="pb-2">
                    {menu.items.map((item) => (
                      <Link key={item.href ?? item.routeKey}
                        href={item.href ?? (item.routeKey ? getLocalizedPath(locale, item.routeKey) : '#')}
                        onClick={() => setMobileOpen(false)}
                        className="block px-8 py-3 text-sm text-white/60 hover:text-white">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* CTA buttons */}
          <div className="p-4 flex flex-col gap-2">
            {CTA_MENUS.map((menu) => {
              if (!menu.items) {
                const href = menu.href ?? (menu.routeKey ? getLocalizedPath(locale, menu.routeKey) : '#')
                return (
                  <Link key={menu.key} href={href} onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 bg-wdd-yellow text-wdd-black text-sm font-bold">
                    {menu.label}
                  </Link>
                )
              }
              return (
                <div key={menu.key}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === menu.key ? null : menu.key)}
                    className="w-full flex items-center justify-between py-3 px-4 bg-wdd-yellow text-wdd-black text-sm font-bold"
                  >
                    {menu.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                      className={'transition-transform ' + (mobileExpanded === menu.key ? 'rotate-180' : '')}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {mobileExpanded === menu.key && (
                    <div className="bg-wdd-black border-t border-wdd-yellow/20">
                      {menu.items.map((item) => (
                        <Link key={item.href ?? item.routeKey}
                          href={item.href ?? (item.routeKey ? getLocalizedPath(locale, item.routeKey) : '#')}
                          onClick={() => setMobileOpen(false)}
                          className="block px-6 py-3 text-sm text-white/70 hover:text-white border-b border-white/5 last:border-b-0">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

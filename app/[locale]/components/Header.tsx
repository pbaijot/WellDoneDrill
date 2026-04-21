'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'

const LOCALES = [
  { code: 'be-fr', flag: 'BE', label: 'Belgique - Français' },
  { code: 'be-nl', flag: 'BE', label: 'België - Nederlands' },
  { code: 'fr-fr', flag: 'FR', label: 'France - Français' },
  { code: 'lu-fr', flag: 'LU', label: 'Luxembourg - Français' },
  { code: 'lu-de', flag: 'LU', label: 'Luxemburg - Deutsch' },
] as const

const FLAGS = {
  BE: 'https://flagcdn.com/w40/be.png',
  FR: 'https://flagcdn.com/w40/fr.png',
  LU: 'https://flagcdn.com/w40/lu.png',
}

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)

  const MENUS = [
  {
    key: 'pac',
    label: t('pac'),
    items: [
      { label: t('pac_fonctionnement'), sub: t('pac_fonctionnement_sub'), href: 'pompes-a-chaleur/fonctionnement' },
      { label: t('pac_chauffage'), sub: t('pac_chauffage_sub'), href: 'pompes-a-chaleur/chauffage' },
      { label: t('pac_climatisation'), sub: t('pac_climatisation_sub'), href: 'pompes-a-chaleur/climatisation' },
      { label: t('pac_avantages'), sub: t('pac_avantages_sub'), href: 'pompes-a-chaleur/avantages' },
    ],
  },
  {
    key: 'geo',
    label: t('geo'),
    items: [
      { label: t('geo_fermee'), sub: t('geo_fermee_sub'), href: 'geothermie/fermee' },
      { label: t('geo_ouverte'), sub: t('geo_ouverte_sub'), href: 'geothermie/ouverte' },
      { label: t('geo_fonctionnement'), sub: t('geo_fonctionnement_sub'), href: 'geothermie/fonctionnement' },
      { label: t('geo_references'), sub: t('geo_references_sub'), href: 'references' },
    ],
  },
  {
    key: 'particuliers',
    label: t('particuliers'),
    items: [
      { label: t('part_calculateur'), sub: t('part_calculateur_sub'), href: 'calculateur' },
      { label: t('part_etapes'), sub: t('part_etapes_sub'), href: 'particuliers/etapes' },
      { label: t('part_installateurs'), sub: t('part_installateurs_sub'), href: 'particuliers/installateurs' },
      { label: t('part_devis'), sub: t('part_devis_sub'), href: 'devis', highlight: true },
    ],
  },
  {
    key: 'pro',
    label: t('pro'),
    items: [
      { label: t('pro_chauffagistes'), sub: t('pro_chauffagistes_sub'), href: 'pro/chauffagistes' },
      { label: t('pro_architectes'), sub: t('pro_architectes_sub'), href: 'pro/architectes' },
      { label: t('pro_entrepreneurs'), sub: t('pro_entrepreneurs_sub'), href: 'pro/entrepreneurs' },
      { label: t('pro_soumission'), sub: t('pro_soumission_sub'), href: 'pro/soumission', highlight: true },
    ],
  },
]

  const currentLocale = LOCALES.find(l => l.code === locale) || LOCALES[0]

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

        <Link href={"/" + locale} className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-30 h-8">
            <Image src="/images/wdd_logo_black.svg" alt="WellDoneDrill" fill className="object-contain" priority />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center flex-1 justify-center">
          {MENUS.map((menu) => (
            <div key={menu.key} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                className={"flex items-center gap-1 px-3 py-2 text-sm text-wdd-black border-b-2 transition-all " + (openMenu === menu.key ? "border-wdd-black font-semibold" : "border-transparent hover:border-wdd-black/40")}
              >
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={"transition-transform duration-200 opacity-50 " + (openMenu === menu.key ? "rotate-180 opacity-100" : "")}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {openMenu === menu.key && (
                <div className="absolute top-full left-0 bg-wdd-black border-t-2 border-wdd-yellow min-w-56 shadow-2xl z-50">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={"/" + locale + "/" + item.href}
                      onClick={() => setOpenMenu(null)}
                      className={"flex flex-col px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors group " + (item.highlight ? "border-t border-wdd-yellow/20" : "")}
                    >
                      <span className={"text-sm font-light " + (item.highlight ? "text-wdd-yellow font-semibold" : "text-white/85 group-hover:text-wdd-yellow")}>{item.label}</span>{item.sub && <span className="text-xs text-white/35 mt-0.5">{item.sub}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setOpenMenu(null) }}
              className="flex items-center gap-2 px-3 py-2 border border-wdd-black/20 bg-white/25 hover:bg-white/40 transition-colors text-sm text-wdd-black"
            >
              <img src={FLAGS[currentLocale.flag]} alt="" width="20" height="14" style={{height:'14px',width:'20px',objectFit:'cover'}} />
              <span>{currentLocale.code.split('-')[1].toUpperCase()}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={"opacity-50 transition-transform " + (langOpen ? "rotate-180" : "")}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-wdd-black border-t-2 border-wdd-yellow min-w-52 shadow-2xl z-50">
                {LOCALES.map((l) => (
                  <Link
                    key={l.code}
                    href={"/" + l.code}
                    onClick={() => setLangOpen(false)}
                    className={"flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors " + (l.code === locale ? "text-wdd-yellow" : "text-white/75")}
                  >
                    <img src={FLAGS[l.flag]} alt="" width="20" height="14" style={{height:'14px',width:'20px',objectFit:'cover'}} />
                    <span className="text-sm font-light">{l.label}</span>
                    {l.code === locale && <span className="ml-auto text-xs">ok</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="https://welldonedrill.odoo.com/my/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-xs text-wdd-black/60 hover:text-wdd-black transition-colors">{t('portal')}</a>

          <Link href={"/" + locale + "/devis"} className="px-5 py-2.5 bg-wdd-black text-wdd-yellow text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors">
            {t('cta')}
          </Link>
        </div>

        <button className="lg:hidden p-2 text-wdd-black" onClick={() => setMobileOpen(!mobileOpen)}>
          <div className={"w-5 h-0.5 bg-wdd-black mb-1.5 transition-all origin-center " + (mobileOpen ? "rotate-45 translate-y-2" : "")} />
          <div className={"w-5 h-0.5 bg-wdd-black mb-1.5 transition-all " + (mobileOpen ? "opacity-0" : "")} />
          <div className={"w-5 h-0.5 bg-wdd-black transition-all origin-center " + (mobileOpen ? "-rotate-45 -translate-y-2" : "")} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-wdd-black border-t-2 border-wdd-yellow">
          {MENUS.map((menu) => (
            <div key={menu.key} className="border-b border-white/10">
              <button onClick={() => setMobileExpanded(mobileExpanded === menu.key ? null : menu.key)} className="w-full flex items-center justify-between px-6 py-4 text-sm font-light text-white/85">
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={"opacity-50 transition-transform " + (mobileExpanded === menu.key ? "rotate-180" : "")}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {mobileExpanded === menu.key && (
                <div className="pb-2">
                  {menu.items.map((item) => (
                    <Link key={item.href} href={"/" + locale + "/" + item.href} onClick={() => setMobileOpen(false)} className={"block px-8 py-3 text-sm " + (item.highlight ? "text-wdd-yellow font-semibold" : "text-white/60 hover:text-white")}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 flex flex-col gap-3">
            <Link href={"/" + locale + "/devis"} onClick={() => setMobileOpen(false)} className="block text-center py-3 bg-wdd-yellow text-wdd-black text-sm font-bold">{t('cta')}</Link>
            <a href="https://welldonedrill.odoo.com/my/" target="_blank" rel="noopener noreferrer" className="block text-center py-2 text-white/40 text-xs">{t('portal')}</a>
          </div>
        </div>
      )}
    </header>
  )
}

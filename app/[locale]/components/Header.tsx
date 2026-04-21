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
]

const FLAGS: Record<string, string> = {
  BE: 'https://flagcdn.com/w40/be.png',
  FR: 'https://flagcdn.com/w40/fr.png',
  LU: 'https://flagcdn.com/w40/lu.png',
}

const MENUS = [
  {
    key: 'pac',
    label: 'Pompes à chaleur',
    items: [
      { label: 'Le fonctionnement', sub: 'Comment ça marche', href: 'pompes-a-chaleur/fonctionnement' },
      { label: 'Chauffage', sub: 'Systèmes de chauffage géothermique', href: 'pompes-a-chaleur/chauffage' },
      { label: 'Climatisation', sub: 'Rafraîchissement naturel', href: 'pompes-a-chaleur/climatisation' },
      { label: 'Les avantages', sub: 'Économies et durabilité', href: 'pompes-a-chaleur/avantages' },
    ],
  },
  {
    key: 'geo',
    label: 'La géothermie',
    items: [
      { label: 'Géothermie fermée', sub: 'Sondes verticales', href: 'geothermie/fermee' },
      { label: 'Géothermie ouverte', sub: 'Nappe phréatique', href: 'geothermie/ouverte' },
      { label: 'Comment ça fonctionne', sub: 'Le principe expliqué', href: 'geothermie/fonctionnement' },
      { label: 'Nos références', sub: '500+ chantiers réalisés', href: 'references' },
    ],
  },
  {
    key: 'particuliers',
    label: 'Pour les particuliers',
    items: [
      { label: 'Calculez votre avantage', sub: 'Simulateur économies', href: 'calculateur' },
      { label: 'Les étapes d’un chantier', sub: 'Du forage à la mise en service', href: 'particuliers/etapes' },
      { label: 'Trouvez un installateur', sub: 'Nos partenaires certifiés', href: 'particuliers/installateurs' },
      { label: 'Votre devis en 5 minutes', sub: 'Réponse rapide garantie', href: 'devis', highlight: true },
    ],
  },
  {
    key: 'pro',
    label: 'Pour les pros',
    items: [
      { label: 'Chauffagistes', sub: 'Devenez partenaire installateur', href: 'pro/chauffagistes' },
      { label: 'Architectes', sub: 'Intégrez la géothermie à vos projets', href: 'pro/architectes' },
      { label: 'Entrepreneurs', sub: 'Solutions pour promoteurs', href: 'pro/entrepreneurs' },
      { label: 'Espace soumission', sub: 'Déposez votre projet', href: 'pro/soumission', highlight: true },
    ],
  },
]

export default function Header() {
  const locale = useLocale()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)

  const currentLocale = LOCALES.find(l => l.code === locale) || LOCALES[0]
  const currentFlag = FLAGS[currentLocale.flag]

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

        <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-10 h-7">
            <Image
              src="/images/wdd_logo_black.svg"
              alt="WellDoneDrill"
              fill
              className="object-contain"
              priority
            />
          </div>
       {/* 
          <span className="text-wdd-black font-semibold text-lg tracking-tight leading-none">
            WellDoneDrill
          </span> 
        */}  
        </Link>

        <nav className="hidden lg:flex items-center flex-1 justify-center">
          {MENUS.map((menu) => (
            <div key={menu.key} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-normal text-wdd-black border-b-2 transition-all ${
                  openMenu === menu.key
                    ? 'border-wdd-black font-semibold'
                    : 'border-transparent hover:border-wdd-black/40'
                }`}
              >
                {menu.label}
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  className={`transition-transform duration-200 opacity-50 ${openMenu === menu.key ? 'rotate-180 opacity-100' : ''}`}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {openMenu === menu.key && (
                <div className="absolute top-full left-0 bg-wdd-black border-t-2 border-wdd-yellow min-w-56 shadow-2xl z-50">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${locale}/${item.href}`}
                      onClick={() => setOpenMenu(null)}
                      className={`flex flex-col px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors group ${
                        item.highlight ? 'border-t border-wdd-yellow/20' : ''
                      }`}
                    >
                      <span className={`text-sm font-light transition-colors ${
                        item.highlight
                          ? 'text-wdd-yellow font-semibold'
                          : 'text-white/85 group-hover:text-wdd-yellow'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-white/35 mt-0.5">{item.sub}</span>
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
              className="flex items-center gap-2 px-3 py-2 border border-wdd-black/20 bg-white/25 hover:bg-white/40 transition-colors text-sm font-normal text-wdd-black"
            >
              <img src={currentFlag} alt={currentLocale.flag} width="20" height="14" className="object-cover" style={{height:'14px',width:'20px'}}/>
              <span>{currentLocale.code.split('-')[1].toUpperCase()}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`opacity-50 transition-transform ${langOpen ? 'rotate-180' : ''}`}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-wdd-black border-t-2 border-wdd-yellow min-w-52 shadow-2xl z-50">
                {LOCALES.map((l) => (
                  <Link
                    key={l.code}
                    href={`/${l.code}`}
                    onClick={() => setLangOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-wdd-yellow/10 transition-colors ${
                      l.code === locale ? 'text-wdd-yellow' : 'text-white/75'
                    }`}
                  >
                    <img src={FLAGS[l.flag]} alt={l.flag} width="20" height="14" className="object-cover flex-shrink-0" style={{height:'14px',width:'20px'}}/>
                    <span className="text-sm font-light">{l.label}</span>
                    {l.code === locale && <span className="ml-auto text-xs text-wdd-yellow">ok</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a href="https://welldonedrill.odoo.com/my/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-xs text-wdd-black/60 hover:text-wdd-black transition-colors">Mon espace</a>

          <Link
            href={`/${locale}/devis`}
            className="px-5 py-2.5 bg-wdd-black text-wdd-yellow text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
          >
            Devis en 5 min
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-wdd-black"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className={`w-5 h-0.5 bg-wdd-black mb-1.5 transition-all origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}/>
          <div className={`w-5 h-0.5 bg-wdd-black mb-1.5 transition-all ${mobileOpen ? 'opacity-0' : ''}`}/>
          <div className={`w-5 h-0.5 bg-wdd-black transition-all origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>

      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-wdd-black border-t-2 border-wdd-yellow">
          {MENUS.map((menu) => (
            <div key={menu.key} className="border-b border-white/8">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === menu.key ? null : menu.key)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-light text-white/85"
              >
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`opacity-50 transition-transform ${mobileExpanded === menu.key ? 'rotate-180' : ''}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {mobileExpanded === menu.key && (
                <div className="pb-2">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${locale}/${item.href}`}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-8 py-3 text-sm transition-colors ${
                        item.highlight ? 'text-wdd-yellow font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 flex flex-col gap-3">
            <Link
              href={`/${locale}/devis`}
              onClick={() => setMobileOpen(false)}
              className="block text-center py-3 bg-wdd-yellow text-wdd-black text-sm font-bold"
            >
              Devis en 5 minutes
            </Link>

            <a
              href="https://welldonedrill.odoo.com/my/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 text-white/40 text-xs"
            >
              Mon espace client
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
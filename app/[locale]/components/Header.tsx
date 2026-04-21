'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

const locales = [
  { code: 'be-fr', label: 'BE-FR' },
  { code: 'be-nl', label: 'BE-NL' },
  { code: 'fr-fr', label: 'FR' },
  { code: 'lu-fr', label: 'LU-FR' },
  { code: 'lu-de', label: 'LU-DE' },
]

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-wdd-black border-b border-wdd-yellow/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <svg width="36" height="26" viewBox="0 0 44 32" fill="none">
            <polygon points="0,0 6,0 11,20 16,8 21,20 26,0 32,0 24,32 18,32 16,22 14,32 8,32" fill="white"/>
            <polygon points="34,0 40,0 44,16 40,32 34,32 38,16" fill="#FFD94F"/>
          </svg>
          <span className="text-white font-semibold text-lg tracking-tight">WellDoneDrill</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { key: 'geothermie', href: 'geothermie' },
            { key: 'references', href: 'references' },
            { key: 'about', href: 'a-propos' },
            { key: 'blog', href: 'blog' },
          ].map((item) => (
            <Link key={item.key} href={`/${locale}/${item.href}`} className="text-white/70 hover:text-white text-sm font-light transition-colors">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center border border-white/10">
            {locales.map((l) => (
              <Link key={l.code} href={`/${l.code}`} className={`px-3 py-1 text-xs border-r border-white/10 last:border-r-0 transition-colors ${locale === l.code ? 'bg-wdd-yellow text-wdd-black font-semibold' : 'text-white/40 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href={`/${locale}/devis`} className="bg-wdd-yellow text-wdd-black px-5 py-2 text-sm font-semibold hover:bg-wdd-yellow/90 transition-colors">
            {t('devis')}
          </Link>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
          <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-wdd-black border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {[
            { key: 'geothermie', href: 'geothermie' },
            { key: 'references', href: 'references' },
            { key: 'about', href: 'a-propos' },
            { key: 'blog', href: 'blog' },
          ].map((item) => (
            <Link key={item.key} href={`/${locale}/${item.href}`} className="text-white/70 text-sm font-light" onClick={() => setMenuOpen(false)}>
              {t(item.key)}
            </Link>
          ))}
          <Link href={`/${locale}/devis`} className="bg-wdd-yellow text-wdd-black px-5 py-3 text-sm font-semibold text-center mt-2" onClick={() => setMenuOpen(false)}>
            {t('devis')}
          </Link>
        </div>
      )}
    </header>
  )
}

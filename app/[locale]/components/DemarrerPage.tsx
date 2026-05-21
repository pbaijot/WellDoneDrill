'use client'

import {useState} from 'react'
import Image from 'next/image'
import type {AppLocale} from '@/src/i18n/routes'
import type {DemarrerPageData} from '@/src/lib/demarrerPage'
import {urlFor} from '@/src/lib/sanityImage'

const ODOO_FORM_URL: Record<AppLocale, string> = {
  'be-fr': 'https://welldonedrill.odoo.com/formulaire',
  'be-nl': 'https://welldonedrill.odoo.com/nl/formulaire',
  'fr-fr': 'https://welldonedrill.odoo.com/formulaire',
  'lu-fr': 'https://welldonedrill.odoo.com/formulaire',
  'lu-de': 'https://welldonedrill.odoo.com/formulaire',
}

type Segment = 'particulier' | 'chauffagiste' | 'architecte' | 'entrepreneur' | null

type LocaleCopy = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  formHeading: string
  segments: {label: string; sub: string}[]
  statFree: string
  statFreeLabel: string
  statDelay: string
  statDelayLabel: string
  statFee: string
  statFeeLabel: string
  selectPrompt: string
}

const COPY: Record<AppLocale, LocaleCopy> = {
  'be-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    formHeading: 'Vous êtes…',
    segments: [
      {label: 'Particulier',    sub: 'Maison individuelle, appartement, villa'},
      {label: 'Chauffagiste',   sub: 'Installateur · partenaire WDD'},
      {label: 'Architecte',     sub: 'Conception, prescription technique'},
      {label: 'Entrepreneur',   sub: 'Promoteur, développeur, investisseur'},
    ],
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
    selectPrompt: 'Sélectionnez votre profil à gauche pour accéder au formulaire.',
  },
  'be-nl': {
    heroEyebrow: 'Uw project starten',
    heroTitle: 'Uw geothermisch project begint hier.',
    heroSubtitle: 'Gratis haalbaarheidsstudie · Antwoord binnen 48u · Vrijblijvend',
    formHeading: 'U bent…',
    segments: [
      {label: 'Particulier',             sub: 'Eengezinswoning, appartement, villa'},
      {label: 'Verwarmingsinstallateur', sub: 'Installateur · WDD-partner'},
      {label: 'Architect',               sub: 'Ontwerp, technische voorschriften'},
      {label: 'Aannemer',                sub: 'Projectontwikkelaar, investeerder'},
    ],
    statFree: 'Gratis', statFreeLabel: 'Haalbaarheidsstudie',
    statDelay: '48u',   statDelayLabel: 'Reactietermijn',
    statFee: '0 €',     statFeeLabel: 'Vrijblijvend',
    selectPrompt: 'Selecteer uw profiel links om het formulier te openen.',
  },
  'fr-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    formHeading: 'Vous êtes…',
    segments: [
      {label: 'Particulier',        sub: 'Maison individuelle, appartement, villa'},
      {label: 'Artisan chauffagiste', sub: 'Installateur · partenaire WDD'},
      {label: 'Architecte',         sub: 'Conception, prescription technique'},
      {label: 'Promoteur',          sub: 'Promoteur, développeur, investisseur'},
    ],
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
    selectPrompt: 'Sélectionnez votre profil à gauche pour accéder au formulaire.',
  },
  'lu-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    formHeading: 'Vous êtes…',
    segments: [
      {label: 'Particulier',    sub: 'Maison individuelle, appartement, villa'},
      {label: 'Chauffagiste',   sub: 'Installateur · partenaire WDD'},
      {label: 'Architecte',     sub: 'Conception, prescription technique'},
      {label: 'Entrepreneur',   sub: 'Promoteur, développeur, investisseur'},
    ],
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
    selectPrompt: 'Sélectionnez votre profil à gauche pour accéder au formulaire.',
  },
  'lu-de': {
    heroEyebrow: 'Ihr Projekt starten',
    heroTitle: 'Ihr Geothermie-Projekt beginnt hier.',
    heroSubtitle: 'Kostenlose Machbarkeitsstudie · Antwort innerhalb 48 Std. · Unverbindlich',
    formHeading: 'Sie sind…',
    segments: [
      {label: 'Privatperson',           sub: 'Einfamilienhaus, Wohnung, Villa'},
      {label: 'Heizungsinstallateur',   sub: 'Installateur · WDD-Partner'},
      {label: 'Architekt',              sub: 'Planung, technische Fachplanung'},
      {label: 'Unternehmer',            sub: 'Projektentwickler, Investor'},
    ],
    statFree: 'Kostenlos', statFreeLabel: 'Machbarkeitsstudie',
    statDelay: '48 Std.',  statDelayLabel: 'Antwortzeit',
    statFee: '0 €',        statFeeLabel: 'Unverbindlich',
    selectPrompt: 'Wählen Sie links Ihr Profil aus, um das Formular zu öffnen.',
  },
}

const SEGMENT_ICONS = [
  <svg key="particulier" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>,
  <svg key="chauffagiste" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
  <svg key="architecte" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6"/>
  </svg>,
  <svg key="entrepreneur" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="1"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>,
]

const SEGMENT_KEYS: Exclude<Segment, null>[] = ['particulier', 'chauffagiste', 'architecte', 'entrepreneur']

export default function DemarrerPage({locale, page}: {locale: AppLocale; page?: DemarrerPageData | null}) {
  const c = COPY[locale]
  const [segment, setSegment] = useState<Segment>(null)

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative h-[45vh] overflow-hidden px-8 md:px-16">
        <Image
          src={page?.heroImage ? urlFor(page.heroImage)?.url() ?? '/images/wdd-geothermie_fermee-terre.webp' : '/images/wdd-geothermie_fermee-terre.webp'}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-wdd-black/70" />
        <div className="relative z-10 max-w-screen-2xl mx-auto h-full flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-white/45 uppercase">
                {page?.heroEyebrow ?? c.heroEyebrow}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {page?.heroTitle ?? c.heroTitle}
            </h1>
            <p className="text-base font-light text-white/55 leading-relaxed">
              {page?.heroSubtitle ?? c.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── Segment selector ───────────────────────────── */}
      <section className="bg-wdd-clay py-16 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-8 leading-snug">{page?.formHeading ?? c.formHeading}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {SEGMENT_KEYS.map((key, i) => {
              const seg = c.segments[i]
              return (
                <button
                  key={key}
                  onClick={() => setSegment(key)}
                  className={
                    'flex flex-col gap-3 p-5 text-left border-2 transition-all duration-200 ' +
                    (segment === key
                      ? 'border-wdd-black bg-wdd-black text-white'
                      : 'border-black/12 bg-white hover:border-wdd-black/40 text-wdd-black')
                  }
                >
                  <div className={segment === key ? 'text-wdd-yellow' : 'text-wdd-black/50'}>{SEGMENT_ICONS[i]}</div>
                  <div>
                    <div className="text-sm font-bold">{seg.label}</div>
                    <div className={`text-xs font-light mt-0.5 ${segment === key ? 'text-white/55' : 'text-black/40'}`}>{seg.sub}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-8 border-t border-black/10 pt-8">
            <div className="flex flex-wrap gap-8 md:gap-16">
              {[
                {value: c.statFree,  label: c.statFreeLabel},
                {value: c.statDelay, label: c.statDelayLabel},
                {value: c.statFee,   label: c.statFeeLabel},
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-wdd-black">{s.value}</div>
                  <div className="text-xs font-light text-black/40 mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-wdd-black">{page?.phone ?? '+32 478 75 36 79'}</span>
              <span className="text-xs font-light text-black/45">{page?.email ?? 'info@welldonedrill.energy'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Odoo iframe ────────────────────────────────── */}
      <section className="bg-wdd-black px-8 md:px-16 py-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          {!segment ? (
            <div className="flex flex-col items-center justify-center min-h-[320px] text-center bg-wdd-clay">
              <div className="w-12 h-12 bg-white flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
                  <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/>
                </svg>
              </div>
              <p className="text-sm font-light text-black/40 leading-relaxed max-w-xs">
                {c.selectPrompt}
              </p>
            </div>
          ) : (
            <div className="h-[900px] lg:h-[700px]">
              <iframe
                src={ODOO_FORM_URL[locale]}
                title="Formulaire de contact WellDoneDrill"
                width="100%"
                height="100%"
                scrolling="no"
                style={{border: 'none', display: 'block'}}
                loading="lazy"
                allow="fullscreen"
              />
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

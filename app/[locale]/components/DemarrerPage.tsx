'use client'

import Image from 'next/image'
import type {AppLocale} from '@/src/i18n/routes'
import type {DemarrerPageData} from '@/src/lib/demarrerPage'
import {urlFor} from '@/src/lib/sanityImage'

const ODOO_FORM_URL = 'https://welldonedrill.odoo.com/formulaire'

type LocaleCopy = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  statFree: string
  statFreeLabel: string
  statDelay: string
  statDelayLabel: string
  statFee: string
  statFeeLabel: string
}

const COPY: Record<AppLocale, LocaleCopy> = {
  'be-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
  },
  'be-nl': {
    heroEyebrow: 'Uw project starten',
    heroTitle: 'Uw geothermisch project begint hier.',
    heroSubtitle: 'Gratis haalbaarheidsstudie · Antwoord binnen 48u · Vrijblijvend',
    statFree: 'Gratis', statFreeLabel: 'Haalbaarheidsstudie',
    statDelay: '48u',   statDelayLabel: 'Reactietermijn',
    statFee: '0 €',     statFeeLabel: 'Vrijblijvend',
  },
  'fr-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
  },
  'lu-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
  },
  'lu-de': {
    heroEyebrow: 'Ihr Projekt starten',
    heroTitle: 'Ihr Geothermie-Projekt beginnt hier.',
    heroSubtitle: 'Kostenlose Machbarkeitsstudie · Antwort innerhalb 48 Std. · Unverbindlich',
    statFree: 'Kostenlos', statFreeLabel: 'Machbarkeitsstudie',
    statDelay: '48 Std.',  statDelayLabel: 'Antwortzeit',
    statFee: '0 €',        statFeeLabel: 'Unverbindlich',
  },
}

export default function DemarrerPage({locale, page}: {locale: AppLocale; page?: DemarrerPageData | null}) {
  const c = COPY[locale]

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

      {/* ── Stats bar ──────────────────────────────────── */}
      <div className="bg-wdd-black px-8 md:px-16 py-6">
        <div className="max-w-screen-2xl mx-auto w-full flex flex-wrap gap-8 md:gap-16 items-center justify-between">
          <div className="flex flex-wrap gap-8 md:gap-16">
            {[
              {value: c.statFree,  label: c.statFreeLabel},
              {value: c.statDelay, label: c.statDelayLabel},
              {value: c.statFee,   label: c.statFeeLabel},
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-3">
                <span className="text-xl font-bold text-wdd-yellow">{s.value}</span>
                <span className="text-xs font-light text-white/45">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-white">{page?.phone ?? '+32 478 75 36 79'}</span>
            <span className="text-xs font-light text-white/40">{page?.email ?? 'info@welldonedrill.energy'}</span>
          </div>
        </div>
      </div>

      {/* ── Odoo form iframe ───────────────────────────── */}
      <section className="bg-wdd-clay flex-1 px-8 md:px-16 py-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <iframe
            src={ODOO_FORM_URL}
            title="Formulaire de contact WellDoneDrill"
            width="100%"
            style={{minHeight: '780px', border: 'none', display: 'block'}}
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </section>

    </div>
  )
}

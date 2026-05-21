'use client'

import {useState} from 'react'
import Image from 'next/image'
import type {AppLocale} from '@/src/i18n/routes'
import type {DemarrerPageData} from '@/src/lib/demarrerPage'
import {urlFor} from '@/src/lib/sanityImage'

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
  formHeader: string
  fieldFirstName: string
  fieldLastName: string
  fieldEmail: string
  fieldPhone: string
  fieldCompany: string
  fieldAddress: string
  fieldZip: string
  fieldCity: string
  messagePlaceholderParticulier: string
  messagePlaceholderPro: string
  submit: string
  sending: string
  successTitle: string
  successBody: string
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
    formHeader: 'Votre projet en quelques lignes',
    fieldFirstName: 'Prénom', fieldLastName: 'Nom',
    fieldEmail: 'Email', fieldPhone: 'Téléphone',
    fieldCompany: 'Société', fieldAddress: 'Adresse du bien',
    fieldZip: 'Code postal', fieldCity: 'Ville',
    messagePlaceholderParticulier: 'Chauffage actuel, superficie, type de projet…',
    messagePlaceholderPro: 'Décrivez votre projet ou votre demande de partenariat…',
    submit: 'Envoyer ma demande →', sending: 'Envoi…',
    successTitle: 'Message envoyé.',
    successBody: 'Notre équipe vous recontacte sous 48h pour analyser votre projet.',
  },
  'be-nl': {
    heroEyebrow: 'Uw project starten',
    heroTitle: 'Uw geothermisch project begint hier.',
    heroSubtitle: 'Gratis haalbaarheidsstudie · Antwoord binnen 48u · Vrijblijvend',
    formHeading: 'U bent…',
    segments: [
      {label: 'Particulier',         sub: 'Eengezinswoning, appartement, villa'},
      {label: 'Verwarmingsinstallateur', sub: 'Installateur · WDD-partner'},
      {label: 'Architect',           sub: 'Ontwerp, technische voorschriften'},
      {label: 'Aannemer',            sub: 'Projectontwikkelaar, investeerder'},
    ],
    statFree: 'Gratis', statFreeLabel: 'Haalbaarheidsstudie',
    statDelay: '48u',   statDelayLabel: 'Reactietermijn',
    statFee: '0 €',     statFeeLabel: 'Vrijblijvend',
    selectPrompt: 'Selecteer uw profiel links om het formulier te openen.',
    formHeader: 'Uw project in enkele regels',
    fieldFirstName: 'Voornaam', fieldLastName: 'Naam',
    fieldEmail: 'E-mail', fieldPhone: 'Telefoon',
    fieldCompany: 'Bedrijf', fieldAddress: 'Adres van het pand',
    fieldZip: 'Postcode', fieldCity: 'Gemeente',
    messagePlaceholderParticulier: 'Huidige verwarming, oppervlakte, projecttype…',
    messagePlaceholderPro: 'Beschrijf uw project of uw partnerschapsaanvraag…',
    submit: 'Mijn aanvraag versturen →', sending: 'Verzenden…',
    successTitle: 'Bericht verzonden.',
    successBody: 'Ons team neemt binnen 48u contact met u op om uw project te bespreken.',
  },
  'fr-fr': {
    heroEyebrow: 'Démarrer votre projet',
    heroTitle: 'Votre projet géothermique commence ici.',
    heroSubtitle: 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement',
    formHeading: 'Vous êtes…',
    segments: [
      {label: 'Particulier',       sub: 'Maison individuelle, appartement, villa'},
      {label: 'Artisan chauffagiste', sub: 'Installateur · partenaire WDD'},
      {label: 'Architecte',        sub: 'Conception, prescription technique'},
      {label: 'Promoteur',         sub: 'Promoteur, développeur, investisseur'},
    ],
    statFree: 'Gratuit', statFreeLabel: 'Étude de faisabilité',
    statDelay: '48h',    statDelayLabel: 'Délai de réponse',
    statFee: '0 €',      statFeeLabel: 'Sans engagement',
    selectPrompt: 'Sélectionnez votre profil à gauche pour accéder au formulaire.',
    formHeader: 'Votre projet en quelques lignes',
    fieldFirstName: 'Prénom', fieldLastName: 'Nom',
    fieldEmail: 'Email', fieldPhone: 'Téléphone',
    fieldCompany: 'Société', fieldAddress: 'Adresse du bien',
    fieldZip: 'Code postal', fieldCity: 'Ville',
    messagePlaceholderParticulier: 'Chauffage actuel, superficie, type de projet…',
    messagePlaceholderPro: 'Décrivez votre projet ou votre demande de partenariat…',
    submit: 'Envoyer ma demande →', sending: 'Envoi…',
    successTitle: 'Message envoyé.',
    successBody: 'Notre équipe vous recontacte sous 48h pour analyser votre projet.',
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
    formHeader: 'Votre projet en quelques lignes',
    fieldFirstName: 'Prénom', fieldLastName: 'Nom',
    fieldEmail: 'Email', fieldPhone: 'Téléphone',
    fieldCompany: 'Société', fieldAddress: 'Adresse du bien',
    fieldZip: 'Code postal', fieldCity: 'Localité',
    messagePlaceholderParticulier: 'Chauffage actuel, superficie, type de projet…',
    messagePlaceholderPro: 'Décrivez votre projet ou votre demande de partenariat…',
    submit: 'Envoyer ma demande →', sending: 'Envoi…',
    successTitle: 'Message envoyé.',
    successBody: 'Notre équipe vous recontacte sous 48h pour analyser votre projet.',
  },
  'lu-de': {
    heroEyebrow: 'Ihr Projekt starten',
    heroTitle: 'Ihr Geothermie-Projekt beginnt hier.',
    heroSubtitle: 'Kostenlose Machbarkeitsstudie · Antwort innerhalb 48 Std. · Unverbindlich',
    formHeading: 'Sie sind…',
    segments: [
      {label: 'Privatperson',          sub: 'Einfamilienhaus, Wohnung, Villa'},
      {label: 'Heizungsinstallateur',  sub: 'Installateur · WDD-Partner'},
      {label: 'Architekt',             sub: 'Planung, technische Fachplanung'},
      {label: 'Unternehmer',           sub: 'Projektentwickler, Investor'},
    ],
    statFree: 'Kostenlos', statFreeLabel: 'Machbarkeitsstudie',
    statDelay: '48 Std.',  statDelayLabel: 'Antwortzeit',
    statFee: '0 €',        statFeeLabel: 'Unverbindlich',
    selectPrompt: 'Wählen Sie links Ihr Profil aus, um das Formular zu öffnen.',
    formHeader: 'Ihr Projekt in wenigen Zeilen',
    fieldFirstName: 'Vorname', fieldLastName: 'Nachname',
    fieldEmail: 'E-Mail', fieldPhone: 'Telefon',
    fieldCompany: 'Unternehmen', fieldAddress: 'Adresse des Objekts',
    fieldZip: 'Postleitzahl', fieldCity: 'Ort',
    messagePlaceholderParticulier: 'Aktuelle Heizung, Fläche, Projektart…',
    messagePlaceholderPro: 'Beschreiben Sie Ihr Projekt oder Ihre Partnerschaftsanfrage…',
    submit: 'Meine Anfrage absenden →', sending: 'Senden…',
    successTitle: 'Nachricht gesendet.',
    successBody: 'Unser Team meldet sich innerhalb von 48 Std., um Ihr Projekt zu besprechen.',
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

const INPUT = 'bg-white border border-black/12 px-4 py-3 text-sm text-wdd-black placeholder:text-black/30 focus:outline-none focus:border-wdd-black/40 transition-colors w-full'

export default function DemarrerPage({locale, page}: {locale: AppLocale; page?: DemarrerPageData | null}) {
  const c = COPY[locale]
  const [segment, setSegment] = useState<Segment>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = {...Object.fromEntries(new FormData(e.currentTarget)), segment}
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
    } catch {}
    setSent(true)
    setLoading(false)
  }

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

      {/* ── Form ───────────────────────────────────────── */}
      <section className="bg-wdd-clay py-20 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* LEFT — segment + stats */}
            <div>
              <h2 className="text-2xl font-bold mb-8 leading-snug">{page?.formHeading ?? c.formHeading}</h2>
              <div className="grid grid-cols-2 gap-3 mb-12">
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

              <div className="grid grid-cols-3 gap-6 border-t border-black/10 pt-8 mb-10">
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

            {/* RIGHT — form */}
            <div className="bg-white p-8 lg:p-10 shadow-sm">
              {!segment ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                  <div className="w-12 h-12 bg-wdd-clay flex items-center justify-center mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
                      <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-light text-black/40 leading-relaxed max-w-xs">
                    {c.selectPrompt}
                  </p>
                </div>
              ) : sent ? (
                <div className="flex flex-col justify-center min-h-[320px]">
                  <div className="w-10 h-10 bg-wdd-yellow flex items-center justify-center mb-6">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{page?.successTitle ?? c.successTitle}</h3>
                  <p className="text-sm font-light text-black/55 leading-7">
                    {page?.successBody ?? c.successBody}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest text-black/30 mb-6">
                    {c.formHeader}
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input name="prenom" placeholder={c.fieldFirstName} required className={INPUT} />
                      <input name="nom" placeholder={c.fieldLastName} required className={INPUT} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input name="email" type="email" placeholder={c.fieldEmail} required className={INPUT} />
                      <input name="phone" type="tel" placeholder={c.fieldPhone} className={INPUT} />
                    </div>
                    {segment !== 'particulier' && (
                      <input name="societe" placeholder={c.fieldCompany} className={INPUT} />
                    )}
                    {segment === 'particulier' && (
                      <>
                        <input name="adresse" placeholder={c.fieldAddress} className={INPUT} />
                        <div className="grid grid-cols-[120px_1fr] gap-3">
                          <input name="cp" placeholder={c.fieldZip} className={INPUT} />
                          <input name="ville" placeholder={c.fieldCity} className={INPUT} />
                        </div>
                      </>
                    )}
                    <textarea
                      name="message"
                      placeholder={segment === 'particulier' ? c.messagePlaceholderParticulier : c.messagePlaceholderPro}
                      rows={4}
                      className={INPUT + ' resize-none'}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-wdd-black text-wdd-yellow px-6 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors mt-1 disabled:opacity-50"
                    >
                      {loading ? c.sending : c.submit}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

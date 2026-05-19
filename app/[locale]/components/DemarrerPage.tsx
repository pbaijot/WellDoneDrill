'use client'

import {useState} from 'react'
import Image from 'next/image'
import type {AppLocale} from '@/src/i18n/routes'
import type {DemarrerPageData} from '@/src/lib/demarrerPage'
import {urlFor} from '@/src/lib/sanityImage'

type Segment = 'particulier' | 'chauffagiste' | 'architecte' | 'entrepreneur' | null

const SEGMENTS = [
  {
    key: 'particulier' as const,
    label: 'Particulier',
    sub: 'Maison individuelle, appartement, villa',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    key: 'chauffagiste' as const,
    label: 'Chauffagiste',
    sub: 'Installateur · partenaire WDD',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    key: 'architecte' as const,
    label: 'Architecte',
    sub: 'Conception, prescription technique',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6"/>
      </svg>
    ),
  },
  {
    key: 'entrepreneur' as const,
    label: 'Entrepreneur',
    sub: 'Promoteur, développeur, investisseur',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="1"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
]

const INPUT = 'bg-white border border-black/12 px-4 py-3 text-sm text-wdd-black placeholder:text-black/30 focus:outline-none focus:border-wdd-black/40 transition-colors w-full'

export default function DemarrerPage({locale: _locale, page}: {locale: AppLocale; page?: DemarrerPageData | null}) {
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
                {page?.heroEyebrow ?? 'Démarrer votre projet'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {page?.heroTitle ?? 'Votre projet géothermique commence ici.'}
            </h1>
            <p className="text-base font-light text-white/55 leading-relaxed">
              {page?.heroSubtitle ?? 'Étude de faisabilité gratuite · Réponse sous 48h · Sans engagement'}
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
              <h2 className="text-2xl font-bold mb-8 leading-snug">{page?.formHeading ?? 'Vous êtes…'}</h2>
              <div className="grid grid-cols-2 gap-3 mb-12">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSegment(s.key)}
                    className={
                      'flex flex-col gap-3 p-5 text-left border-2 transition-all duration-200 ' +
                      (segment === s.key
                        ? 'border-wdd-black bg-wdd-black text-white'
                        : 'border-black/12 bg-white hover:border-wdd-black/40 text-wdd-black')
                    }
                  >
                    <div className={segment === s.key ? 'text-wdd-yellow' : 'text-wdd-black/50'}>{s.icon}</div>
                    <div>
                      <div className="text-sm font-bold">{s.label}</div>
                      <div className={`text-xs font-light mt-0.5 ${segment === s.key ? 'text-white/55' : 'text-black/40'}`}>{s.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-black/10 pt-8 mb-10">
                {[
                  {value: 'Gratuit', label: 'Étude de faisabilité'},
                  {value: '48h',    label: 'Délai de réponse'},
                  {value: '0 €',    label: 'Sans engagement'},
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
                    Sélectionnez votre profil à gauche pour accéder au formulaire.
                  </p>
                </div>
              ) : sent ? (
                <div className="flex flex-col justify-center min-h-[320px]">
                  <div className="w-10 h-10 bg-wdd-yellow flex items-center justify-center mb-6">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{page?.successTitle ?? 'Message envoyé.'}</h3>
                  <p className="text-sm font-light text-black/55 leading-7">
                    {page?.successBody ?? 'Notre équipe vous recontacte sous 48h pour analyser votre projet.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest text-black/30 mb-6">
                    Votre projet en quelques lignes
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input name="prenom" placeholder="Prénom" required className={INPUT} />
                      <input name="nom" placeholder="Nom" required className={INPUT} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input name="email" type="email" placeholder="Email" required className={INPUT} />
                      <input name="phone" type="tel" placeholder="Téléphone" className={INPUT} />
                    </div>
                    {segment !== 'particulier' && (
                      <input name="societe" placeholder="Société" className={INPUT} />
                    )}
                    {segment === 'particulier' && (
                      <>
                        <input name="adresse" placeholder="Adresse du bien" className={INPUT} />
                        <div className="grid grid-cols-[120px_1fr] gap-3">
                          <input name="cp" placeholder="Code postal" className={INPUT} />
                          <input name="ville" placeholder="Ville" className={INPUT} />
                        </div>
                      </>
                    )}
                    <textarea
                      name="message"
                      placeholder={
                        segment === 'particulier'
                          ? 'Chauffage actuel, superficie, type de projet…'
                          : 'Décrivez votre projet ou votre demande de partenariat…'
                      }
                      rows={4}
                      className={INPUT + ' resize-none'}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-wdd-black text-wdd-yellow px-6 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors mt-1 disabled:opacity-50"
                    >
                      {loading ? 'Envoi…' : 'Envoyer ma demande →'}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Team photo ─────────────────────────────────── */}
      <section className="relative h-64 overflow-hidden">
        <Image
          src={page?.teamImage ? urlFor(page.teamImage)?.url() ?? '/images/team.jpg' : '/images/team.jpg'}
          alt="Équipe WellDoneDrill"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-wdd-black/50" />
        <div className="absolute inset-0 flex items-end px-8 md:px-16 pb-10">
          <div className="max-w-screen-2xl mx-auto w-full">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
              {page?.teamCaption ?? "L'équipe WellDoneDrill"}
            </p>
            <p className="text-white text-xl font-bold">
              {page?.teamLabel ?? "Experts en géothermie depuis 2009"}
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

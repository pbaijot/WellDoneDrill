import Link from 'next/link'
import Image from 'next/image'
import {getLocalizedPath, type AppLocale, PHONE_BY_LOCALE} from '@/src/i18n/routes'
import {urlFor} from '@/src/lib/sanityImage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'

type Variant = 'dark' | 'clay'

const COPY = {
  'be-fr': {
    title: 'Votre projet commence ici.',
    body: "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement.",
    buttonLabel: 'Démarrer votre projet →',
    orCall: 'ou appelez-nous',
    stat1Value: 'Gratuit', stat1Label: 'Étude de faisabilité',
    stat2Value: '48h', stat2Label: 'Délai de réponse',
  },
  'be-nl': {
    title: 'Uw project begint hier.',
    body: "Gratis geologische studie, vergunning, boren — één team van A tot Z.\nAntwoord binnen 48u, zonder engagement.",
    buttonLabel: 'Mijn project starten →',
    orCall: 'of bel ons',
    stat1Value: 'Gratis', stat1Label: 'Haalbaarheidsstudie',
    stat2Value: '48u', stat2Label: 'Reactietijd',
  },
  'fr-fr': {
    title: 'Votre projet commence ici.',
    body: "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement.",
    buttonLabel: 'Démarrer votre projet →',
    orCall: 'ou appelez-nous',
    stat1Value: 'Gratuit', stat1Label: 'Étude de faisabilité',
    stat2Value: '48h', stat2Label: 'Délai de réponse',
  },
  'lu-fr': {
    title: 'Votre projet commence ici.',
    body: "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement.",
    buttonLabel: 'Démarrer votre projet →',
    orCall: 'ou appelez-nous',
    stat1Value: 'Gratuit', stat1Label: 'Étude de faisabilité',
    stat2Value: '48h', stat2Label: 'Délai de réponse',
  },
  'lu-de': {
    title: 'Ihr Projekt beginnt hier.',
    body: "Kostenlose geologische Studie, Genehmigung, Bohrung — ein Team von A bis Z.\nAntwort innerhalb von 48h, unverbindlich.",
    buttonLabel: 'Mein Projekt starten →',
    orCall: 'oder rufen Sie uns an',
    stat1Value: 'Kostenlos', stat1Label: 'Machbarkeitsstudie',
    stat2Value: '48h', stat2Label: 'Antwortzeit',
  },
} as const

export default function DemarrerCTA({
  locale,
  variant = 'dark',
  settings,
}: {
  locale: AppLocale
  variant?: Variant
  settings?: GlobalSettingsData | null
}) {
  const dark = variant === 'dark'
  const copy = COPY[locale] ?? COPY['be-fr']

  const title = copy.title
  const body = copy.body
  const buttonLabel = copy.buttonLabel
  const phone = PHONE_BY_LOCALE[locale] ?? settings?.phone
  const teamImageUrl = settings?.ctaImage ? urlFor(settings.ctaImage)?.url() ?? '/images/team.jpg' : '/images/team.jpg'
  const stat1Value = copy.stat1Value
  const stat1Label = copy.stat1Label
  const stat2Value = copy.stat2Value
  const stat2Label = copy.stat2Label

  return (
    <section className={`${dark ? 'bg-wdd-black' : 'bg-wdd-clay'} overflow-hidden`}>

      {/* Row 1 — content left + image right */}
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 lg:pr-20 pt-24 pb-16 flex flex-col">
          <h2 className={`text-3xl font-bold leading-tight mb-5 ${dark ? 'text-white' : 'text-wdd-black'}`}>
            {title}
          </h2>
          <p className={`text-base font-light leading-8 mb-10 whitespace-pre-line ${dark ? 'text-white/55' : 'text-black/55'}`}>
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={getLocalizedPath(locale, 'contact')}
              className={`px-6 py-3.5 text-sm font-bold border-2 rounded-sm transition-colors ${
                dark
                  ? 'bg-wdd-yellow text-wdd-black border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow'
                  : 'bg-wdd-black text-wdd-yellow border-wdd-black hover:bg-transparent hover:text-wdd-black'
              }`}
            >
              {buttonLabel}
            </Link>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-light ${dark ? 'text-white/40' : 'text-black/40'}`}>{copy.orCall}</span>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className={`text-sm font-bold transition-colors ${dark ? 'text-white hover:text-wdd-yellow' : 'text-wdd-black hover:text-wdd-mud'}`}
              >
                {phone}
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-[400px]">
          <Image src={teamImageUrl} alt="Équipe WellDoneDrill" fill className="object-cover object-center scale-[1.08]" />
        </div>
      </div>

      {/* Row 2 — stats bar */}
      <div className={`flex flex-col lg:flex-row border-t ${dark ? 'border-white/10' : 'border-black/10'}`}>
        <div className="w-full lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 py-10">
          <div className={`text-3xl font-bold ${dark ? 'text-wdd-yellow' : 'text-wdd-mud'}`}>{stat1Value}</div>
          <div className={`text-xs font-light mt-1 ${dark ? 'text-white/40' : 'text-black/40'}`}>{stat1Label}</div>
        </div>
        <div className={`w-full lg:w-1/2 pl-8 py-10 border-t lg:border-t-0 lg:border-l ${dark ? 'border-white/10' : 'border-black/10'}`}>
          <div className={`text-3xl font-bold ${dark ? 'text-wdd-yellow' : 'text-wdd-mud'}`}>{stat2Value}</div>
          <div className={`text-xs font-light mt-1 ${dark ? 'text-white/40' : 'text-black/40'}`}>{stat2Label}</div>
        </div>
      </div>

    </section>
  )
}

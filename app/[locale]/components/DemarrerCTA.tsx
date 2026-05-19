import Link from 'next/link'
import Image from 'next/image'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import {urlFor} from '@/src/lib/sanityImage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'

type Variant = 'dark' | 'clay'

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

  const title = settings?.ctaTitle ?? 'Votre projet commence ici.'
  const body = settings?.ctaBody ?? "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement."
  const buttonLabel = settings?.ctaButtonLabel ?? 'Démarrer votre projet →'
  const phone = settings?.phone ?? '+32 478 75 36 79'
  const teamImageUrl = settings?.ctaImage ? urlFor(settings.ctaImage)?.url() ?? '/images/team.jpg' : '/images/team.jpg'
  const stat1Value = settings?.stat1Value ?? 'Gratuit'
  const stat1Label = settings?.stat1Label ?? 'Étude de faisabilité'
  const stat2Value = settings?.stat2Value ?? '48h'
  const stat2Label = settings?.stat2Label ?? 'Délai de réponse'

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
              href={getLocalizedPath(locale, 'demarrer')}
              className={`px-6 py-3.5 text-sm font-bold border-2 rounded-sm transition-colors ${
                dark
                  ? 'bg-wdd-yellow text-wdd-black border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow'
                  : 'bg-wdd-black text-wdd-yellow border-wdd-black hover:bg-transparent hover:text-wdd-black'
              }`}
            >
              {buttonLabel}
            </Link>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-light ${dark ? 'text-white/40' : 'text-black/40'}`}>ou appelez-nous</span>
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

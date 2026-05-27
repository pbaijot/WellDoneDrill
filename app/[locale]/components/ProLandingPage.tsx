import Image from 'next/image'
import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'

function IconWrench({className}: {className?: string}) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-wdd-black/50${className ? ' ' + className : ''}`}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}
function IconCompass({className}: {className?: string}) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-wdd-black/50${className ? ' ' + className : ''}`}>
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  )
}
function IconBuilding({className}: {className?: string}) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-wdd-black/50${className ? ' ' + className : ''}`}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

const SEGMENTS = [
  {
    routeKey: 'pro_chauffagistes' as const,
    title: 'Installateurs HVAC',
    description: "Sous-traitez le forage géothermique clé en main. Vous posez la pompe à chaleur, WellDoneDrill fore. Multipliez vos chantiers sans investissement matériel supplémentaire.",
    image: '/images/clean-drill.jpg',
    icon: IconWrench,
    cta: 'Découvrir le partenariat installateur',
  },
  {
    routeKey: 'pro_architectes' as const,
    title: "Architectes & Bureaux d'études",
    description: "Intégrez la géothermie dès l'esquisse. Étude géologique préliminaire en 72h, rapport technique livré clé en main pour vos dossiers PEB et permis.",
    image: '/images/abricotiers-2.jpg',
    icon: IconCompass,
    cta: "Découvrir le partenariat architecte",
  },
  {
    routeKey: 'pro_entrepreneurs' as const,
    title: 'Entrepreneurs & promoteurs',
    description: "Un seul contrat couvre permis, forage et documentation as-built. Valorisez vos programmes résidentiels et tertiaires avec un label énergétique A.",
    image: '/images/foreuse-wide.jpg',
    icon: IconBuilding,
    cta: "Découvrir l'offre entrepreneurs",
  },
]

export default function ProLandingPage({locale}: {locale: AppLocale}) {
  return (
    <div className="flex flex-col">
      <section className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          <div className="mb-16">
            <h1 className="text-4xl font-bold leading-tight mb-5">
              Pour les <span className="text-wdd-mud">professionnels</span>
            </h1>
            <p className="text-sm font-light text-wdd-black/55 leading-relaxed max-w-2xl">
              WellDoneDrill s'adapte à votre métier. Permis, forage, documentation as-built — une seule équipe pour vos chantiers géothermiques. Sélectionnez votre profil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SEGMENTS.map(({routeKey, title, description, image, icon: Icon, cta}) => (
              <div key={routeKey} className="flex flex-col group bg-white rounded-sm overflow-hidden">
                <div className="relative h-72 overflow-hidden shrink-0">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <Icon className="mb-6" />
                  <h2 className="text-xl font-bold mb-3 leading-snug">{title}</h2>
                  <p className="text-sm font-light text-black/55 leading-relaxed mb-8 flex-1">
                    {description}
                  </p>
                  <Link
                    href={getLocalizedPath(locale, routeKey)}
                    className="inline-flex items-center gap-2 text-sm font-bold bg-wdd-black text-white px-5 py-2.5 self-start hover:bg-wdd-black/80 transition-colors rounded-sm"
                  >
                    {cta} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}

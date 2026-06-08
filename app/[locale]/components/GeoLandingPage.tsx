import Image from 'next/image'
import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import DemarrerCTA from './DemarrerCTA'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'

/* ── Icons ─────────────────────────────────────────────────── */

function IconFermee({className}: {className?: string}) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-wdd-black/50${className ? ' ' + className : ''}`}>
      <rect x="7" y="2" width="10" height="5.5" rx="0.5"/>
      <line x1="2" y1="9" x2="22" y2="9" strokeDasharray="2 1.5"/>
      <line x1="9" y1="9" x2="9" y2="20"/>
      <line x1="15" y1="9" x2="15" y2="20"/>
      <path d="M9 20 Q12 23.5 15 20"/>
    </svg>
  )
}

function IconOuverte({className}: {className?: string}) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-wdd-black/50${className ? ' ' + className : ''}`}>
      <rect x="8" y="2" width="8" height="5" rx="0.5"/>
      <line x1="12" y1="7" x2="12" y2="14"/>
      <line x1="2" y1="9" x2="22" y2="9" strokeDasharray="2 1.5"/>
      <path d="M3 15 Q7.5 12.5 12 15 Q16.5 17.5 21 15"/>
      <path d="M3 19 Q7.5 16.5 12 19 Q16.5 21.5 21 19"/>
    </svg>
  )
}

/* ── Copy ───────────────────────────────────────────────────── */

type LocaleCopy = {
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
  fermee: {title: string; description: string; cta: string; image: string; altText: string}
  ouverte: {title: string; description: string; cta: string; image: string; altText: string}
}

const COPY: Record<AppLocale, LocaleCopy> = {
  'be-fr': {
    eyebrow: 'Nos techniques',
    title: 'La géothermie,',
    highlight: "l'énergie du sol",
    subtitle: "La géothermie exploite la chaleur naturelle et stable de la terre pour chauffer et rafraîchir vos bâtiments. Deux techniques complémentaires s'adaptent à chaque projet — selon la géologie, la surface disponible et l'échelle des besoins. WellDoneDrill maîtrise les deux.",
    fermee: {
      title: 'Géothermie fermée',
      description: "Des sondes verticales descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. L'énergie captée alimente votre pompe à chaleur été comme hiver — sans fossile, sans émission directe. La solution universelle : applicable sur 90 % des propriétés résidentielles et tertiaires.",
      cta: 'Découvrir la géothermie fermée',
      image: '/images/foreuse-wide.jpg',
      altText: 'Forage géothermie fermée — sondes verticales WellDoneDrill',
    },
    ouverte: {
      title: 'Géothermie ouverte',
      description: "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Un forage pompe l'eau, un second la réinjecte après échange thermique — circuit fermé, ressource inépuisable. Technique idéale pour les grands projets, avec les rendements les plus élevés du secteur.",
      cta: 'Découvrir la géothermie ouverte',
      image: '/images/fond-terre-2.jpg',
      altText: 'Géothermie ouverte — nappe phréatique WellDoneDrill',
    },
  },
  'be-nl': {
    eyebrow: 'Onze technieken',
    title: 'Geothermie,',
    highlight: 'energie uit de bodem',
    subtitle: "Geothermie benut de natuurlijke en stabiele warmte van de aarde voor verwarming en koeling van uw gebouwen. Twee complementaire technieken passen zich aan elk project aan — afhankelijk van de geologie, de beschikbare oppervlakte en de schaal van de behoeften.",
    fermee: {
      title: 'Gesloten geothermie',
      description: "Verticale sondes gaan 80–150 m diep om de constante warmte van de bodem op te vangen. De gewonnen energie voedt uw warmtepomp zomer en winter — zonder fossiele brandstoffen, zonder directe emissies. Toepasbaar op 90 % van de woon- en dienstverleningspanden.",
      cta: 'Gesloten geothermie ontdekken',
      image: '/images/foreuse-wide.jpg',
      altText: 'Gesloten geothermische boring — verticale sondes WellDoneDrill',
    },
    ouverte: {
      title: 'Open geothermie',
      description: "Het grondwater, het hele jaar op een stabiele temperatuur, wordt uw energiebron. Eén boring pompt water op, een tweede injecteert het terug na warmtewisseling — gesloten circuit, onuitputtelijke bron. Ideale techniek voor grote projecten, met de hoogste rendementen in de sector.",
      cta: 'Open geothermie ontdekken',
      image: '/images/fond-terre-2.jpg',
      altText: 'Open geothermie — grondwater WellDoneDrill',
    },
  },
  'fr-fr': {
    eyebrow: 'Nos techniques',
    title: 'La géothermie,',
    highlight: "l'énergie du sol",
    subtitle: "La géothermie exploite la chaleur naturelle et stable de la terre pour chauffer et rafraîchir vos bâtiments. Deux techniques complémentaires s'adaptent à chaque projet — selon la géologie, la surface disponible et l'échelle des besoins. WellDoneDrill maîtrise les deux.",
    fermee: {
      title: 'Géothermie fermée',
      description: "Des sondes verticales descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. L'énergie captée alimente votre pompe à chaleur été comme hiver — sans fossile, sans émission directe. La solution universelle : applicable sur 90 % des propriétés résidentielles et tertiaires.",
      cta: 'Découvrir la géothermie fermée',
      image: '/images/foreuse-wide.jpg',
      altText: 'Forage géothermie fermée — sondes verticales WellDoneDrill',
    },
    ouverte: {
      title: 'Géothermie ouverte',
      description: "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Un forage pompe l'eau, un second la réinjecte après échange thermique — circuit fermé, ressource inépuisable. Technique idéale pour les grands projets, avec les rendements les plus élevés du secteur.",
      cta: 'Découvrir la géothermie ouverte',
      image: '/images/fond-terre-2.jpg',
      altText: 'Géothermie ouverte — nappe phréatique WellDoneDrill',
    },
  },
  'lu-fr': {
    eyebrow: 'Nos techniques',
    title: 'La géothermie,',
    highlight: "l'énergie du sol",
    subtitle: "La géothermie exploite la chaleur naturelle et stable de la terre pour chauffer et rafraîchir vos bâtiments. Deux techniques complémentaires s'adaptent à chaque projet — selon la géologie, la surface disponible et l'échelle des besoins. WellDoneDrill maîtrise les deux.",
    fermee: {
      title: 'Géothermie fermée',
      description: "Des sondes verticales descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. L'énergie captée alimente votre pompe à chaleur été comme hiver — sans fossile, sans émission directe. La solution universelle : applicable sur 90 % des propriétés résidentielles et tertiaires.",
      cta: 'Découvrir la géothermie fermée',
      image: '/images/foreuse-wide.jpg',
      altText: 'Forage géothermie fermée — sondes verticales WellDoneDrill',
    },
    ouverte: {
      title: 'Géothermie ouverte',
      description: "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Un forage pompe l'eau, un second la réinjecte après échange thermique — circuit fermé, ressource inépuisable. Technique idéale pour les grands projets, avec les rendements les plus élevés du secteur.",
      cta: 'Découvrir la géothermie ouverte',
      image: '/images/fond-terre-2.jpg',
      altText: 'Géothermie ouverte — nappe phréatique WellDoneDrill',
    },
  },
  'lu-de': {
    eyebrow: 'Unsere Techniken',
    title: 'Geothermie,',
    highlight: 'Energie aus dem Boden',
    subtitle: "Geothermie nutzt die natürliche und stabile Wärme der Erde zum Heizen und Kühlen von Gebäuden. Zwei komplementäre Techniken passen sich an jedes Projekt an — je nach Geologie, verfügbarer Fläche und Projektgröße. WellDoneDrill beherrscht beide.",
    fermee: {
      title: 'Geschlossene Geothermie',
      description: "Vertikale Sonden gehen 80–150 m tief, um die konstante Wärme des Bodens zu erfassen. Die gewonnene Energie speist Ihre Wärmepumpe Sommer und Winter — ohne fossile Brennstoffe, ohne direkte Emissionen. Anwendbar auf 90 % aller Wohn- und Gewerbeimmobilien.",
      cta: 'Geschlossene Geothermie entdecken',
      image: '/images/foreuse-wide.jpg',
      altText: 'Geschlossene Geothermie-Bohrung — vertikale Sonden WellDoneDrill',
    },
    ouverte: {
      title: 'Offene Geothermie',
      description: "Das Grundwasser, das ganzjährig eine stabile Temperatur hält, wird zur Energiequelle. Ein Brunnen fördert Wasser, ein zweiter führt es nach dem Wärmetausch zurück — geschlossener Kreislauf, unerschöpfliche Ressource. Ideale Technik für Großprojekte mit höchsten Wirkungsgraden.",
      cta: 'Offene Geothermie entdecken',
      image: '/images/fond-terre-2.jpg',
      altText: 'Offene Geothermie — Grundwasser WellDoneDrill',
    },
  },
  'be-en': {
    eyebrow: 'Our techniques',
    title: 'Geothermal energy,',
    highlight: 'the energy of the ground',
    subtitle: "Geothermal energy harnesses the natural, stable heat of the earth to heat and cool your buildings. Two complementary techniques adapt to every project — depending on the geology, available surface area and scale of the needs. WellDoneDrill masters both.",
    fermee: {
      title: 'Closed-loop geothermal',
      description: "Vertical boreholes go down 80–150 m to capture the constant heat of the ground. The captured energy powers your heat pump in summer and winter — no fossil fuels, no direct emissions. The universal solution: suitable for 90% of residential and commercial properties.",
      cta: 'Discover closed-loop geothermal',
      image: '/images/foreuse-wide.jpg',
      altText: 'Closed-loop geothermal drilling — vertical boreholes WellDoneDrill',
    },
    ouverte: {
      title: 'Open-loop geothermal',
      description: "The groundwater, at a stable temperature all year round, becomes your energy source. One borehole pumps the water, a second reinjects it after heat exchange — a closed circuit, an inexhaustible resource. The ideal technique for large projects, with the highest yields in the sector.",
      cta: 'Discover open-loop geothermal',
      image: '/images/fond-terre-2.jpg',
      altText: 'Open-loop geothermal — groundwater WellDoneDrill',
    },
  },
  'fr-en': {
    eyebrow: 'Our techniques',
    title: 'Geothermal energy,',
    highlight: 'the energy of the ground',
    subtitle: "Geothermal energy harnesses the natural, stable heat of the earth to heat and cool your buildings. Two complementary techniques adapt to every project — depending on the geology, available surface area and scale of the needs. WellDoneDrill masters both.",
    fermee: {
      title: 'Closed-loop geothermal',
      description: "Vertical boreholes go down 80–150 m to capture the constant heat of the ground. The captured energy powers your heat pump in summer and winter — no fossil fuels, no direct emissions. The universal solution: suitable for 90% of residential and commercial properties.",
      cta: 'Discover closed-loop geothermal',
      image: '/images/foreuse-wide.jpg',
      altText: 'Closed-loop geothermal drilling — vertical boreholes WellDoneDrill',
    },
    ouverte: {
      title: 'Open-loop geothermal',
      description: "The groundwater, at a stable temperature all year round, becomes your energy source. One borehole pumps the water, a second reinjects it after heat exchange — a closed circuit, an inexhaustible resource. The ideal technique for large projects, with the highest yields in the sector.",
      cta: 'Discover open-loop geothermal',
      image: '/images/fond-terre-2.jpg',
      altText: 'Open-loop geothermal — groundwater WellDoneDrill',
    },
  },
  'lu-en': {
    eyebrow: 'Our techniques',
    title: 'Geothermal energy,',
    highlight: 'the energy of the ground',
    subtitle: "Geothermal energy harnesses the natural, stable heat of the earth to heat and cool your buildings. Two complementary techniques adapt to every project — depending on the geology, available surface area and scale of the needs. WellDoneDrill masters both.",
    fermee: {
      title: 'Closed-loop geothermal',
      description: "Vertical boreholes go down 80–150 m to capture the constant heat of the ground. The captured energy powers your heat pump in summer and winter — no fossil fuels, no direct emissions. The universal solution: suitable for 90% of residential and commercial properties.",
      cta: 'Discover closed-loop geothermal',
      image: '/images/foreuse-wide.jpg',
      altText: 'Closed-loop geothermal drilling — vertical boreholes WellDoneDrill',
    },
    ouverte: {
      title: 'Open-loop geothermal',
      description: "The groundwater, at a stable temperature all year round, becomes your energy source. One borehole pumps the water, a second reinjects it after heat exchange — a closed circuit, an inexhaustible resource. The ideal technique for large projects, with the highest yields in the sector.",
      cta: 'Discover open-loop geothermal',
      image: '/images/fond-terre-2.jpg',
      altText: 'Open-loop geothermal — groundwater WellDoneDrill',
    },
  },
}

/* ── Page ───────────────────────────────────────────────────── */

export default function GeoLandingPage({locale, settings}: {locale: AppLocale; settings?: GlobalSettingsData | null}) {
  const c = COPY[locale]

  return (
    <div className="flex flex-col bg-white">

      {/* ── INTRO + CARDS ─────────────────────────────────────── */}
      <section className="bg-wdd-clay py-[7.5rem] px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          {/* Eyebrow + heading */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-black/50 uppercase">{c.eyebrow}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              {c.title}{' '}
              <span className="text-wdd-mud">{c.highlight}</span>
            </h1>
            <p className="text-sm font-light text-wdd-black/55 leading-relaxed max-w-2xl">
              {c.subtitle}
            </p>
          </div>

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Fermée */}
            <div className="flex flex-col group bg-white rounded-sm overflow-hidden">
              <div className="relative h-72 overflow-hidden shrink-0">
                <Image
                  src={c.fermee.image}
                  alt={c.fermee.altText}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <IconFermee className="mb-6" />
                <h2 className="text-xl font-bold mb-3 leading-snug">{c.fermee.title}</h2>
                <p className="text-sm font-light text-black/55 leading-relaxed mb-8 flex-1">
                  {c.fermee.description}
                </p>
                <Link
                  href={getLocalizedPath(locale, 'geo_fermee')}
                  className="inline-flex items-center gap-2 text-sm font-bold bg-wdd-black text-white px-5 py-2.5 self-start hover:bg-wdd-black/80 transition-colors rounded-sm"
                >
                  {c.fermee.cta} <span>→</span>
                </Link>
              </div>
            </div>

            {/* Ouverte */}
            <div className="flex flex-col group bg-white rounded-sm overflow-hidden">
              <div className="relative h-72 overflow-hidden shrink-0">
                <Image
                  src={c.ouverte.image}
                  alt={c.ouverte.altText}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <IconOuverte className="mb-6" />
                <h2 className="text-xl font-bold mb-3 leading-snug">{c.ouverte.title}</h2>
                <p className="text-sm font-light text-black/55 leading-relaxed mb-8 flex-1">
                  {c.ouverte.description}
                </p>
                <Link
                  href={getLocalizedPath(locale, 'geo_ouverte')}
                  className="inline-flex items-center gap-2 text-sm font-bold bg-wdd-black text-white px-5 py-2.5 self-start hover:bg-wdd-black/80 transition-colors rounded-sm"
                >
                  {c.ouverte.cta} <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

{/* ── CTA ───────────────────────────────────────────────── */}
      <DemarrerCTA locale={locale} settings={settings} />

    </div>
  )
}

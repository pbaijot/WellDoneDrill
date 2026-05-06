'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {ParticuliersPageData} from '@/src/lib/particuliersPage'
import {FloatingInfoPanel} from './FloatingInfoPanel'
import {
  BELGIUM_PROVINCES,
  SVG_W,
  SVG_H,
  getProvinceName,
  getProvincePageUrl,
  chantierImageUrl,
  sectorLabel,
  type Province,
  type Chantier,
} from '@/src/lib/referencesPage'

/* ─────────────────────────────────────────────
   DEFAULT CONTENT (CMS fallbacks)
───────────────────────────────────────────── */

const DEFAULT_WHY_ITEMS = [
  {
    title: "Jusqu'à 70 % d'économies",
    body: "En passant du gaz à la géothermie, nos clients économisent en moyenne 1 200 € par an sur leur facture énergétique.",
  },
  {
    title: "Zéro combustible fossile",
    body: "La géothermie puise une énergie renouvelable dans le sol de votre propriété. Aucune émission directe, aucune dépendance au marché.",
  },
  {
    title: "Chaud l'hiver, frais l'été",
    body: "La même installation assure le chauffage et la climatisation naturelle. Pas de système secondaire.",
  },
  {
    title: "Patrimoine valorisé",
    body: "Un logement géothermique affiche un meilleur certificat PEB et se revend plus vite à un meilleur prix.",
  },
  {
    title: "Indépendance énergétique",
    body: "Vous n'êtes plus exposé aux hausses du prix du gaz. Votre coût de chauffage devient prévisible pour 50 ans.",
  },
  {
    title: "Durabilité prouvée",
    body: "Les sondes géothermiques ont une durée de vie de 50 ans et plus. Aucun entretien après installation.",
  },
]

const DEFAULT_FAQS = [
  {
    question: "Combien coûte une installation géothermique au total ?",
    answer:
      "Le budget complet — forage + pompe à chaleur + installation — se situe généralement entre 20 000 et 30 000 €. Après déduction des primes régionales (qui peuvent atteindre 8 000 à 12 000 €), le reste à charge net descend souvent sous les 18 000 €. Votre retour sur investissement intervient en 8 à 12 ans sur une installation qui dure 50 ans.",
  },
  {
    question: "Mon terrain est-il compatible avec la géothermie ?",
    answer:
      "Plus de 90 % des propriétés résidentielles en Belgique et au Luxembourg sont géologiquement compatibles. WellDoneDrill réalise une étude préalable gratuite pour confirmer la faisabilité sur votre parcelle, avant tout engagement de votre part.",
  },
  {
    question: "Quels travaux sont réalisés chez moi et combien de temps cela prend-il ?",
    answer:
      "Le forage occupe typiquement 1 à 3 jours sur votre terrain. Notre équipe intervient avec une machine spécialisée : l'impact sur votre jardin est minimal et le terrain est remis en état à la fin du chantier. L'installation complète (forage + PAC) prend généralement 1 à 2 semaines.",
  },
  {
    question: "Qui installe la pompe à chaleur ?",
    answer:
      "WellDoneDrill est le spécialiste du forage géothermique. Nous travaillons avec un réseau sélectionné de chauffagistes certifiés qui prennent en charge l'installation de la PAC. Nous coordonnons les deux équipes pour vous — un seul interlocuteur de bout en bout.",
  },
  {
    question: "La géothermie fonctionne-t-elle aussi comme climatisation ?",
    answer:
      "Oui. La géothermie fermée permet une climatisation géothermique passive (free-cooling) très efficace en été, avec une consommation électrique marginale. Contrairement aux climatiseurs classiques, elle n'émet pas de chaleur à l'extérieur.",
  },
  {
    question: "Faut-il un permis pour forer ?",
    answer:
      "Dans la plupart des régions, un permis de forage est requis. WellDoneDrill gère intégralement les démarches administratives pour vous — y compris les déclarations obligatoires auprès des organismes compétents.",
  },
]

const DEFAULT_PRIMES = [
  {region: "Région wallonne", title: "Prime URE — jusqu'à 4 500 €", body: "Prime à l'utilisation rationnelle de l'énergie pour installation géothermique résidentielle neuve ou en rénovation."},
  {region: "Région bruxelloise", title: "Prime énergie — jusqu'à 3 500 €", body: "Subvention pour le remplacement d'une chaudière fossile par une PAC géothermique."},
  {region: "Grand-Duché de Luxembourg", title: "Prime Klimabonus — jusqu'à 10 000 €", body: "Aide directe de l'État pour les installations géothermiques résidentielles certifiées."},
  {region: "Flandre", title: "Premie warmtepomp — variable", body: "Steun voor de installatie van een geothermische warmtepomp in woningen."},
]

const DEFAULT_ETAPES = [
  {title: "Devis gratuit", body: "Premier contact, analyse de vos besoins. Réponse sous 48h."},
  {title: "Étude de faisabilité", body: "Analyse géologique de votre terrain. Gratuite. Sans engagement."},
  {title: "Permis & démarches", body: "WellDoneDrill s'occupe de toutes les autorisations à votre place."},
  {title: "Forage", body: "1 à 3 jours d'intervention. Impact minimal, terrain remis en état."},
  {title: "Mise en service", body: "Votre chauffagiste connecte la PAC. Vous basculez sur la géothermie."},
]

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function FaqItem({question, answer}: {question: string; answer: string}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span className="text-base font-bold leading-snug group-hover:text-wdd-mud transition-colors">
          {question}
        </span>
        <span
          className={
            'flex-shrink-0 w-6 h-6 border flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5 ' +
            (open
              ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45'
              : 'border-black/20 text-black/40')
          }
        >
          +
        </span>
      </button>
      {open && (
        <p className="text-sm font-light text-black/70 leading-7 pb-6 pr-12 whitespace-pre-line">
          {answer}
        </p>
      )}
    </div>
  )
}

function RoiLine({label, value, highlight}: {label: string; value: string; highlight?: boolean}) {
  return (
    <div
      className={
        'flex items-center justify-between py-3 border-b border-white/8 last:border-b-0 ' +
        (highlight ? 'py-4' : '')
      }
    >
      <span className={`text-sm font-light ${highlight ? 'text-white font-bold text-base' : 'text-white/60'}`}>
        {label}
      </span>
      <span className={`font-bold tabular-nums ${highlight ? 'text-wdd-yellow text-xl' : 'text-white/90 text-sm'}`}>
        {value}
      </span>
    </div>
  )
}

function GeoScheme() {
  const [phase, setPhase] = useState(0)
  // 0=all off (reset) | 1=sol | 2=pipe1 | 3=pac | 4=pipe2 | 5=maison | 6=hold all
  const durations = [700, 1400, 800, 1400, 800, 1600, 1600]
  useEffect(() => {
    const t = setTimeout(() => setPhase(p => (p + 1) % 7), durations[phase] ?? 1200)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const solLit    = phase >= 1
  const pipe1Lit  = phase >= 2
  const pacLit    = phase >= 3
  const pipe2Lit  = phase >= 4
  const maisonLit = phase >= 5

  const TRANS_NODE = 'transition-all duration-[600ms] ease-in-out'
  const TRANS_TEXT = 'transition-colors duration-[600ms] ease-in-out'

  const Node = ({lit, icon, label, sub}: {lit: boolean; icon: React.ReactNode; label: string; sub: string}) => (
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center ${TRANS_NODE} ${lit ? 'bg-wdd-yellow' : 'bg-black/5'}`}>
        <div className={`${TRANS_TEXT} ${lit ? 'text-wdd-black' : 'text-black/20'}`}>{icon}</div>
      </div>
      <div>
        <div className={`text-sm font-bold leading-snug ${TRANS_TEXT} ${lit ? 'text-wdd-black' : 'text-black/25'}`}>{label}</div>
        <div className={`text-xs font-light mt-0.5 ${TRANS_TEXT} ${lit ? 'text-black/50' : 'text-black/12'}`}>{sub}</div>
      </div>
    </div>
  )

  const Pipe = ({lit}: {lit: boolean}) => (
    <div className="ml-7 flex flex-col items-center" style={{width: 2, height: 48}}>
      <div className="w-full flex-1 bg-black/8 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-wdd-yellow"
          style={{
            transformOrigin: 'bottom',
            transform: lit ? 'scaleY(1)' : 'scaleY(0)',
            transition: lit ? 'transform 750ms cubic-bezier(0.4,0,0.2,1)' : 'transform 600ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <div
        style={{
          fontSize: 7,
          lineHeight: 1,
          color: lit ? '#FFD94F' : 'rgba(0,0,0,0.08)',
          transition: 'color 600ms ease-in-out',
        }}
      >▲</div>
    </div>
  )

  return (
    <div className="flex flex-col">
      <Node lit={maisonLit}
        label="Votre maison"
        sub="Chauffage, eau chaude, rafraîchissement"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>}
      />
      <Pipe lit={pipe2Lit} />
      <Node lit={pacLit}
        label="Pompe à chaleur"
        sub="COP 4–5 · amplifie l'énergie captée"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
      />
      <Pipe lit={pipe1Lit} />
      <Node lit={solLit}
        label="Le sol"
        sub="Énergie constante disponible à 80–200 m"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12C12 12 7 9 7 5a5 5 0 0110 0c0 4-5 7-5 7z"/><path d="M8 15h8M6 18h12"/></svg>}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function ParticuliersPage({
  page,
  locale,
  chantiers = [],
}: {
  page: ParticuliersPageData
  locale: AppLocale
  chantiers?: Chantier[]
}) {
  const whyItems =
    page.whyItems && page.whyItems.length > 0 ? page.whyItems : DEFAULT_WHY_ITEMS

  const faqs =
    page.faqs && page.faqs.length > 0
      ? page.faqs.map((f) => ({question: f.question ?? '', answer: f.answer ?? ''}))
      : DEFAULT_FAQS

  const primes =
    page.primesItems && page.primesItems.length > 0
      ? page.primesItems.map((p) => ({region: p.region ?? '', title: p.title ?? '', body: p.body ?? '', _key: p._key}))
      : DEFAULT_PRIMES

  const etapes =
    page.etapes && page.etapes.length > 0 ? page.etapes : DEFAULT_ETAPES

  // Image rotation for section "Votre projet"
  const PROJECT_IMAGES = [
    '/images/foreuse-wide.jpg',
    '/images/drillgreen.jpg',
    '/images/foreuse-close-up.jpg',
    '/images/drill-close.jpg',
    '/images/petite-foreuse.jpg',
  ]
  const [activeImg, setActiveImg] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActiveImg(i => (i + 1) % PROJECT_IMAGES.length), 3500)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculateur d'économies d'énergie
  const [ecoMode, setEcoMode] = useState<'surface' | 'conso'>('surface')
  const [ecoSurface, setEcoSurface] = useState(150)
  const [ecoConso, setEcoConso] = useState(18)
  const [ecoEnergie, setEcoEnergie] = useState<'gaz' | 'mazout' | 'elec'>('gaz')
  const [posteChauffage, setPosteChauffage] = useState(true)
  const [posteRafraich, setPosteRafraich] = useState(false)
  const [postePiscine, setPostePiscine] = useState(false)

  const ecoCalc = (() => {
    // MWh chauffage annuels (consommation thermique)
    const chaufMWh = ecoMode === 'surface' ? ecoSurface * 0.090 : ecoConso
    // MWh rafraîchissement (25% des besoins chauffage)
    const rafraichMWh = chaufMWh * 0.28
    // Piscine: ~8 MWh/an fixe (piscine résidentielle standard)
    const piscMWh = 8

    // Prix actuel €/MWh par énergie
    const prixMWh: Record<string, [number, number]> = {
      gaz:   [115, 140],
      mazout:[125, 155],
      elec:  [270, 320],
    }
    const [pLow, pHigh] = prixMWh[ecoEnergie]

    // Coût géothermie: COP 4.5, élec 0.28 €/kWh → ~62 €/MWh utile
    const pGeoLow = 55, pGeoHigh = 70

    // Free-cooling: EER 20 → ~14 €/MWh vs clim EER 3 → ~93 €/MWh
    const pRafActuel: [number, number] = [85, 100]
    const pRafGeo: [number, number] = [12, 18]

    // Piscine: PAC géo vs chaudière gaz
    const pPiscActuel: [number, number] = [115, 140]
    const pPiscGeo: [number, number] = [55, 70]

    const chauffage = posteChauffage ? {
      mwh: Math.round(chaufMWh * (1 - pGeoHigh / pLow) * 10) / 10,
      eurLow: Math.round(chaufMWh * (pLow - pGeoHigh) / 100) * 100,
      eurHigh: Math.round(chaufMWh * (pHigh - pGeoLow) / 100) * 100,
    } : null

    const rafraich = posteRafraich ? {
      mwh: Math.round(rafraichMWh * (1 - pRafGeo[1] / pRafActuel[0]) * 10) / 10,
      eurLow: Math.round(rafraichMWh * (pRafActuel[0] - pRafGeo[1]) / 100) * 100,
      eurHigh: Math.round(rafraichMWh * (pRafActuel[1] - pRafGeo[0]) / 100) * 100,
    } : null

    const piscine = postePiscine ? {
      mwh: Math.round(piscMWh * (1 - pPiscGeo[1] / pPiscActuel[0]) * 10) / 10,
      eurLow: Math.round(piscMWh * (pPiscActuel[0] - pPiscGeo[1]) / 100) * 100,
      eurHigh: Math.round(piscMWh * (pPiscActuel[1] - pPiscGeo[0]) / 100) * 100,
    } : null

    const totalMWh = Math.round(((chauffage?.mwh ?? 0) + (rafraich?.mwh ?? 0) + (piscine?.mwh ?? 0)) * 10) / 10
    const totalEurLow = (chauffage?.eurLow ?? 0) + (rafraich?.eurLow ?? 0) + (piscine?.eurLow ?? 0)
    const totalEurHigh = (chauffage?.eurHigh ?? 0) + (rafraich?.eurHigh ?? 0) + (piscine?.eurHigh ?? 0)
    const co2 = Math.round(totalMWh * 202) // kg CO2 évités (facteur gaz BE)

    return { chaufMWh, rafraichMWh, piscMWh, chauffage, rafraich, piscine, totalMWh, totalEurLow, totalEurHigh, co2 }
  })()

  const fmt = (n: number) => Math.round(n).toLocaleString('fr-BE')

  const stats =
    page.stats && page.stats.length > 0
      ? page.stats
      : [
          {value: '500+', label: 'Projets réalisés'},
          {value: '20 ans', label: "d'expertise"},
          {value: '3 pays', label: 'BE · LU · FR'},
        ]

  return (
    <div className="flex flex-col bg-white">

      {/* ══════════════════════════════════════
          1. HERO
          Objectif : capter l'attention, poser
          le bénéfice #1, lancer vers l'action
      ══════════════════════════════════════ */}
      <section className="h-[90vh] relative overflow-hidden px-8 md:px-16">

        {/* Couche 1 : fond-terre-2 sur la moitié gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <Image
            src="/images/fond-terre-2.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-wdd-black/60" />
        </div>
        {/* Couche 1b : fallback fond sombre sur mobile */}
        <div className="absolute inset-0 bg-wdd-black lg:hidden" />

        {/* Couche 3 : photo foreuse sur la moitié droite */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-[2] hidden lg:block">
          <Image
            src="/images/drillgreen.jpg"
            alt="Foreuse WellDoneDrill sur chantier"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Floating info panels — 3 arguments en cycle */}
          <div className="absolute bottom-8 right-8 z-10">
            <FloatingInfoPanel
              items={[
                {label: 'Économies annuelles moyennes', value: '~1 200 €', sub: 'par foyer converti'},
                {label: 'Coefficient de performance',  value: 'COP 4–5',   sub: '4× plus efficace que le gaz'},
                {label: 'Réduction de facture',        value: '–70 %',     sub: 'sur vos coûts de chauffage'},
              ]}
            />
          </div>
        </div>

        {/* Logo centré sur la séparation gauche / droite */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none">
          <Image
            src="/images/small-white-logo-droit.png"
            alt="WellDoneDrill"
            width={144}
            height={144}
            className="object-contain"
          />
        </div>

        {/* Couche 4 : contenu — même conteneur que toutes les sections */}
        <div className="relative z-[3] max-w-screen-2xl mx-auto h-[90vh] flex items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 py-24">

            {/* Social proof micro-line */}
            <div className="flex items-center gap-3 mb-7">
              <span className="text-xs font-light text-white/55">
                500+ familles chauffées en Belgique &amp; Luxembourg
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              {page.heroTitle ?? (
                <>
                  Chauffez et climatisez<br />
                  sans gaz, sans mazout.
                </>
              )}
            </h1>

            <p className="text-base font-light text-white/65 leading-relaxed max-w-lg mb-10">
              {page.heroSubtitle ??
                "WellDoneDrill fore vos sondes géothermiques. Votre maison se chauffe et se rafraîchit avec l'énergie du sol — jusqu'à 70 % d'économies sur vos factures."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="#calculateur"
                className="bg-white text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-white hover:bg-transparent hover:text-white transition-colors"
              >
                {page.heroCtaCalculLabel ?? "Calculer mes économies"}
              </a>
              <Link
                href={getLocalizedPath(locale, 'devis')}
                className="px-7 py-3.5 text-sm font-semibold border-2 border-white/30 text-white/80 hover:border-white hover:text-white transition-colors"
              >
                {page.heroCtaDevisLabel ?? "Devis instantané"}
              </Link>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-0 border-t border-white/15 pt-8 max-w-sm">
              {stats.slice(0, 3).map((stat, i) => (
                <div
                  key={stat._key ?? i}
                  className={'pr-6 ' + (i > 0 ? 'pl-6 border-l border-white/10' : '')}
                >
                  <div className="text-3xl font-bold text-white leading-none">{stat.value}</div>
                  <div className="text-xs font-light text-white/40 uppercase tracking-wider mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. MARCHÉ + TECHNOLOGIE (fusionnés)
          Gauche : contexte / pourquoi changer
          Droite : comment ça marche + liens
      ══════════════════════════════════════ */}
      <section className="bg-white min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1fr_1px_1fr]">

            {/* GAUCHE — Contexte marché */}
            <div className="flex flex-col justify-center pr-16 py-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-5 h-0.5 bg-wdd-yellow" />
                <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
                  Contexte énergétique
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                {page.problemTitle ?? "Optez pour l'efficacité et l'indépendance énergétique."}
              </h2>
              <p className="text-base font-light text-black/60 leading-8 mb-8">
                {page.problemBody ??
                  "Le prix du gaz a bondi de 180 % depuis 2021. L'Union européenne interdit les chaudières fossiles neuves dès 2026. Chaque année sans action coûte en factures, en entretien, et en valeur PEB perdue."}
              </p>
              <ul className="grid gap-3">
                {[
                  {marker: '+180 %', text: "prix du gaz naturel depuis 2021"},
                  {marker: '2026',   text: "fin des chaudières gaz neuves — directive UE"},
                  {marker: 'PEB',    text: "pénalisé sans rénovation énergétique"},
                ].map((item) => (
                  <li key={item.text} className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-wdd-black w-16 flex-shrink-0 tabular-nums">{item.marker}</span>
                    <span className="text-sm font-light text-black/65 leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SÉPARATEUR CENTRÉ */}
            <div className="hidden lg:block bg-black/8" />

            {/* DROITE — Schéma animé */}
            <div className="pl-16 flex flex-col justify-center py-4">

              {/* Schéma animé sol → PAC → maison */}
              <div className="mb-10">
                <GeoScheme />
              </div>

              {/* Liens discrets */}
              <div className="flex flex-col gap-2 border-t border-black/8 pt-6">
                <Link href={getLocalizedPath(locale, 'geo_fermee')} className="text-sm font-light text-black/45 hover:text-wdd-black transition-colors flex items-center gap-2">
                  <span className="text-wdd-yellow">→</span> Géothermie fermée — en savoir plus
                </Link>
                <Link href={getLocalizedPath(locale, 'pac')} className="text-sm font-light text-black/45 hover:text-wdd-black transition-colors flex items-center gap-2">
                  <span className="text-wdd-yellow">→</span> Pompe à chaleur géothermique — en savoir plus
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. POURQUOI LA GÉOTHERMIE
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              Pourquoi la géothermie
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <h2 className="text-4xl font-bold leading-tight">
              {page.whyTitle ?? "Six raisons de passer à la géothermie cette année."}
            </h2>
            {page.whyIntro && (
              <p className="text-base font-light text-black/70 leading-8 self-end whitespace-pre-line">
                {page.whyIntro}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3">
            {whyItems.map((item, i) => {
              const icons = [
                /* économies */
                <svg key="eco" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a3 3 0 10-3 5h3a3 3 0 010 6H9M12 7v1m0 8v1"/></svg>,
                /* zéro fossile */
                <svg key="leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22s4-8 10-10c4-1.5 8-1 10-1-1 4-3 8-8 10-3.5 1.3-7 1-12 1z"/><path d="M12 12L2 22"/></svg>,
                /* chaud/frais */
                <svg key="temp" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10.5M12 22a4 4 0 100-8 4 4 0 000 8z"/><path d="M8 6H6M8 10H5M8 14H6"/></svg>,
                /* patrimoine */
                <svg key="house" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M15 21V12H9v9"/><path d="M16 5l3 3"/></svg>,
                /* indépendance */
                <svg key="shield" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
                /* durabilité */
                <svg key="clock" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
              ]
              const icon = icons[i] ?? icons[0]
              return (
                <div
                  key={('_key' in item ? (item._key as string | undefined) : undefined) ?? i}
                  className="group relative px-8 py-10 border-t border-black/8 overflow-hidden cursor-default"
                >
                  {/* Numéro watermark décoratif */}
                  <span className="absolute top-5 right-7 text-8xl font-black leading-none select-none pointer-events-none text-black/[0.035]">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icône dans carré jaune */}
                  <div className="w-10 h-10 bg-wdd-yellow flex items-center justify-center text-wdd-black mb-6 flex-shrink-0">
                    {icon}
                  </div>

                  {/* Titre — glisse légèrement au hover */}
                  <h3 className="text-base font-bold mb-3 leading-snug group-hover:translate-x-1.5 transition-transform duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-black/55 leading-7">
                    {item.body}
                  </p>

                  {/* Barre jaune gauche au hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-wdd-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. VOTRE PROJET DE A À Z
      ══════════════════════════════════════ */}
      <section className="bg-white min-h-screen relative overflow-hidden">

        {/* RIGHT — clean drill, pleine moitié droite */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
          <Image src="/images/clean-drill.jpg" alt="Foreuse WellDoneDrill" fill className="object-cover object-center" />
        </div>

        {/* LEFT — fond beige, texte sombre, aligné comme le reste */}
        <div className="py-24 px-8 md:px-16">
          <div className="max-w-screen-2xl mx-auto w-full">
            <div className="lg:w-1/2 lg:pr-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-0.5 bg-wdd-yellow" />
                <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
                  Votre projet, de A à Z
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-10">
                Votre projet de A à Z<br />avec WellDoneDrill.
              </h2>
              <div>
                {etapes.map((etape, i) => (
                  <div
                    key={('_key' in etape ? (etape._key as string | undefined) : undefined) ?? i}
                    className="flex gap-8 py-7 border-b border-black/8 last:border-b-0"
                  >
                    <span className="text-4xl font-black text-black/[0.07] tabular-nums leading-none flex-shrink-0 w-12 pt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-bold mb-2 leading-snug">{etape.title}</h3>
                      <p className="text-sm font-light text-black/55 leading-7">{etape.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  href={getLocalizedPath(locale, 'devis')}
                  className="bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
                >
                  Demander un devis gratuit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image mobile */}
        <div className="lg:hidden relative h-72">
          <Image src="/images/clean-drill.jpg" alt="Foreuse WellDoneDrill" fill className="object-cover object-center" />
        </div>

      </section>

      {/* ══════════════════════════════════════
          5. CALCULATEUR D'ÉCONOMIES
      ══════════════════════════════════════ */}
      <section id="calculateur" className="bg-wdd-clay min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              Calculateur d&apos;économies
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 mb-14">
            <h2 className="text-4xl font-bold leading-tight">
              Combien pourriez-vous économiser ?
            </h2>
            <p className="text-base font-light text-black/55 leading-8 self-end">
              Entrez votre surface ou votre consommation actuelle. Cochez les postes qui vous concernent — les économies se calculent en temps réel.
            </p>
          </div>

          {/* Configurateur + Résultats */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 mb-14">

            {/* ── Configurateur ── */}
            <div className="space-y-10">

              {/* Mode d'entrée */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">J&apos;entre</div>
                <div className="flex gap-1.5">
                  {([['surface','Ma surface (m²)'],['conso','Ma consommation (MWh/an)']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setEcoMode(v)}
                      className={`px-4 py-2.5 text-sm font-bold transition-colors ${ecoMode === v ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider surface ou consommation */}
              {ecoMode === 'surface' ? (
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-black/40">Surface habitable</div>
                    <div className="text-2xl font-bold text-wdd-black tabular-nums">{ecoSurface} m²</div>
                  </div>
                  <input type="range" min={60} max={400} step={5} value={ecoSurface}
                    onChange={e => setEcoSurface(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-black/15 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-wdd-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-black/30 mt-2"><span>60 m²</span><span>400 m²</span></div>
                  <div className="text-xs text-black/40 mt-3">
                    ≈ {Math.round(ecoSurface * 0.090 * 10) / 10} MWh/an de chauffage estimés
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-black/40">Consommation chauffage</div>
                    <div className="text-2xl font-bold text-wdd-black tabular-nums">{ecoConso} MWh/an</div>
                  </div>
                  <input type="range" min={5} max={80} step={1} value={ecoConso}
                    onChange={e => setEcoConso(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-black/15 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-wdd-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-black/30 mt-2"><span>5 MWh</span><span>80 MWh</span></div>
                  <div className="text-xs text-black/40 mt-3">
                    ≈ {Math.round(ecoConso / 0.090)} m² de surface estimée
                  </div>
                </div>
              )}

              {/* Énergie actuelle */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">Énergie de chauffage actuelle</div>
                <div className="flex gap-1.5">
                  {([['gaz','Gaz naturel'],['mazout','Mazout'],['elec','Électrique']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setEcoEnergie(v)}
                      className={`px-4 py-2.5 text-sm font-bold transition-colors ${ecoEnergie === v ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Postes concernés */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">Postes concernés</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'Chauffage', active: posteChauffage, toggle: () => setPosteChauffage(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v10.5M12 22a4 4 0 100-8 4 4 0 000 8z"/><path d="M8 6H6M8 10H5M8 14H6"/></svg> },
                    { label: 'Rafraîchissement', active: posteRafraich, toggle: () => setPosteRafraich(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07l14.14-14.14"/></svg> },
                    { label: 'Piscine', active: postePiscine, toggle: () => setPostePiscine(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="12" cy="6" r="2"/></svg> },
                  ].map(p => (
                    <button key={p.label} onClick={p.toggle}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors ${p.active ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {p.icon}{p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Résultats ── */}
            <div className="bg-white border border-black/8 p-8 flex flex-col">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/35 mb-6">
                Économies estimées / an
              </div>

              {/* Total mis en avant */}
              <div className="mb-6 pb-6 border-b border-black/8">
                <div className="text-[10px] uppercase tracking-widest text-black/35 mb-2">Total toutes énergies</div>
                <div className="text-4xl font-bold text-wdd-black tabular-nums leading-none">
                  {fmt(ecoCalc.totalEurLow)} – {fmt(ecoCalc.totalEurHigh)} €
                </div>
                <div className="text-sm font-light text-black/45 mt-2">
                  soit {ecoCalc.totalMWh} MWh économisés · {fmt(ecoCalc.co2)} kg CO₂ évités
                </div>
              </div>

              {/* Détail par poste */}
              <div className="flex flex-col gap-0 flex-1">
                {[
                  { data: ecoCalc.chauffage, label: 'Chauffage', active: posteChauffage,
                    mwhBase: Math.round(ecoCalc.chaufMWh * 10)/10 },
                  { data: ecoCalc.rafraich, label: 'Rafraîchissement', active: posteRafraich,
                    mwhBase: Math.round(ecoCalc.rafraichMWh * 10)/10 },
                  { data: ecoCalc.piscine, label: 'Piscine', active: postePiscine,
                    mwhBase: ecoCalc.piscMWh },
                ].map(p => (
                  <div key={p.label}
                    className={`flex items-center justify-between py-4 border-b border-black/8 last:border-b-0 transition-opacity ${p.active ? 'opacity-100' : 'opacity-25'}`}>
                    <div>
                      <div className="text-sm font-bold">{p.label}</div>
                      <div className="text-xs text-black/40 mt-0.5">
                        {p.active ? `${p.data?.mwh ?? 0} MWh économisés sur ${p.mwhBase} MWh` : 'non sélectionné'}
                      </div>
                    </div>
                    <div className="text-right">
                      {p.active && p.data ? (
                        <>
                          <div className="text-base font-bold text-wdd-black tabular-nums">
                            {fmt(p.data.eurLow ?? (p.data as {eur?: number}).eur ?? 0)} – {fmt(p.data.eurHigh ?? (p.data as {eur?: number}).eur ?? 0)} €
                          </div>
                          <div className="text-[10px] text-black/30 mt-0.5">/an</div>
                        </>
                      ) : (
                        <div className="text-sm text-black/20">—</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-black/8">
                <div className="text-xs font-light text-black/35 leading-5">
                  Basé sur les prix de l&apos;énergie belges 2024–2025 et un COP géothermique de 4,5. Résultat indicatif.
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          6. PASSEZ À L'ÉTAPE SUIVANTE — devis
      ══════════════════════════════════════ */}
      <section className="bg-wdd-black min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Gauche — accroche */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase">
                Passez à l&apos;étape suivante
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Ces chiffres vous parlent ?<br />Obtenez votre devis précis.
            </h2>
            <p className="text-base font-light text-white/55 leading-8 mb-10">
              Nos experts analysent la géologie de votre terrain, votre installation actuelle et vos besoins énergétiques. Devis complet sous 48h, gratuit et sans engagement.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                {value: 'Gratuit', label: 'Étude de faisabilité'},
                {value: '48h', label: 'Délai de réponse'},
                {value: '0€', label: "Sans engagement"},
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-wdd-yellow">{s.value}</div>
                  <div className="text-xs font-light text-white/40 mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Droite — formulaire */}
          <div className="bg-white/5 border border-white/10 p-8 lg:p-10">
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">
              Votre projet en quelques lignes
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Prénom"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
                <input type="text" placeholder="Nom"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" placeholder="Email"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
                <input type="tel" placeholder="Téléphone"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
              </div>
              <input type="text" placeholder="Adresse du bien"
                className="w-full bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
              />
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <input type="text" placeholder="Code postal"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
                <input type="text" placeholder="Ville"
                  className="bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors"
                />
              </div>
              <textarea placeholder="Informations complémentaires (type de chauffage actuel, superficie…)" rows={3}
                className="w-full bg-white/8 border border-white/12 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-wdd-yellow/50 transition-colors resize-none"
              />
              <Link
                href={getLocalizedPath(locale, 'devis')}
                className="w-full text-center bg-wdd-yellow text-wdd-black px-6 py-4 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors mt-1"
              >
                Recevoir mon devis précis →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          7. NOS PROJETS EN BELGIQUE
      ══════════════════════════════════════ */}
      <ProjetsSection locale={locale} chantiers={chantiers} />

      {/* ══════════════════════════════════════
          8. FAQ
          Objectif : lever les derniers freins
          avant la conversion finale
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              {page.faqTitle ?? "Vos questions, nos réponses."}
            </h2>
            <p className="text-sm font-light text-black/50 leading-7 mb-8">
              Une question ne figure pas ici ? Contactez directement notre équipe.
            </p>
            <Link
              href={getLocalizedPath(locale, 'devis')}
              className="inline-block bg-wdd-black text-wdd-yellow px-5 py-2.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
            >
              Poser ma question
            </Link>
          </div>
          <div className="lg:col-span-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          STICKY MOBILE CTA
          Objectif : conversion mobile permanente
          visible à chaque scroll
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-wdd-black border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <a
          href="#calculateur"
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-black bg-wdd-yellow border-2 border-wdd-yellow"
        >
          Calculer mes économies
        </a>
        <Link
          href={getLocalizedPath(locale, 'devis')}
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-yellow border-2 border-wdd-yellow hover:bg-wdd-yellow hover:text-wdd-black transition-colors"
        >
          Devis gratuit
        </Link>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   PROJETS SECTION
───────────────────────────────────────────── */

const PER_PAGE = 4

function matchesProvince(c: Chantier, p: Province): boolean {
  if (!c.province) return false
  const cp = c.province.toLowerCase()
  return (
    cp.includes(p.nameFr.toLowerCase()) ||
    cp.includes(p.nameNl.toLowerCase()) ||
    cp.includes(p.slug.replace(/-/g, ' '))
  )
}

function ProjetsSection({locale, chantiers}: {locale: AppLocale; chantiers: Chantier[]}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const selectedProvince = selectedId ? BELGIUM_PROVINCES.find((p) => p.id === selectedId) ?? null : null

  const filtered = selectedProvince
    ? chantiers.filter((c) => matchesProvince(c, selectedProvince))
    : chantiers

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const displayed = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  const handleProvinceClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
    setPage(0)
  }

  const ctaHref = selectedProvince
    ? getProvincePageUrl(locale, selectedProvince.slug)
    : getLocalizedPath(locale, 'references')
  const ctaLabel = selectedProvince
    ? `Tous les projets en ${getProvinceName(selectedProvince, locale)}`
    : 'Voir toutes nos réalisations'

  return (
    <section className="bg-white min-h-screen flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
            Nos réalisations
          </span>
        </div>

        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold leading-tight">
            Nos projets en <span className="text-wdd-mud">Belgique</span>
          </h2>
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setPage(0) }}
              className="text-xs font-light text-black/35 hover:text-black/70 transition-colors underline underline-offset-2 shrink-0"
            >
              Toutes les provinces
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Map — viewBox cropped to Belgium's actual bounds, no whitespace ── */}
          <div>
            <svg
              viewBox="55 350 940 730"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
            >
              {BELGIUM_PROVINCES.map((p) => (
                <path
                  key={p.id}
                  d={p.path}
                  fill={selectedId === p.id || hovered === p.id ? '#FFD950' : 'transparent'}
                  stroke="#B0A89E"
                  strokeWidth={0.4}
                  strokeLinejoin="round"
                  style={{cursor: 'pointer', transition: 'fill 0.15s'}}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleProvinceClick(p.id)}
                />
              ))}
            </svg>

            <div className="h-5 mt-1">
              <span className="text-sm font-light text-black/40">
                {hovered
                  ? getProvinceName(BELGIUM_PROVINCES.find((p) => p.id === hovered)!, locale)
                  : selectedProvince
                    ? getProvinceName(selectedProvince, locale)
                    : 'Sélectionnez une province'}
              </span>
            </div>
          </div>

          {/* ── Cards ── */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedId ?? '__all__'}-${safePage}`}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.18}}
                className="grid grid-cols-2 gap-3"
              >
                {displayed.length === 0 ? (
                  <div className="col-span-2 py-16 text-center text-sm font-light text-black/35">
                    Aucun projet répertorié dans cette province pour le moment.
                  </div>
                ) : (
                  <>
                    {displayed.map((c) => (
                      <ProjetCard key={c._id} chantier={c} />
                    ))}
                    {Array.from({length: PER_PAGE - displayed.length}).map((_, i) => (
                      <div key={`ph-${i}`} className="bg-wdd-clay/30 aspect-[3/4]" />
                    ))}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dots + CTA */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {totalPages > 1 && Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`transition-all duration-200 rounded-full ${
                      i === safePage
                        ? 'w-5 h-2 bg-wdd-black'
                        : 'w-2 h-2 bg-black/20 hover:bg-black/45'
                    }`}
                  />
                ))}
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-wdd-black hover:text-wdd-mud transition-colors shrink-0"
              >
                <span>{ctaLabel}</span>
                <span className="text-wdd-yellow">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ProjetCard({chantier: c}: {chantier: Chantier}) {
  const imgUrl = chantierImageUrl(c.photo, 600)

  return (
    <div className="group bg-wdd-clay overflow-hidden flex flex-col hover:bg-wdd-black transition-colors duration-200">
      {imgUrl ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={imgUrl}
            alt={c.title ?? 'Projet WellDoneDrill'}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-40 bg-black/6 group-hover:bg-white/5 flex items-center justify-center transition-colors">
          <span className="text-xl font-bold text-black/8 group-hover:text-white/8 select-none">WDD</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1 relative overflow-hidden">
        <span className="absolute top-3 right-3 text-3xl font-bold text-black/[0.04] group-hover:text-white/[0.04] transition-colors select-none">
          {c.year ?? '—'}
        </span>

        <div className="flex flex-wrap gap-1">
          {c.type && (
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                c.type === 'fermee'
                  ? 'bg-wdd-yellow text-wdd-black'
                  : 'bg-wdd-black text-wdd-yellow group-hover:bg-wdd-yellow group-hover:text-wdd-black'
              } transition-colors`}
            >
              {c.type === 'fermee' ? 'Fermée' : 'Ouverte'}
            </span>
          )}
          {c.sector && (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-black/6 text-black/45 group-hover:bg-white/10 group-hover:text-white/45 transition-colors">
              {sectorLabel(c.sector)}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold leading-snug group-hover:text-white transition-colors line-clamp-2">
          {c.title ?? 'Projet géothermique'}
        </h3>

        {(c.location || c.province) && (
          <p className="text-xs font-light text-black/45 group-hover:text-white/40 transition-colors truncate mt-auto">
            {[c.location, c.province].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </div>
  )
}

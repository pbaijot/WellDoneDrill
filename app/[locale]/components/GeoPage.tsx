'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {getLocalizedPath, type AppLocale, type RouteKey} from '@/src/i18n/routes'
import type {GeoPageData} from '@/src/lib/geoPage'
import {urlFor} from '@/src/lib/sanityImage'

/* ── Defaults ───────────────────────────────────────────────── */

const DEFAULT_ETAPES = [
  {title: 'Devis gratuit', body: 'Premier contact, analyse de vos besoins. Réponse sous 48h.'},
  {title: 'Étude de faisabilité', body: 'Analyse géologique de votre terrain. Gratuite. Sans engagement.'},
  {title: 'Permis & démarches', body: 'WellDoneDrill s\'occupe de toutes les autorisations à votre place.'},
  {title: 'Forage', body: '1 à 3 jours d\'intervention. Impact minimal, terrain remis en état.'},
  {title: 'Mise en service', body: 'Votre chauffagiste connecte la PAC. Vous basculez sur la géothermie.'},
]

const DEFAULT_FAQS_OUVERTE = [
  {
    question: 'Comment fonctionne la géothermie sur nappe ?',
    answer: 'La géothermie sur nappe (ou ouverte) prélève de l\'eau dans une nappe phréatique via un puits de pompage, extrait ses calories, puis la réinjecte dans la même nappe via un puits de rejet. Le sol maintient une température stable de 10–14 °C toute l\'année, ce qui permet un rendement (COP) souvent supérieur à 5.',
  },
  {
    question: 'Quelles sont les conditions requises pour une nappe ?',
    answer: 'Il faut une nappe phréatique accessible (généralement entre 5 et 30 m de profondeur), avec un débit suffisant (au moins 3 à 5 m³/h pour une maison individuelle). WellDoneDrill réalise une étude hydrogéologique préalable pour valider la faisabilité de votre site.',
  },
  {
    question: 'La géothermie sur nappe est-elle plus efficace que la fermée ?',
    answer: 'Oui, la géothermie ouverte offre généralement un COP plus élevé (5–7 vs 4–5 en fermé) car elle exploite directement l\'eau souterraine plutôt qu\'un fluide caloporteur. En revanche, elle nécessite une nappe adéquate et des autorisations spécifiques.',
  },
  {
    question: 'Quels permis sont nécessaires ?',
    answer: 'En Belgique, un permis de forage et une autorisation de prise d\'eau sont requis. En Wallonie, cela passe par le Service Public de Wallonie (SPW). WellDoneDrill gère l\'intégralité des démarches administratives, des déclarations aux liaisons avec les organismes compétents.',
  },
  {
    question: 'Pour quels types de projets est-elle adaptée ?',
    answer: 'La géothermie sur nappe est particulièrement adaptée aux projets à forte demande énergétique : bâtiments tertiaires, industries, hôtels, piscines, serres agricoles, ou groupes de logements. Elle est dimensionnable pour des projets de quelques kW à plusieurs MW.',
  },
  {
    question: 'Y a-t-il un risque de pollution de la nappe ?',
    answer: 'Non. Le circuit est étanche et seule de l\'énergie thermique est échangée. L\'eau est prélevée et réinjectée chimiquement intacte, sans aucun additif. Les normes belges imposent une distance minimale entre puits de pompage et de rejet pour éviter tout court-circuit thermique.',
  },
]

const DEFAULT_FAQS_FERMEE = [
  {
    question: 'Combien coûte un forage géothermique fermé ?',
    answer: 'Le forage représente typiquement 8 000 à 14 000 € selon la profondeur et le nombre de sondes. Le budget complet (forage + PAC + installation) se situe entre 20 000 et 30 000 €. Après primes régionales, le reste à charge descend souvent sous les 18 000 €.',
  },
  {
    question: 'Quelle profondeur de forage est nécessaire ?',
    answer: 'Pour une maison standard, les sondes verticales descendent à 80–150 m. La profondeur exacte dépend de votre géologie locale et de vos besoins énergétiques. WellDoneDrill réalise une étude préalable pour dimensionner correctement votre installation.',
  },
  {
    question: 'La géothermie fermée fonctionne-t-elle aussi comme climatisation ?',
    answer: 'Oui. La géothermie fermée permet une climatisation passive (free-cooling) très efficace en été, avec une consommation électrique marginale. Le sol agit comme un puits de froid naturel — sans émettre de chaleur à l\'extérieur.',
  },
  {
    question: 'Faut-il un permis pour forer ?',
    answer: 'Dans la plupart des régions belges, un permis de forage est requis. WellDoneDrill gère intégralement les démarches administratives pour vous — déclarations, dossiers techniques, liaisons avec les organismes compétents.',
  },
  {
    question: 'Mon terrain est-il compatible ?',
    answer: 'Plus de 90 % des propriétés en Belgique sont géologiquement compatibles avec la géothermie fermée. WellDoneDrill réalise une étude préalable gratuite pour confirmer la faisabilité sur votre parcelle, avant tout engagement de votre part.',
  },
  {
    question: 'Quelle différence entre géothermie fermée et ouverte ?',
    answer: 'La géothermie fermée utilise des sondes verticales en circuit fermé (eau glycolée) sans prélèvement d\'eau souterraine. Elle convient à presque tous les terrains. La géothermie ouverte puise directement dans une nappe phréatique et offre des rendements plus élevés, mais nécessite une nappe accessible et des autorisations spécifiques.',
  },
]

/* ── Step icons for how-it-works ────────────────────────────── */

const STEP_ICONS = [
  /* analyse terrain */
  <svg key="analyse" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12M12 12C12 12 7 9 7 5a5 5 0 0110 0c0 4-5 7-5 7z"/>
    <path d="M8 15h8M6 18h12"/>
  </svg>,
  /* forage */
  <svg key="forage" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v16M8 6l4-4 4 4M9 18h6l1 4H8l1-4z"/>
    <path d="M7 14h10"/>
  </svg>,
  /* sonde/circuit */
  <svg key="sonde" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l3-9 4 18 3-9h4"/>
  </svg>,
  /* pompe à chaleur */
  <svg key="pac" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
  /* mise en service */
  <svg key="mise" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>,
  /* check/confort */
  <svg key="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>,
]

/* ── Animated scheme locale labels ─────────────────────────── */

const SCHEME_TEXT: Record<string, {
  fermee: {label: string; sub: string}[]
  ouverte: {label: string; sub: string}[]
}> = {
  'be-nl': {
    fermee: [
      {label: 'De bodem',     sub: 'Constante energie op 80–200 m'},
      {label: 'Warmtepomp',   sub: 'Versterkt de gewonnen energie'},
      {label: 'Uw woning',    sub: 'Verwarming · Water · Koeling'},
    ],
    ouverte: [
      {label: 'De waterlaag', sub: 'Warmtebron op 10–14 °C'},
      {label: 'Warmtepomp',   sub: 'Versterkt de gewonnen energie'},
      {label: 'Uw gebouw',    sub: 'Verwarming · Water · Koeling'},
    ],
  },
  'lu-de': {
    fermee: [
      {label: 'Der Boden',       sub: 'Konstante Energie bei 80–200 m'},
      {label: 'Wärmepumpe',      sub: 'Verstärkt die gewonnene Energie'},
      {label: 'Ihr Zuhause',     sub: 'Heizung · Wasser · Kühlung'},
    ],
    ouverte: [
      {label: 'Das Grundwasser', sub: 'Wärmequelle bei 10–14 °C'},
      {label: 'Wärmepumpe',      sub: 'Verstärkt die gewonnene Energie'},
      {label: 'Ihr Gebäude',     sub: 'Heizung · Wasser · Kühlung'},
    ],
  },
}

const FR_SCHEME = {
  fermee: [
    {label: 'Le sol',           sub: 'Énergie constante à 80–200 m'},
    {label: 'Pompe à chaleur',  sub: "Amplifie l'énergie captée"},
    {label: 'Votre maison',     sub: 'Chauffage · Eau · Froid'},
  ],
  ouverte: [
    {label: 'La nappe',         sub: 'Source thermique à 10–14 °C'},
    {label: 'Pompe à chaleur',  sub: "Amplifie l'énergie captée"},
    {label: 'Votre bâtiment',   sub: 'Chauffage · Eau · Froid'},
  ],
}

/* ── Vertical animated scheme ───────────────────────────────── */

function GeoSchemeVertical({isOpen, locale}: {isOpen: boolean; locale: AppLocale}) {
  const [phase, setPhase] = useState(0)
  const durations = [600, 1600, 1200, 1600, 1200, 1600, 2800]
  useEffect(() => {
    const t = setTimeout(() => setPhase(p => (p + 1) % 7), durations[phase] ?? 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const solLit    = phase >= 1
  const pipe1Lit  = phase >= 2
  const pacLit    = phase >= 3
  const pipe2Lit  = phase >= 4
  const maisonLit = phase >= 5
  const NODE_DUR  = 'duration-[1100ms]'

  const schemeText = (SCHEME_TEXT[locale] ?? FR_SCHEME) as typeof FR_SCHEME
  const labels = isOpen ? schemeText.ouverte : schemeText.fermee

  const NODES = isOpen ? [
    {
      ...labels[0],
      stat: 'COP 5–7',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7c3-2 6-2 9 0s6 2 9 0M3 12c3-2 6-2 9 0s6 2 9 0M3 17c3-2 6-2 9 0s6 2 9 0"/></svg>,
    },
    {
      ...labels[1],
      stat: 'COP 5–7',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
    {
      ...labels[2],
      stat: '−70 %',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    },
  ] : [
    {
      ...labels[0],
      stat: '15 °C',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12C12 12 7 9 7 5a5 5 0 0110 0c0 4-5 7-5 7z"/><path d="M8 15h8M6 18h12"/></svg>,
    },
    {
      ...labels[1],
      stat: 'COP 4–5',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
    {
      ...labels[2],
      stat: '−70 %',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    },
  ]

  const lits    = [solLit, pacLit, maisonLit]
  const pipeLits = [pipe1Lit, pipe2Lit]

  // Render top → bottom: index 2 (Maison/top), pipe, index 1 (PAC), pipe, index 0 (Sol/bottom)
  // Each pipe sits between the node above it and the node below, animates origin-bottom (from lower node upward)
  return (
    <div className="flex flex-col w-full py-8 lg:pr-12">
      {([2, 1, 0] as const).map((i) => (
        <div key={NODES[i].label}>
          {/* Node */}
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center transition-all ${NODE_DUR} ease-in-out rounded-sm ${lits[i] ? 'bg-wdd-yellow' : 'bg-black/6'}`}>
              <div className={`transition-colors ${NODE_DUR} ${lits[i] ? 'text-wdd-black' : 'text-black/20'}`}>{NODES[i].icon}</div>
            </div>
            <div>
              <div className={`text-base font-bold leading-snug transition-colors ${NODE_DUR} ${lits[i] ? 'text-wdd-black' : 'text-black/20'}`}>{NODES[i].label}</div>
              <div className={`text-sm font-light mt-1 leading-snug transition-colors ${NODE_DUR} ${lits[i] ? 'text-black/50' : 'text-black/10'}`}>{NODES[i].sub}</div>
              <div className={`text-sm font-black mt-2 tabular-nums transition-colors ${NODE_DUR} ${lits[i] ? 'text-wdd-mud' : 'text-black/10'}`}>{NODES[i].stat}</div>
            </div>
          </div>
          {/* Pipe below this node (omitted for bottom node) */}
          {i > 0 && (
            <div className="flex items-start h-16">
              <div className="w-12 flex flex-col items-center h-full">
                {/* Arrow at top, pointing toward current (upper) node */}
                <div style={{fontSize: 8, lineHeight: 1, color: pipeLits[i - 1] ? '#FFD94F' : 'rgba(0,0,0,0.08)', transition: 'color 900ms ease-in-out'}}>▲</div>
                {/* Line fills from bottom (lower node) upward */}
                <div className="flex-1 w-px bg-black/8 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-wdd-yellow origin-bottom"
                    style={{
                      transform: pipeLits[i - 1] ? 'scaleY(1)' : 'scaleY(0)',
                      transition: pipeLits[i - 1] ? 'transform 1000ms cubic-bezier(0.4,0,0.2,1)' : 'transform 500ms ease-in-out',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── FAQ item (accordion) ───────────────────────────────────── */

function FaqItem({question, answer, dark = false}: {question: string; answer: string; dark?: boolean}) {
  const [open, setOpen] = useState(true)
  return (
    <div className={`border-b last:border-b-0 ${dark ? 'border-white/10' : 'border-black/10'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span className={`text-base font-bold leading-snug transition-colors ${dark ? 'text-white group-hover:text-wdd-yellow' : 'group-hover:text-wdd-mud'}`}>{question}</span>
        <span className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5 ${open ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45' : dark ? 'border-white/20 text-white/40' : 'border-black/20 text-black/40'}`}>
          +
        </span>
      </button>
      {open && (
        <p className={`text-sm font-light leading-7 pb-6 pr-12 ${dark ? 'text-white/55' : 'text-black/70'}`}>{answer}</p>
      )}
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */

export default function GeoPage({
  page,
  locale,
}: {
  page: GeoPageData
  locale: AppLocale
}) {
  const isOpen = page.routeKey === 'geo_ouverte'
  const ctaRoute: RouteKey = isOpen ? 'pro_chauffagistes' : 'demarrer'

  const heroLeftBg = page.heroLeftBgImage
    ? urlFor(page.heroLeftBgImage)?.url() ?? '/images/wdd-geothermie_fermee-terre.webp'
    : '/images/wdd-geothermie_fermee-terre.webp'
  const heroRightImg = page.heroRightImage
    ? urlFor(page.heroRightImage)?.url() ?? (isOpen ? '/images/pexels-peter-holmelin.jpg' : '/images/MRLY-screen-2.png')
    : isOpen ? '/images/pexels-peter-holmelin.jpg' : '/images/MRLY-screen-2.png'

  const faqs = page.faqs?.length
    ? page.faqs.map((f) => ({question: f.question ?? '', answer: f.answer ?? ''}))
    : isOpen ? DEFAULT_FAQS_OUVERTE : DEFAULT_FAQS_FERMEE

  return (
    <div className="flex flex-col bg-white">

      {/* ══ 1. HERO ══════════════════════════════════════════════ */}
      <section className="h-[90vh] relative overflow-hidden px-8 md:px-16">

        {/* Left bg image — full width on mobile, half on desktop */}
        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2">
          <Image src={heroLeftBg} alt="" fill className="object-cover object-center scale-[1.04]" style={{filter: 'saturate(1.5) blur(0.8px)'}} priority />
          <div className="absolute inset-0 bg-wdd-black/50 lg:bg-wdd-black/30" />
        </div>

        {/* Right photo */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-[2] hidden lg:block">
          <Image src={heroRightImg} alt={isOpen ? 'Géothermie ouverte' : 'Géothermie fermée WellDoneDrill'} fill className="object-cover object-center" priority />
        </div>

        {/* WDD logo divider */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none">
          <Image src="/images/small-white-logo-droit.png" alt="WellDoneDrill" width={144} height={144} className="object-contain" />
        </div>

        {/* Text content */}
        <div className="relative z-[3] max-w-screen-2xl mx-auto h-[90vh] flex items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 py-24">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              <span className="block">{page.heroLine1}</span>
              {page.heroLine2 && <span className="block">{page.heroLine2}</span>}
              {page.heroLine3 && <span className="block">{page.heroLine3}</span>}
            </h1>

            {page.heroSubtitle && (
              <p className="text-base font-normal text-white leading-relaxed max-w-lg mb-10">
                {page.heroSubtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-12">
              {page.heroCtaLabel && (
                <Link
                  href={getLocalizedPath(locale, ctaRoute)}
                  className="bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
                >
                  {page.heroCtaLabel}
                </Link>
              )}
              <Link
                href={getLocalizedPath(locale, 'references')}
                className="px-7 py-3.5 text-sm font-semibold border-2 border-white/40 text-white hover:border-white transition-colors rounded-sm"
              >
                {page.heroSecondaryLabel ?? 'Voir nos réalisations'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. INTRO ═════════════════════════════════════════════ */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col justify-center lg:pr-12">
            <h2 className="text-4xl font-bold mb-6 leading-tight">{page.introTitle}</h2>
            {page.introBody1 && (
              <p className="text-base font-light text-black/70 leading-8 mb-5 whitespace-pre-line">{page.introBody1}</p>
            )}
            {page.introBody2 && (
              <p className="text-base font-light text-black/70 leading-8 whitespace-pre-line">{page.introBody2}</p>
            )}
            {page.introCtaLabel && (
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="mt-8 self-start inline-flex items-center gap-2 bg-wdd-black text-white px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
              >
                {page.introCtaLabel}
              </Link>
            )}
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-sm">
            <Image
              src={page.introImage ? urlFor(page.introImage)?.url() ?? '/images/wdd-expert-forage.webp' : '/images/wdd-expert-forage.webp'}
              alt="Expert WellDoneDrill sur chantier"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
        </div>
      </section>

      {/* ══ 3. COMMENT ÇA FONCTIONNE ═════════════════════════════ */}
      <section className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          {/* Scheme (left) + SVG frame (right) */}
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">

            {/* Left: title (desktop) + vertical animated scheme + CTA */}
            <div className="flex flex-col order-last lg:order-first">
              {/* Title visible on desktop only — mobile version is below */}
              <div className="hidden lg:block mb-12 lg:pr-24">
                <h2 className="text-4xl font-bold leading-tight">{page.howTitle}</h2>
              </div>
              <div className="bg-wdd-clay flex items-center flex-1">
                <GeoSchemeVertical isOpen={isOpen} locale={locale} />
              </div>
              <div className="py-8">
                <Link
                  href={getLocalizedPath(locale, 'demarrer')}
                  className="flex justify-between w-full lg:w-auto lg:inline-flex items-center gap-2 bg-wdd-black text-white px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
                >
                  {page.howCtaLabel ?? 'Démarrer mon projet →'}
                </Link>
              </div>
            </div>

            {/* Right: SVG illustration + technical body */}
            <div className="bg-wdd-clay flex flex-col py-8 lg:px-8 lg:pb-8 gap-8 order-first lg:order-last">
              {/* Title visible on mobile only — desktop version is in left column */}
              <h2 className="lg:hidden text-4xl font-bold leading-tight">{page.howTitle}</h2>
              <Image
                src={
                  page.howIllustration
                    ? urlFor(page.howIllustration)?.url() ?? (isOpen ? '/images/wdd-illustration-geo-ouverte.svg' : '/images/wdd-illustration-geo-fermee.svg')
                    : isOpen ? '/images/wdd-illustration-geo-ouverte.svg' : '/images/wdd-illustration-geo-fermee.svg'
                }
                alt={isOpen ? 'Illustration géothermie sur nappe' : 'Illustration géothermie fermée'}
                width={380}
                height={520}
                className="w-full lg:w-3/5 h-auto mx-auto"
              />
              {page.howBody && (
                <p className="w-full text-base font-light text-black/70 leading-8 whitespace-pre-line">
                  {page.howBody}
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ══ 5. AVANTAGES ════════════════════════════════════════ */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-4xl font-bold leading-tight mb-14">
            {page.advantagesTitle ?? 'Les avantages de la géothermie'}
          </h2>
          {(() => {
            const FALLBACK_ADVANTAGES = [
              {
                title: 'Investissement rentable',
                body: "Une facture énergétique en baisse grâce à une source de chaleur gratuite et renouvelable.",
                icon: <svg key="icon0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
              },
              {
                title: 'Installation responsable',
                body: "Une solution respectueuse de l'environnement qui réduit votre empreinte carbone.",
                icon: <svg key="icon1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22s4-8 10-10c4-1.5 8-1 10-1-1 4-3 8-8 10-3.5 1.3-7 1-12 1z"/><path d="M12 12L2 22"/></svg>,
              },
              {
                title: 'Faible encombrement',
                body: "Fini les citernes de fioul, les stockages de granulés ou les groupes extérieurs, la géothermie fonctionne sans vous encombrer.",
                icon: <svg key="icon2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M3 9h6M3 15h6"/></svg>,
              },
              {
                title: 'Système silencieux',
                body: "Pas de bruit de combustion ni de ventilation intense, pour un confort acoustique optimal.",
                icon: <svg key="icon3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
              },
              {
                title: 'Équipements durables',
                body: "Des composants inaltérables conçus pour durer des décennies sans perte d'efficacité.",
                icon: <svg key="icon4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/></svg>,
              },
              {
                title: 'Entretien minimal',
                body: "Une solution clé en main pour le chauffage et la climatisation qui nécessite très peu de maintenance.",
                icon: <svg key="icon5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
              },
              {
                title: 'Rendement imbattable',
                body: "Avec un COP deux fois plus élevé que celui d'une PAC aérothermique, votre système produit jusqu'à 5× plus d'énergie qu'il n'en consomme.",
                icon: <svg key="icon6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
              },
              {
                title: 'Du chaud, et aussi du froid',
                body: "La chaleur extraite du sol en hiver refroidit le sol. Ce froid naturel est réutilisé en été pour rafraîchir votre bâtiment, sans frais de climatisation.",
                icon: <svg key="icon7" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M19.07 4.93L4.93 19.07"/></svg>,
              },
            ]
            const advantageItems = page.advantages && page.advantages.length > 0
              ? page.advantages.map((a, i) => ({title: a.title ?? '', body: a.body ?? '', icon: FALLBACK_ADVANTAGES[i % FALLBACK_ADVANTAGES.length]?.icon}))
              : FALLBACK_ADVANTAGES
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {advantageItems.map(({title, body, icon}, i) => {
                  const BG = ['bg-wdd-yellow', 'bg-wdd-grass', 'bg-wdd-mud'][i % 3]
                  return (
                    <div key={title || i} className="flex flex-col gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-sm text-wdd-black shrink-0 ${BG}`}>
                        {icon}
                      </div>
                      <h3 className="text-base font-bold leading-snug">{title}</h3>
                      <p className="text-sm font-light text-black/55 leading-relaxed">{body}</p>
                    </div>
                  )
                })}
              </div>
            )
          })()}
          {page.advantagesCtaLabel && (
            <div className="mt-14">
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="inline-flex items-center gap-2 bg-wdd-black text-white px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
              >
                {page.advantagesCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══ 6. FAQ ═══════════════════════════════════════════════ */}
      <section className="bg-wdd-black min-h-[90vh] flex flex-col justify-center py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              {page.faqTitle ?? 'Vos questions,\nnos réponses.'}
            </h2>
            <p className="text-sm font-light text-white/45 leading-7 mb-8">
              {page.faqSubtitle ?? 'Une question ne figure pas ici ? Contactez directement notre équipe.'}
            </p>
            <a
              href="#contact"
              className="inline-block bg-wdd-yellow text-wdd-black px-6 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
            >
              {page.faqCtaLabel ?? 'Nous contacter'}
            </a>
          </div>
          <div className="lg:col-span-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} dark />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. SEGMENT SELECTION ════════════════════════════════ */}
      <section className="relative grid grid-cols-2 grid-rows-2" style={{minHeight: '90vh'}}>

        {/* Top-left — photo particuliers */}
        <div className="relative overflow-hidden min-h-[45vh]">
          <Image
            src={page.particularImage ? urlFor(page.particularImage)?.url() ?? '/images/WDD-particuliers.webp' : '/images/WDD-particuliers.webp'}
            alt="Solutions géothermiques pour particuliers"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-wdd-black/25" />
        </div>

        {/* Top-right — particuliers text */}
        <div className="bg-wdd-grass py-10 md:py-14 pl-8 md:pl-16 pr-10 md:pr-14 flex flex-col justify-center">
          <div className="text-xs font-light tracking-widest text-white/55 uppercase mb-3">
            {page.particularEyebrow ?? 'Pour les particuliers'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {page.particularTitle ?? "Géothermie pour votre domicile"}
          </h3>
          <p className="text-sm font-light text-white/65 leading-relaxed mb-8">
            {page.particularBody ?? "Vous construisez ou rénovez ? La géothermie est une solution durable pour chauffer et rafraîchir votre maison avec un excellent niveau de confort et une forte stabilité de coût à long terme."}
          </p>
          <Link
            href={getLocalizedPath(locale, 'particuliers')}
            className="inline-block bg-white text-wdd-black px-6 py-3.5 text-sm font-bold hover:bg-wdd-yellow transition-colors self-start rounded-sm"
          >
            {page.particularCta ?? 'Demandez votre devis'} →
          </Link>
        </div>

        {/* Bottom-left — pro text */}
        <div className="bg-wdd-black py-10 md:py-14 pl-8 md:pl-[max(4rem,calc(50vw_-_48rem))] pr-10 md:pr-14 flex flex-col justify-center">
          <div className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase mb-3">
            {page.proEyebrow ?? 'Pour les entreprises'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {page.proTitle ?? 'Géothermie pour les grands projets'}
          </h3>
          <p className="text-sm font-light text-white/50 leading-relaxed mb-8">
            {page.proBody ?? "Promoteurs, bureaux d'études, architectes, installateurs, acteurs publics : nous intervenons sur des projets résidentiels collectifs, tertiaires, industriels et institutionnels."}
          </p>
          <Link
            href={getLocalizedPath(locale, 'pro')}
            className="inline-block bg-wdd-yellow text-wdd-black px-6 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors self-start rounded-sm"
          >
            {page.proCta ?? 'Soumettre mon projet'} →
          </Link>
        </div>

        {/* Bottom-right — photo entreprises */}
        <div className="relative overflow-hidden min-h-[45vh]">
          <Image
            src={page.proImage ? urlFor(page.proImage)?.url() ?? '/images/wdd-entreprises.webp' : '/images/wdd-entreprises.webp'}
            alt="Solutions géothermiques pour entreprises"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-wdd-black/25" />
        </div>

        {/* WDD logo centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <Image src="/images/wdd_logo_icon_jaune.svg" alt="WDD" width={52} height={52} className="brightness-0 invert" />
        </div>
      </section>

    </div>
  )
}

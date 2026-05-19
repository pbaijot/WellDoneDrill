import Image from 'next/image'
import Link from 'next/link'
import { getLocalizedPath, type RouteKey, type AppLocale } from '@/src/i18n/routes'
import { getTranslations } from 'next-intl/server'
import { getHomePage } from '@/src/lib/homePage'
import { getLatestBlogPosts } from '@/src/lib/blog'
import { getChantiers } from '@/src/lib/referencesPage'
import { getGlobalSettings } from '@/src/lib/globalSettings'
import { urlFor } from '@/src/lib/sanityImage'
import DemarrerCTA from './components/DemarrerCTA'
import HomeMapSection from './components/HomeMapSection'
import HomeFaqSection from './components/HomeFaqSection'

/* ── Advantage icons (40 × 40) ───────────────────────────────── */

function IconSavings() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="12" cy="12" r="9"/>
      <path d="M14.5 9.5a3 3 0 10-3 5h3a3 3 0 010 6H9M12 7v1m0 8v1"/>
    </svg>
  )
}
function IconEco() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M2 22s4-8 10-10c4-1.5 8-1 10-1-1 4-3 8-8 10-3.5 1.3-7 1-12 1z"/>
      <path d="M12 12L2 22"/>
    </svg>
  )
}
function IconComfort() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function IconDurability() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3"/>
    </svg>
  )
}

function IconFermee({ className }: { className?: string }) {
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

function IconOuverte({ className }: { className?: string }) {
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as AppLocale
  const t = await getTranslations({ locale, namespace: 'home' })
  const [home, globalSettings, latestPosts, chantiers] = await Promise.all([
    getHomePage(locale),
    getGlobalSettings(),
    getLatestBlogPosts(locale, 3),
    getChantiers(),
  ])

  /* ── Advantages — always 4 items (pad with fallback if CMS has fewer) ── */
  const fallbackAdvantages = [
    { number: '01', title: t('av_1_title'), description: "Jusqu'à 70 % d'économies. Retour sur investissement en 8–12 ans." },
    { number: '02', title: t('av_2_title'), description: "Énergie du sol, sans fossile, sans émission." },
    { number: '03', title: t('av_3_title'), description: "Chaud en hiver, frais en été. Un seul système." },
    { number: '04', title: 'Valorisation patrimoniale', description: "Meilleur PEB, bien valorisé. 50 ans sans contrainte." },
  ]
  const cmsAdvantages = home?.advantages?.items ?? []
  const advantageItems = cmsAdvantages.length >= 4
    ? cmsAdvantages.slice(0, 4)
    : [...cmsAdvantages, ...fallbackAdvantages.slice(cmsAdvantages.length)]

  const advantageIcons = [
    '/images/wdd-icon-reduire.png',
    '/images/wdd-icon-diminuer.png',
    '/images/wdd-icon-profiter.png',
    '/images/wdd-icon-reduire.png',
  ]

  /* ── Services ────────────────────────────────────────────────── */
  const fallbackServiceImages = ['/images/foreuse-wide.jpg', '/images/fond-terre-2.jpg']
  const cmsServiceItems = home?.services?.items ?? []
  const serviceItems = cmsServiceItems.length
    ? cmsServiceItems.map((item, i) => ({
        ...item,
        resolvedImage: item.image
          ? urlFor(item.image)?.url() ?? fallbackServiceImages[i] ?? '/images/foreuse-wide.jpg'
          : fallbackServiceImages[i] ?? '/images/foreuse-wide.jpg',
      }))
    : [
        {
          badge: t('svc_1_badge'),
          title: t('svc_1_title'),
          description: "Des sondes verticales descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. Cette énergie alimente votre pompe à chaleur été comme hiver — sans fossile, sans émission directe.",
          routeKey: 'geo_fermee',
          image: undefined,
          resolvedImage: '/images/foreuse-wide.jpg',
        },
        {
          badge: t('svc_2_badge'),
          title: t('svc_2_title'),
          description: "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Technique idéale pour les grands projets, elle offre des rendements parmi les plus élevés du secteur.",
          routeKey: 'geo_ouverte',
          image: undefined,
          resolvedImage: '/images/fond-terre-2.jpg',
        },
      ]

  /* ── Blog posts ──────────────────────────────────────────────── */
  const blogPosts =
    latestPosts.length > 0
      ? latestPosts.map((post, index) => ({
          _id: post._id,
          slug: post.slug,
          tone: ['bg-wdd-ground/50', 'bg-wdd-grass/40', 'bg-wdd-mud/50'][index] ?? 'bg-wdd-ground/50',
          title: post.title,
          date: post.publishedAt
            ? new Intl.DateTimeFormat(
                locale === 'be-nl' ? 'nl-BE'
                : locale === 'fr-fr' ? 'fr-FR'
                : locale === 'lu-fr' ? 'fr-LU'
                : locale === 'lu-de' ? 'de-LU'
                : 'fr-BE',
                { year: 'numeric', month: 'long' }
              ).format(new Date(post.publishedAt))
            : '',
          excerpt: post.excerpt ?? '',
        }))
      : [
          { tone: 'bg-wdd-ground/50', title: "L'après-forage : Pourquoi le dossier As-Built est essentiel ?",    date: 'Mars 2026',    excerpt: "Une fois que les machines ont quitté votre propriété, le travail n'est pas terminé…" },
          { tone: 'bg-wdd-grass/40',  title: "La Hutte 205 GT, l'excellence du forage géothermique vertical",    date: 'Janvier 2026', excerpt: "La réalisation d'un forage destiné aux sondes exige une rigueur mécanique…" },
          { tone: 'bg-wdd-mud/50',    title: "Indépendance énergétique : Se couper du gaz d'ici 2027",          date: 'Janvier 2026', excerpt: "En 2026, l'indépendance n'est plus un luxe, c'est une stratégie de patrimoine…" },
        ]

  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════════════════════════════
          HERO — full-bleed background, text vertically centred
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] overflow-hidden px-8 md:px-16">
        <Image
          src={home?.hero?.image ? urlFor(home.hero.image)?.url() ?? '/images/wdd-forage-expert.webp' : '/images/wdd-forage-expert.webp'}
          alt="WellDoneDrill forage expert"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wdd-black/85 via-wdd-black/35 to-transparent" />

        <div className="relative z-10 max-w-screen-2xl mx-auto h-full flex items-center">
          <div className="w-full lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              {home?.hero?.title ?? t('hero_title')}
            </h1>
            <p className="text-base font-light text-white leading-relaxed max-w-lg mb-10">
              {home?.hero?.subtitle ?? t('hero_sub')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={getLocalizedPath(loc, 'demarrer')}
                className="inline-block bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
              >
                Démarrer votre projet →
              </Link>
              <Link
                href={getLocalizedPath(loc, 'references')}
                className="inline-block px-7 py-3.5 text-sm font-semibold border-2 border-white/40 text-white hover:border-white transition-colors rounded-sm"
              >
                Voir nos réalisations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — AVANTAGES  (3 outlined rows left, video right)
      ═══════════════════════════════════════════════════════════ */}
      <section id="avantages" className="bg-white py-28 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {home?.advantages?.title
              ? `${home.advantages.title} ${home.advantages.highlight ?? ''}`
              : 'Passez à la géothermie'}
          </h2>
          <p className="text-sm font-light text-black/50 leading-relaxed max-w-xl mb-10">
            {home?.advantages?.introText ?? "La géothermie est la solution de premier choix pour un confort thermique privilégié. Elle s'adapte des petits projets unifamiliaux aux grands réseaux de chaleur."}
          </p>

          {/* Flex row: box left, video right with gap */}
          <div className="flex flex-col lg:flex-row lg:gap-12">

            {/* Argument box — 3 separate bordered rows with 3px gaps */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2">
              {([
                'bg-wdd-yellow',
                'bg-wdd-grass',
                'bg-wdd-mud',
              ] as const).map((iconBg, i) => (
                <div key={advantageItems[i].number ?? i} className="grid grid-cols-[6.5rem_1fr_2fr] bg-wdd-clay rounded-sm overflow-hidden">
                  {/* Icon column — coloured bg per row */}
                  <div className={`relative self-stretch ${iconBg}`}>
                    <Image src={advantageIcons[i]} alt="" fill className="object-contain p-1" />
                  </div>
                  <h3 className="text-sm font-bold leading-snug py-9 pl-5 self-start">{advantageItems[i].title}</h3>
                  <p className="text-sm font-light text-black/45 leading-relaxed py-7 pr-6 self-center">{advantageItems[i].description}</p>
                </div>
              ))}
            </div>

            {/* Video — height matches box via flex stretch, starts at second-half position */}
            <div className="hidden lg:block lg:flex-1 relative overflow-hidden rounded-sm">
              <Image
                src="/images/foreuse-wide.jpg"
                alt="WellDoneDrill forage en action"
                fill
                className="object-cover object-center"
              />
              <video
                src={home?.advantages?.videoUrl ?? '/videos/mrly-comp.mov'}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover scale-125 z-10"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — AUDIENCE 2 × 2
      ═══════════════════════════════════════════════════════════ */}
      <section id="segments" className="relative grid grid-cols-2 grid-rows-2" style={{minHeight: '90vh'}}>

        {/* Top-left — photo particuliers */}
        <div className="relative overflow-hidden min-h-[45vh]">
          <Image
            src={home?.audiences?.particular?.image ? urlFor(home.audiences.particular.image)?.url() ?? '/images/WDD-particuliers.webp' : '/images/WDD-particuliers.webp'}
            alt="Solutions géothermiques pour particuliers"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-wdd-black/25" />
        </div>

        {/* Top-right — particuliers text, forest green */}
        <div className="bg-wdd-grass py-10 md:py-14 pl-8 md:pl-16 pr-10 md:pr-14 flex flex-col justify-center">
          <div className="text-xs font-light tracking-widest text-white/55 uppercase mb-3">
            {home?.audiences?.particular?.eyebrow ?? 'Pour les particuliers'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {home?.audiences?.particular?.title ?? "Profitez d'un confort optimal"}
          </h3>
          <p className="text-sm font-light text-white/65 leading-relaxed mb-8">
            {home?.audiences?.particular?.description ?? 'Géothermie fermée pour votre maison. Confort constant, investissement rentabilisé en 7 à 10 ans.'}
          </p>
          <Link
            href={getLocalizedPath(loc, 'particuliers')}
            className="inline-block bg-white text-wdd-black px-6 py-3.5 text-sm font-bold hover:bg-wdd-yellow transition-colors self-start rounded-sm"
          >
            {home?.audiences?.particular?.buttonLabel ?? "Calculer mes économies"} →
          </Link>
        </div>

        {/* Bottom-left — pro text, dark */}
        <div className="bg-wdd-black py-10 md:py-14 pl-8 md:pl-[max(4rem,calc(50vw_-_48rem))] pr-10 md:pr-14 flex flex-col justify-center">
          <div className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase mb-3">
            {home?.audiences?.professional?.eyebrow ?? 'Pour les entreprises'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {home?.audiences?.professional?.title ?? 'Solutions sur mesure grandes installations'}
          </h3>
          <p className="text-sm font-light text-white/50 leading-relaxed mb-8">
            {home?.audiences?.professional?.description ?? 'Bâtiments tertiaires, industries, institutions. Offre détaillée sous 48h.'}
          </p>
          <Link
            href={getLocalizedPath(loc, 'pro')}
            className="inline-block bg-wdd-yellow text-wdd-black px-6 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors self-start rounded-sm"
          >
            {home?.audiences?.professional?.buttonLabel ?? "Intégrer la géothermie"} →
          </Link>
        </div>

        {/* Bottom-right — photo entreprises */}
        <div className="relative overflow-hidden min-h-[45vh]">
          <Image
            src={home?.audiences?.professional?.image ? urlFor(home.audiences.professional.image)?.url() ?? '/images/wdd-entreprises.webp' : '/images/wdd-entreprises.webp'}
            alt="Solutions géothermiques pour entreprises"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-wdd-black/25" />
        </div>

        {/* WDD logo centered — white */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <Image
            src="/images/wdd_logo_icon_jaune.svg"
            alt="WDD"
            width={52}
            height={52}
            className="brightness-0 invert"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — MAP + RÉALISATIONS (interactive)
      ═══════════════════════════════════════════════════════════ */}
      <HomeMapSection locale={loc} chantiers={chantiers} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — GÉOTHERMIE  (clay background, two framed cards)
      ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">

          {/* Intro — stacked */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold leading-tight mb-5">
              La géothermie,{' '}<span className="text-wdd-mud">l&apos;énergie du sol</span>
            </h2>
            <p className="text-sm font-light text-wdd-black/55 leading-relaxed max-w-2xl">
              La géothermie exploite la chaleur naturelle et stable de la terre pour chauffer et rafraîchir vos bâtiments.
              Deux techniques complémentaires s&apos;adaptent à chaque projet — selon la géologie, la surface disponible et l&apos;échelle des besoins.
            </p>
          </div>

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Card — Géothermie fermée */}
            <div className="flex flex-col group bg-white rounded-sm overflow-hidden">
              <div className="relative h-72 overflow-hidden shrink-0">
                <Image
                  src={serviceItems[0].resolvedImage}
                  alt="Géothermie fermée — sondes verticales"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <IconFermee className="mb-6" />
                <h3 className="text-xl font-bold mb-3 leading-snug">
                  Géothermie fermée
                </h3>
                <p className="text-sm font-light text-black/55 leading-relaxed mb-8 flex-1">
                  {serviceItems[0].description ?? "Des sondes descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. Idéal pour les maisons et bâtiments sans nappe phréatique requise."}
                </p>
                <Link
                  href={getLocalizedPath(loc, (serviceItems[0].routeKey ?? 'geo_fermee') as RouteKey)}
                  className="inline-flex items-center gap-2 text-sm font-bold bg-wdd-black text-white px-5 py-2.5 self-start hover:bg-wdd-black/80 transition-colors rounded-sm"
                >
                  Découvrir la géothermie fermée <span>→</span>
                </Link>
              </div>
            </div>

            {/* Card — Géothermie ouverte */}
            <div className="flex flex-col group bg-white rounded-sm overflow-hidden">
              <div className="relative h-72 overflow-hidden shrink-0">
                <Image
                  src={serviceItems[1]?.resolvedImage ?? '/images/pexels-peter-holmelin.jpg'}
                  alt="Géothermie ouverte — nappe phréatique"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <IconOuverte className="mb-6" />
                <h3 className="text-xl font-bold mb-3 leading-snug">
                  Géothermie ouverte
                </h3>
                <p className="text-sm font-light text-black/55 leading-relaxed mb-8 flex-1">
                  {serviceItems[1].description ?? "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Technique idéale pour les grands projets, avec les meilleurs rendements du secteur."}
                </p>
                <Link
                  href={getLocalizedPath(loc, (serviceItems[1].routeKey ?? 'geo_ouverte') as RouteKey)}
                  className="inline-flex items-center gap-2 text-sm font-bold bg-wdd-black text-white px-5 py-2.5 self-start hover:bg-wdd-black/80 transition-colors rounded-sm"
                >
                  Découvrir la géothermie ouverte <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — CONTACTER
          Row 1: CTA left + image right (image scoped to this row)
          Row 2: stats bar full-width on black, image cut above it
      ═══════════════════════════════════════════════════════════ */}
      {(() => {
        const ctaTitle = home?.contactCta?.title ?? globalSettings?.ctaTitle ?? 'Votre projet commence ici.'
        const ctaSubtitle = home?.contactCta?.subtitle ?? globalSettings?.ctaBody ?? "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement."
        const ctaButtonLabel = home?.contactCta?.buttonLabel ?? globalSettings?.ctaButtonLabel ?? 'Démarrer votre projet →'
        const ctaPhone = home?.contactCta?.phone ?? globalSettings?.phone ?? '+32 478 75 36 79'
        const ctaImageSrc = home?.contactCta?.image
          ? urlFor(home.contactCta.image)?.url() ?? '/images/team.jpg'
          : globalSettings?.ctaImage
            ? urlFor(globalSettings.ctaImage)?.url() ?? '/images/team.jpg'
            : '/images/team.jpg'
        const stat1Value = home?.contactCta?.stat1Value ?? globalSettings?.stat1Value ?? 'Gratuit'
        const stat1Label = home?.contactCta?.stat1Label ?? globalSettings?.stat1Label ?? 'Étude de faisabilité'
        const stat2Value = home?.contactCta?.stat2Value ?? globalSettings?.stat2Value ?? '48h'
        const stat2Label = home?.contactCta?.stat2Label ?? globalSettings?.stat2Label ?? 'Délai de réponse'
        return (
          <section className="bg-wdd-black overflow-hidden">

            {/* Row 1 — flex split at exactly 50 % viewport */}
            <div className="flex flex-col lg:flex-row">
              {/* Left — content, left edge tracks page margin */}
              <div className="w-full lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 lg:pr-20 pt-24 pb-16 flex flex-col relative z-10">
                <h2 className="text-3xl font-bold leading-tight mb-5 text-white">
                  {ctaTitle}
                </h2>
                <p className="text-base font-light leading-8 mb-10 text-white/55 whitespace-pre-line">
                  {ctaSubtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={getLocalizedPath(loc, 'demarrer')}
                    className="self-start px-6 py-3.5 text-sm font-bold border-2 bg-wdd-yellow text-wdd-black border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
                  >
                    {ctaButtonLabel}
                  </Link>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-light text-white/40">ou appelez-nous</span>
                    <a href={`tel:${ctaPhone.replace(/\s/g, '')}`} className="text-sm font-bold text-white hover:text-wdd-yellow transition-colors">
                      {ctaPhone}
                    </a>
                  </div>
                </div>
              </div>
              {/* Right — image fills the other 50 % */}
              <div className="hidden lg:block lg:w-1/2 relative overflow-hidden rounded-sm min-h-[400px]">
                <Image
                  src={ctaImageSrc}
                  alt="Équipe WellDoneDrill"
                  fill
                  className="object-cover object-center scale-[1.08]"
                />
              </div>
            </div>

            {/* Row 2 — stats, same 50/50 split so second stat starts at midpoint */}
            <div className="flex flex-col lg:flex-row border-t border-white/10">
              <div className="w-full lg:w-1/2 pl-8 md:pl-[max(4rem,calc(50vw-48rem))] pr-8 py-10">
                <div className="text-3xl font-bold text-wdd-yellow">{stat1Value}</div>
                <div className="text-xs font-light mt-1 text-white/40">{stat1Label}</div>
              </div>
              <div className="w-full lg:w-1/2 pl-8 py-10 border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="text-3xl font-bold text-wdd-yellow">{stat2Value}</div>
                <div className="text-xs font-light mt-1 text-white/40">{stat2Label}</div>
              </div>
            </div>

          </section>
        )
      })()}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ═══════════════════════════════════════════════════════════ */}
      <HomeFaqSection locale={loc} faqs={home?.faqs} />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — BLOG
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white min-h-[60vh] flex flex-col justify-center py-14 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-4xl font-bold">
              {home?.blog?.title ?? 'Nos dernières actus'}{' '}
              <span className="text-wdd-mud">{home?.blog?.highlight ?? 'sur la géothermie'}</span>
            </h2>
            <Link
              href={getLocalizedPath(loc, 'blog')}
              className="text-sm font-light text-black/50 border-b border-black/20 pb-0.5 hover:text-wdd-black hover:border-wdd-black transition-colors shrink-0 ml-8"
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {blogPosts.map((post) => (
              <div key={'_id' in post ? post._id : post.title} className="group">
                <Link href={'slug' in post && post.slug ? `/${locale}/blog/${post.slug}` : getLocalizedPath(loc, 'blog')} className="block">
                  <div className={'h-48 flex items-center justify-center rounded-sm ' + (post.tone ?? 'bg-wdd-ground/50')}>
                    <span className="text-xs font-light text-white/30 uppercase tracking-wider">Photo article</span>
                  </div>
                  <div className="pt-5 pb-6">
                    <div className="text-xs font-light text-wdd-ground tracking-wider uppercase mb-2">{post.date}</div>
                    <h3 className="text-sm font-semibold mb-2 leading-snug group-hover:text-wdd-mud transition-colors">{post.title}</h3>
                    <p className="text-xs font-light text-black/50 leading-relaxed">{post.excerpt}</p>
                    <span className="text-xs font-bold mt-3 block">{home?.blog?.readMoreLabel ?? t('blog_read')} +</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

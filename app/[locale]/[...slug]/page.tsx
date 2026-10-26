import type {Metadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import Link from 'next/link'
import {findRouteKeyBySlug, getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import {getSeoDefaults} from '@/src/i18n/seo'
import {buildAlternates, buildCanonical, BASE_URL} from '@/src/lib/seoAlternates'
import {getSitePage} from '@/src/lib/sitePage'
import EditorialPage from '../components/EditorialPage'
import {getGeoPage} from '@/src/lib/geoPage'
import GeoPage from '../components/GeoPage'
import {getPacPage} from '@/src/lib/pacPage'
import PacPage from '../components/PacPage'
import {getParticuliersPage} from '@/src/lib/particuliersPage'
import ParticuliersPage from '../components/ParticuliersPage'
import {getProPage} from '@/src/lib/proPage'
import ProPage from '../components/ProPage'
import ProLandingPage from '../components/ProLandingPage'
import GeoLandingPage from '../components/GeoLandingPage'
import ReferencesPage from '../components/ReferencesPage'
import ProvinceReferencesPage from '../components/ProvinceReferencesPage'
import ChantierPage from '../components/ChantierPage'
import AProposPage from '../components/AProposPage'
import DemarrerPage from '../components/DemarrerPage'
import {getChantiers, getChantierBySlug, findProvinceBySlug} from '@/src/lib/referencesPage'
import {getAProposPage} from '@/src/lib/aProposPage'
import {getDemarrerPage} from '@/src/lib/demarrerPage'
import {getGlobalSettings} from '@/src/lib/globalSettings'
import {routeMap} from '@/src/i18n/routes'
import {getBlogPostByLegacyPath} from '@/src/lib/blog'
import {LEGACY_BLOG_FALLBACK} from '@/src/seo/legacyRedirects'
import BlogArticle, {blogPostMetadata} from '../components/BlogArticle'

type PageProps = {
  params: Promise<{
    locale: AppLocale
    slug: string[]
  }>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug} = await params
  const slugPath = slug.join('/')
  const routeKey = findRouteKeyBySlug(locale, slugPath) ?? ''

  // Blog articles restored from the old WordPress site, at their original URL
  if (!routeKey && slug.length === 1) {
    const post = await getBlogPostByLegacyPath(locale, `/${locale}/${slugPath}`).catch(() => null)
    if (post) return blogPostMetadata(post, `${BASE_URL}/${locale}/${slugPath}`)
  }

  const defaults = getSeoDefaults(locale, routeKey)

  let cmsTitle: string | undefined
  let cmsDesc: string | undefined
  // false when the page will render the <ComingSoon> placeholder — keep those
  // thin pages out of Google's index until the CMS content exists.
  let hasContent = true

  try {
    if (routeKey === 'geo_fermee' || routeKey === 'geo_ouverte') {
      const p = await getGeoPage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
      hasContent = !!p
    } else if (routeKey === 'pac') {
      const p = await getPacPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
      hasContent = !!p
    } else if (routeKey === 'particuliers') {
      const p = await getParticuliersPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'pro_chauffagistes' || routeKey === 'pro_architectes' || routeKey === 'pro_entrepreneurs') {
      const p = await getProPage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'a_propos') {
      const p = await getAProposPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'contact') {
      const p = await getDemarrerPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'references') {
      // no CMS doc for the list page — use defaults
    } else {
      // sitePage (mentions_legales, politique_confidentialite, etc.)
      const p = await getSitePage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
      // geo / pro are hardcoded landing pages, not sitePage docs
      if (routeKey !== 'geo' && routeKey !== 'pro') hasContent = !!p
    }

    // Province reference pages + individual chantier pages: /references/[slug]
    const referencesBase = routeMap[locale]?.references
    if (referencesBase && slugPath.startsWith(referencesBase + '/')) {
      hasContent = true
      const subSlug = slugPath.slice(referencesBase.length + 1)
      const {getChantierBySlug, findProvinceBySlug, getProvinceName} = await import('@/src/lib/referencesPage')
      const province = findProvinceBySlug(subSlug)
      if (province) {
        // Province landing pages — target "géothermie <province>" / "forage géothermique <province>"
        const name = getProvinceName(province, locale)
        if (locale === 'be-nl') {
          cmsTitle = `Geothermie ${name} — Geothermische boring | WellDoneDrill`
          cmsDesc = `Geothermische boorprojecten in ${name}. WellDoneDrill boort uw sondes: gratis studie, vergunning en installatie. Ontdek onze realisaties in ${name}.`
        } else if (locale === 'lu-de') {
          cmsTitle = `Geothermie ${name} — Erdwärmebohrung | WellDoneDrill`
          cmsDesc = `Geothermische Bohrprojekte in ${name}. WellDoneDrill bohrt Ihre Sonden: kostenlose Studie, Genehmigung und Installation. Entdecken Sie unsere Projekte.`
        } else if (locale.endsWith('-en')) {
          cmsTitle = `Geothermal energy ${name} — Geothermal drilling | WellDoneDrill`
          cmsDesc = `Geothermal drilling projects in ${name}. WellDoneDrill drills your boreholes: free study, permit and installation. Discover our projects in ${name}.`
        } else {
          const prep = province.prepFr.endsWith("'") ? province.prepFr + name : `${province.prepFr} ${name}`
          cmsTitle = `Géothermie ${name} — Forage géothermique | WellDoneDrill`
          cmsDesc = `Réalisations de forage géothermique ${prep}. WellDoneDrill fore vos sondes géothermiques : étude gratuite, permis et installation. Découvrez nos chantiers.`
        }
      } else {
        const chantier = await getChantierBySlug(subSlug, locale)
        if (chantier) {
          cmsTitle = chantier.seoTitle || chantier.title || undefined
          cmsDesc = chantier.seoDescription || chantier.description || undefined
        }
      }
    }
  } catch {}

  const title = cmsTitle ?? defaults.title
  const description = cmsDesc ?? defaults.description

  // Canonical + hreflang
  let alternates: Record<string, unknown> = {}
  const rk = routeKey as import('@/src/i18n/routes').RouteKey | null
  if (rk && rk !== 'home' && rk !== 'blog') {
    try {
      const alt = buildAlternates(locale, rk)
      alternates = { canonical: alt.canonical, languages: alt.languages }
    } catch {}
  } else {
    // Province, chantier, or other sub-pages — canonical only
    alternates = buildCanonical(locale, slugPath)
  }

  return {
    title,
    description,
    alternates,
    openGraph: { title, description },
    ...(hasContent ? {} : { robots: { index: false, follow: true } }),
  }
}

function ComingSoon({locale, routeKey}: {locale: AppLocale; routeKey: string}) {
  const isEn = locale.endsWith('-en')
  const t = isEn
    ? {
        eyebrow: 'Page in progress',
        titlePre: 'This page is coming ',
        titleHi: 'soon',
        body: 'The content of this page is being prepared in our CMS. Check back soon or contact us directly.',
        cta: 'Request a quote',
        back: 'Back to home',
      }
    : {
        eyebrow: 'Page en cours',
        titlePre: 'Cette page arrive ',
        titleHi: 'bientôt',
        body: 'Le contenu de cette page est en cours de préparation dans notre CMS. Revenez bientôt ou contactez-nous directement.',
        cta: 'Demandez un devis',
        back: "Retour à l'accueil",
      }
  return (
    <div className="bg-wdd-clay min-h-screen pt-32 px-16 flex flex-col justify-center">
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">{t.eyebrow}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-wdd-black">
          {t.titlePre}<span className="text-wdd-mud">{t.titleHi}</span>
        </h1>
        <p className="text-sm font-light text-wdd-black/60 leading-relaxed mb-8">
          {t.body}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={getLocalizedPath(locale, 'contact')}
            className="bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
          >
            {t.cta}
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm font-light text-wdd-black/55 border-b border-wdd-black/25 hover:text-wdd-black transition-colors pb-0.5"
          >
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function LocalizedCatchAllPage({params}: PageProps) {
  const {locale, slug} = await params
  const slugPath = slug.join('/')
  const routeKey = findRouteKeyBySlug(locale, slugPath)

  // Province reference pages: /[locale]/references/[province-slug]
  // Must run before the notFound guard since slugPath won't match any routeKey
  const referencesBase = routeMap[locale].references
  if (slugPath.startsWith(referencesBase + '/')) {
    const subSlug = slugPath.slice(referencesBase.length + 1)
    // Province page first
    const province = findProvinceBySlug(subSlug)
    if (province) {
      const chantiers = await getChantiers(locale)
      return <ProvinceReferencesPage locale={locale} province={province} chantiers={chantiers} />
    }
    // Individual project page
    const chantier = await getChantierBySlug(subSlug, locale)
    if (chantier) {
      return <ChantierPage locale={locale} chantier={chantier} />
    }
  }

  if (!routeKey && slug.length === 1) {
    const post = await getBlogPostByLegacyPath(locale, `/${locale}/${slugPath}`).catch(() => null)
    if (post) return <BlogArticle locale={locale} post={post} />
    const fallback = locale === 'be-fr' ? LEGACY_BLOG_FALLBACK[slugPath] : undefined
    if (fallback) permanentRedirect(fallback)
  }

  if (!routeKey || routeKey === 'home' || routeKey === 'blog') {
    notFound()
  }

  if (routeKey === 'contact') {
    const demarrerData = await getDemarrerPage(locale).catch(() => null)
    return <DemarrerPage locale={locale} page={demarrerData} />
  }

  if (routeKey === 'geo') {
    const globalSettings = await getGlobalSettings().catch(() => null)
    return <GeoLandingPage locale={locale} settings={globalSettings} />
  }

  if (routeKey === 'pro') {
    return <ProLandingPage locale={locale} />
  }

  if (routeKey === 'references') {
    const chantiers = await getChantiers(locale)
    return <ReferencesPage locale={locale} chantiers={chantiers} />
  }

  if (routeKey === 'geo_fermee' || routeKey === 'geo_ouverte') {
    try {
      const page = await getGeoPage(locale, routeKey)
      if (page) return <GeoPage page={page} locale={locale} />
    } catch {}
    return <ComingSoon locale={locale} routeKey={routeKey} />
  }

  if (routeKey === 'pac') {
    try {
      const page = await getPacPage(locale)
      if (page) return <PacPage page={page} locale={locale} />
    } catch {}
    return <ComingSoon locale={locale} routeKey={routeKey} />
  }

  if (routeKey === 'particuliers') {
    const [chantiers, globalSettings] = await Promise.all([getChantiers(locale), getGlobalSettings().catch(() => null)])
    try {
      const page = await getParticuliersPage(locale)
      const data = page ?? {_id: 'default', locale}
      return <ParticuliersPage page={data} locale={locale} chantiers={chantiers} settings={globalSettings} />
    } catch {
      return <ParticuliersPage page={{_id: 'default', locale}} locale={locale} chantiers={chantiers} settings={globalSettings} />
    }
  }

  if (
    routeKey === 'pro_chauffagistes' ||
    routeKey === 'pro_architectes' ||
    routeKey === 'pro_entrepreneurs'
  ) {
    const [chantiers, globalSettings] = await Promise.all([getChantiers(locale), getGlobalSettings().catch(() => null)])
    try {
      const page = await getProPage(locale, routeKey)
      const data = page ?? {_id: 'default', locale, routeKey}
      return <ProPage page={data} locale={locale} chantiers={chantiers} settings={globalSettings} />
    } catch {
      return <ProPage page={{_id: 'default', locale, routeKey}} locale={locale} chantiers={chantiers} settings={globalSettings} />
    }
  }

  if (routeKey === 'a_propos') {
    const [aProposData, globalSettings] = await Promise.all([
      getAProposPage(locale).catch(() => null),
      getGlobalSettings().catch(() => null),
    ])
    return <AProposPage locale={locale} page={aProposData} settings={globalSettings} />
  }

  try {
    const page = await getSitePage(locale, routeKey)
    if (page) return <EditorialPage page={page} locale={locale} />
  } catch {}

  return <ComingSoon locale={locale} routeKey={routeKey} />
}

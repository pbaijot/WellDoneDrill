import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {findRouteKeyBySlug, getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import {getSeoDefaults} from '@/src/i18n/seo'
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
  const defaults = getSeoDefaults(locale, routeKey)

  let cmsTitle: string | undefined
  let cmsDesc: string | undefined

  try {
    if (routeKey === 'geo_fermee' || routeKey === 'geo_ouverte') {
      const p = await getGeoPage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'pac') {
      const p = await getPacPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'particuliers') {
      const p = await getParticuliersPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'pro_chauffagistes' || routeKey === 'pro_architectes' || routeKey === 'pro_entrepreneurs') {
      const p = await getProPage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'a_propos') {
      const p = await getAProposPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'demarrer') {
      const p = await getDemarrerPage(locale)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    } else if (routeKey === 'references') {
      // no CMS doc for the list page — use defaults
    } else {
      // sitePage (mentions_legales, politique_confidentialite, etc.)
      const p = await getSitePage(locale, routeKey)
      cmsTitle = p?.seoTitle || undefined; cmsDesc = p?.seoDescription || undefined
    }

    // Individual chantier pages: /references/[slug]
    const referencesBase = routeMap[locale]?.references
    if (referencesBase && slugPath.startsWith(referencesBase + '/')) {
      const subSlug = slugPath.slice(referencesBase.length + 1)
      const {getChantierBySlug} = await import('@/src/lib/referencesPage')
      const chantier = await getChantierBySlug(subSlug)
      if (chantier) {
        cmsTitle = chantier.seoTitle || chantier.title || undefined
        cmsDesc = chantier.seoDescription || chantier.description || undefined
      }
    }
  } catch {}

  const title = cmsTitle ?? defaults.title
  const description = cmsDesc ?? defaults.description
  return { title, description, openGraph: { title, description } }
}

function ComingSoon({locale, routeKey}: {locale: AppLocale; routeKey: string}) {
  return (
    <div className="bg-wdd-clay min-h-screen pt-32 px-16 flex flex-col justify-center">
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Page en cours</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-wdd-black">
          Cette page arrive <span className="text-wdd-mud">bientôt</span>
        </h1>
        <p className="text-sm font-light text-wdd-black/60 leading-relaxed mb-8">
          Le contenu de cette page est en cours de préparation dans notre CMS.
          Revenez bientôt ou contactez-nous directement.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={getLocalizedPath(locale, 'demarrer')}
            className="bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
          >
            Demandez un devis
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm font-light text-wdd-black/55 border-b border-wdd-black/25 hover:text-wdd-black transition-colors pb-0.5"
          >
            Retour à l'accueil
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
    const chantier = await getChantierBySlug(subSlug)
    if (chantier) {
      return <ChantierPage locale={locale} chantier={chantier} />
    }
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

  if (routeKey === 'demarrer') {
    const demarrerData = await getDemarrerPage(locale).catch(() => null)
    return <DemarrerPage locale={locale} page={demarrerData} />
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

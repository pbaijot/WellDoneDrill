import {notFound} from 'next/navigation'
import Link from 'next/link'
import {findRouteKeyBySlug, getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
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
import ReferencesPage from '../components/ReferencesPage'
import ProvinceReferencesPage from '../components/ProvinceReferencesPage'
import {getChantiers, findProvinceBySlug} from '@/src/lib/referencesPage'
import {routeMap} from '@/src/i18n/routes'

type PageProps = {
  params: Promise<{
    locale: AppLocale
    slug: string[]
  }>
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
            href={getLocalizedPath(locale, 'devis')}
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
    const provinceSlug = slugPath.slice(referencesBase.length + 1)
    const province = findProvinceBySlug(provinceSlug)
    if (province) {
      const chantiers = await getChantiers()
      return <ProvinceReferencesPage locale={locale} province={province} chantiers={chantiers} />
    }
  }

  if (!routeKey || routeKey === 'home' || routeKey === 'blog') {
    notFound()
  }

  if (routeKey === 'references') {
    const chantiers = await getChantiers()
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
    const chantiers = await getChantiers()
    try {
      const page = await getParticuliersPage(locale)
      const data = page ?? {_id: 'default', locale}
      return <ParticuliersPage page={data} locale={locale} chantiers={chantiers} />
    } catch {
      return <ParticuliersPage page={{_id: 'default', locale}} locale={locale} chantiers={chantiers} />
    }
  }

  if (
    routeKey === 'pro_chauffagistes' ||
    routeKey === 'pro_architectes' ||
    routeKey === 'pro_entrepreneurs'
  ) {
    try {
      const page = await getProPage(locale, routeKey)
      if (page) return <ProPage page={page} locale={locale} />
    } catch {}
    return <ComingSoon locale={locale} routeKey={routeKey} />
  }

  try {
    const page = await getSitePage(locale, routeKey)
    if (page) return <EditorialPage page={page} locale={locale} />
  } catch {}

  return <ComingSoon locale={locale} routeKey={routeKey} />
}

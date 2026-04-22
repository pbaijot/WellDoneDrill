import {notFound} from 'next/navigation'
import {findRouteKeyBySlug, type AppLocale} from '@/src/i18n/routes'
import {getSitePage} from '@/src/lib/sitePage'
import EditorialPage from '../components/EditorialPage'
import {getGeoPage} from '@/src/lib/geoPage'
import GeoPage from '../components/GeoPage'

type PageProps = {
  params: Promise<{
    locale: AppLocale
    slug: string[]
  }>
}

export default async function LocalizedCatchAllPage({params}: PageProps) {
  const {locale, slug} = await params
  const slugPath = slug.join('/')

  const routeKey = findRouteKeyBySlug(locale, slugPath)

  if (!routeKey || routeKey === 'home' || routeKey === 'blog') {
    notFound()
  }

  if (routeKey === 'geo_fermee' || routeKey === 'geo_ouverte') {
    const geoPage = await getGeoPage(locale, routeKey)
    if (!geoPage) notFound()
    return <GeoPage page={geoPage} locale={locale} />
  }

  const page = await getSitePage(locale, routeKey)

  if (!page) {
    notFound()
  }

  return <EditorialPage page={page} locale={locale} />
}

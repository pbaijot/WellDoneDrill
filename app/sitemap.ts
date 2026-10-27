import { MetadataRoute } from 'next'
import { locales, routeMap, type AppLocale, type RouteKey } from '@/src/i18n/routes'
import { localeCountry } from '@/src/i18n/config'
import { sanity } from '@/src/lib/sanity'
import { BELGIUM_PROVINCES, getProvinceSlug } from '@/src/lib/referencesPage'

const BASE_URL = 'https://www.welldonedrill.energy'

// Regenerate hourly so new blog posts / chantiers published in Sanity show up
export const revalidate = 3600

const PRIORITY: Record<RouteKey, number> = {
  home: 1.0,
  contact: 0.8,
  particuliers: 0.8,
  pro: 0.8,
  geo: 0.8,
  geo_fermee: 0.8,
  geo_ouverte: 0.8,
  pac: 0.8,
  references: 0.7,
  blog: 0.7,
  a_propos: 0.6,
  pro_chauffagistes: 0.6,
  pro_architectes: 0.6,
  pro_entrepreneurs: 0.6,
  mentions_legales: 0.2,
  politique_confidentialite: 0.2,
  cookies: 0.2,
}

type Doc = { _type: string; locale: string; slug?: string; legacyPath?: string; routeKey?: string; _updatedAt: string }

// Everything the sitemap needs from Sanity in one request: blog posts,
// chantiers, and which CMS-backed pages actually exist (pages without a
// document render the "coming soon" placeholder and are noindexed).
const SITEMAP_QUERY = `*[_type in ["blogPost", "chantier", "geoPage"]]{
  _type, locale, "slug": slug.current, legacyPath, routeKey, _updatedAt
}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs: Doc[] = await sanity.fetch(SITEMAP_QUERY).catch(() => [])
  const has = (type: string, locale: string, routeKey?: string) =>
    docs.some((d) => d._type === type && d.locale === locale && (!routeKey || d.routeKey === routeKey))

  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of locales) {
    const routes = routeMap[locale]
    for (const [key, slug] of Object.entries(routes) as [RouteKey, string][]) {
      // Skip placeholder pages (no CMS content yet). If Sanity is unreachable
      // (docs empty), keep everything rather than emptying the sitemap.
      if (docs.length && (key === 'geo_fermee' || key === 'geo_ouverte') && !has('geoPage', locale, key)) continue

      const url = slug ? `${BASE_URL}/${locale}/${slug}` : `${BASE_URL}/${locale}`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: key === 'blog' ? 'weekly' : 'monthly',
        priority: PRIORITY[key] ?? 0.5,
      })
    }

    // Province landing pages ("géothermie <province>") — Belgium only
    if (localeCountry[locale] === 'BE') {
      for (const province of BELGIUM_PROVINCES) {
        entries.push({
          url: `${BASE_URL}/${locale}/${routes.references}/${getProvinceSlug(province, locale)}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  }

  for (const d of docs) {
    if (!d.slug || !(locales as readonly string[]).includes(d.locale)) continue
    const locale = d.locale as AppLocale
    if (d._type === 'blogPost') {
      entries.push({
        url: d.legacyPath ? `${BASE_URL}${d.legacyPath}` : `${BASE_URL}/${locale}/${routeMap[locale].blog}/${d.slug}`,
        lastModified: new Date(d._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    } else if (d._type === 'chantier') {
      entries.push({
        url: `${BASE_URL}/${locale}/${routeMap[locale].references}/${d.slug}`,
        lastModified: new Date(d._updatedAt),
        changeFrequency: 'yearly',
        priority: 0.5,
      })
    }
  }

  return entries
}

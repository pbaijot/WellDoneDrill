import { MetadataRoute } from 'next'
import { locales, routeMap, type RouteKey } from '@/src/i18n/routes'

const BASE_URL = 'https://welldonedrill.energy'

const PRIORITY: Record<RouteKey, number> = {
  home: 1.0,
  particuliers: 0.8,
  pro: 0.8,
  geo: 0.8,
  geo_fermee: 0.8,
  geo_ouverte: 0.8,
  pac: 0.8,
  demarrer: 0.8,
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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const routes = routeMap[locale]
    for (const [key, slug] of Object.entries(routes) as [RouteKey, string][]) {
      const url = slug ? `${BASE_URL}/${locale}/${slug}` : `${BASE_URL}/${locale}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: key === 'blog' ? 'weekly' : 'monthly',
        priority: PRIORITY[key] ?? 0.5,
      })
    }
  }

  return entries
}

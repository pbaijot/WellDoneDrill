import { locales, routeMap, type AppLocale, type RouteKey } from '@/src/i18n/routes'

export const BASE_URL = 'https://welldonedrill.energy'

// Internal locale → BCP 47 hreflang tag
export const HREFLANG: Record<AppLocale, string> = {
  'be-fr': 'fr-BE',
  'be-nl': 'nl-BE',
  'fr-fr': 'fr-FR',
  'lu-fr': 'fr-LU',
  'lu-de': 'de-LU',
}

/**
 * Build canonical URL + hreflang alternates for a route-key page.
 * Use this for all pages that map to a RouteKey (home, particuliers, contact, …).
 */
export function buildAlternates(locale: AppLocale, routeKey: RouteKey) {
  const languages: Record<string, string> = {}

  for (const loc of locales) {
    const slug = routeMap[loc][routeKey]
    const url = slug ? `${BASE_URL}/${loc}/${slug}` : `${BASE_URL}/${loc}`
    languages[HREFLANG[loc]] = url
  }

  // x-default always points to the be-fr version
  const defaultSlug = routeMap['be-fr'][routeKey]
  languages['x-default'] = defaultSlug
    ? `${BASE_URL}/be-fr/${defaultSlug}`
    : `${BASE_URL}/be-fr`

  const currentSlug = routeMap[locale][routeKey]
  const canonical = currentSlug
    ? `${BASE_URL}/${locale}/${currentSlug}`
    : `${BASE_URL}/${locale}`

  return { canonical, languages }
}

/**
 * Build canonical + hreflang for a blog article.
 * Blog articles use the same slug across locales under each locale's blog path.
 */
export function buildBlogAlternates(locale: AppLocale, slug: string) {
  const languages: Record<string, string> = {}

  for (const loc of locales) {
    const blogSlug = routeMap[loc]['blog']
    if (blogSlug) {
      languages[HREFLANG[loc]] = `${BASE_URL}/${loc}/${blogSlug}/${slug}`
    }
  }

  const defaultBlogSlug = routeMap['be-fr']['blog']
  languages['x-default'] = `${BASE_URL}/be-fr/${defaultBlogSlug}/${slug}`

  const localeBlogSlug = routeMap[locale]['blog']
  const canonical = `${BASE_URL}/${locale}/${localeBlogSlug}/${slug}`

  return { canonical, languages }
}

/**
 * Build canonical for a sub-page (province refs, chantier) with no cross-locale equivalent.
 */
export function buildCanonical(locale: AppLocale, path: string) {
  return { canonical: `${BASE_URL}/${locale}/${path}` }
}

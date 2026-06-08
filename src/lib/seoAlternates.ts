import { locales, routeMap, type AppLocale, type RouteKey } from '@/src/i18n/routes'

export const BASE_URL = 'https://www.welldonedrill.energy'

// Internal locale → BCP 47 hreflang tag
export const HREFLANG: Record<AppLocale, string> = {
  'be-fr': 'fr-BE',
  'be-nl': 'nl-BE',
  'be-en': 'en-BE',
  'fr-fr': 'fr-FR',
  'fr-en': 'en-FR',
  'lu-fr': 'fr-LU',
  'lu-de': 'de-LU',
  'lu-en': 'en-LU',
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

  const currentSlug = routeMap[locale][routeKey]
  const canonical = currentSlug
    ? `${BASE_URL}/${locale}/${currentSlug}`
    : `${BASE_URL}/${locale}`

  return { canonical, languages }
}

/**
 * Build canonical for a blog article.
 * Blog posts don't exist in all locales, so we only set a self-canonical.
 */
export function buildBlogAlternates(locale: AppLocale, slug: string) {
  const localeBlogSlug = routeMap[locale]['blog']
  const canonical = `${BASE_URL}/${locale}/${localeBlogSlug}/${slug}`
  return { canonical, languages: {} as Record<string, string> }
}

/**
 * Build canonical for a sub-page (province refs, chantier) with no cross-locale equivalent.
 */
export function buildCanonical(locale: AppLocale, path: string) {
  return { canonical: `${BASE_URL}/${locale}/${path}` }
}

export const locales = ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'be-fr'

export const PHONE_BY_LOCALE: Record<AppLocale, string> = {
  'be-fr': '+32 478 75 36 79',
  'be-nl': '+32 476 82 50 17',
  'fr-fr': '+32 478 75 36 79',
  'lu-fr': '+352 621 771 246',
  'lu-de': '+352 621 771 246',
}

export type RouteKey =
  | 'home'
  | 'demarrer'
  | 'contact'
  | 'references'
  | 'pac'
  | 'geo'
  | 'geo_fermee'
  | 'geo_ouverte'
  | 'particuliers'
  | 'pro'
  | 'pro_chauffagistes'
  | 'pro_architectes'
  | 'pro_entrepreneurs'
  | 'blog'
  | 'a_propos'
  | 'mentions_legales'
  | 'politique_confidentialite'
  | 'cookies'

type RouteMap = Record<AppLocale, Record<RouteKey, string>>

export const routeMap: RouteMap = {
  'be-fr': {
    home: '',
    demarrer: 'demarrer',
    contact: 'contact',
    references: 'realisations-geothermie-belgique',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo: 'geothermie',
    geo_fermee: 'geothermie/geothermie-fermee',
    geo_ouverte: 'geothermie/geothermie-ouverte',

    particuliers: 'particuliers',

    pro: 'pour-les-professionnels',
    pro_chauffagistes: 'pro/installateurs-hvac',
    pro_architectes: 'pro/architectes-bureaux-etudes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'fr-fr': {
    home: '',
    demarrer: 'demarrer',
    contact: 'contact',
    references: 'references',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo: 'geothermie',
    geo_fermee: 'geothermie/geothermie-fermee',
    geo_ouverte: 'geothermie/geothermie-ouverte',

    particuliers: 'particuliers',

    pro: 'pour-les-professionnels',
    pro_chauffagistes: 'pro/installateurs-hvac',
    pro_architectes: 'pro/architectes-bureaux-etudes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'be-nl': {
    home: '',
    demarrer: 'starten',
    contact: 'contact',
    references: 'referenties',
    blog: 'blog',
    a_propos: 'over-ons',
    mentions_legales: 'juridische-informatie',
    politique_confidentialite: 'privacybeleid',
    cookies: 'cookies',

    pac: 'warmtepompen',

    geo: 'geothermische-energie',
    geo_fermee: 'geothermische-energie/gesloten-geothermie',
    geo_ouverte: 'geothermische-energie/open-geothermische-energie',

    particuliers: 'particulieren',

    pro: 'sectoren',
    pro_chauffagistes: 'professionals/hvac-installateurs',
    pro_architectes: 'professionals/architecten-studiebureaus',
    pro_entrepreneurs: 'professionals/aannemers',
  },

  'lu-fr': {
    home: '',
    demarrer: 'demarrer',
    contact: 'contact',
    references: 'references',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo: 'geothermie',
    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',

    particuliers: 'particuliers',

    pro: 'pour-les-professionnels',
    pro_chauffagistes: 'pro/installateurs-hvac',
    pro_architectes: 'pro/architectes-bureaux-etudes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'lu-de': {
    home: '',
    demarrer: 'starten',
    contact: 'kontakt',
    references: 'referenzen',
    blog: 'blog',
    a_propos: 'uber-uns',
    mentions_legales: 'impressum',
    politique_confidentialite: 'datenschutz',
    cookies: 'cookies',

    pac: 'waermepumpen',

    geo: 'geothermie',
    geo_fermee: 'geothermie/geschlossen',
    geo_ouverte: 'geothermie/offen',

    particuliers: 'privatkunden',

    pro: 'fur-profis',
    pro_chauffagistes: 'profis/hvac-installateure',
    pro_architectes: 'profis/architekten-planungsbueros',
    pro_entrepreneurs: 'profis/unternehmer',
  },
}

export function getLocalizedPath(locale: AppLocale, routeKey: RouteKey): string {
  const slug = routeMap[locale][routeKey]
  return slug ? `/${locale}/${slug}` : `/${locale}`
}

export function getPathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length === 0) return ''

  const maybeLocale = parts[0] as AppLocale
  if (locales.includes(maybeLocale)) {
    return parts.slice(1).join('/')
  }

  return parts.join('/')
}

export function findRouteKeyByPath(locale: AppLocale, pathname: string): RouteKey | null {
  const cleanPath = getPathWithoutLocale(pathname)

  const entries = Object.entries(routeMap[locale]) as [RouteKey, string][]
  const match = entries.find(([, slug]) => slug === cleanPath)

  return match ? match[0] : null
}

export function findRouteKeyBySlug(locale: AppLocale, slug: string): RouteKey | null {
  const entries = Object.entries(routeMap[locale]) as [RouteKey, string][]
  const match = entries.find(([, value]) => value === slug)
  return match ? match[0] : null
}

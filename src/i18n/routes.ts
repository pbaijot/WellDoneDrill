export const locales = ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'be-fr'

export type RouteKey =
  | 'home'
  | 'devis'
  | 'references'
  | 'pac'
  | 'geo_fermee'
  | 'geo_ouverte'
  | 'particuliers'
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
    devis: 'devis',
    references: 'references',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',

    particuliers: 'particuliers',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'fr-fr': {
    home: '',
    devis: 'devis',
    references: 'references',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',

    particuliers: 'particuliers',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'be-nl': {
    home: '',
    devis: 'offerte',
    references: 'referenties',
    blog: 'blog',
    a_propos: 'over-ons',
    mentions_legales: 'wettelijke-vermeldingen',
    politique_confidentialite: 'privacybeleid',
    cookies: 'cookies',

    pac: 'warmtepompen',

    geo_fermee: 'geothermie/gesloten',
    geo_ouverte: 'geothermie/open',

    particuliers: 'particulieren',

    pro_chauffagistes: 'professionals/installateurs',
    pro_architectes: 'professionals/architecten',
    pro_entrepreneurs: 'professionals/aannemers',
  },

  'lu-fr': {
    home: '',
    devis: 'devis',
    references: 'references',
    blog: 'blog',
    a_propos: 'a-propos',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac: 'pompes-a-chaleur',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',

    particuliers: 'particuliers',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
  },

  'lu-de': {
    home: '',
    devis: 'angebot',
    references: 'referenzen',
    blog: 'blog',
    a_propos: 'uber-uns',
    mentions_legales: 'impressum',
    politique_confidentialite: 'datenschutz',
    cookies: 'cookies',

    pac: 'waermepumpen',

    geo_fermee: 'geothermie/geschlossen',
    geo_ouverte: 'geothermie/offen',

    particuliers: 'privatkunden',

    pro_chauffagistes: 'profis/heizungsbauer',
    pro_architectes: 'profis/architekten',
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

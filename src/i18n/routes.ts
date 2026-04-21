export const locales = ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'be-fr'

export type RouteKey =
  | 'home'
  | 'devis'
  | 'references'
  | 'calculateur'
  | 'pac_fonctionnement'
  | 'pac_chauffage'
  | 'pac_climatisation'
  | 'pac_avantages'
  | 'geo_fermee'
  | 'geo_ouverte'
  | 'geo_fonctionnement'
  | 'particuliers_etapes'
  | 'particuliers_installateurs'
  | 'pro_chauffagistes'
  | 'pro_architectes'
  | 'pro_entrepreneurs'
  | 'pro_soumission'
  | 'blog'
  | 'mentions_legales'
  | 'politique_confidentialite'
  | 'cookies'

type RouteMap = Record<AppLocale, Record<RouteKey, string>>

export const routeMap: RouteMap = {
  'be-fr': {
    home: '',
    devis: 'devis',
    references: 'references',
    calculateur: 'calculateur',
    blog: 'blog',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac_fonctionnement: 'pompes-a-chaleur/fonctionnement',
    pac_chauffage: 'pompes-a-chaleur/chauffage',
    pac_climatisation: 'pompes-a-chaleur/climatisation',
    pac_avantages: 'pompes-a-chaleur/avantages',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',
    geo_fonctionnement: 'geothermie/fonctionnement',

    particuliers_etapes: 'particuliers/etapes',
    particuliers_installateurs: 'particuliers/installateurs',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
    pro_soumission: 'pro/soumission',
  },

  'fr-fr': {
    home: '',
    devis: 'devis',
    references: 'references',
    calculateur: 'calculateur',
    blog: 'blog',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac_fonctionnement: 'pompes-a-chaleur/fonctionnement',
    pac_chauffage: 'pompes-a-chaleur/chauffage',
    pac_climatisation: 'pompes-a-chaleur/climatisation',
    pac_avantages: 'pompes-a-chaleur/avantages',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',
    geo_fonctionnement: 'geothermie/fonctionnement',

    particuliers_etapes: 'particuliers/etapes',
    particuliers_installateurs: 'particuliers/installateurs',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
    pro_soumission: 'pro/soumission',
  },

  'be-nl': {
    home: '',
    devis: 'offerte',
    references: 'referenties',
    calculateur: 'calculator',
    blog: 'blog',
    mentions_legales: 'wettelijke-vermeldingen',
    politique_confidentialite: 'privacybeleid',
    cookies: 'cookies',

    pac_fonctionnement: 'warmtepompen/werking',
    pac_chauffage: 'warmtepompen/verwarming',
    pac_climatisation: 'warmtepompen/koeling',
    pac_avantages: 'warmtepompen/voordelen',

    geo_fermee: 'geothermie/gesloten',
    geo_ouverte: 'geothermie/open',
    geo_fonctionnement: 'geothermie/werking',

    particuliers_etapes: 'particulieren/stappen',
    particuliers_installateurs: 'particulieren/installateurs',

    pro_chauffagistes: 'professionals/installateurs',
    pro_architectes: 'professionals/architecten',
    pro_entrepreneurs: 'professionals/aannemers',
    pro_soumission: 'professionals/aanvraag',
  },

  'lu-fr': {
    home: '',
    devis: 'devis',
    references: 'references',
    calculateur: 'calculateur',
    blog: 'blog',
    mentions_legales: 'mentions-legales',
    politique_confidentialite: 'politique-confidentialite',
    cookies: 'cookies',

    pac_fonctionnement: 'pompes-a-chaleur/fonctionnement',
    pac_chauffage: 'pompes-a-chaleur/chauffage',
    pac_climatisation: 'pompes-a-chaleur/climatisation',
    pac_avantages: 'pompes-a-chaleur/avantages',

    geo_fermee: 'geothermie/fermee',
    geo_ouverte: 'geothermie/ouverte',
    geo_fonctionnement: 'geothermie/fonctionnement',

    particuliers_etapes: 'particuliers/etapes',
    particuliers_installateurs: 'particuliers/installateurs',

    pro_chauffagistes: 'pro/chauffagistes',
    pro_architectes: 'pro/architectes',
    pro_entrepreneurs: 'pro/entrepreneurs',
    pro_soumission: 'pro/soumission',
  },

  'lu-de': {
    home: '',
    devis: 'angebot',
    references: 'referenzen',
    calculateur: 'rechner',
    blog: 'blog',
    mentions_legales: 'impressum',
    politique_confidentialite: 'datenschutz',
    cookies: 'cookies',

    pac_fonctionnement: 'waermepumpen/funktionsweise',
    pac_chauffage: 'waermepumpen/heizung',
    pac_climatisation: 'waermepumpen/kuehlung',
    pac_avantages: 'waermepumpen/vorteile',

    geo_fermee: 'geothermie/geschlossen',
    geo_ouverte: 'geothermie/offen',
    geo_fonctionnement: 'geothermie/funktionsweise',

    particuliers_etapes: 'privatkunden/ablauf',
    particuliers_installateurs: 'privatkunden/installateure',

    pro_chauffagistes: 'profis/heizungsbauer',
    pro_architectes: 'profis/architekten',
    pro_entrepreneurs: 'profis/unternehmer',
    pro_soumission: 'profis/anfrage',
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
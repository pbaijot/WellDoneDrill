import {sanity} from './sanity'

export type GeoStep = {
  _key?: string
  title?: string
  body?: string
}

export type GeoFaq = {
  _key?: string
  question?: string
  answer?: string
}

export type GeoStat = {_key?: string; value?: string; label?: string}
export type GeoPanelItem = {_key?: string; label?: string; value?: string; sub?: string}

export type GeoAdvantage = {_key?: string; title?: string; body?: string}

export type GeoPageData = {
  _id: string
  locale: string
  routeKey: 'geo_fermee' | 'geo_ouverte'
  heroLine1?: string
  heroLine2?: string
  heroLine3?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  heroStats?: GeoStat[]
  heroPanelItems?: GeoPanelItem[]
  heroLeftBgImage?: unknown
  heroRightImage?: unknown
  introTitle?: string
  introBody1?: string
  introBody2?: string
  introImage?: unknown
  howTitle?: string
  howSteps?: GeoStep[]
  howIllustration?: unknown
  advantages?: GeoAdvantage[]
  faqTitle?: string
  faqs?: GeoFaq[]
  particularEyebrow?: string
  particularTitle?: string
  particularBody?: string
  particularCta?: string
  particularImage?: unknown
  proEyebrow?: string
  proTitle?: string
  proBody?: string
  proCta?: string
  proImage?: unknown
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "geoPage" && locale == $locale && routeKey == $routeKey][0]{
  _id, locale, routeKey,
  heroLine1, heroLine2, heroLine3, heroSubtitle, heroCtaLabel,
  heroStats, heroPanelItems,
  heroLeftBgImage, heroRightImage,
  introTitle, introBody1, introBody2,
  introImage,
  howTitle, howSteps,
  howIllustration,
  advantages,
  faqTitle, faqs,
  particularEyebrow, particularTitle, particularBody, particularCta,
  particularImage,
  proEyebrow, proTitle, proBody, proCta,
  proImage,
  seoTitle, seoDescription
}
`

export async function getGeoPage(locale: string, routeKey: string): Promise<GeoPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale, routeKey})
}

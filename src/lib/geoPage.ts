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
  introTitle?: string
  introBody1?: string
  introBody2?: string
  howTitle?: string
  howSteps?: GeoStep[]
  faqTitle?: string
  faqs?: GeoFaq[]
  particularEyebrow?: string
  particularTitle?: string
  particularBody?: string
  particularCta?: string
  proEyebrow?: string
  proTitle?: string
  proBody?: string
  proCta?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "geoPage" && locale == $locale && routeKey == $routeKey][0]{
  _id, locale, routeKey,
  heroLine1, heroLine2, heroLine3, heroSubtitle, heroCtaLabel,
  heroStats, heroPanelItems,
  introTitle, introBody1, introBody2,
  howTitle, howSteps,
  faqTitle, faqs,
  particularEyebrow, particularTitle, particularBody, particularCta,
  proEyebrow, proTitle, proBody, proCta,
  seoTitle, seoDescription
}
`

export async function getGeoPage(locale: string, routeKey: string): Promise<GeoPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale, routeKey})
}

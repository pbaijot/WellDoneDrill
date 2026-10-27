import {sanity} from './sanity'

export type GeoFaq = {
  _key?: string
  question?: string
  answer?: string
}

export type GeoAdvantage = {_key?: string; title?: string; body?: string; /** icon key, see ADVANTAGE_ICON_KEYS in GeoPage */ icon?: string}

/** A Sanity image (with its alt) or, for content written in code, a public path. */
export type GeoImage = string | {asset?: unknown; alt?: string; hotspot?: unknown; crop?: unknown}

export type GeoPageData = {
  _id: string
  locale: string
  routeKey: 'geo_fermee' | 'geo_ouverte' | 'pac'
  heroLine1?: string
  heroLine2?: string
  heroLine3?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  heroSecondaryLabel?: string
  heroLeftBgImage?: GeoImage
  heroRightImage?: GeoImage
  introTitle?: string
  introBody1?: string
  introBody2?: string
  introCtaLabel?: string
  introImage?: GeoImage
  howTitle?: string
  howBody?: string
  howCtaLabel?: string
  howIllustration?: GeoImage
  advantagesTitle?: string
  advantagesCtaLabel?: string
  advantages?: GeoAdvantage[]
  faqTitle?: string
  faqSubtitle?: string
  faqCtaLabel?: string
  faqs?: GeoFaq[]
  particularEyebrow?: string
  particularTitle?: string
  particularBody?: string
  particularCta?: string
  particularImage?: GeoImage
  proEyebrow?: string
  proTitle?: string
  proBody?: string
  proCta?: string
  proImage?: GeoImage
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "geoPage" && locale == $locale && routeKey == $routeKey] | order(_id asc)[0]{
  _id, locale, routeKey,
  heroLine1, heroLine2, heroLine3, heroSubtitle, heroCtaLabel, heroSecondaryLabel,
  heroLeftBgImage, heroRightImage,
  introTitle, introBody1, introBody2, introCtaLabel,
  introImage,
  howTitle, howBody, howCtaLabel,
  howIllustration,
  advantagesTitle, advantagesCtaLabel,
  advantages,
  faqTitle, faqSubtitle, faqCtaLabel, faqs,
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

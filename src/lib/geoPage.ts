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

export type GeoPageData = {
  _id: string
  locale: string
  routeKey: 'geo_fermee' | 'geo_ouverte'
  heroLine1?: string
  heroLine2?: string
  heroLine3?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  introTitle?: string
  introBody1?: string
  introBody2?: string
  introCtaLabel?: string
  howTitle?: string
  howIntro?: string
  howSteps?: GeoStep[]
  howCtaLabel?: string
  projectTitle?: string
  projectSteps?: GeoStep[]
  projectCtaLabel?: string
  faqIntroTitle?: string
  faqIntroBody?: string
  faqTitle?: string
  faqs?: GeoFaq[]
  finalCtaTitle?: string
  finalCtaLabel?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "geoPage" && locale == $locale && routeKey == $routeKey][0]{
  _id,
  locale,
  routeKey,
  heroLine1,
  heroLine2,
  heroLine3,
  heroSubtitle,
  heroCtaLabel,
  introTitle,
  introBody1,
  introBody2,
  introCtaLabel,
  howTitle,
  howIntro,
  howSteps,
  howCtaLabel,
  projectTitle,
  projectSteps,
  projectCtaLabel,
  faqIntroTitle,
  faqIntroBody,
  faqTitle,
  faqs,
  finalCtaTitle,
  finalCtaLabel,
  seoTitle,
  seoDescription
}
`

export async function getGeoPage(locale: string, routeKey: string): Promise<GeoPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale, routeKey})
}

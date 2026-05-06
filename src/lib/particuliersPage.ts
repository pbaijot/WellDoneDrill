import {sanity} from './sanity'

export type ParticuliersStat = {_key?: string; value?: string; label?: string}
export type ParticuliersItem = {_key?: string; title?: string; body?: string}
export type ParticuliersFaq = {_key?: string; question?: string; answer?: string}

export type ParticuliersPrime = {
  _key?: string
  region?: string
  title?: string
  body?: string
}

export type ParticuliersPageData = {
  _id: string
  locale: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaDevisLabel?: string
  heroCtaCalculLabel?: string
  stats?: ParticuliersStat[]
  whyTitle?: string
  whyIntro?: string
  whyItems?: ParticuliersItem[]
  problemTitle?: string
  problemBody?: string
  primesTitle?: string
  primesIntro?: string
  primesItems?: ParticuliersPrime[]
  calculTitle?: string
  calculIntro?: string
  etapesTitle?: string
  etapesIntro?: string
  etapes?: ParticuliersItem[]
  installateurTitle?: string
  installateurBody?: string
  faqTitle?: string
  faqs?: ParticuliersFaq[]
  ctaTitle?: string
  ctaLabel?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "particuliersPage" && locale == $locale][0]{
  _id, locale,
  heroTitle, heroSubtitle, heroCtaDevisLabel, heroCtaCalculLabel,
  stats,
  whyTitle, whyIntro, whyItems,
  problemTitle, problemBody,
  primesTitle, primesIntro, primesItems,
  calculTitle, calculIntro,
  etapesTitle, etapesIntro, etapes,
  installateurTitle, installateurBody,
  faqTitle, faqs,
  ctaTitle, ctaLabel,
  seoTitle, seoDescription
}
`

export async function getParticuliersPage(locale: string): Promise<ParticuliersPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

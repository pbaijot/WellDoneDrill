import {sanity} from './sanity'

export type ParticuliersStat = {_key?: string; value?: string; label?: string}
export type ParticuliersItem = {_key?: string; title?: string; body?: string}
export type ParticuliersFaq = {_key?: string; question?: string; answer?: string}
export type ParticuliersPanelItem = {_key?: string; label?: string; value?: string; sub?: string}

export type ParticuliersPageData = {
  _id: string
  locale: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaDevisLabel?: string
  heroCtaCalculLabel?: string
  heroLeftBgImage?: unknown
  heroRightImage?: unknown
  heroPanelItems?: ParticuliersPanelItem[]
  contextImage?: unknown
  contextVideo?: {asset?: {url?: string}}
  stats?: ParticuliersStat[]
  whyTitle?: string
  whyIntro?: string
  whyItems?: ParticuliersItem[]
  problemTitle?: string
  problemBody?: string
  faqTitle?: string
  faqs?: ParticuliersFaq[]
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "particuliersPage" && locale == $locale][0]{
  _id, locale,
  heroTitle, heroSubtitle, heroCtaDevisLabel, heroCtaCalculLabel,
  heroLeftBgImage, heroRightImage, heroPanelItems,
  contextImage, contextVideo { asset-> { url } },
  stats,
  whyTitle, whyIntro, whyItems,
  problemTitle, problemBody,
  faqTitle, faqs,
  seoTitle, seoDescription
}
`

export async function getParticuliersPage(locale: string): Promise<ParticuliersPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

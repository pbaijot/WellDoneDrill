import {sanity} from './sanity'

export type ProItem = {_key?: string; title?: string; body?: string}
export type ProFaq = {_key?: string; question?: string; answer?: string}
export type ProPanelItem = {_key?: string; label?: string; value?: string; sub?: string}
export type ProSchemeNode = {_key?: string; label?: string; sub?: string; stat?: string}

export type ProPageData = {
  _id: string
  locale: string
  routeKey: 'pro_chauffagistes' | 'pro_architectes' | 'pro_entrepreneurs'
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  heroCtaSecondary?: string
  heroRightImage?: unknown
  heroPanelItems?: ProPanelItem[]
  valueTitle?: string
  valueIntro?: string
  contextImage?: unknown
  contextVideo?: {asset?: {url?: string}}
  schemeNodes?: ProSchemeNode[]
  whyTitle?: string
  valueItems?: ProItem[]
  whyCtaLabel?: string
  partnershipTitle?: string
  partnershipIntro?: string
  partnershipSteps?: ProItem[]
  faqTitle?: string
  faqSubtitle?: string
  faqCtaLabel?: string
  faqs?: ProFaq[]
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "proPage" && locale == $locale && routeKey == $routeKey][0]{
  _id, locale, routeKey,
  heroEyebrow, heroTitle, heroSubtitle, heroCtaLabel, heroCtaSecondary,
  heroRightImage, heroPanelItems,
  valueTitle, valueIntro,
  contextImage,
  contextVideo { asset-> { url } },
  schemeNodes,
  whyTitle, valueItems, whyCtaLabel,
  partnershipTitle, partnershipIntro, partnershipSteps,
  faqTitle, faqSubtitle, faqCtaLabel, faqs,
  seoTitle, seoDescription
}
`

export async function getProPage(locale: string, routeKey: string): Promise<ProPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale, routeKey})
}

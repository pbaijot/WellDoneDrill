import {sanity} from './sanity'

export type ProItem = {_key?: string; title?: string; body?: string}
export type ProFaq = {_key?: string; question?: string; answer?: string}

export type ProPageData = {
  _id: string
  locale: string
  routeKey: 'pro_chauffagistes' | 'pro_architectes' | 'pro_entrepreneurs'
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  valueTitle?: string
  valueIntro?: string
  valueItems?: ProItem[]
  partnershipTitle?: string
  partnershipIntro?: string
  partnershipSteps?: ProItem[]
  offerTitle?: string
  offerIntro?: string
  offerItems?: ProItem[]
  submissionTitle?: string
  submissionIntro?: string
  submissionCtaLabel?: string
  faqTitle?: string
  faqs?: ProFaq[]
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "proPage" && locale == $locale && routeKey == $routeKey][0]{
  _id, locale, routeKey,
  heroEyebrow, heroTitle, heroSubtitle, heroCtaLabel,
  valueTitle, valueIntro, valueItems,
  partnershipTitle, partnershipIntro, partnershipSteps,
  offerTitle, offerIntro, offerItems,
  submissionTitle, submissionIntro, submissionCtaLabel,
  faqTitle, faqs,
  seoTitle, seoDescription
}
`

export async function getProPage(locale: string, routeKey: string): Promise<ProPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale, routeKey})
}

import {sanity} from './sanity'

export type PacItem = {_key?: string; title?: string; body?: string}
export type PacFaq = {_key?: string; question?: string; answer?: string}

export type PacPageData = {
  _id: string
  locale: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  fonctTitle?: string
  fonctIntro?: string
  fonctSteps?: PacItem[]
  chauffageTitle?: string
  chauffageIntro?: string
  chauffageItems?: PacItem[]
  climaTitle?: string
  climaIntro?: string
  climaItems?: PacItem[]
  avantagesTitle?: string
  avantagesIntro?: string
  avantagesItems?: PacItem[]
  faqTitle?: string
  faqs?: PacFaq[]
  ctaTitle?: string
  ctaLabel?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "pacPage" && locale == $locale][0]{
  _id, locale,
  heroTitle, heroSubtitle, heroCtaLabel,
  fonctTitle, fonctIntro, fonctSteps,
  chauffageTitle, chauffageIntro, chauffageItems,
  climaTitle, climaIntro, climaItems,
  avantagesTitle, avantagesIntro, avantagesItems,
  faqTitle, faqs,
  ctaTitle, ctaLabel,
  seoTitle, seoDescription
}
`

export async function getPacPage(locale: string): Promise<PacPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

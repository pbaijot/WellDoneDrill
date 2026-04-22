import {sanity} from './sanity'

export type SiteSection = {
  _key?: string
  eyebrow?: string
  title?: string
  body?: string
  items?: string[]
}

export type SiteFaq = {
  _key?: string
  question?: string
  answer?: string
}

export type SitePage = {
  _id: string
  locale: string
  routeKey: string
  title?: string
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  seoTitle?: string
  seoDescription?: string
  sections?: SiteSection[]
  faqTitle?: string
  faqs?: SiteFaq[]
  ctaPretitle?: string
  ctaTitle?: string
  ctaText?: string
  ctaLabel?: string
  ctaRouteKey?: string
}

const pageByRouteQuery = `
*[_type == "sitePage" && locale == $locale && routeKey == $routeKey][0]{
  _id,
  locale,
  routeKey,
  title,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  seoTitle,
  seoDescription,
  sections,
  faqTitle,
  faqs,
  ctaPretitle,
  ctaTitle,
  ctaText,
  ctaLabel,
  ctaRouteKey
}
`

export async function getSitePage(locale: string, routeKey: string): Promise<SitePage | null> {
  if (!sanity) return null
  return sanity.fetch(pageByRouteQuery, {locale, routeKey})
}

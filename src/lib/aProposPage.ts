import {sanity} from './sanity'

export type AProposItem = {_key?: string; title?: string; body?: string}

export type AProposPageData = {
  _id: string
  locale: string
  heroTitle?: string
  heroSubtitle?: string
  heroCtaLabel?: string
  missionTitle?: string
  missionBody1?: string
  missionBody2?: string
  missionBody3?: string
  valuesTitle?: string
  values?: AProposItem[]
  whyTitle?: string
  whyItems?: AProposItem[]
  partnershipTitle?: string
  partnershipBody?: string
  partnershipCta1?: string
  partnershipCta2?: string
  phone?: string
  email?: string
  address?: string
  contactCtaLabel?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "aProposPage" && locale == $locale][0]{
  _id, locale,
  heroTitle, heroSubtitle, heroCtaLabel,
  missionTitle, missionBody1, missionBody2, missionBody3,
  valuesTitle, values,
  whyTitle, whyItems,
  partnershipTitle, partnershipBody, partnershipCta1, partnershipCta2,
  phone, email, address, contactCtaLabel,
  seoTitle, seoDescription
}
`

export async function getAProposPage(locale: string): Promise<AProposPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

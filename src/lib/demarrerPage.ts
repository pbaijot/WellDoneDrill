import {sanity} from './sanity'

export type DemarrerPageData = {
  _id: string
  locale: string
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  formHeading?: string
  phone?: string
  email?: string
  successTitle?: string
  successBody?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "demarrerPage" && locale == $locale][0]{
  _id, locale,
  heroEyebrow, heroTitle, heroSubtitle,
  formHeading, phone, email,
  successTitle, successBody,
  seoTitle, seoDescription
}
`

export async function getDemarrerPage(locale: string): Promise<DemarrerPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

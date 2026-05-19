import {sanity} from './sanity'

export type DemarrerPageData = {
  _id: string
  locale: string
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: unknown
  formHeading?: string
  phone?: string
  email?: string
  successTitle?: string
  successBody?: string
  teamImage?: unknown
  teamCaption?: string
  teamLabel?: string
  seoTitle?: string
  seoDescription?: string
}

const query = `
*[_type == "demarrerPage" && locale == $locale][0]{
  _id, locale,
  heroEyebrow, heroTitle, heroSubtitle,
  heroImage,
  formHeading, phone, email,
  successTitle, successBody,
  teamImage, teamCaption, teamLabel,
  seoTitle, seoDescription
}
`

export async function getDemarrerPage(locale: string): Promise<DemarrerPageData | null> {
  if (!sanity) return null
  return sanity.fetch(query, {locale})
}

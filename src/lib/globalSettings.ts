import {sanity} from './sanity'

export type GlobalSettingsData = {
  phone?: string
  email?: string
  ctaTitle?: string
  ctaBody?: string
  ctaButtonLabel?: string
  ctaImage?: unknown
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
}

const query = `
*[_type == "globalSettings"][0]{
  phone, email,
  ctaTitle, ctaBody, ctaButtonLabel,
  ctaImage,
  stat1Value, stat1Label,
  stat2Value, stat2Label
}
`

export async function getGlobalSettings(): Promise<GlobalSettingsData | null> {
  if (!sanity) return null
  return sanity.fetch(query)
}

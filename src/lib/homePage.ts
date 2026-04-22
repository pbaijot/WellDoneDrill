import {sanity} from './sanity'

export type HomePageData = {
  hero?: {
    tag?: string
    title?: string
    subtitle?: string
    ctaLabel?: string
    secondaryLabel?: string
  }
  stats?: {value?: string; label?: string}[]
  advantages?: {
    eyebrow?: string
    title?: string
    highlight?: string
    items?: {number?: string; icon?: string; title?: string; description?: string}[]
    calculatorTitle?: string
    calculatorSubtitle?: string
  }
  services?: {
    eyebrow?: string
    title?: string
    highlight?: string
    items?: {badge?: string; title?: string; description?: string; routeKey?: string}[]
  }
  gallery?: {
    eyebrow?: string
    title?: string
    highlight?: string
    subtitle?: string
    mainLabel?: string
    videoBadge?: string
    items?: {label?: string; city?: string}[]
  }
  audiences?: {
    particular?: {
      eyebrow?: string
      title?: string
      description?: string
      buttonLabel?: string
    }
    professional?: {
      eyebrow?: string
      title?: string
      description?: string
      buttonLabel?: string
    }
  }
  machine?: {
    eyebrow?: string
    title?: string
    highlight?: string
    description?: string
    items?: string[]
    buttonLabel?: string
  }
  clients?: {
    eyebrow?: string
    title?: string
    highlight?: string
    items?: string[]
  }
  blog?: {
    eyebrow?: string
    title?: string
    highlight?: string
    readMoreLabel?: string
  }
  cta?: {
    pretitle?: string
    title?: string
    buttonLabel?: string
    phone?: string
    email?: string
  }
}

const homePageQuery = `
*[_type == "homePage" && locale == $locale][0]{
  hero,
  stats,
  advantages,
  services,
  gallery,
  audiences,
  machine,
  clients,
  blog,
  cta
}
`

export async function getHomePage(locale: string): Promise<HomePageData | null> {
  if (!sanity) {
    return null
  }

  return sanity.fetch(homePageQuery, {locale})
}

import {sanity} from './sanity'

export type HomePageData = {
  hero?: {
    tag?: string
    title?: string
    subtitle?: string
    ctaLabel?: string
    secondaryLabel?: string
    image?: unknown
  }
  advantages?: {
    eyebrow?: string
    title?: string
    highlight?: string
    introText?: string
    videoUrl?: string
    items?: {number?: string; icon?: string; title?: string; description?: string}[]
    calculatorTitle?: string
    calculatorSubtitle?: string
  }
  services?: {
    eyebrow?: string
    title?: string
    subtitle?: string
    items?: {badge?: string; title?: string; description?: string; routeKey?: string; image?: unknown}[]
  }
  audiences?: {
    particular?: {
      eyebrow?: string
      title?: string
      description?: string
      buttonLabel?: string
      image?: unknown
    }
    professional?: {
      eyebrow?: string
      title?: string
      description?: string
      buttonLabel?: string
      image?: unknown
    }
  }
  contactCta?: {
    title?: string
    subtitle?: string
    buttonLabel?: string
    phone?: string
    image?: unknown
    stat1Value?: string
    stat1Label?: string
    stat2Value?: string
    stat2Label?: string
  }
  faqs?: {
    title?: string
    items?: {question?: string; answer?: string}[]
  }
  blog?: {
    eyebrow?: string
    title?: string
    highlight?: string
    readMoreLabel?: string
  }
}

const homePageQuery = `
*[_type == "homePage" && locale == $locale][0]{
  hero,
  advantages,
  services,
  audiences,
  contactCta,
  faqs,
  blog
}
`

export async function getHomePage(locale: string): Promise<HomePageData | null> {
  if (!sanity) {
    return null
  }

  return sanity.fetch(homePageQuery, {locale})
}

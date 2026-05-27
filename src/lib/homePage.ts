import {sanity} from './sanity'

export type HomePageData = {
  hero?: {
    title?: string
    subtitle?: string
    ctaLabel?: string
    secondaryLabel?: string
    image?: unknown
  }
  advantages?: {
    title?: string
    highlight?: string
    introText?: string
    videoUrl?: string  // resolved from file asset by GROQ
    items?: {number?: string; title?: string; description?: string}[]
  }
  services?: {
    title?: string
    highlight?: string
    subtitle?: string
    items?: {title?: string; description?: string; ctaLabel?: string; routeKey?: string; image?: unknown}[]
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
  partners?: {
    title?: string
    logos?: {_key: string; name?: string; url?: string; logo?: {asset?: {url?: string}}}[]
  }
  blog?: {
    title?: string
    highlight?: string
    readMoreLabel?: string
  }
}

const homePageQuery = `
*[_type == "homePage" && locale == $locale][0]{
  hero,
  "advantages": advantages {
    ...,
    "videoUrl": video.asset->url
  },
  services,
  audiences,
  contactCta,
  faqs,
  "partners": partners {
    title,
    "logos": logos[] {
      _key,
      name,
      url,
      "logo": logo { "asset": asset -> { url } }
    }
  },
  blog
}
`

export async function getHomePage(locale: string): Promise<HomePageData | null> {
  if (!sanity) {
    return null
  }

  return sanity.fetch(homePageQuery, {locale})
}

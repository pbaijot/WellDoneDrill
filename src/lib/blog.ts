import {sanity} from './sanity'

export type BlogPostCard = {
  _id: string
  title: string
  slug: string
  // Set on posts restored from the old WordPress site: the post is served at
  // this exact path (e.g. /be-fr/<slug>) instead of /<locale>/blog/<slug>.
  legacyPath?: string
  excerpt?: string
  publishedAt?: string
  category?: string
  locale: string
  author?: string
  readingTime?: number
  featured?: boolean
  mainImage?: {
    asset?: {
      _ref?: string
      url?: string
    }
    alt?: string
  }
}

export type BlogPostFull = BlogPostCard & {
  intro?: Array<{
    _type: string
    _key?: string
    style?: string
    children?: Array<{
      _key?: string
      _type?: string
      text?: string
    }>
  }>
  body?: Array<{
    _type: string
    _key?: string
    style?: string
    children?: Array<{
      _key?: string
      _type?: string
      text?: string
    }>
  }>
  ctaTitle?: string
  ctaText?: string
  seoTitle?: string
  seoDescription?: string
}

const listQuery = `
*[_type == "blogPost" && locale == $locale]
| order(featured desc, publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  legacyPath,
  excerpt,
  publishedAt,
  category,
  locale,
  author,
  readingTime,
  featured,
  mainImage{
    asset->{
      _ref,
      url
    },
    alt
  }
}
`

const latestQuery = `
*[_type == "blogPost" && locale == $locale]
| order(featured desc, publishedAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  legacyPath,
  excerpt,
  publishedAt,
  category,
  locale,
  author,
  readingTime,
  featured,
  mainImage{
    asset->{
      _ref,
      url
    },
    alt
  }
}
`

const bySlugQuery = `
*[_type == "blogPost" && locale == $locale && $filter][0]{
  _id,
  title,
  "slug": slug.current,
  legacyPath,
  excerpt,
  publishedAt,
  category,
  locale,
  author,
  readingTime,
  featured,
  mainImage{
    asset->{
      _ref,
      url
    },
    alt
  },
  intro,
  body,
  ctaTitle,
  ctaText,
  seoTitle,
  seoDescription
}
`

export async function getBlogPosts(locale: string): Promise<BlogPostCard[]> {
  if (!sanity) return []
  return sanity.fetch(listQuery, {locale})
}

export async function getLatestBlogPosts(locale: string, limit = 3): Promise<BlogPostCard[]> {
  if (!sanity) return []
  return sanity.fetch(latestQuery, {locale, limit})
}

export async function getBlogPostBySlug(locale: string, slug: string): Promise<BlogPostFull | null> {
  if (!sanity) return null
  return sanity.fetch(bySlugQuery.replace('$filter', 'slug.current == $slug'), {locale, slug})
}

export async function getBlogPostByLegacyPath(locale: string, legacyPath: string): Promise<BlogPostFull | null> {
  if (!sanity) return null
  return sanity.fetch(bySlugQuery.replace('$filter', 'legacyPath == $legacyPath'), {locale, legacyPath})
}

export function blogPostHref(locale: string, post: {slug: string; legacyPath?: string}): string {
  return post.legacyPath || `/${locale}/blog/${post.slug}`
}

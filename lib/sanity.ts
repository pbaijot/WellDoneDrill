import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Queries GROQ
export const queries = {
  // Articles de blog
  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc) [0...3] {
    _id, title, slug, publishedAt, excerpt,
    "imageUrl": mainImage.asset->url,
    category
  }`,

  // References chantiers (depuis Odoo ou Sanity)
  references: `*[_type == "reference"] | order(year desc) {
    _id, title, location, province, type, depth, sector,
    "imageUrl": photo.asset->url
  }`,

  // Contenu homepage (textes editables)
  homepage: `*[_type == "homepage"][0] {
    heroTitle, heroSubtitle, heroCta,
    stats,
    advantages,
    ctaTitle, ctaSubtitle
  }`,
}

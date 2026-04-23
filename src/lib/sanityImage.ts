import imageUrlBuilder from '@sanity/image-url'
import { sanity as client } from './sanity'

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: unknown) {
  if (!builder || !source) return null
  return builder.image(source as any)
}

import imageUrlBuilder from '@sanity/image-url'
import {sanity} from './sanity'

const builder = sanity ? imageUrlBuilder(sanity) : null

export function urlFor(source: unknown) {
  if (!builder) return null
  return builder.image(source)
}

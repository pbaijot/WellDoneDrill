import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {sanity} from './sanity'

const builder = sanity ? imageUrlBuilder(sanity) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) return null
  return builder.image(source)
}

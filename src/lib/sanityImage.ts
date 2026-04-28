import imageUrlBuilder from '@sanity/image-url'
import {sanity} from './sanity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) return null
  return builder.image(source)
}

const builder = sanity ? imageUrlBuilder(sanity) : null

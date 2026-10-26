import Image from 'next/image'
import Link from 'next/link'
import {PortableText, type PortableTextComponents} from 'next-sanity'
import {urlFor} from '@/src/lib/sanityImage'

// Rich-text renderer for blog posts: headings, lists, bold/italic, links and
// inline images (the restored WordPress articles rely on all of these).
const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>,
    h3: ({children}) => <h3 className="text-2xl font-bold mt-8 mb-3">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-wdd-yellow pl-5 italic my-8 text-black/70">{children}</blockquote>
    ),
    normal: ({children}) => <p className="text-lg leading-8 text-black/75 mb-6">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-8 text-black/75">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg leading-8 text-black/75">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-wdd-black">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({value, children}) => {
      const href: string = value?.href ?? '#'
      const cls = 'underline decoration-wdd-yellow decoration-2 underline-offset-4 hover:text-wdd-mud'
      return href.startsWith('/')
        ? <Link href={href} className={cls}>{children}</Link>
        : <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>
    },
  },
  types: {
    image: ({value}) => {
      const url = urlFor(value)?.width(1600).auto('format').url()
      if (!url) return null
      return (
        <figure className="my-10">
          <Image src={url} alt={value?.alt || ''} width={1600} height={1000} className="w-full h-auto" />
        </figure>
      )
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogBody({value}: {value: any[]}) {
  return <PortableText value={value} components={components} />
}

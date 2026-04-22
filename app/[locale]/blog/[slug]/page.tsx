import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {getBlogPostBySlug} from '@/src/lib/blog'

function formatDate(value?: string, locale = 'fr-BE') {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getIntlLocale(locale: string) {
  switch (locale) {
    case 'be-nl':
      return 'nl-BE'
    case 'fr-fr':
      return 'fr-FR'
    case 'lu-fr':
      return 'fr-LU'
    case 'lu-de':
      return 'de-LU'
    default:
      return 'fr-BE'
  }
}

function getCategoryLabel(category?: string) {
  switch (category) {
    case 'geothermie':
      return 'Géothermie'
    case 'pac':
      return 'Pompes à chaleur'
    case 'reglementation':
      return 'Réglementation'
    case 'chantier':
      return 'Chantier'
    default:
      return 'Article'
  }
}

function renderBlock(block: any) {
  if (block?._type !== 'block') return null
  const text = (block.children || []).map((child: any) => child.text || '').join('')

  switch (block.style) {
    case 'h2':
      return <h2 key={block._key} className="text-3xl font-bold mt-12 mb-4">{text}</h2>
    case 'h3':
      return <h3 key={block._key} className="text-2xl font-bold mt-8 mb-3">{text}</h3>
    case 'blockquote':
      return <blockquote key={block._key} className="border-l-4 border-wdd-yellow pl-5 italic my-8 text-black/70">{text}</blockquote>
    default:
      return <p key={block._key} className="text-lg leading-8 text-black/75 mb-6">{text}</p>
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}) {
  const {locale, slug} = await params
  const post = await getBlogPostBySlug(locale, slug)

  if (!post) {
    notFound()
  }

  const intlLocale = getIntlLocale(locale)

  return (
    <article className="bg-white min-h-screen">
      <header className="bg-wdd-clay px-8 py-14 border-b border-black/10">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/blog`} className="text-sm text-black/50 hover:text-wdd-mud transition-colors">
            ← Retour aux actualités
          </Link>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider mt-8 mb-4">
            <span className="text-wdd-mud">{getCategoryLabel(post.category)}</span>
            {post.publishedAt && <span className="text-black/45">{formatDate(post.publishedAt, intlLocale)}</span>}
            {post.author && <span className="text-black/45">{post.author}</span>}
            {post.readingTime && <span className="text-black/45">{post.readingTime} min de lecture</span>}
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-black/65 leading-relaxed max-w-3xl">{post.excerpt}</p>
          )}
        </div>
      </header>

      <section className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {post.mainImage?.asset?.url && (
            <div className="mb-12">
              <Image
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt || post.title}
                width={1800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
          )}

          {post.intro && post.intro.length > 0 && (
            <div className="mb-10 border-l-4 border-wdd-yellow pl-6">
              {post.intro.map(renderBlock)}
            </div>
          )}

          <div>
            {(post.body || []).map(renderBlock)}
          </div>

          {(post.ctaTitle || post.ctaText) && (
            <div className="mt-16 bg-wdd-yellow p-8">
              {post.ctaTitle && <h2 className="text-2xl font-bold mb-3">{post.ctaTitle}</h2>}
              {post.ctaText && <p className="text-base leading-7 text-black/75 mb-5">{post.ctaText}</p>}
              <Link
                href={`/${locale}/devis`}
                className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                Demander un devis +
              </Link>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}

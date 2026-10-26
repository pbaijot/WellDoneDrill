import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type {BlogPostFull} from '@/src/lib/blog'
import BlogBody from './BlogBody'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'

const COPY: Record<AppLocale, {
  back: string
  minRead: string
  ctaButton: string
  categories: Record<string, string>
}> = {
  'be-fr': {
    back: '← Retour aux actualités',
    minRead: 'min de lecture',
    ctaButton: 'Demander un devis +',
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
  },
  'be-nl': {
    back: '← Terug naar het nieuws',
    minRead: 'min lezen',
    ctaButton: 'Vraag een offerte +',
    categories: {geothermie: 'Geothermie', pac: 'Warmtepompen', reglementation: 'Regelgeving', chantier: 'Werf'},
  },
  'fr-fr': {
    back: '← Retour aux actualités',
    minRead: 'min de lecture',
    ctaButton: 'Demander un devis +',
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
  },
  'lu-fr': {
    back: '← Retour aux actualités',
    minRead: 'min de lecture',
    ctaButton: 'Demander un devis +',
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
  },
  'lu-de': {
    back: '← Zurück zu den Neuigkeiten',
    minRead: 'Min Lesezeit',
    ctaButton: 'Angebot anfragen +',
    categories: {geothermie: 'Geothermie', pac: 'Wärmepumpen', reglementation: 'Vorschriften', chantier: 'Baustelle'},
  },
  'be-en': {
    back: '← Back to the news',
    minRead: 'min read',
    ctaButton: 'Request a quote +',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
  },
  'fr-en': {
    back: '← Back to the news',
    minRead: 'min read',
    ctaButton: 'Request a quote +',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
  },
  'lu-en': {
    back: '← Back to the news',
    minRead: 'min read',
    ctaButton: 'Request a quote +',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
  },
}

const INTL_LOCALE: Record<AppLocale, string> = {
  'be-fr': 'fr-BE', 'be-nl': 'nl-BE', 'be-en': 'en-BE',
  'fr-fr': 'fr-FR', 'fr-en': 'en-FR',
  'lu-fr': 'fr-LU', 'lu-de': 'de-LU', 'lu-en': 'en-LU',
}

function formatDate(value?: string, intlLocale = 'fr-BE') {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat(intlLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function blogPostMetadata(post: BlogPostFull | null, canonical: string, languages: Record<string, string> = {}): Metadata {
  const title = post?.seoTitle || post?.title || 'Blog — WellDoneDrill'
  const description = post?.seoDescription || post?.excerpt || ''
  return {
    title,
    description,
    alternates: {canonical, languages},
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      ...(post?.mainImage?.asset?.url ? { images: [post.mainImage.asset.url] } : {}),
    },
  }
}

export default function BlogArticle({locale, post}: {locale: string; post: BlogPostFull}) {
  const copy = COPY[locale as AppLocale] ?? COPY['be-fr']
  const intlLocale = INTL_LOCALE[locale as AppLocale] ?? 'fr-BE'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage: intlLocale,
    author: {'@type': 'Organization', name: post.author || 'WellDoneDrill'},
    publisher: {'@id': 'https://www.welldonedrill.energy/#organization'},
    ...(post.mainImage?.asset?.url ? {image: post.mainImage.asset.url} : {}),
  }

  return (
    <article className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}} />
      <header className="bg-wdd-clay px-8 py-14 border-b border-black/10">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/blog`} className="text-sm text-black/50 hover:text-wdd-mud transition-colors">
            {copy.back}
          </Link>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider mt-8 mb-4">
            {post.category && <span className="text-wdd-mud">{copy.categories[post.category] ?? post.category}</span>}
            {post.publishedAt && <span className="text-black/45">{formatDate(post.publishedAt, intlLocale)}</span>}
            {post.author && <span className="text-black/45">{post.author}</span>}
            {post.readingTime && <span className="text-black/45">{post.readingTime} {copy.minRead}</span>}
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
              <BlogBody value={post.intro} />
            </div>
          )}

          <div>
            <BlogBody value={post.body || []} />
          </div>

          {(post.ctaTitle || post.ctaText) && (
            <div className="mt-16 bg-wdd-yellow p-8">
              {post.ctaTitle && <h2 className="text-2xl font-bold mb-3">{post.ctaTitle}</h2>}
              {post.ctaText && <p className="text-base leading-7 text-black/75 mb-5">{post.ctaText}</p>}
              <Link
                href={getLocalizedPath(locale as AppLocale, 'contact')}
                className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                {copy.ctaButton}
              </Link>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}

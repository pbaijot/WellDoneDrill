import Link from 'next/link'
import Image from 'next/image'
import {getBlogPosts} from '@/src/lib/blog'

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

export default async function BlogPage({
  params,
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  const posts = await getBlogPosts(locale)
  const intlLocale = getIntlLocale(locale)
  const featured = posts.find((post) => post.featured) ?? posts[0]
  const rest = featured ? posts.filter((post) => post._id !== featured._id) : []

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-wdd-black text-white px-8 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-wdd-yellow/60 mb-4">
            Actualités
          </div>
          <h1 className="text-5xl font-bold mb-4">Le blog WellDoneDrill</h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">
            Articles, retours de chantier, pédagogie géothermie et points d’attention techniques pour mieux comprendre le forage géothermique.
          </p>
        </div>
      </section>

      <section className="px-8 py-14">
        <div className="max-w-screen-xl mx-auto">
          {!featured ? (
            <div className="text-sm text-black/60">Aucun article publié pour cette langue.</div>
          ) : (
            <>
              <Link href={`/${locale}/blog/${featured.slug}`} className="block border border-black/10 hover:border-wdd-yellow transition-colors mb-14">
                <div className="grid lg:grid-cols-2">
                  <div className="bg-wdd-clay min-h-[320px] flex items-center justify-center overflow-hidden">
                    {featured.mainImage?.asset?.url ? (
                      <Image
                        src={featured.mainImage.asset.url}
                        alt={featured.mainImage.alt || featured.title}
                        width={1600}
                        height={900}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs uppercase tracking-wider text-black/30">Image article</span>
                    )}
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider mb-4">
                      <span className="text-wdd-mud">{getCategoryLabel(featured.category)}</span>
                      {featured.publishedAt && <span className="text-black/45">{formatDate(featured.publishedAt, intlLocale)}</span>}
                      {featured.readingTime && <span className="text-black/45">{featured.readingTime} min</span>}
                    </div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="text-base text-black/65 leading-relaxed mb-6">{featured.excerpt}</p>
                    )}
                    <span className="text-sm font-semibold text-wdd-black">Lire l’article +</span>
                  </div>
                </div>
              </Link>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <article key={post._id} className="border border-black/10 hover:border-wdd-yellow transition-colors overflow-hidden">
                    <Link href={`/${locale}/blog/${post.slug}`} className="block">
                      <div className="bg-wdd-clay h-52 flex items-center justify-center overflow-hidden">
                        {post.mainImage?.asset?.url ? (
                          <Image
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt || post.title}
                            width={1200}
                            height={700}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs uppercase tracking-wider text-black/30">Image article</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wider mb-3">
                          <span className="text-wdd-mud">{getCategoryLabel(post.category)}</span>
                          {post.publishedAt && <span className="text-black/45">{formatDate(post.publishedAt, intlLocale)}</span>}
                          {post.readingTime && <span className="text-black/45">{post.readingTime} min</span>}
                        </div>
                        <h3 className="text-xl font-bold leading-snug mb-3">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-black/60 leading-relaxed mb-4">{post.excerpt}</p>
                        )}
                        <span className="text-sm font-semibold text-wdd-black">Lire l’article +</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

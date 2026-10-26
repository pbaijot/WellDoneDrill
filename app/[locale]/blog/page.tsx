import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {getBlogPosts, blogPostHref} from '@/src/lib/blog'
import type {AppLocale} from '@/src/i18n/routes'
import {getSeoDefaults} from '@/src/i18n/seo'
import {buildAlternates} from '@/src/lib/seoAlternates'

const COPY: Record<AppLocale, {
  eyebrow: string
  title: string
  desc: string
  empty: string
  readMore: string
  categories: Record<string, string>
  minRead: string
}> = {
  'be-fr': {
    eyebrow: 'Actualités',
    title: 'Le blog WellDoneDrill',
    desc: "Articles, retours de chantier, pédagogie géothermie et points d'attention techniques pour mieux comprendre le forage géothermique.",
    empty: 'Aucun article publié pour cette version du site.',
    readMore: "Lire l'article →",
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
    minRead: 'min',
  },
  'be-nl': {
    eyebrow: 'Nieuws',
    title: 'De blog van WellDoneDrill',
    desc: 'Artikelen, werfverslagen, geothermische educatie en technische aandachtspunten om geothermisch boren beter te begrijpen.',
    empty: 'Nog geen artikelen gepubliceerd voor deze taalversie.',
    readMore: 'Lees het artikel →',
    categories: {geothermie: 'Geothermie', pac: 'Warmtepompen', reglementation: 'Regelgeving', chantier: 'Werf'},
    minRead: 'min',
  },
  'fr-fr': {
    eyebrow: 'Actualités',
    title: 'Le blog WellDoneDrill',
    desc: "Articles, retours de chantier, pédagogie géothermie et points d'attention techniques pour mieux comprendre le forage géothermique.",
    empty: 'Aucun article publié pour cette version du site.',
    readMore: "Lire l'article →",
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
    minRead: 'min',
  },
  'lu-fr': {
    eyebrow: 'Actualités',
    title: 'Le blog WellDoneDrill',
    desc: "Articles, retours de chantier, pédagogie géothermie et points d'attention techniques pour mieux comprendre le forage géothermique.",
    empty: 'Aucun article publié pour cette version du site.',
    readMore: "Lire l'article →",
    categories: {geothermie: 'Géothermie', pac: 'Pompes à chaleur', reglementation: 'Réglementation', chantier: 'Chantier'},
    minRead: 'min',
  },
  'lu-de': {
    eyebrow: 'Aktuelles',
    title: 'Der Blog von WellDoneDrill',
    desc: 'Artikel, Baustellenberichte, Geothermie-Grundlagen und technische Hinweise für ein besseres Verständnis der Erdwärme-Bohrung.',
    empty: 'Noch keine Artikel für diese Sprachversion veröffentlicht.',
    readMore: 'Artikel lesen →',
    categories: {geothermie: 'Geothermie', pac: 'Wärmepumpen', reglementation: 'Vorschriften', chantier: 'Baustelle'},
    minRead: 'Min',
  },
  'be-en': {
    eyebrow: 'News',
    title: 'The WellDoneDrill blog',
    desc: "Articles, project insights, geothermal education and technical points to better understand geothermal drilling.",
    empty: 'No articles published for this version of the site yet.',
    readMore: 'Read the article →',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
    minRead: 'min',
  },
  'fr-en': {
    eyebrow: 'News',
    title: 'The WellDoneDrill blog',
    desc: "Articles, project insights, geothermal education and technical points to better understand geothermal drilling.",
    empty: 'No articles published for this version of the site yet.',
    readMore: 'Read the article →',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
    minRead: 'min',
  },
  'lu-en': {
    eyebrow: 'News',
    title: 'The WellDoneDrill blog',
    desc: "Articles, project insights, geothermal education and technical points to better understand geothermal drilling.",
    empty: 'No articles published for this version of the site yet.',
    readMore: 'Read the article →',
    categories: {geothermie: 'Geothermal energy', pac: 'Heat pumps', reglementation: 'Regulations', chantier: 'Project'},
    minRead: 'min',
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
    return new Intl.DateTimeFormat(intlLocale, {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(value))
  } catch {
    return value
  }
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params
  const loc = locale as AppLocale
  const defaults = getSeoDefaults(loc, 'blog')
  const {canonical, languages} = buildAlternates(loc, 'blog')
  return {
    title: defaults.title,
    description: defaults.description,
    alternates: {canonical, languages},
    openGraph: {title: defaults.title, description: defaults.description, url: canonical},
  }
}

export default async function BlogPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params
  const copy = COPY[locale as AppLocale] ?? COPY['be-fr']
  const intlLocale = INTL_LOCALE[locale as AppLocale] ?? 'fr-BE'

  const posts = await getBlogPosts(locale)
  const featured = posts.find((p) => p.featured) ?? posts[0]
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : []

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-wdd-black text-white px-8 py-20">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-wdd-yellow/60 mb-4">
            {copy.eyebrow}
          </div>
          <h1 className="text-5xl font-bold mb-4">{copy.title}</h1>
          <p className="text-sm text-white/60 max-w-2xl leading-relaxed">{copy.desc}</p>
        </div>
      </section>

      <section className="px-8 py-14">
        <div className="max-w-screen-xl mx-auto">
          {!featured ? (
            <div className="text-sm text-black/60">{copy.empty}</div>
          ) : (
            <>
              <Link href={blogPostHref(locale, featured)} className="block border border-black/10 hover:border-wdd-yellow transition-colors mb-14">
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
                      <span className="text-xs uppercase tracking-wider text-black/30">WellDoneDrill</span>
                    )}
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider mb-4">
                      {featured.category && <span className="text-wdd-mud">{copy.categories[featured.category] ?? featured.category}</span>}
                      {featured.publishedAt && <span className="text-black/45">{formatDate(featured.publishedAt, intlLocale)}</span>}
                      {featured.readingTime && <span className="text-black/45">{featured.readingTime} {copy.minRead}</span>}
                    </div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="text-base text-black/65 leading-relaxed mb-6">{featured.excerpt}</p>
                    )}
                    <span className="text-sm font-semibold text-wdd-black">{copy.readMore}</span>
                  </div>
                </div>
              </Link>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <article key={post._id} className="border border-black/10 hover:border-wdd-yellow transition-colors overflow-hidden">
                    <Link href={blogPostHref(locale, post)} className="block">
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
                          <span className="text-xs uppercase tracking-wider text-black/30">WellDoneDrill</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wider mb-3">
                          {post.category && <span className="text-wdd-mud">{copy.categories[post.category] ?? post.category}</span>}
                          {post.publishedAt && <span className="text-black/45">{formatDate(post.publishedAt, intlLocale)}</span>}
                          {post.readingTime && <span className="text-black/45">{post.readingTime} {copy.minRead}</span>}
                        </div>
                        <h3 className="text-xl font-bold leading-snug mb-3">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-black/60 leading-relaxed mb-4">{post.excerpt}</p>
                        )}
                        <span className="text-sm font-semibold text-wdd-black">{copy.readMore}</span>
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

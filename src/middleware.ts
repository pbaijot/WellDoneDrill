import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
  // next-intl auto-emits an HTTP `Link: rel=alternate hreflang` header using
  // the raw locale identifiers (be-fr, lu-de…) and the same pathname for every
  // locale. Those codes are invalid BCP 47 and the URLs are wrong for our
  // per-locale slugs (e.g. /lu-de/particuliers instead of /lu-de/privatkunden),
  // producing "hreflang multiple entries" + "non-200" SEO errors. We emit the
  // correct hreflang ourselves via generateMetadata, so disable this.
  alternateLinks: false,
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
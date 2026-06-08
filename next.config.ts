import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const SECURITY_HEADERS = [
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection',         value: '1; mode=block' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
]

export default withNextIntl({
  // Disable streaming metadata so <title>, <meta>, canonical and hreflang
  // always render inside <head> for every crawler — not just JS-executing
  // bots. Without this, async generateMetadata (Sanity-backed pages) appends
  // these tags to <body>, which non-JS crawlers (e.g. Screaming Frog) flag
  // as "outside the <head>". See Next.js docs: htmlLimitedBots.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'flagcdn.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }]
  },
  async redirects() {
    return [
      // Legacy /:locale/en links (surfaced by Google) → the proper English
      // home for that country. Temporary (307) — the English slugs are real
      // routes now (be-en/fr-en/lu-en), this only catches the old "/en" shape.
      { source: '/:locale(be-fr|be-nl)/en/:path*', destination: '/be-en', permanent: false },
      { source: '/:locale(be-fr|be-nl)/en', destination: '/be-en', permanent: false },
      { source: '/fr-fr/en/:path*', destination: '/fr-en', permanent: false },
      { source: '/fr-fr/en', destination: '/fr-en', permanent: false },
      { source: '/:locale(lu-fr|lu-de)/en/:path*', destination: '/lu-en', permanent: false },
      { source: '/:locale(lu-fr|lu-de)/en', destination: '/lu-en', permanent: false },
      // be-fr / fr-fr / lu-fr — old chauffagistes slug
      { source: '/:locale(be-fr|fr-fr|lu-fr)/pro/chauffagistes', destination: '/:locale/pro/installateurs-hvac', permanent: true },
      // be-fr / fr-fr / lu-fr — old architectes slug
      { source: '/:locale(be-fr|fr-fr|lu-fr)/pro/architectes', destination: '/:locale/pro/architectes-bureaux-etudes', permanent: true },
      // be-nl
      { source: '/be-nl/professionals/installateurs', destination: '/be-nl/professionals/hvac-installateurs', permanent: true },
      { source: '/be-nl/professionals/architecten',  destination: '/be-nl/professionals/architecten-studiebureaus', permanent: true },
      // lu-de
      { source: '/lu-de/profis/heizungsbauer', destination: '/lu-de/profis/hvac-installateure', permanent: true },
      { source: '/lu-de/profis/architekten',   destination: '/lu-de/profis/architekten-planungsbueros', permanent: true },
    ]
  },
})

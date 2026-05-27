import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl({
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'flagcdn.com' },
    ],
  },
  async redirects() {
    return [
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

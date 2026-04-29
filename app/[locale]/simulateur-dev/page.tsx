import Simulator from '@/simulator/src/Simulator'
import { getLocalizedPath, type AppLocale } from '@/src/i18n/routes'

export default async function SimulateurDevPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#F2EFE9', overflowX: 'hidden' }}>
      <Simulator
        devisUrl={getLocalizedPath(locale as AppLocale, 'devis')}
        soumissionUrl={getLocalizedPath(locale as AppLocale, 'pro_soumission')}
        onResult={undefined}
      />
    </div>
  )
}

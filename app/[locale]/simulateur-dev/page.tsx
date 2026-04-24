import Simulator from '@/simulator/src/Simulator'
import { getLocalizedPath, type AppLocale } from '@/src/i18n/routes'

export default async function SimulateurDevPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-wdd-black flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <Simulator
          devisUrl={getLocalizedPath(locale as AppLocale, 'devis')}
          soumissionUrl={getLocalizedPath(locale as AppLocale, 'pro_soumission')}
          onResult={undefined}
        />
      </div>
    </div>
  )
}

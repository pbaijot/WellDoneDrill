import Simulator from '@/simulator/src/Simulator'
import { getLocalizedPath, type AppLocale } from '@/src/i18n/routes'

export default async function SimulateurDevPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div style={{ minHeight: '100vh', background: '#F2EFE9' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '28px', height: '3px', background: '#E6C200' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8B7A5E' }}>
              WellDoneDrill — Pre-dimensionnement PAC
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1C1C1C', margin: 0, marginBottom: '6px' }}>
            Simulateur de faisabilite geothermique
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6057', margin: 0, lineHeight: 1.6 }}>
            Analyse reglementaire, potentiel du sous-sol et pre-dimensionnement — Wallonie uniquement.
          </p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #DDD8CF', padding: '32px' }}>
          <Simulator
            devisUrl={getLocalizedPath(locale as AppLocale, 'devis')}
            soumissionUrl={getLocalizedPath(locale as AppLocale, 'pro_soumission')}
            onResult={undefined}
          />
        </div>
      </div>
    </div>
  )
}

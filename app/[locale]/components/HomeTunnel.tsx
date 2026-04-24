'use client'

import { useLocale } from 'next-intl'
import { getLocalizedPath } from '@/src/i18n/routes'
import Simulator from '@/simulator/src/Simulator'

export default function HomeTunnel() {
  const locale = useLocale()

  return (
    <Simulator
      devisUrl={getLocalizedPath(locale as any, 'devis')}
      soumissionUrl={getLocalizedPath(locale as any, 'pro_soumission')}
    />
  )
}

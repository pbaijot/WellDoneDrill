'use client'
import { useLocale } from 'next-intl'
import Simulator from '@/simulator/src/Simulator'
import { getLocalizedPath } from '@/src/i18n/routes'
import type { AppLocale } from '@/src/i18n/routes'

export default function HomeTunnel() {
  const locale = useLocale() as AppLocale
  return (
    <Simulator
      devisUrl={getLocalizedPath(locale, 'devis')}
      soumissionUrl={getLocalizedPath(locale, 'pro_chauffagistes') + '#soumission'}
    />
  )
}

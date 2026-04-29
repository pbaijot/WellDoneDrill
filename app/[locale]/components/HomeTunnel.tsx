'use client'
import { useLocale } from 'next-intl'
import Simulator from '@/simulator/src/Simulator'

export default function HomeTunnel() {
  const locale = useLocale()
  return (
    <Simulator
      devisUrl={'/' + locale + '/devis'}
      soumissionUrl={'/' + locale + '/pro/soumission'}
    />
  )
}

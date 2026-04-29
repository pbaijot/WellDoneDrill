'use client'

import type { AddressResult } from '../types'
import { BackBtn, SectionBadge } from '../components/Shared'
import GeologyStep from '../components/GeologyStep'

export type GeologyScreenProps = {
  address: AddressResult | null
  onBack: () => void
  onConfirm: () => void
}

export default function GeologyScreen({
  address,
  onBack,
  onConfirm,
}: GeologyScreenProps) {
  return (
    <div>
      <BackBtn onBack={onBack} />
      <SectionBadge n={1} label="Analyse du sous-sol" />
      <GeologyStep address={address} onConfirm={onConfirm} />
    </div>
  )
}

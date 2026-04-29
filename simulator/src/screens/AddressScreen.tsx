'use client'

import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { BackBtn, SectionBadge } from '../components/Shared'
import AddressStep from '../components/AddressStep'
import type { AddressResult } from '../types'

export type AddressScreenProps = {
  onBack: () => void
  onConfirm: (address: AddressResult) => void
}

export default function AddressScreen({
  onBack,
  onConfirm,
}: AddressScreenProps) {
  return (
    <div>
      <BackBtn onBack={onBack} />
      <SectionBadge n={1} label="Localisation" />

      <div style={{ fontSize: F.lg, fontWeight: 600, color: C.text, marginBottom: '8px' }}>
        {T.addressTitle}
      </div>

      <div
        style={{
          fontSize: F.base,
          color: C.text2,
          lineHeight: 1.6,
          padding: '10px 14px',
          borderLeft: '3px solid ' + C.accentDark,
          background: C.bgSoft,
          marginBottom: '16px',
        }}
      >
        {T.addressIntro}
      </div>

      <AddressStep onConfirm={onConfirm} />
    </div>
  )
}

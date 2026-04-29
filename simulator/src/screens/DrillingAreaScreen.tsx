'use client'

import type { AddressResult } from '../types'
import { BackBtn, SectionBadge } from '../components/Shared'
import DrillingAreaStep from '../components/DrillingAreaStep'
import type { DrillingAreaResult } from '../components/drilling-area/types'
import { C } from '../theme'

export type DrillingAreaScreenProps = {
  address: AddressResult | null
  onBack: () => void
  onConfirm: (result: DrillingAreaResult | null) => void
}

export default function DrillingAreaScreen({
  address,
  onBack,
  onConfirm,
}: DrillingAreaScreenProps) {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: '18px',
          top: '30px',
          zIndex: 720,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid ' + C.border,
          padding: '10px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <BackBtn onBack={onBack} />
        <SectionBadge n={1} label="Zone de forage disponible" />
      </div>

      <DrillingAreaStep
        address={address}
        onConfirm={onConfirm}
      />
    </div>
  )
}

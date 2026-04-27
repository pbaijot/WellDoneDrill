'use client'

import type React from 'react'

import type { AddressResult } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { BackBtn, SectionBadge, PrimaryBtn, SecondaryBtn } from '../components/Shared'
import DiagnosticPanel from '../components/DiagnosticPanel'
import FullscreenMapLayout from '../components/layout/FullscreenMapLayout'

export type RegulatoryMapScreenProps = {
  address: AddressResult
  MapComponent: React.ComponentType<{
    lat: number
    lng: number
    visibleLayers: string[]
  }> | null
  visibleLayers: string[]
  onToggleLayer: (layer: string) => void
  onBack: () => void
  onConfirm: () => void
}

export default function RegulatoryMapScreen({
  address,
  MapComponent,
  visibleLayers,
  onToggleLayer,
  onBack,
  onConfirm,
}: RegulatoryMapScreenProps) {
  return (
    <FullscreenMapLayout
      map={
        MapComponent
          ? (
            <MapComponent
              lat={address.lat}
              lng={address.lng}
              visibleLayers={visibleLayers}
            />
          )
          : (
            <div
              style={{
                height: '100%',
                background: C.bgMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: F.base, color: C.text4 }}>{T.mapLoading}</span>
            </div>
          )
      }
      leftOverlay={
        <div
          style={{
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid ' + C.border,
            padding: '10px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          <BackBtn onBack={onBack} />
          <SectionBadge n={1} label="Verification reglementaire" />
          <div
            style={{
              fontSize: F.lg,
              fontWeight: 600,
              color: C.text,
              marginTop: '8px',
              marginBottom: '4px',
            }}
          >
            {T.mapTitle}
          </div>
          <div
            style={{
              fontSize: F.sm,
              color: C.text4,
              maxWidth: '520px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {address.label}
          </div>
        </div>
      }
      rightPanel={
        <>
          <DiagnosticPanel
            lat={address.lat}
            lng={address.lng}
            visibleLayers={visibleLayers}
            onToggleLayer={onToggleLayer}
          />

          <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
            <PrimaryBtn onClick={onConfirm}>{T.mapConfirm}</PrimaryBtn>
            <SecondaryBtn onClick={onBack}>{T.mapWrongAddress}</SecondaryBtn>
          </div>
        </>
      }
    />
  )
}

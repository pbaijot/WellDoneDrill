'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

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
    onTargetChange?: (target: { lat: number; lng: number }) => void
  }> | null
  visibleLayers: string[]
  onToggleLayer: (layer: string) => void
  onBack: () => void
  onConfirm: (address: AddressResult) => void
}

export default function RegulatoryMapScreen({
  address,
  MapComponent,
  visibleLayers,
  onToggleLayer,
  onBack,
  onConfirm,
}: RegulatoryMapScreenProps) {
  const [target, setTarget] = useState<AddressResult>(address)
  const [isResolvingAddress, setIsResolvingAddress] = useState(false)

  useEffect(() => {
    setTarget(address)
    setIsResolvingAddress(false)
  }, [address])

  const hasMovedTarget = useMemo(() => {
    return (
      Math.abs(target.lat - address.lat) > 0.000001 ||
      Math.abs(target.lng - address.lng) > 0.000001
    )
  }, [target.lat, target.lng, address.lat, address.lng])

  function handleTargetChange(next: { lat: number; lng: number }) {
    setTarget((prev) => ({
      label: prev.label || address.label,
      lat: next.lat,
      lng: next.lng,
    }))
  }

  useEffect(() => {
    const controller = new AbortController()

    const timer = window.setTimeout(async () => {
      const moved =
        Math.abs(target.lat - address.lat) > 0.000001 ||
        Math.abs(target.lng - address.lng) > 0.000001

      if (!moved) {
        setTarget(address)
        setIsResolvingAddress(false)
        return
      }

      try {
        setIsResolvingAddress(true)

        const params = new URLSearchParams({
          lat: String(target.lat),
          lng: String(target.lng),
        })

        const response = await fetch('/api/reverse-geocode?' + params.toString(), {
          signal: controller.signal,
        })

        const data = await response.json()

        if (!controller.signal.aborted) {
          setTarget((prev) => ({
            ...prev,
            label: data.label || `Position ajustée (${prev.lat.toFixed(6)}, ${prev.lng.toFixed(6)})`,
          }))
        }
      } catch {
        if (!controller.signal.aborted) {
          setTarget((prev) => ({
            ...prev,
            label: `Position ajustée (${prev.lat.toFixed(6)}, ${prev.lng.toFixed(6)})`,
          }))
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingAddress(false)
        }
      }
    }, 650)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [target.lat, target.lng, address])

  return (
    <FullscreenMapLayout
      map={
        MapComponent
          ? (
            <MapComponent
              lat={address.lat}
              lng={address.lng}
              visibleLayers={visibleLayers}
              onTargetChange={handleTargetChange}
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
            {isResolvingAddress ? 'Recherche de l’adresse...' : target.label}
          </div>

          <div
            style={{
              marginTop: '6px',
              display: 'grid',
              gap: '2px',
              fontSize: '11px',
              color: C.text4,
              lineHeight: 1.4,
            }}
          >
            <div>
              {hasMovedTarget
                ? 'Position ciblée ajustée sur la carte'
                : 'Position ciblée sur l’adresse encodée'}
            </div>

            <div style={{ fontFamily: 'monospace', color: C.text2 }}>
              Lat. {target.lat.toFixed(6)} · Lng. {target.lng.toFixed(6)}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <>
          <DiagnosticPanel
            lat={target.lat}
            lng={target.lng}
            visibleLayers={visibleLayers}
            onToggleLayer={onToggleLayer}
          />

          <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
            <PrimaryBtn onClick={() => onConfirm(target)}>{T.mapConfirm}</PrimaryBtn>
            <SecondaryBtn onClick={onBack}>{T.mapWrongAddress}</SecondaryBtn>
          </div>
        </>
      }
    />
  )
}

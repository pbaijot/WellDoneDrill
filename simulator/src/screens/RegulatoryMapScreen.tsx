'use client'

import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { AddressResult } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import { BackBtn, SectionBadge, PrimaryBtn, SecondaryBtn } from '../components/Shared'
import DiagnosticPanel from '../components/DiagnosticPanel'
import FullscreenMapLayout from '../components/layout/FullscreenMapLayout'

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

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
  const [mapCenter, setMapCenter] = useState<AddressResult>(address)
  const [addressQuery, setAddressQuery] = useState(address.label)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isResolvingAddress, setIsResolvingAddress] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const searchTimer = useRef<number | null>(null)

  useEffect(() => {
    setTarget(address)
    setMapCenter(address)
    setAddressQuery(address.label)
    setResults([])
    setIsEditingAddress(false)
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
    if (isEditingAddress) return

    const controller = new AbortController()

    const timer = window.setTimeout(async () => {
      const moved =
        Math.abs(target.lat - address.lat) > 0.000001 ||
        Math.abs(target.lng - address.lng) > 0.000001

      if (!moved) {
        setAddressQuery(address.label)
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
        const nextLabel = data.label || `Position ajustée (${target.lat.toFixed(6)}, ${target.lng.toFixed(6)})`

        if (!controller.signal.aborted) {
          setTarget((prev) => ({
            ...prev,
            label: nextLabel,
          }))
          setAddressQuery(nextLabel)
        }
      } catch {
        if (!controller.signal.aborted) {
          const fallback = `Position ajustée (${target.lat.toFixed(6)}, ${target.lng.toFixed(6)})`
          setTarget((prev) => ({
            ...prev,
            label: fallback,
          }))
          setAddressQuery(fallback)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingAddress(false)
        }
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [target.lat, target.lng, address, isEditingAddress])

  useEffect(() => {
    if (!isEditingAddress) return

    if (addressQuery.trim().length < 4) {
      setResults([])
      return
    }

    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current)
    }

    searchTimer.current = window.setTimeout(async () => {
      setIsSearching(true)

      try {
        const url =
          'https://nominatim.openstreetmap.org/search?format=json&countrycodes=be&viewbox=2.85,50.85,6.5,49.45&bounded=1&limit=5&accept-language=fr&q=' +
          encodeURIComponent(addressQuery)

        const response = await fetch(url, {
          headers: { 'User-Agent': 'WellDoneDrill-Simulator/1.0' },
        })

        setResults(await response.json())
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 450)

    return () => {
      if (searchTimer.current) {
        window.clearTimeout(searchTimer.current)
      }
    }
  }, [addressQuery, isEditingAddress])

  function chooseAddress(result: NominatimResult) {
    const nextAddress = {
      label: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    }

    setTarget(nextAddress)
    setMapCenter(nextAddress)
    setAddressQuery(nextAddress.label)
    setResults([])
    setIsEditingAddress(false)
  }

  return (
    <FullscreenMapLayout
      map={
        MapComponent
          ? (
            <MapComponent
              lat={mapCenter.lat}
              lng={mapCenter.lng}
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
            width: '420px',
            maxWidth: 'calc(100vw - 440px)',
          }}
        >
          <BackBtn onBack={onBack} />
          <SectionBadge n={1} label="Localisation" />

          <div
            style={{
              fontSize: F.lg,
              fontWeight: 600,
              color: C.text,
              marginTop: '8px',
              marginBottom: '8px',
            }}
          >
            Où se situe votre projet ?
          </div>

          <div style={{ position: 'relative' }}>
            <input
              value={addressQuery}
              onChange={(event) => {
                setAddressQuery(event.target.value)
                setIsEditingAddress(true)
              }}
              onFocus={() => setIsEditingAddress(true)}
              placeholder="Ex : Rue de la Loi 16, Namur"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid ' + C.border,
                padding: '10px 12px',
                fontFamily: 'inherit',
                fontSize: F.sm,
                color: C.text,
                background: '#FFFFFF',
              }}
            />

            {(isSearching || isResolvingAddress) && (
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: F.xs,
                  color: C.text4,
                }}
              >
                ...
              </span>
            )}
          </div>

          {isEditingAddress && results.length > 0 && (
            <div
              style={{
                border: '1px solid ' + C.border,
                borderTop: 'none',
                background: '#FFFFFF',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {results.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => chooseAddress(result)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: '#FFFFFF',
                    border: 'none',
                    borderBottom: '1px solid ' + C.border,
                    padding: '9px 11px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    color: C.text2,
                    lineHeight: 1.35,
                  }}
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: '8px',
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
            <PrimaryBtn onClick={() => onConfirm(target)}>
              Confirmer — analyser le sous-sol →
            </PrimaryBtn>
            <SecondaryBtn onClick={onBack}>
              Retour
            </SecondaryBtn>
          </div>
        </>
      }
    />
  )
}

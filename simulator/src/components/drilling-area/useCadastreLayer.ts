'use client'

import { useEffect } from 'react'

import type { LatLngPoint } from './types'
import {
  cadastreBuildingStyle,
  cadastreParcelStyle,
  cadastreQueryUrl,
} from './cadastre'

export function useCadastreLayer({
  mapRef,
  cadastreLayerRef,
  center,
  showCadastre,
  mapReady,
}: {
  mapRef: React.MutableRefObject<any>
  cadastreLayerRef: React.MutableRefObject<any>
  center: LatLngPoint | null
  showCadastre: boolean
  mapReady: number
}) {
  useEffect(() => {
    const map = mapRef.current
    const cadastreLayer = cadastreLayerRef.current

    if (!map || !cadastreLayer || !center) return

    if (!showCadastre) {
      if (map.hasLayer(cadastreLayer)) {
        map.removeLayer(cadastreLayer)
      }
      return
    }

    if (!map.hasLayer(cadastreLayer)) {
      cadastreLayer.addTo(map)
    }

    let cancelled = false

    import('leaflet').then(async (Lmod) => {
      const L = Lmod.default

      try {
        const [parcelsRes, buildingsRes] = await Promise.all([
          fetch(cadastreQueryUrl(0, center)),
          fetch(cadastreQueryUrl(1, center)),
        ])

        const [parcels, buildings] = await Promise.all([
          parcelsRes.json(),
          buildingsRes.json(),
        ])

        if (cancelled) return

        cadastreLayer.clearLayers()

        L.geoJSON(parcels, {
          style: cadastreParcelStyle,
          pane: 'cadastre_overlay',
        } as any).addTo(cadastreLayer)

        L.geoJSON(buildings, {
          style: cadastreBuildingStyle,
          pane: 'cadastre_overlay',
        } as any).addTo(cadastreLayer)

        map.invalidateSize()
      } catch (error) {
        console.warn('Impossible de charger le cadastre CADGIS', error)
      }
    })

    return () => {
      cancelled = true
    }
  }, [mapRef, cadastreLayerRef, center, showCadastre, mapReady])
}

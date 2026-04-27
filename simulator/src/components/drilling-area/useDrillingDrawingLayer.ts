'use client'

import { useEffect } from 'react'

import type { LatLngPoint } from './types'

export function useDrillingDrawingLayer({
  markerLayerRef,
  polygonLayerRef,
  points,
  buildingEntry,
}: {
  markerLayerRef: React.MutableRefObject<any>
  polygonLayerRef: React.MutableRefObject<any>
  points: LatLngPoint[]
  buildingEntry: LatLngPoint | null
}) {
  useEffect(() => {
    const markers = markerLayerRef.current
    const polygons = polygonLayerRef.current

    if (!markers || !polygons) return

    import('leaflet').then((Lmod) => {
      const L = Lmod.default

      markers.clearLayers()
      polygons.clearLayers()

      if (points.length >= 2) {
        L.polyline(points.map((point) => [point.lat, point.lng]), {
          color: '#FFD94F',
          weight: 3,
          opacity: 0.95,
        }).addTo(polygons)
      }

      if (points.length >= 3) {
        L.polygon(points.map((point) => [point.lat, point.lng]), {
          color: '#1A1A1A',
          weight: 2,
          fillColor: '#FFD94F',
          fillOpacity: 0.28,
        }).addTo(polygons)
      }

      if (buildingEntry) {
        L.circleMarker([buildingEntry.lat, buildingEntry.lng], {
          radius: 8,
          color: '#FFFFFF',
          weight: 2,
          fillColor: '#D12B2B',
          fillOpacity: 1,
        }).addTo(markers)
      }
    })
  }, [markerLayerRef, polygonLayerRef, points, buildingEntry])
}

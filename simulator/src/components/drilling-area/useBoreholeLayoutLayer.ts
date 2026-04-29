'use client'

import { useEffect } from 'react'

import type { GeneratedBoreholeLayout, LatLngPoint } from './types'

export function useBoreholeLayoutLayer({
  layoutLayerRef,
  generatedLayout,
  setCollectorOverrides,
}: {
  layoutLayerRef: React.MutableRefObject<any>
  generatedLayout: GeneratedBoreholeLayout | null
  setCollectorOverrides: React.Dispatch<React.SetStateAction<Record<string, LatLngPoint>>>
}) {
  useEffect(() => {
    const layoutLayer = layoutLayerRef.current

    if (!layoutLayer) return

    import('leaflet').then((Lmod) => {
      const L = Lmod.default

      layoutLayer.clearLayers()

      if (!generatedLayout) return

      generatedLayout.connections.forEach((connection) => {
        L.polyline(
          [
            [connection.from.lat, connection.from.lng],
            [connection.to.lat, connection.to.lng],
          ],
          {
            color: connection.type === 'collector-to-building' ? '#D12B2B' : '#1A1A1A',
            weight: connection.type === 'collector-to-building' ? 3 : 1.5,
            opacity: 0.9,
            dashArray: connection.type === 'collector-to-building' ? undefined : '3 5',
          }
        ).addTo(layoutLayer)
      })

      generatedLayout.boreholes.forEach((borehole) => {
        L.circleMarker([borehole.lat, borehole.lng], {
          radius: 4,
          color: '#1A1A1A',
          weight: 1.5,
          fillColor: '#FFD94F',
          fillOpacity: 1,
        }).addTo(layoutLayer)
      })

      generatedLayout.collectors.forEach((collector) => {
        const collectorIcon = L.divIcon({
          className: 'wdd-collector-marker',
          html: '<div style="width:18px;height:18px;border-radius:999px;background:#6A1B9A;border:3px solid #FFFFFF;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const collectorMarker = L.marker(
          [collector.lat, collector.lng],
          {
            icon: collectorIcon,
            draggable: true,
          }
        ).addTo(layoutLayer)

        collectorMarker.on('dragend', (event: any) => {
          const position = event.target.getLatLng()

          setCollectorOverrides((prev) => ({
            ...prev,
            [collector.id]: {
              lat: position.lat,
              lng: position.lng,
            },
          }))
        })
      })
    })
  }, [layoutLayerRef, generatedLayout, setCollectorOverrides])
}

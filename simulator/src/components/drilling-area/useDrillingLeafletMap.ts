'use client'

import { useEffect } from 'react'

import type { AddressResult } from '../../types'
import type { LatLngPoint } from './types'

export function useDrillingLeafletMap({
  mapId,
  address,
  mapRef,
  markerLayerRef,
  polygonLayerRef,
  layoutLayerRef,
  cadastreLayerRef,
  drawingModeRef,
  setPoints,
  setBuildingEntry,
  setMapReady,
}: {
  mapId: string
  address: AddressResult | null
  mapRef: React.MutableRefObject<any>
  markerLayerRef: React.MutableRefObject<any>
  polygonLayerRef: React.MutableRefObject<any>
  layoutLayerRef: React.MutableRefObject<any>
  cadastreLayerRef: React.MutableRefObject<any>
  drawingModeRef: React.MutableRefObject<'area' | 'entry'>
  setPoints: React.Dispatch<React.SetStateAction<LatLngPoint[]>>
  setBuildingEntry: React.Dispatch<React.SetStateAction<LatLngPoint | null>>
  setMapReady: React.Dispatch<React.SetStateAction<number>>
}) {
  useEffect(() => {
    if (!address) return

    let destroyed = false

    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then((Lmod) => {
      if (destroyed) return

      const container = document.getElementById(mapId)
      if (!container || (container as any)._leaflet_id) return

      const L = Lmod.default

      const map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([address.lat, address.lng], 19)

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 20,
        }
      ).addTo(map)

      const cadastrePane = map.createPane('cadastre_overlay')
      cadastrePane.style.zIndex = '430'
      cadastrePane.style.pointerEvents = 'none'

      const cadastreLayer = L.featureGroup()
      const markerLayer = L.layerGroup().addTo(map)
      const polygonLayer = L.layerGroup().addTo(map)
      const layoutLayer = L.layerGroup().addTo(map)

      const icon = L.icon({
        iconUrl: '/images/wdd_logo_icon_jaune.svg',
        iconSize: [28, 74],
        iconAnchor: [14, 74],
      })

      L.marker([address.lat, address.lng], { icon }).addTo(map)

      map.on('click', (event: any) => {
        const nextPoint = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        }

        setPoints((prevPoints) => {
          const mode = drawingModeRef.current

          if (mode === 'entry') {
            setBuildingEntry(nextPoint)
            return prevPoints
          }

          return [...prevPoints, nextPoint]
        })
      })

      mapRef.current = map
      cadastreLayerRef.current = cadastreLayer
      markerLayerRef.current = markerLayer
      polygonLayerRef.current = polygonLayer
      layoutLayerRef.current = layoutLayer

      setMapReady((value) => value + 1)

      const invalidate = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize({ animate: false })
        }
      }

      requestAnimationFrame(invalidate)
      setTimeout(invalidate, 100)
      setTimeout(invalidate, 300)
      setTimeout(invalidate, 700)
    })

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      destroyed = true

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerLayerRef.current = null
        polygonLayerRef.current = null
        layoutLayerRef.current = null
        cadastreLayerRef.current = null
      }
    }
  }, [
    address,
    mapId,
    mapRef,
    markerLayerRef,
    polygonLayerRef,
    layoutLayerRef,
    cadastreLayerRef,
    drawingModeRef,
    setPoints,
    setBuildingEntry,
    setMapReady,
  ])
}

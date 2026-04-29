'use client'

import { useEffect, useRef, useState } from 'react'

import type { AddressResult } from '../../types'
import { C, F } from '../../theme'

type Borehole = {
  id: string
  label: string
  type: string
  depth: string | null
  lat: number
  lng: number
}

export default function HydroGeoBoreholesMap({
  address,
}: {
  address: AddressResult | null
}) {
  const mapId = 'wdd-hydrogeo-boreholes-map'
  const mapRef = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const [boreholes, setBoreholes] = useState<Borehole[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState('SPW')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    const lat = address.lat
    const lng = address.lng
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          radius: '1500',
        })

        const response = await fetch('/api/hydro-boreholes?' + params.toString())
        const data = await response.json()

        if (!cancelled) {
          setBoreholes(Array.isArray(data.boreholes) ? data.boreholes : [])
          setSource(data.source || 'SPW')
          if (data.error) setError(data.error)
        }
      } catch (e: any) {
        if (!cancelled) {
          setBoreholes([])
          setError(e?.message || 'Impossible de charger les forages proches.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [address])

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
      if (!container) return

      const L = Lmod.default

      if (!mapRef.current) {
        const map = L.map(container, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView([address.lat, address.lng], 14)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap, © SPW',
          maxZoom: 19,
        }).addTo(map)

        const layer = L.layerGroup().addTo(map)

        mapRef.current = map
        layerRef.current = layer

        requestAnimationFrame(() => map.invalidateSize({ animate: false }))
        setTimeout(() => map.invalidateSize({ animate: false }), 250)
      } else {
        mapRef.current.setView([address.lat, address.lng], 14, { animate: false })
      }
    })

    return () => {
      destroyed = true
    }
  }, [address])

  useEffect(() => {
    if (!address || !mapRef.current || !layerRef.current) return

    import('leaflet').then((Lmod) => {
      const L = Lmod.default
      const layer = layerRef.current
      const map = mapRef.current

      layer.clearLayers()

      L.circleMarker([address.lat, address.lng], {
        radius: 8,
        color: '#1A1A1A',
        weight: 2,
        fillColor: '#FFD94F',
        fillOpacity: 1,
      })
        .bindPopup('Projet analysé')
        .addTo(layer)

      L.circle([address.lat, address.lng], {
        radius: 1500,
        color: '#1565C0',
        weight: 1,
        fillColor: '#1565C0',
        fillOpacity: 0.04,
      }).addTo(layer)

      const bounds = L.latLngBounds([[address.lat, address.lng]])

      boreholes.forEach((borehole) => {
        bounds.extend([borehole.lat, borehole.lng])

        const popup = `
          <strong>${borehole.label}</strong><br/>
          ${borehole.type}<br/>
          ${borehole.depth ? 'Profondeur : ' + borehole.depth : 'Profondeur non renseignée'}
        `

        L.circleMarker([borehole.lat, borehole.lng], {
          radius: 5,
          color: '#1565C0',
          weight: 2,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
        })
          .bindPopup(popup)
          .addTo(layer)
      })

      if (boreholes.length > 0) {
        map.fitBounds(bounds.pad(0.22), { animate: false })
      }
    })
  }, [address, boreholes])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        layerRef.current = null
      }
    }
  }, [])

  if (!address) return null

  return (
    <div
      style={{
        marginTop: '18px',
        border: '1px solid ' + C.border,
        background: '#FFFFFF',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid ' + C.border,
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          alignItems: 'baseline',
        }}
      >
        <div>
          <div style={{ fontSize: F.md, fontWeight: 800, color: C.text }}>
            Carte hydrogéologique — forages répertoriés à proximité
          </div>
          <div style={{ fontSize: F.sm, color: C.text4, marginTop: '4px' }}>
            Rayon de recherche : 1,5 km · Source : {source}
          </div>
        </div>

        <div style={{ fontSize: F.sm, color: C.text4, whiteSpace: 'nowrap' }}>
          {loading ? 'Chargement…' : `${boreholes.length} point${boreholes.length > 1 ? 's' : ''}`}
        </div>
      </div>

      <div
        id={mapId}
        style={{
          height: '320px',
          width: '100%',
          background: '#E8E5DE',
        }}
      />

      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid ' + C.border,
          fontSize: F.sm,
          color: C.text3,
          lineHeight: 1.55,
        }}
      >
        {error
          ? `Attention : ${error}. La carte reste disponible, mais les points de forage n’ont pas pu être chargés.`
          : boreholes.length > 0
            ? 'Ces points servent à contextualiser le modèle géologique local. Ils ne remplacent pas une reconnaissance de terrain ou une étude hydrogéologique.'
            : 'Aucun forage public proche n’a été trouvé dans le rayon de recherche. Le modèle reste basé sur les couches géologiques et hydrogéologiques régionales.'}
      </div>
    </div>
  )
}

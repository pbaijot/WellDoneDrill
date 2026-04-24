'use client'
import { useEffect, useRef } from 'react'

const WMS_URL = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'

export default function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((Lmod) => {
      if (!containerRef.current) return
      const L = Lmod.default
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current, { zoomControl: true }).setView([lat, lng], 15)

      const wmsPane = map.createPane('wmsPane')
      wmsPane.style.zIndex = '350'
      wmsPane.style.pointerEvents = 'none'

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      L.tileLayer.wms(WMS_URL, {
        layers: '0,1,2,3',
        format: 'image/png',
        transparent: true,
        opacity: 0.8,
        version: '1.1.1',
        pane: 'wmsPane',
        attribution: '© SPW Wallonie',
      } as any).addTo(map)

      const icon = L.icon({
        iconUrl: '/images/wdd_logo_icon_jaune.svg',
        iconSize: [28, 74],
        iconAnchor: [14, 74],
      })

      L.marker([lat, lng], { icon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng])

  return (
    <div style={{ filter: 'grayscale(1) contrast(0.85) brightness(1.1)', height: '280px', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

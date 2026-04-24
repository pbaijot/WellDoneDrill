'use client'
import { useEffect, useRef } from 'react'

const WMS_CAPTAGE = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'

export default function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((Lmod) => {
      const L = Lmod.default

      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current!).setView([lat, lng], 14)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        className: 'grayscale-tiles',
      }).addTo(map)

      L.tileLayer.wms(WMS_CAPTAGE, {
        layers: '0,1,2,3',
        format: 'image/png',
        transparent: true,
        opacity: 0.7,
        version: '1.3.0',
        attribution: '© SPW Wallonie',
      }).addTo(map)

      const yellowIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:#FFD94F;border:3px solid #1A1A1A;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.4);"></div>',
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker([lat, lng], { icon: yellowIcon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [lat, lng])

  return (
    <div style={{ position: 'relative' }}>
      <style>{'.grayscale-tiles { filter: grayscale(100%) contrast(0.85) brightness(1.1); }'}</style>
      <div ref={containerRef} style={{ height: '280px', width: '100%' }} />
    </div>
  )
}

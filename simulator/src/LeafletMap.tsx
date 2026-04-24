'use client'
import { useEffect, useRef } from 'react'

const WMS_URL = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'

const WDD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.77 233.88" width="28" height="74"><polygon fill="#FFD94F" points="45.03 68.51 50.46 65.79 44.38 65.79 .01 65.79 .01 45.22 45.03 22.73 50.46 20.02 44.38 20.02 .01 20.02 .01 0 88.76 0 88.76 20.57 43.75 43.06 38.31 45.77 44.38 45.77 88.76 45.77 88.76 66.34 43.75 88.83 38.31 91.54 44.38 91.54 88.76 91.54 88.76 111.56 .01 111.56 .01 91 45.03 68.51"/><polygon fill="#FFD94F" points="22.42 212.26 66.35 212.26 44.38 233.88 22.42 212.26"/><path fill="#FFD94F" d="M44.38,190.94l-21.99-21.97v43.28L0,190.23v-22.11h22.39L0,146.11v-22.11h88.77v22.11l-22.39,22.02h22.38v22.08l-22.39,22.02v-43.25l-21.99,21.97ZM66.38,124.85l-21.99,21.97-21.99-21.97v43.28h43.99v-43.28Z"/></svg>`

export default function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    import('leaflet').then((Lmod) => {
      const L = Lmod.default
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(containerRef.current!, { zoomControl: true }).setView([lat, lng], 15)

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

      const icon = L.divIcon({
        html: WDD_SVG,
        className: '',
        iconSize: [28, 74],
        iconAnchor: [14, 74],
      })

      L.marker([lat, lng], { icon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [lat, lng])

  return (
    <div style={{ filter: 'grayscale(1) contrast(0.85) brightness(1.1)', height: '280px', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

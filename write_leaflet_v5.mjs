import { writeFileSync } from 'fs'

const content = `'use client'
import { useEffect, useRef } from 'react'

const WMS_URL = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'

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

      const map = L.map(containerRef.current!, { zoomControl: true }).setView([lat, lng], 14)

      const wmsPane = map.createPane('wmsPane')
      wmsPane.style.zIndex = '350'
      wmsPane.style.pointerEvents = 'none'

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      })
      osmLayer.addTo(map)

      osmLayer.on('load', () => {
        const tilePane = map.getPane('tilePane')
        if (tilePane) {
          tilePane.style.filter = 'grayscale(1) contrast(0.85) brightness(1.05)'
        }
      })

      const tilePane = map.getPane('tilePane')
      if (tilePane) {
        tilePane.style.filter = 'grayscale(1) contrast(0.85) brightness(1.05)'
      }

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
        html: '<div style="width:14px;height:14px;background:#FFD94F;border:3px solid #1A1A1A;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>',
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker([lat, lng], { icon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [lat, lng])

  return <div ref={containerRef} style={{ height: '280px', width: '100%' }} />
}
`
writeFileSync('simulator/src/LeafletMap.tsx', content)
console.log('OK
git add -A && git commit -m "fix: apply grayscale to tilePane directly, wms v1.1.1 in separate pane" && git push
cat > write_leaflet_simple.mjs << 'SCRIPT'
import { writeFileSync } from 'fs'

const content = `'use client'
import { useEffect, useRef } from 'react'

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

      const map = L.map(containerRef.current!).setView([lat, lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#FFD94F;border:3px solid #1A1A1A;border-radius:50%;"></div>',
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker([lat, lng], { icon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [lat, lng])

  return (
    <div style={{ filter: 'grayscale(1)', height: '280px', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
`
writeFileSync('simulator/src/LeafletMap.tsx', content)
console.log('OK')

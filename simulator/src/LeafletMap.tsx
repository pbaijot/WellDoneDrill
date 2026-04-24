'use client'
import { useEffect, useRef } from 'react'

const SPW_WMS_CAPTAGE = 'https://geoservices.wallonie.be/arcgis/services/EAUX/PROT_CAPT/MapServer/WMSServer'
const SPW_WMS_NATURA = 'https://geoservices.wallonie.be/arcgis/services/BIODIVERSITE/NATURA2000/MapServer/WMSServer'

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
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!).setView([lat, lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      L.tileLayer.wms(SPW_WMS_CAPTAGE, {
        layers: '0',
        format: 'image/png',
        transparent: true,
        opacity: 0.5,
        attribution: '© SPW Wallonie',
      }).addTo(map)

      L.tileLayer.wms(SPW_WMS_NATURA, {
        layers: '0',
        format: 'image/png',
        transparent: true,
        opacity: 0.4,
        attribution: '© SPW Wallonie',
      }).addTo(map)

      const yellowIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#FFD94F;border:3px solid #1A1A1A;border-radius:50%;"></div>',
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      L.marker([lat, lng], { icon: yellowIcon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng])

  return <div ref={containerRef} style={{ height: '220px', width: '100%' }} />
}

'use client'
import { useEffect, useRef } from 'react'

const WMS: Record<string, { url: string; layers: string }> = {
  captage:        { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer', layers: '0,1,2,3' },
  pollution:      { url: 'https://geoservices.wallonie.be/arcgis/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer/WMSServer', layers: '0,1' },
  karst:          { url: 'https://geoservices.wallonie.be/arcgis/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer/WMSServer', layers: '0,1,2,3' },
  natura:         { url: 'https://geoservices.wallonie.be/arcgis/services/FAUNE_FLORE/NATURA2000/MapServer/WMSServer', layers: '0' },
  zi:             { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/ZI/MapServer/WMSServer', layers: '0,1,2,3,4,5' },
  alea_inond:     { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/ALEA_INOND/MapServer/WMSServer', layers: '0,1,2' },
  zones_inondees: { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/ZONES_INONDEES/MapServer/WMSServer', layers: '0' },
}

const MAP_ID = 'wdd-leaflet-map'

export default function LeafletMap({ lat, lng, visibleLayers }: {
  lat: number
  lng: number
  visibleLayers: string[]
}) {
  const mapRef = useRef<any>(null)
  const wmsRef = useRef<Record<string, any>>({})

  useEffect(() => {
    let destroyed = false
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    import('leaflet').then((Lmod) => {
      if (destroyed) return
      const container = document.getElementById(MAP_ID)
      if (!container) return
      if ((container as any)._leaflet_id) return
      const L = Lmod.default
      delete (L.Icon.Default.prototype as any)._getIconUrl
      const map = L.map(container, { zoomControl: true }).setView([lat, lng], 15)
      const tilePane = map.getPane('tilePane')
      if (tilePane) tilePane.style.filter = 'grayscale(1) contrast(0.85) brightness(1.05)'
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)
      Object.keys(WMS).forEach((key, i) => {
        const pane = map.createPane('wms_' + key)
        pane.style.zIndex = String(350 + i)
        pane.style.pointerEvents = 'none'
        pane.style.filter = 'none'
      })
      L.icon({ iconUrl: '/images/wdd_logo_icon_jaune.svg', iconSize: [28, 74], iconAnchor: [14, 74] })
      const icon = L.icon({ iconUrl: '/images/wdd_logo_icon_jaune.svg', iconSize: [28, 74], iconAnchor: [14, 74] })
      L.marker([lat, lng], { icon }).addTo(map)
      mapRef.current = map
      visibleLayers.forEach((key) => {
        if (!WMS[key] || wmsRef.current[key]) return
        const wms = (L.tileLayer as any).wms(WMS[key].url, {
          layers: WMS[key].layers, format: 'image/png', transparent: true,
          opacity: 0.75, version: '1.1.1', pane: 'wms_' + key, attribution: '© SPW Wallonie',
        })
        wms.addTo(map)
        wmsRef.current[key] = wms
      })
    })
    return () => {
      destroyed = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; wmsRef.current = {} }
    }
  }, [lat, lng])

  useEffect(() => {
    if (!mapRef.current) return
    import('leaflet').then((Lmod) => {
      const L = Lmod.default
      const map = mapRef.current
      if (!map) return
      Object.keys(wmsRef.current).forEach((key) => {
        if (!visibleLayers.includes(key)) {
          map.removeLayer(wmsRef.current[key])
          delete wmsRef.current[key]
        }
      })
      visibleLayers.forEach((key) => {
        if (wmsRef.current[key] || !WMS[key]) return
        const wms = (L.tileLayer as any).wms(WMS[key].url, {
          layers: WMS[key].layers, format: 'image/png', transparent: true,
          opacity: 0.75, version: '1.1.1', pane: 'wms_' + key, attribution: '© SPW Wallonie',
        })
        wms.addTo(map)
        wmsRef.current[key] = wms
      })
    })
  }, [visibleLayers])

  return (
    <div style={{ height: '280px', width: '100%', overflow: 'hidden', position: 'relative' }}>
      <div id={MAP_ID} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
    </div>
  )
}

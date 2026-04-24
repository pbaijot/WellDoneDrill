'use client'
import { useEffect, useRef } from 'react'

const WMS_URL = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'
const MAP_ID = 'wdd-leaflet-map'
const MAP_HEIGHT = 280

export default function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
  const mapRef = useRef<any>(null)

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

      const wmsPane = map.createPane('wmsPane')
      wmsPane.style.zIndex = '350'
      wmsPane.style.pointerEvents = 'none'
      wmsPane.style.filter = 'none'

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
      destroyed = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng])

  const depths = [
    { label: '0 m', y: 0 },
    { label: '50 m', y: 25 },
    { label: '100 m', y: 50 },
    { label: '150 m', y: 75 },
    { label: '200 m', y: 100 },
  ]

  const layers = [
    { name: 'Sol vegetal', from: 0, to: 4, color: '#8B6F47' },
    { name: 'Limon', from: 4, to: 15, color: '#C4A882' },
    { name: 'Sable', from: 15, to: 35, color: '#D4C5A0' },
    { name: 'Argile', from: 35, to: 70, color: '#9E7B5A' },
    { name: 'Calcaire', from: 70, to: 130, color: '#B8B0A0' },
    { name: 'Schiste', from: 130, to: 200, color: '#6B6560' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: '2px', width: '100%' }}>

      <div style={{ width: '100%', height: MAP_HEIGHT + 'px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <div id={MAP_ID} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      </div>

      <div style={{
        width: '140px',
        flexShrink: 0,
        height: MAP_HEIGHT + 'px',
        display: 'flex',
        flexDirection: 'column',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '5px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Coupe geologique
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>0 — 200 m</div>
        </div>

        <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '28px', flexShrink: 0, position: 'relative' }}>
            {depths.map((d) => (
              <div key={d.label} style={{
                position: 'absolute',
                top: d.y + '%',
                right: '3px',
                transform: 'translateY(-50%)',
                fontSize: '7px',
                color: 'rgba(255,255,255,0.25)',
                whiteSpace: 'nowrap',
              }}>
                {d.label}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            {layers.map((layer) => {
              const top = (layer.from / 200) * 100
              const height = ((layer.to - layer.from) / 200) * 100
              return (
                <div key={layer.name} style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: top + '%',
                  height: height + '%',
                  background: layer.color,
                  opacity: 0.75,
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '5px',
                  boxSizing: 'border-box',
                }}>
                  <span style={{
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {layer.name}
                  </span>
                </div>
              )
            })}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#FFD94F', opacity: 0.6 }} />
          </div>
        </div>

        <div style={{ padding: '4px 8px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.04em' }}>
            Indicatif
          </span>
        </div>
      </div>

    </div>
  )
}

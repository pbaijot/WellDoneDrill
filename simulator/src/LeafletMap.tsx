'use client'
import { useEffect, useRef } from 'react'

const WMS_URL = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'
const MAP_ID = 'wdd-leaflet-map'
const MAP_HEIGHT = 320

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
    { name: 'Sol végétal', from: 0, to: 4, color: '#8B6F47' },
    { name: 'Limon', from: 4, to: 15, color: '#C4A882' },
    { name: 'Sable', from: 15, to: 35, color: '#D4C5A0' },
    { name: 'Argile', from: 35, to: 70, color: '#9E7B5A' },
    { name: 'Calcaire', from: 70, to: 130, color: '#B8B0A0' },
    { name: 'Schiste', from: 130, to: 200, color: '#6B6560' },
  ]

  return (
    <div style={{ display: 'flex', gap: '2px', height: MAP_HEIGHT + 'px', width: '100%' }}>

      <div style={{ flex: '1 1 60%', overflow: 'hidden', position: 'relative', minWidth: 0 }}>
        <div id={MAP_ID} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      </div>

      <div style={{
        flex: '0 0 40%',
        display: 'flex',
        flexDirection: 'column',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        <div style={{
          padding: '6px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Coupe geologique
          </span>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            0 — 200 m
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

          <div style={{ width: '32px', flexShrink: 0, position: 'relative', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            {depths.map((d) => (
              <div key={d.label} style={{
                position: 'absolute',
                top: d.y + '%',
                right: '4px',
                transform: 'translateY(-50%)',
                fontSize: '8px',
                color: 'rgba(255,255,255,0.25)',
                whiteSpace: 'nowrap',
                lineHeight: 1,
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
                  left: 0,
                  right: 0,
                  top: top + '%',
                  height: height + '%',
                  background: layer.color,
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '6px',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  boxSizing: 'border-box',
                }}>
                  <span style={{
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {layer.name}
                  </span>
                </div>
              )
            })}

            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '2px',
              background: '#FFD94F',
              opacity: 0.6,
            }} />
          </div>

          <div style={{ width: '6px', flexShrink: 0, position: 'relative' }}>
            {depths.slice(1).map((d) => (
              <div key={d.label} style={{
                position: 'absolute',
                top: d.y + '%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
              }} />
            ))}
          </div>
        </div>

        <div style={{
          padding: '5px 10px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            Données indicatives — a adapter
          </span>
        </div>

      </div>
    </div>
  )
}

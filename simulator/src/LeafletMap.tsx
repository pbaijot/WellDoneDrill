'use client'

import { useEffect, useRef, useState } from 'react'
import { C, regulatoryMapStyles } from './theme'

const MAP_ID = 'wdd-leaflet-map'

type LayerStatus = 'loading' | 'inside' | 'outside' | 'error'

type RegulatoryLayer = {
  id: string
  label: string
  outsideLabel: string
  insideLabel: string
  errorLabel: string
  wmsUrl: string
  layers: string
  opacity: number
  defaultVisible: boolean
}

const REGULATORY_LAYERS: RegulatoryLayer[] = [
  {
    id: 'captage',
    label: 'Zone de prévention de captage',
    outsideLabel: 'Hors zone de prévention de captage',
    insideLabel: 'Adresse située dans une zone de prévention de captage',
    errorLabel: 'Vérification impossible pour la zone de prévention de captage',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer',
    layers: '0,1,2,3',
    opacity: 0.85,
    defaultVisible: true,
  },
  {
    id: 'bdes',
    label: 'Pollution des sols (BDES)',
    outsideLabel: 'Aucune parcelle BDES détectée à cette adresse',
    insideLabel: 'Adresse située sur une parcelle reprise à la BDES',
    errorLabel: 'Vérification impossible pour la BDES',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer/WMSServer',
    layers: '0,1',
    opacity: 0.75,
    defaultVisible: false,
  },
  {
    id: 'karst',
    label: 'Contraintes karstiques',
    outsideLabel: 'Hors périmètre de contrainte karstique',
    insideLabel: 'Adresse située dans un périmètre de contrainte karstique',
    errorLabel: 'Vérification impossible pour les contraintes karstiques',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer/WMSServer',
    layers: '0',
    opacity: 0.75,
    defaultVisible: false,
  },
  {
    id: 'natura',
    label: 'Natura 2000',
    outsideLabel: 'Hors périmètre Natura 2000',
    insideLabel: 'Adresse située dans un périmètre Natura 2000',
    errorLabel: 'Vérification impossible pour Natura 2000',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/FAUNE_FLORE/NATURA2000/MapServer/WMSServer',
    layers: '1,2',
    opacity: 0.65,
    defaultVisible: false,
  },
  {
    id: 'inondable',
    label: 'Zone inondable',
    outsideLabel: 'Hors zone inondable identifiée',
    insideLabel: 'Adresse située dans une zone inondable',
    errorLabel: 'Vérification impossible pour les zones inondables',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/EAU/ZI/MapServer/WMSServer',
    layers: '5,6,8',
    opacity: 0.7,
    defaultVisible: false,
  },
]

function getStatusSymbol(status: LayerStatus) {
  if (status === 'inside') return '×'
  if (status === 'outside') return '✓'
  if (status === 'error') return '!'
  return '…'
}

function getStatusColor(status: LayerStatus) {
  if (status === 'inside') return C.red
  if (status === 'outside') return C.green
  if (status === 'error') return C.orange
  return C.text4
}

function getStatusText(layer: RegulatoryLayer, status: LayerStatus) {
  if (status === 'inside') return layer.insideLabel
  if (status === 'outside') return layer.outsideLabel
  if (status === 'error') return layer.errorLabel
  return 'Vérification en cours...'
}

function hasFeatureInfoResult(text: string) {
  const raw = text.trim()
  const normalized = raw.toLowerCase()

  if (!normalized) return false
  if (normalized === '{}') return false
  if (normalized === '[]') return false

  const emptyMarkers = [
    'no features were found',
    'no features found',
    'feature count: 0',
    'numberoffeatures="0"',
    'numbermatched="0"',
    'totalfeatures="0"',
    'aucun résultat',
    'aucun resultat',
    'aucun élément',
    'aucun element',
    'aucune entité',
    'aucune entite',
  ]

  if (emptyMarkers.some((marker) => normalized.includes(marker))) {
    return false
  }

  try {
    const json = JSON.parse(raw)
    if (Array.isArray(json.features)) return json.features.length > 0
    if (Array.isArray(json.results)) return json.results.length > 0
    return false
  } catch {
    // Certains services WMS renvoient du HTML, XML ou texte.
  }

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i)

  if (bodyMatch) {
    const bodyText = bodyMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
      .toLowerCase()

    if (!bodyText) return false
    return !emptyMarkers.some((marker) => bodyText.includes(marker))
  }

  return (
    /<gml:featuremember[\s>]/i.test(raw) ||
    /<featuremember[\s>]/i.test(raw) ||
    /<[^>]*(objectid|fid|shape|geom|geometry)[^>]*>/i.test(raw)
  )
}

async function checkPointInLayer(
  L: any,
  map: any,
  layer: RegulatoryLayer,
  lat: number,
  lng: number
): Promise<LayerStatus> {
  const bounds = map.getBounds()
  const size = map.getSize()
  const point = map.latLngToContainerPoint(L.latLng(lat, lng))

  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetFeatureInfo',
    layers: layer.layers,
    query_layers: layer.layers,
    styles: '',
    bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
    srs: 'EPSG:4326',
    width: String(Math.round(size.x)),
    height: String(Math.round(size.y)),
    x: String(Math.round(point.x)),
    y: String(Math.round(point.y)),
    info_format: 'application/json',
    feature_count: '10',
  })

  try {
    const response = await fetch(`${layer.wmsUrl}?${params.toString()}`)
    const text = await response.text()
    return hasFeatureInfoResult(text) ? 'inside' : 'outside'
  } catch {
    return 'error'
  }
}

export default function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
  const mapRef = useRef<any>(null)
  const wmsLayersRef = useRef<Record<string, any>>({})

  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(REGULATORY_LAYERS.map((layer) => [layer.id, layer.defaultVisible]))
  )

  const [statuses, setStatuses] = useState<Record<string, LayerStatus>>(() =>
    Object.fromEntries(REGULATORY_LAYERS.map((layer) => [layer.id, 'loading']))
  )

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
      if (tilePane) {
        tilePane.style.filter = 'grayscale(1) contrast(0.85) brightness(1.05)'
      }

      const wmsPane = map.createPane('wmsPane')
      wmsPane.style.zIndex = '350'
      wmsPane.style.pointerEvents = 'none'
      wmsPane.style.filter = 'none'

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap, © SPW Wallonie',
        maxZoom: 19,
      }).addTo(map)

      REGULATORY_LAYERS.forEach((layer) => {
        const wmsLayer = L.tileLayer.wms(layer.wmsUrl, {
          layers: layer.layers,
          format: 'image/png',
          transparent: true,
          opacity: layer.opacity,
          version: '1.1.1',
          pane: 'wmsPane',
        } as any)

        wmsLayersRef.current[layer.id] = wmsLayer

        if (layer.defaultVisible) {
          wmsLayer.addTo(map)
        }
      })

      const icon = L.icon({
        iconUrl: '/images/wdd_logo_icon_jaune.svg',
        iconSize: [28, 74],
        iconAnchor: [14, 74],
      })

      L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(map)

      map.whenReady(() => {
        setStatuses(
          Object.fromEntries(REGULATORY_LAYERS.map((layer) => [layer.id, 'loading']))
        )

        Promise.all(
          REGULATORY_LAYERS.map(async (layer) => {
            const status = await checkPointInLayer(L, map, layer, lat, lng)
            return [layer.id, status] as const
          })
        ).then((results) => {
          if (!destroyed) {
            setStatuses(Object.fromEntries(results))
          }
        })
      })

      mapRef.current = map
    })

    return () => {
      destroyed = true

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      wmsLayersRef.current = {}
    }
  }, [lat, lng])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    Object.entries(visibleLayers).forEach(([id, visible]) => {
      const layer = wmsLayersRef.current[id]
      if (!layer) return

      const isOnMap = map.hasLayer(layer)

      if (visible && !isOnMap) layer.addTo(map)
      if (!visible && isOnMap) map.removeLayer(layer)
    })
  }, [visibleLayers])

  return (
    <div>
      <div style={regulatoryMapStyles.mapFrame()}>
        <div id={MAP_ID} style={regulatoryMapStyles.mapCanvas()} />
      </div>

      <div style={regulatoryMapStyles.legendWrapper()}>
        <div style={regulatoryMapStyles.legendTitle()}>
          Diagnostic réglementaire — cliquez pour visualiser
        </div>

        <div style={regulatoryMapStyles.legendList()}>
          {REGULATORY_LAYERS.map((layer) => {
            const status = statuses[layer.id] ?? 'loading'
            const visible = visibleLayers[layer.id]
            const color = getStatusColor(status)

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() =>
                  setVisibleLayers((current) => ({
                    ...current,
                    [layer.id]: !current[layer.id],
                  }))
                }
                style={regulatoryMapStyles.legendItem(visible, color)}
                aria-pressed={visible}
              >
                <span style={regulatoryMapStyles.statusSymbol(color)}>
                  {getStatusSymbol(status)}
                </span>

                <span>
                  <span style={regulatoryMapStyles.itemTitle()}>{layer.label}</span>
                  <span style={regulatoryMapStyles.itemSubtitle()}>
                    {getStatusText(layer, status)}
                  </span>
                </span>

                <span
                  title={visible ? 'Couche visible' : 'Couche masquée'}
                  style={regulatoryMapStyles.visibilityDot(visible, color)}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

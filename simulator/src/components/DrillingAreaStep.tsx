'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { AddressResult } from '../types'
import { PrimaryBtn } from './Shared'
import type { DrillingAreaResult, GeneratedBoreholeLayout, LatLngPoint } from './drilling-area/types'
import {
  estimateBoreholeCapacity,
  formatArea,
  generateBoreholeLayout,
  polygonAreaM2,
} from './drilling-area/calculations'
import { S } from './drilling-area/styles'
import FullscreenMapLayout from './layout/FullscreenMapLayout'

const MAP_ID = 'wdd-drilling-area-map'
const DEFAULT_SPACING_M = 8

const CADASTRE_REST_BASE =
  'https://geoservices.wallonie.be/arcgis/rest/services/PLAN_REGLEMENT/CADMAP_2024_PARCELLES/MapServer'

const CADASTRE_SEARCH_DELTA_DEG = 0.004

function cadastreQueryUrl(layerId: 0 | 1, lat: number, lng: number) {
  const params = new URLSearchParams({
    f: 'geojson',
    where: '1=1',
    outFields: '*',
    returnGeometry: 'true',
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    outSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    geometry: JSON.stringify({
      xmin: lng - CADASTRE_SEARCH_DELTA_DEG,
      ymin: lat - CADASTRE_SEARCH_DELTA_DEG,
      xmax: lng + CADASTRE_SEARCH_DELTA_DEG,
      ymax: lat + CADASTRE_SEARCH_DELTA_DEG,
      spatialReference: { wkid: 4326 },
    }),
  })

  return `${CADASTRE_REST_BASE}/${layerId}/query?${params.toString()}`
}

function cadastreParcelStyle() {
  return {
    color: '#FFFFFF',
    weight: 1.6,
    opacity: 0.95,
    fillOpacity: 0,
  }
}

function cadastreBuildingStyle() {
  return {
    color: '#FFD94F',
    weight: 1.5,
    opacity: 0.95,
    fillColor: '#FFD94F',
    fillOpacity: 0.18,
  }
}

type DrawingMode = 'area' | 'entry'

export default function DrillingAreaStep({
  address,
  onConfirm,
}: {
  address: AddressResult | null
  onConfirm: (result: DrillingAreaResult | null) => void
}) {
  const mapRef = useRef<any>(null)
  const markerLayerRef = useRef<any>(null)
  const polygonLayerRef = useRef<any>(null)
  const layoutLayerRef = useRef<any>(null)
  const cadastreLayerRef = useRef<any>(null)

  const [points, setPoints] = useState<LatLngPoint[]>([])
  const [buildingEntry, setBuildingEntry] = useState<LatLngPoint | null>(null)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('area')
  const [requestedBoreholes, setRequestedBoreholes] = useState(3)
  const [spacingM, setSpacingM] = useState(DEFAULT_SPACING_M)
  const [collectorCount, setCollectorCount] = useState(0)
  const [collectorOverrides, setCollectorOverrides] = useState<Record<string, LatLngPoint>>({})
  const [showCadastre, setShowCadastre] = useState(true)
  const [mapReady, setMapReady] = useState(0)

  const areaM2 = useMemo(() => polygonAreaM2(points), [points])

  const estimatedBoreholes = useMemo(
    () => estimateBoreholeCapacity(areaM2, spacingM),
    [areaM2, spacingM]
  )

  const generatedLayout = useMemo<GeneratedBoreholeLayout | null>(() => {
    return generateBoreholeLayout({
      polygon: points,
      buildingEntry,
      requestedBoreholes,
      spacingM,
      collectorCount,
      collectorOverrides,
    })
  }, [points, buildingEntry, requestedBoreholes, spacingM, collectorCount, collectorOverrides])

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

      const container = document.getElementById(MAP_ID)
      if (!container || (container as any)._leaflet_id) return

      const L = Lmod.default

      const map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([address.lat, address.lng], 19)

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 20,
        }
      ).addTo(map)

      const cadastrePane = map.createPane('cadastre_overlay')
      cadastrePane.style.zIndex = '430'
      cadastrePane.style.pointerEvents = 'none'

      const cadastreLayer = L.featureGroup()

      const markerLayer = L.layerGroup().addTo(map)
      const polygonLayer = L.layerGroup().addTo(map)
      const layoutLayer = L.layerGroup().addTo(map)

      const icon = L.icon({
        iconUrl: '/images/wdd_logo_icon_jaune.svg',
        iconSize: [28, 74],
        iconAnchor: [14, 74],
      })

      L.marker([address.lat, address.lng], { icon }).addTo(map)

      map.on('click', (event: any) => {
        const nextPoint = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        }

        setPoints((prevPoints) => {
          const mode = (window as any).__wddDrillingDrawingMode || 'area'

          if (mode === 'entry') {
            setBuildingEntry(nextPoint)
            return prevPoints
          }

          return [...prevPoints, nextPoint]
        })
      })

      mapRef.current = map
      cadastreLayerRef.current = cadastreLayer
      markerLayerRef.current = markerLayer
      polygonLayerRef.current = polygonLayer
      layoutLayerRef.current = layoutLayer

      setMapReady((value) => value + 1)

      setTimeout(() => {
        map.invalidateSize()
      }, 150)
    })

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      destroyed = true

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerLayerRef.current = null
        polygonLayerRef.current = null
        layoutLayerRef.current = null
        cadastreLayerRef.current = null
      }
    }
  }, [address])

  useEffect(() => {
    ;(window as any).__wddDrillingDrawingMode = drawingMode
  }, [drawingMode])

  useEffect(() => {
    const map = mapRef.current
    const cadastreLayer = cadastreLayerRef.current

    if (!map || !cadastreLayer || !address) return

    if (!showCadastre) {
      if (map.hasLayer(cadastreLayer)) {
        map.removeLayer(cadastreLayer)
      }
      return
    }

    if (!map.hasLayer(cadastreLayer)) {
      cadastreLayer.addTo(map)
    }

    import('leaflet').then(async (Lmod) => {
      const L = Lmod.default

      try {
        cadastreLayer.clearLayers()

        const [parcelsRes, buildingsRes] = await Promise.all([
          fetch(cadastreQueryUrl(0, address.lat, address.lng)),
          fetch(cadastreQueryUrl(1, address.lat, address.lng)),
        ])

        const [parcels, buildings] = await Promise.all([
          parcelsRes.json(),
          buildingsRes.json(),
        ])

        L.geoJSON(parcels, { style: cadastreParcelStyle, pane: 'cadastre_overlay' } as any).addTo(cadastreLayer)
        L.geoJSON(buildings, { style: cadastreBuildingStyle, pane: 'cadastre_overlay' } as any).addTo(cadastreLayer)

        map.invalidateSize()
      } catch (error) {
        console.warn('Impossible de charger le cadastre CADGIS', error)
      }
    })
  }, [showCadastre, address, mapReady])

  useEffect(() => {
    const markers = markerLayerRef.current
    const polygons = polygonLayerRef.current

    if (!markers || !polygons) return

    import('leaflet').then((Lmod) => {
      const L = Lmod.default

      markers.clearLayers()
      polygons.clearLayers()

      if (points.length >= 2) {
        L.polyline(points.map((point) => [point.lat, point.lng]), {
          color: '#FFD94F',
          weight: 3,
          opacity: 0.95,
        }).addTo(polygons)
      }

      if (points.length >= 3) {
        L.polygon(points.map((point) => [point.lat, point.lng]), {
          color: '#1A1A1A',
          weight: 2,
          fillColor: '#FFD94F',
          fillOpacity: 0.28,
        }).addTo(polygons)
      }

      if (buildingEntry) {
        L.circleMarker([buildingEntry.lat, buildingEntry.lng], {
          radius: 8,
          color: '#FFFFFF',
          weight: 2,
          fillColor: '#D12B2B',
          fillOpacity: 1,
        })
          .addTo(markers)
      }
    })
  }, [points, buildingEntry])

  useEffect(() => {
    const layoutLayer = layoutLayerRef.current

    if (!layoutLayer) return

    import('leaflet').then((Lmod) => {
      const L = Lmod.default

      layoutLayer.clearLayers()

      if (!generatedLayout) return

      generatedLayout.connections.forEach((connection) => {
        L.polyline(
          [
            [connection.from.lat, connection.from.lng],
            [connection.to.lat, connection.to.lng],
          ],
          {
            color: connection.type === 'collector-to-building' ? '#D12B2B' : '#1A1A1A',
            weight: connection.type === 'collector-to-building' ? 3 : 1.5,
            opacity: 0.9,
            dashArray: connection.type === 'collector-to-building' ? undefined : '3 5',
          }
        ).addTo(layoutLayer)
      })

      generatedLayout.boreholes.forEach((borehole) => {
        L.circleMarker([borehole.lat, borehole.lng], {
          radius: 4,
          color: '#1A1A1A',
          weight: 1.5,
          fillColor: '#FFD94F',
          fillOpacity: 1,
        })
          .addTo(layoutLayer)
      })

      generatedLayout.collectors.forEach((collector) => {
        const collectorIcon = L.divIcon({
          className: 'wdd-collector-marker',
          html: '<div style="width:18px;height:18px;border-radius:999px;background:#6A1B9A;border:3px solid #FFFFFF;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const collectorMarker = L.marker(
          [collector.lat, collector.lng],
          {
            icon: collectorIcon,
            draggable: true,
          }
        )
          .addTo(layoutLayer)

        collectorMarker.on('dragend', (event: any) => {
          const position = event.target.getLatLng()

          setCollectorOverrides((prev) => ({
            ...prev,
            [collector.id]: {
              lat: position.lat,
              lng: position.lng,
            },
          }))
        })
      })
    })
  }, [generatedLayout])

  function clearDrawing() {
    setPoints([])
    setBuildingEntry(null)
    setCollectorOverrides({})
    setDrawingMode('area')
  }

  function undoLastPoint() {
    if (drawingMode === 'entry' && buildingEntry) {
      setBuildingEntry(null)
      return
    }

    setPoints((prev) => prev.slice(0, -1))
  }

  function confirm() {
    if (points.length < 3) {
      onConfirm(null)
      return
    }

    onConfirm({
      areaM2,
      estimatedBoreholes,
      requestedBoreholes,
      spacingM,
      collectorCount,
      points,
      buildingEntry,
      layout: generatedLayout,
    })
  }

  if (!address) {
    return (
      <div>
        <div style={S.intro()}>
          Aucune adresse n’est disponible pour définir la zone de forage.
        </div>
        <PrimaryBtn onClick={() => onConfirm(null)}>Continuer</PrimaryBtn>
      </div>
    )
  }

  const isCapacityTooLow = requestedBoreholes > estimatedBoreholes

  return (
    <FullscreenMapLayout
      navOffsetPx={96}
      leftOffsetPx={56}
      topOffsetPx={30}
      rightPanelWidthPx={320}
      map={
        <div style={S.mapShell()}>
          <div id={MAP_ID} style={S.map()} />
        </div>
      }
      leftOverlay={
        <div style={S.intro()}>
          Tracez d’abord la zone disponible pour le forage, puis placez le point d’entrée dans le bâtiment. Le simulateur propose ensuite automatiquement l’implantation des sondes et les liaisons horizontales.
        </div>
      }
      rightPanel={
        <>
          <div style={S.panelTitle()}>Implantation des sondes</div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Surcouches carte</div>
            <button
              type="button"
              style={{
                ...S.secondaryButton(),
                width: '100%',
                background: showCadastre ? '#FFFDF0' : '#FFFFFF',
                borderColor: showCadastre ? '#E6C200' : '#DDD8CF',
              }}
              onClick={() => setShowCadastre((value) => !value)}
            >
              {showCadastre ? 'Cadastre / bâtiments : ON' : 'Cadastre / bâtiments : OFF'}
            </button>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Mode de dessin</div>
            <div style={{ display: 'grid', gap: '6px' }}>
              <button
                type="button"
                style={{
                  ...S.secondaryButton(),
                  background: drawingMode === 'area' ? '#FFFDF0' : '#FFFFFF',
                  borderColor: drawingMode === 'area' ? '#E6C200' : '#DDD8CF',
                }}
                onClick={() => setDrawingMode('area')}
              >
                1. Tracer la zone de forage
              </button>

              <button
                type="button"
                style={{
                  ...S.secondaryButton(),
                  background: drawingMode === 'entry' ? '#FFFDF0' : '#FFFFFF',
                  borderColor: drawingMode === 'entry' ? '#E6C200' : '#DDD8CF',
                }}
                onClick={() => setDrawingMode('entry')}
                disabled={points.length < 3}
              >
                2. Placer l’entrée bâtiment
              </button>
            </div>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Surface sélectionnée</div>
            <div style={S.metricValue()}>{formatArea(areaM2)}</div>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Capacité indicative</div>
            <div style={S.metricValue()}>{estimatedBoreholes} sondes</div>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Nombre de sondes à implanter</div>
            <input
              type="number"
              min={1}
              max={99}
              value={requestedBoreholes}
              onChange={(event) => setRequestedBoreholes(Math.max(1, Number(event.target.value || 1)))}
              style={{
                width: '100%',
                border: '1px solid #DDD8CF',
                padding: '10px 12px',
                fontSize: '18px',
                fontWeight: 800,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Nombre de collecteurs</div>
            <input
              type="number"
              min={0}
              max={12}
              step={1}
              value={collectorCount}
              onChange={(event) => {
                const next = Math.max(0, Math.floor(Number(event.target.value || 0)))
                setCollectorCount(next)
                if (next === 0) setCollectorOverrides({})
              }}
              style={{
                width: '100%',
                border: '1px solid #DDD8CF',
                padding: '10px 12px',
                fontSize: '18px',
                fontWeight: 800,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '10px', color: '#9A9088', marginTop: '4px' }}>
              0 = toutes les sondes sont ramenées directement à l’entrée bâtiment.
            </div>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Interdistance entre sondes</div>
            <input
              type="number"
              min={4}
              max={25}
              step={0.5}
              value={spacingM}
              onChange={(event) => setSpacingM(Math.max(4, Number(event.target.value || DEFAULT_SPACING_M)))}
              style={{
                width: '100%',
                border: '1px solid #DDD8CF',
                padding: '10px 12px',
                fontSize: '18px',
                fontWeight: 800,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '10px', color: '#9A9088', marginTop: '4px' }}>
              Valeur indicative : 8 m. L’implantation est recalculée automatiquement.
            </div>
          </div>

          <div style={S.metric()}>
            <div style={S.metricLabel()}>Schéma généré</div>
            <div style={S.metricValue()}>
              {generatedLayout
                ? generatedLayout.mode === 'collector'
                  ? `${collectorCount} collecteur${collectorCount > 1 ? 's' : ''}`
                  : 'Direct'
                : '—'}
            </div>
          </div>

          {isCapacityTooLow && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              border: '1px solid #E65100',
              borderLeft: '3px solid #E65100',
              background: '#FFF5F2',
              fontSize: '12px',
              lineHeight: 1.5,
              color: '#7A2E00',
            }}>
              Attention : le nombre de sondes demandé dépasse la capacité indicative de la zone sélectionnée.
            </div>
          )}

          <div style={S.help()}>
            Si le nombre de collecteurs est à 0, toutes les sondes sont ramenées directement à l’entrée bâtiment. Si un ou plusieurs collecteurs sont ajoutés, les sondes sont regroupées vers ces collecteurs, puis chaque collecteur rejoint l’entrée bâtiment. Les collecteurs peuvent être déplacés manuellement.
          </div>

          <div style={S.buttonRow()}>
            <button type="button" style={S.secondaryButton()} onClick={undoLastPoint}>
              Annuler
            </button>
            <button type="button" style={S.secondaryButton()} onClick={clearDrawing}>
              Effacer
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <PrimaryBtn onClick={confirm}>
              Continuer
            </PrimaryBtn>
          </div>
        </>
      }
    />
  )
}

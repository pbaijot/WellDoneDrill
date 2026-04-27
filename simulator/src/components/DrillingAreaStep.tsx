'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { AddressResult } from '../types'
import { PrimaryBtn } from './Shared'
import type { DrillingAreaResult, GeneratedBoreholeLayout, LatLngPoint } from './drilling-area/types'
import {
  estimateBoreholeCapacity,
  generateBoreholeLayout,
  polygonAreaM2,
} from './drilling-area/calculations'
import { S } from './drilling-area/styles'
import FullscreenMapLayout from './layout/FullscreenMapLayout'
import DrillingAreaPanel from './drilling-area/DrillingAreaPanel'
import { useCadastreLayer } from './drilling-area/useCadastreLayer'
import { useBoreholeLayoutLayer } from './drilling-area/useBoreholeLayoutLayer'
import { useDrillingDrawingLayer } from './drilling-area/useDrillingDrawingLayer'
import { useDrillingLeafletMap } from './drilling-area/useDrillingLeafletMap'

const MAP_ID = 'wdd-drilling-area-map'
const DEFAULT_SPACING_M = 8

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
  const drawingModeRef = useRef<DrawingMode>('area')

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

  useDrillingLeafletMap({
    mapId: MAP_ID,
    address,
    mapRef,
    markerLayerRef,
    polygonLayerRef,
    layoutLayerRef,
    cadastreLayerRef,
    drawingModeRef,
    setPoints,
    setBuildingEntry,
    setMapReady,
  })

  useEffect(() => {
    drawingModeRef.current = drawingMode
  }, [drawingMode])

  useCadastreLayer({
    mapRef,
    cadastreLayerRef,
    center: address,
    showCadastre,
    mapReady,
  })

  useDrillingDrawingLayer({
    markerLayerRef,
    polygonLayerRef,
    points,
    buildingEntry,
  })

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
        <DrillingAreaPanel
          showCadastre={showCadastre}
          setShowCadastre={setShowCadastre}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          pointCount={points.length}
          areaM2={areaM2}
          estimatedBoreholes={estimatedBoreholes}
          requestedBoreholes={requestedBoreholes}
          setRequestedBoreholes={setRequestedBoreholes}
          collectorCount={collectorCount}
          setCollectorCount={setCollectorCount}
          setCollectorOverrides={setCollectorOverrides}
          spacingM={spacingM}
          setSpacingM={setSpacingM}
          defaultSpacingM={DEFAULT_SPACING_M}
          generatedLayout={generatedLayout}
          isCapacityTooLow={isCapacityTooLow}
          onUndo={undoLastPoint}
          onClear={clearDrawing}
          onConfirm={confirm}
        />
      }
    />
  )
}

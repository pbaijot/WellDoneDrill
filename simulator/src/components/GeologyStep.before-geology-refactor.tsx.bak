'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { AddressResult } from '../types'
import { T } from '../i18n/fr'
import { Hint, PrimaryBtn } from './Shared'

type ApiLayer = {
  name: string
  stratigraphicName?: string
  topM: number
  bottomM: number
  type: 'cover' | 'bedrock' | 'aquifer' | 'aquitard' | 'unknown'
  hydroClass: 'aquifer' | 'aquitard' | 'aquiclude' | 'unknown'
  lithology?: 'soil' | 'loam' | 'clay' | 'sand' | 'limestone' | 'schist' | 'sandstone' | 'mixed' | 'unknown'
  lithologyCategory?: 'argile' | 'argile_silt' | 'silt_sable_argile' | 'sable' | 'sable_gravier' | 'craie' | 'schiste_gres_socle' | 'unknown'
  layerType?: 'surface' | 'cover' | 'weathered-zone' | 'bedrock' | 'deep-bedrock' | 'unknown'
  display?: {
    color: string
    textColor: 'light' | 'dark'
    shortLabel: string
    longLabel: string
    hatch: 'none' | 'aquifer' | 'fractured'
  }
  thermalConductivityWmK: number | null
  confidence: 'low' | 'medium' | 'high'
  rationale: string
}

type HydroOverlay = {
  topM: number
  bottomM: number
  mode: 'aquifer' | 'fractured-water-possible' | 'none'
  label: string | null
}

type EvidencePoint = {
  source: 'affleurement' | 'sondage' | 'surface' | 'context' | 'soil'
  distanceM: number | null
  summary: string
}

type GeologyApiResponse = {
  status: 'ok'
  input: {
    depthM: number
    lengthM: number
    radiusM: number
    orientationDeg: number
  }
  regionalContext?: {
    key: string
    label: string
    message: string
  }
  evidence: {
    count: number
    surface: EvidencePoint[]
    soils?: EvidencePoint[]
    affleurements: EvidencePoint[]
    sondages: EvidencePoint[]
  }
  interpretedSection: {
    depthM: number
    confidence: 'low' | 'medium' | 'high'
    confidenceDetails?: {
      level: 'low' | 'medium' | 'high'
      score: number
      reasons: string[]
    }
    layers: ApiLayer[]
  }
  geothermalInterpretation: {
    preliminaryPotential: 'favorable' | 'moderate' | 'unknown'
    message: string
  }
  hydrogeology?: {
    confidence: 'low' | 'medium' | 'high'
    likelyWaterTableDepthM: number | null
    waterMode: 'continuous' | 'fractured' | 'perched' | 'unknown'
    summary: string
    overlays: HydroOverlay[]
  }
  warnings: string[]
  diagnostics?: string[]
}

type LegendBand = {
  index: number
  top: number
  bottom: number
  height: number
  mid: number
}

const PROFILE_HEIGHT_PX = 400

const S = {
  statusBox: (kind: 'loading' | 'error' | 'ok'): React.CSSProperties => ({
    background: kind === 'error' ? '#FFF5F2' : '#F8F5EF',
    border: '1px solid ' + (kind === 'error' ? '#E65100' : '#DDD8CF'),
    borderLeft: '3px solid ' + (kind === 'error' ? '#E65100' : '#E6C200'),
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#4A4540',
    lineHeight: 1.55,
  }),

  sectionTable: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '64px 320px 150px minmax(560px, 1fr)',
    border: '1px solid #DDD8CF',
    background: '#FFFFFF',
    marginTop: '16px',
    marginBottom: '12px',
    overflow: 'hidden',
  }),

  depthHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    borderRight: '1px solid #DDD8CF',
    borderBottom: '1px solid #DDD8CF',
    background: '#F2EFE9',
    position: 'relative',
  }),

  verticalDepthLabel: (): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) rotate(-90deg)',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9A9088',
    whiteSpace: 'nowrap',
  }),

  tableHeader: (): React.CSSProperties => ({
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRight: '1px solid #DDD8CF',
    borderBottom: '1px solid #DDD8CF',
    background: '#F2EFE9',
    fontSize: '13px',
    fontWeight: 700,
    color: '#4A4540',
  }),

  depthAxis: (): React.CSSProperties => ({
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    borderRight: '1px solid #DDD8CF',
    background: '#F2EFE9',
  }),

  depthTick: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    top: (d / max * 100) + '%',
    right: '12px',
    transform: 'translateY(-50%)',
    fontSize: '11px',
    color: '#9A9088',
    fontWeight: 600,
  }),

  sectionCanvas: (): React.CSSProperties => ({
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    borderRight: '1px solid #DDD8CF',
    background: '#F2EFE9',
    overflow: 'hidden',
  }),

  layerBlock: (t: number, b: number, max: number, color: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    background: color,
    borderBottom: '1px solid rgba(0,0,0,0.18)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }),

  layerNumber: (dark?: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '22px',
    height: '22px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: dark ? '#4A4540' : '#FFFFFF',
    background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.42)',
    fontWeight: 800,
    lineHeight: 1,
    boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
  }),

  hydroOverlay: (t: number, b: number, max: number, strong: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    pointerEvents: 'none',
    opacity: strong ? 0.58 : 0.34,
    zIndex: 5,
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.95) 0px, rgba(21,101,192,0.95) 4px, transparent 4px, transparent 15px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.65) 0px, rgba(21,101,192,0.65) 2px, transparent 2px, transparent 14px)',
  }),

  waterLine: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (d / max * 100) + '%',
    borderTop: '2px dashed #1565C0',
    zIndex: 8,
    pointerEvents: 'none',
  }),

  waterLineLabel: (d: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    right: '8px',
    top: (d / max * 100) + '%',
    transform: 'translateY(-110%)',
    zIndex: 12,
    pointerEvents: 'none',
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(21,101,192,0.35)',
    color: '#1565C0',
    fontSize: '9px',
    fontWeight: 800,
    padding: '2px 5px',
    whiteSpace: 'nowrap',
  }),

  lambdaCurveSvg: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    zIndex: 9,
    pointerEvents: 'none',
  }),

  lambdaScale: (): React.CSSProperties => ({
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: '8px',
    height: '18px',
    zIndex: 11,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    pointerEvents: 'none',
  }),

  lambdaScaleTick: (): React.CSSProperties => ({
    width: '1px',
    height: '7px',
    background: 'rgba(209,43,43,0.7)',
  }),

  lambdaScaleLabel: (): React.CSSProperties => ({
    position: 'absolute',
    top: '8px',
    transform: 'translateX(-50%)',
    fontSize: '9px',
    color: '#A33',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  }),

  targetLine: (): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '4px',
    background: '#FFD94F',
    zIndex: 10,
  }),

  connectorColumn: (): React.CSSProperties => ({
    gridColumn: '3',
    gridRow: '2',
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    background: '#FFFFFF',
    borderLeft: '1px solid #DDD8CF',
    borderRight: '1px solid #DDD8CF',
    overflow: 'hidden',
  }),

  connectorSvg: (): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  }),

  connectorLine: (): React.CSSProperties => ({
    fill: 'none',
    stroke: 'rgba(90,82,74,0.72)',
    strokeWidth: 0.65,
    vectorEffect: 'non-scaling-stroke',
  }),

  connectorDepthLabel: (yPct: number): React.CSSProperties => ({
    position: 'absolute',
    right: '8px',
    top: yPct + '%',
    transform: yPct >= 99 ? 'translateY(-100%)' : 'translateY(-50%)',
    zIndex: 5,
    padding: '1px 4px',
    background: '#FFFFFF',
    color: '#6B6057',
    fontSize: '10px',
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }),

  lambdaColumn: (): React.CSSProperties => ({
    gridColumn: '4',
    gridRow: '2',
    position: 'relative',
    height: PROFILE_HEIGHT_PX,
    background: '#FFFFFF',
    overflow: 'hidden',
  }),

  lambdaSeparator: (yPct: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: yPct + '%',
    height: '1px',
    background: '#DDD8CF',
    zIndex: 6,
    pointerEvents: 'none',
  }),

  lambdaRow: (t: number, b: number, max: number): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: (t / max * 100) + '%',
    height: ((b - t) / max * 100) + '%',
    minHeight: '52px',
    display: 'grid',
    gridTemplateColumns: '54px 1fr',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 16px',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 4,
  }),

  lambdaValue: (): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 800,
    color: '#1C1C1C',
    lineHeight: 1.2,
    textAlign: 'right',
  }),

  lambdaLayerName: (): React.CSSProperties => ({
    fontSize: '10px',
    color: '#4A4540',
    lineHeight: 1.22,
    fontWeight: 700,
    marginTop: 0,
  }),

  lambdaLayerDepth: (): React.CSSProperties => ({
    display: 'block',
    fontSize: '9px',
    color: '#9A9088',
    fontWeight: 400,
    marginTop: '1px',
  }),

  legendRow: (): React.CSSProperties => ({
    display: 'flex',
    gap: '18px',
    flexWrap: 'wrap',
    fontSize: '11px',
    color: '#6B6057',
    margin: '10px 0 16px',
    alignItems: 'center',
  }),

  legendItem: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),

  redLineSample: (): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '2px',
    background: '#D12B2B',
  }),

  yellowLineSample: (): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '3px',
    background: '#FFD94F',
  }),

  hydroSample: (strong: boolean): React.CSSProperties => ({
    display: 'inline-block',
    width: '20px',
    height: '12px',
    backgroundImage: strong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.9) 0, rgba(21,101,192,0.9) 3px, transparent 3px, transparent 10px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.58) 0, rgba(21,101,192,0.58) 1px, transparent 1px, transparent 11px)',
  }),

  summaryGrid: (): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  }),

  summaryCard: (): React.CSSProperties => ({
    background: '#F8F5EF',
    border: '1px solid #DDD8CF',
    padding: '16px 18px',
  }),

  summaryLabel: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#9A9088',
    marginBottom: '4px',
  }),

  summaryValue: (color?: string): React.CSSProperties => ({
    fontSize: '22px',
    fontWeight: 700,
    color: color === 'green' ? '#2E7D32' : '#1C1C1C',
    marginBottom: '2px',
  }),

  summarySub: (): React.CSSProperties => ({
    fontSize: '10px',
    color: '#9A9088',
    marginTop: '2px',
  }),

  warning: (): React.CSSProperties => ({
    fontSize: '11px',
    color: '#6B6057',
    lineHeight: 1.6,
    padding: '10px 14px',
    background: '#F8F5EF',
    border: '1px solid #DDD8CF',
    borderLeft: '3px solid #DDD8CF',
    marginBottom: '10px',
  }),
}

function legacyLayerColor(layer: ApiLayer) {
  const name = layer.name.toLowerCase()

  if (name.includes('sol')) return '#947648'
  if (name.includes('limon') || name.includes('argile') || name.includes('altérite')) return '#C9AD84'
  if (name.includes('sable') || name.includes('gravier')) return '#D9C99D'
  if (name.includes('calcaire') || name.includes('carbonat') || name.includes('dolomie') || name.includes('craie')) return '#B9B1A0'
  if (name.includes('schiste') || name.includes('phyllade') || name.includes('socle')) return '#8A5E2F'

  if (layer.type === 'cover') return '#B0A18F'
  if (layer.hydroClass === 'aquifer') return '#8FAE9A'
  if (layer.hydroClass === 'aquitard') return '#8A7A6B'
  return '#9A9088'
}

function layerColor(layer: ApiLayer) {
  return layer.display?.color || legacyLayerColor(layer)
}

function useDarkText(layer: ApiLayer) {
  if (layer.display?.textColor) return layer.display.textColor === 'dark'
  const name = layer.name.toLowerCase()
  return name.includes('sable') || name.includes('calcaire') || name.includes('craie') || name.includes('limon')
}

function layerLongLabel(layer: ApiLayer) {
  return layer.display?.longLabel || layer.name
}


function lithologyTextLabel(layer: ApiLayer) {
  switch (layer.lithologyCategory) {
    case 'argile':
      return 'Argile'
    case 'argile_silt':
      return 'Argile / silt'
    case 'silt_sable_argile':
      return 'Silt / sable et argile'
    case 'sable':
      return 'Sable'
    case 'sable_gravier':
      return 'Sable et gravier'
    case 'craie':
      return 'Craie'
    case 'schiste_gres_socle':
      return 'Schiste et grès, roche de socle'
    default:
      switch (layer.lithology) {
        case 'soil':
          return 'Sol / couverture superficielle'
        case 'loam':
          return 'Limon / lœss'
        case 'clay':
          return 'Argile'
        case 'sand':
          return 'Sable'
        case 'limestone':
          return 'Calcaire / craie'
        case 'schist':
          return 'Schiste'
        case 'sandstone':
          return 'Grès'
        case 'mixed':
          return 'Lithologie mixte'
        default:
          return 'Lithologie à confirmer'
      }
  }
}

function hydroLabel(value: ApiLayer['hydroClass']) {
  if (value === 'aquifer') return 'aquifère'
  if (value === 'aquitard') return 'aquitard'
  if (value === 'aquiclude') return 'aquiclude'
  return 'hydrogéologie à confirmer'
}

function confidenceLabel(value: 'low' | 'medium' | 'high') {
  if (value === 'high') return 'Élevée'
  if (value === 'medium') return 'Moyenne'
  return 'Faible'
}

function potentialLabel(value: 'favorable' | 'moderate' | 'unknown') {
  if (value === 'favorable') return 'Favorable'
  if (value === 'moderate') return 'Modéré'
  return 'À confirmer'
}

function weightedLambda(layers: ApiLayer[], maxDepth: number) {
  let weighted = 0
  let total = 0

  for (const layer of layers) {
    if (!layer.thermalConductivityWmK) continue

    const top = Math.max(0, layer.topM)
    const bottom = Math.min(maxDepth, layer.bottomM)
    const thickness = Math.max(0, bottom - top)

    weighted += thickness * layer.thermalConductivityWmK
    total += thickness
  }

  return total > 0 ? weighted / total : null
}

function initialGroundTemperature(maxDepth: number) {
  return maxDepth >= 200 ? 13.5 : 12.5
}

function extractionEstimate(lambda: number | null) {
  if (lambda === null) return null
  if (lambda >= 2.6) return 6.5
  if (lambda >= 2.2) return 6
  if (lambda >= 1.8) return 5
  return 4
}

function lambdaAtDepth(layers: ApiLayer[], depthM: number) {
  const sorted = [...layers].sort((a, b) => a.topM - b.topM)

  const layer =
    sorted.find((l) => depthM >= l.topM && depthM < l.bottomM) ||
    sorted.find((l) => depthM >= l.topM && depthM <= l.bottomM) ||
    sorted[sorted.length - 1]

  return layer?.thermalConductivityWmK || 2
}

function cumulativeLambdaAtDepth(layers: ApiLayer[], depthM: number) {
  if (depthM <= 0) return lambdaAtDepth(layers, 0)

  let weighted = 0
  let total = 0

  for (const layer of layers) {
    if (!layer.thermalConductivityWmK) continue

    const top = Math.max(0, layer.topM)
    const bottom = Math.min(depthM, layer.bottomM)
    const thickness = Math.max(0, bottom - top)

    if (thickness <= 0) continue

    weighted += thickness * layer.thermalConductivityWmK
    total += thickness
  }

  return total > 0 ? weighted / total : lambdaAtDepth(layers, depthM)
}

function lambdaCurvePoints(layers: ApiLayer[], maxDepth: number) {
  const sampleCount = 80
  const points: Array<[number, number]> = []

  const addPoint = (depth: number) => {
    const safeDepth = Math.max(0, Math.min(maxDepth, depth))
    const lambda = cumulativeLambdaAtDepth(layers, safeDepth)

    // Échelle visuelle : 1.0 à 3.6 W/mK
    const normalized = Math.max(0, Math.min(1, (lambda - 1.0) / 2.6))
    const x = 24 + normalized * 54
    const y = (safeDepth / maxDepth) * 100

    points.push([x, y])
  }

  for (let i = 0; i <= sampleCount; i++) {
    addPoint((i / sampleCount) * maxDepth)
  }

  // Sécurité : la courbe doit toujours descendre jusqu'à la profondeur cible.
  const last = points[points.length - 1]
  if (!last || Math.abs(last[1] - 100) > 0.01) {
    addPoint(maxDepth)
  } else {
    last[1] = 100
  }

  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

function shouldShowWaterLine(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro) return false
  if (hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) return false
  return hydro.waterMode === 'continuous' || hydro.waterMode === 'perched'
}

function hydroLineLabel(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro || hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) return null
  if (!shouldShowWaterLine(data)) return null
  return `niveau indicatif ~${Math.round(hydro.likelyWaterTableDepthM)} m`
}

function computeLegendBands(layers: ApiLayer[], maxDepth: number): LegendBand[] {
  const minBandPct = 8.5

  const realBoundaries = [
    layers.length ? (layers[0].topM / maxDepth) * 100 : 0,
    ...layers.map((layer) => (layer.bottomM / maxDepth) * 100),
  ].map((v) => Math.max(0, Math.min(100, v)))

  const visualBoundaries: number[] = [0]

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]

    const contentLength =
      layerLongLabel(layer).length +
      String(layer.stratigraphicName || '').length +
      hydroLabel(layer.hydroClass).length

    const textHeight =
      contentLength > 170
        ? 15
        : contentLength > 110
        ? 12
        : minBandPct

    const minHeight = Math.max(minBandPct, textHeight)
    const realBottom = realBoundaries[i + 1] ?? 100
    const minBottom = visualBoundaries[i] + minHeight

    visualBoundaries[i + 1] = Math.max(realBottom, minBottom)
  }

  if (visualBoundaries.length > 0) {
    visualBoundaries[visualBoundaries.length - 1] = 100
  }

  for (let i = visualBoundaries.length - 2; i >= 1; i--) {
    const maxAllowed = visualBoundaries[i + 1] - minBandPct
    if (visualBoundaries[i] > maxAllowed) {
      visualBoundaries[i] = maxAllowed
    }
  }

  for (let i = 1; i < visualBoundaries.length - 1; i++) {
    const minAllowed = visualBoundaries[i - 1] + 6.5
    if (visualBoundaries[i] < minAllowed) {
      visualBoundaries[i] = minAllowed
    }
  }

  return layers.map((_, index) => {
    const top = Math.max(0, Math.min(100, visualBoundaries[index]))
    const bottom = Math.max(top + 4, Math.min(100, visualBoundaries[index + 1]))
    const height = bottom - top

    return {
      index,
      top,
      bottom,
      height,
      mid: top + height / 2,
    }
  })
}

function bandForLayer(bands: LegendBand[], index: number): LegendBand {
  return bands.find((band) => band.index === index) || {
    index,
    top: 0,
    bottom: 10,
    height: 10,
    mid: 5,
  }
}

function connectorPath(layer: ApiLayer, index: number, maxDepth: number, bands: LegendBand[]) {
  const y1 = Math.max(0, Math.min(100, (layer.bottomM / maxDepth) * 100))
  const y2 = bandForLayer(bands, index).bottom

  return `M 0 ${y1} L 14 ${y1} C 42 ${y1}, 58 ${y2}, 86 ${y2} L 100 ${y2}`
}

function connectorDepthLabel(layer: ApiLayer) {
  return `-${Math.round(layer.bottomM)} m`
}

function lithologyPatternStyle(category: ApiLayer['lithologyCategory']): React.CSSProperties {
  const line = 'rgba(26,26,26,0.42)'
  const dot = 'rgba(26,26,26,0.55)'
  const soft = 'rgba(255,255,255,0.18)'

  switch (category) {
    case 'argile':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 8px, ${line} 8px, ${line} 9px)`,
      }
    case 'argile_silt':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 10px, ${line} 10px, ${line} 11px), radial-gradient(${dot} 1px, transparent 1px)`,
        backgroundSize: 'auto, 12px 12px',
      }
    case 'silt_sable_argile':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 13px, ${line} 13px, ${line} 14px), radial-gradient(${dot} 1px, transparent 1px)`,
        backgroundSize: 'auto, 9px 9px',
      }
    case 'sable':
      return {
        backgroundImage: `radial-gradient(${dot} 1.2px, transparent 1.2px)`,
        backgroundSize: '9px 9px',
      }
    case 'sable_gravier':
      return {
        backgroundImage: `radial-gradient(${dot} 1.2px, transparent 1.2px), radial-gradient(${soft} 3px, transparent 3px), radial-gradient(${line} 2px, transparent 2px)`,
        backgroundPosition: '0 0, 6px 5px, 15px 12px',
        backgroundSize: '9px 9px, 22px 22px, 26px 26px',
      }
    case 'craie':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 13px, ${line} 13px, ${line} 14px), repeating-linear-gradient(90deg, transparent 0px, transparent 28px, ${line} 28px, ${line} 29px)`,
      }
    case 'schiste_gres_socle':
      return {
        backgroundImage: `repeating-linear-gradient(115deg, transparent 0px, transparent 4px, ${line} 4px, ${line} 5px, transparent 5px, transparent 8px)`,
      }
    default:
      return {
        backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(26,26,26,0.22) 10px, rgba(26,26,26,0.22) 11px)`,
      }
  }
}

function lithologyLegendItems() {
  return [
    { key: 'argile' as const, label: 'Argile', color: '#AB572E' },
    { key: 'argile_silt' as const, label: 'Argile / silt', color: '#D9B86F' },
    { key: 'silt_sable_argile' as const, label: 'Silt / sable et argile', color: '#C9AD84' },
    { key: 'sable' as const, label: 'Sable', color: '#FFD94F' },
    { key: 'sable_gravier' as const, label: 'Sable et gravier', color: '#E4D28E' },
    { key: 'craie' as const, label: 'Craie', color: '#E8E5DE' },
    { key: 'schiste_gres_socle' as const, label: 'Schiste et grès, roche de socle', color: '#8A5E2F' },
  ]
}

export default function GeologyStep({
  address,
  onConfirm,
}: {
  address: AddressResult | null
  onConfirm: () => void
}) {
  const [data, setData] = useState<GeologyApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          lat: String(address.lat),
          lng: String(address.lng),
          depth: '200',
          length: '1000',
          orientation: '90',
          radius: '1500',
          samples: '9',
        })

        const res = await fetch('/api/geology-section?' + params.toString())

        if (!res.ok) {
          throw new Error('Impossible de récupérer la coupe géologique.')
        }

        const json = await res.json()

        if (!cancelled) {
          setData(json)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Erreur lors de la récupération de la coupe géologique.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [address])

  const maxDepth = data?.interpretedSection.depthM || 200
  const layers = data?.interpretedSection.layers || []
  const depthTicks = [0, 50, 100, 150, maxDepth].filter((v, i, a) => a.indexOf(v) === i)

  const lambdaAvg = useMemo(() => weightedLambda(layers, maxDepth), [layers, maxDepth])
  const legendBands = useMemo(() => computeLegendBands(layers, maxDepth), [layers, maxDepth])
  const extraction = extractionEstimate(lambdaAvg)
  const temperature = initialGroundTemperature(maxDepth)

  if (!address) {
    return (
      <div>
        <Hint>{T.geologyIntro}</Hint>
        <div style={S.statusBox('error')}>
          Aucune adresse n’est disponible pour générer la coupe géologique.
        </div>
        <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
      </div>
    )
  }

  return (
    <div>
      <Hint>{T.geologyIntro}</Hint>

      {loading && (
        <div style={S.statusBox('loading')}>
          Génération de la coupe géologique et hydrogéologique indicative...
        </div>
      )}

      {error && (
        <div style={S.statusBox('error')}>
          {error}
        </div>
      )}

      {data && (
        <>
          <div style={S.sectionTable()}>
            <div style={S.depthHeader()}>
              <div style={S.verticalDepthLabel()}>Profondeur</div>
            </div>
            <div style={S.tableHeader()}>Coupe géologique</div>
            <div style={S.tableHeader()} />
            <div style={S.tableHeader()}>λ et couches</div>

            <div style={S.depthAxis()}>
              {depthTicks.map((d) => (
                <div key={d} style={S.depthTick(d, maxDepth)}>
                  {d} m
                </div>
              ))}
            </div>

            <div style={S.sectionCanvas()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={S.layerBlock(layer.topM, layer.bottomM, maxDepth, layerColor(layer))}
                >
                  <span style={S.layerNumber(useDarkText(layer))}>
                    {index + 1}
                  </span>
                </div>
              ))}

              {data.hydrogeology?.overlays
                ?.filter((overlay) => overlay.mode !== 'none')
                .map((overlay, index) => (
                  <div
                    key={'hydro-overlay-' + index}
                    style={S.hydroOverlay(
                      overlay.topM,
                      overlay.bottomM,
                      maxDepth,
                      overlay.mode === 'aquifer'
                    )}
                  />
                ))}

              {shouldShowWaterLine(data) &&
                data.hydrogeology?.likelyWaterTableDepthM !== null &&
                data.hydrogeology?.likelyWaterTableDepthM !== undefined && (
                  <>
                    <div
                      style={S.waterLine(
                        data.hydrogeology.likelyWaterTableDepthM,
                        maxDepth
                      )}
                    />
                    <div
                      style={S.waterLineLabel(
                        data.hydrogeology.likelyWaterTableDepthM,
                        maxDepth
                      )}
                    >
                      {hydroLineLabel(data)}
                    </div>
                  </>
                )}

              <div style={S.lambdaScale()}>
                <span style={S.lambdaScaleTick()} />
                <span style={S.lambdaScaleTick()} />
                <span style={S.lambdaScaleTick()} />
                <span style={{ ...S.lambdaScaleLabel(), left: '0%' }}>λ 1.0</span>
                <span style={{ ...S.lambdaScaleLabel(), left: '50%' }}>2.3</span>
                <span style={{ ...S.lambdaScaleLabel(), left: '100%' }}>3.6</span>
              </div>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={S.lambdaCurveSvg()}
              >
                <polyline
                  points={lambdaCurvePoints(layers, maxDepth)}
                  fill="none"
                  stroke="#D12B2B"
                  strokeWidth="1.7"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <div style={S.targetLine()} />
            </div>

            <div style={S.connectorColumn()}>
              {layers.map((layer, index) => (
                <div
                  key={'connector-depth-label-' + layer.name + index}
                  style={S.connectorDepthLabel(bandForLayer(legendBands, index).bottom)}
                >
                  {connectorDepthLabel(layer)}
                </div>
              ))}

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={S.connectorSvg()}
                aria-hidden="true"
              >
                {layers.map((layer, index) => (
                  <path
                    key={'connector-line-' + layer.name + index}
                    d={connectorPath(layer, index, maxDepth, legendBands)}
                    style={S.connectorLine()}
                  />
                ))}
              </svg>
            </div>

            <div style={S.lambdaColumn()}>
              {legendBands.map((band) => (
                <div
                  key={'lambda-separator-' + band.index}
                  style={S.lambdaSeparator(band.bottom)}
                />
              ))}

              {layers.map((layer, index) => {
                const band = bandForLayer(legendBands, index)

                return (
                  <div
                    key={layer.name + index}
                    style={S.lambdaRow(band.top, band.bottom, 100)}
                  >
                    <div style={S.lambdaValue()}>
                      {layer.thermalConductivityWmK
                        ? layer.thermalConductivityWmK.toFixed(2).replace('.00', '')
                        : '—'}
                    </div>
                    <div style={S.lambdaLayerName()}>
                      {index + 1}. {layerLongLabel(layer)}
                      <span style={S.lambdaLayerDepth()}>
                        {layer.stratigraphicName || 'Unité stratigraphique à confirmer'}
                      </span>
                      <span style={S.lambdaLayerDepth()}>
                        {Math.round(layer.topM)}–{Math.round(layer.bottomM)} m · {lithologyTextLabel(layer)} · {hydroLabel(layer.hydroClass)} · {layer.name}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={S.legendRow()}>
            <span style={S.legendItem()}>
              <span style={S.redLineSample()} />
              λ moyen cumulé
            </span>
            <span style={S.legendItem()}>
              <span style={S.hydroSample(true)} />
              Aquifère probable
            </span>
            <span style={S.legendItem()}>
              <span style={S.hydroSample(false)} />
              Eau possible en fractures
            </span>
            <span style={S.legendItem()}>
              <span style={S.yellowLineSample()} />
              200 m — profondeur cible
            </span>
          </div>

          <div style={S.summaryGrid()}>
            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>Température initiale</div>
              <div style={S.summaryValue()}>{temperature.toFixed(1)} °C</div>
              <div style={S.summarySub()}>à 100 m de profondeur</div>
            </div>

            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>λ moyen pondéré</div>
              <div style={S.summaryValue()}>
                {lambdaAvg ? lambdaAvg.toFixed(1) : '—'} W/m·K
              </div>
              <div style={S.summarySub()}>sur {maxDepth} m</div>
            </div>

            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>Potentiel géothermique</div>
              <div style={S.summaryValue(
                data.geothermalInterpretation.preliminaryPotential === 'favorable'
                  ? 'green'
                  : undefined
              )}>
                {potentialLabel(data.geothermalInterpretation.preliminaryPotential)}
              </div>
              <div style={S.summarySub()}>
                {extraction ? `extraction ~${extraction} kW / sonde` : 'à confirmer'}
              </div>
            </div>
          </div>

          {data.warnings?.map((warning, index) => (
            <div key={index} style={S.warning()}>
              {warning}
            </div>
          ))}

          <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
        </>
      )}

      {!loading && !data && !error && (
        <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
      )}
    </div>
  )
}

'use client'
import type React from 'react'

import { useEffect, useMemo, useState } from 'react'
import type { AddressResult } from '../types'
import { C } from '../theme'
import { T } from '../i18n/fr'
import { Hint, PrimaryBtn } from './Shared'

const S = {
  statusBox: (kind: 'loading' | 'error' | 'ok'): React.CSSProperties => ({
    background: kind === 'error' ? '#FFF5F2' : '#F8F5EF',
    border: '1px solid ' + (kind === 'error' ? '#E65100' : '#DDD8CF'),
    borderLeft: '3px solid ' + (kind === 'error' ? '#E65100' : '#E6C200'),
    padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#4A4540', lineHeight: 1.55,
  }),
  sectionTable: (): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: '52px minmax(280px,1.25fr) minmax(270px,1fr) 170px', border: '1px solid #DDD8CF', background: '#FFFFFF', marginTop: '16px', marginBottom: '12px', overflow: 'hidden' }),
  depthHeader: (): React.CSSProperties => ({ minHeight: '42px', borderRight: '1px solid #DDD8CF', borderBottom: '1px solid #DDD8CF', background: '#F2EFE9', position: 'relative' }),
  verticalDepthLabel: (): React.CSSProperties => ({ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9088', whiteSpace: 'nowrap' }),
  tableHeader: (): React.CSSProperties => ({ minHeight: '42px', display: 'flex', alignItems: 'center', padding: '0 16px', borderRight: '1px solid #DDD8CF', borderBottom: '1px solid #DDD8CF', background: '#F2EFE9', fontSize: '13px', fontWeight: 700, color: '#4A4540' }),
  depthAxis: (): React.CSSProperties => ({ position: 'relative', height: '400px', borderRight: '1px solid #DDD8CF', background: '#F2EFE9' }),
  depthTick: (d: number, max: number): React.CSSProperties => ({ position: 'absolute', top: (d/max*100)+'%', right: '12px', transform: 'translateY(-50%)', fontSize: '11px', color: '#9A9088', fontWeight: 600 }),
  sectionCanvas: (): React.CSSProperties => ({ position: 'relative', height: '400px', borderRight: '1px solid #DDD8CF', background: '#F2EFE9', overflow: 'hidden' }),
  layerBlock: (t: number, b: number, max: number, color: string): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, top: (t/max*100)+'%', height: ((b-t)/max*100)+'%', background: color, borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', padding: '0 18px', boxSizing: 'border-box' }),
  layerName: (dark?: boolean): React.CSSProperties => ({ minWidth: '22px', height: '22px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: dark ? '#4A4540' : '#fff', background: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.22)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1, textShadow: dark ? 'none' : '0 1px 1px rgba(0,0,0,0.28)' }),
  hydroOverlay: (t: number, b: number, max: number, strong: boolean): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, top: (t/max*100)+'%', height: ((b-t)/max*100)+'%', pointerEvents: 'none', opacity: strong ? 0.56 : 0.32, zIndex: 5, backgroundImage: strong ? 'repeating-linear-gradient(135deg,rgba(21,101,192,0.9) 0px,rgba(21,101,192,0.9) 3px,transparent 3px,transparent 13px)' : 'repeating-linear-gradient(135deg,rgba(21,101,192,0.58) 0px,rgba(21,101,192,0.58) 1px,transparent 1px,transparent 14px)' }),
  waterLine: (d: number, max: number): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, top: (d/max*100)+'%', borderTop: '2px dashed #1565C0', zIndex: 8, pointerEvents: 'none' }),
  waterLineLabel: (d: number, max: number): React.CSSProperties => ({ position: 'absolute', right: '8px', top: (d/max*100)+'%', transform: 'translateY(-110%)', zIndex: 12, pointerEvents: 'none', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(21,101,192,0.35)', color: '#1565C0', fontSize: '9px', fontWeight: 800, padding: '2px 5px', whiteSpace: 'nowrap' }),
  hydroBadge: (tone: 'aquifer' | 'fractured' | 'unknown'): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', border: '1px solid ' + (tone === 'aquifer' ? 'rgba(21,101,192,0.38)' : tone === 'fractured' ? 'rgba(21,101,192,0.25)' : '#DDD8CF'), background: tone === 'aquifer' ? 'rgba(21,101,192,0.08)' : tone === 'fractured' ? 'rgba(21,101,192,0.04)' : '#F8F5EF', color: tone === 'unknown' ? '#6B6057' : '#1565C0', fontWeight: 700 }),
  lambdaCurveSvg: (): React.CSSProperties => ({ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }),
  lambdaScale: (): React.CSSProperties => ({ position: 'absolute', left: '28%', right: '28%', top: '8px', height: '18px', zIndex: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' }),
  lambdaScaleTick: (): React.CSSProperties => ({ width: '1px', height: '7px', background: 'rgba(209,43,43,0.7)' }),
  lambdaScaleLabel: (): React.CSSProperties => ({ position: 'absolute', top: '8px', transform: 'translateX(-50%)', fontSize: '9px', color: '#A33', fontWeight: 700, whiteSpace: 'nowrap' }),
  targetLine: (): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, bottom: 0, height: '4px', background: '#FFD94F', zIndex: 10 }),
  lambdaColumn: (): React.CSSProperties => ({ position: 'relative', height: '400px', borderRight: '1px solid #DDD8CF', background: '#FFFFFF' }),
  lambdaRow: (t: number, b: number, max: number): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, top: (t/max*100)+'%', minHeight: '30px', height: ((b-t)/max*100)+'%', display: 'grid', gridTemplateColumns: '42px 1fr', alignItems: 'center', gap: '8px', padding: '2px 10px', boxSizing: 'border-box', borderBottom: '1px solid #DDD8CF', overflow: 'hidden', zIndex: 1 }),
  lambdaValue: (): React.CSSProperties => ({ fontSize: '12px', fontWeight: 800, color: '#1C1C1C', lineHeight: 1.2, textAlign: 'right' }),
  lambdaLayerName: (): React.CSSProperties => ({ fontSize: '10px', color: '#4A4540', lineHeight: 1.22, fontWeight: 650, marginTop: 0 }),
  lambdaLayerDepth: (): React.CSSProperties => ({ display: 'block', fontSize: '9px', color: '#9A9088', fontWeight: 400, marginTop: '1px' }),
  stratColumn: (): React.CSSProperties => ({ position: 'relative', height: '400px', background: '#FFFFFF' }),
  stratRow: (t: number, b: number, max: number): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, top: (t/max*100)+'%', height: ((b-t)/max*100)+'%', minHeight: '30px', display: 'flex', alignItems: 'center', padding: '0 10px', boxSizing: 'border-box', fontSize: '10px', color: '#6B6057', lineHeight: 1.25, borderBottom: '1px solid #DDD8CF', overflow: 'hidden' }),
  legendRow: (): React.CSSProperties => ({ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '11px', color: '#6B6057', margin: '10px 0 16px', alignItems: 'center' }),
  legendItem: (): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '6px' }),
  redLineSample: (): React.CSSProperties => ({ display: 'inline-block', width: '20px', height: '2px', background: '#D12B2B', verticalAlign: 'middle' }),
  yellowLineSample: (): React.CSSProperties => ({ display: 'inline-block', width: '20px', height: '3px', background: '#FFD94F', verticalAlign: 'middle' }),
  hydroSample: (strong: boolean): React.CSSProperties => ({ display: 'inline-block', width: '20px', height: '12px', verticalAlign: 'middle', backgroundImage: strong ? 'repeating-linear-gradient(135deg,rgba(21,101,192,0.9) 0,rgba(21,101,192,0.9) 3px,transparent 3px,transparent 10px)' : 'repeating-linear-gradient(135deg,rgba(21,101,192,0.58) 0,rgba(21,101,192,0.58) 1px,transparent 1px,transparent 11px)' }),
  summaryGrid: (): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }),
  summaryCard: (): React.CSSProperties => ({ background: '#F8F5EF', border: '1px solid #DDD8CF', padding: '16px 18px' }),
  summaryLabel: (): React.CSSProperties => ({ fontSize: '11px', color: '#9A9088', marginBottom: '4px' }),
  summaryValue: (color?: string): React.CSSProperties => ({ fontSize: '22px', fontWeight: 700, color: color === 'green' ? '#2E7D32' : '#1C1C1C', marginBottom: '2px' }),
  summarySub: (): React.CSSProperties => ({ fontSize: '10px', color: '#9A9088', marginTop: '2px' }),
  assumptionsBox: (): React.CSSProperties => ({ marginBottom: '14px', border: '1px solid #DDD8CF', background: '#FFFFFF' }),
  assumptionsSummary: (): React.CSSProperties => ({ cursor: 'pointer', padding: '11px 14px', fontSize: '12px', color: '#4A4540', fontWeight: 700, background: '#F8F5EF', borderBottom: '1px solid #DDD8CF' }),
  assumptionsBody: (): React.CSSProperties => ({ padding: '12px 14px' }),
  assumptionsGrid: (): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }),
  assumptionsCard: (): React.CSSProperties => ({ border: '1px solid #DDD8CF', background: '#F8F5EF', padding: '10px 11px' }),
  assumptionsLabel: (): React.CSSProperties => ({ fontSize: '9px', color: '#9A9088', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '4px' }),
  assumptionsValue: (): React.CSSProperties => ({ fontSize: '12px', color: '#1C1C1C', fontWeight: 700, lineHeight: 1.25 }),
  assumptionsText: (): React.CSSProperties => ({ fontSize: '11px', color: '#6B6057', lineHeight: 1.55, marginTop: '8px' }),
  assumptionsList: (): React.CSSProperties => ({ margin: '8px 0 0', paddingLeft: '16px', fontSize: '11px', color: '#6B6057', lineHeight: 1.5 }),
  warning: (): React.CSSProperties => ({ fontSize: '11px', color: '#6B6057', lineHeight: 1.6, padding: '10px 14px', background: '#F8F5EF', border: '1px solid #DDD8CF', borderLeft: '3px solid #DDD8CF', marginBottom: '10px' }),
}


type ApiLayer = {
  name: string
  topM: number
  bottomM: number

  // Legacy fields kept for compatibility
  type: 'cover' | 'bedrock' | 'aquifer' | 'aquitard' | 'unknown'
  hydroClass: 'aquifer' | 'aquitard' | 'aquiclude' | 'unknown'

  // Structured fields from the geology API
  lithology?: 'soil' | 'loam' | 'clay' | 'sand' | 'limestone' | 'schist' | 'sandstone' | 'mixed' | 'unknown'
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

function legacyLayerColor(layer: ApiLayer) {
  const name = layer.name.toLowerCase()

  if (name.includes('sol')) return '#947648'
  if (name.includes('limon') || name.includes('argile') || name.includes('altérite')) return '#C9AD84'
  if (name.includes('sable') || name.includes('gravier')) return '#D9C99D'
  if (name.includes('calcaire') || name.includes('carbonat') || name.includes('dolomie')) return '#B9B1A0'
  if (name.includes('schiste') || name.includes('phyllade')) return '#726D66'

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
  return name.includes('sable') || name.includes('calcaire') || name.includes('carbonat')
}

function layerShortLabel(layer: ApiLayer) {
  return layer.display?.shortLabel || layer.name
}

function layerLongLabel(layer: ApiLayer) {
  return layer.display?.longLabel || layer.name
}

function layerHatch(layer: ApiLayer) {
  return layer.display?.hatch || 'none'
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

function hydroLabel(value: ApiLayer['hydroClass']) {
  if (value === 'aquifer') return 'aquifère'
  if (value === 'aquitard') return 'aquitard'
  if (value === 'aquiclude') return 'aquiclude'
  return 'hydrogéologie à confirmer'
}

function stratigraphicLabel(layer: ApiLayer) {
  if (layer.layerType === 'surface') return 'Horizon de surface'
  if (layer.layerType === 'cover') return 'Couverture superficielle'
  if (layer.layerType === 'weathered-zone') return 'Zone altérée / fissurée'
  if (layer.layerType === 'deep-bedrock') return 'Substratum profond'

  switch (layer.lithology) {
    case 'soil':
      return 'Formations quaternaires'
    case 'loam':
      return 'Limons / lœss'
    case 'clay':
      return 'Argiles / marnes'
    case 'sand':
      return 'Sables et graviers'
    case 'limestone':
      return 'Niveaux carbonatés'
    case 'schist':
      return 'Socle schisteux'
    case 'sandstone':
      return 'Socle gréseux'
    case 'mixed':
      return 'Alternances lithologiques'
    default:
      return layer.type === 'cover' ? 'Couverture superficielle' : 'Substratum à confirmer'
  }
}

function layerThickness(layer: ApiLayer) {
  return Math.max(0, layer.bottomM - layer.topM)
}

function layerDisplayName(layer: ApiLayer, index: number) {
  return layerThickness(layer) < 9 ? String(index + 1) : layerShortLabel(layer)
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
  const layer = layers.find((l) => depthM >= l.topM && depthM <= l.bottomM)
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
  const sampleCount = 48
  const points: Array<[number, number]> = []

  for (let i = 0; i <= sampleCount; i++) {
    const depth = (i / sampleCount) * maxDepth
    const lambda = cumulativeLambdaAtDepth(layers, depth)

    // Échelle visuelle : 1.2 à 3.6 W/mK
    const normalized = Math.max(0, Math.min(1, (lambda - 1.2) / 2.4))
    const x = 32 + normalized * 34
    const y = (depth / maxDepth) * 100

    points.push([x, y])
  }

  return points.map(([x, y]) => `${x},${y}`).join(' ')
}



function shouldShowWaterLine(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro) return false
  if (hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) return false

  // On affiche une ligne uniquement si le modèle suppose un niveau d'eau
  // relativement continu ou perché. En socle fracturé, la ligne serait trompeuse.
  return hydro.waterMode === 'continuous' || hydro.waterMode === 'perched'
}

function hydroLegendLabel(mode: 'aquifer' | 'fractured-water-possible') {
  if (mode === 'aquifer') return 'Aquifère probable'
  return 'Eau possible en fractures'
}

function hydroSummaryTitle(mode: GeologyApiResponse['hydrogeology'] extends infer H ? H extends { waterMode: infer M } ? M : never : never) {
  if (mode === 'continuous') return 'Aquifère probable'
  if (mode === 'perched') return 'Niveau d’eau perché possible'
  if (mode === 'fractured') return 'Eau possible en fractures'
  return 'Présence d’eau à confirmer'
}

function hydroLineLabel(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro || hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) {
    return null
  }

  if (!shouldShowWaterLine(data)) return null

  return `niveau indicatif ~${Math.round(hydro.likelyWaterTableDepthM)} m`
}


function evidenceTotal(data: GeologyApiResponse) {
  return (
    (data.evidence.surface?.length || 0) +
    (data.evidence.soils?.length || 0) +
    (data.evidence.affleurements?.length || 0) +
    (data.evidence.sondages?.length || 0)
  )
}

function evidenceSourcesLabel(data: GeologyApiResponse) {
  const parts: string[] = []

  if (data.evidence.surface?.length) parts.push('carte géologique')
  if (data.evidence.soils?.length) parts.push('carte des sols')
  if (data.evidence.sondages?.length) parts.push('sondages')
  if (data.evidence.affleurements?.length) parts.push('affleurements')

  return parts.length ? parts.join(' · ') : 'données publiques limitées'
}

function confidencePercent(data: GeologyApiResponse) {
  const score = data.interpretedSection.confidenceDetails?.score
  if (typeof score === 'number') return Math.round(score * 100) + '%'
  return confidenceLabel(data.interpretedSection.confidence)
}

function regionalContextLabel(data: GeologyApiResponse) {
  return data.regionalContext?.label || 'Contexte régional à confirmer'
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
              <div style={S.verticalDepthLabel()}>Profondeur (m)</div>
            </div>
            <div style={S.tableHeader()}>Coupe géologique</div>
            <div style={S.tableHeader()}>λ et couches géologiques</div>
            <div style={S.tableHeader()}>Unité stratigraphique</div>

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
                  style={S.layerBlock(
                    layer.topM,
                    layer.bottomM,
                    maxDepth,
                    layerColor(layer)
                  )}
                >
                  <span style={S.layerName(useDarkText(layer))}>
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
                <span style={{ ...S.lambdaScaleLabel(), left: '0%' }}>λ 1.2</span>
                <span style={{ ...S.lambdaScaleLabel(), left: '50%' }}>2.4</span>
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

            <div style={S.lambdaColumn()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={S.lambdaRow(layer.topM, layer.bottomM, maxDepth)}
                >
                  <div style={S.lambdaValue()}>
                    {layer.thermalConductivityWmK
                      ? layer.thermalConductivityWmK.toFixed(2).replace('.00', '')
                      : '—'}
                  </div>
                  <div style={S.lambdaLayerName()}>
                    {index + 1}. {layerLongLabel(layer)}
                    <span style={S.lambdaLayerDepth()}>
                      {Math.round(layer.topM)}–{Math.round(layer.bottomM)} m · {hydroLabel(layer.hydroClass)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={S.stratColumn()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={S.stratRow(layer.topM, layer.bottomM, maxDepth)}
                >
                  {stratigraphicLabel(layer)}
                </div>
              ))}
            </div>
          </div>

          <div style={S.legendRow()}>
            <span style={S.legendItem()}>
              <span style={S.redLineSample()} />
              λ moyen cumulé
            </span>
            <span style={S.hydroBadge('aquifer')}>
              <span style={S.hydroSample(true)} />
              Aquifère probable
            </span>
            <span style={S.hydroBadge('fractured')}>
              <span style={S.hydroSample(false)} />
              Eau possible en fractures
            </span>
            <span style={S.legendItem()}>
              <span style={S.yellowLineSample()} />
              {maxDepth} m — profondeur cible
            </span>
          </div>

          <div style={S.summaryGrid()}>
            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>Température initiale</div>
              <div style={S.summaryValue()}>
                {temperature.toFixed(1)} °C
              </div>
              <div style={S.summarySub()}>
                à 100 m de profondeur
              </div>
            </div>

            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>λ moyen pondéré</div>
              <div style={S.summaryValue()}>
                {lambdaAvg ? lambdaAvg.toFixed(1) : '—'} W/m·K
              </div>
              <div style={S.summarySub()}>
                sur {maxDepth} m · confiance {data.interpretedSection.confidenceDetails?.score
                  ? Math.round(data.interpretedSection.confidenceDetails.score * 100) + '%'
                  : confidenceLabel(data.interpretedSection.confidence)}
              </div>
            </div>

            <div style={S.summaryCard()}>
              <div style={S.summaryLabel()}>Potentiel géothermique</div>
              <div
                style={S.summaryValue(
                  data.geothermalInterpretation.preliminaryPotential === 'favorable'
                    ? 'green'
                    : 'normal'
                )}
              >
                {potentialLabel(data.geothermalInterpretation.preliminaryPotential)}
              </div>
              <div style={S.summarySub()}>
                {extraction ? `extraction ~${extraction} kW / sonde` : 'extraction à confirmer'}
              </div>
            </div>
          </div>

          <div style={S.warning()}>
            {data.geothermalInterpretation.message}
          </div>

          {data.hydrogeology && (
            <div style={S.warning()}>
              <strong>{hydroSummaryTitle(data.hydrogeology.waterMode)}.</strong>{' '}
              {data.hydrogeology.summary}
              {data.hydrogeology.waterMode === 'fractured' ? (
                <>
                  {' '}Aucune nappe continue n’est positionnée automatiquement dans ce contexte : les hachures indiquent plutôt des horizons où l’eau est possible dans les fractures.
                </>
              ) : null}
            </div>
          )}

          <details style={S.assumptionsBox()}>
            <summary style={S.assumptionsSummary()}>
              Hypothèses et données utilisées
            </summary>

            <div style={S.assumptionsBody()}>
              <div style={S.assumptionsGrid()}>
                <div style={S.assumptionsCard()}>
                  <div style={S.assumptionsLabel()}>Contexte</div>
                  <div style={S.assumptionsValue()}>{regionalContextLabel(data)}</div>
                </div>

                <div style={S.assumptionsCard()}>
                  <div style={S.assumptionsLabel()}>Données</div>
                  <div style={S.assumptionsValue()}>{evidenceTotal(data)} éléments</div>
                </div>

                <div style={S.assumptionsCard()}>
                  <div style={S.assumptionsLabel()}>Sources</div>
                  <div style={S.assumptionsValue()}>{evidenceSourcesLabel(data)}</div>
                </div>

                <div style={S.assumptionsCard()}>
                  <div style={S.assumptionsLabel()}>Confiance</div>
                  <div style={S.assumptionsValue()}>{confidencePercent(data)}</div>
                </div>
              </div>

              <div style={S.assumptionsText()}>
                La coupe est générée automatiquement à partir des données publiques disponibles :
                carte géologique, contexte régional, carte des sols, affleurements et sondages publics proches.
                Les profondeurs de couches restent interprétatives.
              </div>

              {data.interpretedSection.confidenceDetails?.reasons?.length ? (
                <ul style={S.assumptionsList()}>
                  {data.interpretedSection.confidenceDetails.reasons.slice(0, 6).map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </details>

          {data.warnings.length > 0 && (
            <div style={{ fontSize: '11px', color: C.text4, lineHeight: 1.5, marginBottom: '18px' }}>
              {data.warnings.slice(0, 2).map((warning) => (
                <div key={warning}>• {warning}</div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !data && !error && (
        <div style={S.statusBox('loading')}>
          Préparation de l’analyse du sous-sol...
        </div>
      )}

      <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
    </div>
  )
}

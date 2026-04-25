'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AddressResult } from '../types'
import { C, F, geologySectionStyles } from '../theme'
import { T } from '../i18n/fr'
import { Hint, PrimaryBtn } from './Shared'

type ApiLayer = {
  name: string
  topM: number
  bottomM: number
  type: 'cover' | 'bedrock' | 'aquifer' | 'aquitard' | 'unknown'
  hydroClass: 'aquifer' | 'aquitard' | 'aquiclude' | 'unknown'
  thermalConductivityWmK: number | null
  confidence: 'low' | 'medium' | 'high'
  rationale: string
}

type EvidencePoint = {
  source: 'affleurement' | 'sondage' | 'surface' | 'context' | 'soil'
  distanceM: number | null
  summary: string
}

type HydroOverlay = {
  topM: number
  bottomM: number
  mode: 'aquifer' | 'fractured-water-possible' | 'none'
  label: string | null
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

function layerColor(layer: ApiLayer) {
  if (layer.type === 'cover') return '#B0A18F'
  if (layer.hydroClass === 'aquifer') return '#8FAE9A'
  if (layer.hydroClass === 'aquitard') return '#8A7A6B'
  if (layer.hydroClass === 'aquiclude') return '#6B6560'
  if (layer.type === 'bedrock') return '#9A9088'
  return '#B8B0A0'
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
  return 'hydro à confirmer'
}

function sourceLabel(value: EvidencePoint['source']) {
  if (value === 'sondage') return 'Sondage proche'
  if (value === 'affleurement') return 'Affleurement proche'
  if (value === 'surface') return 'Carte géologique'
  if (value === 'soil') return 'Carte des sols'
  return 'Contexte régional'
}

function layerThickness(layer: ApiLayer) {
  return Math.max(0, layer.bottomM - layer.topM)
}

function shouldShowLayerNameInSection(layer: ApiLayer) {
  return layerThickness(layer) >= 18
}

function layerDisplayName(layer: ApiLayer, index: number) {
  return shouldShowLayerNameInSection(layer) ? layer.name : String(index + 1)
}

function layerCompactMeta(layer: ApiLayer) {
  const lambda = layer.thermalConductivityWmK
    ? `~${layer.thermalConductivityWmK} W/mK`
    : 'λ à confirmer'

  return `${Math.round(layer.topM)}–${Math.round(layer.bottomM)} m · ${lambda} · ${hydroLabel(layer.hydroClass)}`
}

function hydroOverlayStyle(
  topM: number,
  bottomM: number,
  maxDepthM: number,
  mode: 'aquifer' | 'fractured-water-possible' | 'none'
): React.CSSProperties {
  const isStrong = mode === 'aquifer'

  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (topM / maxDepthM * 100) + '%',
    height: ((bottomM - topM) / maxDepthM * 100) + '%',
    pointerEvents: 'none',
    opacity: isStrong ? 0.28 : 0.18,
    backgroundImage: isStrong
      ? 'repeating-linear-gradient(135deg, rgba(21,101,192,0.65) 0px, rgba(21,101,192,0.65) 2px, transparent 2px, transparent 12px)'
      : 'repeating-linear-gradient(135deg, rgba(21,101,192,0.55) 0px, rgba(21,101,192,0.55) 1px, transparent 1px, transparent 14px)',
    zIndex: 4,
  }
}

function waterLineStyle(depthM: number, maxDepthM: number): React.CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (depthM / maxDepthM * 100) + '%',
    borderTop: '2px dashed #1565C0',
    zIndex: 6,
    pointerEvents: 'none',
  }
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

  const evidence = useMemo(() => {
    if (!data) return []
    return [
      ...data.evidence.surface,
      ...(data.evidence.soils || []),
      ...data.evidence.sondages,
      ...data.evidence.affleurements,
    ].slice(0, 5)
  }, [data])

  const depthTicks = useMemo(() => {
    const values: number[] = []
    for (let d = 0; d <= maxDepth; d += 50) values.push(d)
    if (!values.includes(maxDepth)) values.push(maxDepth)
    return values
  }, [maxDepth])

  if (!address) {
    return (
      <div>
        <Hint>{T.geologyIntro}</Hint>
        <div style={geologySectionStyles.statusBox('error')}>
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
        <div style={geologySectionStyles.statusBox('loading')}>
          Génération de la coupe géologique et hydrogéologique indicative...
        </div>
      )}

      {error && (
        <div style={geologySectionStyles.statusBox('error')}>
          {error}
        </div>
      )}

      {data && (
        <>
          <div style={geologySectionStyles.metaGrid()}>
            <div style={geologySectionStyles.metaCard()}>
              <div style={geologySectionStyles.metaLabel()}>Potentiel</div>
              <div style={geologySectionStyles.metaValue()}>
                {potentialLabel(data.geothermalInterpretation.preliminaryPotential)}
              </div>
            </div>

            <div style={geologySectionStyles.metaCard()}>
              <div style={geologySectionStyles.metaLabel()}>Confiance</div>
              <div style={geologySectionStyles.metaValue()}>
                {confidenceLabel(data.interpretedSection.confidence)}
              </div>
            </div>

            <div style={geologySectionStyles.metaCard()}>
              <div style={geologySectionStyles.metaLabel()}>Profondeur</div>
              <div style={geologySectionStyles.metaValue()}>
                {maxDepth} m
              </div>
            </div>
          </div>

          <div style={geologySectionStyles.sectionShell()}>
            <div style={geologySectionStyles.depthAxis()}>
              {depthTicks.map((d) => (
                <div key={d} style={geologySectionStyles.depthLabel(d, maxDepth)}>
                  {d} m
                </div>
              ))}
            </div>

            <div style={geologySectionStyles.sectionCanvas()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={geologySectionStyles.layerBlock(
                    layer.topM,
                    layer.bottomM,
                    maxDepth,
                    layerColor(layer)
                  )}
                >
                  <span style={geologySectionStyles.layerText()}>
                    {layerDisplayName(layer, index)}
                  </span>
                </div>
              ))}

              {data.hydrogeology?.overlays
                ?.filter((overlay) => overlay.mode !== 'none')
                .map((overlay, index) => (
                  <div
                    key={'hydro-overlay-' + index}
                    title={overlay.label || undefined}
                    style={hydroOverlayStyle(overlay.topM, overlay.bottomM, maxDepth, overlay.mode)}
                  />
                ))}

              {data.hydrogeology?.likelyWaterTableDepthM !== null &&
                data.hydrogeology?.likelyWaterTableDepthM !== undefined && (
                  <div style={waterLineStyle(data.hydrogeology.likelyWaterTableDepthM, maxDepth)} />
                )}

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: C.accent,
                  zIndex: 8,
                }}
              />
            </div>
          </div>

          <div style={geologySectionStyles.layerLegend()}>
            {layers.map((layer, index) => {
              const color = layerColor(layer)

              return (
                <div key={layer.name + index} style={geologySectionStyles.layerLegendItem()}>
                  <div style={geologySectionStyles.layerLegendNumber(color)}>{index + 1}</div>
                  <div>
                    <div style={geologySectionStyles.layerLegendName()}>{layer.name}</div>
                  </div>
                  <div style={geologySectionStyles.layerLegendMeta()}>
                    {layerCompactMeta(layer)}
                  </div>
                </div>
              )
            })}
          </div>

          {data.hydrogeology && (
            <div style={geologySectionStyles.hydroLegend()}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={geologySectionStyles.hydroSample(true)} />
                Eau souterraine probable
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={geologySectionStyles.hydroSample(false)} />
                Eau possible en fractures
              </span>

              {data.hydrogeology.likelyWaterTableDepthM !== null &&
                data.hydrogeology.likelyWaterTableDepthM !== undefined && (
                  <span style={{ color: '#1565C0', fontWeight: 700 }}>
                    Niveau d’eau indicatif : ~{Math.round(data.hydrogeology.likelyWaterTableDepthM)} m
                  </span>
                )}
            </div>
          )}

          <div style={geologySectionStyles.warning()}>
            {data.geothermalInterpretation.message}
          </div>

          {data.hydrogeology && (
            <div style={geologySectionStyles.warning()}>
              <strong>Lecture hydrogéologique indicative.</strong>{' '}
              {data.hydrogeology.summary}
            </div>
          )}

          {evidence.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  fontSize: F.xs,
                  color: C.text4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                Données publiques utilisées
              </div>

              <div style={geologySectionStyles.evidenceList()}>
                {evidence.map((item, index) => (
                  <div key={index} style={geologySectionStyles.evidenceItem()}>
                    <div style={geologySectionStyles.evidenceType()}>
                      {sourceLabel(item.source)}
                      {item.distanceM !== null ? ` — ${item.distanceM} m` : ''}
                    </div>
                    <div>{item.summary || 'Information géologique disponible, détail non structuré.'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.warnings.length > 0 && (
            <div style={{ fontSize: F.xs, color: C.text4, lineHeight: 1.5, marginBottom: '18px' }}>
              {data.warnings.slice(0, 2).map((warning) => (
                <div key={warning}>• {warning}</div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !data && !error && (
        <div style={geologySectionStyles.statusBox('loading')}>
          Préparation de l’analyse du sous-sol...
        </div>
      )}

      <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
    </div>
  )
}

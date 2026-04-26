'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AddressResult } from '../types'
import { C, geologySectionStyles } from '../theme'
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

function useDarkText(layer: ApiLayer) {
  const name = layer.name.toLowerCase()
  return name.includes('sable') || name.includes('calcaire') || name.includes('carbonat')
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
  const name = layer.name.toLowerCase()

  if (name.includes('sol')) return 'Formations quaternaires'
  if (name.includes('limon') || name.includes('argile') || name.includes('altérite')) return 'Couverture / altération'
  if (name.includes('sable') || name.includes('gravier')) return 'Sables et graviers'
  if (name.includes('calcaire') || name.includes('carbonat') || name.includes('dolomie')) return 'Niveaux carbonatés'
  if (name.includes('schiste') || name.includes('phyllade') || name.includes('grès') || name.includes('gres')) return 'Socle paléozoïque'

  return layer.type === 'cover' ? 'Couverture superficielle' : 'Substratum à confirmer'
}

function layerThickness(layer: ApiLayer) {
  return Math.max(0, layer.bottomM - layer.topM)
}

function layerDisplayName(layer: ApiLayer, index: number) {
  return layerThickness(layer) < 9 ? String(index + 1) : layer.name
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
          <div style={geologySectionStyles.sectionTable()}>
            <div style={geologySectionStyles.depthHeader()}>
              <div style={geologySectionStyles.verticalDepthLabel()}>Profondeur (m)</div>
            </div>
            <div style={geologySectionStyles.tableHeader()} />
            <div style={geologySectionStyles.tableHeader()}>λ et couches géologiques</div>
            <div style={geologySectionStyles.tableHeader()}>Unité stratigraphique</div>

            <div style={geologySectionStyles.depthAxis()}>
              {depthTicks.map((d) => (
                <div key={d} style={geologySectionStyles.depthTick(d, maxDepth)}>
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
                  <span style={geologySectionStyles.layerName(useDarkText(layer))}>
                    {index + 1}
                  </span>
                </div>
              ))}

              {data.hydrogeology?.overlays
                ?.filter((overlay) => overlay.mode !== 'none')
                .map((overlay, index) => (
                  <div
                    key={'hydro-overlay-' + index}
                    style={geologySectionStyles.hydroOverlay(
                      overlay.topM,
                      overlay.bottomM,
                      maxDepth,
                      overlay.mode === 'aquifer'
                    )}
                  />
                ))}

              {data.hydrogeology?.likelyWaterTableDepthM !== null &&
                data.hydrogeology?.likelyWaterTableDepthM !== undefined && (
                  <div
                    style={geologySectionStyles.waterLine(
                      data.hydrogeology.likelyWaterTableDepthM,
                      maxDepth
                    )}
                  />
                )}

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={geologySectionStyles.lambdaCurveSvg()}
              >
                <polyline
                  points={lambdaCurvePoints(layers, maxDepth)}
                  fill="none"
                  stroke="#D12B2B"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <div style={geologySectionStyles.targetLine()} />
            </div>

            <div style={geologySectionStyles.lambdaColumn()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={geologySectionStyles.lambdaRow(layer.topM, layer.bottomM, maxDepth)}
                >
                  <div style={geologySectionStyles.lambdaValue()}>
                    {layer.thermalConductivityWmK
                      ? layer.thermalConductivityWmK.toFixed(2).replace('.00', '')
                      : '—'}
                  </div>
                  <div style={geologySectionStyles.lambdaLayerName()}>
                    {index + 1}. {layer.name}
                    <span style={geologySectionStyles.lambdaLayerDepth()}>
                      {Math.round(layer.topM)}–{Math.round(layer.bottomM)} m · {hydroLabel(layer.hydroClass)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={geologySectionStyles.stratColumn()}>
              {layers.map((layer, index) => (
                <div
                  key={layer.name + index}
                  style={geologySectionStyles.stratRow(layer.topM, layer.bottomM, maxDepth)}
                >
                  {stratigraphicLabel(layer)}
                </div>
              ))}
            </div>
          </div>

          <div style={geologySectionStyles.legendRow()}>
            <span style={geologySectionStyles.legendItem()}>
              <span style={geologySectionStyles.redLineSample()} />
              Courbe λ apparent
            </span>
            <span style={geologySectionStyles.legendItem()}>
              <span style={geologySectionStyles.hydroSample(true)} />
              Eau souterraine probable
            </span>
            <span style={geologySectionStyles.legendItem()}>
              <span style={geologySectionStyles.hydroSample(false)} />
              Eau possible en fractures
            </span>
            <span style={geologySectionStyles.legendItem()}>
              <span style={geologySectionStyles.yellowLineSample()} />
              {maxDepth} m — profondeur cible
            </span>
          </div>

          <div style={geologySectionStyles.summaryGrid()}>
            <div style={geologySectionStyles.summaryCard()}>
              <div style={geologySectionStyles.summaryLabel()}>Température initiale</div>
              <div style={geologySectionStyles.summaryValue()}>
                {temperature.toFixed(1)} °C
              </div>
              <div style={geologySectionStyles.summarySub()}>
                à 100 m de profondeur
              </div>
            </div>

            <div style={geologySectionStyles.summaryCard()}>
              <div style={geologySectionStyles.summaryLabel()}>λ moyen pondéré</div>
              <div style={geologySectionStyles.summaryValue()}>
                {lambdaAvg ? lambdaAvg.toFixed(1) : '—'} W/m·K
              </div>
              <div style={geologySectionStyles.summarySub()}>
                sur {maxDepth} m
              </div>
            </div>

            <div style={geologySectionStyles.summaryCard()}>
              <div style={geologySectionStyles.summaryLabel()}>Potentiel géothermique</div>
              <div
                style={geologySectionStyles.summaryValue(
                  data.geothermalInterpretation.preliminaryPotential === 'favorable'
                    ? 'green'
                    : 'normal'
                )}
              >
                {potentialLabel(data.geothermalInterpretation.preliminaryPotential)}
              </div>
              <div style={geologySectionStyles.summarySub()}>
                {extraction ? `extraction ~${extraction} kW / sonde` : 'extraction à confirmer'}
              </div>
            </div>
          </div>

          <div style={geologySectionStyles.warning()}>
            {data.geothermalInterpretation.message}
          </div>

          {data.hydrogeology && (
            <div style={geologySectionStyles.warning()}>
              <strong>Lecture hydrogéologique indicative.</strong>{' '}
              {data.hydrogeology.summary}
            </div>
          )}

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
        <div style={geologySectionStyles.statusBox('loading')}>
          Préparation de l’analyse du sous-sol...
        </div>
      )}

      <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
    </div>
  )
}

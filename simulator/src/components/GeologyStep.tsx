'use client'

import { useEffect, useMemo, useState } from 'react'

import type { AddressResult } from '../types'
import { T } from '../i18n/fr'
import { Hint, PrimaryBtn } from './Shared'

import { S } from './geology/styles'
import HydroGeoBoreholesMap from './geology/HydroGeoBoreholesMap'
import type { ApiLayer, GeologyApiResponse } from './geology/types'
import { hydroLabel, layerLongLabel, lithologyTextLabel, potentialLabel } from './geology/labels'
import {
  bandForLayer,
  computeLegendBands,
  connectorDepthLabel,
  connectorPath,
  extractionEstimate,
  hydroLineLabel,
  initialGroundTemperature,
  lambdaCurvePoints,
  lambdaCurveSegments,
  lambdaCurvePath,
  shouldShowWaterLine,
  weightedLambda,
} from './geology/calculations'

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
  const [geothermalMode, setGeothermalMode] = useState<'closed' | 'open'>('closed')
  const [probeDepthM, setProbeDepthM] = useState(150)

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

  useEffect(() => {
    setProbeDepthM((depth) => Math.max(20, Math.min(maxDepth, depth || 150)))
  }, [maxDepth])
  const depthTicks = [0, 50, 100, 150, maxDepth].filter((v, i, a) => a.indexOf(v) === i)

  const effectiveProbeDepthM = Math.max(20, Math.min(maxDepth, probeDepthM || maxDepth))
  const lambdaAvg = useMemo(
    () => weightedLambda(layers, effectiveProbeDepthM),
    [layers, effectiveProbeDepthM]
  )
  const legendBands = useMemo(() => computeLegendBands(layers, maxDepth), [layers, maxDepth])
  const extraction = extractionEstimate(lambdaAvg)
  const temperature = initialGroundTemperature(effectiveProbeDepthM)

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
        
          <div
            style={{
              display: 'flex',
              gap: '8px',
              margin: '0 0 18px',
              padding: '4px',
              width: 'fit-content',
              background: '#F2EFE9',
              border: '1px solid #DDD8CF',
            }}
          >
            <button
              type="button"
              onClick={() => setGeothermalMode('closed')}
              style={{
                border: '1px solid ' + (geothermalMode === 'closed' ? '#1A1A1A' : 'transparent'),
                background: geothermalMode === 'closed' ? '#FFFFFF' : 'transparent',
                padding: '10px 16px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: geothermalMode === 'closed' ? 800 : 600,
                color: '#1A1A1A',
              }}
            >
              Géothermie fermée
            </button>

            <button
              type="button"
              onClick={() => setGeothermalMode('open')}
              style={{
                border: '1px solid ' + (geothermalMode === 'open' ? '#1A1A1A' : 'transparent'),
                background: geothermalMode === 'open' ? '#FFFFFF' : 'transparent',
                padding: '10px 16px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: geothermalMode === 'open' ? 800 : 600,
                color: '#1A1A1A',
              }}
            >
              Géothermie ouverte
            </button>
          </div>

          <div style={S.geologyLayout()}>
          <div style={S.geologyMain()}>
          <div style={S.sectionTable()}>
            <div style={S.depthHeader()}>
              <div style={S.verticalDepthLabel()}>Prof.</div>
            </div>
            <div style={S.tableHeader()}>Coupe géologique</div>
            <div style={S.tableHeader()}>Hydrogéologie</div>
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

              <div style={S.lambdaScale()}>
                <span style={S.lambdaScaleTick()} />
                <span style={S.lambdaScaleTick()} />
                <span style={S.lambdaScaleTick()} />
                <span style={{ ...S.lambdaScaleLabel(), left: '0%' }}>λ 1.0</span>
                <span style={{ ...S.lambdaScaleLabel(), left: '50%' }}>2.3</span>
                <span style={{ ...S.lambdaScaleLabel(), left: '100%' }}>3.6</span>
              </div>

              {lambdaCurveSegments(layers, maxDepth).map((segment) => (
                <div
                  key={'lambda-segment-' + segment.index}
                  style={S.lambdaSegment(
                    segment.left,
                    segment.top,
                    segment.length,
                    segment.angle
                  )}
                />
              ))}

              {geothermalMode === 'closed' && (
                <>
                  <div style={S.probeDepthLine(effectiveProbeDepthM, maxDepth)} />
                  <div style={S.probeHead()} />
                  <div style={S.probeDepthLabel(effectiveProbeDepthM, maxDepth)}>
                    sonde {Math.round(effectiveProbeDepthM)} m
                  </div>
                </>
              )}

              <div style={S.targetLine()} />
            </div>

            <div style={S.hydroColumnCanvas()}>
              {data.hydrogeology?.overlays?.some((overlay) => overlay.mode !== 'none') ? (
                data.hydrogeology.overlays
                  .filter((overlay) => overlay.mode !== 'none')
                  .map((overlay, index) => (
                    <div key={'hydro-column-band-' + index}>
                      <div
                        style={S.hydroColumnBand(
                          overlay.topM,
                          overlay.bottomM,
                          maxDepth,
                          overlay.mode
                        )}
                      />

                      <div
                        style={S.hydroColumnText(
                          overlay.topM,
                          overlay.bottomM,
                          maxDepth,
                          overlay.mode === 'aquifer'
                        )}
                      >
                        {overlay.mode === 'aquifer'
                          ? 'Aquifère probable'
                          : 'Eau possible en fractures'}
                      </div>
                    </div>
                  ))
              ) : (
                <div style={S.hydroColumnEmpty()}>
                  Aucune information hydrogéologique spécifique identifiée.
                </div>
              )}

              {shouldShowWaterLine(data) &&
                data.hydrogeology?.likelyWaterTableDepthM !== null &&
                data.hydrogeology?.likelyWaterTableDepthM !== undefined && (
                  <>
                    <div
                      style={S.hydroColumnWaterLine(
                        data.hydrogeology.likelyWaterTableDepthM,
                        maxDepth
                      )}
                    />
                    <div
                      style={S.hydroColumnWaterLabel(
                        data.hydrogeology.likelyWaterTableDepthM,
                        maxDepth
                      )}
                    >
                      {hydroLineLabel(data)}
                    </div>
                  </>
                )}
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
              Hydrogéologie : aquifère probable
            </span>
            <span style={S.legendItem()}>
              <span style={S.hydroSample(false)} />
              Hydrogéologie : eau possible en fractures
            </span>
            <span style={S.legendItem()}>
              <span style={S.yellowLineSample()} />
              200 m — profondeur cible
            </span>
          </div>

          {geothermalMode === 'open' && (
            <HydroGeoBoreholesMap address={address} />
          )}
          </div>
<aside style={S.geologySidePanel()}>
            <div style={S.sidePanelTitle()}>
              {geothermalMode === 'closed'
                ? 'Synthèse géothermie fermée'
                : 'Synthèse géothermie ouverte'}
            </div>

            {data.geologyKnowledge && (
              <div style={S.knowledgeBox()}>
                <div style={S.knowledgeBadge()}>Source géologique enrichie</div>

                <div style={S.knowledgeTitle()}>
                  Carte {data.geologyKnowledge.sheetCode} · {data.geologyKnowledge.name}
                </div>

                <div style={S.knowledgeText()}>
                  Coupe enrichie par le modèle WDD issu de la notice géologique et de la carte hydrogéologique locale.
                </div>

                <div style={S.knowledgeMiniGrid()}>
                  <div style={S.knowledgeMiniCard()}>
                    <div style={S.knowledgeMiniLabel()}>Modèle</div>
                    <div style={S.knowledgeMiniValue()}>
                      v{data.geologyKnowledge.modelVersion}
                    </div>
                  </div>

                  <div style={S.knowledgeMiniCard()}>
                    <div style={S.knowledgeMiniLabel()}>Qualité</div>
                    <div style={S.knowledgeMiniValue()}>
                      {data.geologyKnowledge.quality?.globalScore
                        ? `${data.geologyKnowledge.quality.globalScore}/100`
                        : 'à valider'}
                    </div>
                  </div>

                  <div style={S.knowledgeMiniCard()}>
                    <div style={S.knowledgeMiniLabel()}>Surface</div>
                    <div style={S.knowledgeMiniValue()}>
                      {data.geologyKnowledge.surfaceClass || 'inconnue'}
                    </div>
                  </div>

                  <div style={S.knowledgeMiniCard()}>
                    <div style={S.knowledgeMiniLabel()}>Structure</div>
                    <div style={S.knowledgeMiniValue()}>
                      {data.geologyKnowledge.regionalContext?.structuralStyle || 'inconnue'}
                    </div>
                  </div>

                  <div style={S.knowledgeMiniCard()}>
                    <div style={S.knowledgeMiniLabel()}>Statut</div>
                    <div style={S.knowledgeMiniValue()}>
                      {data.geologyKnowledge.quality?.reviewStatus || data.geologyKnowledge.status}
                    </div>
                  </div>
                </div>

                {data.geologyKnowledge.regionalContext?.mainHydroRisks?.length ? (
                  <div style={S.knowledgeText()}>
                    Risques hydro identifiés : {data.geologyKnowledge.regionalContext.mainHydroRisks.join(', ')}.
                  </div>
                ) : null}
              </div>
            )}

            {geothermalMode === 'closed' && (
              <div style={S.sideMetric()}>
                <div style={S.sideMetricLabel()}>Profondeur de sonde</div>
              <input
                type="number"
                min={20}
                max={maxDepth}
                step={5}
                value={Math.round(effectiveProbeDepthM)}
                onChange={(event) => {
                  const value = Number(event.target.value || maxDepth)
                  setProbeDepthM(Math.max(20, Math.min(maxDepth, value)))
                }}
                style={S.sideInput()}
              />
                <div style={S.sideMetricSub()}>
                  Profondeur cible utilisée pour recalculer le λ moyen et le potentiel.
                </div>
              </div>
            )}

            <div style={S.sideMetric()}>
              <div style={S.sideMetricLabel()}>Température initiale</div>
              <div style={S.sideMetricValue()}>{temperature.toFixed(1)} °C</div>
              <div style={S.sideMetricSub()}>
                {geothermalMode === 'closed'
                  ? 'à la profondeur de sonde retenue'
                  : 'température indicative du sous-sol'}
              </div>
            </div>

            <div style={S.sideMetric()}>
              <div style={S.sideMetricLabel()}>λ moyen pondéré</div>
              <div style={S.sideMetricValue()}>
                {lambdaAvg ? lambdaAvg.toFixed(1) : '—'} W/m·K
              </div>
              <div style={S.sideMetricSub()}>sur {Math.round(effectiveProbeDepthM)} m</div>
            </div>

            <div style={S.sideMetric()}>
              <div style={S.sideMetricLabel()}>Potentiel géothermique</div>
              <div
                style={S.sideMetricValue(
                  data.geothermalInterpretation.preliminaryPotential === 'favorable'
                    ? 'green'
                    : undefined
                )}
              >
                {potentialLabel(data.geothermalInterpretation.preliminaryPotential)}
              </div>
              <div style={S.sideMetricSub()}>
                {extraction ? `extraction ~${extraction} kW / sonde` : 'à confirmer'}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              {data.warnings?.map((warning, index) => (
                <div key={index} style={S.warning()}>
                  {warning}
                </div>
              ))}
            </div>

            <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
          </aside>
        </div>
        </>
      )}

      {!loading && !data && !error && (
        <PrimaryBtn onClick={onConfirm}>{T.geologyConfirm}</PrimaryBtn>
      )}
    </div>
  )
}

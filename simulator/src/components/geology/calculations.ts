import type { ApiLayer, GeologyApiResponse, LegendBand } from './types'
import { hydroLabel, layerLongLabel } from './labels'

export function weightedLambda(layers: ApiLayer[], maxDepth: number) {
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

export function initialGroundTemperature(maxDepth: number) {
  return maxDepth >= 200 ? 13.5 : 12.5
}

export function extractionEstimate(lambda: number | null) {
  if (lambda === null) return null
  if (lambda >= 2.6) return 6.5
  if (lambda >= 2.2) return 6
  if (lambda >= 1.8) return 5
  return 4
}

export function lambdaAtDepth(layers: ApiLayer[], depthM: number) {
  const sorted = [...layers].sort((a, b) => a.topM - b.topM)

  const layer =
    sorted.find((l) => depthM >= l.topM && depthM < l.bottomM) ||
    sorted.find((l) => depthM >= l.topM && depthM <= l.bottomM) ||
    sorted[sorted.length - 1]

  return layer?.thermalConductivityWmK || 2
}

export function cumulativeLambdaAtDepth(layers: ApiLayer[], depthM: number) {
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

export function lambdaCurvePoints(layers: ApiLayer[], maxDepth: number) {
  const safeMaxDepth = Math.max(1, maxDepth || 200)
  const sampleCount = 160
  const points: Array<[number, number]> = []

  const xForLambda = (lambda: number) => {
    // Échelle horizontale affichée : 1.0 à 3.6 W/m·K
    const normalized = Math.max(0, Math.min(1, (lambda - 1.0) / 2.6))
    return 24 + normalized * 54
  }

  const addPoint = (depth: number) => {
    const safeDepth = Math.max(0, Math.min(safeMaxDepth, depth))
    const lambda = cumulativeLambdaAtDepth(layers, safeDepth)

    const x = xForLambda(lambda)

    // Très important :
    // le SVG est en viewBox 0 0 100 100,
    // donc la profondeur doit être convertie en pourcentage.
    const y = (safeDepth / safeMaxDepth) * 100

    points.push([x, y])
  }

  // Point initial exact à 0 m
  addPoint(0)

  // Points intermédiaires
  for (let i = 1; i < sampleCount; i++) {
    addPoint((i / sampleCount) * safeMaxDepth)
  }

  // Point final exact à maxDepth = bas de la coupe
  addPoint(safeMaxDepth)

  const last = points[points.length - 1]
  if (last) {
    last[1] = 100
  }

  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
}

export function lambdaCurvePath(layers: ApiLayer[], maxDepth: number) {
  const rawPoints = lambdaCurvePoints(layers, maxDepth)
    .split(' ')
    .map((point) => point.split(',').map(Number))
    .filter((point): point is [number, number] =>
      point.length === 2 &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    )

  if (rawPoints.length === 0) {
    return ''
  }

  const points = [...rawPoints]

  // Sécurité absolue : le premier point est en haut, le dernier point est en bas.
  const first = points[0]
  first[1] = 0

  const last = points[points.length - 1]
  last[1] = 100

  // Si la fonction lambdaCurvePoints a été modifiée plus tard,
  // on force quand même un segment final jusqu'au bas.
  const lastX = last[0]
  points.push([lastX, 100])

  return points
    .map(([x, y], index) =>
      `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    )
    .join(' ')
}

export function lambdaCurveSegments(layers: ApiLayer[], maxDepth: number) {
  const rawPoints = lambdaCurvePoints(layers, maxDepth)
    .split(' ')
    .map((point) => point.split(',').map(Number))
    .filter((point): point is [number, number] =>
      point.length === 2 &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    )

  if (rawPoints.length < 2) return []

  const points = [...rawPoints]

  // Sécurité absolue : premier point à 0 %, dernier point à 100 %.
  points[0] = [points[0][0], 0]
  points[points.length - 1] = [points[points.length - 1][0], 100]

  return points.slice(0, -1).map((from, index) => {
    const to = points[index + 1]

    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    return {
      index,
      left: from[0],
      top: from[1],
      length,
      angle,
    }
  })
}



export function shouldShowWaterLine(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro) return false
  if (hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) return false
  return hydro.waterMode === 'continuous' || hydro.waterMode === 'perched'
}

export function hydroLineLabel(data: GeologyApiResponse) {
  const hydro = data.hydrogeology
  if (!hydro || hydro.likelyWaterTableDepthM === null || hydro.likelyWaterTableDepthM === undefined) return null
  if (!shouldShowWaterLine(data)) return null
  return `niveau indicatif ~${Math.round(hydro.likelyWaterTableDepthM)} m`
}

export function computeLegendBands(layers: ApiLayer[], maxDepth: number): LegendBand[] {
  const minBandPct = 11.5

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
        ? 17
        : contentLength > 110
        ? 14
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
    const minAllowed = visualBoundaries[i - 1] + 9
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

export function bandForLayer(bands: LegendBand[], index: number): LegendBand {
  return bands.find((band) => band.index === index) || {
    index,
    top: 0,
    bottom: 10,
    height: 10,
    mid: 5,
  }
}

export function connectorPath(layer: ApiLayer, index: number, maxDepth: number, bands: LegendBand[]) {
  const y1 = Math.max(0, Math.min(100, (layer.bottomM / maxDepth) * 100))
  const y2 = bandForLayer(bands, index).bottom

  return `M 0 ${y1} L 14 ${y1} C 42 ${y1}, 58 ${y2}, 86 ${y2} L 100 ${y2}`
}

export function connectorDepthLabel(layer: ApiLayer) {
  return `-${Math.round(layer.bottomM)} m`
}

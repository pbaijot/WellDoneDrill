import type {
  BoreholePoint,
  DrillingCollector,
  GeneratedBoreholeLayout,
  HorizontalConnection,
  LatLngPoint,
} from './types'

const EARTH_RADIUS_M = 6371008.8

function toRad(value: number) {
  return value * Math.PI / 180
}

function metersPerDegreeLat() {
  return 111320
}

function metersPerDegreeLng(lat: number) {
  return 111320 * Math.cos(toRad(lat))
}

function projectPoint(point: LatLngPoint, origin: LatLngPoint) {
  return {
    x: (point.lng - origin.lng) * metersPerDegreeLng(origin.lat),
    y: (point.lat - origin.lat) * metersPerDegreeLat(),
  }
}

function unprojectPoint(point: { x: number; y: number }, origin: LatLngPoint): LatLngPoint {
  return {
    lat: origin.lat + point.y / metersPerDegreeLat(),
    lng: origin.lng + point.x / metersPerDegreeLng(origin.lat),
  }
}

function pointInPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>) {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 0.000001) + xi

    if (intersects) inside = !inside
  }

  return inside
}

function mainPolygonAxisAngle(projectedPolygon: Array<{ x: number; y: number }>) {
  if (projectedPolygon.length < 2) return 0

  let bestAngle = 0
  let longest = 0

  for (let i = 0; i < projectedPolygon.length; i++) {
    const current = projectedPolygon[i]
    const next = projectedPolygon[(i + 1) % projectedPolygon.length]

    const dx = next.x - current.x
    const dy = next.y - current.y
    const length = Math.hypot(dx, dy)

    if (length > longest) {
      longest = length
      bestAngle = Math.atan2(dy, dx)
    }
  }

  return bestAngle
}

function rotatePoint(point: { x: number; y: number }, angle: number) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  }
}

export function polygonAreaM2(points: LatLngPoint[]) {
  if (points.length < 3) return 0

  const origin = points[0]
  const projected = points.map((point) => projectPoint(point, origin))

  let sum = 0

  for (let i = 0; i < projected.length; i++) {
    const current = projected[i]
    const next = projected[(i + 1) % projected.length]
    sum += current.x * next.y - next.x * current.y
  }

  return Math.abs(sum / 2)
}

export function estimateBoreholeCapacity(areaM2: number, spacingM = 8) {
  if (areaM2 <= 0) return 0

  const theoreticalCellM2 = spacingM * spacingM
  const layoutEfficiency = 0.7

  return Math.max(0, Math.floor((areaM2 * layoutEfficiency) / theoreticalCellM2))
}

export function formatArea(areaM2: number) {
  if (areaM2 >= 10000) return `${(areaM2 / 10000).toFixed(2)} ha`
  return `${Math.round(areaM2)} m²`
}

export function distanceM(a: LatLngPoint, b: LatLngPoint) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function polygonCentroid(points: LatLngPoint[]) {
  if (points.length === 0) return null

  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length

  return { lat, lng }
}

function nearestCollector(
  borehole: BoreholePoint,
  collectors: DrillingCollector[],
  origin: LatLngPoint
) {
  const projectedBorehole = projectPoint(borehole, origin)

  return collectors
    .map((collector) => ({
      collector,
      distance: Math.hypot(
        projectedBorehole.x - projectPoint(collector, origin).x,
        projectedBorehole.y - projectPoint(collector, origin).y
      ),
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.collector
}

export function generateBoreholeLayout({
  polygon,
  buildingEntry,
  requestedBoreholes,
  spacingM = 8,
  collectorCount = 0,
  collectorOverrides = {},
}: {
  polygon: LatLngPoint[]
  buildingEntry: LatLngPoint | null
  requestedBoreholes: number
  spacingM?: number
  collectorCount?: number
  collectorOverrides?: Record<string, LatLngPoint>
}): GeneratedBoreholeLayout | null {
  if (polygon.length < 3 || !buildingEntry || requestedBoreholes <= 0) return null

  const origin = polygon[0]
  const projectedPolygon = polygon.map((point) => projectPoint(point, origin))
  const axisAngle = mainPolygonAxisAngle(projectedPolygon)
  const rotatedPolygon = projectedPolygon.map((point) => rotatePoint(point, -axisAngle))

  const centroid = polygonCentroid(polygon)
  const projectedCentroid = centroid ? projectPoint(centroid, origin) : { x: 0, y: 0 }
  const rotatedCentroid = rotatePoint(projectedCentroid, -axisAngle)
  const projectedEntry = projectPoint(buildingEntry, origin)
  const rotatedEntry = rotatePoint(projectedEntry, -axisAngle)

  const minX = Math.min(...rotatedPolygon.map((point) => point.x))
  const maxX = Math.max(...rotatedPolygon.map((point) => point.x))
  const minY = Math.min(...rotatedPolygon.map((point) => point.y))
  const maxY = Math.max(...rotatedPolygon.map((point) => point.y))

  const candidates: Array<{ x: number; y: number; score: number }> = []

  const startX = rotatedCentroid.x - Math.ceil((rotatedCentroid.x - minX) / spacingM) * spacingM
  const startY = rotatedCentroid.y - Math.ceil((rotatedCentroid.y - minY) / spacingM) * spacingM

  for (let y = startY; y <= maxY; y += spacingM) {
    for (let x = startX; x <= maxX; x += spacingM) {
      const rotatedPoint = { x, y }
      if (!pointInPolygon(rotatedPoint, rotatedPolygon)) continue

      const distanceToCentroid = Math.hypot(x - rotatedCentroid.x, y - rotatedCentroid.y)
      const distanceToEntry = Math.hypot(x - rotatedEntry.x, y - rotatedEntry.y)

      candidates.push({
        x,
        y,
        score: distanceToCentroid * 1.0 + distanceToEntry * 0.18,
      })
    }
  }

  candidates.sort((a, b) => a.score - b.score)

  const selected: Array<{ x: number; y: number }> = []

  for (const candidate of candidates) {
    const tooClose = selected.some((point) =>
      Math.hypot(candidate.x - point.x, candidate.y - point.y) < spacingM * 0.92
    )

    if (tooClose) continue

    selected.push({ x: candidate.x, y: candidate.y })
    if (selected.length >= requestedBoreholes) break
  }

  const boreholes: BoreholePoint[] = selected.map((rotatedPoint, index) => {
    const unrotated = rotatePoint(rotatedPoint, axisAngle)

    return {
      ...unprojectPoint(unrotated, origin),
      id: `S${String(index + 1).padStart(2, '0')}`,
    }
  })

  const safeCollectorCount = Math.max(0, Math.min(collectorCount, Math.max(1, boreholes.length)))
  const connections: HorizontalConnection[] = []

  if (safeCollectorCount === 0) {
    boreholes.forEach((borehole) => {
      connections.push({
        id: `${borehole.id}-BAT`,
        from: borehole,
        to: buildingEntry,
        type: 'borehole-to-building',
      })
    })

    return {
      mode: 'direct',
      boreholes,
      collector: null,
      collectors: [],
      connections,
    }
  }

  const sortedSelected = [...selected]
    .map((point, index) => ({ point, borehole: boreholes[index] }))
    .sort((a, b) => a.point.x - b.point.x)

  const collectors: DrillingCollector[] = []

  for (let i = 0; i < safeCollectorCount; i++) {
    const id = `COL${String(i + 1).padStart(2, '0')}`

    const group = sortedSelected.filter((_, index) =>
      Math.floor((index * safeCollectorCount) / Math.max(1, sortedSelected.length)) === i
    )

    const fallback = selected.length ? selected[0] : rotatedCentroid

    const centerRotated = group.length
      ? {
          x: group.reduce((sum, item) => sum + item.point.x, 0) / group.length,
          y: group.reduce((sum, item) => sum + item.point.y, 0) / group.length,
        }
      : fallback

    const center = rotatePoint(centerRotated, axisAngle)

    collectors.push(
      collectorOverrides[id]
        ? { ...collectorOverrides[id], id }
        : { ...unprojectPoint(center, origin), id }
    )
  }

  boreholes.forEach((borehole) => {
    const collector = nearestCollector(borehole, collectors, origin)

    if (!collector) return

    connections.push({
      id: `${borehole.id}-${collector.id}`,
      from: borehole,
      to: collector,
      type: 'borehole-to-collector',
    })
  })

  collectors.forEach((collector) => {
    connections.push({
      id: `${collector.id}-BAT`,
      from: collector,
      to: buildingEntry,
      type: 'collector-to-building',
    })
  })

  return {
    mode: 'collector',
    boreholes,
    collector: collectors[0] || null,
    collectors,
    connections,
  }
}

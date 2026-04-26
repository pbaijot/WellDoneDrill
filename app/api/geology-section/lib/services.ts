import type { ArcFeature, EvidencePoint, EvidenceSource } from "./types"
import { featureSummary, haversineM, metersToLat, metersToLng } from "./helpers"

export const SERVICES = {
  geologie: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/GEOLOGIE/MapServer",
  cgeolSimple: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/CGEOL_SIMPLE/MapServer",
  uer: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/UER/MapServer",
  cnsw: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/CNSW/MapServer",
}

export const GEOLOGIE_LAYERS = {
  affleurements: 1,
  sondages: 2,
}

export async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "WellDoneDrill-GeologySection/1.4" },
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return res.json()
}

export async function identifyPoint(
  serviceUrl: string,
  lat: number,
  lng: number,
  layers = "all",
  tolerance = "3"
): Promise<ArcFeature[]> {
  const delta = 0.006

  const params = new URLSearchParams({
    geometry: JSON.stringify({
      x: lng,
      y: lat,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: "esriGeometryPoint",
    sr: "4326",
    layers,
    tolerance,
    mapExtent: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    imageDisplay: "900,900,96",
    returnGeometry: "false",
    f: "json",
  })

  const data = await fetchJson(`${serviceUrl}/identify?${params.toString()}`)
  return Array.isArray(data.results) ? data.results : []
}

export async function queryNearbyLayer(
  serviceUrl: string,
  layerId: number,
  lat: number,
  lng: number,
  radiusM: number,
  source: EvidenceSource
): Promise<EvidencePoint[]> {
  const dLat = metersToLat(radiusM)
  const dLng = metersToLng(radiusM, lat)

  const envelope = {
    xmin: lng - dLng,
    ymin: lat - dLat,
    xmax: lng + dLng,
    ymax: lat + dLat,
    spatialReference: { wkid: 4326 },
  }

  const params = new URLSearchParams({
    f: "json",
    where: "1=1",
    outFields: "*",
    returnGeometry: "true",
    geometry: JSON.stringify(envelope),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    outSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    resultRecordCount: "50",
  })

  const data = await fetchJson(`${serviceUrl}/${layerId}/query?${params.toString()}`)
  const features: ArcFeature[] = Array.isArray(data.features) ? data.features : []

  return features
    .map((feature) => {
      const attrs = feature.attributes || {}
      const geom = feature.geometry || {}
      const y = Number(geom.y)
      const x = Number(geom.x)

      const distance =
        Number.isFinite(y) && Number.isFinite(x)
          ? Math.round(haversineM(lat, lng, y, x))
          : null

      return {
        source,
        distanceM: distance,
        attributes: attrs,
        summary: featureSummary(attrs),
      }
    })
    .sort((a, b) => (a.distanceM ?? 999999) - (b.distanceM ?? 999999))
}

export async function queryProgressive(
  serviceUrl: string,
  layerId: number,
  lat: number,
  lng: number,
  requestedRadiusM: number,
  source: EvidenceSource
) {
  const radii = [500, 1500, 3000, requestedRadiusM, 5000]
    .filter((v, i, a) => v <= 5000 && a.indexOf(v) === i)
    .sort((a, b) => a - b)

  let last: EvidencePoint[] = []

  for (const radius of radii) {
    const found = await queryNearbyLayer(serviceUrl, layerId, lat, lng, radius, source)
    last = found

    if (found.length >= 3 || radius >= requestedRadiusM) {
      return { radiusM: radius, items: found }
    }
  }

  return { radiusM: radii[radii.length - 1] || requestedRadiusM, items: last }
}

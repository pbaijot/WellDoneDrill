import type { LatLngPoint } from './types'

export const CADASTRE_REST_BASE =
  'https://geoservices.wallonie.be/arcgis/rest/services/PLAN_REGLEMENT/CADMAP_2024_PARCELLES/MapServer'

export const CADASTRE_SEARCH_DELTA_DEG = 0.004

export function cadastreQueryUrl(layerId: 0 | 1, center: LatLngPoint) {
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
      xmin: center.lng - CADASTRE_SEARCH_DELTA_DEG,
      ymin: center.lat - CADASTRE_SEARCH_DELTA_DEG,
      xmax: center.lng + CADASTRE_SEARCH_DELTA_DEG,
      ymax: center.lat + CADASTRE_SEARCH_DELTA_DEG,
      spatialReference: { wkid: 4326 },
    }),
  })

  return `${CADASTRE_REST_BASE}/${layerId}/query?${params.toString()}`
}

export function cadastreParcelStyle() {
  return {
    color: '#FFFFFF',
    weight: 1.6,
    opacity: 0.95,
    fillOpacity: 0,
  }
}

export function cadastreBuildingStyle() {
  return {
    color: '#FFD94F',
    weight: 1.5,
    opacity: 0.95,
    fillColor: '#FFD94F',
    fillOpacity: 0.18,
  }
}

export type LatLngPoint = {
  lat: number
  lng: number
}

export type BoreholeLayoutMode = 'direct' | 'collector'

export type BoreholePoint = LatLngPoint & {
  id: string
}

export type DrillingCollector = LatLngPoint & {
  id: string
}

export type HorizontalConnection = {
  id: string
  from: LatLngPoint
  to: LatLngPoint
  type: 'borehole-to-building' | 'borehole-to-collector' | 'collector-to-building'
}

export type GeneratedBoreholeLayout = {
  mode: BoreholeLayoutMode
  boreholes: BoreholePoint[]
  collector: DrillingCollector | null
  collectors: DrillingCollector[]
  connections: HorizontalConnection[]
}

export type DrillingAreaResult = {
  areaM2: number
  estimatedBoreholes: number
  requestedBoreholes: number
  spacingM: number
  collectorCount: number
  points: LatLngPoint[]
  buildingEntry: LatLngPoint | null
  layout: GeneratedBoreholeLayout | null
}

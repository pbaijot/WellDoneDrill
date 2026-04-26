export type ConfidenceLevel = "low" | "medium" | "high"

export type Lithology =
  | "soil"
  | "loam"
  | "clay"
  | "sand"
  | "limestone"
  | "schist"
  | "sandstone"
  | "mixed"
  | "unknown"

export type GeologicalLayerType =
  | "surface"
  | "cover"
  | "weathered-zone"
  | "bedrock"
  | "deep-bedrock"
  | "unknown"

export type LayerDisplay = {
  color: string
  textColor: "light" | "dark"
  shortLabel: string
  longLabel: string
  hatch: "none" | "aquifer" | "fractured"
}

export type ConfidenceDetails = {
  level: ConfidenceLevel
  score: number
  reasons: string[]
}


export type ArcFeature = {
  attributes?: Record<string, any>
  geometry?: any
}

export type EvidenceSource = "affleurement" | "sondage" | "surface" | "context" | "soil"

export type EvidencePoint = {
  source: EvidenceSource
  distanceM: number | null
  attributes: Record<string, any>
  summary: string
}

export type InterpretedLayer = {
  name: string
  topM: number
  bottomM: number

  // Legacy fields kept for current frontend compatibility
  type: "cover" | "bedrock" | "aquifer" | "aquitard" | "unknown"
  hydroClass: "aquifer" | "aquitard" | "aquiclude" | "unknown"

  // Structured fields for next iterations
  lithology: Lithology
  layerType: GeologicalLayerType
  display: LayerDisplay

  thermalConductivityWmK: number | null
  confidence: ConfidenceLevel
  rationale: string
}

export type RegionalModel = {
  key: string
  label: string
  confidence: ConfidenceLevel
  layers: InterpretedLayer[]
  message: string
}

export type SurfaceSample = {
  index: number
  distanceM: number
  lat: number
  lng: number
  unit: string | null
  attributes: Record<string, any> | null
  status: "ok" | "empty" | "unavailable"
}

export type HydroOverlay = {
  topM: number
  bottomM: number
  mode: "aquifer" | "fractured-water-possible" | "none"
  label: string | null
}

export type HydrogeologyInterpretation = {
  confidence: ConfidenceLevel
  likelyWaterTableDepthM: number | null
  waterMode: "continuous" | "fractured" | "perched" | "unknown"
  summary: string
  overlays: HydroOverlay[]
  counts: {
    aquifer: number
    aquitard: number
    unknown: number
  }
}

export type GeologyInput = {
  lat: number
  lng: number
  depthM: number
  lengthM: number
  radiusM: number
  orientationDeg: number
  sampleCount: number
}

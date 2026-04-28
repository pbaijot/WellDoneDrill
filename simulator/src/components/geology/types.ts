export type ApiLayer = {
  name: string
  stratigraphicName?: string
  topM: number
  bottomM: number
  type: 'cover' | 'bedrock' | 'aquifer' | 'aquitard' | 'unknown'
  hydroClass: 'aquifer' | 'aquitard' | 'aquiclude' | 'unknown'
  lithology?: 'soil' | 'loam' | 'clay' | 'sand' | 'limestone' | 'schist' | 'sandstone' | 'mixed' | 'unknown'
  lithologyCategory?: 'argile' | 'argile_silt' | 'silt_sable_argile' | 'sable' | 'sable_gravier' | 'craie' | 'schiste_gres_socle' | 'unknown'
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

export type HydroOverlay = {
  topM: number
  bottomM: number
  mode: 'aquifer' | 'fractured-water-possible' | 'none'
  label: string | null
}

export type EvidencePoint = {
  source: 'affleurement' | 'sondage' | 'surface' | 'context' | 'soil'
  distanceM: number | null
  summary: string
}

export type GeologyApiResponse = {
  geologyKnowledge?: {
    sheetId: string
    sheetCode: string
    name: string
    modelVersion: string
    status: string
    surfaceClass?: string | null
    surfaceEvidenceText?: string | null
    quality?: {
      globalScore?: number
      documentCoverage?: number
      scientificInterpretation?: string
      reviewStatus?: string
    } | null
    regionalContext?: {
      structuralStyle?: string
      expectedVariability?: string
      mainHydroRisks?: string[]
      summary?: string
    } | null
    units?: Array<{
      id: string
      label: string
      lithologies: string[]
      hydroClass: string
      lambda: number
      closedLoopPotential?: string
      openLoopPotential?: string
      drillingRisk?: string
      confidence: string
    }>
  } | null
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

export type LegendBand = {
  index: number
  top: number
  bottom: number
  height: number
  mid: number
}

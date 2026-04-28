import fs from 'fs'
import path from 'path'

import type { InterpretedLayer } from './types'

type BBox = {
  west: number
  south: number
  east: number
  north: number
}

type WddUnit = {
  id: string
  label: string
  role: 'cover' | 'bedrock' | string
  lithologies: string[]
  defaultLambdaWmK: number
  hydroClass: 'unknown' | 'aquifer' | 'aquitard' | 'aquiclude' | string
  interpretation: string
  confidence: 'low' | 'medium' | 'high' | string
  closedLoopPotential?: string
  openLoopPotential?: string
  drillingRisk?: string
}

type WddSequenceLayer = {
  unitId: string
  topM: number
  bottomM: number
  confidence: 'low' | 'medium' | 'high' | string
}

type WddSurfaceSample = {
  unit?: string | null
  attributes?: Record<string, any> | null
}

type WddModel = {
  sheetId: string
  sheetCode: string
  name: string
  status: string
  modelVersion: string
  quality?: {
    globalScore?: number
    documentCoverage?: number
    scientificInterpretation?: string
    reviewStatus?: string
  }
  regionalContext?: {
    structuralStyle?: string
    expectedVariability?: string
    mainHydroRisks?: string[]
    summary?: string
  }
  wddUnits: WddUnit[]
  defaultClosedLoopSection?: {
    depthM: number
    sequence: WddSequenceLayer[]
    warning?: string
  }
  warnings?: string[]
}

const SHEETS: Array<{
  id: string
  bbox: BBox
  modelPath: string
}> = [
  {
    id: '49-1-2_tavier-esneux',
    bbox: {
      west: 5.4425,
      south: 50.458056,
      east: 5.668333,
      north: 50.550278,
    },
    modelPath: 'data/geology/sheets/49-1-2_tavier-esneux/wdd_model.json',
  },
]

function isInBbox(lat: number, lng: number, bbox: BBox) {
  return lng >= bbox.west && lng <= bbox.east && lat >= bbox.south && lat <= bbox.north
}

function loadJson<T>(relativePath: string): T | null {
  try {
    const fullPath = path.join(process.cwd(), relativePath)
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T
  } catch {
    return null
  }
}

export function findWddGeologyModel(lat: number, lng: number) {
  const sheet = SHEETS.find((item) => isInBbox(lat, lng, item.bbox))
  if (!sheet) return null

  const model = loadJson<WddModel>(sheet.modelPath)
  if (!model) return null

  return {
    sheet,
    model,
  }
}

function unitType(unit: WddUnit): InterpretedLayer['type'] {
  if (unit.role === 'cover') return 'cover'
  if (unit.hydroClass === 'aquifer') return 'aquifer'
  if (unit.hydroClass === 'aquitard') return 'aquitard'
  return 'bedrock'
}

function lithologyForUnit(unit: WddUnit): InterpretedLayer['lithology'] {
  if (unit.id.includes('cover')) return 'loam'
  if (unit.id.includes('calcaires')) return 'limestone'
  if (unit.id.includes('schistes')) return 'schist'
  if (unit.id.includes('gres')) return 'sandstone'
  if (unit.id.includes('breches')) return 'mixed'
  return 'unknown'
}

function lithologyCategoryForUnit(unit: WddUnit): InterpretedLayer['lithologyCategory'] {
  if (unit.id.includes('cover')) return 'silt_sable_argile'
  if (unit.id.includes('schistes')) return 'schiste_gres_socle'
  if (unit.id.includes('gres')) return 'schiste_gres_socle'
  if (unit.id.includes('calcaires')) return 'unknown'
  if (unit.id.includes('breches')) return 'unknown'
  return 'unknown'
}

function layerTypeForUnit(unit: WddUnit): InterpretedLayer['layerType'] {
  if (unit.role === 'cover') return 'cover'
  return 'bedrock'
}

function displayForUnit(unit: WddUnit): InterpretedLayer['display'] {
  const color =
    unit.id.includes('cover') ? '#C9AD84' :
    unit.id.includes('calcaires') ? '#B9B1A0' :
    unit.id.includes('schistes') ? '#8A5E2F' :
    unit.id.includes('gres') ? '#D6C18A' :
    unit.id.includes('breches') ? '#AFA08B' :
    '#9A9088'

  const textColor =
    unit.id.includes('calcaires') || unit.id.includes('gres') || unit.id.includes('cover')
      ? 'dark'
      : 'light'

  const hatch =
    unit.hydroClass === 'aquifer'
      ? 'aquifer'
      : unit.hydroClass === 'aquitard'
        ? 'fractured'
        : 'none'

  return {
    color,
    textColor,
    shortLabel: unit.label,
    longLabel: unit.interpretation,
    hatch,
  }
}

function normalizeHydroClass(unit: WddUnit): InterpretedLayer['hydroClass'] {
  if (unit.hydroClass === 'aquifer') return 'aquifer'
  if (unit.hydroClass === 'aquitard') return 'aquitard'
  if (unit.hydroClass === 'aquiclude') return 'aquiclude'
  return 'unknown'
}

function normalizeSurfaceText(surfaceText: string) {
  return surfaceText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function classifySurfaceUnit(surfaceText: string) {
  const text = normalizeSurfaceText(surfaceText)

  const hasCarbonate =
    text.includes('calcaire') ||
    text.includes('dolomie') ||
    text.includes('carbonat') ||
    text.includes('calcschiste') ||
    text.includes('lustin') ||
    text.includes('neuville') ||
    text.includes('terwagne') ||
    text.includes('waulsort') ||
    text.includes('vise') ||
    text.includes('visé') ||
    text.includes('tournaisien') ||
    text.includes('frasnien') ||
    text.includes('givétien') ||
    text.includes('givetien')

  const hasSandstone =
    text.includes('gres') ||
    text.includes('grès') ||
    text.includes('psammite') ||
    text.includes('quartzite') ||
    text.includes('pepinster') ||
    text.includes('esneux') ||
    text.includes('montfort') ||
    text.includes('evieux') ||
    text.includes('évi') ||
    text.includes('famenne arenacee') ||
    text.includes('arénacé') ||
    text.includes('arenace')

  const hasSchist =
    text.includes('schiste') ||
    text.includes('phyllade') ||
    text.includes('famenne') ||
    text.includes('siltite') ||
    text.includes('argileux') ||
    text.includes('argileuse')

  const hasBreccia =
    text.includes('breche') ||
    text.includes('brèche') ||
    text.includes('conglomerat') ||
    text.includes('conglomérat') ||
    text.includes('poudingue')

  const hasCover =
    text.includes('limon') ||
    text.includes('alluvion') ||
    text.includes('colluvion') ||
    text.includes('remblai') ||
    text.includes('couverture') ||
    text.includes('quaternaire') ||
    text.includes('terrasse')

  // Priorité importante :
  // si une lithologie de substratum est détectée, elle prime sur les mots de couverture.
  // Les cartes SPW peuvent mentionner des limons/alluvions dans certains champs,
  // mais pour le modèle géothermique, c’est le substratum qui doit piloter la coupe.
  if (hasCarbonate) return 'carbonate'
  if (hasSandstone) return 'sandstone'
  if (hasSchist) return 'schist'
  if (hasBreccia) return 'breccia'
  if (hasCover) return 'cover'

  return 'unknown'
}

function textFromSurfaceSamples(surfaceSamples: WddSurfaceSample[] = []) {
  const parts: string[] = []

  for (const sample of surfaceSamples) {
    if (sample.unit) parts.push(sample.unit)

    const attrs = sample.attributes || {}
    for (const value of Object.values(attrs)) {
      if (typeof value === 'string' && value.length < 250) {
        parts.push(value)
      }
    }
  }

  return parts.join(' | ')
}

function classPriority(surfaceClass: string) {
  if (surfaceClass === 'carbonate') return 5
  if (surfaceClass === 'sandstone') return 4
  if (surfaceClass === 'schist') return 3
  if (surfaceClass === 'breccia') return 3
  if (surfaceClass === 'cover') return 1
  return 0
}

function dominantClassFromSamples(surfaceSamples: WddSurfaceSample[] = []) {
  const counts: Record<string, number> = {}

  for (const sample of surfaceSamples) {
    const sampleText = [
      sample.unit || '',
      ...Object.values(sample.attributes || {}).filter((value) => typeof value === 'string'),
    ].join(' | ')

    const klass = classifySurfaceUnit(sampleText)
    if (klass === 'unknown') continue

    counts[klass] = (counts[klass] || 0) + 1
  }

  const candidates = Object.entries(counts)
    .filter(([klass]) => klass !== 'cover')
    .sort((a, b) => {
      const countDiff = b[1] - a[1]
      if (countDiff !== 0) return countDiff
      return classPriority(b[0]) - classPriority(a[0])
    })

  return {
    counts,
    dominantSubstratumClass: candidates[0]?.[0] || null,
  }
}

function resolveEffectiveSurfaceClass({
  surfaceEvidence,
  surfaceSamples,
}: {
  surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }>
  surfaceSamples?: WddSurfaceSample[]
}) {
  const pointText = firstSurfaceText(surfaceEvidence)
  const pointClass = classifySurfaceUnit(pointText)

  const sampleResult = dominantClassFromSamples(surfaceSamples || [])
  const sampleText = textFromSurfaceSamples(surfaceSamples || [])

  // Si le point tombe sur une couverture, on utilise le transect
  // pour estimer le substratum probable autour du point.
  if (pointClass === 'cover' && sampleResult.dominantSubstratumClass) {
    return {
      pointClass,
      effectiveClass: sampleResult.dominantSubstratumClass,
      method: 'transect_substratum_from_cover',
      pointText,
      sampleText,
      sampleClassCounts: sampleResult.counts,
    }
  }

  return {
    pointClass,
    effectiveClass: pointClass,
    method: 'point_surface_class',
    pointText,
    sampleText,
    sampleClassCounts: sampleResult.counts,
  }
}

function firstSurfaceText(surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }>) {
  const parts: string[] = []

  for (const evidence of surfaceEvidence || []) {
    if (evidence.summary) parts.push(evidence.summary)

    const attrs = evidence.attributes || {}
    for (const value of Object.values(attrs)) {
      if (typeof value === 'string' && value.length < 250) {
        parts.push(value)
      }
    }
  }

  return parts.join(' | ')
}

function sequenceForSurfaceClass(surfaceClass: string, targetDepthM: number): WddSequenceLayer[] {
  const depth = Math.max(50, targetDepthM)

  if (surfaceClass === 'carbonate') {
    return [
      { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(6, depth), confidence: 'medium' },
      { unitId: 'calcaires_dolomies_karstifies', topM: 6, bottomM: Math.min(150, depth), confidence: 'high' },
      { unitId: 'schistes_phyllades', topM: 150, bottomM: depth, confidence: 'low' },
    ]
  }

  if (surfaceClass === 'sandstone') {
    return [
      { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(8, depth), confidence: 'medium' },
      { unitId: 'gres_psammites_quartzites', topM: 8, bottomM: Math.min(130, depth), confidence: 'high' },
      { unitId: 'schistes_phyllades', topM: 130, bottomM: depth, confidence: 'medium' },
    ]
  }

  if (surfaceClass === 'schist') {
    return [
      { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(10, depth), confidence: 'medium' },
      { unitId: 'schistes_phyllades', topM: 10, bottomM: Math.min(160, depth), confidence: 'high' },
      { unitId: 'gres_psammites_quartzites', topM: 160, bottomM: depth, confidence: 'low' },
    ]
  }

  if (surfaceClass === 'breccia') {
    return [
      { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(6, depth), confidence: 'medium' },
      { unitId: 'breches_conglomerats', topM: 6, bottomM: Math.min(70, depth), confidence: 'medium' },
      { unitId: 'calcaires_dolomies_karstifies', topM: 70, bottomM: Math.min(170, depth), confidence: 'medium' },
      { unitId: 'schistes_phyllades', topM: 170, bottomM: depth, confidence: 'low' },
    ]
  }

  if (surfaceClass === 'cover') {
    return [
      { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(15, depth), confidence: 'high' },
      { unitId: 'schistes_phyllades', topM: 15, bottomM: Math.min(60, depth), confidence: 'low' },
      { unitId: 'calcaires_dolomies_karstifies', topM: 60, bottomM: Math.min(150, depth), confidence: 'low' },
      { unitId: 'gres_psammites_quartzites', topM: 150, bottomM: depth, confidence: 'low' },
    ]
  }

  return [
    { unitId: 'cover_altérites_limons', topM: 0, bottomM: Math.min(8, depth), confidence: 'medium' },
    { unitId: 'schistes_phyllades', topM: 8, bottomM: Math.min(35, depth), confidence: 'low' },
    { unitId: 'calcaires_dolomies_karstifies', topM: 35, bottomM: Math.min(130, depth), confidence: 'medium' },
    { unitId: 'gres_psammites_quartzites', topM: 130, bottomM: depth, confidence: 'low' },
  ]
}

export function buildLayersFromWddModel(
  model: WddModel,
  targetDepthM: number,
  surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }> = [],
  surfaceSamples: WddSurfaceSample[] = []
): InterpretedLayer[] | null {
  const surfaceResolution = resolveEffectiveSurfaceClass({
    surfaceEvidence,
    surfaceSamples,
  })

  const surfaceText = surfaceResolution.pointText
  const surfaceClass = surfaceResolution.effectiveClass

  const sequence =
    surfaceClass === 'unknown'
      ? model.defaultClosedLoopSection?.sequence || []
      : sequenceForSurfaceClass(surfaceClass, targetDepthM)

  if (sequence.length === 0) return null

  const unitById = new Map(model.wddUnits.map((unit) => [unit.id, unit]))

  return sequence
    .map((item, index) => {
      const unit = unitById.get(item.unitId)
      if (!unit) return null

      const topM = Math.max(0, Math.min(targetDepthM, item.topM))
      const bottomM = Math.max(0, Math.min(targetDepthM, item.bottomM))

      if (bottomM <= topM) return null

      return {
        name: unit.label,
        topM,
        bottomM,
        type: unitType(unit),
        hydroClass: normalizeHydroClass(unit),
        lithology: lithologyForUnit(unit),
        lithologyCategory: lithologyCategoryForUnit(unit),
        layerType: layerTypeForUnit(unit),
        thermalConductivityWmK: unit.defaultLambdaWmK,
        confidence: item.confidence === 'high' || item.confidence === 'medium' ? item.confidence : 'low',
        rationale:
          `${unit.interpretation} Séquence choisie selon l'unité SPW effective : ${surfaceClass} ` +
          `(méthode : ${surfaceResolution.method}, classe au point : ${surfaceResolution.pointClass}).`,
        stratigraphicName: `${model.sheetCode} ${model.name} · unité WDD ${index + 1}`,
        display: displayForUnit(unit),
        officialSource: {
          provider: 'interpreted',
          layer: `WDD geology knowledge · effective surface class ${surfaceClass}`,
          field: 'surfaceEvidence',
          rawValue: surfaceText.slice(0, 500) || null,
        },
      } satisfies InterpretedLayer
    })
    .filter(Boolean) as InterpretedLayer[]
}

export function getWddSurfaceClass(
  surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }> = [],
  surfaceSamples: WddSurfaceSample[] = []
) {
  return resolveEffectiveSurfaceClass({
    surfaceEvidence,
    surfaceSamples,
  }).effectiveClass
}

export function getWddSurfaceDiagnosis(
  surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }> = [],
  surfaceSamples: WddSurfaceSample[] = []
) {
  const diagnosis = resolveEffectiveSurfaceClass({
    surfaceEvidence,
    surfaceSamples,
  })

  return {
    pointClass: diagnosis.pointClass,
    effectiveClass: diagnosis.effectiveClass,
    method: diagnosis.method,
    sampleClassCounts: diagnosis.sampleClassCounts,
    pointText: diagnosis.pointText,
    sampleText: diagnosis.sampleText,
  }
}

export function getWddSurfaceText(surfaceEvidence: Array<{ summary?: string; attributes?: Record<string, any> }> = []) {
  return firstSurfaceText(surfaceEvidence)
}

export function buildWddKnowledgeWarnings(model: WddModel) {
  const warnings = [
    `Modèle enrichi par la carte géologique ${model.sheetCode} ${model.name}.`,
    `Modèle WDD ${model.modelVersion} · statut : ${model.status}.`,
  ]

  if (model.quality?.reviewStatus) {
    warnings.push(`Revue qualité : ${model.quality.reviewStatus}.`)
  }

  if (model.defaultClosedLoopSection?.warning) {
    warnings.push(model.defaultClosedLoopSection.warning)
  }

  for (const warning of model.warnings || []) {
    warnings.push(warning)
  }

  return warnings
}

export function buildWddKnowledgePayload(model: WddModel) {
  return {
    sheetId: model.sheetId,
    sheetCode: model.sheetCode,
    name: model.name,
    modelVersion: model.modelVersion,
    status: model.status,
    quality: model.quality || null,
    regionalContext: model.regionalContext || null,
    units: model.wddUnits.map((unit) => ({
      id: unit.id,
      label: unit.label,
      lithologies: unit.lithologies,
      hydroClass: unit.hydroClass,
      lambda: unit.defaultLambdaWmK,
      closedLoopPotential: unit.closedLoopPotential,
      openLoopPotential: unit.openLoopPotential,
      drillingRisk: unit.drillingRisk,
      confidence: unit.confidence,
    })),
  }
}


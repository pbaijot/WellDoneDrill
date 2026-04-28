import fs from 'fs'
import path from 'path'

import type { ApiLayer } from './types'

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

function unitType(unit: WddUnit): ApiLayer['type'] {
  if (unit.role === 'cover') return 'cover'
  if (unit.hydroClass === 'aquifer') return 'aquifer'
  if (unit.hydroClass === 'aquitard') return 'aquitard'
  return 'bedrock'
}

function normalizeHydroClass(unit: WddUnit): ApiLayer['hydroClass'] {
  if (unit.hydroClass === 'aquifer') return 'aquifer'
  if (unit.hydroClass === 'aquitard') return 'aquitard'
  if (unit.hydroClass === 'aquiclude') return 'aquiclude'
  return 'unknown'
}

export function buildLayersFromWddModel(model: WddModel, targetDepthM: number): ApiLayer[] | null {
  const sequence = model.defaultClosedLoopSection?.sequence || []
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
        thermalConductivityWmK: unit.defaultLambdaWmK,
        confidence: item.confidence === 'high' || item.confidence === 'medium' ? item.confidence : 'low',
        rationale: unit.interpretation,
        stratigraphicName: `${model.sheetCode} ${model.name} · unité WDD ${index + 1}`,
        display: {
          color:
            unit.id.includes('cover') ? '#C9AD84' :
            unit.id.includes('calcaires') ? '#B9B1A0' :
            unit.id.includes('schistes') ? '#8A5E2F' :
            unit.id.includes('gres') ? '#D6C18A' :
            unit.id.includes('breches') ? '#AFA08B' :
            '#9A9088',
          textColor:
            unit.id.includes('calcaires') || unit.id.includes('gres') || unit.id.includes('cover')
              ? 'dark'
              : 'light',
        },
      } satisfies ApiLayer
    })
    .filter(Boolean) as ApiLayer[]
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

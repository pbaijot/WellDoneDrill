import { NextRequest, NextResponse } from "next/server"
import type { EvidencePoint, GeologyInput, SurfaceSample } from "./lib/types"
import { allEvidenceText, buildTransect, clampNumber, featureSummary } from "./lib/helpers"
import { GEOLOGIE_LAYERS, SERVICES, identifyPoint, queryProgressive } from "./lib/services"
import { inferRegionalModel, refineWithLocalTerms, makeVariableLayerModel, applyOfficialSpwStratigraphy } from "./lib/models"
import { buildHydrogeologyInterpretation } from "./lib/hydrogeology"
import {
  buildLayersFromWddModel,
  buildWddKnowledgePayload,
  buildWddKnowledgeWarnings,
  findWddGeologyModel,
  getWddSurfaceClass,
  getWddSurfaceText,
} from "./lib/geologyKnowledge"

function parseInput(req: NextRequest): GeologyInput | null {
  const { searchParams } = req.nextUrl

  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }

  return {
    lat,
    lng,
    depthM: clampNumber(Number(searchParams.get("depth") || 200), 50, 300),
    lengthM: clampNumber(Number(searchParams.get("length") || 1000), 200, 3000),
    radiusM: clampNumber(Number(searchParams.get("radius") || 1500), 500, 5000),
    orientationDeg: clampNumber(Number(searchParams.get("orientation") || 90), 0, 359),
    sampleCount: Math.round(clampNumber(Number(searchParams.get("samples") || 9), 3, 25)),
  }
}

async function collectPointEvidence(input: GeologyInput, diagnostics: string[]) {
  const surfaceEvidence: EvidencePoint[] = []
  const soilEvidence: EvidencePoint[] = []

  try {
    const cgeol = await identifyPoint(SERVICES.cgeolSimple, input.lat, input.lng, "all", "4")
    for (const item of cgeol.slice(0, 8)) {
      const attrs = item.attributes || {}
      surfaceEvidence.push({
        source: "surface",
        distanceM: 0,
        attributes: attrs,
        summary: featureSummary(attrs),
      })
    }
  } catch (error: any) {
    diagnostics.push(`CGEOL_SIMPLE non récupéré: ${error.message}`)
  }

  try {
    const uer = await identifyPoint(SERVICES.uer, input.lat, input.lng, "all", "4")
    for (const item of uer.slice(0, 8)) {
      const attrs = item.attributes || {}
      surfaceEvidence.push({
        source: "context",
        distanceM: 0,
        attributes: attrs,
        summary: featureSummary(attrs),
      })
    }
  } catch (error: any) {
    diagnostics.push(`UER non récupéré: ${error.message}`)
  }

  try {
    const cnsw = await identifyPoint(SERVICES.cnsw, input.lat, input.lng, "all", "4")
    for (const item of cnsw.slice(0, 8)) {
      const attrs = item.attributes || {}
      soilEvidence.push({
        source: "soil",
        distanceM: 0,
        attributes: attrs,
        summary: featureSummary(attrs),
      })
    }
  } catch (error: any) {
    diagnostics.push(`CNSW non récupéré: ${error.message}`)
  }

  return { surfaceEvidence, soilEvidence }
}

async function buildSurfaceSamples(input: GeologyInput): Promise<SurfaceSample[]> {
  const transect = buildTransect(
    input.lat,
    input.lng,
    input.lengthM,
    input.orientationDeg,
    input.sampleCount
  )

  return Promise.all(
    transect.map(async (p) => {
      try {
        const items = await identifyPoint(SERVICES.cgeolSimple, p.lat, p.lng, "all", "3")
        const first = items[0]

        return {
          ...p,
          unit: first?.attributes ? featureSummary(first.attributes) : null,
          attributes: first?.attributes || null,
          status: first ? "ok" : "empty",
        }
      } catch {
        return {
          ...p,
          unit: null,
          attributes: null,
          status: "unavailable",
        }
      }
    })
  )
}


function buildConfidenceDetails(
  level: "low" | "medium" | "high",
  evidence: EvidencePoint[],
  sondageRadius: number,
  affleurementRadius: number
) {
  let score = level === "high" ? 0.82 : level === "medium" ? 0.58 : 0.32
  const reasons: string[] = []

  const surface = evidence.filter((e) => e.source === "surface")
  const context = evidence.filter((e) => e.source === "context")
  const soils = evidence.filter((e) => e.source === "soil")
  const sondages = evidence.filter((e) => e.source === "sondage")
  const affleurements = evidence.filter((e) => e.source === "affleurement")

  if (surface.length > 0) {
    score += 0.05
    reasons.push("Carte géologique disponible au point analysé.")
  } else {
    score -= 0.06
    reasons.push("Carte géologique non récupérée directement au point analysé.")
  }

  if (context.length > 0) {
    score += 0.05
    reasons.push("Contexte régional UER disponible.")
  }

  if (soils.length > 0) {
    score += 0.04
    reasons.push("Carte des sols disponible au point analysé.")
  }

  if (sondages.length >= 2) {
    score += 0.12
    reasons.push("Plusieurs sondages publics proches ont été récupérés.")
  } else if (sondages.length === 1) {
    score += 0.06
    reasons.push("Un sondage public proche a été récupéré.")
  } else {
    score -= 0.08
    reasons.push(`Aucun sondage public proche récupéré dans le rayon analysé (${sondageRadius} m).`)
  }

  if (affleurements.length >= 3) {
    score += 0.08
    reasons.push("Plusieurs affleurements proches ont été récupérés.")
  } else if (affleurements.length > 0) {
    score += 0.04
    reasons.push("Au moins un affleurement proche a été récupéré.")
  }

  if (affleurementRadius > 1500) {
    score -= 0.04
    reasons.push(`Rayon élargi nécessaire pour trouver des observations (${affleurementRadius} m).`)
  }

  const normalizedScore = Math.max(0.05, Math.min(0.95, score))

  return {
    level,
    score: Number(normalizedScore.toFixed(2)),
    reasons,
  }
}



function weightedThermalConductivity(layers: { topM: number; bottomM: number; thermalConductivityWmK: number | null }[], depthM: number) {
  let weightedSum = 0
  let accountedDepth = 0

  for (const layer of layers) {
    if (!layer.thermalConductivityWmK) continue

    const top = Math.max(0, layer.topM)
    const bottom = Math.min(depthM, layer.bottomM)
    const thickness = Math.max(0, bottom - top)

    if (thickness <= 0) continue

    weightedSum += thickness * layer.thermalConductivityWmK
    accountedDepth += thickness
  }

  return accountedDepth > 0 ? weightedSum / accountedDepth : null
}


function buildWarnings(evidence: EvidencePoint[], confidence: string, sondageRadius: number, affleurementRadius: number) {
  const warnings = [
    "Coupe indicative générée automatiquement à partir des services publics disponibles.",
    "Cette analyse ne remplace pas une étude géologique, une visite de site ou un rapport de forage.",
    "Les profondeurs de couches sont interprétatives : elles servent à préqualifier un projet, pas à prescrire un forage.",
  ]

  const sondages = evidence.filter((e) => e.source === "sondage")

  if (sondages.length === 0) {
    warnings.push(`Aucun sondage public proche n’a été récupéré dans le rayon analysé (${sondageRadius} m).`)
  }

  if (confidence === "low") {
    warnings.push("Confiance faible : peu de données publiques exploitables automatiquement autour du point.")
  }

  if (affleurementRadius > 1500) {
    warnings.push(`Les observations géologiques proches proviennent d’un rayon élargi (${affleurementRadius} m).`)
  }

  return warnings
}

export async function GET(req: NextRequest) {
  const input = parseInput(req)

  if (!input) {
    return NextResponse.json({ error: "Paramètres lat/lng invalides" }, { status: 400 })
  }

  const diagnostics: string[] = []
  const { surfaceEvidence, soilEvidence } = await collectPointEvidence(input, diagnostics)

  let affleurementsResult = { radiusM: input.radiusM, items: [] as EvidencePoint[] }
  let sondagesResult = { radiusM: input.radiusM, items: [] as EvidencePoint[] }

  try {
    affleurementsResult = await queryProgressive(
      SERVICES.geologie,
      GEOLOGIE_LAYERS.affleurements,
      input.lat,
      input.lng,
      input.radiusM,
      "affleurement"
    )
  } catch (error: any) {
    diagnostics.push(`Affleurements non récupérés: ${error.message}`)
  }

  try {
    sondagesResult = await queryProgressive(
      SERVICES.geologie,
      GEOLOGIE_LAYERS.sondages,
      input.lat,
      input.lng,
      input.radiusM,
      "sondage"
    )
  } catch (error: any) {
    diagnostics.push(`Sondages non récupérés: ${error.message}`)
  }

  const evidence = [
    ...surfaceEvidence,
    ...soilEvidence,
    ...affleurementsResult.items,
    ...sondagesResult.items,
  ]
    .sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0))
    .slice(0, 80)

  const evidenceText = allEvidenceText(evidence)
  const surfaceSamples = await buildSurfaceSamples(input)

  const baseModel = inferRegionalModel(evidenceText, input.lat, input.lng, input.depthM)
  const refinedModel = refineWithLocalTerms(baseModel, evidenceText)
  const variableModel = makeVariableLayerModel(refinedModel, evidenceText, input.depthM)
  const spwModel = applyOfficialSpwStratigraphy(
    variableModel,
    surfaceSamples,
    surfaceEvidence
  )

  const wddKnowledge = findWddGeologyModel(input.lat, input.lng)
  const wddSurfaceClass = wddKnowledge ? getWddSurfaceClass(surfaceEvidence) : null
  const wddSurfaceText = wddKnowledge ? getWddSurfaceText(surfaceEvidence) : null
  const wddLayers = wddKnowledge
    ? buildLayersFromWddModel(wddKnowledge.model, input.depthM, surfaceEvidence)
    : null

  const model = wddKnowledge && wddLayers && wddLayers.length > 0
    ? {
        ...spwModel,
        key: `${spwModel.key}+wdd_sheet_${wddKnowledge.model.sheetCode}`,
        label: `${spwModel.label} · ${wddKnowledge.model.sheetCode} ${wddKnowledge.model.name}`,
        message:
          `${spwModel.message} Modèle enrichi par la carte géologique ${wddKnowledge.model.sheetCode} ${wddKnowledge.model.name}.`,
        layers: wddLayers,
        confidence: spwModel.confidence === "low" ? "medium" : spwModel.confidence,
      }
    : spwModel

  const hydrogeology = buildHydrogeologyInterpretation(model.layers, model.key)

  const finalConfidence =
    sondagesResult.items.length >= 2
      ? "high"
      : model.confidence === "high"
      ? "high"
      : evidence.length >= 4
      ? "medium"
      : "low"

  const avg = weightedThermalConductivity(model.layers, input.depthM)

  return NextResponse.json({
    version: "v1.7-spw-wdd-geology-knowledge",
    status: "ok",
    input,
    sources: SERVICES,
    geologyKnowledge: wddKnowledge
      ? {
          ...buildWddKnowledgePayload(wddKnowledge.model),
          surfaceClass: wddSurfaceClass,
          surfaceEvidenceText: wddSurfaceText?.slice(0, 1000) || null,
        }
      : null,
    regionalContext: {
      key: model.key,
      label: model.label,
      message: model.message,
    },
    transect: {
      lengthM: input.lengthM,
      orientationDeg: input.orientationDeg,
      samples: surfaceSamples,
    },
    evidence: {
      count: evidence.length,
      searchRadii: {
        affleurementsM: affleurementsResult.radiusM,
        sondagesM: sondagesResult.radiusM,
      },
      surface: surfaceEvidence.slice(0, 10),
      soils: soilEvidence.slice(0, 10),
      affleurements: affleurementsResult.items.slice(0, 10),
      sondages: sondagesResult.items.slice(0, 10),
    },
    interpretedSection: {
      depthM: input.depthM,
      confidence: finalConfidence,
      confidenceDetails: buildConfidenceDetails(
        finalConfidence,
        evidence,
        sondagesResult.radiusM,
        affleurementsResult.radiusM
      ),
      layers: model.layers.map((l) => ({ ...l, confidence: finalConfidence })),
    },
    geothermalInterpretation: {
      preliminaryPotential:
        avg === null
          ? "unknown"
          : avg >= 2.3
          ? "favorable"
          : avg >= 1.8
          ? "moderate"
          : "unknown",
      message:
        `${model.message} Interprétation automatique V1.6 SPW : potentiel géothermique ` +
        `${avg === null ? "à confirmer" : avg >= 2.3 ? "favorable" : "modéré"} ` +
        `sur base des données publiques disponibles. Cette analyse doit être consolidée par les données de forage WDD ou une reconnaissance locale.`,
    },
    hydrogeology,
    warnings: [
      ...buildWarnings(evidence, finalConfidence, sondagesResult.radiusM, affleurementsResult.radiusM),
      ...(wddKnowledge ? buildWddKnowledgeWarnings(wddKnowledge.model) : []),
    ],
    diagnostics,
  })
}

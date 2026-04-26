import type { HydrogeologyInterpretation, InterpretedLayer } from "./types"

export function buildHydrogeologyInterpretation(
  layers: InterpretedLayer[],
  regionalKey: string
): HydrogeologyInterpretation {
  const aquiferLayers = layers.filter((layer) => layer.hydroClass === "aquifer")
  const aquitardLayers = layers.filter((layer) => layer.hydroClass === "aquitard")
  const unknownLayers = layers.filter((layer) => layer.hydroClass === "unknown")

  const hasCarbonate =
    regionalKey === "carbonate" ||
    layers.some((layer) => {
      const name = layer.name.toLowerCase()
      return name.includes("calcaire") || name.includes("dolomie") || name.includes("carbonat")
    })

  const hasFracturedBedrock = layers.some((layer) => {
    const name = layer.name.toLowerCase()
    return (
      name.includes("fractur") ||
      name.includes("fissur") ||
      name.includes("altéré") ||
      name.includes("altere")
    )
  })

  let likelyWaterTableDepthM: number | null = null
  let waterMode: HydrogeologyInterpretation["waterMode"] = "unknown"
  let confidence: HydrogeologyInterpretation["confidence"] = "low"

  if (aquiferLayers.length > 0) {
    const firstAquifer = aquiferLayers[0]
    likelyWaterTableDepthM = Math.max(3, Math.min(firstAquifer.topM + 5, 35))
    waterMode = hasCarbonate ? "continuous" : "perched"
    confidence = "medium"
  } else if (hasFracturedBedrock) {
    likelyWaterTableDepthM = 15
    waterMode = "fractured"
    confidence = "low"
  }

  if (regionalKey === "ardenne") {
    waterMode = "fractured"
    likelyWaterTableDepthM = 12
    confidence = "low"
  }

  if (regionalKey === "famenne") {
    waterMode = hasCarbonate ? "fractured" : "unknown"
    likelyWaterTableDepthM = 10
    confidence = "low"
  }

  return {
    confidence,
    likelyWaterTableDepthM,
    waterMode,
    summary:
      waterMode === "continuous"
        ? "Aquifère probable : présence d'eau possible sous forme de nappe ou de circulation continue dans les niveaux perméables."
        : waterMode === "fractured"
        ? "Eau possible principalement dans les fractures, fissures ou niveaux altérés du substratum. La profondeur réelle doit être confirmée localement."
        : waterMode === "perched"
        ? "Niveau d'eau perché ou discontinu possible dans les niveaux meubles ou perméables."
        : "Présence d'eau souterraine à confirmer : les données publiques disponibles ne permettent pas de positionner une nappe avec fiabilité.",
    overlays: layers.map((layer) => {
      const name = layer.name.toLowerCase()
      const isAquifer = layer.hydroClass === "aquifer"
      const isFracturedCandidate =
        layer.type === "bedrock" &&
        layer.hydroClass !== "aquiclude" &&
        (
          name.includes("fractur") ||
          name.includes("fissur") ||
          name.includes("altéré") ||
          name.includes("altere") ||
          regionalKey === "ardenne" ||
          regionalKey === "famenne"
        )

      return {
        topM: layer.topM,
        bottomM: layer.bottomM,
        mode: isAquifer ? "aquifer" : isFracturedCandidate ? "fractured-water-possible" : "none",
        label: isAquifer
          ? "Eau souterraine probable"
          : isFracturedCandidate
          ? "Eau possible en fractures"
          : null,
      }
    }),
    counts: {
      aquifer: aquiferLayers.length,
      aquitard: aquitardLayers.length,
      unknown: unknownLayers.length,
    },
  }
}

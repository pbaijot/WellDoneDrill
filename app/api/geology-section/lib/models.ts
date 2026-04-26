import type { InterpretedLayer, RegionalModel } from "./types"


function inferLithology(name: string): InterpretedLayer["lithology"] {
  const n = name.toLowerCase()

  if (n.includes("sol")) return "soil"
  if (n.includes("limon") || n.includes("loess") || n.includes("lœss")) return "loam"
  if (n.includes("argile") || n.includes("marne")) return "clay"
  if (n.includes("sable") || n.includes("gravier") || n.includes("alluvion")) return "sand"
  if (n.includes("calcaire") || n.includes("dolomie") || n.includes("carbonat") || n.includes("calcschiste")) return "limestone"
  if (n.includes("schiste") || n.includes("phyllade") || n.includes("ardoise")) return "schist"
  if (n.includes("grès") || n.includes("gres") || n.includes("psammite") || n.includes("quartzite")) return "sandstone"
  if (n.includes("alternance") || n.includes("/")) return "mixed"

  return "unknown"
}

function inferLayerType(
  name: string,
  type: InterpretedLayer["type"],
  topM: number
): InterpretedLayer["layerType"] {
  const n = name.toLowerCase()

  if (topM === 0 && n.includes("sol")) return "surface"
  if (type === "cover") return topM <= 3 ? "cover" : "weathered-zone"
  if (n.includes("altéré") || n.includes("altere") || n.includes("fissur") || n.includes("fractur")) return "weathered-zone"
  if (topM >= 100) return "deep-bedrock"
  if (type === "bedrock" || type === "aquifer" || type === "aquitard") return "bedrock"

  return "unknown"
}

function layerColorForLithology(lithology: InterpretedLayer["lithology"]) {
  switch (lithology) {
    case "soil":
      return "#947648"
    case "loam":
      return "#C9AD84"
    case "clay":
      return "#A97D5D"
    case "sand":
      return "#D9C99D"
    case "limestone":
      return "#B9B1A0"
    case "schist":
      return "#726D66"
    case "sandstone":
      return "#9C8F78"
    case "mixed":
      return "#8A7A6B"
    default:
      return "#9A9088"
  }
}

function shortLabelForLithology(lithology: InterpretedLayer["lithology"]) {
  switch (lithology) {
    case "soil":
      return "Sol"
    case "loam":
      return "Limons"
    case "clay":
      return "Argiles"
    case "sand":
      return "Sables"
    case "limestone":
      return "Calcaires"
    case "schist":
      return "Schistes"
    case "sandstone":
      return "Grès"
    case "mixed":
      return "Alternances"
    default:
      return "À confirmer"
  }
}

function buildLayerDisplay(
  name: string,
  lithology: InterpretedLayer["lithology"],
  hydroClass: InterpretedLayer["hydroClass"]
): InterpretedLayer["display"] {
  const textColor =
    lithology === "sand" || lithology === "limestone" || lithology === "loam"
      ? "dark"
      : "light"

  return {
    color: layerColorForLithology(lithology),
    textColor,
    shortLabel: shortLabelForLithology(lithology),
    longLabel: name,
    hatch:
      hydroClass === "aquifer"
        ? "aquifer"
        : hydroClass === "aquitard"
        ? "fractured"
        : "none",
  }
}


function layer(
  name: string,
  topM: number,
  bottomM: number,
  type: InterpretedLayer["type"],
  hydroClass: InterpretedLayer["hydroClass"],
  lambda: number | null,
  confidence: InterpretedLayer["confidence"],
  rationale: string
): InterpretedLayer {
  const lithology = inferLithology(name)
  const layerType = inferLayerType(name, type, topM)

  return {
    name,
    topM,
    bottomM,
    type,
    hydroClass,
    lithology,
    layerType,
    display: buildLayerDisplay(name, lithology, hydroClass),
    thermalConductivityWmK: lambda,
    confidence,
    rationale,
  }
}

function makeLayers(specs: Array<Parameters<typeof layer>>) {
  return specs
    .map((args) => layer(...args))
    .filter((l) => l.bottomM > l.topM)
}

function countMatches(text: string, words: string[]) {
  return words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
}

export function inferRegionalModel(text: string, lat: number, lng: number, depthM: number): RegionalModel {
  const t = text.toLowerCase()
  const cap = (value: number) => Math.min(value, depthM)
  const has = (...words: string[]) => words.some((w) => t.includes(w))

  if (
    has("ardenne", "ardennes", "bastogne", "gedinne", "stavelot", "recogne") ||
    (lat > 49.85 && lat < 50.35 && lng > 4.8 && lng < 6.3)
  ) {
    return {
      key: "ardenne",
      label: "Domaine ardennais probable",
      confidence: has("ardenne", "ardennes") ? "medium" : "low",
      message:
        "Contexte ardennais probable : socle paléozoïque consolidé, souvent composé de schistes, phyllades, grès ou quartzites. Les circulations d'eau sont principalement liées à l'altération et à la fracturation.",
      layers: makeLayers([
        ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et matériaux superficiels."],
        ["Limons, colluvions et altérites", cap(2), cap(8), "cover", "aquitard", 1.6, "medium", "Couverture meuble et zone d'altération superficielle."],
        ["Socle altéré et fissuré", cap(8), cap(30), "bedrock", "aquitard", 2.1, "medium", "Zone de transition altérée, potentiellement plus fracturée et localement humide."],
        ["Schistes / phyllades fracturés", cap(30), cap(120), "bedrock", "aquitard", 2.4, "medium", "Roche consolidée à perméabilité contrôlée par les fractures."],
        ["Grès, quartzites ou schistes plus compacts", cap(120), depthM, "bedrock", "aquitard", 2.7, "low", "Substratum profond plus compact ; conductivité thermique généralement correcte."],
      ]),
    }
  }

  if (has("famenne", "famenn", "beauraing", "fagne", "schisto-calcaire", "calcschiste", "calcschistes")) {
    return {
      key: "famenne",
      label: "Famenne probable",
      confidence: "medium",
      message:
        "Contexte de Famenne probable : alternances schisteuses, calcschisteuses et niveaux carbonatés localisés. La variabilité latérale peut être importante.",
      layers: makeLayers([
        ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et couverture superficielle."],
        ["Limons / argiles / altérites", cap(2), cap(12), "cover", "aquitard", 1.5, "medium", "Couverture et altération du substratum."],
        ["Schistes ou calcschistes altérés", cap(12), cap(40), "bedrock", "aquitard", 2.1, "medium", "Zone altérée du substratum, possiblement fracturée."],
        ["Alternances schisto-calcaires", cap(40), cap(120), "bedrock", "aquitard", 2.3, "medium", "Alternance probable de niveaux schisteux, calcschisteux et localement carbonatés."],
        ["Substratum schisteux / carbonaté plus massif", cap(120), depthM, "bedrock", "unknown", 2.5, "low", "Substratum profond à confirmer localement par forage ou données WDD."],
      ]),
    }
  }

  if (has("calestienne", "calcaire", "calcaires", "dolomie", "dolomit", "karst")) {
    return {
      key: "carbonate",
      label: "Domaine carbonaté probable",
      confidence: "medium",
      message:
        "Contexte carbonaté probable : calcaires ou dolomies, souvent favorables thermiquement, mais sensibles aux fractures, venues d'eau et phénomènes karstiques.",
      layers: makeLayers([
        ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Couverture de surface."],
        ["Altérites / couverture caillouteuse", cap(2), cap(10), "cover", "aquitard", 1.7, "medium", "Couverture et altération du calcaire."],
        ["Calcaire altéré ou fracturé", cap(10), cap(40), "aquifer", "aquifer", 2.3, "medium", "Zone de fracturation et d'altération potentiellement aquifère."],
        ["Calcaire / dolomie massif", cap(40), cap(140), "aquifer", "aquifer", 2.8, "medium", "Roche carbonatée généralement favorable thermiquement."],
        ["Carbonaté profond à confirmer", cap(140), depthM, "aquifer", "aquifer", 2.7, "low", "Risque de karst ou de fracture à confirmer par données locales."],
      ]),
    }
  }

  if (has("condroz", "psammite", "psammites", "grès", "gres", "schiste", "schistes")) {
    return {
      key: "condroz",
      label: "Condroz ou domaine gréso-schisteux probable",
      confidence: "medium",
      message:
        "Contexte gréso-schisteux probable : alternances de grès, psammites et schistes. Potentiel thermique généralement favorable à modéré.",
      layers: makeLayers([
        ["Sol et limons superficiels", 0, cap(3), "cover", "aquitard", 1.4, "medium", "Couverture superficielle."],
        ["Altérites et horizon fissuré", cap(3), cap(15), "cover", "aquitard", 1.8, "medium", "Zone altérée du substratum."],
        ["Schistes / psammites altérés", cap(15), cap(45), "bedrock", "aquitard", 2.2, "medium", "Substratum altéré et fracturé."],
        ["Alternances grès - schistes", cap(45), cap(130), "bedrock", "aquitard", 2.5, "medium", "Conductivité thermique correcte, perméabilité dépendante des fractures."],
        ["Grès ou schistes plus compacts", cap(130), depthM, "bedrock", "unknown", 2.6, "low", "Substratum profond plus compact."],
      ]),
    }
  }

  if (has("hesbaye", "limon", "limons", "loess", "lœss", "craie", "craies")) {
    return {
      key: "hesbaye",
      label: "Hesbaye / plateau limoneux probable",
      confidence: "medium",
      message:
        "Contexte de plateau limoneux probable : couverture limoneuse parfois importante, reposant sur un substratum sédimentaire ou crayeux selon la localisation.",
      layers: makeLayers([
        ["Sol et limons supérieurs", 0, cap(3), "cover", "aquitard", 1.3, "medium", "Horizon pédologique et limons superficiels."],
        ["Limons / lœss", cap(3), cap(15), "cover", "aquitard", 1.4, "medium", "Couverture limoneuse potentiellement épaisse."],
        ["Altérites ou formations meubles", cap(15), cap(30), "cover", "unknown", 1.6, "low", "Transition vers le substratum."],
        ["Substratum crayeux ou sédimentaire", cap(30), cap(120), "bedrock", "aquifer", 2.1, "low", "Nature exacte à confirmer par carte détaillée."],
        ["Substratum profond", cap(120), depthM, "bedrock", "unknown", 2.2, "low", "Interprétation régionale prudente."],
      ]),
    }
  }

  if (has("lorraine", "sable", "sables", "grès", "gres", "argile", "argiles", "marne", "marnes")) {
    return {
      key: "lorraine",
      label: "Lorraine belge / séries mésozoïques probables",
      confidence: "medium",
      message:
        "Contexte de Lorraine belge probable : alternances de sables, grès, marnes et argiles. Les conditions peuvent varier fortement verticalement.",
      layers: makeLayers([
        ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon superficiel."],
        ["Sables / limons / argiles superficielles", cap(2), cap(15), "cover", "unknown", 1.6, "medium", "Couverture meuble variable."],
        ["Niveaux sableux ou gréseux", cap(15), cap(50), "aquifer", "aquifer", 2.0, "medium", "Niveaux potentiellement aquifères."],
        ["Marnes ou argiles", cap(50), cap(100), "aquitard", "aquitard", 1.7, "medium", "Niveaux moins perméables."],
        ["Alternances profondes grès / argiles", cap(100), depthM, "bedrock", "unknown", 2.1, "low", "Stratigraphie à confirmer localement."],
      ]),
    }
  }

  return {
    key: "unknown",
    label: "Contexte régional à confirmer",
    confidence: "low",
    message:
      "Les données publiques récupérées ne suffisent pas encore à identifier clairement le contexte géologique régional.",
    layers: makeLayers([
      ["Sol et couverture superficielle", 0, cap(2), "cover", "unknown", 1.3, "low", "Hypothèse générique."],
      ["Couverture altérée probable", cap(2), cap(10), "cover", "unknown", 1.6, "low", "Hypothèse générique."],
      ["Substratum supérieur à caractériser", cap(10), cap(50), "unknown", "unknown", null, "low", "Nature inconnue."],
      ["Substratum intermédiaire à caractériser", cap(50), cap(120), "unknown", "unknown", null, "low", "Nature inconnue."],
      ["Substratum profond à caractériser", cap(120), depthM, "unknown", "unknown", null, "low", "Nature inconnue."],
    ]),
  }
}

export function refineWithLocalTerms(model: RegionalModel, evidenceText: string): RegionalModel {
  const t = evidenceText.toLowerCase()

  const scores = {
    carbonate: countMatches(t, ["calcaire", "calcaires", "dolomie", "dolomit", "craie", "carbonaté", "carbonates", "calcschiste", "calcschistes"]),
    sandstone: countMatches(t, ["grès", "gres", "quartzite", "quartzites", "psammite", "psammites"]),
    shale: countMatches(t, ["schiste", "schistes", "phyllade", "phyllades", "ardoise", "ardoises", "siltite"]),
    sand: countMatches(t, ["sable", "sables", "gravier", "graviers", "alluvion", "alluvions"]),
    clay: countMatches(t, ["argile", "argiles", "limon", "limons", "loess", "lœss", "marne", "marnes"]),
  }

  const hasLocalSignal = Object.values(scores).some((v) => v > 0)
  if (!hasLocalSignal) return model

  const mixedSchistoCarbonate = scores.carbonate > 0 && scores.shale > 0
  const mixedSandstoneShale = scores.sandstone > 0 && scores.shale > 0
  const dominantlyCarbonate = scores.carbonate >= 2 && scores.carbonate > scores.shale && scores.carbonate > scores.sandstone
  const dominantlySandstone = scores.sandstone >= 2 && scores.sandstone > scores.shale && scores.sandstone >= scores.carbonate
  const dominantlyShale = scores.shale >= 2 && scores.shale >= scores.sandstone && scores.shale >= scores.carbonate

  const enhanced = model.layers.map((l) => {
    const thickness = l.bottomM - l.topM
    const shallowCover = l.type === "cover" && l.bottomM <= 20
    const upperBedrock = l.topM >= 8 && l.bottomM <= 50
    const midBedrock = l.topM >= 30 && l.bottomM <= 140
    const deepBedrock = l.topM >= 100

    if (shallowCover && scores.sand > 0) {
      return {
        ...l,
        name: thickness > 4 ? "Sables, limons ou alluvions possibles" : l.name,
        hydroClass: "aquifer" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 1.6, 1.8),
        rationale: l.rationale + " Indices locaux de sables, graviers ou alluvions.",
      }
    }

    if (shallowCover && scores.clay > 0) {
      return {
        ...l,
        name: thickness > 4 ? "Limons / argiles / altérites" : l.name,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: l.thermalConductivityWmK || 1.5,
        rationale: l.rationale + " Indices locaux de limons, argiles ou marnes.",
      }
    }

    if (upperBedrock && mixedSchistoCarbonate) {
      return {
        ...l,
        name: "Schistes ou calcschistes altérés",
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.0, 2.1),
        rationale: l.rationale + " Indices locaux combinant schistes et niveaux carbonatés.",
      }
    }

    if (upperBedrock && mixedSandstoneShale) {
      return {
        ...l,
        name: "Schistes / grès altérés et fissurés",
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.1, 2.2),
        rationale: l.rationale + " Indices locaux combinant grès et schistes.",
      }
    }

    if (upperBedrock && dominantlyShale) {
      return {
        ...l,
        name: "Schistes ou phyllades altérés / fissurés",
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: l.thermalConductivityWmK || 2.1,
        rationale: l.rationale + " Indices locaux de schistes ou phyllades.",
      }
    }

    if (midBedrock && mixedSchistoCarbonate) {
      return {
        ...l,
        name: "Alternances schisto-calcaires",
        type: "bedrock" as const,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.2, 2.3),
        rationale: l.rationale + " Indices locaux de niveaux schisteux et carbonatés.",
      }
    }

    if (midBedrock && mixedSandstoneShale) {
      return {
        ...l,
        name: "Alternances gréseuses et schisteuses",
        type: "bedrock" as const,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.3, 2.5),
        rationale: l.rationale + " Indices locaux de grès/psammites et schistes.",
      }
    }

    if (midBedrock && dominantlyCarbonate && model.key === "carbonate") {
      return {
        ...l,
        name: "Calcaires ou dolomies fracturés",
        type: "aquifer" as const,
        hydroClass: "aquifer" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.4, 2.7),
        rationale: l.rationale + " Indices locaux carbonatés dominants.",
      }
    }

    if (midBedrock && dominantlyCarbonate && model.key !== "carbonate") {
      return {
        ...l,
        name: "Niveaux carbonatés intercalés possibles",
        type: "bedrock" as const,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.2, 2.4),
        rationale: l.rationale + " Indices locaux carbonatés, interprétés comme niveaux intercalés plutôt que massif continu.",
      }
    }

    if (midBedrock && dominantlySandstone) {
      return {
        ...l,
        name: "Niveaux gréseux ou psammitiques probables",
        type: "bedrock" as const,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.3, 2.6),
        rationale: l.rationale + " Indices locaux de grès, quartzites ou psammites.",
      }
    }

    if (midBedrock && dominantlyShale) {
      return {
        ...l,
        name: "Schistes ou phyllades probables",
        type: "bedrock" as const,
        hydroClass: "aquitard" as const,
        thermalConductivityWmK: l.thermalConductivityWmK || 2.3,
        rationale: l.rationale + " Indices locaux de schistes ou phyllades.",
      }
    }

    if (deepBedrock && mixedSchistoCarbonate) {
      return {
        ...l,
        name: "Substratum schisteux / carbonaté plus massif",
        type: "bedrock" as const,
        hydroClass: "unknown" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.4, 2.5),
        rationale: l.rationale + " Interprétation profonde prudente sur base d'indices schisteux et carbonatés.",
      }
    }

    if (deepBedrock && mixedSandstoneShale) {
      return {
        ...l,
        name: "Substratum gréseux / schisteux plus compact",
        type: "bedrock" as const,
        hydroClass: "unknown" as const,
        thermalConductivityWmK: Math.max(l.thermalConductivityWmK || 2.5, 2.6),
        rationale: l.rationale + " Interprétation profonde prudente sur base d'indices gréseux et schisteux.",
      }
    }

    return l
  })

  return {
    ...model,
    confidence: model.confidence === "low" ? "medium" : model.confidence,
    layers: enhanced,
  }
}

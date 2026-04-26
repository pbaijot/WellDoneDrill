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


function inferLithologyCategory(name: string): InterpretedLayer["lithologyCategory"] {
  const n = name.toLowerCase()

  // 1. Catégories meubles fines
  if (
    n.includes("argile") ||
    n.includes("argiles") ||
    n.includes("marne") ||
    n.includes("marnes")
  ) {
    if (
      n.includes("limon") ||
      n.includes("limons") ||
      n.includes("silt") ||
      n.includes("silts") ||
      n.includes("altérite") ||
      n.includes("altérites") ||
      n.includes("altere") ||
      n.includes("alterites")
    ) {
      return "argile_silt"
    }

    return "argile"
  }

  // 2. Mélanges silt / sable / argile
  if (
    (n.includes("limon") || n.includes("limons") || n.includes("silt") || n.includes("silts")) &&
    (n.includes("sable") || n.includes("sables") || n.includes("argile") || n.includes("argiles"))
  ) {
    return "silt_sable_argile"
  }

  if (
    n.includes("limon") ||
    n.includes("limons") ||
    n.includes("loess") ||
    n.includes("lœss") ||
    n.includes("colluvion") ||
    n.includes("colluvions") ||
    n.includes("altérite") ||
    n.includes("altérites")
  ) {
    return "argile_silt"
  }

  // 3. Sables et graviers
  if (
    n.includes("gravier") ||
    n.includes("graviers") ||
    n.includes("alluvion") ||
    n.includes("alluvions")
  ) {
    return "sable_gravier"
  }

  if (
    n.includes("sable") ||
    n.includes("sables")
  ) {
    return "sable"
  }

  // 4. Craie / carbonate tendre
  if (
    n.includes("craie") ||
    n.includes("craies") ||
    n.includes("crayeux") ||
    n.includes("crayeuse")
  ) {
    return "craie"
  }

  // 5. Socle rocheux : schiste, grès, phyllade, quartzite, calcaire massif
  if (
    n.includes("schiste") ||
    n.includes("schistes") ||
    n.includes("phyllade") ||
    n.includes("phyllades") ||
    n.includes("grès") ||
    n.includes("gres") ||
    n.includes("psammite") ||
    n.includes("psammites") ||
    n.includes("quartzite") ||
    n.includes("quartzites") ||
    n.includes("socle") ||
    n.includes("substratum") ||
    n.includes("calcaire") ||
    n.includes("calcaires") ||
    n.includes("dolomie") ||
    n.includes("dolomies") ||
    n.includes("carbonaté") ||
    n.includes("carbonat")
  ) {
    return "schiste_gres_socle"
  }

  if (n.includes("sol") || n.includes("couverture")) {
    return "argile_silt"
  }

  return "unknown"
}

function lithologyCategoryLabel(category: InterpretedLayer["lithologyCategory"]) {
  switch (category) {
    case "argile":
      return "Argile"
    case "argile_silt":
      return "Argile / silt"
    case "silt_sable_argile":
      return "Silt / sable et argile"
    case "sable":
      return "Sable"
    case "sable_gravier":
      return "Sable et gravier"
    case "craie":
      return "Craie"
    case "schiste_gres_socle":
      return "Schiste et grès, roche de socle"
    default:
      return "Lithologie à confirmer"
  }
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
  // Palette inspirée de la charte WDD :
  // Natural Black #1A1A1A
  // Energy Yellow #FFD94F
  // Soft Clay #E8E5DE
  // Dirt Ground #B0A18F
  // Shiny Mud #AB572E
  // Wet Grass #42754F
  //
  // Les couleurs ci-dessous sont volontairement plus contrastées
  // pour rendre les couches lisibles dans la coupe géologique.
  switch (lithology) {
    case "soil":
      return "#7A5630" // brun végétal / terre sombre
    case "loam":
      return "#D9B86F" // limon doré, dérivé Energy Yellow / Dirt Ground
    case "clay":
      return "#AB572E" // argile / Shiny Mud WDD
    case "sand":
      return "#FFD94F" // sable / Energy Yellow WDD
    case "limestone":
      return "#E8E5DE" // calcaire / Soft Clay WDD
    case "schist":
      return "#5B5852" // schiste gris foncé, dérivé Natural Black
    case "sandstone":
      return "#C8843A" // grès orange brun
    case "mixed":
      return "#7A5FA3" // alternances / mauve distinctif
    default:
      return "#B0A18F" // Dirt Ground WDD
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



function inferStratigraphicName(
  name: string,
  lithologyCategory: InterpretedLayer["lithologyCategory"]
): string {
  const n = name.toLowerCase()

  // Noms déjà explicites : on les conserve.
  if (n.includes("formation") || n.includes("membre") || n.includes("assise")) {
    return name
  }

  // Couvertures superficielles
  if (n.includes("sol") || n.includes("couverture superficielle")) {
    return "Formations quaternaires indifférenciées"
  }

  if (
    n.includes("limon") ||
    n.includes("limons") ||
    n.includes("loess") ||
    n.includes("lœss") ||
    n.includes("colluvion") ||
    n.includes("colluvions")
  ) {
    return "Formations quaternaires limoneuses"
  }

  if (
    n.includes("altérite") ||
    n.includes("altérites") ||
    n.includes("altere") ||
    n.includes("alterites")
  ) {
    return "Altérites du substratum"
  }

  // Sables / graviers
  if (n.includes("sable") || n.includes("sables")) {
    if (n.includes("gravier") || n.includes("graviers") || n.includes("alluvion")) {
      return "Alluvions sableuses et graveleuses"
    }
    return "Niveaux sableux indifférenciés"
  }

  // Argiles / marnes
  if (n.includes("argile") || n.includes("argiles")) {
    return "Niveaux argileux indifférenciés"
  }

  if (n.includes("marne") || n.includes("marnes")) {
    return "Niveaux marneux indifférenciés"
  }

  // Craie
  if (n.includes("craie") || n.includes("craies") || n.includes("crayeux")) {
    return "Craies indifférenciées"
  }

  // Carbonaté
  if (
    n.includes("calcaire") ||
    n.includes("calcaires") ||
    n.includes("dolomie") ||
    n.includes("dolomies") ||
    n.includes("carbonat")
  ) {
    if (n.includes("fractur") || n.includes("altéré") || n.includes("altere")) {
      return "Carbonaté altéré ou fracturé"
    }

    return "Substratum carbonaté indifférencié"
  }

  // Schistes / grès / socle
  if (
    n.includes("schiste") ||
    n.includes("schistes") ||
    n.includes("phyllade") ||
    n.includes("phyllades")
  ) {
    return "Socle paléozoïque schisteux"
  }

  if (
    n.includes("grès") ||
    n.includes("gres") ||
    n.includes("psammite") ||
    n.includes("psammites") ||
    n.includes("quartzite") ||
    n.includes("quartzites")
  ) {
    return "Socle paléozoïque gréso-schisteux"
  }

  if (n.includes("socle") || n.includes("substratum")) {
    return "Socle paléozoïque indifférencié"
  }

  switch (lithologyCategory) {
    case "argile":
      return "Niveaux argileux indifférenciés"
    case "argile_silt":
      return "Formations limono-argileuses indifférenciées"
    case "silt_sable_argile":
      return "Formations silto-sablo-argileuses indifférenciées"
    case "sable":
      return "Niveaux sableux indifférenciés"
    case "sable_gravier":
      return "Alluvions sableuses et graveleuses"
    case "craie":
      return "Craies indifférenciées"
    case "schiste_gres_socle":
      return "Socle paléozoïque indifférencié"
    default:
      return "Unité stratigraphique à confirmer"
  }
}

function regionalScientificPrefix(name: string, stratigraphicName: string): string {
  const n = name.toLowerCase()

  // Ces codes sont volontairement indicatifs.
  // Ils donnent une structure de type "code + nom scientifique",
  // sans prétendre remplacer le vrai code cartographique SPW.
  if (stratigraphicName.includes("Formations quaternaires")) return "Q_IND"
  if (stratigraphicName.includes("Alluvions")) return "Q_ALL"
  if (stratigraphicName.includes("limoneuses")) return "Q_LIM"
  if (stratigraphicName.includes("argileux")) return "ARG_IND"
  if (stratigraphicName.includes("sableux")) return "SAB_IND"
  if (stratigraphicName.includes("Craies")) return "CRAIE_IND"
  if (stratigraphicName.includes("Carbonaté")) return "CARB_IND"
  if (stratigraphicName.includes("schisteux")) return "SOC_SCH"
  if (stratigraphicName.includes("gréso-schisteux")) return "SOC_GRS"
  if (stratigraphicName.includes("paléozoïque")) return "SOC_PAL"

  if (n.includes("calcaire") || n.includes("dolomie")) return "CARB_IND"
  if (n.includes("schiste") || n.includes("phyllade")) return "SOC_SCH"
  if (n.includes("grès") || n.includes("gres")) return "SOC_GRS"

  return "UNIT_IND"
}

function buildScientificLayerName(
  name: string,
  lithologyCategory: InterpretedLayer["lithologyCategory"]
) {
  const stratigraphicName = inferStratigraphicName(name, lithologyCategory)
  const code = regionalScientificPrefix(name, stratigraphicName)

  return `${code} ${stratigraphicName}`
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
  const lithologyCategory = inferLithologyCategory(name)
  const stratigraphicName = buildScientificLayerName(name, lithologyCategory)
  const layerType = inferLayerType(name, type, topM)

  return {
    name,
    stratigraphicName,
    topM,
    bottomM,
    type,
    hydroClass,
    lithology,
    lithologyCategory,
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


function cleanOfficialSpwValue(value: any): string | null {
  if (value === null || value === undefined) return null

  const cleaned = String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned) return null
  if (cleaned.toLowerCase() === "null") return null
  if (cleaned === "-") return null

  return cleaned
}


function isTechnicalSpwField(key: string) {
  const k = key.toUpperCase()

  return (
    k === "OBJECTID" ||
    k === "FID" ||
    k === "ID" ||
    k === "ID_PROD" ||
    k === "PRODUCTID" ||
    k === "PRODUCT_ID" ||
    k === "ID_CARTE" ||
    k === "CARTE_ID" ||
    k === "SHAPE" ||
    k === "SHAPE_AREA" ||
    k === "SHAPE_LENGTH" ||
    k === "GLOBALID" ||
    k === "SOURCE" ||
    k === "URL" ||
    k === "DATE" ||
    k.includes("DGA") ||
    k.includes("MRW")
  )
}

function looksLikeTechnicalSpwValue(value: string) {
  const v = value.toUpperCase()

  return (
    v.includes("PCNSW") ||
    v.includes("DGA-MRW") ||
    v.includes("DGA_MRW") ||
    v.includes("SERVICE PUBLIC DE WALLONIE") ||
    /^\\d+$/.test(v)
  )
}

function pickOfficialSpwAttribute(attributes: Record<string, any> | null | undefined) {
  if (!attributes) return null

  const preferredFields = [
    // Noms stratigraphiques fréquents ou probables
    "UNITE_STRATIGRAPHIQUE",
    "UNITE_STRAT",
    "UNITE",
    "UNITE_GEO",
    "NOM_UNITE",
    "NOM",
    "NAME",
    "FORMATION",
    "FORM",
    "FORM_GEO",
    "MEMBRE",
    "MEMBER",
    "ASSISE",
    "LITHOSTRAT",
    "LITHO_STRAT",
    "DESCRIPTION",
    "DESCRIPTIO",
    "LIBELLE",
    "LIBELLE_FR",
    "LABEL",
    "CODE",
    "SIGLE",
  ]

  const keys = Object.keys(attributes)

  for (const preferred of preferredFields) {
    const key = keys.find((k) => k.toUpperCase() === preferred)
    if (!key || isTechnicalSpwField(key)) continue

    const value = cleanOfficialSpwValue(attributes[key])
    if (value && !looksLikeTechnicalSpwValue(value)) {
      return {
        field: key,
        value,
      }
    }
  }

  // Fallback : première valeur textuelle utile
  for (const key of keys) {
    if (isTechnicalSpwField(key)) continue

    const value = cleanOfficialSpwValue(attributes[key])

    if (
      value &&
      value.length >= 4 &&
      !/^\d+$/.test(value) &&
      !looksLikeTechnicalSpwValue(value)
    ) {
      return {
        field: key,
        value,
      }
    }
  }

  return null
}

function buildOfficialSpwNameFromAttributes(attributes: Record<string, any> | null | undefined) {
  const picked = pickOfficialSpwAttribute(attributes)
  if (!picked) return null

  return {
    name: picked.value,
    source: {
      provider: "SPW" as const,
      layer: "CGEOL_SIMPLE",
      field: picked.field,
      rawValue: picked.value,
    },
  }
}

function lithologyCategoryFromOfficialName(name: string): InterpretedLayer["lithologyCategory"] {
  return inferLithologyCategory(name)
}

function lithologyFromOfficialName(name: string): InterpretedLayer["lithology"] {
  return inferLithology(name)
}

function displayFromOfficialName(
  name: string,
  hydroClass: InterpretedLayer["hydroClass"]
): InterpretedLayer["display"] {
  const lithology = lithologyFromOfficialName(name)
  return buildLayerDisplay(name, lithology, hydroClass)
}

export function applyOfficialSpwStratigraphy(
  model: RegionalModel,
  surfaceSamples: Array<{ unit: string | null; attributes: Record<string, any> | null; status: string }>,
  surfaceEvidence: Array<{ summary: string; attributes: Record<string, any> }>
): RegionalModel {
  const officialCandidates = [
    ...surfaceSamples
      .map((sample) => buildOfficialSpwNameFromAttributes(sample.attributes))
      .filter(Boolean),
    ...surfaceEvidence
      .map((evidence) => buildOfficialSpwNameFromAttributes(evidence.attributes))
      .filter(Boolean),
  ] as Array<{
    name: string
    source: {
      provider: "SPW"
      layer: string
      field: string | null
      rawValue: string | null
    }
  }>

  const uniqueOfficialNames = Array.from(
    new Map(officialCandidates.map((candidate) => [candidate.name, candidate])).values()
  )

  if (uniqueOfficialNames.length === 0) {
    return model
  }

  const primary = uniqueOfficialNames[0]

  // V1 : la donnée SPW disponible est essentiellement surfacique.
  // On l'applique d'abord à la couche de surface/couverture,
  // puis on conserve les couches profondes interprétées.
  const layers = model.layers.map((layer, index) => {
    const isSurfaceLayer =
      index === 0 ||
      layer.layerType === "surface" ||
      layer.topM === 0

    if (!isSurfaceLayer) return layer

    const officialLithology = lithologyFromOfficialName(primary.name)
    const officialCategory = lithologyCategoryFromOfficialName(primary.name)

    return {
      ...layer,
      stratigraphicName: primary.name,
      officialSource: primary.source,
      lithology: officialLithology === "unknown" ? layer.lithology : officialLithology,
      lithologyCategory: officialCategory === "unknown" ? layer.lithologyCategory : officialCategory,
      display:
        officialLithology === "unknown"
          ? layer.display
          : displayFromOfficialName(primary.name, layer.hydroClass),
      rationale:
        layer.rationale +
        ` Unité officielle SPW utilisée pour la couverture/surface : ${primary.name}.`,
    }
  })

  return {
    ...model,
    layers,
  }
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


function textScoresForVariableModel(text: string) {
  const t = text.toLowerCase()

  return {
    carbonate: countMatches(t, ["calcaire", "calcaires", "dolomie", "dolomit", "craie", "carbonaté", "carbonates", "calcschiste", "calcschistes", "karst"]),
    sandstone: countMatches(t, ["grès", "gres", "quartzite", "quartzites", "psammite", "psammites", "sable", "sables", "gravier", "graviers"]),
    shale: countMatches(t, ["schiste", "schistes", "phyllade", "phyllades", "ardoise", "ardoises", "siltite"]),
    clay: countMatches(t, ["argile", "argiles", "limon", "limons", "loess", "lœss", "marne", "marnes"]),
    karst: countMatches(t, ["karst", "karstique", "doline", "perte", "chantoir"]),
    alluvial: countMatches(t, ["alluvion", "alluvions", "gravier", "graviers", "sable", "sables"]),
  }
}

function capDepthForVariableModel(value: number, depthM: number) {
  return Math.min(value, depthM)
}

function variableLayersForArdenne(model: RegionalModel, text: string, depthM: number) {
  const scores = textScoresForVariableModel(text)
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  const hasSandstone = scores.sandstone >= 2
  const hasShale = scores.shale >= 2
  const hasMixed = hasSandstone && hasShale

  if (hasMixed) {
    return makeLayers([
      ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et matériaux superficiels."],
      ["Altérites limoneuses et colluvions", cap(2), cap(10), "cover", "aquitard", 1.6, "medium", "Couverture meuble et zone d'altération."],
      ["Socle altéré et fissuré", cap(10), cap(28), "bedrock", "aquitard", 2.1, "medium", "Zone altérée, plus fracturée et localement humide."],
      ["Alternances schistes / grès fracturés", cap(28), cap(80), "bedrock", "aquitard", 2.35, "medium", "Alternances probables de niveaux schisteux et gréseux."],
      ["Niveaux gréseux ou quartzitiques plus conducteurs", cap(80), cap(145), "bedrock", "unknown", 2.75, "low", "Niveaux plus compacts et thermiquement favorables, à confirmer localement."],
      ["Substratum schisto-gréseux profond", cap(145), depthM, "bedrock", "unknown", 2.55, "low", "Substratum profond interprété prudemment."],
    ])
  }

  if (hasShale && !hasSandstone) {
    return makeLayers([
      ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et matériaux superficiels."],
      ["Limons, colluvions et altérites", cap(2), cap(12), "cover", "aquitard", 1.6, "medium", "Couverture meuble et altération superficielle."],
      ["Schistes ou phyllades altérés", cap(12), cap(45), "bedrock", "aquitard", 2.15, "medium", "Zone supérieure altérée et fissurée."],
      ["Schistes / phyllades compacts", cap(45), depthM, "bedrock", "aquitard", 2.45, "medium", "Socle schisteux relativement homogène."],
    ])
  }

  return makeLayers([
    ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et matériaux superficiels."],
    ["Couverture altérée", cap(2), cap(12), "cover", "aquitard", 1.6, "medium", "Couverture meuble et zone d'altération."],
    ["Socle altéré / fissuré", cap(12), cap(40), "bedrock", "aquitard", 2.1, "medium", "Zone de transition altérée."],
    ["Socle paléozoïque consolidé", cap(40), depthM, "bedrock", "aquitard", 2.45, "low", "Substratum consolidé, nature exacte à confirmer."],
  ])
}

function variableLayersForFamenne(model: RegionalModel, text: string, depthM: number) {
  const scores = textScoresForVariableModel(text)
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  const carbonateSignal = scores.carbonate >= 1
  const shaleSignal = scores.shale >= 1

  if (carbonateSignal && shaleSignal) {
    return makeLayers([
      ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de surface."],
      ["Limons / argiles / altérites", cap(2), cap(12), "cover", "aquitard", 1.5, "medium", "Couverture et altération du substratum."],
      ["Schistes ou calcschistes altérés", cap(12), cap(35), "bedrock", "aquitard", 2.1, "medium", "Zone supérieure altérée, possiblement fracturée."],
      ["Niveaux schisteux dominants", cap(35), cap(80), "bedrock", "aquitard", 2.25, "medium", "Niveaux schisteux ou calcschisteux dominants."],
      ["Intercalations carbonatées possibles", cap(80), cap(135), "bedrock", "unknown", 2.55, "low", "Niveaux carbonatés localisés possibles."],
      ["Substratum schisto-carbonaté profond", cap(135), depthM, "bedrock", "unknown", 2.45, "low", "Substratum profond variable, à confirmer par forage."],
    ])
  }

  return makeLayers([
    ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon de surface."],
    ["Limons / argiles / altérites", cap(2), cap(12), "cover", "aquitard", 1.5, "medium", "Couverture meuble et altération."],
    ["Schistes ou calcschistes altérés", cap(12), cap(40), "bedrock", "aquitard", 2.1, "medium", "Zone altérée du substratum."],
    ["Alternances schisto-calcaires", cap(40), cap(120), "bedrock", "aquitard", 2.3, "medium", "Alternances probables."],
    ["Substratum plus massif", cap(120), depthM, "bedrock", "unknown", 2.5, "low", "Substratum profond à confirmer."],
  ])
}

function variableLayersForCarbonate(model: RegionalModel, text: string, depthM: number) {
  const scores = textScoresForVariableModel(text)
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  const karst = scores.karst > 0

  return makeLayers([
    ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Couverture de surface."],
    ["Altérites / couverture caillouteuse", cap(2), cap(10), "cover", "aquitard", 1.7, "medium", "Couverture et altération du calcaire."],
    ["Calcaire altéré ou fracturé", cap(10), cap(35), "aquifer", "aquifer", 2.35, "medium", "Zone d'altération et de fracturation potentiellement aquifère."],
    ...(karst
      ? [
          ["Niveau carbonaté karstifié possible", cap(35), cap(70), "aquifer", "aquifer", 2.55, "low", "Indice karstique détecté ; niveau à confirmer localement."] as Parameters<typeof layer>,
        ]
      : []),
    ["Calcaire / dolomie massif", cap(karst ? 70 : 35), cap(140), "aquifer", "aquifer", 2.8, "medium", "Roche carbonatée généralement favorable thermiquement."],
    ["Carbonaté profond plus compact", cap(140), depthM, "aquifer", "aquifer", 2.7, "low", "Substratum carbonaté profond à confirmer."],
  ])
}

function variableLayersForCondroz(model: RegionalModel, text: string, depthM: number) {
  const scores = textScoresForVariableModel(text)
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  const strongAlternance = scores.sandstone >= 1 && scores.shale >= 1

  return makeLayers([
    ["Sol et limons superficiels", 0, cap(3), "cover", "aquitard", 1.4, "medium", "Couverture superficielle."],
    ["Altérites et horizon fissuré", cap(3), cap(18), "cover", "aquitard", 1.8, "medium", "Zone altérée du substratum."],
    ...(strongAlternance
      ? [
          ["Schistes / psammites altérés", cap(18), cap(45), "bedrock", "aquitard", 2.2, "medium", "Substratum altéré et fracturé."] as Parameters<typeof layer>,
          ["Niveaux gréseux ou psammitiques", cap(45), cap(85), "bedrock", "aquitard", 2.65, "medium", "Niveaux plus conducteurs possibles."],
          ["Alternances grès - schistes", cap(85), cap(145), "bedrock", "aquitard", 2.45, "medium", "Alternances consolidées."],
        ]
      : [
          ["Alternances grès - schistes", cap(18), cap(130), "bedrock", "aquitard", 2.45, "medium", "Alternances consolidées."] as Parameters<typeof layer>,
        ]),
    ["Substratum gréso-schisteux profond", cap(strongAlternance ? 145 : 130), depthM, "bedrock", "unknown", 2.6, "low", "Substratum profond plus compact."],
  ])
}

function variableLayersForHesbaye(model: RegionalModel, text: string, depthM: number) {
  const scores = textScoresForVariableModel(text)
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  const thickLoam = scores.clay >= 2 || text.toLowerCase().includes("limon")

  return makeLayers([
    ["Sol et limons supérieurs", 0, cap(3), "cover", "aquitard", 1.3, "medium", "Horizon pédologique et limons superficiels."],
    ["Limons / lœss", cap(3), cap(thickLoam ? 22 : 12), "cover", "aquitard", 1.4, "medium", "Couverture limoneuse."],
    ...(thickLoam
      ? [
          ["Limons argileux ou altérites", cap(22), cap(35), "cover", "aquitard", 1.55, "low", "Transition vers le substratum."] as Parameters<typeof layer>,
        ]
      : []),
    ["Substratum crayeux ou sédimentaire", cap(thickLoam ? 35 : 12), cap(120), "bedrock", "aquifer", 2.1, "low", "Nature exacte à confirmer par carte détaillée."],
    ["Substratum profond", cap(120), depthM, "bedrock", "unknown", 2.2, "low", "Interprétation régionale prudente."],
  ])
}

function variableLayersForLorraine(model: RegionalModel, text: string, depthM: number) {
  const cap = (v: number) => capDepthForVariableModel(v, depthM)

  return makeLayers([
    ["Sol et couverture superficielle", 0, cap(2), "cover", "aquitard", 1.3, "medium", "Horizon superficiel."],
    ["Sables / limons / argiles superficielles", cap(2), cap(12), "cover", "unknown", 1.6, "medium", "Couverture meuble variable."],
    ["Niveaux sableux ou gréseux supérieurs", cap(12), cap(35), "aquifer", "aquifer", 2.0, "medium", "Niveaux potentiellement aquifères."],
    ["Marnes ou argiles intermédiaires", cap(35), cap(70), "aquitard", "aquitard", 1.7, "medium", "Niveaux moins perméables."],
    ["Niveaux sableux / gréseux profonds", cap(70), cap(115), "aquifer", "aquifer", 2.05, "low", "Second niveau potentiellement aquifère."],
    ["Argiles, marnes ou alternances profondes", cap(115), cap(160), "aquitard", "aquitard", 1.75, "low", "Alternances moins perméables."],
    ["Substratum sédimentaire profond", cap(160), depthM, "bedrock", "unknown", 2.1, "low", "Stratigraphie profonde à confirmer localement."],
  ])
}

function variableLayersForUnknown(model: RegionalModel, text: string, depthM: number) {
  const cap = (v: number) => capDepthForVariableModel(v, depthM)
  const scores = textScoresForVariableModel(text)

  if (scores.carbonate || scores.sandstone || scores.shale || scores.clay) {
    return makeLayers([
      ["Sol et couverture superficielle", 0, cap(2), "cover", "unknown", 1.3, "low", "Hypothèse générique."],
      ["Couverture altérée probable", cap(2), cap(15), "cover", "unknown", 1.6, "low", "Hypothèse générique."],
      ["Substratum supérieur interprété", cap(15), cap(80), "unknown", "unknown", 2.0, "low", "Nature interprétée à partir d'indices locaux."],
      ["Substratum profond à confirmer", cap(80), depthM, "unknown", "unknown", 2.2, "low", "Nature inconnue."],
    ])
  }

  return makeLayers([
    ["Couverture superficielle", 0, cap(10), "cover", "unknown", 1.4, "low", "Hypothèse générique."],
    ["Substratum à caractériser", cap(10), depthM, "unknown", "unknown", null, "low", "Nature inconnue."],
  ])
}

export function makeVariableLayerModel(model: RegionalModel, evidenceText: string, depthM: number): RegionalModel {
  let layers = model.layers

  if (model.key === "ardenne") {
    layers = variableLayersForArdenne(model, evidenceText, depthM)
  } else if (model.key === "famenne") {
    layers = variableLayersForFamenne(model, evidenceText, depthM)
  } else if (model.key === "carbonate") {
    layers = variableLayersForCarbonate(model, evidenceText, depthM)
  } else if (model.key === "condroz") {
    layers = variableLayersForCondroz(model, evidenceText, depthM)
  } else if (model.key === "hesbaye") {
    layers = variableLayersForHesbaye(model, evidenceText, depthM)
  } else if (model.key === "lorraine") {
    layers = variableLayersForLorraine(model, evidenceText, depthM)
  } else {
    layers = variableLayersForUnknown(model, evidenceText, depthM)
  }

  return {
    ...model,
    layers,
  }
}

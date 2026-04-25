import { NextRequest, NextResponse } from "next/server"

type ArcFeature = {
  attributes?: Record<string, any>
  geometry?: any
}

type EvidencePoint = {
  source: "affleurement" | "sondage" | "surface" | "context" | "soil"
  distanceM: number | null
  attributes: Record<string, any>
  summary: string
}

type InterpretedLayer = {
  name: string
  topM: number
  bottomM: number
  type: "cover" | "bedrock" | "aquifer" | "aquitard" | "unknown"
  hydroClass: "aquifer" | "aquitard" | "aquiclude" | "unknown"
  thermalConductivityWmK: number | null
  confidence: "low" | "medium" | "high"
  rationale: string
}

type RegionalModel = {
  key: string
  label: string
  confidence: "low" | "medium" | "high"
  layers: InterpretedLayer[]
  message: string
}

const SERVICES = {
  geologie: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/GEOLOGIE/MapServer",
  cgeolSimple: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/CGEOL_SIMPLE/MapServer",
  uer: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/UER/MapServer",
  cnsw: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/CNSW/MapServer",
}

const GEOLOGIE_LAYERS = {
  affleurements: 1,
  sondages: 2,
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function metersToLat(meters: number) {
  return meters / 111_320
}

function metersToLng(meters: number, lat: number) {
  return meters / (111_320 * Math.cos(degToRad(lat)))
}

function haversineM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6_371_000
  const dLat = degToRad(bLat - aLat)
  const dLng = degToRad(bLng - aLng)
  const p1 = degToRad(aLat)
  const p2 = degToRad(bLat)

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(x))
}

function cleanText(value: any): string {
  if (value === null || value === undefined) return ""
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function attrsText(attributes: Record<string, any>) {
  return Object.values(attributes || {})
    .map(cleanText)
    .filter(Boolean)
    .join(" ")
}

function featureSummary(attributes: Record<string, any>) {
  const preferred = [
    "NOM",
    "NAME",
    "FORMATION",
    "FORM",
    "UNITE",
    "UNITE_GEO",
    "LITHO",
    "LITHOLOGIE",
    "DESCRIPTION",
    "DESCRIPTIO",
    "COMMENTAIRE",
    "REMARQUE",
    "TYPE",
    "CODE",
    "SERIE",
    "SIGLE",
    "NOM_CARTE",
    "DISTRICT",
    "SECTEUR",
    "DOMAINE",
  ]

  const parts: string[] = []

  for (const key of preferred) {
    const found = Object.keys(attributes || {}).find((k) => k.toUpperCase() === key)
    if (found) {
      const v = cleanText(attributes[found])
      if (v && !parts.includes(v)) parts.push(v)
    }
  }

  if (parts.length > 0) return parts.slice(0, 5).join(" — ")

  return Object.entries(attributes || {})
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${cleanText(v)}`)
    .join(" — ")
}

function allEvidenceText(items: EvidencePoint[]) {
  return items
    .map((item) => attrsText(item.attributes) + " " + item.summary)
    .join(" ")
    .toLowerCase()
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "WellDoneDrill-GeologySection/1.1" },
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return res.json()
}

async function identifyPoint(
  serviceUrl: string,
  lat: number,
  lng: number,
  layers = "all",
  tolerance = "3"
): Promise<ArcFeature[]> {
  const delta = 0.006

  const params = new URLSearchParams({
    geometry: JSON.stringify({
      x: lng,
      y: lat,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: "esriGeometryPoint",
    sr: "4326",
    layers,
    tolerance,
    mapExtent: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    imageDisplay: "900,900,96",
    returnGeometry: "false",
    f: "json",
  })

  const data = await fetchJson(`${serviceUrl}/identify?${params.toString()}`)
  return Array.isArray(data.results) ? data.results : []
}

async function queryNearbyLayer(
  serviceUrl: string,
  layerId: number,
  lat: number,
  lng: number,
  radiusM: number,
  source: EvidencePoint["source"]
): Promise<EvidencePoint[]> {
  const dLat = metersToLat(radiusM)
  const dLng = metersToLng(radiusM, lat)

  const envelope = {
    xmin: lng - dLng,
    ymin: lat - dLat,
    xmax: lng + dLng,
    ymax: lat + dLat,
    spatialReference: { wkid: 4326 },
  }

  const params = new URLSearchParams({
    f: "json",
    where: "1=1",
    outFields: "*",
    returnGeometry: "true",
    geometry: JSON.stringify(envelope),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    outSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    resultRecordCount: "50",
  })

  const data = await fetchJson(`${serviceUrl}/${layerId}/query?${params.toString()}`)
  const features: ArcFeature[] = Array.isArray(data.features) ? data.features : []

  return features
    .map((feature) => {
      const attrs = feature.attributes || {}
      const geom = feature.geometry || {}
      const y = Number(geom.y)
      const x = Number(geom.x)

      const distance =
        Number.isFinite(y) && Number.isFinite(x)
          ? Math.round(haversineM(lat, lng, y, x))
          : null

      return {
        source,
        distanceM: distance,
        attributes: attrs,
        summary: featureSummary(attrs),
      }
    })
    .sort((a, b) => (a.distanceM ?? 999999) - (b.distanceM ?? 999999))
}

async function queryProgressive(
  serviceUrl: string,
  layerId: number,
  lat: number,
  lng: number,
  requestedRadiusM: number,
  source: EvidencePoint["source"]
) {
  const radii = [500, 1500, 3000, requestedRadiusM, 5000]
    .filter((v, i, a) => v <= 5000 && a.indexOf(v) === i)
    .sort((a, b) => a - b)

  let last: EvidencePoint[] = []

  for (const radius of radii) {
    const found = await queryNearbyLayer(serviceUrl, layerId, lat, lng, radius, source)
    last = found

    if (found.length >= 3 || radius >= requestedRadiusM) {
      return { radiusM: radius, items: found }
    }
  }

  return { radiusM: radii[radii.length - 1] || requestedRadiusM, items: last }
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
  return {
    name,
    topM,
    bottomM,
    type,
    hydroClass,
    thermalConductivityWmK: lambda,
    confidence,
    rationale,
  }
}


function makeLayers(depthM: number, specs: Array<Parameters<typeof layer>>) {
  return specs
    .map((args) => layer(...args))
    .filter((l) => l.bottomM > l.topM)
}

function inferRegionalModel(text: string, lat: number, lng: number, depthM: number): RegionalModel {
  const t = text.toLowerCase()
  
  const capDepth = (value: number) => Math.min(value, depthM)
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
      layers: makeLayers(depthM, [
        ["Sol et couverture superficielle", 0, capDepth(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et matériaux superficiels."],
        ["Limons, colluvions et altérites", capDepth(2), capDepth(8), "cover", "aquitard", 1.6, "medium", "Couverture meuble et zone d'altération superficielle."],
        ["Socle altéré et fissuré", capDepth(8), capDepth(30), "bedrock", "aquitard", 2.1, "medium", "Zone de transition altérée, potentiellement plus fracturée et localement humide."],
        ["Schistes / phyllades fracturés", capDepth(30), capDepth(120), "bedrock", "aquitard", 2.4, "medium", "Roche consolidée à perméabilité contrôlée par les fractures."],
        ["Grès, quartzites ou schistes plus compacts", capDepth(120), depthM, "bedrock", "aquitard", 2.7, "low", "Substratum profond plus compact ; conductivité thermique généralement correcte."],
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
      layers: makeLayers(depthM, [
        ["Sol et couverture superficielle", 0, capDepth(2), "cover", "aquitard", 1.3, "medium", "Horizon de sol et couverture superficielle."],
        ["Limons / argiles / altérites", capDepth(2), capDepth(12), "cover", "aquitard", 1.5, "medium", "Couverture et altération du substratum."],
        ["Schistes ou calcschistes altérés", capDepth(12), capDepth(40), "bedrock", "aquitard", 2.1, "medium", "Zone altérée du substratum, possiblement fracturée."],
        ["Alternances schisto-calcaires", capDepth(40), capDepth(120), "bedrock", "aquitard", 2.3, "medium", "Alternance probable de niveaux schisteux, calcschisteux et localement carbonatés."],
        ["Substratum schisteux / carbonaté plus massif", capDepth(120), depthM, "bedrock", "unknown", 2.5, "low", "Substratum profond à confirmer localement par forage ou données WDD."],
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
      layers: makeLayers(depthM, [
        ["Sol et couverture superficielle", 0, capDepth(2), "cover", "aquitard", 1.3, "medium", "Couverture de surface."],
        ["Altérites / couverture caillouteuse", capDepth(2), capDepth(10), "cover", "aquitard", 1.7, "medium", "Couverture et altération du calcaire."],
        ["Calcaire altéré ou fracturé", capDepth(10), capDepth(40), "aquifer", "aquifer", 2.3, "medium", "Zone de fracturation et d'altération potentiellement aquifère."],
        ["Calcaire / dolomie massif", capDepth(40), capDepth(140), "aquifer", "aquifer", 2.8, "medium", "Roche carbonatée généralement favorable thermiquement."],
        ["Carbonaté profond à confirmer", capDepth(140), depthM, "aquifer", "aquifer", 2.7, "low", "Risque de karst ou de fracture à confirmer par données locales."],
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
      layers: makeLayers(depthM, [
        ["Sol et limons superficiels", 0, capDepth(3), "cover", "aquitard", 1.4, "medium", "Couverture superficielle."],
        ["Altérites et horizon fissuré", capDepth(3), capDepth(15), "cover", "aquitard", 1.8, "medium", "Zone altérée du substratum."],
        ["Schistes / psammites altérés", capDepth(15), capDepth(45), "bedrock", "aquitard", 2.2, "medium", "Substratum altéré et fracturé."],
        ["Alternances grès - schistes", capDepth(45), capDepth(130), "bedrock", "aquitard", 2.5, "medium", "Conductivité thermique correcte, perméabilité dépendante des fractures."],
        ["Grès ou schistes plus compacts", capDepth(130), depthM, "bedrock", "unknown", 2.6, "low", "Substratum profond plus compact."],
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
      layers: makeLayers(depthM, [
        ["Sol et limons supérieurs", 0, capDepth(3), "cover", "aquitard", 1.3, "medium", "Horizon pédologique et limons superficiels."],
        ["Limons / lœss", capDepth(3), capDepth(15), "cover", "aquitard", 1.4, "medium", "Couverture limoneuse potentiellement épaisse."],
        ["Altérites ou formations meubles", capDepth(15), capDepth(30), "cover", "unknown", 1.6, "low", "Transition vers le substratum."],
        ["Substratum crayeux ou sédimentaire", capDepth(30), capDepth(120), "bedrock", "aquifer", 2.1, "low", "Nature exacte à confirmer par carte détaillée."],
        ["Substratum profond", capDepth(120), depthM, "bedrock", "unknown", 2.2, "low", "Interprétation régionale prudente."],
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
      layers: makeLayers(depthM, [
        ["Sol et couverture superficielle", 0, capDepth(2), "cover", "aquitard", 1.3, "medium", "Horizon superficiel."],
        ["Sables / limons / argiles superficielles", capDepth(2), capDepth(15), "cover", "unknown", 1.6, "medium", "Couverture meuble variable."],
        ["Niveaux sableux ou gréseux", capDepth(15), capDepth(50), "aquifer", "aquifer", 2.0, "medium", "Niveaux potentiellement aquifères."],
        ["Marnes ou argiles", capDepth(50), capDepth(100), "aquitard", "aquitard", 1.7, "medium", "Niveaux moins perméables."],
        ["Alternances profondes grès / argiles", capDepth(100), depthM, "bedrock", "unknown", 2.1, "low", "Stratigraphie à confirmer localement."],
      ]),
    }
  }

  return {
    key: "unknown",
    label: "Contexte régional à confirmer",
    confidence: "low",
    message:
      "Les données publiques récupérées ne suffisent pas encore à identifier clairement le contexte géologique régional.",
    layers: makeLayers(depthM, [
      ["Sol et couverture superficielle", 0, capDepth(2), "cover", "unknown", 1.3, "low", "Hypothèse générique."],
      ["Couverture altérée probable", capDepth(2), capDepth(10), "cover", "unknown", 1.6, "low", "Hypothèse générique."],
      ["Substratum supérieur à caractériser", capDepth(10), capDepth(50), "unknown", "unknown", null, "low", "Nature inconnue."],
      ["Substratum intermédiaire à caractériser", capDepth(50), capDepth(120), "unknown", "unknown", null, "low", "Nature inconnue."],
      ["Substratum profond à caractériser", capDepth(120), depthM, "unknown", "unknown", null, "low", "Nature inconnue."],
    ]),
  }
}

function countMatches(text: string, words: string[]) {
  return words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
}

function refineWithLocalTerms(model: RegionalModel, evidenceText: string, depthM: number): RegionalModel {
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

function buildTransect(lat: number, lng: number, lengthM: number, orientationDeg: number, sampleCount: number) {
  const angle = degToRad(orientationDeg)
  const half = lengthM / 2

  return Array.from({ length: sampleCount }, (_, i) => {
    const ratio = sampleCount === 1 ? 0.5 : i / (sampleCount - 1)
    const distanceFromCenter = -half + ratio * lengthM
    const north = Math.cos(angle) * distanceFromCenter
    const east = Math.sin(angle) * distanceFromCenter

    return {
      index: i,
      distanceM: Math.round(distanceFromCenter + half),
      lat: lat + metersToLat(north),
      lng: lng + metersToLng(east, lat),
    }
  })
}

function buildWarnings(model: RegionalModel, evidence: EvidencePoint[], sondageRadius: number, affleurementRadius: number) {
  const warnings = [
    "Coupe indicative générée automatiquement à partir des services publics disponibles.",
    "Cette V1.1 ne remplace pas une étude géologique, une visite de site ou un rapport de forage.",
    "Les profondeurs de couches sont interprétatives : elles servent à préqualifier un projet, pas à prescrire un forage.",
  ]

  const sondages = evidence.filter((e) => e.source === "sondage")
  if (sondages.length === 0) {
    warnings.push(`Aucun sondage public proche n’a été récupéré dans le rayon analysé (${sondageRadius} m).`)
  }

  if (model.confidence === "low") {
    warnings.push("Confiance faible : peu de données publiques exploitables automatiquement autour du point.")
  }

  if (affleurementRadius > 1500) {
    warnings.push(`Les observations géologiques proches proviennent d’un rayon élargi (${affleurementRadius} m).`)
  }

  return warnings
}


function buildHydrogeologyInterpretation(layers: InterpretedLayer[], regionalKey: string) {
  const aquiferLayers = layers.filter((layer) => layer.hydroClass === "aquifer")
  const aquitardLayers = layers.filter((layer) => layer.hydroClass === "aquitard")
  const unknownLayers = layers.filter((layer) => layer.hydroClass === "unknown")

  const hasCarbonate = regionalKey === "carbonate" || layers.some((layer) =>
    layer.name.toLowerCase().includes("calcaire") ||
    layer.name.toLowerCase().includes("dolomie") ||
    layer.name.toLowerCase().includes("carbonat")
  )

  const hasFracturedBedrock = layers.some((layer) =>
    layer.name.toLowerCase().includes("fractur") ||
    layer.name.toLowerCase().includes("fissur") ||
    layer.name.toLowerCase().includes("altéré") ||
    layer.name.toLowerCase().includes("altéré")
  )

  let likelyWaterTableDepthM: number | null = null
  let waterMode: "continuous" | "fractured" | "perched" | "unknown" = "unknown"
  let confidence: "low" | "medium" | "high" = "low"

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
      const isAquifer = layer.hydroClass === "aquifer"
      const isFracturedCandidate =
        layer.type === "bedrock" &&
        layer.hydroClass !== "aquiclude" &&
        (
          layer.name.toLowerCase().includes("fractur") ||
          layer.name.toLowerCase().includes("fissur") ||
          layer.name.toLowerCase().includes("altéré") ||
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


export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Paramètres lat/lng invalides" }, { status: 400 })
  }

  const depthM = clampNumber(Number(searchParams.get("depth") || 200), 50, 300)
  const lengthM = clampNumber(Number(searchParams.get("length") || 1000), 200, 3000)
  const radiusM = clampNumber(Number(searchParams.get("radius") || 1500), 500, 5000)
  const orientationDeg = clampNumber(Number(searchParams.get("orientation") || 90), 0, 359)
  const sampleCount = Math.round(clampNumber(Number(searchParams.get("samples") || 9), 3, 25))

  const diagnostics: string[] = []
  const surfaceEvidence: EvidencePoint[] = []
  const soilEvidence: EvidencePoint[] = []

  try {
    const cgeol = await identifyPoint(SERVICES.cgeolSimple, lat, lng, "all", "4")
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
    const uer = await identifyPoint(SERVICES.uer, lat, lng, "all", "4")
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
    const cnsw = await identifyPoint(SERVICES.cnsw, lat, lng, "all", "4")
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

  let affleurementsResult = { radiusM, items: [] as EvidencePoint[] }
  let sondagesResult = { radiusM, items: [] as EvidencePoint[] }

  try {
    affleurementsResult = await queryProgressive(
      SERVICES.geologie,
      GEOLOGIE_LAYERS.affleurements,
      lat,
      lng,
      radiusM,
      "affleurement"
    )
  } catch (error: any) {
    diagnostics.push(`Affleurements non récupérés: ${error.message}`)
  }

  try {
    sondagesResult = await queryProgressive(
      SERVICES.geologie,
      GEOLOGIE_LAYERS.sondages,
      lat,
      lng,
      radiusM,
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
  const baseModel = inferRegionalModel(evidenceText, lat, lng, depthM)
  const model = refineWithLocalTerms(baseModel, evidenceText, depthM)

  const transect = buildTransect(lat, lng, lengthM, orientationDeg, sampleCount)

  const surfaceSamples = await Promise.all(
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

  const finalConfidence =
    sondagesResult.items.length >= 2
      ? "high"
      : model.confidence === "high"
      ? "high"
      : evidence.length >= 4
      ? "medium"
      : "low"

  const warnings = buildWarnings(
    { ...model, confidence: finalConfidence },
    evidence,
    sondagesResult.radiusM,
    affleurementsResult.radiusM
  )

  const lambdaAvg = model.layers
    .map((l) => l.thermalConductivityWmK)
    .filter((v): v is number => typeof v === "number")

  const avg = lambdaAvg.length
    ? lambdaAvg.reduce((a, b) => a + b, 0) / lambdaAvg.length
    : null

  return NextResponse.json({
    version: "v1.1",
    status: "ok",
    input: {
      lat,
      lng,
      depthM,
      lengthM,
      radiusM,
      orientationDeg,
      sampleCount,
    },
    sources: {
      geologie: SERVICES.geologie,
      cgeolSimple: SERVICES.cgeolSimple,
      uer: SERVICES.uer,
      cnsw: SERVICES.cnsw,
    },
    regionalContext: {
      key: model.key,
      label: model.label,
      message: model.message,
    },
    transect: {
      lengthM,
      orientationDeg,
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
      depthM,
      confidence: finalConfidence,
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
        `${model.message} Interprétation automatique V1.3 : potentiel géothermique ` +
        `${avg === null ? "à confirmer" : avg >= 2.3 ? "favorable" : "modéré"} ` +
        `sur base des données publiques disponibles. Cette analyse doit être consolidée par les données de forage WDD ou une reconnaissance locale.`,
    },
    hydrogeology: buildHydrogeologyInterpretation(model.layers, model.key),
    warnings,
    diagnostics,
  })
}

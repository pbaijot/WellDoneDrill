import { NextRequest, NextResponse } from "next/server"

const SERVICES: Record<string, { url: string; tolerance: string; layers: string }> = {
  captage:   { url: "https://geoservices.wallonie.be/arcgis/rest/services/EAU/PROTECT_CAPT/MapServer",                   tolerance: "2", layers: "all" },
  pollution: { url: "https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer",       tolerance: "2", layers: "all" },
  karst:     { url: "https://geoservices.wallonie.be/arcgis/rest/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer", tolerance: "2", layers: "all" },
  natura:    { url: "https://geoservices.wallonie.be/arcgis/rest/services/FAUNE_FLORE/NATURA2000/MapServer",             tolerance: "2", layers: "all" },
  zi:        { url: "https://geoservices.wallonie.be/arcgis/rest/services/EAU/ZI/MapServer",                            tolerance: "1", layers: "all:0,2,4,6" },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get("lat") || "0")
  const lng = parseFloat(searchParams.get("lng") || "0")
  const layer = searchParams.get("layer") || ""

  if (!lat || !lng || !SERVICES[layer]) {
    return NextResponse.json({ error: "Params invalides" }, { status: 400 })
  }

  const svc = SERVICES[layer]
  const delta = 0.005
  const geom = JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } })
  const bbox = (lng - delta) + "," + (lat - delta) + "," + (lng + delta) + "," + (lat + delta)

  const params = new URLSearchParams({
    geometry: geom,
    geometryType: "esriGeometryPoint",
    sr: "4326",
    layers: svc.layers,
    tolerance: svc.tolerance,
    mapExtent: bbox,
    imageDisplay: "800,800,96",
    returnGeometry: "false",
    f: "json",
  })

  try {
    const res = await fetch(svc.url + "/identify?" + params.toString(), {
      headers: { "User-Agent": "WellDoneDrill/1.0" },
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    const results = Array.isArray(data.results) ? data.results : []
    const isZI = layer === "zi"
    const hasFeatures = results.some((r: any) => !isZI || r.geometryType === "esriGeometryPolygon" || r.geometry === undefined)
    return NextResponse.json({ hasFeatures, count: results.length })
  } catch (e: any) {
    return NextResponse.json({ hasFeatures: null, error: e.message })
  }
}

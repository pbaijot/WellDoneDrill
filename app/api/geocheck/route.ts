import { NextRequest, NextResponse } from 'next/server'

const WMS_LAYERS: Record<string, { url: string; layers: string }> = {
  captage:     { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer', layers: '0,1,2,3' },
  pollution:   { url: 'https://geoservices.wallonie.be/arcgis/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer/WMSServer', layers: '0' },
  karst:       { url: 'https://geoservices.wallonie.be/arcgis/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer/WMSServer', layers: '0,1' },
  natura:      { url: 'https://geoservices.wallonie.be/arcgis/services/FAUNE_FLORE/NATURA2000/MapServer/WMSServer', layers: '0' },
  inondations: { url: 'https://geoservices.wallonie.be/arcgis/services/EAU/ZI/MapServer/WMSServer', layers: '0,1,2' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const layer = searchParams.get('layer') || ''

  if (!lat || !lng || !WMS_LAYERS[layer]) {
    return NextResponse.json({ error: 'Params invalides' }, { status: 400 })
  }

  const { url, layers } = WMS_LAYERS[layer]
  const delta = 0.003
  const bbox = (lng - delta) + ',' + (lat - delta) + ',' + (lng + delta) + ',' + (lat + delta)

  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    REQUEST: 'GetFeatureInfo',
    LAYERS: layers,
    QUERY_LAYERS: layers,
    STYLES: '',
    BBOX: bbox,
    WIDTH: '101',
    HEIGHT: '101',
    X: '50',
    Y: '50',
    INFO_FORMAT: 'text/plain',
    SRS: 'EPSG:4326',
    FEATURE_COUNT: '1',
  })

  try {
    const res = await fetch(url + '?' + params.toString(), {
      headers: { 'User-Agent': 'WellDoneDrill/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    const lower = text.toLowerCase()
    const hasFeatures =
      lower.includes('objectid') ||
      lower.includes('shape') ||
      (text.trim().length > 80 &&
        !lower.includes('no feature') &&
        !lower.includes('0 features') &&
        !lower.includes('keine'))
    return NextResponse.json({ hasFeatures, debug: text.slice(0, 300) })
  } catch (e: any) {
    return NextResponse.json({ hasFeatures: null, error: e.message })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const WMS_LAYERS = {
  captage: {
    url: 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer',
    layer: '0,1,2,3',
    label: 'Zone de prevention de captage',
  },
  natura: {
    url: 'https://geoservices.wallonie.be/arcgis/services/FAUNE_FLORE/NATURA2000/MapServer/WMSServer',
    layer: '0,1,2',
    label: 'Zone Natura 2000',
  },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const layer = searchParams.get('layer') as keyof typeof WMS_LAYERS

  if (!lat || !lng || !WMS_LAYERS[layer]) {
    return NextResponse.json({ error: 'Params invalides' }, { status: 400 })
  }

  const { url, layer: layerName } = WMS_LAYERS[layer]
  const delta = 0.003
  const minx = lng - delta
  const miny = lat - delta
  const maxx = lng + delta
  const maxy = lat + delta

  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetFeatureInfo',
    LAYERS: layerName,
    QUERY_LAYERS: layerName,
    BBOX: miny + ',' + minx + ',' + maxy + ',' + maxx,
    WIDTH: '101',
    HEIGHT: '101',
    I: '50',
    J: '50',
    INFO_FORMAT: 'application/json',
    CRS: 'EPSG:4326',
  })

  try {
    const res = await fetch(url + '?' + params.toString(), {
      headers: { 'User-Agent': 'WellDoneDrill/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    let hasFeatures = false
    try {
      const json = JSON.parse(text)
      hasFeatures = Array.isArray(json.features) && json.features.length > 0
    } catch {
      hasFeatures = text.includes('OBJECTID') || (text.includes('featureMember') && text.trim().length > 200)
    }
    return NextResponse.json({ hasFeatures })
  } catch (e) {
    return NextResponse.json({ hasFeatures: null, error: 'WMS indisponible' })
  }
}

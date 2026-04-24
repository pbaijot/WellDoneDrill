import { NextRequest, NextResponse } from 'next/server'

const WMS_LAYERS = {
  captage: {
    url: 'https://geoservices.wallonie.be/arcgis/services/EAUX/PROT_CAPT/MapServer/WMSServer',
    layer: '0',
    label: 'Zone de prevention de captage',
  },
  natura: {
    url: 'https://geoservices.wallonie.be/arcgis/services/BIODIVERSITE/NATURA2000/MapServer/WMSServer',
    layer: '0',
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
  const delta = 0.005
  const bbox = lng - delta + ',' + (lat - delta) + ',' + (lng + delta) + ',' + (lat + delta)

  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    REQUEST: 'GetFeatureInfo',
    LAYERS: layerName,
    QUERY_LAYERS: layerName,
    BBOX: bbox,
    WIDTH: '101',
    HEIGHT: '101',
    X: '50',
    Y: '50',
    INFO_FORMAT: 'application/json',
    SRS: 'EPSG:4326',
  })

  try {
    const res = await fetch(url + '?' + params.toString(), {
      headers: { 'User-Agent': 'WellDoneDrill/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      const hasFeatures = Array.isArray(json.features) && json.features.length > 0
      return NextResponse.json({ hasFeatures })
    } catch {
      const hasFeatures = text.includes('gml:featureMember') && !text.includes('no feature')
      return NextResponse.json({ hasFeatures })
    }
  } catch {
    return NextResponse.json({ hasFeatures: null, error: 'WMS indisponible' })
  }
}

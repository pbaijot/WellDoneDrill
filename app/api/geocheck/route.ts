import { NextRequest, NextResponse } from 'next/server'

const WMS_BASE = 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const layer = searchParams.get('layer')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Params invalides' }, { status: 400 })
  }

  if (layer === 'natura') {
    return NextResponse.json({ hasFeatures: false })
  }

  const delta = 0.005
  const minx = lng - delta
  const miny = lat - delta
  const maxx = lng + delta
  const maxy = lat + delta
  const size = 101
  const cx = Math.floor(size / 2)
  const cy = Math.floor(size / 2)

  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    REQUEST: 'GetFeatureInfo',
    LAYERS: '0,1,2,3',
    QUERY_LAYERS: '0,1,2,3',
    STYLES: '',
    BBOX: minx + ',' + miny + ',' + maxx + ',' + maxy,
    WIDTH: String(size),
    HEIGHT: String(size),
    X: String(cx),
    Y: String(cy),
    INFO_FORMAT: 'text/plain',
    SRS: 'EPSG:4326',
    FEATURE_COUNT: '1',
  })

  try {
    const res = await fetch(WMS_BASE + '?' + params.toString(), {
      headers: { 'User-Agent': 'WellDoneDrill/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const text = await res.text()
    const hasFeatures =
      text.toLowerCase().includes('objectid') ||
      text.toLowerCase().includes('shape') ||
      text.toLowerCase().includes('results') && !text.toLowerCase().includes('no features') ||
      (text.trim().length > 50 && !text.toLowerCase().includes('no feature') && !text.toLowerCase().includes('keine'))
    return NextResponse.json({ hasFeatures, debug: text.slice(0, 200) })
  } catch (e: any) {
    return NextResponse.json({ hasFeatures: null, error: e.message })
  }
}

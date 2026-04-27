import { NextRequest, NextResponse } from 'next/server'

import {
  REGULATORY_LAYER_BY_KEY,
  isRegulatoryLayerKey,
} from '@/simulator/src/data/spwLayers'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const layerKey = searchParams.get('layer') || ''

  if (!lat || !lng || !isRegulatoryLayerKey(layerKey)) {
    return NextResponse.json({ error: 'Params invalides' }, { status: 400 })
  }

  const layer = REGULATORY_LAYER_BY_KEY[layerKey]
  const delta = 0.005

  const geom = JSON.stringify({
    x: lng,
    y: lat,
    spatialReference: { wkid: 4326 },
  })

  const bbox =
    (lng - delta) + ',' +
    (lat - delta) + ',' +
    (lng + delta) + ',' +
    (lat + delta)

  const params = new URLSearchParams({
    geometry: geom,
    geometryType: 'esriGeometryPoint',
    sr: '4326',
    layers: layer.restLayers,
    tolerance: layer.tolerance,
    mapExtent: bbox,
    imageDisplay: '800,800,96',
    returnGeometry: 'false',
    f: 'json',
  })

  try {
    const response = await fetch(layer.restUrl + '/identify?' + params.toString(), {
      headers: { 'User-Agent': 'WellDoneDrill/1.0' },
      signal: AbortSignal.timeout(10000),
    })

    const data = await response.json()
    const results = Array.isArray(data.results) ? data.results : []

    const isFloodLayer = layerKey === 'zi'
    const hasFeatures = results.some((result: any) =>
      !isFloodLayer ||
      result.geometryType === 'esriGeometryPolygon' ||
      result.geometry === undefined
    )

    return NextResponse.json({
      hasFeatures,
      count: results.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      hasFeatures: null,
      error: error.message,
    })
  }
}

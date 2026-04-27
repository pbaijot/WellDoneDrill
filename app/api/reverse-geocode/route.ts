import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Coordonnées invalides' }, { status: 400 })
  }

  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    zoom: '18',
    addressdetails: '1',
  })

  try {
    const response = await fetch('https://nominatim.openstreetmap.org/reverse?' + params.toString(), {
      headers: {
        'User-Agent': 'WellDoneDrill/1.0',
        'Accept-Language': 'fr-BE,fr;q=0.9,nl-BE;q=0.8,en;q=0.7',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return NextResponse.json({
        label: `Position ajustée (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      label: data.display_name || `Position ajustée (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      raw: data,
    })
  } catch (error: any) {
    return NextResponse.json({
      label: `Position ajustée (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      error: error.message,
    })
  }
}

import {NextResponse} from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    // TODO: wire up to email service (Resend, SendGrid, etc.)
    console.log('[contact]', data)
  } catch {}
  return NextResponse.json({ok: true})
}

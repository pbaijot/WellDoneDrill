import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Locale = 'be-fr' | 'be-nl' | 'fr-fr' | 'lu-fr' | 'lu-de'

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => {
      const [lang, qPart] = part.trim().split(';q=')
      const q = qPart ? Number(qPart) : 1
      return { lang: lang.toLowerCase(), q: Number.isFinite(q) ? q : 0 }
    })
    .filter((item) => item.lang)
    .sort((a, b) => b.q - a.q)
    .map((item) => item.lang)
}

function detectLocale(country: string | null, acceptLanguage: string | null): Locale {
  const langs = acceptLanguage ? parseAcceptLanguage(acceptLanguage) : []

  const prefersDutch = langs.some((lang) => lang === 'nl' || lang.startsWith('nl-'))
  const prefersGerman = langs.some((lang) => lang === 'de' || lang.startsWith('de-'))
  const prefersFrench = langs.some((lang) => lang === 'fr' || lang.startsWith('fr-'))

  switch ((country || '').toUpperCase()) {
    case 'BE':
      return prefersDutch ? 'be-nl' : 'be-fr'
    case 'FR':
      return 'fr-fr'
    case 'LU':
      return prefersGerman ? 'lu-de' : 'lu-fr'
    default:
      if (prefersDutch) return 'be-nl'
      if (prefersGerman) return 'lu-de'
      if (prefersFrench) return 'be-fr'
      return 'be-fr'
  }
}

export default async function RootPage() {
  const h = await headers()

  const country =
    h.get('x-vercel-ip-country') ||
    h.get('cf-ipcountry') ||
    h.get('x-country-code') ||
    null

  const acceptLanguage = h.get('accept-language')
  const locale = detectLocale(country, acceptLanguage)

  redirect(`/${locale}`)
}

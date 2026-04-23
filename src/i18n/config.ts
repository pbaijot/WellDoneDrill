export const locales = ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'be-fr'

export const localeLabels: Record<Locale, string> = {
  'be-fr': 'FR',
  'be-nl': 'NL',
  'fr-fr': 'FR',
  'lu-fr': 'FR',
  'lu-de': 'DE',
}

export const localeCountry: Record<Locale, 'BE' | 'FR' | 'LU'> = {
  'be-fr': 'BE',
  'be-nl': 'BE',
  'fr-fr': 'FR',
  'lu-fr': 'LU',
  'lu-de': 'LU',
}
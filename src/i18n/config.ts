export const locales = ['be-fr', 'be-nl', 'be-en', 'fr-fr', 'fr-en', 'lu-fr', 'lu-de', 'lu-en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'be-fr'

export const localeLabels: Record<Locale, string> = {
  'be-fr': 'FR',
  'be-nl': 'NL',
  'be-en': 'EN',
  'fr-fr': 'FR',
  'fr-en': 'EN',
  'lu-fr': 'FR',
  'lu-de': 'DE',
  'lu-en': 'EN',
}

export const localeCountry: Record<Locale, 'BE' | 'FR' | 'LU'> = {
  'be-fr': 'BE',
  'be-nl': 'BE',
  'be-en': 'BE',
  'fr-fr': 'FR',
  'fr-en': 'FR',
  'lu-fr': 'LU',
  'lu-de': 'LU',
  'lu-en': 'LU',
}

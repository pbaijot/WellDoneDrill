import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from './config'

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale
  const locale = requestedLocale && isLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
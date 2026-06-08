import { Lexend } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from './components/Header'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import '../globals.css'
import type { AppLocale } from '@/src/i18n/routes'

// Map internal locale identifiers to valid BCP 47 language tags.
// Our internal codes use "be-" for Belgium and "lu-" for Luxembourg,
// but "be" is the ISO 639-1 code for Belarusian — wrong for Google.
const BCP47: Record<string, string> = {
  'be-fr': 'fr-BE',
  'be-nl': 'nl-BE',
  'fr-fr': 'fr-FR',
  'lu-fr': 'fr-LU',
  'lu-de': 'de-LU',
}

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  display: 'swap',
})

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const htmlLang = BCP47[locale] ?? locale

  return (
    <html lang={htmlLang} className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <CookieBanner locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
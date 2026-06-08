import { Lexend } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from './components/Header'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import '../globals.css'
import { PHONE_BY_LOCALE, type AppLocale } from '@/src/i18n/routes'
import { BASE_URL } from '@/src/lib/seoAlternates'

// Map internal locale identifiers to valid BCP 47 language tags.
// Our internal codes use "be-" for Belgium and "lu-" for Luxembourg,
// but "be" is the ISO 639-1 code for Belarusian — wrong for Google.
const BCP47: Record<string, string> = {
  'be-fr': 'fr-BE',
  'be-nl': 'nl-BE',
  'be-en': 'en-BE',
  'fr-fr': 'fr-FR',
  'fr-en': 'en-FR',
  'lu-fr': 'fr-LU',
  'lu-de': 'de-LU',
  'lu-en': 'en-LU',
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
  const loc = locale as AppLocale
  const htmlLang = BCP47[locale] ?? locale
  const isEn = locale.endsWith('-en')

  // Organization structured data — strengthens local SEO for
  // "géothermie", "forage géothermique", "géothermie Belgique", etc.
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#organization`,
    name: 'WellDoneDrill',
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/images/wdd_logo_black.svg`,
    image: `${BASE_URL}/images/wdd_logo_black.svg`,
    description: isEn
      ? 'Geothermal drilling expert and heat pump installer in Belgium, France and Luxembourg.'
      : 'Expert en forage géothermique et installation de pompes à chaleur en Belgique, France et Luxembourg.',
    telephone: PHONE_BY_LOCALE[loc] ?? PHONE_BY_LOCALE['be-fr'],
    email: 'info@welldonedrill.energy',
    areaServed: ['BE', 'FR', 'LU'],
    knowsAbout: isEn
      ? [
          'Geothermal energy',
          'Geothermal drilling',
          'Closed-loop geothermal',
          'Open-loop geothermal',
          'Geothermal heat pump',
        ]
      : [
          'Géothermie',
          'Forage géothermique',
          'Géothermie fermée',
          'Géothermie ouverte',
          'Pompe à chaleur géothermique',
        ],
  }

  return (
    <html lang={htmlLang} className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
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
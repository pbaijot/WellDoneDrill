import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "WellDoneDrill — L'énergie de la terre",
  description: 'Expert en forage géothermique en Belgique, France et Luxembourg.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
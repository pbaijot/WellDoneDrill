'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedPath, type AppLocale, type RouteKey } from '@/src/i18n/routes'

type ServiceLink = {
  label: string
  routeKey: RouteKey
}

export default function Footer() {
  const locale = useLocale() as AppLocale
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  const regions = t('regions').split(',')

  const services: ServiceLink[] = [
    { label: nav('pac'), routeKey: 'pac_fonctionnement' },
    { label: nav('geo_fermee'), routeKey: 'geo_fermee' },
    { label: nav('geo_ouverte'), routeKey: 'geo_ouverte' },
    { label: nav('particuliers'), routeKey: 'particuliers_etapes' },
    { label: nav('pro'), routeKey: 'pro_chauffagistes' },
    { label: nav('part_calculateur'), routeKey: 'calculateur' },
    { label: nav('geo_references'), routeKey: 'references' },
    { label: 'Blog', routeKey: 'blog' },
  ]

  return (
    <footer>
      <div className="bg-wdd-black px-8 pt-16 pb-0">
        <div className="max-w-screen-xl mx-auto grid grid-cols-4 gap-10 pb-14 border-b border-white/8">
          <div>
            <Link href={getLocalizedPath(locale, 'home')} className="flex items-center mb-4">
              <div className="relative w-44 h-12">
                <Image
                  src="/images/wdd_logo_white.svg"
                  alt="WellDoneDrill"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <div className="text-xs font-light tracking-widest text-wdd-yellow uppercase mb-3">
              {t('tagline')}
            </div>

            <p className="text-xs font-extralight text-white/40 leading-relaxed mb-5">
              {t('desc')}
            </p>

            <div className="flex gap-2 mb-6">
              {['in', 'f', 'ig'].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 border border-white/15 flex items-center justify-center text-xs font-semibold text-white/40 cursor-pointer hover:border-wdd-yellow hover:text-wdd-yellow transition-colors"
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="text-xs font-light tracking-widest text-white/35 uppercase mb-2">
              {t('nl_label')}
            </div>

            <div className="flex">
              <input
                placeholder={t('nl_ph')}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 outline-none font-extralight"
              />
              <button className="px-4 py-2 bg-wdd-yellow text-wdd-black text-xs font-bold whitespace-nowrap">
                {t('nl_btn')}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('services_title')}
            </div>

            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service.routeKey}>
                  <Link
                    href={getLocalizedPath(locale, service.routeKey)}
                    className="text-xs font-extralight text-white/45 hover:text-wdd-yellow transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('regions_title')}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {regions.map((region) => (
                <div
                  key={region}
                  className="text-xs font-extralight text-white/40 hover:text-wdd-yellow transition-colors cursor-pointer"
                >
                  {region}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white mb-4 pb-3 border-b border-white/8">
              {t('contact_title')}
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-wdd-yellow/10 border border-wdd-yellow/15 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  P
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">{t('address_label')}</div>
                  <div className="text-xs font-extralight text-white/40">{t('address')}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-wdd-yellow/10 border border-wdd-yellow/15 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  T
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">{t('tel_label')}</div>
                  <div className="text-sm font-semibold text-wdd-yellow">{t('tel')}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-wdd-yellow/10 border border-wdd-yellow/15 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  @
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-0.5">{t('email_label')}</div>
                  <div className="text-xs font-extralight text-white/40">{t('email')}</div>
                </div>
              </div>
            </div>

            <Link
              href={getLocalizedPath(locale, 'devis')}
              className="block py-3 bg-wdd-yellow text-wdd-black text-xs font-bold text-center mb-2"
            >
              {t('cta')}
            </Link>

            <a
              href="https://welldonedrill.odoo.com/my/"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 border border-white/10 text-white/35 text-xs text-center hover:text-white hover:border-white/30 transition-colors"
            >
              {t('portal')}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-black px-8">
        <div className="max-w-screen-xl mx-auto h-12 flex items-center justify-between">
          <span className="text-xs font-extralight text-white/20">© {t('copy')}</span>

          <div className="flex gap-6">
            <Link
              href={getLocalizedPath(locale, 'mentions_legales')}
              className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors"
            >
              {t('legal1')}
            </Link>

            <Link
              href={getLocalizedPath(locale, 'politique_confidentialite')}
              className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors"
            >
              {t('legal2')}
            </Link>

            <Link
              href={getLocalizedPath(locale, 'cookies')}
              className="text-xs font-extralight text-white/20 hover:text-white/50 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
'use client'

import Link from 'next/link'
import {getLocalizedPath, type AppLocale, type RouteKey} from '@/src/i18n/routes'
import type {GeoPageData} from '@/src/lib/geoPage'

export default function GeoPage({
  page,
  locale,
}: {
  page: GeoPageData
  locale: AppLocale
}) {
  const ctaRoute: RouteKey = page.routeKey === 'geo_ouverte' ? 'pro_soumission' : 'devis'
  const isOpen = page.routeKey === 'geo_ouverte'

  return (
    <div className="flex flex-col bg-white">
      {/* HERO - même logique que la home */}
      <section className="bg-wdd-yellow min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-16 translate-y-16">
          <svg width="480" height="360" viewBox="0 0 44 32" fill="#1A1A1A">
            <polygon points="0,0 6,0 11,20 16,8 21,20 26,0 32,0 24,32 18,32 16,22 14,32 8,32"/>
            <polygon points="34,0 40,0 44,16 40,32 34,32 38,16"/>
          </svg>
        </div>

        <div className="px-8 md:px-16 py-20 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-7 h-0.5 bg-wdd-black" />
            <span className="text-xs font-light tracking-widest text-wdd-black/50 uppercase">
              {isOpen ? 'Géothermie ouverte' : 'Géothermie fermée'}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-wdd-black leading-none mb-6">
            <span className="block">{page.heroLine1}</span>
            <span className="block">{page.heroLine2}</span>
            <span className="block">{page.heroLine3}</span>
          </h1>

          {page.heroSubtitle && (
            <p className="text-sm md:text-base font-light text-wdd-black/65 leading-relaxed max-w-xl mb-10">
              {page.heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-12">
            {page.heroCtaLabel && (
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="bg-wdd-black text-wdd-yellow px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                {page.heroCtaLabel}
              </Link>
            )}

            <Link
              href={getLocalizedPath(locale, 'references')}
              className="text-sm font-light text-wdd-black/55 border-b border-wdd-black/25 hover:text-wdd-black transition-colors pb-0.5"
            >
              Voir nos réalisations
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-wdd-black/12 max-w-xl">
            <div>
              <div className="text-3xl font-bold text-wdd-black">
                {isOpen ? '100kW+' : 'Maison à grand projet'}
              </div>
              <div className="text-xs font-light text-wdd-black/45 uppercase tracking-wider mt-1">
                {isOpen ? 'Projets adaptés' : 'Champ d’application'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-wdd-black">
                {isOpen ? 'Nappe' : 'Sondes'}
              </div>
              <div className="text-xs font-light text-wdd-black/45 uppercase tracking-wider mt-1">
                Source énergétique
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-wdd-black">
                Chauffage + froid
              </div>
              <div className="text-xs font-light text-wdd-black/45 uppercase tracking-wider mt-1">
                Usage
              </div>
            </div>
          </div>
        </div>

        <div className="bg-wdd-black flex items-center justify-center px-8 md:px-12 py-16 relative z-10 min-h-[50vh] lg:min-h-screen">
          <div className="w-full h-full min-h-[420px] bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xs font-light text-white/30 uppercase tracking-[0.2em] text-center px-8">
              visuel hero géothermie
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
                Notre expertise
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {page.introTitle}
            </h2>

            {page.introBody1 && (
              <p className="text-base font-light text-black/70 leading-8 mb-5 whitespace-pre-line">
                {page.introBody1}
              </p>
            )}

            {page.introBody2 && (
              <p className="text-base font-light text-black/70 leading-8 mb-8 whitespace-pre-line">
                {page.introBody2}
              </p>
            )}

            {page.introCtaLabel && (
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                {page.introCtaLabel}
              </Link>
            )}
          </div>

          <div className="bg-wdd-clay min-h-[420px] flex items-center justify-center">
            <span className="text-xs font-light text-black/25 uppercase tracking-[0.2em] text-center px-6">
              visuel explicatif géothermie
            </span>
          </div>
        </div>
      </section>

      {/* COMMENT CA FONCTIONNE */}
      <section className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              Fonctionnement
            </span>
          </div>

          <h2 className="text-4xl font-bold mb-5 leading-tight">
            {page.howTitle}
          </h2>

          {page.howIntro && (
            <p className="text-base font-light text-black/70 leading-8 max-w-4xl mb-12 whitespace-pre-line">
              {page.howIntro}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-0.5">
            {(page.howSteps || []).map((step, index) => (
              <div
                key={step._key || step.title}
                className="bg-white p-8 relative overflow-hidden group hover:bg-wdd-black transition-colors duration-200"
              >
                <span className="absolute top-3 right-4 text-5xl font-bold text-black/5 group-hover:text-white/5 transition-colors">
                  0{index + 1}
                </span>
                <div className="w-10 h-10 flex items-center justify-center text-xs font-bold mb-5 bg-wdd-yellow text-wdd-black">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm font-light text-black/60 leading-7 whitespace-pre-line group-hover:text-white/45 transition-colors">
                  {step.body}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            ))}
          </div>

          {page.howCtaLabel && (
            <div className="mt-10">
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                {page.howCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ETAPES PROJET */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">
              Parcours projet
            </span>
          </div>

          <h2 className="text-4xl font-bold mb-12 leading-tight">
            {page.projectTitle}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-0.5">
            {(page.projectSteps || []).map((step, index) => (
              <div key={step._key || step.title} className="bg-wdd-clay p-7 hover:bg-wdd-yellow transition-colors">
                <div className="text-xs font-light tracking-widest uppercase text-wdd-ground mb-4">
                  Étape {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm font-light text-black/65 leading-7 whitespace-pre-line">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {page.projectCtaLabel && (
            <div className="mt-10">
              <Link
                href={getLocalizedPath(locale, ctaRoute)}
                className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
              >
                {page.projectCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* BLOC PEDAGO + FAQ */}
      <section className="bg-wdd-black text-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase">
                Ressource naturelle
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {page.faqIntroTitle}
            </h2>

            {page.faqIntroBody && (
              <p className="text-base font-light text-white/70 leading-8 whitespace-pre-line">
                {page.faqIntroBody}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">{page.faqTitle}</h3>

            <div className="grid gap-0.5">
              {(page.faqs || []).map((faq) => (
                <div
                  key={faq._key || faq.question}
                  className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
                >
                  <h4 className="text-lg font-bold mb-3">{faq.question}</h4>
                  <p className="text-sm font-light text-white/70 leading-7 whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-wdd-yellow py-20 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="text-xs font-light tracking-widest text-wdd-black/40 uppercase mb-4">
            Parlons de votre projet
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-wdd-black mb-8 leading-tight">
            {page.finalCtaTitle}
          </h2>

          {page.finalCtaLabel && (
            <Link
              href={getLocalizedPath(locale, ctaRoute)}
              className="inline-block bg-wdd-black text-wdd-yellow px-8 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
            >
              {page.finalCtaLabel}
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

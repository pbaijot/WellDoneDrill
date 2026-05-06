'use client'

import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {PacPageData, PacItem, PacFaq} from '@/src/lib/pacPage'

const ANCHORS = [
  {id: 'fonctionnement', label: 'Fonctionnement'},
  {id: 'chauffage', label: 'Chauffage'},
  {id: 'climatisation', label: 'Climatisation'},
  {id: 'avantages', label: 'Avantages'},
]

function StepGrid({items}: {items: PacItem[]}) {
  return (
    <div className="grid md:grid-cols-3 gap-0.5">
      {items.map((item, i) => (
        <div
          key={item._key || i}
          className="bg-wdd-clay p-8 relative overflow-hidden group hover:bg-wdd-black transition-colors duration-200"
        >
          <span className="absolute top-3 right-4 text-5xl font-bold text-black/5 group-hover:text-white/5 transition-colors">
            0{i + 1}
          </span>
          <div className="w-10 h-10 flex items-center justify-center text-xs font-bold mb-5 bg-wdd-yellow text-wdd-black">
            {i + 1}
          </div>
          <h3 className="text-lg font-bold mb-3 group-hover:text-white transition-colors">{item.title}</h3>
          <p className="text-sm font-light text-black/60 leading-7 whitespace-pre-line group-hover:text-white/45 transition-colors">
            {item.body}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      ))}
    </div>
  )
}

function ItemList({items, dark}: {items: PacItem[]; dark?: boolean}) {
  return (
    <ul className="grid gap-0.5">
      {items.map((item, i) => (
        <li
          key={item._key || i}
          className={`p-5 border-l-2 border-wdd-yellow ${dark ? 'bg-white/5' : 'bg-white'}`}
        >
          <div className={`text-sm font-bold mb-1 ${dark ? 'text-white' : ''}`}>{item.title}</div>
          <div className={`text-sm font-light leading-6 ${dark ? 'text-white/65' : 'text-black/65'}`}>{item.body}</div>
        </li>
      ))}
    </ul>
  )
}

function FaqList({faqs}: {faqs: PacFaq[]}) {
  return (
    <div className="grid gap-0.5">
      {faqs.map((faq, i) => (
        <div key={faq._key || i} className="bg-white p-6 hover:bg-wdd-yellow/20 transition-colors">
          <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
          <p className="text-sm font-light text-black/70 leading-7 whitespace-pre-line">{faq.answer}</p>
        </div>
      ))}
    </div>
  )
}

export default function PacPage({page, locale}: {page: PacPageData; locale: AppLocale}) {
  return (
    <div className="flex flex-col bg-white">

      {/* HERO */}
      <section className="bg-wdd-clay min-h-[85vh] flex flex-col justify-end px-8 md:px-16 pt-32">
        <div className="max-w-screen-xl mx-auto w-full pb-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-0.5 bg-wdd-black" />
            <span className="text-xs font-light tracking-widest text-wdd-black/50 uppercase">Technologie</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-wdd-black leading-none mb-6 max-w-4xl">
            {page.heroTitle || 'La pompe à chaleur géothermique'}
          </h1>
          {page.heroSubtitle && (
            <p className="text-base font-light text-wdd-black/65 leading-relaxed max-w-2xl mb-10">
              {page.heroSubtitle}
            </p>
          )}
          <Link
            href={getLocalizedPath(locale, 'devis')}
            className="inline-block bg-wdd-black text-wdd-yellow px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors mb-16"
          >
            {page.heroCtaLabel || 'Demander un devis'}
          </Link>

          {/* Anchor nav */}
          <div className="flex border-t border-wdd-black/15">
            {ANCHORS.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="flex-1 py-4 text-xs font-bold tracking-widest uppercase text-wdd-black/50 hover:text-wdd-black text-center border-r border-wdd-black/10 last:border-r-0 hover:bg-wdd-black/5 transition-colors"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FONCTIONNEMENT */}
      <section id="fonctionnement" className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Fonctionnement</span>
          </div>
          <h2 className="text-4xl font-bold mb-5 leading-tight max-w-3xl">{page.fonctTitle}</h2>
          {page.fonctIntro && (
            <p className="text-base font-light text-black/70 leading-8 max-w-4xl mb-12 whitespace-pre-line">
              {page.fonctIntro}
            </p>
          )}
          {page.fonctSteps && page.fonctSteps.length > 0 && <StepGrid items={page.fonctSteps} />}
        </div>
      </section>

      {/* CHAUFFAGE */}
      <section id="chauffage" className="bg-wdd-clay py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Chauffage</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">{page.chauffageTitle}</h2>
            {page.chauffageIntro && (
              <p className="text-base font-light text-black/70 leading-8 mb-8 whitespace-pre-line">{page.chauffageIntro}</p>
            )}
            {page.chauffageItems && page.chauffageItems.length > 0 && (
              <ItemList items={page.chauffageItems} />
            )}
          </div>
          <div className="bg-wdd-black min-h-[360px] flex items-center justify-center">
            <span className="text-xs font-light text-white/20 uppercase tracking-[0.2em] text-center px-6">
              visuel chauffage géothermique
            </span>
          </div>
        </div>
      </section>

      {/* CLIMATISATION */}
      <section id="climatisation" className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-wdd-clay min-h-[360px] flex items-center justify-center order-2 lg:order-1">
            <span className="text-xs font-light text-black/25 uppercase tracking-[0.2em] text-center px-6">
              visuel climatisation géothermique
            </span>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Climatisation</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">{page.climaTitle}</h2>
            {page.climaIntro && (
              <p className="text-base font-light text-black/70 leading-8 mb-8 whitespace-pre-line">{page.climaIntro}</p>
            )}
            {page.climaItems && page.climaItems.length > 0 && (
              <ItemList items={page.climaItems} />
            )}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section id="avantages" className="bg-wdd-black text-white py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase">Avantages</span>
          </div>
          <h2 className="text-4xl font-bold mb-5 leading-tight">{page.avantagesTitle}</h2>
          {page.avantagesIntro && (
            <p className="text-base font-light text-white/70 leading-8 max-w-4xl mb-12 whitespace-pre-line">
              {page.avantagesIntro}
            </p>
          )}
          {page.avantagesItems && page.avantagesItems.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-0.5">
              {page.avantagesItems.map((item, i) => (
                <div
                  key={item._key || i}
                  className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-wdd-yellow mb-5 flex items-center justify-center">
                    <span className="text-xs font-bold text-wdd-black">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm font-light text-white/65 leading-7 whitespace-pre-line">{item.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-wdd-clay py-24 px-8 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            {page.faqTitle && <h2 className="text-3xl font-bold mb-8">{page.faqTitle}</h2>}
            <FaqList faqs={page.faqs} />
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-wdd-yellow py-20 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="text-xs font-light tracking-widest text-wdd-black/40 uppercase mb-4">
            Votre projet géothermique
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-wdd-black mb-8 leading-tight">
            {page.ctaTitle || 'Prêt à passer à la géothermie ?'}
          </h2>
          <Link
            href={getLocalizedPath(locale, 'devis')}
            className="inline-block bg-wdd-black text-wdd-yellow px-8 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors"
          >
            {page.ctaLabel || 'Demander un devis gratuit'}
          </Link>
        </div>
      </section>

    </div>
  )
}

'use client'

import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {ProPageData, ProItem, ProFaq} from '@/src/lib/proPage'

function ValueGrid({items}: {items: ProItem[]}) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-0.5">
      {items.map((item, i) => (
        <div
          key={item._key || i}
          className="bg-wdd-clay p-8 relative group hover:bg-wdd-black transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-wdd-yellow mb-5 flex items-center justify-center">
            <span className="text-xs font-bold text-wdd-black">{String(i + 1).padStart(2, '0')}</span>
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

function StepGrid({items}: {items: ProItem[]}) {
  return (
    <div className="grid md:grid-cols-3 gap-0.5">
      {items.map((item, i) => (
        <div
          key={item._key || i}
          className="bg-white p-8 relative overflow-hidden group hover:bg-wdd-black transition-colors duration-200"
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

function OfferGrid({items}: {items: ProItem[]}) {
  return (
    <div className="grid md:grid-cols-2 gap-0.5">
      {items.map((item, i) => (
        <div
          key={item._key || i}
          className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors"
        >
          <h3 className="text-lg font-bold mb-3">{item.title}</h3>
          <p className="text-sm font-light text-white/65 leading-7 whitespace-pre-line">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

function FaqSection({faqs, faqTitle}: {faqs: ProFaq[]; faqTitle?: string}) {
  return (
    <section className="bg-white py-24 px-8 md:px-16">
      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-3 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">{faqTitle || 'Questions fréquentes'}</h2>
        </div>
        <div className="lg:col-span-2 grid gap-0.5">
          {faqs.map((faq, i) => (
            <div key={faq._key || i} className="border border-black/10 p-6 hover:bg-wdd-clay transition-colors">
              <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
              <p className="text-sm font-light text-black/70 leading-7 whitespace-pre-line">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProPage({page, locale}: {page: ProPageData; locale: AppLocale}) {
  return (
    <div className="flex flex-col bg-white">

      {/* HERO */}
      <section className="bg-wdd-black text-white min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
        <div className="px-8 md:px-16 py-20 flex flex-col justify-center relative z-10 pt-32">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-7 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-yellow/50 uppercase">
              {page.heroEyebrow || 'Professionnels'}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-none mb-6">
            {page.heroTitle}
          </h1>

          {page.heroSubtitle && (
            <p className="text-sm md:text-base font-light text-white/65 leading-relaxed max-w-xl mb-10">
              {page.heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#soumission"
              className="bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors"
            >
              {page.heroCtaLabel || 'Soumettre un projet'}
            </a>
          </div>
        </div>

        <div className="bg-wdd-clay flex items-center justify-center px-8 md:px-12 py-16 relative z-10 min-h-[50vh] lg:min-h-screen">
          <div className="w-full h-full min-h-[420px] bg-wdd-black/20 border border-wdd-black/30 flex items-center justify-center">
            <span className="text-xs font-light text-wdd-black/30 uppercase tracking-[0.2em] text-center px-8">
              visuel chantier professionnel
            </span>
          </div>
        </div>
      </section>

      {/* VALEUR AJOUTÉE */}
      {(page.valueTitle || (page.valueItems && page.valueItems.length > 0)) && (
        <section className="bg-white py-24 px-8 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Ce qu'on vous apporte</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <h2 className="text-4xl font-bold leading-tight">{page.valueTitle}</h2>
              {page.valueIntro && (
                <p className="text-base font-light text-black/70 leading-8 self-end whitespace-pre-line">
                  {page.valueIntro}
                </p>
              )}
            </div>
            {page.valueItems && page.valueItems.length > 0 && <ValueGrid items={page.valueItems} />}
          </div>
        </section>
      )}

      {/* COMMENT ÇA MARCHE */}
      {(page.partnershipTitle || (page.partnershipSteps && page.partnershipSteps.length > 0)) && (
        <section className="bg-wdd-clay py-24 px-8 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Comment ça marche</span>
            </div>
            <h2 className="text-4xl font-bold mb-5 leading-tight">{page.partnershipTitle}</h2>
            {page.partnershipIntro && (
              <p className="text-base font-light text-black/70 leading-8 max-w-4xl mb-12 whitespace-pre-line">
                {page.partnershipIntro}
              </p>
            )}
            {page.partnershipSteps && page.partnershipSteps.length > 0 && (
              <StepGrid items={page.partnershipSteps} />
            )}
          </div>
        </section>
      )}

      {/* OFFRE TECHNIQUE */}
      {(page.offerTitle || (page.offerItems && page.offerItems.length > 0)) && (
        <section className="bg-wdd-black text-white py-24 px-8 md:px-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-0.5 bg-wdd-yellow" />
              <span className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase">Notre offre</span>
            </div>
            <h2 className="text-4xl font-bold mb-5 leading-tight">{page.offerTitle}</h2>
            {page.offerIntro && (
              <p className="text-base font-light text-white/70 leading-8 max-w-4xl mb-12 whitespace-pre-line">
                {page.offerIntro}
              </p>
            )}
            {page.offerItems && page.offerItems.length > 0 && <OfferGrid items={page.offerItems} />}
          </div>
        </section>
      )}

      {/* SOUMISSION INTÉGRÉE */}
      <section id="soumission" className="bg-wdd-yellow py-24 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-0.5 bg-wdd-black" />
              <span className="text-xs font-light tracking-widest text-wdd-black/50 uppercase">Travaillons ensemble</span>
            </div>
            <h2 className="text-4xl font-bold text-wdd-black mb-5 leading-tight">
              {page.submissionTitle || 'Soumettez votre projet'}
            </h2>
            {page.submissionIntro && (
              <p className="text-base font-light text-wdd-black/70 leading-8 whitespace-pre-line">
                {page.submissionIntro}
              </p>
            )}
          </div>
          <div className="bg-wdd-black p-8">
            <div className="text-xs font-light tracking-widest uppercase text-white/40 mb-6">
              Formulaire de soumission
            </div>
            <div className="bg-white/5 border border-white/10 p-8 text-center min-h-[200px] flex flex-col items-center justify-center gap-4">
              <p className="text-sm font-light text-white/50">
                Le formulaire de soumission sera intégré ici.
              </p>
              <Link
                href={getLocalizedPath(locale, 'devis')}
                className="inline-block bg-wdd-yellow text-wdd-black px-6 py-3 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors"
              >
                {page.submissionCtaLabel || 'Envoyer ma demande'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <FaqSection faqs={page.faqs} faqTitle={page.faqTitle} />
      )}

    </div>
  )
}

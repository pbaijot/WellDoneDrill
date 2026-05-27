'use client'

import {useState} from 'react'
import Link from 'next/link'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'

const DEFAULT_FAQS = [
  {
    question: "Combien coûte une installation géothermique au total ?",
    answer: "Le budget complet — forage + pompe à chaleur + installation — se situe entre 20 000 et 30 000 €. Après primes régionales (jusqu'à 12 000 €), le reste à charge descend souvent sous les 18 000 €. Retour sur investissement en 8 à 12 ans sur une installation qui dure 50 ans.",
  },
  {
    question: "Mon terrain est-il compatible avec la géothermie ?",
    answer: "Plus de 90 % des propriétés en Belgique sont géologiquement compatibles. WellDoneDrill réalise une étude préalable gratuite pour confirmer la faisabilité sur votre parcelle, avant tout engagement de votre part.",
  },
  {
    question: "Quels travaux sont réalisés chez moi et combien de temps cela prend-il ?",
    answer: "Le forage occupe 1 à 3 jours sur votre terrain. Impact minimal sur votre jardin, remis en état à la fin. L'installation complète (forage + PAC) prend généralement 1 à 2 semaines.",
  },
  {
    question: "La géothermie fonctionne-t-elle aussi comme climatisation ?",
    answer: "Oui. La géothermie fermée permet une climatisation passive (free-cooling) très efficace en été, avec une consommation électrique marginale — sans émettre de chaleur à l'extérieur.",
  },
  {
    question: "Faut-il un permis pour forer ?",
    answer: "Dans la plupart des régions, un permis de forage est requis. WellDoneDrill gère intégralement les démarches administratives pour vous — déclarations, dossiers techniques, liaisons avec les organismes compétents.",
  },
]

type FaqsData = {
  title?: string
  items?: {question?: string; answer?: string}[]
}

function FaqItem({q, a}: {q: string; a: string}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span className="text-base font-bold text-wdd-black leading-snug group-hover:text-wdd-mud transition-colors">{q}</span>
        <span className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5 ${open ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45' : 'border-black/20 text-black/40'}`}>
          +
        </span>
      </button>
      {open && (
        <p className="text-sm font-light text-black/60 leading-7 pb-6 pr-12">{a}</p>
      )}
    </div>
  )
}

export default function HomeFaqSection({locale, faqs}: {locale: AppLocale; faqs?: FaqsData | null}) {
  const title = faqs?.title ?? 'Vos questions,\nnos réponses.'
  const items = faqs?.items && faqs.items.length > 0
    ? faqs.items.map(i => ({question: i.question ?? '', answer: i.answer ?? ''}))
    : DEFAULT_FAQS

  return (
    <section className="bg-white min-h-[80vh] flex flex-col justify-center pt-20 pb-0 px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-wdd-black mb-4 leading-tight whitespace-pre-line">{title}</h2>
            <p className="text-sm font-light text-black/50 leading-7">
              Une question ne figure pas ici ? Contactez directement notre équipe.
            </p>
          </div>
          <Link
            href={getLocalizedPath(locale, 'demarrer')}
            className="inline-block bg-wdd-black text-wdd-yellow px-5 py-2.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors self-start lg:self-end shrink-0 rounded-sm"
          >
            Démarrer mon projet
          </Link>
        </div>
        <div>
          {items.map((f, i) => (
            <FaqItem key={i} q={f.question} a={f.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

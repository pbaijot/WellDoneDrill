'use client'
import type { Answers, AddressResult } from './types'

export default function ResultPrecis({ answers, address, profile, devisUrl, soumissionUrl }: {
  answers: Answers
  address: AddressResult | null
  profile: string | null
  devisUrl: string
  soumissionUrl: string
}) {
  const isPro = profile === 'pro'
  const ctaUrl = isPro ? soumissionUrl : devisUrl
  const ctaLabel = isPro ? 'Acceder a l espace soumission +' : 'Obtenir mon devis precis +'

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5 bg-wdd-yellow" />
        <span className="text-xs font-light tracking-widest text-wdd-yellow/60 uppercase">Resultat</span>
      </div>

      {address && <div className="text-xs text-white/25 mb-4 truncate">{address.label}</div>}

      <div className="border-t-2 border-wdd-yellow bg-white/5 p-5 mb-4">
        <div className="text-sm font-bold text-wdd-yellow mb-2">
          {isPro ? 'Nous pouvons intervenir sur votre projet.' : 'Votre projet est realisable.'}
        </div>
        <div className="text-xs font-light text-white/50 leading-relaxed mb-5">
          {isPro
            ? 'Sur base de votre dossier, nos ingenieurs preparent une etude de faisabilite et une offre detaillee. Delai de retour : 48h ouvrables.'
            : 'Sur base de vos reponses et de l analyse du sous-sol, nos ingenieurs preparent un devis detaille adapte a votre configuration. Retour sous 48h ouvrables.'}
        </div>
        <div className="flex flex-col gap-2 mb-5">
          {Object.entries(answers).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-1.5 h-1.5 bg-wdd-yellow/40 flex-shrink-0" />
              <span className="capitalize">{v.replace(/-/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <a href={ctaUrl} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center mb-1">
        {ctaLabel}
      </a>
      <a href="tel:+32494142449" className="block w-full py-2.5 border border-white/10 text-white/40 text-xs text-center">
        Parler a un expert : +32 494 14 24 49
      </a>
    </div>
  )
}

'use client'
import type { Answers, AddressResult } from './types'

const LEAD_CONFIG = {
  geothermie: {
    badge: 'Projet geothermique prioritaire',
    title: 'Votre projet est un excellent candidat pour la geothermie.',
    text: 'Sur base de votre superficie, votre budget et votre calendrier, la geothermie est la solution la plus adaptee a votre situation. Nos ingenieurs preparent une analyse detaillee.',
    cta: 'Obtenir mon devis geothermique',
    color: '#FFD94F',
  },
  pac_air_eau: {
    badge: 'Solution PAC air/eau envisageable',
    title: 'Une pompe a chaleur air/eau pourrait convenir a votre projet.',
    text: 'Selon votre budget et la configuration de votre bien, une PAC air/eau est une option pertinente. Nous pouvons vous orienter vers les solutions les plus adaptees.',
    cta: 'Recevoir une recommandation',
    color: '#60a5fa',
  },
  conseiller: {
    badge: 'Analyse personnalisee recommandee',
    title: 'Votre projet merite un conseil personnalise.',
    text: 'Votre situation presente plusieurs options. Un de nos ingenieurs vous contacte pour affiner le dimensionnement et vous orienter vers la meilleure solution.',
    cta: 'Parler a un expert',
    color: '#a78bfa',
  },
  peu_mature: {
    badge: 'Premiere orientation',
    title: 'Vous etes au debut de votre reflexion.',
    text: 'Pas de souci — nous vous envoyons un guide comparatif des solutions de chauffage avec les ordres de grandeur de couts et d economies. Cela vous aidera a affiner votre projet.',
    cta: 'Recevoir le guide comparatif',
    color: '#94a3b8',
  },
}

export default function LeadResult({ answers, address, lead, devisUrl, soumissionUrl }: {
  answers: Answers
  address: AddressResult | null
  lead: string
  devisUrl: string
  soumissionUrl: string
}) {
  const config = LEAD_CONFIG[lead as keyof typeof LEAD_CONFIG] || LEAD_CONFIG.conseiller

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5" style={{ background: config.color }} />
        <span className="text-xs font-light tracking-widest uppercase" style={{ color: config.color + 'aa' }}>
          {config.badge}
        </span>
      </div>

      {contact.prenom && (
        <div className="text-xs text-white/30 mb-2">
          Bonjour {contact.prenom}, voici votre analyse.
        </div>
      )}

      {address && (
        <div className="text-xs text-white/25 mb-4 truncate">{address.label}</div>
      )}

      <div className="p-5 mb-4" style={{ borderTop: '2px solid ' + config.color, background: 'rgba(255,255,255,0.03)' }}>
        <div className="text-sm font-bold text-white mb-2">{config.title}</div>
        <div className="text-xs font-light text-white/50 leading-relaxed mb-4">{config.text}</div>

        {lead === 'geothermie' && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {answers['a_surface'] || answers['b_surface'] ? (
              <div className="bg-black/20 p-3">
                <div className="text-xs text-white/30 mb-1">Surface</div>
                <div className="text-base font-bold text-white">{answers['a_surface'] || answers['b_surface']} m2</div>
              </div>
            ) : null}
            <div className="bg-black/20 p-3">
              <div className="text-xs text-white/30 mb-1">Delai de retour</div>
              <div className="text-base font-bold text-white">48h ouvrables</div>
            </div>
          </div>
        )}
      </div>

      <a href={lead === 'geothermie' ? devisUrl : soumissionUrl} className="block w-full py-3 text-wdd-black text-sm font-bold text-center mb-1" style={{ background: config.color }}>
        {config.cta} +
      </a>
      <a href="tel:+32494142449" className="block w-full py-2.5 border border-white/10 text-white/40 text-xs text-center">
        Parler a un expert : +32 494 14 24 49
      </a>
    </div>
  )
}

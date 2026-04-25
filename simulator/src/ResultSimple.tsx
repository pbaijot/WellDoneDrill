'use client'
import type { Answers } from './types'

const WATT_BY_TYPE: Record<string, [number, number]> = {
  '4f': [45, 65],
  '3f': [40, 60],
  'mito': [35, 55],
  'appart': [30, 50],
}

const SURFACE_MID: Record<string, number> = {
  '<100': 75,
  '100-200': 150,
  '200-350': 275,
  '>350': 400,
}

function calcul(answers: Answers) {
  const type = answers['p_type_bien'] || '4f'
  const surface = answers['p_superficie'] || '100-200'
  const range = WATT_BY_TYPE[type] || [40, 60]
  const wMin = range[0]
  const wMax = range[1]
  const s = SURFACE_MID[surface] || 150
  const kWMin = Math.round((s * wMin) / 1000)
  const kWMax = Math.round((s * wMax) / 1000)
  const sondesMin = Math.max(1, Math.round(kWMin / 6))
  const sondesMax = Math.max(1, Math.round(kWMax / 5))
  const prixMin = sondesMin * 8000
  const prixMax = sondesMax * 12000
  return { kWMin, kWMax, sondesMin, sondesMax, prixMin, prixMax }
}

export default function ResultSimple({ answers, devisUrl, onPrecis }: {
  answers: Answers
  devisUrl: string
  onPrecis: () => void
}) {
  const { kWMin, kWMax, sondesMin, sondesMax, prixMin, prixMax } = calcul(answers)

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5 bg-wdd-yellow" />
        <span className="text-xs font-light tracking-widest text-wdd-yellow/60 uppercase">Estimation</span>
      </div>

      <div className="border-t-2 border-wdd-yellow bg-white/5 p-5 mb-4">
        <div className="text-xs font-semibold text-wdd-yellow mb-4">
          Votre projet est techniquement realisable.
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 p-3">
            <div className="text-xs text-white/30 mb-1">Puissance PAC estimee</div>
            <div className="text-lg font-bold text-white">{kWMin} - {kWMax} kW</div>
          </div>
          <div className="bg-black/20 p-3">
            <div className="text-xs text-white/30 mb-1">Nombre de sondes</div>
            <div className="text-lg font-bold text-white">{sondesMin} - {sondesMax} x 100 m</div>
          </div>
        </div>
        <div className="bg-black/20 p-3 mb-4">
          <div className="text-xs text-white/30 mb-1">Fourchette de prix forage seul HTVA</div>
          <div className="text-xl font-bold text-white">
            {prixMin.toLocaleString('fr-BE')} - {prixMax.toLocaleString('fr-BE')} EUR
          </div>
          <div className="text-xs text-white/25 mt-1">Hors pompe a chaleur et installation</div>
        </div>
        <div className="text-xs font-light text-white/35 leading-relaxed">
          Estimation indicative basee sur votre superficie et le type de bien.
          Un dimensionnement precis peut reduire significativement cette fourchette.
        </div>
      </div>

      <button onClick={onPrecis} className="block w-full py-3 border border-wdd-yellow text-wdd-yellow text-sm font-semibold text-center hover:bg-wdd-yellow/10 transition-colors mb-1">
        Affiner mon estimation — 5 min
      </button>
      <a href={devisUrl} className="block w-full py-3 bg-wdd-yellow text-wdd-black text-sm font-bold text-center mb-1">
        Demander un devis precis +
      </a>
      <a href="tel:+32494142449" className="block w-full py-2.5 border border-white/10 text-white/40 text-xs text-center">
        Parler a un expert : +32 494 14 24 49
      </a>
    </div>
  )
}

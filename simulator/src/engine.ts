
import type { Answers, LeadType } from './types'

const W_PAR_M2: Record<string, [number, number]> = {
  maison_A: [20, 30], maison_B: [30, 40], maison_std: [40, 55],
  maison_inconnu: [45, 60], maison_default: [45, 65],
  appart_A: [18, 25], appart_B: [25, 35], appart_std: [35, 50],
  appart_default: [35, 50], immeuble_default: [30, 45], collectif_default: [30, 45],
}

const W_PAR_ANNEE: Record<string, number> = {
  '<1950': 80, '1950-70': 70, '1970-90': 60, '1990-2010': 45, '>2010': 35, inconnu: 55,
}

export function getSurface(a: Answers): number {
  return (parseFloat(String(a['a_surface'] || a['b_surface'] || a['c_surface_actuelle'] || '0'))
        + parseFloat(String(a['c_surface_extension'] || '0'))) || 0
}

export function calcPuissance(a: Answers): [number, number] {
  const surface = getSurface(a)
  if (!surface) return [8, 15]
  const type = String(a['a_type_logement'] || a['b_type_logement'] || 'maison')
  const peb = String(a['a_peb'] || '')
  const annee = String(a['b_annee'] || '')
  const chaudiere = parseFloat(String(a['b_puissance'] || '0'))
  if (chaudiere > 0) {
    const p = chaudiere * 0.75
    return [Math.round(p * 0.85), Math.round(p * 1.05)]
  }
  const key = (peb && ['A','B','std','inconnu'].includes(peb)) ? type + '_' + peb : type + '_default'
  const range = W_PAR_M2[key] || W_PAR_M2['maison_default']
  if (annee && W_PAR_ANNEE[annee]) {
    const w = W_PAR_ANNEE[annee]
    return [Math.max(3, Math.round(surface * w * 0.85 / 1000)), Math.max(5, Math.round(surface * w * 1.15 / 1000))]
  }
  return [Math.max(3, Math.round(surface * range[0] / 1000)), Math.max(5, Math.round(surface * range[1] / 1000))]
}

export function calcSondes(kWMin: number, kWMax: number): [number, number] {
  return [Math.max(1, Math.round(kWMin / 6.5)), Math.max(1, Math.round(kWMax / 5.5))]
}

export function calcPrix(sondesMin: number, sondesMax: number): [number, number] {
  return [sondesMin * 8000, sondesMax * 12000]
}

export function calcCOP(a: Answers): string {
  const e = String(a['a_emetteurs'] || a['b_emetteurs'] || '')
  if (e === 'sol') return '4.5 a 5.5'
  if (e === 'rbt') return '4.0 a 5.0'
  if (['radiateurs','ventilos'].includes(e)) return '3.5 a 4.5'
  return '4.0 a 5.0'
}

export function hasCooling(a: Answers): boolean {
  const objectifs = String(a['objectifs'] || '')
  const emetteurs = String(a['a_emetteurs'] || a['b_emetteurs'] || '')
  return objectifs.includes('froid') || emetteurs === 'sol' || emetteurs === 'ventilos'
}

export function qualifyLead(answers: Answers): LeadType {
  const surface = getSurface(answers)
  const budget = String(answers['budget'] || '')
  const timing = String(answers['b_timing'] || answers['a_timing'] || '')
  const maturite = String(answers['maturite'] || '')
  const budgetOk = ['20-35k','35-50k','>50k'].includes(budget)
  const timingOk = ['asap','<3m','<6m','<1an','permis','6-12m'].includes(timing)
  if (surface >= 120 && budgetOk && timingOk) return 'geothermie'
  if (['10-20k','<10k'].includes(budget)) return 'pac_air_eau'
  if (maturite === 'reflexion' || budget === 'inconnu') return 'peu_mature'
  return 'conseiller'
}

export type DimensioningResult = {
  surface: number
  kWMin: number
  kWMax: number
  sondesMin: number
  sondesMax: number
  prixMin: number
  prixMax: number
  cop: string
  cooling: boolean
}

export function getDimensioning(a: Answers): DimensioningResult {
  const surface = getSurface(a)
  const [kWMin, kWMax] = calcPuissance(a)
  const [sondesMin, sondesMax] = calcSondes(kWMin, kWMax)
  const [prixMin, prixMax] = calcPrix(sondesMin, sondesMax)
  const cop = calcCOP(a)
  const cooling = hasCooling(a)
  return { surface, kWMin, kWMax, sondesMin, sondesMax, prixMin, prixMax, cop, cooling }
}

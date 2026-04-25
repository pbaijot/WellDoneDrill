'use client'
import type { Answers, AddressResult } from './types'

// ─── MOTEUR DE DIMENSIONNEMENT ────────────────────────────────────────────────

const W_PAR_M2: Record<string, [number, number]> = {
  maison_A:    [20, 30],
  maison_B:    [30, 40],
  maison_std:  [40, 55],
  maison_inconnu: [45, 60],
  maison_default: [45, 65],
  appart_A:    [18, 25],
  appart_B:    [25, 35],
  appart_std:  [35, 50],
  appart_default: [35, 50],
  immeuble_default: [30, 45],
  collectif_default: [30, 45],
}

const W_PAR_ANNEE: Record<string, number> = {
  '<1950': 80, '1950-70': 70, '1970-90': 60, '1990-2010': 45, '>2010': 35, 'inconnu': 55,
}

function getSurface(answers: Answers): number {
  const s = answers['a_surface'] || answers['b_surface'] || answers['c_surface_actuelle'] || ''
  const ext = answers['c_surface_extension'] || '0'
  return parseFloat(String(s)) + parseFloat(String(ext)) || 0
}

function getTypeLogement(answers: Answers): string {
  return String(answers['a_type_logement'] || answers['b_type_logement'] || 'maison')
}

function calcPuissance(answers: Answers): [number, number] {
  const surface = getSurface(answers)
  if (!surface) return [8, 15]

  const type = getTypeLogement(answers)
  const peb = String(answers['a_peb'] || '')
  const annee = String(answers['b_annee'] || '')
  const chaudierePuissance = parseFloat(String(answers['b_puissance'] || '0'))

  // Si on a la puissance de la chaudière, on part de là (surdimensionnée de ~25%)
  if (chaudierePuissance > 0) {
    const pac = chaudierePuissance * 0.75
    return [Math.round(pac * 0.85), Math.round(pac * 1.05)]
  }

  // Sinon on calcule par surface
  let key = type + '_default'
  if (peb && ['A', 'B', 'std', 'inconnu'].includes(peb)) key = type + '_' + peb

  let range = W_PAR_M2[key] || W_PAR_M2['maison_default']

  // Correction selon année construction
  if (annee && W_PAR_ANNEE[annee]) {
    const wAnnee = W_PAR_ANNEE[annee]
    range = [Math.round(surface * wAnnee * 0.85 / 1000), Math.round(surface * wAnnee * 1.15 / 1000)]
    return [Math.max(3, range[0]), Math.max(5, range[1])]
  }

  return [
    Math.max(3, Math.round(surface * range[0] / 1000)),
    Math.max(5, Math.round(surface * range[1] / 1000)),
  ]
}

function calcSondes(kWMin: number, kWMax: number): [number, number] {
  // 1 sonde 100m = ~6 kW extraction
  return [Math.max(1, Math.round(kWMin / 6.5)), Math.max(1, Math.round(kWMax / 5.5))]
}

function calcPrix(sondesMin: number, sondesMax: number): [number, number] {
  // Prix forage seul : ~8 000 à 12 000 EUR / sonde de 100m
  return [sondesMin * 8000, sondesMax * 12000]
}

function calcCOP(answers: Answers): string {
  const emetteurs = String(answers['a_emetteurs'] || answers['b_emetteurs'] || '')
  if (emetteurs === 'sol') return '4.5 à 5.5'
  if (emetteurs === 'rbt') return '4.0 à 5.0'
  if (['radiateurs', 'ventilos'].includes(emetteurs)) return '3.5 à 4.5'
  return '4.0 à 5.0'
}

function getEmetteurNote(answers: Answers): string | null {
  const emetteurs = String(answers['a_emetteurs'] || answers['b_emetteurs'] || '')
  const temp = String(answers['b_temp'] || '')
  if (emetteurs === 'radiateurs' && ['>60', '50-60'].includes(temp)) {
    return 'Vos radiateurs fonctionnent a haute temperature. Un remplacement partiel par des radiateurs basse temperature ou du chauffage sol pourrait ameliorer le rendement de la PAC.'
  }
  if (emetteurs === 'sol') return null
  return null
}

// ─── COMPOSANT ────────────────────────────────────────────────────────────────

const LEAD_COLORS: Record<string, string> = {
  geothermie: '#FFD94F',
  pac_air_eau: '#60a5fa',
  conseiller:  '#a78bfa',
  peu_mature:  '#94a3b8',
}

const LEAD_BADGES: Record<string, string> = {
  geothermie:  'Projet geothermique — excellent candidat',
  pac_air_eau: 'Solution PAC air/eau envisageable',
  conseiller:  'Analyse personnalisee recommandee',
  peu_mature:  'Premiere orientation',
}

const LEAD_TEXTS: Record<string, string> = {
  geothermie:  'Sur base de votre configuration, la geothermie est la solution la plus adaptee. Voici un pre-dimensionnement indicatif de votre installation.',
  pac_air_eau: 'Votre configuration pourrait convenir a une PAC air/eau. Nous incluons une estimation geothermique a titre comparatif.',
  conseiller:  'Votre projet presente plusieurs options. Voici une premiere estimation pour orienter votre reflexion.',
  peu_mature:  'Vous etes au debut de votre reflexion. Voici les ordres de grandeur pour une installation geothermique dans votre configuration.',
}

const RECOMMANDATIONS: Record<string, string[]> = {
  geothermie: [
    'La geothermie sur sondes verticales est la solution la plus performante pour votre configuration.',
    'Avec un chauffage au sol, vous pouvez egalement beneficier du rafraichissement passif gratuit en ete.',
    'Les primes wallonnes (Renolution) peuvent couvrir jusqu a 30% du cout du forage.',
  ],
  pac_air_eau: [
    'Une PAC air/eau necessite moins d investissement initial mais des couts de fonctionnement plus eleves.',
    'En fonction de la place disponible, la geothermie reste plus performante sur le long terme.',
    'Nous pouvons vous etablir une comparaison detaillee des deux solutions.',
  ],
  conseiller: [
    'Plusieurs inconnues subsistent — un audit energetique rapide permettrait d affiner ce pre-dimensionnement.',
    'Nos ingenieurs peuvent vous conseiller sur le choix entre geothermie, PAC air/eau et solutions hybrides.',
  ],
  peu_mature: [
    'Prenez le temps de definir votre budget et votre calendrier avant de vous engager.',
    'Nous pouvons vous envoyer un guide comparatif des solutions de chauffage sans engagement.',
  ],
}

export default function LeadResult({ answers, address, lead, devisUrl, soumissionUrl }: {
  answers: Answers
  address: AddressResult | null
  lead: string
  devisUrl: string
  soumissionUrl: string
}) {
  const color = LEAD_COLORS[lead] || LEAD_COLORS.conseiller
  const badge = LEAD_BADGES[lead] || LEAD_BADGES.conseiller
  const text = LEAD_TEXTS[lead] || LEAD_TEXTS.conseiller
  const recommandations = RECOMMANDATIONS[lead] || RECOMMANDATIONS.conseiller

  const [kWMin, kWMax] = calcPuissance(answers)
  const [sondesMin, sondesMax] = calcSondes(kWMin, kWMax)
  const [prixMin, prixMax] = calcPrix(sondesMin, sondesMax)
  const cop = calcCOP(answers)
  const emetteurNote = getEmetteurNote(answers)
  const surface = getSurface(answers)

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  const cta = lead === 'geothermie' ? devisUrl : soumissionUrl
  const ctaLabel = lead === 'geothermie' ? 'Obtenir mon devis precis +' : 'Parler a un expert +'

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-5 h-0.5" style={{ background: color }} />
        <span className="text-xs font-light tracking-widest uppercase" style={{ color: color + 'bb' }}>
          {badge}
        </span>
      </div>

      {contact.prenom && (
        <div className="text-xs text-white/35 mb-3">
          Bonjour {contact.prenom}, voici votre analyse personnalisee.
        </div>
      )}

      {address && (
        <div className="text-xs text-white/25 mb-4 truncate">{address.label}</div>
      )}

      <p className="text-xs font-light text-white/45 leading-relaxed mb-5 border-l-2 pl-3" style={{ borderColor: color + '60' }}>
        {text}
      </p>

      {/* ── PRE-DIMENSIONNEMENT ── */}
      <div className="mb-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Pre-dimensionnement indicatif
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          <div className="bg-white/5 p-4">
            <div className="text-xs text-white/30 mb-1">Puissance PAC estimee</div>
            <div className="text-xl font-bold text-white">{kWMin} – {kWMax} kW</div>
            {surface > 0 && (
              <div className="text-xs text-white/20 mt-1">{surface} m2 de surface chauffee</div>
            )}
          </div>
          <div className="bg-white/5 p-4">
            <div className="text-xs text-white/30 mb-1">COP estim&eacute; (rendement)</div>
            <div className="text-xl font-bold text-white">{cop}</div>
            <div className="text-xs text-white/20 mt-1">kWh produit / kWh consomm&eacute;</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          <div className="bg-white/5 p-4">
            <div className="text-xs text-white/30 mb-1">Nombre de sondes</div>
            <div className="text-xl font-bold text-white">{sondesMin} – {sondesMax}</div>
            <div className="text-xs text-white/20 mt-1">sondes de 100 m</div>
          </div>
          <div className="bg-white/5 p-4">
            <div className="text-xs text-white/30 mb-1">Profondeur totale</div>
            <div className="text-xl font-bold text-white">{sondesMin * 100} – {sondesMax * 100} m</div>
            <div className="text-xs text-white/20 mt-1">forage vertical</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 border-t-2 mb-1.5" style={{ borderColor: color }}>
          <div className="text-xs text-white/30 mb-1">Fourchette de prix forage seul HTVA</div>
          <div className="text-2xl font-bold text-white">
            {prixMin.toLocaleString('fr-BE')} – {prixMax.toLocaleString('fr-BE')} EUR
          </div>
          <div className="text-xs text-white/20 mt-1">Hors pompe a chaleur et installation interieure</div>
        </div>

        <div className="bg-white/5 p-3">
          <div className="text-xs text-white/25 leading-relaxed">
            Ces estimations sont indicatives et basees sur les donnees que vous avez fournies.
            Un dimensionnement precis necessite une visite technique et une mesure in situ des proprietes thermiques du sol.
          </div>
        </div>
      </div>

      {/* ── NOTE EMETTEURS ── */}
      {emetteurNote && (
        <div className="bg-wdd-yellow/8 border border-wdd-yellow/20 p-4 mb-5">
          <div className="text-xs font-semibold text-wdd-yellow mb-1">Attention emetteurs</div>
          <div className="text-xs font-light text-white/50 leading-relaxed">{emetteurNote}</div>
        </div>
      )}

      {/* ── RECOMMANDATIONS ── */}
      <div className="mb-5">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Recommandations
        </div>
        <div className="flex flex-col gap-1.5">
          {recommandations.map((r, i) => (
            <div key={i} className="flex gap-3 bg-white/3 p-3">
              <div className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center" style={{ background: color + '25' }}>
                <span className="text-xs font-bold" style={{ color }}>{i + 1}</span>
              </div>
              <div className="text-xs font-light text-white/55 leading-relaxed">{r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <a href={cta} className="block w-full py-3 text-wdd-black text-sm font-bold text-center mb-1 hover:opacity-90 transition-opacity" style={{ background: color }}>
        {ctaLabel}
      </a>
      <a href="tel:+32494142449" className="block w-full py-2.5 border border-white/10 text-white/40 text-xs text-center hover:border-white/30 hover:text-white transition-colors">
        Parler a un expert : +32 494 14 24 49
      </a>
    </div>
  )
}

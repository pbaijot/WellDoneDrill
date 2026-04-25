'use client'
import type { Answers, AddressResult } from './types'
import LoadProfile from './LoadProfile'

const W_PAR_M2: Record<string, [number, number]> = {
  maison_A: [20, 30], maison_B: [30, 40], maison_std: [40, 55], maison_inconnu: [45, 60], maison_default: [45, 65],
  appart_A: [18, 25], appart_B: [25, 35], appart_std: [35, 50], appart_default: [35, 50],
  immeuble_default: [30, 45], collectif_default: [30, 45],
}

const W_PAR_ANNEE: Record<string, number> = {
  '<1950': 80, '1950-70': 70, '1970-90': 60, '1990-2010': 45, '>2010': 35, inconnu: 55,
}

function getSurface(a: Answers): number {
  return parseFloat(String(a['a_surface'] || a['b_surface'] || a['c_surface_actuelle'] || '0'))
    + parseFloat(String(a['c_surface_extension'] || '0'))
}

function calcPuissance(a: Answers): [number, number] {
  const surface = getSurface(a)
  if (!surface) return [8, 15]
  const type = String(a['a_type_logement'] || a['b_type_logement'] || 'maison')
  const peb = String(a['a_peb'] || '')
  const annee = String(a['b_annee'] || '')
  const chaudiere = parseFloat(String(a['b_puissance'] || '0'))
  if (chaudiere > 0) { const p = chaudiere * 0.75; return [Math.round(p * 0.85), Math.round(p * 1.05)] }
  let key = type + '_default'
  if (peb && ['A','B','std','inconnu'].includes(peb)) key = type + '_' + peb
  let range = W_PAR_M2[key] || W_PAR_M2['maison_default']
  if (annee && W_PAR_ANNEE[annee]) {
    const w = W_PAR_ANNEE[annee]
    return [Math.max(3, Math.round(surface * w * 0.85 / 1000)), Math.max(5, Math.round(surface * w * 1.15 / 1000))]
  }
  return [Math.max(3, Math.round(surface * range[0] / 1000)), Math.max(5, Math.round(surface * range[1] / 1000))]
}

function calcCOP(a: Answers): string {
  const e = String(a['a_emetteurs'] || a['b_emetteurs'] || '')
  if (e === 'sol') return '4.5 a 5.5'
  if (e === 'rbt') return '4.0 a 5.0'
  if (['radiateurs','ventilos'].includes(e)) return '3.5 a 4.5'
  return '4.0 a 5.0'
}

const LEAD_CONFIG: Record<string, { color: string; badge: string; title: string; text: string; recs: string[] }> = {
  geothermie: {
    color: '#E6C200',
    badge: 'Projet geothermique — excellent candidat',
    title: 'La geothermie est la solution la plus adaptee a votre configuration.',
    text: 'Sur base de votre superficie, votre budget et votre calendrier, nos ingenieurs preparent une analyse detaillee. Delai de retour : 48h ouvrables.',
    recs: [
      'La geothermie sur sondes verticales offre le meilleur rendement pour votre configuration.',
      'Avec un chauffage au sol, vous beneficiez aussi du rafraichissement passif gratuit en ete.',
      'Les primes wallonnes (Renolution) peuvent couvrir jusqu a 30% du cout du forage.',
    ],
  },
  pac_air_eau: {
    color: '#1565C0',
    badge: 'Solution PAC air/eau envisageable',
    title: 'Une PAC air/eau pourrait convenir a votre projet.',
    text: 'Selon votre configuration, la PAC air/eau est une option pertinente. Nous pouvons etablir une comparaison detaillee avec la solution geothermique.',
    recs: [
      'La PAC air/eau necessite moins d investissement initial mais des couts de fonctionnement plus eleves.',
      'La geothermie reste plus performante sur le long terme — une comparaison chiffree peut vous aider.',
    ],
  },
  conseiller: {
    color: '#6B21A8',
    badge: 'Analyse personnalisee recommandee',
    title: 'Votre projet merite un conseil personnalise.',
    text: 'Plusieurs options s offrent a vous. Un de nos ingenieurs vous contacte pour affiner le dimensionnement et vous orienter vers la meilleure solution.',
    recs: [
      'Un audit energetique rapide permettrait d affiner ce pre-dimensionnement.',
      'Nos ingenieurs peuvent vous conseiller sur le choix entre geothermie, PAC air/eau et solutions hybrides.',
    ],
  },
  peu_mature: {
    color: '#6B6057',
    badge: 'Premiere orientation',
    title: 'Vous etes au debut de votre reflexion.',
    text: 'Nous vous envoyons un guide comparatif des solutions de chauffage avec les ordres de grandeur de couts et d economies.',
    recs: [
      'Prenez le temps de definir votre budget et votre calendrier avant de vous engager.',
      'Un diagnostic energetique de votre logement est un bon point de depart.',
    ],
  },
}

export default function LeadResult({ answers, address, lead, devisUrl, soumissionUrl }: {
  answers: Answers; address: AddressResult | null; lead: string; devisUrl: string; soumissionUrl: string
}) {
  const cfg = LEAD_CONFIG[lead] || LEAD_CONFIG.conseiller
  const [kWMin, kWMax] = calcPuissance(answers)
  const sondesMin = Math.max(1, Math.round(kWMin / 6.5))
  const sondesMax = Math.max(1, Math.round(kWMax / 5.5))
  const prixMin = sondesMin * 8000
  const prixMax = sondesMax * 12000
  const cop = calcCOP(answers)
  const surface = getSurface(answers)
  const ctaUrl = lead === 'geothermie' ? devisUrl : soumissionUrl
  const ctaLabel = lead === 'geothermie' ? 'Obtenir mon devis precis →' : 'Parler a un expert →'

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  const Cell = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div style={{ background: '#F8F5EF', border: '1px solid #DDD8CF', padding: '16px' }}>
      <div style={{ fontSize: '11px', color: '#9A9088', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C1C1C' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#9A9088', marginTop: '3px' }}>{sub}</div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '24px', height: '3px', background: cfg.color }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: cfg.color }}>
          {cfg.badge}
        </span>
      </div>

      {contact.prenom && (
        <div style={{ fontSize: '13px', color: '#6B6057', marginBottom: '8px' }}>
          Bonjour {contact.prenom}, voici votre analyse personnalisee.
        </div>
      )}
      {address && (
        <div style={{ fontSize: '12px', color: '#9A9088', marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {address.label}
        </div>
      )}

      <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.6, padding: '12px 16px', borderLeft: '3px solid ' + cfg.color, background: '#F8F5EF', marginBottom: '24px' }}>
        {cfg.text}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9088', marginBottom: '12px' }}>
        Pre-dimensionnement indicatif
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <Cell label="Puissance PAC estimee" value={kWMin + ' – ' + kWMax + ' kW'} sub={surface > 0 ? surface + ' m2 de surface chauffee' : undefined} />
        <Cell label="COP estime (rendement)" value={cop} sub="kWh produit / kWh consomme" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <Cell label="Nombre de sondes" value={sondesMin + ' – ' + sondesMax} sub="sondes de 100 m" />
        <Cell label="Profondeur totale" value={sondesMin * 100 + ' – ' + sondesMax * 100 + ' m'} sub="forage vertical" />
      </div>

      <div style={{ background: '#FFFFFF', border: '2px solid ' + cfg.color, padding: '16px', marginBottom: '6px' }}>
        <div style={{ fontSize: '11px', color: '#9A9088', marginBottom: '4px' }}>Fourchette de prix forage seul HTVA</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C1C1C' }}>
          {prixMin.toLocaleString('fr-BE')} – {prixMax.toLocaleString('fr-BE')} EUR
        </div>
        <div style={{ fontSize: '11px', color: '#9A9088', marginTop: '4px' }}>Hors pompe a chaleur et installation interieure</div>
      </div>

      <div style={{ background: '#F8F5EF', padding: '12px 16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: '#9A9088', lineHeight: 1.6 }}>
          Ces estimations sont indicatives. Un dimensionnement precis necessite une visite technique et une mesure in situ des proprietes thermiques du sol.
        </div>
      </div>

      <LoadProfile answers={answers} />

      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A9088', marginBottom: '12px', marginTop: '24px' }}>
        Recommandations
      </div>
      <div style={{ marginBottom: '24px' }}>
        {cfg.recs.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', background: '#F8F5EF', border: '1px solid #DDD8CF', padding: '12px 14px', marginBottom: '4px' }}>
            <div style={{ width: '20px', height: '20px', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.6 }}>{r}</div>
          </div>
        ))}
      </div>

      <a href={ctaUrl} style={{ display: 'block', width: '100%', padding: '14px', background: cfg.color, color: '#1A1A1A', fontSize: '14px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', marginBottom: '6px', boxSizing: 'border-box' }}>
        {ctaLabel}
      </a>
      <a href="tel:+32494142449" style={{ display: 'block', width: '100%', padding: '12px', background: 'none', color: '#6B6057', fontSize: '13px', textAlign: 'center', border: '1px solid #DDD8CF', textDecoration: 'none', boxSizing: 'border-box' }}>
        Parler a un expert : +32 494 14 24 49
      </a>
    </div>
  )
}

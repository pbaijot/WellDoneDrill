'use client'
import type { Profile, Answers, AddressResult } from './types'

const T = {
  bg: '#FFFFFF', bgSoft: '#F8F5EF', bgMuted: '#F2EFE9',
  border: '#DDD8CF', borderStrong: '#B8B0A0',
  text: '#1C1C1C', text2: '#4A4540', text3: '#6B6057', text4: '#9A9088',
  accent: '#FFD94F', accentDark: '#E6C200',
}

const LABELS: Record<string, string> = {
  type_projet: 'Type de projet', a_type_logement: 'Type logement', b_type_logement: 'Type logement',
  a_surface: 'Surface', b_surface: 'Surface', c_surface_actuelle: 'Surface actuelle', c_surface_extension: 'Extension',
  a_peb: 'Niveau PEB', a_emetteurs: 'Emetteurs', b_emetteurs: 'Emetteurs',
  a_occupants: 'Occupants', b_occupants: 'Occupants', b_annee: 'Annee construction',
  b_chaudiere: 'Chaudiere', b_puissance: 'Puissance', b_conso: 'Consommation',
  b_temp: 'Temp. depart', b_confort: 'Confort', b_travaux: 'Travaux prevus',
  objectifs: 'Objectifs', local_technique: 'Local technique', budget: 'Budget', maturite: 'Maturite',
}

const VAL: Record<string, Record<string, string>> = {
  type_projet: { neuf: 'Nouvelle construction', renovation: 'Renovation', extension: 'Extension', inconnu: 'Non defini' },
  a_type_logement: { maison: 'Maison', appart: 'Appartement', immeuble: 'Immeuble', collectif: 'Collectif' },
  b_type_logement: { maison: 'Maison', appart: 'Appartement', immeuble: 'Immeuble', collectif: 'Collectif' },
  a_peb: { A: 'PEB A', B: 'PEB B', std: 'Standard', inconnu: 'Non defini' },
  b_chaudiere: { gaz: 'Gaz', mazout: 'Mazout', elec: 'Electrique', pac: 'PAC', bois: 'Bois/Pellets', autre: 'Autre' },
  budget: { '<10k': 'Moins de 10k', '10-20k': '10-20k EUR', '20-35k': '20-35k EUR', '35-50k': '35-50k EUR', '>50k': 'Plus de 50k', inconnu: 'Non defini' },
  maturite: { reflexion: 'Reflexion', comparaison: 'Comparaison', offres: 'A des offres', partenaire: 'A un partenaire', devis: 'Pret pour devis' },
}

function fmt(key: string, val: string | string[]): string {
  const v = Array.isArray(val) ? val.join(', ') : val
  return VAL[key]?.[v] || v
}

const SEC2 = ['type_projet','a_type_logement','b_type_logement','a_surface','b_surface','c_surface_actuelle','c_surface_extension','a_peb','a_emetteurs','b_emetteurs','a_occupants','b_occupants','b_annee','b_chaudiere','b_puissance','b_conso','b_temp','b_confort','b_travaux']
const SEC3 = ['objectifs','local_technique','budget','maturite']

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '6px 0 6px 26px', borderTop: '1px solid ' + T.bgMuted }}>
      <span style={{ fontSize: '12px', color: T.text4 }}>{label}</span>
      <span style={{ fontSize: '12px', color: T.text2, fontWeight: 500, textAlign: 'right', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function Section({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: T.bg, border: '1px solid ' + T.border, padding: '14px 16px', marginBottom: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '18px', height: '18px', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#1A1A1A' }}>{n}</div>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.text3 }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

export default function SummaryPanel({ profile, address, answers, phase }: {
  profile: Profile; address: AddressResult | null; answers: Answers; phase: string
}) {
  const sec2 = SEC2.filter((k) => answers[k])
  const sec3 = SEC3.filter((k) => answers[k])
  const hasContent = profile || address || sec2.length > 0 || sec3.length > 0

  if (!hasContent || phase === 'profile') return null

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  return (
    <div style={{ marginTop: '40px', borderTop: '2px solid ' + T.border, paddingTop: '24px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.text4, marginBottom: '16px' }}>
        Recapitulatif de votre dossier
      </div>

      {(profile || address) && (
        <Section n={1} label="Localisation">
          {profile && <Row label="Profil" value={profile === 'part' ? 'Particulier' : 'Professionnel'} />}
          {address && <Row label="Adresse" value={address.label} />}
        </Section>
      )}

      {sec2.length > 0 && (
        <Section n={2} label="Votre projet">
          {sec2.map((k) => (
            <Row key={k} label={LABELS[k] || k} value={fmt(k, answers[k]) + (k.includes('surface') ? ' m2' : '') + (k === 'b_puissance' ? ' kW' : '')} />
          ))}
        </Section>
      )}

      {sec3.length > 0 && (
        <Section n={3} label="Objectifs">
          {sec3.map((k) => (
            <Row key={k} label={LABELS[k] || k} value={fmt(k, answers[k])} />
          ))}
        </Section>
      )}

      {contact.prenom && (
        <Section n={4} label="Coordonnees">
          <Row label="Nom" value={contact.prenom + ' ' + contact.nom} />
          {contact.email && <Row label="Email" value={contact.email} />}
          {contact.commune && <Row label="Commune" value={contact.cp + ' ' + contact.commune} />}
        </Section>
      )}
    </div>
  )
}


'use client'
import type { Profile, Answers, AddressResult } from '../types'
import { C, F } from '../theme'
import { T } from '../i18n/fr'
import type { Phase } from '../hooks/useSimulator'

const LABELS: Record<string, string> = {
  type_projet: 'Type de projet', a_type_logement: 'Logement', b_type_logement: 'Logement',
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
  budget: { '<10k': '-10k EUR', '10-20k': '10-20k EUR', '20-35k': '20-35k EUR', '35-50k': '35-50k EUR', '>50k': '+50k EUR', inconnu: 'Non defini' },
  maturite: { reflexion: 'Reflexion', comparaison: 'Comparaison', offres: 'A des offres', partenaire: 'Partenaire', devis: 'Pret pour devis' },
}

function fmt(key: string, val: string | string[]) {
  const v = Array.isArray(val) ? (val as string[]).join(', ') : String(val)
  return (VAL[key]?.[v] || v) + (key.includes('surface') ? ' m2' : '') + (key === 'b_puissance' ? ' kW' : '')
}

const SEC2 = ['type_projet','a_type_logement','b_type_logement','a_surface','b_surface','c_surface_actuelle','c_surface_extension','a_peb','a_emetteurs','b_emetteurs','a_occupants','b_occupants','b_annee','b_chaudiere','b_puissance','b_conso','b_temp','b_confort','b_travaux']
const SEC3 = ['objectifs','local_technique','budget','maturite']

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '5px 0 5px 26px', borderTop: '1px solid ' + C.bgMuted }}>
      <span style={{ fontSize: F.sm, color: C.text4, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: F.sm, color: C.text2, fontWeight: 500, textAlign: 'right' as const, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: '280px' }}>{value}</span>
    </div>
  )
}

function Section({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg, border: '1px solid ' + C.border, padding: '14px 16px', marginBottom: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '18px', height: '18px', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>{n}</div>
        <span style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.text3 }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

export default function SummaryPanel({ profile, address, answers, phase }: {
  profile: Profile; address: AddressResult | null; answers: Answers; phase: Phase
}) {
  const sec2 = SEC2.filter((k) => answers[k])
  const sec3 = SEC3.filter((k) => answers[k])
  if ((!profile && !address && sec2.length === 0) || phase === 'profile') return null

  let contact: any = {}
  try { contact = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  return (
    <div style={{ marginTop: '40px', borderTop: '2px solid ' + C.border, paddingTop: '24px' }}>
      <div style={{ fontSize: F.xs, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: C.text4, marginBottom: '16px' }}>
        {T.summaryTitle}
      </div>
      {(profile || address) && (
        <Section n={1} label={T.summaryS1}>
          {profile && <Row label={T.summaryProfile} value={profile === 'part' ? T.summaryPart : T.summaryPro} />}
          {address && <Row label={T.summaryAddress} value={address.label} />}
        </Section>
      )}
      {sec2.length > 0 && (
        <Section n={2} label={T.summaryS2}>
          {sec2.map((k) => <Row key={k} label={LABELS[k] || k} value={fmt(k, answers[k])} />)}
        </Section>
      )}
      {sec3.length > 0 && (
        <Section n={3} label={T.summaryS3}>
          {sec3.map((k) => <Row key={k} label={LABELS[k] || k} value={fmt(k, answers[k])} />)}
        </Section>
      )}
      {contact.prenom && (
        <Section n={4} label={T.summaryS4}>
          <Row label={T.contactPrenom + ' / ' + T.contactNom} value={contact.prenom + ' ' + contact.nom} />
          {contact.email && <Row label={T.contactEmail} value={contact.email} />}
          {contact.commune && <Row label={T.contactCommune} value={contact.cp + ' ' + contact.commune} />}
        </Section>
      )}
    </div>
  )
}

'use client'
import type { Profile, Answers, AddressResult } from './types'

const LABELS: Record<string, string> = {
  type_projet: 'Type de projet',
  a_type_logement: 'Type de logement',
  b_type_logement: 'Type de logement',
  a_surface: 'Surface',
  b_surface: 'Surface',
  c_surface_actuelle: 'Surface actuelle',
  c_surface_extension: 'Surface extension',
  a_peb: 'Niveau energetique',
  a_emetteurs: 'Emetteurs',
  b_emetteurs: 'Emetteurs',
  a_occupants: 'Occupants',
  b_occupants: 'Occupants',
  a_timing: 'Timing',
  b_timing: 'Timing',
  b_annee: 'Annee construction',
  b_renovation: 'Derniere renovation',
  b_chaudiere: 'Chaudiere actuelle',
  b_puissance: 'Puissance chaudiere',
  b_conso: 'Consommation annuelle',
  b_temp: 'Temperature depart',
  b_confort: 'Confort actuel',
  b_travaux: 'Travaux prevus',
  c_isolation: 'Isolation extension',
  c_systeme: 'Systeme extension',
  objectifs: 'Objectifs',
  local_technique: 'Local technique',
  budget: 'Budget',
  maturite: 'Maturite projet',
}

const VALUE_LABELS: Record<string, Record<string, string>> = {
  type_projet: { neuf: 'Nouvelle construction', renovation: 'Renovation / remplacement', extension: 'Extension', inconnu: 'Non defini' },
  a_type_logement: { maison: 'Maison individuelle', appart: 'Appartement', immeuble: 'Immeuble', collectif: 'Petit collectif' },
  b_type_logement: { maison: 'Maison individuelle', appart: 'Appartement', immeuble: 'Immeuble', collectif: 'Petit collectif' },
  a_peb: { A: 'PEB A — tres performant', B: 'PEB B', std: 'Standard reglementaire', inconnu: 'Non defini' },
  a_emetteurs: { sol: 'Chauffage au sol', rbt: 'Radiateurs BT', ventilos: 'Ventilo-convecteurs', mixte: 'Mixte', inconnu: 'Non defini' },
  b_emetteurs: { radiateurs: 'Radiateurs classiques', rbt: 'Radiateurs BT', sol: 'Chauffage au sol', ventilos: 'Ventilo-convecteurs', mixte: 'Mixte', inconnu: 'Non defini' },
  b_chaudiere: { gaz: 'Chaudiere gaz', mazout: 'Chaudiere mazout', elec: 'Electrique', pac: 'PAC existante', bois: 'Bois / Pellets', autre: 'Autre' },
  b_temp: { '<40': 'Moins de 40 C', '40-50': '40 a 50 C', '50-60': '50 a 60 C', '>60': 'Plus de 60 C', inconnu: 'Non defini' },
  b_confort: { oui: 'Bien chauffe partout', partiel: 'Certaines pieces limites', non: 'Souvent trop froid', economie: 'Chauffe peu' },
  local_technique: { '>5': 'Grand local +5m2', '2-5': 'Local 2 a 5m2', '<2': 'Petit local -2m2', non: 'Pas de local', inconnu: 'Non defini' },
  budget: { '<10k': 'Moins de 10 000 EUR', '10-20k': '10 000 a 20 000 EUR', '20-35k': '20 000 a 35 000 EUR', '35-50k': '35 000 a 50 000 EUR', '>50k': 'Plus de 50 000 EUR', inconnu: 'Non defini' },
  maturite: { reflexion: 'Simple reflexion', comparaison: 'Compare les solutions', offres: 'A deja des offres', partenaire: 'A un partenaire', devis: 'Pret pour un devis' },
  a_timing: { permis: 'Permis en cours', '<6m': 'Chantier dans 6 mois', '6-12m': 'Chantier 6-12 mois', '>1an': 'Plus d un an' },
  b_timing: { asap: 'Des que possible', '<3m': 'Dans 3 mois', '<6m': 'Dans 6 mois', '<1an': 'Dans l annee', '>1an': 'Plus tard', inconnu: 'Non defini' },
}

function fmtValue(key: string, val: string | string[]): string {
  const v = Array.isArray(val) ? val.join(', ') : val
  return VALUE_LABELS[key]?.[v] || v
}

function fmtUnit(key: string): string {
  if (key.includes('surface') || key === 'a_surface' || key === 'b_surface') return ' m2'
  if (key === 'b_puissance') return ' kW'
  return ''
}

const SECTION_KEYS: Record<number, string[]> = {
  2: ['type_projet','a_type_logement','b_type_logement','a_surface','b_surface','c_surface_actuelle','c_surface_extension','a_peb','a_emetteurs','b_emetteurs','a_occupants','b_occupants','a_timing','b_annee','b_renovation','b_chaudiere','b_puissance','b_conso','b_temp','b_confort','b_travaux','c_isolation','c_systeme','b_timing'],
  3: ['objectifs','local_technique','budget','maturite'],
  4: ['contact'],
}

const SECTION_LABELS_: Record<number, string> = {
  1: 'Localisation',
  2: 'Votre projet',
  3: 'Objectifs',
  4: 'Coordonnees',
}

export default function SummaryPanel({ profile, address, answers, phase }: {
  profile: Profile
  address: AddressResult | null
  answers: Answers
  phase: string
}) {
  const hasData = profile || address || Object.keys(answers).length > 0
  if (!hasData || phase === 'profile') return null

  let contactData: any = {}
  try { contactData = JSON.parse(String(answers['contact'] || '{}')) } catch {}

  return (
    <div className="mt-10 border-t border-white/8 pt-6">
      <div className="text-xs font-light tracking-widest uppercase text-white/20 mb-4">
        Recapitulatif de votre dossier
      </div>
      <div className="flex flex-col gap-2">

        {(profile || address) && (
          <div className="bg-white/3 border border-white/6 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-wdd-yellow/20 flex items-center justify-center">
                <span className="text-wdd-yellow text-xs font-bold">1</span>
              </div>
              <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">{SECTION_LABELS_[1]}</span>
            </div>
            <div className="pl-6 flex flex-col gap-1">
              {profile && (
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-white/30">Profil</span>
                  <span className="text-xs text-white/60">{profile === 'part' ? 'Particulier' : 'Professionnel'}</span>
                </div>
              )}
              {address && (
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-white/30 flex-shrink-0">Adresse</span>
                  <span className="text-xs text-white/60 text-right truncate max-w-xs">{address.label}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {[2, 3].map((n) => {
          const keys = SECTION_KEYS[n].filter((k) => answers[k] !== undefined && answers[k] !== '')
          if (keys.length === 0) return null
          return (
            <div key={n} className="bg-white/3 border border-white/6 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-wdd-yellow/20 flex items-center justify-center">
                  <span className="text-wdd-yellow text-xs font-bold">{n}</span>
                </div>
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">{SECTION_LABELS_[n]}</span>
              </div>
              <div className="pl-6 flex flex-col gap-1">
                {keys.map((k) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-xs text-white/30 flex-shrink-0">{LABELS[k] || k}</span>
                    <span className="text-xs text-white/60 text-right">
                      {fmtValue(k, answers[k])}{fmtUnit(k)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {contactData.prenom && (
          <div className="bg-white/3 border border-white/6 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-wdd-yellow/20 flex items-center justify-center">
                <span className="text-wdd-yellow text-xs font-bold">4</span>
              </div>
              <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">{SECTION_LABELS_[4]}</span>
            </div>
            <div className="pl-6 flex flex-col gap-1">
              <div className="flex justify-between gap-4">
                <span className="text-xs text-white/30">Nom</span>
                <span className="text-xs text-white/60">{contactData.prenom} {contactData.nom}</span>
              </div>
              {contactData.email && (
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-white/30">Email</span>
                  <span className="text-xs text-white/60">{contactData.email}</span>
                </div>
              )}
              {contactData.commune && (
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-white/30">Commune</span>
                  <span className="text-xs text-white/60">{contactData.cp} {contactData.commune}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

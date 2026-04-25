'use client'
import type { Profile, Answers, AddressResult } from './types'

const LABELS: Record<string, string> = {
  r_type_bien: 'Type de bien',
  r_superficie: 'Superficie',
  pp_type_projet: 'Type de projet',
  pp_type_bien: 'Type de bien',
  pp_superficie: 'Superficie',
  pp_occupants: 'Occupants',
  pp_besoin: 'Besoin thermique',
  pp_peb_score: 'Score PEB',
  pp_peb_surface: 'Surface PEB',
  pp_puissance_kw: 'Puissance chaudiere',
  pp_emetteurs: 'Emetteurs',
  pp_ventilos: 'Ventiloconvecteurs',
  pp_rafraichissement: 'Rafraichissement ete',
  pp_jardin: 'Espace exterieur',
  pp_acces: 'Acces foreuse',
  pp_abords: 'Abords',
  pp_installateur: 'Installateur',
  pp_install_nom: 'Nom installateur',
  pp_install_contact: 'Contact installateur',
  pro_role: 'Role',
  pro_objectif: 'Objectif',
  pro_type_bien: 'Type de batiment',
  pro_puissance: 'Puissance estimee',
  pro_phase: 'Phase du projet',
}

const SECTION_KEYS: Record<number, string[]> = {
  1: [],
  2: ['r_type_bien','r_superficie','pp_type_projet','pp_type_bien','pp_superficie','pp_occupants','pp_besoin','pp_peb_score','pp_peb_surface','pp_puissance_kw','pp_emetteurs','pp_ventilos','pp_rafraichissement','pro_role','pro_objectif','pro_type_bien','pro_puissance','pro_phase'],
  3: ['pp_jardin','pp_acces','pp_abords'],
  4: ['pp_installateur','pp_install_nom','pp_install_contact'],
}

const SECTION_LABELS: Record<number, string> = {
  1: 'Localisation',
  2: 'Dimensionnement',
  3: 'Logistique',
  4: 'Installateur',
}

function formatValue(key: string, value: string): string {
  if (!value) return ''
  const maps: Record<string, Record<string, string>> = {
    pp_type_projet: { neuf: 'Construction neuve', remplacement: 'Remplacement chaudiere', renovation: 'Renovation lourde' },
    r_type_bien: { '4f': 'Maison 4 facades', '3f': 'Maison 3 facades', mito: 'Maison mitoyenne', appart: 'Appartement' },
    pp_type_bien: { '4f': 'Maison 4 facades', '3f': 'Maison 3 facades', mito: 'Maison mitoyenne', appart: 'Appartement' },
    r_superficie: { '<100': 'Moins de 100 m2', '100-200': '100 a 200 m2', '200-350': '200 a 350 m2', '>350': 'Plus de 350 m2' },
    pp_superficie: { '<100': 'Moins de 100 m2', '100-200': '100 a 200 m2', '200-350': '200 a 350 m2', '>350': 'Plus de 350 m2' },
    pp_occupants: { '1-2': '1 ou 2 personnes', '3-4': '3 ou 4 personnes', '5+': '5 personnes ou plus' },
    pp_besoin: { peb: 'Certificat PEB', chaudiere: 'Puissance chaudiere connue', inconnu: 'Estimation automatique' },
    pp_peb_score: { 'A+': 'A++ ou A+', A: 'A ou B', C: 'C ou D', E: 'E ou F', G: 'G ou non certifie' },
    pp_emetteurs: { sol: 'Chauffage au sol', radiateurs: 'Radiateurs classiques', mixte: 'Sol + radiateurs', inconnu: 'Non decide' },
    pp_ventilos: { oui: 'Oui', non: 'Non' },
    pp_rafraichissement: { oui: 'Oui', non: 'Non' },
    pp_jardin: { jardin: 'Jardin disponible', limite: 'Espace limite', aucun: 'Pas d espace' },
    pp_acces: { facile: 'Acces facile', difficile: 'Acces difficile', averifier: 'A verifier' },
    pp_abords: { oui: 'Abords a refaire', non: 'Abords termines', encours: 'En planification' },
    pp_installateur: { oui: 'Oui — installateur connu', non: 'Non — liste partenaires', self: 'Je gere moi-meme' },
    pro_role: { archi: 'Architecte', install: 'Installateur', be: 'Bureau d etudes', eg: 'Entreprise generale', moa: 'Maitre d ouvrage' },
    pro_objectif: { soumission: 'Espace soumission', etude: 'Etude de faisabilite' },
    pro_type_bien: { hopital: 'Hopital / Clinique', ecole: 'Ecole / Institution', bureau: 'Bureau / Tertiaire', pme: 'PME / Industrie', hotel: 'Hotel / Horeca', resid: 'Residentiel collectif', autre: 'Autre' },
    pro_puissance: { '<50': 'Moins de 50 kW', '50-200': '50 a 200 kW', '200-1000': '200 kW a 1 MW', '>1000': 'Plus de 1 MW' },
    pro_phase: { esquisse: 'Esquisse / Faisabilite', avp: 'Avant-projet', projet: 'Projet / Permis', urgence: 'Chantier imminent' },
  }
  return maps[key]?.[value] || value
}

export default function SummaryPanel({
  profile,
  address,
  answers,
  phase,
}: {
  profile: Profile
  address: AddressResult | null
  answers: Answers
  phase: string
}) {
  const hasAnything = profile || address || Object.keys(answers).filter(k => k !== '_dim').length > 0
  if (!hasAnything) return null

  const filledSections = [1, 2, 3, 4].filter((n) => {
    if (n === 1) return address !== null
    return SECTION_KEYS[n].some((k) => answers[k])
  })

  if (filledSections.length === 0 && !address) return null

  return (
    <div className="mt-8 border-t border-white/8 pt-6">
      <div className="text-xs font-light tracking-widest uppercase text-white/20 mb-4">
        Recapitulatif de votre dossier
      </div>

      <div className="flex flex-col gap-3">

        {(profile || address) && (
          <div className="bg-white/3 border border-white/6 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-wdd-yellow/20 flex items-center justify-center flex-shrink-0">
                <span className="text-wdd-yellow text-xs font-bold">1</span>
              </div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                {SECTION_LABELS[1]}
              </span>
            </div>
            <div className="flex flex-col gap-1 pl-6">
              {profile && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/30">Profil</span>
                  <span className="text-xs text-white/60 font-light">
                    {profile === 'part' ? 'Particulier' : 'Professionnel'}
                  </span>
                </div>
              )}
              {address && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-white/30 flex-shrink-0">Adresse</span>
                  <span className="text-xs text-white/60 font-light text-right truncate max-w-xs">
                    {address.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {[2, 3, 4].map((n) => {
          const keys = SECTION_KEYS[n].filter((k) => answers[k])
          if (keys.length === 0) return null
          return (
            <div key={n} className="bg-white/3 border border-white/6 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-wdd-yellow/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-wdd-yellow text-xs font-bold">{n}</span>
                </div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {SECTION_LABELS[n]}
                </span>
              </div>
              <div className="flex flex-col gap-1 pl-6">
                {keys.map((k) => (
                  <div key={k} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-white/30 flex-shrink-0">{LABELS[k] || k}</span>
                    <span className="text-xs text-white/60 font-light text-right">
                      {formatValue(k, answers[k])}
                      {k === 'pp_peb_surface' ? ' m2' : ''}
                      {k === 'pp_puissance_kw' ? ' kW' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}

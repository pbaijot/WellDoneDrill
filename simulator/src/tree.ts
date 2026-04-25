import type { TreeStep } from './types'


export const TREE_COMMON_START: TreeStep[] = [
  {
    id: 'type_projet',
    section: 2,
    sectionLabel: 'Votre projet',
    question: 'Quel est votre projet ?',
    hint: 'Cela determine les questions pertinentes pour votre situation.',
    options: [
      { label: 'Nouvelle construction', sublabel: 'Maison ou appartement en cours de construction', value: 'neuf', next: 'a_type_logement' },
      { label: 'Renovation ou remplacement', sublabel: 'Remplacement chaudiere gaz, mazout ou electrique', value: 'renovation', next: 'b_type_logement' },
      { label: 'Extension d un batiment', sublabel: 'Agrandissement avec ou sans refonte du systeme', value: 'extension', next: 'c_surface_actuelle' },
      { label: 'Je ne sais pas encore', value: 'inconnu', next: 'a_type_logement' },
    ],
  },
]

export const TREE_PART_RAPIDE: TreeStep[] = [
  {
    id: 'r_type_bien',
    section: 2,
    question: 'Quel type de bien ?',
    hint: 'La geometrie du batiment influe directement sur les deperditions thermiques.',
    options: [
      { label: 'Maison 4 facades', sublabel: 'Non mitoyenne', value: '4f', next: 'r_superficie' },
      { label: 'Maison 3 facades', sublabel: 'Mitoyenne d un cote', value: '3f', next: 'r_superficie' },
      { label: 'Maison mitoyenne', sublabel: 'Mitoyenne des deux cotes', value: 'mito', next: 'r_superficie' },
      { label: 'Appartement', sublabel: 'Le forage peut etre partage en copropriete', value: 'appart', next: 'r_superficie' },
    ],
  },
  {
    id: 'r_superficie',
    section: 2,
    question: 'Superficie chauffee ?',
    hint: 'Surface habitable totale, hors garage et caves non chauffes.',
    options: [
      { label: 'Moins de 100 m2', value: '<100', next: 'result_simple' },
      { label: '100 a 200 m2', value: '100-200', next: 'result_simple' },
      { label: '200 a 350 m2', value: '200-350', next: 'result_simple' },
      { label: 'Plus de 350 m2', sublabel: 'Un dimensionnement detaille sera necessaire', value: '>350', next: 'result_simple' },
    ],
  },
]

export const TREE_PART_PRECIS: TreeStep[] = [
  {
    id: 'pp_type_projet',
    section: 2,
    question: 'Quel est votre projet ?',
    hint: 'Cela oriente le choix de la pompe a chaleur et le dimensionnement du circuit.',
    options: [
      { label: 'Construction neuve', sublabel: 'Maison ou appartement en cours de construction', value: 'neuf', next: 'pp_type_bien' },
      { label: 'Remplacement de chaudiere', sublabel: 'Passage depuis le gaz, le mazout ou l electrique', value: 'remplacement', next: 'pp_type_bien' },
      { label: 'Renovation lourde', sublabel: 'Isolation renforcee, extension ou nouvelle affectation', value: 'renovation', next: 'pp_type_bien' },
    ],
  },
  {
    id: 'pp_type_bien',
    section: 2,
    question: 'Quel type de bien ?',
    hint: 'La geometrie du batiment influe directement sur les deperditions thermiques.',
    options: [
      { label: 'Maison 4 facades', sublabel: 'Non mitoyenne', value: '4f', next: 'pp_superficie' },
      { label: 'Maison 3 facades', sublabel: 'Mitoyenne d un cote', value: '3f', next: 'pp_superficie' },
      { label: 'Maison mitoyenne', sublabel: 'Mitoyenne des deux cotes', value: 'mito', next: 'pp_superficie' },
      { label: 'Appartement', sublabel: 'Le forage peut etre partage en copropriete — nous vous guidons', value: 'appart', next: 'pp_superficie' },
    ],
  },
  {
    id: 'pp_superficie',
    section: 2,
    question: 'Superficie chauffee ?',
    hint: 'Surface habitable totale, hors garage et caves non chauffes.',
    options: [
      { label: 'Moins de 100 m2', value: '<100', next: 'pp_occupants' },
      { label: '100 a 200 m2', value: '100-200', next: 'pp_occupants' },
      { label: '200 a 350 m2', value: '200-350', next: 'pp_occupants' },
      { label: 'Plus de 350 m2', value: '>350', next: 'pp_occupants' },
    ],
  },
  {
    id: 'pp_occupants',
    section: 2,
    question: 'Combien de personnes vivent sous votre toit ?',
    hint: 'Le nombre d occupants influe sur le dimensionnement de l eau chaude sanitaire.',
    options: [
      { label: '1 ou 2 personnes', value: '1-2', next: 'pp_besoin' },
      { label: '3 ou 4 personnes', value: '3-4', next: 'pp_besoin' },
      { label: '5 personnes ou plus', value: '5+', next: 'pp_besoin' },
    ],
  },
  {
    id: 'pp_besoin',
    section: 2,
    question: 'Connaissez-vous votre besoin thermique ?',
    hint: 'Ces donnees permettent de calculer la puissance exacte de votre pompe a chaleur. Plus la donnee est precise, plus le dimensionnement est fiable.',
    options: [
      { label: 'J ai un certificat PEB', sublabel: 'Nous utilisons votre score et la surface certifiee', value: 'peb', next: 'pp_peb_score' },
      { label: 'Je connais la puissance de ma chaudiere', sublabel: 'Indiquee sur la plaque signalitique ou le contrat', value: 'chaudiere', next: 'pp_puissance_kw' },
      { label: 'Je ne sais pas', sublabel: 'Estimation automatique sur base de la superficie et du type de bien', value: 'inconnu', next: 'pp_emetteurs' },
    ],
  },
  {
    id: 'pp_peb_score',
    section: 2,
    type: 'choice',
    question: 'Quel est votre score PEB ?',
    hint: 'Le score PEB figure sur votre certificat energetique. Plus le score est eleve, plus les deperditions sont importantes.',
    options: [
      { label: 'A++ ou A+', sublabel: 'Batiment tres basse energie ou passif', value: 'A+', next: 'pp_peb_surface' },
      { label: 'A ou B', sublabel: 'Batiment basse energie ou bien isole', value: 'A', next: 'pp_peb_surface' },
      { label: 'C ou D', sublabel: 'Isolation correcte mais ameliorable', value: 'C', next: 'pp_peb_surface' },
      { label: 'E ou F', sublabel: 'Isolation insuffisante', value: 'E', next: 'pp_peb_surface' },
      { label: 'G ou non certifie', sublabel: 'Ancien batiment peu ou pas isole', value: 'G', next: 'pp_peb_surface' },
    ],
  },
  {
    id: 'pp_peb_surface',
    section: 2,
    type: 'input',
    question: 'Quelle est la surface certifiee PEB ?',
    hint: 'Indiquee sur votre certificat PEB, generalement proche de la surface habitable.',
    inputLabel: 'Surface PEB',
    inputUnit: 'm2',
    inputType: 'number',
    next: 'pp_emetteurs',
  },
  {
    id: 'pp_puissance_kw',
    section: 2,
    type: 'input',
    question: 'Quelle est la puissance de votre chaudiere actuelle ?',
    hint: 'Indiquee sur la plaque signaletique de la chaudiere ou sur votre contrat d entretien. Attention : la puissance nominale est souvent surdimensionnee de 20 a 30%.',
    inputLabel: 'Puissance chaudiere',
    inputUnit: 'kW',
    inputType: 'number',
    next: 'pp_emetteurs',
  },
  {
    id: 'pp_emetteurs',
    section: 2,
    question: 'Quel type d emetteurs de chaleur ?',
    hint: 'Le type d emetteur determine la temperature de depart. Plus elle est basse, plus le rendement de la PAC est eleve.',
    options: [
      { label: 'Chauffage au sol', sublabel: 'Ideal — basse temperature = COP maximal', value: 'sol', next: 'pp_rafraichissement' },
      { label: 'Radiateurs classiques', sublabel: 'Des ventiloconvecteurs peuvent etre ajoutes pour le froid', value: 'radiateurs', next: 'pp_ventilos' },
      { label: 'Les deux', sublabel: 'Sol dans certaines pieces, radiateurs ailleurs', value: 'mixte', next: 'pp_rafraichissement' },
      { label: 'Pas encore decide', value: 'inconnu', next: 'pp_rafraichissement' },
    ],
  },
  {
    id: 'pp_ventilos',
    section: 2,
    question: 'Souhaitez-vous ajouter des ventiloconvecteurs ?',
    hint: 'Les ventiloconvecteurs permettent le rafraichissement estival dans les pieces equipees, en utilisant le meme circuit geothermique.',
    options: [
      { label: 'Oui, dans certaines pieces', sublabel: 'Salon, chambres ou bureau', value: 'oui', next: 'pp_rafraichissement' },
      { label: 'Non, radiateurs uniquement', value: 'non', next: 'pp_rafraichissement' },
    ],
  },
  {
    id: 'pp_rafraichissement',
    section: 2,
    question: 'Souhaitez-vous rafraichir votre maison en ete ?',
    hint: 'La geothermie permet un rafraichissement quasi-gratuit en ete par simple inversion du cycle — environ 5x moins cher qu une climatisation classique.',
    options: [
      { label: 'Oui, c est important pour moi', value: 'oui', next: 'pp_jardin' },
      { label: 'Non, uniquement le chauffage', value: 'non', next: 'pp_jardin' },
    ],
  },
  {
    id: 'pp_jardin',
    section: 3,
    question: 'Disposez-vous d un espace exterieur ?',
    hint: 'Un forage vertical n occupe qu environ 1 m2 en surface. La foreuse necessite un acces d au moins 2,5 m de large.',
    options: [
      { label: 'Jardin ou terrain disponible', sublabel: 'Superficie suffisante pour la foreuse', value: 'jardin', next: 'pp_acces' },
      { label: 'Espace exterieur limite', sublabel: 'Cour, terrasse ou petit jardin', value: 'limite', next: 'pp_acces' },
      { label: 'Pas d espace exterieur', sublabel: 'Forage depuis la voirie ou l interieur possible selon configuration', value: 'aucun', next: 'pp_acces' },
    ],
  },
  {
    id: 'pp_acces',
    section: 3,
    question: 'L acces pour la foreuse est-il possible ?',
    hint: 'La foreuse est un engin de chantier de 2,5 m de large et 8 m de long. Un portail ou un passage suffisamment large est necessaire.',
    options: [
      { label: 'Acces facile', sublabel: 'Portail large, pas d obstacle majeur', value: 'facile', next: 'pp_abords' },
      { label: 'Acces difficile', sublabel: 'Passage etroit, marches ou denivele', value: 'difficile', next: 'pp_abords' },
      { label: 'A verifier', sublabel: 'Je ne suis pas certain', value: 'averifier', next: 'pp_abords' },
    ],
  },
  {
    id: 'pp_abords',
    section: 3,
    question: 'Les abords vont-ils etre refaits ?',
    hint: 'Idealement, les forages sont realises avant la finition des abords. La remise en etat de surface est incluse dans notre prestation (trace d environ 30 cm).',
    options: [
      { label: 'Oui, les abords seront refaits', sublabel: 'Moment ideal pour integrer les forages', value: 'oui', next: 'pp_installateur' },
      { label: 'Non, les abords sont termines', sublabel: 'Remise en etat soignee incluse', value: 'non', next: 'pp_installateur' },
      { label: 'En cours de planification', value: 'encours', next: 'pp_installateur' },
    ],
  },
  {
    id: 'pp_installateur',
    section: 4,
    question: 'Avez-vous deja un installateur de pompe a chaleur ?',
    hint: 'Nous coordonnons avec l installateur pour un projet cle en main. Une copie du dossier technique lui sera transmise.',
    options: [
      { label: 'Oui, j ai deja un installateur', sublabel: 'Nous lui enverrons le dossier de forage', value: 'oui', next: 'pp_install_nom' },
      { label: 'Non, proposez-moi des partenaires', sublabel: 'Nous vous suggerons les installateurs certifies les plus proches', value: 'non', next: 'result_precis' },
      { label: 'Je gere moi-meme', sublabel: 'Vous recevrez les plans et le dossier technique complet', value: 'self', next: 'result_precis' },
    ],
  },
  {
    id: 'pp_install_nom',
    section: 4,
    type: 'input',
    question: 'Nom de votre installateur ?',
    hint: 'Nous lui transmettrons le dossier de forage pour coordination.',
    inputLabel: 'Nom ou entreprise',
    inputType: 'text',
    next: 'pp_install_contact',
  },
  {
    id: 'pp_install_contact',
    section: 4,
    type: 'input',
    question: 'Coordonnees de votre installateur ?',
    hint: 'Email ou telephone. Nous le contacterons pour coordonner le planning.',
    inputLabel: 'Email ou telephone',
    inputType: 'text',
    next: 'result_precis',
  },
]

export const TREE_PRO: TreeStep[] = [
  {
    id: 'pro_role',
    section: 2,
    question: 'Quel est votre role ?',
    hint: 'Cela nous permet de vous proposer le bon type d accompagnement et les bons interlocuteurs.',
    options: [
      { label: 'Architecte', value: 'archi', next: 'pro_objectif' },
      { label: 'Installateur', value: 'install', next: 'pro_objectif' },
      { label: 'Bureau d etudes', value: 'be', next: 'pro_objectif' },
      { label: 'Entreprise generale', value: 'eg', next: 'pro_objectif' },
      { label: 'Maitre d ouvrage ou promoteur', value: 'moa', next: 'pro_objectif' },
    ],
  },
  {
    id: 'pro_objectif',
    section: 2,
    question: 'Que recherchez-vous ?',
    hint: 'L espace soumission vous permet de deposer un projet complet et de recevoir une offre detaillee sous 48h.',
    options: [
      { label: 'Deposer un projet — espace soumission', sublabel: 'Plans, specs, timing — offre sous 48h', value: 'soumission', next: 'pro_espace' },
      { label: 'Obtenir une etude de faisabilite', sublabel: 'Analyse geothermique et dimensionnement', value: 'etude', next: 'pro_type_bien' },
    ],
  },
  {
    id: 'pro_type_bien',
    section: 2,
    question: 'Type de batiment ?',
    options: [
      { label: 'Hopital ou clinique', value: 'hopital', next: 'pro_puissance' },
      { label: 'Ecole ou institution publique', value: 'ecole', next: 'pro_puissance' },
      { label: 'Bureau ou tertiaire', value: 'bureau', next: 'pro_puissance' },
      { label: 'PME ou industrie legere', value: 'pme', next: 'pro_puissance' },
      { label: 'Hotel ou horeca', value: 'hotel', next: 'pro_puissance' },
      { label: 'Residentiel collectif', sublabel: 'Immeuble, logements sociaux', value: 'resid', next: 'pro_puissance' },
      { label: 'Autre', value: 'autre', next: 'pro_puissance' },
    ],
  },
  {
    id: 'pro_puissance',
    section: 2,
    question: 'Puissance thermique estimee ?',
    hint: 'Ordre de grandeur — peut etre affine lors de l etude. Au-dela de 1 MW, un reseau de chaleur geothermique peut etre envisage.',
    options: [
      { label: 'Moins de 50 kW', sublabel: 'Petit batiment', value: '<50', next: 'pro_phase' },
      { label: '50 a 200 kW', sublabel: 'Batiment de taille moyenne', value: '50-200', next: 'pro_phase' },
      { label: '200 kW a 1 MW', sublabel: 'Grand batiment', value: '200-1000', next: 'pro_phase' },
      { label: 'Plus de 1 MW', sublabel: 'Reseau de chaleur ou site industriel', value: '>1000', next: 'pro_phase' },
    ],
  },
  {
    id: 'pro_phase',
    section: 2,
    question: 'Phase du projet ?',
    hint: 'La maturite du projet determine le type d etude que nous pouvons produire.',
    options: [
      { label: 'Esquisse ou faisabilite', value: 'esquisse', next: 'result_precis' },
      { label: 'Avant-projet', value: 'avp', next: 'result_precis' },
      { label: 'Projet ou permis', value: 'projet', next: 'result_precis' },
      { label: 'Chantier imminent', sublabel: 'Intervention possible en urgence — appelez-nous', value: 'urgence', next: 'result_precis' },
    ],
  },
]

const ALL: TreeStep[] = [
  ...TREE_PART_RAPIDE,
  ...TREE_PART_PRECIS,
  ...TREE_PRO,
]

export function getStep(id: string): TreeStep | undefined {
  const all = [...TREE_COMMON_START, ...TREE_PART_RAPIDE, ...TREE_PART_PRECIS, ...TREE_PRO]
  return all.find((s) => s.id === id)
}

export const SECTION_LABELS: Record<number, string> = {
  1: 'Localisation et analyse',
  2: 'Dimensionnement',
  3: 'Faisabilite logistique',
  4: 'Installateur',
}

export function qualifyLead(answers: Record<string, any>): string {
  const surface = parseFloat(String(answers['a_surface'] || answers['b_surface'] || answers['c_surface_actuelle'] || '0'))
  const budget = String(answers['budget'] || '')
  const timing = String(answers['b_timing'] || answers['a_timing'] || '')
  const maturite = String(answers['maturite'] || '')

  const budgetOk = ['20-35k', '35-50k', '>50k'].includes(budget)
  const timingOk = ['asap', '<3m', '<6m', '<1an', 'permis', '6-12m'].includes(timing)
  const surfaceOk = surface >= 120

  if (surfaceOk && budgetOk && timingOk) return 'geothermie'
  if (['10-20k', '<10k'].includes(budget)) return 'pac_air_eau'
  if (maturite === 'reflexion' || budget === 'inconnu') return 'peu_mature'
  return 'conseiller'
}

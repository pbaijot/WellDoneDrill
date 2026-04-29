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

export const TREE_NEUF: TreeStep[] = [
  {
    id: 'a_type_logement',
    section: 2,
    sectionLabel: 'Nouvelle construction',
    question: 'Type de logement ?',
    options: [
      { label: 'Maison individuelle', value: 'maison', next: 'a_surface' },
      { label: 'Appartement', value: 'appart', next: 'a_surface' },
      { label: 'Immeuble a appartements', value: 'immeuble', next: 'a_surface' },
      { label: 'Petit collectif', value: 'collectif', next: 'a_surface' },
    ],
  },
  {
    id: 'a_surface',
    section: 2,
    sectionLabel: 'Nouvelle construction',
    type: 'input',
    question: 'Surface chauffee prevue ?',
    hint: 'Surface habitable totale, hors garage et caves non chauffees.',
    inputLabel: 'Surface',
    inputUnit: 'm2',
    inputType: 'number',
    next: 'a_peb',
  },
  {
    id: 'a_peb',
    section: 2,
    sectionLabel: 'Nouvelle construction',
    question: 'Niveau energetique vise ?',
    hint: 'Le niveau energetique influence directement la puissance necessaire de la PAC.',
    options: [
      { label: 'PEB A ou tres performant', sublabel: 'Maison passive ou basse energie', value: 'A', next: 'a_emetteurs' },
      { label: 'PEB B', sublabel: 'Bien isole, performance elevee', value: 'B', next: 'a_emetteurs' },
      { label: 'Standard reglementaire', value: 'std', next: 'a_emetteurs' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'a_emetteurs' },
    ],
  },
  {
    id: 'a_emetteurs',
    section: 2,
    sectionLabel: 'Nouvelle construction',
    question: 'Type d emetteurs de chaleur prevus ?',
    hint: 'Le chauffage au sol est ideal pour la geothermie — basse temperature = rendement maximal.',
    options: [
      { label: 'Chauffage au sol', value: 'sol', next: 'a_occupants' },
      { label: 'Radiateurs basse temperature', value: 'rbt', next: 'a_occupants' },
      { label: 'Ventilo-convecteurs', value: 'ventilos', next: 'a_occupants' },
      { label: 'Mixte', value: 'mixte', next: 'a_occupants' },
      { label: 'Pas encore defini', value: 'inconnu', next: 'a_occupants' },
    ],
  },
  {
    id: 'a_occupants',
    section: 2,
    sectionLabel: 'Nouvelle construction',
    question: 'Nombre d occupants prevus ?',
    hint: 'Influe sur le dimensionnement de la production d eau chaude sanitaire.',
    options: [
      { label: '1 ou 2 personnes', value: '1-2', next: 'objectifs' },
      { label: '3 ou 4 personnes', value: '3-4', next: 'objectifs' },
      { label: '5 ou 6 personnes', value: '5-6', next: 'objectifs' },
      { label: 'Plus de 6 personnes', value: '6+', next: 'objectifs' },
    ],
  },
]

export const TREE_RENOV: TreeStep[] = [
  {
    id: 'b_type_logement',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Type de logement ?',
    options: [
      { label: 'Maison individuelle', value: 'maison', next: 'b_annee' },
      { label: 'Appartement', value: 'appart', next: 'b_annee' },
      { label: 'Immeuble a appartements', value: 'immeuble', next: 'b_annee' },
      { label: 'Petit collectif', value: 'collectif', next: 'b_annee' },
    ],
  },
  {
    id: 'b_annee',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Annee de construction ?',
    options: [
      { label: 'Avant 1950', value: '<1950', next: 'b_renovation' },
      { label: '1950 a 1970', value: '1950-70', next: 'b_renovation' },
      { label: '1970 a 1990', value: '1970-90', next: 'b_renovation' },
      { label: '1990 a 2010', value: '1990-2010', next: 'b_renovation' },
      { label: 'Apres 2010', value: '>2010', next: 'b_renovation' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'b_renovation' },
    ],
  },
  {
    id: 'b_renovation',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Derniere renovation lourde ?',
    options: [
      { label: 'Jamais renove', value: 'jamais', next: 'b_surface' },
      { label: 'Avant 2000', value: '<2000', next: 'b_surface' },
      { label: '2000 a 2010', value: '2000-10', next: 'b_surface' },
      { label: '2010 a 2020', value: '2010-20', next: 'b_surface' },
      { label: 'Apres 2020', value: '>2020', next: 'b_surface' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'b_surface' },
    ],
  },
  {
    id: 'b_surface',
    section: 2,
    sectionLabel: 'Renovation',
    type: 'input',
    question: 'Surface chauffee actuelle ?',
    inputLabel: 'Surface',
    inputUnit: 'm2',
    inputType: 'number',
    next: 'b_chaudiere',
  },
  {
    id: 'b_chaudiere',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Systeme de chauffage actuel ?',
    options: [
      { label: 'Chaudiere gaz', value: 'gaz', next: 'b_puissance' },
      { label: 'Chaudiere mazout', value: 'mazout', next: 'b_puissance' },
      { label: 'Chauffage electrique', value: 'elec', next: 'b_conso' },
      { label: 'Pompe a chaleur existante', value: 'pac', next: 'b_emetteurs' },
      { label: 'Poele, pellets ou bois', value: 'bois', next: 'b_conso' },
      { label: 'Autre', value: 'autre', next: 'b_emetteurs' },
    ],
  },
  {
    id: 'b_puissance',
    section: 2,
    sectionLabel: 'Renovation',
    type: 'input',
    question: 'Puissance de votre chaudiere actuelle ?',
    hint: 'Indiquee sur la plaque signaletique ou le contrat d entretien. Laissez vide si inconnu.',
    inputLabel: 'Puissance',
    inputUnit: 'kW',
    inputType: 'number',
    optional: true,
    next: 'b_conso',
  },
  {
    id: 'b_conso',
    section: 2,
    sectionLabel: 'Renovation',
    type: 'input',
    question: 'Consommation ou facture annuelle ?',
    hint: 'Gaz en kWh/an, mazout en litres/an, ou votre facture annuelle en euros. Laissez vide si inconnu.',
    inputLabel: 'Consommation ou facture',
    inputType: 'text',
    optional: true,
    next: 'b_temp',
  },
  {
    id: 'b_temp',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Temperature de depart du chauffage actuel ?',
    hint: 'Une temperature basse indique un systeme compatible avec une PAC sans travaux.',
    options: [
      { label: 'Moins de 40 C', sublabel: 'Compatible PAC sans modification', value: '<40', next: 'b_emetteurs' },
      { label: '40 a 50 C', value: '40-50', next: 'b_emetteurs' },
      { label: '50 a 60 C', sublabel: 'Adaptation possible selon les emetteurs', value: '50-60', next: 'b_emetteurs' },
      { label: 'Plus de 60 C', sublabel: 'Remplacement des emetteurs probablement necessaire', value: '>60', next: 'b_emetteurs' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'b_emetteurs' },
    ],
  },
  {
    id: 'b_emetteurs',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Type d emetteurs actuels ?',
    options: [
      { label: 'Radiateurs classiques', value: 'radiateurs', next: 'b_confort' },
      { label: 'Radiateurs basse temperature', value: 'rbt', next: 'b_confort' },
      { label: 'Chauffage au sol', value: 'sol', next: 'b_confort' },
      { label: 'Ventilo-convecteurs', value: 'ventilos', next: 'b_confort' },
      { label: 'Mixte', value: 'mixte', next: 'b_confort' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'b_confort' },
    ],
  },
  {
    id: 'b_confort',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Le logement est-il bien chauffe aujourd hui ?',
    hint: 'Important pour interpreter correctement votre consommation actuelle.',
    options: [
      { label: 'Oui, partout', value: 'oui', next: 'b_travaux' },
      { label: 'Oui, mais certaines pieces sont limites', value: 'partiel', next: 'b_travaux' },
      { label: 'Non, il fait souvent trop froid', value: 'non', next: 'b_travaux' },
      { label: 'Je chauffe peu pour economiser', value: 'economie', next: 'b_travaux' },
    ],
  },
  {
    id: 'b_travaux',
    section: 2,
    sectionLabel: 'Renovation',
    type: 'multichoice',
    question: 'Travaux d amelioration energetique prevus ?',
    hint: 'Ces travaux influencent le dimensionnement — une meilleure isolation = PAC plus petite.',
    multiOptions: [
      { label: 'Isolation toiture', value: 'toiture' },
      { label: 'Isolation murs', value: 'murs' },
      { label: 'Remplacement chassis', value: 'chassis' },
      { label: 'Isolation sol', value: 'sol' },
      { label: 'Ventilation', value: 'ventilation' },
      { label: 'Aucun travaux prevu', value: 'aucun' },
      { label: 'Je ne sais pas', value: 'inconnu' },
    ],
    next: 'b_occupants',
  },
  {
    id: 'b_occupants',
    section: 2,
    sectionLabel: 'Renovation',
    question: 'Nombre d occupants ?',
    options: [
      { label: '1 ou 2 personnes', value: '1-2', next: 'objectifs' },
      { label: '3 ou 4 personnes', value: '3-4', next: 'objectifs' },
      { label: '5 ou 6 personnes', value: '5-6', next: 'objectifs' },
      { label: 'Plus de 6 personnes', value: '6+', next: 'objectifs' },
    ],
  },
]

export const TREE_EXTENSION: TreeStep[] = [
  {
    id: 'c_surface_actuelle',
    section: 2,
    sectionLabel: 'Extension',
    type: 'input',
    question: 'Surface actuelle chauffee ?',
    inputLabel: 'Surface actuelle',
    inputUnit: 'm2',
    inputType: 'number',
    next: 'c_surface_extension',
  },
  {
    id: 'c_surface_extension',
    section: 2,
    sectionLabel: 'Extension',
    type: 'input',
    question: 'Surface de l extension ?',
    inputLabel: 'Surface extension',
    inputUnit: 'm2',
    inputType: 'number',
    next: 'c_isolation',
  },
  {
    id: 'c_isolation',
    section: 2,
    sectionLabel: 'Extension',
    question: 'L extension sera-t-elle mieux isolee que le batiment existant ?',
    options: [
      { label: 'Oui', value: 'oui', next: 'c_systeme' },
      { label: 'Non', value: 'non', next: 'c_systeme' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'c_systeme' },
    ],
  },
  {
    id: 'c_systeme',
    section: 2,
    sectionLabel: 'Extension',
    question: 'Le systeme actuel chauffera-t-il aussi l extension ?',
    options: [
      { label: 'Oui, extension du systeme existant', value: 'extension', next: 'b_chaudiere' },
      { label: 'Non, systeme separe pour l extension', value: 'separe', next: 'b_chaudiere' },
      { label: 'Je veux remplacer tout le systeme', value: 'remplacement', next: 'b_chaudiere' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'b_chaudiere' },
    ],
  },
]

export const TREE_COMMON_END: TreeStep[] = [
  {
    id: 'objectifs',
    section: 3,
    sectionLabel: 'Vos objectifs',
    type: 'multichoice',
    question: 'Quels sont vos objectifs principaux ?',
    hint: 'Plusieurs reponses possibles.',
    multiOptions: [
      { label: 'Reduire ma facture energetique', value: 'facture' },
      { label: 'Remplacer une chaudiere vieillissante', value: 'chaudiere' },
      { label: 'Sortir du gaz ou du mazout', value: 'fossile' },
      { label: 'Reduire mes emissions de CO2', value: 'co2' },
      { label: 'Ajouter du rafraichissement en ete', value: 'froid' },
      { label: 'Valoriser mon bien immobilier', value: 'valorisation' },
      { label: 'Respecter une obligation reglementaire', value: 'reglementation' },
      { label: 'Comparer les options', value: 'comparer' },
    ],
    next: 'local_technique',
  },
  {
    id: 'local_technique',
    section: 3,
    sectionLabel: 'Vos objectifs',
    question: 'Disposez-vous d un local technique ?',
    hint: 'La PAC geothermique necessite environ 2 a 5 m2 pour le module interieur et le ballon.',
    options: [
      { label: 'Oui, grand local plus de 5 m2', value: '>5', next: 'budget' },
      { label: 'Oui, local de 2 a 5 m2', value: '2-5', next: 'budget' },
      { label: 'Oui, petit local moins de 2 m2', value: '<2', next: 'budget' },
      { label: 'Non', value: 'non', next: 'budget' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'budget' },
    ],
  },
  {
    id: 'budget',
    section: 3,
    sectionLabel: 'Vos objectifs',
    question: 'Budget envisage pour l ensemble du projet ?',
    hint: 'Forage + PAC + installation. Les primes regionales peuvent couvrir jusqu a 30% du cout total.',
    options: [
      { label: 'Moins de 10 000 EUR', value: '<10k', next: 'maturite' },
      { label: '10 000 a 20 000 EUR', value: '10-20k', next: 'maturite' },
      { label: '20 000 a 35 000 EUR', value: '20-35k', next: 'maturite' },
      { label: '35 000 a 50 000 EUR', value: '35-50k', next: 'maturite' },
      { label: 'Plus de 50 000 EUR', value: '>50k', next: 'maturite' },
      { label: 'Je ne sais pas', value: 'inconnu', next: 'maturite' },
    ],
  },
  {
    id: 'maturite',
    section: 3,
    sectionLabel: 'Vos objectifs',
    question: 'Ou en etes-vous dans votre reflexion ?',
    options: [
      { label: 'Simple reflexion', value: 'reflexion', next: 'contact' },
      { label: 'Je compare les solutions', value: 'comparaison', next: 'contact' },
      { label: 'J ai deja des offres', value: 'offres', next: 'contact' },
      { label: 'J ai un architecte ou installateur', value: 'partenaire', next: 'contact' },
      { label: 'Je suis pret a demander un devis', value: 'devis', next: 'contact' },
    ],
  },
  {
    id: 'contact',
    section: 4,
    sectionLabel: 'Vos coordonnees',
    type: 'contact',
    question: 'Vos coordonnees pour recevoir votre analyse',
    hint: 'Nous vous envoyons une synthese personnalisee. Aucun demarchage sans votre accord.',
    next: 'result',
  },
]

export function getStep(id: string): TreeStep | undefined {
  const all = [
    ...TREE_COMMON_START,
    ...TREE_NEUF,
    ...TREE_RENOV,
    ...TREE_EXTENSION,
    ...TREE_COMMON_END,
  ]
  return all.find((s) => s.id === id)
}

export const SECTION_LABELS: Record<number, string> = {
  1: 'Localisation et analyse du sous-sol',
  2: 'Votre projet',
  3: 'Vos objectifs',
  4: 'Vos coordonnees',
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

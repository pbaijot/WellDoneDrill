import type { TreeStep } from './types'

export const TREE_PART: TreeStep[] = [
  {
    id: 'p_type_projet',
    question: 'Quel est votre projet ?',
    hint: 'Cela nous permet d orienter le dimensionnement de votre installation.',
    options: [
      { label: 'Construction neuve', sublabel: 'Maison ou appartement en cours de construction', value: 'neuf', next: 'p_type_bien' },
      { label: 'Remplacement de chaudiere', sublabel: 'Gaz, mazout ou electrique', value: 'remplacement', next: 'p_type_bien' },
      { label: 'Renovation lourde', sublabel: 'Isolation, nouvelle affectation ou extension', value: 'renovation', next: 'p_type_bien' },
    ],
  },
  {
    id: 'p_type_bien',
    question: 'Quel type de bien ?',
    hint: 'La geometrie du batiment influence le dimensionnement et le nombre de sondes.',
    options: [
      { label: 'Maison 4 facades', sublabel: 'Maison individuelle non mitoyenne', value: '4f', next: 'p_superficie' },
      { label: 'Maison 3 facades', sublabel: 'Mitoyenne d un cote', value: '3f', next: 'p_superficie' },
      { label: 'Maison mitoyenne', sublabel: 'Mitoyenne des deux cotes', value: 'mito', next: 'p_superficie' },
      { label: 'Appartement', sublabel: 'En copropriete — le forage peut etre partage', value: 'appart', next: 'p_superficie' },
    ],
  },
  {
    id: 'p_superficie',
    question: 'Quelle est la superficie chauffee ?',
    hint: 'Surface habitable totale, hors garage et caves non chauffes.',
    options: [
      { label: 'Moins de 100 m2', value: '<100', next: 'p_occupants' },
      { label: '100 a 200 m2', value: '100-200', next: 'p_occupants' },
      { label: '200 a 350 m2', value: '200-350', next: 'p_occupants' },
      { label: 'Plus de 350 m2', sublabel: 'Une etude de dimensionnement detaillee sera necessaire', value: '>350', next: 'p_occupants' },
    ],
  },
  {
    id: 'p_occupants',
    question: 'Combien de personnes vivent sous votre toit ?',
    hint: 'Le nombre d occupants influe sur la production d eau chaude sanitaire.',
    options: [
      { label: '1 ou 2 personnes', value: '1-2', next: 'dim_choice' },
      { label: '3 ou 4 personnes', value: '3-4', next: 'dim_choice' },
      { label: '5 personnes ou plus', value: '5+', next: 'dim_choice' },
    ],
  },
]

export const TREE_PART_PRECIS: TreeStep[] = [
  {
    id: 'pp_besoin',
    question: 'Quel est votre besoin thermique connu ?',
    hint: 'Ces informations nous permettent de calculer la puissance exacte de votre pompe a chaleur.',
    options: [
      { label: 'J ai un certificat PEB', sublabel: 'Nous utiliserons votre score energetique', value: 'peb', next: 'pp_emetteurs' },
      { label: 'Je connais la puissance de ma chaudiere', sublabel: 'En kW — indiquee sur votre contrat ou chaudiere', value: 'puissance', next: 'pp_emetteurs' },
      { label: 'Je ne sais pas', sublabel: 'On estime sur base de votre superficie et du type de bien', value: 'inconnu', next: 'pp_emetteurs' },
    ],
  },
  {
    id: 'pp_emetteurs',
    question: 'Quel type de chauffage avez-vous ou prevoyez-vous ?',
    hint: 'Le type d emetteur determine la temperature de depart — un critere cle pour le rendement de la PAC.',
    options: [
      { label: 'Chauffage au sol', sublabel: 'Existant ou prevu — ideal pour la geothermie', value: 'sol', next: 'pp_rafraichissement' },
      { label: 'Radiateurs classiques', sublabel: 'Des ventiloconvecteurs peuvent etre ajoutes pour le froid', value: 'radiateurs', next: 'pp_rafraichissement' },
      { label: 'Les deux', value: 'mixte', next: 'pp_rafraichissement' },
      { label: 'Pas encore decide', value: 'inconnu', next: 'pp_rafraichissement' },
    ],
  },
  {
    id: 'pp_rafraichissement',
    question: 'Souhaitez-vous rafraichir votre maison en ete ?',
    hint: 'La geothermie permet un rafraichissement quasi-gratuit en ete en inversant simplement le cycle. Environ 5x moins cher qu une climatisation classique.',
    options: [
      { label: 'Oui, c est un vrai plus', sublabel: 'Rafraichissement passif via le circuit geothermique', value: 'oui', next: 'pp_abords' },
      { label: 'Non, uniquement le chauffage', value: 'non', next: 'pp_abords' },
    ],
  },
  {
    id: 'pp_abords',
    question: 'Avez-vous un jardin ou un espace exterieur ?',
    hint: 'Un forage vertical ne necessite qu environ 1 m2 en surface. Meme un petit jardin suffit.',
    options: [
      { label: 'Oui, jardin disponible', value: 'jardin', next: 'pp_abords_travaux' },
      { label: 'Peu d espace exterieur', value: 'peu', next: 'pp_abords_travaux' },
    ],
  },
  {
    id: 'pp_abords_travaux',
    question: 'Les abords vont-ils etre refaits ?',
    hint: 'Idealement, les forages sont realises avant la finition des abords. La remise en etat est incluse dans notre prestation.',
    options: [
      { label: 'Oui, les abords seront refaits', sublabel: 'Moment ideal pour integrer les forages', value: 'oui', next: 'pp_installateur' },
      { label: 'Non, les abords sont finis', sublabel: 'La trace du forage fait environ 30 cm', value: 'non', next: 'pp_installateur' },
    ],
  },
  {
    id: 'pp_installateur',
    question: 'Avez-vous deja un installateur de pompe a chaleur ?',
    hint: 'Nous coordonnons avec l installateur pour un projet cle en main. Une copie du dossier lui sera transmise.',
    options: [
      { label: 'Oui, j ai deja un installateur', sublabel: 'Nous lui enverrons une copie du devis', value: 'oui', next: 'result_precis' },
      { label: 'Non, proposez-moi des installateurs', sublabel: 'Nous vous suggerons les 3 plus proches de chez vous', value: 'non', next: 'result_precis' },
      { label: 'Je gere moi-meme', value: 'self', next: 'result_precis' },
    ],
  },
]

export const TREE_PRO: TreeStep[] = [
  {
    id: 'pro_role',
    question: 'Quel est votre role ?',
    hint: 'Cela nous permet de vous proposer le bon type d accompagnement.',
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
    question: 'Que recherchez-vous ?',
    hint: 'L espace soumission vous permet de deposer un projet complet et de recevoir une offre sous 48h.',
    options: [
      { label: 'Acceder a l espace soumission', sublabel: 'Deposez votre projet, plans et specifications', value: 'soumission', next: 'pro_espace' },
      { label: 'Obtenir une etude ou un dimensionnement', sublabel: 'Nous evaluons la faisabilite et le potentiel geothermique', value: 'etude', next: 'pro_type_bien' },
    ],
  },
  {
    id: 'pro_type_bien',
    question: 'Type de batiment ?',
    options: [
      { label: 'Hopital ou clinique', value: 'hopital', next: 'pro_puissance' },
      { label: 'Ecole ou institution publique', value: 'ecole', next: 'pro_puissance' },
      { label: 'Bureau ou tertiaire', value: 'bureau', next: 'pro_puissance' },
      { label: 'PME ou industrie legere', value: 'pme', next: 'pro_puissance' },
      { label: 'Hotel ou horeca', value: 'hotel', next: 'pro_puissance' },
      { label: 'Residentiel collectif', sublabel: 'Immeuble a appartements, logements sociaux', value: 'resid', next: 'pro_puissance' },
      { label: 'Autre', value: 'autre', next: 'pro_puissance' },
    ],
  },
  {
    id: 'pro_puissance',
    question: 'Puissance thermique estimee ?',
    hint: 'Ordre de grandeur pour orienter le dimensionnement. Peut etre affine lors de l etude.',
    options: [
      { label: 'Moins de 50 kW', sublabel: 'Petit batiment', value: '<50', next: 'pro_phase' },
      { label: '50 a 200 kW', sublabel: 'Batiment de taille moyenne', value: '50-200', next: 'pro_phase' },
      { label: '200 kW a 1 MW', sublabel: 'Grand batiment', value: '200-1000', next: 'pro_phase' },
      { label: 'Plus de 1 MW', sublabel: 'Un reseau de chaleur geothermique peut etre envisage', value: '>1000', next: 'pro_phase' },
    ],
  },
  {
    id: 'pro_phase',
    question: 'Phase du projet ?',
    hint: 'La maturite du projet determine le type d etude que nous pouvons produire.',
    options: [
      { label: 'Esquisse ou faisabilite', value: 'esquisse', next: 'address' },
      { label: 'Avant-projet', value: 'avp', next: 'address' },
      { label: 'Projet ou permis', value: 'projet', next: 'address' },
      { label: 'Chantier imminent', sublabel: 'Contactez-nous directement — intervention possible en urgence', value: 'urgence', next: 'address' },
    ],
  },
]

export function getStep(id: string): TreeStep | undefined {
  return [
    ...TREE_PART,
    ...TREE_PART_PRECIS,
    ...TREE_PRO,
  ].find((s) => s.id === id)
}

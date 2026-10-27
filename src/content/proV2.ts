import type {AppLocale} from '@/src/i18n/routes'

export type ProSegmentKey = 'pro_chauffagistes' | 'pro_architectes' | 'pro_entrepreneurs'

/* ─────────────────────────────────────────────
   V2 COPY — written around each segment's primary need
   HVAC installers: their business runs (more jobs, no friction, client stays theirs)
   Architects & engineers: a high-performance, innovative solution for their projects
   Contractors & developers: a reliable drilling partner
   Sanity fields take precedence; this is the French fallback and the source used
   to seed Sanity (scripts/migrate-v2-content.ts). Other languages use their CMS content.
───────────────────────────────────────────── */

export type Lang = 'fr' | 'nl' | 'en' | 'de'

export const LANG: Record<AppLocale, Lang> = {
  'be-fr': 'fr', 'fr-fr': 'fr', 'lu-fr': 'fr',
  'be-nl': 'nl', 'lu-de': 'de',
  'be-en': 'en', 'fr-en': 'en', 'lu-en': 'en',
}

export const UI_V2: Record<Lang, {ctaAnalysis: string; understandGeo: string; startProject: string; heroAlt: Record<ProSegmentKey, string>; processAlt: string}> = {
  fr: {ctaAnalysis: 'Demander une analyse gratuite', understandGeo: 'Comprendre la géothermie', startProject: 'Démarrer un projet', heroAlt: {pro_chauffagistes: 'Installation de pompe à chaleur géothermique', pro_architectes: 'Projet résidentiel équipé en géothermie', pro_entrepreneurs: 'Chantier de forage géothermique WellDoneDrill'}, processAlt: 'Foreuse WellDoneDrill en action sur un chantier'},
  nl: {ctaAnalysis: 'Gratis analyse aanvragen', understandGeo: 'Geothermie begrijpen', startProject: 'Een project starten', heroAlt: {pro_chauffagistes: 'Installatie van een geothermische warmtepomp', pro_architectes: 'Woonproject met geothermie', pro_entrepreneurs: 'Geothermische boorwerf van WellDoneDrill'}, processAlt: 'Boorinstallatie van WellDoneDrill aan het werk'},
  en: {ctaAnalysis: 'Request a free analysis', understandGeo: 'Understand geothermal energy', startProject: 'Start a project', heroAlt: {pro_chauffagistes: 'Geothermal heat pump installation', pro_architectes: 'Residential project equipped with geothermal energy', pro_entrepreneurs: 'WellDoneDrill geothermal drilling site'}, processAlt: 'WellDoneDrill drilling rig at work on a site'},
  de: {ctaAnalysis: 'Kostenlose Analyse anfragen', understandGeo: 'Geothermie verstehen', startProject: 'Projekt starten', heroAlt: {pro_chauffagistes: 'Installation einer Erdwärmepumpe', pro_architectes: 'Wohnprojekt mit Geothermie', pro_entrepreneurs: 'Geothermie-Bohrstelle von WellDoneDrill'}, processAlt: 'Bohrgerät von WellDoneDrill im Einsatz'},
}

export type Item = {title: string; body: string}

export type ProCopy = {
  heroCtaPrimary?: string
  heroCtaSecondary?: string
  heroSubtitle?: string
  heroPanelItems?: {label: string; value: string; sub?: string}[]
  contextTitle: string
  contextIntro: string
  usps: Item[]
  whyTitle: string
  whyItems: Item[]
  processTitle: string
  processIntro: string
  processSteps: Item[]
}

export const PRO_COPY_FR: Record<ProSegmentKey, ProCopy> = {
  pro_chauffagistes: {
    contextTitle: 'Vos clients demandent la géothermie. Soyez prêts à leur répondre.',
    contextIntro:
      "Des prix de l'énergie instables et la sortie progressive des chaudières fossiles poussent vos clients vers la géothermie. Avec un partenaire forage fiable, vous pouvez leur dire oui sans changer de métier.",
    usps: [
      {title: 'Plus de chantiers', body: 'Une offre que vos concurrents sans foreur ne peuvent pas proposer.'},
      {title: 'Zéro charge administrative', body: 'Permis, analyse du sous-sol et déclarations sont gérés par WDD.'},
      {title: 'Votre client reste le vôtre', body: 'Vous restez son unique interlocuteur, WDD fore en sous-traitance.'},
    ],
    whyTitle: "Six raisons d'ajouter la géothermie à votre offre.",
    whyItems: [
      {title: 'Des chantiers à plus forte valeur', body: "Pour un même client, un projet géothermique représente un chantier plus important qu'une pompe à chaleur air-eau."},
      {title: 'Zéro friction administrative', body: "WellDoneDrill gère les permis de forage, l'analyse du sous-sol et les déclarations officielles. Vous restez concentré sur votre métier."},
      {title: 'Un planning sur lequel compter', body: 'Le délai de forage est communiqué dès la signature de votre client, pour que vous planifiiez la pose de la PAC sans attente.'},
      {title: 'Votre client, votre contrat', body: "Vous restez l'unique interlocuteur de votre client. WellDoneDrill intervient en sous-traitance, en toute discrétion."},
      {title: 'Des outils pour vendre', body: 'Fiches techniques, supports commerciaux et calculateur d’économies pour présenter la géothermie avec confiance.'},
      {title: 'Des clients qui viennent à vous', body: 'Les particuliers qui contactent WellDoneDrill cherchent un installateur PAC dans leur région. Nos partenaires sont recommandés en premier.'},
    ],
    processTitle: 'Comment fonctionne le partenariat.',
    processIntro: 'Un fonctionnement simple, pensé pour que votre activité tourne sans accroc.',
    processSteps: [
      {title: 'Prise de contact', body: 'Parlez-nous de votre activité et de votre zone d’intervention. Réponse sous 48 h.'},
      {title: 'Analyse gratuite', body: "Envoyez l'adresse de votre client : nous analysons gratuitement la faisabilité du forage."},
      {title: 'Forage', body: 'WellDoneDrill fore en 1 à 3 jours, permis et déclarations compris, et remet le terrain en état.'},
      {title: 'Pose de la PAC', body: "Vous installez la pompe à chaleur dans la foulée et restez l'interlocuteur de votre client."},
    ],
  },

  pro_architectes: {
    heroCtaPrimary: 'Demander une analyse gratuite',
    heroPanelItems: [
      {label: 'Résultat PEB standard', value: 'PEB A', sub: 'géothermie fermée, tous projets'},
      {label: 'Délai analyse préliminaire', value: '72 h', sub: 'rapport PDF livré par email'},
      {label: 'Impact visuel extérieur', value: 'Zéro', sub: 'pas de groupe, pas de contrainte'},
    ],
    heroSubtitle:
      "WellDoneDrill analyse gratuitement le sous-sol de vos projets dès l'esquisse et vous fournit les pièces techniques pour votre dossier de permis. Sans risque de promesse non tenue.",
    contextTitle: 'Une solution performante et innovante, sans compromis architectural.',
    contextIntro:
      "Vos maîtres d'ouvrage attendent des bâtiments sobres, confortables et durables. La géothermie fermée chauffe et rafraîchit sans groupe extérieur ni nuisance, et s'intègre au projet dès l'esquisse.",
    usps: [
      {title: 'Performante', body: 'Chauffage et rafraîchissement à haut rendement, toute l’année.'},
      {title: 'Invisible', body: 'Aucun groupe extérieur, aucun bruit, aucune contrainte de façade.'},
      {title: 'Sécurisée dès l’esquisse', body: 'Analyse gratuite du sous-sol avant d’engager le projet.'},
    ],
    whyTitle: "Six raisons d'intégrer la géothermie dans vos projets.",
    whyItems: [
      {title: 'Une performance énergétique de haut niveau', body: 'La géothermie fermée vise les meilleurs niveaux PEB, en chauffage comme en rafraîchissement.'},
      {title: 'Aucun compromis architectural', body: "Pas de groupe extérieur, pas d'impact thermique en façade. Vos partis pris architecturaux restent intacts."},
      {title: "Analyse gratuite dès l'esquisse", body: "Nous analysons le sous-sol de vos projets dès l'esquisse. Vous savez si c'est faisable avant de l'intégrer au programme."},
      {title: 'Les pièces pour vos dossiers', body: 'Pièces techniques au format attendu par les services urbanistiques, intégrables dans votre note de calcul PEB.'},
      {title: 'Un dimensionnement précis', body: 'Profondeur et nombre de forages déterminés au plus juste. Empreinte au sol minimisée, planning maîtrisé.'},
      {title: 'Un ingénieur à vos côtés', body: "Un ingénieur WellDoneDrill suit votre dossier de l'esquisse à la réception, en lien avec votre bureau d'études fluides."},
    ],
    processTitle: "De l'esquisse à la réception.",
    processIntro: 'Quatre étapes pour intégrer la géothermie à votre projet, techniquement et administrativement.',
    processSteps: [
      {title: 'Transmission du projet', body: 'Adresse, programme, surfaces et phase du projet. Retour de faisabilité sous 72 h.'},
      {title: 'Analyse gratuite du sous-sol', body: 'Rapport préliminaire au format PDF, rédigé pour être intégré à votre dossier.'},
      {title: 'Dimensionnement', body: 'Champ de sondes dimensionné selon le projet, note de calcul pour votre dossier PEB.'},
      {title: 'Permis et forage', body: 'WellDoneDrill dépose les demandes de permis de forage et réalise les travaux dans le calendrier du chantier.'},
    ],
  },

  pro_entrepreneurs: {
    heroCtaSecondary: 'Voir nos réalisations',
    contextTitle: 'Un partenaire forage sur qui vous pouvez compter.',
    contextIntro:
      'Sur un chantier, le forage ne doit jamais devenir le lot qui bloque les autres. WellDoneDrill s’engage sur un planning, gère ses permis et livre des sondes testées, prêtes à raccorder.',
    usps: [
      {title: 'Fiable', body: 'Un planning engagé et respecté, intégré à votre calendrier.'},
      {title: 'Un seul contrat', body: 'Permis, analyse, forage et remise en état : un seul interlocuteur.'},
      {title: 'Responsable', body: 'WellDoneDrill assume ses travaux, responsabilité civile comprise.'},
    ],
    whyTitle: 'Six raisons de confier vos forages à WellDoneDrill.',
    whyItems: [
      {title: 'Des délais tenus', body: 'Intervention en phase gros œuvre, avant les dallages, sans perturber les autres corps de métier.'},
      {title: 'Un seul contrat, un seul interlocuteur', body: 'Permis, analyse, forage et remise en état du terrain : tout le lot géothermie chez un seul partenaire.'},
      {title: 'Zéro démarche administrative', body: "WellDoneDrill dépose et suit toutes les demandes d'autorisation de forage."},
      {title: 'Des sondes prêtes à raccorder', body: 'Sondes livrées testées, terrain remis en état dès la fin du forage.'},
      {title: 'Un dossier as-built complet', body: "Documentation de réception et certificats pour votre dossier et pour l'acquéreur."},
      {title: "Des économies d'échelle", body: 'Pour les projets multi-unités, un champ de sondes partagé réduit le coût par logement.'},
    ],
    processTitle: "De l'analyse à la remise des clés.",
    processIntro: "Cinq étapes gérées par WellDoneDrill. Vous nous transmettez l'adresse et le programme, nous faisons le reste.",
    processSteps: [
      {title: 'Analyse gratuite', body: "Transmettez l'adresse et le programme : analyse du sous-sol et budget prévisionnel sous 5 jours."},
      {title: 'Offre et planning', body: 'Offre clé en main, planning intégré à votre calendrier de chantier.'},
      {title: 'Permis de forage', body: "WellDoneDrill dépose et suit les demandes d'autorisation."},
      {title: 'Forage', body: 'Intervention en phase gros œuvre, sondes testées, terrain remis en état.'},
      {title: 'Dossier as-built', body: 'Documentation de réception et certificats remis à la livraison.'},
    ],
  },
}

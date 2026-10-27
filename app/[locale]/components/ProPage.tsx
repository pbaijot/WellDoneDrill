'use client'

import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {getLocalizedPath, type AppLocale, PHONE_BY_LOCALE} from '@/src/i18n/routes'
import type {ProPageData} from '@/src/lib/proPage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'
import {FloatingInfoPanel} from './FloatingInfoPanel'
import {urlFor} from '@/src/lib/sanityImage'
import DemarrerCTA from './DemarrerCTA'
import {Reveal, ContactCta, FaqItem, ContextMedia} from './V2Blocks'
import {
  CalendarCheck, EyeOff, FileCheck, FileSignature, Gauge, Handshake, ScanSearch, ShieldCheck, TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import {
  BELGIUM_PROVINCES,
  getProvinceName,
  getProvincePageUrl,
  getProvinceSlug,
  chantierImageUrl,
  TYPE_LABEL,
  SECTOR_LABEL,
  localizedProvince,
  type Province,
  type Chantier,
} from '@/src/lib/referencesPage'

/* ─────────────────────────────────────────────
   SEGMENT DEFAULTS
───────────────────────────────────────────── */

type SegmentKey = 'pro_chauffagistes' | 'pro_architectes' | 'pro_entrepreneurs'

type SegmentDefaults = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroCtaPrimary: string
  heroCtaSecondary: string
  heroImage: string
  heroPanelItems: [{label: string; value: string; sub?: string}, {label: string; value: string; sub?: string}, {label: string; value: string; sub?: string}]
  contextEyebrow: string
  contextTitle: string
  contextBody: string
  contextMarkers: {marker: string; text: string}[]
  contextImage: string
  contextVideo?: string
  whyTitle: string
  whyCtaLabel: string
  whyItems: {title: string; body: string}[]
  etapesTitle: string
  etapesIntro: string
  etapes: {title: string; body: string}[]
  faqTitle: string
  faqSubtitle: string
  faqCtaLabel: string
  faqs: {question: string; answer: string}[]
  // map section
  mapTitle: string
  mapSelectProvince: string
  mapAllProvinces: string
  mapEmpty: string
  mapCtaAll: string
  mapCtaProvince: (name: string) => string
  mapCountry: string
  // mobile sticky CTA
  stickyStart: string
  stickyCall: string
}

const SEGMENT_DEFAULTS: Record<SegmentKey, SegmentDefaults> = {

  /* ── CHAUFFAGISTES ── */
  pro_chauffagistes: {
    heroEyebrow: 'Partenaires installateurs',
    heroTitle: 'Géothermie :\najoutez le forage à votre offre.',
    heroSubtitle:
      "WellDoneDrill fore, vous installez la PAC. Un partenariat clair qui vous ouvre un marché à forte valeur ajoutée — sans charge administrative, sans investissement propre.",
    heroCtaPrimary: 'Devenir partenaire WDD',
    heroCtaSecondary: 'Voir nos réalisations',
    heroImage: '/images/pac.jpg',
    heroPanelItems: [
      {label: 'Revenu par projet géothermique', value: '×2–3', sub: 'vs PAC air-air standard'},
      {label: 'Apport clients WDD partenaires', value: 'Inclus', sub: 'référencement sur notre réseau'},
      {label: 'Délai de réponse à vos demandes', value: '48 h', sub: 'planification forage garantie'},
    ],
    contextEyebrow: 'Contexte du marché',
    contextTitle: "Le marché change. Votre offre doit changer avec lui.",
    contextBody:
      "L'interdiction des chaudières gaz pour les bâtiments neufs en 2026, combinée à la flambée des prix de l'énergie, crée une demande structurelle pour les solutions géothermiques. Vos clients se tournent vers les chauffagistes capables de proposer une alternative complète. Ceux qui ne peuvent pas y répondre perdent des chantiers.",
    contextMarkers: [
      {marker: '2026', text: "Fin des chaudières gaz neuves — directive UE déjà en vigueur"},
      {marker: '+180 %', text: "Hausse du prix du gaz depuis 2021 — accélérateur de décision client"},
      {marker: '×2–3', text: "Revenu moyen d'un chantier géothermique vs PAC air-air"},
    ],
    contextImage: '/images/foreuse-wide.jpg',
    whyTitle: "Six raisons de proposer la géothermie à vos clients.",
    whyCtaLabel: "Démarrer mon projet",
    whyItems: [
      {title: "Revenu par projet multiplié", body: "Un chantier géothermique génère en moyenne 2 à 3 fois plus qu'une installation PAC air-air. Même client, même surface — plus de valeur créée, plus de marge pour vous."},
      {title: "Zéro friction administrative", body: "WellDoneDrill gère les permis de forage, les études de sol et les déclarations officielles. Vous restez concentré sur votre cœur de métier."},
      {title: "Planning prioritaire garanti", body: "Nos partenaires installateurs sont prioritaires dans notre carnet de chantiers. Le délai de forage est communiqué et contractuellement respecté dès la signature de votre client."},
      {title: "Kit commercial clé en main", body: "Brochures, fiches techniques, calculateurs d'économies adaptés à vos clients : tout pour que vous puissiez présenter et vendre la géothermie avec confiance."},
      {title: "La législation dans votre sens", body: "L'interdiction des chaudières gaz dès 2026 crée une demande que vos concurrents sans partenaire forage ne peuvent pas satisfaire. Prenez de l'avance maintenant."},
      {title: "Apport de clients WDD", body: "Les clients WellDoneDrill cherchent un installateur PAC certifié dans leur région. Les partenaires du réseau sont référencés en premier dans nos recommandations."},
    ],
    etapesTitle: "Comment fonctionne le partenariat ?",
    etapesIntro: "Un processus conçu pour que vous gardiez le contrôle total sur votre relation client, tout en accédant à notre expertise forage et à notre réseau.",
    etapes: [
      {title: "Candidature partenaire", body: "Soumettez votre profil : certification PAC, zone géographique, volume annuel estimé. Réponse sous 5 jours."},
      {title: "Onboarding & kit", body: "Accès au portail partenaire WDD, tarification préférentielle, documentation commerciale et technique."},
      {title: "Premier projet commun", body: "WDD intervient pour le forage selon votre planning. Vous installez la PAC dans la foulée."},
      {title: "Votre client, votre contrat", body: "Vous êtes et restez l'unique interlocuteur de votre client. WDD intervient en sous-traitance invisible."},
    ],
    faqTitle: "Questions fréquentes des installateurs.",
    faqSubtitle: "Une question ne figure pas ici ? Contactez directement notre équipe.",
    faqCtaLabel: "Poser ma question",
    faqs: [
      {question: "Je ne suis pas encore certifié PAC géothermique — puis-je devenir partenaire ?", answer: "Oui. Si vous êtes certifié pour les PAC en général (Qualipac ou équivalent), vous pouvez candidater. WDD peut vous orienter vers les formations de certification géothermique reconnues en Belgique et au Luxembourg."},
      {question: "Quel est le tarif WDD pour les partenaires ?", answer: "Nous ne publions pas de tarif public. Après validation de votre candidature, vous recevez une grille tarifaire partenaire confidentielle, basée sur votre volume annuel et votre zone géographique."},
      {question: "Comment se coordonne le planning de chantier ?", answer: "WDD intervient en premier (forage : 1 à 3 jours). Vous planifiez l'installation PAC dans les jours qui suivent. Notre planning est communiqué dès la signature de votre client."},
      {question: "WDD peut-il contacter directement mes clients ?", answer: "Non. Votre relation client est intacte. WDD intervient en tant que sous-traitant ; vos clients ne connaissent notre implication que si vous le souhaitez."},
      {question: "Quelle est la zone géographique couverte ?", answer: "Belgique et Grand-Duché de Luxembourg, toutes provinces. Extension en France du Nord et de l'Est à l'étude pour 2025–2026."},
    ],
    mapTitle: "Nos projets en",
    mapSelectProvince: "Sélectionnez une province",
    mapAllProvinces: "Toutes les provinces",
    mapEmpty: "Aucun projet répertorié dans cette province pour le moment.",
    mapCtaAll: "Voir toutes nos réalisations",
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    mapCountry: "Belgique",
    stickyStart: "Démarrer mon projet",
    stickyCall: "Appeler WDD",
  },

  /* ── ARCHITECTES ── */
  pro_architectes: {
    heroEyebrow: "Architectes & bureaux d'études",
    heroTitle: "Dimensionnez la géothermie\ndès la conception.",
    heroSubtitle:
      "WellDoneDrill fournit l'étude géologique préliminaire dont vous avez besoin pour intégrer la géothermie dans vos projets dès l'esquisse — sans risque de promesse non tenue, avec les pièces techniques pour votre dossier de permis.",
    heroCtaPrimary: "Demander une étude préliminaire",
    heroCtaSecondary: "Voir nos réalisations",
    heroImage: '/images/abricotiers-2.jpg',
    heroPanelItems: [
      {label: 'Résultat PEB standard', value: 'PEB A', sub: 'géothermie fermée, tous projets'},
      {label: 'Délai étude préliminaire', value: '72 h', sub: 'rapport PDF livré par email'},
      {label: 'Impact visuel extérieur', value: 'Zéro', sub: 'pas de groupe, pas de contrainte'},
    ],
    contextEyebrow: 'Contexte réglementaire',
    contextTitle: "PEB A sans compromis architecturaux.",
    contextBody:
      "La réglementation NZEB exige des niveaux de performance énergétique de plus en plus stricts pour tout nouveau permis en Belgique et au Luxembourg. La géothermie fermée est la seule solution qui atteint systématiquement le PEB A — sans groupe extérieur visible, sans contrainte thermique en façade, sans bruit.",
    contextMarkers: [
      {marker: 'NZEB', text: "Bâtiments à énergie quasi nulle — norme pour tout permis en Belgique"},
      {marker: 'PEB A', text: "Géothermie fermée → résultat standard, sans exception"},
      {marker: '0 %', text: "Impact visuel extérieur — pas de groupe, pas de contrainte de façade"},
    ],
    contextImage: '/images/abricotiers-2.jpg',
    contextVideo: '/videos/abricotiers.mp4',
    whyTitle: "Six bonnes raisons d'intégrer la géothermie dans vos projets.",
    whyCtaLabel: "Demander une étude",
    whyItems: [
      {title: "PEB A sans compromis architecturaux", body: "La géothermie fermée ne génère aucune contrainte visuelle. Pas de groupe extérieur, pas d'impact thermique en façade. Vos partis pris architecturaux restent intacts."},
      {title: "Étude préliminaire gratuite à l'esquisse", body: "WDD réalise l'analyse du sous-sol de vos projets dès l'esquisse. Vous savez si c'est faisable avant de l'intégrer dans votre programme."},
      {title: "Documentation pour permis et PEB", body: "Nous fournissons les pièces techniques au format attendu par les services urbanistiques belges et luxembourgeois — intégrables directement dans votre note de calcul PEB."},
      {title: "Dimensionnement précis, pas de surprises", body: "Notre modélisation géologique détermine la profondeur et le nombre de forages exactement nécessaires. Empreinte au sol minimisée, planning maîtrisé."},
      {title: "Interlocuteur technique dédié", body: "Un ingénieur WDD suit votre dossier de l'esquisse à la réception. Disponible pour vos questions, vos coordinateurs de sécurité et vos BE fluides."},
      {title: "Coordination BE fluides native", body: "WDD travaille régulièrement avec des bureaux d'études thermiques et fluides. Nous fournissons les données géologiques et le dimensionnement, le BE intègre la PAC et le réseau."},
    ],
    etapesTitle: "De l'esquisse à la réception.",
    etapesIntro: "Quatre étapes claires pour intégrer la géothermie dans votre projet architecturalement et administrativement.",
    etapes: [
      {title: "Soumission du projet", body: "Transmettez l'adresse et les données de base : type de projet, surface, nombre d'unités, phase. Retour de faisabilité sous 72h."},
      {title: "Étude géologique préliminaire", body: "Analyse des données géologiques belges et luxembourgeoises. Rapport préliminaire livré au format PDF, rédigé pour être intégré à votre dossier."},
      {title: "Dimensionnement intégré", body: "WDD dimensionne le champ de sondes en fonction du projet architectural. Note de calcul intégrée à votre dossier PEB et à votre plan de masse."},
      {title: "Permis & réalisation", body: "WDD dépose et suit les demandes de permis de forage. Réalisation dans le calendrier de chantier, coordination directe avec votre maître d'œuvre."},
    ],
    faqTitle: "Vos questions d'architecte.",
    faqSubtitle: "Une question ne figure pas ici ? Contactez directement notre équipe.",
    faqCtaLabel: "Poser ma question",
    faqs: [
      {question: "À quelle phase du projet dois-je contacter WDD ?", answer: "Dès l'esquisse, idéalement. Plus tôt vous intégrez la géothermie dans le programme, plus les solutions de dimensionnement sont optimales et les contraintes de chantier prévisibles."},
      {question: "Quelle est l'empreinte au sol des forages ?", answer: "Chaque sonde occupe environ 0,1 m² au niveau du sol. L'engin de forage nécessite une zone d'accès de 3 × 6 m pendant les travaux. Aucune infrastructure permanente n'est visible après réalisation."},
      {question: "Quelle différence entre géothermie fermée et ouverte pour un architecte ?", answer: "La géothermie fermée (sondes verticales) convient à la quasi-totalité des projets : faible empreinte, applicable partout, aucune dépendance à la nappe phréatique. La géothermie ouverte est réservée aux sites avec nappe accessible et débit suffisant."},
      {question: "Le rapport préliminaire est-il utilisable dans un dossier de permis ?", answer: "Oui. Il est rédigé dans ce but et comprend les références réglementaires belges et luxembourgeoises, les données de profondeur et de débit estimé, et les coordonnées GPS pour l'implantation des forages."},
      {question: "WDD peut-il collaborer avec mon bureau d'études fluides ?", answer: "Absolument. WDD fournit les données géologiques et le dimensionnement du champ de sondes ; le BE fluides intègre la PAC et le réseau de distribution. Cette coordination est notre mode de travail habituel."},
    ],
    mapTitle: "Nos projets en",
    mapSelectProvince: "Sélectionnez une province",
    mapAllProvinces: "Toutes les provinces",
    mapEmpty: "Aucun projet répertorié dans cette province pour le moment.",
    mapCtaAll: "Voir toutes nos réalisations",
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    mapCountry: "Belgique",
    stickyStart: "Démarrer mon projet",
    stickyCall: "Appeler WDD",
  },

  /* ── ENTREPRENEURS ── */
  pro_entrepreneurs: {
    heroEyebrow: 'Promoteurs & entrepreneurs généraux',
    heroTitle: "La géothermie en\nsous-traitance clé en main.",
    heroSubtitle:
      "WellDoneDrill prend en charge le forage géothermique de vos chantiers résidentiels et tertiaires — permis, géologie, réalisation, documentation as-built. Vous bâtissez, nous forons.",
    heroCtaPrimary: "Démarrer un projet géothermique",
    heroCtaSecondary: "Demander une étude",
    heroImage: '/images/abricotiers.jpg',
    heroPanelItems: [
      {label: 'Valorisation vente avec géothermie', value: '+8–12 %', sub: 'vs logement PAC air-air'},
      {label: 'Certification énergétique standard', value: 'PEB A', sub: 'argument décisif pour les acheteurs'},
      {label: 'Responsabilité pour le forage', value: '1 contrat', sub: 'permis, géologie, réalisation'},
    ],
    contextEyebrow: 'Valeur ajoutée',
    contextTitle: "La géothermie comme argument de vente — et d'obligation.",
    contextBody:
      "Les acheteurs comparent les charges énergétiques avant de signer. Un logement géothermique affiche un PEB A et des charges prévisibles pour 50 ans. Les promoteurs qui l'intègrent dès la conception ferment plus vite et à de meilleures conditions. Et la réglementation NZEB va rendre ce niveau incontournable pour tout nouveau permis.",
    contextMarkers: [
      {marker: '+8–12 %', text: "Valeur de revente — logement géothermique vs PAC air-air en Belgique"},
      {marker: 'PEB A', text: "Résultat standard — argument décisif pour acheteurs et locataires premium"},
      {marker: 'NZEB', text: "Obligation progressive pour tout nouveau permis en Belgique & Luxembourg"},
    ],
    contextImage: '/images/foreuse-close-up.jpg',
    whyTitle: "Six raisons d'intégrer la géothermie dans votre prochain projet.",
    whyCtaLabel: "Démarrer un projet géothermique",
    whyItems: [
      {title: "Premium de valeur mesurable", body: "En Belgique, un logement géothermique se revend en moyenne 8 à 12 % plus cher qu'un équivalent PAC air-air. Le surcoût de forage est généralement amorti dès la première transaction."},
      {title: "PEB A — l'argument qui ferme", body: "Un certificat PEB A est devenu un critère de décision pour les acheteurs et locataires premium. La géothermie y conduit systématiquement, sans exception ni aléa."},
      {title: "Sous-traitant responsable, un contrat", body: "WDD prend en charge les permis, études, forage et remise en état du terrain. Un seul contrat, une seule garantie, un seul interlocuteur pour tout le volet géothermique."},
      {title: "Planning intégré à votre chantier", body: "Nous intervenons en phase gros œuvre, avant les dallages, sans perturber les autres corps de métier. Les délais sont contractuellement engagés."},
      {title: "Économies d'échelle pour les lotissements", body: "Pour les projets multi-unités, WDD optimise un champ de sondes partagé : même puissance, moins de mètres forés. Le coût par unité diminue significativement avec le volume."},
      {title: "Matériel marketing inclus", body: "WDD fournit les données chiffrées, certifications et labels pour intégrer la géothermie dans votre communication promotionnelle. Un argument de vente documenté et crédible."},
    ],
    etapesTitle: "De la faisabilité à la remise des clés.",
    etapesIntro: "Cinq étapes entièrement gérées par WDD. Votre seul travail : nous transmettre l'adresse et le programme.",
    etapes: [
      {title: "Étude de faisabilité", body: "Transmettez l'adresse et le programme. WDD analyse la géologie et remet une étude avec budget prévisionnel sous 5 jours."},
      {title: "Devis & planning", body: "Offre clé en main (forage + permis + coordination). Planning intégré à votre calendrier de chantier."},
      {title: "Permis de forage", body: "WDD dépose et suit toutes les demandes d'autorisation. Zéro démarche administrative de votre côté."},
      {title: "Forage & mise en service", body: "Intervention en phase gros œuvre. Remise en état du terrain immédiate. Sondes livrées testées et prêtes à raccorder."},
      {title: "Dossier as-built complet", body: "Documentation de réception, certificats de garantie, dossier notarié et documents pour l'acquéreur."},
    ],
    faqTitle: "Questions fréquentes des promoteurs.",
    faqSubtitle: "Une question ne figure pas ici ? Contactez directement notre équipe.",
    faqCtaLabel: "Poser ma question",
    faqs: [
      {question: "La géothermie est-elle adaptée aux projets résidentiels collectifs ?", answer: "Oui, et c'est même là qu'elle est la plus efficiente. Un champ de sondes partagé pour un immeuble à appartements ou un lotissement réduit significativement le coût par unité. WDD dimensionne le champ en fonction du programme complet."},
      {question: "Comment WDD s'intègre-t-il à mon planning général de chantier ?", answer: "Nous planifions l'intervention de forage avec votre conducteur de travaux dès la signature du contrat. L'intervention se fait généralement avant les dallages — en phase gros œuvre — sans interférer avec les autres corps de métier."},
      {question: "Quel est le délai entre la commande et le démarrage du forage ?", answer: "En général 4 à 8 semaines, le temps d'instruire les permis de forage. Nous planifions ce délai en amont pour qu'il ne crée aucun retard dans votre calendrier."},
      {question: "Qui est responsable en cas de dommage pendant le forage ?", answer: "WDD est entièrement responsable de ses travaux de forage. Notre responsabilité civile couvre les dommages éventuels aux tiers, aux réseaux et aux ouvrages adjacents."},
      {question: "Peut-on prévoir la géothermie pour seulement une partie des unités ?", answer: "Oui. Nous dimensionnons le champ de sondes selon le programme que vous définissez — que ce soit pour l'ensemble du projet ou pour une tranche spécifique."},
    ],
    mapTitle: "Nos projets en",
    mapSelectProvince: "Sélectionnez une province",
    mapAllProvinces: "Toutes les provinces",
    mapEmpty: "Aucun projet répertorié dans cette province pour le moment.",
    mapCtaAll: "Voir toutes nos réalisations",
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    mapCountry: "Belgique",
    stickyStart: "Démarrer mon projet",
    stickyCall: "Appeler WDD",
  },
}

/* ─────────────────────────────────────────────
   LOCALE-SPECIFIC OVERRIDES (map + sticky CTA)
───────────────────────────────────────────── */

type LocaleOverrides = Pick<SegmentDefaults,
  'heroCtaSecondary' | 'mapTitle' | 'mapSelectProvince' | 'mapAllProvinces' |
  'mapEmpty' | 'mapCtaAll' | 'mapCtaProvince' | 'stickyStart' | 'stickyCall'
> & {mapCountry: string}

const LOCALE_OVERRIDES: Record<AppLocale, LocaleOverrides> = {
  'be-fr': {
    heroCtaSecondary: 'Voir nos réalisations',
    mapTitle: 'Nos projets en', mapCountry: 'Belgique',
    mapSelectProvince: 'Sélectionnez une province',
    mapAllProvinces: 'Toutes les provinces',
    mapEmpty: 'Nous sommes en train de mettre à jour nos références pour cette province.',
    mapCtaAll: 'Voir toutes nos réalisations',
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    stickyStart: 'Démarrer mon projet',
    stickyCall: 'Appeler WDD',
  },
  'be-nl': {
    heroCtaSecondary: 'Onze realisaties bekijken',
    mapTitle: 'Onze projecten in', mapCountry: 'België',
    mapSelectProvince: 'Selecteer een provincie',
    mapAllProvinces: 'Alle provincies',
    mapEmpty: 'We werken momenteel onze referenties voor deze provincie bij.',
    mapCtaAll: 'Alle realisaties bekijken',
    mapCtaProvince: (name) => `Alle projecten in ${name}`,
    stickyStart: 'Mijn project starten',
    stickyCall: 'WDD bellen',
  },
  'fr-fr': {
    heroCtaSecondary: 'Voir nos réalisations',
    mapTitle: 'Nos projets en', mapCountry: 'Belgique',
    mapSelectProvince: 'Sélectionnez une région',
    mapAllProvinces: 'Toutes les régions',
    mapEmpty: 'Nous sommes en train de mettre à jour nos références pour cette région.',
    mapCtaAll: 'Voir toutes nos réalisations',
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    stickyStart: 'Démarrer mon projet',
    stickyCall: 'Appeler WDD',
  },
  'lu-fr': {
    heroCtaSecondary: 'Voir nos réalisations',
    mapTitle: 'Nos projets en', mapCountry: 'Belgique',
    mapSelectProvince: 'Sélectionnez une région',
    mapAllProvinces: 'Toutes les régions',
    mapEmpty: 'Nous sommes en train de mettre à jour nos références pour cette région.',
    mapCtaAll: 'Voir toutes nos réalisations',
    mapCtaProvince: (name) => `Tous les projets en ${name}`,
    stickyStart: 'Démarrer mon projet',
    stickyCall: 'Appeler WDD',
  },
  'lu-de': {
    heroCtaSecondary: 'Unsere Realisierungen ansehen',
    mapTitle: 'Unsere Projekte in', mapCountry: 'Belgien',
    mapSelectProvince: 'Region auswählen',
    mapAllProvinces: 'Alle Regionen',
    mapEmpty: 'Wir aktualisieren derzeit unsere Referenzen für diese Region.',
    mapCtaAll: 'Alle Realisierungen ansehen',
    mapCtaProvince: (name) => `Alle Projekte in ${name}`,
    stickyStart: 'Mein Projekt starten',
    stickyCall: 'WDD anrufen',
  },
  'be-en': {
    heroCtaSecondary: 'See our projects',
    mapTitle: 'Our projects in', mapCountry: 'Belgium',
    mapSelectProvince: 'Select a province',
    mapAllProvinces: 'All provinces',
    mapEmpty: 'We are currently updating our projects for this province.',
    mapCtaAll: 'See all our projects',
    mapCtaProvince: (name) => `All projects in ${name}`,
    stickyStart: 'Start my project',
    stickyCall: 'Call WDD',
  },
  'fr-en': {
    heroCtaSecondary: 'See our projects',
    mapTitle: 'Our projects in', mapCountry: 'Belgium',
    mapSelectProvince: 'Select a region',
    mapAllProvinces: 'All regions',
    mapEmpty: 'We are currently updating our projects for this region.',
    mapCtaAll: 'See all our projects',
    mapCtaProvince: (name) => `All projects in ${name}`,
    stickyStart: 'Start my project',
    stickyCall: 'Call WDD',
  },
  'lu-en': {
    heroCtaSecondary: 'See our projects',
    mapTitle: 'Our projects in', mapCountry: 'Belgium',
    mapSelectProvince: 'Select a region',
    mapAllProvinces: 'All regions',
    mapEmpty: 'We are currently updating our projects for this region.',
    mapCtaAll: 'See all our projects',
    mapCtaProvince: (name) => `All projects in ${name}`,
    stickyStart: 'Start my project',
    stickyCall: 'Call WDD',
  },
}

/* ─────────────────────────────────────────────
   WHY ICONS
───────────────────────────────────────────── */

const WHY_ICONS = [
  <svg key="0" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a3 3 0 10-3 5h3a3 3 0 010 6H9M12 7v1m0 8v1"/></svg>,
  <svg key="1" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
  <svg key="2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  <svg key="3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  <svg key="4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M3 12h18M5 12l-2-4 9-4 9 4-2 4M5 12v6M19 12v6"/></svg>,
  <svg key="5" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
]

/* ─────────────────────────────────────────────
   V2 COPY — written around each segment's primary need
   HVAC installers: their business runs (more jobs, no friction, client stays theirs)
   Architects & engineers: a high-performance, innovative solution for their projects
   Contractors & developers: a reliable drilling partner
   French only for now; other languages fall back to the CMS / segment defaults.
───────────────────────────────────────────── */

type Lang = 'fr' | 'nl' | 'en' | 'de'

const LANG: Record<AppLocale, Lang> = {
  'be-fr': 'fr', 'fr-fr': 'fr', 'lu-fr': 'fr',
  'be-nl': 'nl', 'lu-de': 'de',
  'be-en': 'en', 'fr-en': 'en', 'lu-en': 'en',
}

const UI_V2: Record<Lang, {ctaAnalysis: string; understandGeo: string; startProject: string}> = {
  fr: {ctaAnalysis: 'Demander une analyse gratuite', understandGeo: 'Comprendre la géothermie', startProject: 'Démarrer un projet'},
  nl: {ctaAnalysis: 'Gratis analyse aanvragen', understandGeo: 'Geothermie begrijpen', startProject: 'Een project starten'},
  en: {ctaAnalysis: 'Request a free analysis', understandGeo: 'Understand geothermal energy', startProject: 'Start a project'},
  de: {ctaAnalysis: 'Kostenlose Analyse anfragen', understandGeo: 'Geothermie verstehen', startProject: 'Projekt starten'},
}

type Item = {title: string; body: string}

type ProCopy = {
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

const USP_ICONS: Record<SegmentKey, LucideIcon[]> = {
  pro_chauffagistes: [TrendingUp, FileCheck, Handshake],
  pro_architectes: [Gauge, EyeOff, ScanSearch],
  pro_entrepreneurs: [CalendarCheck, FileSignature, ShieldCheck],
}

const PRO_COPY_FR: Record<SegmentKey, ProCopy> = {
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

/* ─────────────────────────────────────────────
   MAP SECTION
───────────────────────────────────────────── */

const PER_PAGE = 4

function matchesProvince(c: Chantier, p: Province): boolean {
  if (!c.province) return false
  if (c.province === p.slug) return true
  const cp = c.province.toLowerCase()
  return cp.includes(p.nameFr.toLowerCase()) || cp.includes(p.nameNl.toLowerCase())
}

function ProjetCard({chantier: c, locale}: {chantier: Chantier; locale: AppLocale}) {
  const imgUrl = chantierImageUrl(c.photo, 600)
  return (
    <div className="group bg-wdd-clay overflow-hidden flex flex-col h-[248px] rounded-sm">
      {imgUrl ? (
        <div className="relative h-32 overflow-hidden shrink-0">
          <Image
            src={imgUrl}
            alt={c.title ?? 'Projet WellDoneDrill'}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-32 bg-black/4 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-black/8 select-none">WDD</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-1">
          {c.type && (
            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${c.type === 'fermee' ? 'bg-wdd-yellow text-wdd-black' : 'border border-black/20 text-black/50'}`}>
              {TYPE_LABEL[locale][c.type as 'fermee' | 'ouverte'] ?? c.type}
            </span>
          )}
          {c.sector && (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black/12 text-black/40">
              {SECTOR_LABEL[locale][c.sector] ?? c.sector}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug line-clamp-3">{c.title ?? 'Projet géothermique'}</h3>
        {(c.location || c.province) && (
          <p className="text-xs font-light text-black/40 truncate mt-auto">
            {[c.location, localizedProvince(c.province, locale)].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}

function ProProjetsSection({locale, chantiers, d}: {locale: AppLocale; chantiers: Chantier[]; d: SegmentDefaults}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const selectedProvince = selectedId ? BELGIUM_PROVINCES.find((p) => p.id === selectedId) ?? null : null

  const filtered = selectedProvince
    ? chantiers.filter((c) => matchesProvince(c, selectedProvince))
    : chantiers

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const displayed = filtered.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE)

  const handleProvinceClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
    setPage(0)
  }

  const ctaHref = selectedProvince
    ? getProvincePageUrl(locale, getProvinceSlug(selectedProvince, locale))
    : getLocalizedPath(locale, 'references')
  const ctaLabel = selectedProvince
    ? d.mapCtaProvince(getProvinceName(selectedProvince, locale))
    : d.mapCtaAll

  return (
    <section className="bg-white min-h-screen flex flex-col justify-center px-8 md:px-16 py-20 lg:py-0">
      <div className="max-w-screen-2xl mx-auto w-full">

        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold leading-tight">
            {d.mapTitle} <span className="text-wdd-mud">{d.mapCountry}</span>
          </h2>
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setPage(0) }}
              className="text-xs font-light text-black/35 hover:text-black/70 transition-colors underline underline-offset-2 shrink-0"
            >
              {d.mapAllProvinces}
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <svg viewBox="55 350 940 730" preserveAspectRatio="xMidYMid meet" className="w-full">
              {BELGIUM_PROVINCES.map((p) => (
                <path
                  key={p.id}
                  d={p.path}
                  fill={selectedId === p.id || hovered === p.id ? '#FFD950' : 'transparent'}
                  stroke="#B0A89E"
                  strokeWidth={0.4}
                  strokeLinejoin="round"
                  style={{cursor: 'pointer', transition: 'fill 0.15s', pointerEvents: 'all'}}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleProvinceClick(p.id)}
                />
              ))}
            </svg>
            <div className="h-5 mt-1">
              <span className="text-sm font-light text-black/40">
                {hovered
                  ? getProvinceName(BELGIUM_PROVINCES.find((p) => p.id === hovered)!, locale)
                  : selectedProvince
                    ? getProvinceName(selectedProvince, locale)
                    : d.mapSelectProvince}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="min-h-[520px] grid grid-cols-2 gap-3 content-start relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedId ?? '__all__'}-${safePage}`}
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{duration: 0.18}}
                  className="contents"
                >
                  {displayed.length === 0 ? (
                    <div className="col-span-2 h-[520px] flex items-center justify-center text-sm font-light text-black/35">
                      {d.mapEmpty}
                    </div>
                  ) : (
                    <>
                      {displayed.map((c) => (
                        <ProjetCard key={c._id} chantier={c} locale={locale} />
                      ))}
                      {Array.from({length: PER_PAGE - displayed.length}).map((_, i) => (
                        <div key={`ph-${i}`} className="bg-wdd-clay/30 h-[248px] rounded-sm" />
                      ))}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {totalPages > 1 && Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`transition-all duration-200 rounded-full ${i === safePage ? 'w-5 h-2 bg-wdd-black' : 'w-2 h-2 bg-black/20 hover:bg-black/45'}`}
                  />
                ))}
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-wdd-black hover:text-wdd-mud transition-colors shrink-0"
              >
                <span>{ctaLabel}</span>
                <span className="text-wdd-yellow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function ProPage({page, locale, chantiers = [], settings}: {page: ProPageData; locale: AppLocale; chantiers?: Chantier[]; settings?: GlobalSettingsData | null}) {
  const segment = (page.routeKey ?? 'pro_chauffagistes') as SegmentKey
  const d = {...SEGMENT_DEFAULTS[segment], ...LOCALE_OVERRIDES[locale]}
  const lang = LANG[locale]
  const ui = UI_V2[lang]
  const fr = lang === 'fr' ? PRO_COPY_FR[segment] : null

  const contactHref = getLocalizedPath(locale, 'contact')

  const faqs = page.faqs && page.faqs.length > 0
    ? page.faqs.map(f => ({question: f.question ?? '', answer: f.answer ?? ''}))
    : d.faqs

  // French uses the V2 copy; other languages keep the CMS content until it is translated
  const contextTitle = fr?.contextTitle ?? page.valueTitle ?? d.contextTitle
  const contextIntro = fr?.contextIntro ?? page.valueIntro ?? d.contextBody
  const usps = fr?.usps ?? []
  const whyTitle = fr?.whyTitle ?? page.whyTitle ?? d.whyTitle
  const whyItems: {title?: string; body?: string}[] = fr?.whyItems
    ?? (page.valueItems && page.valueItems.length > 0 ? page.valueItems : d.whyItems)
  const processTitle = fr?.processTitle ?? page.partnershipTitle ?? d.etapesTitle
  const processIntro = fr?.processIntro ?? page.partnershipIntro ?? d.etapesIntro
  const processSteps: {title?: string; body?: string}[] = fr?.processSteps
    ?? (page.partnershipSteps && page.partnershipSteps.length > 0 ? page.partnershipSteps : d.etapes)

  const contextVideoUrl = page.contextVideo?.asset?.url ?? d.contextVideo ?? null
  const contextImage = page.contextImage ? urlFor(page.contextImage)?.url() ?? d.contextImage : d.contextImage
  const uspIcons = USP_ICONS[segment]

  return (
    <div className="flex flex-col bg-white">

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section className="h-[90vh] relative overflow-hidden px-8 md:px-16">

        {/* Left — dark earth image (desktop only) */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <Image
            src="/images/wdd-geothermie_fermee-terre.webp"
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-center scale-[1.04]"
            style={{filter: 'saturate(1.5) blur(0.8px)'}}
            priority
          />
          <div className="absolute inset-0 bg-wdd-black/30" />
        </div>

        {/* Right — segment image: full-width on mobile, right-half on desktop */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 z-[2]">
          <Image
            src={page.heroRightImage ? urlFor(page.heroRightImage)?.url() ?? d.heroImage : d.heroImage}
            alt="WellDoneDrill"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-wdd-black/55 lg:bg-transparent" />
          <div className="hidden lg:block absolute bottom-8 right-8 z-10">
            <FloatingInfoPanel
              items={
                fr?.heroPanelItems ?? (page.heroPanelItems && page.heroPanelItems.length > 0
                  ? page.heroPanelItems.map(i => ({label: i.label ?? '', value: i.value ?? '', sub: i.sub}))
                  : d.heroPanelItems)
              }
            />
          </div>
        </div>

        {/* Logo centred */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none">
          <Image src="/images/small-white-logo-droit.png" alt="WellDoneDrill" width={144} height={144} className="object-contain" />
        </div>

        {/* Content */}
        <div className="relative z-[3] max-w-screen-2xl mx-auto h-[90vh] flex items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 py-24">

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6 whitespace-pre-line">
              {page.heroTitle ?? d.heroTitle}
            </h1>

            <p className="text-base font-normal text-white leading-relaxed max-w-lg mb-10">
              {fr?.heroSubtitle ?? page.heroSubtitle ?? d.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={contactHref}
                className="bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
              >
                {fr?.heroCtaPrimary ?? page.heroCtaLabel ?? d.heroCtaPrimary}
              </Link>
              <Link
                href={getLocalizedPath(locale, 'references')}
                className="px-7 py-3.5 text-sm font-semibold border-2 border-white/30 text-white/80 hover:border-white hover:text-white transition-colors rounded-sm"
              >
                {fr?.heroCtaSecondary ?? page.heroCtaSecondary ?? d.heroCtaSecondary}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. LE BESOIN — texte, USP et CTA à gauche, média à droite (même hauteur)
      ══════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">{contextTitle}</h2>
              <p className="mt-6 text-base font-light text-black/60 leading-8">{contextIntro}</p>
            </Reveal>
            {usps.length > 0 && (
              <div className="mt-10 grid gap-5 max-w-xl">
                {usps.map((usp, i) => {
                  const Icon = uspIcons[i] ?? uspIcons[0]
                  return (
                    <Reveal key={usp.title} delay={i * 0.1} className="flex items-center gap-4">
                      <span className="shrink-0 w-10 h-10 rounded-sm bg-wdd-yellow text-wdd-black flex items-center justify-center">
                        <Icon size={20} strokeWidth={1.75} />
                      </span>
                      <div>
                        <div className="text-base font-bold leading-snug">{usp.title}</div>
                        <div className="mt-1 text-sm font-light text-black/60 leading-snug">{usp.body}</div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            )}
            <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ContactCta href={contactHref} label={ui.ctaAnalysis} />
              <Link
                href={getLocalizedPath(locale, 'geo_fermee')}
                className="group inline-flex items-center gap-2 text-sm font-bold text-wdd-black underline underline-offset-4 decoration-wdd-yellow decoration-2 hover:text-wdd-mud transition-colors"
              >
                {ui.understandGeo}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Same height as the text column: the media is cropped in width only */}
          <Reveal delay={0.1} className="relative overflow-hidden rounded-sm bg-wdd-clay aspect-video lg:aspect-auto">
            <ContextMedia videoUrl={contextVideoUrl} imageUrl={contextImage} cover />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. SIX RAISONS — grille bento
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay py-28 md:py-36 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <Reveal>
            <h2 className="max-w-3xl text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">{whyTitle}</h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {whyItems.map((item, i) => {
              if (i === 0) {
                return (
                  <Reveal key={i} className="md:col-span-2 lg:row-span-2">
                    <div className="h-full min-h-[22rem] bg-wdd-yellow rounded-sm p-8 md:p-10 flex flex-col justify-between">
                      <div className="text-wdd-black">{WHY_ICONS[0]}</div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{item.title}</h3>
                        <p className="mt-4 text-base text-black/70 leading-7 max-w-md">{item.body}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              }
              return (
                <Reveal key={i} delay={(i % 4) * 0.06} className={i === 5 ? 'lg:col-span-2' : ''}>
                  <div className="h-full bg-white rounded-sm p-7 flex flex-col gap-6">
                    <div className="text-wdd-mud">{WHY_ICONS[i] ?? WHY_ICONS[0]}</div>
                    <div>
                      <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                      <p className="mt-2 text-sm font-light text-black/55 leading-6">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
            <Reveal className="md:col-span-2">
              <Link
                href={contactHref}
                className="group h-full min-h-[10rem] bg-wdd-black text-white rounded-sm p-7 flex items-end justify-between gap-6 hover:bg-wdd-black/90 transition-colors"
              >
                <span className="text-2xl font-bold leading-tight max-w-xs">{ui.startProject}</span>
                <span className="shrink-0 w-12 h-12 rounded-full bg-wdd-yellow text-wdd-black flex items-center justify-center text-xl font-bold group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. LE PROCESS — étapes à gauche, photo pleine demi-page à droite
      ══════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="relative px-8 md:px-16 py-28 md:py-36">
          <div className="max-w-screen-2xl mx-auto w-full">
            <div className="lg:w-1/2 lg:pr-16">
              <Reveal>
                <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">{processTitle}</h2>
                <p className="mt-6 text-base font-light text-black/60 leading-8">{processIntro}</p>
              </Reveal>
              <ol className="relative mt-12 space-y-8 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-black/10">
                {processSteps.map((s, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <li className="relative flex gap-5">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-wdd-yellow text-wdd-black flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <div className="pt-1">
                        <div className="font-bold leading-snug">{s.title}</div>
                        <div className="mt-1 text-sm font-light text-black/60 leading-6">{s.body}</div>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
              <Reveal>
                <ContactCta href={contactHref} label={ui.ctaAnalysis} className="mt-10" />
              </Reveal>
            </div>
          </div>
        </div>
        <div className="relative aspect-square lg:aspect-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2">
          <Image
            src="/images/wdd-chantier-drone.jpg"
            alt="Foreuse WellDoneDrill en action sur un chantier"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[62%_center]"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. RÉALISATIONS
      ══════════════════════════════════════ */}
      <ProProjetsSection locale={locale} chantiers={chantiers} d={d} />

      <DemarrerCTA locale={locale} settings={settings} />

      {/* ══════════════════════════════════════
          6. FAQ
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay py-28 md:py-32 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">
          <Reveal>
            <h2 className="text-4xl font-bold mb-4 leading-[1.05] tracking-tight">
              {page.faqTitle ?? d.faqTitle}
            </h2>
            <p className="text-base font-light text-black/55 leading-7 mb-8">
              {page.faqSubtitle ?? d.faqSubtitle}
            </p>
            <Link
              href={contactHref}
              className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
            >
              {page.faqCtaLabel ?? d.faqCtaLabel}
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2 bg-white rounded-sm px-6 md:px-10">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STICKY MOBILE CTA
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-wdd-black border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <Link
          href={contactHref}
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-black bg-wdd-yellow border-2 border-wdd-yellow rounded-sm"
        >
          {d.stickyStart}
        </Link>
        <a
          href={`tel:${PHONE_BY_LOCALE[locale].replace(/\s/g, '')}`}
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-yellow border-2 border-wdd-yellow hover:bg-wdd-yellow hover:text-wdd-black transition-colors rounded-sm"
        >
          {d.stickyCall}
        </a>
      </div>

    </div>
  )
}

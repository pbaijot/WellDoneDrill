'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {ProPageData} from '@/src/lib/proPage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'
import {FloatingInfoPanel} from './FloatingInfoPanel'
import {urlFor} from '@/src/lib/sanityImage'
import DemarrerCTA from './DemarrerCTA'
import {
  BELGIUM_PROVINCES,
  getProvinceName,
  getProvincePageUrl,
  chantierImageUrl,
  sectorLabel,
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
  whyItems: {title: string; body: string}[]
  etapesTitle: string
  etapesIntro: string
  etapes: {title: string; body: string}[]
  faqTitle: string
  faqs: {question: string; answer: string}[]
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
    faqs: [
      {question: "Je ne suis pas encore certifié PAC géothermique — puis-je devenir partenaire ?", answer: "Oui. Si vous êtes certifié pour les PAC en général (Qualipac ou équivalent), vous pouvez candidater. WDD peut vous orienter vers les formations de certification géothermique reconnues en Belgique et au Luxembourg."},
      {question: "Quel est le tarif WDD pour les partenaires ?", answer: "Nous ne publions pas de tarif public. Après validation de votre candidature, vous recevez une grille tarifaire partenaire confidentielle, basée sur votre volume annuel et votre zone géographique."},
      {question: "Comment se coordonne le planning de chantier ?", answer: "WDD intervient en premier (forage : 1 à 3 jours). Vous planifiez l'installation PAC dans les jours qui suivent. Notre planning est communiqué dès la signature de votre client."},
      {question: "WDD peut-il contacter directement mes clients ?", answer: "Non. Votre relation client est intacte. WDD intervient en tant que sous-traitant ; vos clients ne connaissent notre implication que si vous le souhaitez."},
      {question: "Quelle est la zone géographique couverte ?", answer: "Belgique et Grand-Duché de Luxembourg, toutes provinces. Extension en France du Nord et de l'Est à l'étude pour 2025–2026."},
    ],
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
    faqs: [
      {question: "À quelle phase du projet dois-je contacter WDD ?", answer: "Dès l'esquisse, idéalement. Plus tôt vous intégrez la géothermie dans le programme, plus les solutions de dimensionnement sont optimales et les contraintes de chantier prévisibles."},
      {question: "Quelle est l'empreinte au sol des forages ?", answer: "Chaque sonde occupe environ 0,1 m² au niveau du sol. L'engin de forage nécessite une zone d'accès de 3 × 6 m pendant les travaux. Aucune infrastructure permanente n'est visible après réalisation."},
      {question: "Quelle différence entre géothermie fermée et ouverte pour un architecte ?", answer: "La géothermie fermée (sondes verticales) convient à la quasi-totalité des projets : faible empreinte, applicable partout, aucune dépendance à la nappe phréatique. La géothermie ouverte est réservée aux sites avec nappe accessible et débit suffisant."},
      {question: "Le rapport préliminaire est-il utilisable dans un dossier de permis ?", answer: "Oui. Il est rédigé dans ce but et comprend les références réglementaires belges et luxembourgeoises, les données de profondeur et de débit estimé, et les coordonnées GPS pour l'implantation des forages."},
      {question: "WDD peut-il collaborer avec mon bureau d'études fluides ?", answer: "Absolument. WDD fournit les données géologiques et le dimensionnement du champ de sondes ; le BE fluides intègre la PAC et le réseau de distribution. Cette coordination est notre mode de travail habituel."},
    ],
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
    faqs: [
      {question: "La géothermie est-elle adaptée aux projets résidentiels collectifs ?", answer: "Oui, et c'est même là qu'elle est la plus efficiente. Un champ de sondes partagé pour un immeuble à appartements ou un lotissement réduit significativement le coût par unité. WDD dimensionne le champ en fonction du programme complet."},
      {question: "Comment WDD s'intègre-t-il à mon planning général de chantier ?", answer: "Nous planifions l'intervention de forage avec votre conducteur de travaux dès la signature du contrat. L'intervention se fait généralement avant les dallages — en phase gros œuvre — sans interférer avec les autres corps de métier."},
      {question: "Quel est le délai entre la commande et le démarrage du forage ?", answer: "En général 4 à 8 semaines, le temps d'instruire les permis de forage. Nous planifions ce délai en amont pour qu'il ne crée aucun retard dans votre calendrier."},
      {question: "Qui est responsable en cas de dommage pendant le forage ?", answer: "WDD est entièrement responsable de ses travaux de forage. Notre responsabilité civile couvre les dommages éventuels aux tiers, aux réseaux et aux ouvrages adjacents."},
      {question: "Peut-on prévoir la géothermie pour seulement une partie des unités ?", answer: "Oui. Nous dimensionnons le champ de sondes selon le programme que vous définissez — que ce soit pour l'ensemble du projet ou pour une tranche spécifique."},
    ],
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

const WHY_STATS = ['×2–3', '0 admin', 'Priorité', 'Kit incl.', '2026', 'Réseau']

/* ─────────────────────────────────────────────
   PRO SCHEME
───────────────────────────────────────────── */

type SchemeNode = {label: string; sub: string; stat: string; icon: React.ReactNode}

const SCHEME_NODES: Record<SegmentKey, [SchemeNode, SchemeNode, SchemeNode]> = {
  pro_chauffagistes: [
    {
      label: 'Votre client',
      sub: 'Demande une solution géothermique',
      stat: '×2–3',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    },
    {
      label: 'WDD fore',
      sub: 'Forage géothermique clé en main',
      stat: '0 admin',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10.5M12 22a4 4 0 100-8 4 4 0 000 8z"/><path d="M8 6H6M8 10H5M8 14H6"/></svg>,
    },
    {
      label: 'Vous installez',
      sub: 'Pompe à chaleur & mise en service',
      stat: '48 h',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
  ],
  pro_architectes: [
    {
      label: 'Votre esquisse',
      sub: 'Intégration dès la conception',
      stat: 'Jour 1',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M6 20V10l6-6 6 6v10M10 20v-5h4v5"/></svg>,
    },
    {
      label: 'Étude géologique',
      sub: 'Rapport préliminaire livré en 72 h',
      stat: '72 h',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>,
    },
    {
      label: 'PEB A garanti',
      sub: 'Sans compromis architecturaux',
      stat: 'PEB A',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
    },
  ],
  pro_entrepreneurs: [
    {
      label: 'Votre programme',
      sub: 'Résidentiel, tertiaire ou lotissement',
      stat: '1 contrat',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>,
    },
    {
      label: 'WDD clé en main',
      sub: 'Permis, forage, documentation as-built',
      stat: '4–8 sem.',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    },
    {
      label: 'Livraison valorisée',
      sub: 'PEB A + plus-value de revente',
      stat: '+8–12 %',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg>,
    },
  ],
}

function ProScheme({segment}: {segment: SegmentKey}) {
  const [phase, setPhase] = useState(0)
  const durations = [600, 1600, 1200, 1600, 1200, 1600, 2800]
  useEffect(() => {
    const t = setTimeout(() => setPhase(p => (p + 1) % 7), durations[phase] ?? 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const n0Lit    = phase >= 1
  const pipe1Lit = phase >= 2
  const n1Lit    = phase >= 3
  const pipe2Lit = phase >= 4
  const n2Lit    = phase >= 5

  const nodes = SCHEME_NODES[segment]
  const NODE_DUR = 'duration-[1100ms]'

  const SchemeNode = ({lit, node}: {lit: boolean; node: SchemeNode}) => (
    <div className="flex-1 flex flex-col items-center text-center gap-3">
      <div className={`w-14 h-14 flex items-center justify-center transition-all ${NODE_DUR} ease-in-out rounded-sm ${lit ? 'bg-wdd-yellow' : 'bg-black/6'}`}>
        <div className={`transition-colors ${NODE_DUR} ${lit ? 'text-wdd-black' : 'text-black/20'}`}>{node.icon}</div>
      </div>
      <div>
        <div className={`text-sm font-bold leading-snug transition-colors ${NODE_DUR} ${lit ? 'text-wdd-black' : 'text-black/20'}`}>{node.label}</div>
        <div className={`text-xs font-light mt-0.5 leading-snug transition-colors ${NODE_DUR} ${lit ? 'text-black/50' : 'text-black/10'}`}>{node.sub}</div>
        <div className={`text-xs font-black mt-1.5 tabular-nums transition-colors ${NODE_DUR} ${lit ? 'text-wdd-mud' : 'text-black/10'}`}>{node.stat}</div>
      </div>
    </div>
  )

  const SchemePipe = ({lit}: {lit: boolean}) => (
    <div className="flex flex-col items-center pt-7 w-14 shrink-0">
      <div className="flex items-center w-full">
        <div className="flex-1 h-px bg-black/8 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-wdd-yellow origin-left"
            style={{
              transform: lit ? 'scaleX(1)' : 'scaleX(0)',
              transition: lit ? 'transform 1000ms cubic-bezier(0.4,0,0.2,1)' : 'transform 500ms ease-in-out',
            }}
          />
        </div>
        <div style={{fontSize: 7, lineHeight: 1, color: lit ? '#FFD94F' : 'rgba(0,0,0,0.08)', transition: 'color 900ms ease-in-out'}}>▶</div>
      </div>
    </div>
  )

  return (
    <div className="flex items-start">
      <SchemeNode lit={n0Lit} node={nodes[0]} />
      <SchemePipe lit={pipe1Lit} />
      <SchemeNode lit={n1Lit} node={nodes[1]} />
      <SchemePipe lit={pipe2Lit} />
      <SchemeNode lit={n2Lit} node={nodes[2]} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   MAP SECTION
───────────────────────────────────────────── */

const PER_PAGE = 4

function matchesProvince(c: Chantier, p: Province): boolean {
  if (!c.province) return false
  const cp = c.province.toLowerCase()
  return (
    cp.includes(p.nameFr.toLowerCase()) ||
    cp.includes(p.nameNl.toLowerCase()) ||
    cp.includes(p.slug.replace(/-/g, ' '))
  )
}

function ProjetCard({chantier: c}: {chantier: Chantier}) {
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
              {c.type === 'fermee' ? 'Fermée' : 'Ouverte'}
            </span>
          )}
          {c.sector && (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black/12 text-black/40">
              {sectorLabel(c.sector)}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug line-clamp-3">{c.title ?? 'Projet géothermique'}</h3>
        {(c.location || c.province) && (
          <p className="text-xs font-light text-black/40 truncate mt-auto">
            {[c.location, c.province].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}

function ProProjetsSection({locale, chantiers}: {locale: AppLocale; chantiers: Chantier[]}) {
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
    ? getProvincePageUrl(locale, selectedProvince.slug)
    : getLocalizedPath(locale, 'references')
  const ctaLabel = selectedProvince
    ? `Tous les projets en ${getProvinceName(selectedProvince, locale)}`
    : 'Voir toutes nos réalisations'

  return (
    <section className="bg-white min-h-screen flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full">

        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold leading-tight">
            Nos projets en <span className="text-wdd-mud">Belgique</span>
          </h2>
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setPage(0) }}
              className="text-xs font-light text-black/35 hover:text-black/70 transition-colors underline underline-offset-2 shrink-0"
            >
              Toutes les provinces
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
                  style={{cursor: 'pointer', transition: 'fill 0.15s'}}
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
                    : 'Sélectionnez une province'}
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
                      Aucun projet répertorié dans cette province pour le moment.
                    </div>
                  ) : (
                    <>
                      {displayed.map((c) => (
                        <ProjetCard key={c._id} chantier={c} />
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
   FAQ ITEM
───────────────────────────────────────────── */

function FaqItem({question, answer}: {question: string; answer: string}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span className="text-base font-bold leading-snug group-hover:text-wdd-mud transition-colors">{question}</span>
        <span className={`flex-shrink-0 w-6 h-6 border flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5 ${open ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45' : 'border-black/20 text-black/40'}`}>+</span>
      </button>
      {open && (
        <p className="text-sm font-light text-black/70 leading-7 pb-6 pr-12 whitespace-pre-line">{answer}</p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function ProPage({page, locale, chantiers = [], settings}: {page: ProPageData; locale: AppLocale; chantiers?: Chantier[]; settings?: GlobalSettingsData | null}) {
  const segment = (page.routeKey ?? 'pro_chauffagistes') as SegmentKey
  const d = SEGMENT_DEFAULTS[segment]

  const faqs = page.faqs && page.faqs.length > 0
    ? page.faqs.map(f => ({question: f.question ?? '', answer: f.answer ?? ''}))
    : d.faqs

  const whyItems = page.valueItems && page.valueItems.length > 0 ? page.valueItems : d.whyItems

  return (
    <div className="flex flex-col bg-white">

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section className="h-[90vh] relative overflow-hidden px-8 md:px-16">

        {/* Left — dark earth image */}
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
        <div className="absolute inset-0 bg-wdd-black lg:hidden" />

        {/* Right — segment image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-[2] hidden lg:block">
          <Image
            src={page.heroRightImage ? urlFor(page.heroRightImage)?.url() ?? d.heroImage : d.heroImage}
            alt="WellDoneDrill"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute bottom-8 right-8 z-10">
            <FloatingInfoPanel
              items={
                page.heroPanelItems && page.heroPanelItems.length > 0
                  ? page.heroPanelItems.map(i => ({label: i.label ?? '', value: i.value ?? '', sub: i.sub}))
                  : d.heroPanelItems
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
              {page.heroSubtitle ?? d.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={getLocalizedPath(locale, 'demarrer')}
                className="bg-wdd-yellow text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors rounded-sm"
              >
                {page.heroCtaLabel ?? d.heroCtaPrimary}
              </Link>
              <Link
                href={getLocalizedPath(locale, 'references')}
                className="px-7 py-3.5 text-sm font-semibold border-2 border-white/30 text-white/80 hover:border-white hover:text-white transition-colors rounded-sm"
              >
                {d.heroCtaSecondary}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. CONTEXTE + IMAGE
      ══════════════════════════════════════ */}
      <section className="bg-white py-[7.5rem] px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:gap-12">

            {/* Left — text + markers */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <h2 className="text-4xl font-bold leading-tight mb-6">
                {page.valueTitle ?? d.contextTitle}
              </h2>
              <p className="text-base font-light text-black/60 leading-8 mb-12">
                {page.valueIntro ?? d.contextBody}
              </p>
              <div className="border-t border-black/8 pt-10 mt-auto">
                <ProScheme segment={segment} />
              </div>
            </div>

            {/* Right — video if available, image otherwise */}
            {(() => {
              const ctxImage = page.contextImage
                ? urlFor(page.contextImage)?.url() ?? d.contextImage
                : d.contextImage
              const ctxVideo = page.contextVideoUrl ?? d.contextVideo ?? (segment === 'pro_chauffagistes' ? '/videos/mrly-comp.mov' : null)
              return (
                <div className={`hidden lg:block lg:flex-1 relative overflow-hidden rounded-sm ${segment === 'pro_architectes' ? 'aspect-video' : 'min-h-[320px]'}`}>
                  <Image src={ctxImage} alt="" fill sizes="50vw" className="object-cover object-center" />
                  {ctxVideo && (
                    <video
                      src={ctxVideo}
                      autoPlay loop muted playsInline
                      className="absolute inset-0 w-full h-full object-cover scale-125 z-10"
                    />
                  )}
                </div>
              )
            })()}

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. SIX RAISONS
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay py-[7.5rem] px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <h2 className="text-4xl font-bold leading-tight mb-10">
            {page.whyTitle ?? d.whyTitle}
          </h2>

          {(() => {
            const ICON_BGS = ['bg-wdd-yellow', 'bg-wdd-grass', 'bg-wdd-mud', 'bg-wdd-yellow', 'bg-wdd-grass', 'bg-wdd-mud'] as const
            return (
              <>
                <div className="grid lg:grid-cols-2 gap-2">
                  {whyItems.map((item, i) => (
                    <div
                      key={('_key' in item ? (item._key as string | undefined) : undefined) ?? i}
                      className="grid grid-cols-[5rem_1fr_2fr] bg-white rounded-sm overflow-hidden"
                    >
                      <div className={`flex items-center justify-center self-stretch ${ICON_BGS[i % 3]}`}>
                        <div className="text-wdd-black">{WHY_ICONS[i] ?? WHY_ICONS[0]}</div>
                      </div>
                      <h3 className="text-sm font-bold leading-snug py-7 pl-5 self-start">{item.title}</h3>
                      <p className="text-sm font-light text-black/50 leading-relaxed py-7 pr-5 self-start">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link
                    href={getLocalizedPath(locale, 'demarrer')}
                    className="inline-flex items-center gap-2 bg-wdd-black text-white px-7 py-3.5 text-sm font-bold hover:bg-wdd-black/80 transition-colors rounded-sm"
                  >
                    Démarrer mon projet <span>→</span>
                  </Link>
                </div>
              </>
            )
          })()}
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. RÉALISATIONS
      ══════════════════════════════════════ */}
      <ProProjetsSection locale={locale} chantiers={chantiers} />

      <DemarrerCTA locale={locale} settings={settings} />

      {/* ══════════════════════════════════════
          6. FAQ
      ══════════════════════════════════════ */}
      <section className="bg-white py-24 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              {page.faqTitle ?? d.faqTitle}
            </h2>
            <p className="text-sm font-light text-black/50 leading-7 mb-8">
              Une question ne figure pas ici ? Contactez directement notre équipe.
            </p>
            <Link
              href={getLocalizedPath(locale, 'demarrer')}
              className="inline-block bg-wdd-black text-wdd-yellow px-5 py-2.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
            >
              Poser ma question
            </Link>
          </div>
          <div className="lg:col-span-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STICKY MOBILE CTA
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-wdd-black border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <Link
          href={getLocalizedPath(locale, 'demarrer')}
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-black bg-wdd-yellow border-2 border-wdd-yellow rounded-sm"
        >
          Démarrer mon projet
        </Link>
        <a
          href="tel:+32478753679"
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-yellow border-2 border-wdd-yellow hover:bg-wdd-yellow hover:text-wdd-black transition-colors rounded-sm"
        >
          Appeler WDD
        </a>
      </div>

    </div>
  )
}

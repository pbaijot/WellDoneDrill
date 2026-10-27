'use client'

import {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import {Leaf, PiggyBank, SunSnow} from 'lucide-react'
import {getLocalizedPath, type AppLocale} from '@/src/i18n/routes'
import type {ParticuliersPageData} from '@/src/lib/particuliersPage'
import type {GlobalSettingsData} from '@/src/lib/globalSettings'
import {FloatingInfoPanel} from './FloatingInfoPanel'
import {urlFor} from '@/src/lib/sanityImage'
import DemarrerCTA from './DemarrerCTA'
import {
  BELGIUM_PROVINCES,
  SVG_W,
  SVG_H,
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
   DEFAULT CONTENT (CMS fallbacks)
───────────────────────────────────────────── */

const DEFAULT_WHY_ITEMS = [
  {
    title: "Jusqu'à 70 % d'économies",
    body: "En passant du gaz à la géothermie, nos clients économisent en moyenne 1 200 € par an sur leur facture énergétique.",
  },
  {
    title: "Zéro combustible fossile",
    body: "La géothermie puise une énergie renouvelable dans le sol de votre propriété. Aucune émission directe, aucune dépendance au marché.",
  },
  {
    title: "Chaud l'hiver, frais l'été",
    body: "La même installation assure le chauffage et la climatisation naturelle. Pas de système secondaire.",
  },
  {
    title: "Patrimoine valorisé",
    body: "Un logement géothermique affiche un meilleur certificat PEB et se revend plus vite à un meilleur prix.",
  },
  {
    title: "Indépendance énergétique",
    body: "Vous n'êtes plus exposé aux hausses du prix du gaz. Votre coût de chauffage devient prévisible pour 50 ans.",
  },
  {
    title: "Durabilité prouvée",
    body: "Les sondes géothermiques ont une durée de vie de 50 ans et plus. Aucun entretien après installation.",
  },
]

const DEFAULT_FAQS = [
  {
    question: "Combien coûte une installation géothermique au total ?",
    answer:
      "Le budget complet — forage + pompe à chaleur + installation — se situe généralement entre 20 000 et 30 000 €. Après déduction des primes régionales (qui peuvent atteindre 8 000 à 12 000 €), le reste à charge net descend souvent sous les 18 000 €. Votre retour sur investissement intervient en 8 à 12 ans sur une installation qui dure 50 ans.",
  },
  {
    question: "Mon terrain est-il compatible avec la géothermie ?",
    answer:
      "Plus de 90 % des propriétés résidentielles en Belgique et au Luxembourg sont géologiquement compatibles. WellDoneDrill réalise une étude préalable gratuite pour confirmer la faisabilité sur votre parcelle, avant tout engagement de votre part.",
  },
  {
    question: "Quels travaux sont réalisés chez moi et combien de temps cela prend-il ?",
    answer:
      "Le forage occupe typiquement 1 à 3 jours sur votre terrain. Notre équipe intervient avec une machine spécialisée : l'impact sur votre jardin est minimal et le terrain est remis en état à la fin du chantier. L'installation complète (forage + PAC) prend généralement 1 à 2 semaines.",
  },
  {
    question: "Qui installe la pompe à chaleur ?",
    answer:
      "WellDoneDrill est le spécialiste du forage géothermique. Nous travaillons avec un réseau sélectionné de chauffagistes certifiés qui prennent en charge l'installation de la PAC. Nous coordonnons les deux équipes pour vous — un seul interlocuteur de bout en bout.",
  },
  {
    question: "La géothermie fonctionne-t-elle aussi comme climatisation ?",
    answer:
      "Oui. La géothermie fermée permet une climatisation géothermique passive (free-cooling) très efficace en été, avec une consommation électrique marginale. Contrairement aux climatiseurs classiques, elle n'émet pas de chaleur à l'extérieur.",
  },
  {
    question: "Faut-il un permis pour forer ?",
    answer:
      "Dans la plupart des régions, un permis de forage est requis. WellDoneDrill gère intégralement les démarches administratives pour vous — y compris les déclarations obligatoires auprès des organismes compétents.",
  },
]

const DEFAULT_PRIMES = [
  {region: "Région wallonne", title: "Prime URE — jusqu'à 4 500 €", body: "Prime à l'utilisation rationnelle de l'énergie pour installation géothermique résidentielle neuve ou en rénovation."},
  {region: "Région bruxelloise", title: "Prime énergie — jusqu'à 3 500 €", body: "Subvention pour le remplacement d'une chaudière fossile par une PAC géothermique."},
  {region: "Grand-Duché de Luxembourg", title: "Prime Klimabonus — jusqu'à 10 000 €", body: "Aide directe de l'État pour les installations géothermiques résidentielles certifiées."},
  {region: "Flandre", title: "Premie warmtepomp — variable", body: "Steun voor de installatie van een geothermische warmtepomp in woningen."},
]

/* ─────────────────────────────────────────────
   UI TRANSLATIONS (chrome strings not in CMS)
───────────────────────────────────────────── */

const UI = {
  'be-fr': {
    fmtLocale: 'fr-BE',
    geoSol: 'Le sol', geoSolSub: 'Énergie constante à 80–200 m',
    geoPac: 'Pompe à chaleur', geoPacSub: "Amplifie l'énergie captée",
    geoMaison: 'Votre maison', geoMaisonSub: 'Chauffage · Eau · Froid',
    startProject: 'Démarrer mon projet →',
    calcTitle: 'Combien pourriez-vous économiser ?',
    calcIntro: "Entrez votre surface ou votre consommation actuelle. Cochez les postes qui vous concernent — les économies se calculent en temps réel.",
    inputModeLabel: "J'entre",
    surfaceMode: 'Ma surface (m²)', consoMode: 'Ma consommation (MWh/an)',
    surfaceLabel: 'Surface habitable', consoLabel: 'Consommation chauffage', consoUnit: 'MWh/an',
    consoFromSurface: '≈ {n} MWh/an de chauffage estimés', surfaceFromConso: '≈ {n} m² de surface estimée',
    energyLabel: 'Énergie de chauffage actuelle',
    gasOption: 'Gaz naturel', oilOption: 'Mazout', elecOption: 'Électrique',
    postesLabel: 'Postes concernés', posteHeating: 'Chauffage', posteCooling: 'Rafraîchissement', postePool: 'Piscine',
    savingsTitle: 'Économies estimées / an', totalLabel: 'Total toutes énergies',
    totalSub: 'soit {mwh} MWh économisés · {co2} kg CO₂ évités',
    notSelected: 'non sélectionné',
    disclaimer: "Basé sur les prix de l'énergie belges 2024–2025 et un COP géothermique de 4,5. Résultat indicatif.",
    faqSub: "Une question ne figure pas ici ? Contactez directement notre équipe.", faqCta: 'Poser ma question',
    showMap: true,
    mapTitle: 'Nos projets en', mapCountry: 'Belgique', mapHint: 'Sélectionnez une province',
    mapAll: 'Toutes les provinces', mapEmpty: 'Nous sommes en train de mettre à jour nos références pour cette province.',
    mapAllRealisations: 'Voir toutes nos réalisations', mapAllInProvince: 'Tous les projets en {name}',
    calcBg: 'bg-wdd-clay',
    orCall: 'ou appelez-nous', mobileCta1: 'Calculer mes économies', mobileCta2: 'Devis gratuit',
  },
  'be-nl': {
    fmtLocale: 'nl-BE',
    geoSol: 'De bodem', geoSolSub: 'Constante energie op 80–200 m',
    geoPac: 'Warmtepomp', geoPacSub: 'Versterkt de opgenomen energie',
    geoMaison: 'Uw woning', geoMaisonSub: 'Verwarming · Water · Koeling',
    startProject: 'Mijn project starten →',
    calcTitle: 'Hoeveel kunt u besparen?',
    calcIntro: 'Voer uw oppervlakte of uw huidig verbruik in. Vink de posten aan die op u van toepassing zijn — de besparingen worden in realtime berekend.',
    inputModeLabel: 'Ik voer in',
    surfaceMode: 'Mijn oppervlakte (m²)', consoMode: 'Mijn verbruik (MWh/jaar)',
    surfaceLabel: 'Bewoonbare oppervlakte', consoLabel: 'Verwarmingsverbruik', consoUnit: 'MWh/jaar',
    consoFromSurface: '≈ {n} MWh/jaar geschatte verwarming', surfaceFromConso: '≈ {n} m² geschatte oppervlakte',
    energyLabel: 'Huidige verwarmingsenergie',
    gasOption: 'Aardgas', oilOption: 'Stookolie', elecOption: 'Elektrisch',
    postesLabel: 'Betrokken posten', posteHeating: 'Verwarming', posteCooling: 'Koeling', postePool: 'Zwembad',
    savingsTitle: 'Geschatte besparing / jaar', totalLabel: 'Totaal alle energiesoorten',
    totalSub: 'ofwel {mwh} MWh bespaard · {co2} kg CO₂ vermeden',
    notSelected: 'niet geselecteerd',
    disclaimer: 'Gebaseerd op Belgische energieprijzen 2024–2025 en een geothermische COP van 4,5. Indicatief resultaat.',
    faqSub: 'Staat uw vraag er niet bij? Contacteer ons rechtstreeks.', faqCta: 'Mijn vraag stellen',
    showMap: true,
    mapTitle: 'Onze projecten in', mapCountry: 'België', mapHint: 'Selecteer een provincie',
    mapAll: 'Alle provincies', mapEmpty: 'We werken momenteel onze referenties voor deze provincie bij.',
    mapAllRealisations: 'Bekijk al onze realisaties', mapAllInProvince: 'Alle projecten in {name}',
    calcBg: 'bg-wdd-clay',
    orCall: 'of bel ons', mobileCta1: 'Mijn besparing berekenen', mobileCta2: 'Gratis offerte',
  },
  'fr-fr': {
    fmtLocale: 'fr-FR',
    geoSol: 'Le sol', geoSolSub: 'Énergie constante à 80–200 m',
    geoPac: 'Pompe à chaleur', geoPacSub: "Amplifie l'énergie captée",
    geoMaison: 'Votre maison', geoMaisonSub: 'Chauffage · Eau · Froid',
    startProject: 'Démarrer mon projet →',
    calcTitle: 'Combien pourriez-vous économiser ?',
    calcIntro: "Entrez votre surface ou votre consommation actuelle. Cochez les postes qui vous concernent — les économies se calculent en temps réel.",
    inputModeLabel: "J'entre",
    surfaceMode: 'Ma surface (m²)', consoMode: 'Ma consommation (MWh/an)',
    surfaceLabel: 'Surface habitable', consoLabel: 'Consommation chauffage', consoUnit: 'MWh/an',
    consoFromSurface: '≈ {n} MWh/an de chauffage estimés', surfaceFromConso: '≈ {n} m² de surface estimée',
    energyLabel: 'Énergie de chauffage actuelle',
    gasOption: 'Gaz naturel', oilOption: 'Fioul', elecOption: 'Électrique',
    postesLabel: 'Postes concernés', posteHeating: 'Chauffage', posteCooling: 'Rafraîchissement', postePool: 'Piscine',
    savingsTitle: 'Économies estimées / an', totalLabel: 'Total toutes énergies',
    totalSub: 'soit {mwh} MWh économisés · {co2} kg CO₂ évités',
    notSelected: 'non sélectionné',
    disclaimer: "Basé sur les prix de l'énergie français 2024–2025 et un COP géothermique de 4,5. Résultat indicatif.",
    faqSub: "Une question ne figure pas ici ? Contactez directement notre équipe.", faqCta: 'Poser ma question',
    showMap: false,
    mapTitle: '', mapCountry: '', mapHint: '', mapAll: '', mapEmpty: '', mapAllRealisations: '', mapAllInProvince: '',
    calcBg: 'bg-white',
    orCall: 'ou appelez-nous', mobileCta1: 'Calculer mes économies', mobileCta2: 'Devis gratuit',
  },
  'lu-fr': {
    fmtLocale: 'fr-LU',
    geoSol: 'Le sol', geoSolSub: 'Énergie constante à 80–200 m',
    geoPac: 'Pompe à chaleur', geoPacSub: "Amplifie l'énergie captée",
    geoMaison: 'Votre maison', geoMaisonSub: 'Chauffage · Eau · Froid',
    startProject: 'Démarrer mon projet →',
    calcTitle: 'Combien pourriez-vous économiser ?',
    calcIntro: "Entrez votre surface ou votre consommation actuelle. Cochez les postes qui vous concernent — les économies se calculent en temps réel.",
    inputModeLabel: "J'entre",
    surfaceMode: 'Ma surface (m²)', consoMode: 'Ma consommation (MWh/an)',
    surfaceLabel: 'Surface habitable', consoLabel: 'Consommation chauffage', consoUnit: 'MWh/an',
    consoFromSurface: '≈ {n} MWh/an de chauffage estimés', surfaceFromConso: '≈ {n} m² de surface estimée',
    energyLabel: 'Énergie de chauffage actuelle',
    gasOption: 'Gaz naturel', oilOption: 'Mazout', elecOption: 'Électrique',
    postesLabel: 'Postes concernés', posteHeating: 'Chauffage', posteCooling: 'Rafraîchissement', postePool: 'Piscine',
    savingsTitle: 'Économies estimées / an', totalLabel: 'Total toutes énergies',
    totalSub: 'soit {mwh} MWh économisés · {co2} kg CO₂ évités',
    notSelected: 'non sélectionné',
    disclaimer: "Basé sur les prix de l'énergie luxembourgeois 2024–2025 et un COP géothermique de 4,5. Résultat indicatif.",
    faqSub: "Une question ne figure pas ici ? Contactez directement notre équipe.", faqCta: 'Poser ma question',
    showMap: false,
    mapTitle: '', mapCountry: '', mapHint: '', mapAll: '', mapEmpty: '', mapAllRealisations: '', mapAllInProvince: '',
    calcBg: 'bg-white',
    orCall: 'ou appelez-nous', mobileCta1: 'Calculer mes économies', mobileCta2: 'Devis gratuit',
  },
  'lu-de': {
    fmtLocale: 'de-LU',
    geoSol: 'Der Boden', geoSolSub: 'Konstante Energie bei 80–200 m',
    geoPac: 'Wärmepumpe', geoPacSub: 'Verstärkt die entnommene Energie',
    geoMaison: 'Ihr Zuhause', geoMaisonSub: 'Heizung · Wasser · Kühlung',
    startProject: 'Mein Projekt starten →',
    calcTitle: 'Wie viel könnten Sie sparen?',
    calcIntro: 'Geben Sie Ihre Wohnfläche oder Ihren aktuellen Verbrauch ein. Wählen Sie die zutreffenden Posten — die Ersparnisse werden in Echtzeit berechnet.',
    inputModeLabel: 'Ich gebe ein',
    surfaceMode: 'Meine Fläche (m²)', consoMode: 'Mein Verbrauch (MWh/Jahr)',
    surfaceLabel: 'Wohnfläche', consoLabel: 'Heizungsverbrauch', consoUnit: 'MWh/Jahr',
    consoFromSurface: '≈ {n} MWh/Jahr geschätzter Heizungsverbrauch', surfaceFromConso: '≈ {n} m² geschätzte Fläche',
    energyLabel: 'Aktuelle Heizungsenergie',
    gasOption: 'Erdgas', oilOption: 'Heizöl', elecOption: 'Elektrisch',
    postesLabel: 'Betroffene Posten', posteHeating: 'Heizung', posteCooling: 'Kühlung', postePool: 'Schwimmbad',
    savingsTitle: 'Geschätzte Ersparnis / Jahr', totalLabel: 'Gesamt alle Energiearten',
    totalSub: 'd. h. {mwh} MWh eingespart · {co2} kg CO₂ vermieden',
    notSelected: 'nicht ausgewählt',
    disclaimer: 'Basiert auf luxemburgischen Energiepreisen 2024–2025 und einem geothermischen COP von 4,5. Indikativer Richtwert.',
    faqSub: 'Haben Sie eine weitere Frage? Kontaktieren Sie unser Team direkt.', faqCta: 'Meine Frage stellen',
    showMap: false,
    mapTitle: '', mapCountry: '', mapHint: '', mapAll: '', mapEmpty: '', mapAllRealisations: '', mapAllInProvince: '',
    calcBg: 'bg-white',
    orCall: 'oder rufen Sie uns an', mobileCta1: 'Meine Ersparnis berechnen', mobileCta2: 'Kostenlose Offerte',
  },
  'be-en': {
    fmtLocale: 'en-BE',
    geoSol: 'The ground', geoSolSub: 'Constant energy at 80–200 m',
    geoPac: 'Heat pump', geoPacSub: 'Boosts the captured energy',
    geoMaison: 'Your home', geoMaisonSub: 'Heating · Water · Cooling',
    startProject: 'Start my project →',
    calcTitle: 'How much could you save?',
    calcIntro: "Enter your floor area or your current consumption. Tick the items that apply to you — savings are calculated in real time.",
    inputModeLabel: 'I enter',
    surfaceMode: 'My area (m²)', consoMode: 'My consumption (MWh/year)',
    surfaceLabel: 'Living area', consoLabel: 'Heating consumption', consoUnit: 'MWh/year',
    consoFromSurface: '≈ {n} MWh/year of estimated heating', surfaceFromConso: '≈ {n} m² of estimated area',
    energyLabel: 'Current heating energy',
    gasOption: 'Natural gas', oilOption: 'Heating oil', elecOption: 'Electric',
    postesLabel: 'Items concerned', posteHeating: 'Heating', posteCooling: 'Cooling', postePool: 'Pool',
    savingsTitle: 'Estimated savings / year', totalLabel: 'Total all energies',
    totalSub: 'i.e. {mwh} MWh saved · {co2} kg CO₂ avoided',
    notSelected: 'not selected',
    disclaimer: "Based on Belgian energy prices 2024–2025 and a geothermal COP of 4.5. Indicative result.",
    faqSub: "Don't see your question here? Contact our team directly.", faqCta: 'Ask my question',
    showMap: true,
    mapTitle: 'Our projects in', mapCountry: 'Belgium', mapHint: 'Select a province',
    mapAll: 'All provinces', mapEmpty: 'We are currently updating our projects for this province.',
    mapAllRealisations: 'See all our projects', mapAllInProvince: 'All projects in {name}',
    calcBg: 'bg-wdd-clay',
    orCall: 'or call us', mobileCta1: 'Calculate my savings', mobileCta2: 'Free quote',
  },
  'fr-en': {
    fmtLocale: 'en-FR',
    geoSol: 'The ground', geoSolSub: 'Constant energy at 80–200 m',
    geoPac: 'Heat pump', geoPacSub: 'Boosts the captured energy',
    geoMaison: 'Your home', geoMaisonSub: 'Heating · Water · Cooling',
    startProject: 'Start my project →',
    calcTitle: 'How much could you save?',
    calcIntro: "Enter your floor area or your current consumption. Tick the items that apply to you — savings are calculated in real time.",
    inputModeLabel: 'I enter',
    surfaceMode: 'My area (m²)', consoMode: 'My consumption (MWh/year)',
    surfaceLabel: 'Living area', consoLabel: 'Heating consumption', consoUnit: 'MWh/year',
    consoFromSurface: '≈ {n} MWh/year of estimated heating', surfaceFromConso: '≈ {n} m² of estimated area',
    energyLabel: 'Current heating energy',
    gasOption: 'Natural gas', oilOption: 'Heating oil', elecOption: 'Electric',
    postesLabel: 'Items concerned', posteHeating: 'Heating', posteCooling: 'Cooling', postePool: 'Pool',
    savingsTitle: 'Estimated savings / year', totalLabel: 'Total all energies',
    totalSub: 'i.e. {mwh} MWh saved · {co2} kg CO₂ avoided',
    notSelected: 'not selected',
    disclaimer: "Based on French energy prices 2024–2025 and a geothermal COP of 4.5. Indicative result.",
    faqSub: "Don't see your question here? Contact our team directly.", faqCta: 'Ask my question',
    showMap: false,
    mapTitle: '', mapCountry: '', mapHint: '', mapAll: '', mapEmpty: '', mapAllRealisations: '', mapAllInProvince: '',
    calcBg: 'bg-white',
    orCall: 'or call us', mobileCta1: 'Calculate my savings', mobileCta2: 'Free quote',
  },
  'lu-en': {
    fmtLocale: 'en-LU',
    geoSol: 'The ground', geoSolSub: 'Constant energy at 80–200 m',
    geoPac: 'Heat pump', geoPacSub: 'Boosts the captured energy',
    geoMaison: 'Your home', geoMaisonSub: 'Heating · Water · Cooling',
    startProject: 'Start my project →',
    calcTitle: 'How much could you save?',
    calcIntro: "Enter your floor area or your current consumption. Tick the items that apply to you — savings are calculated in real time.",
    inputModeLabel: 'I enter',
    surfaceMode: 'My area (m²)', consoMode: 'My consumption (MWh/year)',
    surfaceLabel: 'Living area', consoLabel: 'Heating consumption', consoUnit: 'MWh/year',
    consoFromSurface: '≈ {n} MWh/year of estimated heating', surfaceFromConso: '≈ {n} m² of estimated area',
    energyLabel: 'Current heating energy',
    gasOption: 'Natural gas', oilOption: 'Heating oil', elecOption: 'Electric',
    postesLabel: 'Items concerned', posteHeating: 'Heating', posteCooling: 'Cooling', postePool: 'Pool',
    savingsTitle: 'Estimated savings / year', totalLabel: 'Total all energies',
    totalSub: 'i.e. {mwh} MWh saved · {co2} kg CO₂ avoided',
    notSelected: 'not selected',
    disclaimer: "Based on Luxembourg energy prices 2024–2025 and a geothermal COP of 4.5. Indicative result.",
    faqSub: "Don't see your question here? Contact our team directly.", faqCta: 'Ask my question',
    showMap: false,
    mapTitle: '', mapCountry: '', mapHint: '', mapAll: '', mapEmpty: '', mapAllRealisations: '', mapAllInProvince: '',
    calcBg: 'bg-white',
    orCall: 'or call us', mobileCta1: 'Calculate my savings', mobileCta2: 'Free quote',
  },
} as const

type UiT = typeof UI[keyof typeof UI]

/* ─────────────────────────────────────────────
   V2 COPY (new chrome strings, per language)
───────────────────────────────────────────── */

type Lang = 'fr' | 'nl' | 'en' | 'de'

const LANG: Record<AppLocale, Lang> = {
  'be-fr': 'fr', 'fr-fr': 'fr', 'lu-fr': 'fr',
  'be-nl': 'nl', 'lu-de': 'de',
  'be-en': 'en', 'fr-en': 'en', 'lu-en': 'en',
}

type Step = {title: string; body: string}

const V2: Record<Lang, {
  eyebrow: string
  ctaStudy: string; ctaSoil: string; ctaQuote: string
  usps: Step[]
  principleTitle: string; principleIntro: string
  principleSteps: Step[]
  siteTitle: string; siteIntro: string
  siteSteps: Step[]
  videoCaption: string
}> = {
  fr: {
    eyebrow: 'Géothermie pour particuliers',
    usps: [
      {title: 'Chaud & froid', body: "Une seule installation chauffe l'hiver et rafraîchit l'été."},
      {title: 'Économique', body: 'Une énergie gratuite sous vos pieds, un coût de chauffage prévisible.'},
      {title: 'Écologique', body: 'Aucun combustible fossile, aucune émission sur place.'},
    ],
    ctaStudy: 'Demander mon analyse gratuite', ctaSoil: 'Vérifier si mon terrain convient', ctaQuote: 'Recevoir mon devis personnalisé',
    principleTitle: "L'énergie est déjà sous votre jardin.",
    principleIntro: "À quelques dizaines de mètres de profondeur, le sol garde une température stable toute l'année. Nous allons la chercher.",
    principleSteps: [
      {title: 'WellDoneDrill fore', body: 'Nous forons entre 80 et 200 m et y plaçons une boucle fermée de sondes.'},
      {title: 'Le sol fournit 15 °C', body: 'Été comme hiver, le sous-sol reste à température constante. Cette énergie est gratuite.'},
      {title: 'La pompe à chaleur amplifie', body: "Pour 1 kWh d'électricité, elle restitue 4 à 5 kWh de chaleur."},
      {title: 'Votre maison en profite', body: 'Chauffage, eau chaude et fraîcheur en été, avec une seule installation.'},
    ],
    siteTitle: 'Comment se passe le chantier chez vous.',
    siteIntro: "Moins d'une semaine de travaux, une seule équipe pour tout coordonner.",
    siteSteps: [
      {title: 'Étude gratuite', body: "Nous vérifions la faisabilité géologique de votre terrain et dimensionnons l'installation, sans engagement."},
      {title: 'Permis et primes', body: 'Nous gérons les démarches administratives et vous aidons à monter vos dossiers de primes.'},
      {title: 'Forage', body: "1 à 2 jours chez vous. La machine a besoin d'un accès de 2,5 m de large, et le terrain est remis en état."},
      {title: 'Pompe à chaleur', body: 'Un chauffagiste partenaire installe la PAC en 1 à 2 jours. Nous coordonnons les deux équipes.'},
      {title: 'Mise en service', body: "Moins d'une semaine après le début des travaux, votre maison se chauffe avec l'énergie du sol."},
    ],
    videoCaption: 'Forage de sondes géothermiques dans un jardin',
  },
  nl: {
    eyebrow: 'Geothermie voor particulieren',
    usps: [
      {title: 'Warm & koel', body: 'Eén installatie verwarmt in de winter en koelt in de zomer.'},
      {title: 'Voordelig', body: 'Gratis energie onder uw voeten, voorspelbare verwarmingskosten.'},
      {title: 'Ecologisch', body: 'Geen fossiele brandstof, geen uitstoot ter plaatse.'},
    ],
    ctaStudy: 'Mijn gratis analyse aanvragen', ctaSoil: 'Nagaan of mijn terrein geschikt is', ctaQuote: 'Mijn offerte op maat ontvangen',
    principleTitle: 'De energie zit al onder uw tuin.',
    principleIntro: 'Op enkele tientallen meters diepte houdt de bodem het hele jaar een stabiele temperatuur. Wij gaan ze halen.',
    principleSteps: [
      {title: 'WellDoneDrill boort', body: 'We boren tussen 80 en 200 m en plaatsen er een gesloten lus van sondes.'},
      {title: 'De bodem levert 15 °C', body: 'Zomer en winter blijft de ondergrond op constante temperatuur. Die energie is gratis.'},
      {title: 'De warmtepomp versterkt', body: 'Voor 1 kWh elektriciteit levert ze 4 tot 5 kWh warmte.'},
      {title: 'Uw woning geniet ervan', body: 'Verwarming, warm water en koeling in de zomer, met één installatie.'},
    ],
    siteTitle: 'Zo verloopt de werf bij u thuis.',
    siteIntro: 'Minder dan een week werken, één team dat alles coördineert.',
    siteSteps: [
      {title: 'Gratis studie', body: 'We controleren de geologische haalbaarheid van uw terrein en dimensioneren de installatie, zonder verbintenis.'},
      {title: 'Vergunning en premies', body: 'We regelen de administratieve stappen en helpen u met uw premiedossiers.'},
      {title: 'Boring', body: '1 à 2 dagen bij u thuis. De machine heeft een toegang van 2,5 m breed nodig en het terrein wordt hersteld.'},
      {title: 'Warmtepomp', body: 'Een partner-installateur plaatst de warmtepomp in 1 à 2 dagen. Wij coördineren beide teams.'},
      {title: 'Ingebruikname', body: 'Minder dan een week na de start van de werken verwarmt uw woning zich met energie uit de bodem.'},
    ],
    videoCaption: 'Boring van geothermische sondes in een tuin',
  },
  en: {
    eyebrow: 'Geothermal for homeowners',
    usps: [
      {title: 'Heating & cooling', body: 'One system heats in winter and cools in summer.'},
      {title: 'Economical', body: 'Free energy under your feet, predictable heating costs.'},
      {title: 'Ecological', body: 'No fossil fuel, no emissions on site.'},
    ],
    ctaStudy: 'Request my free analysis', ctaSoil: 'Check if my plot is suitable', ctaQuote: 'Get my personalised quote',
    principleTitle: 'The energy is already under your garden.',
    principleIntro: 'A few dozen metres down, the ground keeps a stable temperature all year round. We go and get it.',
    principleSteps: [
      {title: 'WellDoneDrill drills', body: 'We drill between 80 and 200 m and install a closed loop of probes.'},
      {title: 'The ground supplies 15 °C', body: 'Summer and winter, the subsoil stays at a constant temperature. That energy is free.'},
      {title: 'The heat pump boosts it', body: 'For 1 kWh of electricity, it delivers 4 to 5 kWh of heat.'},
      {title: 'Your home benefits', body: 'Heating, hot water and cooling in summer, with a single system.'},
    ],
    siteTitle: 'How the works go at your home.',
    siteIntro: 'Less than a week of works, one team coordinating everything.',
    siteSteps: [
      {title: 'Free study', body: 'We check the geological feasibility of your plot and size the system, with no obligation.'},
      {title: 'Permits and grants', body: 'We handle the paperwork and help you put together your grant applications.'},
      {title: 'Drilling', body: '1 to 2 days at your home. The rig needs 2.5 m wide access, and the ground is restored afterwards.'},
      {title: 'Heat pump', body: 'A partner installer fits the heat pump in 1 to 2 days. We coordinate both teams.'},
      {title: 'Commissioning', body: 'Less than a week after works begin, your home is heated by energy from the ground.'},
    ],
    videoCaption: 'Drilling geothermal probes in a garden',
  },
  de: {
    eyebrow: 'Geothermie für Privatkunden',
    usps: [
      {title: 'Wärme & Kühlung', body: 'Eine Anlage heizt im Winter und kühlt im Sommer.'},
      {title: 'Wirtschaftlich', body: 'Kostenlose Energie unter Ihren Füßen, planbare Heizkosten.'},
      {title: 'Ökologisch', body: 'Kein fossiler Brennstoff, keine Emissionen vor Ort.'},
    ],
    ctaStudy: 'Kostenlose Analyse anfragen', ctaSoil: 'Prüfen, ob mein Grundstück geeignet ist', ctaQuote: 'Mein persönliches Angebot erhalten',
    principleTitle: 'Die Energie liegt schon unter Ihrem Garten.',
    principleIntro: 'In einigen Dutzend Metern Tiefe hat der Boden das ganze Jahr über eine stabile Temperatur. Wir holen sie nach oben.',
    principleSteps: [
      {title: 'WellDoneDrill bohrt', body: 'Wir bohren zwischen 80 und 200 m und setzen einen geschlossenen Sondenkreislauf ein.'},
      {title: 'Der Boden liefert 15 °C', body: 'Sommer wie Winter bleibt der Untergrund konstant temperiert. Diese Energie ist kostenlos.'},
      {title: 'Die Wärmepumpe verstärkt', body: 'Aus 1 kWh Strom macht sie 4 bis 5 kWh Wärme.'},
      {title: 'Ihr Zuhause profitiert', body: 'Heizung, Warmwasser und Kühlung im Sommer, mit einer einzigen Anlage.'},
    ],
    siteTitle: 'So läuft die Baustelle bei Ihnen ab.',
    siteIntro: 'Weniger als eine Woche Arbeiten, ein Team, das alles koordiniert.',
    siteSteps: [
      {title: 'Kostenlose Studie', body: 'Wir prüfen die geologische Machbarkeit Ihres Grundstücks und dimensionieren die Anlage, unverbindlich.'},
      {title: 'Genehmigung und Förderung', body: 'Wir erledigen die Formalitäten und helfen Ihnen bei den Förderanträgen.'},
      {title: 'Bohrung', body: '1 bis 2 Tage bei Ihnen. Die Maschine braucht eine 2,5 m breite Zufahrt, und das Gelände wird wiederhergestellt.'},
      {title: 'Wärmepumpe', body: 'Ein Partner-Installateur setzt die Wärmepumpe in 1 bis 2 Tagen. Wir koordinieren beide Teams.'},
      {title: 'Inbetriebnahme', body: 'Weniger als eine Woche nach Baubeginn heizt sich Ihr Zuhause mit Energie aus dem Boden.'},
    ],
    videoCaption: 'Bohrung von Erdwärmesonden in einem Garten',
  },
}

type V2T = typeof V2[Lang]

// Heating & cooling · economical · ecological, in the order of v.usps
const USP_ICONS = [SunSnow, PiggyBank, Leaf]

const WHY_ICONS = [
  <svg key="eco" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a3 3 0 10-3 5h3a3 3 0 010 6H9M12 7v1m0 8v1"/></svg>,
  <svg key="leaf" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22s4-8 10-10c4-1.5 8-1 10-1-1 4-3 8-8 10-3.5 1.3-7 1-12 1z"/><path d="M12 12L2 22"/></svg>,
  <svg key="temp" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10.5M12 22a4 4 0 100-8 4 4 0 000 8z"/><path d="M8 6H6M8 10H5M8 14H6"/></svg>,
  <svg key="house" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M15 21V12H9v9"/><path d="M16 5l3 3"/></svg>,
  <svg key="shield" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
  <svg key="clock" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
]

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const

function Reveal({children, delay = 0, className}: {children: React.ReactNode; delay?: number; className?: string}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : {opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.7, delay, ease: EASE}}
    >
      {children}
    </motion.div>
  )
}

function ContactCta({href, label, variant = 'dark', className = ''}: {href: string; label: string; variant?: 'dark' | 'yellow'; className?: string}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 px-6 py-3.5 text-sm font-bold rounded-sm transition-colors ${
        variant === 'yellow'
          ? 'bg-wdd-yellow text-wdd-black hover:bg-white'
          : 'bg-wdd-black text-white hover:bg-wdd-black/85'
      } ${className}`}
    >
      {label}
      <span className={`transition-transform group-hover:translate-x-1 ${variant === 'yellow' ? '' : 'text-wdd-yellow'}`}>→</span>
    </Link>
  )
}

function FaqItem({question, answer, defaultOpen}: {question: string; answer: string; defaultOpen?: boolean}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        <span className="text-lg font-bold leading-snug group-hover:text-wdd-mud transition-colors">
          {question}
        </span>
        <span
          className={
            'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-base font-bold transition-all duration-300 ' +
            (open
              ? 'bg-wdd-yellow border-wdd-yellow text-wdd-black rotate-45'
              : 'border-black/20 text-black/40 group-hover:border-black/40')
          }
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.35, ease: EASE}}
            className="overflow-hidden"
          >
            <p className="text-base font-light text-black/70 leading-8 pb-7 pr-12 whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContextMedia({videoUrl, imageUrl, cover}: {videoUrl?: string | null; imageUrl?: string | null; cover?: boolean}) {
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  const togglePause = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  const restart = () => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = 0
    el.play()
  }

  const btn = 'bg-black/50 hover:bg-black/75 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors'

  if (videoUrl) {
    return (
      <>
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay loop muted playsInline
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          className={cover ? 'absolute inset-0 w-full h-full object-cover' : 'block w-full h-auto'}
        />
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button onClick={restart} className={btn} aria-label="Recommencer la vidéo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>
            </svg>
          </button>
          <button onClick={togglePause} className={btn} aria-label={paused ? 'Lire la vidéo' : 'Mettre en pause'}>
            {paused ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>
            )}
          </button>
          <button onClick={toggleMute} className={btn} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </div>
      </>
    )
  }
  return (
    <Image
      src={imageUrl ?? '/images/foreuse-wide.jpg'}
      alt=""
      fill
      className="object-cover object-center"
    />
  )
}

/* Ground cross-section, played once when it scrolls into view: the probe goes
   down to 150 m, the ground hands back 15 °C, the heat pump inside the house
   lifts it, and the house warms up. Drawn as a quiet technical section.
   The drawing is laid out in real pixels: the ground spans the full column
   width, the overall height follows the text column, the house keeps its
   proportions. House coordinates below are in its own 400-wide design space. */
const HOUSE = {top: 72, ground: 200, centerX: 210, probeX: 268, pacY: 178, pacH: 16}

// Phase timings (ms): 1 probe down · 2 ground heat · 3 up to the PAC · 4 house warm
const PHASE_AT = [0, 400, 3000, 4400, 5600]

const C = {
  ink: '#1A1A1A', line: 'rgba(26,26,26,0.45)', faint: 'rgba(26,26,26,0.1)',
  // WDD palette: grass for the house, mud (orange) for the heat pump, yellow for the probe
  house: '#42754F', houseDim: '#35603F', pac: '#AB572E', probe: '#FFD94F',
}

function DepthSection({v, contactHref}: {v: V2T; contactHref: string}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, {once: true, amount: 0.35})
  const reduce = useReducedMotion()
  const [rawPhase, setPhase] = useState(0)
  const phase = reduce ? (inView ? 4 : 0) : rawPhase

  useEffect(() => {
    if (!inView) return
    if (reduce) return
    const timers = PHASE_AT.slice(1).map((ms, i) => setTimeout(() => setPhase(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [inView, reduce])

  // Track the drawing box so the ground fills the column and the height matches the text
  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({w: 400, h: 540})
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect
      if (width > 0 && height > 0) setBox({w: Math.round(width), h: Math.round(height)})
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const {w: W, h: H} = box
  const scale = Math.max(0.6, Math.min(W / 400, (H * 0.3) / (HOUSE.ground - HOUSE.top)))
  const groundY = 8 + (HOUSE.ground - HOUSE.top) * scale
  const houseX = W / 2 - HOUSE.centerX * scale
  const probeX = houseX + HOUSE.probeX * scale
  const probeBottom = H - 24
  const pacBottom = groundY - (HOUSE.ground - HOUSE.pacY - HOUSE.pacH) * scale
  const depthY = (d: number) => groundY + (d / 150) * (probeBottom - groundY)
  const stratum = (y: number) => `M0 ${y} C ${W * 0.25} ${y - 8}, ${W * 0.5} ${y + 10}, ${W * 0.75} ${y - 2} S ${W} ${y + 2}, ${W} ${y + 2}`

  const steps = v.principleSteps
  const draw = (on: boolean, duration: number) => ({
    initial: {pathLength: 0},
    animate: {pathLength: on ? 1 : 0},
    transition: {duration: reduce ? 0 : duration, ease: 'easeInOut' as const},
  })

  return (
    <section ref={ref} className="bg-wdd-clay py-28 md:py-36 px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">{v.principleTitle}</h2>
          <p className="mt-6 text-base font-light text-black/60 leading-8 max-w-xl">{v.principleIntro}</p>
          <ol className="mt-10">
            {steps.map((s, i) => {
              const on = phase >= i + 1
              const current = phase === i + 1 || (phase === 4 && i === 3)
              return (
                <li
                  key={s.title}
                  className={`flex gap-5 py-4 border-t border-black/10 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-35'}`}
                >
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-700 ${current || (on && phase === 4) ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/50'}`}>
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-bold leading-snug">{s.title}</div>
                    <div className="text-sm font-light text-black/60 leading-6 mt-1">{s.body}</div>
                  </div>
                </li>
              )
            })}
          </ol>
          <ContactCta href={contactHref} label={v.ctaSoil} className="mt-8" />
        </div>

        <div ref={boxRef} className="relative w-full aspect-[400/540] lg:aspect-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" role="img" aria-label={v.principleTitle}>
            <defs>
              <linearGradient id="wdd-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#D3CBBC" />
                <stop offset="1" stopColor="#C2B8A6" />
              </linearGradient>
              <filter id="wdd-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>

            {/* Ground and strata, full column width */}
            <rect x="0" y={groundY} width={W} height={H - groundY} fill="url(#wdd-ground)" fillOpacity="0.55" />
            <rect x="0" y={groundY} width={W} height={H - groundY} filter="url(#wdd-grain)" opacity="0.12" style={{mixBlendMode: 'multiply'}} />
            <path d={stratum(depthY(52))} stroke={C.faint} fill="none" />
            <path d={stratum(depthY(105))} stroke={C.faint} fill="none" />

            {/* Depth scale */}
            {[0, 50, 100, 150].map(d => {
              const y = depthY(d)
              return (
                <g key={d}>
                  <line x1="0" x2="12" y1={y} y2={y} stroke={C.line} />
                  <text x="18" y={d === 0 ? y + 14 : y + 4} fontSize="11" fill={C.ink} fillOpacity="0.5">{d} m</text>
                </g>
              )
            })}

            {/* Closed probe loop */}
            <g stroke={C.probe} strokeWidth="2" fill="none">
              <motion.path d={`M${probeX - 5} ${groundY} V${probeBottom}`} {...draw(phase >= 1, 2.4)} />
              <motion.path d={`M${probeX + 5} ${groundY} V${probeBottom}`} {...draw(phase >= 1, 2.4)} />
              <motion.path
                d={`M${probeX - 5} ${probeBottom} Q${probeX} ${probeBottom + 10} ${probeX + 5} ${probeBottom}`}
                initial={{opacity: 0}}
                animate={{opacity: phase >= 2 ? 1 : 0}}
              />
            </g>

            {/* Fluid circulating in the loop: down one leg, back up the other */}
            {phase >= 2 && [0, 1, 2].map(i => (
              <g key={i}>
                <motion.circle
                  cx={probeX - 5}
                  r="2.5"
                  fill={C.probe}
                  initial={{cy: groundY, opacity: 0}}
                  animate={reduce ? {cy: depthY(50), opacity: 1} : {cy: [groundY, probeBottom], opacity: [0, 1, 1, 0]}}
                  transition={reduce ? {duration: 0} : {duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: 'linear'}}
                />
                <motion.circle
                  cx={probeX + 5}
                  r="2.5"
                  fill={C.probe}
                  initial={{cy: probeBottom, opacity: 0}}
                  animate={reduce ? {cy: depthY(100), opacity: 1} : {cy: [probeBottom, groundY], opacity: [0, 1, 1, 0]}}
                  transition={reduce ? {duration: 0} : {duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: 'linear'}}
                />
              </g>
            ))}

            {/* House silhouette (main gable + lower annex holding the heat pump), kept in proportion */}
            <g transform={`translate(${houseX} ${groundY - HOUSE.ground * scale}) scale(${scale})`}>
              <path
                d={`M120 ${HOUSE.ground} V128 L180 72 L240 128 V152 L300 178 V${HOUSE.ground} Z`}
                fill={C.house}
                stroke={C.house}
                strokeWidth="8"
                strokeLinejoin="round"
              />
              <motion.rect
                x={HOUSE.probeX - 10} y={HOUSE.pacY} width="20" height={HOUSE.pacH} rx="2"
                initial={false}
                animate={{fill: phase >= 3 ? C.pac : C.houseDim}}
                transition={{duration: 0.8}}
              />
            </g>

            {/* Probe rises through the slab into the heat pump */}
            <g stroke={C.probe} strokeWidth="2" fill="none">
              <motion.path d={`M${probeX - 5} ${groundY} V${pacBottom}`} {...draw(phase >= 3, 0.6)} />
              <motion.path d={`M${probeX + 5} ${groundY} V${pacBottom}`} {...draw(phase >= 3, 0.6)} />
            </g>
          </svg>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function ParticuliersPage({
  page,
  locale,
  chantiers = [],
  settings,
}: {
  page: ParticuliersPageData
  locale: AppLocale
  chantiers?: Chantier[]
  settings?: GlobalSettingsData | null
}) {
  const t = UI[locale]
  const v = V2[LANG[locale]]

  const whyItems =
    page.whyItems && page.whyItems.length > 0 ? page.whyItems : DEFAULT_WHY_ITEMS

  const faqs =
    page.faqs && page.faqs.length > 0
      ? page.faqs.map((f) => ({question: f.question ?? '', answer: f.answer ?? ''}))
      : DEFAULT_FAQS

  // Homes first: this page speaks to homeowners
  const sortedChantiers = [...chantiers].sort(
    (a, b) => Number(b.sector === 'residentiel') - Number(a.sector === 'residentiel'),
  )

  const contactHref = getLocalizedPath(locale, 'contact')

  // Calculateur d'économies d'énergie
  const [ecoMode, setEcoMode] = useState<'surface' | 'conso'>('surface')
  const [ecoSurface, setEcoSurface] = useState(150)
  const [ecoConso, setEcoConso] = useState(18)
  const [ecoEnergie, setEcoEnergie] = useState<'gaz' | 'mazout' | 'elec'>('gaz')
  const [posteChauffage, setPosteChauffage] = useState(true)
  const [posteRafraich, setPosteRafraich] = useState(false)
  const [postePiscine, setPostePiscine] = useState(false)

  const ecoCalc = (() => {
    // MWh chauffage annuels (consommation thermique)
    const chaufMWh = ecoMode === 'surface' ? ecoSurface * 0.090 : ecoConso
    // MWh rafraîchissement (25% des besoins chauffage)
    const rafraichMWh = chaufMWh * 0.28
    // Piscine: ~8 MWh/an fixe (piscine résidentielle standard)
    const piscMWh = 8

    // Prix actuel €/MWh par énergie
    const prixMWh: Record<string, [number, number]> = {
      gaz:   [115, 140],
      mazout:[125, 155],
      elec:  [270, 320],
    }
    const [pLow, pHigh] = prixMWh[ecoEnergie]

    // Coût géothermie: COP 4.5, élec 0.28 €/kWh → ~62 €/MWh utile
    const pGeoLow = 55, pGeoHigh = 70

    // Free-cooling: EER 20 → ~14 €/MWh vs clim EER 3 → ~93 €/MWh
    const pRafActuel: [number, number] = [85, 100]
    const pRafGeo: [number, number] = [12, 18]

    // Piscine: PAC géo vs chaudière gaz
    const pPiscActuel: [number, number] = [115, 140]
    const pPiscGeo: [number, number] = [55, 70]

    const chauffage = posteChauffage ? {
      mwh: Math.round(chaufMWh * (1 - pGeoHigh / pLow) * 10) / 10,
      eurLow: Math.round(chaufMWh * (pLow - pGeoHigh) / 100) * 100,
      eurHigh: Math.round(chaufMWh * (pHigh - pGeoLow) / 100) * 100,
    } : null

    const rafraich = posteRafraich ? {
      mwh: Math.round(rafraichMWh * (1 - pRafGeo[1] / pRafActuel[0]) * 10) / 10,
      eurLow: Math.round(rafraichMWh * (pRafActuel[0] - pRafGeo[1]) / 100) * 100,
      eurHigh: Math.round(rafraichMWh * (pRafActuel[1] - pRafGeo[0]) / 100) * 100,
    } : null

    const piscine = postePiscine ? {
      mwh: Math.round(piscMWh * (1 - pPiscGeo[1] / pPiscActuel[0]) * 10) / 10,
      eurLow: Math.round(piscMWh * (pPiscActuel[0] - pPiscGeo[1]) / 100) * 100,
      eurHigh: Math.round(piscMWh * (pPiscActuel[1] - pPiscGeo[0]) / 100) * 100,
    } : null

    const totalMWh = Math.round(((chauffage?.mwh ?? 0) + (rafraich?.mwh ?? 0) + (piscine?.mwh ?? 0)) * 10) / 10
    const totalEurLow = (chauffage?.eurLow ?? 0) + (rafraich?.eurLow ?? 0) + (piscine?.eurLow ?? 0)
    const totalEurHigh = (chauffage?.eurHigh ?? 0) + (rafraich?.eurHigh ?? 0) + (piscine?.eurHigh ?? 0)
    const co2 = Math.round(totalMWh * 202) // kg CO2 évités (facteur gaz BE)

    return { chaufMWh, rafraichMWh, piscMWh, chauffage, rafraich, piscine, totalMWh, totalEurLow, totalEurHigh, co2 }
  })()

  const fmt = (n: number) => Math.round(n).toLocaleString(t.fmtLocale)

  const videoUrl = page.contextVideo?.asset?.url ?? null

  return (
    <div className="flex flex-col bg-white">

      {/* ══════════════════════════════════════
          1. HERO
          Objectif : capter l'attention, poser
          le bénéfice #1, lancer vers l'action
      ══════════════════════════════════════ */}
      <section className="h-[90vh] relative overflow-hidden px-8 md:px-16">

        {/* Couche 1 : fond-terre-2 sur la moitié gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <Image
            src={page.heroLeftBgImage ? urlFor(page.heroLeftBgImage)?.url() ?? '/images/wdd-geothermie_fermee-terre.webp' : '/images/wdd-geothermie_fermee-terre.webp'}
            alt=""
            fill
            className="object-cover object-center scale-[1.04]"
            style={{filter: 'saturate(1.5) blur(0.8px)'}}
            priority
          />
          <div className="absolute inset-0 bg-wdd-black/30" />
        </div>
        {/* Couche 1b : image de fond plein écran sur mobile */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src={page.heroRightImage ? urlFor(page.heroRightImage)?.url() ?? '/images/WDD-particuliers.webp' : '/images/WDD-particuliers.webp'}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-wdd-black/60" />
        </div>

        {/* Couche 3 : photo foreuse sur la moitié droite */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-[2] hidden lg:block">
          <Image
            src={page.heroRightImage ? urlFor(page.heroRightImage)?.url() ?? '/images/WDD-particuliers.webp' : '/images/WDD-particuliers.webp'}
            alt="Foreuse WellDoneDrill sur chantier"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Floating info panels — 3 arguments en cycle */}
          <div className="absolute bottom-8 right-8 z-10">
            <FloatingInfoPanel
              items={
                page.heroPanelItems && page.heroPanelItems.length > 0
                  ? page.heroPanelItems.map(i => ({label: i.label ?? '', value: i.value ?? '', sub: i.sub}))
                  : [
                      {label: 'Économies annuelles moyennes', value: '~1 200 €', sub: 'par foyer converti'},
                      {label: 'Coefficient de performance',  value: 'COP 4–5',   sub: '4× plus efficace que le gaz'},
                      {label: 'Réduction de facture',        value: '–70 %',     sub: 'sur vos coûts de chauffage'},
                    ]
              }
            />
          </div>
        </div>

        {/* Logo centré sur la séparation gauche / droite */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none">
          <Image
            src="/images/small-white-logo-droit.png"
            alt="WellDoneDrill"
            width={144}
            height={144}
            className="object-contain"
          />
        </div>

        {/* Couche 4 : contenu — même conteneur que toutes les sections */}
        <div className="relative z-[3] max-w-screen-2xl mx-auto h-[90vh] flex items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 py-24">

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.08] mb-6">
              {page.heroTitle ?? (
                <>
                  Chauffez et climatisez<br />
                  sans gaz, sans mazout.
                </>
              )}
            </h1>

            <p className="text-base font-normal text-white leading-relaxed max-w-lg mb-10">
              {page.heroSubtitle ??
                "WellDoneDrill fore vos sondes géothermiques. Votre maison se chauffe et se rafraîchit avec l'énergie du sol — jusqu'à 70 % d'économies sur vos factures."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href={getLocalizedPath(locale, 'contact')}
                className="bg-white text-wdd-black px-7 py-3.5 text-sm font-bold border-2 border-white hover:bg-transparent hover:text-white transition-colors rounded-sm"
              >
                {page.heroCtaDevisLabel ?? "Recevoir un devis immédiatement"}
              </Link>
              <a
                href="#calculateur"
                className="px-7 py-3.5 text-sm font-semibold border-2 border-white/30 text-white/80 hover:border-white hover:text-white transition-colors rounded-sm"
              >
                {page.heroCtaCalculLabel ?? "Calculer mes économies"}
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          01. LE PROBLÈME — accroche et chiffres clés à gauche, vidéo à droite
      ══════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
                {page.problemTitle ?? "Optez pour l'efficacité et l'indépendance énergétique."}
              </h2>
              <p className="mt-6 text-base font-light text-black/60 leading-8">
                {page.problemBody ??
                  "Le prix du gaz a bondi de 180 % depuis 2021. Chaque année sans action coûte en factures, en entretien, et en valeur PEB perdue."}
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 max-w-xl">
              {v.usps.map((usp, i) => {
                const Icon = USP_ICONS[i] ?? USP_ICONS[0]
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
            <Reveal delay={0.2}>
              <ContactCta href={contactHref} label={v.ctaStudy} className="mt-10" />
            </Reveal>
          </div>

          {/* Same height as the text column: the video is cropped in width only */}
          <Reveal delay={0.1} className="relative overflow-hidden rounded-sm bg-wdd-clay aspect-video lg:aspect-auto">
            <ContextMedia
              videoUrl={videoUrl}
              imageUrl={page.contextImage ? urlFor(page.contextImage)?.url() ?? null : null}
              cover
            />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          02. LE PRINCIPE — coupe de terrain animée
      ══════════════════════════════════════ */}
      <DepthSection v={v} contactHref={contactHref} />

      {/* ══════════════════════════════════════
          03. LE CHANTIER CHEZ VOUS
      ══════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="relative px-8 md:px-16 py-28 md:py-36">
          <div className="max-w-screen-2xl mx-auto w-full">
            <div className="lg:w-1/2 lg:pr-16">
              <Reveal>
                <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">{v.siteTitle}</h2>
                <p className="mt-6 text-base font-light text-black/60 leading-8">{v.siteIntro}</p>
              </Reveal>
              <ol className="relative mt-12 space-y-8 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-black/10">
                {v.siteSteps.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.06}>
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
                <ContactCta href={contactHref} label={v.ctaStudy} className="mt-10" />
              </Reveal>
            </div>
          </div>
        </div>
        <div className="relative aspect-square lg:aspect-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2">
          <Image
            src="/images/wdd-chantier-drone.jpg"
            alt="Foreuse WellDoneDrill en action dans le jardin d'une maison"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[62%_center]"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          04. VOS BÉNÉFICES — grille bento
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay py-28 md:py-36 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full">
          <Reveal>
            <h2 className="max-w-3xl text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
              {page.whyTitle ?? "Six raisons de passer à la géothermie cette année."}
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {whyItems.map((item, i) => {
              const key = ('_key' in item ? (item._key as string | undefined) : undefined) ?? i
              if (i === 0) {
                return (
                  <Reveal key={key} className="md:col-span-2 lg:row-span-2">
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
                <Reveal key={key} delay={(i % 4) * 0.06} className={i === 5 ? 'lg:col-span-2' : ''}>
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
                href={getLocalizedPath(locale, 'contact')}
                className="group h-full min-h-[10rem] bg-wdd-black text-white rounded-sm p-7 flex items-end justify-between gap-6 hover:bg-wdd-black/90 transition-colors"
              >
                <span className="text-2xl font-bold leading-tight max-w-xs">{t.startProject.replace(/\s*→\s*$/, '')}</span>
                <span className="shrink-0 w-12 h-12 rounded-full bg-wdd-yellow text-wdd-black flex items-center justify-center text-xl font-bold group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          05. NOS RÉALISATIONS (résidentiel d'abord)
      ══════════════════════════════════════ */}
      {t.showMap && (
        <ProjetsSection
          locale={locale}
          chantiers={sortedChantiers}
          t={t}
        />
      )}

      {/* ══════════════════════════════════════
          06. CALCULATEUR D'ÉCONOMIES
      ══════════════════════════════════════ */}
      <section id="calculateur" className={`${t.calcBg} min-h-screen flex flex-col justify-center px-8 md:px-16 py-28`}>
        <div className="max-w-screen-2xl mx-auto w-full">

          <div className="grid lg:grid-cols-2 gap-12 mb-14">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
                {t.calcTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="self-end">
              <p className="text-base font-light text-black/55 leading-8">
                {t.calcIntro}
              </p>
            </Reveal>
          </div>

          {/* Configurateur + Résultats */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 mb-14">

            {/* ── Configurateur ── */}
            <div className="space-y-10">

              {/* Mode d'entrée */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">{t.inputModeLabel}</div>
                <div className="flex gap-1.5">
                  {([['surface', t.surfaceMode],['conso', t.consoMode]] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setEcoMode(v)}
                      className={`px-4 py-2.5 text-sm font-bold transition-colors rounded-sm ${ecoMode === v ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider surface ou consommation */}
              {ecoMode === 'surface' ? (
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-black/40">{t.surfaceLabel}</div>
                    <div className="text-2xl font-bold text-wdd-black tabular-nums">{ecoSurface} m²</div>
                  </div>
                  <input type="range" min={60} max={400} step={5} value={ecoSurface}
                    onChange={e => setEcoSurface(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-black/15 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-wdd-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-black/30 mt-2"><span>60 m²</span><span>400 m²</span></div>
                  <div className="text-xs text-black/40 mt-3">
                    {t.consoFromSurface.replace('{n}', String(Math.round(ecoSurface * 0.090 * 10) / 10))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-black/40">{t.consoLabel}</div>
                    <div className="text-2xl font-bold text-wdd-black tabular-nums">{ecoConso} {t.consoUnit}</div>
                  </div>
                  <input type="range" min={5} max={80} step={1} value={ecoConso}
                    onChange={e => setEcoConso(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-black/15 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-wdd-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-black/30 mt-2"><span>5 MWh</span><span>80 MWh</span></div>
                  <div className="text-xs text-black/40 mt-3">
                    {t.surfaceFromConso.replace('{n}', String(Math.round(ecoConso / 0.090)))}
                  </div>
                </div>
              )}

              {/* Énergie actuelle */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">{t.energyLabel}</div>
                <div className="flex gap-1.5">
                  {([['gaz', t.gasOption],['mazout', t.oilOption],['elec', t.elecOption]] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setEcoEnergie(v)}
                      className={`px-4 py-2.5 text-sm font-bold transition-colors rounded-sm ${ecoEnergie === v ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Postes concernés */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">{t.postesLabel}</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: t.posteHeating, active: posteChauffage, toggle: () => setPosteChauffage(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v10.5M12 22a4 4 0 100-8 4 4 0 000 8z"/><path d="M8 6H6M8 10H5M8 14H6"/></svg> },
                    { label: t.posteCooling, active: posteRafraich, toggle: () => setPosteRafraich(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07l14.14-14.14"/></svg> },
                    { label: t.postePool, active: postePiscine, toggle: () => setPostePiscine(p => !p),
                      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="12" cy="6" r="2"/></svg> },
                  ].map(p => (
                    <button key={p.label} onClick={p.toggle}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors rounded-sm ${p.active ? 'bg-wdd-yellow text-wdd-black' : 'bg-black/8 text-black/45 hover:bg-black/12 hover:text-black/70'}`}>
                      {p.icon}{p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Résultats ── */}
            <div className="bg-wdd-black text-white p-8 flex flex-col rounded-sm lg:sticky lg:top-24 self-start">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-6">
                {t.savingsTitle}
              </div>

              {/* Total mis en avant */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-white/45 mb-2">{t.totalLabel}</div>
                <div className="text-4xl font-bold text-wdd-yellow tabular-nums leading-none">
                  {fmt(ecoCalc.totalEurLow)} – {fmt(ecoCalc.totalEurHigh)} €
                </div>
                <div className="text-sm font-light text-white/55 mt-2">
                  {t.totalSub.replace('{mwh}', String(ecoCalc.totalMWh)).replace('{co2}', fmt(ecoCalc.co2))}
                </div>
              </div>

              {/* Détail par poste */}
              <div className="flex flex-col gap-0 flex-1">
                {[
                  { data: ecoCalc.chauffage, label: t.posteHeating, active: posteChauffage,
                    mwhBase: Math.round(ecoCalc.chaufMWh * 10)/10 },
                  { data: ecoCalc.rafraich, label: t.posteCooling, active: posteRafraich,
                    mwhBase: Math.round(ecoCalc.rafraichMWh * 10)/10 },
                  { data: ecoCalc.piscine, label: t.postePool, active: postePiscine,
                    mwhBase: ecoCalc.piscMWh },
                ].map(p => (
                  <div key={p.label}
                    className={`flex items-center justify-between py-4 border-b border-white/10 last:border-b-0 transition-opacity ${p.active ? 'opacity-100' : 'opacity-30'}`}>
                    <div>
                      <div className="text-sm font-bold">{p.label}</div>
                      <div className="text-xs text-white/45 mt-0.5">
                        {p.active ? `${p.data?.mwh ?? 0} MWh / ${p.mwhBase} MWh` : t.notSelected}
                      </div>
                    </div>
                    <div className="text-right">
                      {p.active && p.data ? (
                        <>
                          <div className="text-base font-bold tabular-nums">
                            {fmt(p.data.eurLow)} – {fmt(p.data.eurHigh)} €
                          </div>
                          <div className="text-[10px] text-white/40 mt-0.5">/an</div>
                        </>
                      ) : (
                        <div className="text-sm text-white/30">—</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="text-xs font-light text-white/40 leading-5">
                  {t.disclaimer}
                </div>
              </div>

              <ContactCta href={contactHref} label={v.ctaQuote} variant="yellow" className="mt-6 justify-center" />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA DÉMARRER
      ══════════════════════════════════════ */}
      <DemarrerCTA locale={locale} settings={settings} />

      {/* ══════════════════════════════════════
          07. FAQ — lever les derniers freins
      ══════════════════════════════════════ */}
      <section className="bg-wdd-clay py-28 md:py-32 px-8 md:px-16">
        <div className="max-w-screen-2xl mx-auto w-full grid lg:grid-cols-3 gap-16">
          <Reveal>
            <h2 className="text-4xl font-bold mb-4 leading-[1.05] tracking-tight">
              {page.faqTitle ?? "Vos questions, nos réponses."}
            </h2>
            <p className="text-base font-light text-black/55 leading-7 mb-8">
              {t.faqSub}
            </p>
            <Link
              href={getLocalizedPath(locale, 'contact')}
              className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors rounded-sm"
            >
              {t.faqCta}
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
          Objectif : conversion mobile permanente
          visible à chaque scroll
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-wdd-black border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <a
          href="#calculateur"
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-black bg-wdd-yellow border-2 border-wdd-yellow rounded-sm"
        >
          {t.mobileCta1}
        </a>
        <Link
          href={getLocalizedPath(locale, 'contact')}
          className="flex-1 text-center py-3 text-sm font-bold text-wdd-yellow border-2 border-wdd-yellow hover:bg-wdd-yellow hover:text-wdd-black transition-colors rounded-sm"
        >
          {t.mobileCta2}
        </Link>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   PROJETS SECTION
───────────────────────────────────────────── */

const PER_PAGE = 4

function matchesProvince(c: Chantier, p: Province): boolean {
  if (!c.province) return false
  if (c.province === p.slug) return true
  const cp = c.province.toLowerCase()
  return cp.includes(p.nameFr.toLowerCase()) || cp.includes(p.nameNl.toLowerCase())
}

function ProjetsSection({locale, chantiers, t}: {locale: AppLocale; chantiers: Chantier[]; t: UiT}) {
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
    ? t.mapAllInProvince.replace('{name}', getProvinceName(selectedProvince, locale))
    : t.mapAllRealisations

  return (
    <section className="bg-white min-h-screen flex flex-col justify-center px-8 md:px-16 py-28">
      <div className="max-w-screen-2xl mx-auto w-full">

        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
              {t.mapTitle} <span className="text-wdd-mud">{t.mapCountry}</span>
            </h2>
          </div>
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setPage(0) }}
              className="text-xs font-light text-black/35 hover:text-black/70 transition-colors underline underline-offset-2 shrink-0"
            >
              {t.mapAll}
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Map — viewBox cropped to Belgium's actual bounds, no whitespace ── */}
          <div>
            <svg
              viewBox="55 350 940 730"
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
            >
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
                    : t.mapHint}
              </span>
            </div>
          </div>

          {/* ── Cards — fixed height prevents layout shift on province change ── */}
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
                      {t.mapEmpty}
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

            {/* Dots + CTA */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {totalPages > 1 && Array.from({length: totalPages}).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`transition-all duration-200 rounded-full ${
                      i === safePage
                        ? 'w-5 h-2 bg-wdd-black'
                        : 'w-2 h-2 bg-black/20 hover:bg-black/45'
                    }`}
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

function ProjetCard({chantier: c, locale}: {chantier: Chantier; locale: AppLocale}) {
  const imgUrl = chantierImageUrl(c.photo, 600)
  const href = c.slug ? getProvincePageUrl(locale, c.slug) : undefined
  const provinceDisplay = localizedProvince(c.province, locale)

  const inner = (
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
            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
              c.type === 'fermee'
                ? 'bg-wdd-yellow text-wdd-black'
                : 'border border-black/20 text-black/50'
            }`}>
              {TYPE_LABEL[locale][c.type as 'fermee' | 'ouverte'] ?? c.type}
            </span>
          )}
          {c.sector && (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black/12 text-black/40">
              {SECTOR_LABEL[locale][c.sector] ?? c.sector}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug line-clamp-3">
          {c.title ?? 'Projet géothermique'}
        </h3>
        {(c.location || provinceDisplay) && (
          <p className="text-xs font-light text-black/40 truncate mt-auto">
            {[c.location, provinceDisplay].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )

  return href ? (
    <Link href={href} className="flex flex-col h-[248px]">{inner}</Link>
  ) : inner
}

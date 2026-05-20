/**
 * Seed script — creates default French (be-fr) Sanity documents from hardcoded fallbacks.
 * Run: node seed.mjs
 */
import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import {resolve} from 'path'

dotenv.config({path: resolve(process.cwd(), '../.env.local')})

const client = createClient({
  projectId: 'o8tuydyo',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function upsert(doc) {
  const existing = await client.fetch(`*[_id == $id][0]._id`, {id: doc._id})
  if (existing) {
    console.log(`  skip (exists): ${doc._id}`)
    return
  }
  await client.createOrReplace(doc)
  console.log(`  created: ${doc._id}`)
}

// ─── GLOBAL SETTINGS ────────────────────────────────────────────────────────
await upsert({
  _id: 'globalSettings',
  _type: 'globalSettings',
  phone: '+32 478 75 36 79',
  email: 'info@welldonedrill.be',
  ctaTitle: 'Votre projet commence ici.',
  ctaBody: "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement.",
  ctaButtonLabel: 'Démarrer votre projet →',
  stat1Value: 'Gratuit',
  stat1Label: 'Étude de faisabilité',
  stat2Value: '48h',
  stat2Label: 'Délai de réponse',
})

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
await upsert({
  _id: 'homePage-be-fr',
  _type: 'homePage',
  locale: 'be-fr',
  hero: {
    tag: 'Forage géothermique en Belgique & Luxembourg',
    title: 'De la chaleur durable\nen dessous de vos pieds.',
    subtitle: "WellDoneDrill fore et installe des systèmes géothermiques sur mesure pour particuliers, promoteurs et institutions. Étude de sol gratuite, permis, réalisation — un seul interlocuteur.",
    ctaLabel: 'Démarrer votre projet →',
    secondaryLabel: 'Voir nos réalisations',
  },
  advantages: {
    eyebrow: 'Pourquoi la géothermie ?',
    title: 'La solution de chauffage',
    highlight: 'la plus efficace.',
    introText: "La géothermie est la solution de premier choix pour un confort thermique privilégié. Elle s'adapte des petits projets unifamiliaux aux grands réseaux de chaleur.",
    items: [
      {_key: 'adv1', number: '01', title: 'Renouvelable', body: "L'énergie du sous-sol est inépuisable et locale. Zéro dépendance au marché des combustibles fossiles."},
      {_key: 'adv2', number: '02', title: 'Économique', body: "Jusqu'à 70 % d'économies sur la facture de chauffage. Retour sur investissement en 7 à 10 ans."},
      {_key: 'adv3', number: '03', title: 'Performant', body: "Coefficient de performance (COP) de 4 à 6 : pour 1 kWh électrique consommé, 4 à 6 kWh de chaleur produits."},
      {_key: 'adv4', number: '04', title: 'Discret', body: "Aucun équipement visible en façade. Installation souterraine permanente, sans bruit, sans entretien."},
    ],
  },
  audiences: {
    particular: {
      eyebrow: 'Pour les particuliers',
      title: "Profitez d'un confort optimal",
      description: 'Géothermie fermée pour votre maison. Confort constant, investissement rentabilisé en 7 à 10 ans.',
      buttonLabel: 'Calculer mes économies',
    },
    professional: {
      eyebrow: 'Pour les entreprises',
      title: 'Solutions sur mesure grandes installations',
      description: 'Bâtiments tertiaires, industries, institutions. Offre détaillée sous 48h.',
      buttonLabel: 'Intégrer la géothermie',
    },
  },
  services: {
    items: [
      {_key: 'svc1', title: 'Géothermie fermée', description: "Des sondes descendent à 80–150 m de profondeur pour capter la chaleur constante du sol. Idéal pour les maisons et bâtiments sans nappe phréatique requise.", routeKey: 'geo_fermee'},
      {_key: 'svc2', title: 'Géothermie ouverte', description: "La nappe phréatique, à température stable toute l'année, devient votre source d'énergie. Technique idéale pour les grands projets, avec les meilleurs rendements du secteur.", routeKey: 'geo_ouverte'},
    ],
  },
  contactCta: {
    title: 'Votre projet commence ici.',
    subtitle: "Étude géologique gratuite, permis, forage — une seule équipe de A à Z.\nRéponse sous 48h, sans engagement.",
    buttonLabel: 'Démarrer votre projet →',
    phone: '+32 478 75 36 79',
    stat1Value: 'Gratuit',
    stat1Label: 'Étude de faisabilité',
    stat2Value: '48h',
    stat2Label: 'Délai de réponse',
  },
  blog: {
    title: 'Nos dernières actus',
    highlight: 'sur la géothermie',
    readMoreLabel: 'Lire',
  },
})

// ─── GEO PAGE (be-fr) ────────────────────────────────────────────────────────
await upsert({
  _id: 'geoPage-be-fr',
  _type: 'geoPage',
  locale: 'be-fr',
  heroTitle: 'Géothermie fermée\net ouverte en Belgique.',
  heroSubtitle: "WellDoneDrill réalise des forages géothermiques pour tous types de projets. Étude géologique gratuite, permis, forage — une seule équipe.",
  introTitle: "La géothermie : une énergie propre\npuisée dans le sol.",
  introBody: "Le principe est simple : à quelques mètres de profondeur, la température du sol reste stable tout au long de l'année. Des sondes géothermiques descendent dans le sol et captent cette énergie pour chauffer ou rafraîchir vos bâtiments.",
  howTitle: "Comment ça fonctionne ?",
  howSteps: [
    {_key: 's1', title: 'Forage', body: "Une foreuse descend à 80–150 m de profondeur (fermé) ou jusqu'à la nappe (ouvert)."},
    {_key: 's2', title: 'Sondes / pompage', body: "Des sondes en U (fermé) ou des puits de pompage/rejet (ouvert) sont installés."},
    {_key: 's3', title: 'Pompe à chaleur', body: "La PAC extrait la chaleur du fluide et la transfère au circuit de chauffage."},
    {_key: 's4', title: 'Distribution', body: "Plancher chauffant, radiateurs basse température ou ventilo-convecteurs."},
  ],
  advantages: [
    {_key: 'a1', title: 'Investissement rentable', body: "Une facture énergétique en baisse grâce à une source de chaleur gratuite et renouvelable."},
    {_key: 'a2', title: 'Énergie renouvelable', body: "La chaleur du sol est inépuisable. Zéro combustible fossile, zéro émission directe."},
    {_key: 'a3', title: 'COP élevé', body: "4 à 6 kWh de chaleur pour 1 kWh électrique consommé. Bien supérieur à toute autre solution."},
    {_key: 'a4', title: 'Chauffage & climatisation', body: "La même installation chauffe l'hiver et rafraîchit l'été — sans système secondaire."},
    {_key: 'a5', title: 'Durée de vie 50 ans', body: "Les sondes géothermiques ont une durée de vie garantie de 50 ans et plus. Aucun entretien."},
    {_key: 'a6', title: 'Discrétion totale', body: "Aucun équipement visible. Installation entièrement souterraine après réalisation."},
    {_key: 'a7', title: 'PEB A garanti', body: "La géothermie fermée conduit systématiquement au niveau PEB A pour tout type de bâtiment."},
    {_key: 'a8', title: 'Valorisation du bien', body: "Un bien géothermique se revend en moyenne 8–12 % plus cher. Argument fort à la revente."},
  ],
  faqTitle: 'Vos questions,\nnos réponses.',
  faqs: [
    {_key: 'f1', question: "Quelle est la différence entre géothermie fermée et ouverte ?", answer: "La géothermie fermée utilise des sondes verticales en circuit fermé, applicable partout. La géothermie ouverte pompe directement dans la nappe phréatique — plus performante mais soumise à des conditions géologiques spécifiques."},
    {_key: 'f2', question: "Combien de temps dure le forage ?", answer: "Pour une maison unifamiliale, le forage prend 1 à 2 jours. Pour un projet plus grand, comptez 1 semaine par tranche de 4 à 6 forages."},
    {_key: 'f3', question: "Faut-il un permis pour forer ?", answer: "Oui. WellDoneDrill gère l'intégralité des démarches de permis — vous n'avez rien à faire."},
  ],
  particularEyebrow: 'Pour les particuliers',
  particularTitle: "Profitez d'un confort optimal",
  particularBody: 'Géothermie fermée pour votre maison. Confort constant, investissement rentabilisé en 7 à 10 ans.',
  particularCta: "Découvrir l'offre →",
  proEyebrow: 'Pour les professionnels',
  proTitle: 'Solutions sur mesure grandes installations',
  proBody: 'Bâtiments tertiaires, industries, institutions. Offre détaillée sous 48h.',
  proCta: "Découvrir l'offre →",
})

// ─── PARTICULIERS PAGE (be-fr) ───────────────────────────────────────────────
await upsert({
  _id: 'particuliersPage-be-fr',
  _type: 'particuliersPage',
  locale: 'be-fr',
  heroTitle: 'Chauffez votre maison\nsans gaz, sans mazout.',
  heroSubtitle: "WellDoneDrill fore sous votre propriété et installe un système géothermique clé en main. Étude gratuite, permis, réalisation — une seule équipe, un seul devis.",
  heroCtaDevisLabel: 'Demander une étude gratuite',
  heroCtaCalculLabel: 'Calculer mes économies',
  heroPanelItems: [
    {_key: 'p1', label: "Économies annuelles moyennes", value: "1 200 €", sub: "vs chauffage gaz — maison 150 m²"},
    {_key: 'p2', label: "Retour sur investissement", value: "7–10 ans", sub: "installation géothermique complète"},
    {_key: 'p3', label: "Durée de vie des sondes", value: "50 ans", sub: "sans entretien, garantie constructeur"},
  ],
  stats: [
    {_key: 's1', value: '+180 %', label: "Hausse du prix du gaz en Belgique depuis 2021"},
    {_key: 's2', value: '70 %', label: "Économies moyennes sur la facture de chauffage"},
    {_key: 's3', value: '50 ans', label: "Durée de vie garantie des sondes géothermiques"},
  ],
  problemTitle: "Le gaz coûte plus cher.\nLa géothermie, non.",
  problemBody: "Depuis 2021, le prix du gaz a été multiplié par 3 en Belgique. La géothermie, elle, puise dans une source d'énergie gratuite et stable : le sous-sol de votre propriété. Votre coût de chauffage devient prévisible pour 50 ans.",
  whyTitle: "Six raisons de passer à la géothermie cette année.",
  whyItems: [
    {_key: 'w1', title: "Jusqu'à 70 % d'économies", body: "En passant du gaz à la géothermie, nos clients économisent en moyenne 1 200 € par an sur leur facture énergétique."},
    {_key: 'w2', title: "Zéro combustible fossile", body: "La géothermie puise une énergie renouvelable dans le sol de votre propriété. Aucune émission directe, aucune dépendance au marché."},
    {_key: 'w3', title: "Chaud l'hiver, frais l'été", body: "La même installation assure le chauffage et la climatisation naturelle. Pas de système secondaire."},
    {_key: 'w4', title: "Patrimoine valorisé", body: "Un logement géothermique affiche un meilleur certificat PEB et se revend plus vite à un meilleur prix."},
    {_key: 'w5', title: "Indépendance énergétique", body: "Vous n'êtes plus exposé aux hausses du prix du gaz. Votre coût de chauffage devient prévisible pour 50 ans."},
    {_key: 'w6', title: "Durabilité prouvée", body: "Les sondes géothermiques ont une durée de vie de 50 ans et plus. Aucun entretien après installation."},
  ],
  faqTitle: "Vos questions, nos réponses.",
  faqs: [
    {_key: 'f1', question: "Combien coûte une installation géothermique au total ?", answer: "Pour une maison unifamiliale standard (150 m²), comptez entre 18 000 et 28 000 € pour le forage et l'installation complète (PAC incluse). Des primes wallonnes et fédérales peuvent couvrir jusqu'à 30 % du montant."},
    {_key: 'f2', question: "Ma propriété est-elle adaptée à la géothermie ?", answer: "La géothermie fermée est applicable sur la quasi-totalité des terrains belges et luxembourgeois. Un accès pour l'engin de forage (largeur min. 2,5 m) est la seule contrainte pratique. WDD réalise une étude de faisabilité gratuite pour confirmer."},
    {_key: 'f3', question: "Quelles primes peut-on obtenir en Wallonie ?", answer: "En Wallonie, une prime énergie couvre une partie du coût de la PAC géothermique. Des déductions fiscales fédérales s'appliquent également. WDD vous aide à monter les dossiers."},
    {_key: 'f4', question: "Combien de temps dure le chantier ?", answer: "Le forage prend 1 à 2 jours pour une maison unifamiliale. L'installation de la PAC par votre chauffagiste prend 1 à 2 jours supplémentaires. Total : moins d'une semaine."},
  ],
  seoTitle: 'Géothermie pour particuliers en Belgique | WellDoneDrill',
  seoDescription: "Forage géothermique pour maisons individuelles. Étude gratuite, permis, installation clé en main. Économisez jusqu'à 70 % sur votre chauffage.",
})

// ─── PRO PAGE — CHAUFFAGISTES (be-fr) ────────────────────────────────────────
await upsert({
  _id: 'proPage-be-fr-chauffagistes-v2',
  _type: 'proPage',
  locale: 'be-fr',
  routeKey: 'pro_chauffagistes',
  heroEyebrow: 'Partenaires installateurs',
  heroTitle: 'Géothermie :\najoutez le forage à votre offre.',
  heroSubtitle: "WellDoneDrill fore, vous installez la PAC. Un partenariat clair qui vous ouvre un marché à forte valeur ajoutée — sans charge administrative, sans investissement propre.",
  heroCtaLabel: 'Devenir partenaire WDD',
  heroPanelItems: [
    {_key: 'p1', label: 'Revenu par projet géothermique', value: '×2–3', sub: 'vs PAC air-air standard'},
    {_key: 'p2', label: 'Apport clients WDD partenaires', value: 'Inclus', sub: 'référencement sur notre réseau'},
    {_key: 'p3', label: 'Délai de réponse à vos demandes', value: '48 h', sub: 'planification forage garantie'},
  ],
  valueTitle: "Le marché change. Votre offre doit changer avec lui.",
  valueIntro: "L'interdiction des chaudières gaz pour les bâtiments neufs en 2026, combinée à la flambée des prix de l'énergie, crée une demande structurelle pour les solutions géothermiques. Vos clients se tournent vers les chauffagistes capables de proposer une alternative complète.",
  whyTitle: "Six raisons de proposer la géothermie à vos clients.",
  valueItems: [
    {_key: 'w1', title: "Revenu par projet multiplié", body: "Un chantier géothermique génère en moyenne 2 à 3 fois plus qu'une installation PAC air-air. Même client, même surface — plus de valeur créée, plus de marge pour vous."},
    {_key: 'w2', title: "Zéro friction administrative", body: "WellDoneDrill gère les permis de forage, les études de sol et les déclarations officielles. Vous restez concentré sur votre cœur de métier."},
    {_key: 'w3', title: "Planning prioritaire garanti", body: "Nos partenaires installateurs sont prioritaires dans notre carnet de chantiers. Le délai de forage est communiqué et contractuellement respecté dès la signature de votre client."},
    {_key: 'w4', title: "Kit commercial clé en main", body: "Brochures, fiches techniques, calculateurs d'économies adaptés à vos clients : tout pour que vous puissiez présenter et vendre la géothermie avec confiance."},
    {_key: 'w5', title: "La législation dans votre sens", body: "L'interdiction des chaudières gaz dès 2026 crée une demande que vos concurrents sans partenaire forage ne peuvent pas satisfaire. Prenez de l'avance maintenant."},
    {_key: 'w6', title: "Apport de clients WDD", body: "Les clients WellDoneDrill cherchent un installateur PAC certifié dans leur région. Les partenaires du réseau sont référencés en premier dans nos recommandations."},
  ],
  partnershipTitle: "Comment fonctionne le partenariat ?",
  partnershipIntro: "Un processus conçu pour que vous gardiez le contrôle total sur votre relation client, tout en accédant à notre expertise forage et à notre réseau.",
  partnershipSteps: [
    {_key: 'e1', title: "Candidature partenaire", body: "Soumettez votre profil : certification PAC, zone géographique, volume annuel estimé. Réponse sous 5 jours."},
    {_key: 'e2', title: "Onboarding & kit", body: "Accès au portail partenaire WDD, tarification préférentielle, documentation commerciale et technique."},
    {_key: 'e3', title: "Premier projet commun", body: "WDD intervient pour le forage selon votre planning. Vous installez la PAC dans la foulée."},
    {_key: 'e4', title: "Votre client, votre contrat", body: "Vous êtes et restez l'unique interlocuteur de votre client. WDD intervient en sous-traitance invisible."},
  ],
  faqTitle: "Questions fréquentes des installateurs.",
  faqs: [
    {_key: 'f1', question: "Je ne suis pas encore certifié PAC géothermique — puis-je devenir partenaire ?", answer: "Oui. Si vous êtes certifié pour les PAC en général (Qualipac ou équivalent), vous pouvez candidater. WDD peut vous orienter vers les formations de certification géothermique reconnues en Belgique et au Luxembourg."},
    {_key: 'f2', question: "Quel est le tarif WDD pour les partenaires ?", answer: "Nous ne publions pas de tarif public. Après validation de votre candidature, vous recevez une grille tarifaire partenaire confidentielle, basée sur votre volume annuel et votre zone géographique."},
    {_key: 'f3', question: "Comment se coordonne le planning de chantier ?", answer: "WDD intervient en premier (forage : 1 à 3 jours). Vous planifiez l'installation PAC dans les jours qui suivent. Notre planning est communiqué dès la signature de votre client."},
    {_key: 'f4', question: "WDD peut-il contacter directement mes clients ?", answer: "Non. Votre relation client est intacte. WDD intervient en tant que sous-traitant ; vos clients ne connaissent notre implication que si vous le souhaitez."},
    {_key: 'f5', question: "Quelle est la zone géographique couverte ?", answer: "Belgique et Grand-Duché de Luxembourg, toutes provinces. Extension en France du Nord et de l'Est à l'étude pour 2025–2026."},
  ],
})

// ─── PRO PAGE — ARCHITECTES (be-fr) ──────────────────────────────────────────
await upsert({
  _id: 'proPage-be-fr-architectes-v2',
  _type: 'proPage',
  locale: 'be-fr',
  routeKey: 'pro_architectes',
  heroEyebrow: "Architectes & bureaux d'études",
  heroTitle: "Dimensionnez la géothermie\ndès la conception.",
  heroSubtitle: "WellDoneDrill fournit l'étude géologique préliminaire dont vous avez besoin pour intégrer la géothermie dans vos projets dès l'esquisse — sans risque de promesse non tenue, avec les pièces techniques pour votre dossier de permis.",
  heroCtaLabel: "Demander une étude préliminaire",
  heroPanelItems: [
    {_key: 'p1', label: 'Résultat PEB standard', value: 'PEB A', sub: 'géothermie fermée, tous projets'},
    {_key: 'p2', label: 'Délai étude préliminaire', value: '72 h', sub: 'rapport PDF livré par email'},
    {_key: 'p3', label: 'Impact visuel extérieur', value: 'Zéro', sub: 'pas de groupe, pas de contrainte'},
  ],
  valueTitle: "PEB A sans compromis architecturaux.",
  valueIntro: "La réglementation NZEB exige des niveaux de performance énergétique de plus en plus stricts pour tout nouveau permis en Belgique et au Luxembourg. La géothermie fermée est la seule solution qui atteint systématiquement le PEB A — sans groupe extérieur visible, sans contrainte thermique en façade, sans bruit.",
  whyTitle: "Six bonnes raisons d'intégrer la géothermie dans vos projets.",
  valueItems: [
    {_key: 'w1', title: "PEB A sans compromis architecturaux", body: "La géothermie fermée ne génère aucune contrainte visuelle. Pas de groupe extérieur, pas d'impact thermique en façade. Vos partis pris architecturaux restent intacts."},
    {_key: 'w2', title: "Étude préliminaire gratuite à l'esquisse", body: "WDD réalise l'analyse du sous-sol de vos projets dès l'esquisse. Vous savez si c'est faisable avant de l'intégrer dans votre programme."},
    {_key: 'w3', title: "Documentation pour permis et PEB", body: "Nous fournissons les pièces techniques au format attendu par les services urbanistiques belges et luxembourgeois — intégrables directement dans votre note de calcul PEB."},
    {_key: 'w4', title: "Dimensionnement précis, pas de surprises", body: "Notre modélisation géologique détermine la profondeur et le nombre de forages exactement nécessaires. Empreinte au sol minimisée, planning maîtrisé."},
    {_key: 'w5', title: "Interlocuteur technique dédié", body: "Un ingénieur WDD suit votre dossier de l'esquisse à la réception. Disponible pour vos questions, vos coordinateurs de sécurité et vos BE fluides."},
    {_key: 'w6', title: "Coordination BE fluides native", body: "WDD travaille régulièrement avec des bureaux d'études thermiques et fluides. Nous fournissons les données géologiques et le dimensionnement, le BE intègre la PAC et le réseau."},
  ],
  partnershipTitle: "De l'esquisse à la réception.",
  partnershipIntro: "Quatre étapes claires pour intégrer la géothermie dans votre projet architecturalement et administrativement.",
  partnershipSteps: [
    {_key: 'e1', title: "Soumission du projet", body: "Transmettez l'adresse et les données de base : type de projet, surface, nombre d'unités, phase. Retour de faisabilité sous 72h."},
    {_key: 'e2', title: "Étude géologique préliminaire", body: "Analyse des données géologiques belges et luxembourgeoises. Rapport préliminaire livré au format PDF, rédigé pour être intégré à votre dossier."},
    {_key: 'e3', title: "Dimensionnement intégré", body: "WDD dimensionne le champ de sondes en fonction du projet architectural. Note de calcul intégrée à votre dossier PEB et à votre plan de masse."},
    {_key: 'e4', title: "Permis & réalisation", body: "WDD dépose et suit les demandes de permis de forage. Réalisation dans le calendrier de chantier, coordination directe avec votre maître d'œuvre."},
  ],
  faqTitle: "Vos questions d'architecte.",
  faqs: [
    {_key: 'f1', question: "À quelle phase du projet dois-je contacter WDD ?", answer: "Dès l'esquisse, idéalement. Plus tôt vous intégrez la géothermie dans le programme, plus les solutions de dimensionnement sont optimales et les contraintes de chantier prévisibles."},
    {_key: 'f2', question: "Quelle est l'empreinte au sol des forages ?", answer: "Chaque sonde occupe environ 0,1 m² au niveau du sol. L'engin de forage nécessite une zone d'accès de 3 × 6 m pendant les travaux. Aucune infrastructure permanente n'est visible après réalisation."},
    {_key: 'f3', question: "Le rapport préliminaire est-il utilisable dans un dossier de permis ?", answer: "Oui. Il est rédigé dans ce but et comprend les références réglementaires belges et luxembourgeoises, les données de profondeur et de débit estimé, et les coordonnées GPS pour l'implantation des forages."},
    {_key: 'f4', question: "WDD peut-il collaborer avec mon bureau d'études fluides ?", answer: "Absolument. WDD fournit les données géologiques et le dimensionnement du champ de sondes ; le BE fluides intègre la PAC et le réseau de distribution. Cette coordination est notre mode de travail habituel."},
  ],
})

// ─── PRO PAGE — ENTREPRENEURS (be-fr) ────────────────────────────────────────
await upsert({
  _id: 'proPage-be-fr-entrepreneurs-v2',
  _type: 'proPage',
  locale: 'be-fr',
  routeKey: 'pro_entrepreneurs',
  heroEyebrow: 'Promoteurs & entrepreneurs généraux',
  heroTitle: "La géothermie en\nsous-traitance clé en main.",
  heroSubtitle: "WellDoneDrill prend en charge le forage géothermique de vos chantiers résidentiels et tertiaires — permis, géologie, réalisation, documentation as-built. Vous bâtissez, nous forons.",
  heroCtaLabel: "Démarrer un projet géothermique",
  heroPanelItems: [
    {_key: 'p1', label: 'Valorisation vente avec géothermie', value: '+8–12 %', sub: 'vs logement PAC air-air'},
    {_key: 'p2', label: 'Certification énergétique standard', value: 'PEB A', sub: 'argument décisif pour les acheteurs'},
    {_key: 'p3', label: 'Responsabilité pour le forage', value: '1 contrat', sub: 'permis, géologie, réalisation'},
  ],
  valueTitle: "La géothermie comme argument de vente — et d'obligation.",
  valueIntro: "Les acheteurs comparent les charges énergétiques avant de signer. Un logement géothermique affiche un PEB A et des charges prévisibles pour 50 ans. Les promoteurs qui l'intègrent dès la conception ferment plus vite et à de meilleures conditions.",
  whyTitle: "Six raisons d'intégrer la géothermie dans votre prochain projet.",
  valueItems: [
    {_key: 'w1', title: "Premium de valeur mesurable", body: "En Belgique, un logement géothermique se revend en moyenne 8 à 12 % plus cher qu'un équivalent PAC air-air. Le surcoût de forage est généralement amorti dès la première transaction."},
    {_key: 'w2', title: "PEB A — l'argument qui ferme", body: "Un certificat PEB A est devenu un critère de décision pour les acheteurs et locataires premium. La géothermie y conduit systématiquement, sans exception ni aléa."},
    {_key: 'w3', title: "Sous-traitant responsable, un contrat", body: "WDD prend en charge les permis, études, forage et remise en état du terrain. Un seul contrat, une seule garantie, un seul interlocuteur pour tout le volet géothermique."},
    {_key: 'w4', title: "Planning intégré à votre chantier", body: "Nous intervenons en phase gros œuvre, avant les dallages, sans perturber les autres corps de métier. Les délais sont contractuellement engagés."},
    {_key: 'w5', title: "Économies d'échelle pour les lotissements", body: "Pour les projets multi-unités, WDD optimise un champ de sondes partagé : même puissance, moins de mètres forés. Le coût par unité diminue significativement avec le volume."},
    {_key: 'w6', title: "Matériel marketing inclus", body: "WDD fournit les données chiffrées, certifications et labels pour intégrer la géothermie dans votre communication promotionnelle. Un argument de vente documenté et crédible."},
  ],
  partnershipTitle: "De la faisabilité à la remise des clés.",
  partnershipIntro: "Cinq étapes entièrement gérées par WDD. Votre seul travail : nous transmettre l'adresse et le programme.",
  partnershipSteps: [
    {_key: 'e1', title: "Étude de faisabilité", body: "Transmettez l'adresse et le programme. WDD analyse la géologie et remet une étude avec budget prévisionnel sous 5 jours."},
    {_key: 'e2', title: "Devis & planning", body: "Offre clé en main (forage + permis + coordination). Planning intégré à votre calendrier de chantier."},
    {_key: 'e3', title: "Permis de forage", body: "WDD dépose et suit toutes les demandes d'autorisation. Zéro démarche administrative de votre côté."},
    {_key: 'e4', title: "Forage & mise en service", body: "Intervention en phase gros œuvre. Remise en état du terrain immédiate. Sondes livrées testées et prêtes à raccorder."},
    {_key: 'e5', title: "Dossier as-built complet", body: "Documentation de réception, certificats de garantie, dossier notarié et documents pour l'acquéreur."},
  ],
  faqTitle: "Questions fréquentes des promoteurs.",
  faqs: [
    {_key: 'f1', question: "La géothermie est-elle adaptée aux projets résidentiels collectifs ?", answer: "Oui, et c'est même là qu'elle est la plus efficiente. Un champ de sondes partagé pour un immeuble à appartements ou un lotissement réduit significativement le coût par unité. WDD dimensionne le champ en fonction du programme complet."},
    {_key: 'f2', question: "Comment WDD s'intègre-t-il à mon planning général de chantier ?", answer: "Nous planifions l'intervention de forage avec votre conducteur de travaux dès la signature du contrat. L'intervention se fait généralement avant les dallages — en phase gros œuvre — sans interférer avec les autres corps de métier."},
    {_key: 'f3', question: "Quel est le délai entre la commande et le démarrage du forage ?", answer: "En général 4 à 8 semaines, le temps d'instruire les permis de forage. Nous planifions ce délai en amont pour qu'il ne crée aucun retard dans votre calendrier."},
    {_key: 'f4', question: "Qui est responsable en cas de dommage pendant le forage ?", answer: "WDD est entièrement responsable de ses travaux de forage. Notre responsabilité civile couvre les dommages éventuels aux tiers, aux réseaux et aux ouvrages adjacents."},
  ],
})

// ─── A PROPOS PAGE (be-fr) ───────────────────────────────────────────────────
await upsert({
  _id: 'aProposPage-be-fr',
  _type: 'aProposPage',
  locale: 'be-fr',
  heroTitle: "Offrons une énergie propre\net durable aux générations futures",
  heroSubtitle: "WellDoneDrill, acteur wallon du forage géothermique, façonne aujourd'hui les fondations énergétiques de demain. Spécialiste de la géothermie fermée et ouverte, notre entreprise propose des solutions durables et sur mesure pour tous types de bâtiments.",
  heroCtaLabel: "Demandez un devis gratuit",
  missionTitle: "Notre mission va au-delà\ndes économies d'énergie.",
  missionBody1: "Nous contribuons à réduire l'empreinte carbone de nos territoires, en rendant la géothermie accessible à tous, pour tous types de projets, et en grande quantité.",
  missionBody2: "Face à l'urgence climatique et à la nécessité de sortir des énergies fossiles, la géothermie s'impose comme une solution d'avenir : propre, renouvelable et stable. La Belgique accuse pourtant un retard considérable dans le développement de ces technologies. C'est dans ce contexte que WellDoneDrill est né, avec une conviction forte : rendre la géothermie accessible et performante pour répondre à une demande en pleine croissance.",
  missionBody3: "Depuis notre création, nous avons réalisé des centaines de forages en Wallonie et au Grand-Duché de Luxembourg, pour des particuliers, des promoteurs immobiliers, des institutions publiques et des entreprises.",
  valuesTitle: "Nos valeurs",
  values: [
    {_key: 'v1', title: 'Innovation', body: "Nous nous engageons à rester à l'avant-garde de l'innovation en matière de forage géothermique. Nous investissons dans la recherche et le développement pour exploiter de nouvelles technologies et améliorer nos processus."},
    {_key: 'v2', title: 'Durabilité', body: "Nous sommes convaincus que la géothermie est un levier puissant pour un avenir énergétique propre et durable. Chaque forage réalisé est une contribution directe à la réduction des émissions de CO₂ et à la décarbonation du bâti."},
    {_key: 'v3', title: 'Collaboration', body: "Nous croyons en la force de la collaboration. C'est en travaillant main dans la main avec nos partenaires, nos clients et employés que nous pouvons atteindre nos objectifs."},
    {_key: 'v4', title: 'Intégrité', body: "Nous agissons avec rigueur, éthique et transparence dans toutes nos missions. Nos engagements sont clairs, nos méthodes maîtrisées et notre relation client fondée sur la confiance et la responsabilité."},
    {_key: 'v5', title: 'Excellence', body: "Nous visons les plus hauts standards de qualité dans chacune de nos interventions. Notre exigence technique et notre sens du détail font de WellDoneDrill un référent dans son domaine."},
  ],
  whyTitle: "Pourquoi WellDoneDrill ?",
  whyItems: [
    {_key: 'w1', title: 'Technologies accessibles', body: "Nous proposons des technologies de forage géothermique de pointe, tout en veillant à maintenir des coûts d'utilisation maîtrisés."},
    {_key: 'w2', title: 'Expertise géologique wallonne', body: "Notre connaissance fine du sous-sol wallon et nos années d'expérience sur le terrain garantissent des forages précis, sûrs et adaptés aux spécificités locales."},
    {_key: 'w3', title: 'Acteur local & réactif', body: "Nos clients bénéficient d'un contact direct avec une équipe de proximité, investie à chaque étape du projet."},
    {_key: 'w4', title: 'Solutions flexibles', body: "Que vous soyez particulier, promoteur, entreprise, architecte ou institution publique, nous développons des solutions sur mesure."},
  ],
  partnershipTitle: "Travaillons ensemble",
  partnershipBody: "Vous avez un projet géothermique ? Discutons-en. Notre équipe vous répond sous 48h.",
  partnershipCta1: "Démarrer votre projet →",
  partnershipCta2: "Voir nos réalisations",
  phone: '+32 478 75 36 79',
  email: 'info@welldonedrill.be',
  address: 'Belgique & Grand-Duché de Luxembourg',
  contactCtaLabel: 'Nous contacter',
  seoTitle: 'À propos de WellDoneDrill | Forage géothermique en Belgique',
  seoDescription: "WellDoneDrill, spécialiste wallon du forage géothermique. Découvrez notre mission, nos valeurs et notre expertise en géothermie fermée et ouverte.",
})

// ─── DEMARRER PAGE (be-fr) ───────────────────────────────────────────────────
await upsert({
  _id: 'demarrerPage-be-fr',
  _type: 'demarrerPage',
  locale: 'be-fr',
  heroEyebrow: 'Démarrer votre projet',
  heroTitle: "Votre projet géothermique\ncommence ici.",
  heroSubtitle: "Remplissez le formulaire ci-dessous. Notre équipe analyse votre demande et vous répond sous 48h avec une première évaluation gratuite.",
  formHeading: "Parlez-nous de votre projet",
  phone: '+32 478 75 36 79',
  email: 'info@welldonedrill.be',
  successTitle: "Merci, nous avons bien reçu votre message !",
  successBody: "Notre équipe revient vers vous sous 48h avec une première analyse de faisabilité. En attendant, n'hésitez pas à nous appeler directement.",
  teamCaption: "L'équipe WellDoneDrill — à votre écoute",
  teamLabel: "Notre équipe",
  seoTitle: 'Démarrer votre projet géothermique | WellDoneDrill',
  seoDescription: "Lancez votre projet géothermique avec WellDoneDrill. Étude de faisabilité gratuite, réponse sous 48h.",
})

console.log('\nDone. All documents seeded.')

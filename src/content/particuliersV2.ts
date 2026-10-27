import type {AppLocale} from '@/src/i18n/routes'

/*
 * Particuliers page V2 copy. Sanity fields take precedence (see ParticuliersPageData);
 * this is the fallback and the source used to seed Sanity (scripts/migrate-v2-content.ts).
 */


export type Lang = 'fr' | 'nl' | 'en' | 'de'

export const LANG: Record<AppLocale, Lang> = {
  'be-fr': 'fr', 'fr-fr': 'fr', 'lu-fr': 'fr',
  'be-nl': 'nl', 'lu-de': 'de',
  'be-en': 'en', 'fr-en': 'en', 'lu-en': 'en',
}

export type Step = {title: string; body: string}

export const V2: Record<Lang, {
  eyebrow: string
  ctaStudy: string; ctaSoil: string; ctaQuote: string
  heroImageAlt: string; siteImageAlt: string
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
    heroImageAlt: 'Famille devant sa maison chauffée par géothermie', siteImageAlt: "Foreuse WellDoneDrill en action dans le jardin d'une maison",
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
      {title: 'Analyse gratuite', body: "Nous vérifions la faisabilité géologique de votre terrain et dimensionnons l'installation, sans engagement."},
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
    heroImageAlt: 'Gezin voor hun woning met geothermische verwarming', siteImageAlt: 'Boorinstallatie van WellDoneDrill in de tuin van een woning',
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
      {title: 'Gratis analyse', body: 'We controleren de geologische haalbaarheid van uw terrein en dimensioneren de installatie, zonder verbintenis.'},
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
    heroImageAlt: 'Family in front of their geothermally heated home', siteImageAlt: 'WellDoneDrill drilling rig at work in the garden of a house',
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
      {title: 'Free analysis', body: 'We check the geological feasibility of your plot and size the system, with no obligation.'},
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
    heroImageAlt: 'Familie vor ihrem mit Erdwärme beheizten Haus', siteImageAlt: 'Bohrgerät von WellDoneDrill im Garten eines Hauses',
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
      {title: 'Kostenlose Analyse', body: 'Wir prüfen die geologische Machbarkeit Ihres Grundstücks und dimensionieren die Anlage, unverbindlich.'},
      {title: 'Genehmigung und Förderung', body: 'Wir erledigen die Formalitäten und helfen Ihnen bei den Förderanträgen.'},
      {title: 'Bohrung', body: '1 bis 2 Tage bei Ihnen. Die Maschine braucht eine 2,5 m breite Zufahrt, und das Gelände wird wiederhergestellt.'},
      {title: 'Wärmepumpe', body: 'Ein Partner-Installateur setzt die Wärmepumpe in 1 bis 2 Tagen. Wir koordinieren beide Teams.'},
      {title: 'Inbetriebnahme', body: 'Weniger als eine Woche nach Baubeginn heizt sich Ihr Zuhause mit Energie aus dem Boden.'},
    ],
    videoCaption: 'Bohrung von Erdwärmesonden in einem Garten',
  },
}

export type V2T = typeof V2[Lang]

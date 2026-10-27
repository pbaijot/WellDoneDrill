import type {AppLocale} from '@/src/i18n/routes'
import type {GeoPageData} from '@/src/lib/geoPage'

/*
 * Heat pump page ("pompe à chaleur géothermique"), rendered with the geothermal
 * page layout (GeoPage). Content lives in code until a Sanity document exists.
 * Target queries: "pompe à chaleur géothermique" (fr), "geothermische warmtepomp"
 * (nl), "geothermal heat pump" (en), "Erdwärmepumpe" (de).
 */

type Lang = 'fr' | 'nl' | 'en' | 'de'

const LANG: Record<AppLocale, Lang> = {
  'be-fr': 'fr', 'fr-fr': 'fr', 'lu-fr': 'fr',
  'be-nl': 'nl', 'lu-de': 'de',
  'be-en': 'en', 'fr-en': 'en', 'lu-en': 'en',
}

const COUNTRY: Record<AppLocale, string> = {
  'be-fr': 'en Belgique', 'fr-fr': 'en France', 'lu-fr': 'au Luxembourg',
  'be-nl': 'in België', 'lu-de': 'in Luxemburg',
  'be-en': 'in Belgium', 'fr-en': 'in France', 'lu-en': 'in Luxembourg',
}

type Copy = Omit<GeoPageData, '_id' | 'locale' | 'routeKey' | 'seoTitle'> & {
  seoTitle: (country: string) => string
}

const IMAGES = {
  heroRightImage: '/images/wdd-chantier-drone.jpg',
}

const COPY: Record<Lang, Copy> = {
  fr: {
    seoTitle: (c) => `Pompe à chaleur géothermique ${c} | WellDoneDrill`,
    seoDescription:
      "Pompe à chaleur géothermique : chauffez et rafraîchissez avec l'énergie du sol, sans groupe extérieur. Forage et analyse gratuite par WellDoneDrill.",
    heroLine1: 'Pompe à chaleur géothermique :',
    heroLine2: "l'énergie du sol, été comme hiver.",
    heroSubtitle:
      "Une pompe à chaleur géothermique puise la chaleur stable du sous-sol pour chauffer votre bâtiment en hiver et le rafraîchir en été. WellDoneDrill réalise le forage et coordonne l'installation, de l'analyse gratuite à la mise en service.",
    heroCtaLabel: 'Demander une analyse gratuite',
    heroSecondaryLabel: 'Voir nos réalisations',
    introTitle: "Qu'est-ce qu'une pompe à chaleur géothermique ?",
    introBody1:
      "Une pompe à chaleur géothermique, aussi appelée PAC sol-eau ou PAC eau-eau, capte l'énergie stockée dans le sol grâce à des sondes verticales installées entre 80 et 200 m de profondeur. À cette profondeur, la température reste stable toute l'année, quel que soit le temps qu'il fait dehors.",
    introBody2:
      "Contrairement à une pompe à chaleur air-eau, elle ne dépend pas de la température extérieure : son rendement reste élevé au cœur de l'hiver, sans groupe extérieur ni bruit de ventilateur. Pour 1 kWh d'électricité consommé, elle restitue 4 à 5 kWh de chaleur.",
    introCtaLabel: 'Vérifier si mon terrain convient',
    howTitle: 'Comment fonctionne une pompe à chaleur géothermique ?',
    howBody:
      "1. Les sondes captent la chaleur du sous-sol grâce à un fluide qui circule en circuit fermé.\n2. La pompe à chaleur, installée à l'intérieur du bâtiment, élève cette chaleur à la température nécessaire.\n3. La chaleur est distribuée par le plancher chauffant, des radiateurs basse température ou des ventilo-convecteurs, et produit aussi l'eau chaude sanitaire.\n4. En été, la fraîcheur du sol rafraîchit le bâtiment presque sans consommation : c'est le géocooling.",
    howCtaLabel: 'Demander une analyse gratuite →',
    advantagesTitle: "Les avantages d'une pompe à chaleur géothermique",
    advantagesCtaLabel: 'Demander une analyse gratuite',
    advantages: [
      {title: "Rendement élevé toute l'année", body: 'La température du sol ne varie pas avec les saisons : le rendement reste stable, même par grand froid.', icon: 'bolt'},
      {title: "Chaud l'hiver, frais l'été", body: "La même installation chauffe en hiver et rafraîchit en été grâce au géocooling.", icon: 'hotcold'},
      {title: 'Silencieuse et invisible', body: "Pas de groupe extérieur ni de ventilateur : la PAC est installée à l'intérieur, les sondes sont enterrées.", icon: 'silent'},
      {title: 'Facture maîtrisée', body: "L'énergie du sol est gratuite : vous ne payez que l'électricité de la pompe, avec un coût prévisible.", icon: 'euro'},
      {title: 'Zéro combustible fossile', body: 'Aucune combustion, aucune émission sur place, ni citerne ni raccordement au gaz.', icon: 'leaf'},
      {title: 'Des sondes durables', body: 'Les sondes géothermiques sont conçues pour durer plusieurs décennies, sans entretien.', icon: 'shield'},
      {title: 'Un bien valorisé', body: 'Un bâtiment chauffé par géothermie affiche une meilleure performance énergétique (PEB).', icon: 'house'},
      {title: 'Compatible avec vos émetteurs', body: 'Idéale avec un plancher chauffant ou des radiateurs basse température, en neuf comme en rénovation.', icon: 'thermometer'},
    ],
    faqTitle: 'Questions fréquentes sur la pompe à chaleur géothermique',
    faqSubtitle: 'Une question ne figure pas ici ? Contactez directement notre équipe.',
    faqCtaLabel: 'Nous contacter',
    faqs: [
      {question: 'Quelle différence entre une pompe à chaleur géothermique et une pompe à chaleur air-eau ?', answer: "La PAC air-eau puise la chaleur dans l'air extérieur : son rendement baisse quand il fait froid, au moment où vous avez le plus besoin de chauffage. La PAC géothermique puise dans le sol, dont la température reste stable toute l'année. Elle offre un meilleur rendement sur la saison, ne nécessite pas de groupe extérieur et peut rafraîchir le bâtiment en été presque gratuitement."},
      {question: 'Combien coûte une pompe à chaleur géothermique ?', answer: "Le budget dépend surtout du forage (profondeur et nombre de sondes) et de la puissance de la pompe à chaleur. L'investissement est plus élevé qu'une PAC air-eau, mais il est compensé par un rendement supérieur, des sondes qui durent plusieurs décennies et des primes régionales. Notre analyse gratuite vous donne un budget précis pour votre bâtiment."},
      {question: 'Une pompe à chaleur géothermique fonctionne-t-elle avec des radiateurs ?', answer: "Oui, s'ils peuvent fonctionner à basse température. Le plancher chauffant reste l'émetteur idéal, mais des radiateurs basse température ou des ventilo-convecteurs conviennent aussi. En rénovation, nous vérifions vos émetteurs lors de l'analyse."},
      {question: 'Quelle profondeur de forage faut-il ?', answer: 'Pour une maison, les sondes descendent généralement entre 80 et 200 m. La profondeur exacte dépend de la géologie de votre terrain et de vos besoins en chauffage ; elle est calculée lors du dimensionnement.'},
      {question: 'Qui installe la pompe à chaleur ?', answer: "WellDoneDrill réalise le forage et la pose des sondes. La pompe à chaleur est installée par un chauffagiste partenaire, et nous coordonnons les deux équipes pour que vous n'ayez qu'un seul interlocuteur."},
      {question: 'Peut-on rafraîchir sa maison avec une pompe à chaleur géothermique ?', answer: "Oui. En été, la fraîcheur du sol est utilisée directement pour rafraîchir le bâtiment : c'est le géocooling. La consommation se limite à la pompe de circulation, sans le bruit ni la facture d'une climatisation classique."},
    ],
    particularEyebrow: 'Pour les particuliers',
    particularTitle: 'Une pompe à chaleur géothermique pour votre maison',
    particularBody: "Vous construisez ou rénovez ? Découvrez comment se passe un projet géothermique chez vous, de l'analyse gratuite à la mise en service.",
    particularCta: "Découvrir l'offre particuliers",
    proEyebrow: 'Pour les professionnels',
    proTitle: 'Pour les grands projets',
    proBody: "Installateurs, architectes, bureaux d'études et entrepreneurs : nous forons pour des projets résidentiels collectifs, tertiaires et industriels.",
    proCta: "Découvrir l'offre pro",
  },

  nl: {
    seoTitle: (c) => `Geothermische warmtepomp ${c} | WellDoneDrill`,
    seoDescription:
      'Geothermische warmtepomp: verwarmen en koelen met energie uit de bodem, zonder buitenunit. Boring en gratis analyse door WellDoneDrill.',
    heroLine1: 'Geothermische warmtepomp:',
    heroLine2: 'energie uit de bodem, zomer en winter.',
    heroSubtitle:
      'Een geothermische warmtepomp haalt de stabiele warmte uit de ondergrond om uw gebouw in de winter te verwarmen en in de zomer te koelen. WellDoneDrill voert de boring uit en coördineert de installatie, van de gratis analyse tot de ingebruikname.',
    heroCtaLabel: 'Gratis analyse aanvragen',
    heroSecondaryLabel: 'Onze realisaties bekijken',
    introTitle: 'Wat is een geothermische warmtepomp?',
    introBody1:
      'Een geothermische warmtepomp, ook bodem-water- of water-waterwarmtepomp genoemd, haalt energie uit de bodem via verticale sondes op 80 tot 200 m diepte. Op die diepte blijft de temperatuur het hele jaar stabiel, ongeacht het weer buiten.',
    introBody2:
      'In tegenstelling tot een lucht-waterwarmtepomp hangt ze niet af van de buitentemperatuur: het rendement blijft hoog in de winter, zonder buitenunit of ventilatorgeluid. Voor 1 kWh elektriciteit levert ze 4 tot 5 kWh warmte.',
    introCtaLabel: 'Nagaan of mijn terrein geschikt is',
    howTitle: 'Hoe werkt een geothermische warmtepomp?',
    howBody:
      '1. De sondes halen warmte uit de ondergrond via een vloeistof die in een gesloten circuit circuleert.\n2. De warmtepomp, binnen in het gebouw, brengt die warmte op de gewenste temperatuur.\n3. De warmte wordt verdeeld via vloerverwarming, lagetemperatuurradiatoren of ventiloconvectoren en levert ook sanitair warm water.\n4. In de zomer koelt de koelte van de bodem het gebouw bijna zonder verbruik: dat is geocooling.',
    howCtaLabel: 'Gratis analyse aanvragen →',
    advantagesTitle: 'De voordelen van een geothermische warmtepomp',
    advantagesCtaLabel: 'Gratis analyse aanvragen',
    advantages: [
      {title: 'Hoog rendement het hele jaar', body: 'De bodemtemperatuur verandert niet met de seizoenen: het rendement blijft stabiel, ook bij strenge vorst.', icon: 'bolt'},
      {title: 'Warm in de winter, koel in de zomer', body: 'Dezelfde installatie verwarmt in de winter en koelt in de zomer dankzij geocooling.', icon: 'hotcold'},
      {title: 'Stil en onzichtbaar', body: 'Geen buitenunit of ventilator: de warmtepomp staat binnen, de sondes zitten in de grond.', icon: 'silent'},
      {title: 'Beheersbare factuur', body: 'De energie uit de bodem is gratis: u betaalt enkel de elektriciteit van de pomp, met voorspelbare kosten.', icon: 'euro'},
      {title: 'Geen fossiele brandstof', body: 'Geen verbranding, geen uitstoot ter plaatse, geen tank of gasaansluiting.', icon: 'leaf'},
      {title: 'Duurzame sondes', body: 'Geothermische sondes gaan tientallen jaren mee, zonder onderhoud.', icon: 'shield'},
      {title: 'Meerwaarde voor uw woning', body: 'Een gebouw met geothermie haalt een betere energieprestatie (EPC).', icon: 'house'},
      {title: 'Geschikt voor uw afgiftesysteem', body: 'Ideaal met vloerverwarming of lagetemperatuurradiatoren, in nieuwbouw en renovatie.', icon: 'thermometer'},
    ],
    faqTitle: 'Veelgestelde vragen over de geothermische warmtepomp',
    faqSubtitle: 'Staat uw vraag er niet bij? Contacteer ons rechtstreeks.',
    faqCtaLabel: 'Contact opnemen',
    faqs: [
      {question: 'Wat is het verschil tussen een geothermische warmtepomp en een lucht-waterwarmtepomp?', answer: 'Een lucht-waterwarmtepomp haalt warmte uit de buitenlucht: het rendement daalt wanneer het koud is, net wanneer u het meest verwarming nodig hebt. Een geothermische warmtepomp haalt warmte uit de bodem, waar de temperatuur het hele jaar stabiel blijft. Ze haalt een beter seizoensrendement, heeft geen buitenunit nodig en kan het gebouw in de zomer bijna gratis koelen.'},
      {question: 'Wat kost een geothermische warmtepomp?', answer: 'Het budget hangt vooral af van de boring (diepte en aantal sondes) en het vermogen van de warmtepomp. De investering ligt hoger dan bij een lucht-waterwarmtepomp, maar wordt gecompenseerd door een hoger rendement, sondes die tientallen jaren meegaan en regionale premies. Onze gratis analyse geeft u een precies budget voor uw gebouw.'},
      {question: 'Werkt een geothermische warmtepomp met radiatoren?', answer: 'Ja, als ze op lage temperatuur kunnen werken. Vloerverwarming blijft ideaal, maar lagetemperatuurradiatoren of ventiloconvectoren zijn ook geschikt. Bij renovatie controleren we uw afgiftesysteem tijdens de analyse.'},
      {question: 'Hoe diep moet er geboord worden?', answer: 'Voor een woning gaan de sondes meestal 80 tot 200 m diep. De exacte diepte hangt af van de geologie van uw terrein en uw warmtebehoefte, en wordt berekend bij de dimensionering.'},
      {question: 'Wie installeert de warmtepomp?', answer: 'WellDoneDrill voert de boring uit en plaatst de sondes. De warmtepomp wordt geïnstalleerd door een partner-installateur, en wij coördineren beide teams zodat u één aanspreekpunt hebt.'},
      {question: 'Kan ik mijn woning koelen met een geothermische warmtepomp?', answer: 'Ja. In de zomer wordt de koelte van de bodem rechtstreeks gebruikt om het gebouw te koelen: dat is geocooling. Het verbruik beperkt zich tot de circulatiepomp, zonder het lawaai of de factuur van een klassieke airco.'},
    ],
    particularEyebrow: 'Voor particulieren',
    particularTitle: 'Een geothermische warmtepomp voor uw woning',
    particularBody: 'Bouwt of renoveert u? Ontdek hoe een geothermisch project bij u thuis verloopt, van de gratis analyse tot de ingebruikname.',
    particularCta: 'Aanbod voor particulieren',
    proEyebrow: 'Voor professionals',
    proTitle: 'Voor grote projecten',
    proBody: 'Installateurs, architecten, studiebureaus en aannemers: wij boren voor collectieve woonprojecten, tertiaire en industriële projecten.',
    proCta: 'Aanbod voor professionals',
  },

  en: {
    seoTitle: (c) => `Geothermal heat pump ${c} | WellDoneDrill`,
    seoDescription:
      'Geothermal heat pump: heat and cool with energy from the ground, with no outdoor unit. Drilling and free analysis by WellDoneDrill.',
    heroLine1: 'Geothermal heat pump:',
    heroLine2: 'energy from the ground, all year round.',
    heroSubtitle:
      'A geothermal heat pump draws the stable heat of the subsoil to heat your building in winter and cool it in summer. WellDoneDrill drills the boreholes and coordinates the installation, from the free analysis to commissioning.',
    heroCtaLabel: 'Request a free analysis',
    heroSecondaryLabel: 'See our projects',
    introTitle: 'What is a geothermal heat pump?',
    introBody1:
      'A geothermal heat pump, also called a ground-source or water-to-water heat pump, captures the energy stored in the ground through vertical probes installed 80 to 200 m deep. At that depth, the temperature stays stable all year round, whatever the weather outside.',
    introBody2:
      'Unlike an air-to-water heat pump, it does not depend on the outdoor temperature: its efficiency stays high in the depths of winter, with no outdoor unit or fan noise. For 1 kWh of electricity, it delivers 4 to 5 kWh of heat.',
    introCtaLabel: 'Check if my plot is suitable',
    howTitle: 'How does a geothermal heat pump work?',
    howBody:
      '1. The probes capture heat from the subsoil through a fluid circulating in a closed loop.\n2. The heat pump, installed inside the building, raises that heat to the required temperature.\n3. Heat is distributed by underfloor heating, low-temperature radiators or fan coils, and also produces domestic hot water.\n4. In summer, the coolness of the ground cools the building with almost no consumption: this is geocooling.',
    howCtaLabel: 'Request a free analysis →',
    advantagesTitle: 'The advantages of a geothermal heat pump',
    advantagesCtaLabel: 'Request a free analysis',
    advantages: [
      {title: 'High efficiency all year', body: 'The ground temperature does not change with the seasons: efficiency stays stable, even in harsh frost.', icon: 'bolt'},
      {title: 'Warm in winter, cool in summer', body: 'The same system heats in winter and cools in summer thanks to geocooling.', icon: 'hotcold'},
      {title: 'Silent and invisible', body: 'No outdoor unit or fan: the heat pump sits indoors, the probes are underground.', icon: 'silent'},
      {title: 'Controlled bills', body: 'Energy from the ground is free: you only pay for the pump’s electricity, at a predictable cost.', icon: 'euro'},
      {title: 'No fossil fuel', body: 'No combustion, no on-site emissions, no tank or gas connection.', icon: 'leaf'},
      {title: 'Long-lasting probes', body: 'Geothermal probes are designed to last for decades, with no maintenance.', icon: 'shield'},
      {title: 'Higher property value', body: 'A building heated by geothermal energy achieves a better energy performance rating.', icon: 'house'},
      {title: 'Works with your emitters', body: 'Ideal with underfloor heating or low-temperature radiators, in new builds and renovations.', icon: 'thermometer'},
    ],
    faqTitle: 'Frequently asked questions about geothermal heat pumps',
    faqSubtitle: "Don't see your question here? Contact our team directly.",
    faqCtaLabel: 'Contact us',
    faqs: [
      {question: 'What is the difference between a geothermal heat pump and an air-to-water heat pump?', answer: 'An air-to-water heat pump draws heat from outdoor air: its efficiency drops when it is cold, exactly when you need heating most. A geothermal heat pump draws heat from the ground, whose temperature stays stable all year. It offers better seasonal efficiency, needs no outdoor unit and can cool the building in summer almost for free.'},
      {question: 'How much does a geothermal heat pump cost?', answer: 'The budget depends mainly on the drilling (depth and number of probes) and on the heat pump’s output. The investment is higher than for an air-to-water heat pump, but it is offset by higher efficiency, probes that last for decades and regional grants. Our free analysis gives you a precise budget for your building.'},
      {question: 'Does a geothermal heat pump work with radiators?', answer: 'Yes, if they can run at low temperature. Underfloor heating remains ideal, but low-temperature radiators or fan coils also work well. For renovations, we check your emitters during the analysis.'},
      {question: 'How deep do you need to drill?', answer: 'For a house, probes usually go 80 to 200 m deep. The exact depth depends on the geology of your plot and your heating needs, and is calculated during sizing.'},
      {question: 'Who installs the heat pump?', answer: 'WellDoneDrill drills and installs the probes. The heat pump is installed by a partner installer, and we coordinate both teams so you have a single point of contact.'},
      {question: 'Can I cool my home with a geothermal heat pump?', answer: 'Yes. In summer, the coolness of the ground is used directly to cool the building: this is geocooling. Consumption is limited to the circulation pump, without the noise or the bill of conventional air conditioning.'},
    ],
    particularEyebrow: 'For homeowners',
    particularTitle: 'A geothermal heat pump for your home',
    particularBody: 'Building or renovating? See how a geothermal project works at your home, from the free analysis to commissioning.',
    particularCta: 'Homeowner offer',
    proEyebrow: 'For professionals',
    proTitle: 'For large projects',
    proBody: 'Installers, architects, engineering firms and contractors: we drill for collective housing, commercial and industrial projects.',
    proCta: 'Professional offer',
  },

  de: {
    seoTitle: (c) => `Erdwärmepumpe ${c} | WellDoneDrill`,
    seoDescription:
      'Erdwärmepumpe: heizen und kühlen mit Energie aus dem Boden, ohne Außengerät. Bohrung und kostenlose Analyse durch WellDoneDrill.',
    heroLine1: 'Erdwärmepumpe:',
    heroLine2: 'Energie aus dem Boden, das ganze Jahr.',
    heroSubtitle:
      'Eine Erdwärmepumpe nutzt die konstante Wärme des Untergrunds, um Ihr Gebäude im Winter zu heizen und im Sommer zu kühlen. WellDoneDrill übernimmt die Bohrung und koordiniert die Installation, von der kostenlosen Analyse bis zur Inbetriebnahme.',
    heroCtaLabel: 'Kostenlose Analyse anfragen',
    heroSecondaryLabel: 'Unsere Projekte ansehen',
    introTitle: 'Was ist eine Erdwärmepumpe?',
    introBody1:
      'Eine Erdwärmepumpe, auch Sole-Wasser- oder geothermische Wärmepumpe genannt, nutzt die im Boden gespeicherte Energie über vertikale Sonden in 80 bis 200 m Tiefe. In dieser Tiefe bleibt die Temperatur das ganze Jahr über konstant, unabhängig vom Wetter.',
    introBody2:
      'Anders als eine Luft-Wasser-Wärmepumpe hängt sie nicht von der Außentemperatur ab: Ihr Wirkungsgrad bleibt auch im tiefsten Winter hoch, ohne Außengerät und ohne Ventilatorgeräusch. Aus 1 kWh Strom macht sie 4 bis 5 kWh Wärme.',
    introCtaLabel: 'Prüfen, ob mein Grundstück geeignet ist',
    howTitle: 'Wie funktioniert eine Erdwärmepumpe?',
    howBody:
      '1. Die Sonden nehmen die Wärme des Untergrunds über eine Flüssigkeit auf, die in einem geschlossenen Kreislauf zirkuliert.\n2. Die Wärmepumpe im Gebäude bringt diese Wärme auf die benötigte Temperatur.\n3. Die Wärme wird über Fußbodenheizung, Niedertemperaturheizkörper oder Gebläsekonvektoren verteilt und erzeugt auch Warmwasser.\n4. Im Sommer kühlt die Kühle des Bodens das Gebäude fast ohne Verbrauch: das ist Geocooling.',
    howCtaLabel: 'Kostenlose Analyse anfragen →',
    advantagesTitle: 'Die Vorteile einer Erdwärmepumpe',
    advantagesCtaLabel: 'Kostenlose Analyse anfragen',
    advantages: [
      {title: 'Hoher Wirkungsgrad das ganze Jahr', body: 'Die Bodentemperatur ändert sich nicht mit den Jahreszeiten: Der Wirkungsgrad bleibt auch bei starkem Frost stabil.', icon: 'bolt'},
      {title: 'Warm im Winter, kühl im Sommer', body: 'Dieselbe Anlage heizt im Winter und kühlt im Sommer dank Geocooling.', icon: 'hotcold'},
      {title: 'Leise und unsichtbar', body: 'Kein Außengerät, kein Ventilator: Die Wärmepumpe steht im Haus, die Sonden liegen im Boden.', icon: 'silent'},
      {title: 'Planbare Kosten', body: 'Die Energie aus dem Boden ist kostenlos: Sie zahlen nur den Strom der Pumpe, mit planbaren Kosten.', icon: 'euro'},
      {title: 'Kein fossiler Brennstoff', body: 'Keine Verbrennung, keine Emissionen vor Ort, kein Tank und kein Gasanschluss.', icon: 'leaf'},
      {title: 'Langlebige Sonden', body: 'Erdwärmesonden sind für Jahrzehnte ausgelegt und wartungsfrei.', icon: 'shield'},
      {title: 'Wertsteigerung', body: 'Ein mit Erdwärme beheiztes Gebäude erreicht eine bessere Energieeffizienzklasse.', icon: 'house'},
      {title: 'Passend zu Ihrem Heizsystem', body: 'Ideal mit Fußbodenheizung oder Niedertemperaturheizkörpern, im Neubau wie in der Renovierung.', icon: 'thermometer'},
    ],
    faqTitle: 'Häufige Fragen zur Erdwärmepumpe',
    faqSubtitle: 'Haben Sie eine weitere Frage? Kontaktieren Sie unser Team direkt.',
    faqCtaLabel: 'Kontakt aufnehmen',
    faqs: [
      {question: 'Was ist der Unterschied zwischen einer Erdwärmepumpe und einer Luft-Wasser-Wärmepumpe?', answer: 'Eine Luft-Wasser-Wärmepumpe nutzt die Außenluft: Ihr Wirkungsgrad sinkt, wenn es kalt ist, also genau dann, wenn Sie am meisten heizen. Eine Erdwärmepumpe nutzt den Boden, dessen Temperatur das ganze Jahr konstant bleibt. Sie erreicht eine bessere Jahresarbeitszahl, braucht kein Außengerät und kann das Gebäude im Sommer fast kostenlos kühlen.'},
      {question: 'Was kostet eine Erdwärmepumpe?', answer: 'Das Budget hängt vor allem von der Bohrung (Tiefe und Anzahl der Sonden) und der Leistung der Wärmepumpe ab. Die Investition ist höher als bei einer Luft-Wasser-Wärmepumpe, wird aber durch den höheren Wirkungsgrad, jahrzehntelang haltbare Sonden und Förderungen ausgeglichen. Unsere kostenlose Analyse liefert Ihnen ein genaues Budget für Ihr Gebäude.'},
      {question: 'Funktioniert eine Erdwärmepumpe mit Heizkörpern?', answer: 'Ja, wenn sie mit niedriger Vorlauftemperatur arbeiten können. Fußbodenheizung bleibt ideal, aber Niedertemperaturheizkörper oder Gebläsekonvektoren eignen sich ebenfalls. Bei Renovierungen prüfen wir Ihr Heizsystem im Rahmen der Analyse.'},
      {question: 'Wie tief muss gebohrt werden?', answer: 'Für ein Einfamilienhaus reichen die Sonden meist 80 bis 200 m tief. Die genaue Tiefe hängt von der Geologie Ihres Grundstücks und Ihrem Wärmebedarf ab und wird bei der Auslegung berechnet.'},
      {question: 'Wer installiert die Wärmepumpe?', answer: 'WellDoneDrill bohrt und setzt die Sonden. Die Wärmepumpe wird von einem Partner-Installateur eingebaut, und wir koordinieren beide Teams, damit Sie nur einen Ansprechpartner haben.'},
      {question: 'Kann ich mein Haus mit einer Erdwärmepumpe kühlen?', answer: 'Ja. Im Sommer wird die Kühle des Bodens direkt zur Kühlung des Gebäudes genutzt: das ist Geocooling. Der Verbrauch beschränkt sich auf die Umwälzpumpe, ohne den Lärm und die Kosten einer klassischen Klimaanlage.'},
    ],
    particularEyebrow: 'Für Privatkunden',
    particularTitle: 'Eine Erdwärmepumpe für Ihr Zuhause',
    particularBody: 'Sie bauen oder renovieren? Erfahren Sie, wie ein Geothermieprojekt bei Ihnen abläuft, von der kostenlosen Analyse bis zur Inbetriebnahme.',
    particularCta: 'Angebot für Privatkunden',
    proEyebrow: 'Für Profis',
    proTitle: 'Für große Projekte',
    proBody: 'Installateure, Architekten, Planungsbüros und Bauunternehmen: Wir bohren für Wohnanlagen, gewerbliche und industrielle Projekte.',
    proCta: 'Angebot für Profis',
  },
}

export function getPacGeoContent(locale: AppLocale): GeoPageData {
  const {seoTitle, ...copy} = COPY[LANG[locale]]
  return {
    ...copy,
    ...IMAGES,
    _id: `pac-${locale}`,
    locale,
    routeKey: 'pac',
    seoTitle: seoTitle(COUNTRY[locale]),
  }
}

import type { AppLocale } from './routes'

export type SeoEntry = { title: string; description: string }

export const SEO_DEFAULTS: Record<AppLocale, Record<string, SeoEntry>> = {
  'be-fr': {
    home: {
      title: 'WellDoneDrill — Forage géothermique & Pompes à chaleur en Belgique',
      description: "Spécialiste belge du forage géothermique. Analyse de faisabilité gratuite, permis, installation pompe à chaleur de A à Z. Économisez jusqu'à −70% sur votre facture énergétique. Réponse sous 48h.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers en Belgique — WellDoneDrill | Chauffage −70%',
      description: "Chauffez votre maison à −70% de coût avec la géothermie. Analyse gratuite, permis inclus, installation clé en main. Votre spécialiste belge du forage géothermique.",
    },
    pro: {
      title: 'Solutions géothermiques pour professionnels en Belgique — WellDoneDrill',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs belges. Sous-traitance forage, analyses techniques, certifications — développez votre activité géothermie.",
    },
    pro_chauffagistes: {
      title: 'Géothermie pour chauffagistes en Belgique — WellDoneDrill | Sous-traitance',
      description: "Sous-traitez vos forages géothermiques à WellDoneDrill. Partenaire des installateurs HVAC belges — formation, certification, support technique inclus.",
    },
    pro_architectes: {
      title: "Géothermie pour architectes & bureaux d'études en Belgique — WellDoneDrill",
      description: "Intégrez la géothermie dans vos projets dès la conception. Dimensionnement, analyses techniques et certifications — WellDoneDrill, votre partenaire géothermie.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie pour promoteurs immobiliers en Belgique — WellDoneDrill',
      description: "Valorisez vos projets avec la géothermie. De A à Z : analyse, permis, forage, raccordement. ROI optimisé et labels énergétiques garantis.",
    },
    geo_fermee: {
      title: 'Géothermie fermée (sondes verticales) en Belgique — WellDoneDrill | Forage PAC',
      description: "Système géothermique en circuit fermé : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + eau chaude. Permis, forage et raccordement PAC clé en main.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte (nappe phréatique) en Belgique — WellDoneDrill | Aquathermie',
      description: "Système géothermique sur nappe phréatique. COP optimaux, idéal pour bâtiments tertiaires et collectifs. Permis, forage et installation clé en main.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques en Belgique — WellDoneDrill | PAC eau-eau',
      description: "Pompes à chaleur sur forage géothermique. COP jusqu'à 5, chauffage + eau chaude sanitaire + climatisation. Installation clé en main par des experts certifiés.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts en forage géothermique en Belgique',
      description: "Découvrez l'équipe WellDoneDrill, experts belges du forage géothermique. Notre mission : rendre l'énergie géothermique accessible à tous, de A à Z.",
    },
    contact: {
      title: 'Démarrer votre projet géothermique — Devis gratuit | WellDoneDrill Belgique',
      description: "Obtenez votre analyse de faisabilité gratuite et sans engagement. Forage géothermique en Belgique — réponse sous 48h. WellDoneDrill, de l'analyse au raccordement.",
    },
    references: {
      title: 'Nos réalisations géothermiques en Belgique — WellDoneDrill | Références',
      description: "Découvrez nos projets de forage géothermique réalisés en Belgique. Résidentiel, tertiaire, industriel et public — des chantiers livrés de A à Z.",
    },
    geo: {
      title: 'Géothermie en Belgique — Forage fermé & ouvert | WellDoneDrill',
      description: "Géothermie fermée (sondes verticales) et ouverte (nappe phréatique) en Belgique. WellDoneDrill fore vos sondes — analyse gratuite, permis, installation PAC clé en main.",
    },
    blog: {
      title: 'Blog géothermie & forage géothermique en Belgique — WellDoneDrill',
      description: "Conseils, retours de chantier et actualités sur la géothermie, le forage et les pompes à chaleur en Belgique. Le blog des experts WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, spécialiste du forage géothermique en Belgique et au Luxembourg.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique de cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site de WellDoneDrill.",
    },
  },

  'be-nl': {
    home: {
      title: 'WellDoneDrill — Geothermische boring & Warmtepompen in België',
      description: "Belgische specialist in geothermische boringen. Gratis haalbaarheidsanalyse, vergunning, warmtepomp installatie van A tot Z. Bespaar tot 70% op uw energiefactuur.",
    },
    particuliers: {
      title: 'Geothermie voor particulieren in België — WellDoneDrill | Verwarming −70%',
      description: "Verwarm uw woning met 70% minder kosten dankzij geothermie. Gratis haalbaarheidsanalyse, vergunning inbegrepen, sleutel-op-de-deur installatie door Belgische experts.",
    },
    pro: {
      title: 'Geothermische oplossingen voor professionals in België — WellDoneDrill',
      description: "Geothermiepartner van installateurs, architecten en projectontwikkelaars in België. Onderaanneming boringen, technische analyses en certificeringen.",
    },
    pro_chauffagistes: {
      title: 'Geothermie voor verwarmingsinstallateurs in België — WellDoneDrill',
      description: "Besteed uw geothermische boringen uit aan WellDoneDrill. Partner van HVAC-installateurs in België — training, certificering en technische ondersteuning inbegrepen.",
    },
    pro_architectes: {
      title: "Geothermische oplossingen voor architecten & studiebureaus in België — WellDoneDrill",
      description: "Integreer geothermie in uw projecten vanaf de ontwerpfase. Dimensionering, technische analyses en certificeringen — WellDoneDrill, uw geothermiepartner.",
    },
    pro_entrepreneurs: {
      title: 'Geothermie voor projectontwikkelaars in België — WellDoneDrill',
      description: "Verhoog de waarde van uw vastgoedprojecten met geothermie. Van A tot Z: analyse, vergunning, boring, aansluiting. Geoptimaliseerd rendement en energielabels.",
    },
    geo_fermee: {
      title: 'Gesloten geothermie (verticale sondes) in België — WellDoneDrill | PAC boring',
      description: "Gesloten geothermisch systeem met verticale sondes tot 150 m. Verwarming + koeling + sanitair warm water. Vergunning, boring en warmtepomp aansluiting in één pakket.",
    },
    geo_ouverte: {
      title: 'Open geothermie (grondwater) in België — WellDoneDrill | Aquathermie',
      description: "Open geothermisch systeem op het grondwater. Optimale COP-rendementen, ideaal voor tertiaire en collectieve gebouwen. Vergunning, boring en installatie.",
    },
    pac: {
      title: 'Geothermische warmtepompen in België — WellDoneDrill | Water-water warmtepomp',
      description: "Warmtepompen op geothermische boring. COP tot 5, verwarming + sanitair warm water + koeling. Sleutel-op-de-deur installatie door gecertificeerde experts.",
    },
    a_propos: {
      title: 'Over WellDoneDrill — Experts in geothermische boringen in België',
      description: "Ontdek het WellDoneDrill-team, Belgische experts in geothermische boringen. Onze missie: geothermische energie voor iedereen toegankelijk maken, van A tot Z.",
    },
    contact: {
      title: 'Start uw geothermisch project — Gratis offerte | WellDoneDrill België',
      description: "Ontvang uw gratis en vrijblijvende haalbaarheidsanalyse. Geothermische boring in België — antwoord binnen 48u. WellDoneDrill, van analyse tot aansluiting.",
    },
    references: {
      title: 'Onze geothermische realisaties in België — WellDoneDrill | Referenties',
      description: "Ontdek onze geothermische boorprojecten in België. Residentieel, tertiair, industrieel en openbaar — projecten van A tot Z opgeleverd.",
    },
    geo: {
      title: 'Geothermie in België — Gesloten & open boring | WellDoneDrill',
      description: "Gesloten (verticale sondes) en open geothermie (grondwater) in België. WellDoneDrill boort uw sondes — gratis analyse, vergunning, sleutel-op-de-deur warmtepomp.",
    },
    blog: {
      title: 'Blog geothermie & boring in België — WellDoneDrill',
      description: "Advies, werfverslagen en nieuws over geothermie, boringen en warmtepompen in België. De blog van de WellDoneDrill-experts.",
    },
    mentions_legales: {
      title: 'Juridische informatie — WellDoneDrill',
      description: "Juridische informatie van WellDoneDrill, specialist in geothermische boringen in België en Luxemburg.",
    },
    politique_confidentialite: {
      title: 'Privacybeleid — WellDoneDrill',
      description: "Privacybeleid en verwerking van persoonsgegevens door WellDoneDrill.",
    },
    cookies: {
      title: 'Cookiebeleid — WellDoneDrill',
      description: "Beleid inzake het gebruik van cookies op de website van WellDoneDrill.",
    },
  },

  'fr-fr': {
    home: {
      title: 'WellDoneDrill — Forage géothermique & Pompes à chaleur en France',
      description: "Expert du forage géothermique en France. Analyse de faisabilité gratuite, permis, installation pompe à chaleur de A à Z. Économisez jusqu'à −70% sur votre facture énergétique.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers en France — WellDoneDrill | Chauffage −70%',
      description: "Chauffez votre maison en France à −70% de coût avec la géothermie. Analyse gratuite, permis inclus, installation clé en main.",
    },
    pro: {
      title: 'Solutions géothermiques pour professionnels en France — WellDoneDrill',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs en France. Sous-traitance forage, analyses techniques, certifications.",
    },
    pro_chauffagistes: {
      title: 'Géothermie pour chauffagistes en France — WellDoneDrill | Sous-traitance',
      description: "Sous-traitez vos forages géothermiques en France à WellDoneDrill. Partenaire des installateurs HVAC — formation, certification, support technique inclus.",
    },
    pro_architectes: {
      title: "Géothermie pour architectes & bureaux d'études en France — WellDoneDrill",
      description: "Intégrez la géothermie dans vos projets français dès la conception. Dimensionnement, analyses techniques et certifications inclus.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie pour promoteurs immobiliers en France — WellDoneDrill',
      description: "Valorisez vos projets immobiliers en France avec la géothermie. Analyse, permis, forage, raccordement — labels énergétiques et ROI optimisés.",
    },
    geo_fermee: {
      title: 'Géothermie fermée (sondes verticales) en France — WellDoneDrill | Forage PAC',
      description: "Circuit fermé géothermique en France : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + eau chaude. Installation clé en main.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte (nappe phréatique) en France — WellDoneDrill | Aquathermie',
      description: "Système géothermique sur nappe phréatique en France. COP optimaux, idéal pour bâtiments tertiaires et collectifs.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques en France — WellDoneDrill | PAC eau-eau',
      description: "Pompes à chaleur sur forage géothermique en France. COP jusqu'à 5, chauffage + eau chaude + climatisation. Installation clé en main.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts en forage géothermique en France',
      description: "Découvrez l'équipe WellDoneDrill, experts du forage géothermique en France. Notre mission : rendre l'énergie géothermique accessible à tous.",
    },
    contact: {
      title: 'Démarrer votre projet géothermique — Devis gratuit | WellDoneDrill France',
      description: "Obtenez votre analyse de faisabilité gratuite et sans engagement en France. Réponse sous 48h. WellDoneDrill, de l'analyse au raccordement.",
    },
    references: {
      title: 'Nos réalisations géothermiques en France — WellDoneDrill | Références',
      description: "Découvrez nos projets de forage géothermique réalisés en France. Résidentiel, tertiaire, industriel et public.",
    },
    geo: {
      title: 'Géothermie en France — Forage fermé & ouvert | WellDoneDrill',
      description: "Géothermie fermée (sondes verticales) et ouverte (nappe phréatique) en France. WellDoneDrill fore vos sondes — analyse gratuite, permis, installation PAC clé en main.",
    },
    blog: {
      title: 'Blog géothermie & forage géothermique en France — WellDoneDrill',
      description: "Conseils, retours de chantier et actualités sur la géothermie, le forage et les pompes à chaleur en France. Le blog des experts WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, expert du forage géothermique en France et en Belgique.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique de cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site de WellDoneDrill.",
    },
  },

  'lu-fr': {
    home: {
      title: 'WellDoneDrill — Forage géothermique & Pompes à chaleur au Luxembourg',
      description: "Spécialiste du forage géothermique au Luxembourg. Analyse de faisabilité gratuite, permis, installation pompe à chaleur de A à Z. Économisez jusqu'à −70% sur votre facture énergétique.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers au Luxembourg — WellDoneDrill | Chauffage −70%',
      description: "Chauffez votre maison au Luxembourg à −70% de coût avec la géothermie. Analyse gratuite, permis inclus, installation clé en main.",
    },
    pro: {
      title: 'Solutions géothermiques pour professionnels au Luxembourg — WellDoneDrill',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs au Luxembourg. Sous-traitance forage, analyses techniques, certifications.",
    },
    pro_chauffagistes: {
      title: 'Géothermie pour chauffagistes au Luxembourg — WellDoneDrill | Partenariat',
      description: "Sous-traitez vos forages géothermiques au Luxembourg. Partenaire des installateurs HVAC — formation et support technique inclus.",
    },
    pro_architectes: {
      title: "Géothermie pour architectes & bureaux d'études au Luxembourg — WellDoneDrill",
      description: "Intégrez la géothermie dans vos projets luxembourgeois dès la conception. Dimensionnement, analyses techniques et certifications inclus.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie pour promoteurs immobiliers au Luxembourg — WellDoneDrill',
      description: "Valorisez vos projets au Luxembourg avec la géothermie. Analyse, permis, forage, raccordement — WellDoneDrill, partenaire clé en main.",
    },
    geo_fermee: {
      title: 'Géothermie fermée (sondes verticales) au Luxembourg — WellDoneDrill',
      description: "Circuit fermé géothermique au Luxembourg : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + eau chaude. Permis, forage et raccordement inclus.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte (nappe phréatique) au Luxembourg — WellDoneDrill',
      description: "Système géothermique sur nappe phréatique au Luxembourg. COP optimaux, grande puissance. Idéal pour bâtiments commerciaux et collectifs.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques au Luxembourg — WellDoneDrill | PAC eau-eau',
      description: "Pompes à chaleur géothermiques au Luxembourg. COP optimal, chauffage + eau chaude + climatisation. Installation complète par des spécialistes certifiés.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts en forage géothermique au Luxembourg',
      description: "Découvrez WellDoneDrill, spécialistes du forage géothermique au Luxembourg. Notre mission : rendre l'énergie géothermique accessible à tous.",
    },
    contact: {
      title: 'Démarrer votre projet géothermique — Devis gratuit | WellDoneDrill Luxembourg',
      description: "Obtenez votre analyse de faisabilité gratuite au Luxembourg. Réponse sous 48h, sans engagement. WellDoneDrill, votre spécialiste géothermie.",
    },
    references: {
      title: 'Nos réalisations géothermiques au Luxembourg — WellDoneDrill | Références',
      description: "Découvrez nos projets de forage géothermique réalisés au Luxembourg. Résidentiel, tertiaire, industriel et public.",
    },
    geo: {
      title: 'Géothermie au Luxembourg — Forage fermé & ouvert | WellDoneDrill',
      description: "Géothermie fermée (sondes verticales) et ouverte (nappe phréatique) au Luxembourg. WellDoneDrill fore vos sondes — analyse gratuite, permis, installation PAC.",
    },
    blog: {
      title: 'Blog géothermie & forage géothermique au Luxembourg — WellDoneDrill',
      description: "Conseils, retours de chantier et actualités sur la géothermie, le forage et les pompes à chaleur au Luxembourg. Le blog des experts WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, spécialiste du forage géothermique au Luxembourg et en Belgique.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique de cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site de WellDoneDrill.",
    },
  },

  'lu-de': {
    home: {
      title: 'WellDoneDrill — Geothermische Bohrung & Wärmepumpen in Luxemburg',
      description: "Spezialist für Erdwärmebohrungen in Luxemburg. Kostenlose Machbarkeitsanalyse, Genehmigung, Wärmepumpeninstallation von A bis Z. Bis zu 70% Energiekostenersparnis.",
    },
    particuliers: {
      title: 'Geothermie für Privatpersonen in Luxemburg — WellDoneDrill | Heizung −70%',
      description: "Heizen Sie Ihr Haus in Luxemburg mit 70% weniger Kosten dank Erdwärme. Kostenlose Machbarkeitsanalyse, Genehmigung inklusive, schlüsselfertige Installation.",
    },
    pro: {
      title: 'Geothermische Lösungen für Fachleute in Luxemburg — WellDoneDrill',
      description: "Geothermiepartner von Heizungsinstallateuren, Architekten und Immobilienentwicklern in Luxemburg. Bohrungsunterauftragsvergabe, technische Analysen und Zertifizierungen.",
    },
    pro_chauffagistes: {
      title: 'Geothermie für Heizungsinstallateure in Luxemburg — WellDoneDrill',
      description: "Vergeben Sie Ihre Erdwärmebohrungen in Luxemburg an WellDoneDrill. Partner der Heizungsinstallateure — Schulung, Zertifizierung, technische Unterstützung inklusive.",
    },
    pro_architectes: {
      title: 'Geothermische Lösungen für Architekten in Luxemburg — WellDoneDrill',
      description: "Integrieren Sie Erdwärme von Anfang an in Ihre Projekte in Luxemburg. Dimensionierung, technische Analysen und Zertifizierungen inklusive.",
    },
    pro_entrepreneurs: {
      title: 'Geothermie für Immobilienentwickler in Luxemburg — WellDoneDrill',
      description: "Steigern Sie den Wert Ihrer Immobilienprojekte in Luxemburg mit Erdwärme. Von der Analyse bis zur Anbindung — schlüsselfertige Geothermieprojekte.",
    },
    geo_fermee: {
      title: 'Geschlossene Geothermie (Vertikalsonden) in Luxemburg — WellDoneDrill',
      description: "Geschlossenes Erdwärmesystem mit Vertikalsonden bis 150 m. Heizung + Kühlung + Warmwasser. Genehmigung, Bohrung und Wärmepumpenanschluss aus einer Hand.",
    },
    geo_ouverte: {
      title: 'Offene Geothermie (Grundwasser) in Luxemburg — WellDoneDrill | Aquathermie',
      description: "Offenes Erdwärmesystem auf Grundwasserbasis in Luxemburg. Optimale COP-Werte, ideal für Gewerbe- und Gemeinschaftsgebäude.",
    },
    pac: {
      title: 'Geothermische Wärmepumpen in Luxemburg — WellDoneDrill | Wasser-Wasser',
      description: "Geothermische Wasser-Wasser-Wärmepumpen für Luxemburg. COP bis zu 5, Heizung + Warmwasser + Kühlung. Schlüsselfertige Installation durch zertifizierte Experten.",
    },
    a_propos: {
      title: 'Über WellDoneDrill — Experten für Erdwärmebohrungen in Luxemburg',
      description: "Entdecken Sie das WellDoneDrill-Team, Experten für geothermische Bohrungen in Luxemburg. Unsere Mission: Erdwärme für alle zugänglich zu machen.",
    },
    contact: {
      title: 'Ihr Geothermieprojekt starten — Kostenloses Angebot | WellDoneDrill Luxemburg',
      description: "Kostenlose und unverbindliche Machbarkeitsanalyse in Luxemburg. Antwort innerhalb von 48 Stunden. WellDoneDrill, Ihr Geothermie-Spezialist.",
    },
    references: {
      title: 'Unsere Geothermieprojekte in Luxemburg — WellDoneDrill | Referenzen',
      description: "Entdecken Sie unsere geothermischen Bohrprojekte in Luxemburg. Wohngebäude, Tertiär, Industrie und öffentliche Bauten.",
    },
    geo: {
      title: 'Geothermie in Luxemburg — Geschlossene & offene Bohrung | WellDoneDrill',
      description: "Geschlossene (Vertikalsonden) und offene Geothermie (Grundwasser) in Luxemburg. WellDoneDrill bohrt Ihre Sonden — kostenlose Analyse, Genehmigung, Wärmepumpe.",
    },
    blog: {
      title: 'Blog Geothermie & Erdwärmebohrung in Luxemburg — WellDoneDrill',
      description: "Ratgeber, Baustellenberichte und Neuigkeiten über Geothermie, Bohrungen und Wärmepumpen in Luxemburg. Der Blog der WellDoneDrill-Experten.",
    },
    mentions_legales: {
      title: 'Impressum — WellDoneDrill',
      description: "Impressum von WellDoneDrill, Spezialist für Erdwärmebohrungen in Luxemburg und Belgien.",
    },
    politique_confidentialite: {
      title: 'Datenschutz — WellDoneDrill',
      description: "Datenschutzrichtlinie und Verarbeitung personenbezogener Daten bei WellDoneDrill.",
    },
    cookies: {
      title: 'Cookie-Richtlinie — WellDoneDrill',
      description: "Richtlinie zur Verwendung von Cookies auf der Website von WellDoneDrill.",
    },
  },

  'be-en': {
    home: {
      title: 'WellDoneDrill — Geothermal drilling & Heat pumps in Belgium',
      description: "Belgian geothermal drilling specialist. Free feasibility analysis, permits, turnkey heat pump installation. Save up to 70% on your energy bill. Reply within 48h.",
    },
    particuliers: {
      title: 'Geothermal energy for homeowners in Belgium — WellDoneDrill | Heating −70%',
      description: "Heat your home at −70% cost with geothermal energy. Free analysis, permits included, turnkey installation. Your Belgian geothermal drilling specialist.",
    },
    pro: {
      title: 'Geothermal solutions for professionals in Belgium — WellDoneDrill',
      description: "Geothermal partner for Belgian installers, architects and developers. Drilling subcontracting, technical analyses, certifications — grow your geothermal business.",
    },
    pro_chauffagistes: {
      title: 'Geothermal energy for HVAC installers in Belgium — WellDoneDrill',
      description: "Subcontract your geothermal drilling to WellDoneDrill. Partner of Belgian HVAC installers — training, certification and technical support included.",
    },
    pro_architectes: {
      title: 'Geothermal energy for architects & engineering firms in Belgium — WellDoneDrill',
      description: "Integrate geothermal energy into your projects from the design stage. Sizing, technical analyses and certifications — WellDoneDrill, your geothermal partner.",
    },
    pro_entrepreneurs: {
      title: 'Geothermal energy for property developers in Belgium — WellDoneDrill',
      description: "Add value to your projects with geothermal energy. From A to Z: analysis, permits, drilling, connection. Optimised ROI and guaranteed energy labels.",
    },
    geo_fermee: {
      title: 'Closed-loop geothermal (vertical boreholes) in Belgium — WellDoneDrill',
      description: "Closed-loop geothermal system: vertical boreholes up to 150 m. Heating + cooling + hot water. Permits, drilling and turnkey heat pump connection.",
    },
    geo_ouverte: {
      title: 'Open-loop geothermal (groundwater) in Belgium — WellDoneDrill | Aquathermy',
      description: "Groundwater geothermal system. Optimal COP, ideal for commercial and multi-unit buildings. Permits, drilling and turnkey installation.",
    },
    pac: {
      title: 'Geothermal heat pumps in Belgium — WellDoneDrill | Water-to-water heat pumps',
      description: "Heat pumps on geothermal boreholes. COP up to 5, heating + domestic hot water + cooling. Turnkey installation by certified experts.",
    },
    a_propos: {
      title: 'About WellDoneDrill — Geothermal drilling experts in Belgium',
      description: "Meet the WellDoneDrill team, Belgian geothermal drilling experts. Our mission: make geothermal energy accessible to everyone, from A to Z.",
    },
    contact: {
      title: 'Start your geothermal project — Free quote | WellDoneDrill Belgium',
      description: "Get your free, no-obligation feasibility analysis. Geothermal drilling in Belgium — reply within 48h. WellDoneDrill, from analysis to connection.",
    },
    references: {
      title: 'Our geothermal projects in Belgium — WellDoneDrill | Projects',
      description: "Discover our geothermal drilling projects completed in Belgium. Residential, commercial, industrial and public — projects delivered from A to Z.",
    },
    geo: {
      title: 'Geothermal energy in Belgium — Closed & open loop | WellDoneDrill',
      description: "Closed-loop (vertical boreholes) and open-loop (groundwater) geothermal in Belgium. WellDoneDrill drills your boreholes — free analysis, permits, turnkey heat pump install.",
    },
    blog: {
      title: 'Geothermal energy & drilling blog in Belgium — WellDoneDrill',
      description: "Tips, project insights and news on geothermal energy, drilling and heat pumps in Belgium. The blog of the WellDoneDrill experts.",
    },
    mentions_legales: {
      title: 'Legal notice — WellDoneDrill',
      description: "Legal notice for WellDoneDrill, geothermal drilling specialist in Belgium and Luxembourg.",
    },
    politique_confidentialite: {
      title: 'Privacy policy — WellDoneDrill',
      description: "Privacy policy and processing of personal data by WellDoneDrill.",
    },
    cookies: {
      title: 'Cookie policy — WellDoneDrill',
      description: "Cookie usage policy on the WellDoneDrill website.",
    },
  },

  'fr-en': {
    home: {
      title: 'WellDoneDrill — Geothermal drilling & Heat pumps in France',
      description: "Geothermal drilling specialist in France. Free feasibility analysis, permits, turnkey heat pump installation. Save up to 70% on your energy bill. Reply within 48h.",
    },
    particuliers: {
      title: 'Geothermal energy for homeowners in France — WellDoneDrill | Heating −70%',
      description: "Heat your home at −70% cost with geothermal energy. Free analysis, permits included, turnkey installation. Your geothermal drilling specialist in France.",
    },
    pro: {
      title: 'Geothermal solutions for professionals in France — WellDoneDrill',
      description: "Geothermal partner for French installers, architects and developers. Drilling subcontracting, technical analyses, certifications — grow your geothermal business.",
    },
    pro_chauffagistes: {
      title: 'Geothermal energy for HVAC installers in France — WellDoneDrill',
      description: "Subcontract your geothermal drilling to WellDoneDrill. Partner of French HVAC installers — training, certification and technical support included.",
    },
    pro_architectes: {
      title: 'Geothermal energy for architects & engineering firms in France — WellDoneDrill',
      description: "Integrate geothermal energy into your projects from the design stage. Sizing, technical analyses and certifications — WellDoneDrill, your geothermal partner.",
    },
    pro_entrepreneurs: {
      title: 'Geothermal energy for property developers in France — WellDoneDrill',
      description: "Add value to your projects with geothermal energy. From A to Z: analysis, permits, drilling, connection. Optimised ROI and guaranteed energy labels.",
    },
    geo_fermee: {
      title: 'Closed-loop geothermal (vertical boreholes) in France — WellDoneDrill',
      description: "Closed-loop geothermal system: vertical boreholes up to 150 m. Heating + cooling + hot water. Permits, drilling and turnkey heat pump connection.",
    },
    geo_ouverte: {
      title: 'Open-loop geothermal (groundwater) in France — WellDoneDrill | Aquathermy',
      description: "Groundwater geothermal system. Optimal COP, ideal for commercial and multi-unit buildings. Permits, drilling and turnkey installation.",
    },
    pac: {
      title: 'Geothermal heat pumps in France — WellDoneDrill | Water-to-water heat pumps',
      description: "Heat pumps on geothermal boreholes. COP up to 5, heating + domestic hot water + cooling. Turnkey installation by certified experts.",
    },
    a_propos: {
      title: 'About WellDoneDrill — Geothermal drilling experts in France',
      description: "Meet the WellDoneDrill team, geothermal drilling experts. Our mission: make geothermal energy accessible to everyone, from A to Z.",
    },
    contact: {
      title: 'Start your geothermal project — Free quote | WellDoneDrill France',
      description: "Get your free, no-obligation feasibility analysis. Geothermal drilling in France — reply within 48h. WellDoneDrill, from analysis to connection.",
    },
    references: {
      title: 'Our geothermal projects in France — WellDoneDrill | Projects',
      description: "Discover our geothermal drilling projects. Residential, commercial, industrial and public — projects delivered from A to Z.",
    },
    geo: {
      title: 'Geothermal energy in France — Closed & open loop | WellDoneDrill',
      description: "Closed-loop (vertical boreholes) and open-loop (groundwater) geothermal in France. WellDoneDrill drills your boreholes — free analysis, permits, turnkey heat pump install.",
    },
    blog: {
      title: 'Geothermal energy & drilling blog in France — WellDoneDrill',
      description: "Tips, project insights and news on geothermal energy, drilling and heat pumps in France. The blog of the WellDoneDrill experts.",
    },
    mentions_legales: {
      title: 'Legal notice — WellDoneDrill',
      description: "Legal notice for WellDoneDrill, geothermal drilling specialist.",
    },
    politique_confidentialite: {
      title: 'Privacy policy — WellDoneDrill',
      description: "Privacy policy and processing of personal data by WellDoneDrill.",
    },
    cookies: {
      title: 'Cookie policy — WellDoneDrill',
      description: "Cookie usage policy on the WellDoneDrill website.",
    },
  },

  'lu-en': {
    home: {
      title: 'WellDoneDrill — Geothermal drilling & Heat pumps in Luxembourg',
      description: "Geothermal drilling specialist in Luxembourg. Free feasibility analysis, permits, turnkey heat pump installation. Save up to 70% on your energy bill. Reply within 48h.",
    },
    particuliers: {
      title: 'Geothermal energy for homeowners in Luxembourg — WellDoneDrill | Heating −70%',
      description: "Heat your home at −70% cost with geothermal energy. Free analysis, permits included, turnkey installation. Your geothermal drilling specialist in Luxembourg.",
    },
    pro: {
      title: 'Geothermal solutions for professionals in Luxembourg — WellDoneDrill',
      description: "Geothermal partner for installers, architects and developers in Luxembourg. Drilling subcontracting, technical analyses, certifications — grow your geothermal business.",
    },
    pro_chauffagistes: {
      title: 'Geothermal energy for HVAC installers in Luxembourg — WellDoneDrill',
      description: "Subcontract your geothermal drilling to WellDoneDrill. Partner of HVAC installers in Luxembourg — training, certification and technical support included.",
    },
    pro_architectes: {
      title: 'Geothermal energy for architects & engineering firms in Luxembourg — WellDoneDrill',
      description: "Integrate geothermal energy into your projects from the design stage. Sizing, technical analyses and certifications — WellDoneDrill, your geothermal partner.",
    },
    pro_entrepreneurs: {
      title: 'Geothermal energy for property developers in Luxembourg — WellDoneDrill',
      description: "Add value to your projects with geothermal energy. From A to Z: analysis, permits, drilling, connection. Optimised ROI and guaranteed energy labels.",
    },
    geo_fermee: {
      title: 'Closed-loop geothermal (vertical boreholes) in Luxembourg — WellDoneDrill',
      description: "Closed-loop geothermal system: vertical boreholes up to 150 m. Heating + cooling + hot water. Permits, drilling and turnkey heat pump connection.",
    },
    geo_ouverte: {
      title: 'Open-loop geothermal (groundwater) in Luxembourg — WellDoneDrill | Aquathermy',
      description: "Groundwater geothermal system. Optimal COP, ideal for commercial and multi-unit buildings. Permits, drilling and turnkey installation.",
    },
    pac: {
      title: 'Geothermal heat pumps in Luxembourg — WellDoneDrill | Water-to-water heat pumps',
      description: "Heat pumps on geothermal boreholes. COP up to 5, heating + domestic hot water + cooling. Turnkey installation by certified experts.",
    },
    a_propos: {
      title: 'About WellDoneDrill — Geothermal drilling experts in Luxembourg',
      description: "Meet the WellDoneDrill team, geothermal drilling experts. Our mission: make geothermal energy accessible to everyone, from A to Z.",
    },
    contact: {
      title: 'Start your geothermal project — Free quote | WellDoneDrill Luxembourg',
      description: "Get your free, no-obligation feasibility analysis. Geothermal drilling in Luxembourg — reply within 48h. WellDoneDrill, from analysis to connection.",
    },
    references: {
      title: 'Our geothermal projects in Luxembourg — WellDoneDrill | Projects',
      description: "Discover our geothermal drilling projects. Residential, commercial, industrial and public — projects delivered from A to Z.",
    },
    geo: {
      title: 'Geothermal energy in Luxembourg — Closed & open loop | WellDoneDrill',
      description: "Closed-loop (vertical boreholes) and open-loop (groundwater) geothermal in Luxembourg. WellDoneDrill drills your boreholes — free analysis, permits, turnkey heat pump install.",
    },
    blog: {
      title: 'Geothermal energy & drilling blog in Luxembourg — WellDoneDrill',
      description: "Tips, project insights and news on geothermal energy, drilling and heat pumps in Luxembourg. The blog of the WellDoneDrill experts.",
    },
    mentions_legales: {
      title: 'Legal notice — WellDoneDrill',
      description: "Legal notice for WellDoneDrill, geothermal drilling specialist in Belgium and Luxembourg.",
    },
    politique_confidentialite: {
      title: 'Privacy policy — WellDoneDrill',
      description: "Privacy policy and processing of personal data by WellDoneDrill.",
    },
    cookies: {
      title: 'Cookie policy — WellDoneDrill',
      description: "Cookie usage policy on the WellDoneDrill website.",
    },
  },
}

export function getSeoDefaults(locale: AppLocale, routeKey: string): SeoEntry {
  return SEO_DEFAULTS[locale]?.[routeKey] ?? { title: 'WellDoneDrill', description: '' }
}

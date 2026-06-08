import type { AppLocale } from './routes'

export type SeoEntry = { title: string; description: string }

export const SEO_DEFAULTS: Record<AppLocale, Record<string, SeoEntry>> = {
  'be-fr': {
    home: {
      title: 'WellDoneDrill — Expert forage géothermique en Belgique',
      description: "Expert belge du forage géothermique. Étude gratuite, permis, PAC de A à Z. Économisez −70% sur votre facture. Réponse sous 48h.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers en Belgique — WellDoneDrill',
      description: "Chauffez votre maison à −70% avec la géothermie. Étude gratuite, permis inclus, installation clé en main par votre expert belge.",
    },
    pro: {
      title: 'Solutions géothermiques professionnels — WellDoneDrill BE',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs belges. Sous-traitance forage, études techniques et certifications.",
    },
    pro_chauffagistes: {
      title: 'Géothermie chauffagistes Belgique — WellDoneDrill',
      description: "Sous-traitez vos forages géothermiques à WellDoneDrill. Partenaire HVAC belge — formation, certification et support technique inclus.",
    },
    pro_architectes: {
      title: 'Géothermie architectes Belgique — WellDoneDrill',
      description: "Intégrez la géothermie dès la conception. Dimensionnement, études PEB et certifications — WellDoneDrill, votre partenaire expert.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie promoteurs immobiliers — WellDoneDrill BE',
      description: "Valorisez vos projets avec la géothermie. Étude, permis, forage, raccordement — ROI optimisé et labels énergétiques garantis.",
    },
    geo: {
      title: 'Géothermie en Belgique — WellDoneDrill | Fermée & Ouverte',
      description: "Découvrez la géothermie fermée (sondes verticales) et ouverte (nappe phréatique). WellDoneDrill, expert du forage géothermique en Belgique.",
    },
    geo_fermee: {
      title: 'Géothermie fermée en Belgique — WellDoneDrill | Sondes',
      description: "Circuit fermé géothermique : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + ECS. Permis, forage et raccordement PAC clé en main.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte en Belgique — WellDoneDrill | Nappe',
      description: "Géothermie sur nappe phréatique : COP optimaux pour bâtiments tertiaires et collectifs. Permis, forage et installation clé en main.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques — WellDoneDrill Belgique',
      description: "PAC géothermique eau-eau : COP jusqu'à 5, chauffage + ECS + climatisation. Installation clé en main par experts certifiés en Belgique.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts géothermie Belgique',
      description: "Découvrez l'équipe WellDoneDrill, experts belges du forage géothermique. Notre mission : rendre la géothermie accessible à tous.",
    },
    contact: {
      title: 'Contact & Devis géothermique — WellDoneDrill Belgique',
      description: "Étude de faisabilité gratuite et sans engagement. Forage géothermique en Belgique — réponse sous 48h. De l'étude au raccordement.",
    },
    references: {
      title: 'Réalisations géothermiques Belgique — WellDoneDrill',
      description: "Découvrez nos projets de forage géothermique en Belgique. Résidentiel, tertiaire, industriel et public — livrés de A à Z.",
    },
    blog: {
      title: 'Blog géothermie — WellDoneDrill | Actualités & conseils',
      description: "Articles, retours de chantier et conseils techniques sur la géothermie et le forage. Restez informé avec WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, expert en forage géothermique en Belgique et au Luxembourg.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site WellDoneDrill.",
    },
  },

  'be-nl': {
    home: {
      title: 'WellDoneDrill — Expert geothermische boring in België',
      description: "Belgische expert in geothermische boringen. Gratis haalbaarheidstudie, vergunning, warmtepomp van A tot Z. Bespaar tot 70% op uw factuur.",
    },
    particuliers: {
      title: 'Geothermie voor particulieren in België — WellDoneDrill',
      description: "Verwarm uw woning met 70% minder kosten. Gratis studie, vergunning inbegrepen, sleutel-op-de-deur installatie door Belgische experts.",
    },
    pro: {
      title: 'Geothermische oplossingen professionals — WellDoneDrill BE',
      description: "Geothermiepartner van installateurs, architecten en ontwikkelaars in België. Onderaanneming boringen, technische studies en certificeringen.",
    },
    pro_chauffagistes: {
      title: 'Geothermie HVAC-installateurs België — WellDoneDrill',
      description: "Besteed geothermische boringen uit aan WellDoneDrill. Partner van HVAC-installateurs — opleiding, certificering en technische ondersteuning.",
    },
    pro_architectes: {
      title: 'Geothermie architecten België — WellDoneDrill',
      description: "Integreer geothermie vanaf de ontwerpfase. Dimensionering, PEB-studies en certificeringen — WellDoneDrill, uw geothermiepartner.",
    },
    pro_entrepreneurs: {
      title: 'Geothermie projectontwikkelaars — WellDoneDrill België',
      description: "Verhoog de waarde van uw projecten met geothermie. Van studie tot aansluiting — geoptimaliseerd rendement en energielabels.",
    },
    geo: {
      title: 'Geothermie in België — WellDoneDrill | Gesloten & Open',
      description: "Gesloten (verticale sondes) en open geothermie (grondwater). WellDoneDrill, expert in geothermische boringen in België.",
    },
    geo_fermee: {
      title: 'Gesloten geothermie België — WellDoneDrill | Sondes',
      description: "Gesloten systeem met verticale sondes tot 150 m. Verwarming + koeling + warm water. Vergunning, boring en warmtepomp in één pakket.",
    },
    geo_ouverte: {
      title: 'Open geothermie België — WellDoneDrill | Grondwater',
      description: "Open systeem op grondwater: optimale COP voor tertiaire en collectieve gebouwen. Vergunning, boring en installatie.",
    },
    pac: {
      title: 'Geothermische warmtepompen — WellDoneDrill België',
      description: "Water-water warmtepompen op geothermische boring. COP tot 5, verwarming + warm water + koeling. Sleutel-op-de-deur door experts.",
    },
    a_propos: {
      title: 'Over WellDoneDrill — Experts geothermie België',
      description: "Ontdek het WellDoneDrill-team, Belgische experts in geothermische boringen. Onze missie: geothermie voor iedereen toegankelijk maken.",
    },
    contact: {
      title: 'Contact & Offerte geothermie — WellDoneDrill België',
      description: "Gratis en vrijblijvende haalbaarheidstudie. Geothermische boring in België — antwoord binnen 48u. Van studie tot aansluiting.",
    },
    references: {
      title: 'Geothermische realisaties België — WellDoneDrill',
      description: "Ontdek onze geothermische boorprojecten in België. Residentieel, tertiair, industrieel en openbaar — van A tot Z opgeleverd.",
    },
    blog: {
      title: 'Blog geothermie — WellDoneDrill | Nieuws & advies',
      description: "Artikelen, werfverslagen en technische adviezen over geothermie en boringen. Blijf op de hoogte met WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Juridische informatie — WellDoneDrill',
      description: "Juridische informatie van WellDoneDrill, expert in geothermische boringen in België en Luxemburg.",
    },
    politique_confidentialite: {
      title: 'Privacybeleid — WellDoneDrill',
      description: "Privacybeleid en verwerking van persoonsgegevens door WellDoneDrill.",
    },
    cookies: {
      title: 'Cookiebeleid — WellDoneDrill',
      description: "Cookiebeleid van de website van WellDoneDrill.",
    },
  },

  'fr-fr': {
    home: {
      title: 'WellDoneDrill — Expert forage géothermique en France',
      description: "Expert du forage géothermique en France. Étude gratuite, permis, PAC de A à Z. Économisez −70% sur votre facture. Réponse sous 48h.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers en France — WellDoneDrill',
      description: "Chauffez votre maison à −70% avec la géothermie en France. Étude gratuite, permis inclus, installation clé en main par nos experts.",
    },
    pro: {
      title: 'Solutions géothermiques professionnels — WellDoneDrill FR',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs en France. Sous-traitance forage, études techniques et certifications.",
    },
    pro_chauffagistes: {
      title: 'Géothermie chauffagistes France — WellDoneDrill',
      description: "Sous-traitez vos forages géothermiques en France. Partenaire HVAC — formation, certification et support technique inclus.",
    },
    pro_architectes: {
      title: 'Géothermie architectes France — WellDoneDrill',
      description: "Intégrez la géothermie dès la conception en France. Dimensionnement, études et certifications clé en main.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie promoteurs immobiliers — WellDoneDrill FR',
      description: "Valorisez vos projets immobiliers en France avec la géothermie. Étude, permis, forage, raccordement — ROI optimisé.",
    },
    geo: {
      title: 'Géothermie en France — WellDoneDrill | Fermée & Ouverte',
      description: "Géothermie fermée (sondes verticales) et ouverte (nappe phréatique) en France. WellDoneDrill, expert du forage géothermique.",
    },
    geo_fermee: {
      title: 'Géothermie fermée en France — WellDoneDrill | Sondes',
      description: "Circuit fermé géothermique en France : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + ECS. Installation clé en main.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte en France — WellDoneDrill | Nappe',
      description: "Géothermie sur nappe phréatique en France. COP optimaux, idéal pour bâtiments tertiaires et collectifs. Installation clé en main.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques — WellDoneDrill France',
      description: "PAC géothermique eau-eau en France. COP jusqu'à 5, chauffage + ECS + climatisation. Installation clé en main par experts certifiés.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts géothermie France',
      description: "Découvrez WellDoneDrill, experts du forage géothermique en France. Notre mission : rendre la géothermie accessible à tous.",
    },
    contact: {
      title: 'Contact & Devis géothermique — WellDoneDrill France',
      description: "Étude de faisabilité gratuite et sans engagement en France. Réponse sous 48h. WellDoneDrill, de l'étude au raccordement.",
    },
    references: {
      title: 'Réalisations géothermiques France — WellDoneDrill',
      description: "Découvrez nos projets de forage géothermique en France. Résidentiel, tertiaire, industriel et public — livrés de A à Z.",
    },
    blog: {
      title: 'Blog géothermie — WellDoneDrill | Actualités & conseils',
      description: "Articles, retours de chantier et conseils techniques sur la géothermie et le forage en France. WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, expert en forage géothermique en France et en Belgique.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site WellDoneDrill.",
    },
  },

  'lu-fr': {
    home: {
      title: 'WellDoneDrill — Expert forage géothermique au Luxembourg',
      description: "Expert du forage géothermique au Luxembourg. Étude gratuite, permis, PAC de A à Z. Économisez −70% sur votre facture. Réponse sous 48h.",
    },
    particuliers: {
      title: 'Géothermie pour particuliers au Luxembourg — WellDoneDrill',
      description: "Chauffez votre maison à −70% avec la géothermie au Luxembourg. Étude gratuite, permis inclus, installation clé en main.",
    },
    pro: {
      title: 'Solutions géothermiques professionnels — WellDoneDrill LU',
      description: "Partenaire géothermique des installateurs, architectes et promoteurs au Luxembourg. Sous-traitance forage, études et certifications.",
    },
    pro_chauffagistes: {
      title: 'Géothermie chauffagistes Luxembourg — WellDoneDrill',
      description: "Sous-traitez vos forages géothermiques au Luxembourg. Partenaire HVAC — formation et support technique inclus.",
    },
    pro_architectes: {
      title: 'Géothermie architectes Luxembourg — WellDoneDrill',
      description: "Intégrez la géothermie dès la conception au Luxembourg. Dimensionnement, études PEB et certifications clé en main.",
    },
    pro_entrepreneurs: {
      title: 'Géothermie promoteurs immobiliers — WellDoneDrill LU',
      description: "Valorisez vos projets au Luxembourg avec la géothermie. Étude, permis, forage, raccordement — partenaire clé en main.",
    },
    geo: {
      title: 'Géothermie au Luxembourg — WellDoneDrill | Fermée & Ouverte',
      description: "Géothermie fermée et ouverte au Luxembourg. WellDoneDrill, expert du forage géothermique et partenaire de vos projets énergétiques.",
    },
    geo_fermee: {
      title: 'Géothermie fermée au Luxembourg — WellDoneDrill',
      description: "Circuit fermé géothermique au Luxembourg : sondes verticales jusqu'à 150 m. Chauffage + rafraîchissement + ECS inclus.",
    },
    geo_ouverte: {
      title: 'Géothermie ouverte au Luxembourg — WellDoneDrill',
      description: "Géothermie sur nappe phréatique au Luxembourg. COP optimaux pour grandes puissances. Installation complète clé en main.",
    },
    pac: {
      title: 'Pompes à chaleur géothermiques — WellDoneDrill Luxembourg',
      description: "PAC géothermique eau-eau au Luxembourg. COP optimal, chauffage + ECS + climatisation. Installation complète par experts certifiés.",
    },
    a_propos: {
      title: 'À propos de WellDoneDrill — Experts géothermie Luxembourg',
      description: "Découvrez WellDoneDrill, spécialistes du forage géothermique au Luxembourg. Notre mission : géothermie accessible à tous.",
    },
    contact: {
      title: 'Contact & Devis géothermique — WellDoneDrill Luxembourg',
      description: "Étude de faisabilité gratuite au Luxembourg. Réponse sous 48h, sans engagement. WellDoneDrill, votre expert géothermie.",
    },
    references: {
      title: 'Réalisations géothermiques Luxembourg — WellDoneDrill',
      description: "Découvrez nos projets de forage géothermique au Luxembourg. Résidentiel, tertiaire, industriel et public — livrés de A à Z.",
    },
    blog: {
      title: 'Blog géothermie — WellDoneDrill | Actualités & conseils',
      description: "Articles, retours de chantier et conseils sur la géothermie au Luxembourg. Restez informé avec WellDoneDrill.",
    },
    mentions_legales: {
      title: 'Mentions légales — WellDoneDrill',
      description: "Mentions légales de WellDoneDrill, expert en forage géothermique au Luxembourg et en Belgique.",
    },
    politique_confidentialite: {
      title: 'Politique de confidentialité — WellDoneDrill',
      description: "Politique de confidentialité et traitement des données personnelles de WellDoneDrill.",
    },
    cookies: {
      title: 'Politique cookies — WellDoneDrill',
      description: "Politique d'utilisation des cookies sur le site WellDoneDrill.",
    },
  },

  'lu-de': {
    home: {
      title: 'WellDoneDrill — Geothermie-Experte in Luxemburg',
      description: "Experte für Erdwärmebohrungen in Luxemburg. Kostenlose Machbarkeitsstudie, Genehmigung, Wärmepumpe von A bis Z. Bis zu 70% Energieersparnis.",
    },
    particuliers: {
      title: 'Geothermie für Privatpersonen Luxemburg — WellDoneDrill',
      description: "Heizen mit 70% weniger Kosten dank Erdwärme in Luxemburg. Kostenlose Studie, Genehmigung inklusive, schlüsselfertige Installation.",
    },
    pro: {
      title: 'Geothermie für Fachleute Luxemburg — WellDoneDrill',
      description: "Geothermiepartner für Installateure, Architekten und Bauträger in Luxemburg. Bohrungsunterauftrag, technische Studien und Zertifizierungen.",
    },
    pro_chauffagistes: {
      title: 'Geothermie Heizungsinstallateure Luxemburg — WellDoneDrill',
      description: "Vergeben Sie Erdwärmebohrungen an WellDoneDrill. Partner der Heizungsinstallateure in Luxemburg — Schulung und Support inklusive.",
    },
    pro_architectes: {
      title: 'Geothermie für Architekten Luxemburg — WellDoneDrill',
      description: "Erdwärme ab der Planungsphase integrieren. Dimensionierung, technische Studien und Zertifizierungen in Luxemburg.",
    },
    pro_entrepreneurs: {
      title: 'Geothermie Bauträger Luxemburg — WellDoneDrill',
      description: "Immobilienprojekte in Luxemburg mit Erdwärme aufwerten. Von Studie bis Anbindung — schlüsselfertige Geothermieprojekte.",
    },
    geo: {
      title: 'Geothermie Luxemburg — WellDoneDrill | Geschlossen & Offen',
      description: "Geschlossene und offene Geothermie in Luxemburg. WellDoneDrill, Ihr Experte für Erdwärmebohrungen und Energieprojekte.",
    },
    geo_fermee: {
      title: 'Geschlossene Geothermie Luxemburg — WellDoneDrill',
      description: "Geschlossenes Erdwärmesystem mit Vertikalsonden bis 150 m. Heizung + Kühlung + Warmwasser. Genehmigung, Bohrung und Anschluss.",
    },
    geo_ouverte: {
      title: 'Offene Geothermie Luxemburg — WellDoneDrill | Grundwasser',
      description: "Offenes Erdwärmesystem auf Grundwasserbasis in Luxemburg. Optimale COP-Werte für Gewerbegebäude. Schlüsselfertige Installation.",
    },
    pac: {
      title: 'Geothermische Wärmepumpen Luxemburg — WellDoneDrill',
      description: "Wasser-Wasser-Wärmepumpen für Luxemburg. COP bis 5, Heizung + Warmwasser + Kühlung. Schlüsselfertige Installation durch Experten.",
    },
    a_propos: {
      title: 'Über WellDoneDrill — Geothermie-Experten Luxemburg',
      description: "Entdecken Sie WellDoneDrill, Experten für Erdwärmebohrungen in Luxemburg. Unsere Mission: Geothermie für alle zugänglich machen.",
    },
    contact: {
      title: 'Kontakt & Angebot Geothermie — WellDoneDrill Luxemburg',
      description: "Kostenlose Machbarkeitsstudie in Luxemburg. Antwort innerhalb 48 Stunden, unverbindlich. WellDoneDrill, Ihr Geothermie-Spezialist.",
    },
    references: {
      title: 'Geothermieprojekte Luxemburg — WellDoneDrill | Referenzen',
      description: "Entdecken Sie unsere Erdwärmebohrprojekte in Luxemburg. Wohngebäude, Tertiär, Industrie und öffentliche Bauten — von A bis Z.",
    },
    blog: {
      title: 'Blog Geothermie — WellDoneDrill | Aktuelles & Ratgeber',
      description: "Artikel, Baustellenberichte und technische Ratgeber zur Geothermie in Luxemburg. WellDoneDrill hält Sie auf dem Laufenden.",
    },
    mentions_legales: {
      title: 'Impressum — WellDoneDrill',
      description: "Impressum von WellDoneDrill, Experte für Erdwärmebohrungen in Luxemburg und Belgien.",
    },
    politique_confidentialite: {
      title: 'Datenschutz — WellDoneDrill',
      description: "Datenschutzrichtlinie und Verarbeitung personenbezogener Daten bei WellDoneDrill.",
    },
    cookies: {
      title: 'Cookie-Richtlinie — WellDoneDrill',
      description: "Cookie-Richtlinie der WellDoneDrill-Website.",
    },
  },
}

export function getSeoDefaults(locale: AppLocale, routeKey: string): SeoEntry {
  return SEO_DEFAULTS[locale]?.[routeKey] ?? { title: 'WellDoneDrill', description: '' }
}

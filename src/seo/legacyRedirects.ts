// 301 redirects from the old WordPress site (pre-redesign) to the new routes.
//
// The old URLs were collected from the Wayback Machine index of
// welldonedrill.energy (snapshots up to June 2026). Without these, every old
// article, project and reference page returned a 404 after the redesign and
// Google dropped the ranking signals (backlinks, history) attached to them.
//
// Old URLs had a trailing slash: Next strips it first (308), then these rules
// apply. Keep specific rules before catch-alls — Next uses the first match.

type Redirect = { source: string; destination: string; permanent: true }

const r = (source: string, destination: string): Redirect => ({ source, destination, permanent: true })

/* ─── Provinces ─────────────────────────────────────────────── */

// [new FR slug, new NL slug, old FR "nos-references-…" suffix, old NL suffix, old EN suffix]
const PROVINCES: [string, string, string, string, string][] = [
  ['anvers',            'antwerpen',       'a-anvers',               'antwerpen',      'antwerp'],
  ['bruxelles',         'brussel',         'a-bruxelles',            'brussel',        'brussels'],
  ['hainaut',           'henegouwen',      'au-hainaut',             'henegouwen',     'hainaut'],
  ['liege',             'luik',            'a-liege',                'luik',           'liege'],
  ['namur',             'namen',           'a-namur',                'namen',          'namur'],
  ['luxembourg',        'luxemburg',       'au-luxembourg',          'luxemburg',      'luxembourg'],
  ['limbourg',          'limburg',         'au-limbourg',            'limburg',        'limburg'],
  ['west-flandre',      'west-vlaanderen', 'en-flandre-occidentale', 'west-vlaanderen','west-flanders'],
  ['flandre-orientale', 'oost-vlaanderen', 'en-flandre-orientale',   'oost-vlaanderen','east-flanders'],
  ['brabant-flamand',   'vlaams-brabant',  'en-brabant-flamand',     'vlaams-brabant', 'flemish-brabant'],
  ['brabant-wallon',    'waals-brabant',   'en-brabant-wallon',      'waals-brabant',  'walloon-brabant'],
]

const FR_REF = '/be-fr/realisations-geothermie-belgique'
const NL_REF = '/be-nl/referenties'
const EN_REF = '/be-en/geothermal-projects-belgium'

const provinceRedirects: Redirect[] = PROVINCES.flatMap(([fr, nl, oldFr, oldNl, oldEn]) => [
  r(`/be-fr/:base(references|realisations-geothermie-belgique)/nos-references-${oldFr}`, `${FR_REF}/${fr}`),
  r(`/be-nl/:base(referenties|referenties-2)/onze-referenties-in-${oldNl}`, `${NL_REF}/${nl}`),
  r(`/en/:base(references|references-2)/our-references-in-${oldEn}`, `${EN_REF}/${fr}`),
])

/* ─── Projects (old /project/… and /project_category/…) ─────── */

// old be-fr slug → new path under FR_REF (chantier slug or province slug)
const FR_PROJECTS: Record<string, string> = {
  'anderlecht-novacity-2': 'novacity-ii-anderlecht',
  'boitsfort-la-foresterie': 'la-foresterie-watermael-boitsfort',
  'jodoigne': 'belle-vallee-jodoigne',
  'megafactory-charleroi': 'megafactory-aerospacelab-charleroi',
  'megafactorydaerospacelabmisesurlageothemri-charleroi': 'megafactory-aerospacelab-charleroi',
  'suarlee': 'tour-controle-numerique-suarlee',
  'geothermie-a-la-haute-ecole-de-huy': 'liege',
  'installations-geothermiques-dans-un-chateau-a-gembloux': 'namur',
  'la-geothermie-a-lechelle-dun-quartier-chastre': 'brabant-wallon',
  'tournai-chauffer-un-hopital-a-laide-de-la-geothermie': 'hainaut',
  'woluwe-saint-lambert-greenwood': 'bruxelles',
}

const NL_PROJECTS: Record<string, string> = {
  'anderlecht-novacity-ii': 'novacity-ii--anderlecht',
  'boitsfort-la-foresterie': 'la-foresterie-watermael-boitsfort',
  'jodoigne': 'jodoigne',
  'megafabriek-charleroi': 'megafactory-aerospacelab--charleroi',
  'suarlee': 'suarlee',
  'sint-lambrechts-woluwe-greenwood': 'brussel',
  'geothermische-boringen-in-een-brusselse-wijk': 'brussel',
  'geothermie-a-la-haute-ecole-de-huy': 'luik',
  'installations-geothermiques-dans-un-chateau-a-gembloux': 'namen',
  'la-geothermie-a-lechelle-dun-quartier-chastre': 'waals-brabant',
  'tournai-chauffer-un-hopital-a-laide-de-la-geothermie': 'henegouwen',
}

const EN_PROJECTS: Record<string, string> = {
  'anderlecht-novacity-ii': 'novacity-ii-anderlecht',
  'boitsfort-la-foresterie': 'la-foresterie-watermael-boitsfort',
  'jodoigne': 'belle-vallee-jodoigne',
  'megafactory-charleroi': 'megafactory-aerospacelab-charleroi',
  'suarlee': 'tour-controle-numerique-suarlee',
  'woluwe-saint-lambert-greenwood': 'bruxelles',
  'geothermie-a-la-haute-ecole-de-huy': 'liege',
  'installations-geothermiques-dans-un-chateau-a-gembloux': 'namur',
  'la-geothermie-a-lechelle-dun-quartier-chastre': 'brabant-wallon',
  'tournai-chauffer-un-hopital-a-laide-de-la-geothermie': 'hainaut',
}

const projectRedirects: Redirect[] = [
  ...Object.entries(FR_PROJECTS).map(([o, n]) => r(`/be-fr/project/${o}`, `${FR_REF}/${n}`)),
  ...Object.entries(NL_PROJECTS).map(([o, n]) => r(`/be-nl/project/${o}`, `${NL_REF}/${n}`)),
  ...Object.entries(EN_PROJECTS).map(([o, n]) => r(`/en/project/${o}`, `${EN_REF}/${n}`)),
  r('/be-fr/project/:path*', FR_REF),
  r('/be-nl/project/:path*', NL_REF),
  r('/en/project/:path*', EN_REF),

  r('/be-fr/project_category/geothermie-fermee', '/be-fr/geothermie/geothermie-fermee'),
  r('/be-fr/project_category/geothermie-ouverte-be-fr', '/be-fr/geothermie/geothermie-ouverte'),
  r('/be-fr/project_category/:prov(brabant-wallon|bruxelles|hainaut|liege|namur)', `${FR_REF}/:prov`),
  r('/be-fr/project_category/:path*', FR_REF),
  r('/be-nl/project_category/geothermie-fermee', '/be-nl/geothermische-energie/gesloten-geothermie'),
  r('/be-nl/project_category/geothermie-ouverte-be-nl', '/be-nl/geothermische-energie/open-geothermische-energie'),
  r('/be-nl/project_category/:prov(brussel|waals-brabant|henegouwen|luik|namen)', `${NL_REF}/:prov`),
  r('/be-nl/project_category/:path*', NL_REF),
  r('/en/project_category/geothermie-fermee', '/be-en/geothermal-energy/closed-loop'),
  r('/en/project_category/open-geothermal/:path*', '/be-en/geothermal-energy/open-loop'),
  r('/en/project_category/brussels', `${EN_REF}/bruxelles`),
  r('/en/project_category/walloon-brabant', `${EN_REF}/brabant-wallon`),
  r('/en/project_category/:prov(hainaut|liege|namur)', `${EN_REF}/:prov`),
  r('/en/project_category/:path*', EN_REF),
]

/* ─── Old blog articles ───────────────────────────────────────── */

// 36 WordPress articles are restored in Sanity (sanity-seed/blog-legacy)
// with `legacyPath`, so they are served again at their original URL
// /be-fr/<slug> — no redirect needed. Only the archive pages go.
// Safety net while a restored article is missing from Sanity (not imported
// yet, or deleted): the catch-all route sends its old URL to the closest
// topical page instead of a 404.
export const LEGACY_BLOG_FALLBACK: Record<string, string> = {
  // Rewritten in the new blog — not re-imported, to avoid duplicate content
  'focus-technique-la-hutte-205-gt-lexcellence-du-forage-geothermique-vertical': '/be-fr/blog/hutte-205-gt-forage-geothermique',
  'lapres-forage-pourquoi-le-dossier-as-built-et-le-reperage-georeference-sont-essentiels': '/be-fr/blog/apres-forage-dossier-as-built',
  // Published in March 2026, not in the Wayback index
  'limportance-cruciale-du-ciment-geothermique-dans-la-performance-de-votre-forage': '/be-fr/geothermie/geothermie-fermee',
  'forage-vertical-pourquoi-viser-150-metres-de-profondeur': '/be-fr/geothermie/geothermie-fermee',
  'le-role-du-ballon-tampon-le-gardien-de-votre-pompe-a-chaleur-geothermique': '/be-fr/particuliers',
  // Homeowner / cost / heat pump topics
  'chauffage-et-si-la-solution-la-plus-confortable-etait-sous-vos-pieds': '/be-fr/particuliers',
  'combien-coute-une-installation-geothermique-en-2025-le-guide-clair-et-complet': '/be-fr/particuliers',
  'comment-comparer-des-devis-de-foreur-pour-de-la-geothermie': '/be-fr/particuliers',
  'comment-fonctionne-une-pompe-a-chaleur-le-guide-simple-et-complet': '/be-fr/particuliers',
  'comparatif-financier-sur-25-ans-geothermie-vs-pompe-a-chaleur-air-eau': '/be-fr/particuliers',
  'forer-dans-des-espaces-reduits-la-geothermie-meme-sans-jardin': '/be-fr/particuliers',
  'geothermie-et-photovoltaique-le-duo-gagnant-pour-une-autonomie-energetique-totale': '/be-fr/particuliers',
  'independance-energetique-le-guide-pour-se-couper-du-gaz-dici-2027': '/be-fr/particuliers',
  'la-tva-a-6-sur-les-pompes-a-chaleur-et-les-forages-geothermiques-un-levier-pour-la-decarbonation': '/be-fr/particuliers',
  'optimiser-son-peb-en-belgique-pourquoi-la-geothermie-est-un-bon-levier': '/be-fr/particuliers',
  'remplacer-sa-chaudiere-gaz-et-si-cetait-le-moment-de-passer-a-la-geothermie': '/be-fr/particuliers',
  'sortie-du-gaz-et-du-mazout-pourquoi-la-geothermie-est-une-solution-perenne-face-aux-nouvelles-reglementations': '/be-fr/particuliers',
  'valorisation-immobiliere-combien-rapporte-la-geothermie-a-la-revente-de-votre-maison': '/be-fr/particuliers',
  // Professional / large-project topics
  'forages-geothermiques-sous-batiment-et-sous-parkings-souterrains': '/be-fr/pour-les-professionnels',
  'forer-en-ville-comment-welldonedrill-reussit-la-ou-dautres-reculent': '/be-fr/pour-les-professionnels',
  'gerer-les-deblais-et-la-proprete-du-chantier-en-environnement-urbain': '/be-fr/pour-les-professionnels',
  'la-geothermie-pour-les-coproprietes-performance-silence-et-economies-partagees': '/be-fr/pour-les-professionnels',
  'pourquoi-les-tests-de-reponse-thermique-trt-sont-essentiels-pour-les-grands-champs-de-sondes': '/be-fr/pour-les-professionnels',
  'raccordements-horizontaux-le-lien-entre-les-sondes-et-la-chaufferie': '/be-fr/pro/installateurs-hvac',
  'reussir-son-projet-de-geothermie-les-cles-du-succes': '/be-fr/pro/architectes-bureaux-etudes',
  // Geothermal technology topics
  'forage-deau-et-forage-geothermique-memes-machines-metiers-differents': '/be-fr/geothermie/geothermie-fermee',
  'forage-geothermique-2-0-10-ans-dinnovations-qui-changent-tout-sur-chantier': '/be-fr/geothermie/geothermie-fermee',
  'geothermie-et-biodiversite-pourquoi-le-forage-vertical-respecte-votre-terrain': '/be-fr/geothermie/geothermie-fermee',
  'glycol-et-sondes-geothermiques-quel-est-vraiment-le-risque-pour-lenvironnement': '/be-fr/geothermie/geothermie-fermee',
  'la-geothermie-sur-sondes-verticales-comment-ca-fonctionne': '/be-fr/geothermie/geothermie-fermee',
  'la-maintenance-dune-installation-geothermique-la-tranquillite-desprit-absolue': '/be-fr/geothermie/geothermie-fermee',
  'le-cycle-de-vie-de-la-geothermie-durabilite-et-recyclage-dun-systeme-concu-pour-un-siecle': '/be-fr/geothermie/geothermie-fermee',
  'les-techniques-de-forage-geothermique-air-boue-pdc-et-ce-qui-distingue-welldonedrill': '/be-fr/geothermie/geothermie-fermee',
  'le-geocooling-le-rafraichissement-gratuit-grace-a-la-geothermie': '/be-fr/geothermie',
  'geothermie-vs-climatisation-lutter-contre-les-ilots-de-chaleur-urbains': '/be-fr/geothermie',
  'la-geothermie-lenergie-renouvelable-et-competitive-qui-simpose-en-belgique': '/be-fr/geothermie',
  'quelques-idees-recues-sur-la-geothermie-et-ce-quil-y-a-derriere': '/be-fr/geothermie',
  'transformer-la-chaleur-du-sol-en-energie-geothermie': '/be-fr/geothermie',
}


const blogRedirects: Redirect[] = [
  r('/be-fr/categorie/:path*', '/be-fr/blog'),
  r('/be-fr/blog/page/:n', '/be-fr/blog'),
]

/* ─── Misc pages renamed in the redesign ─────────────────────── */

const pageRedirects: Redirect[] = [
  // be-fr
  r('/be-fr/references', FR_REF),
  r('/be-fr/references-avec-carte-interactive', FR_REF),
  r('/be-fr/politique-de-confidentialite', '/be-fr/politique-confidentialite'),
  r('/be-fr/:p(jobs|jobpost)/:path*', '/be-fr/a-propos'),
  // be-nl
  r('/be-nl/:base(referenties|referenties-2)/referenties-2', NL_REF),
  r('/be-nl/referenties-2', NL_REF),
  r('/be-nl/neem-contact-op-met', '/be-nl/contact'),
  r('/be-nl/:p(jobs|jobpost)/:path*', '/be-nl/over-ons'),

  // Older language-only prefixes (/nl, /de, /en, /lu) → country-locale routes
  r('/nl', '/be-nl'),
  r('/nl/:path*', '/be-nl/:path*'),

  r('/de', '/lu-de'),
  r('/de/geothermie', '/lu-de/geothermie'),
  r('/de/geothermie/offene-geothermie', '/lu-de/geothermie/offen'),
  r('/de/geothermie/geschlossene-geothermie', '/lu-de/geothermie/geschlossen'),
  r('/de/datenschutzerklarung', '/lu-de/datenschutz'),
  r('/de/:p(impressum|uber-uns|referenzen)', '/lu-de/:p'),
  r('/de/:path*', '/lu-de'),

  r('/lu', '/lu-fr'),
  r('/lu/:path*', '/lu-fr'),

  r('/en', '/be-en'),
  r('/en/about-us', '/be-en/about'),
  r('/en/contact', '/be-en/contact'),
  r('/en/geothermal', '/be-en/geothermal-energy'),
  r('/en/geothermal/closed-geothermal', '/be-en/geothermal-energy/closed-loop'),
  r('/en/geothermal/open-geothermal-energy', '/be-en/geothermal-energy/open-loop'),
  r('/en/privacy-policy', '/be-en/privacy-policy'),
  r('/en/terms-of-use', '/be-en/legal-notice'),
  r('/en/sectors', '/be-en/for-professionals'),
  r('/en/:base(references|references-2)', EN_REF),
  r('/en/:path*', '/be-en'),

  // Old un-prefixed URLs (otherwise a temporary 307 from the i18n middleware)
  r('/a-propos', '/be-fr/a-propos'),
  r('/about-us', '/be-en/about'),
  r('/:p(contact|contactus)', '/be-fr/contact'),
  r('/geothermie', '/be-fr/geothermie'),
  r('/geothermie/geothermie-fermee', '/be-fr/geothermie/geothermie-fermee'),
  r('/geothermie/geothermie-ouverte', '/be-fr/geothermie/geothermie-ouverte'),
  r('/geothermie-fermee', '/be-fr/geothermie/geothermie-fermee'),
  r('/geothermie-ouverte', '/be-fr/geothermie/geothermie-ouverte'),
  r('/pour-les-professionnels', '/be-fr/pour-les-professionnels'),
  r('/mentions-legales', '/be-fr/mentions-legales'),
  r('/politique-de-confidentialite', '/be-fr/politique-confidentialite'),
  r('/references', FR_REF),
  r('/project/:slug', '/be-fr/project/:slug'),
  r('/project', FR_REF),
  r('/project_category/:path*', FR_REF),
  r('/:p(jobs|jobpost)/:path*', '/be-fr/a-propos'),
]

export const LEGACY_REDIRECTS: Redirect[] = [
  ...provinceRedirects,
  ...projectRedirects,
  ...blogRedirects,
  ...pageRedirects,
]

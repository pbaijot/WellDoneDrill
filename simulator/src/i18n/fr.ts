
export const T = {
  // Navigation
  back: '← Retour',
  continue: 'Continuer →',
  skip: 'Passer cette etape',
  confirm: 'Confirmer',

  // Profile
  profileTitle: 'Qui etes-vous ?',
  profileIntro: 'Nous commençons par localiser votre projet et verifier automatiquement les contraintes reglementaires et le potentiel geothermique du sous-sol.',
  profilePart: 'Particulier',
  profilePartSub: 'Maison ou appartement',
  profilePro: 'Professionnel',
  profileProSub: 'Entreprise, bureau ou institution',
  profileStart: 'Commencer →',

  // Address
  addressTitle: 'Ou se situe votre projet ?',
  addressIntro: 'Nous verifions automatiquement les contraintes reglementaires et analysons le potentiel geothermique.',
  addressPlaceholder: 'Ex: Rue de la Loi 16, Namur',
  addressNoResult: 'Aucun resultat en Wallonie. Verifiez l adresse.',
  addressLabel: 'ADRESSE DU CHANTIER',

  // Map
  mapTitle: 'Votre chantier se situe ici ?',
  mapConfirm: 'Confirmer — analyser le sous-sol →',
  mapWrongAddress: 'Ce n est pas la bonne adresse',
  mapLoading: 'Chargement de la carte...',
  mapDiagTitle: 'Diagnostic reglementaire — cliquez pour afficher sur la carte',

  // Diagnostic checks
  checks: {
    captage: { label: 'Zone de prevention de captage', ok: 'Aucune restriction de captage detectee', ko: 'Zone de prevention — forage soumis a autorisation specifique' },
    pollution: { label: 'Pollution des sols (BDES)', ok: 'Aucune pollution recensee sur cette parcelle', ko: 'Parcelle recensee dans la BDES — verification recommandee avant forage' },
    karst: { label: 'Contraintes karstiques', ok: 'Hors perimetre de contrainte karstique', ko: 'Zone karstique detectee — etude geotechnique obligatoire' },
    natura: { label: 'Natura 2000', ok: 'Hors perimetre Natura 2000', ko: 'Zone Natura 2000 — evaluation des incidences requise' },
    inondations: { label: 'Zone inondable', ok: 'Parcelle hors zone inondable', ko: 'Zone inondable detectee — precautions specifiques requises' },
  },
  checkPending: 'Verification en cours...',

  // Geology
  geologyIntro: 'Contraintes administratives verifiees. Analysons maintenant les capacites thermiques du sous-sol sur 200 m de profondeur.',
  geologyPotentialTitle: 'Potentiel geothermique favorable',
  geologyPotentialText: 'Le sous-sol de cette zone presente un potentiel exploitable. La conductivite thermique estimee permet d envisager un systeme de sondes verticales performant.',
  geologyNote: 'Donnees indicatives basees sur la geologie regionale. Un test de reponse thermique (TRT) affine ces valeurs.',
  geologyConductivite: 'conductivite',
  geologyConfirm: 'Continuer vers le dimensionnement →',

  // Results
  resultDimensioning: 'Pre-dimensionnement indicatif',
  resultPuissance: 'Puissance PAC estimee',
  resultCOP: 'COP estime (rendement)',
  resultCOPSub: 'kWh produit / kWh consomme',
  resultSondes: 'Nombre de sondes',
  resultSondesSub: 'sondes de 100 m',
  resultProfondeur: 'Profondeur totale',
  resultProfondeurSub: 'forage vertical',
  resultPrix: 'Fourchette de prix forage seul HTVA',
  resultPrixSub: 'Hors pompe a chaleur et installation interieure',
  resultNote: 'Ces estimations sont indicatives. Un dimensionnement precis necessite une visite technique et une mesure in situ des proprietes thermiques du sol.',
  resultRecs: 'Recommandations',

  // Lead types
  leads: {
    geothermie: {
      badge: 'Projet geothermique — excellent candidat',
      title: 'La geothermie est la solution la plus adaptee a votre configuration.',
      text: 'Sur base de votre superficie, votre budget et votre calendrier, nos ingenieurs preparent une analyse detaillee. Delai de retour : 48h ouvrables.',
      cta: 'Obtenir mon devis precis →',
      recs: [
        'La geothermie sur sondes verticales offre le meilleur rendement pour votre configuration.',
        'Avec un chauffage au sol, vous beneficiez aussi du rafraichissement passif gratuit en ete.',
        'Les primes wallonnes (Renolution) peuvent couvrir jusqu a 30% du cout du forage.',
      ],
    },
    pac_air_eau: {
      badge: 'Solution PAC air/eau envisageable',
      title: 'Une PAC air/eau pourrait convenir a votre projet.',
      text: 'Selon votre configuration, la PAC air/eau est une option pertinente. Nous pouvons etablir une comparaison detaillee avec la solution geothermique.',
      cta: 'Parler a un expert →',
      recs: [
        'La PAC air/eau necessite moins d investissement initial mais des couts de fonctionnement plus eleves.',
        'La geothermie reste plus performante sur le long terme — une comparaison chiffree peut vous aider.',
      ],
    },
    conseiller: {
      badge: 'Analyse personnalisee recommandee',
      title: 'Votre projet merite un conseil personnalise.',
      text: 'Plusieurs options s offrent a vous. Un de nos ingenieurs vous contacte pour affiner le dimensionnement et vous orienter vers la meilleure solution.',
      cta: 'Parler a un expert →',
      recs: [
        'Un audit energetique rapide permettrait d affiner ce pre-dimensionnement.',
        'Nos ingenieurs peuvent vous conseiller sur le choix entre geothermie, PAC air/eau et solutions hybrides.',
      ],
    },
    peu_mature: {
      badge: 'Premiere orientation',
      title: 'Vous etes au debut de votre reflexion.',
      text: 'Nous vous envoyons un guide comparatif des solutions de chauffage avec les ordres de grandeur de couts et d economies.',
      cta: 'Recevoir le guide comparatif →',
      recs: [
        'Prenez le temps de definir votre budget et votre calendrier avant de vous engager.',
        'Un diagnostic energetique de votre logement est un bon point de depart.',
      ],
    },
  },

  // Graphs
  graphLoadTitle: 'Profil de charge annuel',
  graphLoadUnit: 'Puissance thermique mensuelle (kW)',
  graphHeating: 'Chauffage',
  graphDhw: 'ECS',
  graphCooling: 'Froid',
  graphGroundTitle: 'Temperature du sous-sol',
  graphGroundUnit: 'Temperature du sous-sol (°C)',
  graphGroundNoCooling: 'Sans refroidissement',
  graphGroundWithCooling: 'Avec refroidissement',
  graphChauffageMax: 'Chauffage max',
  graphFroidMax: 'Froid max',
  graphECS: 'ECS',
  graphImpactTitle: 'Impact du refroidissement sur le sous-sol',
  graphImpactTextWith: 'En ete, la geothermie reinjecte de la chaleur dans le sol via le circuit de refroidissement. Cela compense partiellement le refroidissement hivernal et ameliore les performances de la PAC sur le long terme.',
  graphImpactTextWithout: 'Sans refroidissement estival, le sol se refroidit progressivement. L ajout d un circuit de free cooling permet de recharger thermiquement le sol en ete et d ameliorer le COP hivernal.',

  // Summary
  summaryTitle: 'Recapitulatif de votre dossier',
  summaryS1: 'Localisation',
  summaryS2: 'Votre projet',
  summaryS3: 'Objectifs',
  summaryS4: 'Coordonnees',
  summaryProfile: 'Profil',
  summaryAddress: 'Adresse',
  summaryPart: 'Particulier',
  summaryPro: 'Professionnel',

  // Contact
  contactIntro: 'Nous vous envoyons une synthese personnalisee avec les premieres recommandations. Aucun demarchage sans votre accord.',
  contactTitle: 'Vos coordonnees',
  contactPrenom: 'Prenom',
  contactNom: 'Nom',
  contactEmail: 'Email',
  contactTel: 'Telephone',
  contactCP: 'Code postal',
  contactCommune: 'Commune',
  contactSubmit: 'Recevoir mon analyse →',
  contactRequired: 'Requis',
  contactInvalidEmail: 'Email invalide',

  // Phone
  phone: 'Parler a un expert : +32 494 14 24 49',
  phoneHref: 'tel:+32494142449',

  // Months
  months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const

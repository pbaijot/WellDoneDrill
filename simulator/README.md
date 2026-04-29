# WDD Simulator

Outil de simulation de faisabilite geothermique — standalone et embeddable.

## Standalone (dev)

cd simulator
npm install
npm run dev

## Integration dans le site Next.js

Le composant principal est src/Simulator.tsx.
Il n'a aucune dependance Next.js — importe-le directement :

import Simulator from '@/simulator/src/Simulator'

<Simulator
  devisUrl={getLocalizedPath(locale, 'devis')}
  soumissionUrl={getLocalizedPath(locale, 'pro_soumission')}
/>

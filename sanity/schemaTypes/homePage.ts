import {defineType} from 'sanity'
const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']
      },
      validation: (Rule: any) => Rule.required()
    },

    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        { name: 'ctaLabel', title: 'CTA principal (bouton jaune)', type: 'string' },
        { name: 'secondaryLabel', title: 'CTA secondaire (lien blanc)', type: 'string' },
        { name: 'image', title: 'Image hero', type: 'image', options: { hotspot: true } }
      ]
    },

    {
      name: 'advantages',
      title: 'Avantages',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot en évidence (accroche)', type: 'string' },
        { name: 'introText', title: 'Texte intro', type: 'text', rows: 3 },
        { name: 'video', title: 'Vidéo de fond (MP4)', type: 'file', options: { accept: 'video/mp4,video/webm' } },
        {
          name: 'items',
          title: 'Cartes (3 avantages)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'number', title: 'Numéro', type: 'string' },
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 }
              ]
            }
          ]
        }
      ]
    },

    {
      name: 'audiences',
      title: 'Particuliers / Professionnels',
      type: 'object',
      fields: [
        {
          name: 'particular',
          title: 'Particuliers',
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'buttonLabel', title: 'Bouton', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
          ]
        },
        {
          name: 'professional',
          title: 'Professionnels',
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'buttonLabel', title: 'Bouton', type: 'string' },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    },

    {
      name: 'services',
      title: 'Section "La géothermie"',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre (partie normale)', type: 'string' },
        { name: 'highlight', title: 'Titre (partie colorée)', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre / intro', type: 'text', rows: 3 },
        {
          name: 'items',
          title: 'Cartes (géothermie fermée / ouverte)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Titre de la carte', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 },
                { name: 'ctaLabel', title: 'Texte du bouton', type: 'string' },
                { name: 'routeKey', title: 'Route key (ex: geo_fermee)', type: 'string' },
                { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
              ]
            }
          ]
        }
      ]
    },

    {
      name: 'contactCta',
      title: 'Section Contact CTA',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        { name: 'buttonLabel', title: 'Bouton', type: 'string' },
        { name: 'phone', title: 'Téléphone', type: 'string' },
        { name: 'image', title: 'Image équipe', type: 'image', options: { hotspot: true } },
        { name: 'stat1Value', title: 'Stat 1 — valeur', type: 'string' },
        { name: 'stat1Label', title: 'Stat 1 — label', type: 'string' },
        { name: 'stat2Value', title: 'Stat 2 — valeur', type: 'string' },
        { name: 'stat2Label', title: 'Stat 2 — label', type: 'string' }
      ]
    },

    {
      name: 'faqs',
      title: 'FAQ',
      type: 'object',
      fields: [
        {name: 'title', title: 'Titre', type: 'string'},
        {
          name: 'items',
          title: 'Questions',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {name: 'question', title: 'Question', type: 'string'},
              {name: 'answer', title: 'Réponse', type: 'text', rows: 4},
            ],
          }],
        },
      ],
    },

    {
      name: 'partners',
      title: 'Partenaires (logos défilants)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre de section (ex. "Ils nous font confiance")',
          type: 'string',
          description: 'Optionnel — laisser vide pour ne pas afficher de titre'
        },
        {
          name: 'logos',
          title: 'Logos',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'name', title: 'Nom du partenaire', type: 'string' },
              { name: 'logo', title: 'Logo (PNG ou SVG transparent recommandé)', type: 'image', options: { hotspot: false } },
              { name: 'url', title: 'Lien vers le site (optionnel)', type: 'url' }
            ],
            preview: {
              select: { title: 'name', media: 'logo' },
              prepare: ({ title, media }: {title?: string; media?: unknown}) => ({ title: title ?? 'Partenaire', media: media as any })
            }
          }]
        }
      ]
    },

    {
      name: 'blog',
      title: 'Bloc blog',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot en évidence', type: 'string' },
        { name: 'readMoreLabel', title: 'Label "lire plus"', type: 'string' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'locale'
    },
    prepare({title}: {title?: string}) {
      return {
        title: title ? `Homepage – ${title}` : 'Homepage'
      }
    }
  }
})

export default homePage

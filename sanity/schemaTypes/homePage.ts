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
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        { name: 'ctaLabel', title: 'CTA principal', type: 'string' },
        { name: 'secondaryLabel', title: 'CTA secondaire', type: 'string' },
        { name: 'image', title: 'Image hero', type: 'image', options: { hotspot: true } }
      ]
    },

    {
      name: 'advantages',
      title: 'Avantages',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        { name: 'introText', title: 'Texte intro', type: 'text', rows: 3 },
        { name: 'videoUrl', title: 'URL vidéo', type: 'string' },
        {
          name: 'items',
          title: 'Cartes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'number', title: 'Numéro', type: 'string' },
                { name: 'icon', title: 'Icône texte', type: 'string' },
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 }
              ]
            }
          ]
        },
        { name: 'calculatorTitle', title: 'Titre calculateur', type: 'string' },
        { name: 'calculatorSubtitle', title: 'Sous-titre calculateur', type: 'string' }
      ]
    },

    {
      name: 'audiences',
      title: 'Particuliers / professionnels',
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
      title: 'Services (Géothermie)',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        {
          name: 'items',
          title: 'Services',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'badge', title: 'Badge', type: 'string' },
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 },
                { name: 'routeKey', title: 'Route key', type: 'string' },
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
      name: 'blog',
      title: 'Bloc blog',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        { name: 'readMoreLabel', title: 'Label lire plus', type: 'string' },
        {
          name: 'posts',
          title: 'Posts affichés',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'date', title: 'Date', type: 'string' },
                { name: 'excerpt', title: 'Extrait', type: 'text', rows: 3 },
                { name: 'tone', title: 'Classe couleur', type: 'string' }
              ]
            }
          ]
        }
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

import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const particuliersPage = defineType({
  name: 'particuliersPage',
  title: 'Page Particuliers (B2C)',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (r) => r.required(),
    }),

    defineField({name: 'heroTitle', title: 'Hero — titre', type: 'string'}),
    defineField({name: 'heroSubtitle', title: 'Hero — sous-titre', type: 'text', rows: 3}),
    defineField({name: 'heroCtaDevisLabel', title: 'Hero — CTA devis', type: 'string'}),
    defineField({name: 'heroCtaCalculLabel', title: 'Hero — CTA calculateur', type: 'string'}),
    defineField({name: 'heroLeftBgImage', title: 'Hero — image fond gauche', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroRightImage', title: 'Hero — image droite', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'heroPanelItems',
      title: 'Hero — panneau flottant (3 items)',
      type: 'array',
      of: [defineField({
        name: 'panel', type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({name: 'value', title: 'Valeur', type: 'string'}),
          defineField({name: 'sub', title: 'Sous-texte', type: 'string'}),
        ],
      })],
      validation: (r) => r.max(3),
    }),

    defineField({name: 'contextImage', title: 'Contexte — image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'contextVideo',
      title: 'Contexte — vidéo (remplace l\'image si présente)',
      type: 'file',
      options: {accept: 'video/*'},
    }),

    defineField({
      name: 'stats',
      title: 'Chiffres clés (3 max)',
      type: 'array',
      of: [
        defineField({
          name: 'stat',
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Valeur', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
        }),
      ],
      validation: (r) => r.max(3),
    }),

    defineField({name: 'whyTitle', title: 'Pourquoi — titre', type: 'string'}),
    defineField({name: 'whyIntro', title: 'Pourquoi — intro', type: 'text', rows: 4}),
    defineField({
      name: 'whyItems',
      title: 'Pourquoi — avantages',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'problemTitle', title: 'Problème — titre', type: 'string'}),
    defineField({name: 'problemBody', title: 'Problème — texte (framing du problème énergétique)', type: 'text', rows: 4}),

    defineField({name: 'faqTitle', title: 'FAQ — titre', type: 'string'}),
    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        defineField({
          name: 'faq',
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Réponse', type: 'text', rows: 4}),
          ],
        }),
      ],
    }),

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {locale: 'locale'},
    prepare({locale}) {
      return {title: 'Particuliers (B2C)', subtitle: locale}
    },
  },
})

export default particuliersPage

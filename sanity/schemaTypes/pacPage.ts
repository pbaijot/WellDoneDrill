import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const pacPage = defineType({
  name: 'pacPage',
  title: 'Page Pompes à chaleur',
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
    defineField({name: 'heroCtaLabel', title: 'Hero — CTA', type: 'string'}),

    defineField({name: 'fonctTitle', title: 'Fonctionnement — titre', type: 'string'}),
    defineField({name: 'fonctIntro', title: 'Fonctionnement — intro', type: 'text', rows: 4}),
    defineField({
      name: 'fonctSteps',
      title: 'Fonctionnement — étapes',
      type: 'array',
      of: [defineField({name: 'step', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'chauffageTitle', title: 'Chauffage — titre', type: 'string'}),
    defineField({name: 'chauffageIntro', title: 'Chauffage — intro', type: 'text', rows: 4}),
    defineField({
      name: 'chauffageItems',
      title: 'Chauffage — points clés',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'climaTitle', title: 'Climatisation — titre', type: 'string'}),
    defineField({name: 'climaIntro', title: 'Climatisation — intro', type: 'text', rows: 4}),
    defineField({
      name: 'climaItems',
      title: 'Climatisation — points clés',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'avantagesTitle', title: 'Avantages — titre', type: 'string'}),
    defineField({name: 'avantagesIntro', title: 'Avantages — intro', type: 'text', rows: 4}),
    defineField({
      name: 'avantagesItems',
      title: 'Avantages — liste',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

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

    defineField({name: 'ctaTitle', title: 'CTA final — titre', type: 'string'}),
    defineField({name: 'ctaLabel', title: 'CTA final — label', type: 'string'}),

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {locale: 'locale'},
    prepare({locale}) {
      return {title: 'Pompes à chaleur', subtitle: locale}
    },
  },
})

export default pacPage

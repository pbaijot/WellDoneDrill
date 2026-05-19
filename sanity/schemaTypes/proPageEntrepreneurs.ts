import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const proPageEntrepreneurs = defineType({
  name: 'proPageEntrepreneurs',
  title: 'Page Pro — Promoteurs & Entrepreneurs',
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
    defineField({name: 'heroCtaLabel', title: 'Hero — CTA label', type: 'string'}),

    defineField({name: 'contextTitle', title: 'Valeur ajoutée — titre', type: 'string'}),
    defineField({name: 'contextBody', title: 'Valeur ajoutée — texte', type: 'text', rows: 4}),

    defineField({name: 'whyTitle', title: 'Six raisons — titre', type: 'string'}),
    defineField({
      name: 'whyItems',
      title: 'Six raisons — items',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'etapesTitle', title: 'Processus — titre', type: 'string'}),
    defineField({name: 'etapesIntro', title: 'Processus — intro', type: 'text', rows: 3}),
    defineField({
      name: 'etapes',
      title: 'Processus — étapes',
      type: 'array',
      of: [defineField({name: 'etape', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'roiTitle', title: 'ROI — titre', type: 'string'}),
    defineField({name: 'roiIntro', title: 'ROI — intro', type: 'text', rows: 3}),

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
      return {title: 'Pro — Promoteurs & Entrepreneurs', subtitle: locale}
    },
  },
})

export default proPageEntrepreneurs

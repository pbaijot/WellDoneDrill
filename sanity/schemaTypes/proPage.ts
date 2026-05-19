import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const proPage = defineType({
  name: 'proPage',
  title: 'Page Professionnels',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'routeKey',
      title: 'Segment',
      type: 'string',
      options: {
        list: [
          {title: 'Chauffagistes', value: 'pro_chauffagistes'},
          {title: 'Architectes', value: 'pro_architectes'},
          {title: 'Entrepreneurs', value: 'pro_entrepreneurs'},
        ],
      },
      validation: (r) => r.required(),
    }),

    defineField({name: 'heroEyebrow', title: 'Hero — eyebrow', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero — titre', type: 'string'}),
    defineField({name: 'heroSubtitle', title: 'Hero — sous-titre', type: 'text', rows: 3}),
    defineField({name: 'heroCtaLabel', title: 'Hero — CTA', type: 'string'}),

    defineField({name: 'valueTitle', title: 'Contexte — titre', type: 'string'}),
    defineField({name: 'valueIntro', title: 'Contexte — texte', type: 'text', rows: 4}),

    defineField({name: 'whyTitle', title: 'Six raisons — titre', type: 'string'}),
    defineField({
      name: 'valueItems',
      title: 'Six raisons — items',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'partnershipTitle', title: 'Étapes — titre', type: 'string'}),
    defineField({name: 'partnershipIntro', title: 'Étapes — intro', type: 'text', rows: 3}),
    defineField({
      name: 'partnershipSteps',
      title: 'Étapes — items',
      type: 'array',
      of: [defineField({name: 'step', type: 'object', fields: itemFields})],
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

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {routeKey: 'routeKey', locale: 'locale'},
    prepare({routeKey, locale}) {
      const labels: Record<string, string> = {
        pro_chauffagistes: 'Chauffagistes',
        pro_architectes: 'Architectes',
        pro_entrepreneurs: 'Entrepreneurs',
      }
      return {title: labels[routeKey] || routeKey, subtitle: locale}
    },
  },
})

export default proPage

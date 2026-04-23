import {defineField, defineType} from 'sanity'

const routeKeys = [
  'devis',
  'references',
  'calculateur',
  'pac_fonctionnement',
  'pac_chauffage',
  'pac_climatisation',
  'pac_avantages',
  'geo_fermee',
  'geo_ouverte',
  'geo_fonctionnement',
  'particuliers_etapes',
  'particuliers_installateurs',
  'pro_chauffagistes',
  'pro_architectes',
  'pro_entrepreneurs',
  'pro_soumission',
  'a_propos',
  'mentions_legales',
  'politique_confidentialite',
  'cookies',
]

const sitePage = defineType({
  name: 'sitePage',
  title: 'Page éditoriale',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routeKey',
      title: 'Route key',
      type: 'string',
      options: {
        list: routeKeys,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero title', type: 'string'}),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 4}),
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({name: 'body', title: 'Contenu', type: 'text', rows: 6}),
            defineField({
              name: 'items',
              title: 'Liste',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        }),
      ],
    }),
    defineField({name: 'faqTitle', title: 'Titre FAQ', type: 'string'}),
    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        defineField({
          name: 'faq',
          title: 'FAQ',
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Réponse', type: 'text', rows: 4}),
          ],
        }),
      ],
    }),
    defineField({name: 'ctaPretitle', title: 'CTA pretitle', type: 'string'}),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string'}),
    defineField({name: 'ctaText', title: 'CTA text', type: 'text', rows: 4}),
    defineField({name: 'ctaLabel', title: 'CTA label', type: 'string'}),
    defineField({
      name: 'ctaRouteKey',
      title: 'CTA route key',
      type: 'string',
      options: {
        list: routeKeys.filter((key) => !['mentions_legales', 'politique_confidentialite', 'cookies'].includes(key)),
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      locale: 'locale',
      routeKey: 'routeKey',
    },
    prepare({title, locale, routeKey}) {
      return {
        title: title || routeKey,
        subtitle: `${locale || ''} • ${routeKey || ''}`,
      }
    },
  },
})

export default sitePage

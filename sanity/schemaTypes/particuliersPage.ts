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

    defineField({name: 'primesTitle', title: 'Primes — titre', type: 'string'}),
    defineField({name: 'primesIntro', title: 'Primes — intro', type: 'text', rows: 3}),
    defineField({
      name: 'primesItems',
      title: 'Primes — par région',
      type: 'array',
      of: [
        defineField({
          name: 'prime',
          type: 'object',
          fields: [
            defineField({name: 'region', title: 'Région / Programme', type: 'string'}),
            defineField({name: 'title', title: 'Montant / titre', type: 'string'}),
            defineField({name: 'body', title: 'Description', type: 'text', rows: 2}),
          ],
        }),
      ],
    }),

    defineField({name: 'calculTitle', title: 'Calculateur — titre', type: 'string'}),
    defineField({name: 'calculIntro', title: 'Calculateur — intro', type: 'text', rows: 3}),

    defineField({name: 'etapesTitle', title: 'Étapes — titre', type: 'string'}),
    defineField({name: 'etapesIntro', title: 'Étapes — intro', type: 'text', rows: 3}),
    defineField({
      name: 'etapes',
      title: 'Étapes projet',
      type: 'array',
      of: [defineField({name: 'etape', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'installateurTitle', title: 'Installateurs — titre', type: 'string'}),
    defineField({name: 'installateurBody', title: 'Installateurs — texte', type: 'text', rows: 4}),

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
      return {title: 'Particuliers (B2C)', subtitle: locale}
    },
  },
})

export default particuliersPage

import {defineField, defineType} from 'sanity'

const geoPage = defineType({
  name: 'geoPage',
  title: 'Page géothermie',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'routeKey',
      title: 'Route key',
      type: 'string',
      options: {list: ['geo_fermee', 'geo_ouverte']},
      validation: (rule) => rule.required(),
    }),

    defineField({name: 'heroLine1', title: 'Hero ligne 1', type: 'string'}),
    defineField({name: 'heroLine2', title: 'Hero ligne 2', type: 'string'}),
    defineField({name: 'heroLine3', title: 'Hero ligne 3', type: 'string'}),
    defineField({name: 'heroSubtitle', title: 'Hero sous-titre', type: 'text', rows: 4}),
    defineField({name: 'heroCtaLabel', title: 'Hero CTA', type: 'string'}),

    defineField({name: 'introTitle', title: 'Titre intro', type: 'string'}),
    defineField({name: 'introBody1', title: 'Texte intro 1', type: 'text', rows: 5}),
    defineField({name: 'introBody2', title: 'Texte intro 2', type: 'text', rows: 5}),
    defineField({name: 'introCtaLabel', title: 'CTA intro', type: 'string'}),

    defineField({name: 'howTitle', title: 'Titre fonctionnement', type: 'string'}),
    defineField({name: 'howIntro', title: 'Intro fonctionnement', type: 'text', rows: 4}),
    defineField({
      name: 'howSteps',
      title: 'Étapes de fonctionnement',
      type: 'array',
      of: [
        defineField({
          name: 'step',
          title: 'Étape',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({name: 'body', title: 'Texte', type: 'text', rows: 4}),
          ],
        }),
      ],
    }),
    defineField({name: 'howCtaLabel', title: 'CTA fonctionnement', type: 'string'}),

    defineField({name: 'projectTitle', title: 'Titre projet', type: 'string'}),
    defineField({
      name: 'projectSteps',
      title: 'Étapes projet',
      type: 'array',
      of: [
        defineField({
          name: 'projectStep',
          title: 'Étape projet',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({name: 'body', title: 'Texte', type: 'text', rows: 5}),
          ],
        }),
      ],
    }),
    defineField({name: 'projectCtaLabel', title: 'CTA projet', type: 'string'}),

    defineField({name: 'faqIntroTitle', title: 'Titre bloc pédagogique', type: 'string'}),
    defineField({name: 'faqIntroBody', title: 'Texte bloc pédagogique', type: 'text', rows: 5}),
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
            defineField({name: 'answer', title: 'Réponse', type: 'text', rows: 5}),
          ],
        }),
      ],
    }),

    defineField({name: 'finalCtaTitle', title: 'Titre CTA final', type: 'string'}),
    defineField({name: 'finalCtaLabel', title: 'Label CTA final', type: 'string'}),

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {
      routeKey: 'routeKey',
      locale: 'locale',
    },
    prepare({routeKey, locale}) {
      return {
        title: routeKey || 'geoPage',
        subtitle: locale || '',
      }
    },
  },
})

export default geoPage

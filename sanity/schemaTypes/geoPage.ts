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
    defineField({name: 'heroCtaLabel', title: 'Hero CTA (bouton jaune)', type: 'string'}),
    defineField({name: 'heroSecondaryLabel', title: 'Hero CTA secondaire (lien blanc)', type: 'string'}),
    defineField({name: 'introTitle', title: 'Titre intro', type: 'string'}),
    defineField({name: 'introBody1', title: 'Texte intro 1', type: 'text', rows: 5}),
    defineField({name: 'introBody2', title: 'Texte intro 2', type: 'text', rows: 5}),
    defineField({name: 'introCtaLabel', title: 'Intro — bouton CTA', type: 'string'}),

    defineField({name: 'howTitle', title: 'Titre fonctionnement', type: 'string'}),
    defineField({name: 'howBody', title: 'Fonctionnement — explication technique (sous le schéma SVG)', type: 'text', rows: 6}),
    defineField({name: 'howCtaLabel', title: 'Fonctionnement — texte bouton CTA', type: 'string'}),
    defineField({name: 'advantagesTitle', title: 'Titre section avantages', type: 'string'}),
    defineField({name: 'advantagesCtaLabel', title: 'Avantages — bouton CTA', type: 'string'}),
    defineField({name: 'faqTitle', title: 'Titre FAQ', type: 'string'}),
    defineField({name: 'faqSubtitle', title: 'FAQ — sous-titre (question complémentaire)', type: 'string'}),
    defineField({name: 'faqCtaLabel', title: 'FAQ — bouton contact', type: 'string'}),

    defineField({name: 'particularEyebrow', title: 'Audience particuliers — eyebrow', type: 'string'}),
    defineField({name: 'particularTitle',   title: 'Audience particuliers — titre',   type: 'string'}),
    defineField({name: 'particularBody',    title: 'Audience particuliers — texte',   type: 'text', rows: 3}),
    defineField({name: 'particularCta',     title: 'Audience particuliers — CTA',     type: 'string'}),

    defineField({name: 'proEyebrow', title: 'Audience pro — eyebrow', type: 'string'}),
    defineField({name: 'proTitle',   title: 'Audience pro — titre',   type: 'string'}),
    defineField({name: 'proBody',    title: 'Audience pro — texte',   type: 'text', rows: 3}),
    defineField({name: 'proCta',     title: 'Audience pro — CTA',     type: 'string'}),
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

    defineField({name: 'heroLeftBgImage', title: 'Hero — image fond gauche', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroRightImage', title: 'Hero — image droite', type: 'image', options: {hotspot: true}}),
    defineField({name: 'introImage', title: 'Intro — image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'howIllustration', title: 'Fonctionnement — illustration', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'advantages',
      title: 'Avantages (8 max)',
      type: 'array',
      of: [
        defineField({
          name: 'advantage',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
          ],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({name: 'particularImage', title: 'Audience particuliers — image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'proImage', title: 'Audience pro — image', type: 'image', options: {hotspot: true}}),

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

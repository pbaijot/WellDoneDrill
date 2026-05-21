import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const proPage = defineType({
  name: 'proPage',
  title: 'Page Professionnels',
  type: 'document',
  groups: [
    {name: 'meta', title: 'Identification'},
    {name: 'hero', title: 'Hero'},
    {name: 'context', title: 'Contexte'},
    {name: 'why', title: 'Six raisons'},
    {name: 'partnership', title: 'Partenariat / Étapes'},
    {name: 'faq', title: 'FAQ'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── IDENTIFICATION ────────────────────────────────────────
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (r) => r.required(),
      group: 'meta',
    }),
    defineField({
      name: 'routeKey',
      title: 'Segment',
      type: 'string',
      options: {
        list: [
          {title: 'Chauffagistes', value: 'pro_chauffagistes'},
          {title: 'Architectes', value: 'pro_architectes'},
          {title: 'Entrepreneurs / Promoteurs', value: 'pro_entrepreneurs'},
        ],
      },
      validation: (r) => r.required(),
      group: 'meta',
    }),

    // ── HERO ──────────────────────────────────────────────────
    defineField({name: 'heroEyebrow', title: 'Hero — eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroTitle', title: 'Hero — titre', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubtitle', title: 'Hero — sous-titre', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroCtaLabel', title: 'Hero — CTA principal', type: 'string', group: 'hero'}),
    defineField({name: 'heroCtaSecondary', title: 'Hero — CTA secondaire', type: 'string', group: 'hero'}),
    defineField({name: 'heroRightImage', title: 'Hero — image droite', type: 'image', options: {hotspot: true}, group: 'hero'}),
    defineField({
      name: 'heroPanelItems',
      title: 'Hero — panneau flottant (3 stats)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'label', title: 'Label', type: 'string'},
          {name: 'value', title: 'Valeur', type: 'string'},
          {name: 'sub', title: 'Sous-texte', type: 'string'},
        ],
      }],
      validation: (r) => r.max(3),
      group: 'hero',
    }),

    // ── CONTEXTE ──────────────────────────────────────────────
    defineField({name: 'valueTitle', title: 'Contexte — titre', type: 'string', group: 'context'}),
    defineField({name: 'valueIntro', title: 'Contexte — texte', type: 'text', rows: 4, group: 'context'}),
    defineField({name: 'contextImage', title: 'Contexte — image', type: 'image', options: {hotspot: true}, group: 'context'}),
    defineField({
      name: 'contextVideo',
      title: 'Contexte — vidéo (remplace l\'image si présente)',
      type: 'file',
      options: {accept: 'video/*'},
      group: 'context',
    }),
    defineField({
      name: 'schemeNodes',
      title: 'Contexte — schéma animé (3 étapes)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'label', title: 'Titre', type: 'string'},
          {name: 'sub', title: 'Sous-titre', type: 'string'},
          {name: 'stat', title: 'Statistique', type: 'string'},
        ],
      }],
      validation: (r) => r.max(3),
      group: 'context',
    }),

    // ── SIX RAISONS ───────────────────────────────────────────
    defineField({name: 'whyTitle', title: 'Six raisons — titre', type: 'string', group: 'why'}),
    defineField({
      name: 'valueItems',
      title: 'Six raisons — items (6 max)',
      type: 'array',
      of: [{type: 'object', fields: itemFields}],
      validation: (r) => r.max(6),
      group: 'why',
    }),
    defineField({name: 'whyCtaLabel', title: 'Six raisons — CTA', type: 'string', group: 'why'}),

    // ── PARTENARIAT / ÉTAPES ──────────────────────────────────
    defineField({name: 'partnershipTitle', title: 'Partenariat — titre', type: 'string', group: 'partnership'}),
    defineField({name: 'partnershipIntro', title: 'Partenariat — intro', type: 'text', rows: 3, group: 'partnership'}),
    defineField({
      name: 'partnershipSteps',
      title: 'Partenariat — étapes',
      type: 'array',
      of: [{type: 'object', fields: itemFields}],
      group: 'partnership',
    }),

    // ── FAQ ───────────────────────────────────────────────────
    defineField({name: 'faqTitle', title: 'FAQ — titre', type: 'string', group: 'faq'}),
    defineField({name: 'faqSubtitle', title: 'FAQ — sous-titre', type: 'string', group: 'faq'}),
    defineField({name: 'faqCtaLabel', title: 'FAQ — CTA', type: 'string', group: 'faq'}),
    defineField({
      name: 'faqs',
      title: 'FAQ — questions/réponses',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'question', title: 'Question', type: 'string'},
          {name: 'answer', title: 'Réponse', type: 'text', rows: 4},
        ],
      }],
      group: 'faq',
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo'}),
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

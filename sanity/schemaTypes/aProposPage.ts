import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const aProposPage = defineType({
  name: 'aProposPage',
  title: 'Page À propos',
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
    defineField({name: 'heroImage', title: 'Hero — image', type: 'image', options: {hotspot: true}}),

    defineField({name: 'missionTitle', title: 'Mission — titre', type: 'string'}),
    defineField({name: 'missionBody1', title: 'Mission — §1', type: 'text', rows: 4}),
    defineField({name: 'missionBody2', title: 'Mission — §2', type: 'text', rows: 4}),
    defineField({name: 'missionBody3', title: 'Mission — §3', type: 'text', rows: 4}),
    defineField({name: 'missionImage', title: 'Mission — image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'missionVideoUrl', title: 'Mission — URL vidéo', type: 'string'}),
    defineField({
      name: 'galleryImages',
      title: 'Galerie — images (8 max)',
      type: 'array',
      of: [defineField({name: 'galleryImage', type: 'image', options: {hotspot: true}})],
      validation: (r) => r.max(8),
    }),

    defineField({name: 'valuesTitle', title: 'Valeurs — titre section', type: 'string'}),
    defineField({
      name: 'values',
      title: 'Valeurs — items',
      type: 'array',
      of: [defineField({name: 'value', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'whyTitle', title: 'Pourquoi nous — titre', type: 'string'}),
    defineField({
      name: 'whyItems',
      title: 'Pourquoi nous — items',
      type: 'array',
      of: [defineField({name: 'item', type: 'object', fields: itemFields})],
    }),

    defineField({name: 'partnershipTitle', title: 'Partenariats — titre', type: 'string'}),
    defineField({name: 'partnershipBody', title: 'Partenariats — texte', type: 'text', rows: 4}),
    defineField({name: 'partnershipCta1', title: 'Partenariats — CTA principal', type: 'string'}),
    defineField({name: 'partnershipCta2', title: 'Partenariats — CTA secondaire', type: 'string'}),

    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'address', title: 'Adresse', type: 'string'}),
    defineField({name: 'contactCtaLabel', title: 'Contact — CTA', type: 'string'}),

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {locale: 'locale'},
    prepare({locale}) {
      return {title: 'À propos', subtitle: locale}
    },
  },
})

export default aProposPage

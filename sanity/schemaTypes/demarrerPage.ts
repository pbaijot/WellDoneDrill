import {defineField, defineType} from 'sanity'

const demarrerPage = defineType({
  name: 'demarrerPage',
  title: 'Page Démarrer',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (r) => r.required(),
    }),

    defineField({name: 'heroEyebrow', title: 'Hero — eyebrow', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero — titre', type: 'string'}),
    defineField({name: 'heroSubtitle', title: 'Hero — sous-titre', type: 'text', rows: 3}),

    defineField({name: 'formHeading', title: 'Formulaire — titre profil', type: 'string'}),

    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),

    defineField({name: 'successTitle', title: 'Confirmation — titre', type: 'string'}),
    defineField({name: 'successBody', title: 'Confirmation — texte', type: 'text', rows: 3}),

    defineField({name: 'heroImage', title: 'Hero — image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'teamImage', title: 'Photo équipe', type: 'image', options: {hotspot: true}}),
    defineField({name: 'teamCaption', title: "Photo équipe — légende", type: 'string'}),
    defineField({name: 'teamLabel', title: "Photo équipe — label", type: 'string'}),

    defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3}),
  ],
  preview: {
    select: {locale: 'locale'},
    prepare({locale}) {
      return {title: 'Démarrer', subtitle: locale}
    },
  },
})

export default demarrerPage

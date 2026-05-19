import {defineField, defineType} from 'sanity'

const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Paramètres globaux',
  type: 'document',
  fields: [
    defineField({name: 'phone', title: 'Téléphone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'ctaTitle', title: 'CTA — titre', type: 'string'}),
    defineField({name: 'ctaBody', title: 'CTA — texte', type: 'text', rows: 3}),
    defineField({name: 'ctaButtonLabel', title: 'CTA — label bouton', type: 'string'}),
    defineField({name: 'ctaImage', title: 'CTA — image équipe', type: 'image', options: {hotspot: true}}),
    defineField({name: 'stat1Value', title: 'Stat 1 — valeur', type: 'string'}),
    defineField({name: 'stat1Label', title: 'Stat 1 — label', type: 'string'}),
    defineField({name: 'stat2Value', title: 'Stat 2 — valeur', type: 'string'}),
    defineField({name: 'stat2Label', title: 'Stat 2 — label', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Paramètres globaux'}
    },
  },
})

export default globalSettings

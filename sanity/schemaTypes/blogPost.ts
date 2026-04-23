import {defineType} from 'sanity'
const blogPost = defineType({
  name: 'blogPost',
  title: 'Article de blog',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },

    {
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title' }
    },

    { name: 'publishedAt', title: 'Date de publication', type: 'datetime' },

    {
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3
    },

    {
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Texte alternatif', type: 'string' }
      ]
    },

    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          {title: 'Géothermie', value: 'geothermie'},
          {title: 'Pompes à chaleur', value: 'pac'},
          {title: 'Réglementation', value: 'reglementation'},
          {title: 'Chantier', value: 'chantier'}
        ]
      }
    },

    {
      name: 'locale',
      title: 'Langue',
      type: 'string',
      options: {
        list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']
      }
    },

    {
      name: 'author',
      title: 'Auteur',
      type: 'string',
      initialValue: 'WellDoneDrill'
    },

    {
      name: 'readingTime',
      title: 'Temps de lecture',
      type: 'number',
      description: 'En minutes'
    },

    {
      name: 'featured',
      title: 'Mettre en avant',
      type: 'boolean',
      initialValue: false
    },

    {
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      of: [{ type: 'block' }]
    },

    {
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }]
    },

    {
      name: 'ctaTitle',
      title: 'Titre CTA final',
      type: 'string'
    },

    {
      name: 'ctaText',
      title: 'Texte CTA final',
      type: 'text',
      rows: 3
    },

    {
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string'
    },

    {
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'locale',
      media: 'mainImage'
    }
  }
}

)
export default blogPost

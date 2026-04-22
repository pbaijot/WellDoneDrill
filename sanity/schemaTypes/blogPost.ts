export default {
  name: 'blogPost',
  title: 'Article de blog',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'slug', title: 'URL', type: 'slug', options: { source: 'title' } },
    { name: 'publishedAt', title: 'Date de publication', type: 'datetime' },
    { name: 'excerpt', title: 'Resume', type: 'text', rows: 3 },
    { name: 'mainImage', title: 'Image principale', type: 'image', options: { hotspot: true } },
    { name: 'category', title: 'Categorie', type: 'string', options: { list: ['geothermie','pac','reglementation','chantier'] } },
    { name: 'locale', title: 'Langue', type: 'string', options: { list: ['be-fr','be-nl','fr-fr','lu-fr','lu-de'] } },
    { name: 'body', title: 'Contenu', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
  ],
  preview: { select: { title: 'title', media: 'mainImage' } }
}

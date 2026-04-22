const mediaItem = {
  name: 'mediaItem',
  title: 'Media galerie',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'type', title: 'Type', type: 'string', options: { list: ['photo','video'] } },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'videoUrl', title: 'URL video YouTube', type: 'url' },
    { name: 'location', title: 'Lieu du chantier', type: 'string' },
    { name: 'order', title: 'Ordre affichage', type: 'number' },
    { name: 'featured', title: 'Afficher sur homepage', type: 'boolean' },
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'photo' } }
}

export default mediaItem

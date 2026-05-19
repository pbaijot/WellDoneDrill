import {defineType} from 'sanity'
const chantier = defineType({
  name: 'chantier',
  title: 'Chantier reference',
  type: 'document',
  fields: [
    { name: 'title', title: 'Nom du projet', type: 'string' },
    { name: 'slug', title: 'URL (slug)', type: 'slug', options: { source: 'title' } },
    { name: 'client', title: "Maître d'ouvrage", type: 'string' },
    { name: 'location', title: 'Ville', type: 'string' },
    { name: 'province', title: 'Province / Région', type: 'string' },
    { name: 'country', title: 'Pays', type: 'string', options: { list: ['BE','FR','LU'] } },
    { name: 'type', title: 'Type de forage', type: 'string', options: { list: ['fermee','ouverte'] } },
    { name: 'sector', title: 'Secteur', type: 'string', options: { list: ['residentiel','tertiaire','public','industrie'] } },
    { name: 'depth', title: 'Profondeur (m)', type: 'number' },
    { name: 'year', title: 'Année', type: 'number' },
    { name: 'photo', title: 'Photo principale', type: 'image', options: { hotspot: true } },
    { name: 'videoUrl', title: 'Vidéo (URL directe mp4)', type: 'url' },
    { name: 'description', title: 'Description', type: 'text', rows: 5 },
    { name: 'featured', title: 'Mise en avant homepage', type: 'boolean' },
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'photo' } }
})
export default chantier

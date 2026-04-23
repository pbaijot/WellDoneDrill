import {defineType} from 'sanity'
const chantier = defineType({
  name: 'chantier',
  title: 'Chantier reference',
  type: 'document',
  fields: [
    { name: 'title', title: 'Nom du projet', type: 'string' },
    { name: 'location', title: 'Ville', type: 'string' },
    { name: 'province', title: 'Province / Region', type: 'string' },
    { name: 'country', title: 'Pays', type: 'string', options: { list: ['BE','FR','LU'] } },
    { name: 'type', title: 'Type', type: 'string', options: { list: ['fermee','ouverte'] } },
    { name: 'sector', title: 'Secteur', type: 'string', options: { list: ['residentiel','tertiaire','public','industrie'] } },
    { name: 'depth', title: 'Profondeur (m)', type: 'number' },
    { name: 'year', title: 'Annee', type: 'number' },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'featured', title: 'Mise en avant homepage', type: 'boolean' },
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'photo' } }
})
export default chantier

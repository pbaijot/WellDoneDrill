import {defineField, defineType} from 'sanity'

const itemFields = [
  defineField({name: 'title', title: 'Titre', type: 'string'}),
  defineField({name: 'body', title: 'Texte', type: 'text', rows: 3}),
]

const aProposPage = defineType({
  name: 'aProposPage',
  title: 'Page À propos',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'mission', title: 'Mission'},
    {name: 'gallery', title: 'Galerie'},
    {name: 'values', title: 'Valeurs'},
    {name: 'why', title: 'Pourquoi nous'},
    {name: 'partnership', title: 'Partenariats'},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']},
      validation: (r) => r.required(),
    }),

    // ── HERO ──────────────────────────────────────────────────
    defineField({name: 'heroTitle', title: 'Hero — titre', type: 'string', group: 'hero'}),
    defineField({name: 'heroSubtitle', title: 'Hero — sous-titre', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroCtaLabel', title: 'Hero — CTA', type: 'string', group: 'hero'}),
    defineField({name: 'heroImage', title: 'Hero — image de fond', type: 'image', options: {hotspot: true}, group: 'hero'}),

    // ── MISSION ───────────────────────────────────────────────
    defineField({name: 'missionTitle', title: 'Mission — titre', type: 'string', group: 'mission'}),
    defineField({name: 'missionBody1', title: 'Mission — §1', type: 'text', rows: 4, group: 'mission'}),
    defineField({name: 'missionBody2', title: 'Mission — §2', type: 'text', rows: 4, group: 'mission'}),
    defineField({name: 'missionBody3', title: 'Mission — §3', type: 'text', rows: 4, group: 'mission'}),
    defineField({name: 'missionImage', title: "Mission — image (fond, visible si pas de vidéo)", type: 'image', options: {hotspot: true}, group: 'mission'}),
    defineField({
      name: 'missionVideo',
      title: "Mission — vidéo (remplace l'image)",
      type: 'file',
      options: {accept: 'video/*'},
      group: 'mission',
    }),

    // ── GALLERY ───────────────────────────────────────────────
    defineField({
      name: 'galleryImages',
      title: 'Galerie — images (8 max)',
      type: 'array',
      of: [{
        type: 'image',
        options: {hotspot: true},
        fields: [{name: 'alt', title: 'Texte alternatif', type: 'string'}],
      }],
      validation: (r) => r.max(8),
      group: 'gallery',
    }),

    // ── VALUES ────────────────────────────────────────────────
    defineField({name: 'valuesTitle', title: 'Valeurs — titre section', type: 'string', group: 'values'}),
    defineField({
      name: 'values',
      title: 'Valeurs — items (5 max)',
      type: 'array',
      of: [{type: 'object', fields: itemFields}],
      validation: (r) => r.max(5),
      group: 'values',
    }),

    // ── WHY WDD ───────────────────────────────────────────────
    defineField({name: 'whyTitle', title: 'Pourquoi nous — titre', type: 'string', group: 'why'}),
    defineField({
      name: 'whyItems',
      title: 'Pourquoi nous — items',
      type: 'array',
      of: [{type: 'object', fields: itemFields}],
      group: 'why',
    }),

    // ── PARTNERSHIP ───────────────────────────────────────────
    defineField({name: 'partnershipTitle', title: 'Partenariats — titre', type: 'string', group: 'partnership'}),
    defineField({name: 'partnershipBody', title: 'Partenariats — texte', type: 'text', rows: 4, group: 'partnership'}),
    defineField({name: 'partnershipCta1', title: 'Partenariats — CTA principal', type: 'string', group: 'partnership'}),
    defineField({name: 'partnershipCta2', title: 'Partenariats — CTA secondaire', type: 'string', group: 'partnership'}),
    defineField({
      name: 'partnerLogos',
      title: 'Partenariats — logos partenaires',
      type: 'array',
      of: [{
        type: 'image',
        options: {hotspot: false},
        fields: [
          {name: 'alt', title: 'Nom du partenaire', type: 'string'},
          {name: 'url', title: 'Lien (optionnel)', type: 'url'},
        ],
      }],
      group: 'partnership',
    }),

    // ── CONTACT ───────────────────────────────────────────────
    defineField({name: 'phone', title: 'Téléphone', type: 'string', group: 'contact'}),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: 'Adresse', type: 'string', group: 'contact'}),
    defineField({name: 'contactCtaLabel', title: 'Contact — CTA', type: 'string', group: 'contact'}),

    // ── SEO ───────────────────────────────────────────────────
    defineField({name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo'}),
  ],
  preview: {
    select: {locale: 'locale'},
    prepare({locale}) {
      return {title: 'À propos', subtitle: locale}
    },
  },
})

export default aProposPage

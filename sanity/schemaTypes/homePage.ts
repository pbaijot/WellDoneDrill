const homePage = {
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: ['be-fr', 'be-nl', 'fr-fr', 'lu-fr', 'lu-de']
      },
      validation: (Rule: any) => Rule.required()
    },

    {
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { name: 'tag', title: 'Tag', type: 'string' },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        { name: 'ctaLabel', title: 'CTA principal', type: 'string' },
        { name: 'secondaryLabel', title: 'CTA secondaire', type: 'string' }
      ]
    },

    {
      name: 'stats',
      title: 'Statistiques',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Valeur', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' }
          ]
        }
      ]
    },

    {
      name: 'advantages',
      title: 'Avantages',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        {
          name: 'items',
          title: 'Cartes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'number', title: 'Numéro', type: 'string' },
                { name: 'icon', title: 'Icône texte', type: 'string' },
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 }
              ]
            }
          ]
        },
        { name: 'calculatorTitle', title: 'Titre calculateur', type: 'string' },
        { name: 'calculatorSubtitle', title: 'Sous-titre calculateur', type: 'string' }
      ]
    },

    {
      name: 'services',
      title: 'Services',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        {
          name: 'items',
          title: 'Services',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'badge', title: 'Badge', type: 'string' },
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 },
                { name: 'routeKey', title: 'Route key', type: 'string' }
              ]
            }
          ]
        }
      ]
    },

    {
      name: 'gallery',
      title: 'Galerie',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'text', rows: 3 },
        { name: 'mainLabel', title: 'Texte vidéo principale', type: 'string' },
        { name: 'videoBadge', title: 'Badge vidéo', type: 'string' },
        {
          name: 'items',
          title: 'Vignettes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'city', title: 'Ville', type: 'string' }
              ]
            }
          ]
        }
      ]
    },

    {
      name: 'audiences',
      title: 'Particuliers / professionnels',
      type: 'object',
      fields: [
        {
          name: 'particular',
          title: 'Particuliers',
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'buttonLabel', title: 'Bouton', type: 'string' }
          ]
        },
        {
          name: 'professional',
          title: 'Professionnels',
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'title', title: 'Titre', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'buttonLabel', title: 'Bouton', type: 'string' }
          ]
        }
      ]
    },

    {
      name: 'machine',
      title: 'Bloc machine',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
        {
          name: 'items',
          title: 'Liste',
          type: 'array',
          of: [{ type: 'string' }]
        },
        { name: 'buttonLabel', title: 'Bouton', type: 'string' }
      ]
    },

    {
      name: 'clients',
      title: 'Clients',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        {
          name: 'items',
          title: 'Clients',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },

    {
      name: 'blog',
      title: 'Bloc blog',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Titre principal', type: 'string' },
        { name: 'highlight', title: 'Mot ou partie en évidence', type: 'string' },
        { name: 'readMoreLabel', title: 'Label lire plus', type: 'string' },
        {
          name: 'posts',
          title: 'Posts affichés',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'date', title: 'Date', type: 'string' },
                { name: 'excerpt', title: 'Extrait', type: 'text', rows: 3 },
                { name: 'tone', title: 'Classe couleur', type: 'string' }
              ]
            }
          ]
        }
      ]
    },

    {
      name: 'cta',
      title: 'CTA final',
      type: 'object',
      fields: [
        { name: 'pretitle', title: 'Pretitle', type: 'string' },
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'buttonLabel', title: 'Bouton', type: 'string' },
        { name: 'phone', title: 'Téléphone', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'locale'
    },
    prepare({title}: {title?: string}) {
      return {
        title: title ? `Homepage – ${title}` : 'Homepage'
      }
    }
  }
}

export default homePage

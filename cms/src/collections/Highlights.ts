import type { CollectionConfig } from 'payload'

export const Highlights: CollectionConfig = {
  slug: 'highlights',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'position', 'published'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'text',
      type: 'text',
      localized: true,
      admin: {
        description: 'Kurztext / Beschreibung (z. B. ein Ausflugsziel, Ausrüstungstipp oder Strecken-Insider-Tipp).',
      },
    },
    {
      name: 'lat',
      type: 'number',
      admin: {
        description: 'Breitengrad (optional, für künftige Kartenanzeige).',
      },
    },
    {
      name: 'lng',
      type: 'number',
      admin: {
        description: 'Längengrad (optional, für künftige Kartenanzeige).',
      },
    },
    {
      name: 'position',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Sortierung: kleinere Zahlen zuerst.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

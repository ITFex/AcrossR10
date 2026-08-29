import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'published'],
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
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'teaser',
      type: 'text',
      localized: true,
      admin: {
        description: 'Kurztext für die Kartenansicht auf der Startseite.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Deaktiviert, um einen Entwurf zu verstecken.',
      },
    },
  ],
}

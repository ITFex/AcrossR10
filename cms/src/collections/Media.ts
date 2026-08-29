import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Dateien landen auf dem Persistent Volume /media (Docker-Volume acrossr10_cms_media)
    staticDir: '/media',
    mimeTypes: ['image'],
  },
}

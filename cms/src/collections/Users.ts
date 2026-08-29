import type { CollectionConfig, PayloadRequest } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  // Nur der allererste User wird via Self-Service angelegt; danach
  // ausschließlich durch eingeloggte Admins.
  access: {
    create: async ({ req }: { req: PayloadRequest }) => {
      if (req.user) return true
      const { totalDocs } = await req.payload.find({
        collection: 'users',
        limit: 1,
        pagination: false,
      })
      return totalDocs === 0
    },
  },
}

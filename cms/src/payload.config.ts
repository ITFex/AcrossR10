import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { News } from './collections/News'
import { Highlights } from './collections/Highlights'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, News, Highlights, Media],
  editor: lexicalEditor(),
  localization: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.SERVER_URL || 'https://wideride.de/acrossr10/cms',
  // Payload fügt serverURL automatisch in die CSRF-Allowlist (sanitize.js).
  // Problem: serverURL trägt den Sub-Pfad, aber Browser senden im Origin-Header
  // NIE einen Pfad (always `https://wideride.de`). Ohne expliziten Eintrag wird
  // der payload-Token-Cookie bei jeder Write-Operation abgewiesen → 403 für den Admin.
  csrf: ['https://wideride.de'],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})

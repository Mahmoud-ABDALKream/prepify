import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Use process.env directly with fallback — env() throws PrismaConfigEnvError
    // if the variable is missing, which breaks `prisma generate` during CI/CD
    // postinstall when DATABASE_URL is not yet available.
    // The URL is only needed for db push/migrate, not for generate.
    url: process.env.DATABASE_URL ?? 'file:./db/custom.db',
  },
})

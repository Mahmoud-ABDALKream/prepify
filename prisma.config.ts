import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Supabase PostgreSQL connection
    // Use process.env directly with fallback — env() throws PrismaConfigEnvError
    // if the variable is missing, which breaks `prisma generate` during CI/CD
    // postinstall when DATABASE_URL is not yet available.
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  },
})

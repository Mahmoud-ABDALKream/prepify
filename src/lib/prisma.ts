import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Resolve the database path relative to the project root
// This ensures the database works regardless of the CWD
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || 'file:./db/custom.db'

  // If it's a relative file path, resolve it to absolute
  if (envUrl.startsWith('file:./')) {
    const relativePath = envUrl.replace('file:', '')
    const absolutePath = path.resolve(process.cwd(), relativePath)
    const dir = path.dirname(absolutePath)

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    return `file:${absolutePath}`
  }

  return envUrl
}

// Set the resolved DATABASE_URL before creating PrismaClient
process.env.DATABASE_URL = resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Auto-connect and ensure schema exists
prisma.$connect().then(async () => {
  try {
    await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' LIMIT 1`
  } catch {
    console.warn('[Prisma] Database appears empty - tables may not exist. Run: npx prisma db push')
  }
}).catch((err) => {
  console.error('[Prisma] Connection error:', err.message)
})

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
    || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'

  // Create a PostgreSQL connection pool with error handling
  const pool = new pg.Pool({
    connectionString,
    // Handle connection errors gracefully
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  // Prevent unhandled pool errors from crashing the server
  pool.on('error', (err) => {
    console.error('[Prisma] Unexpected pool error:', err.message)
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown — close Prisma connection on process exit
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect()
  } catch {
    // Ignore disconnect errors
  }
})

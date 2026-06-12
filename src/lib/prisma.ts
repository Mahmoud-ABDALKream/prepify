import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import BetterSqlite3 from 'better-sqlite3'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Resolve the SQLite database path relative to the project root
  const dbPath = path.join(process.cwd(), 'db', 'custom.db')

  // Create the better-sqlite3 instance and Prisma adapter
  const sqlite = new BetterSqlite3(dbPath)
  const adapter = new PrismaBetterSqlite3(sqlite)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown — close Prisma connection on process exit
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

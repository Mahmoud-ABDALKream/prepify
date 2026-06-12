// Re-export from the canonical prisma instance
// This ensures all database connections use the same resolved path
export { prisma as db } from './prisma'

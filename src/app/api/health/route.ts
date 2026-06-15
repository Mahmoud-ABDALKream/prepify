import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/health — Diagnostic endpoint to verify Supabase connection
 * Returns connection status, table counts, and environment variable check
 */
export async function GET() {
  const diagnostics: {
    status: 'ok' | 'error'
    timestamp: string
    env: Record<string, boolean>
    tables: Record<string, { count: number | null; error: string | null }>
    error?: string
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      ADMIN_SECRET: !!process.env.ADMIN_SECRET,
    },
    tables: {},
  }

  try {
    const supabase = getSupabaseAdmin()

    // Check each table
    const tables = ['QuizAttempt', 'ExamResult', 'Feedback', 'QuestionResponse']

    const results = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        return {
          table,
          count: count ?? 0,
          error: error?.message ?? null,
        }
      })
    )

    for (const r of results) {
      diagnostics.tables[r.table] = {
        count: r.count,
        error: r.error,
      }
      if (r.error) diagnostics.status = 'error'
    }
  } catch (error) {
    diagnostics.status = 'error'
    diagnostics.error = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.status === 'ok' ? 200 : 500,
  })
}

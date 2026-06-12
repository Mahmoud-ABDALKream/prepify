/**
 * Supabase Admin Client — Singleton for API Routes
 *
 * Uses the service role key to bypass Row Level Security.
 * Connects via HTTPS (PostgREST) — works on Vercel, serverless, any environment.
 *
 * ⚠️  NEVER expose the service role key to the browser.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const globalForSupabase = globalThis as unknown as {
  supabaseAdmin: SupabaseClient | undefined
}

function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Set them in your .env file or Vercel Dashboard → Settings → Environment Variables.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Get the Supabase admin client singleton.
 * Safe to call in every API route — reuses the same instance.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!globalForSupabase.supabaseAdmin) {
    globalForSupabase.supabaseAdmin = createAdminClient()
  }
  return globalForSupabase.supabaseAdmin
}

export default getSupabaseAdmin

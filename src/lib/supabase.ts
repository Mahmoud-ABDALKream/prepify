/**
 * Supabase Browser Client
 *
 * Singleton pattern to avoid creating multiple clients during hot-reloading.
 * Use this in Client Components for: Auth, Realtime, Storage, and direct DB queries.
 *
 * For Server Components and API routes, use `@/lib/supabase-server` instead.
 */
import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. ' +
      'Check your .env file.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Global singleton for browser — prevents multiple instances during HMR
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient()
  }
  return browserClient
}

export default getSupabaseBrowserClient

/**
 * Date & Time Utilities — Cairo (Africa/Cairo) Timezone
 *
 * All server-side date logic should use these helpers instead of raw
 * `new Date().toISOString().split('T')[0]` which returns UTC dates
 * and can be off by a day depending on the server timezone.
 */

/** The canonical timezone for the application */
export const APP_TIMEZONE = 'Africa/Cairo'

/** Milliseconds in one day — named constant to eliminate magic numbers */
export const MS_PER_DAY = 86_400_000

/**
 * Get today's date string (YYYY-MM-DD) in Cairo timezone.
 * Replaces `new Date().toISOString().split('T')[0]` which is UTC-based.
 */
export function todayCairo(): string {
  return formatDateCairo(new Date())
}

/**
 * Get a date string (YYYY-MM-DD) in Cairo timezone for a given Date.
 */
export function formatDateCairo(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: APP_TIMEZONE }) // en-CA → YYYY-MM-DD
}

/**
 * Get yesterday's date string (YYYY-MM-DD) in Cairo timezone.
 */
export function yesterdayCairo(): string {
  const d = new Date(Date.now() - MS_PER_DAY)
  return formatDateCairo(d)
}

/**
 * Get a Date object that is N days ago from now (Cairo-aware conceptually,
 * but returns a UTC Date for comparison with stored timestamps).
 */
export function daysAgo(n: number): Date {
  return new Date(Date.now() - n * MS_PER_DAY)
}

/**
 * Format a date string for display in the Cairo timezone.
 * Used in FeedbackTab, StudentsTab, and other UI components.
 */
export function formatDisplayDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: APP_TIMEZONE,
    ...options,
  })
}

/**
 * Format a Date into an ISO-like string that reflects Cairo local time
 * instead of UTC.  Used for CSV exports and API timestamps.
 *
 * Returns: "2025-06-13T15:30:00.000+02:00" style string
 */
export function toCairoISOString(date: Date): string {
  // Use Intl to get Cairo-local parts, then build an ISO string
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
}

/**
 * Convert a stored UTC/unknown-tz Date into Cairo date string (YYYY-MM-DD).
 * Used when bucketing attempts by day — ensures "today" matches the user's
 * local calendar date in Cairo.
 */
export function toCairoDayString(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return formatDateCairo(date)
}

/**
 * Format elapsed seconds into a human-readable duration string.
 * e.g. 3661 → "1h 01m 01s", 125 → "2m 05s", 8 → "8s"
 *
 * Shared by all quiz result screens to eliminate duplication.
 */
export function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

'use client'

import { useState, useEffect } from 'react'
import type { Section } from '@/data/types'

interface State<T> {
  sections: T[]
  loading: boolean
  error: string | null
  source: 'supabase' | 'local' | null
}

/**
 * useSubjectSections
 *
 * Loads quiz sections for a subject. Tries Supabase first (so admin-managed
 * edits show up live); falls back to the local TS import if the DB is empty
 * or unreachable. This keeps the quiz working offline / on first deploy.
 *
 * @param subjectKey  e.g. 'msoffice' | 'c-programming' | 'iot' | ...
 * @param localSections  the static TS import (fallback)
 */
export function useSubjectSections<T extends Section = Section>(
  subjectKey: string,
  localSections: T[],
): State<T> {
  const [state, setState] = useState<State<T>>({
    sections: localSections,
    loading: true,
    error: null,
    source: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/questions?subject=${encodeURIComponent(subjectKey)}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (cancelled) return

        if (Array.isArray(data.sections) && data.sections.length > 0) {
          setState({
            sections: data.sections as T[],
            loading: false,
            error: null,
            source: 'supabase',
          })
        } else {
          // Supabase table empty — use local fallback
          setState({
            sections: localSections,
            loading: false,
            error: null,
            source: 'local',
          })
        }
      } catch (e: any) {
        if (cancelled) return
        setState({
          sections: localSections,
          loading: false,
          error: e.message,
          source: 'local',
        })
      }
    }

    load()
    return () => { cancelled = true }
  }, [subjectKey, localSections])

  return state
}

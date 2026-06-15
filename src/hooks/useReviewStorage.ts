'use client'

import { useState, useEffect, useCallback, startTransition, useRef } from 'react'

// ─── Types ───────────────────────────────────────────
interface ReviewData {
  starred: number[]
  wrong: number[]
}

interface QuestionStateLike {
  isChecked: boolean
  isCorrect: boolean | null
}

// ─── Hook ────────────────────────────────────────────
export function useReviewStorage(subjectKey: string, validQuestionIds?: Set<number>) {
  const REVIEW_KEY = `prepify-${subjectKey}-review`

  const [starredIds, setStarredIds] = useState<Set<number>>(new Set())
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  // Ref for debounced localStorage writes — avoids writing on every keystroke/click
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Load from localStorage on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEW_KEY)
      if (saved) {
        const data: ReviewData = JSON.parse(saved)
        // Clean up invalid question IDs that no longer exist after renumbering
        if (validQuestionIds) {
          const starred = (data.starred || []).filter(id => validQuestionIds.has(id))
          const wrong = (data.wrong || []).filter(id => validQuestionIds.has(id))
          setStarredIds(new Set(starred))
          setWrongIds(new Set(wrong))
          // Auto-save cleaned data if anything was removed
          if (starred.length !== (data.starred || []).length || wrong.length !== (data.wrong || []).length) {
            try {
              localStorage.setItem(REVIEW_KEY, JSON.stringify({ starred, wrong }))
            } catch { /* ignore */ }
          }
        } else {
          if (data.starred) setStarredIds(new Set(data.starred))
          if (data.wrong) setWrongIds(new Set(data.wrong))
        }
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [REVIEW_KEY, validQuestionIds])

  // ─── Save to localStorage (debounced) ───
  // Instead of writing on every state change, we debounce to batch rapid toggles
  useEffect(() => {
    if (!hydrated) return

    // Clear any pending save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    // Schedule a debounced save
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(REVIEW_KEY, JSON.stringify({
          starred: Array.from(starredIds),
          wrong: Array.from(wrongIds),
        }))
      } catch { /* ignore quota errors */ }
    }, 100) // 100ms debounce — fast enough to feel instant, avoids thrashing

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [starredIds, wrongIds, hydrated, REVIEW_KEY])

  // ─── Toggle star on/off (non-blocking via startTransition) ───
  const toggleStar = useCallback((qId: number) => {
    startTransition(() => {
      setStarredIds(prev => {
        const next = new Set(prev)
        if (next.has(qId)) next.delete(qId)
        else next.add(qId)
        return next
      })
    })
  }, [])

  // ─── Check if a question is starred ───
  const isStarred = useCallback((qId: number) => starredIds.has(qId), [starredIds])

  // ─── Save wrong questions after submit ───
  const saveWrongQuestions = useCallback((questionStates: Record<number, QuestionStateLike>) => {
    const wrong = new Set<number>()
    Object.entries(questionStates).forEach(([id, state]) => {
      if (state.isChecked && state.isCorrect === false) {
        wrong.add(Number(id))
      }
    })
    setWrongIds(wrong)
  }, [])

  // ─── Remove a single wrong question ───
  const removeWrong = useCallback((qId: number) => {
    setWrongIds(prev => {
      const next = new Set(prev)
      next.delete(qId)
      return next
    })
  }, [])

  // ─── Remove a single starred question ───
  const removeStarred = useCallback((qId: number) => {
    setStarredIds(prev => {
      const next = new Set(prev)
      next.delete(qId)
      return next
    })
  }, [])

  // ─── Clear all review data ───
  const clearAllReview = useCallback(() => {
    setStarredIds(new Set())
    setWrongIds(new Set())
    try { localStorage.removeItem(REVIEW_KEY) } catch { /* ignore */ }
  }, [REVIEW_KEY])

  return {
    starredIds,
    wrongIds,
    toggleStar,
    isStarred,
    saveWrongQuestions,
    removeWrong,
    removeStarred,
    clearAllReview,
  }
}

'use client'

import { useState, useCallback } from 'react'

interface CheckResult {
  isCorrect: boolean
  feedback: string
}

/**
 * Lightweight client hook that calls /api/check-answer.
 * Returns a `check` function and the current loading state.
 */
export function useAnswerChecker() {
  const [checking, setChecking] = useState<Record<number, boolean>>({})

  const check = useCallback(
    async (
      qId: number,
      payload: { question: string; modelAnswer: string; userAnswer: string; type?: string }
    ): Promise<CheckResult> => {
      setChecking(prev => ({ ...prev, [qId]: true }))
      try {
        const res = await fetch('/api/check-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) {
          return {
            isCorrect: false,
            feedback: data?.feedback || 'Could not reach the AI grader.',
          }
        }
        return {
          isCorrect: Boolean(data.isCorrect),
          feedback: data.feedback || (data.isCorrect ? 'Correct!' : 'Try again.'),
        }
      } catch {
        return {
          isCorrect: false,
          feedback: 'Network error — please retry.',
        }
      } finally {
        setChecking(prev => {
          const next = { ...prev }
          delete next[qId]
          return next
        })
      }
    },
    []
  )

  const isChecking = useCallback((qId: number) => Boolean(checking[qId]), [checking])

  return { check, isChecking }
}

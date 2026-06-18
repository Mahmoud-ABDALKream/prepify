'use client'

import { useState, useCallback } from 'react'

export interface CheckResult {
  isCorrect: boolean
  score?: number
  feedback: string
  conceptsFound?: string[]
  conceptsMissing?: string[]
}

interface CheckPayload {
  question: string
  modelAnswer: string
  userAnswer: string
  type?: string
}

/**
 * Lightweight client hook that calls /api/check-answer.
 * Returns a `check` function, per-question loading state,
 * and the last result for each question.
 */
export function useAnswerChecker() {
  const [checking, setChecking] = useState<Record<number, boolean>>({})
  const [results, setResults] = useState<Record<number, CheckResult>>({})

  const check = useCallback(
    async (qId: number, payload: CheckPayload): Promise<CheckResult> => {
      setChecking(prev => ({ ...prev, [qId]: true }))
      try {
        const res = await fetch('/api/check-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        const result: CheckResult = res.ok
          ? {
              isCorrect: Boolean(data.isCorrect),
              score: typeof data.score === 'number' ? data.score : undefined,
              feedback: data.feedback || (data.isCorrect ? 'Correct!' : 'Try again.'),
              conceptsFound: Array.isArray(data.conceptsFound) ? data.conceptsFound : [],
              conceptsMissing: Array.isArray(data.conceptsMissing) ? data.conceptsMissing : [],
            }
          : {
              isCorrect: false,
              feedback: data?.feedback || 'Could not reach the AI grader.',
            }
        setResults(prev => ({ ...prev, [qId]: result }))
        return result
      } catch {
        const result: CheckResult = {
          isCorrect: false,
          feedback: 'Network error — please retry.',
        }
        setResults(prev => ({ ...prev, [qId]: result }))
        return result
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
  const getResult = useCallback((qId: number) => results[qId], [results])
  const clearResult = useCallback(
    (qId: number) =>
      setResults(prev => {
        const next = { ...prev }
        delete next[qId]
        return next
      }),
    []
  )

  return { check, isChecking, getResult, clearResult }
}

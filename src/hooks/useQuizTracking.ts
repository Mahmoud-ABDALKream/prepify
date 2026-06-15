'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface QuestionResponseData {
  questionId: number
  questionType: string
  sectionTitle: string
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string
  difficulty: string
  bloomTaxonomy: string
}

export function useQuizTracking(subject: string, quizId: string, questionType: string = 'multiple-choice') {
  const [quizStarted, setQuizStarted] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [showStartPopup, setShowStartPopup] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [attemptSubmitting, setAttemptSubmitting] = useState(false)
  const [attemptSubmitted, setAttemptSubmitted] = useState(false)
  const [attemptError, setAttemptError] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startTimeRef = useRef<number>(0)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Store last submission data for retry
  const lastSubmissionRef = useRef<{
    correctCount: number
    wrongCount: number
    totalQuestions: number
    questionResponses?: QuestionResponseData[]
  } | null>(null)

  // Show popup on mount after hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedName = localStorage.getItem('prepify-user-name')
      if (savedName) setUserName(savedName)
      setShowStartPopup(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Track elapsed time silently (always running after quiz starts)
  useEffect(() => {
    if (quizStarted && startTimeRef.current > 0) {
      elapsedRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
        setElapsedSeconds(elapsed)
      }, 1000)
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
  }, [quizStarted])

  const handleStartQuiz = useCallback((data: { userName: string; timerMinutes: number }) => {
    const uName = data.userName.trim()
    const uId = uName.toLowerCase().replace(/\s+/g, '-') + '-' + uName.length.toString(36)

    setUserName(uName)
    setUserId(uId)
    setTimerMinutes(data.timerMinutes)
    setQuizStarted(true)
    setShowStartPopup(false)

    const now = Date.now()
    setStartTime(now)
    startTimeRef.current = now

    localStorage.setItem('prepify-user-name', uName)
    localStorage.setItem('prepify-user-id', uId)
  }, [])

  // If user closes popup without starting, auto-start with no timer
  const handleSkipPopup = useCallback(() => {
    setShowStartPopup(false)
    // Use saved name or default
    const savedName = localStorage.getItem('prepify-user-name') || ''
    const uName = savedName || 'Anonymous'
    const uId = uName.toLowerCase().replace(/\s+/g, '-') + '-' + uName.length.toString(36)

    setUserName(uName)
    setUserId(uId)
    setTimerMinutes(0) // No visible timer
    setQuizStarted(true)

    const now = Date.now()
    setStartTime(now)
    startTimeRef.current = now

    localStorage.setItem('prepify-user-name', uName)
    localStorage.setItem('prepify-user-id', uId)
  }, [])

  const submitQuizAttempt = useCallback(async (
    correctCount: number,
    wrongCount: number,
    totalQuestions: number,
    questionResponses?: QuestionResponseData[]
  ) => {
    if (attemptSubmitting || attemptSubmitted) return

    // Stop elapsed timer
    if (elapsedRef.current) clearInterval(elapsedRef.current)

    // Store for retry
    lastSubmissionRef.current = { correctCount, wrongCount, totalQuestions, questionResponses }

    setAttemptSubmitting(true)
    setAttemptError(null)
    try {
      const timeTaken = startTimeRef.current > 0
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : 0

      const score = totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0

      const res = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          subject,
          quizId,
          score,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          totalQuestions,
          timeTaken,
          questionType,
          questionResponses: questionResponses || [],
        }),
      })

      if (res.ok) {
        setAttemptSubmitted(true)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setAttemptError(errorData.error || `Server error (${res.status})`)
      }
    } catch (error) {
      console.error('Failed to submit quiz attempt:', error)
      setAttemptError('Network error — please check your connection')
    } finally {
      setAttemptSubmitting(false)
    }
  }, [attemptSubmitting, attemptSubmitted, userId, userName, subject, quizId])

  // Retry submitting the last attempt
  const retrySubmit = useCallback(async () => {
    if (!lastSubmissionRef.current || attemptSubmitted) return
    const { correctCount, wrongCount, totalQuestions, questionResponses } = lastSubmissionRef.current
    // Reset submitted flag to allow retry
    setAttemptSubmitted(false)
    await submitQuizAttempt(correctCount, wrongCount, totalQuestions, questionResponses)
  }, [attemptSubmitted, submitQuizAttempt])

  return {
    quizStarted,
    userName,
    userId,
    timerMinutes,
    showStartPopup,
    startTime,
    elapsedSeconds,
    attemptSubmitting,
    attemptSubmitted,
    attemptError,
    handleStartQuiz,
    handleSkipPopup,
    submitQuizAttempt,
    retrySubmit,
    setShowStartPopup,
  }
}

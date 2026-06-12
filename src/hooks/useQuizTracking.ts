'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface QuizTrackingData {
  quizStarted: boolean
  userName: string
  userId: string
  timerMinutes: number
  startTime: number // timestamp when quiz started
  showStartPopup: boolean
}

export function useQuizTracking(subject: string, quizId: string) {
  const [quizStarted, setQuizStarted] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [showStartPopup, setShowStartPopup] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [attemptSubmitting, setAttemptSubmitting] = useState(false)
  const [attemptSubmitted, setAttemptSubmitted] = useState(false)
  const startTimeRef = useRef<number>(0)

  // Show popup on mount after hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user already has a saved name
      const savedName = localStorage.getItem('prepify-user-name')
      if (savedName) {
        setUserName(savedName)
      }
      setShowStartPopup(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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

    // Save user info
    localStorage.setItem('prepify-user-name', uName)
    localStorage.setItem('prepify-user-id', uId)
  }, [])

  const submitQuizAttempt = useCallback(async (
    correctCount: number,
    wrongCount: number,
    totalQuestions: number
  ) => {
    if (attemptSubmitting || attemptSubmitted) return

    setAttemptSubmitting(true)
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
        }),
      })

      if (res.ok) {
        setAttemptSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit quiz attempt:', error)
    } finally {
      setAttemptSubmitting(false)
    }
  }, [attemptSubmitting, attemptSubmitted, userId, userName, subject, quizId])

  return {
    quizStarted,
    userName,
    userId,
    timerMinutes,
    showStartPopup,
    startTime,
    attemptSubmitting,
    attemptSubmitted,
    handleStartQuiz,
    submitQuizAttempt,
    setShowStartPopup,
  }
}

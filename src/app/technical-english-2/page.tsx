'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizStartPopup from '@/components/QuizStartPopup'
import QuizTimer from '@/components/QuizTimer'
import ReviewPanel from '@/components/ReviewPanel'
import ScrollToTop from '@/components/ScrollToTop'
import { useQuizTracking } from '@/hooks/useQuizTracking'
import { useReviewStorage } from '@/hooks/useReviewStorage'
import { formatDuration } from '@/lib/date-utils'

import { Section, Question } from "@/data/types"
import { te2Sections as sections } from "@/data/te2-sections"

// ─── Data imported from shared files ──────────────────
// sections is now imported from @/data/te2-sections

// ─── State Types ─────────────────────────────────────
interface QuestionState {
  userCode: string
  fillAnswers: Record<number, string>
  selectedMcq: string | null
  isChecked: boolean
  isSolutionRevealed: boolean
  isCorrect: boolean | null
  fillCorrect: Record<number, boolean>
  // TE2-specific
  definitionAnswer: string
  arrangedWords: number[] // indices into question.arrangeWords
  translationAnswer: string
}

// ─── LocalStorage Key ────────────────────────────────
const STORAGE_KEY = 'prepify-te2-progress'

// ─── Seeded shuffle for arrange type ─────────────────
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// ─── Main Component ──────────────────────────────────
export default function Home() {
  const {
    quizStarted, userName, timerMinutes, showStartPopup, elapsedSeconds,
    attemptSubmitting, attemptSubmitted, attemptError,
    handleStartQuiz, handleSkipPopup, submitQuizAttempt, retrySubmit, setShowStartPopup,
  } = useQuizTracking('te2', 'te2-full')

  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // ─── Review storage (starred + wrong questions) ───
  const validQuestionIds = useMemo(() => new Set(sections.flatMap(s => s.questions.map(q => q.id))), [sections])
  const {
    starredIds, wrongIds, toggleStar, isStarred,
    saveWrongQuestions, removeWrong, removeStarred, clearAllReview,
  } = useReviewStorage('te2', validQuestionIds)

  const topRef = useRef<HTMLDivElement>(null)
  const sectionNavRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  // ─── Drag-to-scroll for section nav ───────────────────
  const updateFadeIndicators = useCallback(() => {
    const el = sectionNavRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 5)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    updateFadeIndicators()
    const el = sectionNavRef.current
    if (!el) return
    el.addEventListener('scroll', updateFadeIndicators)
    window.addEventListener('resize', updateFadeIndicators)
    return () => {
      el.removeEventListener('scroll', updateFadeIndicators)
      window.removeEventListener('resize', updateFadeIndicators)
    }
  }, [updateFadeIndicators])

  const handleDragStart = useCallback((clientX: number) => {
    const el = sectionNavRef.current
    if (!el) return
    setIsDragging(true)
    setDragStartX(clientX)
    setDragScrollLeft(el.scrollLeft)
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const el = sectionNavRef.current
    if (!el) return
    const walk = (clientX - dragStartX) * 1.5
    el.scrollLeft = dragScrollLeft - walk
  }, [isDragging, dragStartX, dragScrollLeft])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ─── Load saved progress from localStorage on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.questionStates) setQuestionStates(data.questionStates)
        if (data.scoreSubmitted) setScoreSubmitted(data.scoreSubmitted)
      }
    } catch { /* ignore parse errors */ }
    setHydrated(true)
  }, [])

  // ─── Save progress to localStorage on state change ───
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ questionStates, scoreSubmitted }))
    } catch { /* ignore quota errors */ }
  }, [questionStates, scoreSubmitted, hydrated])

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0)

  const getQState = useCallback((qId: number): QuestionState => {
    return questionStates[qId] || {
      userCode: '',
      fillAnswers: {},
      selectedMcq: null,
      isChecked: false,
      isSolutionRevealed: false,
      isCorrect: null,
      fillCorrect: {},
      definitionAnswer: '',
      arrangedWords: [],
      translationAnswer: '',
    }
  }, [questionStates])

  const updateQState = useCallback((qId: number, update: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [qId]: { ...getQState(qId), ...update },
    }))
  }, [getQState])

  const answeredCount = Object.values(questionStates).filter(
    s => s.isChecked || s.isSolutionRevealed || s.selectedMcq !== null || s.userCode.trim().length > 0 || Object.keys(s.fillAnswers).length > 0 || s.definitionAnswer.trim().length > 0 || s.arrangedWords.length > 0 || s.translationAnswer.trim().length > 0
  ).length

  const correctCount = Object.values(questionStates).filter(
    s => s.isChecked && s.isCorrect === true
  ).length

  // MCQ/TF check
  const checkMcq = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    if (!state.selectedMcq) return
    const correct = question.mcqOptions?.find(o => o.letter === state.selectedMcq)?.isCorrect ?? false
    updateQState(qId, { isChecked: true, isCorrect: correct })
  }, [getQState, updateQState])

  // Fill check
  const checkFill = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    const fillCorrect: Record<number, boolean> = {}
    let allCorrect = true
    question.fillItems?.forEach((item, idx) => {
      const userAns = (state.fillAnswers[idx] || '').trim().toLowerCase()
      const correctAns = item.answer.trim().toLowerCase()
      const isCorrect = userAns === correctAns
      fillCorrect[idx] = isCorrect
      if (!isCorrect) allCorrect = false
    })
    updateQState(qId, { isChecked: true, isCorrect: allCorrect, fillCorrect })
  }, [getQState, updateQState])

  // Definition check (case-insensitive, trimmed)
  const checkDefinition = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    const userAns = state.definitionAnswer.trim().toLowerCase()
    const correctAns = question.answer.trim().toLowerCase()
    const isCorrect = userAns === correctAns
    updateQState(qId, { isChecked: true, isCorrect })
  }, [getQState, updateQState])

  // Arrange check (compare joined sentence)
  const checkArrange = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    if (state.arrangedWords.length === 0) return
    const userSentence = state.arrangedWords.map(idx => question.arrangeWords?.[idx]).join(' ')
    const correctSentence = question.answer
    const isCorrect = userSentence === correctSentence
    updateQState(qId, { isChecked: true, isCorrect })
  }, [getQState, updateQState])

  // Translation check (no auto-grade, just reveal)
  const checkTranslation = useCallback((qId: number) => {
    updateQState(qId, { isChecked: true, isCorrect: null })
  }, [updateQState])

  // Reveal solution
  const revealSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: true })
  }, [updateQState])

  // Hide solution
  const hideSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: false })
  }, [updateQState])

  // Reset question
  const resetQuestion = useCallback((qId: number) => {
    setQuestionStates(prev => {
      const next = { ...prev }
      delete next[qId]
      return next
    })
  }, [])

  // Reveal all solutions
  const revealAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: true })
    }))
  }, [updateQState])

  // Hide all solutions
  const hideAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: false })
    }))
  }, [updateQState])

  // Reset all
  const resetAll = useCallback(() => {
    setQuestionStates({})
    setScoreSubmitted(false)
    setShowConfetti(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  // Submit all & show score
  const submitAll = useCallback(() => {
    setScoreSubmitted(true)
    if (correctCount / totalQuestions >= 0.8) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }
    // Save wrong questions to review storage
    saveWrongQuestions(questionStates)
    // Build per-question response data for analytics
    const questionResponses = sections.flatMap(s =>
      s.questions.map(q => {
        const state = questionStates[q.id]
        return {
          questionId: q.id,
          questionType: q.type,
          sectionTitle: s.title,
          isCorrect: state?.isChecked ? state.isCorrect === true : false,
          userAnswer: state?.selectedMcq || state?.definitionAnswer || state?.translationAnswer || Object.values(state?.fillAnswers || {}).join(', ') || (state?.arrangedWords || []).map(idx => q.arrangeWords?.[idx]).join(' ') || '',
          correctAnswer: q.answer?.substring(0, 500) || '',
          difficulty: q.difficulty || 'medium',
          bloomTaxonomy: q.bloomTaxonomy || 'remember',
        }
      })
    )
    // Save attempt to database
    const wrongCount = answeredCount - correctCount
    submitQuizAttempt(correctCount, wrongCount, totalQuestions, questionResponses)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [correctCount, totalQuestions, answeredCount, submitQuizAttempt, questionStates, saveWrongQuestions])

  useEffect(() => {
    const handleScroll = () => {
      const sectionHeaders = document.querySelectorAll('[data-section-id]')
      let current: number | null = null
      sectionHeaders.forEach(header => {
        const rect = header.getBoundingClientRect()
        if (rect.top <= 150) {
          current = Number(header.getAttribute('data-section-id'))
        }
      })
      if (current !== null) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate total marks
  const totalMarks = sections.reduce((acc, s) => {
    return acc + s.questions.reduce((qAcc, q) => {
      const m = parseInt(q.marks)
      return qAcc + (isNaN(m) ? 0 : m)
    }, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Quiz Start Popup */}
      <QuizStartPopup
        open={showStartPopup}
        onClose={handleSkipPopup}
        onStart={handleStartQuiz}
        subjectName="Technical English 2"
      />

      {/* Timer */}
      {quizStarted && timerMinutes > 0 && (
        <QuizTimer
          minutes={timerMinutes}
          onTimeUp={() => {
            if (!scoreSubmitted) {
              submitAll()
            }
          }}
        />
      )}

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['#10b981', '#f59e0b', '#059669', '#d97706', '#ef4444', '#ec4899'][i % 6],
                }}
                animate={{
                  y: [0, window.innerHeight + 100],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1, ease: 'easeIn' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-1 max-w-[920px] mx-auto px-4 pb-10" ref={topRef}>
        {/* Back to Home */}
        <div className="pt-4">
          <a href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#10b981] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </a>
        </div>

        {/* Header */}
        <motion.header
          className="text-center pt-10 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Prepify Logo" className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2">
            <span className="bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">Technical English 2</span>
            <br />
            <span className="text-[#f59e0b]">Interactive Review</span>
          </h1>
          <p className="text-[#64748b] text-[15px] mb-6">
            Mahmoud ABD ELKream &nbsp;|&nbsp; Spring 2025/2026
          </p>
          <div className="flex justify-center gap-6 flex-wrap mt-4">
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#10b981]">{totalQuestions}</div>
              <div className="text-[11px] text-[#64748b]">Questions</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#f59e0b]">{totalMarks}</div>
              <div className="text-[11px] text-[#64748b]">Marks</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#10b981]">{sections.length}</div>
              <div className="text-[11px] text-[#64748b]">Sections</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#f59e0b]">{correctCount}</div>
              <div className="text-[11px] text-[#64748b]">Correct</div>
            </div>
          </div>
        </motion.header>

        {/* Sticky Controls Bar */}
        <div className="bg-[#111827]/90 border border-[#1e2d45] rounded-2xl p-3 mb-6 sticky top-2.5 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-[#64748b]">Progress</span>
                <span className="text-[11px] text-[#10b981] font-bold">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#f59e0b] rounded-full"
                  animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-xs text-[#64748b] whitespace-nowrap">
              {answeredCount} / {totalQuestions}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={revealAllSolutions}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-lg px-4 py-1.5 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Show All Solutions
              </button>
              <button
                onClick={hideAllSolutions}
                className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:border-[#64748b] transition-colors"
              >
                Hide All
              </button>
              <button
                onClick={resetAll}
                className="bg-transparent text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:bg-[#ef4444]/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Section nav pills - draggable with fade indicators */}
          <div className="relative mt-3">
            {/* Left fade indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #0f172a, transparent)' }} />
            {/* Right fade indicator */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to left, #0f172a, transparent)' }} />
            <div
              ref={sectionNavRef}
              className={`flex gap-2 overflow-x-auto pb-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX) }}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (!isDragging) {
                      document.querySelector(`[data-section-id="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    activeSection === s.id
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-[#1a2235] text-[#64748b] border-[#1e2d45] hover:border-[#10b981]/50 hover:text-[#10b981]'
                  }`}
                >
                  <span>{s.icon}</span>
                  Section {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <motion.div
            key={section.id}
            data-section-id={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sIdx * 0.1 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mt-10 mb-6 pb-4 border-b-2 border-[#1e2d45] relative">
              <div className="w-[48px] h-[48px] bg-gradient-to-r from-[#10b981] to-[#059669] rounded-[14px] flex items-center justify-center text-sm font-black shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-black">{section.title}</div>
                <div className="text-xs text-[#64748b]">Section {section.id} of {sections.length}</div>
              </div>
              <div className="bg-[#1a2235] border border-[#1e2d45] px-4 py-2 rounded-full text-sm font-bold text-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                {section.marks}
              </div>
            </div>

            {/* Questions */}
            {section.questions.map((q, qIdx) => (
              <QuestionCard
                key={q.id}
                question={q}
                sectionTitle={section.title}
                sectionIcon={section.icon}
                state={getQState(q.id)}
                onUpdate={updateQState}
                onCheckMcq={() => checkMcq(q.id, q)}
                onCheckFill={() => checkFill(q.id, q)}
                onCheckDefinition={() => checkDefinition(q.id, q)}
                onCheckArrange={() => checkArrange(q.id, q)}
                onCheckTranslation={() => checkTranslation(q.id)}
                onRevealSolution={() => revealSolution(q.id)}
                onHideSolution={() => hideSolution(q.id)}
                onReset={() => resetQuestion(q.id)}
                isStarred={isStarred(q.id)}
                onToggleStar={() => toggleStar(q.id)}
                index={qIdx}
              />
            ))}
          </motion.div>
        ))}

        {/* Submit Section */}
        {!scoreSubmitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={submitAll}
              className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-2xl px-12 py-4 font-black text-xl cursor-pointer transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:translate-y-0"
            >
              Show Final Score
            </button>
            <p className="text-[#64748b] text-sm mt-3">Make sure to review your answers before showing the score</p>
          </motion.div>
        ) : (
          <>
          <ScorePanel
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            onReset={resetAll}
            onRevealAll={revealAllSolutions}
            timeTaken={elapsedSeconds}
          />
          {/* Submission status / error notification */}
          {attemptSubmitting && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#1e2d45]/50 border border-[#10b981]/25 rounded-xl px-5 py-3 text-center text-sm text-[#94a3b8] mt-4">
              Saving your result...
            </motion.div>
          )}
          {attemptError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#ef4444]/10 border border-[#ef4444]/25 rounded-xl px-5 py-3 mt-4 flex items-center justify-between gap-3">
              <span className="text-[#f87171] text-sm">Failed to save: {attemptError}</span>
              <button onClick={retrySubmit} disabled={attemptSubmitting}
                className="text-xs font-bold text-[#ef4444] hover:text-[#f87171] underline cursor-pointer disabled:opacity-50">
                Retry
              </button>
            </motion.div>
          )}
          {attemptSubmitted && !attemptError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#10b981]/10 border border-[#10b981]/25 rounded-xl px-5 py-3 text-center text-sm text-[#10b981] mt-4">
              Result saved successfully
            </motion.div>
          )}
          {/* Review Panel: wrong + starred questions */}
          <ReviewPanel
            subjectName="Technical English 2"
            subjectColor="#10b981"
            starredQuestions={sections.flatMap(s => s.questions.filter(q => starredIds.has(q.id)).map(q => ({
              id: q.id, text: q.text, type: q.type, marks: q.marks,
              answer: q.answer, sectionTitle: s.title, sectionIcon: s.icon,
              codeBlock: q.codeBlock, answerCode: q.answerCode, mcqOptions: q.mcqOptions,
            })))}
            wrongQuestions={sections.flatMap(s => s.questions.filter(q => wrongIds.has(q.id)).map(q => ({
              id: q.id, text: q.text, type: q.type, marks: q.marks,
              answer: q.answer, sectionTitle: s.title, sectionIcon: s.icon,
              codeBlock: q.codeBlock, answerCode: q.answerCode, mcqOptions: q.mcqOptions,
            })))}
            onRemoveStarred={removeStarred}
            onRemoveWrong={removeWrong}
            onClearAll={clearAllReview}
          />
          </>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#1e2d45] mt-8">
          <div className="mb-3">
            <span className="text-[#e2e8f0] font-bold text-lg">Mahmoud ABD ELKream</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://github.com/Mahmoud-ABDALKream" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://mahmoud-ahmed-abdelkream.vercel.app/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 20h6l4.5-8.5L16.5 20h6L12 0zm0 7.5L8.25 14.5h7.5L12 7.5z"/></svg>
              Portfolio
            </a>
            <a href="https://www.linkedin.com/in/mahmoud-ahmed-abdelkream/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
          <div className="text-[#64748b] text-sm">
            Technical English 2 Quiz — <span className="text-[#10b981]">Mahmoud ABD ELKream</span>
          </div>
        </footer>
      </div>

      <ScrollToTop />
    </div>
  )
}

// ─── Score Panel ──────────────────────────────────────
function ScorePanel({
  correctCount,
  totalQuestions,
  answeredCount,
  onReset,
  onRevealAll,
  timeTaken,
}: {
  correctCount: number
  totalQuestions: number
  answeredCount: number
  onReset: () => void
  onRevealAll: () => void
  timeTaken?: number
}) {
  const pct = Math.round((correctCount / totalQuestions) * 100)
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F'
  const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 mt-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <h2 className="text-2xl font-black mb-2">Your Score</h2>
      <p className="text-[#64748b] text-sm mb-6">Total verified answers</p>

      {/* Score Circle */}
      <div className="relative w-[160px] h-[160px] mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1e2d45" strokeWidth="10" />
          <motion.circle
            cx="80" cy="80" r="70" fill="none"
            stroke="url(#scoreGradTe2)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * pct / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGradTe2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-black bg-gradient-to-r from-[#10b981] to-[#f59e0b] bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {pct}%
          </motion.div>
          <div className="text-xs text-[#64748b]">Score</div>
        </div>
      </div>

      {/* Grade */}
      <motion.div
        className="inline-block text-5xl font-black px-8 py-2 rounded-2xl mb-6"
        style={{ color: gradeColor, background: `${gradeColor}15`, border: `2px solid ${gradeColor}40` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {grade}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#10b981]">{correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Correct</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#ef4444]">{answeredCount - correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Wrong</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#10b981]">{totalQuestions - answeredCount}</div>
          <div className="text-[11px] text-[#64748b]">Unanswered</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#f59e0b]">{totalQuestions}</div>
          <div className="text-[11px] text-[#64748b]">Total</div>
        </div>
        {timeTaken != null && timeTaken > 0 && (
          <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-xl font-black text-[#8b5cf6]">{formatDuration(timeTaken)}</div>
            <div className="text-[11px] text-[#64748b]">Time Taken</div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRevealAll}
          className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          Show All Solutions
        </button>
        <button
          onClick={onReset}
          className="bg-transparent text-[#64748b] border-2 border-[#1e2d45] rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:border-[#10b981] hover:text-[#10b981] transition-all"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  )
}

// ─── Question Card ────────────────────────────────────
function QuestionCard({
  question,
  sectionTitle,
  sectionIcon,
  state,
  onUpdate,
  onCheckMcq,
  onCheckFill,
  onCheckDefinition,
  onCheckArrange,
  onCheckTranslation,
  onRevealSolution,
  onHideSolution,
  onReset,
  isStarred,
  onToggleStar,
  index,
}: {
  question: Question
  sectionTitle: string
  sectionIcon: string
  state: QuestionState
  onUpdate: (qId: number, update: Partial<QuestionState>) => void
  onCheckMcq: () => void
  onCheckFill: () => void
  onCheckDefinition: () => void
  onCheckArrange: () => void
  onCheckTranslation: () => void
  onRevealSolution: () => void
  onHideSolution: () => void
  onReset: () => void
  isStarred: boolean
  onToggleStar: () => void
  index: number
}) {
  const isMcqOrTf = question.type === 'mcq' || question.type === 'tf'

  const statusColor = state.isChecked
    ? state.isCorrect === true
      ? '#10b981'
      : state.isCorrect === false
      ? '#ef4444'
      : '#f59e0b'
    : state.isSolutionRevealed
    ? '#10b981'
    : '#1e2d45'

  const statusBg = state.isChecked
    ? state.isCorrect === true
      ? 'rgba(16,185,129,0.05)'
      : state.isCorrect === false
      ? 'rgba(239,68,68,0.05)'
      : 'rgba(245,158,11,0.05)'
    : 'transparent'

  // For arrange type: compute shuffled word indices deterministically
  const shuffledIndices = useMemo(() => {
    if (question.type !== 'arrange' || !question.arrangeWords) return []
    const indices = question.arrangeWords.map((_, i) => i)
    return seededShuffle(indices, question.id * 31 + 7)
  }, [question])

  const arrangedSet = new Set(state.arrangedWords)

  // Add a word from pool to answer area
  const addWord = (wordIdx: number) => {
    if (state.isChecked) return
    onUpdate(question.id, { arrangedWords: [...state.arrangedWords, wordIdx] })
  }

  // Remove a word from answer area (send back to pool)
  const removeWord = (position: number) => {
    if (state.isChecked) return
    const next = [...state.arrangedWords]
    next.splice(position, 1)
    onUpdate(question.id, { arrangedWords: next })
  }

  // Determine check handler for each type
  const handleCheck = () => {
    if (question.type === 'mcq' || question.type === 'tf') onCheckMcq()
    else if (question.type === 'fill') onCheckFill()
    else if (question.type === 'definition') onCheckDefinition()
    else if (question.type === 'arrange') onCheckArrange()
    else if (question.type === 'translation') onCheckTranslation()
  }

  // Determine if check button should be disabled
  const isCheckDisabled = (() => {
    if (question.type === 'mcq' || question.type === 'tf') return !state.selectedMcq
    if (question.type === 'fill') return !question.fillItems?.some((_, idx) => (state.fillAnswers[idx] || '').trim().length > 0)
    if (question.type === 'definition') return !state.definitionAnswer.trim()
    if (question.type === 'arrange') return state.arrangedWords.length === 0
    if (question.type === 'translation') return !state.translationAnswer.trim()
    return false
  })()

  // Type badge label
  const typeBadge = (() => {
    switch (question.type) {
      case 'mcq': return 'MCQ'
      case 'tf': return 'T/F'
      case 'definition': return 'Def'
      case 'arrange': return 'Arrange'
      case 'translation': return 'Trans'
      case 'fill': return 'Fill'
      default: return 'Code'
    }
  })()

  const typeBadgeClass = (() => {
    switch (question.type) {
      case 'mcq': return 'bg-[#10b981]/20 text-[#34d399]'
      case 'tf': return 'bg-[#ec4899]/20 text-[#f472b6]'
      case 'definition': return 'bg-[#f59e0b]/20 text-[#fbbf24]'
      case 'arrange': return 'bg-[#8b5cf6]/20 text-[#a78bfa]'
      case 'translation': return 'bg-[#06b6d4]/20 text-[#22d3ee]'
      case 'fill': return 'bg-[#10b981]/20 text-[#34d399]'
      default: return 'bg-[#10b981]/20 text-[#34d399]'
    }
  })()

  return (
    <motion.div
      className="bg-[#111827] rounded-2xl mb-5 overflow-hidden transition-all duration-300"
      style={{ border: `1.5px solid ${statusColor}`, boxShadow: state.isChecked ? `0 0 20px ${statusColor}15` : 'none' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5 p-5 pb-3" style={{ background: statusBg }}>
        <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 transition-colors ${
          state.isChecked && state.isCorrect === true
            ? 'bg-[#10b981] text-white'
            : state.isChecked && state.isCorrect === false
            ? 'bg-[#ef4444] text-white'
            : state.isChecked
            ? 'bg-[#f59e0b] text-white'
            : state.isSolutionRevealed
            ? 'bg-[#10b981] text-white'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#10b981]'
        }`}>
          {state.isChecked && state.isCorrect === true ? '✓' :
           state.isChecked && state.isCorrect === false ? '✗' :
           state.isChecked ? '∼' :
           String(question.id).padStart(2, '0')}
        </div>
        <div className="text-[15px] leading-relaxed flex-1 font-medium">
          {question.text}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Star button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleStar() }}
            className="relative flex items-center justify-center cursor-pointer"
            style={{
              width: 34, height: 34, borderRadius: 12, padding: 0, fontSize: 16, lineHeight: 1,
              border: isStarred ? '1.5px solid rgba(245,158,11,0.4)' : '1.5px solid rgba(71,85,105,0.3)',
              background: isStarred ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))' : 'rgba(30,45,69,0.5)',
              color: isStarred ? '#f59e0b' : '#475569',
              boxShadow: isStarred ? '0 0 12px rgba(245,158,11,0.2), inset 0 1px 0 rgba(245,158,11,0.1)' : 'none',
              transition: 'color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
            title={isStarred ? 'Remove from review' : 'Star for review'}
          >
            <span key={isStarred ? 'on' : 'off'} className={isStarred ? 'star-icon-anim' : ''}>
              {isStarred ? '★' : '☆'}
            </span>
          </button>
          <div className="text-[11px] text-[#64748b] bg-[#1a2235] px-2.5 py-1 rounded-lg whitespace-nowrap border border-[#1e2d45]">
            {question.marks}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${typeBadgeClass}`}>
            {typeBadge}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Hint */}
        {question.hint && !state.isChecked && !state.isSolutionRevealed && (
          <div className="inline-flex items-center gap-1.5 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#f59e0b] text-xs px-3 py-1.5 rounded-lg mb-3">
            <span>💡</span>
            {question.hint}
          </div>
        )}

        {/* ── MCQ/TF Options ── */}
        {isMcqOrTf && question.mcqOptions && (
          <div className={`grid gap-2.5 mt-3 ${question.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {question.mcqOptions.map(opt => {
              const isSelected = state.selectedMcq === opt.letter
              const showResult = state.isChecked || state.isSolutionRevealed

              return (
                <button
                  key={opt.letter}
                  onClick={() => {
                    if (!state.isChecked) {
                      onUpdate(question.id, { selectedMcq: opt.letter })
                    }
                  }}
                  disabled={state.isChecked}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-sm text-left transition-all duration-200 cursor-pointer ${
                    showResult && opt.isCorrect
                      ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'border-[#ef4444] bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
                      : showResult && !opt.isCorrect
                      ? 'border-[#1e2d45] bg-[#0d1117] text-[#475569] opacity-50'
                      : isSelected
                      ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] text-[#6ee7b7] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-[#1e2d45] bg-[#0d1117] text-[#e2e8f0] hover:border-[#10b981]/50 hover:bg-[rgba(16,185,129,0.05)]'
                  }`}
                >
                  <span className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors ${
                    showResult && opt.isCorrect
                      ? 'bg-[#10b981] text-white'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'bg-[#ef4444] text-white'
                      : isSelected
                      ? 'bg-[#10b981] text-white'
                      : 'bg-[#1e2d45] text-[#e2e8f0]'
                  }`}>
                    {showResult && opt.isCorrect ? '✓' :
                     showResult && isSelected && !opt.isCorrect ? '✗' :
                     opt.letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Definition Type ── */}
        {question.type === 'definition' && (
          <div className="mt-3">
            <label className="text-xs text-[#64748b] font-mono mb-1.5 block">Type the term being defined:</label>
            <div className="relative">
              <input
                type="text"
                value={state.definitionAnswer}
                onChange={e => {
                  if (!state.isChecked) {
                    onUpdate(question.id, { definitionAnswer: e.target.value })
                  }
                }}
                disabled={state.isChecked}
                placeholder="Enter the term..."
                dir="ltr"
                className={`w-full px-4 py-3 rounded-xl font-mono text-sm border transition-all duration-200 outline-none ${
                  state.isChecked && state.isCorrect === true
                    ? 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]'
                    : state.isChecked && state.isCorrect === false
                    ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'
                    : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#10b981] focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                }`}
              />
              {state.isChecked && state.isCorrect === false && (
                <motion.span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10b981] font-mono text-sm font-bold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  dir="ltr"
                >
                  {question.answer}
                </motion.span>
              )}
            </div>
          </div>
        )}

        {/* ── Arrange Type ── */}
        {question.type === 'arrange' && question.arrangeWords && (
          <div className="mt-3">
            {/* Answer area - shows words the user has selected in order */}
            <div className="min-h-[56px] bg-[#0d1117] border border-[#1e2d45] rounded-xl p-3 mb-3 flex flex-wrap gap-2 items-center">
              {state.arrangedWords.length === 0 ? (
                <span className="text-[#334155] text-sm">Click words below to arrange them in order...</span>
              ) : (
                state.arrangedWords.map((wordIdx, pos) => {
                  const word = question.arrangeWords![wordIdx]
                  const isCorrectPosition = state.isChecked
                    ? question.answer.split(' ')[pos] === word
                    : null
                  return (
                    <button
                      key={`arranged-${pos}-${wordIdx}`}
                      onClick={() => removeWord(pos)}
                      disabled={state.isChecked}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer ${
                        state.isChecked && isCorrectPosition
                          ? 'bg-[rgba(16,185,129,0.15)] border-[#10b981] text-[#10b981]'
                          : state.isChecked && !isCorrectPosition
                          ? 'bg-[rgba(239,68,68,0.15)] border-[#ef4444] text-[#ef4444]'
                          : 'bg-[rgba(16,185,129,0.1)] border-[#10b981]/40 text-[#6ee7b7] hover:border-[#10b981] hover:bg-[rgba(16,185,129,0.2)]'
                      }`}
                    >
                      {word}
                    </button>
                  )
                })
              )}
            </div>

            {/* Word pool - shuffled words to click */}
            <div className="flex flex-wrap gap-2">
              {shuffledIndices.map(idx => {
                const word = question.arrangeWords![idx]
                const isUsed = arrangedSet.has(idx)
                return (
                  <button
                    key={`pool-${idx}`}
                    onClick={() => addWord(idx)}
                    disabled={isUsed || state.isChecked}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer ${
                      isUsed
                        ? 'bg-[#1a2235] border-[#1e2d45] text-[#334155] opacity-30 cursor-not-allowed'
                        : 'bg-[#1a2235] border-[#1e2d45] text-[#e2e8f0] hover:border-[#f59e0b]/50 hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.05)]'
                    }`}
                  >
                    {word}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Translation Type ── */}
        {question.type === 'translation' && (
          <div className="mt-3">
            {/* Translation direction badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-3 py-1 rounded-lg font-bold ${
                question.translationDir === 'en-to-ar'
                  ? 'bg-[#06b6d4]/20 text-[#22d3ee] border border-[#06b6d4]/30'
                  : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30'
              }`}>
                {question.translationDir === 'en-to-ar' ? 'EN → AR' : 'AR → EN'}
              </span>
            </div>
            {/* Source text */}
            <div className="bg-[#0d1117] border border-[#1e2d45] rounded-xl p-4 mb-3 text-sm leading-relaxed max-h-40 overflow-y-auto" dir={question.translationDir === 'en-to-ar' ? 'ltr' : 'rtl'}>
              {question.text}
            </div>
            {/* Translation textarea */}
            <textarea
              value={state.translationAnswer}
              onChange={e => {
                if (!state.isChecked) {
                  onUpdate(question.id, { translationAnswer: e.target.value })
                }
              }}
              disabled={state.isChecked}
              placeholder={question.translationDir === 'en-to-ar' ? 'Write your Arabic translation here...' : 'Write your English translation here...'}
              dir={question.translationDir === 'en-to-ar' ? 'rtl' : 'ltr'}
              className="w-full bg-[#0d1117] border border-[#1e2d45] rounded-xl p-4 text-sm min-h-[120px] resize-y outline-none transition-all duration-200 focus:border-[#10b981] focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] placeholder:text-[#334155] text-[#e2e8f0]"
            />
          </div>
        )}

        {/* ── Fill in the blank ── */}
        {question.type === 'fill' && question.fillItems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {question.fillItems.map((item, idx) => {
              const showAnswer = (state.isChecked && state.fillCorrect[idx] === false) || state.isSolutionRevealed
              const isCorrect = state.fillCorrect[idx]
              const isWrong = state.isChecked && state.fillCorrect[idx] === false

              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#64748b] font-mono" dir="ltr">{item.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={state.fillAnswers[idx] || ''}
                      onChange={e => {
                        const newAnswers = { ...state.fillAnswers, [idx]: e.target.value }
                        onUpdate(question.id, { fillAnswers: newAnswers })
                      }}
                      disabled={state.isChecked}
                      placeholder="???"
                      dir="ltr"
                      className={`w-full px-3 py-2.5 rounded-lg font-mono text-sm border transition-all duration-200 outline-none ${
                        state.isChecked && isCorrect
                          ? 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]'
                          : isWrong
                          ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'
                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#10b981] focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      }`}
                    />
                    {isWrong && (
                      <motion.span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10b981] font-mono text-sm font-bold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        dir="ltr"
                      >
                        {item.answer}
                      </motion.span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex gap-2.5 mt-4 flex-wrap justify-end">
          {/* Check Answer */}
          {!state.isChecked && (
            <button
              onClick={handleCheck}
              disabled={isCheckDisabled}
              className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Check ✓
            </button>
          )}

          {/* Show/Hide Solution */}
          {!state.isSolutionRevealed ? (
            <button
              onClick={onRevealSolution}
              className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(16,185,129,0.25)] transition-all"
            >
              Show Solution
            </button>
          ) : (
            <button
              onClick={onHideSolution}
              className="bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[#f59e0b]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(245,158,11,0.2)] transition-all"
            >
              Hide Solution
            </button>
          )}

          {/* Reset */}
          {state.isChecked && (
            <button
              onClick={onReset}
              className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-sm cursor-pointer hover:border-[#64748b] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* ── Feedback Message ── */}
        <AnimatePresence>
          {state.isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                state.isCorrect === true
                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]'
                  : state.isCorrect === false
                  ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[#fca5a5]'
                  : 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'
              }`}>
                <span className="text-lg">
                  {state.isCorrect === true ? '✅' : state.isCorrect === false ? '❌' : '📖'}
                </span>
                <span className="font-bold">
                  {state.isCorrect === true ? 'Correct answer! Well done' :
                   state.isCorrect === false ? 'Wrong answer — check the solution below' :
                   'Submitted — review the model answer below'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Solution Section ── */}
        <AnimatePresence>
          {state.isSolutionRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 rounded-xl bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] text-[#6ee7b7]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#10b981] text-lg">💡</span>
                  <span className="font-black text-[#10b981]">Model Answer:</span>
                </div>
                {/* For translation, show answer in the appropriate direction */}
                <div className="text-sm leading-relaxed mb-3" dir={question.type === 'translation' && question.translationDir === 'en-to-ar' ? 'rtl' : question.type === 'translation' && question.translationDir === 'ar-to-en' ? 'ltr' : 'auto'}>
                  {question.answer}
                </div>
                {isMcqOrTf && question.mcqOptions && (
                  <div className="mt-2 text-xs text-[#6ee7b7]/70">
                    Correct answer: {question.mcqOptions.find(o => o.isCorrect)?.letter} — {question.mcqOptions.find(o => o.isCorrect)?.text}
                  </div>
                )}
                {question.type === 'arrange' && question.arrangeWords && (
                  <div className="mt-2 text-xs text-[#6ee7b7]/70">
                    Correct order: {question.answer}
                  </div>
                )}
                {question.type === 'definition' && (
                  <div className="mt-2 text-xs text-[#6ee7b7]/70">
                    Term: {question.answer}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

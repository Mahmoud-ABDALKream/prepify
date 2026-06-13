'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from '@/components/ScrollToTop'
import { cpSections } from '@/data/cp-sections'
import { csSections } from '@/data/cs-sections'
import { iotSections } from '@/data/iot-sections'
import { Section, Question } from '@/data/types'

// ─── Subject Config ─────────────────────────────────────
const subjectConfig = [
  {
    key: 'cp',
    name: 'C Programming',
    icon: '{ }',
    color: '#7c3aed',
    gradient: 'from-[#7c3aed] to-[#00d4ff]',
    sections: cpSections,
    examPath: '/c-programming',
  },
  {
    key: 'cs',
    name: 'Cyber Security',
    icon: 'CS',
    color: '#ef4444',
    gradient: 'from-[#ef4444] to-[#dc2626]',
    sections: csSections,
    examPath: '/cyber-security-2',
  },
  {
    key: 'iot',
    name: 'Internet of Things',
    icon: 'IoT',
    color: '#10b981',
    gradient: 'from-[#10b981] to-[#059669]',
    sections: iotSections,
    examPath: '/iot',
  },
]

// ─── Types ──────────────────────────────────────────────
interface ReviewData {
  starred: number[]
  wrong: number[]
}

interface ReviewQuestion extends Question {
  sectionTitle: string
  sectionIcon: string
  source: 'starred' | 'wrong'
}

// ─── Helpers ────────────────────────────────────────────
function loadReviewData(subjectKey: string): ReviewData {
  try {
    const saved = localStorage.getItem(`prepify-${subjectKey}-review`)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return { starred: [], wrong: [] }
}

function getReviewQuestions(
  sections: Section[],
  data: ReviewData
): ReviewQuestion[] {
  const wrongSet = new Set(data.wrong)
  const starredSet = new Set(data.starred)
  const questions: ReviewQuestion[] = []

  for (const section of sections) {
    for (const q of section.questions) {
      const isWrong = wrongSet.has(q.id)
      const isStarred = starredSet.has(q.id)
      if (isWrong) {
        questions.push({ ...q, sectionTitle: section.title, sectionIcon: section.icon, source: 'wrong' })
      } else if (isStarred) {
        questions.push({ ...q, sectionTitle: section.title, sectionIcon: section.icon, source: 'starred' })
      }
    }
  }

  return questions
}

// ─── Component ──────────────────────────────────────────
export default function ReviewPage() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'wrong' | 'starred'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [reviewDataMap, setReviewDataMap] = useState<Record<string, ReviewData>>({})
  const [hydrated, setHydrated] = useState(false)

  // Load all review data on mount
  useEffect(() => {
    const map: Record<string, ReviewData> = {}
    for (const subj of subjectConfig) {
      map[subj.key] = loadReviewData(subj.key)
    }
    setReviewDataMap(map)
    setHydrated(true)
  }, [])

  // Compute total counts
  const subjectCounts = subjectConfig.map(subj => {
    const data = reviewDataMap[subj.key] || { starred: [], wrong: [] }
    const wrongSet = new Set(data.wrong)
    const starredSet = new Set(data.starred)
    // Count unique (a question can be both wrong and starred)
    const uniqueIds = new Set([...data.wrong, ...data.starred])
    return {
      key: subj.key,
      wrongCount: data.wrong.length,
      starredCount: data.starred.length,
      totalCount: uniqueIds.size,
    }
  })

  const grandTotal = subjectCounts.reduce((acc, s) => acc + s.totalCount, 0)

  const toggleExpand = (qId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  const removeQuestion = (subjectKey: string, qId: number, source: 'starred' | 'wrong') => {
    setReviewDataMap(prev => {
      const current = prev[subjectKey] || { starred: [], wrong: [] }
      const updated = { ...current }
      if (source === 'starred') {
        updated.starred = current.starred.filter(id => id !== qId)
      } else {
        updated.wrong = current.wrong.filter(id => id !== qId)
      }
      // Save to localStorage
      try {
        localStorage.setItem(`prepify-${subjectKey}-review`, JSON.stringify(updated))
      } catch { /* ignore */ }
      return { ...prev, [subjectKey]: updated }
    })
  }

  const clearSubject = (subjectKey: string) => {
    setReviewDataMap(prev => {
      const updated = { starred: [], wrong: [] }
      try {
        localStorage.removeItem(`prepify-${subjectKey}-review`)
      } catch { /* ignore */ }
      return { ...prev, [subjectKey]: updated }
    })
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* ─── Navbar ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#080c18]/85 border-b border-[#1e2d45]/60"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[68px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/logo.png" alt="Prepify" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-shadow" />
            <span className="font-black text-lg bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Prepify</span>
          </a>
          <div className="flex items-center gap-2">
            <a href="/" className="text-[#94a3b8] hover:text-[#00d4ff] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(0,212,255,0.06)] transition-all">Home</a>
            <a href="/review" className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white rounded-lg px-4 py-2 text-[13px] font-bold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              📝 Review
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ─── Main Content ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent">📝 Review</span>{' '}
            Questions
          </h1>
          <p className="text-[#64748b] text-sm sm:text-base max-w-lg mx-auto">
            All your starred and wrong questions in one place, organized by subject. Click to expand and see solutions.
          </p>
        </motion.div>

        {/* Stats overview */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#ef4444]">
              {subjectCounts.reduce((a, s) => a + s.wrongCount, 0)}
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">Wrong</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#f59e0b]">
              {subjectCounts.reduce((a, s) => a + s.starredCount, 0)}
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">Starred</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#00d4ff]">{grandTotal}</div>
            <div className="text-[11px] text-[#64748b] mt-1">Total</div>
          </div>
        </motion.div>

        {/* Subject Tabs */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveSubject(null)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all ${
              activeSubject === null
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                : 'bg-[#1a2235] text-[#64748b] border border-[#1e2d45] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]'
            }`}
          >
            All Subjects ({grandTotal})
          </button>
          {subjectConfig.map((subj, idx) => (
            <button
              key={subj.key}
              onClick={() => setActiveSubject(subj.key)}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubject === subj.key
                  ? 'text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                  : 'bg-[#1a2235] text-[#64748b] border border-[#1e2d45] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]'
              }`}
              style={activeSubject === subj.key ? {
                background: `linear-gradient(135deg, ${subj.color}, ${subj.color}88)`,
              } : {}}
            >
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black" style={{ background: `${subj.color}33`, color: subj.color }}>
                {subj.icon}
              </span>
              {subj.name} ({subjectCounts[idx].totalCount})
            </button>
          ))}
        </motion.div>

        {/* Subject Sections */}
        <AnimatePresence mode="wait">
          {subjectConfig
            .filter(subj => activeSubject === null || activeSubject === subj.key)
            .map(subj => {
              const data = reviewDataMap[subj.key] || { starred: [], wrong: [] }
              const questions = getReviewQuestions(subj.sections, data)

              if (questions.length === 0) return null

              const wrongQuestions = questions.filter(q => q.source === 'wrong')
              const starredQuestions = questions.filter(q => q.source === 'starred')
              const wrongSet = new Set(data.wrong)
              const starredOnly = starredQuestions.filter(q => !wrongSet.has(q.id))

              return (
                <motion.div
                  key={subj.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ background: `${subj.color}20`, color: subj.color, border: `1px solid ${subj.color}40` }}
                      >
                        {subj.icon}
                      </div>
                      <div>
                        <h2 className="text-lg font-black" style={{ color: subj.color }}>{subj.name}</h2>
                        <p className="text-[11px] text-[#64748b]">
                          {wrongQuestions.length} wrong · {starredQuestions.length} starred · {questions.length} total
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={subj.examPath}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#1e2d45] text-[#64748b] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all"
                      >
                        Go to Exam →
                      </a>
                      <button
                        onClick={() => clearSubject(subj.key)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-4">
                    {[
                      { key: 'all' as const, label: 'All', count: questions.length },
                      { key: 'wrong' as const, label: 'Wrong', count: wrongQuestions.length },
                      { key: 'starred' as const, label: 'Starred', count: starredQuestions.length },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          activeTab === tab.key
                            ? 'bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                            : 'bg-[#1a2235] text-[#64748b] border border-[#1e2d45] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {questions
                        .filter(q => activeTab === 'all' || q.source === activeTab)
                        .map((q, idx) => (
                          <motion.div
                            key={`${subj.key}-${q.id}-${q.source}`}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50, height: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.02 }}
                            className="bg-[#0d1117] border rounded-2xl overflow-hidden"
                            style={{
                              borderColor: q.source === 'wrong' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
                            }}
                          >
                            {/* Question Header */}
                            <div
                              className="flex items-start gap-3 p-4 cursor-pointer hover:bg-[#111827] transition-colors"
                              onClick={() => toggleExpand(q.id)}
                            >
                              {/* Badge */}
                              <div className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                                q.source === 'wrong'
                                  ? 'bg-[#ef4444]/20 text-[#ef4444]'
                                  : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                              }`}>
                                {q.source === 'wrong' ? '✗' : '★'}
                              </div>

                              {/* Question text */}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[#e2e8f0] leading-relaxed line-clamp-2">
                                  {q.text}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-[10px] text-[#64748b]">{q.sectionIcon} {q.sectionTitle}</span>
                                  <span className="text-[10px] text-[#1e2d45]">|</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    q.type === 'mcq' ? 'bg-[#7c3aed]/20 text-[#a78bfa]' :
                                    q.type === 'tf' ? 'bg-[#ec4899]/20 text-[#f472b6]' :
                                    q.type === 'trace' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
                                    q.type === 'fill' ? 'bg-[#00d4ff]/20 text-[#22d3ee]' :
                                    'bg-[#10b981]/20 text-[#34d399]'
                                  }`}>
                                    {q.type === 'mcq' ? 'MCQ' :
                                     q.type === 'tf' ? 'T/F' :
                                     q.type === 'trace' ? 'Trace' :
                                     q.type === 'fill' ? 'Fill' : 'Code'}
                                  </span>
                                  <span className="text-[10px] text-[#64748b]">{q.marks}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Remove button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeQuestion(subj.key, q.id, q.source)
                                  }}
                                  className="w-[28px] h-[28px] rounded-lg bg-[#1a2235] border border-[#1e2d45] flex items-center justify-center text-[#64748b] hover:text-[#ef4444] hover:border-[#ef4444]/30 transition-colors cursor-pointer text-xs"
                                  title="Remove from review"
                                >
                                  ✕
                                </button>
                                {/* Expand arrow */}
                                <motion.svg
                                  className="w-4 h-4 text-[#64748b]"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  animate={{ rotate: expandedIds.has(q.id) ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                              </div>
                            </div>

                            {/* Expanded Solution */}
                            <AnimatePresence>
                              {expandedIds.has(q.id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 border-t border-[#1e2d45]">
                                    {/* Code block if present */}
                                    {q.codeBlock && (
                                      <pre className="bg-[#080c18] border border-[#1e2d45] rounded-xl p-3 my-3 font-mono text-xs leading-relaxed text-left whitespace-pre-wrap text-[#a5b4fc]" dir="ltr">
                                        {q.codeBlock}
                                      </pre>
                                    )}

                                    {/* MCQ options if present */}
                                    {q.mcqOptions && (
                                      <div className="grid gap-1.5 my-3">
                                        {q.mcqOptions.map(opt => (
                                          <div
                                            key={opt.letter}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                              opt.isCorrect
                                                ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]'
                                                : 'bg-[#0d1117] border border-[#1e2d45] text-[#475569]'
                                            }`}
                                          >
                                            <span className={`w-[22px] h-[22px] rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                              opt.isCorrect ? 'bg-[#10b981] text-white' : 'bg-[#1e2d45] text-[#64748b]'
                                            }`}>
                                              {opt.letter}
                                            </span>
                                            <span>{opt.text}</span>
                                            {opt.isCorrect && <span className="ml-auto text-[#10b981]">✓</span>}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Answer */}
                                    <div className="mt-3 p-3.5 rounded-xl bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)]">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#00d4ff]">💡</span>
                                        <span className="font-bold text-[#00d4ff] text-xs">Solution:</span>
                                      </div>
                                      <div className="text-xs text-[#6ee7b7] leading-relaxed">{q.answer}</div>
                                      {q.answerCode && (
                                        <pre className="bg-[#080c18] border border-[#1e2d45] rounded-lg p-3 mt-2 font-mono text-[11px] whitespace-pre-wrap text-left text-[#a5b4fc]" dir="ltr">
                                          {q.answerCode}
                                        </pre>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>

                  {questions.filter(q => activeTab === 'all' || q.source === activeTab).length === 0 && (
                    <div className="text-center py-8 text-[#64748b] text-sm bg-[#111827] border border-[#1e2d45] rounded-2xl">
                      No questions in this category.
                    </div>
                  )}
                </motion.div>
              )
            })}
        </AnimatePresence>

        {/* Empty State */}
        {grandTotal === 0 && (
          <motion.div
            className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black mb-2 text-[#e2e8f0]">No Questions to Review</h3>
            <p className="text-[#64748b] text-sm max-w-md mx-auto mb-6">
              You haven&apos;t starred any questions and all your answers were correct. Take an exam to start building your review list!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {subjectConfig.map(subj => (
                <a
                  key={subj.key}
                  href={subj.examPath}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${subj.color}, ${subj.color}88)`,
                    color: 'white',
                    boxShadow: `0 0 15px ${subj.color}33`,
                  }}
                >
                  {subj.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2d45] py-6 text-center text-[#64748b] text-xs">
        Prepify — Mahmoud ABD ELKream
      </footer>

      <ScrollToTop />
    </div>
  )
}

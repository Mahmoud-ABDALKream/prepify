'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────
interface ReviewQuestion {
  id: number
  text: string
  type: string
  marks: string
  answer: string
  sectionTitle: string
  sectionIcon: string
  codeBlock?: string
  answerCode?: string
  mcqOptions?: { letter: string; text: string; isCorrect: boolean }[]
}

interface ReviewPanelProps {
  subjectName: string
  subjectColor: string
  starredQuestions: ReviewQuestion[]
  wrongQuestions: ReviewQuestion[]
  onRemoveStarred: (qId: number) => void
  onRemoveWrong: (qId: number) => void
  onClearAll: () => void
}

// ─── Component ───────────────────────────────────────
export default function ReviewPanel({
  subjectName,
  subjectColor,
  starredQuestions,
  wrongQuestions,
  onRemoveStarred,
  onRemoveWrong,
  onClearAll,
}: ReviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'wrong' | 'starred' | 'all'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const totalReview = starredQuestions.length + wrongQuestions.length
  const allQuestions = [
    ...wrongQuestions.map(q => ({ ...q, source: 'wrong' as const })),
    ...starredQuestions
      .filter(sq => !wrongQuestions.some(wq => wq.id === sq.id))
      .map(q => ({ ...q, source: 'starred' as const })),
  ]

  const filteredQuestions = activeTab === 'wrong'
    ? allQuestions.filter(q => q.source === 'wrong')
    : activeTab === 'starred'
    ? allQuestions.filter(q => q.source === 'starred')
    : allQuestions

  const toggleExpand = (qId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  if (totalReview === 0) {
    return (
      <motion.div
        className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-black mb-2 text-[#e2e8f0]">No Questions to Review</h3>
        <p className="text-[#64748b] text-sm">
          You haven&apos;t starred any questions and all your answers were correct. Great job!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-6 sm:p-8 mt-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span style={{ color: subjectColor }}>Review Questions</span>
          </h3>
          <p className="text-[#64748b] text-sm mt-1">
            {subjectName} — {totalReview} question{totalReview !== 1 ? 's' : ''} to review
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="bg-transparent text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-4 py-2 text-xs font-bold cursor-pointer hover:bg-[#ef4444]/10 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-3 text-center">
          <div className="text-lg font-black text-[#ef4444]">{wrongQuestions.length}</div>
          <div className="text-[10px] text-[#64748b]">Wrong</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-3 text-center">
          <div className="text-lg font-black text-[#f59e0b]">{starredQuestions.length}</div>
          <div className="text-[10px] text-[#64748b]">Starred</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-3 text-center">
          <div className="text-lg font-black text-[#00d4ff]">{totalReview}</div>
          <div className="text-[10px] text-[#64748b]">Total</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all' as const, label: 'All', count: allQuestions.length },
          { key: 'wrong' as const, label: 'Wrong', count: wrongQuestions.length },
          { key: 'starred' as const, label: 'Starred', count: starredQuestions.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
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
          {filteredQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, height: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
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
                      if (q.source === 'wrong') onRemoveWrong(q.id)
                      else onRemoveStarred(q.id)
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

      {filteredQuestions.length === 0 && (
        <div className="text-center py-8 text-[#64748b] text-sm">
          No questions in this category.
        </div>
      )}
    </motion.div>
  )
}

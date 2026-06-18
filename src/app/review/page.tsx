'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from '@/components/ScrollToTop'
import { cpSections } from '@/data/cp-sections'
import { csSections } from '@/data/cs-sections'
import { iotSections } from '@/data/iot-sections'
import { te2Sections } from '@/data/te2-sections'
import { msOfficeSections } from '@/data/ms-office-sections'
import { Section, Question } from '@/data/types'

// ─── Subject Config ─────────────────────────────────────
const subjectConfig = [
  {
    key: 'msoffice',
    name: 'Microsoft Office',
    icon: 'MS',
    color: '#f59e0b',
    gradient: 'from-[#f59e0b] to-[#d97706]',
    sections: msOfficeSections,
    examPath: '/microsoft-office',
    isNew: true,
  },
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
    key: 'cs2',
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
  {
    key: 'te2',
    name: 'Technical English 2',
    icon: 'En',
    color: '#3b82f6',
    gradient: 'from-[#3b82f6] to-[#2563eb]',
    sections: te2Sections,
    examPath: '/technical-english-2',
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
  subjectKey: string
  subjectName: string
  subjectColor: string
  subjectIcon: string
  examPath: string
}

// ─── Helpers ────────────────────────────────────────────
function getValidQuestionIds(sections: Section[]): Set<number> {
  const ids = new Set<number>()
  for (const s of sections) for (const q of s.questions) ids.add(q.id)
  return ids
}

function loadReviewData(subjectKey: string, validIds?: Set<number>): ReviewData {
  try {
    const saved = localStorage.getItem(`prepify-${subjectKey}-review`)
    if (saved) {
      const data: ReviewData = JSON.parse(saved)
      if (validIds) {
        const oldStarred = data.starred.length
        const oldWrong = data.wrong.length
        data.starred = data.starred.filter(id => validIds.has(id))
        data.wrong = data.wrong.filter(id => validIds.has(id))
        if (data.starred.length !== oldStarred || data.wrong.length !== oldWrong) {
          try { localStorage.setItem(`prepify-${subjectKey}-review`, JSON.stringify(data)) } catch { /* ignore */ }
        }
      }
      return data
    }
  } catch { /* ignore */ }
  return { starred: [], wrong: [] }
}

// Build the global list of review questions across all subjects
function buildReviewList(reviewDataMap: Record<string, ReviewData>): ReviewQuestion[] {
  const list: ReviewQuestion[] = []
  for (const subj of subjectConfig) {
    const data = reviewDataMap[subj.key] || { starred: [], wrong: [] }
    const wrongSet = new Set(data.wrong)
    const starredSet = new Set(data.starred)
    for (const section of subj.sections) {
      for (const q of section.questions) {
        const isWrong = wrongSet.has(q.id)
        const isStarred = starredSet.has(q.id)
        if (isWrong) {
          list.push({
            ...q,
            sectionTitle: section.title,
            sectionIcon: section.icon,
            source: 'wrong',
            subjectKey: subj.key,
            subjectName: subj.name,
            subjectColor: subj.color,
            subjectIcon: subj.icon,
            examPath: subj.examPath,
          })
        } else if (isStarred) {
          list.push({
            ...q,
            sectionTitle: section.title,
            sectionIcon: section.icon,
            source: 'starred',
            subjectKey: subj.key,
            subjectName: subj.name,
            subjectColor: subj.color,
            subjectIcon: subj.icon,
            examPath: subj.examPath,
          })
        }
      }
    }
  }
  return list
}

// ─── Component ──────────────────────────────────────────
export default function ReviewPage() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'wrong' | 'starred'>('all')
  const [activeType, setActiveType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [reviewDataMap, setReviewDataMap] = useState<Record<string, ReviewData>>({})
  const [hydrated, setHydrated] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState<string | null>(null)

  // Load all review data on mount
  useEffect(() => {
    const map: Record<string, ReviewData> = {}
    for (const subj of subjectConfig) {
      const validIds = getValidQuestionIds(subj.sections)
      map[subj.key] = loadReviewData(subj.key, validIds)
    }
    setReviewDataMap(map)
    setHydrated(true)

    // Listen for changes in localStorage (e.g. when user stars something in another tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('prepify-') && e.key.endsWith('-review')) {
        const subjKey = e.key.replace('prepify-', '').replace('-review', '')
        if (subjectConfig.find(s => s.key === subjKey)) {
          setReviewDataMap(prev => ({
            ...prev,
            [subjKey]: loadReviewData(subjKey, getValidQuestionIds(
              subjectConfig.find(s => s.key === subjKey)?.sections || []
            )),
          }))
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Re-load when window regains focus (so users see updates after returning from an exam)
  useEffect(() => {
    const handleFocus = () => {
      const map: Record<string, ReviewData> = {}
      for (const subj of subjectConfig) {
        const validIds = getValidQuestionIds(subj.sections)
        map[subj.key] = loadReviewData(subj.key, validIds)
      }
      setReviewDataMap(map)
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Build global review list
  const allQuestions = useMemo(() => buildReviewList(reviewDataMap), [reviewDataMap])

  // Compute subject counts
  const subjectCounts = subjectConfig.map(subj => {
    const data = reviewDataMap[subj.key] || { starred: [], wrong: [] }
    const uniqueIds = new Set([...data.wrong, ...data.starred])
    return {
      key: subj.key,
      wrongCount: data.wrong.length,
      starredCount: data.starred.length,
      totalCount: uniqueIds.size,
    }
  })

  const grandTotalWrong = subjectCounts.reduce((a, s) => a + s.wrongCount, 0)
  const grandTotalStarred = subjectCounts.reduce((a, s) => a + s.starredCount, 0)
  const grandTotal = allQuestions.length

  // Get unique question types from the currently visible questions
  const availableTypes = useMemo(() => {
    const types = new Set<string>()
    for (const q of allQuestions) types.add(q.type)
    return Array.from(types).sort()
  }, [allQuestions])

  // Filter questions based on active filters + search
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      // Subject filter
      if (activeSubject && q.subjectKey !== activeSubject) return false
      // Source filter
      if (activeTab !== 'all' && q.source !== activeTab) return false
      // Type filter
      if (activeType !== 'all' && q.type !== activeType) return false
      // Search filter
      if (searchQuery.trim()) {
        const q2 = searchQuery.toLowerCase()
        const haystack = (q.text + ' ' + q.answer + ' ' + q.sectionTitle).toLowerCase()
        if (!haystack.includes(q2)) return false
      }
      return true
    })
  }, [allQuestions, activeSubject, activeTab, activeType, searchQuery])

  const toggleExpand = useCallback((uniqueKey: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(uniqueKey)) next.delete(uniqueKey)
      else next.add(uniqueKey)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(filteredQuestions.map(q => `${q.subjectKey}-${q.id}-${q.source}`)))
  }, [filteredQuestions])

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  const removeQuestion = useCallback((subjectKey: string, qId: number, source: 'starred' | 'wrong') => {
    setReviewDataMap(prev => {
      const current = prev[subjectKey] || { starred: [], wrong: [] }
      const updated = { ...current }
      if (source === 'starred') {
        updated.starred = current.starred.filter(id => id !== qId)
      } else {
        updated.wrong = current.wrong.filter(id => id !== qId)
      }
      try {
        localStorage.setItem(`prepify-${subjectKey}-review`, JSON.stringify(updated))
      } catch { /* ignore */ }
      return { ...prev, [subjectKey]: updated }
    })
  }, [])

  const clearSubject = useCallback((subjectKey: string) => {
    setReviewDataMap(prev => {
      const updated = { starred: [], wrong: [] }
      try {
        localStorage.removeItem(`prepify-${subjectKey}-review`)
      } catch { /* ignore */ }
      return { ...prev, [subjectKey]: updated }
    })
    setShowClearConfirm(null)
  }, [])

  const clearAll = useCallback(() => {
    setReviewDataMap(() => {
      const map: Record<string, ReviewData> = {}
      for (const subj of subjectConfig) {
        try { localStorage.removeItem(`prepify-${subj.key}-review`) } catch { /* ignore */ }
        map[subj.key] = { starred: [], wrong: [] }
      }
      return map
    })
    setShowClearConfirm(null)
  }, [])

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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent">📝 Review</span>{' '}
            Questions
          </h1>
          <p className="text-[#64748b] text-sm sm:text-base max-w-lg mx-auto">
            All your starred and wrong questions in one place. Search, filter, expand to see solutions, and clear when you&apos;re done.
          </p>
        </motion.div>

        {/* Stats overview */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#ef4444]">{grandTotalWrong}</div>
            <div className="text-[11px] text-[#64748b] mt-1">Wrong Answers</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#f59e0b]">{grandTotalStarred}</div>
            <div className="text-[11px] text-[#64748b] mt-1">Starred</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#00d4ff]">{grandTotal}</div>
            <div className="text-[11px] text-[#64748b] mt-1">Total to Review</div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions, answers, sections..."
              className="w-full bg-[#111827] border border-[#1e2d45] rounded-2xl pl-12 pr-12 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#7c3aed] focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-[#1a2235] hover:bg-[#ef4444]/20 text-[#64748b] hover:text-[#ef4444] flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* Subject Tabs */}
        <motion.div
          className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide"
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
              {subj.name}
              <span className="text-[10px] opacity-70">({subjectCounts[idx].totalCount})</span>
            </button>
          ))}
        </motion.div>

        {/* Filter Row: Source + Type + Actions */}
        <motion.div
          className="flex flex-wrap items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {/* Source filter */}
          <div className="flex gap-1.5 bg-[#111827] border border-[#1e2d45] rounded-xl p-1">
            {[
              { key: 'all' as const, label: '📋 All', count: grandTotal },
              { key: 'wrong' as const, label: '❌ Wrong', count: grandTotalWrong },
              { key: 'starred' as const, label: '⭐ Starred', count: grandTotalStarred },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                    : 'text-[#64748b] hover:text-[#00d4ff]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Type filter */}
          {availableTypes.length > 1 && (
            <select
              value={activeType}
              onChange={e => setActiveType(e.target.value)}
              className="bg-[#111827] border border-[#1e2d45] rounded-xl px-3 py-2 text-xs font-bold text-[#94a3b8] cursor-pointer focus:border-[#7c3aed] focus:outline-none transition-colors"
            >
              <option value="all">All Types</option>
              {availableTypes.map(t => (
                <option key={t} value={t}>
                  {t === 'mcq' ? 'MCQ' :
                   t === 'tf' ? 'True/False' :
                   t === 'trace' ? 'Trace' :
                   t === 'fill' ? 'Fill in Blank' :
                   t === 'definition' ? 'Definition' :
                   t === 'translation' ? 'Translation' :
                   t === 'arrange' ? 'Arrange' :
                   t === 'code' ? 'Code' : t}
                </option>
              ))}
            </select>
          )}

          {/* Expand/Collapse All */}
          <div className="ml-auto flex gap-1.5">
            <button
              onClick={expandAll}
              disabled={filteredQuestions.length === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#1e2d45] text-[#94a3b8] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              disabled={expandedIds.size === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#1e2d45] text-[#94a3b8] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Collapse All
            </button>
            {grandTotal > 0 && (
              <button
                onClick={() => setShowClearConfirm('all')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Results count */}
        {(searchQuery || activeTab !== 'all' || activeType !== 'all' || activeSubject) && (
          <div className="mb-3 text-xs text-[#64748b] flex items-center gap-2">
            <span>
              Showing <span className="text-[#00d4ff] font-bold">{filteredQuestions.length}</span> of {grandTotal} questions
            </span>
            {(searchQuery || activeTab !== 'all' || activeType !== 'all' || activeSubject) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('all')
                  setActiveType('all')
                  setActiveSubject(null)
                }}
                className="text-[#ef4444] hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Questions List */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredQuestions.map((q, idx) => {
                const uniqueKey = `${q.subjectKey}-${q.id}-${q.source}`
                const isExpanded = expandedIds.has(uniqueKey)
                return (
                  <motion.div
                    key={uniqueKey}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, height: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.4) }}
                    className="bg-[#0d1117] border rounded-2xl overflow-hidden"
                    style={{
                      borderColor: q.source === 'wrong' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
                    }}
                  >
                    {/* Question Header */}
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-[#111827] transition-colors"
                      onClick={() => toggleExpand(uniqueKey)}
                    >
                      {/* Source Badge */}
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
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {/* Subject badge */}
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"
                            style={{ background: `${q.subjectColor}22`, color: q.subjectColor }}
                          >
                            {q.subjectIcon} {q.subjectName}
                          </span>
                          {/* Section */}
                          <span className="text-[10px] text-[#64748b]">{q.sectionIcon} {q.sectionTitle}</span>
                          <span className="text-[10px] text-[#1e2d45]">|</span>
                          {/* Type */}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            q.type === 'mcq' ? 'bg-[#7c3aed]/20 text-[#a78bfa]' :
                            q.type === 'tf' ? 'bg-[#ec4899]/20 text-[#f472b6]' :
                            q.type === 'trace' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
                            q.type === 'fill' ? 'bg-[#00d4ff]/20 text-[#22d3ee]' :
                            q.type === 'definition' ? 'bg-[#3b82f6]/20 text-[#60a5fa]' :
                            q.type === 'translation' ? 'bg-[#10b981]/20 text-[#34d399]' :
                            q.type === 'arrange' ? 'bg-[#a78bfa]/20 text-[#c4b5fd]' :
                            'bg-[#3b82f6]/20 text-[#93c5fd]'
                          }`}>
                            {q.type === 'mcq' ? 'MCQ' :
                             q.type === 'tf' ? 'T/F' :
                             q.type === 'trace' ? 'Trace' :
                             q.type === 'fill' ? 'Fill' :
                             q.type === 'definition' ? 'Write' :
                             q.type === 'translation' ? 'Translate' :
                             q.type === 'arrange' ? 'Arrange' : 'Code'}
                          </span>
                          {/* Marks */}
                          <span className="text-[10px] text-[#64748b]">{q.marks}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeQuestion(q.subjectKey, q.id, q.source)
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
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </div>
                    </div>

                    {/* Expanded Solution */}
                    <AnimatePresence>
                      {isExpanded && (
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
                                <span className="text-[#10b981]">💡</span>
                                <span className="font-bold text-[#10b981] text-xs">Solution:</span>
                              </div>
                              <div className="text-xs text-[#6ee7b7] leading-relaxed">{q.answer}</div>
                              {q.answerCode && (
                                <pre className="bg-[#080c18] border border-[#1e2d45] rounded-lg p-3 mt-2 font-mono text-[11px] whitespace-pre-wrap text-left text-[#a5b4fc]" dir="ltr">
                                  {q.answerCode}
                                </pre>
                              )}
                            </div>

                            {/* Link to exam */}
                            <a
                              href={q.examPath}
                              onClick={e => e.stopPropagation()}
                              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#94a3b8] hover:text-[#00d4ff] transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              Open {q.subjectName} exam
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty state — different message if filters are active vs. nothing saved at all */
          <motion.div
            className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {grandTotal === 0 ? (
              <>
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
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 relative"
                      style={{
                        background: `linear-gradient(135deg, ${subj.color}, ${subj.color}88)`,
                        color: 'white',
                        boxShadow: `0 0 15px ${subj.color}33`,
                      }}
                    >
                      {subj.isNew && (
                        <span className="absolute -top-1 -right-1 bg-[#10b981] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      {subj.name}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-black mb-2 text-[#e2e8f0]">No Matches Found</h3>
                <p className="text-[#64748b] text-sm max-w-md mx-auto mb-6">
                  No questions match your current filters. Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('all')
                    setActiveType('all')
                    setActiveSubject(null)
                  }}
                  className="bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Reset Filters
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* Per-subject quick management (only when no filters active) */}
        {grandTotal > 0 && !searchQuery && activeTab === 'all' && activeType === 'all' && !activeSubject && (
          <motion.div
            className="mt-8 bg-[#111827] border border-[#1e2d45] rounded-2xl p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-sm font-black mb-3 text-[#e2e8f0]">Per-Subject Management</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subjectConfig.filter(s => {
                const cnt = subjectCounts.find(c => c.key === s.key)?.totalCount || 0
                return cnt > 0
              }).map(subj => {
                const cnt = subjectCounts.find(c => c.key === subj.key)!
                return (
                  <div
                    key={subj.key}
                    className="flex items-center justify-between gap-3 bg-[#0d1117] border border-[#1e2d45] rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{ background: `${subj.color}22`, color: subj.color }}
                      >
                        {subj.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: subj.color }}>{subj.name}</div>
                        <div className="text-[10px] text-[#64748b]">
                          {cnt.wrongCount} wrong · {cnt.starredCount} starred
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={subj.examPath}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-[#1e2d45] text-[#94a3b8] hover:text-[#00d4ff] hover:border-[#00d4ff]/50 transition-all"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => setShowClearConfirm(subj.key)}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Clear confirmation modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(null)}
            >
              <motion.div
                className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ef4444]/20 flex items-center justify-center text-[#ef4444] text-xl">
                    ⚠️
                  </div>
                  <h3 className="text-lg font-black">
                    {showClearConfirm === 'all'
                      ? 'Clear ALL Review Data?'
                      : `Clear ${subjectConfig.find(s => s.key === showClearConfirm)?.name}?`}
                  </h3>
                </div>
                <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">
                  {showClearConfirm === 'all'
                    ? 'This will permanently remove all starred and wrong questions across ALL subjects. This action cannot be undone.'
                    : 'This will permanently remove all starred and wrong questions for this subject. This action cannot be undone.'}
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowClearConfirm(null)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-[#94a3b8] border border-[#1e2d45] hover:border-[#64748b] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => showClearConfirm === 'all' ? clearAll() : clearSubject(showClearConfirm)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Yes, Clear
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local storage notice */}
        <motion.div
          className="mt-6 bg-[#111827]/50 border border-[#1e2d45]/50 rounded-xl p-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[11px] text-[#64748b] flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            All your review data is saved locally in your browser. Clearing your browser data will reset this list.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2d45] py-6 text-center text-[#64748b] text-xs">
        Prepify — Mahmoud ABD ELKream
      </footer>

      <ScrollToTop />
    </div>
  )
}

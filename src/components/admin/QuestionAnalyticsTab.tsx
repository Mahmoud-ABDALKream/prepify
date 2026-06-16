'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface QuestionData {
  questionId: number
  subject: string
  questionType: string
  sectionTitle: string
  difficulty: string
  bloomTaxonomy: string
  totalAttempts: number
  correctCount: number
  wrongCount: number
  successRate: number
  uniqueUsers: number
}

interface DifficultyData {
  level: string
  totalAttempts: number
  correctCount: number
  successRate: number
  uniqueQuestions: number
}

interface BloomData {
  level: string
  totalAttempts: number
  correctCount: number
  successRate: number
  uniqueQuestions: number
}

interface SectionData {
  sectionTitle: string
  totalAttempts: number
  correctCount: number
  successRate: number
  uniqueQuestions: number
}

interface SubjectBloomData {
  subject: string
  levels: { level: string; totalAttempts: number; correctCount: number; successRate: number }[]
}

interface Props {
  data: {
    totalResponses: number
    questions: QuestionData[]
    difficultyBreakdown: DifficultyData[]
    bloomBreakdown: BloomData[]
    hardestQuestions: QuestionData[]
    easiestQuestions: QuestionData[]
    sectionBreakdown: SectionData[]
    bloomDistribution: SubjectBloomData[]
    message?: string
  } | null
}

const difficultyColors: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
}

const bloomColors: Record<string, string> = {
  remember: '#8b5cf6',
  understand: '#3b82f6',
  apply: '#06b6d4',
  analyze: '#f59e0b',
  evaluate: '#ef4444',
  create: '#ec4899',
}

const bloomLabels: Record<string, string> = {
  remember: 'Remember',
  understand: 'Understand',
  apply: 'Apply',
  analyze: 'Analyze',
  evaluate: 'Evaluate',
  create: 'Create',
}

export default function QuestionAnalyticsTab({ data }: Props) {
  const [view, setView] = useState<'overview' | 'difficulty' | 'bloom' | 'questions'>('overview')

  if (!data) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-black mb-2">No Data Yet</h3>
        <p className="text-[#64748b] text-sm">Question analytics will appear after users submit exams.</p>
      </div>
    )
  }

  if (data.message && data.totalResponses === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-black mb-2">Question Analytics</h3>
        <p className="text-[#64748b] text-sm max-w-md mx-auto">{data.message}</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Responses', value: data.totalResponses, color: '#8b5cf6' },
    { label: 'Unique Questions', value: data.questions.length, color: '#3b82f6' },
    { label: 'Avg Success Rate', value: data.questions.length > 0 ? Math.round(data.questions.reduce((s, q) => s + q.successRate, 0) / data.questions.length) + '%' : '0%', color: '#10b981' },
    { label: 'Hardest Q Rate', value: data.hardestQuestions.length > 0 ? data.hardestQuestions[0].successRate + '%' : '-', color: '#ef4444' },
  ]

  return (
    <div>
      {/* Header */}
      <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            Question Analytics
          </h1>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCards.map((card, i) => (
          <motion.div key={card.label} className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)`, border: `1px solid ${card.color}18` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="text-2xl font-black tabular-nums" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[11px] text-[#64748b] mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['overview', 'difficulty', 'bloom', 'questions'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: view === v ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))' : 'rgba(255,255,255,0.03)',
              border: view === v ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.05)',
              color: view === v ? '#c4b5fd' : '#64748b',
            }}>
            {v === 'overview' ? 'Overview' : v === 'difficulty' ? 'Difficulty' : v === 'bloom' ? 'Bloom Taxonomy' : 'All Questions'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <div className="space-y-6">
          {/* Section Breakdown */}
          <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Section Performance
            </h3>
            <div className="space-y-3">
              {data.sectionBreakdown.sort((a, b) => a.successRate - b.successRate).map(s => (
                <div key={s.sectionTitle} className="flex items-center gap-3">
                  <span className="text-xs text-[#94a3b8] w-40 truncate shrink-0">{s.sectionTitle}</span>
                  <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: s.successRate >= 70 ? '#10b981' : s.successRate >= 40 ? '#f59e0b' : '#ef4444' }}
                      initial={{ width: 0 }} animate={{ width: `${s.successRate}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="text-xs text-[#94a3b8] w-12 text-right tabular-nums">{s.successRate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardest & Easiest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3 text-[#ef4444]">Hardest Questions</h3>
              <div className="space-y-2">
                {data.hardestQuestions.slice(0, 10).map(q => (
                  <div key={`${q.subject}:${q.questionId}`} className="flex items-center gap-2 text-xs">
                    <span className="text-[#64748b]">Q{q.questionId}</span>
                    <span className="text-[#94a3b8] truncate flex-1">{q.subject} / {q.sectionTitle}</span>
                    <span className="font-bold text-[#ef4444]">{q.successRate}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3 text-[#10b981]">Easiest Questions</h3>
              <div className="space-y-2">
                {data.easiestQuestions.slice(0, 10).map(q => (
                  <div key={`${q.subject}:${q.questionId}`} className="flex items-center gap-2 text-xs">
                    <span className="text-[#64748b]">Q{q.questionId}</span>
                    <span className="text-[#94a3b8] truncate flex-1">{q.subject} / {q.sectionTitle}</span>
                    <span className="font-bold text-[#10b981]">{q.successRate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty View */}
      {view === 'difficulty' && (
        <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Difficulty Breakdown
          </h3>
          <div className="space-y-4">
            {data.difficultyBreakdown.map(d => {
              const color = difficultyColors[d.level] || '#64748b'
              return (
                <div key={d.level} className="rounded-xl p-4" style={{ background: `${color}05`, border: `1px solid ${color}15` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold capitalize" style={{ color }}>{d.level}</span>
                    <span className="text-xs text-[#64748b]">{d.uniqueQuestions} questions</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-black" style={{ color }}>{d.totalAttempts}</div>
                      <div className="text-[10px] text-[#64748b]">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-[#10b981]">{d.correctCount}</div>
                      <div className="text-[10px] text-[#64748b]">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black" style={{ color: d.successRate >= 60 ? '#10b981' : '#ef4444' }}>{d.successRate}%</div>
                      <div className="text-[10px] text-[#64748b]">Success</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: color }}
                      initial={{ width: 0 }} animate={{ width: `${d.successRate}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bloom Taxonomy View */}
      {view === 'bloom' && (
        <div className="space-y-6">
          <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Bloom&apos;s Taxonomy Breakdown
            </h3>
            <div className="space-y-3">
              {['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'].map(level => {
                const bloomData = data.bloomBreakdown.find(b => b.level === level)
                const color = bloomColors[level] || '#64748b'
                const rate = bloomData?.successRate || 0
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-24 shrink-0" style={{ color }}>{bloomLabels[level]}</span>
                    <div className="flex-1 h-4 bg-[#1e2d45] rounded-full overflow-hidden relative">
                      <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${color}, ${color}88)` }}
                        initial={{ width: 0 }} animate={{ width: `${rate}%` }} transition={{ duration: 0.8 }} />
                      {bloomData && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80">
                          {rate}% ({bloomData.totalAttempts} attempts)
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Per-subject Bloom distribution */}
          {data.bloomDistribution.map(sub => (
            <div key={sub.subject} className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4 capitalize flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4]" /> {sub.subject.replace(/-/g, ' ')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sub.levels.map(l => (
                  <div key={l.level} className="rounded-lg p-3 text-center" style={{ background: `${bloomColors[l.level] || '#64748b'}08`, border: `1px solid ${bloomColors[l.level] || '#64748b'}15` }}>
                    <div className="text-[10px] font-bold mb-1" style={{ color: bloomColors[l.level] }}>{bloomLabels[l.level] || l.level}</div>
                    <div className="text-lg font-black" style={{ color: l.successRate >= 60 ? '#10b981' : '#ef4444' }}>{l.successRate}%</div>
                    <div className="text-[9px] text-[#64748b]">{l.totalAttempts} attempts</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Questions View */}
      {view === 'questions' && (
        <div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1e2d45]">
                  <th className="text-left px-4 py-3 text-[#64748b] font-bold">Q#</th>
                  <th className="text-left px-4 py-3 text-[#64748b] font-bold">Subject</th>
                  <th className="text-left px-4 py-3 text-[#64748b] font-bold">Section</th>
                  <th className="text-left px-4 py-3 text-[#64748b] font-bold">Type</th>
                  <th className="text-center px-4 py-3 text-[#64748b] font-bold">Difficulty</th>
                  <th className="text-center px-4 py-3 text-[#64748b] font-bold">Bloom</th>
                  <th className="text-center px-4 py-3 text-[#64748b] font-bold">Attempts</th>
                  <th className="text-center px-4 py-3 text-[#64748b] font-bold">Success</th>
                </tr>
              </thead>
              <tbody>
                {data.questions.sort((a, b) => a.successRate - b.successRate).map((q, i) => (
                  <tr key={`${q.subject}:${q.questionId}`} className="border-b border-[#1e2d45]/30 hover:bg-[#1e2d45]/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-[#94a3b8]">{q.questionId}</td>
                    <td className="px-4 py-2.5 text-[#94a3b8] capitalize">{q.subject.replace(/-/g, ' ')}</td>
                    <td className="px-4 py-2.5 text-[#94a3b8] max-w-[150px] truncate">{q.sectionTitle}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{
                        background: q.questionType === 'mcq' ? 'rgba(124,58,237,0.15)' : q.questionType === 'tf' ? 'rgba(236,72,153,0.15)' : q.questionType === 'fill' ? 'rgba(0,212,255,0.15)' : q.questionType === 'code' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                        color: q.questionType === 'mcq' ? '#a78bfa' : q.questionType === 'tf' ? '#f472b6' : q.questionType === 'fill' ? '#22d3ee' : q.questionType === 'code' ? '#fbbf24' : '#34d399',
                      }}>{q.questionType.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: difficultyColors[q.difficulty] || '#64748b' }}>
                        {q.difficulty.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-[10px] font-bold" style={{ color: bloomColors[q.bloomTaxonomy] || '#64748b' }}>
                        {bloomLabels[q.bloomTaxonomy] || q.bloomTaxonomy}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-[#94a3b8] tabular-nums">{q.totalAttempts}</td>
                    <td className="px-4 py-2.5 text-center font-bold tabular-nums" style={{ color: q.successRate >= 70 ? '#10b981' : q.successRate >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {q.successRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

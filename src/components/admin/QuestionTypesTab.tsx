'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface QuestionTypeAnalytics {
  questionTypes: { type: string; totalQuestions: number; avgScore: number; successRate: number; totalAttempts: number; uniqueUsers: number }[]
  correlations: { type: string; correlation: number }[]
  predictiveRanking: { type: string; correlation: number }[]
  mostPredictive: { type: string; correlation: number } | null
}

interface Props {
  data: QuestionTypeAnalytics | null
}

const formatQt = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function QuestionTypesTab({ data }: Props) {
  if (!data) return null

  const corrColor = (v: number) => Math.abs(v) >= 0.6 ? '#10b981' : Math.abs(v) >= 0.3 ? '#f59e0b' : '#64748b'

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">
          Question Type Analytics
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">How different question types predict exam performance</p>
      </motion.div>

      {data.questionTypes.length > 0 && (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
            <motion.div
              className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                Performance by Question Type
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.questionTypes.map(q => ({ ...q, type: formatQt(q.type) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} axisLine={{ stroke: '#1e2d4540' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                  <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                  <Bar dataKey="successRate" fill="#8b5cf6" name="Success Rate" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[6, 6, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                Correlation with Exam Score
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.correlations.map(q => ({ ...q, type: formatQt(q.type) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} axisLine={{ stroke: '#1e2d4540' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[-1, 1]} axisLine={{ stroke: '#1e2d4540' }} />
                  <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                  <Bar dataKey="correlation" name="Pearson r" radius={[6, 6, 0, 0]}>
                    {data.correlations.map((entry, i) => (
                      <Cell key={i} fill={corrColor(entry.correlation)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Predictive Power Ranking */}
          <motion.div
            className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              Predictive Power Ranking
            </h3>
            <div className="space-y-2.5">
              {data.predictiveRanking.map((q, i) => {
                const color = corrColor(q.correlation)
                return (
                  <motion.div
                    key={q.type}
                    className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                    style={{
                      background: i === 0 ? `linear-gradient(135deg, ${color}08, ${color}03)` : 'rgba(255,255,255,0.02)',
                      border: i === 0 ? `1px solid ${color}18` : '1px solid rgba(255,255,255,0.04)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                  >
                    {/* Background glow for top item */}
                    {i === 0 && (
                      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
                    )}
                    <span className="text-sm font-black w-7 text-center relative" style={{ color: i === 0 ? color : '#475569' }}>#{i + 1}</span>
                    <span className="text-sm font-medium flex-1 relative">{formatQt(q.type)}</span>
                    <div className="flex items-center gap-2.5 relative">
                      <div className="w-24 h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(q.correlation) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                        />
                      </div>
                      <span className="text-xs font-bold tabular-nums min-w-[42px] text-right" style={{ color }}>r={q.correlation}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Key Finding */}
          {data.mostPredictive && (
            <motion.div
              className="relative rounded-2xl p-5 sm:p-6 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.03))',
                border: '1px solid rgba(139,92,246,0.18)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
              <div className="flex items-start gap-3 relative">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wider">Key Finding</span>
                  <p className="text-sm text-[#c4b5fd] mt-1 leading-relaxed">
                    {formatQt(data.mostPredictive.type)} questions show the strongest relationship with exam success (r={data.mostPredictive.correlation}), making them the best predictor of final exam performance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {data.questionTypes.length === 0 && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No Question Type Data</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">Data will appear as students take quizzes.</p>
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts'

interface AIGradingData {
  summary: {
    aiTotal: number
    aiCorrect: number
    aiSuccessRate: number
    mcqTotal: number
    mcqSuccessRate: number
    avgAnswerLength: number
    aiShareOfAll: number
  }
  perSubject: { subject: string; total: number; correct: number; successRate: number; uniqueUsers: number }[]
  perType: { type: string; total: number; correct: number; successRate: number }[]
  perDifficulty: { difficulty: string; total: number; correct: number; successRate: number }[]
  trend: { date: string; successRate: number; total: number }[]
}

interface Props {
  data: AIGradingData | null
}

const SUBJECT_META: Record<string, { label: string; short: string; color: string }> = {
  'microsoft-office':     { label: 'MS Office',     short: 'MS',  color: '#f59e0b' },
  'c-programming':        { label: 'C Programming', short: '{ }', color: '#7c3aed' },
  'iot':                  { label: 'IoT',           short: 'IoT', color: '#10b981' },
  'cyber-security-2':     { label: 'Cyber Sec 2',   short: 'CS',  color: '#ef4444' },
  'technical-english-2':  { label: 'Tech English',  short: 'EN',  color: '#3b82f6' },
}
function metaFor(s: string) {
  return SUBJECT_META[s] ?? { label: s, short: s.slice(0, 2).toUpperCase(), color: '#8b5cf6' }
}

const TYPE_COLORS: Record<string, string> = {
  definition: '#8b5cf6',
  translation: '#3b82f6',
  fill: '#10b981',
  trace: '#f59e0b',
  code: '#ef4444',
}

const DIFF_COLORS: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
}

const fmtDate = (s: string) => {
  if (!s) return ''
  const d = new Date(s)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function AIGradingTab({ data }: Props) {
  if (!data) return null
  const { summary } = data

  const aiVsMcqPie = [
    { name: 'AI-Graded',     value: summary.aiTotal,    color: '#8b5cf6' },
    { name: 'MCQ / Other',   value: summary.mcqTotal,   color: '#06b6d4' },
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">AI Grading Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1.5">How the semantic AI grader is performing across subjects & question types</p>
      </motion.div>

      {/* ─── Top stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'AI-Graded',         value: summary.aiTotal,                color: '#8b5cf6', sub: `${summary.aiShareOfAll}% of all` },
          { label: 'AI Success Rate',   value: `${summary.aiSuccessRate}%`,    color: summary.aiSuccessRate >= 60 ? '#10b981' : '#f59e0b', sub: `${summary.aiCorrect} correct` },
          { label: 'MCQ Success Rate',  value: `${summary.mcqSuccessRate}%`,   color: '#06b6d4', sub: `${summary.mcqTotal} responses` },
          { label: 'Avg Answer Length', value: `${summary.avgAnswerLength} ch`, color: '#f59e0b', sub: 'characters' },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            className="relative rounded-xl p-4 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${c.color}08, ${c.color}03)`, border: `1px solid ${c.color}18` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="text-2xl font-black tabular-nums" style={{ color: c.color }}>{c.value}</div>
            <div className="text-[11px] text-[#64748b] mt-0.5">{c.label}</div>
            <div className="text-[10px] text-[#475569] mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ─── Two-column: AI vs MCQ Pie + Per-Type Bars ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </div>
            AI vs MCQ Distribution
          </h3>
          {summary.aiTotal + summary.mcqTotal > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={aiVsMcqPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  label={(e: any) => `${e.name}: ${e.value}`}
                  labelLine={false}
                >
                  {aiVsMcqPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#475569] text-sm">No responses yet</div>
          )}
        </motion.div>

        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            Success Rate by Question Type
          </h3>
          {data.perType.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.perType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                <XAxis dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="successRate" name="Success Rate" radius={[6, 6, 0, 0]}>
                  {data.perType.map((entry, i) => (
                    <Cell key={i} fill={TYPE_COLORS[entry.type] ?? '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#475569] text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* ─── Per-Subject AI Performance ─── */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          AI Grading Per Subject
        </h3>
        {data.perSubject.length > 0 ? (
          <div className="space-y-3">
            {data.perSubject.map(s => {
              const m = metaFor(s.subject)
              return (
                <div key={s.subject} className="flex items-center gap-3 p-3 rounded-xl bg-[#080c18]/60">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ background: `${m.color}15`, color: m.color }}>
                    {m.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-[#64748b]">{s.total} graded · {s.uniqueUsers} students</div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-[#1e2d45] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${s.successRate}%`,
                          background: m.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black tabular-nums" style={{ color: m.color }}>{s.successRate}%</div>
                    <div className="text-[10px] text-[#475569]">{s.correct}/{s.total}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-[#475569] text-sm">No AI-graded responses yet</div>
        )}
      </motion.div>

      {/* ─── Per-Difficulty + Trend ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            Success Rate by Difficulty
          </h3>
          {data.perDifficulty.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.perDifficulty} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                <YAxis type="category" dataKey="difficulty" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} width={70} />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="successRate" name="Success Rate" radius={[0, 6, 6, 0]}>
                  {data.perDifficulty.map((entry, i) => (
                    <Cell key={i} fill={DIFF_COLORS[entry.difficulty] ?? '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#475569] text-sm">No data yet</div>
          )}
        </motion.div>

        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            AI Grading Trend (14 Days)
          </h3>
          {data.trend.some(t => t.total > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} labelFormatter={(l) => `Date: ${l}`} />
                <Line type="monotone" dataKey="successRate" stroke="#8b5cf6" name="AI Success Rate" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#475569] text-sm">No data yet</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

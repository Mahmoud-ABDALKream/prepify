'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'

interface SubjectAgg {
  subject: string
  totalAttempts: number
  uniqueStudents: number
  avgAccuracy: number
  avgScore: number
  avgExamScore: number
  passRate: number
  difficultyIndex: number
  avgTimePerAttempt: number
  questionSuccessRate: number
  difficultyBreakdown: {
    easy:   { total: number; correct: number; successRate: number }
    medium: { total: number; correct: number; successRate: number }
    hard:   { total: number; correct: number; successRate: number }
  }
  trend: number
  recentAttempts: number
  examResults: number
  gradeDistribution: { A: number; B: number; C: number; D: number; F: number }
}

interface SubjectAnalytics {
  subjects: SubjectAgg[]
  rankings: {
    hardestSubject: SubjectAgg | null
    easiestSubject: SubjectAgg | null
    mostStudiedSubject: SubjectAgg | null
    highestPassRateSubject: SubjectAgg | null
    mostImprovedSubject: SubjectAgg | null
  }
  summary: {
    totalSubjects: number
    totalAttempts: number
    totalStudents: number
    avgAccuracyAcrossSubjects: number
  }
}

interface Props {
  data: SubjectAnalytics | null
}

const SUBJECT_META: Record<string, { label: string; short: string; color: string }> = {
  'microsoft-office':     { label: 'Microsoft Office',     short: 'MS',  color: '#f59e0b' },
  'c-programming':        { label: 'C Programming',         short: '{ }', color: '#7c3aed' },
  'iot':                  { label: 'IoT',                    short: 'IoT', color: '#10b981' },
  'cyber-security-2':     { label: 'Cyber Security 2',      short: 'CS',  color: '#ef4444' },
  'technical-english-2':  { label: 'Technical English 2',   short: 'EN',  color: '#3b82f6' },
}

function metaFor(subject: string) {
  return SUBJECT_META[subject] ?? { label: subject.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), short: subject.slice(0, 2).toUpperCase(), color: '#8b5cf6' }
}

const GRADE_COLORS: Record<string, string> = {
  A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444',
}

export default function SubjectsTab({ data }: Props) {
  if (!data || !data.subjects) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h3 className="text-xl font-black mb-2">No Subject Data Yet</h3>
        <p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p>
      </div>
    )
  }

  const { subjects, rankings, summary } = data

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">Subject Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1.5">
          Performance breakdown across {summary.totalSubjects} subjects · {summary.totalAttempts} attempts · {summary.totalStudents} students
        </p>
      </motion.div>

      {/* ─── Top Summary Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Subjects',      value: summary.totalSubjects,                  color: '#8b5cf6' },
          { label: 'Total Attempts', value: summary.totalAttempts,                  color: '#06b6d4' },
          { label: 'Unique Students', value: summary.totalStudents,                  color: '#6366f1' },
          { label: 'Avg Accuracy',   value: `${summary.avgAccuracyAcrossSubjects}%`, color: summary.avgAccuracyAcrossSubjects >= 70 ? '#10b981' : '#f59e0b' },
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
          </motion.div>
        ))}
      </div>

      {/* ─── Rankings ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { title: 'Hardest',        data: rankings.hardestSubject,         color: '#ef4444', metric: 'difficultyIndex', suffix: '' },
          { title: 'Easiest',        data: rankings.easiestSubject,         color: '#3b82f6', metric: 'difficultyIndex', suffix: '' },
          { title: 'Most Studied',   data: rankings.mostStudiedSubject,     color: '#8b5cf6', metric: 'totalAttempts',   suffix: ' tries' },
          { title: 'Highest Pass',   data: rankings.highestPassRateSubject, color: '#10b981', metric: 'passRate',        suffix: '%' },
          { title: 'Most Improved',  data: rankings.mostImprovedSubject,    color: '#f59e0b', metric: 'trend',           suffix: ' pts' },
        ].map((card, i) => {
          const m = card.data ? metaFor(card.data.subject) : null
          return (
            <motion.div
              key={card.title}
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{
                background: card.data ? `linear-gradient(135deg, ${card.color}08, ${card.color}03)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${card.data ? card.color + '20' : 'rgba(255,255,255,0.05)'}`,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {card.data && (
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${card.color}, transparent 70%)` }} />
              )}
              <div className="relative">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: card.data ? card.color : '#475569' }}>{card.title}</div>
                {card.data && m ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: `${m.color}15`, color: m.color }}>{m.short}</div>
                      <div className="text-sm font-bold leading-tight">{m.label}</div>
                    </div>
                    <div className="text-lg font-black tabular-nums" style={{ color: card.color }}>
                      {(card.data as any)[card.metric]}{card.suffix}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-[#475569] py-2">—</div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Radar Chart: Subject Comparison ─── */}
      {subjects.length > 0 && (
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            Multi-Dimensional Comparison
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={subjects.map(s => {
              const m = metaFor(s.subject)
              return {
                subject: m.short,
                Accuracy: Math.round(s.avgAccuracy),
                Score: Math.round(s.avgScore),
                PassRate: Math.round(s.passRate),
                SuccessRate: Math.round(s.questionSuccessRate),
              }
            })}>
              <PolarGrid stroke="#1e2d4580" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Accuracy"    dataKey="Accuracy"    stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Radar name="Score"       dataKey="Score"       stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Radar name="Pass Rate"   dataKey="PassRate"    stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Radar name="Q Success"   dataKey="SuccessRate" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              <Legend />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ─── Per-subject detailed cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {subjects.map((s, i) => {
          const m = metaFor(s.subject)
          const gradeData = Object.entries(s.gradeDistribution).map(([name, value]) => ({ name, value }))

          return (
            <motion.div
              key={s.subject}
              className="relative bg-[#0c1222]/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 overflow-hidden"
              style={{ border: `1px solid ${m.color}18` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${m.color}, transparent 70%)` }} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}25` }}>
                      {m.short}
                    </div>
                    <div>
                      <h4 className="font-bold text-base leading-tight">{m.label}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748b]">
                        <span>{s.totalAttempts} attempts</span>
                        <span className="text-[#1e2d45]">·</span>
                        <span>{s.uniqueStudents} students</span>
                        {s.recentAttempts > 0 && (
                          <>
                            <span className="text-[#1e2d45]">·</span>
                            <span className="text-[#10b981]">{s.recentAttempts} this week</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Trend indicator */}
                  {s.trend !== 0 && (
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                      style={{
                        background: s.trend > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: s.trend > 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={s.trend > 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                      </svg>
                      {Math.abs(s.trend)}
                    </div>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Accuracy',     value: `${s.avgAccuracy}%`,          color: s.avgAccuracy >= 70 ? '#10b981' : '#f59e0b' },
                    { label: 'Avg Score',    value: `${s.avgScore}%`,             color: '#e2e8f0' },
                    { label: 'Pass Rate',    value: `${s.passRate}%`,             color: s.passRate >= 70 ? '#10b981' : '#f59e0b' },
                    { label: 'Difficulty',   value: s.difficultyIndex,            color: s.difficultyIndex > 50 ? '#ef4444' : '#3b82f6' },
                    { label: 'Q Success',    value: `${s.questionSuccessRate}%`,  color: '#06b6d4' },
                    { label: 'Avg Time',     value: `${Math.round(s.avgTimePerAttempt / 60)}m`, color: '#8b5cf6' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#080c18]/60 rounded-lg p-2.5 text-center">
                      <div className="text-[10px] text-[#475569] mb-0.5">{stat.label}</div>
                      <div className="text-sm font-black tabular-nums" style={{ color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Difficulty breakdown bar */}
                {s.difficultyBreakdown && (s.difficultyBreakdown.easy.total + s.difficultyBreakdown.medium.total + s.difficultyBreakdown.hard.total) > 0 && (
                  <div className="mb-3">
                    <div className="text-[10px] text-[#64748b] mb-1.5 font-semibold uppercase tracking-wider">Difficulty Success Rate</div>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Easy',   data: s.difficultyBreakdown.easy,   color: '#10b981' },
                        { label: 'Medium', data: s.difficultyBreakdown.medium, color: '#f59e0b' },
                        { label: 'Hard',   data: s.difficultyBreakdown.hard,   color: '#ef4444' },
                      ].map(d => (
                        <div key={d.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-[#94a3b8] w-12">{d.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-[#080c18] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${d.data.successRate}%`, background: d.color }}
                            />
                          </div>
                          <span className="text-[10px] font-bold tabular-nums w-12 text-right" style={{ color: d.color }}>
                            {Math.round(d.data.successRate)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grade distribution */}
                {s.examResults > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#64748b] font-semibold uppercase tracking-wider">Grades:</span>
                    {gradeData.map(g => g.value > 0 && (
                      <div key={g.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm" style={{ background: GRADE_COLORS[g.name] }} />
                        <span className="text-[10px] font-bold tabular-nums" style={{ color: GRADE_COLORS[g.name] }}>{g.name}:{g.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Subject Comparison Bar Chart ─── */}
      {subjects.length > 0 && (
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            Accuracy vs Difficulty Index
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjects.map(s => ({ ...s, subject: metaFor(s.subject).short }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="avgAccuracy"   fill="#8b5cf6" name="Avg Accuracy"   radius={[6, 6, 0, 0]} />
              <Bar dataKey="questionSuccessRate" fill="#06b6d4" name="Q Success Rate" radius={[6, 6, 0, 0]} />
              <Bar dataKey="difficultyIndex"     fill="#ef4444" name="Difficulty Index" radius={[6, 6, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface SubjectAnalytics {
  subjects: { subject: string; totalAttempts: number; uniqueStudents: number; avgAccuracy: number; avgScore: number; avgExamScore: number; passRate: number; difficultyIndex: number }[]
  rankings: { hardestSubject: { subject: string; difficultyIndex: number } | null; easiestSubject: { subject: string; difficultyIndex: number } | null; mostStudiedSubject: { subject: string; totalAttempts: number } | null }
}

interface Props {
  data: SubjectAnalytics | null
}

const formatSubject = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const subjectColors: Record<string, string> = {
  'c-programming': '#7c3aed',
  'cyber-security-2': '#ef4444',
  'iot': '#10b981',
  'technical-english-2': '#3b82f6',
  'microsoft-office': '#f59e0b',
}

export default function SubjectsTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">Subject Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1.5">Performance breakdown by subject area</p>
      </motion.div>

      {/* Rankings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Hardest Subject', data: data.rankings.hardestSubject, color: '#ef4444', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
          { title: 'Easiest Subject', data: data.rankings.easiestSubject, color: '#3b82f6', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { title: 'Most Studied', data: data.rankings.mostStudiedSubject, color: '#8b5cf6', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        ].map((card, i) => card.data ? (
          <motion.div
            key={card.title}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)`, border: `1px solid ${card.color}20` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${card.color}, transparent 70%)` }} />
            <div className="relative flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: card.color }}>{card.title}</span>
            </div>
            <div className="relative text-lg font-black">{formatSubject(card.data.subject)}</div>
            <div className="relative text-xs text-[#64748b] mt-1">
              {'difficultyIndex' in card.data ? `Difficulty: ${card.data.difficultyIndex}` : `${(card.data as any).totalAttempts} attempts`}
            </div>
          </motion.div>
        ) : null)}
      </div>

      {/* Subject Comparison Chart */}
      {data.subjects.length > 0 && (
        <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
            Subject Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjects.map(s => ({ ...s, subject: formatSubject(s.subject) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
              <Bar dataKey="avgAccuracy" fill="#8b5cf6" name="Avg Accuracy" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[6, 6, 0, 0]} />
              <Bar dataKey="difficultyIndex" fill="#ef4444" name="Difficulty" radius={[6, 6, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.subjects.map((s, i) => {
          const color = subjectColors[s.subject] || '#8b5cf6'
          return (
            <motion.div
              key={s.subject}
              className="relative bg-[#0c1222]/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 overflow-hidden"
              style={{ border: `1px solid ${color}18` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${color}15`, color: color, border: `1px solid ${color}25` }}>
                    {s.subject === 'c-programming' ? '{ }' : s.subject === 'cyber-security-2' ? 'CS' : 'IoT'}
                  </div>
                  <h4 className="font-bold text-base">{formatSubject(s.subject)}</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Accuracy', value: `${s.avgAccuracy}%`, color: s.avgAccuracy >= 70 ? '#3b82f6' : '#f59e0b' },
                    { label: 'Avg Score', value: `${s.avgScore}%`, color: '#e2e8f0' },
                    { label: 'Attempts', value: s.totalAttempts, color: '#8b5cf6' },
                    { label: 'Students', value: s.uniqueStudents, color: '#6366f1' },
                    { label: 'Difficulty', value: s.difficultyIndex, color: s.difficultyIndex > 50 ? '#ef4444' : '#3b82f6' },
                    { label: 'Pass Rate', value: `${s.passRate}%`, color: s.passRate >= 70 ? '#3b82f6' : '#f59e0b' },
                  ].map(m => (
                    <div key={m.label} className="bg-[#080c18]/60 rounded-lg p-2.5 text-center">
                      <div className="text-[10px] text-[#475569] mb-0.5">{m.label}</div>
                      <div className="text-sm font-black" style={{ color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {data.subjects.length === 0 && (
        <div className="text-center py-24"><div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div><h3 className="text-xl font-black mb-2">No Subject Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
      )}
    </div>
  )
}

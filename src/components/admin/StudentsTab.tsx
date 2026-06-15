'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts'

interface StudentAnalytics {
  students: { userId: string; userName: string; totalAttempts: number; avgScore: number; avgAccuracy: number; bestScore: number; studyStreak: number; subjectsCount: number; timeSpent: number; lastActive: string | null; examScore: number | null }[]
  accuracyDistribution: { range: string; count: number }[]
  scoreDistribution: { range: string; count: number }[]
  examScoreDistribution: { range: string; count: number }[]
  topPerformers: { userId: string; userName: string; avgScore: number; totalAttempts: number }[]
  mostImproved: { userId: string; userName: string; improvement: number }[]
}

interface Props {
  data: StudentAnalytics | null
}

export default function StudentsTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">Student Performance</h1>
        <p className="text-[#64748b] text-sm mt-1.5">Detailed analysis of individual student performance and progress</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
        <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
            Accuracy Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.accuracyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
            Exam Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.examScoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Performers & Most Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
        <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
            Top Performers
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {data.topPerformers.map((s, i) => (
              <div key={s.userId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors" style={{ background: i < 3 ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', border: i < 3 ? '1px solid rgba(139,92,246,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-sm font-black w-7 text-center" style={{ color: i < 3 ? '#fbbf24' : '#475569' }}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
                </span>
                <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                <span className="text-sm font-black text-[#8b5cf6]">{s.avgScore}%</span>
                <span className="text-[10px] text-[#475569] bg-[#1a2235] px-2 py-0.5 rounded-md">{s.totalAttempts} tries</span>
              </div>
            ))}
            {data.topPerformers.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
          </div>
        </motion.div>

        <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
            Most Improved
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {data.mostImproved.map((s, i) => (
              <div key={s.userId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors" style={{ background: i < 3 ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', border: i < 3 ? '1px solid rgba(16,185,129,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-sm font-black w-7 text-center text-[#475569]">#{i + 1}</span>
                <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                <span className="text-sm font-black" style={{ color: s.improvement >= 0 ? '#10b981' : '#ef4444' }}>
                  {s.improvement >= 0 ? '↑' : '↓'} {Math.abs(s.improvement)}%
                </span>
              </div>
            ))}
            {data.mostImproved.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
          </div>
        </motion.div>
      </div>

      {/* Student Table */}
      <motion.div className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
          All Students
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#475569] text-[11px] uppercase tracking-wider">
                <th className="text-left py-3 px-3 font-bold">#</th>
                <th className="text-left py-3 px-3 font-bold">Student</th>
                <th className="text-center py-3 px-3 font-bold">Attempts</th>
                <th className="text-center py-3 px-3 font-bold">Avg Score</th>
                <th className="text-center py-3 px-3 font-bold">Accuracy</th>
                <th className="text-center py-3 px-3 font-bold">Best</th>
                <th className="text-center py-3 px-3 font-bold">Streak</th>
                <th className="text-center py-3 px-3 font-bold">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {data.students.sort((a, b) => b.avgScore - a.avgScore).map((s, i) => (
                <tr key={s.userId} className="border-t border-[#1e2d45]/40 hover:bg-[rgba(139,92,246,0.03)] transition-colors">
                  <td className="py-3 px-3 text-[#475569] font-bold text-xs">{i + 1}</td>
                  <td className="py-3 px-3 font-semibold">{s.userName}</td>
                  <td className="text-center py-3 px-3"><span className="bg-[#8b5cf6]/10 text-[#a78bfa] px-2 py-0.5 rounded-md text-xs font-bold">{s.totalAttempts}</span></td>
                  <td className="text-center py-3 px-3 font-bold">{s.avgScore}%</td>
                  <td className="text-center py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{
                      background: s.avgAccuracy >= 70 ? 'rgba(16,185,129,0.1)' : s.avgAccuracy >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: s.avgAccuracy >= 70 ? '#10b981' : s.avgAccuracy >= 50 ? '#f59e0b' : '#ef4444',
                    }}>{s.avgAccuracy}%</span>
                  </td>
                  <td className="text-center py-3 px-3 font-bold text-[#94a3b8]">{s.bestScore}%</td>
                  <td className="text-center py-3 px-3 text-[#94a3b8]">{s.studyStreak}d</td>
                  <td className="text-center py-3 px-3 text-[#94a3b8]">{s.subjectsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface OverviewData {
  totalStudents: number
  activeStudents: number
  totalQuizAttempts: number
  avgAccuracy: number
  avgStudyStreak: number
  passRate: number
  atRiskStudents: number
  totalFeedback?: number
  totalExams?: number
  todayAttempts?: number
  todayUniqueUsers?: number
  totalResponses?: number
  responseSuccessRate?: number
  accuracyTrend?: number
  avgSessionTime?: number
  recentAttempts7?: number
}

interface StudentAnalytics {
  scoreDistribution: { range: string; count: number }[]
}

interface BehaviorAnalytics {
  dailyActivity: { date: string; attempts: number; uniqueUsers: number }[]
}

interface Props {
  data: OverviewData | null
  studentData: StudentAnalytics | null
  behaviorData: BehaviorAnalytics | null
}

export default function OverviewTab({ data, studentData, behaviorData }: Props) {
  if (!data) return null

  const stats = [
    { label: 'Total Students',   value: data.totalStudents,                                color: '#8b5cf6', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { label: 'Active (7d)',       value: data.activeStudents,                              color: '#6366f1', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Quiz Attempts',     value: data.totalQuizAttempts,                            color: '#06b6d4', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Avg Accuracy',      value: `${data.avgAccuracy}%`,                           color: data.avgAccuracy >= 70 ? '#10b981' : data.avgAccuracy >= 50 ? '#f59e0b' : '#ef4444', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Pass Rate',         value: `${data.passRate}%`,                              color: data.passRate >= 70 ? '#10b981' : data.passRate >= 50 ? '#f59e0b' : '#ef4444', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Q Success Rate',    value: `${data.responseSuccessRate ?? 0}%`,              color: (data.responseSuccessRate ?? 0) >= 70 ? '#10b981' : '#f59e0b', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { label: 'At-Risk',           value: data.atRiskStudents,                              color: data.atRiskStudents > 0 ? '#ef4444' : '#10b981', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { label: 'Today',             value: data.todayAttempts ?? 0,                          color: '#f59e0b', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  ]

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
          Learning Analytics Overview
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">Real-time insights into student learning behavior and performance</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((card, i) => (
          <motion.div
            key={card.label}
            className="relative rounded-2xl p-4 sm:p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)`,
              border: `1px solid ${card.color}18`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            {/* Background glow */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ background: `radial-gradient(circle, ${card.color}, transparent 70%)` }} />

            <div className="relative flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>
                {card.icon}
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}50` }} />
            </div>
            <div className="relative text-2xl sm:text-3xl font-black tabular-nums tracking-tight" style={{ color: card.color }}>{card.value}</div>
            <div className="relative text-[11px] text-[#64748b] mt-1 font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {studentData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <motion.div
            className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              Score Distribution
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={studentData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {behaviorData && behaviorData.dailyActivity.length > 0 && (
            <motion.div
              className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                Daily Activity (Last 30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={behaviorData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} axisLine={{ stroke: '#1e2d4540' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                  <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                  <Area type="monotone" dataKey="attempts" stroke="#8b5cf6" fill="rgba(139,92,246,0.1)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="uniqueUsers" stroke="#6366f1" fill="rgba(99,102,241,0.06)" strokeWidth={2.5} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!data.totalStudents && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No Data Yet</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">Analytics will appear as students start taking quizzes. Check back soon.</p>
        </motion.div>
      )}
    </div>
  )
}

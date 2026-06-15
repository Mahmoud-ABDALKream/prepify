'use client'

import { motion } from 'framer-motion'
import {
  ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface BehaviorAnalytics {
  correlations: { questionsSolvedVsExam: number; accuracyVsExam: number; studyStreakVsExam: number; timeSpentVsExam: number }
  regressionModels: { questionsSolved: { slope: number; intercept: number; r2: number }; accuracy: { slope: number; intercept: number; r2: number }; studyStreak: { slope: number; intercept: number; r2: number }; timeSpent: { slope: number; intercept: number; r2: number } }
  dailyActivity: { date: string; attempts: number; uniqueUsers: number }[]
  scatterData: { questionsVsScore: { x: number; y: number }[]; accuracyVsScore: { x: number; y: number }[]; streakVsScore: { x: number; y: number }[]; timeVsScore: { x: number; y: number }[] }
  sampleSize: number
}

interface Props {
  data: BehaviorAnalytics | null
}

export default function BehaviorTab({ data }: Props) {
  if (!data) return null

  const corrColor = (v: number) => Math.abs(v) >= 0.6 ? '#10b981' : Math.abs(v) >= 0.3 ? '#f59e0b' : '#64748b'
  const r2Color = (v: number) => v >= 0.5 ? '#10b981' : v >= 0.2 ? '#f59e0b' : '#64748b'

  const correlationCards = [
    { label: 'Questions vs Score', value: data.correlations.questionsSolvedVsExam, color: '#8b5cf6', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: 'Accuracy vs Score', value: data.correlations.accuracyVsExam, color: '#10b981', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Streak vs Score', value: data.correlations.studyStreakVsExam, color: '#f59e0b', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
    { label: 'Time vs Score', value: data.correlations.timeSpentVsExam, color: '#06b6d4', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ]

  const scatterCharts = [
    { title: 'Questions Solved vs Score', data: data.scatterData.questionsVsScore, xLabel: 'Questions', color: '#8b5cf6' },
    { title: 'Accuracy vs Score', data: data.scatterData.accuracyVsScore, xLabel: 'Accuracy %', color: '#10b981' },
    { title: 'Study Streak vs Score', data: data.scatterData.streakVsScore, xLabel: 'Streak (days)', color: '#f59e0b' },
    { title: 'Time Spent vs Score', data: data.scatterData.timeVsScore, xLabel: 'Time (min)', color: '#06b6d4' },
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
          Learning Behavior Analytics
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">How study behaviors correlate with exam performance (n={data.sampleSize})</p>
      </motion.div>

      {/* Correlation Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {correlationCards.map((c, i) => (
          <motion.div
            key={c.label}
            className="relative rounded-2xl p-4 sm:p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${c.color}08, ${c.color}03)`,
              border: `1px solid ${c.color}18`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ background: `radial-gradient(circle, ${c.color}, transparent 70%)` }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.color}15`, color: c.color }}>{c.icon}</div>
              <div className="w-2 h-2 rounded-full" style={{ background: corrColor(c.value), boxShadow: `0 0 6px ${corrColor(c.value)}50` }} />
            </div>
            <div className="relative text-xl sm:text-2xl font-black tabular-nums" style={{ color: corrColor(c.value) }}>r={c.value}</div>
            <div className="relative text-[10px] text-[#64748b] mt-1 font-medium">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Regression Models */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
          Linear Regression Models (R-squared)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Questions Solved', r2: data.regressionModels.questionsSolved.r2, color: '#8b5cf6' },
            { label: 'Accuracy', r2: data.regressionModels.accuracy.r2, color: '#10b981' },
            { label: 'Study Streak', r2: data.regressionModels.studyStreak.r2, color: '#f59e0b' },
            { label: 'Time Spent', r2: data.regressionModels.timeSpent.r2, color: '#06b6d4' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              className="relative rounded-xl p-3 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${m.color}08, ${m.color}03)`,
                border: `1px solid ${m.color}18`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
            >
              <div className="text-lg font-black" style={{ color: r2Color(m.r2) }}>{(m.r2 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[#64748b] font-medium">{m.label}</div>
              <div className="w-full h-1.5 bg-[#1e2d45] rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: r2Color(m.r2) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(m.r2 * 100, 2)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scatter Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {scatterCharts.map((chart, idx) => (
          <motion.div
            key={chart.title}
            className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
          >
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${chart.color}10` }}>
                <svg className="w-3.5 h-3.5" style={{ color: chart.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
              {chart.title}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                <XAxis dataKey="x" name={chart.xLabel} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                <YAxis dataKey="y" name="Score" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
                <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                <Scatter data={chart.data} fill={chart.color} />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      {/* Activity Trend */}
      {data.dailyActivity.length > 0 && (
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            Activity Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} axisLine={{ stroke: '#1e2d4540' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
              <Line type="monotone" dataKey="attempts" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="Attempts" />
              <Line type="monotone" dataKey="uniqueUsers" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Active Users" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {data.sampleSize === 0 && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No Behavior Data</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">Data will appear as students engage with quizzes.</p>
        </motion.div>
      )}
    </div>
  )
}

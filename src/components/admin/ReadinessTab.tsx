'use client'

import { motion } from 'framer-motion'

const TREND_COLORS = { improving: '#10b981', stable: '#6366f1', declining: '#ef4444' }

interface ReadinessData {
  readinessData: { userId: string; userName: string; readinessScore: number; predictedRange: { low: number; high: number }; trend: 'improving' | 'stable' | 'declining'; breakdown: { accuracy: number; consistency: number; activity: number; subjectCoverage: number; historical: number } }[]
}

interface Props {
  data: ReadinessData | null
}

export default function ReadinessTab({ data }: Props) {
  if (!data) return null

  const scoreColor = (v: number) => v >= 80 ? '#10b981' : v >= 60 ? '#8b5cf6' : v >= 40 ? '#f59e0b' : '#ef4444'

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
          Exam Readiness System
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">Predicted exam performance based on learning behavior and performance metrics</p>
      </motion.div>

      <div className="space-y-4">
        {data.readinessData.map((s, i) => {
          const color = scoreColor(s.readinessScore)
          const trendColor = TREND_COLORS[s.trend]
          return (
            <motion.div
              key={s.userId}
              className="relative rounded-2xl p-5 sm:p-6 overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${color}06, ${color}02)`,
                border: `1px solid ${color}18`,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              {/* Background glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />

              <div className="flex items-center gap-5 mb-5 relative">
                {/* Donut Chart */}
                <div className="shrink-0 w-20 h-20 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d4540" strokeWidth="2.5" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${s.readinessScore}, 100`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black" style={{ color }}>{s.readinessScore}%</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-bold">{s.userName}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold" style={{
                      background: `${trendColor}12`,
                      color: trendColor,
                      border: `1px solid ${trendColor}30`,
                    }}>{s.trend}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Based on current performance, expected exam score is between <strong className="text-[#8b5cf6]">{s.predictedRange.low}%</strong> and <strong className="text-[#8b5cf6]">{s.predictedRange.high}%</strong>.
                  </p>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="grid grid-cols-5 gap-3 relative">
                {[
                  { label: 'Accuracy', value: s.breakdown.accuracy, max: 35, color: '#8b5cf6' },
                  { label: 'Consistency', value: s.breakdown.consistency, max: 25, color: '#6366f1' },
                  { label: 'Activity', value: s.breakdown.activity, max: 20, color: '#10b981' },
                  { label: 'Subjects', value: s.breakdown.subjectCoverage, max: 10, color: '#f59e0b' },
                  { label: 'History', value: s.breakdown.historical, max: 10, color: '#06b6d4' },
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <div className="w-full h-1.5 bg-[#1e2d45] rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: b.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(b.value / b.max) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.06 }}
                      />
                    </div>
                    <div className="text-[10px] text-[#64748b] font-medium">{b.label}</div>
                    <div className="text-[10px] font-bold" style={{ color: b.color }}>{b.value.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {data.readinessData.length === 0 && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No Readiness Data</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">Data will appear as students take quizzes.</p>
        </motion.div>
      )}
    </div>
  )
}

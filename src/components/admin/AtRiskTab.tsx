'use client'

import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

const RISK_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }

interface AtRiskData {
  atRiskStudents: { userId: string; userName: string; avgAccuracy: number; totalAttempts: number; studyStreak: number; avgScore: number; riskScore: number; riskLevel: 'Low' | 'Medium' | 'High'; riskFactors: { lowAccuracy: boolean; lowActivity: boolean; lowStreak: boolean; lowCompletion: boolean; decliningTrend: boolean }; recommendedAction: string }[]
  total: number
}

interface Props {
  data: AtRiskData | null
}

export default function AtRiskTab({ data }: Props) {
  if (!data) return null

  const riskLevels = [
    { level: 'High', color: '#ef4444', count: data.atRiskStudents.filter(s => s.riskLevel === 'High').length, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { level: 'Medium', color: '#f59e0b', count: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { level: 'Low', color: '#10b981', count: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ] as const

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
          At-Risk Student Detection
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">Automatically identified students who may need additional support ({data.total} students flagged)</p>
      </motion.div>

      {/* Risk Level Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {riskLevels.map((r, i) => (
          <motion.div
            key={r.level}
            className="relative rounded-2xl p-4 sm:p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${r.color}08, ${r.color}03)`,
              border: `1px solid ${r.color}18`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ background: `radial-gradient(circle, ${r.color}, transparent 70%)` }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${r.color}15`, color: r.color }}>{r.icon}</div>
              <div className="w-2 h-2 rounded-full" style={{ background: r.color, boxShadow: `0 0 6px ${r.color}50` }} />
            </div>
            <div className="relative text-2xl sm:text-3xl font-black tabular-nums" style={{ color: r.color }}>{r.count}</div>
            <div className="relative text-[11px] text-[#64748b] mt-1 font-medium">{r.level} Risk</div>
          </motion.div>
        ))}
      </div>

      {/* Donut Chart */}
      {data.total > 0 && (
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </div>
            Risk Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: 'High Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                  { name: 'Medium Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                  { name: 'Low Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                ].filter(d => d.value > 0)}
                dataKey="value" cx="50%" cy="50%" outerRadius={95} innerRadius={55}
                paddingAngle={3}
              >
                {[
                  { name: 'High Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                  { name: 'Medium Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                  { name: 'Low Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                ].filter(d => d.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Student Risk Cards */}
      <div className="space-y-3">
        {data.atRiskStudents.map((s, i) => {
          const riskColor = RISK_COLORS[s.riskLevel]
          return (
            <motion.div
              key={s.userId}
              className="relative rounded-2xl p-5 sm:p-6 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${riskColor}06, ${riskColor}02)`,
                border: `1px solid ${riskColor}18`,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
            >
              {/* Background glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${riskColor}, transparent 70%)` }} />

              <div className="flex items-start gap-4 relative">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                    <span className="font-bold text-sm">{s.userName}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${riskColor}15`, color: riskColor, border: `1px solid ${riskColor}30` }}>{s.riskLevel} Risk</span>
                    <span className="text-xs font-black tabular-nums" style={{ color: riskColor }}>Score: {s.riskScore}/100</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                    <div className="rounded-lg px-2.5 py-1.5" style={{ background: `${s.avgAccuracy < 60 ? '#ef4444' : '#64748b'}08` }}>
                      <span className="text-[#64748b]">Accuracy:</span> <span className="font-bold" style={{ color: s.avgAccuracy < 60 ? '#ef4444' : '#94a3b8' }}>{s.avgAccuracy}%</span>
                    </div>
                    <div className="rounded-lg px-2.5 py-1.5 bg-[#64748b]/[0.03]">
                      <span className="text-[#64748b]">Attempts:</span> <span className="font-bold text-[#94a3b8]">{s.totalAttempts}</span>
                    </div>
                    <div className="rounded-lg px-2.5 py-1.5 bg-[#64748b]/[0.03]">
                      <span className="text-[#64748b]">Streak:</span> <span className="font-bold text-[#94a3b8]">{s.studyStreak}d</span>
                    </div>
                    <div className="rounded-lg px-2.5 py-1.5 bg-[#64748b]/[0.03]">
                      <span className="text-[#64748b]">Avg Score:</span> <span className="font-bold text-[#94a3b8]">{s.avgScore}%</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.riskFactors.lowAccuracy && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25">Low Accuracy</span>}
                    {s.riskFactors.lowActivity && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25">Low Activity</span>}
                    {s.riskFactors.lowStreak && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25">Low Streak</span>}
                    {s.riskFactors.lowCompletion && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25">Low Completion</span>}
                    {s.riskFactors.decliningTrend && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25">Declining Trend</span>}
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                    <p className="text-xs text-[#67e8f9] flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {s.recommendedAction}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d45" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={riskColor} strokeWidth="3" strokeDasharray={`${s.riskScore}, 100`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${riskColor}40)` }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: riskColor }}>{s.riskScore}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {data.total === 0 && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No At-Risk Students</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">All students are performing well. Keep monitoring!</p>
        </motion.div>
      )}
    </div>
  )
}

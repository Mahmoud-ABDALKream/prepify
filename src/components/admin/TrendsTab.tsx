'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface TrendsData {
  dailyActivity: { date: string; attempts: number; uniqueUsers: number; accuracy: number }[]
  hourlyHeatmap: { hour: number; attempts: number; uniqueUsers: number }[]
  subjectTrends: { subject: string; recent7: number; previous7: number; change: number }[]
  weeklyTrend: { week: string; attempts: number; avgScore: number }[]
  responseTrend: { date: string; successRate: number; total: number }[]
  summary: {
    last7Attempts: number
    prev7Attempts: number
    growth: number
    peakHour: number
    peakDay: string
    avgDailyActiveUsers: number
    totalLast7: number
  }
}

interface Props {
  data: TrendsData | null
}

const SUBJECT_META: Record<string, { label: string; short: string; color: string }> = {
  'microsoft-office':     { label: 'Microsoft Office',     short: 'MS',  color: '#f59e0b' },
  'c-programming':        { label: 'C Programming',         short: '{ }', color: '#7c3aed' },
  'iot':                  { label: 'IoT',                    short: 'IoT', color: '#10b981' },
  'cyber-security-2':     { label: 'Cyber Security 2',      short: 'CS',  color: '#ef4444' },
  'technical-english-2':  { label: 'Technical English 2',   short: 'EN',  color: '#3b82f6' },
}

function metaFor(s: string) {
  return SUBJECT_META[s] ?? { label: s, short: s.slice(0, 2).toUpperCase(), color: '#8b5cf6' }
}

const fmtDate = (s: string) => {
  if (!s) return ''
  const d = new Date(s)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function TrendsTab({ data }: Props) {
  if (!data) return null

  const { summary } = data

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">Trends & Activity</h1>
        <p className="text-[#64748b] text-sm mt-1.5">Time-series insights into learning engagement</p>
      </motion.div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Last 7 Days',      value: summary.totalLast7,         color: '#8b5cf6', sub: `${summary.prev7Attempts} prev` },
          { label: 'Growth',            value: `${summary.growth > 0 ? '+' : ''}${summary.growth}%`, color: summary.growth >= 0 ? '#10b981' : '#ef4444', sub: 'vs prev 7d' },
          { label: 'Avg Daily Users',   value: summary.avgDailyActiveUsers, color: '#06b6d4', sub: 'last 7 days' },
          { label: 'Peak Hour',         value: `${summary.peakHour}:00`,    color: '#f59e0b', sub: summary.peakDay ? fmtDate(summary.peakDay) : '—' },
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

      {/* ─── Daily Activity ─── */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          Daily Activity (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.dailyActivity}>
            <defs>
              <linearGradient id="grad-attempts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-users" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
            <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} interval={3} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
            <RechartsTooltip
              contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }}
              labelFormatter={(l) => `Date: ${l}`}
            />
            <Area type="monotone" dataKey="attempts"   stroke="#8b5cf6" fill="url(#grad-attempts)" name="Attempts" />
            <Area type="monotone" dataKey="uniqueUsers" stroke="#06b6d4" fill="url(#grad-users)"    name="Unique Users" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Two-column: Hourly Heatmap + Subject Trends ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly heatmap */}
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            When Students Study (Hourly)
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {data.hourlyHeatmap.map(h => {
              const max = Math.max(...data.hourlyHeatmap.map(x => x.attempts), 1)
              const intensity = h.attempts / max
              return (
                <div key={h.hour} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-full aspect-square rounded-sm relative group"
                    style={{
                      background: h.attempts > 0
                        ? `rgba(245, 158, 11, ${0.15 + intensity * 0.85})`
                        : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{h.attempts}</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-[#475569]">{h.hour % 3 === 0 ? h.hour : ''}</span>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-[#475569] mt-3">Peak activity at <span className="text-[#f59e0b] font-bold">{summary.peakHour}:00</span></p>
        </motion.div>

        {/* Subject trends */}
        <motion.div
          className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </div>
            Subject Trends (7d vs prev 7d)
          </h3>
          <div className="space-y-3">
            {data.subjectTrends.length === 0 && (
              <div className="text-center py-8 text-[#475569] text-sm">No data yet</div>
            )}
            {data.subjectTrends.map(s => {
              const m = metaFor(s.subject)
              return (
                <div key={s.subject} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ background: `${m.color}15`, color: m.color }}>
                    {m.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{m.label}</div>
                    <div className="text-[10px] text-[#64748b]">{s.recent7} recent · {s.previous7} prev</div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold tabular-nums"
                    style={{
                      background: s.change > 0 ? 'rgba(16,185,129,0.1)' : s.change < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.1)',
                      color: s.change > 0 ? '#10b981' : s.change < 0 ? '#ef4444' : '#64748b',
                    }}
                  >
                    {s.change > 0 ? '↑' : s.change < 0 ? '↓' : '−'} {Math.abs(s.change)}%
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── Weekly Performance Trend ─── */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          Weekly Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
            <XAxis dataKey="week" tickFormatter={fmtDate} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
            <YAxis yAxisId="left"  tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
            <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }} />
            <Legend />
            <Line yAxisId="left"  type="monotone" dataKey="attempts" stroke="#6366f1" name="Attempts"   strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#10b981" name="Avg Score" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Question Response Trend ─── */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          Question Success Rate (14 Days)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.responseTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
            <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#1e2d4540' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
            <RechartsTooltip
              contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: 12, fontSize: 12 }}
              labelFormatter={(l) => `Date: ${l}`}
            />
            <Bar dataKey="successRate" fill="#06b6d4" name="Success Rate %" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

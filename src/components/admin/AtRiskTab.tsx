'use client'

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">At-Risk Student Detection</h1>
        <p className="text-[#64748b] text-sm mt-1">Automatically identified students who may need additional support ({data.total} students flagged)</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { level: 'High', color: '#ef4444', count: data.atRiskStudents.filter(s => s.riskLevel === 'High').length },
          { level: 'Medium', color: '#f59e0b', count: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length },
          { level: 'Low', color: '#10b981', count: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length },
        ].map(r => (
          <div key={r.level} className="bg-[#111827] border rounded-2xl p-4 text-center" style={{ borderColor: `${r.color}30` }}>
            <div className="text-3xl font-black" style={{ color: r.color }}>{r.count}</div>
            <div className="text-xs font-bold mt-1" style={{ color: r.color }}>{r.level} Risk</div>
          </div>
        ))}
      </div>

      {data.total > 0 && (
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold mb-4">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'High Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                  { name: 'Medium Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                  { name: 'Low Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                ].filter(d => d.value > 0)}
                dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
              >
                {[
                  { name: 'High Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                  { name: 'Medium Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                  { name: 'Low Risk', value: data.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                ].filter(d => d.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-3">
        {data.atRiskStudents.map(s => (
          <div key={s.userId} className="bg-[#111827] border rounded-2xl p-5" style={{ borderColor: `${RISK_COLORS[s.riskLevel]}30` }}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-bold text-sm">{s.userName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${RISK_COLORS[s.riskLevel]}20`, color: RISK_COLORS[s.riskLevel], border: `1px solid ${RISK_COLORS[s.riskLevel]}40` }}>{s.riskLevel} Risk</span>
                  <span className="text-xs font-black" style={{ color: RISK_COLORS[s.riskLevel] }}>Score: {s.riskScore}/100</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                  <div><span className="text-[#64748b]">Accuracy:</span> <span className="font-bold" style={{ color: s.avgAccuracy < 60 ? '#ef4444' : '#94a3b8' }}>{s.avgAccuracy}%</span></div>
                  <div><span className="text-[#64748b]">Attempts:</span> <span className="font-bold">{s.totalAttempts}</span></div>
                  <div><span className="text-[#64748b]">Streak:</span> <span className="font-bold">{s.studyStreak}d</span></div>
                  <div><span className="text-[#64748b]">Avg Score:</span> <span className="font-bold">{s.avgScore}%</span></div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.riskFactors.lowAccuracy && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Low Accuracy</span>}
                  {s.riskFactors.lowActivity && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">Low Activity</span>}
                  {s.riskFactors.lowStreak && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">Low Streak</span>}
                  {s.riskFactors.lowCompletion && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Low Completion</span>}
                  {s.riskFactors.decliningTrend && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Declining Trend</span>}
                </div>
                <div className="bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.15)] rounded-lg p-2.5">
                  <p className="text-xs text-[#93c5fd]">{s.recommendedAction}</p>
                </div>
              </div>
              <div className="shrink-0 w-16 h-16 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d45" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={RISK_COLORS[s.riskLevel]} strokeWidth="3" strokeDasharray={`${s.riskScore}, 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: RISK_COLORS[s.riskLevel] }}>{s.riskScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.total === 0 && (
        <div className="text-center py-20"><div className="text-5xl mb-4">✅</div><h3 className="text-xl font-black mb-2">No At-Risk Students</h3><p className="text-[#64748b] text-sm">All students are performing well. Keep monitoring!</p></div>
      )}
    </div>
  )
}

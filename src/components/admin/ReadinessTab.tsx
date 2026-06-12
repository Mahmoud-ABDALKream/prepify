'use client'

const TREND_COLORS = { improving: '#10b981', stable: '#6366f1', declining: '#ef4444' }

interface ReadinessData {
  readinessData: { userId: string; userName: string; readinessScore: number; predictedRange: { low: number; high: number }; trend: 'improving' | 'stable' | 'declining'; breakdown: { accuracy: number; consistency: number; activity: number; subjectCoverage: number; historical: number } }[]
}

interface Props {
  data: ReadinessData | null
}

export default function ReadinessTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Exam Readiness System</h1>
        <p className="text-[#64748b] text-sm mt-1">Predicted exam performance based on learning behavior and performance metrics</p>
      </div>

      <div className="space-y-3">
        {data.readinessData.map((s) => (
          <div key={s.userId} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 hover:border-[#2d3f5e] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-20 h-20 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d45" strokeWidth="2.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={s.readinessScore >= 80 ? '#10b981' : s.readinessScore >= 60 ? '#8b5cf6' : s.readinessScore >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="2.5" strokeDasharray={`${s.readinessScore}, 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black">{s.readinessScore}%</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{s.userName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold" style={{
                    background: s.trend === 'improving' ? 'rgba(16,185,129,0.1)' : s.trend === 'declining' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                    color: TREND_COLORS[s.trend],
                    border: `1px solid ${TREND_COLORS[s.trend]}40`,
                  }}>{s.trend}</span>
                </div>
                <p className="text-xs text-[#94a3b8]">
                  Based on current performance, expected exam score is between <strong className="text-[#8b5cf6]">{s.predictedRange.low}%</strong> and <strong className="text-[#8b5cf6]">{s.predictedRange.high}%</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Accuracy', value: s.breakdown.accuracy, max: 35 },
                { label: 'Consistency', value: s.breakdown.consistency, max: 25 },
                { label: 'Activity', value: s.breakdown.activity, max: 20 },
                { label: 'Subjects', value: s.breakdown.subjectCoverage, max: 10 },
                { label: 'History', value: s.breakdown.historical, max: 10 },
              ].map(b => (
                <div key={b.label} className="text-center">
                  <div className="w-full h-1.5 bg-[#1e2d45] rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#8b5cf6] rounded-full transition-all" style={{ width: `${(b.value / b.max) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-[#64748b]">{b.label}</div>
                  <div className="text-[10px] font-bold">{b.value.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.readinessData.length === 0 && (
        <div className="text-center py-20"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-black mb-2">No Readiness Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
      )}
    </div>
  )
}

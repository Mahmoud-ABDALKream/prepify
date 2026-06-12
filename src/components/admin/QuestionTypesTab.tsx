'use client'

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface QuestionTypeAnalytics {
  questionTypes: { type: string; totalQuestions: number; avgScore: number; successRate: number; totalAttempts: number; uniqueUsers: number }[]
  correlations: { type: string; correlation: number }[]
  predictiveRanking: { type: string; correlation: number }[]
  mostPredictive: { type: string; correlation: number } | null
}

interface Props {
  data: QuestionTypeAnalytics | null
}

const formatQt = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function QuestionTypesTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Question Type Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1">How different question types predict exam performance</p>
      </div>

      {data.questionTypes.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Performance by Question Type</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.questionTypes.map(q => ({ ...q, type: formatQt(q.type) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                  <Bar dataKey="successRate" fill="#8b5cf6" name="Success Rate" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[6, 6, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Correlation with Exam Score</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.correlations.map(q => ({ ...q, type: formatQt(q.type) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[-1, 1]} />
                  <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                  <Bar dataKey="correlation" name="Pearson r" radius={[6, 6, 0, 0]}>
                    {data.correlations.map((entry, i) => (
                      <Cell key={i} fill={Math.abs(entry.correlation) >= 0.6 ? '#10b981' : Math.abs(entry.correlation) >= 0.3 ? '#f59e0b' : '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>🔮</span> Predictive Power Ranking</h3>
            <div className="space-y-2">
              {data.predictiveRanking.map((q, i) => (
                <div key={q.type} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: i === 0 ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-sm font-black w-6 text-center" style={{ color: i === 0 ? '#8b5cf6' : '#64748b' }}>#{i + 1}</span>
                  <span className="text-sm font-medium flex-1">{formatQt(q.type)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.abs(q.correlation) * 100}%`, background: Math.abs(q.correlation) >= 0.6 ? '#10b981' : Math.abs(q.correlation) >= 0.3 ? '#f59e0b' : '#64748b' }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: Math.abs(q.correlation) >= 0.6 ? '#10b981' : '#64748b' }}>r={q.correlation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.mostPredictive && (
            <div className="bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-2xl p-5">
              <p className="text-sm text-[#c4b5fd]">
                <strong>Key Finding:</strong> {formatQt(data.mostPredictive.type)} questions show the strongest relationship with exam success (r={data.mostPredictive.correlation}), making them the best predictor of final exam performance.
              </p>
            </div>
          )}
        </>
      )}

      {data.questionTypes.length === 0 && (
        <div className="text-center py-20"><div className="text-5xl mb-4">❓</div><h3 className="text-xl font-black mb-2">No Question Type Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
      )}
    </div>
  )
}

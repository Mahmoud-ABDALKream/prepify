'use client'

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
      <div className="mb-6">
        <h1 className="text-2xl font-black">Student Performance Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1">Detailed analysis of individual student performance and progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-4">Accuracy Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.accuracyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-4">Exam Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.examScoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers & Most Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>🏆</span> Top Performers</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.topPerformers.map((s, i) => (
              <div key={s.userId} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.1)]">
                <span className="text-sm font-black w-6 text-center" style={{ color: i < 3 ? '#fbbf24' : '#64748b' }}>#{i + 1}</span>
                <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                <span className="text-sm font-black text-[#8b5cf6]">{s.avgScore}%</span>
                <span className="text-[10px] text-[#64748b]">{s.totalAttempts} attempts</span>
              </div>
            ))}
            {data.topPerformers.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>📈</span> Most Improved</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.mostImproved.map((s, i) => (
              <div key={s.userId} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.1)]">
                <span className="text-sm font-black w-6 text-center text-[#64748b]">#{i + 1}</span>
                <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                <span className="text-sm font-black" style={{ color: s.improvement >= 0 ? '#10b981' : '#ef4444' }}>{s.improvement >= 0 ? '+' : ''}{s.improvement}%</span>
              </div>
            ))}
            {data.mostImproved.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
        <h3 className="text-sm font-bold mb-4">All Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#64748b] text-xs uppercase tracking-wider">
                <th className="text-left py-2 px-3">Student</th>
                <th className="text-center py-2 px-3">Attempts</th>
                <th className="text-center py-2 px-3">Avg Score</th>
                <th className="text-center py-2 px-3">Accuracy</th>
                <th className="text-center py-2 px-3">Best</th>
                <th className="text-center py-2 px-3">Streak</th>
                <th className="text-center py-2 px-3">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {data.students.sort((a, b) => b.avgScore - a.avgScore).map(s => (
                <tr key={s.userId} className="border-t border-[#1e2d45] hover:bg-[rgba(139,92,246,0.03)]">
                  <td className="py-2.5 px-3 font-medium">{s.userName}</td>
                  <td className="text-center py-2.5 px-3 text-[#8b5cf6] font-bold">{s.totalAttempts}</td>
                  <td className="text-center py-2.5 px-3 font-bold">{s.avgScore}%</td>
                  <td className="text-center py-2.5 px-3" style={{ color: s.avgAccuracy >= 70 ? '#10b981' : s.avgAccuracy >= 50 ? '#f59e0b' : '#ef4444' }}>{s.avgAccuracy}%</td>
                  <td className="text-center py-2.5 px-3">{s.bestScore}%</td>
                  <td className="text-center py-2.5 px-3">{s.studyStreak}d</td>
                  <td className="text-center py-2.5 px-3">{s.subjectsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

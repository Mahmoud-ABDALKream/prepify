'use client'

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Learning Analytics Overview</h1>
        <p className="text-[#64748b] text-sm mt-1">Real-time insights into student learning behavior and performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Students', value: data.totalStudents, color: '#8b5cf6', icon: '👥' },
          { label: 'Active Students', value: data.activeStudents, color: '#6366f1', icon: '🟢' },
          { label: 'Quiz Attempts', value: data.totalQuizAttempts, color: '#06b6d4', icon: '📝' },
          { label: 'Avg Accuracy', value: `${data.avgAccuracy}%`, color: '#10b981', icon: '🎯' },
          { label: 'Avg Study Streak', value: `${data.avgStudyStreak}d`, color: '#f59e0b', icon: '🔥' },
          { label: 'Pass Rate', value: `${data.passRate}%`, color: '#8b5cf6', icon: '✅' },
          { label: 'At-Risk Students', value: data.atRiskStudents, color: '#ef4444', icon: '⚠️' },
        ].map(card => (
          <div key={card.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 hover:border-[#2d3f5e] transition-colors">
            <div className="text-lg mb-1">{card.icon}</div>
            <div className="text-2xl font-black tabular-nums" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[11px] text-[#64748b] mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {studentData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studentData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {behaviorData && behaviorData.dailyActivity.length > 0 && (
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Daily Activity (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={behaviorData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                  <Area type="monotone" dataKey="attempts" stroke="#8b5cf6" fill="rgba(139,92,246,0.15)" strokeWidth={2} />
                  <Area type="monotone" dataKey="uniqueUsers" stroke="#6366f1" fill="rgba(99,102,241,0.1)" strokeWidth={2} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {!data.totalStudents && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-black mb-2">No Data Yet</h3>
          <p className="text-[#64748b] text-sm">Analytics will appear as students start taking quizzes.</p>
        </div>
      )}
    </div>
  )
}

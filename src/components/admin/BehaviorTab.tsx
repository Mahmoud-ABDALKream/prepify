'use client'

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Learning Behavior Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1">How study behaviors correlate with exam performance (n={data.sampleSize})</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Questions vs Score', value: data.correlations.questionsSolvedVsExam, icon: '📝' },
          { label: 'Accuracy vs Score', value: data.correlations.accuracyVsExam, icon: '🎯' },
          { label: 'Streak vs Score', value: data.correlations.studyStreakVsExam, icon: '🔥' },
          { label: 'Time vs Score', value: data.correlations.timeSpentVsExam, icon: '⏱️' },
        ].map(c => (
          <div key={c.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4">
            <div className="text-lg mb-1">{c.icon}</div>
            <div className="text-xl font-black" style={{ color: Math.abs(c.value) >= 0.6 ? '#10b981' : Math.abs(c.value) >= 0.3 ? '#f59e0b' : '#64748b' }}>r={c.value}</div>
            <div className="text-[10px] text-[#64748b] mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold mb-4">Linear Regression Models (R-squared)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Questions Solved', r2: data.regressionModels.questionsSolved.r2 },
            { label: 'Accuracy', r2: data.regressionModels.accuracy.r2 },
            { label: 'Study Streak', r2: data.regressionModels.studyStreak.r2 },
            { label: 'Time Spent', r2: data.regressionModels.timeSpent.r2 },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="text-lg font-black" style={{ color: m.r2 >= 0.5 ? '#10b981' : m.r2 >= 0.2 ? '#f59e0b' : '#64748b' }}>{(m.r2 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[#64748b]">{m.label}</div>
              <div className="w-full h-1.5 bg-[#1e2d45] rounded-full mt-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.max(m.r2 * 100, 2)}%`, background: m.r2 >= 0.5 ? '#10b981' : m.r2 >= 0.2 ? '#f59e0b' : '#64748b' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {[
          { title: 'Questions Solved vs Score', data: data.scatterData.questionsVsScore, xLabel: 'Questions', color: '#8b5cf6' },
          { title: 'Accuracy vs Score', data: data.scatterData.accuracyVsScore, xLabel: 'Accuracy %', color: '#10b981' },
          { title: 'Study Streak vs Score', data: data.scatterData.streakVsScore, xLabel: 'Streak (days)', color: '#f59e0b' },
          { title: 'Time Spent vs Score', data: data.scatterData.timeVsScore, xLabel: 'Time (min)', color: '#06b6d4' },
        ].map(chart => (
          <div key={chart.title} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="x" name={chart.xLabel} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="y" name="Score" tick={{ fill: '#64748b', fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                <Scatter data={chart.data} fill={chart.color} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {data.dailyActivity.length > 0 && (
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-4">Activity Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
              <Line type="monotone" dataKey="attempts" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Attempts" />
              <Line type="monotone" dataKey="uniqueUsers" stroke="#06b6d4" strokeWidth={2} dot={false} name="Active Users" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.sampleSize === 0 && (
        <div className="text-center py-20"><div className="text-5xl mb-4">🧠</div><h3 className="text-xl font-black mb-2">No Behavior Data</h3><p className="text-[#64748b] text-sm">Data will appear as students engage with quizzes.</p></div>
      )}
    </div>
  )
}

'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface SubjectAnalytics {
  subjects: { subject: string; totalAttempts: number; uniqueStudents: number; avgAccuracy: number; avgScore: number; avgExamScore: number; passRate: number; difficultyIndex: number }[]
  rankings: { hardestSubject: { subject: string; difficultyIndex: number } | null; easiestSubject: { subject: string; difficultyIndex: number } | null; mostStudiedSubject: { subject: string; totalAttempts: number } | null }
}

interface Props {
  data: SubjectAnalytics | null
}

const formatSubject = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function SubjectsTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Subject Analytics</h1>
        <p className="text-[#64748b] text-sm mt-1">Performance breakdown by subject area</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {data.rankings.hardestSubject && (
          <div className="bg-[#111827] border border-[#ef4444]/20 rounded-2xl p-4">
            <div className="text-xs text-[#ef4444] font-bold uppercase tracking-wider mb-1">Hardest Subject</div>
            <div className="text-lg font-black">{formatSubject(data.rankings.hardestSubject.subject)}</div>
            <div className="text-xs text-[#64748b]">Difficulty: {data.rankings.hardestSubject.difficultyIndex}</div>
          </div>
        )}
        {data.rankings.easiestSubject && (
          <div className="bg-[#111827] border border-[#10b981]/20 rounded-2xl p-4">
            <div className="text-xs text-[#10b981] font-bold uppercase tracking-wider mb-1">Easiest Subject</div>
            <div className="text-lg font-black">{formatSubject(data.rankings.easiestSubject.subject)}</div>
            <div className="text-xs text-[#64748b]">Difficulty: {data.rankings.easiestSubject.difficultyIndex}</div>
          </div>
        )}
        {data.rankings.mostStudiedSubject && (
          <div className="bg-[#111827] border border-[#8b5cf6]/20 rounded-2xl p-4">
            <div className="text-xs text-[#8b5cf6] font-bold uppercase tracking-wider mb-1">Most Studied</div>
            <div className="text-lg font-black">{formatSubject(data.rankings.mostStudiedSubject.subject)}</div>
            <div className="text-xs text-[#64748b]">{data.rankings.mostStudiedSubject.totalAttempts} attempts</div>
          </div>
        )}
      </div>

      {data.subjects.length > 0 && (
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold mb-4">Subject Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjects.map(s => ({ ...s, subject: formatSubject(s.subject) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="avgAccuracy" fill="#8b5cf6" name="Avg Accuracy" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="difficultyIndex" fill="#ef4444" name="Difficulty" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.subjects.map(s => (
          <div key={s.subject} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
            <h4 className="font-bold mb-3">{formatSubject(s.subject)}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-[#64748b]">Accuracy:</span> <span className="font-bold" style={{ color: s.avgAccuracy >= 70 ? '#10b981' : '#f59e0b' }}>{s.avgAccuracy}%</span></div>
              <div><span className="text-[#64748b]">Avg Score:</span> <span className="font-bold">{s.avgScore}%</span></div>
              <div><span className="text-[#64748b]">Attempts:</span> <span className="font-bold text-[#8b5cf6]">{s.totalAttempts}</span></div>
              <div><span className="text-[#64748b]">Students:</span> <span className="font-bold">{s.uniqueStudents}</span></div>
              <div><span className="text-[#64748b]">Difficulty:</span> <span className="font-bold" style={{ color: s.difficultyIndex > 50 ? '#ef4444' : '#10b981' }}>{s.difficultyIndex}</span></div>
              <div><span className="text-[#64748b]">Pass Rate:</span> <span className="font-bold">{s.passRate}%</span></div>
            </div>
          </div>
        ))}
      </div>

      {data.subjects.length === 0 && (
        <div className="text-center py-20"><div className="text-5xl mb-4">📚</div><h3 className="text-xl font-black mb-2">No Subject Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
      )}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

interface FindingsData {
  findings: { category: string; finding: string; metric: string; impact: 'high' | 'medium' | 'low' }[]
  message?: string
}

interface Props {
  data: FindingsData | null
}

export default function FindingsTab({ data }: Props) {
  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Research Findings</h1>
        <p className="text-[#64748b] text-sm mt-1">AI-generated insights from learning analytics data, suitable for academic research</p>
      </div>

      {data.message ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">💡</div><h3 className="text-xl font-black mb-2">No Data Available</h3><p className="text-[#64748b] text-sm">{data.message}</p></div>
      ) : (
        <div className="space-y-4">
          {data.findings.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-[#111827] border rounded-2xl p-5"
              style={{ borderColor: f.impact === 'high' ? 'rgba(139,92,246,0.3)' : f.impact === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: f.impact === 'high' ? 'rgba(139,92,246,0.15)' : f.impact === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)' }}>
                  {f.category === 'Study Behavior' ? '🔥' : f.category === 'Prediction' ? '🎯' : f.category === 'Subject Difficulty' ? '📚' : f.category === 'Question Types' ? '❓' : f.category === 'Practice Frequency' ? '📝' : f.category === 'Exam Results' ? '📊' : '💡'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{
                      background: f.impact === 'high' ? 'rgba(139,92,246,0.15)' : f.impact === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                      color: f.impact === 'high' ? '#8b5cf6' : f.impact === 'medium' ? '#f59e0b' : '#64748b',
                    }}>{f.impact} impact</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] text-[#94a3b8]">{f.category}</span>
                    <span className="text-[10px] font-bold text-[#8b5cf6] ml-auto">{f.metric}</span>
                  </div>
                  <p className="text-sm text-[#cbd5e1] leading-relaxed">{f.finding}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.15)] rounded-2xl p-6 mt-6">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><span>🎓</span> Research Applications</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">These findings can be used in academic papers related to:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Educational Technology (EdTech)', 'Learning Analytics', 'Student Performance Prediction', 'Adaptive Learning Systems', 'AI in Education', 'Educational Data Mining'].map(area => (
                <div key={area} className="text-[10px] px-3 py-2 rounded-lg bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.15)] text-[#c4b5fd] text-center">{area}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

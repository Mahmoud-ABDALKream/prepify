'use client'

import { motion } from 'framer-motion'

interface FindingsData {
  findings: { category: string; finding: string; metric: string; impact: 'high' | 'medium' | 'low' }[]
  message?: string
}

interface Props {
  data: FindingsData | null
}

const IMPACT_COLORS = { high: '#8b5cf6', medium: '#f59e0b', low: '#64748b' }

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Study Behavior': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  'Prediction': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  'Subject Difficulty': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  'Question Types': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  'Practice Frequency': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  'Exam Results': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
}

const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>

export default function FindingsTab({ data }: Props) {
  if (!data) return null

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
          Research Findings
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">AI-generated insights from learning analytics data, suitable for academic research</p>
      </motion.div>

      {data.message ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">No Data Available</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">{data.message}</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {data.findings.map((f, i) => {
            const impactColor = IMPACT_COLORS[f.impact]
            return (
              <motion.div
                key={i}
                className="relative rounded-2xl p-5 sm:p-6 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${impactColor}06, ${impactColor}02)`,
                  border: `1px solid ${impactColor}18`,
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {/* Background glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${impactColor}, transparent 70%)` }} />

                <div className="flex items-start gap-4 relative">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${impactColor}12`, color: impactColor }}>
                    {getCategoryIcon(f.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider" style={{
                        background: `${impactColor}12`,
                        color: impactColor,
                        border: `1px solid ${impactColor}25`,
                      }}>{f.impact} impact</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)] text-[#94a3b8] border border-[rgba(255,255,255,0.06)]">{f.category}</span>
                      <span className="text-[10px] font-bold ml-auto" style={{ color: impactColor }}>{f.metric}</span>
                    </div>
                    <p className="text-sm text-[#cbd5e1] leading-relaxed">{f.finding}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Research Applications */}
          <motion.div
            className="relative rounded-2xl p-5 sm:p-6 mt-6 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />

            <h3 className="text-sm font-bold mb-4 flex items-center gap-2.5 relative">
              <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              Research Applications
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4 relative">These findings can be used in academic papers related to:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 relative">
              {['Educational Technology (EdTech)', 'Learning Analytics', 'Student Performance Prediction', 'Adaptive Learning Systems', 'AI in Education', 'Educational Data Mining'].map(area => (
                <div key={area} className="text-[10px] px-3 py-2.5 rounded-xl text-[#c4b5fd] text-center font-medium" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>{area}</div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

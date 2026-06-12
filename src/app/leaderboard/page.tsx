'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────
interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  totalAttempts: number
  avgScore: number
  readinessScore: number
  predictedRange: { low: number; high: number }
  bestScore?: number
  subjectsCount?: number
  overallAccuracy?: number
  accuracy?: number
}

type LeaderboardType = 'global' | 'subject' | 'quiz'
type SubjectTab = 'global' | 'cyber-security-2' | 'c-programming'

// ─── Component ────────────────────────────────────────
export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<SubjectTab>('global')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard(activeTab)
  }, [activeTab])

  const fetchLeaderboard = async (tab: SubjectTab) => {
    setLoading(true)
    setError('')
    try {
      let url = '/api/leaderboard?'
      if (tab === 'global') {
        url += 'type=global&limit=50'
      } else if (tab === 'cyber-security-2') {
        url += 'type=subject&subject=cyber-security-2&limit=50'
      } else {
        url += 'type=subject&subject=c-programming&limit=50'
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load leaderboard')
      const data = await res.json()
      setLeaderboard(data.leaderboard || [])
    } catch (err) {
      setError('Could not load leaderboard. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getReadinessColor = (score: number) => {
    if (score >= 85) return { main: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' }
    if (score >= 70) return { main: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' }
    if (score >= 50) return { main: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' }
    return { main: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' }
  }

  const getReadinessLabel = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Needs Work'
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' }
    if (rank === 2) return { emoji: '🥈', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' }
    if (rank === 3) return { emoji: '🥉', color: '#d97706', bg: 'rgba(217,119,6,0.15)' }
    return null
  }

  const tabs: { id: SubjectTab; label: string; icon: string }[] = [
    { id: 'global', label: 'Global', icon: '🌍' },
    { id: 'cyber-security-2', label: 'Cyber Sec', icon: '🔒' },
    { id: 'c-programming', label: 'C Prog', icon: '💻' },
  ]

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      </div>

      <div className="relative z-1 max-w-[920px] mx-auto px-4 pb-10">
        {/* Navbar */}
        <motion.nav
          className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c18]/90 border-b border-[#1e2d45] -mx-4 px-4 py-2.5 sm:py-3"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <a href="/" className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#64748b] hover:text-[#8b5cf6] hover:border-[#8b5cf6]/50 transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </a>
              <div>
                <h2 className="text-sm sm:text-base font-black truncate bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Leaderboard</h2>
                <p className="text-[10px] sm:text-xs text-[#64748b]">Top performers across all quizzes</p>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero */}
        <motion.div
          className="text-center py-8 sm:py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Rankings
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Leaderboard</h1>
          <p className="text-[#64748b] text-sm sm:text-base max-w-md mx-auto">
            See who&apos;s on top! More completed exams = higher rank. Ready to climb?
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={{
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                  : 'rgba(255,255,255,0.05)',
                border: activeTab === tab.id
                  ? '1px solid rgba(139,92,246,0.6)'
                  : '1px solid rgba(255,255,255,0.1)',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                boxShadow: activeTab === tab.id ? '0 0 15px rgba(139,92,246,0.3)' : 'none',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-10 h-10 border-3 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#64748b] text-sm mt-4">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-[#ef4444] text-sm">{error}</p>
                <button
                  onClick={() => fetchLeaderboard(activeTab)}
                  className="mt-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white rounded-xl px-5 py-2 text-sm font-bold"
                >
                  Retry
                </button>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-black mb-2">No attempts yet!</h3>
                <p className="text-[#64748b] text-sm mb-4">Be the first to complete a quiz and claim the top spot.</p>
                <a
                  href="/"
                  className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white rounded-xl px-6 py-3 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  Start a Quiz
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-[50px_1fr_80px_90px_100px] sm:grid-cols-[60px_1fr_100px_120px_120px] gap-2 px-4 py-2 text-[10px] sm:text-xs text-[#64748b] uppercase tracking-wider font-bold">
                  <div>Rank</div>
                  <div>Player</div>
                  <div className="text-center">Exams</div>
                  <div className="text-center">Readiness</div>
                  <div className="text-right">Avg Score</div>
                </div>

                {/* Rows */}
                {leaderboard.map((entry, idx) => {
                  const readiness = getReadinessColor(entry.readinessScore)
                  const badge = getRankBadge(entry.rank)
                  return (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="grid grid-cols-[50px_1fr_80px_90px_100px] sm:grid-cols-[60px_1fr_100px_120px_120px] gap-2 items-center px-4 py-3 rounded-xl transition-all hover:bg-[rgba(139,92,246,0.05)]"
                      style={{
                        background: badge ? badge.bg : 'rgba(255,255,255,0.02)',
                        border: badge ? `1px solid ${badge.color}30` : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center">
                        {badge ? (
                          <span className="text-2xl">{badge.emoji}</span>
                        ) : (
                          <span className="text-sm font-bold text-[#64748b]">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Player */}
                      <div className="min-w-0">
                        <div className="text-sm font-bold truncate">{entry.userName}</div>
                        <div className="text-[10px] text-[#64748b]">
                          {activeTab === 'global' && entry.subjectsCount
                            ? `${entry.subjectsCount} subject${entry.subjectsCount > 1 ? 's' : ''}`
                            : `${entry.totalAttempts} attempt${entry.totalAttempts > 1 ? 's' : ''}`}
                        </div>
                      </div>

                      {/* Exams */}
                      <div className="text-center">
                        <span className="text-sm font-bold text-[#8b5cf6]">{entry.totalAttempts}</span>
                      </div>

                      {/* Readiness */}
                      <div className="text-center">
                        <div
                          className="inline-flex flex-col items-center px-2.5 py-1 rounded-lg"
                          style={{ background: readiness.bg, border: `1px solid ${readiness.border}` }}
                        >
                          <span className="text-xs font-black" style={{ color: readiness.main }}>
                            {entry.readinessScore}%
                          </span>
                          <span className="text-[8px] font-bold" style={{ color: readiness.main, opacity: 0.7 }}>
                            {getReadinessLabel(entry.readinessScore)}
                          </span>
                        </div>
                      </div>

                      {/* Avg Score */}
                      <div className="text-right">
                        <span className="text-sm font-bold">{entry.avgScore}%</span>
                        <div className="text-[9px] text-[#64748b]">
                          Predict: {entry.predictedRange.low}–{entry.predictedRange.high}%
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Exam Readiness Explanation */}
            {!loading && leaderboard.length > 0 && (
              <motion.div
                className="mt-8 bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                  <span>📊</span> Understanding Exam Readiness Score
                </h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-3">
                  The <strong className="text-[#8b5cf6]">Exam Readiness Score</strong> is a composite metric that predicts your likely performance in the final exam. It goes beyond simple averages by considering multiple factors:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.15)] rounded-lg p-3">
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="text-xs font-bold">Average Score (40%)</div>
                      <div className="text-[10px] text-[#64748b]">Your mean performance across all attempts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.15)] rounded-lg p-3">
                    <span className="text-lg">📈</span>
                    <div>
                      <div className="text-xs font-bold">Consistency (30%)</div>
                      <div className="text-[10px] text-[#64748b]">How stable your scores are across attempts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.15)] rounded-lg p-3">
                    <span className="text-lg">📚</span>
                    <div>
                      <div className="text-xs font-bold">Exam Count (20%)</div>
                      <div className="text-[10px] text-[#64748b]">More completed exams = more practice = higher readiness</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.15)] rounded-lg p-3">
                    <span className="text-lg">🌐</span>
                    <div>
                      <div className="text-xs font-bold">Subject Diversity (10%)</div>
                      <div className="text-[10px] text-[#64748b]">Cross-subject performance shows well-rounded prep</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] rounded-lg p-3">
                  <p className="text-xs text-[#93c5fd]">
                    💡 <strong>Prediction Example:</strong> &quot;Based on your performance, you are likely to score between <strong>82–90%</strong> in the final exam.&quot; — The prediction range accounts for score variance and provides a realistic confidence interval.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#1e2d45] mt-8">
          <div className="text-[#64748b] text-sm">
            Leaderboard — Prepify
          </div>
        </footer>
      </div>
    </div>
  )
}

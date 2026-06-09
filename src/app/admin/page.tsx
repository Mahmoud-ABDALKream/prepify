'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Feedback {
  id: string
  name: string
  email: string
  message: string
  rating: number
  subject: string | null
  createdAt: string
}

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterSubject, setFilterSubject] = useState<string>('')

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback', {
        headers: { 'x-admin-secret': password },
      })
      if (res.ok) {
        const data = await res.json()
        setFeedbacks(data.feedbacks)
      } else if (res.status === 401) {
        setAuthenticated(false)
        setAuthError('Session expired. Please re-enter the password.')
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [password])

  useEffect(() => {
    if (authenticated) fetchFeedbacks()
  }, [authenticated, fetchFeedbacks])

  const handleLogin = () => {
    // Try to authenticate by fetching feedback with the password
    fetch('/api/feedback', {
      headers: { 'x-admin-secret': password },
    }).then(res => {
      if (res.ok) {
        setAuthenticated(true)
        setAuthError('')
      } else {
        setAuthError('Wrong password. Try again.')
      }
    }).catch(() => {
      setAuthError('Connection error. Try again.')
    })
  }

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filterRating !== null && f.rating !== filterRating) return false
    if (filterSubject && f.subject !== filterSubject) return false
    return true
  })

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0'

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: feedbacks.filter(f => f.rating === r).length,
  }))

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans flex items-center justify-center px-4">
        <motion.div
          className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-black text-center mb-2">Admin Panel</h1>
          <p className="text-[#64748b] text-sm text-center mb-6">Enter password to access dashboard</p>
          {authError && (
            <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm rounded-xl px-4 py-3">{authError}</div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full bg-[#080c18] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#7c3aed] focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-all"
          >
            Login
          </button>
          <a href="/" className="block text-center text-[#64748b] text-sm mt-4 hover:text-[#00d4ff] transition-colors">Back to Home</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
      </div>

      <div className="relative z-1 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Feedback Dashboard</h1>
            <p className="text-[#64748b] text-sm mt-1">View all submitted feedback</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchFeedbacks}
              className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:border-[#7c3aed] transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <a href="/" className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-bold hover:border-[#00d4ff] transition-colors inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Home
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#7c3aed]">{feedbacks.length}</div>
            <div className="text-[11px] text-[#64748b]">Total</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#f59e0b]">{avgRating}</div>
            <div className="text-[11px] text-[#64748b]">Avg Rating</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#10b981]">{feedbacks.filter(f => f.rating >= 4).length}</div>
            <div className="text-[11px] text-[#64748b]">Positive</div>
          </div>
          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-[#ef4444]">{feedbacks.filter(f => f.rating <= 2).length}</div>
            <div className="text-[11px] text-[#64748b]">Negative</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-8">
          <h3 className="font-bold text-sm mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs text-[#f59e0b] w-8">{rating} ★</span>
                <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full transition-all duration-500"
                    style={{ width: feedbacks.length > 0 ? `${(count / feedbacks.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-[#64748b] w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterRating ?? ''}
            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-2 text-sm text-[#e2e8f0] cursor-pointer focus:border-[#7c3aed] focus:outline-none transition-all"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-2 text-sm text-[#e2e8f0] cursor-pointer focus:border-[#7c3aed] focus:outline-none transition-all"
          >
            <option value="">All Subjects</option>
            <option value="general">General</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="content">Content / Questions</option>
            <option value="ui">UI / Design</option>
            <option value="other">Other</option>
          </select>
          {(filterRating !== null || filterSubject) && (
            <button
              onClick={() => { setFilterRating(null); setFilterSubject('') }}
              className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] rounded-xl px-4 py-2 text-xs font-bold cursor-pointer hover:bg-[#ef4444]/20 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="text-center py-20">
            <svg className="w-10 h-10 animate-spin mx-auto text-[#7c3aed]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            <p className="text-[#64748b] text-sm mt-4">Loading feedback...</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 className="text-lg font-bold mb-2">No Feedback Yet</h3>
            <p className="text-[#64748b] text-sm">{filterRating !== null || filterSubject ? 'No feedback matches your filters.' : 'Feedback will appear here when users submit it.'}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {filteredFeedbacks.map((fb, idx) => (
                <motion.div
                  key={fb.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 hover:border-[#2d3f5e] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-sm">{fb.name}</span>
                        <span className="text-[#475569] text-xs">{fb.email}</span>
                        {fb.subject && (
                          <span className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {fb.subject}
                          </span>
                        )}
                        <span className="text-[#f59e0b] text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ color: i < fb.rating ? '#f59e0b' : '#1e2d45' }}>★</span>
                          ))}
                        </span>
                      </div>
                      <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-wrap">{fb.message}</p>
                      <p className="text-[#475569] text-xs mt-2">
                        {new Date(fb.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

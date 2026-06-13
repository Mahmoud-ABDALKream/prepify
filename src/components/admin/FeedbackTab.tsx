'use client'

import { useState } from 'react'
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

interface Props {
  feedbacks: Feedback[]
  password: string
  onRefresh: (fbs: Feedback[]) => void
}

export default function FeedbackTab({ feedbacks, password, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const filteredFeedbacks = filterRating !== null
    ? feedbacks.filter(f => f.rating === filterRating)
    : feedbacks

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/feedback', { headers: { 'x-admin-secret': password } })
      if (res.ok) {
        const data = await res.json()
        if (data) onRefresh(data.feedbacks)
      }
    } catch { /* ignore */ }
    setRefreshing(false)
  }

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0'

  const sentimentScore = feedbacks.length > 0
    ? Math.round((feedbacks.filter(f => f.rating >= 4).length / feedbacks.length) * 100)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span className="text-2xl">💬</span>
            Feedback Dashboard
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:border-[#7c3aed] transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="text-2xl font-black text-[#7c3aed]">{feedbacks.length}</div>
          <div className="text-[11px] text-[#64748b]">Total</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="text-2xl font-black text-[#f59e0b]">{avgRating}</div>
          <div className="text-[11px] text-[#64748b]">Avg Rating</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="text-2xl font-black text-[#10b981]">{sentimentScore}%</div>
          <div className="text-[11px] text-[#64748b]">Positive</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ef4444, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="text-2xl font-black text-[#ef4444]">{feedbacks.filter(f => f.rating <= 2).length}</div>
          <div className="text-[11px] text-[#64748b]">Negative</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span>📊</span> Rating Distribution
          </h3>
          {filterRating !== null && (
            <button
              onClick={() => setFilterRating(null)}
              className="text-xs text-[#7c3aed] hover:text-[#a78bfa] cursor-pointer font-bold transition-colors"
            >
              Clear Filter ✕
            </button>
          )}
        </div>
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map(r => {
            const count = feedbacks.filter(f => f.rating === r).length
            const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0
            const isActive = filterRating === r
            return (
              <button
                key={r}
                onClick={() => setFilterRating(isActive ? null : r)}
                className={`w-full flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1 transition-all ${
                  isActive ? 'bg-[rgba(245,158,11,0.08)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
                }`}
              >
                <span className="text-xs text-[#f59e0b] w-10 font-bold">{r} ★</span>
                <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: r >= 4 ? 'linear-gradient(to right, #10b981, #059669)' :
                                  r === 3 ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                                  'linear-gradient(to right, #ef4444, #dc2626)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs text-[#64748b] w-8 text-right tabular-nums">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-black mb-2">
            {filterRating !== null ? 'No Reviews with This Rating' : 'No Feedback Yet'}
          </h3>
          <p className="text-[#64748b] text-sm">
            {filterRating !== null ? 'Try a different rating filter.' : 'Feedback will appear when users submit it.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map(fb => {
            const isExpanded = expandedId === fb.id
            const ratingColor = fb.rating >= 4 ? '#10b981' : fb.rating === 3 ? '#f59e0b' : '#ef4444'
            return (
              <motion.div
                key={fb.id}
                layout
                className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden hover:border-[#2d3f5e] transition-colors"
              >
                {/* Card Header */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: `${ratingColor}20`, color: ratingColor, border: `1px solid ${ratingColor}40` }}
                    >
                      {fb.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm">{fb.name}</span>
                    {fb.subject && (
                      <span className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {fb.subject}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1">
                      <span className="text-sm">{Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < fb.rating ? '#f59e0b' : '#1e2d45' }}>★</span>
                      ))}</span>
                    </span>
                  </div>
                  {/* Message preview */}
                  <p className="text-[#94a3b8] text-sm leading-relaxed" style={{ direction: 'auto', textAlign: 'start' }}>
                    {isExpanded ? fb.message : fb.message.length > 120 ? fb.message.slice(0, 120) + '...' : fb.message}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[#475569] text-xs">
                      {new Date(fb.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo',
                      })}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-[#475569] ml-auto"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

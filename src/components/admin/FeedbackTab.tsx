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

  const statCards = [
    { label: 'Total', value: feedbacks.length, color: '#8b5cf6', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> },
    { label: 'Avg Rating', value: avgRating, color: '#f59e0b', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { label: 'Positive', value: `${sentimentScore}%`, color: '#10b981', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Negative', value: feedbacks.filter(f => f.rating <= 2).length, color: '#ef4444', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M9.75 17h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ]

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            Feedback Dashboard
          </h1>
          <p className="text-[#64748b] text-sm mt-1.5 ml-11">
            {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="relative rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer transition-all inline-flex items-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.03))',
            border: '1px solid rgba(139,92,246,0.18)',
            color: '#c4b5fd',
          }}
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Loading...' : 'Refresh'}
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="relative rounded-2xl p-4 sm:p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)`,
              border: `1px solid ${card.color}18`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ background: `radial-gradient(circle, ${card.color}, transparent 70%)` }} />
            <div className="relative flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</div>
              <div className="w-2 h-2 rounded-full" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}50` }} />
            </div>
            <div className="relative text-2xl sm:text-3xl font-black tabular-nums tracking-tight" style={{ color: card.color }}>{card.value}</div>
            <div className="relative text-[11px] text-[#64748b] mt-1 font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Rating Distribution */}
      <motion.div
        className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            Rating Distribution
          </h3>
          {filterRating !== null && (
            <button
              onClick={() => setFilterRating(null)}
              className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] cursor-pointer font-bold transition-colors"
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
            const barColor = r >= 4 ? '#10b981' : r === 3 ? '#f59e0b' : '#ef4444'
            return (
              <button
                key={r}
                onClick={() => setFilterRating(isActive ? null : r)}
                className={`w-full flex items-center gap-3 cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
                  isActive ? `bg-[${barColor}08]` : 'hover:bg-[rgba(255,255,255,0.02)]'
                }`}
                style={isActive ? { background: `${barColor}08` } : undefined}
              >
                <span className="text-xs font-bold w-10 flex items-center gap-0.5" style={{ color: '#f59e0b' }}>
                  {r} <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </span>
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
      </motion.div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">
            {filterRating !== null ? 'No Reviews with This Rating' : 'No Feedback Yet'}
          </h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">
            {filterRating !== null ? 'Try a different rating filter.' : 'Feedback will appear when users submit it.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((fb, idx) => {
            const isExpanded = expandedId === fb.id
            const ratingColor = fb.rating >= 4 ? '#10b981' : fb.rating === 3 ? '#f59e0b' : '#ef4444'
            return (
              <motion.div
                key={fb.id}
                layout
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${ratingColor}04, ${ratingColor}01)`,
                  border: `1px solid ${ratingColor}15`,
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.04 }}
              >
                {/* Background glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${ratingColor}, transparent 70%)` }} />

                {/* Card Header */}
                <div
                  className="p-5 sm:p-6 cursor-pointer relative"
                  onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: `${ratingColor}15`, color: ratingColor, border: `1px solid ${ratingColor}30` }}
                    >
                      {fb.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm">{fb.name}</span>
                    {fb.subject && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}
                      >
                        {fb.subject}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5" fill={i < fb.rating ? '#f59e0b' : 'none'} stroke={i < fb.rating ? '#f59e0b' : '#1e2d45'} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  {/* Message preview */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={isExpanded ? 'expanded' : 'collapsed'}
                      className="text-[#94a3b8] text-sm leading-relaxed"
                      style={{ direction: 'auto', textAlign: 'start' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isExpanded ? fb.message : fb.message.length > 120 ? fb.message.slice(0, 120) + '...' : fb.message}
                    </motion.p>
                  </AnimatePresence>
                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-2.5">
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

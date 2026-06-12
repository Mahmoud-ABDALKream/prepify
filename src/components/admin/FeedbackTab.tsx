'use client'

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
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Feedback Dashboard</h1>
          <p className="text-[#64748b] text-sm mt-1">View all submitted feedback</p>
        </div>
        <button onClick={() => {
          fetch('/api/feedback', { headers: { 'x-admin-secret': password } })
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) onRefresh(data.feedbacks) })
            .catch(() => {})
        }} className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:border-[#7c3aed] transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: feedbacks.length, color: '#7c3aed' },
          { label: 'Avg Rating', value: feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '0', color: '#f59e0b' },
          { label: 'Positive', value: feedbacks.filter(f => f.rating >= 4).length, color: '#10b981' },
          { label: 'Negative', value: feedbacks.filter(f => f.rating <= 2).length, color: '#ef4444' },
        ].map(card => (
          <div key={card.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center">
            <div className="text-2xl font-black" style={{ color: card.color }}>{card.value}</div>
            <div className="text-[11px] text-[#64748b]">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-sm mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(r => {
            const count = feedbacks.filter(f => f.rating === r).length
            return (
              <div key={r} className="flex items-center gap-3">
                <span className="text-xs text-[#f59e0b] w-8">{r} ★</span>
                <div className="flex-1 h-3 bg-[#1e2d45] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full transition-all duration-500" style={{ width: feedbacks.length > 0 ? `${(count / feedbacks.length) * 100}%` : '0%' }} />
                </div>
                <span className="text-xs text-[#64748b] w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">💬</div><h3 className="text-xl font-black mb-2">No Feedback Yet</h3><p className="text-[#64748b] text-sm">Feedback will appear when users submit it.</p></div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map(fb => (
            <div key={fb.id} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 hover:border-[#2d3f5e] transition-colors">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-bold text-sm">{fb.name}</span>
                <span className="text-[#475569] text-xs">{fb.email}</span>
                {fb.subject && <span className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{fb.subject}</span>}
                <span className="text-[#f59e0b] text-sm">{Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: i < fb.rating ? '#f59e0b' : '#1e2d45' }}>★</span>)}</span>
              </div>
              <p className="text-[#94a3b8] text-sm leading-relaxed whitespace-pre-wrap">{fb.message}</p>
              <p className="text-[#475569] text-xs mt-2">{new Date(fb.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

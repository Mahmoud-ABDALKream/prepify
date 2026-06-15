'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizStartPopupProps {
  open: boolean
  onClose: () => void
  onStart: (data: { userName: string; timerMinutes: number }) => void
  subjectName: string
}

const TIMER_OPTIONS = [
  { label: 'No Timer', value: 0, icon: '🚫' },
  { label: '15 min', value: 15, icon: '⏱️' },
  { label: '30 min', value: 30, icon: '⏱️' },
  { label: '45 min', value: 45, icon: '⏱️' },
  { label: '60 min', value: 60, icon: '⏱️' },
  { label: '90 min', value: 90, icon: '⏱️' },
  { label: '120 min', value: 120, icon: '⏱️' },
]

export default function QuizStartPopup({ open, onClose, onStart, subjectName }: QuizStartPopupProps) {
  const [userName, setUserName] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [nameError, setNameError] = useState('')

  // Load saved name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prepify-user-name')
      if (saved) setUserName(saved)
    }
  }, [])

  const handleStart = () => {
    if (!userName.trim()) {
      setNameError('Please enter your name')
      return
    }
    // Save name for next time
    localStorage.setItem('prepify-user-name', userName.trim())
    localStorage.setItem('prepify-user-id', userName.trim().toLowerCase().replace(/\s+/g, '-') + '-' + userName.trim().length)

    onStart({ userName: userName.trim(), timerMinutes })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0f1729 0%, #1a1f3a 100%)',
              border: '1px solid rgba(139,92,246,0.3)',
              boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="relative p-6 pb-4" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #8b5cf6)' }} />
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📝</span>
                Ready to Start?
              </h2>
              <p className="text-sm text-gray-400 mt-1">{subjectName}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => { setUserName(e.target.value); setNameError('') }}
                  placeholder="Enter your name..."
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: nameError ? '1px solid #ef4444' : '1px solid rgba(139,92,246,0.3)',
                    boxShadow: nameError ? '0 0 10px rgba(239,68,68,0.2)' : 'none',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 15px rgba(139,92,246,0.15)' }}
                  onBlur={(e) => { e.target.style.borderColor = nameError ? '#ef4444' : 'rgba(139,92,246,0.3)'; e.target.style.boxShadow = nameError ? '0 0 10px rgba(239,68,68,0.2)' : 'none' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleStart() }}
                />
                {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
              </div>

              {/* Timer Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  ⏱️ Timer Settings
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIMER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTimerMinutes(opt.value)}
                      className="py-2.5 px-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: timerMinutes === opt.value
                          ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                          : 'rgba(255,255,255,0.05)',
                        border: timerMinutes === opt.value
                          ? '1px solid rgba(139,92,246,0.6)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: timerMinutes === opt.value ? '#fff' : '#94a3b8',
                        boxShadow: timerMinutes === opt.value ? '0 0 15px rgba(139,92,246,0.3)' : 'none',
                      }}
                    >
                      <span className="block text-base mb-0.5">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-[10px] mt-2">
                  {timerMinutes === 0
                    ? 'No time limit — take your time!'
                    : `Timer will count down ${timerMinutes} minutes. Stay focused!`}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                className="flex-[2] py-3 rounded-xl text-sm font-bold transition-all text-white"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                }}
              >
                🚀 Start Quiz
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

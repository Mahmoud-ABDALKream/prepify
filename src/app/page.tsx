'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Subjects Data ──────────────────────────────────
const subjects = [
  {
    id: 'c-programming',
    title: 'C Programming',
    description: 'Variables, I/O, Operators, Conditions, Loops, Arrays, Strings & more',
    icon: '{ }',
    color: '#7c3aed',
    gradient: 'from-[#7c3aed] to-[#00d4ff]',
    shadow: 'rgba(124,58,237,0.3)',
    questions: 90,
    sections: 6,
    marks: 117,
    available: true,
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    description: 'IoT Architecture, Sensors & Actuators, Microcontrollers, ATmega16 I/O Ports & Registers',
    icon: 'IoT',
    color: '#10b981',
    gradient: 'from-[#10b981] to-[#059669]',
    shadow: 'rgba(16,185,129,0.3)',
    questions: 225,
    sections: 8,
    marks: 225,
    available: true,
  },
  {
    id: 'technical-english-2',
    title: 'Technical English 2',
    description: 'Definitions, MCQ, Arrange Words, Translation & more',
    icon: 'En',
    color: '#3b82f6',
    gradient: 'from-[#3b82f6] to-[#2563eb]',
    shadow: 'rgba(59,130,246,0.3)',
    questions: 199,
    sections: 5,
    marks: 450,
    available: true,
  },
  {
    id: 'microsoft-office',
    title: 'Microsoft Office',
    description: 'Word, Excel, PowerPoint, Access — Definitions, MCQ, True/False & more',
    icon: 'MS',
    color: '#f59e0b',
    gradient: 'from-[#f59e0b] to-[#d97706]',
    shadow: 'rgba(245,158,11,0.3)',
    questions: 149,
    sections: 9,
    marks: 175,
    available: true,
  },
  {
    id: 'cyber-security-2',
    title: 'Cyber Security 2',
    description: 'Cryptography, Public Key Encryption, Digital Signatures, Certificates & Wireless Security',
    icon: 'CS',
    color: '#ef4444',
    gradient: 'from-[#ef4444] to-[#dc2626]',
    shadow: 'rgba(239,68,68,0.3)',
    questions: 110,
    sections: 9,
    marks: 133,
    available: true,
  },
]

// ─── Features ───────────────────────────────────────
const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Auto-Grading',
    desc: 'Instant feedback on MCQ, True/False, and fill-in-the-blank questions',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Code Writing',
    desc: 'Write and review code with syntax-highlighted code blocks',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'View Solutions',
    desc: 'Reveal step-by-step model answers and explanations for every question',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Score Tracking',
    desc: 'See your progress, correct answers count, and overall performance',
  },
]

// ─── Floating Particles ─────────────────────────────
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
    </div>
  )
}

// ─── Main Landing Page ──────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Feedback form state
  const [fbName, setFbName] = useState('')
  const [fbMessage, setFbMessage] = useState('')
  const [fbRating, setFbRating] = useState(0)
  const [fbSubmitting, setFbSubmitting] = useState(false)
  const [fbSubmitted, setFbSubmitted] = useState(false)
  const [fbError, setFbError] = useState('')

  const submitFeedback = useCallback(async () => {
    setFbError('')
    if (!fbName.trim() || !fbMessage.trim() || fbRating === 0) {
      setFbError('Please fill in all required fields and select a rating.')
      return
    }
    setFbSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fbName.trim(),
          email: 'no-email@provided',
          message: fbMessage.trim(),
          rating: fbRating,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFbError(data.error || 'Something went wrong.')
        return
      }
      setFbSubmitted(true)
      setFbName('')
      setFbMessage('')
      setFbRating(0)
    } catch {
      setFbError('Network error. Please try again.')
    } finally {
      setFbSubmitting(false)
    }
  }, [fbName, fbMessage, fbRating])

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans overflow-x-hidden">
      <FloatingParticles />

      {/* ─── Navbar ─── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#080c18]/85 border-b border-[#1e2d45]/60"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[68px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/logo.png" alt="Prepify" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-shadow" />
            <span className="font-black text-lg bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Prepify</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <a href="#subjects" className="text-[#94a3b8] hover:text-[#00d4ff] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(0,212,255,0.06)] transition-all">Subjects</a>
            <a href="/review" className="text-[#94a3b8] hover:text-[#f59e0b] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(245,158,11,0.06)] transition-all flex items-center gap-1.5">📝 Review</a>
            <a href="#features" className="text-[#94a3b8] hover:text-[#00d4ff] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(0,212,255,0.06)] transition-all">Features</a>
            <a href="/leaderboard" className="text-[#94a3b8] hover:text-[#8b5cf6] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(139,92,246,0.06)] transition-all flex items-center gap-1.5">🏆 Leaderboard</a>
            <a href="#feedback" className="text-[#94a3b8] hover:text-[#f59e0b] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(245,158,11,0.06)] transition-all">Feedback</a>
            <a href="#about" className="text-[#94a3b8] hover:text-[#00d4ff] text-[13px] font-medium px-3 py-2 rounded-lg hover:bg-[rgba(0,212,255,0.06)] transition-all">About</a>
            <div className="w-px h-5 bg-[#1e2d45] mx-2" />
            <a
              href="/technical-english-2"
              className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-lg px-4 py-2 text-[13px] font-bold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Latest Quiz
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-10 h-10 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#e2e8f0] hover:border-[#7c3aed] transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden overflow-hidden bg-[#080c18]/95 backdrop-blur-xl border-t border-[#1e2d45]"
            >
              <div className="px-5 py-3 flex flex-col gap-0.5">
                <a href="#subjects" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#00d4ff] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(0,212,255,0.06)] transition-all">Subjects</a>
                <a href="/review" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#f59e0b] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(245,158,11,0.06)] transition-all">📝 Review</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#00d4ff] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(0,212,255,0.06)] transition-all">Features</a>
                <a href="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#8b5cf6] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(139,92,246,0.06)] transition-all">🏆 Leaderboard</a>
                <a href="#feedback" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#f59e0b] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(245,158,11,0.06)] transition-all">Feedback</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-[#94a3b8] hover:text-[#00d4ff] text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-[rgba(0,212,255,0.06)] transition-all">About</a>
                <div className="h-px bg-[#1e2d45] my-1.5" />
                <a href="/technical-english-2" className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white rounded-xl py-2.5 px-3 text-sm font-bold text-center hover:opacity-90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  Latest Quiz →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="relative z-1">
        {/* ─── Hero Section ─── */}
        <section className="min-h-screen flex items-center justify-center pt-28 pb-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <img src="/logo.png" alt="Prepify Logo" className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl shadow-[0_0_40px_rgba(124,58,237,0.4)]" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Review.</span>{' '}
              <span className="bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">Solve.</span>{' '}
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">Master.</span>
            </motion.h1>

            <motion.p
              className="text-[#94a3b8] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              An interactive platform built by <span className="text-[#00d4ff] font-bold">Mahmoud ABD ELKream</span> for reviewing course material, solving questions, and mastering your subjects with instant feedback and model solutions.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="/technical-english-2"
                className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-none rounded-2xl px-8 py-4 font-black text-lg cursor-pointer transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:translate-y-0 inline-flex items-center justify-center gap-2"
              >
                Technical English 2 Quiz
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
              <a
                href="#subjects"
                className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-2xl px-8 py-4 font-bold text-lg cursor-pointer hover:border-[#00d4ff] transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              >
                Browse Subjects
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { value: '5', label: 'Subjects', color: '#00d4ff' },
                { value: '624+', label: 'Questions', color: '#7c3aed' },
                { value: '28', label: 'Sections', color: '#10b981' },
                { value: '925', label: 'Total Marks', color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 text-center hover:border-[#2d3f5e] transition-colors">
                  <div className="text-2xl sm:text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[11px] sm:text-xs text-[#64748b] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Subjects Section ─── */}
        <section id="subjects" className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                Subjects
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                Choose Your <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Subject</span>
              </h2>
              <p className="text-[#64748b] text-sm sm:text-base max-w-lg mx-auto">Click on any available subject to start solving questions, reviewing answers, and boosting your grades.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subjects.map((subject, idx) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredSubject(subject.id)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className={`relative group rounded-3xl overflow-hidden transition-all duration-300 ${
                    subject.available
                      ? 'cursor-pointer hover:-translate-y-2'
                      : 'cursor-not-allowed'
                  }`}
                  onClick={() => { if (subject.available) window.location.href = `/${subject.id}` }}
                >
                  {/* Card Background */}
                  <div className={`bg-[#111827] border border-[#1e2d45] rounded-3xl p-6 sm:p-8 h-full transition-all duration-300 ${
                    subject.available ? 'group-hover:border-[' + subject.color + ']/50' : ''
                  }`} style={{
                    boxShadow: hoveredSubject === subject.id && subject.available ? `0 0 30px ${subject.shadow}` : 'none',
                  }}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-lg font-black mb-4 bg-gradient-to-r ${subject.gradient} text-white shadow-lg`}>
                      {subject.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-black mb-2">{subject.title}</h3>
                    <p className="text-[#64748b] text-sm mb-5 leading-relaxed">{subject.description}</p>

                    {/* Stats or Coming Soon */}
                    {subject.available ? (
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-xs font-bold" style={{ color: subject.color }}>{subject.questions} Qs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          <span className="text-xs font-bold text-[#64748b]">{subject.sections} Sections</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-xs font-bold text-[#64748b]">{subject.marks} Pts</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-1.5 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#f59e0b] text-xs px-3 py-1.5 rounded-full font-bold mb-2">
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          Questions Being Prepared
                        </div>
                        <p className="text-[#475569] text-xs leading-relaxed">The best questions are being carefully crafted for this subject. Stay tuned!</p>
                      </div>
                    )}

                    {/* Action */}
                    {subject.available ? (
                      <div className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: subject.color }}>
                        Start Review
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: subject.color + '80' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Coming Soon
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="features" className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                Why <span className="bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">Prepify?</span>
              </h2>
              <p className="text-[#64748b] text-sm sm:text-base max-w-lg mx-auto">Built to help you study smarter, not harder.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-6 hover:border-[#10b981]/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="font-black text-lg mb-2">{feat.title}</h3>
                  <p className="text-[#64748b] text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About Section ─── */}
        <section id="about" className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 sm:p-12 text-center"
            >
              <img src="/logo.png" alt="Prepify" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(124,58,237,0.3)]" />
              <h2 className="text-2xl sm:text-3xl font-black mb-4">
                Built by <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Mahmoud ABD ELKream</span>
              </h2>
              <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
                This platform was created to help students review course material, practice solving questions, and understand the correct solutions across multiple subjects. From programming to cybersecurity, every question comes with a detailed explanation and model answer so you can learn effectively and ace your exams.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a href="https://github.com/Mahmoud-ABDALKream" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2235] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="https://mahmoud-ahmed-abdelkream.vercel.app/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2235] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 20h6l4.5-8.5L16.5 20h6L12 0zm0 7.5L8.25 14.5h7.5L12 7.5z"/></svg>
                  Portfolio
                </a>
                <a href="https://www.linkedin.com/in/mahmoud-ahmed-abdelkream/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a2235] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                Ready to <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">Get Started?</span>
              </h2>
              <p className="text-[#64748b] text-sm sm:text-base mb-8 max-w-md mx-auto">Try the latest Technical English 2 quiz now — more subjects are on the way!</p>
              <a
                href="/technical-english-2"
                className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-none rounded-2xl px-10 py-4 font-black text-lg cursor-pointer transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:translate-y-0 inline-flex items-center gap-2"
              >
                Launch Technical English 2 Quiz
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            </motion.div>
          </div>
        </section>

        {/* ─── Feedback Section ─── */}
        <section id="feedback" className="py-16 sm:py-24 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Feedback
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                Share Your <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">Thoughts</span>
              </h2>
              <p className="text-[#64748b] text-sm sm:text-base max-w-lg mx-auto">Your feedback helps us improve. Tell us what you think about Prepify!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {fbSubmitted ? (
                <div className="bg-[#111827] border border-[#10b981]/30 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-black mb-2">Thank You!</h3>
                  <p className="text-[#64748b] text-sm mb-6">Your feedback has been submitted successfully. We appreciate your input!</p>
                  <button
                    onClick={() => setFbSubmitted(false)}
                    className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <div className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">Rating <span className="text-[#ef4444]">*</span></label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFbRating(star)}
                          className="text-3xl transition-all cursor-pointer hover:scale-110"
                          style={{ color: star <= fbRating ? '#f59e0b' : '#1e2d45' }}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-sm text-[#64748b] ml-2 self-center">{fbRating > 0 ? `${fbRating}/5` : 'Select'}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Name <span className="text-[#ef4444]">*</span></label>
                    <input
                      type="text"
                      value={fbName}
                      onChange={(e) => setFbName(e.target.value)}
                      placeholder="Your name"
                      dir="auto"
                      className="w-full bg-[#080c18] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#f59e0b] focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">Message <span className="text-[#ef4444]">*</span></label>
                    <textarea
                      value={fbMessage}
                      onChange={(e) => setFbMessage(e.target.value)}
                      placeholder="Tell us what you think..."
                      dir="auto"
                      rows={4}
                      className="w-full bg-[#080c18] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#f59e0b] focus:outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all resize-none"
                    />
                  </div>

                  {/* Error */}
                  {fbError && (
                    <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm rounded-xl px-4 py-3">
                      {fbError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={submitFeedback}
                    disabled={fbSubmitting}
                    className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-none rounded-xl px-6 py-4 font-black text-base cursor-pointer hover:opacity-90 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
                  >
                    {fbSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="text-center py-8 border-t border-[#1e2d45] px-4">
          <div className="mb-3">
            <span className="text-[#e2e8f0] font-bold text-lg">Mahmoud ABD ELKream</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://github.com/Mahmoud-ABDALKream" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://mahmoud-ahmed-abdelkream.vercel.app/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 20h6l4.5-8.5L16.5 20h6L12 0zm0 7.5L8.25 14.5h7.5L12 7.5z"/></svg>
              Portfolio
            </a>
            <a href="https://www.linkedin.com/in/mahmoud-ahmed-abdelkream/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
          <div className="text-[#64748b] text-sm">
            Prepify — <span className="text-[#00d4ff]">Mahmoud ABD ELKream</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

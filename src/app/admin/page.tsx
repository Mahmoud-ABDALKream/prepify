'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from 'recharts'

// ─── Types ──────────────────────────────────────────────
interface OverviewData {
  totalStudents: number
  activeStudents: number
  totalQuizAttempts: number
  avgAccuracy: number
  avgStudyStreak: number
  passRate: number
  atRiskStudents: number
}

interface StudentAnalytics {
  students: { userId: string; userName: string; totalAttempts: number; avgScore: number; avgAccuracy: number; bestScore: number; studyStreak: number; subjectsCount: number; timeSpent: number; lastActive: string | null; examScore: number | null }[]
  accuracyDistribution: { range: string; count: number }[]
  scoreDistribution: { range: string; count: number }[]
  examScoreDistribution: { range: string; count: number }[]
  topPerformers: { userId: string; userName: string; avgScore: number; totalAttempts: number }[]
  mostImproved: { userId: string; userName: string; improvement: number }[]
}

interface SubjectAnalytics {
  subjects: { subject: string; totalAttempts: number; uniqueStudents: number; avgAccuracy: number; avgScore: number; avgExamScore: number; passRate: number; difficultyIndex: number }[]
  rankings: { hardestSubject: { subject: string; difficultyIndex: number } | null; easiestSubject: { subject: string; difficultyIndex: number } | null; mostStudiedSubject: { subject: string; totalAttempts: number } | null }
}

interface QuestionTypeAnalytics {
  questionTypes: { type: string; totalQuestions: number; avgScore: number; successRate: number; totalAttempts: number; uniqueUsers: number }[]
  correlations: { type: string; correlation: number }[]
  predictiveRanking: { type: string; correlation: number }[]
  mostPredictive: { type: string; correlation: number } | null
}

interface BehaviorAnalytics {
  correlations: { questionsSolvedVsExam: number; accuracyVsExam: number; studyStreakVsExam: number; timeSpentVsExam: number }
  regressionModels: { questionsSolved: { slope: number; intercept: number; r2: number }; accuracy: { slope: number; intercept: number; r2: number }; studyStreak: { slope: number; intercept: number; r2: number }; timeSpent: { slope: number; intercept: number; r2: number } }
  dailyActivity: { date: string; attempts: number; uniqueUsers: number }[]
  scatterData: { questionsVsScore: { x: number; y: number }[]; accuracyVsScore: { x: number; y: number }[]; streakVsScore: { x: number; y: number }[]; timeVsScore: { x: number; y: number }[] }
  sampleSize: number
}

interface AtRiskData {
  atRiskStudents: { userId: string; userName: string; avgAccuracy: number; totalAttempts: number; studyStreak: number; avgScore: number; riskScore: number; riskLevel: 'Low' | 'Medium' | 'High'; riskFactors: { lowAccuracy: boolean; lowActivity: boolean; lowStreak: boolean; lowCompletion: boolean; decliningTrend: boolean }; recommendedAction: string }[]
  total: number
}

interface ReadinessData {
  readinessData: { userId: string; userName: string; readinessScore: number; predictedRange: { low: number; high: number }; trend: 'improving' | 'stable' | 'declining'; breakdown: { accuracy: number; consistency: number; activity: number; subjectCoverage: number; historical: number } }[]
}

interface PredictionsData {
  comparison: { mae: Record<string, number>; rmse: Record<string, number>; r2: Record<string, number>; accuracy: Record<string, number>; precision: Record<string, number>; recall: Record<string, number>; f1: Record<string, number> }
  predictions: { userName: string; actual: number; linearRegression: number; decisionTree: number; randomForest: number; passProbability: number }[]
  message?: string
}

interface FindingsData {
  findings: { category: string; finding: string; metric: string; impact: 'high' | 'medium' | 'low' }[]
  message?: string
}

interface CorrelationData {
  matrix: number[][]
  labels: string[]
}

interface Feedback {
  id: string
  name: string
  email: string
  message: string
  rating: number
  subject: string | null
  createdAt: string
}

type DashboardTab = 'overview' | 'students' | 'subjects' | 'question-types' | 'behavior' | 'at-risk' | 'readiness' | 'predictions' | 'findings' | 'feedback'

// ─── Color Constants ────────────────────────────────────
const COLORS = {
  purple: '#8b5cf6',
  blue: '#6366f1',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  slate: '#64748b',
}

const CHART_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

const RISK_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }
const TREND_COLORS = { improving: '#10b981', stable: '#6366f1', declining: '#ef4444' }

// ─── Component ──────────────────────────────────────────
export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  // Analytics data states
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [studentData, setStudentData] = useState<StudentAnalytics | null>(null)
  const [subjectData, setSubjectData] = useState<SubjectAnalytics | null>(null)
  const [qtData, setQtData] = useState<QuestionTypeAnalytics | null>(null)
  const [behaviorData, setBehaviorData] = useState<BehaviorAnalytics | null>(null)
  const [atRiskData, setAtRiskData] = useState<AtRiskData | null>(null)
  const [readinessData, setReadinessData] = useState<ReadinessData | null>(null)
  const [predictionsData, setPredictionsData] = useState<PredictionsData | null>(null)
  const [findingsData, setFindingsData] = useState<FindingsData | null>(null)
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  useEffect(() => {
    if (authenticated) {
      fetch('/api/feedback', { headers: { 'x-admin-secret': password } })
        .then(res => {
          if (res.ok) return res.json()
          else if (res.status === 401) { setAuthenticated(false); setAuthError('Session expired.') }
          return null
        })
        .then(data => { if (data) setFeedbacks(data.feedbacks) })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [authenticated, password])

  useEffect(() => {
    if (authenticated && activeTab !== 'feedback') {
      fetch(`/api/analytics/${activeTab}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setAnalyticsLoading(false)
          if (!data) return
          switch (activeTab) {
            case 'overview': setOverview(data); break
            case 'students': setStudentData(data); break
            case 'subjects': setSubjectData(data); break
            case 'question-types': setQtData(data); break
            case 'behavior': setBehaviorData(data); break
            case 'at-risk': setAtRiskData(data); break
            case 'readiness': setReadinessData(data); break
            case 'predictions': setPredictionsData(data); break
            case 'findings': setFindingsData(data); break
          }
        })
        .catch(err => { console.error('Analytics fetch error:', err); setAnalyticsLoading(false) })
    }
  }, [authenticated, activeTab])

  const handleLogin = () => {
    fetch('/api/feedback', { headers: { 'x-admin-secret': password } }).then(res => {
      if (res.ok) { setAuthenticated(true); setAuthError('') }
      else setAuthError('Wrong password.')
    }).catch(() => setAuthError('Connection error.'))
  }

  const handleExport = () => {
    window.open('/api/analytics/export?type=csv', '_blank')
  }

  // ─── Auth Gate ──────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans flex items-center justify-center px-4">
        <motion.div
          className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-black text-center mb-2">Admin Panel</h1>
          <p className="text-[#64748b] text-sm text-center mb-6">Enter password to access dashboard</p>
          {authError && <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm rounded-xl px-4 py-3">{authError}</div>}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full bg-[#080c18] border border-[#1e2d45] rounded-xl px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#7c3aed] focus:outline-none focus:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all mb-4" />
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-all">Login</button>
          <a href="/" className="block text-center text-[#64748b] text-sm mt-4 hover:text-[#00d4ff] transition-colors">Back to Home</a>
        </motion.div>
      </div>
    )
  }

  // ─── Sidebar Tabs ──────────────────────────────
  const tabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'subjects', label: 'Subjects', icon: '📚' },
    { id: 'question-types', label: 'Q Types', icon: '❓' },
    { id: 'behavior', label: 'Behavior', icon: '🧠' },
    { id: 'at-risk', label: 'At-Risk', icon: '⚠️' },
    { id: 'readiness', label: 'Readiness', icon: '🎯' },
    { id: 'predictions', label: 'ML Models', icon: '🤖' },
    { id: 'findings', label: 'Findings', icon: '💡' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
  ]

  const formatSubject = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const formatQt = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  // ─── Dashboard Render ──────────────────────────
  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      </div>

      <div className="relative z-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-[#0a0f1e]/80 border-r border-[#1e2d45] sticky top-0 p-4 gap-1">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center text-white text-sm font-black shadow-[0_0_15px_rgba(124,58,237,0.3)]">P</div>
            <div>
              <div className="text-sm font-black bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">Prepify</div>
              <div className="text-[9px] text-[#64748b] tracking-wider uppercase">Research Dashboard</div>
            </div>
          </div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left"
              style={{
                background: activeTab === tab.id ? 'rgba(139,92,246,0.15)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                color: activeTab === tab.id ? '#c4b5fd' : '#94a3b8',
              }}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-[#1e2d45] flex flex-col gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#111827] border border-[#1e2d45] text-[#94a3b8] hover:border-[#7c3aed] hover:text-[#c4b5fd] transition-all cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
            <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#64748b] hover:text-[#94a3b8] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Home
            </a>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#080c18]/95 backdrop-blur-xl border-b border-[#1e2d45] px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-black bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">Prepify Analytics</div>
            <a href="/" className="text-[#64748b] text-xs hover:text-[#00d4ff]">Home</a>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0"
                style={{
                  background: activeTab === tab.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: activeTab === tab.id ? '#c4b5fd' : '#94a3b8',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:pl-0 px-4 lg:px-8 pt-20 lg:pt-6 pb-10 max-w-[1200px]">
          <AnimatePresence mode="wait">
            {analyticsLoading && activeTab !== 'feedback' ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-3 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#64748b] text-sm mt-4">Analyzing data...</p>
              </motion.div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                {/* ─── OVERVIEW ─── */}
                {activeTab === 'overview' && overview && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Learning Analytics Overview</h1>
                      <p className="text-[#64748b] text-sm mt-1">Real-time insights into student learning behavior and performance</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[
                        { label: 'Total Students', value: overview.totalStudents, color: '#8b5cf6', icon: '👥' },
                        { label: 'Active Students', value: overview.activeStudents, color: '#6366f1', icon: '🟢' },
                        { label: 'Quiz Attempts', value: overview.totalQuizAttempts, color: '#06b6d4', icon: '📝' },
                        { label: 'Avg Accuracy', value: `${overview.avgAccuracy}%`, color: '#10b981', icon: '🎯' },
                        { label: 'Avg Study Streak', value: `${overview.avgStudyStreak}d`, color: '#f59e0b', icon: '🔥' },
                        { label: 'Pass Rate', value: `${overview.passRate}%`, color: '#8b5cf6', icon: '✅' },
                        { label: 'At-Risk Students', value: overview.atRiskStudents, color: '#ef4444', icon: '⚠️' },
                      ].map(card => (
                        <div key={card.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4 hover:border-[#2d3f5e] transition-colors">
                          <div className="text-lg mb-1">{card.icon}</div>
                          <div className="text-2xl font-black tabular-nums" style={{ color: card.color }}>{card.value}</div>
                          <div className="text-[11px] text-[#64748b] mt-0.5">{card.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Charts */}
                    {studentData && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                          <h3 className="text-sm font-bold mb-4">Score Distribution</h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={studentData.scoreDistribution}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
                              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {behaviorData && behaviorData.dailyActivity.length > 0 && (
                          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                            <h3 className="text-sm font-bold mb-4">Daily Activity (Last 30 Days)</h3>
                            <ResponsiveContainer width="100%" height={250}>
                              <AreaChart data={behaviorData.dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                                <Area type="monotone" dataKey="attempts" stroke="#8b5cf6" fill="rgba(139,92,246,0.15)" strokeWidth={2} />
                                <Area type="monotone" dataKey="uniqueUsers" stroke="#6366f1" fill="rgba(99,102,241,0.1)" strokeWidth={2} />
                                <Legend />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    )}

                    {!overview.totalStudents && (
                      <div className="text-center py-20">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-xl font-black mb-2">No Data Yet</h3>
                        <p className="text-[#64748b] text-sm">Analytics will appear as students start taking quizzes.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STUDENTS ─── */}
                {activeTab === 'students' && studentData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Student Performance Analytics</h1>
                      <p className="text-[#64748b] text-sm mt-1">Detailed analysis of individual student performance and progress</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                        <h3 className="text-sm font-bold mb-4">Accuracy Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={studentData.accuracyDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                            <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                            <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                        <h3 className="text-sm font-bold mb-4">Exam Score Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={studentData.examScoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                            <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Top Performers & Most Improved */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>🏆</span> Top Performers</h3>
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                          {studentData.topPerformers.map((s, i) => (
                            <div key={s.userId} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.1)]">
                              <span className="text-sm font-black w-6 text-center" style={{ color: i < 3 ? '#fbbf24' : '#64748b' }}>#{i + 1}</span>
                              <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                              <span className="text-sm font-black text-[#8b5cf6]">{s.avgScore}%</span>
                              <span className="text-[10px] text-[#64748b]">{s.totalAttempts} attempts</span>
                            </div>
                          ))}
                          {studentData.topPerformers.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
                        </div>
                      </div>

                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>📈</span> Most Improved</h3>
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                          {studentData.mostImproved.map((s, i) => (
                            <div key={s.userId} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.1)]">
                              <span className="text-sm font-black w-6 text-center text-[#64748b]">#{i + 1}</span>
                              <span className="text-sm font-medium flex-1 truncate">{s.userName}</span>
                              <span className="text-sm font-black" style={{ color: s.improvement >= 0 ? '#10b981' : '#ef4444' }}>{s.improvement >= 0 ? '+' : ''}{s.improvement}%</span>
                            </div>
                          ))}
                          {studentData.mostImproved.length === 0 && <p className="text-[#64748b] text-xs text-center py-4">Need at least 3 attempts per student</p>}
                        </div>
                      </div>
                    </div>

                    {/* Student Table */}
                    <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                      <h3 className="text-sm font-bold mb-4">All Students</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-[#64748b] text-xs uppercase tracking-wider">
                              <th className="text-left py-2 px-3">Student</th>
                              <th className="text-center py-2 px-3">Attempts</th>
                              <th className="text-center py-2 px-3">Avg Score</th>
                              <th className="text-center py-2 px-3">Accuracy</th>
                              <th className="text-center py-2 px-3">Best</th>
                              <th className="text-center py-2 px-3">Streak</th>
                              <th className="text-center py-2 px-3">Subjects</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentData.students.sort((a, b) => b.avgScore - a.avgScore).map(s => (
                              <tr key={s.userId} className="border-t border-[#1e2d45] hover:bg-[rgba(139,92,246,0.03)]">
                                <td className="py-2.5 px-3 font-medium">{s.userName}</td>
                                <td className="text-center py-2.5 px-3 text-[#8b5cf6] font-bold">{s.totalAttempts}</td>
                                <td className="text-center py-2.5 px-3 font-bold">{s.avgScore}%</td>
                                <td className="text-center py-2.5 px-3" style={{ color: s.avgAccuracy >= 70 ? '#10b981' : s.avgAccuracy >= 50 ? '#f59e0b' : '#ef4444' }}>{s.avgAccuracy}%</td>
                                <td className="text-center py-2.5 px-3">{s.bestScore}%</td>
                                <td className="text-center py-2.5 px-3">{s.studyStreak}d</td>
                                <td className="text-center py-2.5 px-3">{s.subjectsCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── SUBJECTS ─── */}
                {activeTab === 'subjects' && subjectData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Subject Analytics</h1>
                      <p className="text-[#64748b] text-sm mt-1">Performance breakdown by subject area</p>
                    </div>

                    {/* Rankings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      {subjectData.rankings.hardestSubject && (
                        <div className="bg-[#111827] border border-[#ef4444]/20 rounded-2xl p-4">
                          <div className="text-xs text-[#ef4444] font-bold uppercase tracking-wider mb-1">Hardest Subject</div>
                          <div className="text-lg font-black">{formatSubject(subjectData.rankings.hardestSubject.subject)}</div>
                          <div className="text-xs text-[#64748b]">Difficulty: {subjectData.rankings.hardestSubject.difficultyIndex}</div>
                        </div>
                      )}
                      {subjectData.rankings.easiestSubject && (
                        <div className="bg-[#111827] border border-[#10b981]/20 rounded-2xl p-4">
                          <div className="text-xs text-[#10b981] font-bold uppercase tracking-wider mb-1">Easiest Subject</div>
                          <div className="text-lg font-black">{formatSubject(subjectData.rankings.easiestSubject.subject)}</div>
                          <div className="text-xs text-[#64748b]">Difficulty: {subjectData.rankings.easiestSubject.difficultyIndex}</div>
                        </div>
                      )}
                      {subjectData.rankings.mostStudiedSubject && (
                        <div className="bg-[#111827] border border-[#8b5cf6]/20 rounded-2xl p-4">
                          <div className="text-xs text-[#8b5cf6] font-bold uppercase tracking-wider mb-1">Most Studied</div>
                          <div className="text-lg font-black">{formatSubject(subjectData.rankings.mostStudiedSubject.subject)}</div>
                          <div className="text-xs text-[#64748b]">{subjectData.rankings.mostStudiedSubject.totalAttempts} attempts</div>
                        </div>
                      )}
                    </div>

                    {/* Subject Comparison Chart */}
                    {subjectData.subjects.length > 0 && (
                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
                        <h3 className="text-sm font-bold mb-4">Subject Comparison</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={subjectData.subjects.map(s => ({ ...s, subject: formatSubject(s.subject) }))}>
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

                    {/* Subject Detail Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjectData.subjects.map(s => (
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

                    {subjectData.subjects.length === 0 && (
                      <div className="text-center py-20"><div className="text-5xl mb-4">📚</div><h3 className="text-xl font-black mb-2">No Subject Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
                    )}
                  </div>
                )}

                {/* ─── QUESTION TYPES ─── */}
                {activeTab === 'question-types' && qtData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Question Type Analytics</h1>
                      <p className="text-[#64748b] text-sm mt-1">How different question types predict exam performance</p>
                    </div>

                    {qtData.questionTypes.length > 0 && (
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                            <h3 className="text-sm font-bold mb-4">Performance by Question Type</h3>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={qtData.questionTypes.map(q => ({ ...q, type: formatQt(q.type) }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                                <Bar dataKey="successRate" fill="#8b5cf6" name="Success Rate" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="avgScore" fill="#6366f1" name="Avg Score" radius={[6, 6, 0, 0]} />
                                <Legend />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                            <h3 className="text-sm font-bold mb-4">Correlation with Exam Score</h3>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={qtData.correlations.map(q => ({ ...q, type: formatQt(q.type) }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[-1, 1]} />
                                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                                <Bar dataKey="correlation" name="Pearson r" radius={[6, 6, 0, 0]}>
                                  {qtData.correlations.map((entry, i) => (
                                    <Cell key={i} fill={Math.abs(entry.correlation) >= 0.6 ? '#10b981' : Math.abs(entry.correlation) >= 0.3 ? '#f59e0b' : '#64748b'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Predictive Power Ranking */}
                        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
                          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><span>🔮</span> Predictive Power Ranking</h3>
                          <div className="space-y-2">
                            {qtData.predictiveRanking.map((q, i) => (
                              <div key={q.type} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: i === 0 ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)', border: i === 0 ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="text-sm font-black w-6 text-center" style={{ color: i === 0 ? '#8b5cf6' : '#64748b' }}>#{i + 1}</span>
                                <span className="text-sm font-medium flex-1">{formatQt(q.type)}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${Math.abs(q.correlation) * 100}%`, background: Math.abs(q.correlation) >= 0.6 ? '#10b981' : Math.abs(q.correlation) >= 0.3 ? '#f59e0b' : '#64748b' }} />
                                  </div>
                                  <span className="text-xs font-bold" style={{ color: Math.abs(q.correlation) >= 0.6 ? '#10b981' : '#64748b' }}>r={q.correlation}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {qtData.mostPredictive && (
                          <div className="bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-2xl p-5">
                            <p className="text-sm text-[#c4b5fd]">
                              <strong>Key Finding:</strong> {formatQt(qtData.mostPredictive.type)} questions show the strongest relationship with exam success (r={qtData.mostPredictive.correlation}), making them the best predictor of final exam performance.
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {qtData.questionTypes.length === 0 && (
                      <div className="text-center py-20"><div className="text-5xl mb-4">❓</div><h3 className="text-xl font-black mb-2">No Question Type Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
                    )}
                  </div>
                )}

                {/* ─── BEHAVIOR ─── */}
                {activeTab === 'behavior' && behaviorData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Learning Behavior Analytics</h1>
                      <p className="text-[#64748b] text-sm mt-1">How study behaviors correlate with exam performance (n={behaviorData.sampleSize})</p>
                    </div>

                    {/* Correlation Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: 'Questions vs Score', value: behaviorData.correlations.questionsSolvedVsExam, icon: '📝' },
                        { label: 'Accuracy vs Score', value: behaviorData.correlations.accuracyVsExam, icon: '🎯' },
                        { label: 'Streak vs Score', value: behaviorData.correlations.studyStreakVsExam, icon: '🔥' },
                        { label: 'Time vs Score', value: behaviorData.correlations.timeSpentVsExam, icon: '⏱️' },
                      ].map(c => (
                        <div key={c.label} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-4">
                          <div className="text-lg mb-1">{c.icon}</div>
                          <div className="text-xl font-black" style={{ color: Math.abs(c.value) >= 0.6 ? '#10b981' : Math.abs(c.value) >= 0.3 ? '#f59e0b' : '#64748b' }}>r={c.value}</div>
                          <div className="text-[10px] text-[#64748b] mt-0.5">{c.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Regression Models */}
                    <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
                      <h3 className="text-sm font-bold mb-4">Linear Regression Models (R-squared)</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Questions Solved', r2: behaviorData.regressionModels.questionsSolved.r2 },
                          { label: 'Accuracy', r2: behaviorData.regressionModels.accuracy.r2 },
                          { label: 'Study Streak', r2: behaviorData.regressionModels.studyStreak.r2 },
                          { label: 'Time Spent', r2: behaviorData.regressionModels.timeSpent.r2 },
                        ].map(m => (
                          <div key={m.label} className="text-center">
                            <div className="text-lg font-black" style={{ color: m.r2 >= 0.5 ? '#10b981' : m.r2 >= 0.2 ? '#f59e0b' : '#64748b' }}>{(m.r2 * 100).toFixed(1)}%</div>
                            <div className="text-[10px] text-[#64748b]">{m.label}</div>
                            <div className="w-full h-1.5 bg-[#1e2d45] rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${Math.max(m.r2 * 100, 2)}%`, background: m.r2 >= 0.5 ? '#10b981' : m.r2 >= 0.2 ? '#f59e0b' : '#64748b' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scatter Plots */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      {[
                        { title: 'Questions Solved vs Score', data: behaviorData.scatterData.questionsVsScore, xLabel: 'Questions', color: '#8b5cf6' },
                        { title: 'Accuracy vs Score', data: behaviorData.scatterData.accuracyVsScore, xLabel: 'Accuracy %', color: '#10b981' },
                        { title: 'Study Streak vs Score', data: behaviorData.scatterData.streakVsScore, xLabel: 'Streak (days)', color: '#f59e0b' },
                        { title: 'Time Spent vs Score', data: behaviorData.scatterData.timeVsScore, xLabel: 'Time (min)', color: '#06b6d4' },
                      ].map(chart => (
                        <div key={chart.title} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                          <h3 className="text-sm font-bold mb-4">{chart.title}</h3>
                          <ResponsiveContainer width="100%" height={220}>
                            <ScatterChart>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                              <XAxis dataKey="x" name={chart.xLabel} tick={{ fill: '#64748b', fontSize: 10 }} />
                              <YAxis dataKey="y" name="Score" tick={{ fill: '#64748b', fontSize: 10 }} />
                              <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                              <Scatter data={chart.data} fill={chart.color} />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      ))}
                    </div>

                    {/* Daily Activity Trend */}
                    {behaviorData.dailyActivity.length > 0 && (
                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                        <h3 className="text-sm font-bold mb-4">Activity Trend (Last 30 Days)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={behaviorData.dailyActivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.slice(5)} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                            <Line type="monotone" dataKey="attempts" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Attempts" />
                            <Line type="monotone" dataKey="uniqueUsers" stroke="#06b6d4" strokeWidth={2} dot={false} name="Active Users" />
                            <Legend />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {behaviorData.sampleSize === 0 && (
                      <div className="text-center py-20"><div className="text-5xl mb-4">🧠</div><h3 className="text-xl font-black mb-2">No Behavior Data</h3><p className="text-[#64748b] text-sm">Data will appear as students engage with quizzes.</p></div>
                    )}
                  </div>
                )}

                {/* ─── AT-RISK ─── */}
                {activeTab === 'at-risk' && atRiskData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">At-Risk Student Detection</h1>
                      <p className="text-[#64748b] text-sm mt-1">Automatically identified students who may need additional support ({atRiskData.total} students flagged)</p>
                    </div>

                    {/* Risk Summary */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { level: 'High', color: '#ef4444', count: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'High').length },
                        { level: 'Medium', color: '#f59e0b', count: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Medium').length },
                        { level: 'Low', color: '#10b981', count: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Low').length },
                      ].map(r => (
                        <div key={r.level} className="bg-[#111827] border rounded-2xl p-4 text-center" style={{ borderColor: `${r.color}30` }}>
                          <div className="text-3xl font-black" style={{ color: r.color }}>{r.count}</div>
                          <div className="text-xs font-bold mt-1" style={{ color: r.color }}>{r.level} Risk</div>
                        </div>
                      ))}
                    </div>

                    {/* Risk Distribution Pie */}
                    {atRiskData.total > 0 && (
                      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
                        <h3 className="text-sm font-bold mb-4">Risk Level Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'High Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                                { name: 'Medium Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                                { name: 'Low Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                              ].filter(d => d.value > 0)}
                              dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                            >
                              {[
                                { name: 'High Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'High').length, fill: '#ef4444' },
                                { name: 'Medium Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Medium').length, fill: '#f59e0b' },
                                { name: 'Low Risk', value: atRiskData.atRiskStudents.filter(s => s.riskLevel === 'Low').length, fill: '#10b981' },
                              ].filter(d => d.value > 0).map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* At-Risk Student Cards */}
                    <div className="space-y-3">
                      {atRiskData.atRiskStudents.map(s => (
                        <div key={s.userId} className="bg-[#111827] border rounded-2xl p-5" style={{ borderColor: `${RISK_COLORS[s.riskLevel]}30` }}>
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="font-bold text-sm">{s.userName}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${RISK_COLORS[s.riskLevel]}20`, color: RISK_COLORS[s.riskLevel], border: `1px solid ${RISK_COLORS[s.riskLevel]}40` }}>{s.riskLevel} Risk</span>
                                <span className="text-xs font-black" style={{ color: RISK_COLORS[s.riskLevel] }}>Score: {s.riskScore}/100</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                                <div><span className="text-[#64748b]">Accuracy:</span> <span className="font-bold" style={{ color: s.avgAccuracy < 60 ? '#ef4444' : '#94a3b8' }}>{s.avgAccuracy}%</span></div>
                                <div><span className="text-[#64748b]">Attempts:</span> <span className="font-bold">{s.totalAttempts}</span></div>
                                <div><span className="text-[#64748b]">Streak:</span> <span className="font-bold">{s.studyStreak}d</span></div>
                                <div><span className="text-[#64748b]">Avg Score:</span> <span className="font-bold">{s.avgScore}%</span></div>
                              </div>
                              {/* Risk factors */}
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {s.riskFactors.lowAccuracy && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Low Accuracy</span>}
                                {s.riskFactors.lowActivity && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">Low Activity</span>}
                                {s.riskFactors.lowStreak && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">Low Streak</span>}
                                {s.riskFactors.lowCompletion && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Low Completion</span>}
                                {s.riskFactors.decliningTrend && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">Declining Trend</span>}
                              </div>
                              <div className="bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.15)] rounded-lg p-2.5">
                                <p className="text-xs text-[#93c5fd]">{s.recommendedAction}</p>
                              </div>
                            </div>
                            {/* Risk score gauge */}
                            <div className="shrink-0 w-16 h-16 relative">
                              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d45" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={RISK_COLORS[s.riskLevel]} strokeWidth="3" strokeDasharray={`${s.riskScore}, 100`} strokeLinecap="round" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: RISK_COLORS[s.riskLevel] }}>{s.riskScore}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {atRiskData.total === 0 && (
                      <div className="text-center py-20"><div className="text-5xl mb-4">✅</div><h3 className="text-xl font-black mb-2">No At-Risk Students</h3><p className="text-[#64748b] text-sm">All students are performing well. Keep monitoring!</p></div>
                    )}
                  </div>
                )}

                {/* ─── READINESS ─── */}
                {activeTab === 'readiness' && readinessData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Exam Readiness System</h1>
                      <p className="text-[#64748b] text-sm mt-1">Predicted exam performance based on learning behavior and performance metrics</p>
                    </div>

                    <div className="space-y-3">
                      {readinessData.readinessData.map((s, i) => (
                        <div key={s.userId} className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 hover:border-[#2d3f5e] transition-colors">
                          <div className="flex items-center gap-4 mb-4">
                            {/* Readiness Ring */}
                            <div className="shrink-0 w-20 h-20 relative">
                              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e2d45" strokeWidth="2.5" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={s.readinessScore >= 80 ? '#10b981' : s.readinessScore >= 60 ? '#8b5cf6' : s.readinessScore >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="2.5" strokeDasharray={`${s.readinessScore}, 100`} strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-black">{s.readinessScore}%</span>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{s.userName}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold" style={{
                                  background: s.trend === 'improving' ? 'rgba(16,185,129,0.1)' : s.trend === 'declining' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                                  color: TREND_COLORS[s.trend],
                                  border: `1px solid ${TREND_COLORS[s.trend]}40`,
                                }}>{s.trend}</span>
                              </div>
                              <p className="text-xs text-[#94a3b8]">
                                Based on current performance, expected exam score is between <strong className="text-[#8b5cf6]">{s.predictedRange.low}%</strong> and <strong className="text-[#8b5cf6]">{s.predictedRange.high}%</strong>.
                              </p>
                            </div>
                          </div>

                          {/* Breakdown */}
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { label: 'Accuracy', value: s.breakdown.accuracy, max: 35 },
                              { label: 'Consistency', value: s.breakdown.consistency, max: 25 },
                              { label: 'Activity', value: s.breakdown.activity, max: 20 },
                              { label: 'Subjects', value: s.breakdown.subjectCoverage, max: 10 },
                              { label: 'History', value: s.breakdown.historical, max: 10 },
                            ].map(b => (
                              <div key={b.label} className="text-center">
                                <div className="w-full h-1.5 bg-[#1e2d45] rounded-full overflow-hidden mb-1">
                                  <div className="h-full bg-[#8b5cf6] rounded-full transition-all" style={{ width: `${(b.value / b.max) * 100}%` }} />
                                </div>
                                <div className="text-[10px] text-[#64748b]">{b.label}</div>
                                <div className="text-[10px] font-bold">{b.value.toFixed(1)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {readinessData.readinessData.length === 0 && (
                      <div className="text-center py-20"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-black mb-2">No Readiness Data</h3><p className="text-[#64748b] text-sm">Data will appear as students take quizzes.</p></div>
                    )}
                  </div>
                )}

                {/* ─── PREDICTIONS ─── */}
                {activeTab === 'predictions' && predictionsData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Machine Learning Predictions</h1>
                      <p className="text-[#64748b] text-sm mt-1">Comparing Linear Regression, Decision Tree, and Random Forest models</p>
                    </div>

                    {predictionsData.message ? (
                      <div className="text-center py-20"><div className="text-5xl mb-4">🤖</div><h3 className="text-xl font-black mb-2">Insufficient Data</h3><p className="text-[#64748b] text-sm">{predictionsData.message}</p></div>
                    ) : (
                      <>
                        {/* Model Comparison */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                            <h3 className="text-sm font-bold mb-4">Error Metrics (Lower is Better)</h3>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={[
                                { model: 'Linear Reg', MAE: predictionsData.comparison.mae.linearRegression, RMSE: predictionsData.comparison.rmse.linearRegression },
                                { model: 'Decision Tree', MAE: predictionsData.comparison.mae.decisionTree, RMSE: predictionsData.comparison.rmse.decisionTree },
                                { model: 'Random Forest', MAE: predictionsData.comparison.mae.randomForest, RMSE: predictionsData.comparison.rmse.randomForest },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                                <Bar dataKey="MAE" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="RMSE" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Legend />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                            <h3 className="text-sm font-bold mb-4">Classification Metrics</h3>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={[
                                { model: 'Linear Reg', Accuracy: predictionsData.comparison.accuracy.linearRegression, Precision: predictionsData.comparison.precision.linearRegression, Recall: predictionsData.comparison.recall.linearRegression, F1: predictionsData.comparison.f1.linearRegression },
                                { model: 'Decision Tree', Accuracy: predictionsData.comparison.accuracy.decisionTree, Precision: predictionsData.comparison.precision.decisionTree, Recall: predictionsData.comparison.recall.decisionTree, F1: predictionsData.comparison.f1.decisionTree },
                                { model: 'Random Forest', Accuracy: predictionsData.comparison.accuracy.randomForest, Precision: predictionsData.comparison.precision.randomForest, Recall: predictionsData.comparison.recall.randomForest, F1: predictionsData.comparison.f1.randomForest },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                                <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 1]} />
                                <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                                <Bar dataKey="Accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="F1" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                <Legend />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* R-Squared Comparison */}
                        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
                          <h3 className="text-sm font-bold mb-4">R-squared (Variance Explained)</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { model: 'Linear Regression', r2: predictionsData.comparison.r2.linearRegression },
                              { model: 'Decision Tree', r2: predictionsData.comparison.r2.decisionTree },
                              { model: 'Random Forest', r2: predictionsData.comparison.r2.randomForest },
                            ].map(m => (
                              <div key={m.model} className="text-center">
                                <div className="text-2xl font-black" style={{ color: m.r2 >= 0.7 ? '#10b981' : m.r2 >= 0.4 ? '#f59e0b' : '#64748b' }}>{(m.r2 * 100).toFixed(1)}%</div>
                                <div className="text-xs text-[#64748b]">{m.model}</div>
                                <div className="w-full h-2 bg-[#1e2d45] rounded-full mt-2 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${Math.max(m.r2 * 100, 2)}%`, background: m.r2 >= 0.7 ? '#10b981' : m.r2 >= 0.4 ? '#f59e0b' : '#64748b' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Per-Student Predictions */}
                        <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
                          <h3 className="text-sm font-bold mb-4">Per-Student Predictions</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-[#64748b] text-xs uppercase tracking-wider">
                                  <th className="text-left py-2 px-3">Student</th>
                                  <th className="text-center py-2 px-3">Actual</th>
                                  <th className="text-center py-2 px-3">Lin Reg</th>
                                  <th className="text-center py-2 px-3">Decision Tree</th>
                                  <th className="text-center py-2 px-3">Random Forest</th>
                                  <th className="text-center py-2 px-3">Pass Prob</th>
                                </tr>
                              </thead>
                              <tbody>
                                {predictionsData.predictions.map((p, i) => (
                                  <tr key={i} className="border-t border-[#1e2d45] hover:bg-[rgba(139,92,246,0.03)]">
                                    <td className="py-2.5 px-3 font-medium">{p.userName}</td>
                                    <td className="text-center py-2.5 px-3 font-bold">{p.actual}%</td>
                                    <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.linearRegression - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.linearRegression}%</td>
                                    <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.decisionTree - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.decisionTree}%</td>
                                    <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.randomForest - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.randomForest}%</td>
                                    <td className="text-center py-2.5 px-3">
                                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: p.passProbability >= 70 ? 'rgba(16,185,129,0.15)' : p.passProbability >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: p.passProbability >= 70 ? '#10b981' : p.passProbability >= 50 ? '#f59e0b' : '#ef4444' }}>{p.passProbability}%</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ─── FINDINGS ─── */}
                {activeTab === 'findings' && findingsData && (
                  <div>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black">Research Findings</h1>
                      <p className="text-[#64748b] text-sm mt-1">AI-generated insights from learning analytics data, suitable for academic research</p>
                    </div>

                    {findingsData.message ? (
                      <div className="text-center py-20"><div className="text-5xl mb-4">💡</div><h3 className="text-xl font-black mb-2">No Data Available</h3><p className="text-[#64748b] text-sm">{findingsData.message}</p></div>
                    ) : (
                      <div className="space-y-4">
                        {findingsData.findings.map((f, i) => (
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

                        {/* Research Applications */}
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
                )}

                {/* ─── FEEDBACK ─── */}
                {activeTab === 'feedback' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h1 className="text-2xl font-black">Feedback Dashboard</h1>
                        <p className="text-[#64748b] text-sm mt-1">View all submitted feedback</p>
                      </div>
                      <button onClick={() => {
                        fetch('/api/feedback', { headers: { 'x-admin-secret': password } })
                          .then(res => res.ok ? res.json() : null)
                          .then(data => { if (data) setFeedbacks(data.feedbacks) })
                          .catch(() => {})
                      }} className="bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:border-[#7c3aed] transition-colors inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                      </button>
                    </div>

                    {/* Feedback Stats */}
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

                    {/* Rating Distribution */}
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

                    {/* Feedback List */}
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

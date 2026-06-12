'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

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

// ─── Lazy-loaded Tab Components ──────────────────────────
const OverviewTab = dynamic(() => import('@/components/admin/OverviewTab'), { ssr: false })
const StudentsTab = dynamic(() => import('@/components/admin/StudentsTab'), { ssr: false })
const SubjectsTab = dynamic(() => import('@/components/admin/SubjectsTab'), { ssr: false })
const QuestionTypesTab = dynamic(() => import('@/components/admin/QuestionTypesTab'), { ssr: false })
const BehaviorTab = dynamic(() => import('@/components/admin/BehaviorTab'), { ssr: false })
const AtRiskTab = dynamic(() => import('@/components/admin/AtRiskTab'), { ssr: false })
const ReadinessTab = dynamic(() => import('@/components/admin/ReadinessTab'), { ssr: false })
const PredictionsTab = dynamic(() => import('@/components/admin/PredictionsTab'), { ssr: false })
const FindingsTab = dynamic(() => import('@/components/admin/FindingsTab'), { ssr: false })
const FeedbackTab = dynamic(() => import('@/components/admin/FeedbackTab'), { ssr: false })

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
      setAnalyticsLoading(true)
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
                {activeTab === 'overview' && <OverviewTab data={overview} studentData={studentData} behaviorData={behaviorData} />}
                {activeTab === 'students' && <StudentsTab data={studentData} />}
                {activeTab === 'subjects' && <SubjectsTab data={subjectData} />}
                {activeTab === 'question-types' && <QuestionTypesTab data={qtData} />}
                {activeTab === 'behavior' && <BehaviorTab data={behaviorData} />}
                {activeTab === 'at-risk' && <AtRiskTab data={atRiskData} />}
                {activeTab === 'readiness' && <ReadinessTab data={readinessData} />}
                {activeTab === 'predictions' && <PredictionsTab data={predictionsData} />}
                {activeTab === 'findings' && <FindingsTab data={findingsData} />}
                {activeTab === 'feedback' && <FeedbackTab feedbacks={feedbacks} password={password} onRefresh={(fbs) => setFeedbacks(fbs)} />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

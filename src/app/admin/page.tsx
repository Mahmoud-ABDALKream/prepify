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

interface QuestionAnalyticsData {
  totalResponses: number
  questions: { questionId: number; subject: string; questionType: string; sectionTitle: string; difficulty: string; bloomTaxonomy: string; totalAttempts: number; correctCount: number; wrongCount: number; successRate: number; uniqueUsers: number }[]
  difficultyBreakdown: { level: string; totalAttempts: number; correctCount: number; successRate: number; uniqueQuestions: number }[]
  bloomBreakdown: { level: string; totalAttempts: number; correctCount: number; successRate: number; uniqueQuestions: number }[]
  hardestQuestions: { questionId: number; subject: string; questionType: string; sectionTitle: string; difficulty: string; bloomTaxonomy: string; totalAttempts: number; correctCount: number; wrongCount: number; successRate: number; uniqueUsers: number }[]
  easiestQuestions: { questionId: number; subject: string; questionType: string; sectionTitle: string; difficulty: string; bloomTaxonomy: string; totalAttempts: number; correctCount: number; wrongCount: number; successRate: number; uniqueUsers: number }[]
  sectionBreakdown: { sectionTitle: string; totalAttempts: number; correctCount: number; successRate: number; uniqueQuestions: number }[]
  bloomDistribution: { subject: string; levels: { level: string; totalAttempts: number; correctCount: number; successRate: number }[] }[]
  message?: string
}

type DashboardTab = 'overview' | 'students' | 'subjects' | 'question-types' | 'question-analytics' | 'behavior' | 'trends' | 'ai-grading' | 'at-risk' | 'readiness' | 'predictions' | 'findings' | 'feedback' | 'questions'

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
const QuestionAnalyticsTab = dynamic(() => import('@/components/admin/QuestionAnalyticsTab'), { ssr: false })
const FeedbackTab = dynamic(() => import('@/components/admin/FeedbackTab'), { ssr: false })
const QuestionsTab = dynamic(() => import('@/components/admin/QuestionsTab'), { ssr: false })
const TrendsTab = dynamic(() => import('@/components/admin/TrendsTab'), { ssr: false })
const AIGradingTab = dynamic(() => import('@/components/admin/AIGradingTab'), { ssr: false })

// ─── Tab metadata (label, group, accent) ───
interface TabMeta { id: DashboardTab; label: string; group: 'engagement' | 'performance' | 'content' | 'system' }
const tabMeta: TabMeta[] = [
  { id: 'overview',           label: 'Overview',      group: 'engagement' },
  { id: 'trends',             label: 'Trends',        group: 'engagement' },
  { id: 'students',           label: 'Students',      group: 'engagement' },
  { id: 'behavior',           label: 'Behavior',      group: 'engagement' },
  { id: 'subjects',           label: 'Subjects',      group: 'performance' },
  { id: 'question-types',     label: 'Q Types',       group: 'performance' },
  { id: 'question-analytics', label: 'Q Analytics',   group: 'performance' },
  { id: 'ai-grading',         label: 'AI Grading',    group: 'performance' },
  { id: 'at-risk',            label: 'At-Risk',       group: 'performance' },
  { id: 'readiness',          label: 'Readiness',     group: 'performance' },
  { id: 'predictions',        label: 'ML Models',     group: 'system' },
  { id: 'findings',           label: 'Findings',      group: 'system' },
  { id: 'feedback',           label: 'Feedback',      group: 'content' },
  { id: 'questions',          label: 'Questions',     group: 'content' },
]

// ─── Sidebar Icons ──────────────────────────────────────
const tabIcons: Record<DashboardTab, JSX.Element> = {
  'overview': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  'students': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5zm0-7v7" /></svg>,
  'subjects': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  'question-types': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  'behavior': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  'at-risk': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  'readiness': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  'predictions': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  'findings': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  'question-analytics': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  'feedback': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  'questions': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  'trends': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  'ai-grading': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
}

// ─── Component ──────────────────────────────────────────
export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
  const [questionAnalyticsData, setQuestionAnalyticsData] = useState<QuestionAnalyticsData | null>(null)
  const [trendsData, setTrendsData] = useState<any | null>(null)
  const [aiGradingData, setAiGradingData] = useState<any | null>(null)
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
            case 'question-analytics': setQuestionAnalyticsData(data); break
            case 'trends': setTrendsData(data); break
            case 'ai-grading': setAiGradingData(data); break
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
      <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <motion.div
          className="relative bg-[#0f1629]/80 backdrop-blur-2xl border border-[#1e2d45]/80 rounded-3xl p-10 sm:p-14 w-full max-w-md shadow-[0_0_80px_rgba(124,58,237,0.08)]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#00d4ff] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(124,58,237,0.4)] relative">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] opacity-20 blur-md -z-10" />
          </div>
          <h1 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">Admin Access</h1>
          <p className="text-[#64748b] text-sm text-center mb-8">Authenticate to access the analytics dashboard</p>
          {authError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 bg-[#ef4444]/10 border border-[#ef4444]/25 text-[#f87171] text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {authError}
            </motion.div>
          )}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="Enter admin password" className="w-full bg-[#080c18]/80 border border-[#1e2d45] rounded-xl px-5 py-3.5 text-sm text-[#e2e8f0] placeholder-[#475569] focus:border-[#7c3aed] focus:outline-none focus:shadow-[0_0_20px_rgba(124,58,237,0.12)] transition-all mb-5" />
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#00d4ff] text-white border-none rounded-xl px-6 py-3.5 font-bold text-sm cursor-pointer hover:opacity-90 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all active:scale-[0.98]">Authenticate</button>
          <a href="/" className="flex items-center justify-center gap-1.5 text-[#64748b] text-sm mt-6 hover:text-[#00d4ff] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </a>
        </motion.div>
      </div>
    )
  }

  // ─── Sidebar Tabs (grouped) ──────────────────────────────
  const tabs = tabMeta
  const tabGroups: { group: string; label: string; items: TabMeta[] }[] = [
    { group: 'engagement', label: 'Engagement',  items: tabMeta.filter(t => t.group === 'engagement') },
    { group: 'performance', label: 'Performance', items: tabMeta.filter(t => t.group === 'performance') },
    { group: 'content',     label: 'Content',     items: tabMeta.filter(t => t.group === 'content') },
    { group: 'system',      label: 'System',      items: tabMeta.filter(t => t.group === 'system') },
  ]

  // ─── Dashboard Render ──────────────────────────
  return (
    <div className="min-h-screen bg-[#060a14] text-[#e2e8f0]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      </div>

      <div className="relative z-1 flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col ${sidebarCollapsed ? 'w-[72px]' : 'w-[250px]'} min-h-screen bg-[#0a0f1e]/90 backdrop-blur-xl border-r border-[#1e2d45]/50 sticky top-0 transition-all duration-300`}>
          {/* Sidebar Header */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-5 pb-6`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] flex items-center justify-center text-white text-sm font-black shadow-[0_0_20px_rgba(124,58,237,0.3)] shrink-0">P</div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-black bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">Prepify</div>
                <div className="text-[9px] text-[#475569] tracking-widest uppercase">Analytics</div>
              </div>
            )}
          </div>

          {/* Nav Items (grouped) */}
          <div className="flex-1 px-3 space-y-3 overflow-y-auto">
            {tabGroups.map(grp => (
              <div key={grp.group}>
                {!sidebarCollapsed && (
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#334155] px-3 mb-1.5 mt-2">{grp.label}</div>
                )}
                <div className="space-y-1">
                  {grp.items.map(tab => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer relative group`}
                      style={{
                        background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))' : 'transparent',
                        border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                        color: activeTab === tab.id ? '#c4b5fd' : '#64748b',
                      }}
                      whileHover={{ x: sidebarCollapsed ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                      title={tab.label}
                    >
                      <span className={`shrink-0 transition-colors ${activeTab === tab.id ? 'text-[#a78bfa]' : 'text-[#475569] group-hover:text-[#94a3b8]'}`}>
                        {tabIcons[tab.id]}
                      </span>
                      {!sidebarCollapsed && tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#7c3aed] to-[#00d4ff]"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className={`p-3 border-t border-[#1e2d45]/50 flex flex-col gap-2`}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#111827]/60 border border-[#1e2d45] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3f5e] transition-all cursor-pointer">
              <svg className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              {!sidebarCollapsed && 'Collapse'}
            </button>
            <button onClick={handleExport} className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 rounded-xl text-xs font-bold bg-[#111827]/60 border border-[#1e2d45] text-[#64748b] hover:border-[#7c3aed]/50 hover:text-[#c4b5fd] transition-all cursor-pointer`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              {!sidebarCollapsed && 'Export CSV'}
            </button>
            <a href="/" className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 rounded-xl text-xs font-bold text-[#475569] hover:text-[#94a3b8] transition-colors`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {!sidebarCollapsed && 'Back to Home'}
            </a>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#060a14]/95 backdrop-blur-2xl border-b border-[#1e2d45]/50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] flex items-center justify-center text-white text-xs font-black">P</div>
              <span className="text-sm font-black bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">Analytics</span>
            </div>
            <a href="/" className="text-[#475569] text-xs hover:text-[#00d4ff] transition-colors">Home</a>
          </div>
          <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))' : 'rgba(255,255,255,0.03)',
                  border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  color: activeTab === tab.id ? '#c4b5fd' : '#64748b',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-6 pb-10 max-w-[1300px] min-w-0">
          {/* Sticky Topbar */}
          <div className="hidden lg:flex sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-2 bg-[#060a14]/85 backdrop-blur-xl border-b border-[#1e2d45]/40 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a78bfa]" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                {tabIcons[activeTab]}
              </div>
              <div>
                <div className="text-sm font-black text-[#e2e8f0] capitalize">
                  {tabs.find(t => t.id === activeTab)?.label ?? activeTab}
                </div>
                <div className="text-[10px] text-[#475569] uppercase tracking-wider">
                  {tabs.find(t => t.id === activeTab)?.group ?? ''}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Force refetch by toggling activeTab state
                  const tab = activeTab
                  setActiveTab(tab)
                  // re-trigger the effect by mutating state
                  setAnalyticsLoading(true)
                  fetch(`/api/analytics/${tab}`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                      setAnalyticsLoading(false)
                      if (!data) return
                      switch (tab) {
                        case 'overview': setOverview(data); break
                        case 'students': setStudentData(data); break
                        case 'subjects': setSubjectData(data); break
                        case 'question-types': setQtData(data); break
                        case 'behavior': setBehaviorData(data); break
                        case 'at-risk': setAtRiskData(data); break
                        case 'readiness': setReadinessData(data); break
                        case 'predictions': setPredictionsData(data); break
                        case 'findings': setFindingsData(data); break
                        case 'question-analytics': setQuestionAnalyticsData(data); break
                        case 'trends': setTrendsData(data); break
                        case 'ai-grading': setAiGradingData(data); break
                      }
                    })
                    .catch(() => setAnalyticsLoading(false))
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/[0.03] border border-white/[0.06] text-[#94a3b8] hover:text-[#c4b5fd] hover:border-[#7c3aed]/40 transition-all"
              >
                <svg className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
              </button>
              <div className="text-[10px] text-[#475569]">
                {new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {analyticsLoading && activeTab !== 'feedback' ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-14 h-14 border-[3px] border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin" />
                  <div className="absolute inset-0 w-14 h-14 border-[3px] border-transparent border-b-[#00d4ff] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                </div>
                <p className="text-[#64748b] text-sm mt-5 font-medium">Analyzing data...</p>
              </motion.div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                {activeTab === 'overview' && <OverviewTab data={overview} studentData={studentData} behaviorData={behaviorData} />}
                {activeTab === 'students' && <StudentsTab data={studentData} />}
                {activeTab === 'subjects' && <SubjectsTab data={subjectData} />}
                {activeTab === 'question-types' && <QuestionTypesTab data={qtData} />}
                {activeTab === 'question-analytics' && <QuestionAnalyticsTab data={questionAnalyticsData} />}
                {activeTab === 'behavior' && <BehaviorTab data={behaviorData} />}
                {activeTab === 'at-risk' && <AtRiskTab data={atRiskData} />}
                {activeTab === 'readiness' && <ReadinessTab data={readinessData} />}
                {activeTab === 'predictions' && <PredictionsTab data={predictionsData} />}
                {activeTab === 'findings' && <FindingsTab data={findingsData} />}
                {activeTab === 'feedback' && <FeedbackTab feedbacks={feedbacks} password={password} onRefresh={(fbs) => setFeedbacks(fbs)} />}
                {activeTab === 'questions' && <QuestionsTab password={password} />}
                {activeTab === 'trends' && <TrendsTab data={trendsData} />}
                {activeTab === 'ai-grading' && <AIGradingTab data={aiGradingData} />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

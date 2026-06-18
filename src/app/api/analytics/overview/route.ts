import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getUserStats } from '@/lib/analytics-utils'
import { daysAgo } from '@/lib/date-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── GET /api/analytics/overview ─────────────────────────────
// Defensive: tolerates missing env / DB errors and returns empty state.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const [attemptsResult, examsResult, usersResult, feedbackCountResult, responsesResult] = await Promise.all([
      supabase.from('QuizAttempt').select('*'),
      supabase.from('ExamResult').select('*'),
      getUserStats().catch(() => new Map()),
      supabase.from('Feedback').select('*', { count: 'exact', head: true }),
      supabase.from('QuestionResponse').select('isCorrect, responseDate, difficulty'),
    ])

    const attempts   = attemptsResult.data   ?? []
    const exams      = examsResult.data      ?? []
    const users      = usersResult           ?? new Map()
    const totalFeedback = feedbackCountResult.count ?? 0
    const responses  = responsesResult.data  ?? []

    const weekAgo = daysAgo(7)
    const activeIds = new Set(attempts.filter(a => new Date(a.attemptDate) >= weekAgo).map(a => a.userId))

    const totalStudents = users.size
    const avgAccuracy = attempts.length > 0
      ? attempts.reduce((s, a) => s + ((Number(a.correctAnswers) || 0) / Math.max(1, Number(a.totalQuestions) || 1)) * 100, 0) / attempts.length
      : 0
    const avgStreak = totalStudents > 0
      ? Array.from(users.values()).reduce((s, u: any) => s + (u.streak || 0), 0) / totalStudents
      : 0
    const passRate = exams.length > 0
      ? (exams.filter(e => e.passFail === 'pass').length / exams.length) * 100
      : 0
    const atRisk = Array.from(users.values()).filter((u: any) => {
      const acc = u.q > 0 ? (u.c / u.q) * 100 : 0
      return acc < 60 || (u.streak <= 1 && u.att < 3)
    }).length

    // ─── Additional metrics ───
    // Today's attempts
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const todayAttempts = attempts.filter(a => new Date(a.attemptDate) >= todayStart).length
    const todayUniqueUsers = new Set(attempts.filter(a => new Date(a.attemptDate) >= todayStart).map(a => a.userId)).size

    // Question response stats
    const totalResponses = responses.length
    const correctResponses = responses.filter(r => r.isCorrect).length
    const responseSuccessRate = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0

    // 7-day response trend (vs previous 7)
    const now = Date.now()
    const dayMs = 86400000
    const recentResp = responses.filter(r => new Date(r.responseDate).getTime() > now - 7 * dayMs)
    const prevResp    = responses.filter(r => {
      const t = new Date(r.responseDate).getTime()
      return t > now - 14 * dayMs && t <= now - 7 * dayMs
    })
    const recentCorrectRate = recentResp.length > 0
      ? recentResp.filter(r => r.isCorrect).length / recentResp.length * 100
      : 0
    const prevCorrectRate = prevResp.length > 0
      ? prevResp.filter(r => r.isCorrect).length / prevResp.length * 100
      : 0
    const accuracyTrend = Math.round((recentCorrectRate - prevCorrectRate) * 10) / 10

    // Avg session time
    const totalTime = attempts.reduce((s, a) => s + (Number(a.timeTaken) || 0), 0)
    const avgSessionTime = attempts.length > 0 ? Math.round(totalTime / attempts.length) : 0

    return NextResponse.json({
      totalStudents, activeStudents: activeIds.size, totalQuizAttempts: attempts.length,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10, avgStudyStreak: Math.round(avgStreak * 10) / 10,
      passRate: Math.round(passRate * 10) / 10, atRiskStudents: atRisk,
      totalFeedback, totalExams: exams.length,
      // New fields
      todayAttempts,
      todayUniqueUsers,
      totalResponses,
      responseSuccessRate: Math.round(responseSuccessRate * 10) / 10,
      accuracyTrend,
      avgSessionTime,
      recentAttempts7: attempts.filter(a => new Date(a.attemptDate).getTime() > now - 7 * dayMs).length,
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    // Return empty state instead of 500
    return NextResponse.json({
      totalStudents: 0, activeStudents: 0, totalQuizAttempts: 0,
      avgAccuracy: 0, avgStudyStreak: 0,
      passRate: 0, atRiskStudents: 0,
      totalFeedback: 0, totalExams: 0,
      todayAttempts: 0, todayUniqueUsers: 0,
      totalResponses: 0, responseSuccessRate: 0,
      accuracyTrend: 0, avgSessionTime: 0,
      recentAttempts7: 0,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getUserStats } from '@/lib/analytics-utils'
import { daysAgo } from '@/lib/date-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const [
      attemptsResult,
      examsResult,
      users,
      feedbackCountResult,
    ] = await Promise.all([
      supabase.from('QuizAttempt').select('*'),
      supabase.from('ExamResult').select('*'),
      getUserStats(),
      supabase.from('Feedback').select('*', { count: 'exact', head: true }),
    ])

    if (attemptsResult.error) {
      console.error('Failed to fetch quiz attempts:', attemptsResult.error)
      return NextResponse.json({ error: 'Failed to compute overview analytics' }, { status: 500 })
    }
    if (examsResult.error) {
      console.error('Failed to fetch exam results:', examsResult.error)
      return NextResponse.json({ error: 'Failed to compute overview analytics' }, { status: 500 })
    }
    if (feedbackCountResult.error) {
      console.error('Failed to count feedback:', feedbackCountResult.error)
      return NextResponse.json({ error: 'Failed to compute overview analytics' }, { status: 500 })
    }

    const attempts = attemptsResult.data
    const exams = examsResult.data
    const totalFeedback = feedbackCountResult.count ?? 0

    const weekAgo = daysAgo(7)
    const activeIds = new Set(attempts.filter(a => new Date(a.attemptDate) >= weekAgo).map(a => a.userId))

    const totalStudents = users.size
    const avgAccuracy = attempts.length > 0 ? attempts.reduce((s, a) => s + (a.correctAnswers / a.totalQuestions) * 100, 0) / attempts.length : 0
    const avgStreak = totalStudents > 0 ? Array.from(users.values()).reduce((s, u) => s + u.streak, 0) / totalStudents : 0
    const passRate = exams.length > 0 ? (exams.filter(e => e.passFail === 'pass').length / exams.length) * 100 : 0
    const atRisk = Array.from(users.values()).filter(u => (u.q > 0 ? (u.c / u.q) * 100 : 0) < 60 || (u.streak <= 1 && u.att < 3)).length

    return NextResponse.json({
      totalStudents, activeStudents: activeIds.size, totalQuizAttempts: attempts.length,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10, avgStudyStreak: Math.round(avgStreak * 10) / 10,
      passRate: Math.round(passRate * 10) / 10, atRiskStudents: atRisk,
      totalFeedback, totalExams: exams.length,
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json({ error: 'Failed to compute overview analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

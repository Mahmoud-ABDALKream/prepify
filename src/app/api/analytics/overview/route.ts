import { prisma } from '@/lib/prisma'
import { getUserStats } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const attempts = await prisma.quizAttempt.findMany()
    const exams = await prisma.examResult.findMany()
    const users = await getUserStats()

    const weekAgo = new Date(Date.now() - 7 * 86400000)
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
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json({ error: 'Failed to compute overview analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

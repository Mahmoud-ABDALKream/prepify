import { prisma } from '@/lib/prisma'
import { getUserStats, pearson } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const attempts = await prisma.quizAttempt.findMany()
    const users = await getUserStats()

    const qtMap = new Map<string, { total: number; correct: number; scores: number[]; users: Set<string> }>()
    for (const a of attempts) {
      const e = qtMap.get(a.questionType)
      if (e) { e.total += a.totalQuestions; e.correct += a.correctAnswers; e.scores.push(a.score); e.users.add(a.userId) }
      else qtMap.set(a.questionType, { total: a.totalQuestions, correct: a.correctAnswers, scores: [a.score], users: new Set([a.userId]) })
    }

    const questionTypes = Array.from(qtMap.entries()).map(([type, d]) => ({
      type, totalQuestions: d.total,
      avgScore: Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10) / 10,
      successRate: Math.round((d.total > 0 ? (d.correct / d.total) * 100 : 0) * 10) / 10,
      totalAttempts: d.scores.length, uniqueUsers: d.users.size,
    }))

    const qtCorrs: { type: string; correlation: number }[] = []
    const usersWithExams = Array.from(users.values()).filter(u => u.exams.length > 0)
    for (const [qtType] of qtMap) {
      const qs: number[] = [], es: number[] = []
      for (const u of usersWithExams) {
        const qt = u.qtypes.get(qtType)
        if (qt && qt.s.length > 0) { qs.push(qt.s.reduce((a, b) => a + b, 0) / qt.s.length); es.push(u.exams.reduce((s, e) => s + e.score, 0) / u.exams.length) }
      }
      qtCorrs.push({ type: qtType, correlation: qs.length >= 3 ? Math.round(pearson(qs, es) * 1000) / 1000 : 0 })
    }
    const predRanking = [...qtCorrs].sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))

    return NextResponse.json({ questionTypes, correlations: qtCorrs, predictiveRanking: predRanking, mostPredictive: predRanking[0] || null })
  } catch (error) {
    console.error('Analytics question-types error:', error)
    return NextResponse.json({ error: 'Failed to compute question type analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

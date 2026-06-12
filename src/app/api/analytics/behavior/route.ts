import { prisma } from '@/lib/prisma'
import { getUserStats, pearson, linReg } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await getUserStats()
    const attempts = await prisma.quizAttempt.findMany()
    const uArr = Array.from(users.values())

    const qs = uArr.map(u => u.q), acc = uArr.map(u => u.q > 0 ? (u.c / u.q) * 100 : 0)
    const st = uArr.map(u => u.streak), tm = uArr.map(u => u.time / 60)
    const es = uArr.map(u => u.exams.length > 0 ? u.exams.reduce((s, e) => s + e.score, 0) / u.exams.length : u.scores.reduce((a, b) => a + b, 0) / u.scores.length)

    const daily: { date: string; attempts: number; uniqueUsers: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      const da = attempts.filter(a => new Date(a.attemptDate).toISOString().split('T')[0] === d)
      daily.push({ date: d, attempts: da.length, uniqueUsers: new Set(da.map(a => a.userId)).size })
    }

    return NextResponse.json({
      correlations: {
        questionsSolvedVsExam: Math.round(pearson(qs, es) * 1000) / 1000,
        accuracyVsExam: Math.round(pearson(acc, es) * 1000) / 1000,
        studyStreakVsExam: Math.round(pearson(st, es) * 1000) / 1000,
        timeSpentVsExam: Math.round(pearson(tm, es) * 1000) / 1000,
      },
      regressionModels: {
        questionsSolved: { ...linReg(qs, es), r2: Math.round(linReg(qs, es).r2 * 1000) / 1000 },
        accuracy: { ...linReg(acc, es), r2: Math.round(linReg(acc, es).r2 * 1000) / 1000 },
        studyStreak: { ...linReg(st, es), r2: Math.round(linReg(st, es).r2 * 1000) / 1000 },
        timeSpent: { ...linReg(tm, es), r2: Math.round(linReg(tm, es).r2 * 1000) / 1000 },
      },
      dailyActivity: daily,
      scatterData: {
        questionsVsScore: qs.map((v, i) => ({ x: v, y: es[i] })),
        accuracyVsScore: acc.map((v, i) => ({ x: Math.round(v * 10) / 10, y: es[i] })),
        streakVsScore: st.map((v, i) => ({ x: v, y: es[i] })),
        timeVsScore: tm.map((v, i) => ({ x: Math.round(v * 10) / 10, y: es[i] })),
      },
      sampleSize: users.size,
    })
  } catch (error) {
    console.error('Analytics behavior error:', error)
    return NextResponse.json({ error: 'Failed to compute behavior analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { getUserStats } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserStats()
    const exams = await prisma.examResult.findMany()

    const students = Array.from(users.values()).map(u => {
      const avgScore = u.scores.reduce((a, b) => a + b, 0) / u.scores.length
      const avgAcc = u.q > 0 ? (u.c / u.q) * 100 : 0
      const examScore = u.exams.length > 0 ? u.exams.reduce((s, e) => s + e.score, 0) / u.exams.length : null
      return { userId: u.id, userName: u.name, totalAttempts: u.att, avgScore: Math.round(avgScore * 10) / 10, avgAccuracy: Math.round(avgAcc * 10) / 10, bestScore: Math.round(u.best * 10) / 10, studyStreak: u.streak, subjectsCount: u.subjs.size, timeSpent: u.time, lastActive: u.last, examScore: examScore !== null ? Math.round(examScore * 10) / 10 : null }
    })

    const mkBuckets = (arr: number[]) => {
      const b = [{ range: '0-20%', count: 0 }, { range: '20-40%', count: 0 }, { range: '40-60%', count: 0 }, { range: '60-80%', count: 0 }, { range: '80-100%', count: 0 }]
      for (const v of arr) { if (v < 20) b[0].count++; else if (v < 40) b[1].count++; else if (v < 60) b[2].count++; else if (v < 80) b[3].count++; else b[4].count++ }
      return b
    }

    const topPerformers = [...students].filter(s => s.totalAttempts >= 3).sort((a, b) => b.avgScore - a.avgScore).slice(0, 10)
    const improvements: { userId: string; userName: string; improvement: number }[] = []
    for (const u of users.values()) {
      if (u.scores.length >= 3) {
        const h = Math.floor(u.scores.length / 2)
        const first = u.scores.slice(0, h).reduce((a, b) => a + b, 0) / h
        const second = u.scores.slice(h).reduce((a, b) => a + b, 0) / (u.scores.length - h)
        improvements.push({ userId: u.id, userName: u.name, improvement: Math.round((second - first) * 10) / 10 })
      }
    }
    improvements.sort((a, b) => b.improvement - a.improvement)

    return NextResponse.json({
      students,
      accuracyDistribution: mkBuckets(students.map(s => s.avgAccuracy)),
      scoreDistribution: mkBuckets(students.map(s => s.avgScore)),
      examScoreDistribution: mkBuckets(exams.map(e => e.examScore)),
      topPerformers,
      mostImproved: improvements.slice(0, 10),
    })
  } catch (error) {
    console.error('Analytics students error:', error)
    return NextResponse.json({ error: 'Failed to compute student analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

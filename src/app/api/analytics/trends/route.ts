import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── GET /api/analytics/trends ───────────────────────────────
// Time-series analytics: daily activity for last 30 days,
// weekly performance, hourly heatmap data, subject trends.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const [attemptsResult, responsesResult] = await Promise.all([
      supabase.from('QuizAttempt').select('subject, score, correctAnswers, totalQuestions, attemptDate, timeTaken, userId'),
      supabase.from('QuestionResponse').select('subject, isCorrect, responseDate, difficulty'),
    ])

    const attempts  = attemptsResult.data  ?? []
    const responses = responsesResult.data ?? []

    const now = new Date()
    const dayMs = 86400000

    // ─── 30-day daily activity ───
    const dailyMap = new Map<string, { date: string; attempts: number; uniqueUsers: Set<string>; correct: number; total: number }>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * dayMs)
      const key = d.toISOString().slice(0, 10)
      dailyMap.set(key, { date: key, attempts: 0, uniqueUsers: new Set(), correct: 0, total: 0 })
    }
    for (const a of attempts) {
      const key = (a.attemptDate ?? '').slice(0, 10)
      const entry = dailyMap.get(key)
      if (entry) {
        entry.attempts++
        if (a.userId) entry.uniqueUsers.add(a.userId)
        entry.correct += Number(a.correctAnswers) || 0
        entry.total += Number(a.totalQuestions) || 0
      }
    }
    const dailyActivity = Array.from(dailyMap.values()).map(d => ({
      date: d.date,
      attempts: d.attempts,
      uniqueUsers: d.uniqueUsers.size,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 1000) / 10 : 0,
    }))

    // ─── Hourly heatmap (when do students study?) ───
    const hourMap = new Array(24).fill(0).map((_, hour) => ({ hour, attempts: 0, uniqueUsers: new Set<string>() }))
    for (const a of attempts) {
      const d = new Date(a.attemptDate)
      const h = d.getHours()
      if (h >= 0 && h < 24) {
        hourMap[h].attempts++
        if (a.userId) hourMap[h].uniqueUsers.add(a.userId)
      }
    }
    const hourlyHeatmap = hourMap.map(h => ({ hour: h.hour, attempts: h.attempts, uniqueUsers: h.uniqueUsers.size }))

    // ─── Per-subject trend (last 7 days vs previous 7) ───
    const subjectTrendMap = new Map<string, { subject: string; recent: number[]; previous: number[] }>()
    for (const a of attempts) {
      const subj = a.subject ?? 'unknown'
      const t = new Date(a.attemptDate).getTime()
      const daysAgo = Math.floor((now.getTime() - t) / dayMs)
      if (daysAgo >= 14) continue
      const entry = subjectTrendMap.get(subj) ?? { subject: subj, recent: new Array(7).fill(0), previous: new Array(7).fill(0) }
      if (daysAgo < 7) entry.recent[6 - daysAgo]++
      else entry.previous[13 - daysAgo]++
      subjectTrendMap.set(subj, entry)
    }
    const subjectTrends = Array.from(subjectTrendMap.values()).map(s => {
      const recentSum = s.recent.reduce((a, b) => a + b, 0)
      const prevSum = s.previous.reduce((a, b) => a + b, 0)
      return {
        subject: s.subject,
        recent7: recentSum,
        previous7: prevSum,
        change: prevSum > 0 ? Math.round(((recentSum - prevSum) / prevSum) * 1000) / 10 : (recentSum > 0 ? 100 : 0),
      }
    })

    // ─── Weekly performance trend ───
    const weekMap = new Map<string, { week: string; attempts: number; scores: number[] }>()
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * dayMs)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      const key = weekStart.toISOString().slice(0, 10)
      weekMap.set(key, { week: key, attempts: 0, scores: [] })
    }
    for (const a of attempts) {
      const d = new Date(a.attemptDate)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay())
      const key = weekStart.toISOString().slice(0, 10)
      const entry = weekMap.get(key)
      if (entry) {
        entry.attempts++
        entry.scores.push(Number(a.score) || 0)
      }
    }
    const weeklyTrend = Array.from(weekMap.values()).map(w => ({
      week: w.week,
      attempts: w.attempts,
      avgScore: w.scores.length ? Math.round(w.scores.reduce((a, b) => a + b, 0) / w.scores.length * 10) / 10 : 0,
    }))

    // ─── Question response trend (success rate over time) ───
    const responseTrendMap = new Map<string, { date: string; correct: number; total: number }>()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * dayMs)
      const key = d.toISOString().slice(0, 10)
      responseTrendMap.set(key, { date: key, correct: 0, total: 0 })
    }
    for (const r of responses) {
      const key = (r.responseDate ?? '').slice(0, 10)
      const entry = responseTrendMap.get(key)
      if (entry) {
        entry.total++
        if (r.isCorrect) entry.correct++
      }
    }
    const responseTrend = Array.from(responseTrendMap.values()).map(r => ({
      date: r.date,
      successRate: r.total > 0 ? Math.round((r.correct / r.total) * 1000) / 10 : 0,
      total: r.total,
    }))

    // ─── Summary ───
    const last7 = dailyActivity.slice(-7)
    const prev7 = dailyActivity.slice(-14, -7)
    const last7Attempts = last7.reduce((s, d) => s + d.attempts, 0)
    const prev7Attempts = prev7.reduce((s, d) => s + d.attempts, 0)
    const growth = prev7Attempts > 0
      ? Math.round(((last7Attempts - prev7Attempts) / prev7Attempts) * 1000) / 10
      : (last7Attempts > 0 ? 100 : 0)

    const peakHour = hourlyHeatmap.reduce((max, h) => h.attempts > max.attempts ? h : max, { hour: 0, attempts: 0, uniqueUsers: 0 })
    const peakDay = dailyActivity.reduce((max, d) => d.attempts > max.attempts ? d : max, { date: '', attempts: 0, uniqueUsers: 0, accuracy: 0 })

    return NextResponse.json({
      dailyActivity,
      hourlyHeatmap,
      subjectTrends,
      weeklyTrend,
      responseTrend,
      summary: {
        last7Attempts,
        prev7Attempts,
        growth,
        peakHour: peakHour.hour,
        peakDay: peakDay.date,
        avgDailyActiveUsers: Math.round(last7.reduce((s, d) => s + d.uniqueUsers, 0) / 7 * 10) / 10,
        totalLast7: last7Attempts,
      },
    })
  } catch (error) {
    console.error('Analytics trends error:', error)
    return NextResponse.json({
      dailyActivity: [],
      hourlyHeatmap: [],
      subjectTrends: [],
      weeklyTrend: [],
      responseTrend: [],
      summary: { last7Attempts: 0, prev7Attempts: 0, growth: 0, peakHour: 0, peakDay: '', avgDailyActiveUsers: 0, totalLast7: 0 },
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

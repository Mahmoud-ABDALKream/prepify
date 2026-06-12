import { getUserStats, pearson } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserStats()
    const uArr = Array.from(users.values())
    if (uArr.length < 3) return NextResponse.json({ matrix: [], labels: [] })

    const vars: Record<string, number[]> = {
      'Questions Solved': uArr.map(u => u.q),
      'Accuracy': uArr.map(u => u.q > 0 ? (u.c / u.q) * 100 : 0),
      'Study Streak': uArr.map(u => u.streak),
      'Avg Score': uArr.map(u => u.scores.reduce((a, b) => a + b, 0) / u.scores.length),
      'Time Spent (min)': uArr.map(u => u.time / 60),
      'Subject Coverage': uArr.map(u => u.subjs.size),
      'Total Attempts': uArr.map(u => u.att),
    }
    const labels = Object.keys(vars)
    const matrix = labels.map(rk => labels.map(ck => Math.round(pearson(vars[rk], vars[ck]) * 1000) / 1000))
    return NextResponse.json({ matrix, labels })
  } catch (error) {
    console.error('Analytics correlations error:', error)
    return NextResponse.json({ error: 'Failed to compute correlations', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

import { getUserStats, consistencyBonus } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = await getUserStats()
    const readinessData = Array.from(users.values()).map(u => {
      const avgAcc = u.q > 0 ? (u.c / u.q) * 100 : 0
      const aw = avgAcc * 0.35, cw = consistencyBonus(u.scores) * 25, actw = Math.min(u.att * 2, 20)
      const scw = Math.min(u.subjs.size * 5, 10), hw = u.best >= 80 ? 10 : u.best >= 60 ? 5 : 0
      const rs = Math.min(Math.round(aw + cw + actw + scw + hw), 100)
      const pl = Math.max(0, Math.round(rs - 4 - (100 - rs) * 0.1))
      const ph = Math.min(100, Math.round(rs + 3 + rs * 0.05))
      let trend: 'improving' | 'stable' | 'declining' = 'stable'
      if (u.scores.length >= 4) {
        const h = Math.floor(u.scores.length / 2)
        const ra = u.scores.slice(h).reduce((a, b) => a + b, 0) / (u.scores.length - h)
        const oa = u.scores.slice(0, h).reduce((a, b) => a + b, 0) / h
        if (ra > oa + 5) trend = 'improving'; else if (ra < oa - 5) trend = 'declining'
      }
      return { userId: u.id, userName: u.name, readinessScore: rs, predictedRange: { low: pl, high: ph }, trend, breakdown: { accuracy: Math.round(aw * 10) / 10, consistency: Math.round(cw * 10) / 10, activity: Math.round(actw * 10) / 10, subjectCoverage: Math.round(scw * 10) / 10, historical: hw } }
    }).sort((a, b) => b.readinessScore - a.readinessScore)

    return NextResponse.json({ readinessData })
  } catch (error) {
    console.error('Analytics readiness error:', error)
    return NextResponse.json({ error: 'Failed to compute readiness analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

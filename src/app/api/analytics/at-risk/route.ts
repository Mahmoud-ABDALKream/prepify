import { getUserStats } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserStats()
    const atRisk = Array.from(users.values()).map(u => {
      const avgAcc = u.q > 0 ? (u.c / u.q) * 100 : 0
      const avgScore = u.scores.reduce((a, b) => a + b, 0) / u.scores.length
      const lowAcc = avgAcc < 60, lowAct = u.att < 3, lowStr = u.streak <= 1, lowComp = avgScore < 50
      const decl = u.scores.length >= 3 && u.scores[u.scores.length - 1] < u.scores[u.scores.length - 3]
      let rs = 0; if (lowAcc) rs += 30; if (lowAct) rs += 25; if (lowStr) rs += 20; if (lowComp) rs += 15; if (decl) rs += 10
      rs = Math.min(rs, 100)
      let rl: 'Low' | 'Medium' | 'High' = 'Low'
      if (rs >= 60) rl = 'High'; else if (rs >= 35) rl = 'Medium'
      let rec = 'Continue current study patterns.'
      if (rl === 'High') rec = 'Immediate intervention recommended: schedule tutoring, provide additional resources, and increase practice frequency.'
      else if (rl === 'Medium') rec = 'Monitor closely: encourage more consistent study habits and provide targeted practice materials.'
      return { userId: u.id, userName: u.name, avgAccuracy: Math.round(avgAcc * 10) / 10, totalAttempts: u.att, studyStreak: u.streak, avgScore: Math.round(avgScore * 10) / 10, riskScore: rs, riskLevel: rl, riskFactors: { lowAccuracy: lowAcc, lowActivity: lowAct, lowStreak: lowStr, lowCompletion: lowComp, decliningTrend: decl }, recommendedAction: rec }
    }).filter(s => s.riskScore >= 25).sort((a, b) => b.riskScore - a.riskScore)

    return NextResponse.json({ atRiskStudents: atRisk, total: atRisk.length })
  } catch (error) {
    console.error('Analytics at-risk error:', error)
    return NextResponse.json({ error: 'Failed to compute at-risk analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

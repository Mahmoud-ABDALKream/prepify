import { prisma } from '@/lib/prisma'
import { getUserStats, pearson } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserStats()
    const attempts = await prisma.quizAttempt.findMany()
    const exams = await prisma.examResult.findMany()
    const findings: { category: string; finding: string; metric: string; impact: 'high' | 'medium' | 'low' }[] = []

    if (users.size === 0) return NextResponse.json({ findings: [], message: 'No data available yet.' })

    const uArr = Array.from(users.values())
    const highStr = uArr.filter(u => u.streak >= 10), lowStr = uArr.filter(u => u.streak < 3)
    if (highStr.length > 0 && lowStr.length > 0) {
      const ha = highStr.reduce((s, u) => s + u.scores.reduce((a, b) => a + b, 0) / u.scores.length, 0) / highStr.length
      const la = lowStr.reduce((s, u) => s + u.scores.reduce((a, b) => a + b, 0) / u.scores.length, 0) / lowStr.length
      const d = Math.round(ha - la)
      findings.push({ category: 'Study Behavior', finding: `Students with study streaks above 10 days score ${d}% higher on average than those with streaks under 3 days.`, metric: `${d}% score difference`, impact: d >= 15 ? 'high' : d >= 8 ? 'medium' : 'low' })
    }

    const scores = uArr.map(u => u.scores.reduce((a, b) => a + b, 0) / u.scores.length)
    const preds = [
      { name: 'Accuracy', corr: Math.abs(pearson(uArr.map(u => u.q > 0 ? (u.c / u.q) * 100 : 0), scores)) },
      { name: 'Questions Solved', corr: Math.abs(pearson(uArr.map(u => u.q), scores)) },
      { name: 'Study Streak', corr: Math.abs(pearson(uArr.map(u => u.streak), scores)) },
    ].sort((a, b) => b.corr - a.corr)
    findings.push({ category: 'Prediction', finding: `${preds[0].name} is the strongest predictor of exam performance (r=${Math.round(preds[0].corr * 100) / 100}), followed by ${preds[1].name} (r=${Math.round(preds[1].corr * 100) / 100}).`, metric: `r=${Math.round(preds[0].corr * 100) / 100}`, impact: preds[0].corr >= 0.7 ? 'high' : preds[0].corr >= 0.4 ? 'medium' : 'low' })

    const sMap = new Map<string, { t: number; c: number }>()
    for (const a of attempts) { const e = sMap.get(a.subject); if (e) { e.t += a.totalQuestions; e.c += a.correctAnswers } else sMap.set(a.subject, { t: a.totalQuestions, c: a.correctAnswers }) }
    if (sMap.size > 0) {
      const sa = Array.from(sMap.entries()).map(([s, d]) => ({ subject: s, acc: d.t > 0 ? (d.c / d.t) * 100 : 0 })).sort((a, b) => a.acc - b.acc)
      findings.push({ category: 'Subject Difficulty', finding: `${sa[0].subject.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} is currently the most difficult subject with an average accuracy of ${Math.round(sa[0].acc)}%.`, metric: `${Math.round(sa[0].acc)}% avg accuracy`, impact: sa[0].acc < 50 ? 'high' : 'medium' })
    }

    const hp = uArr.filter(u => u.att >= 5), lp = uArr.filter(u => u.att < 3)
    if (hp.length > 0 && lp.length > 0) {
      const ha = hp.reduce((s, u) => s + u.scores.reduce((a, b) => a + b, 0) / u.scores.length, 0) / hp.length
      const la = lp.reduce((s, u) => s + u.scores.reduce((a, b) => a + b, 0) / u.scores.length, 0) / lp.length
      findings.push({ category: 'Practice Frequency', finding: `Students who completed 5+ quizzes average ${Math.round(ha)}%, compared to ${Math.round(la)}% for those with fewer than 3 attempts — a ${Math.round(ha - la)}% difference.`, metric: `${Math.round(ha - la)}% gap`, impact: (ha - la) >= 15 ? 'high' : 'medium' })
    }

    if (exams.length > 0) {
      const pr = (exams.filter(e => e.passFail === 'pass').length / exams.length) * 100
      findings.push({ category: 'Exam Results', finding: `The overall exam pass rate is ${Math.round(pr)}%. ${pr < 70 ? 'This suggests a need for curriculum review or additional student support.' : 'This indicates students are generally well-prepared.'}`, metric: `${Math.round(pr)}% pass rate`, impact: pr < 60 ? 'high' : pr < 75 ? 'medium' : 'low' })
    }

    return NextResponse.json({ findings })
  } catch (error) {
    console.error('Analytics findings error:', error)
    return NextResponse.json({ error: 'Failed to compute research findings', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

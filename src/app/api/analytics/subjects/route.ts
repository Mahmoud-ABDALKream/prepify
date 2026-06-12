import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const [attemptsResult, examsResult] = await Promise.all([
      supabase.from('QuizAttempt').select('*'),
      supabase.from('ExamResult').select('*'),
    ])

    if (attemptsResult.error) {
      console.error('Failed to fetch quiz attempts:', attemptsResult.error)
      return NextResponse.json({ error: 'Failed to compute subject analytics' }, { status: 500 })
    }
    if (examsResult.error) {
      console.error('Failed to fetch exam results:', examsResult.error)
      return NextResponse.json({ error: 'Failed to compute subject analytics' }, { status: 500 })
    }

    const attempts = attemptsResult.data
    const exams = examsResult.data

    const sMap = new Map<string, { subject: string; attempts: typeof attempts; exams: typeof exams }>()
    for (const a of attempts) { const e = sMap.get(a.subject); if (e) e.attempts.push(a); else sMap.set(a.subject, { subject: a.subject, attempts: [a], exams: [] }) }
    for (const e of exams) { const s = sMap.get(e.subject); if (s) s.exams.push(e) }

    const subjects = Array.from(sMap.values()).map(s => {
      const tc = s.attempts.reduce((sum, a) => sum + a.correctAnswers, 0)
      const tq = s.attempts.reduce((sum, a) => sum + a.totalQuestions, 0)
      const avgAcc = tq > 0 ? (tc / tq) * 100 : 0
      const avgScore = s.attempts.length > 0 ? s.attempts.reduce((sum, a) => sum + a.score, 0) / s.attempts.length : 0
      const avgExam = s.exams.length > 0 ? s.exams.reduce((sum, e) => sum + e.examScore, 0) / s.exams.length : 0
      const passRate = s.exams.length > 0 ? (s.exams.filter(e => e.passFail === 'pass').length / s.exams.length) * 100 : 0
      return {
        subject: s.subject, totalAttempts: s.attempts.length, uniqueStudents: new Set(s.attempts.map(a => a.userId)).size,
        avgAccuracy: Math.round(avgAcc * 10) / 10, avgScore: Math.round(avgScore * 10) / 10, avgExamScore: Math.round(avgExam * 10) / 10,
        passRate: Math.round(passRate * 10) / 10, difficultyIndex: Math.round((100 - avgAcc) * 10) / 10,
      }
    })

    const sorted = [...subjects]
    const hardest = sorted.length > 0 ? [...sorted].sort((a, b) => b.difficultyIndex - a.difficultyIndex)[0] : null
    const easiest = sorted.length > 0 ? [...sorted].sort((a, b) => a.difficultyIndex - b.difficultyIndex)[0] : null
    const mostStudied = sorted.length > 0 ? [...sorted].sort((a, b) => b.totalAttempts - a.totalAttempts)[0] : null

    return NextResponse.json({ subjects, rankings: { hardestSubject: hardest, easiestSubject: easiest, mostStudiedSubject: mostStudied } })
  } catch (error) {
    console.error('Analytics subjects error:', error)
    return NextResponse.json({ error: 'Failed to compute subject analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

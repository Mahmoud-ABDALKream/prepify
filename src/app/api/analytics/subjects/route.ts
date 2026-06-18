import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── GET /api/analytics/subjects ─────────────────────────────
// Returns per-subject performance + rankings + trends.
// Defensive: tolerates missing/empty data without throwing.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Fetch all data in parallel
    const [attemptsResult, examsResult, responsesResult] = await Promise.all([
      supabase.from('QuizAttempt').select('*'),
      supabase.from('ExamResult').select('*'),
      supabase.from('QuestionResponse').select('subject, isCorrect, difficulty, responseDate'),
    ])

    // Tolerate errors gracefully — return empty state instead of 500
    const attempts  = attemptsResult.data  ?? []
    const exams     = examsResult.data     ?? []
    const responses = responsesResult.data ?? []

    // ─── Build per-subject aggregates ────────────────────────
    interface SubjectAgg {
      subject: string
      attempts: any[]
      exams: any[]
      responses: any[]
    }
    const sMap = new Map<string, SubjectAgg>()

    for (const a of attempts) {
      const subj = a.subject ?? 'unknown'
      const e = sMap.get(subj)
      if (e) e.attempts.push(a)
      else sMap.set(subj, { subject: subj, attempts: [a], exams: [], responses: [] })
    }
    for (const e of exams) {
      const subj = e.subject ?? 'unknown'
      const s = sMap.get(subj)
      if (s) s.exams.push(e)
      else sMap.set(subj, { subject: subj, attempts: [], exams: [e], responses: [] })
    }
    for (const r of responses) {
      const subj = r.subject ?? 'unknown'
      const s = sMap.get(subj)
      if (s) s.responses.push(r)
      else sMap.set(subj, { subject: subj, attempts: [], exams: [], responses: [r] })
    }

    const subjects = Array.from(sMap.values()).map(s => {
      const tc = s.attempts.reduce((sum, a) => sum + (Number(a.correctAnswers) || 0), 0)
      const tq = s.attempts.reduce((sum, a) => sum + (Number(a.totalQuestions) || 0), 0)
      const tt = s.attempts.reduce((sum, a) => sum + (Number(a.timeTaken) || 0), 0)
      const avgAcc = tq > 0 ? (tc / tq) * 100 : 0
      const avgScore = s.attempts.length > 0
        ? s.attempts.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / s.attempts.length
        : 0
      const avgExam = s.exams.length > 0
        ? s.exams.reduce((sum, e) => sum + (Number(e.examScore) || 0), 0) / s.exams.length
        : 0
      const passRate = s.exams.length > 0
        ? (s.exams.filter(e => e.passFail === 'pass').length / s.exams.length) * 100
        : 0
      const avgTime = s.attempts.length > 0 ? tt / s.attempts.length : 0

      // Question-level success rate (from QuestionResponse)
      const rTotal = s.responses.length
      const rCorrect = s.responses.filter(r => r.isCorrect).length
      const questionSuccessRate = rTotal > 0 ? (rCorrect / rTotal) * 100 : 0

      // Difficulty breakdown
      const easy   = s.responses.filter(r => r.difficulty === 'easy')
      const medium = s.responses.filter(r => r.difficulty === 'medium')
      const hard   = s.responses.filter(r => r.difficulty === 'hard')
      const diffBreakdown = {
        easy:   { total: easy.length,   correct: easy.filter(r => r.isCorrect).length,   successRate: easy.length   ? (easy.filter(r => r.isCorrect).length / easy.length)   * 100 : 0 },
        medium: { total: medium.length, correct: medium.filter(r => r.isCorrect).length, successRate: medium.length ? (medium.filter(r => r.isCorrect).length / medium.length) * 100 : 0 },
        hard:   { total: hard.length,   correct: hard.filter(r => r.isCorrect).length,   successRate: hard.length   ? (hard.filter(r => r.isCorrect).length / hard.length)   * 100 : 0 },
      }

      // Trend: last 7 days vs previous 7 days
      const now = Date.now()
      const dayMs = 86400000
      const recent = s.attempts.filter(a => new Date(a.attemptDate).getTime() > now - 7 * dayMs)
      const previous = s.attempts.filter(a => {
        const t = new Date(a.attemptDate).getTime()
        return t > now - 14 * dayMs && t <= now - 7 * dayMs
      })
      const recentAvg  = recent.length  ? recent.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / recent.length  : 0
      const previousAvg = previous.length ? previous.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / previous.length : 0
      const trend = previousAvg > 0 ? recentAvg - previousAvg : (recentAvg > 0 ? recentAvg : 0)

      return {
        subject: s.subject,
        totalAttempts: s.attempts.length,
        uniqueStudents: new Set(s.attempts.map(a => a.userId)).size,
        avgAccuracy:       Math.round(avgAcc * 10) / 10,
        avgScore:          Math.round(avgScore * 10) / 10,
        avgExamScore:      Math.round(avgExam * 10) / 10,
        passRate:          Math.round(passRate * 10) / 10,
        difficultyIndex:   Math.round((100 - avgAcc) * 10) / 10,
        avgTimePerAttempt: Math.round(avgTime),
        questionSuccessRate: Math.round(questionSuccessRate * 10) / 10,
        difficultyBreakdown: diffBreakdown,
        trend: Math.round(trend * 10) / 10,
        recentAttempts: recent.length,
        examResults: s.exams.length,
        gradeDistribution: {
          A: s.exams.filter(e => e.gradeCategory === 'A').length,
          B: s.exams.filter(e => e.gradeCategory === 'B').length,
          C: s.exams.filter(e => e.gradeCategory === 'C').length,
          D: s.exams.filter(e => e.gradeCategory === 'D').length,
          F: s.exams.filter(e => e.gradeCategory === 'F').length,
        },
      }
    })

    const sorted = [...subjects]
    const hardest    = sorted.length > 0 ? [...sorted].sort((a, b) => b.difficultyIndex - a.difficultyIndex)[0] : null
    const easiest    = sorted.length > 0 ? [...sorted].sort((a, b) => a.difficultyIndex - b.difficultyIndex)[0] : null
    const mostStudied = sorted.length > 0 ? [...sorted].sort((a, b) => b.totalAttempts - a.totalAttempts)[0] : null
    const highestPass = sorted.filter(s => s.examResults > 0).sort((a, b) => b.passRate - a.passRate)[0] ?? null
    const mostImproved = sorted.filter(s => s.trend !== 0).sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend))[0] ?? null

    return NextResponse.json({
      subjects,
      rankings: {
        hardestSubject: hardest,
        easiestSubject: easiest,
        mostStudiedSubject: mostStudied,
        highestPassRateSubject: highestPass,
        mostImprovedSubject: mostImproved,
      },
      summary: {
        totalSubjects: subjects.length,
        totalAttempts: subjects.reduce((s, x) => s + x.totalAttempts, 0),
        totalStudents: new Set(attempts.map(a => a.userId)).size,
        avgAccuracyAcrossSubjects: subjects.length
          ? Math.round(subjects.reduce((s, x) => s + x.avgAccuracy, 0) / subjects.length * 10) / 10
          : 0,
      },
    })
  } catch (error) {
    console.error('Analytics subjects error:', error)
    // Return empty state instead of 500 — frontend can handle gracefully
    return NextResponse.json({
      subjects: [],
      rankings: {
        hardestSubject: null,
        easiestSubject: null,
        mostStudiedSubject: null,
        highestPassRateSubject: null,
        mostImprovedSubject: null,
      },
      summary: { totalSubjects: 0, totalAttempts: 0, totalStudents: 0, avgAccuracyAcrossSubjects: 0 },
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

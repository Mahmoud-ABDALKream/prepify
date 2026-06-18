import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── GET /api/analytics/ai-grading ───────────────────────────
// Aggregated stats on AI-graded question responses.
// We treat QuestionResponse records of type='definition' (or any type
// the AI grader handles) as AI-graded. Falls back to empty state
// if no data.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Pull all definition-type responses (the AI-graded ones)
    const { data: responses, error } = await supabase
      .from('QuestionResponse')
      .select('subject, questionType, isCorrect, userAnswer, correctAnswer, difficulty, responseDate, userId')

    if (error) {
      console.error('AI grading analytics error:', error)
    }

    const all = responses ?? []

    // AI-graded = definition / translation / fill / trace / code
    const aiTypes = ['definition', 'translation', 'fill', 'trace', 'code']
    const aiGraded = all.filter(r => aiTypes.includes(r.questionType))
    const mcqGraded = all.filter(r => !aiTypes.includes(r.questionType))

    // ─── Top-level stats ───
    const aiCorrect = aiGraded.filter(r => r.isCorrect).length
    const aiTotal = aiGraded.length
    const aiSuccessRate = aiTotal > 0 ? Math.round((aiCorrect / aiTotal) * 1000) / 10 : 0
    const mcqCorrect = mcqGraded.filter(r => r.isCorrect).length
    const mcqTotal = mcqGraded.length
    const mcqSuccessRate = mcqTotal > 0 ? Math.round((mcqCorrect / mcqTotal) * 1000) / 10 : 0

    // ─── Per-subject AI grading ───
    const subjMap = new Map<string, { subject: string; total: number; correct: number; users: Set<string> }>()
    for (const r of aiGraded) {
      const subj = r.subject ?? 'unknown'
      const e = subjMap.get(subj) ?? { subject: subj, total: 0, correct: 0, users: new Set<string>() }
      e.total++
      if (r.isCorrect) e.correct++
      if (r.userId) e.users.add(r.userId)
      subjMap.set(subj, e)
    }
    const perSubject = Array.from(subjMap.values()).map(s => ({
      subject: s.subject,
      total: s.total,
      correct: s.correct,
      successRate: s.total > 0 ? Math.round((s.correct / s.total) * 1000) / 10 : 0,
      uniqueUsers: s.users.size,
    }))

    // ─── Per-question-type AI grading ───
    const typeMap = new Map<string, { type: string; total: number; correct: number }>()
    for (const r of aiGraded) {
      const t = r.questionType ?? 'unknown'
      const e = typeMap.get(t) ?? { type: t, total: 0, correct: 0 }
      e.total++
      if (r.isCorrect) e.correct++
      typeMap.set(t, e)
    }
    const perType = Array.from(typeMap.values()).map(t => ({
      type: t.type,
      total: t.total,
      correct: t.correct,
      successRate: t.total > 0 ? Math.round((t.correct / t.total) * 1000) / 10 : 0,
    }))

    // ─── 14-day trend ───
    const now = Date.now()
    const dayMs = 86400000
    const trendMap = new Map<string, { date: string; total: number; correct: number }>()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * dayMs)
      const key = d.toISOString().slice(0, 10)
      trendMap.set(key, { date: key, total: 0, correct: 0 })
    }
    for (const r of aiGraded) {
      const key = (r.responseDate ?? '').slice(0, 10)
      const entry = trendMap.get(key)
      if (entry) {
        entry.total++
        if (r.isCorrect) entry.correct++
      }
    }
    const trend = Array.from(trendMap.values()).map(t => ({
      date: t.date,
      successRate: t.total > 0 ? Math.round((t.correct / t.total) * 1000) / 10 : 0,
      total: t.total,
    }))

    // ─── Per-difficulty ───
    const diffMap = new Map<string, { difficulty: string; total: number; correct: number }>()
    for (const r of aiGraded) {
      const d = r.difficulty ?? 'unknown'
      const e = diffMap.get(d) ?? { difficulty: d, total: 0, correct: 0 }
      e.total++
      if (r.isCorrect) e.correct++
      diffMap.set(d, e)
    }
    const perDifficulty = Array.from(diffMap.values()).map(d => ({
      difficulty: d.difficulty,
      total: d.total,
      correct: d.correct,
      successRate: d.total > 0 ? Math.round((d.correct / d.total) * 1000) / 10 : 0,
    }))

    // ─── Avg answer length (proxy for effort) ───
    const aiWithAnswer = aiGraded.filter(r => r.userAnswer && typeof r.userAnswer === 'string')
    const avgAnswerLength = aiWithAnswer.length > 0
      ? Math.round(aiWithAnswer.reduce((s, r) => s + (r.userAnswer as string).length, 0) / aiWithAnswer.length)
      : 0

    return NextResponse.json({
      summary: {
        aiTotal,
        aiCorrect,
        aiSuccessRate,
        mcqTotal,
        mcqSuccessRate,
        avgAnswerLength,
        aiShareOfAll: all.length > 0 ? Math.round((aiTotal / all.length) * 1000) / 10 : 0,
      },
      perSubject,
      perType,
      perDifficulty,
      trend,
    })
  } catch (error) {
    console.error('AI grading analytics error:', error)
    return NextResponse.json({
      summary: { aiTotal: 0, aiCorrect: 0, aiSuccessRate: 0, mcqTotal: 0, mcqSuccessRate: 0, avgAnswerLength: 0, aiShareOfAll: 0 },
      perSubject: [],
      perType: [],
      perDifficulty: [],
      trend: [],
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

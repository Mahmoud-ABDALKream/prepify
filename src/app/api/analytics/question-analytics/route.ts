import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/analytics/question-analytics — question-level analytics
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data: responses, error } = await supabase
      .from('QuestionResponse')
      .select('*')

    if (error) {
      console.error('Failed to fetch question responses:', error)
      return NextResponse.json({ error: 'Failed to compute question analytics' }, { status: 500 })
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({
        totalResponses: 0,
        questions: [],
        difficultyBreakdown: [],
        bloomBreakdown: [],
        hardestQuestions: [],
        easiestQuestions: [],
        bloomDistribution: [],
        sectionBreakdown: [],
        message: 'No question response data yet. Data will appear after users submit exams with the new tracking.',
      })
    }

    // ─── Per-question analytics ───
    const questionMap = new Map<string, {
      questionId: number
      subject: string
      questionType: string
      sectionTitle: string
      difficulty: string
      bloomTaxonomy: string
      totalAttempts: number
      correctCount: number
      wrongCount: number
      successRate: number
      uniqueUsers: Set<string>
    }>()

    for (const r of responses) {
      const key = `${r.subject}:${r.questionId}`
      const existing = questionMap.get(key)
      if (existing) {
        existing.totalAttempts++
        if (r.isCorrect) existing.correctCount++
        else existing.wrongCount++
        existing.uniqueUsers.add(r.userId)
      } else {
        questionMap.set(key, {
          questionId: r.questionId,
          subject: r.subject,
          questionType: r.questionType,
          sectionTitle: r.sectionTitle,
          difficulty: r.difficulty,
          bloomTaxonomy: r.bloomTaxonomy,
          totalAttempts: 1,
          correctCount: r.isCorrect ? 1 : 0,
          wrongCount: r.isCorrect ? 0 : 1,
          successRate: 0,
          uniqueUsers: new Set([r.userId]),
        })
      }
    }

    // Calculate success rates
    const questions = Array.from(questionMap.values()).map(q => ({
      ...q,
      successRate: Math.round((q.totalAttempts > 0 ? (q.correctCount / q.totalAttempts) * 100 : 0) * 10) / 10,
      uniqueUsers: q.uniqueUsers.size,
    }))

    // ─── Difficulty breakdown ───
    const diffMap = new Map<string, { total: number; correct: number; questions: Set<string> }>()
    for (const q of questions) {
      const d = diffMap.get(q.difficulty) || { total: 0, correct: 0, questions: new Set() }
      d.total += q.totalAttempts
      d.correct += q.correctCount
      d.questions.add(`${q.subject}:${q.questionId}`)
      diffMap.set(q.difficulty, d)
    }
    const difficultyBreakdown = Array.from(diffMap.entries()).map(([level, d]) => ({
      level,
      totalAttempts: d.total,
      correctCount: d.correct,
      successRate: Math.round((d.total > 0 ? (d.correct / d.total) * 100 : 0) * 10) / 10,
      uniqueQuestions: d.questions.size,
    }))

    // ─── Bloom's Taxonomy breakdown ───
    const bloomMap = new Map<string, { total: number; correct: number; questions: Set<string> }>()
    for (const q of questions) {
      const b = bloomMap.get(q.bloomTaxonomy) || { total: 0, correct: 0, questions: new Set() }
      b.total += q.totalAttempts
      b.correct += q.correctCount
      b.questions.add(`${q.subject}:${q.questionId}`)
      bloomMap.set(q.bloomTaxonomy, b)
    }
    const bloomBreakdown = Array.from(bloomMap.entries()).map(([level, b]) => ({
      level,
      totalAttempts: b.total,
      correctCount: b.correct,
      successRate: Math.round((b.total > 0 ? (b.correct / b.total) * 100 : 0) * 10) / 10,
      uniqueQuestions: b.questions.size,
    }))

    // ─── Hardest questions (lowest success rate, min 3 attempts) ───
    const hardestQuestions = [...questions]
      .filter(q => q.totalAttempts >= 3)
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 20)

    // ─── Easiest questions (highest success rate, min 3 attempts) ───
    const easiestQuestions = [...questions]
      .filter(q => q.totalAttempts >= 3)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 20)

    // ─── Section breakdown ───
    const sectionMap = new Map<string, { total: number; correct: number; questions: Set<string> }>()
    for (const q of questions) {
      const s = sectionMap.get(q.sectionTitle) || { total: 0, correct: 0, questions: new Set() }
      s.total += q.totalAttempts
      s.correct += q.correctCount
      s.questions.add(`${q.subject}:${q.questionId}`)
      sectionMap.set(q.sectionTitle, s)
    }
    const sectionBreakdown = Array.from(sectionMap.entries()).map(([title, s]) => ({
      sectionTitle: title,
      totalAttempts: s.total,
      correctCount: s.correct,
      successRate: Math.round((s.total > 0 ? (s.correct / s.total) * 100 : 0) * 10) / 10,
      uniqueQuestions: s.questions.size,
    }))

    // ─── Bloom distribution by subject ───
    const subjectBloomMap = new Map<string, Map<string, { total: number; correct: number }>>()
    for (const r of responses) {
      const bm = subjectBloomMap.get(r.subject) || new Map()
      const b = bm.get(r.bloomTaxonomy) || { total: 0, correct: 0 }
      b.total++
      if (r.isCorrect) b.correct++
      bm.set(r.bloomTaxonomy, b)
      subjectBloomMap.set(r.subject, bm)
    }
    const bloomDistribution = Array.from(subjectBloomMap.entries()).map(([subject, bm]) => ({
      subject,
      levels: Array.from(bm.entries()).map(([level, d]) => ({
        level,
        totalAttempts: d.total,
        correctCount: d.correct,
        successRate: Math.round((d.total > 0 ? (d.correct / d.total) * 100 : 0) * 10) / 10,
      })),
    }))

    return NextResponse.json({
      totalResponses: responses.length,
      questions,
      difficultyBreakdown,
      bloomBreakdown,
      hardestQuestions,
      easiestQuestions,
      sectionBreakdown,
      bloomDistribution,
    })
  } catch (error) {
    console.error('Analytics question-analytics error:', error)
    return NextResponse.json({ error: 'Failed to compute question analytics', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

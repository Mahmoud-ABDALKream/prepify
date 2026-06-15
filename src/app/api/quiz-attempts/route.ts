import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Helper: calculate grade category from score (0-100)
function getGradeCategory(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

// POST /api/quiz-attempts — submit a quiz attempt
// Also creates an ExamResult record for analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, subject, quizId, score, correctAnswers, wrongAnswers, totalQuestions, timeTaken, questionType } = body

    // Validation
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
      return NextResponse.json({ error: 'User name is required' }, { status: 400 })
    }
    if (!subject || typeof subject !== 'string') {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }
    if (!quizId || typeof quizId !== 'string') {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: 'Score must be between 0 and 100' }, { status: 400 })
    }
    if (typeof correctAnswers !== 'number' || correctAnswers < 0) {
      return NextResponse.json({ error: 'Correct answers must be a non-negative number' }, { status: 400 })
    }
    if (typeof wrongAnswers !== 'number' || wrongAnswers < 0) {
      return NextResponse.json({ error: 'Wrong answers must be a non-negative number' }, { status: 400 })
    }
    if (typeof totalQuestions !== 'number' || totalQuestions < 1) {
      return NextResponse.json({ error: 'Total questions must be at least 1' }, { status: 400 })
    }
    if (typeof timeTaken !== 'number' || timeTaken < 0) {
      return NextResponse.json({ error: 'Time taken must be a non-negative number' }, { status: 400 })
    }

    const validQuestionTypes = ['multiple-choice', 'true-false', 'problem-solving', 'coding', 'practical']
    const finalQuestionType = validQuestionTypes.includes(questionType) ? questionType : 'multiple-choice'

    const supabase = getSupabaseAdmin()

    // Insert into QuizAttempt
    const { data: attempt, error: attemptError } = await supabase
      .from('QuizAttempt')
      .insert({
        userId: userId.trim(),
        userName: userName.trim(),
        subject,
        quizId,
        score,
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        timeTaken,
        questionType: finalQuestionType,
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Failed to submit quiz attempt:', attemptError)
      return NextResponse.json({ error: 'Failed to submit quiz attempt' }, { status: 500 })
    }

    // Also insert into ExamResult for analytics (pass/fail, grade category)
    const passFail = score >= 60 ? 'pass' : 'fail'
    const gradeCategory = getGradeCategory(score)

    const { error: examError } = await supabase
      .from('ExamResult')
      .insert({
        userId: userId.trim(),
        userName: userName.trim(),
        subject,
        examScore: score,
        passFail,
        gradeCategory,
      })

    if (examError) {
      // Log but don't fail the request — the quiz attempt was saved successfully
      console.error('Failed to save exam result (non-critical):', examError)
    }

    return NextResponse.json({ attempt, examSaved: !examError }, { status: 201 })
  } catch (error) {
    console.error('Failed to submit quiz attempt:', error)
    return NextResponse.json({ error: 'Failed to submit quiz attempt' }, { status: 500 })
  }
}

// GET /api/quiz-attempts — retrieve attempts (filter by userId, subject, quizId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const subject = searchParams.get('subject')
    const quizId = searchParams.get('quizId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = getSupabaseAdmin()

    // Build query with filters
    let query = supabase
      .from('QuizAttempt')
      .select('*', { count: 'exact' })
      .order('attemptDate', { ascending: false })
      .range(offset, offset + Math.min(limit, 100) - 1)

    if (userId) query = query.eq('userId', userId)
    if (subject) query = query.eq('subject', subject)
    if (quizId) query = query.eq('quizId', quizId)

    const { data: attempts, count: total, error } = await query

    if (error) {
      console.error('Failed to fetch quiz attempts:', error)
      return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 })
    }

    return NextResponse.json({ attempts, total: total ?? 0 })
  } catch (error) {
    console.error('Failed to fetch quiz attempts:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/quiz-attempts — submit a quiz attempt
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

    const attempt = await prisma.quizAttempt.create({
      data: {
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
      },
    })

    return NextResponse.json({ attempt }, { status: 201 })
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

    const where: Record<string, string> = {}
    if (userId) where.userId = userId
    if (subject) where.subject = subject
    if (quizId) where.quizId = quizId

    const attempts = await prisma.quizAttempt.findMany({
      where,
      orderBy: { attemptDate: 'desc' },
      take: Math.min(limit, 100),
      skip: offset,
    })

    const total = await prisma.quizAttempt.count({ where })

    return NextResponse.json({ attempts, total })
  } catch (error) {
    console.error('Failed to fetch quiz attempts:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 })
  }
}

import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/leaderboard — get leaderboard data
// Query params: type=global|subject|quiz, subject=?, quizId=?
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global' // global, subject, quiz
    const subject = searchParams.get('subject')
    const quizId = searchParams.get('quizId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (type === 'global') {
      return await getGlobalLeaderboard(limit)
    } else if (type === 'subject' && subject) {
      return await getSubjectLeaderboard(subject, limit)
    } else if (type === 'quiz' && quizId) {
      return await getQuizLeaderboard(quizId, limit)
    } else {
      return NextResponse.json({ error: 'Invalid parameters. Use type=global, type=subject&subject=..., or type=quiz&quizId=...' }, { status: 400 })
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

async function getGlobalLeaderboard(limit: number) {
  // Get all attempts
  const supabase = getSupabaseAdmin()
  const { data: allAttempts, error } = await supabase.from('QuizAttempt').select('*')

  if (error) {
    console.error('Failed to fetch attempts for global leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }

  // Aggregate by user
  const userMap = new Map<string, {
    userId: string
    userName: string
    totalAttempts: number
    totalScore: number
    totalCorrect: number
    totalQuestions: number
    subjects: Set<string>
    bestScores: number[]
  }>()

  for (const a of allAttempts ?? []) {
    const existing = userMap.get(a.userId)
    if (existing) {
      existing.totalAttempts += 1
      existing.totalScore += a.score
      existing.totalCorrect += a.correctAnswers
      existing.totalQuestions += a.totalQuestions
      existing.subjects.add(a.subject)
      existing.bestScores.push(a.score)
    } else {
      userMap.set(a.userId, {
        userId: a.userId,
        userName: a.userName,
        totalAttempts: 1,
        totalScore: a.score,
        totalCorrect: a.correctAnswers,
        totalQuestions: a.totalQuestions,
        subjects: new Set([a.subject]),
        bestScores: [a.score],
      })
    }
  }

  // Calculate composite score: exam count * 15 + avg score * 0.5 + readiness bonus
  const leaderboard = Array.from(userMap.values()).map(user => {
    const avgScore = user.totalScore / user.totalAttempts
    const overallAccuracy = user.totalQuestions > 0 ? (user.totalCorrect / user.totalQuestions) * 100 : 0
    const subjectDiversity = user.subjects.size

    // Exam Readiness Score: weighted combination
    // 40% average score + 30% consistency (std dev bonus) + 20% exam count + 10% subject diversity
    const consistencyBonus = calculateConsistencyBonus(user.bestScores)
    const examCountBonus = Math.min(user.totalAttempts * 2, 20) // max 20 points
    const diversityBonus = Math.min(subjectDiversity * 5, 10) // max 10 points
    const readinessScore = Math.round(Math.min(avgScore * 0.4 + consistencyBonus * 30 + examCountBonus + diversityBonus, 100))

    // Predicted score range
    const predictedLow = Math.max(0, Math.round(readinessScore - 4 - (100 - readinessScore) * 0.1))
    const predictedHigh = Math.min(100, Math.round(readinessScore + 3 + readinessScore * 0.05))

    return {
      userId: user.userId,
      userName: user.userName,
      totalAttempts: user.totalAttempts,
      avgScore: Math.round(avgScore * 10) / 10,
      overallAccuracy: Math.round(overallAccuracy * 10) / 10,
      subjectsCount: subjectDiversity,
      readinessScore,
      predictedRange: { low: predictedLow, high: predictedHigh },
    }
  })

  // Sort by: total attempts DESC, then avg score DESC (priority to more exams)
  leaderboard.sort((a, b) => {
    if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts
    if (b.readinessScore !== a.readinessScore) return b.readinessScore - a.readinessScore
    return b.avgScore - a.avgScore
  })

  // Add rank
  const ranked = leaderboard.slice(0, limit).map((entry, i) => ({
    rank: i + 1,
    ...entry,
  }))

  return NextResponse.json({ leaderboard: ranked, type: 'global' })
}

async function getSubjectLeaderboard(subject: string, limit: number) {
  const supabase = getSupabaseAdmin()
  const { data: attempts, error } = await supabase
    .from('QuizAttempt')
    .select('*')
    .eq('subject', subject)
    .order('score', { ascending: false })

  if (error) {
    console.error('Failed to fetch attempts for subject leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }

  // Best attempt per user
  const userBest = new Map<string, {
    userId: string
    userName: string
    bestScore: number
    totalAttempts: number
    avgScore: number
    totalCorrect: number
    totalQuestions: number
    scores: number[]
  }>()

  for (const a of attempts ?? []) {
    const existing = userBest.get(a.userId)
    if (existing) {
      existing.totalAttempts += 1
      existing.avgScore += a.score
      existing.totalCorrect += a.correctAnswers
      existing.totalQuestions += a.totalQuestions
      existing.scores.push(a.score)
      if (a.score > existing.bestScore) existing.bestScore = a.score
    } else {
      userBest.set(a.userId, {
        userId: a.userId,
        userName: a.userName,
        bestScore: a.score,
        totalAttempts: 1,
        avgScore: a.score,
        totalCorrect: a.correctAnswers,
        totalQuestions: a.totalQuestions,
        scores: [a.score],
      })
    }
  }

  const leaderboard = Array.from(userBest.values()).map(user => {
    const avgScore = user.avgScore / user.totalAttempts
    const accuracy = user.totalQuestions > 0 ? (user.totalCorrect / user.totalQuestions) * 100 : 0
    const consistencyBonus = calculateConsistencyBonus(user.scores)
    const examCountBonus = Math.min(user.totalAttempts * 3, 15)
    const readinessScore = Math.round(Math.min(avgScore * 0.45 + consistencyBonus * 25 + examCountBonus + 10, 100))
    const predictedLow = Math.max(0, Math.round(readinessScore - 4 - (100 - readinessScore) * 0.1))
    const predictedHigh = Math.min(100, Math.round(readinessScore + 3 + readinessScore * 0.05))

    return {
      userId: user.userId,
      userName: user.userName,
      bestScore: Math.round(user.bestScore * 10) / 10,
      totalAttempts: user.totalAttempts,
      avgScore: Math.round(avgScore * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
      readinessScore,
      predictedRange: { low: predictedLow, high: predictedHigh },
    }
  })

  // Sort by total attempts first, then readiness score
  leaderboard.sort((a, b) => {
    if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts
    if (b.readinessScore !== a.readinessScore) return b.readinessScore - a.readinessScore
    return b.bestScore - a.bestScore
  })

  const ranked = leaderboard.slice(0, limit).map((entry, i) => ({
    rank: i + 1,
    ...entry,
  }))

  return NextResponse.json({ leaderboard: ranked, type: 'subject', subject })
}

async function getQuizLeaderboard(quizId: string, limit: number) {
  const supabase = getSupabaseAdmin()
  const { data: attempts, error } = await supabase
    .from('QuizAttempt')
    .select('*')
    .eq('quizId', quizId)
    .order('score', { ascending: false })

  if (error) {
    console.error('Failed to fetch attempts for quiz leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }

  // Best attempt per user
  const userBest = new Map<string, {
    userId: string
    userName: string
    bestScore: number
    bestTime: number
    totalAttempts: number
    scores: number[]
  }>()

  for (const a of attempts ?? []) {
    const existing = userBest.get(a.userId)
    if (existing) {
      existing.totalAttempts += 1
      existing.scores.push(a.score)
      if (a.score > existing.bestScore) {
        existing.bestScore = a.score
        existing.bestTime = a.timeTaken
      }
    } else {
      userBest.set(a.userId, {
        userId: a.userId,
        userName: a.userName,
        bestScore: a.score,
        bestTime: a.timeTaken,
        totalAttempts: 1,
        scores: [a.score],
      })
    }
  }

  const leaderboard = Array.from(userBest.values()).map(user => {
    const avgScore = user.scores.reduce((a, b) => a + b, 0) / user.scores.length
    const consistencyBonus = calculateConsistencyBonus(user.scores)
    const examCountBonus = Math.min(user.totalAttempts * 3, 15)
    const readinessScore = Math.round(Math.min(avgScore * 0.5 + consistencyBonus * 25 + examCountBonus, 100))
    const predictedLow = Math.max(0, Math.round(readinessScore - 4 - (100 - readinessScore) * 0.1))
    const predictedHigh = Math.min(100, Math.round(readinessScore + 3 + readinessScore * 0.05))

    return {
      userId: user.userId,
      userName: user.userName,
      bestScore: Math.round(user.bestScore * 10) / 10,
      bestTime: user.bestTime,
      totalAttempts: user.totalAttempts,
      avgScore: Math.round(avgScore * 10) / 10,
      readinessScore,
      predictedRange: { low: predictedLow, high: predictedHigh },
    }
  })

  leaderboard.sort((a, b) => {
    if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts
    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore
    return b.readinessScore - a.readinessScore
  })

  const ranked = leaderboard.slice(0, limit).map((entry, i) => ({
    rank: i + 1,
    ...entry,
  }))

  return NextResponse.json({ leaderboard: ranked, type: 'quiz', quizId })
}

// Calculate consistency bonus (0-1): lower standard deviation = higher bonus
function calculateConsistencyBonus(scores: number[]): number {
  if (scores.length < 2) return 0.5 // single attempt gets medium bonus
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)
  // Lower std dev = more consistent = higher bonus (max 1, min 0)
  return Math.max(0, Math.min(1, 1 - stdDev / 30))
}
